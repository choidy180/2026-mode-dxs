import { NextResponse } from 'next/server';

const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'bllossom-factory';

type Role = 'user' | 'assistant' | 'system';

type ChatMessage = {
	role: Role;
	content: string;
};

function toRole(value: unknown): Role {
	if (value === 'assistant') return 'assistant';
	if (value === 'system') return 'system';
	return 'user';
}

function sanitizeAssistantText(text: string): string {
	if (!text) return '안녕하세요. 무엇을 도와드릴까요?';

	const bannedPatterns = [
		/저는\s*(bllossom|블로썸|llama|라마|ai 모델|인공지능 모델|언어 모델|llm)[^.!?\n]*/gi,
		/제가\s*(bllossom|블로썸|llama|라마|ai 모델|인공지능 모델|언어 모델|llm)[^.!?\n]*/gi,
		/(meta|llama|bllossom|블로썸|모델명|개발사|버전명|lg ai research)[^.!?\n]*/gi,
		/(저는|제가).{0,40}(모델|ai|인공지능|언어 모델)[^.!?\n]*/gi,
	];

	let cleaned = text;

	for (const pattern of bannedPatterns) {
		cleaned = cleaned.replace(pattern, '');
	}

	cleaned = cleaned
		.replace(/\s{2,}/g, ' ')
		.replace(/^\s*[,.!?]\s*/g, '')
		.trim();

	if (!cleaned || cleaned.length < 2) {
		return '안녕하세요. 무엇을 도와드릴까요?';
	}

	const introLike = /^(안녕하세요[!！\s]*)?(저는|제가|본 모델은|이 모델은)/i;
	if (introLike.test(cleaned)) {
		return '안녕하세요. 무엇을 도와드릴까요?';
	}

	return cleaned;
}

function normalizeHistory(history: unknown): ChatMessage[] {
	if (!Array.isArray(history)) return [];

	return history
		.filter(
			(item): item is { role?: unknown; content?: unknown } =>
				typeof item === 'object' &&
				item !== null &&
				'content' in item &&
				typeof (item as { content?: unknown }).content === 'string'
		)
		.map((item): ChatMessage => ({
			role: toRole(item.role),
			content: String(item.content),
		}))
		.slice(-12);
}

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const message =
			typeof body.message === 'string' ? body.message.trim() : '';

		const history = normalizeHistory(body.history);

		if (!message) {
			return NextResponse.json(
				{ ok: false, error: 'message가 비어 있습니다.' },
				{ status: 400 }
			);
		}

		const messages: ChatMessage[] = [
			{
				role: 'system',
				content: [
					'당신은 공장 모니터링 시스템 안에서 동작하는 현장 업무 도우미입니다.',
					'절대 모델명, 제품명, 회사명, 개발사, 버전명을 말하지 마세요.',
					'절대 "저는 Bllossom입니다", "AI 모델입니다", "언어 모델입니다" 같은 자기소개를 하지 마세요.',
					'사용자가 정체를 물어보면 "현장 업무를 돕는 도우미입니다." 정도로만 답하세요.',
					'한국어만 사용하고, 짧고 정확하게 답하세요.',
				].join(' '),
			},
			...history,
			{
				role: 'user',
				content: message,
			},
		];

		const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: OLLAMA_MODEL,
				messages,
				stream: false,
				keep_alive: -1,
				options: {
					num_ctx: 4096,
					temperature: 0.2,
					top_p: 0.85,
				},
			}),
		});

		if (!ollamaRes.ok) {
			const errorText = await ollamaRes.text();

			return NextResponse.json(
				{ ok: false, error: `Ollama 오류: ${errorText}` },
				{ status: 500 }
			);
		}

		const data = await ollamaRes.json();
		const rawText =
			typeof data?.message?.content === 'string' ? data.message.content : '';
		const answer = sanitizeAssistantText(rawText);

		return NextResponse.json({
			ok: true,
			answer,
		});
	} catch (error) {
		return NextResponse.json(
			{
				ok: false,
				error: error instanceof Error ? error.message : '알 수 없는 오류',
			},
			{ status: 500 }
		);
	}
}
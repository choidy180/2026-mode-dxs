import type { LogType, SystemLog } from '@/types/gasketCheck';

const LOG_TEMPLATES: Array<{
    type: LogType;
    message: string;
    station: string;
}> = [
    {
        type: 'INFO',
        message: '비전 센서 데이터 동기화 완료',
        station: 'VISION-01',
    },
    {
        type: 'SUCCESS',
        message: '필름 부착 위치 보정값 적용 완료',
        station: 'ATTACH-02',
    },
    {
        type: 'SUCCESS',
        message: '적재 트레이 진입 감지 및 카운트 갱신',
        station: 'STACK-01',
    },
    {
        type: 'WARNING',
        message: '필름 롤 장력 변동 감지, 자동 보정 수행',
        station: 'TENSION-01',
    },
    {
        type: 'INFO',
        message: '작업지시번호 기준 생산 수량 동기화',
        station: 'MES-LINK',
    },
    {
        type: 'SUCCESS',
        message: '표면 이물 검사 통과 및 다음 공정 이송',
        station: 'TRANSFER',
    },
    {
        type: 'WARNING',
        message: '가스켓 ROI 주변 미세 기포 후보 감지',
        station: 'ROI-GASKET',
    },
    {
        type: 'ERROR',
        message: '부착 위치 오차 허용 범위 초과, 재검 필요',
        station: 'ATTACH-02',
    },
];

export const createDummyProductionLogs = (count = 48): SystemLog[] => {
    const now = new Date();

    return Array.from({ length: count }, (_, index) => {
        const template = LOG_TEMPLATES[index % LOG_TEMPLATES.length];
        const time = new Date(now.getTime() - index * 4 * 60 * 1000);

        return {
            id: count - index,
            time: time.toLocaleTimeString('ko-KR', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }),
            type: template.type,
            message: template.message,
            station: template.station,
            quantity: 1200 + count - index,
            carrier: `C-${String(2100 + index).padStart(4, '0')}`,
        };
    });
};

export const createNextDummyLog = (id: number): SystemLog => {
    const template = LOG_TEMPLATES[id % LOG_TEMPLATES.length];
    const now = new Date();

    return {
        id,
        time: now.toLocaleTimeString('ko-KR', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }),
        type: template.type,
        message: template.message,
        station: template.station,
        quantity: 1200 + id,
        carrier: `C-${String(2100 + id).padStart(4, '0')}`,
    };
};

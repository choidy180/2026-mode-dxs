import type { AnchorMap, CornerKey, TypeOption } from '@/types/sixPointInspection';

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const DEFAULT_DX_API_BASE_URL = 'http://192.168.2.147:24828';
const DEFAULT_DX_IMAGE_BASE_URL = 'https://gapi.dxsplatform.com';

export const API_BASE_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_DX_API_BASE_URL ||
    process.env.NEXT_PUBLIC_DX_BASE_URL ||
    DEFAULT_DX_API_BASE_URL,
);

export const IMAGE_BASE_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_DX_IMAGE_BASE_URL ||
    process.env.NEXT_PUBLIC_DX_BASE_URL ||
    DEFAULT_DX_IMAGE_BASE_URL,
);

export const INSPECTION_API_URL = `${API_BASE_URL}/api/DX_API000025`;
export const GUIDE_IMAGE_URL = `${IMAGE_BASE_URL}/images/DX_API000102/guide_2.jpg`;
export const HOTSPOT_STORAGE_KEY = 'six-point-inspection-hotspot-anchors-v1';
export const POLLING_INTERVAL_MS = 3000;

export const DX_KNOWN_IMAGE_HOSTS = new Set([
  '192.168.2.147:24828',
  '1.254.24.170:24828',
  'gapi.dxsplatform.com',
]);

export const normalizeInspectionImageUrl = (url?: string | null, cacheKey?: string | number | null) => {
  if (!url) return '';

  let imageUrl = String(url).trim().replace(/\\/g, '/');
  if (!imageUrl) return '';

  if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
    return imageUrl;
  }

  if (/^(images|upload|uploads|files)\//i.test(imageUrl)) {
    imageUrl = `/${imageUrl}`;
  }

  try {
    const parsedUrl = new URL(imageUrl, IMAGE_BASE_URL);
    const isDxsHost = DX_KNOWN_IMAGE_HOSTS.has(parsedUrl.host);
    const normalizedUrl = isDxsHost
      ? `${IMAGE_BASE_URL}${parsedUrl.pathname}${parsedUrl.search}`
      : parsedUrl.href;

    if (!cacheKey) return normalizedUrl;

    const cacheBustedUrl = new URL(normalizedUrl);
    cacheBustedUrl.searchParams.set('_dxv', String(cacheKey));
    return cacheBustedUrl.href;
  } catch {
    return imageUrl;
  }
};

export const toCssBackgroundImage = (url?: string | null) => {
  if (!url) return 'none';
  const escapedUrl = url.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `url("${escapedUrl}")`;
};

export const TOP_POINT_KEYS: CornerKey[] = ['a1', 'a2', 'a3'];
export const BOTTOM_POINT_KEYS: CornerKey[] = ['a6', 'a5', 'a4'];
export const CORNER_KEYS: CornerKey[] = [...TOP_POINT_KEYS, ...BOTTOM_POINT_KEYS];

export const DEFAULT_HOTSPOT_ANCHORS: AnchorMap = {
  a1: {
    x: 18,
    y: 22,
  },
  a2: {
    x: 50,
    y: 12,
  },
  a3: {
    x: 82,
    y: 22,
  },
  a4: {
    x: 82,
    y: 78,
  },
  a5: {
    x: 50,
    y: 88,
  },
  a6: {
    x: 18,
    y: 78,
  },
};

export const TYPE_OPTIONS: TypeOption[] = [
  {
    type: 'guide',
    name: 'TYPE 01 · Guide Focus',
    shortName: 'Guide',
    text: '큰 검사 이미지를 중심으로 6개 확대 기준점만 확인합니다.',
  },
  {
    type: 'split',
    name: 'TYPE 02 · Top / Bottom Split',
    shortName: 'Split',
    text: '상단 3개, 하단 3개 확대 화면을 큰 이미지 위아래에 배치합니다.',
  },
  {
    type: 'rightStack',
    name: 'TYPE 03 · Right Stack',
    shortName: 'Right',
    text: '확대 화면 6개를 오른쪽 3×2 영역에 모아 표시합니다.',
  },
];

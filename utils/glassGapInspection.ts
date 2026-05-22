import type {
  AnchorMap,
  AnchorPoint,
  ApiData,
  CornerItem,
  InspectionTone,
} from '@/types/glassGapInspection';

import { DEFAULT_HOTSPOT_ANCHORS } from '@/constants/glassGapInspection';

export const clampPercent = (value: number) => {
  return Math.max(4, Math.min(96, Number(value.toFixed(2))));
};

export const normalizeAnchor = (anchor: AnchorPoint): AnchorPoint => {
  return {
    x: clampPercent(anchor.x),
    y: clampPercent(anchor.y),
  };
};

export const getInspectionTone = (status?: string): InspectionTone => {
  const normalized = (status || '').trim();

  if (!normalized || normalized === '-' || normalized === '대기') {
    return 'wait';
  }

  if (normalized === '정상' || normalized.toUpperCase() === 'OK') {
    return 'ok';
  }

  return 'ng';
};

export const formatStatusLabel = (status?: string) => {
  const normalized = (status || '').trim();

  if (!normalized || normalized === '-') {
    return '대기';
  }

  return normalized;
};

export const getResultState = (result?: string) => {
  const normalized = (result || '').trim();
  const isPass = normalized === '정상' || normalized.toUpperCase() === 'OK';
  const isFail = !isPass && Boolean(normalized);

  if (isPass) {
    return {
      tone: 'ok' as const,
      label: '정상 (OK)',
      isFail: false,
    };
  }

  if (isFail) {
    return {
      tone: 'ng' as const,
      label: '불량 (NG)',
      isFail: true,
    };
  }

  return {
    tone: 'wait' as const,
    label: 'READY',
    isFail: false,
  };
};

export const getAnchorMapFromStorageValue = (storageValue: string | null): AnchorMap => {
  if (!storageValue) {
    return DEFAULT_HOTSPOT_ANCHORS;
  }

  try {
    const parsed = JSON.parse(storageValue) as Partial<AnchorMap>;

    return {
      tl: normalizeAnchor(parsed.tl ?? DEFAULT_HOTSPOT_ANCHORS.tl),
      tr: normalizeAnchor(parsed.tr ?? DEFAULT_HOTSPOT_ANCHORS.tr),
      bl: normalizeAnchor(parsed.bl ?? DEFAULT_HOTSPOT_ANCHORS.bl),
      br: normalizeAnchor(parsed.br ?? DEFAULT_HOTSPOT_ANCHORS.br),
    };
  } catch {
    return DEFAULT_HOTSPOT_ANCHORS;
  }
};

export const createCornerItems = (apiData: ApiData | null, anchors: AnchorMap): CornerItem[] => {
  return [
    {
      key: 'tl',
      code: 'A1',
      title: '좌측 상단',
      camera: 'camera-1',
      status: apiData?.LABEL001 || '-',
      imgUrl: apiData?.FILEPATH3 || '',
      anchor: anchors.tl,
      description: '상단 좌측 모서리 확대',
    },
    {
      key: 'tr',
      code: 'A2',
      title: '우측 상단',
      camera: 'camera-2',
      status: apiData?.LABEL002 || '-',
      imgUrl: apiData?.FILEPATH2 || '',
      anchor: anchors.tr,
      description: '상단 우측 모서리 확대',
    },
    {
      key: 'bl',
      code: 'A3',
      title: '좌측 하단',
      camera: 'camera-4',
      status: apiData?.LABEL003 || '-',
      imgUrl: apiData?.FILEPATH1 || '',
      anchor: anchors.bl,
      description: '하단 좌측 모서리 확대',
    },
    {
      key: 'br',
      code: 'A4',
      title: '우측 하단',
      camera: 'camera-3',
      status: apiData?.LABEL004 || '-',
      imgUrl: apiData?.FILEPATH4 || '',
      anchor: anchors.br,
      description: '하단 우측 모서리 확대',
    },
  ];
};

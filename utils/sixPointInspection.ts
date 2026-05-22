import type {
  AnchorMap,
  AnchorPoint,
  ApiData,
  CornerItem,
  InspectionTone,
} from '@/types/sixPointInspection';

import { CORNER_KEYS, DEFAULT_HOTSPOT_ANCHORS } from '@/constants/sixPointInspection';

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

    return CORNER_KEYS.reduce((nextAnchors, key) => {
      nextAnchors[key] = normalizeAnchor(parsed[key] ?? DEFAULT_HOTSPOT_ANCHORS[key]);
      return nextAnchors;
    }, {} as AnchorMap);
  } catch {
    return DEFAULT_HOTSPOT_ANCHORS;
  }
};

export const createCornerItems = (apiData: ApiData | null, anchors: AnchorMap): CornerItem[] => {
  return [
    {
      key: 'a1',
      code: 'A1',
      title: 'Top-Left',
      camera: 'CAM 01 · Surface Check',
      status: apiData?.LABEL001 || '-',
      imgUrl: apiData?.FILEPATH1 || '',
      anchor: anchors.a1,
      description: 'Top-left 확대 영역',
    },
    {
      key: 'a2',
      code: 'A2',
      title: 'Top-Center',
      camera: 'CAM 02 · Dimension Check',
      status: apiData?.LABEL002 || '-',
      imgUrl: apiData?.FILEPATH2 || '',
      anchor: anchors.a2,
      description: 'Top-center 확대 영역',
    },
    {
      key: 'a3',
      code: 'A3',
      title: 'Top-Right',
      camera: 'CAM 03 · Scratch Check',
      status: apiData?.LABEL003 || '-',
      imgUrl: apiData?.FILEPATH3 || '',
      anchor: anchors.a3,
      description: 'Top-right 확대 영역',
    },
    {
      key: 'a6',
      code: 'A6',
      title: 'Bottom-Left',
      camera: 'CAM 06 · Edge Check L',
      status: apiData?.LABEL006 || '-',
      imgUrl: apiData?.FILEPATH6 || '',
      anchor: anchors.a6,
      description: 'Bottom-left 확대 영역',
    },
    {
      key: 'a5',
      code: 'A5',
      title: 'Bottom-Center',
      camera: 'CAM 05 · Alignment',
      status: apiData?.LABEL005 || '-',
      imgUrl: apiData?.FILEPATH5 || '',
      anchor: anchors.a5,
      description: 'Bottom-center 확대 영역',
    },
    {
      key: 'a4',
      code: 'A4',
      title: 'Bottom-Right',
      camera: 'CAM 04 · Edge Check R',
      status: apiData?.LABEL004 || '-',
      imgUrl: apiData?.FILEPATH4 || '',
      anchor: anchors.a4,
      description: 'Bottom-right 확대 영역',
    },
  ];
};

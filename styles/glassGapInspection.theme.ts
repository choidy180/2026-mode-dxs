import type { InspectionTone } from '@/types/glassGapInspection';

export const glassGapTheme = {
  bg: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFC',
  textPrimary: '#111827',
  textSecondary: '#667085',
  textMuted: '#98A2B3',
  accent: '#E11D2E',
  accentSoft: '#FFF1F2',
  accentMuted: '#FFE4E8',
  success: '#12B76A',
  danger: '#E11D2E',
  border: 'rgba(17, 24, 39, 0.10)',
  hairline: 'rgba(17, 24, 39, 0.08)',
  connector: '#6B7280',
  connectorSoft: 'rgba(107, 114, 128, 0.50)',
  connectorStrong: '#374151',
  shadow: '0 18px 52px rgba(15, 23, 42, 0.08)',
  shadowStrong: '0 34px 100px rgba(15, 23, 42, 0.14)',
  status: {
    ok: {
      bg: '#ECFDF3',
      text: '#027A48',
      border: '#12B76A',
    },
    ng: {
      bg: '#FFF1F2',
      text: '#B42318',
      border: '#E11D2E',
    },
    wait: {
      bg: '#F8FAFC',
      text: '#98A2B3',
      border: '#D0D5DD',
    },
  },
} as const;

export const getToneColor = (tone: InspectionTone) => {
  if (tone === 'ok') {
    return glassGapTheme.status.ok.border;
  }

  if (tone === 'ng') {
    return glassGapTheme.status.ng.border;
  }

  return glassGapTheme.status.wait.border;
};

export const getToneBackground = (tone: InspectionTone) => {
  if (tone === 'ok') {
    return glassGapTheme.status.ok.bg;
  }

  if (tone === 'ng') {
    return glassGapTheme.status.ng.bg;
  }

  return glassGapTheme.status.wait.bg;
};

export const getToneText = (tone: InspectionTone) => {
  if (tone === 'ok') {
    return glassGapTheme.status.ok.text;
  }

  if (tone === 'ng') {
    return glassGapTheme.status.ng.text;
  }

  return glassGapTheme.status.wait.text;
};

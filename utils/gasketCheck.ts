import type { InspectionTone, LogType } from '@/types/gasketCheck';
import { filmTheme } from '@/styles/gasketCheck.theme';

export const getInspectionTone = (result?: string | null): InspectionTone => {
    const value = (result ?? '').trim().toUpperCase();

    if (!value || value === '-' || value === '대기') {
        return 'wait';
    }

    if (value === '정상' || value === 'OK') {
        return 'ok';
    }

    return 'ng';
};

export const getResultLabel = (result?: string | null) => {
    const tone = getInspectionTone(result);

    if (tone === 'ok') {
        return '정상 (OK)';
    }

    if (tone === 'ng') {
        return '불량 (NG)';
    }

    return 'READY';
};

export const getToneColor = (tone: InspectionTone) => {
    if (tone === 'ok') {
        return filmTheme.status.ok.border;
    }

    if (tone === 'ng') {
        return filmTheme.status.ng.border;
    }

    return filmTheme.status.wait.border;
};

export const getLogToneColor = (type: LogType) => {
    if (type === 'SUCCESS') {
        return filmTheme.success;
    }

    if (type === 'WARNING') {
        return filmTheme.warning;
    }

    if (type === 'ERROR') {
        return filmTheme.danger;
    }

    return filmTheme.textSecondary;
};

export const formatCount = (normal?: number, total?: number) => {
    if (normal === undefined || total === undefined) {
        return '-';
    }

    return `${normal} / ${total}`;
};

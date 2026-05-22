export type ScreenMode = 'FHD' | 'QHD';

export type InspectionTone = 'ok' | 'ng' | 'wait';

export type LogType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface ApiData {
    TIMEVALUE: string;
    FILENAME1: string;
    FILEPATH1: string;
    CDGITEM: string | null;
    COUNT_NUM: string | null;
    RESULT: string;
    STATUS002: string;
}

export interface TotalData {
    total_count: number;
    normal_count: number;
}

export interface SystemLog {
    id: number;
    time: string;
    type: LogType;
    message: string;
    station: string;
    quantity: number;
    carrier: string;
}

export interface ImageModalState {
    title: string;
    imgUrl: string;
}

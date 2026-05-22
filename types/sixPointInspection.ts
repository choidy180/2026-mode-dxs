export type ScreenMode = 'FHD' | 'QHD';
export type InspectionTone = 'ok' | 'ng' | 'wait';
export type InspectionViewType = 'guide' | 'split' | 'rightStack';
export type SummaryFilter = 'ng' | 'ok' | 'all';
export type CornerKey = 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6';

export interface ApiData {
  TIMEVALUE?: string;
  TIMEVALUE2?: string;
  FILENAME1?: string;
  FILENAME2?: string;
  FILENAME3?: string;
  FILENAME4?: string;
  FILENAME5?: string;
  FILENAME6?: string;
  FILEPATH1?: string;
  FILEPATH2?: string;
  FILEPATH3?: string;
  FILEPATH4?: string;
  FILEPATH5?: string;
  FILEPATH6?: string;
  CDGITEM?: string;
  WO?: string;
  COUNT_NUM?: string;
  RESULT?: string;
  LABEL001?: string;
  LABEL002?: string;
  LABEL003?: string;
  LABEL004?: string;
  LABEL005?: string;
  LABEL006?: string;
}

export interface TotalData {
  total_count: number;
  normal_count: number;
}

export interface InspectionApiResponse {
  success?: boolean;
  data?: ApiData[];
  total_data?: TotalData;
}

export interface AnchorPoint {
  x: number;
  y: number;
}

export type AnchorMap = Record<CornerKey, AnchorPoint>;

export interface ConnectorLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface CornerItem {
  key: CornerKey;
  code: string;
  title: string;
  camera: string;
  status: string;
  imgUrl: string;
  anchor: AnchorPoint;
  description: string;
}

export interface ImageModalState {
  isOpen: boolean;
  title: string;
  imgUrl: string;
}

export interface TypeOption {
  type: InspectionViewType;
  name: string;
  shortName: string;
  text: string;
}

export interface HistoryImageSet {
  main: string;
  a1: string;
  a2: string;
  a3: string;
  a4: string;
  a5: string;
  a6: string;
}

export interface HistoryLog {
  id: string;
  time: string;
  model: string;
  wo: string;
  result: 'ok' | 'ng';
  detail: string;
  images: HistoryImageSet;
}

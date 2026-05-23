import type { ApiDataItem, UnitData } from '@/types/smartFactoryViewer';

const asString = (value: unknown, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

export const normalizeApiItem = (item: Partial<ApiDataItem>): ApiDataItem => {
  return {
    ...item,
    대차번호: asString(item.대차번호, '0'),
    INTCART: Number(item.INTCART ?? item.대차번호 ?? 0),
    시리얼번호: asString(item.시리얼번호),
    모델번호: asString(item.모델번호),
    TIMEVALUE: asString(item.TIMEVALUE, new Date().toISOString()),
    'R액 압력(kg/㎥)': asString(item['R액 압력(kg/㎥)'], '0'),
    'P액 압력(kg/㎥)': asString(item['P액 압력(kg/㎥)'], '0'),
    'R액 유량(g)': asString(item['R액 유량(g)'], '0'),
    'P액 유량(g)': asString(item['P액 유량(g)'], '0'),
    '유량 비율(P/R)': asString(item['유량 비율(P/R)'], '0'),
    'R액 탱크온도(℃)': asString(item['R액 탱크온도(℃)'], '0'),
    'P액 탱크온도(℃)': asString(item['P액 탱크온도(℃)'], '0'),
    'R액 헤드온도(℃)': asString(item['R액 헤드온도(℃)'], '0'),
    'P액 헤드온도(℃)': asString(item['P액 헤드온도(℃)'], '0'),
    '온조#1리턴온도(℃)': asString(item['온조#1리턴온도(℃)'], '0'),
    '온조#2리턴온도(℃)': asString(item['온조#2리턴온도(℃)'], '0'),
    '온조#1공급수압력(kg/㎥)': asString(item['온조#1공급수압력(kg/㎥)'], '0'),
    '온조#2공급수압력(kg/㎥)': asString(item['온조#2공급수압력(kg/㎥)'], '0'),
    '발포시간(초)': asString(item['발포시간(초)'], '0'),
    '가조립무게(g)': asString(item['가조립무게(g)'], '0'),
    '가조립온도(℃)': asString(item['가조립온도(℃)'], '210.0'),
    '삽입주변온도(℃)': asString(item['삽입주변온도(℃)'], '0'),
    '지그상판온도(℃)': asString(item['지그상판온도(℃)'], '0'),
    '지그하판온도(℃)': asString(item['지그하판온도(℃)'], '0'),
    '취출경화시간(초)': asString(item['취출경화시간(초)'], '0'),
    '취출무게(g)': asString(item['취출무게(g)'], '0'),
    '취출주변온도(℃)': asString(item['취출주변온도(℃)'], '0'),
    FILENAME1: asString(item.FILENAME1),
    AI_TIME_STR: asString(item.AI_TIME_STR),
    AI_LABEL: asString(item.AI_LABEL, '정상'),
    FILEPATH1: asString(item.FILEPATH1),
  } as ApiDataItem;
};

export const createErrorUnits = (apiData: ApiDataItem[]): UnitData[] => {
  return apiData
    .filter((item) => item.AI_LABEL !== '정상')
    .map((item) => ({
      name: `M-${item.대차번호.padStart(2, '0')}`,
      temp: Number.parseFloat(item['가조립온도(℃)']) || 0,
      load: Number.parseFloat(item['R액 압력(kg/㎥)']) || 0,
      status: 'error' as const,
      problem: item.AI_LABEL,
      solution: '관리자 확인 필요',
    }));
};

export const getUnitNumber = (unitName: string) => {
  return Number.parseInt(unitName.replace('M-', ''), 10);
};

export const findApiItemByUnitName = (apiData: ApiDataItem[], unitName: string) => {
  const unitNumber = getUnitNumber(unitName);
  return apiData.find((item) => Number.parseInt(item.대차번호, 10) === unitNumber) ?? null;
};

export const formatUnitName = (cartNumber: string | number) => {
  return `M-${String(cartNumber).padStart(2, '0')}`;
};

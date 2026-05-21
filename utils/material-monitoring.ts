import { DUMMY_INSPECTION_LOGS } from '@/data/dummy-inspection-logs';
import type { MaterialListItem, MaterialStats } from '@/types/material-monitoring';

export const compactText = (value?: string | null, fallback = '-', max = 22) => {
  const text = value?.trim() || fallback;
  return text.length > max ? `${text.slice(0, max)}...` : text;
};

export const formatLogDateTime = (value?: string | null) => (value ? value.replace('T', ' ').slice(0, 16) : '-');

export const formatQty = (value?: number | string) => {
  if (value === undefined || value === null || value === '') return '-';
  const numberValue = Number(String(value).replace(/,/g, '').replace(/EA/gi, '').trim());
  return Number.isNaN(numberValue) ? `${value}` : `${numberValue.toLocaleString('ko-KR')} EA`;
};

export const makeMaterialKey = (item: MaterialListItem, index = 0) =>
  `${item.InvoiceNo || 'NO-INVOICE'}-${item.CdGItem || item.NmGItem || 'ITEM'}-${item.LogSeq || item.PurInDate || index}`;

export const getMaterialStats = (items: MaterialListItem[]): MaterialStats => {
  const total = items.length;
  const done = items.filter(item => item.InspConf === 'Y' || item.QmConf === 'Y').length;
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
};

export const createLiveDummyLog = (seq: number): MaterialListItem => {
  const base = DUMMY_INSPECTION_LOGS[seq % DUMMY_INSPECTION_LOGS.length];
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const done = seq % 4 !== 1;

  return {
    ...base,
    InvoiceNo: `INV-${9921 + seq}`,
    PurInDate: `2026-04-16 ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
    InspConf: done ? 'Y' : 'N',
    QmConf: done ? 'Y' : 'N',
    NmInspGB: done ? '수입검사' : '검수대기',
    LogSeq: `DUMMY-${seq}-${now.getTime()}`
  };
};

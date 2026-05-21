import React from 'react';
import type { MaterialListItem } from '@/types/material-monitoring';
import { compactText, formatLogDateTime, formatQty } from '@/utils/material-monitoring';
import { InspectionLogItem } from './styles';

type Props = {
  item: MaterialListItem;
  index: number;
};

function InspectionLogRow({ item, index }: Props) {
  const isDone = item.InspConf === 'Y' || item.QmConf === 'Y';

  return (
    <InspectionLogItem $done={isDone}>
      <div className="row-head">
        <span className="item-code" title={item.CdGItem || item.PrjCode || undefined}>
          {item.CdGItem || item.PrjCode || `ITEM-${index + 1}`}
        </span>
        <span className="badge">{isDone ? '검수완료' : item.NmInspGB || '검수대기'}</span>
      </div>
      <div className="material" title={item.NmGItem || undefined}>{compactText(item.NmGItem, '자재명 미등록', 34)}</div>
      <div className="vendor" title={item.NmCustm || undefined}>{compactText(item.NmCustm, '업체 미지정', 22)}</div>
      <div className="meta-grid">
        <div className="meta"><span>송장번호</span><code>{item.InvoiceNo || `LOG-${index + 1}`}</code></div>
        <div className="meta"><span>입고일자</span><strong>{formatLogDateTime(item.PurInDate)}</strong></div>
        <div className="meta"><span>입고수량</span><strong>{formatQty(item.InQty)}</strong></div>
        <div className="meta"><span>QM판정</span><strong>{item.QmConf || item.InspConf || '-'}</strong></div>
      </div>
    </InspectionLogItem>
  );
}

export default React.memo(InspectionLogRow);

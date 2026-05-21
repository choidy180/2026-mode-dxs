import React from 'react';
import { motion } from 'framer-motion';
import { FileWarning, Loader2 } from 'lucide-react';
import {
  CardTitle,
  FullHeightCard,
  HistoryItem as BaseHistoryItem,
  HistoryListContainer,
  PinkButton
} from '@/styles/styles';
import type { MaterialListItem, MaterialStats } from '@/types/material-monitoring';
import { compactText } from '@/utils/material-monitoring';
import { ViewAllButton } from './styles';

type Props = {
  pendingList: MaterialListItem[];
  stats: MaterialStats;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onOpenList: () => void;
};

const PendingItem = React.memo(({ item }: { item: MaterialListItem }) => (
  <BaseHistoryItem>
    <div className="left-grp">
      <span className="comp" title={item.NmCustm}>{compactText(item.NmCustm, '업체 미지정', 12)}</span>
      <span style={{ marginTop: 4, color: '#94a3b8', fontSize: '.85rem', fontWeight: 500, fontFamily: 'monospace' }}>
        {item.InvoiceNo || '-'}
      </span>
    </div>
    <div className="info">
      <span className="status bad" style={{ padding: '4px 10px', borderRadius: 12, background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
        {item.NmInspGB || '대기'}
      </span>
    </div>
  </BaseHistoryItem>
));
PendingItem.displayName = 'PendingItem';

export default function PendingListCard({ pendingList, stats, isLoading, error, onRetry, onOpenList }: Props) {
  return (
    <FullHeightCard style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CardTitle style={{ margin: 0, padding: 0, fontSize: '1.2rem' }}>입고 대기 리스트</CardTitle>
          <span style={{ padding: '4px 10px', borderRadius: 12, color: '#D31145', background: '#FFF0F3', fontSize: '.8rem', fontWeight: 700 }}>
            총 {pendingList.length}건
          </span>
        </div>
        <ViewAllButton onClick={onOpenList}>전체보기 &gt;</ViewAllButton>
      </div>

      <div style={{ marginTop: 30, borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#D31145', fontSize: '1rem', fontWeight: 700 }}>
          <span>금일 입고 진행률</span>
          <span>{stats.percent}% ({stats.done}/{stats.total})</span>
        </div>
        <div style={{ width: '100%', height: 6, overflow: 'hidden', borderRadius: 3, background: '#e2e8f0' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${stats.percent}%` }} transition={{ duration: 1 }} style={{ height: '100%', borderRadius: 3, background: '#D31145' }} />
        </div>
      </div>

      <HistoryListContainer style={{ padding: '10px 0' }}>
        <div className="h-scroll-area">
          {isLoading ? (
            <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#64748b' }}><Loader2 size={32} /></div>
          ) : error ? (
            <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#ef4444', gap: 10 }}>
              <FileWarning size={32} />
              <PinkButton onClick={onRetry} style={{ height: 30, fontSize: '.8rem', padding: '0 12px' }}>재시도</PinkButton>
            </div>
          ) : pendingList.length ? (
            pendingList.map((item, index) => <PendingItem key={`${item.InvoiceNo || 'unknown'}-${index}`} item={item} />)
          ) : (
            <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#94a3b8', fontSize: '.9rem' }}>항목이 없습니다.</div>
          )}
        </div>
      </HistoryListContainer>
    </FullHeightCard>
  );
}

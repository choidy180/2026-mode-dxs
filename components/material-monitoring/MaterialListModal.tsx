import { useMemo, useState } from 'react';
import { ListChecks, Search, X } from 'lucide-react';

import {
  CloseButton,
  ControlBar,
  FilterButton,
  FilterGroup,
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  SearchInput,
  StatusBadge,
  StyledTable,
  TableWrapper
} from './styles';
import { MaterialListItem } from '@/types/material-monitoring';

type Props = {
  onClose: () => void;
  data: MaterialListItem[];
};

export default function MaterialListModal({ onClose, data }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'Y' | 'N'>('ALL');

  // 검색/상태 필터
  const filteredData = useMemo(() => data.filter(item => {
    if (filterType === 'Y' && item.InspConf !== 'Y') return false;
    if (filterType === 'N' && item.InspConf === 'Y') return false;
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return [item.NmCustm, item.NmGItem, item.InvoiceNo].some(value => value?.toLowerCase().includes(term));
  }), [data, filterType, searchTerm]);

  return (
    <>
      <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <ModalContainer
        initial={{ scale: 0.95, opacity: 0, y: '-50%', x: '-50%' }}
        animate={{ scale: 1, opacity: 1, y: '-50%', x: '-50%' }}
        exit={{ scale: 0.95, opacity: 0, y: '-50%', x: '-50%' }}
      >
        <ModalHeader>
          <h2><div style={{ padding: 10, borderRadius: 12, background: '#eff6ff' }}><ListChecks size={24} color="#3b82f6" /></div>자재 입고 현황 전체보기</h2>
          <CloseButton onClick={onClose}><X size={20} /></CloseButton>
        </ModalHeader>

        <ControlBar>
          <SearchInput>
            <Search size={18} />
            <input placeholder="업체명, 자재명, 송장번호로 검색하세요" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} />
          </SearchInput>
          <FilterGroup>
            <FilterButton $active={filterType === 'ALL'} onClick={() => setFilterType('ALL')}>전체보기</FilterButton>
            <FilterButton $active={filterType === 'N'} onClick={() => setFilterType('N')}>대기중</FilterButton>
            <FilterButton $active={filterType === 'Y'} onClick={() => setFilterType('Y')}>완료됨</FilterButton>
          </FilterGroup>
        </ControlBar>

        <TableWrapper>
          <StyledTable>
            <colgroup><col style={{ width: 120 }} /><col style={{ width: 200 }} /><col style={{ width: 250 }} /><col /><col style={{ width: 180 }} /></colgroup>
            <thead><tr><th>상태</th><th>송장번호</th><th>업체명</th><th>자재명</th><th>입고일시</th></tr></thead>
            <tbody>
              {filteredData.length ? filteredData.map((item, index) => (
                <tr key={`${item.InvoiceNo || 'unknown'}-${index}`}>
                  <td><StatusBadge $status={item.InspConf === 'Y' ? 'Y' : 'N'}>{item.InspConf === 'Y' ? '● 완료' : `● ${item.NmInspGB || '대기'}`}</StatusBadge></td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.InvoiceNo}</td>
                  <td style={{ fontWeight: 600 }}>{item.NmCustm}</td>
                  <td>{item.NmGItem}</td>
                  <td style={{ color: '#64748b' }}>{item.PurInDate || '-'}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>검색 결과가 없습니다.</td></tr>
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </ModalContainer>
    </>
  );
}

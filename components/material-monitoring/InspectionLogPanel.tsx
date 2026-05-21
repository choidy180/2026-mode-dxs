import { Loader2 } from 'lucide-react';

import { InspectionLogList, InspectionLogPanelShell } from './styles';
import InspectionLogRow from './InspectionLogRow';
import { MaterialListItem } from '@/types/material-monitoring';
import { makeMaterialKey } from '@/utils/material-monitoring';

type Props = {
  logs: MaterialListItem[];
  isLoading: boolean;
};

export default function InspectionLogPanel({ logs, isLoading }: Props) {
  return (
    <InspectionLogPanelShell>
      <div className="log-header">
        <div>
          <h4>자재검수 로그</h4>
          <p>5초마다 누적되는 테스트 검수 이력</p>
        </div>
        <span className="count-pill">{logs.length}건</span>
      </div>

      <InspectionLogList>
        {isLoading && !logs.length ? (
          <div style={{ display: 'grid', placeItems: 'center', minHeight: 220, color: '#94a3b8' }}>
            <Loader2 size={28} />
          </div>
        ) : logs.length ? (
          logs.map((item, index) => <InspectionLogRow key={makeMaterialKey(item, index)} item={item} index={index} />)
        ) : (
          <div style={{ display: 'grid', placeItems: 'center', minHeight: 220, color: '#94a3b8', fontWeight: 700 }}>
            표시할 검수 로그가 없습니다.
          </div>
        )}
      </InspectionLogList>
    </InspectionLogPanelShell>
  );
}

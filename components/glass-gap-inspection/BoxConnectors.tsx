'use client';

import type { ConnectorLine, CornerItem, CornerKey } from '@/types/glassGapInspection';
import { getInspectionTone } from '@/utils/glassGapInspection';
import { glassGapTheme } from '@/styles/glassGapInspection.theme';
import { ConnectorSvg } from '@/styles/glassGapInspection.styles';

interface BoxConnectorsProps {
  activeCorner: CornerKey | null;
  cornerItems: CornerItem[];
  lines: Partial<Record<CornerKey, ConnectorLine>>;
}

const LANE_OFFSET: Record<CornerKey, number> = {
  tl: -20,
  tr: 20,
  bl: -14,
  br: 14,
};

const getPathData = (line: ConnectorLine, key: CornerKey) => {
  const offset = LANE_OFFSET[key];
  const controlX1 = line.x1 + (line.x2 - line.x1) * 0.38 + offset;
  const controlX2 = line.x1 + (line.x2 - line.x1) * 0.70 + offset;

  return `M ${line.x1} ${line.y1} C ${controlX1} ${line.y1}, ${controlX2} ${line.y2}, ${line.x2} ${line.y2}`;
};

export default function BoxConnectors({
  activeCorner,
  cornerItems,
  lines,
}: BoxConnectorsProps) {
  return (
    <ConnectorSvg aria-hidden="true">
      {cornerItems.map((item) => {
        const line = lines[item.key];

        if (!line) {
          return null;
        }

        const active = activeCorner === item.key || getInspectionTone(item.status) === 'ng';
        const pathData = getPathData(line, item.key);

        return (
          <g key={item.key}>
            <path
              d={pathData}
              fill="none"
              stroke="rgba(255, 255, 255, 0.94)"
              strokeLinecap="round"
              strokeWidth={active ? 6 : 5}
            />
            <path
              className="glass-gap-connector-flow"
              d={pathData}
              fill="none"
              stroke={active ? glassGapTheme.connectorStrong : glassGapTheme.connectorSoft}
              strokeDasharray="7 8"
              strokeLinecap="round"
              strokeWidth={active ? 2.6 : 2.2}
            />
          </g>
        );
      })}
    </ConnectorSvg>
  );
}

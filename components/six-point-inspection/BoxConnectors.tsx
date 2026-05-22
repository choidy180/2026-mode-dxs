'use client';

import type { ConnectorLine, CornerItem, CornerKey } from '@/types/sixPointInspection';
import { getInspectionTone } from '@/utils/sixPointInspection';
import { sixPointTheme } from '@/styles/sixPointInspection.theme';
import { ConnectorSvg } from '@/styles/sixPointInspection.styles';

interface BoxConnectorsProps {
  activeCorner: CornerKey | null;
  cornerItems: CornerItem[];
  lines: Partial<Record<CornerKey, ConnectorLine>>;
}

const LANE_OFFSET: Record<CornerKey, number> = {
  a1: -20,
  a2: 0,
  a3: 20,
  a4: 20,
  a5: 0,
  a6: -20,
};

const getPathData = (line: ConnectorLine, key: CornerKey) => {
  const offset = LANE_OFFSET[key];
  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;
  const isMostlyVertical = Math.abs(dy) > Math.abs(dx);

  if (isMostlyVertical) {
    const controlY1 = line.y1 + dy * 0.34;
    const controlY2 = line.y1 + dy * 0.74;

    return `M ${line.x1} ${line.y1} C ${line.x1 + offset} ${controlY1}, ${line.x2 + offset} ${controlY2}, ${line.x2} ${line.y2}`;
  }

  const controlX1 = line.x1 + dx * 0.38 + offset;
  const controlX2 = line.x1 + dx * 0.70 + offset;

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
              className="six-point-connector-flow"
              d={pathData}
              fill="none"
              stroke={active ? sixPointTheme.connectorStrong : sixPointTheme.connectorSoft}
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

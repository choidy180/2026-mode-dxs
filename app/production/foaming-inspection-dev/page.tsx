'use client';

import React, { useState } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import {
  FiAlertTriangle,
  FiSearch,
  FiActivity,
} from 'react-icons/fi';

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------
const T = {
  primary: '#C1124F',
  lightPink: '#FCE7F3',
  pinkTint: '#FFF5F7',
  green: '#10B981',
  amber: '#F59E0B',
  amberText: '#B45309',
  amberBg: '#FFFBEB',
  redText: '#DC2626',
  redBg: '#FEF2F2',
  bg: '#F1F5F9',
  card: '#FFFFFF',
  textMain: '#0F172A',
  textSub: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  dark: '#1E293B',
};

const GlobalStyle = createGlobalStyle`
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");

  * { box-sizing: border-box; font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }
  body { margin: 0; background-color: ${T.bg}; color: ${T.textMain}; overflow: hidden; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.8); }
`;

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------
const Page = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: ${T.bg};
  overflow: hidden;
`;

const TabBar = styled.div`
  display: flex;
  justify-content: center;
  flex-shrink: 0;
`;

const TabGroup = styled.div`
  display: flex;
  gap: 6px;
  background: #E9EDF3;
  border: 1px solid ${T.border};
  padding: 6px;
  border-radius: 12px;
`;

const Tab = styled.button<{ $active?: boolean; $error?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 9px 22px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.3px;
  background: ${({ $active }) => ($active ? '#FFFFFF' : 'transparent')};
  border: 1px solid ${({ $active }) => ($active ? T.border : 'transparent')};
  color: ${({ $active, $error }) =>
    $active ? ($error ? T.primary : T.textMain) : $error ? T.primary : T.textSub};
  box-shadow: ${({ $active }) => ($active ? '0 4px 12px rgba(15, 23, 42, 0.16)' : 'none')};
  transition: all 0.18s ease;

  &:hover {
    background: ${({ $active }) => ($active ? '#FFFFFF' : 'rgba(255,255,255,0.55)')};
  }
`;

const TabDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${T.primary};
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 18px;
`;

const LeftColumn = styled.div`
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
`;

// --- Process overview card (header + charts) ---
const OverviewCard = styled(Card)`
  padding: 26px 28px;
  flex-shrink: 0;
`;

const OverviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
`;

const ProcessTitle = styled.h1`
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -1px;
  color: ${T.textMain};
`;

const HeaderStats = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 44px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const StatLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${T.textSub};
  letter-spacing: -0.2px;
`;

const StatValue = styled.span<{ $danger?: boolean }>`
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.6px;
  color: ${({ $danger }) => ($danger ? T.primary : T.textMain)};

  small {
    font-size: 14px;
    font-weight: 700;
    color: ${T.textSub};
    margin-left: 5px;
  }
`;

const ChartRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
`;

const ChartCard = styled.div<{ $active?: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? T.primary : T.border)};
  background: ${({ $active }) => ($active ? T.pinkTint : '#FFFFFF')};
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChartHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ChartTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const ChartIndex = styled.span<{ $active?: boolean }>`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  background: ${({ $active }) => ($active ? T.primary : '#F1F5F9')};
  color: ${({ $active }) => ($active ? '#FFFFFF' : T.textSub)};
`;

const ChartName = styled.span<{ $active?: boolean }>`
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: ${({ $active }) => ($active ? T.primary : T.textMain)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChartValue = styled.span<{ $active?: boolean }>`
  flex-shrink: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.6px;
  color: ${({ $active }) => ($active ? T.primary : T.textMain)};

  small {
    font-size: 13px;
    font-weight: 700;
    color: ${T.textSub};
    margin-left: 4px;
  }
`;

const ChartSvg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
`;

// --- Log card ---
const LogCard = styled(Card)`
  flex: 1;
  min-height: 0;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
`;

const LogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-shrink: 0;
`;

const LogTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: ${T.textMain};
`;

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: ${T.primary};

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${T.primary};
    animation: ${pulse} 1.4s ease-in-out infinite;
  }
`;

const LogTable = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const LogRowGrid = styled.div`
  display: grid;
  grid-template-columns: 110px 1.4fr 1fr 1fr 1fr;
  align-items: center;
  gap: 12px;
`;

const LogHeadRow = styled(LogRowGrid)`
  padding: 0 4px 12px;
  border-bottom: 1px solid ${T.border};

  span {
    font-size: 13px;
    font-weight: 700;
    color: ${T.textSub};
    letter-spacing: -0.2px;
  }
`;

const LogRow = styled(LogRowGrid)`
  padding: 18px 4px;
  border-bottom: 1px solid #F1F5F9;
`;

const LogCellTime = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${T.textSub};
`;

const LogCellSensor = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${T.textMain};
  letter-spacing: -0.2px;
`;

const EventPill = styled.span<{ $tone: 'critical' | 'warn' }>`
  justify-self: start;
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.2px;
  background: ${({ $tone }) => ($tone === 'critical' ? T.redBg : T.amberBg)};
  color: ${({ $tone }) => ($tone === 'critical' ? T.redText : T.amberText)};
  border: 1px solid ${({ $tone }) => ($tone === 'critical' ? '#FECACA' : '#FDE68A')};
`;

const LogValue = styled.span<{ $tone?: 'critical' | 'warn' }>`
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: ${({ $tone }) => ($tone === 'critical' ? T.redText : $tone === 'warn' ? T.amberText : T.textMain)};
`;

// ---------------------------------------------------------------------------
// AI Risk Diagnosis panel (자재관리 > 공정재고 와 동일)
// ---------------------------------------------------------------------------
const RiskPanel = styled(Card)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  padding: 0;
`;

const RiskHeader = styled.div`
  padding: 15px 18px;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const RiskHeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${T.textMain};
  letter-spacing: -0.6px;
`;

const AnalyzingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 10px;
  border-radius: 6px;
  background: ${T.lightPink};
  color: ${T.primary};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.2px;
`;

const PulseDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${T.primary};
  animation: ${pulse} 1.4s ease-in-out infinite;
`;

const RiskBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
`;

const PriorityAlert = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  background: #FEF2F2;
  border: 1px solid #FEE2E2;
  flex-shrink: 0;
`;

const PriorityIcon = styled.div`
  color: ${T.primary};
  flex-shrink: 0;
  margin-top: 2px;
  line-height: 0;
`;

const PriorityTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const PriorityLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${T.primary};
  letter-spacing: -0.2px;
`;

const PriorityMain = styled.strong`
  font-size: 16px;
  font-weight: 700;
  color: ${T.textMain};
  letter-spacing: -0.4px;
`;

const RiskSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RiskSectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: ${T.textMain};
  letter-spacing: -0.3px;

  svg { color: #475569; }
`;

const CauseBox = styled.div`
  padding: 14px 16px;
  border-radius: 8px;
  background: #F8FAFC;
  border: 1px solid #EEF2F6;
  display: flex;
  flex-direction: column;
  gap: 10px;

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.65;
    font-weight: 500;
    color: #334155;
    letter-spacing: -0.2px;
  }

  b { color: ${T.primary}; font-weight: 700; }
`;

const GuideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GuideItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

const GuideNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: ${T.textMain};
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const GuideText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const GuideTitle = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${T.textMain};
  letter-spacing: -0.3px;
`;

const GuideDesc = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  line-height: 1.5;
  letter-spacing: -0.2px;
`;

const RiskFooter = styled.div`
  flex-shrink: 0;
  padding: 14px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FooterStat = styled.div`
  height: 46px;
  padding: 0 16px;
  border-radius: 8px;
  background: ${T.textMain};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FooterLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #94A3B8;
  letter-spacing: -0.2px;
`;

const FooterValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${T.primary};
  letter-spacing: -0.4px;

  small {
    color: #E2E8F0;
    font-size: 14px;
    font-weight: 700;
    margin-right: 7px;
  }
`;

// ---------------------------------------------------------------------------
// Line chart (SVG)
// ---------------------------------------------------------------------------
interface ChartProps {
  axisMin: number;
  axisMax: number;
  refMax: number;
  refMin: number;
  optimal: number;
  points: number[];
  active?: boolean;
}

const LineChart = ({ axisMin, axisMax, refMax, refMin, optimal, points, active }: ChartProps) => {
  const W = 400;
  const H = 230;
  const padL = 46;
  const padR = 46;
  const padT = 18;
  const padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const lineColor = active ? T.primary : T.dark;

  const xAt = (i: number) => padL + (plotW * i) / (points.length - 1);
  const yAt = (v: number) => padT + plotH - ((v - axisMin) / (axisMax - axisMin)) * plotH;

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(p).toFixed(1)}`)
    .join(' ');

  const lastX = xAt(points.length - 1);
  const lastY = yAt(points[points.length - 1]);

  return (
    <ChartSvg viewBox={`0 0 ${W} ${H}`} role="img">
      {/* plot area */}
      <rect x={padL} y={padT} width={plotW} height={plotH} rx="6" fill={active ? 'rgba(193,18,79,0.05)' : '#F8FAFC'} />

      {/* Max / Min reference lines */}
      <line x1={padL} y1={yAt(refMax)} x2={W - padR} y2={yAt(refMax)} stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="5 5" />
      <text x={padL + 6} y={yAt(refMax) - 7} fontSize="12" fontWeight="600" fill="#94A3B8">Max ({refMax})</text>

      <line x1={padL} y1={yAt(refMin)} x2={W - padR} y2={yAt(refMin)} stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="5 5" />
      <text x={padL + 6} y={yAt(refMin) + 16} fontSize="12" fontWeight="600" fill="#94A3B8">Min ({refMin})</text>

      {/* optimal (green) */}
      <line x1={padL} y1={yAt(optimal)} x2={W - padR} y2={yAt(optimal)} stroke={T.green} strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round" />
      <text x={W - padR} y={yAt(optimal) + 17} fontSize="12" fontWeight="700" fill={T.green} textAnchor="end">최적값</text>

      {/* measured series */}
      <path d={path} fill="none" stroke={lineColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="5" fill={lineColor} />
      <text x={lastX - 10} y={lastY - 9} fontSize="12" fontWeight="700" fill={lineColor} textAnchor="end">측정값</text>

      {/* left axis labels */}
      <text x={padL - 10} y={yAt(axisMax) + 4} fontSize="12" fontWeight="600" fill="#64748B" textAnchor="end">{axisMax}</text>
      <text x={padL - 10} y={yAt(optimal) + 4} fontSize="12" fontWeight="600" fill="#64748B" textAnchor="end">{optimal}</text>
      <text x={padL - 10} y={yAt(axisMin) + 4} fontSize="12" fontWeight="600" fill="#64748B" textAnchor="end">{axisMin}</text>

      {/* x axis labels */}
      <text x={padL} y={H - 9} fontSize="12" fontWeight="600" fill="#94A3B8" textAnchor="start">10 : 00</text>
      <text x={padL + plotW / 2} y={H - 9} fontSize="12" fontWeight="600" fill="#94A3B8" textAnchor="middle">10 : 20</text>
      <text x={W - padR} y={H - 9} fontSize="12" fontWeight="600" fill="#94A3B8" textAnchor="end">10 : 40</text>
    </ChartSvg>
  );
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const PROCESS_TABS = [
  { id: 'GR2', label: 'GR2 공정' },
  { id: 'GR3', label: 'GR3 공정' },
  { id: 'GR5', label: 'GR5 공정', error: true },
  { id: 'GR9', label: 'GR9 공정' },
];

const CHARTS = [
  {
    index: 1,
    name: 'R액 탱크온도',
    unit: '℃',
    value: '28.5',
    active: true,
    axisMin: 18,
    axisMax: 35,
    refMax: 30,
    refMin: 20,
    optimal: 22,
    points: [19, 20.4, 22.4, 24.4, 26.4, 27.8, 28.5],
  },
  {
    index: 2,
    name: 'R액 압력',
    unit: 'bar',
    value: '150.5',
    active: false,
    axisMin: 0,
    axisMax: 300,
    refMax: 170,
    refMin: 130,
    optimal: 150,
    points: [142, 146, 150, 158, 153, 149, 150.5],
  },
  {
    index: 3,
    name: '온조#1 리턴온도',
    unit: '℃',
    value: '28.0',
    active: false,
    axisMin: 0,
    axisMax: 60,
    refMax: 40,
    refMin: 20,
    optimal: 30,
    points: [25, 25.5, 26, 26.5, 27, 27.6, 28],
  },
];

const LOG_ROWS = [
  {
    time: '14:58:27',
    sensor: '대차 01 - R액 탱크온도',
    event: '임계점 접근',
    tone: 'critical' as const,
    value: '28.5 ℃',
    delta: '+3.5 ℃ 초과',
  },
  {
    time: '14:58:27',
    sensor: '대차 01 - R액 압력',
    event: '주의 구간',
    tone: 'warn' as const,
    value: '150.5 bar',
    delta: '+0.5 bar 초과',
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function FoamingInspectionDev() {
  const [activeTab, setActiveTab] = useState('GR2');
  const activeLabel = PROCESS_TABS.find((t) => t.id === activeTab)?.label ?? 'GR2 공정';

  return (
    <>
      <GlobalStyle />
      <Page>
        <TabBar>
          <TabGroup>
            {PROCESS_TABS.map((tab) => (
              <Tab
                key={tab.id}
                type="button"
                $active={activeTab === tab.id}
                $error={tab.error}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.error && <TabDot />}
                {tab.label}
              </Tab>
            ))}
          </TabGroup>
        </TabBar>

        <Body>
          <LeftColumn>
            <OverviewCard>
              <OverviewHeader>
                <ProcessTitle>{activeLabel}</ProcessTitle>
                <HeaderStats>
                  <Stat>
                    <StatLabel>총 생산갯수</StatLabel>
                    <StatValue>
                      1,245 <small>개</small>
                    </StatValue>
                  </Stat>
                  <Stat>
                    <StatLabel>설비 이상징후 결과</StatLabel>
                    <StatValue $danger>주의 (임계)</StatValue>
                  </Stat>
                </HeaderStats>
              </OverviewHeader>

              <ChartRow>
                {CHARTS.map((c) => (
                  <ChartCard key={c.index} $active={c.active}>
                    <ChartHead>
                      <ChartTitleGroup>
                        <ChartIndex $active={c.active}>{c.index}</ChartIndex>
                        <ChartName $active={c.active}>{c.name}</ChartName>
                      </ChartTitleGroup>
                      <ChartValue $active={c.active}>
                        {c.value} <small>{c.unit}</small>
                      </ChartValue>
                    </ChartHead>
                    <LineChart
                      axisMin={c.axisMin}
                      axisMax={c.axisMax}
                      refMax={c.refMax}
                      refMin={c.refMin}
                      optimal={c.optimal}
                      points={c.points}
                      active={c.active}
                    />
                  </ChartCard>
                ))}
              </ChartRow>
            </OverviewCard>

            <LogCard>
              <LogHeader>
                <LogTitle>실시간 안전 감지 로그</LogTitle>
                <LiveBadge>LIVE</LiveBadge>
              </LogHeader>
              <LogTable>
                <LogHeadRow>
                  <span>발생시간</span>
                  <span>센서 위치</span>
                  <span>이벤트 상세</span>
                  <span>측정값</span>
                  <span>기준치 대비</span>
                </LogHeadRow>
                {LOG_ROWS.map((row, idx) => (
                  <LogRow key={idx}>
                    <LogCellTime>{row.time}</LogCellTime>
                    <LogCellSensor>{row.sensor}</LogCellSensor>
                    <EventPill $tone={row.tone}>{row.event}</EventPill>
                    <LogValue $tone={row.tone === 'critical' ? 'critical' : undefined}>{row.value}</LogValue>
                    <LogValue $tone={row.tone}>{row.delta}</LogValue>
                  </LogRow>
                ))}
              </LogTable>
            </LogCard>
          </LeftColumn>

          {/* 오른쪽: AI 실시간 위험 진단 (공정재고 페이지와 동일) */}
          <RiskPanel>
            <RiskHeader>
              <RiskHeaderTitle>AI 실시간 위험 진단</RiskHeaderTitle>
              <AnalyzingBadge>
                <PulseDot /> 분석 중
              </AnalyzingBadge>
            </RiskHeader>

            <RiskBody>
              <PriorityAlert>
                <PriorityIcon>
                  <FiAlertTriangle size={22} />
                </PriorityIcon>
                <PriorityTextGroup>
                  <PriorityLabel>최우선 조치 권고</PriorityLabel>
                  <PriorityMain>대차 01 : R액 탱크 과열</PriorityMain>
                </PriorityTextGroup>
              </PriorityAlert>

              <RiskSection>
                <RiskSectionTitle>
                  <FiSearch size={17} /> 원인 추론
                </RiskSectionTitle>
                <CauseBox>
                  <p>
                    현재 <b>R액 탱크온도가 상한 임계치(30°C)에 도달</b>하기 직전입니다.
                  </p>
                  <p>
                    패턴 매칭 결과, <b>온조기(Chiller) 냉각수 펌프 성능 저하 또는 필터 막힘</b>으로 열교환 효율이 떨어졌을 확률이 높습니다.
                  </p>
                </CauseBox>
              </RiskSection>

              <RiskSection>
                <RiskSectionTitle>
                  <FiActivity size={17} /> 권장 조치 가이드
                </RiskSectionTitle>
                <GuideList>
                  <GuideItem>
                    <GuideNumber>1</GuideNumber>
                    <GuideText>
                      <GuideTitle>온조 #1 공급수압력 점검</GuideTitle>
                      <GuideDesc>냉각수 유량이 충분한지 칠러 압력을 확인하십시오.</GuideDesc>
                    </GuideText>
                  </GuideItem>
                  <GuideItem>
                    <GuideNumber>2</GuideNumber>
                    <GuideText>
                      <GuideTitle>R액 탱크 자켓 세척</GuideTitle>
                      <GuideDesc>냉각수 라인 이상이 없다면 자켓 내부 스케일을 점검하십시오.</GuideDesc>
                    </GuideText>
                  </GuideItem>
                </GuideList>
              </RiskSection>
            </RiskBody>

            <RiskFooter>
              <FooterStat>
                <FooterLabel>AI 추론 신뢰도</FooterLabel>
                <FooterValue>96.8%</FooterValue>
              </FooterStat>
              <FooterStat>
                <FooterLabel>유사 패턴 발생 이력</FooterLabel>
                <FooterValue>
                  <small>최근 30일</small> 2건
                </FooterValue>
              </FooterStat>
            </RiskFooter>
          </RiskPanel>
        </Body>
      </Page>
    </>
  );
}

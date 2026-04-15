"use client";

import React, { useState, useEffect, useMemo, memo, useCallback, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ComposedChart,
  Line,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
} from "recharts";
import {
  Activity,
  Bell,
  TrendingUp,
  Maximize2,
  FileText,
  X,
  Refrigerator, 
  Settings,    
  Layers,       
  Cpu,
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  Check,
  WifiOff,
  Wine,
  GlassWater,
  ChevronRight
} from "lucide-react";

// --- [1. 설정 및 데이터 상수] ---

const TARGET_TAKT = 60.0;
const CHART_Y_MAX_LIMIT = 280; 
const REFRESH_RATE = 5000;

const WS_PATHS = {
  A: "ws://192.168.2.147:8134",
  B: "ws://192.168.2.147:8135",
  C: "ws://192.168.2.147:8136",
};

const KPI_DATA = {
  1: { target: 450, rate: "97.4", production: 296 },  
  2: { target: 108, rate: "98.3", production: 60 },   
  3: { target: 450, rate: "97.4", production: 296 }   
};

const COLORS = {
  bgPage: "#F1F5F9",
  bgCard: "#FFFFFF",
  primary: "#60A5FA",    
  targetLine: "#F97316", 
  alert: "#F87171",      
  warning: "#F59E0B",
  success: "#10B981",    
  textMain: "#1E293B",
  textSub: "#64748B",
  grid: "#E2E8F0",
  videoBg: "#020617",
};

// --- [타입 정의] ---
interface ApiRecentItem { CAM_NO: string; UPDATETIME: string; CLASS_NAME: string; COUNT_NUM: string; TACTTIME: string; TACTTIME_AVG: string; EXP_TT: number | string; }
interface ApiHistoryItem { CAM_NO: string; CLASS_NAME: string; ENTRY_TIME: string; COUNT_NUM: string; TACTTIME: string; TACTTIME_AVG: string; RowNum: string; }
interface ApiResponse { success: boolean; recent_data: ApiRecentItem[]; history_data: { [key: string]: ApiHistoryItem[]; }; }
interface CycleData { id: string; name: string; cycleTime: number; visualCycleTime: number; target: number; isOver: boolean; production: number; timeLabel: string; }

interface SystemLog {
    id: number;
    time: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
}

// 실시간 로그 MOCK 데이터 생성기
const generateInitialLogs = (): SystemLog[] => {
    const logs: SystemLog[] = [];
    const messages = [
        { type: 'success', msg: '라인 2 가동 시작 (작업자 4명 투입 완료)' },
        { type: 'error', msg: '#4번 공정 텍타임 지연 (15.2초) 발생' },
        { type: 'warning', msg: '2호기 자재 공급 요청' },
        { type: 'success', msg: '라인 2 가동 시작' },
        { type: 'info', msg: '오후 작업조 투입 완료 및 작업 인계 사항 전달' },
        { type: 'success', msg: '오전 작업조 작업 종료 및 현장 정리 정돈' },
        { type: 'success', msg: '품질 검사 데이터 전송 완료' },
        { type: 'error', msg: '#2번 라인 자재 부족 알림' },
        { type: 'success', msg: '라인 2 가동 시작' },
        { type: 'info', msg: '설비 정기 점검 완료 및 재가동 승인' },
        { type: 'success', msg: '라인 1 가동 시작' },
        { type: 'warning', msg: '2호기 자재 공급 요청' },
    ];

    let currentTime = new Date();
    for (let i = 0; i < 15; i++) {
        const diffMinutes = Math.floor(Math.random() * 6) + 5; 
        currentTime = new Date(currentTime.getTime() - diffMinutes * 60000);
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        
        logs.push({
            id: i,
            time: currentTime.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            type: randomMsg.type as any,
            message: randomMsg.msg
        });
    }
    return logs.sort((a, b) => a.id - b.id);
};

// --- [스타일 컴포넌트] ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&family=Rajdhani:wght@600;700;800&display=swap');
  body { background-color: ${COLORS.bgPage}; margin: 0; font-family: 'Pretendard', sans-serif; overflow: hidden; color: ${COLORS.textMain}; }
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 6px; height: 6px; } 
  ::-webkit-scrollbar-track { background: transparent; } 
  ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
`;

const LayoutContainer = styled.div`
  display: flex; flex-direction: column; width: 100vw; 
  height: calc(100vh - 60px); max-height: calc(100vh - 60px); 
  background-color: ${COLORS.bgPage}; padding: 16px 24px; gap: 16px; overflow: hidden;
`;

const TopNavContainer = styled.div`
  display: flex; justify-content: center; width: 100%; flex-shrink: 0;
`;

const TabGroup = styled.div`
  display: inline-flex; background: #E2E8F0; padding: 4px; border-radius: 12px; gap: 4px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 8px 24px; border-radius: 8px; border: none; font-size: 14px; font-weight: 700; cursor: pointer;
  background: ${p => p.$active ? '#FFF' : 'transparent'};
  color: ${p => p.$active ? '#1E293B' : '#64748B'};
  box-shadow: ${p => p.$active ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'};
  transition: all 0.2s;
`;

// ✅ 이미지와 100% 동일하게 수정한 상단 KPI 구조
const KpiContainer = styled.div`
  display: flex; flex-direction: column; background: ${COLORS.bgCard}; 
  border-radius: 12px; border: 1px solid ${COLORS.grid}; flex-shrink: 0; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.02); overflow: hidden;
`;

const KpiHeaderRow = styled.div`
  display: flex; background: #F8FAFC; border-bottom: 1px solid ${COLORS.grid};
`;

const KpiHeaderCell = styled.div<{ $flex?: number, $noBorder?: boolean }>`
  flex: ${p => p.$flex || 1}; padding: 14px 0; text-align: center; 
  font-size: 13px; font-weight: 700; color: ${COLORS.textSub};
  border-right: ${p => p.$noBorder ? 'none' : `1px solid ${COLORS.grid}`};
`;

const KpiValueRow = styled.div`
  display: flex; height: 80px;
`;

const KpiValueCell = styled.div<{ $flex?: number, $noBorder?: boolean }>`
  flex: ${p => p.$flex || 1}; display: flex; align-items: center; justify-content: center;
  border-right: ${p => p.$noBorder ? 'none' : `1px solid ${COLORS.grid}`};
`;

const DashboardBody = styled.div`
  flex: 1; display: flex; gap: 20px; min-height: 0; overflow: hidden;
`;

const ChartSection = styled.div`
  flex: 3; background: ${COLORS.bgCard}; border-radius: 12px; border: 1px solid ${COLORS.grid};
  padding: 24px; display: flex; flex-direction: column; gap: 24px; height: 100%; overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
`;

const ChartRow = styled.div`
  flex: 1; display: flex; gap: 24px; min-height: 0;
`;

const VideoBox = styled.div<{ $isLarge?: boolean }>`
  width: ${(props) => props.$isLarge ? "40%" : "320px"}; 
  height: 100%; background: ${COLORS.videoBg}; border-radius: 12px; 
  display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; flex-shrink: 0;
  border: 1px solid ${COLORS.grid};

  .label { 
    position: absolute; top: 16px; left: 16px; color: white; font-size: 15px; font-weight: 800; 
    text-shadow: 0 2px 4px rgba(0,0,0,0.8); z-index: 10;
  }
`;

const StyledWebsocketImg = styled.img`
  width: 100%; height: 100%; object-fit: cover; transform: scale(1.05); opacity: 0.9;
`;

const ChartWrapper = styled.div`
  flex: 1; height: 100%; position: relative; min-width: 0; display: flex; flex-direction: column;
`;

const ChartHeader = styled.div`
  display: flex; justify-content: flex-end; align-items: center; gap: 12px; margin-bottom: 4px; width: 100%;
`;

const AlertSection = styled.div`
  flex: 1; min-width: 320px; max-width: 360px; background: ${COLORS.bgCard}; border-radius: 12px; border: 1px solid ${COLORS.grid}; 
  display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  
  .header { padding: 20px 24px; border-bottom: 1px solid ${COLORS.grid}; display: flex; align-items: center; justify-content: space-between; background: #FFFFFF; } 
  .list-wrapper { flex: 1; overflow-y: auto; padding: 0; }
`;

// --- [모달 스타일] ---
const ModalOverlay = styled(motion.div)`position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: center; justify-content: center;`;
const ModalContent = styled(motion.div)`
    width: 70%; max-width: 900px; height: 85%; background: white; border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    
    .modal-header { 
      padding: 20px 24px; border-bottom: 1px solid ${COLORS.grid}; display: flex; justify-content: space-between; align-items: center; background: #F8FAFC;
      h2 { margin: 0; font-size: 1.2rem; font-weight: 800; display: flex; align-items: center; gap: 10px; color: ${COLORS.textMain}; } 
    } 
    .modal-toolbar { padding: 12px 24px; border-bottom: 1px solid ${COLORS.grid}; display: flex; gap: 12px; background: white; position: relative; }
    .search-box {
      flex: 1; display: flex; align-items: center; gap: 8px; background: #F1F5F9; padding: 8px 12px; border-radius: 8px; color: ${COLORS.textSub}; font-size: 0.9rem; border: 1px solid transparent;
      input { border: none; background: transparent; outline: none; width: 100%; color: ${COLORS.textMain}; }
    }
    .close-btn { width: 32px; height: 32px; border-radius: 50%; border: 1px solid ${COLORS.grid}; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; color: ${COLORS.textSub}; }
    .modal-body { flex: 1; overflow-y: auto; background: #F8FAFC; padding: 20px; }
`;
const LogTable = styled.table`
  width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  thead th { text-align: left; padding: 14px 20px; border-bottom: 1px solid ${COLORS.grid}; color: ${COLORS.textSub}; font-size: 0.8rem; font-weight: 700; background: #F8FAFC; } 
  tbody tr { border-bottom: 1px solid ${COLORS.grid}; } 
  tbody td { padding: 14px 20px; color: ${COLORS.textMain}; font-size: 0.9rem; } 
`;
const LoadingOverlay = styled(motion.div)`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(8px);
  z-index: 50; display: flex; flex-direction: column; align-items: center; justify-content: center;
`;
const Spinner = styled.div`
  width: 48px; height: 48px; border: 4px solid #E2E8F0; border-top-color: ${COLORS.primary}; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px;
`;

const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

// --- [Helper Components] ---

const CustomLineLabel = memo((props: any) => {
  const { x, y, value } = props;
  const valNum = Number(value);
  const isOver = valNum > TARGET_TAKT;
  return (
    <text x={x} y={y - 12} fill={isOver ? COLORS.alert : COLORS.primary} textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '13px' }}>
      {valNum.toFixed(1)}
    </text>
  );
});

const WsVideoStream = memo(({ wsUrl }: { wsUrl: string }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    ws.binaryType = 'blob'; 
    ws.onmessage = (event) => {
      if (!imgRef.current) return;
      if (typeof event.data === 'string') {
        imgRef.current.src = event.data.startsWith('data:image') ? event.data : `data:image/jpeg;base64,${event.data}`;
      } else {
        const url = URL.createObjectURL(event.data);
        imgRef.current.src = url;
        imgRef.current.onload = () => { URL.revokeObjectURL(url); };
      }
    };
    return () => { ws.close(); };
  }, [wsUrl]);
  return <StyledWebsocketImg ref={imgRef} alt="Live Stream" />;
}, (prev, next) => prev.wsUrl === next.wsUrl);

const MonitorChart = memo(({ data }: { data: CycleData[] }) => {
  if (!data || data.length === 0) return <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}><Spinner/></div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 25, right: 15, left: -25, bottom: -5 }}>
        <defs>
          <linearGradient id="colorOk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.0}/>
          </linearGradient>
          <linearGradient id="colorNg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FCA5A5" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#FCA5A5" stopOpacity={0.0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
        <XAxis dataKey="timeLabel" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }} dy={10} interval="preserveStartEnd" />
        <YAxis hide domain={[0, CHART_Y_MAX_LIMIT]} />
        <ReferenceLine y={TARGET_TAKT} stroke={COLORS.grid} strokeDasharray="3 3" strokeWidth={1} />
        <Bar dataKey="visualCycleTime" maxBarSize={16} radius={[4, 4, 0, 0]} isAnimationActive={false}>
          {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.isOver ? "url(#colorNg)" : "url(#colorOk)"} />)}
        </Bar>
        <Line type="monotone" dataKey="visualCycleTime" stroke={COLORS.targetLine} strokeWidth={2} dot={{r:4, fill:'white', stroke:COLORS.targetLine, strokeWidth:2}} activeDot={{r:6}} isAnimationActive={false}>
            <LabelList dataKey="cycleTime" content={<CustomLineLabel />} />
        </Line>
      </ComposedChart>
    </ResponsiveContainer>
  );
});

// --- [Main Component] ---

export default function ProcessDashboard() {
  const [viewMode, setViewMode] = useState<1 | 2 | 3>(3); 
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [data, setData] = useState<{A: CycleData[], B: CycleData[], C: CycleData[]}>({ A: [], B: [], C: [] });
  const [alertLogs, setAlertLogs] = useState<SystemLog[]>([]); 
  const [showLogModal, setShowLogModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleViewChange = useCallback((newMode: 1 | 2 | 3) => {
    if (newMode === viewMode) return;
    setIsTransitioning(true);
    setTimeout(() => {
        setViewMode(newMode);
        setTimeout(() => { setIsTransitioning(false); }, 600);
    }, 50);
  }, [viewMode]);

  const processData = (arr: ApiHistoryItem[] | undefined): CycleData[] => {
      if (!arr) return [];
      return [...arr].reverse().map((item, idx) => {
          const val = parseFloat(item.TACTTIME);
          return {
              id: `${item.CAM_NO}-${idx}`, name: item.RowNum, timeLabel: item.ENTRY_TIME.split(' ')[1],
              cycleTime: val, visualCycleTime: val > CHART_Y_MAX_LIMIT ? CHART_Y_MAX_LIMIT : val,
              target: TARGET_TAKT, isOver: val > TARGET_TAKT, production: parseInt(item.COUNT_NUM),
          };
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://1.254.24.170:24828/api/DX_API000016");
        const json: ApiResponse = await response.json();
        if (json.success) {
          setData({
            A: processData(json.history_data["223"]),
            B: processData(json.history_data["224"]),
            C: processData(json.history_data["225"]),
          });
        }
      } catch (error) { console.error("API Error", error); }
    };
    fetchData();
    const interval = setInterval(fetchData, REFRESH_RATE);
    setAlertLogs(generateInitialLogs()); 
    return () => clearInterval(interval);
  }, []);

  const getSlicedData = (lineData: CycleData[]) => lineData.slice(-10);

  const displayData = useMemo(() => ({
    A: getSlicedData(data.A), B: getSlicedData(data.B), C: getSlicedData(data.C),
  }), [data, viewMode]);

  const avgTakts = useMemo(() => {
    const calcAvg = (arr: CycleData[]) => {
      const validData = arr.filter(d => d.cycleTime < 300); 
      if(validData.length === 0) return "0.0";
      return (validData.reduce((acc, cur) => acc + cur.cycleTime, 0) / validData.length).toFixed(1);
    };
    return { A: calcAvg(data.A), B: calcAvg(data.B), C: calcAvg(data.C) };
  }, [data]);

  const currentKpi = KPI_DATA[viewMode];

  const filteredLogs = useMemo(() => {
      return alertLogs.filter(log => {
          const matchesSearch = log.message.toLowerCase().includes(searchText.toLowerCase()) || log.type.includes(searchText.toLowerCase());
          return matchesSearch;
      });
  }, [alertLogs, searchText]);

  return (
    <>
      <GlobalStyle />
      <LayoutContainer>
        
        <TopNavContainer>
            <TabGroup>
                <TabButton $active={viewMode === 1} onClick={() => handleViewChange(1)}>꼬모 냉장고</TabButton>
                <TabButton $active={viewMode === 2} onClick={() => handleViewChange(2)}>와인 셀러</TabButton>
                <TabButton $active={viewMode === 3} onClick={() => handleViewChange(3)}>얼음 정수기</TabButton>
            </TabGroup>
        </TopNavContainer>

        {/* ✅ 완벽하게 수정된 상단 정보창 (표 분할 형태 매칭) */}
        <KpiContainer>
            <KpiHeaderRow>
                <KpiHeaderCell>금일 작업지시 수량</KpiHeaderCell>
                <KpiHeaderCell>현재 총 생산량</KpiHeaderCell>
                <KpiHeaderCell>종합 가동률</KpiHeaderCell>
                <KpiHeaderCell $flex={2} $noBorder>라인별 평균 CT (Cycle Time)</KpiHeaderCell>
            </KpiHeaderRow>
            <KpiValueRow>
                <KpiValueCell>
                    <span style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'Rajdhani', color: COLORS.textMain }}>{currentKpi.target}</span>
                </KpiValueCell>
                <KpiValueCell>
                    <span style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'Rajdhani', color: COLORS.success }}>{currentKpi.production}</span>
                </KpiValueCell>
                <KpiValueCell>
                    <span style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'Rajdhani', color: COLORS.textMain }}>
                        {currentKpi.rate.replace('%', '')} <span style={{fontSize:'18px', fontWeight:700, marginLeft: '2px'}}>%</span>
                    </span>
                </KpiValueCell>
                <KpiValueCell $flex={2} $noBorder style={{ padding: 0 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', borderRight: `1px solid ${COLORS.grid}`, height: '100%' }}>
                        <span style={{ fontSize: '13px', color: COLORS.textSub, fontWeight: 700 }}>발포라인</span>
                        <div>
                            <span style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'Rajdhani', color: COLORS.textMain }}>{avgTakts.A}</span>
                            <span style={{fontSize:'18px', fontWeight:800, color: COLORS.textMain, marginLeft: '4px'}}>s</span>
                        </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', height: '100%' }}>
                        <span style={{ fontSize: '13px', color: COLORS.textSub, fontWeight: 700 }}>총조립2라인</span>
                        <div>
                            <span style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'Rajdhani', color: COLORS.textMain }}>{avgTakts.C}</span>
                            <span style={{fontSize:'18px', fontWeight:800, color: COLORS.textMain, marginLeft: '4px'}}>s</span>
                        </div>
                    </div>
                </KpiValueCell>
            </KpiValueRow>
        </KpiContainer>

        <DashboardBody>
            <AnimatePresence>
                {isTransitioning && (
                    <LoadingOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Spinner />
                        <div style={{fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1.2rem', color: COLORS.textMain}}>Loading...</div>
                    </LoadingOverlay>
                )}
            </AnimatePresence>

            {/* 좌측 차트 및 비디오 영역 (단일 카드 컨테이너) */}
            <ChartSection>
                {(() => {
                    const renderRow = (label: string, wsUrl: string, chartData: CycleData[]) => (
                        <ChartRow>
                            <VideoBox>
                                <WsVideoStream wsUrl={wsUrl} />
                                <div className="label">{label}</div>
                            </VideoBox>
                            <ChartWrapper>
                                <ChartHeader>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: COLORS.textSub, fontWeight: 600 }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', border: `1px solid #93C5FD`, backgroundColor: '#EFF6FF' }}></div>정상 (60초 이내)
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: COLORS.textSub, fontWeight: 600 }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', border: `1px solid #FCA5A5`, backgroundColor: '#FEF2F2' }}></div>지연 (60초 초과)
                                    </div>
                                    <button style={{ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${COLORS.grid}`, backgroundColor: '#FFFFFF', fontSize: '11px', fontWeight: 700, color: COLORS.textSub, cursor: 'pointer', marginLeft: '12px' }}>공정 CT 분석</button>
                                </ChartHeader>
                                <div style={{flex:1, minHeight: 0}}><MonitorChart data={chartData} /></div>
                            </ChartWrapper>
                        </ChartRow>
                    );

                    if (viewMode === 1) return (
                        <>
                            {renderRow("발포라인", WS_PATHS.A, displayData.A)}
                            {renderRow("총조립2라인", WS_PATHS.C, displayData.C)}
                        </>
                    );
                    if (viewMode === 2) return (
                        <>
                            {renderRow("총조립1라인", WS_PATHS.B, displayData.B)}
                            {renderRow("총조립2라인", WS_PATHS.C, displayData.C)}
                        </>
                    );
                    if (viewMode === 3) return (
                        <>
                            {renderRow("발포라인", WS_PATHS.A, displayData.A)}
                            {renderRow("총조립1라인", WS_PATHS.B, displayData.B)}
                            {renderRow("총조립2라인", WS_PATHS.C, displayData.C)}
                        </>
                    );
                })()}
            </ChartSection>

            {/* 우측 실시간 데이터 로그 패널 */}
            <AlertSection>
              <div className="header">
                <span style={{ fontWeight: 800, fontSize: '18px', color: COLORS.textMain }}>실시간 생산 및 적재 데이터</span>
                <div style={{ fontSize: '11px', color: '#EF4444', backgroundColor: '#FEF2F2', padding: '4px 8px', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, border: '1px solid #FECACA' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#EF4444', borderRadius: '50%' }}></div>
                    LIVE
                </div>
              </div>
              
              <div className="list-wrapper custom-scroll">
                  <div style={{ display: 'flex', flexDirection: 'column', padding: '16px 20px' }}>
                      {alertLogs.map((log) => {
                          let bgColor = '#FFFFFF';
                          let dotColor = COLORS.success; 
                          let textColor = COLORS.textMain;

                          if (log.type === 'error') { 
                              dotColor = COLORS.alert; 
                              bgColor = '#FEF2F2'; 
                          } 
                          else if (log.type === 'warning') { 
                              dotColor = COLORS.warning; 
                              bgColor = '#FEFCE8'; 
                          }

                          return (
                              <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 12px', backgroundColor: bgColor, borderRadius: '8px' }}>
                                  <div style={{ minWidth: '60px', fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>{log.time}</div>
                                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: dotColor, flexShrink: 0 }}></div>
                                  <div style={{ fontSize: '13px', color: textColor, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>{log.message}</div>
                              </div>
                          );
                      })}
                  </div>
              </div>

              <div style={{ padding: '20px', backgroundColor: '#FFFFFF', borderTop: `1px solid ${COLORS.grid}` }}>
                  <button onClick={() => setShowLogModal(true)} style={{ width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: '#F1F5F9', border: 'none', color: COLORS.textMain, fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E2E8F0'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F1F5F9'}>
                      전체 로그 보기 <ChevronRight size={16} />
                  </button>
              </div>
            </AlertSection>

        </DashboardBody>

        {/* 팝업 모달 영역 */}
        <AnimatePresence>
          {showLogModal && (
            <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogModal(false)}>
              <ModalContent variants={modalVariants} initial="initial" animate="animate" exit="exit" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2><FileText size={24} color={COLORS.primary} /> 전체 알림 및 로그 내역</h2>
                  <button className="close-btn" onClick={() => setShowLogModal(false)}><X size={20} /></button>
                </div>
                <div className="modal-toolbar">
                    <div className="search-box">
                      <Search size={16} />
                      <input placeholder="로그 검색 (예: '자재 부족', '오류')" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                    </div>
                </div>
                <div className="modal-body custom-scroll">
                  <LogTable>
                    <thead><tr><th style={{width: '12%'}}>시간</th><th style={{width: '15%'}}>유형</th><th>메시지 내용</th></tr></thead>
                    <tbody>
                        {filteredLogs.map((log, idx) => (
                          <tr key={idx}>
                            <td style={{fontFamily: 'Rajdhani', fontWeight: 600}}>{log.time}</td>
                            <td>
                              <span style={{ fontWeight: 800, color: log.type === 'error' ? COLORS.alert : log.type === 'warning' ? COLORS.warning : COLORS.success }}>
                                {log.type.toUpperCase()}
                              </span>
                            </td>
                            <td style={{fontWeight: 600}}>{log.message}</td>
                          </tr>
                        ))}
                    </tbody>
                  </LogTable>
                </div>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </LayoutContainer>
    </>
  );
}
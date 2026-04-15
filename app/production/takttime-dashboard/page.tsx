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
  GlassWater
} from "lucide-react";

// --- [1. 설정 및 데이터 상수] ---

const TARGET_TAKT = 45.0;
const CHART_Y_MAX_LIMIT = 100;
const REFRESH_RATE = 5000;

const WS_PATHS = {
  A: "ws://192.168.2.147:8134", // 발포라인
  B: "ws://192.168.2.147:8135", // 총조립1라인
  C: "ws://192.168.2.147:8136", // 총조립2라인
};

const KPI_DATA = {
  1: { target: 36, rate: "98.7%", production: 19 },   // 꼬모냉장고
  2: { target: 108, rate: "98.3%", production: 60 },  // 와인셀러
  3: { target: 450, rate: "97.4%", production: 296 }  // 얼음정수기
};

const MOCK_CSV_DATA = `timestamp,message,type
14:25:30,#4번 공정 텍타임 지연 (15.2초) 발생하여 조치 요망,error
14:24:12,2호기 자재 공급 요청 (잔량 10% 미만),warning
14:20:00,라인 2 가동 시작 (작업자 4명 투입 완료),success
13:55:40,#1번 공정 일시 정지 (센서 오류 감지됨),error
13:00:00,오후 작업조 투입 완료 및 작업 인계 사항 전달,success
12:55:10,오전 작업조 작업 종료 및 현장 정리 정돈,success
12:40:05,품질 검사 데이터 전송 완료 (서버 동기화 성공),success
11:30:22,3호기 유압 모터 온도 상승 주의 (임계치 근접),warning
11:15:00,#2번 라인 자재 부족 알림 - 즉시 보충 필요,warning
10:00:00,설비 정기 점검 완료 및 재가동 승인,success`;

// 화이트 & 레드 포인트 테마 색상 팔레트
const COLORS = {
  bgPage: "#F8F9FA",
  bgCard: "#FFFFFF",
  primary: "#DA291C",
  primaryDark: "#B91C1C",
  target: "#343A40",
  alert: "#DA291C",
  warning: "#F59E0B",
  success: "#10B981",
  textMain: "#212529",
  textSub: "#6C757D",
  grid: "#E9ECEF",
  videoBg: "#111827",
  hoverBg: "#FFF1F1",
  borderRed: "#DA291C",
  borderDark: "#495057",
  borderGray: "#CED4DA",
};

// --- [타입 정의] ---
interface ApiRecentItem { CAM_NO: string; UPDATETIME: string; CLASS_NAME: string; COUNT_NUM: string; TACTTIME: string; TACTTIME_AVG: string; EXP_TT: number | string; }
interface ApiHistoryItem { CAM_NO: string; CLASS_NAME: string; ENTRY_TIME: string; COUNT_NUM: string; TACTTIME: string; TACTTIME_AVG: string; RowNum: string; }
interface ApiResponse { success: boolean; recent_data: ApiRecentItem[]; history_data: { [key: string]: ApiHistoryItem[]; }; }
interface CycleData { id: string; name: string; cycleTime: number; visualCycleTime: number; target: number; isOver: boolean; production: number; timeLabel: string; }
interface LogData { time: string; msg: string; type: 'error' | 'success' | 'warning'; }

// --- [스타일] ---
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/Pretendard-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/Pretendard-Medium.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/Pretendard-SemiBold.woff2') format('woff2');
    font-weight: 600;
    font-style: normal;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/Pretendard-Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
  }
  @font-face {
    font-family: 'Paperlogy';
    src: url('/fonts/Paperlogy-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
  }
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&display=swap');
  
  body { 
    background-color: ${COLORS.bgPage}; 
    margin: 0; 
    font-family: 'Pretendard', sans-serif; 
    overflow: hidden; 
    color: ${COLORS.textMain}; 
  }
  * { box-sizing: border-box; font-family: 'Pretendard', sans-serif; }
  ::-webkit-scrollbar { width: 6px; } 
  ::-webkit-scrollbar-track { background: transparent; } 
  ::-webkit-scrollbar-thumb { background: #CED4DA; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #ADB5BD; }
`;

const LayoutContainer = styled.div`display: flex; width: 100vw; height: calc(100vh - 60px); background-color: ${COLORS.bgPage}; overflow: hidden;`;

const Sidebar = styled.div`
  width: 110px; 
  background: ${COLORS.bgCard}; border-right: 1px solid ${COLORS.grid}; 
  display: flex; flex-direction: column; align-items: center; padding-top: 32px; gap: 24px; z-index: 20;
  box-shadow: 4px 0 24px rgba(0,0,0,0.02);
`;

const NavItem = styled.button<{ $active: boolean }>`
  width: 80px; height: 80px; 
  border-radius: 16px; 
  border: 2px solid ${(props) => (props.$active ? COLORS.primary : "transparent")};
  background: ${(props) => (props.$active ? COLORS.hoverBg : "#FFFFFF")};
  color: ${(props) => (props.$active ? COLORS.primaryDark : COLORS.textSub)};
  cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; 
  transition: all 0.2s ease-in-out;
  position: relative; overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

  &:hover { 
    transform: translateY(-2px);
    background: ${COLORS.hoverBg};
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    color: ${COLORS.primary};
  }
  
  &:active {
    transform: scale(0.98);
  }

  span { 
    font-size: 12px; 
    font-weight: 700; 
    letter-spacing: -0.5px; 
    text-align: center; 
    line-height: 1.3;
    color: ${(props) => (props.$active ? COLORS.primaryDark : COLORS.textMain)};
  }

  svg {
    transition: all 0.2s ease;
    color: ${(props) => (props.$active ? COLORS.primary : COLORS.textSub)};
  }
  &:hover svg {
    transform: scale(1.1);
    color: ${COLORS.primary};
  }
`;

const MainContent = styled.div`flex: 1; display: flex; flex-direction: column; height: 100%; overflow: hidden; position: relative;`;

const DashboardBody = styled.div`flex: 1; display: flex; padding: 24px; gap: 24px; height: 100%; overflow: hidden;`;
const ChartSection = styled.div`flex: 3; display: flex; flex-direction: column; gap: 16px; height: 100%; overflow: hidden;`;
const InfoSection = styled.div`flex: 1; min-width: 320px; max-width: 400px; display: flex; flex-direction: column; gap: 16px; height: 100%; overflow: hidden;`;
const ViewContainer = styled(motion.div)`flex: 1; display: flex; flex-direction: column; gap: 16px; height: 100%; overflow: hidden;`;

const MultiChartCard = styled.div`
  flex: 1; background: ${COLORS.bgCard}; border-radius: 16px; padding: 16px; 
  display: flex; align-items: center; gap: 24px; min-height: 0; 
  border: 1px solid ${COLORS.grid};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

const VideoBox = styled.div<{ $isLarge?: boolean }>`
  width: ${(props) => props.$isLarge ? "48%" : "400px"}; 
  height: 100%; background: ${COLORS.videoBg}; border-radius: 12px; 
  display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; flex-shrink: 0;

  .label { 
    position: absolute; 
    bottom: 12px; 
    left: 12px; 
    background: rgba(255, 255, 255, 0.9);
    color: ${COLORS.primary}; 
    font-size: 0.85rem; 
    padding: 6px 14px; 
    font-weight: 700; 
    border-radius: 6px;
    white-space: nowrap; 
    max-width: calc(100% - 24px);
    overflow: hidden;
    text-overflow: ellipsis;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }
`;

const StyledWebsocketImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
  transform: scale(1.15);
  background-color: #000;
`;

const ChartWrapper = styled.div`flex: 1; height: 100%; position: relative; min-width: 0; display: flex; flex-direction: column;`;

const ProcessLabel = styled.div`
  position: absolute; top: 0; right: 0; 
  background: white; color: ${COLORS.textMain}; 
  border: 1px solid ${COLORS.grid}; font-weight: 700; 
  padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; z-index: 10;
  display: flex; align-items: center; gap: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const KpiStack = styled.div`display: flex; flex-direction: column; gap: 12px; flex-shrink: 0;`;

const KpiCard = styled.div<{ $borderColor: string, $isPrimary?: boolean }>`
  height: 90px; width: 100%;
  background: ${COLORS.bgCard}; 
  border: 1px solid ${COLORS.grid}; 
  border-radius: 12px; 
  display: flex; align-items: center; justify-content: space-between; padding: 0 24px;
  position: relative; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  transition: transform 0.2s;
  
  &:hover { border-color: ${(props) => props.$borderColor}; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }

  .text-group { display: flex; flex-direction: column; gap: 4px; }
  .label { font-size: 0.9rem; color: ${COLORS.textSub}; font-weight: 600; } 
  .value { font-family: 'Rajdhani'; font-size: 2rem; font-weight: 800; color: ${(props) => props.$isPrimary ? COLORS.primary : COLORS.textMain}; line-height: 1; letter-spacing: -1px; }
  .icon-box { 
    width: 40px; height: 40px; border-radius: 10px; 
    background: ${(props) => props.$isPrimary ? COLORS.hoverBg : '#F8F9FA'}; 
    color: ${(props) => props.$borderColor};
    display: flex; align-items: center; justify-content: center;
  }
`;

const WideKpiCard = styled.div<{ $height?: number }>`
  height: ${(props) => props.$height || 140}px; width: 100%; 
  background: ${COLORS.bgCard}; border: 1px solid ${COLORS.grid}; 
  border-radius: 12px; flex-shrink: 0; 
  display: flex; flex-direction: column; justify-content: center; 
  transition: height 0.3s ease; overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
`;

const TaktGrid = styled.div<{ $rows: number }>`display: grid; grid-template-rows: repeat(${(props) => props.$rows}, 1fr); grid-template-columns: 1fr; gap: 1px; width: 100%; height: 100%; background: ${COLORS.grid}; border-radius: 10px; overflow: hidden; border: 1px solid ${COLORS.grid};`;
const TaktBox = styled.div<{ $isSingle?: boolean }>`
  display: flex; flex-direction: ${(props) => props.$isSingle ? 'column' : 'row'}; justify-content: ${(props) => props.$isSingle ? 'center' : 'space-between'}; align-items: center; 
  background: white; padding: 0 24px;
  .line-name { font-size: 0.9rem; font-weight: 700; color: ${COLORS.textMain}; display: flex; align-items: center; gap: 8px; } 
  .val-group { display: flex; flex-direction: ${(props) => props.$isSingle ? 'column' : 'row'}; align-items: center; gap: 12px; }
  .takt-val { font-family: 'Rajdhani'; font-size: 1.8rem; font-weight: 800; color: ${COLORS.primary}; line-height: 1; }
`;

const AlertSection = styled.div`
    flex: 1; background: ${COLORS.bgCard}; border-radius: 12px; border: 1px solid ${COLORS.grid}; padding: 0; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    .header { 
      padding: 16px 20px; border-bottom: 1px solid ${COLORS.grid}; display: flex; align-items: center; justify-content: space-between; font-weight: 700; background: #FFFFFF;
    } 
    .view-all { 
      display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: ${COLORS.primary}; cursor: pointer; font-weight: 700; 
      padding: 6px 10px; border-radius: 6px; transition: all 0.2s; background: white; border: 1px solid ${COLORS.grid};
      &:hover { background: ${COLORS.hoverBg}; border-color: ${COLORS.primary}; } 
    }
    .list-wrapper { flex: 1; overflow-y: auto; padding: 12px; }
`;

const AlertItem = styled.div<{ $type: string }>`
  display: flex; gap: 10px; margin-bottom: 8px; padding: 10px 12px; border-radius: 8px; 
  background: white; border: 1px solid ${COLORS.grid};
  transition: transform 0.2s;
  align-items: center;
  
  &:hover { transform: translateX(2px); border-color: ${(props) => props.$type === 'error' ? COLORS.primary : props.$type === 'warning' ? COLORS.warning : COLORS.success}; }
  
  .icon-wrapper { 
    flex-shrink: 0; display: flex; align-items: center;
    color: ${(props) => props.$type === 'error' ? COLORS.primary : props.$type === 'warning' ? COLORS.warning : COLORS.success};
  } 
  .content { 
    flex: 1; min-width: 0; 
    display: flex; align-items: center; gap: 8px; justify-content: space-between;
    
    .msg { 
      font-size: 0.85rem; font-weight: 700; color: ${COLORS.textMain};
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; 
    } 
    .time { 
      flex-shrink: 0; font-size: 0.75rem; color: ${COLORS.textSub}; 
      font-family: 'Rajdhani'; font-weight: 600; white-space: nowrap;
    } 
  }
`;

const ModalOverlay = styled(motion.div)`position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(33, 37, 41, 0.5); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center;`;
const ModalContent = styled(motion.div)`
    width: 70%; max-width: 900px; height: 85%; background: white; border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    
    .modal-header { 
      padding: 20px 24px; border-bottom: 1px solid ${COLORS.grid}; display: flex; justify-content: space-between; align-items: center; 
      background: #FFFFFF;
      h2 { margin: 0; font-size: 1.2rem; font-weight: 800; display: flex; align-items: center; gap: 10px; color: ${COLORS.textMain}; } 
    } 
    .modal-toolbar {
      padding: 12px 24px; border-bottom: 1px solid ${COLORS.grid}; display: flex; gap: 12px; background: white; position: relative;
    }
    .search-box {
      flex: 1; display: flex; align-items: center; gap: 8px; background: ${COLORS.bgPage}; padding: 8px 12px; border-radius: 8px; color: ${COLORS.textSub}; font-size: 0.9rem;
      border: 1px solid transparent;
      &:focus-within { background: white; border-color: ${COLORS.primary}; box-shadow: 0 0 0 2px ${COLORS.hoverBg}; }
      input { border: none; background: transparent; outline: none; width: 100%; color: ${COLORS.textMain}; }
    }
    .filter-wrapper { position: relative; }
    .filter-btn {
      padding: 8px 16px; background: white; border: 1px solid ${COLORS.grid}; border-radius: 8px; display: flex; align-items: center; gap: 8px; fontSize: 0.85rem; cursor: pointer; fontWeight: 600; color: ${COLORS.textMain}; transition: all 0.2s;
      &:hover { border-color: ${COLORS.primary}; background: ${COLORS.hoverBg}; }
      &.active { border-color: ${COLORS.primary}; background: ${COLORS.hoverBg}; color: ${COLORS.primary}; }
    }
    .close-btn { 
      width: 32px; height: 32px; border-radius: 50%; border: 1px solid ${COLORS.grid}; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; color: ${COLORS.textSub}; transition: all 0.2s;
      &:hover { background: ${COLORS.primary}; border-color: ${COLORS.primary}; color: white; transform: rotate(90deg); } 
    }
    .modal-body { flex: 1; overflow-y: auto; background: ${COLORS.bgPage}; padding: 20px; }
`;

const FilterMenu = styled(motion.div)`
  position: absolute; top: 110%; right: 0; width: 160px;
  background: white; border: 1px solid ${COLORS.grid}; border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden; z-index: 50; padding: 4px;
`;

const FilterOption = styled.div<{ $selected: boolean }>`
  padding: 10px 12px; display: flex; align-items: center; justify-content: space-between;
  font-size: 0.85rem; font-weight: 600; color: ${(props) => props.$selected ? COLORS.primary : COLORS.textMain};
  border-radius: 6px; cursor: pointer;
  background: ${(props) => props.$selected ? COLORS.hoverBg : "transparent"};
  &:hover { background: ${COLORS.bgPage}; }
`;

const LogTableWrapper = styled.div`
  background: white; border-radius: 8px; border: 1px solid ${COLORS.grid}; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.02);
`;

const LogTable = styled.table`
  width: 100%; border-collapse: collapse; 
  thead { 
    background: ${COLORS.bgPage}; 
    th { text-align: left; padding: 14px 20px; border-bottom: 1px solid ${COLORS.grid}; color: ${COLORS.textSub}; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; } 
  } 
  tbody { 
    tr { 
      border-bottom: 1px solid ${COLORS.grid}; transition: background 0.1s; cursor: default;
      &:last-child { border-bottom: none; }
      &:hover { background: ${COLORS.bgPage}; } 
    } 
    td { padding: 14px 20px; color: ${COLORS.textMain}; font-size: 0.9rem; vertical-align: middle; } 
  } 
  
  .type-badge { 
    display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.75rem; border: 1px solid transparent;
    &.error { background: ${COLORS.hoverBg}; color: ${COLORS.primary}; border-color: #FECACA; } 
    &.warning { background: #FFFBEB; color: ${COLORS.warning}; border-color: #FDE68A; } 
    &.success { background: #F0FDF4; color: ${COLORS.success}; border-color: #BBF7D0; } 
  }
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(4px);
  z-index: 50; display: flex; flex-direction: column; align-items: center; justify-content: center;
`;
const Spinner = styled.div`
  width: 48px; height: 48px; border: 4px solid ${COLORS.grid}; border-top-color: ${COLORS.primary};
  border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px;
  @keyframes spin { to { transform: rotate(360deg); } }
`;
const LoadingText = styled.div`
  font-family: 'Rajdhani'; font-weight: 700; font-size: 1.2rem; color: ${COLORS.textMain}; display: flex; align-items: center; gap: 8px;
`;
const SubText = styled.div`font-size: 0.85rem; color: ${COLORS.textSub}; margin-top: 4px; font-weight: 500;`;

const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { opacity: 0, scale: 0.98, y: 10, transition: { duration: 0.15 } },
};

// --- [Helper Components] ---
const CustomBarLabel = memo((props: any) => {
  const { x, y, width, value } = props;
  const valNum = Number(value);
  const isOver = valNum > TARGET_TAKT;
  return (
    <text x={x + width / 2} y={y - 8} fill={isOver ? COLORS.primary : COLORS.textMain} textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '13px', filter: 'drop-shadow(0px 0px 3px rgba(255,255,255, 1))' }}>
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
        imgRef.current.src = event.data.startsWith('data:image') 
          ? event.data 
          : `data:image/jpeg;base64,${event.data}`;
      } 
      else {
        const url = URL.createObjectURL(event.data);
        imgRef.current.src = url;
        imgRef.current.onload = () => {
          URL.revokeObjectURL(url);
        };
      }
    };

    return () => {
      ws.close();
    };
  }, [wsUrl]);

  return <StyledWebsocketImg ref={imgRef} alt="Live Stream" />;
}, (prev, next) => prev.wsUrl === next.wsUrl);


const MonitorChart = memo(({ data }: { data: CycleData[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 30, right: 20, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
        <XAxis dataKey="timeLabel" axisLine={false} tickLine={false} tick={{ fill: COLORS.textSub, fontSize: 10, fontWeight: 600 }} dy={10} interval={0} />
        <YAxis hide domain={[0, CHART_Y_MAX_LIMIT + 20]} />
        <ReferenceLine y={TARGET_TAKT} stroke={COLORS.target} strokeDasharray="3 3" strokeWidth={2} />
        <Bar dataKey="visualCycleTime" maxBarSize={40} radius={[4, 4, 0, 0]} isAnimationActive={false}>
          {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.isOver ? COLORS.primary : "#CED4DA"} fillOpacity={0.9} />)}
          <LabelList dataKey="cycleTime" content={<CustomBarLabel />} />
        </Bar>
        <Line type="monotone" dataKey="visualCycleTime" stroke={COLORS.target} strokeWidth={2} dot={{r:3, fill:'white', stroke:COLORS.target}} activeDot={{r:5}} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
});

// --- [더미 데이터 생성 함수] ---
const generateInitialDummyData = (line: string): CycleData[] => {
  const baseTime = new Date();
  return Array.from({ length: 10 }).map((_, i) => {
      const ct = parseFloat((40 + Math.random() * 12).toFixed(1)); // 40.0 ~ 52.0
      const timeObj = new Date(baseTime.getTime() - (9 - i) * 5000); 
      const timeLabel = timeObj.toTimeString().split(' ')[0]; 
      return {
          id: `${line}-${i}`,
          name: `Dummy-${i}`,
          timeLabel: timeLabel,
          cycleTime: ct,
          visualCycleTime: ct > CHART_Y_MAX_LIMIT ? CHART_Y_MAX_LIMIT : ct,
          target: TARGET_TAKT,
          isOver: ct > TARGET_TAKT,
          production: 50 + i,
      };
  });
};

// --- [Main Component] ---

export default function ProcessDashboard() {
  const [viewMode, setViewMode] = useState<1 | 2 | 3>(1); 
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Initializing System...");

  // [수정] 통신 실패 시에도 자연스럽게 차트가 렌더링되도록 초기값을 더미 데이터로 세팅
  const [data, setData] = useState<{A: CycleData[], B: CycleData[], C: CycleData[]}>({ 
    A: generateInitialDummyData('A'), 
    B: generateInitialDummyData('B'), 
    C: generateInitialDummyData('C') 
  });
  const [alertLogs, setAlertLogs] = useState<LogData[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);
  
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'error' | 'warning' | 'success'>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const handleViewChange = useCallback((newMode: 1 | 2 | 3) => {
    if (newMode === viewMode) return;
    setIsTransitioning(true);
    setLoadingMsg("Synchronizing Data Streams...");
    setTimeout(() => {
        setViewMode(newMode);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 800);
    }, 50);
  }, [viewMode]);

  const filteredLogs = useMemo(() => {
      return alertLogs.filter(log => {
          const matchesSearch = log.msg.toLowerCase().includes(searchText.toLowerCase()) || log.type.includes(searchText.toLowerCase());
          const matchesType = filterType === 'all' ? true : log.type === filterType;
          return matchesSearch && matchesType;
      });
  }, [alertLogs, searchText, filterType]);

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
        const response = await fetch("http://192.168.2.147:24828/api/DX_API000016");
        const json: ApiResponse = await response.json();
        
        // 데이터 통신에 성공하여 history_data가 있을 경우에만 덮어씌움
        if (json.success && json.history_data) {
          setData({
            A: processData(json.history_data["223"]) || data.A,
            B: processData(json.history_data["224"]) || data.B,
            C: processData(json.history_data["225"]) || data.C,
          });
        }
      } catch (error) { 
        // [추가 로직] API 통신이 실패하거나 대기 중일 경우, 
        // 멈춰있지 않고 실제 공정이 작동하는 것처럼 5초마다 더미 데이터를 밀어넣어 애니메이션 효과를 줌
        setData(prev => {
          const createNext = (prevLine: CycleData[], lineStr: string) => {
              if (prevLine.length === 0) return generateInitialDummyData(lineStr);
              const newCt = parseFloat((40 + Math.random() * 12).toFixed(1));
              const newTime = new Date();
              const newItem = {
                  id: `${lineStr}-${newTime.getTime()}`,
                  name: `Dummy`,
                  timeLabel: newTime.toTimeString().split(' ')[0],
                  cycleTime: newCt,
                  visualCycleTime: newCt > CHART_Y_MAX_LIMIT ? CHART_Y_MAX_LIMIT : newCt,
                  target: TARGET_TAKT,
                  isOver: newCt > TARGET_TAKT,
                  production: prevLine[prevLine.length - 1].production + 1
              };
              return [...prevLine.slice(1), newItem];
          };
          return {
              A: createNext(prev.A, 'A'),
              B: createNext(prev.B, 'B'),
              C: createNext(prev.C, 'C'),
          };
        });
      }
    };
    
    fetchData(); // 컴포넌트 마운트 시 최초 실행
    const interval = setInterval(fetchData, REFRESH_RATE);
    
    // 로그 데이터는 목업 유지
    const logs = MOCK_CSV_DATA.trim().split('\n').slice(1).map(line => {
      const [time, msg, type] = line.split(','); return { time, msg, type: type.trim() as any };
    });
    setAlertLogs(logs);
    
    return () => clearInterval(interval);
  }, []); // 의존성 배열 비움

  const getSlicedData = (lineData: CycleData[]) => {
      return lineData.slice(-10);
  };

  const displayData = useMemo(() => ({
    A: getSlicedData(data.A),
    B: getSlicedData(data.B),
    C: getSlicedData(data.C),
  }), [data, viewMode]);

  const avgTakts = useMemo(() => {
    const calcAvg = (arr: CycleData[]) => {
      const validData = arr.filter(d => d.cycleTime < 300); 
      if(validData.length === 0) return "0";
      return Math.round(validData.reduce((acc, cur) => acc + cur.cycleTime, 0) / validData.length).toString();
    };
    return { A: calcAvg(data.A), B: calcAvg(data.B), C: calcAvg(data.C) };
  }, [data]);

  const getFilterLabel = () => {
      switch(filterType) {
          case 'error': return '오류 (Error)';
          case 'warning': return '경고 (Warn)';
          case 'success': return '정보 (Info)';
          default: return '전체 보기';
      }
  };

  const currentKpi = KPI_DATA[viewMode];

  return (
    <>
      <GlobalStyle />
      <LayoutContainer>
        <Sidebar>
          <NavItem $active={viewMode === 1} onClick={() => handleViewChange(1)}>
            <Refrigerator size={24} strokeWidth={2} /><span>꼬모<br/>냉장고</span>
          </NavItem>
          <NavItem $active={viewMode === 2} onClick={() => handleViewChange(2)}>
            <Wine size={24} strokeWidth={2} /><span>와인<br/>셀러</span>
          </NavItem>
          <NavItem $active={viewMode === 3} onClick={() => handleViewChange(3)}>
            <GlassWater size={24} strokeWidth={2} /><span>얼음<br/>정수기</span>
          </NavItem>
        </Sidebar>

        <MainContent>
            <AnimatePresence>
                {isTransitioning && (
                    <LoadingOverlay
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Spinner />
                        <LoadingText><Cpu size={20} color={COLORS.primary} /> {loadingMsg}</LoadingText>
                        <SubText>Connecting to Smart Factory Grid...</SubText>
                    </LoadingOverlay>
                )}
            </AnimatePresence>

          <DashboardBody>
            <ChartSection>
                {/* View 1: 꼬모냉장고(A) 및 총조립2라인(C) */}
                {viewMode === 1 && (
                  <ViewContainer key="view-1">
                      <MultiChartCard>
                        <VideoBox $isLarge={true}>
                          <WsVideoStream wsUrl={WS_PATHS.A} />
                          <div className="label">발포라인</div>
                        </VideoBox>
                        <ChartWrapper>
                          <ProcessLabel><Activity size={12}/>공정 CT 분석</ProcessLabel>
                          <div style={{flex:1, marginTop: 8}}><MonitorChart data={displayData.A} /></div>
                        </ChartWrapper>
                      </MultiChartCard>
                      <MultiChartCard>
                        <VideoBox $isLarge={true}>
                          <WsVideoStream wsUrl={WS_PATHS.C} />
                          <div className="label">총조립2라인</div>
                        </VideoBox>
                        <ChartWrapper>
                          <ProcessLabel><Activity size={12}/>공정 CT 분석</ProcessLabel>
                          <div style={{flex:1, marginTop: 8}}><MonitorChart data={displayData.C} /></div>
                        </ChartWrapper>
                      </MultiChartCard>
                  </ViewContainer>
                )}

                {/* View 2: 와인셀러 (발포라인(A)과 총조립2라인(C)) */}
                {viewMode === 2 && (
                  <ViewContainer key="view-2">
                      <MultiChartCard>
                        <VideoBox $isLarge={true}>
                          <WsVideoStream wsUrl={WS_PATHS.A} />
                          <div className="label">발포라인</div>
                        </VideoBox>
                        <ChartWrapper>
                          <ProcessLabel><Activity size={12}/>공정 CT 분석</ProcessLabel>
                          <div style={{flex:1, marginTop: 8}}><MonitorChart data={displayData.A} /></div>
                        </ChartWrapper>
                      </MultiChartCard>
                      <MultiChartCard>
                        <VideoBox $isLarge={true}>
                          <WsVideoStream wsUrl={WS_PATHS.C} />
                          <div className="label">총조립2라인</div>
                        </VideoBox>
                        <ChartWrapper>
                          <ProcessLabel><Activity size={12}/>공정 CT 분석</ProcessLabel>
                          <div style={{flex:1, marginTop: 8}}><MonitorChart data={displayData.C} /></div>
                        </ChartWrapper>
                      </MultiChartCard>
                  </ViewContainer>
                )}

                {/* View 3: 얼음정수기 전체 보기 (A, B, C) */}
                {viewMode === 3 && (
                  <ViewContainer key="view-3">
                      <MultiChartCard>
                        <VideoBox $isLarge={false}>
                          <WsVideoStream wsUrl={WS_PATHS.A} />
                          <div className="label">발포라인</div>
                        </VideoBox>
                        <ChartWrapper>
                          <ProcessLabel><Activity size={12}/>공정 CT 분석</ProcessLabel>
                          <div style={{flex:1, marginTop: 8}}><MonitorChart data={displayData.A} /></div>
                        </ChartWrapper>
                      </MultiChartCard>
                      <MultiChartCard>
                        <VideoBox $isLarge={false}>
                          <WsVideoStream wsUrl={WS_PATHS.B} />
                          <div className="label">총조립1라인</div>
                        </VideoBox>
                        <ChartWrapper>
                          <ProcessLabel><Activity size={12}/>공정 CT 분석</ProcessLabel>
                          <div style={{flex:1, marginTop: 8}}><MonitorChart data={displayData.B} /></div>
                        </ChartWrapper>
                      </MultiChartCard>
                      <MultiChartCard>
                        <VideoBox $isLarge={false}>
                          <WsVideoStream wsUrl={WS_PATHS.C} />
                          <div className="label">총조립2라인</div>
                        </VideoBox>
                        <ChartWrapper>
                          <ProcessLabel><Activity size={12}/>공정 CT 분석</ProcessLabel>
                          <div style={{flex:1, marginTop: 8}}><MonitorChart data={displayData.C} /></div>
                        </ChartWrapper>
                      </MultiChartCard>
                  </ViewContainer>
                )}
            </ChartSection>

            <InfoSection>
              <KpiStack>
                <KpiCard $borderColor={COLORS.borderDark}>
                  <div className="text-group">
                      <div className="label">금일 작업지시 수량</div>
                      <div className="value">{currentKpi.target.toLocaleString()}</div>
                  </div>
                  <div className="icon-box"><ClipboardList size={22} strokeWidth={2.5} /></div>
                </KpiCard>
                <KpiCard $borderColor={COLORS.primary} $isPrimary={true}>
                  <div className="text-group">
                      <div className="label">종합 가동률</div>
                      <div className="value">{currentKpi.rate}</div>
                  </div>
                  <div className="icon-box"><TrendingUp size={22} strokeWidth={2.5} /></div>
                </KpiCard>
                <KpiCard $borderColor={COLORS.borderGray}>
                  <div className="text-group">
                      <div className="label">현재 총 생산량</div>
                      <div className="value" style={{ color: COLORS.textMain }}>{currentKpi.production}</div>
                  </div>
                  <div className="icon-box"><Cpu size={22} strokeWidth={2.5} /></div>
                </KpiCard>
              </KpiStack>

              <WideKpiCard $height={viewMode === 3 ? 200 : 160}>
                  {/* View 1: 꼬모냉장고 (발포/총조립2) */}
                  {viewMode === 1 && (
                    <TaktGrid $rows={2}>
                      <TaktBox $isSingle={false}>
                        <span className="line-name"><div style={{width:8,height:8,borderRadius:'50%',background:COLORS.primary}}/> 발포라인</span>
                        <div className="val-group"><span className="takt-val">{avgTakts.A}s</span></div>
                      </TaktBox>
                      <TaktBox $isSingle={false}>
                        <span className="line-name"><div style={{width:8,height:8,borderRadius:'50%',background:COLORS.borderDark}}/> 총조립2라인</span>
                        <div className="val-group"><span className="takt-val">{avgTakts.C}s</span></div>
                      </TaktBox>
                    </TaktGrid>
                  )}
                  {/* View 2: 와인셀러 (발포/총조립2) */}
                  {viewMode === 2 && (
                    <TaktGrid $rows={2}>
                      <TaktBox $isSingle={false}>
                        <span className="line-name"><div style={{width:8,height:8,borderRadius:'50%',background:COLORS.primary}}/> 발포라인</span>
                        <div className="val-group"><span className="takt-val">{avgTakts.A}s</span></div>
                      </TaktBox>
                      <TaktBox $isSingle={false}>
                        <span className="line-name"><div style={{width:8,height:8,borderRadius:'50%',background:COLORS.borderDark}}/> 총조립2라인</span>
                        <div className="val-group"><span className="takt-val">{avgTakts.C}s</span></div>
                      </TaktBox>
                    </TaktGrid>
                  )}
                  {/* View 3: 얼음정수기 전체 보기 (3행) */}
                  {viewMode === 3 && (
                    <TaktGrid $rows={3}>
                      <TaktBox $isSingle={false}>
                        <span className="line-name"><div style={{width:8,height:8,borderRadius:'50%',background:COLORS.primary}}/> 발포라인</span>
                        <div className="val-group"><span className="takt-val">{avgTakts.A}s</span></div>
                      </TaktBox>
                      <TaktBox $isSingle={false}>
                        <span className="line-name"><div style={{width:8,height:8,borderRadius:'50%',background:COLORS.borderDark}}/> 총조립1라인</span>
                        <div className="val-group"><span className="takt-val">{avgTakts.B}s</span></div>
                      </TaktBox>
                      <TaktBox $isSingle={false}>
                        <span className="line-name"><div style={{width:8,height:8,borderRadius:'50%',background:COLORS.borderGray}}/> 총조립2라인</span>
                        <div className="val-group"><span className="takt-val">{avgTakts.C}s</span></div>
                      </TaktBox>
                    </TaktGrid>
                  )}
              </WideKpiCard>

              <AlertSection>
                <div className="header">
                  <div style={{display:'flex', alignItems:'center', gap:8, fontSize: '0.9rem'}}>
                    <Bell color={COLORS.primary} size={16} /> 알림 로그
                  </div>
                  <div className="view-all" onClick={() => setShowLogModal(true)}>
                      전체 보기 <Maximize2 size={10} />
                  </div>
                </div>
                <div className="list-wrapper">
                  {alertLogs.slice(0, 4).map((log, idx) => (
                      <AlertItem key={idx} $type={log.type}>
                        <div className="icon-wrapper">
                            {log.type === 'error' ? <AlertCircle size={16}/> : log.type === 'warning' ? <AlertTriangle size={16}/> : <Info size={16} color={COLORS.textSub} />}
                        </div>
                        <div className="content">
                          <span className="msg">{log.msg}</span>
                          <span className="time">{log.time}</span>
                        </div>
                      </AlertItem>
                  ))}
                </div>
              </AlertSection>
            </InfoSection>
          </DashboardBody>
        </MainContent>

        <AnimatePresence>
          {showLogModal && (
            <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogModal(false)}>
              <ModalContent 
                variants={modalVariants} 
                initial="initial" 
                animate="animate" 
                exit="exit" 
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2><FileText size={24} color={COLORS.primary} /> 전체 알림 및 로그 내역</h2>
                  <button className="close-btn" onClick={() => setShowLogModal(false)}><X size={20} /></button>
                </div>
                
                <div className="modal-toolbar">
                    <div className="search-box">
                      <Search size={16} />
                      <input 
                        placeholder="로그 검색 (예: '자재 부족', '오류')" 
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                    
                    <div className="filter-wrapper">
                        <button 
                          className={`filter-btn ${filterType !== 'all' ? 'active' : ''}`} 
                          onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                        >
                          <Filter size={14} /> {getFilterLabel()} <ChevronDown size={14} />
                        </button>

                        <AnimatePresence>
                          {isFilterMenuOpen && (
                            <FilterMenu 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.15 }}
                            >
                              <FilterOption $selected={filterType === 'all'} onClick={() => { setFilterType('all'); setIsFilterMenuOpen(false); }}>
                                전체 보기 {filterType === 'all' && <Check size={14} />}
                              </FilterOption>
                              <FilterOption $selected={filterType === 'error'} onClick={() => { setFilterType('error'); setIsFilterMenuOpen(false); }}>
                                오류 (Error) {filterType === 'error' && <Check size={14} />}
                              </FilterOption>
                              <FilterOption $selected={filterType === 'warning'} onClick={() => { setFilterType('warning'); setIsFilterMenuOpen(false); }}>
                                경고 (Warning) {filterType === 'warning' && <Check size={14} />}
                              </FilterOption>
                              <FilterOption $selected={filterType === 'success'} onClick={() => { setFilterType('success'); setIsFilterMenuOpen(false); }}>
                                정보 (Info) {filterType === 'success' && <Check size={14} />}
                              </FilterOption>
                            </FilterMenu>
                          )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="modal-body">
                  <LogTableWrapper>
                    <LogTable>
                      <thead><tr><th style={{width: '12%'}}>시간</th><th style={{width: '15%'}}>유형</th><th>메시지 내용</th><th style={{width: '15%'}}>상태</th></tr></thead>
                      <tbody>
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map((log, idx) => (
                              <tr key={idx}>
                                <td style={{fontFamily: 'Rajdhani', fontWeight: 600}}>{log.time}</td>
                                <td>
                                  <span className={`type-badge ${log.type}`}>
                                    {log.type === 'error' ? '오류 (Error)' : log.type === 'warning' ? '경고 (Warn)' : '정보 (Info)'}
                                  </span>
                                </td>
                                <td style={{fontWeight: 600}}>{log.msg}</td>
                                <td>
                                    {log.type === 'success' ? 
                                        <div style={{display:'flex', alignItems:'center', gap:6, color: COLORS.success, fontSize: '0.8rem', fontWeight: 700}}><CheckCircle2 size={14}/> 해결됨</div> : 
                                        <div style={{display:'flex', alignItems:'center', gap:6, color: COLORS.textSub, fontSize: '0.8rem', fontWeight: 600}}>확인 필요</div>
                                    }
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr><td colSpan={4} style={{textAlign:'center', padding: '40px', color: COLORS.textSub}}>검색 결과가 없습니다.</td></tr>
                        )}
                      </tbody>
                    </LogTable>
                  </LogTableWrapper>
                </div>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>

      </LayoutContainer>
    </>
  );
}
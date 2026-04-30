"use client";

import GmtLoadingScreen from '@/components/loading/gmt-loading';
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { X, ZoomIn, ZoomOut, Maximize, Video, Clock, Activity, Search, MapPin } from 'lucide-react'; 

// =============================================================================
// 0. GLOBAL STYLE & THEME
// =============================================================================

const GlobalStyle = createGlobalStyle`
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #F5F7FA;
    color: #1E293B;
    overflow: hidden;
  }
  * { box-sizing: border-box; }
`;

const THEME_COLOR = "#00B87C"; 

// =============================================================================
// 1. DATA DEFINITIONS
// =============================================================================
const JIG_1_L = ['GJ01', 'GJ03', 'GJ05', 'GJ07', 'GJ09', 'GJ11', 'GJ13', 'GJ15', 'GJ17'];
const JIG_1_R = ['GJ19', 'GJ21', 'GJ23', 'GJ25', 'GJ27', 'GJ29', 'GJ31'];
const JIG_BTM = ['GJ33', 'GJ35', 'GJ37', 'GJ39', 'GJ41', 'GJ43', 'GJ45', 'GJ47', 'GJ49', 'GJ51', 'GJ53', 'GJ55', 'GJ57', 'GJ59'];

const GF_LEFT_COL = ['24','18','12','06'];
const GF_RIGHT_COL = ['23','17','11','05'];
const GF_GRID = [
  ['22','21','20','19'], ['16','15','14','13'], ['10','09','08','07'], ['04','03','02','01']
];

const GA_TOP_1 = ['10','09','08','07','06','05','04','03','02','01'];
const GA_TOP_2 = ['20','19','18','17','16','15','14','13','12','11'];

const GA_ROWS = [
  { l:['30','29','28'], r:['27','26','25','24','23','22','21'] },
  { l:['40','39','38'], r:['37','36','35','34','33','32','31'] },
  { l:['50','49','48'], r:['47','46','45','44','43','42','41'] },
  { l:['60','59','58'], r:['57','56','55','54','53','52','51'] },
  { l:['70','69','68'], r:['67','66','65','64','63','62','61'] }
];

const GB_34_L = ['34','33','32'];
const GB_34_R = ['31','30','29','28','27','26','25','24','23','22','21','20','19','18'];
const GB_17_L = ['17','16','15'];
const GB_17_R = ['14','13','12','11','10','09','08','07','06','05','04','03','02','01'];

const GC_L_TOP = ['26','25','24','23','22','21','20','19','18'];
const GC_L_BTM = ['13','12','11','10','09','08','07','06','05'];
const GC_R_TOP = ['17','16','15','14'];
const GC_R_BTM = ['04','03','02','01'];

const GE_L = ['28'];
const GE_BODY = [{l:'27',r:'26'}, {l:'25',r:'24'}, {l:'23',r:'22'}];
const GE_GRID = [
  ['21','20','19'],['18','17','16'],['15','14','13'],['12','11','10'],['09','08','07'],['06','05','04']
];

const GD_STRIP = [
  {l:'45',r:'44'}, {l:'43',r:'42'}, {l:'41',r:'40'}, {l:'39',r:'38'}, {l:'37',r:'36'}, {l:'35',r:'34'}, {l:'33',r:'32'}, {l:'31',r:'30'}, {l:'29',r:'28'}
];
const GD_GRID_H = ['GE03','GE02','GE01'];
const GD_GRID = [
  ['27','26','25'],['24','23','22'],['21','20','19'],['18','17','16'],['15','14','13'],['12','11','10'],['09','08','07'],['06','05','04'],['03','02','01']
];

// =============================================================================
// 2. STYLED COMPONENTS 
// =============================================================================

const W_JIG = '58px';
const W_NARROW = '48px';
const W_WIDE = '96px';
const CELL_HEIGHT = '36px';

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

const Layout = styled.div`
  display: flex;
  width: 100vw;
  height: calc(100vh - 64px);
  padding: 16px;
  gap: 16px;
  background-color: #F1F5F9;
`;

const LeftColumn = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
`;

const PanelBlock = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const PanelTitle = styled.h2<{ flex?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 16px 0;
  display: ${props => props.flex ? 'flex' : 'block'};
  justify-content: ${props => props.flex ? 'space-between' : 'flex-start'};
  align-items: center;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .lbl { font-size: 12px; color: #64748B; font-weight: 600; }
  .val { font-size: 28px; font-weight: 600; color: #0F172A; display: flex; align-items: baseline; gap: 2px;}
  .val.big { font-size: 28px; }
  .val.red { color: #E11D48; }
  small { font-size: 20px; font-weight: 600; color: #94A3B8; margin-left: 2px; }
`;

const ZoneStatList = styled.div`
  display: flex; flex-direction: column; gap: 12px;
`;

const ZoneStatItem = styled.div`
  display: flex; flex-direction: column; gap: 6px;
  .header { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: #475569; }
  .bar-bg { width: 100%; height: 4px; background: #F1F5F9; border-radius: 2px; overflow: hidden; }
  .bar-fill { height: 100%; background: ${THEME_COLOR}; border-radius: 2px; }
`;

const VideoWrapper = styled.div`
  width: 100%; aspect-ratio: 16 / 9; background: #1E293B; border-radius: 8px; overflow: hidden; margin-bottom: 12px; position: relative;
`;

const VideoInfoRow = styled.div`
  display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;
  .lbl { color: #64748B; font-weight: 600; }
  .val { color: #0F172A; font-weight: 800; }
`;

const CenterColumn = styled.div`
  flex: 1;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CenterHeader = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #F1F5F9;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Legend = styled.div`
  display: flex; gap: 12px; font-size: 13px; font-weight: 700; color: #475569;
  .item { display: flex; align-items: center; gap: 6px; }
  .box { width: 14px; height: 14px; border-radius: 4px; }
  .box.empty { border: 1px solid #CBD5E1; background: white; }
  .box.full { background: ${THEME_COLOR}; }
`;

const ZoomButtonGroup = styled.div`
  display: flex; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;
  button {
    background: white; border: none; padding: 6px 12px; cursor: pointer; color: #475569;
    display: flex; align-items: center; justify-content: center; transition: background 0.2s;
    &:hover { background: #F8FAFC; color: #0F172A; }
    &:not(:last-child) { border-right: 1px solid #E2E8F0; }
  }
`;

const MapScrollArea = styled.div<{ $isDragging: boolean }>`
  flex: 1;
  overflow: auto;
  position: relative;
  background: #F8FAFC;
  cursor: ${(props) => (props.$isDragging ? 'grabbing' : 'grab')};
  &::-webkit-scrollbar { width: 8px; height: 8px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background-color: #CBD5E1; border-radius: 4px; }
`;

const RightColumn = styled.div`
  width: 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const RightHeader = styled.div`
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid #F1F5F9;
`;

const LiveBadge = styled.span`
  font-size: 11px; background: #FEF2F2; color: #E11D48; padding: 2px 8px; border-radius: 99px; font-weight: 800;
  display: flex; align-items: center; gap: 4px;
  &::before { content: ''; width: 4px; height: 4px; background: #E11D48; border-radius: 50%; animation: ${pulse} 1.5s infinite; }
`;

const SearchBox = styled.div`
  display: flex; align-items: center; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px 12px; margin-top: 16px;
  input { border: none; background: transparent; outline: none; margin-left: 8px; font-size: 13px; font-family: inherit; width: 100%; color: #0F172A; }
  input::placeholder { color: #94A3B8; }
`;

const InventoryListContainer = styled.div`
  flex: 1; overflow-y: auto; padding: 12px 20px; display: flex; flex-direction: column; gap: 10px;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background-color: #E2E8F0; border-radius: 4px; }
`;

const InventoryCard = styled.div`
  display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F5F9;
  .left { display: flex; flex-direction: column; gap: 4px; }
  .code { font-size: 14px; font-weight: 800; color: #1E293B; }
  .loc { font-size: 11px; font-weight: 600; color: #64748B; display: flex; align-items: center; gap: 4px; }
  .right-qty { font-size: 12px; font-weight: 800; color: ${THEME_COLOR}; background: #F0FDF4; border: 1px solid #BBF7D0; padding: 4px 10px; border-radius: 6px; }
`;

// --- 스마트 맵 구성요소 ---
const MapContentWrapper = styled.div` display: flex; gap: 40px; `;
const ColLeftMap = styled.div` display: flex; flex-direction: column; gap: 25px; width: fit-content; `;
const ColRightMap = styled.div` display: flex; flex-direction: column; gap: 25px; padding-top: 5px; `;

const GridContainer = styled.div`
  display: flex; flex-direction: column; width: fit-content; border-top: 1px solid #CBD5E1; border-left: 1px solid #CBD5E1; background: white;
`;
const Row = styled.div` display: flex; `;

const CellBox = styled.div<{ w: string }>`
  width: ${props => props.w}; height: ${CELL_HEIGHT}; display: flex; flex-direction: column; border-right: 1px solid #CBD5E1; border-bottom: 1px solid #CBD5E1; background: white; position: relative;
  &:hover { z-index: 10; box-shadow: inset 0 0 0 2px #3B82F6; }
`;

const CellHeader = styled.div`
  height: 14px; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #475569; background: #F8FAFC; border-bottom: 1px solid #E2E8F0;
`;

const CellValue = styled.div<{ $active?: boolean }>`
  flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; 
  font-size: 11px; font-weight: 800;
  background-color: ${props => props.$active ? THEME_COLOR : 'white'};
  color: ${props => props.$active ? 'white' : 'transparent'};
  transition: background-color 0.2s; cursor: pointer;
  
  /* 텍스트 오버플로우 방지 및 생략 기호 처리 */
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  padding: 0 4px;
`;

const MapSectionTitle = styled.div<{ $isActive: boolean }>`
  font-size: 14px; font-weight: 800; color: ${props => props.$isActive ? '#3B82F6' : '#64748B'}; margin-bottom: 8px; margin-left: 2px; display: flex; align-items: center; gap: 6px;
`;

const JigZoneBox = styled.div` background: rgba(243, 232, 255, 0.5); border: 1px solid #E9D5FF; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; `;
const ActiveZoneBox = styled.div` background: rgba(239, 246, 255, 0.5); border: 1px solid #BFDBFE; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 30px; `;
const InactiveZoneBox = styled.div` background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 30px; `;

const TooltipBox = styled.div`
  position: fixed; z-index: 3000; background: rgba(255, 255, 255, 0.98); border: 1px solid #E2E8F0; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); padding: 12px; min-width: 220px; pointer-events: none; display: flex; flex-direction: column; gap: 6px; backdrop-filter: blur(4px);
  .tooltip-header { font-size: 14px; font-weight: 800; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center; }
  .tooltip-row { display: flex; justify-content: space-between; font-size: 12px; .label { color: #64748B; font-weight: 600; } .value { color: #0F172A; font-weight: 800; } }
  .status-badge { padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; &.occupied { background: #F0FDF4; color: ${THEME_COLOR}; border: 1px solid #BBF7D0; } &.empty { background: #F1F5F9; color: #64748B; } }
`;

// =============================================================================
// 3. TYPES & SUB-COMPONENTS
// =============================================================================

interface ApiSlotDetail { slot_id: number; occupied: boolean; loc_code: string; label001: string | null; vehicle_id: string | null; entry_time: string | null; }
interface ApiZoneData { total: number; occupied: number; slots_detail: ApiSlotDetail[]; }
type ApiResponse = Record<string, ApiZoneData>;
interface SlotDataMap { [locCode: string]: ApiSlotDetail; }
interface InventoryItem { code: string; loc: string; zone: string; qty: number; }
interface ZoneStat { name: string; total: number; used: number; }
interface TooltipState { x: number; y: number; data: ApiSlotDetail | null; locCode: string; }

const CellItem = React.memo(({ id, w, data, onHover }: { id: string, w: string, data: ApiSlotDetail | undefined, onHover: (e: React.MouseEvent, id: string, data: ApiSlotDetail | undefined) => void }) => {
  const isOccupied = data?.occupied;
  
  // 라벨(label001)이 아닌 차량번호(vehicle_id)를 표시값으로 사용
  const displayVal = isOccupied ? (data?.vehicle_id ? data.vehicle_id : '----') : ''; 

  return (
    <CellBox w={w} onMouseEnter={(e) => onHover(e, id, data)} onMouseLeave={(e) => onHover(e, id, undefined)}>
      <CellHeader>{id}</CellHeader>
      <CellValue $active={isOccupied} title={data?.vehicle_id || ''}>{displayVal}</CellValue>
    </CellBox>
  );
}, (prev, next) => prev.id === next.id && prev.w === next.w && prev.data === next.data);
CellItem.displayName = "CellItem";

const WarehouseLayout = React.memo(({ renderCell }: { renderCell: (id: string, w: string) => React.ReactNode }) => {
  const JigStrip = ({ ids }: { ids: string[] }) => ( <Row>{ids.map(id => renderCell(id, W_JIG))}</Row> );
  return (
    <MapContentWrapper>
      <ColLeftMap>
        <JigZoneBox>
          <MapSectionTitle $isActive={false} style={{color:'#A855F7'}}>JIG ZONE</MapSectionTitle>
          <div style={{display:'flex', gap:'20px', alignItems:'flex-end'}}>
            <GridContainer><JigStrip ids={JIG_1_L} /><JigStrip ids={JIG_1_L} /></GridContainer>
            <GridContainer><JigStrip ids={JIG_1_R} /><JigStrip ids={JIG_1_R} /></GridContainer>
          </div>
          <div style={{marginTop:'10px', marginLeft:'60px'}}><GridContainer><JigStrip ids={JIG_BTM} /><JigStrip ids={JIG_BTM} /></GridContainer></div>
        </JigZoneBox>

        <ActiveZoneBox>
          <div>
            <MapSectionTitle $isActive={true}>GA</MapSectionTitle>
            <GridContainer>
              <Row>{GA_TOP_1.slice(0,3).map((n) => renderCell(`GA${n}`, W_NARROW))}{GA_TOP_1.slice(3).map((n) => renderCell(`GA${n}`, W_WIDE))}</Row>
              <Row>{GA_TOP_2.slice(0,3).map((n) => renderCell(`GA${n}`, W_NARROW))}{GA_TOP_2.slice(3).map((n) => renderCell(`GA${n}`, W_WIDE))}</Row>
            </GridContainer>
          </div>
          <div>
            <MapSectionTitle $isActive={true}>GA / GB</MapSectionTitle>
            <GridContainer>
              {GA_ROWS.map((row, i) => (
                <Row key={i}>{row.l.map(n => renderCell(`GA${n}`, W_NARROW))}{row.r.map(n => renderCell(`GA${n}`, W_WIDE))}</Row>
              ))}
              <Row>{GB_34_L.map(n => renderCell(`GB${n}`, W_NARROW))}{GB_34_R.map(n => renderCell(`GB${n}`, W_NARROW))}</Row>
              <Row>{GB_17_L.map(n => renderCell(`GB${n}`, W_NARROW))}{GB_17_R.map(n => renderCell(`GB${n}`, W_NARROW))}</Row>
            </GridContainer>
          </div>
          <div>
            <MapSectionTitle $isActive={true}>GC</MapSectionTitle>
            <div style={{display:'flex', gap:'20px'}}>
              <GridContainer><Row>{GC_L_TOP.map(n => renderCell(`GC${n}`, W_NARROW))}</Row><Row>{GC_L_BTM.map(n => renderCell(`GC${n}`, W_NARROW))}</Row></GridContainer>
              <GridContainer><Row>{GC_R_TOP.map(n => renderCell(`GC${n}`, W_NARROW))}</Row><Row>{GC_R_BTM.map(n => renderCell(`GC${n}`, W_NARROW))}</Row></GridContainer>
            </div>
          </div>
        </ActiveZoneBox>
      </ColLeftMap>

      <ColRightMap>
        <InactiveZoneBox>
          <div>
            <MapSectionTitle $isActive={false}>GF</MapSectionTitle>
            <div style={{display:'flex', gap:'15px'}}>
                <GridContainer>
                    <Row>
                      <div style={{display:'flex', flexDirection:'column'}}>{GF_LEFT_COL.map(n => renderCell(`GF${n}`, W_NARROW))}</div>
                      <div style={{display:'flex', flexDirection:'column'}}>{GF_RIGHT_COL.map(n => renderCell(`GF${n}`, W_NARROW))}</div>
                    </Row>
                </GridContainer>
                <GridContainer>{GF_GRID.map((row, i) => (<Row key={i}>{row.map(n => renderCell(`GF${n}`, W_NARROW))}</Row>))}</GridContainer>
            </div>
          </div>
          <div>
            <MapSectionTitle $isActive={false}>GE / GD</MapSectionTitle>
            <div style={{display:'flex', gap:'20px'}}>
                <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
                    <GridContainer style={{marginRight: W_NARROW}}>{renderCell(`GE${GE_L[0]}`, W_NARROW)}</GridContainer>
                    <GridContainer style={{marginBottom:'20px'}}>{GE_BODY.map((p,i) => (<Row key={i}>{renderCell(`GE${p.l}`, W_NARROW)}{renderCell(`GE${p.r}`, W_NARROW)}</Row>))}</GridContainer>
                    <GridContainer>{GD_STRIP.map((p,i) => (<Row key={i}>{renderCell(`GD${p.l}`, W_NARROW)}{renderCell(`GD${p.r}`, W_NARROW)}</Row>))}</GridContainer>
                </div>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <div style={{height:'40px'}}></div>
                    <GridContainer style={{marginBottom:'20px'}}>{GE_GRID.map((row,i) => (<Row key={i}>{row.map(n => renderCell(`GE${n}`, W_NARROW))}</Row>))}</GridContainer>
                    <GridContainer>
                        <Row>{GD_GRID_H.map(id => renderCell(id, W_NARROW))}</Row>
                        {GD_GRID.map((row,i) => (<Row key={i}>{row.map(n => renderCell(`GD${n}`, W_NARROW))}</Row>))}
                    </GridContainer>
                </div>
            </div>
          </div>
        </InactiveZoneBox>
      </ColRightMap>
    </MapContentWrapper>
  );
});
WarehouseLayout.displayName = "WarehouseLayout";

// =============================================================================
// 웹소켓 실시간 비디오 플레이어 컴포넌트 추가
// =============================================================================
const WsVideoPlayer = ({ wsUrl }: { wsUrl: string }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!wsUrl) return;
    
    const ws = new WebSocket(wsUrl);
    ws.binaryType = 'blob'; // Blob 형태로 이미지 프레임 수신 가정

    ws.onopen = () => console.log(`[Video WS] Connected to camera: ${wsUrl}`);
    
    ws.onmessage = (event) => {
      // 전달받은 프레임을 Object URL로 변환하여 img에 렌더링
      if (event.data instanceof Blob) {
        const url = URL.createObjectURL(event.data);
        setImgSrc((prev) => {
          if (prev) URL.revokeObjectURL(prev); // 이전 메모리 해제
          return url;
        });
      }
    };

    ws.onerror = (err) => console.error(`[Video WS] Error:`, err);
    
    return () => {
      ws.close();
      setImgSrc((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [wsUrl]);

  if (!imgSrc) {
    return <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#94A3B8', fontSize:'13px'}}>실시간 카메라 연결 중...</div>;
  }

  return <img src={imgSrc} alt="Live Stream" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
};

// =============================================================================
// 4. MAIN COMPONENT
// =============================================================================

export default function FinalDashboard() {
  const [loading, setLoading] = useState(true);
  const [mapData, setMapData] = useState<SlotDataMap>({});
  const [hoverInfo, setHoverInfo] = useState<TooltipState | null>(null);
  
  const [zoomLevel, setZoomLevel] = useState(0.85); // 화면 맞춤용 초기 배율
  const [searchTerm, setSearchTerm] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://1.254.24.170:24828/api/DX_API000014');
        const json: ApiResponse = await res.json();
        const newMap: SlotDataMap = {};
        Object.values(json).forEach((zone) => {
          if (zone.slots_detail) {
            zone.slots_detail.forEach((slot) => {
              if (slot.loc_code) newMap[slot.loc_code] = slot;
            });
          }
        });
        setMapData(newMap);
      } catch (error) {
        console.error("API Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo<ZoneStat[]>(() => {
    const zones = ['GA', 'GB', 'GC', 'GD', 'GE', 'GF'];
    const result = zones.map(zoneName => ({ name: zoneName, total: 0, used: 0 }));
    Object.values(mapData).forEach(slot => {
      const prefix = slot.loc_code.substring(0, 2); 
      const zoneIdx = zones.indexOf(prefix);
      if (zoneIdx !== -1) {
        result[zoneIdx].total += 1;
        if (slot.occupied) result[zoneIdx].used += 1;
      }
    });
    return result;
  }, [mapData]);

  // 재고 목록 출력 기준도 vehicle_id로 매핑
  const inventoryList = useMemo<InventoryItem[]>(() => {
    const list: InventoryItem[] = [];
    Object.values(mapData).forEach(slot => {
      if (slot.occupied && slot.vehicle_id) {
        const zone = slot.loc_code.substring(0, 2);
        list.push({ code: slot.vehicle_id, loc: slot.loc_code, zone: zone, qty: 1 });
      }
    });
    return list.sort((a, b) => a.code.localeCompare(b.code));
  }, [mapData]);

  const filteredInventory = inventoryList.filter(item => 
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentEntry = useMemo<ApiSlotDetail | null>(() => {
    let latest: ApiSlotDetail | null = null;
    let maxTime = 0;
    Object.values(mapData).forEach(slot => {
      if (slot.occupied && slot.entry_time) {
        const time = new Date(slot.entry_time).getTime();
        if (time > maxTime) {
          maxTime = time;
          latest = slot;
        }
      }
    });
    return latest;
  }, [mapData]);

  // 최근 입고된 위치를 기반으로 웹소켓 카메라 주소 할당 (192.168.2.147:8121~8131)
  const activeCameraUrl = useMemo(() => {
    const baseIp = "192.168.2.147";
    if (!recentEntry || !recentEntry.loc_code) return `ws://${baseIp}:8121`;
    
    const prefix = recentEntry.loc_code.substring(0, 2);
    switch (prefix) {
      case 'GA': return `ws://${baseIp}:8121`;
      case 'GB': return `ws://${baseIp}:8122`;
      case 'GC': return `ws://${baseIp}:8123`;
      case 'GD': return `ws://${baseIp}:8124`;
      case 'GE': return `ws://${baseIp}:8125`;
      case 'GF': return `ws://${baseIp}:8126`;
      case 'GJ': return `ws://${baseIp}:8127`; // JIG ZONE
      // 필요에 따라 8128 ~ 8131 추가 구성
      default: return `ws://${baseIp}:8121`;
    }
  }, [recentEntry]);

  const totalCap = stats.reduce((a, b) => a + b.total, 0);
  const totalUsed = stats.reduce((a, b) => a + b.used, 0);
  const totalPercent = totalCap > 0 ? Math.round((totalUsed / totalCap) * 100) : 0;

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    } catch { return isoString; }
  };

  const handleCellHover = useCallback((e: React.MouseEvent, id: string, data: ApiSlotDetail | undefined) => {
    if (data || id) { 
      setHoverInfo(data !== undefined ? { x: e.clientX, y: e.clientY, data: data || null, locCode: id } : null);
    }
  }, []);

  const renderCell = useCallback((id: string, w: string) => {
    return <CellItem key={id} id={id} w={w} data={mapData[id]} onHover={handleCellHover} />;
  }, [mapData, handleCellHover]);

  // Drag to scroll logic for map
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setStartY(e.pageY - containerRef.current.offsetTop);
    setScrollLeft(containerRef.current.scrollLeft);
    setScrollTop(containerRef.current.scrollTop);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - startX) * 1.5; 
    const walkY = (y - startY) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walkX;
    containerRef.current.scrollTop = scrollTop - walkY;
  };

  return (
    <>
      <GlobalStyle />
      {loading && <GmtLoadingScreen />}
      
      {/* 마우스 툴팁 */}
      {hoverInfo && (
        <TooltipBox style={{ top: hoverInfo.y + 15, left: hoverInfo.x + 15 }}>
          <div className="tooltip-header">
            <span>{hoverInfo.locCode}</span>
            <span className={`status-badge ${hoverInfo.data?.occupied ? 'occupied' : 'empty'}`}>
              {hoverInfo.data?.occupied ? '적재 완료' : '빈 슬롯'}
            </span>
          </div>
          {hoverInfo.data?.occupied ? (
            <>
              <div className="tooltip-row"><span className="label">차량식별ID</span><span className="value">{hoverInfo.data.vehicle_id || '-'}</span></div>
              <div className="tooltip-row"><span className="label">바코드(라벨)</span><span className="value" style={{fontWeight: 600, fontSize: '11px'}}>{hoverInfo.data.label001 || '-'}</span></div>
              <div className="tooltip-row"><span className="label">입고 시간</span><span className="value">{formatTime(hoverInfo.data.entry_time)}</span></div>
            </>
          ) : (
            <div className="tooltip-row" style={{justifyContent: 'center', color: '#94A3B8', padding: '10px 0'}}>데이터 없음</div>
          )}
        </TooltipBox>
      )}

      <Layout>
        {/* 🟢 왼쪽 패널: 전체 운영 요약, 구역별 현황, 영상 모니터링 */}
        <LeftColumn>
          <PanelBlock>
            <PanelTitle>전체 운영 요약</PanelTitle>
            <SummaryGrid>
              <SummaryItem>
                <span className="lbl">전체 적재율</span>
                <span className="val big">{totalPercent}<small>%</small></span>
              </SummaryItem>
              <SummaryItem>
                <span className="lbl">점유 슬롯</span>
                <span className="val">{totalUsed} <small>/ {totalCap}</small></span>
              </SummaryItem>
              <SummaryItem>
                <span className="lbl">금일 입고</span>
                <span className="val red">{totalUsed} <small>건</small></span>
              </SummaryItem>
              <SummaryItem>
                <span className="lbl">잔여 슬롯</span>
                <span className="val">{totalCap - totalUsed} <small>개</small></span>
              </SummaryItem>
            </SummaryGrid>
          </PanelBlock>

          <PanelBlock style={{ flex: 1, minHeight: 0 }}>
            <PanelTitle>구역별 현황</PanelTitle>
            <ZoneStatList style={{ overflowY: 'auto', paddingRight: '4px' }}>
              {stats.map(s => {
                const pct = s.total > 0 ? Math.round((s.used / s.total) * 100) : 0;
                return (
                  <ZoneStatItem key={s.name}>
                    <div className="header"><span>{s.name} 구역</span><span>{s.used} / {s.total} ({pct}%)</span></div>
                    <div className="bar-bg"><div className="bar-fill" style={{ width: `${pct}%` }} /></div>
                  </ZoneStatItem>
                );
              })}
            </ZoneStatList>
          </PanelBlock>

          <PanelBlock>
            <PanelTitle>영상 모니터링</PanelTitle>
            <VideoWrapper>
              {/* 기존 정적 비디오 대신 실시간 웹소켓 플레이어 연동 */}
              <WsVideoPlayer wsUrl={activeCameraUrl} />
            </VideoWrapper>
            {recentEntry ? (
              <>
                <VideoInfoRow><span className="lbl">최근차량</span><span className="value">{recentEntry.vehicle_id || '-'}</span></VideoInfoRow>
                <VideoInfoRow><span className="lbl">입고구역</span><span className="value">{recentEntry.loc_code || '-'}</span></VideoInfoRow>
                <VideoInfoRow><span className="lbl">연결카메라</span><span className="value">{activeCameraUrl.split(':').pop()}번 포트</span></VideoInfoRow>
              </>
            ) : (
              <div style={{fontSize:'13px', color:'#94A3B8', textAlign:'center', padding:'10px 0'}}>대기 중...</div>
            )}
          </PanelBlock>
        </LeftColumn>

        {/* 🟢 중앙 패널: 스마트 맵 */}
        <CenterColumn>
          <CenterHeader>
            <PanelTitle style={{ margin: 0 }}>제품창고 스마트 맵</PanelTitle>
            <HeaderControls>
              <Legend>
                <div className="item"><div className="box empty" /> 빈 슬롯</div>
                <div className="item"><div className="box full" /> 적재 완료</div>
              </Legend>
              <ZoomButtonGroup>
                <button onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}><ZoomOut size={16}/></button>
                <button onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.1))}><ZoomIn size={16}/></button>
                <button onClick={() => setZoomLevel(0.85)}><Maximize size={16}/></button>
              </ZoomButtonGroup>
            </HeaderControls>
          </CenterHeader>
          <MapScrollArea 
            ref={containerRef} $isDragging={isDragging}
            onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
          >
            <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', padding: '60px', width: 'fit-content' }}>
              <WarehouseLayout renderCell={renderCell} />
            </div>
          </MapScrollArea>
        </CenterColumn>

        {/* 🟢 우측 패널: 실시간 재고 목록 */}
        <RightColumn>
          <RightHeader>
            <PanelTitle flex style={{ margin: 0 }}>실시간 재고 목록 <LiveBadge>LIVE</LiveBadge></PanelTitle>
            <SearchBox>
              <Search size={16} color="#94A3B8" />
              <input placeholder="차량번호 / 위치 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </SearchBox>
          </RightHeader>
          <InventoryListContainer>
            {filteredInventory.length > 0 ? filteredInventory.map((item, idx) => (
              <InventoryCard key={`${item.code}-${idx}`}>
                <div className="left">
                  <div className="code">{item.code}</div>
                  <div className="loc"><MapPin size={12} color="#94A3B8" /> {item.zone} 구역 ({item.loc})</div>
                </div>
                <div className="right-qty">수량 : {item.qty}</div>
              </InventoryCard>
            )) : <div style={{padding:'40px 20px', textAlign:'center', color:'#94A3B8', fontSize:'13px'}}>검색 결과가 없습니다.</div>}
          </InventoryListContainer>
        </RightColumn>
      </Layout>
    </>
  );
}
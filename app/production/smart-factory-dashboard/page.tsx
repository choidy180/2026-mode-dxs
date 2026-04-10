'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { 
  FiVideo, FiMoreHorizontal, FiUser, FiClock, FiAlertCircle, 
  FiCheck, FiMinus, FiPlayCircle, FiArrowUp, FiX
} from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';

// --- 1. Global Style ---
const GlobalStyle = createGlobalStyle`
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
  
  * {
    box-sizing: border-box;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: #F1F5F9;
    color: #1E293B;
    overflow: hidden;
  }
  
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
`;

// --- 2. Theme ---
const theme = {
  primary: '#C1124F', 
  lightPink: '#FCE7F3',
  green: '#10B981',
  lightGreen: '#ECFDF5',
  bg: '#F4F6F8',
  cardBg: '#FFFFFF',
  textMain: '#0F172A',
  textSub: '#64748B',
  radius: '20px',
  shadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
};

// --- API Interfaces ---
interface SlotDetail { slot_id: number; occupied: boolean; entry_time: string | null; slot_name: string; }
interface CameraData { total: number; occupied: number; empty_idxs: number[]; slots_detail: SlotDetail[]; }
interface WorkingData { NoWkOrd: string; ItemName: string; OrdQty: number; ProdQty: number; NmEmplo: string; NmWrkState: string; NmProce: string; PlnSTime: string; PlnETime: string; }
interface ApiResult { success: boolean; working_data: WorkingData; camData: { [key: string]: CameraData; }; }
interface FlattenedSlotItem extends SlotDetail { camId: string; }

// --- Animation Keyframes ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const backdropFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// --- Styled Components ---

const DashboardContainer = styled.div`
  width: 100%;
  height: calc(100vh - 60px); 
  padding: 32px; 
  display: flex;
  background-color: ${theme.bg};
  overflow: hidden;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.4fr 380px; 
  gap: 32px; 
  flex: 1;
  min-height: 0;
  height: 100%;
`;

const Card = styled.div`
  background-color: ${theme.cardBg};
  border-radius: ${theme.radius};
  box-shadow: ${theme.shadow};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
`;

// --- 1. Left: Video Styles ---
const VideoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
`;

const VideoWrapper = styled(Card)`
  flex: 1;
  position: relative;
  background: #0f172a;
  border: none;
`;

const StyledWebsocketImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
  transform: scale(1.05);
  background-color: #000;
`;

const VideoOverlayTop = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
`;

const CamTag = styled.div`
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 15px; 
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MiniDashboardOverlay = styled.div`
  position: absolute;
  bottom: 24px;
  left: 24px;
  width: 200px; 
  background: rgba(0, 0, 0, 0.8);
  border-radius: 14px;
  padding: 18px;
  color: white;
  z-index: 20;
  display: flex;
  flex-direction: column;
`;

const MiniLabel = styled.div`
  font-size: 13px; 
  color: #94A3B8; 
  font-weight: 600;
  margin-bottom: 6px;
`;

const MiniTitle = styled.div`
  font-size: 16px; 
  font-weight: 700;
  color: #F8FAFC;
  margin-bottom: 10px;
`;

const MiniValueRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
`;

const MiniValueBig = styled.span`
  font-size: 28px; 
  font-weight: 800;
  color: ${theme.green};
`;

const MiniValueSub = styled.span`
  font-size: 20px; 
  color: #F1F5F9;
  font-weight: 600;
`;

const MiniProgressBar = styled.div<{ percent: number }>`
  width: 100%;
  height: 6px; 
  background: rgba(255,255,255,0.2);
  border-radius: 3px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.percent}%;
    background-color: ${theme.green};
    border-radius: 3px;
  }
`;

// --- 2. Center: Middle Column Styles ---
const MiddleColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 28px; 
  font-weight: 700;
  color: ${theme.textMain};
  margin: 0;
  padding-left: 4px;
  letter-spacing: -1px;
`;

const ViewAllBtn = styled.button`
  background: #E2E8F0;
  color: #475569;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #CBD5E1;
    color: #0F172A;
  }
`;

const WorkInfoCard = styled(Card)`
  padding: 28px; 
  border-radius: 20px;
  flex-shrink: 0;
`;

const WorkInfoTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const WorkOrderBadge = styled.span`
  font-size: 18px; 
  font-weight: 700;
  color: ${theme.primary};
  background: ${theme.lightPink};
  padding: 6px 12px;
  border-radius: 8px;
`;

const WorkStatusPlay = styled.div`
  font-size: 15px; 
  font-weight: 600;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ItemNameText = styled.div`
  font-size: 26px; 
  font-weight: 800;
  color: ${theme.textMain};
  margin-bottom: 28px;
`;

const WorkGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 28px;
`;

const WorkDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

const WorkLabel = styled.span`
  font-size: 18px; 
  color: #6c727a;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
`;

const WorkValue = styled.span`
  font-size: 18px; 
  font-weight: 700;
  color: ${theme.textMain};
`;

const ProgressContainer = styled.div`
  width: 100%;
`;

const ProgressLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 18px; 
  font-weight: 700;
  color: ${theme.textMain};
`;

const ProgressBarBg = styled.div`
  width: 100%;
  height: 16px; 
  background: #F1F5F9;
  border-radius: 8px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${props => props.$percent}%;
  background: ${theme.primary};
  border-radius: 6px;
`;

const NoticeBanner = styled.div`
  background: #FFFBEB;
  color: #D97706;
  padding: 16px 20px; 
  border-radius: 12px;
  font-size: 14px; 
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #FEF3C7;
  flex-shrink: 0;
`;

const ListScrollArea = styled.div`
  overflow-y: auto;
  flex: 1; 
  min-height: 0; 
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
`;

const SlotItem = styled.div<{ $occupied: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px; 
  border-radius: 16px;
  background: white;
  border: 1px solid ${props => props.$occupied ? theme.green : '#E2E8F0'};
  opacity: ${props => props.$occupied ? 1 : 0.6};
`;

const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconCircle = styled.div<{ $occupied: boolean }>`
  width: 32px; 
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${props => props.$occupied ? theme.green : '#CBD5E1'};
  color: ${props => props.$occupied ? theme.green : '#CBD5E1'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px; 
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ItemTitle = styled.span<{ $occupied: boolean }>`
  font-size: 17px; 
  font-weight: 800;
  color: ${props => props.$occupied ? '#0F172A' : '#64748B'};
`;

const ItemSub = styled.span`
  font-size: 14px; 
  color: #94A3B8;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusTextRow = styled.div<{ $occupied: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px; 
  font-weight: 700;
  color: ${props => props.$occupied ? theme.green : '#94A3B8'};
`;

const StatusDot = styled.div<{ $occupied: boolean }>`
  width: 8px; 
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$occupied ? theme.green : 'transparent'};
`;


// --- 3. Right: Chat Styles ---
const ChatContainer = styled(Card)`
  padding: 0;
  border: 1px solid #E2E8F0;
`;

const ChatHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
`;

const AiAvatar = styled.div`
  width: 48px; 
  height: 48px;
  background-color: ${theme.lightPink};
  color: ${theme.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px; 
`;

const AiTitleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AiTitle = styled.div`
  font-size: 18px; 
  font-weight: 800;
  color: ${theme.textMain};
`;

const AiSub = styled.div`
  font-size: 13px; 
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ChatBody = styled.div`
  flex: 1;
  background: white;
  padding: 24px;
  overflow-y: auto;
  min-height: 0; 
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MessageRow = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  gap: 6px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Bubble = styled.div<{ $isUser: boolean }>`
  background: ${props => props.$isUser ? theme.primary : '#F8FAFC'};
  color: ${props => props.$isUser ? 'white' : '#1E293B'};
  padding: 16px 20px; 
  border-radius: 20px;
  border-bottom-right-radius: ${props => props.$isUser ? '4px' : '20px'};
  border-top-left-radius: ${props => props.$isUser ? '20px' : '4px'};
  font-size: 16px; 
  max-width: 85%;
  line-height: 1.5;
`;

const TimeText = styled.div`
  font-size: 15px; 
  color: #757b81;
  margin: 0 2px;
`;

const InputArea = styled.form`
  padding: 20px 24px;
  background: white;
  border-top: 1px solid #F1F5F9;
  flex-shrink: 0;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #F8FAFC;
  border-radius: 99px;
  padding: 8px 8px 8px 24px; 
  border: 1px solid #E2E8F0;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  font-size: 16px; 
  outline: none;
  color: ${theme.textMain};
  &::placeholder {
    color: #94A3B8;
  }
`;

const SendBtn = styled.button`
  width: 44px; 
  height: 44px;
  border-radius: 50%;
  background: ${theme.primary};
  border: none;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 22px; 
  transition: transform 0.1s;
  &:active {
    transform: scale(0.95);
  }
`;

// --- 4. Modal Styles ---
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${backdropFadeIn} 0.2s ease-out;
`;

const ModalContainer = styled.div`
  background: white;
  width: 600px;
  max-width: 90vw;
  max-height: 85vh;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  animation: ${fadeIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ModalHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: ${theme.textMain};
`;

const CloseBtn = styled.button`
  background: #F1F5F9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748B;
  transition: background 0.2s;
  
  &:hover {
    background: #E2E8F0;
    color: #0F172A;
  }
`;

const ModalBody = styled.div`
  padding: 24px 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
`;


// --- [NEW] WebSocket Video Component ---
const WsVideoStream = ({ wsUrl }: { wsUrl: string }) => {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    return () => {};
  }, [wsUrl]);

  return <StyledWebsocketImg ref={imgRef} alt="Live Stream" src="https://via.placeholder.com/600x400/1e293b/1e293b" />;
};


// --- Mock Data ---
const MOCK_DATA: ApiResult = {
  "success": true,
  "working_data": {
    "NoWkOrd": "WO-260305-003",
    "ItemName": "Door Foam Assembly,Refrigerato",
    "OrdQty": 750,
    "ProdQty": 750,
    "NmEmplo": "박태용",
    "NmWrkState": "가동중",
    "NmProce": "발포 / 조립 1라인",
    "PlnSTime": "09:00 ~ 17:35",
    "PlnETime": "09:00 ~ 17:35",
  }, 
  "camData": {
    "207": {
      "total": 7,
      "occupied": 4,
      "empty_idxs": [],
      "slots_detail": [
        { "slot_id": 1, "occupied": true, "entry_time": "06:14:39", "slot_name": "S-01" },
        { "slot_id": 2, "occupied": true, "entry_time": "06:14:39", "slot_name": "S-01" },
        { "slot_id": 3, "occupied": true, "entry_time": "06:14:39", "slot_name": "S-01" },
        { "slot_id": 4, "occupied": true, "entry_time": "06:14:39", "slot_name": "S-01" },
        { "slot_id": 5, "occupied": false, "entry_time": "06:14:39", "slot_name": "S-03" }
      ]
    },
    "218": {
      "total": 3,
      "occupied": 2,
      "empty_idxs": [],
      "slots_detail": []
    }
  }
};

const SmartFactoryDashboard: React.FC = () => {
  const [apiData] = useState<ApiResult>(MOCK_DATA);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✨ 모달 상태 추가

  // Chat State
  const [messages, setMessages] = useState([
    { id: 1, text: "시스템 가동. 실시간 공정 데이터 수신중.\n\n현재 'Door Foam Assembly' 작업이 진행중입니다.", user: false, time: '09:40 AM' },
    { id: 2, text: "생산 진행를 알려주세요", user: true, time: '09:40 AM' },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), text: chatInput, user: true, time: now }]);
    setChatInput("");
  };

  const allSlots: FlattenedSlotItem[] = useMemo(() => {
    return apiData.camData["207"].slots_detail.map(slot => ({
      camId: "207",
      ...slot
    }));
  }, [apiData]);

  const wkData = apiData.working_data;
  const progressPercent = Math.min((wkData.ProdQty / wkData.OrdQty) * 100, 100);

  return (
    <>
      <GlobalStyle />
      <DashboardContainer>
        <MainGrid>
          
          {/* 1. LEFT: Video Feed */}
          <VideoColumn>
            <VideoWrapper>
              <VideoOverlayTop>
                <CamTag><FiVideo size={18} /> GR5 가조립 자재 #1</CamTag>
                <FiMoreHorizontal color="white" size={24} />
              </VideoOverlayTop>
              
              <WsVideoStream wsUrl="ws://192.168.2.147:8132" />

              <MiniDashboardOverlay>
                <MiniLabel>실시간 적재 현황</MiniLabel>
                <MiniTitle>GR5 가조립 자재 #1</MiniTitle>
                <MiniValueRow>
                  <MiniValueBig>57%</MiniValueBig>
                  <MiniValueSub>4 / 7 EA</MiniValueSub>
                </MiniValueRow>
                <MiniProgressBar percent={57} />
              </MiniDashboardOverlay>
            </VideoWrapper>

            <VideoWrapper>
              <VideoOverlayTop>
                <CamTag><FiVideo size={18} /> GR5 가조립 자재 #2</CamTag>
                <FiMoreHorizontal color="white" size={24} />
              </VideoOverlayTop>
              
              <WsVideoStream wsUrl="ws://192.168.2.147:8133" />

              <MiniDashboardOverlay>
                <MiniLabel>실시간 적재 현황</MiniLabel>
                <MiniTitle>GR5 가조립 자재 #2</MiniTitle>
                <MiniValueRow>
                  <MiniValueBig>67%</MiniValueBig>
                  <MiniValueSub>2 / 3 EA</MiniValueSub>
                </MiniValueRow>
                <MiniProgressBar percent={67} />
              </MiniDashboardOverlay>
            </VideoWrapper>
          </VideoColumn>

          {/* 2. CENTER: Data List */}
          <MiddleColumn>
            <SectionTitle>실시간 생산 및 적재 데이터</SectionTitle>
            
            <WorkInfoCard>
              <WorkInfoTopRow>
                <WorkOrderBadge>{wkData.NoWkOrd}</WorkOrderBadge>
                <WorkStatusPlay>
                  <FiPlayCircle size={20} /> {wkData.NmWrkState}
                </WorkStatusPlay>
              </WorkInfoTopRow>

              <ItemNameText>{wkData.ItemName}</ItemNameText>

              <WorkGrid>
                <WorkDetailItem>
                  <WorkLabel><FiUser size={16}/> 작업자</WorkLabel>
                  <WorkValue>{wkData.NmEmplo}</WorkValue>
                </WorkDetailItem>
                <WorkDetailItem>
                  <WorkLabel><FiAlertCircle size={16}/> 공정명</WorkLabel>
                  <WorkValue>{wkData.NmProce}</WorkValue>
                </WorkDetailItem>
                <WorkDetailItem>
                  <WorkLabel><FiClock size={16}/> 계획 시작</WorkLabel>
                  <WorkValue>{wkData.PlnSTime}</WorkValue>
                </WorkDetailItem>
                <WorkDetailItem>
                  <WorkLabel><FiClock size={16}/> 계획 종료</WorkLabel>
                  <WorkValue>{wkData.PlnETime}</WorkValue>
                </WorkDetailItem>
              </WorkGrid>

              <ProgressContainer>
                <ProgressLabelRow>
                  <span>생산 진행률</span>
                  <span style={{color: theme.primary}}>{wkData.ProdQty} / {wkData.OrdQty} EA</span>
                </ProgressLabelRow>
                <ProgressBarBg>
                  <ProgressBarFill $percent={progressPercent} />
                </ProgressBarBg>
              </ProgressContainer>
            </WorkInfoCard>

            <NoticeBanner>
              <FiAlertCircle size={20} style={{flexShrink: 0}} />
              적재 한계: 자재 1분 이상 미도착 / 작업자 5명 이상 대기 시 자동 경보
            </NoticeBanner>

            {/* ✨ 전체보기 헤더 적용 */}
            <SectionHeader>
              <SectionTitle>대차 슬롯 상세</SectionTitle>
              <ViewAllBtn onClick={() => setIsModalOpen(true)}>
                전체보기
              </ViewAllBtn>
            </SectionHeader>

            <ListScrollArea>
              {allSlots.map((item, idx) => (
                <SlotItem key={`list-${idx}`} $occupied={item.occupied}>
                  <ItemLeft>
                    <IconCircle $occupied={item.occupied}>
                      {item.occupied ? <FiCheck /> : <FiMinus />}
                    </IconCircle>
                    <ItemInfo>
                      <ItemTitle $occupied={item.occupied}>
                        공정 #{item.camId} - {item.slot_name}
                      </ItemTitle>
                      <ItemSub>
                        <FiClock size={14} /> 
                        입고: {item.entry_time}
                      </ItemSub>
                    </ItemInfo>
                  </ItemLeft>
                  <StatusTextRow $occupied={item.occupied}>
                    <StatusDot $occupied={item.occupied} />
                    {item.occupied ? '작업중' : '빈슬롯'}
                  </StatusTextRow>
                </SlotItem>
              ))}
            </ListScrollArea>
          </MiddleColumn>

          {/* 3. RIGHT: AI Chat */}
          <ChatContainer>
            <ChatHeader>
              <AiAvatar>
                <FaRobot />
              </AiAvatar>
              <AiTitleInfo>
                <AiTitle>AI 관제 어시스턴트</AiTitle>
                <AiSub>
                  <StatusDot $occupied={true} /> 실시간 공정 모니터링 중
                </AiSub>
              </AiTitleInfo>
            </ChatHeader>
            
            <ChatBody>
              {messages.map((m) => (
                <MessageRow key={m.id} $isUser={m.user}>
                  <Bubble $isUser={m.user} style={{ whiteSpace: 'pre-wrap' }}>
                    {m.text}
                  </Bubble>
                  <TimeText>{m.time}</TimeText>
                </MessageRow>
              ))}
              <div ref={chatEndRef} />
            </ChatBody>
            
            <InputArea onSubmit={handleSend}>
              <InputWrapper>
                <Input 
                  placeholder="지시사항 입력..." 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                />
                <SendBtn type="submit">
                  <FiArrowUp />
                </SendBtn>
              </InputWrapper>
            </InputArea>
          </ChatContainer>

        </MainGrid>
      </DashboardContainer>

      {/* ✨ 모달 렌더링 영역 */}
      {isModalOpen && (
        <ModalBackdrop onClick={() => setIsModalOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>대차 슬롯 전체 상세</ModalTitle>
              <CloseBtn onClick={() => setIsModalOpen(false)}>
                <FiX size={20} />
              </CloseBtn>
            </ModalHeader>
            <ModalBody>
              {allSlots.map((item, idx) => (
                <SlotItem key={`modal-list-${idx}`} $occupied={item.occupied}>
                  <ItemLeft>
                    <IconCircle $occupied={item.occupied}>
                      {item.occupied ? <FiCheck /> : <FiMinus />}
                    </IconCircle>
                    <ItemInfo>
                      <ItemTitle $occupied={item.occupied}>
                        공정 #{item.camId} - {item.slot_name}
                      </ItemTitle>
                      <ItemSub>
                        <FiClock size={14} /> 
                        입고: {item.entry_time}
                      </ItemSub>
                    </ItemInfo>
                  </ItemLeft>
                  <StatusTextRow $occupied={item.occupied}>
                    <StatusDot $occupied={item.occupied} />
                    {item.occupied ? '작업중' : '빈슬롯'}
                  </StatusTextRow>
                </SlotItem>
              ))}
            </ModalBody>
          </ModalContainer>
        </ModalBackdrop>
      )}
    </>
  );
};

export default SmartFactoryDashboard;
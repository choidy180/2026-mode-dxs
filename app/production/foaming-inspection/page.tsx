"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { 
  FiCheck, 
  FiAlertTriangle,
  FiX,
  FiGrid
} from 'react-icons/fi';

// --------------------------------------------------------------------------
// 1. Global Styles & Fonts
// --------------------------------------------------------------------------
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    background-color: #f8fafc;
    overflow: hidden;
  }
`;

// --------------------------------------------------------------------------
// 2. Types & Data
// --------------------------------------------------------------------------
interface ApiDataItem {
  "time_diff": number;
  "Serial No.": string;
  "Model No.": string;
  "지그번호": string;
  "대차번호": string;
  "R액 압력": string;
  "P액 압력": string;
  "R액 탱크온도": string;
  "P액 탱크온도": string;
  "R액 헤드온도": string;
  "P액 헤드온도": string;
  "온조#1 리턴온도": string;
  "온조#2 리턴온도": string;
  "온조#1 공급수압력": string;
  "온조#2 공급수압력": string;
  [key: string]: any;
}

interface ApiLimitItem {
  name: string;
  min: string;
  max: string;
}

interface ApiResponse {
  success?: boolean;
  data: ApiDataItem[];
  DX_LIMIT_LIST: ApiLimitItem[];
}

interface GaugeData {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  value: number;
  isError: boolean;
}

const METRIC_CONFIG = [
  { key: 'R액 압력', label: 'R액 압력', unit: 'bar' },
  { key: 'P액 압력', label: 'P액 압력', unit: 'bar' },
  { key: 'R액 탱크온도', label: 'R액 탱크온도', unit: '℃' },
  { key: 'P액 탱크온도', label: 'P액 탱크온도', unit: '℃' },
  { key: 'R액 헤드온도', label: 'R액 헤드온도', unit: '℃' },
  { key: 'P액 헤드온도', label: 'P액 헤드온도', unit: '℃' },
  { key: '온조#1 리턴온도', label: '온조#1 리턴온도', unit: '℃' },
  { key: '온조#2 리턴온도', label: '온조#2 리턴온도', unit: '℃' },
  { key: '온조#1 공급수압력', label: '온조#1 공급수압력', unit: 'bar' },
  { key: '온조#2 공급수압력', label: '온조#2 공급수압력', unit: 'bar' },
];

// M-01 ~ M-24 목업 데이터 자동 생성
const generateMockData = (): ApiDataItem[] => {
  const data: ApiDataItem[] = [];
  for (let i = 1; i <= 24; i++) {
    const id = `M-${String(i).padStart(2, '0')}`;
    // M-05, M-12 등 일부 설비에만 고의로 에러 데이터 주입
    const isError = i === 5 || i === 12; 
    data.push({
      "time_diff": 0, 
      "Serial No.": `W00${i}`, 
      "Model No.": `MOD${i}`, 
      "지그번호": `J${i}`, 
      "대차번호": id, 
      "R액 압력": isError ? "120.0" : "150.5",
      "P액 압력": "148.2", 
      "R액 탱크온도": isError ? "35.5" : "26.1",
      "P액 탱크온도": "26.5", // <--- 누락되었던 이 부분을 추가했습니다.
      "R액 헤드온도": "28.0", 
      "P액 헤드온도": "28.5", 
      "온조#1 리턴온도": "28.0", 
      "온조#2 리턴온도": "3.67", 
      "온조#1 공급수압력": "28.0", 
      "온조#2 공급수압력": "28.5" 
    });
  }
  return data;
};

const MOCK_API_RESPONSE: ApiResponse = {
  success: true,
  data: generateMockData(),
  "DX_LIMIT_LIST": [
    { "name": "R액 압력", "min": "130", "max": "170" },
    { "name": "P액 압력", "min": "130", "max": "170" },
    { "name": "R액 탱크온도", "min": "20", "max": "30" },
    { "name": "P액 탱크온도", "min": "20", "max": "30" },
    { "name": "R액 헤드온도", "min": "25", "max": "35" },
    { "name": "P액 헤드온도", "min": "25", "max": "35" },
    { "name": "온조#1 리턴온도", "min": "25", "max": "35" },
    { "name": "온조#2 리턴온도", "min": "3", "max": "6" },
    { "name": "온조#1 공급수압력", "min": "25", "max": "35" },
    { "name": "온조#2 공급수압력", "min": "25", "max": "35" }
  ]
};

// --------------------------------------------------------------------------
// 3. Styled Components
// --------------------------------------------------------------------------
const PageContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 60px);
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  overflow: hidden;
`;

const TopNavContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  flex-shrink: 0;
`;

const TabGroup = styled.div`
  display: flex;
  background-color: #f1f5f9;
  padding: 6px;
  border-radius: 99px;
  gap: 4px;
`;

const Tab = styled.button<{ $active?: boolean; $hasError?: boolean; $isAction?: boolean }>`
  background-color: ${props => props.$isAction ? '#0f172a' : (props.$active ? '#ffffff' : 'transparent')};
  color: ${props => props.$isAction ? '#ffffff' : (props.$hasError ? '#ef4444' : (props.$active ? '#0f172a' : '#94a3b8'))};
  border: none;
  padding: 10px 24px;
  border-radius: 99px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: ${props => props.$active || props.$isAction ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$isAction ? '#1e293b' : (props.$active ? '#ffffff' : '#e2e8f0')};
  }
`;

const ErrorDot = styled.div`
  width: 16px;
  height: 16px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 900;
`;

// --- 모달 관련 스타일 추가 ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #ffffff;
  border-radius: 24px;
  width: 750px;
  padding: 32px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 900;
  color: #0f172a;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 28px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #0f172a;
  }
`;

const MachineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
`;

const MachineButton = styled.button<{ $active?: boolean; $hasError?: boolean }>`
  position: relative;
  background: ${props => props.$active ? '#0f172a' : (props.$hasError ? '#fef2f2' : '#f1f5f9')};
  color: ${props => props.$active ? '#ffffff' : (props.$hasError ? '#ef4444' : '#475569')};
  border: 2px solid ${props => props.$active ? '#0f172a' : (props.$hasError ? '#fca5a5' : 'transparent')};
  border-radius: 12px;
  padding: 16px 0;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#0f172a' : (props.$hasError ? '#fee2e2' : '#e2e8f0')};
    transform: translateY(-2px);
  }

  .status-dot {
    position: absolute;
    top: -6px;
    right: -6px;
  }
`;
// ------------------------------

const DashboardGrid = styled.div`
  display: flex;
  gap: 24px;
  height: 100%;
  min-height: 0;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 340px;
  gap: 24px;
  flex-shrink: 0;
  height: 100%;
`;

const StatusCard = styled.div<{ $type: 'good' | 'error' }>`
  background-color: ${props => props.$type === 'good' ? '#ecfdf5' : '#fef2f2'};
  border: 2px solid ${props => props.$type === 'good' ? '#10b981' : '#ef4444'};
  border-radius: 20px;
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-height: 0;
`;

const CardTitle = styled.div`
  width: 100%;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: auto;
`;

const CircleIconWrapper = styled.div<{ $type: 'good' | 'error' }>`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background-color: ${props => props.$type === 'good' ? '#d1fae5' : '#fee2e2'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
`;

const CircleIconInner = styled.div<{ $type: 'good' | 'error' }>`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: ${props => props.$type === 'good' ? '#10b981' : '#ef4444'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 42px;
  box-shadow: ${props => props.$type === 'good' 
    ? '0 10px 20px -5px rgba(16, 185, 129, 0.4)' 
    : '0 10px 20px -5px rgba(239, 68, 68, 0.4)'};
`;

const StatusMainText = styled.div`
  font-size: 38px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 12px;
  letter-spacing: -1px;
`;

const StatusSubPill = styled.div<{ $type: 'good' | 'error' }>`
  background-color: ${props => props.$type === 'good' ? '#d1fae5' : '#fee2e2'};
  color: ${props => props.$type === 'good' ? '#059669' : '#dc2626'};
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: auto;
`;

const LegendWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  background-color: #ffffff;
  padding: 10px 20px;
  border-radius: 99px;
  width: calc(100% - 10px);
`;

const LegendDot = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #475569;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${props => props.color};
  }
`;

const RightColumn = styled.div`
  flex: 1;
  background-color: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 32px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`;

const RightHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-shrink: 0;
`;

const RightTitle = styled.h2`
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  color: #0f172a;
`;

const LiveBadge = styled.div`
  background-color: #fef2f2;
  color: #ef4444;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.5px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background-color: #ef4444;
    border-radius: 50%;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding-bottom: 10px;
`;

const MetricCardWrapper = styled.div<{ $isError: boolean }>`
  border: 1px solid ${props => props.$isError ? '#fca5a5' : '#e2e8f0'};
  background-color: ${props => props.$isError ? '#fef2f2' : '#ffffff'};
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  height: 130px;
  justify-content: center;
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const MetricName = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;

  span {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 600;
    margin-left: 4px;
  }
`;

const MetricValueBox = styled.div<{ $isError: boolean }>`
  background-color: ${props => props.$isError ? '#ef4444' : '#10b981'};
  color: white;
  padding: 4px 16px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const GaugeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 30px;
`;

const GaugeTrack = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 99px;
`;

const GaugeFill = styled.div<{ $percent: number; $isError: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${props => props.$percent}%;
  height: 8px;
  background-color: ${props => props.$isError ? '#ef4444' : '#10b981'};
  border-radius: 99px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const GaugeValueText = styled.div<{ $percent: number }>`
  position: absolute;
  bottom: 12px;
  left: ${props => props.$percent}%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const GaugeMinMax = styled.div`
  position: absolute;
  bottom: -18px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
`;

// --------------------------------------------------------------------------
// 4. Sub-Components
// --------------------------------------------------------------------------
const MetricCard = ({ data }: { data: GaugeData }) => {
  let percent = ((data.value - data.min) / (data.max - data.min)) * 100;
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  // 중간값(최적값) 계산 로직 유지
  const optimalValue = (data.min + data.max) / 2;
  const displayOptimal = Number.isInteger(optimalValue) ? optimalValue : optimalValue.toFixed(1);

  return (
    <MetricCardWrapper $isError={data.isError}>
      <MetricHeader>
        <MetricName>
          {data.label} <span>({data.unit})</span>
        </MetricName>
        <MetricValueBox $isError={data.isError}>
          {displayOptimal}
        </MetricValueBox>
      </MetricHeader>
      
      <GaugeContainer>
        <GaugeValueText $percent={percent}>{data.value}</GaugeValueText>
        <GaugeTrack />
        <GaugeFill $percent={percent} $isError={data.isError} />
        <GaugeMinMax>
          <span>{data.min}</span>
          <span>{data.max}</span>
        </GaugeMinMax>
      </GaugeContainer>
    </MetricCardWrapper>
  );
};

// --------------------------------------------------------------------------
// 5. Main Page Component
// --------------------------------------------------------------------------
export default function ProcessDashboard() {
  const [cartList, setCartList] = useState<ApiDataItem[]>([]);
  const [selectedCartNo, setSelectedCartNo] = useState<string>('');
  const [metricsData, setMetricsData] = useState<GaugeData[]>([]);
  const [apiLimits, setApiLimits] = useState<Record<string, {min: number, max: number}>>({});
  
  // 모달 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://1.254.24.170:24830/api/DX_API000022');
        if (!res.ok) throw new Error('API Failed');
        const json: ApiResponse = await res.json();
        processApiResponse(json);
      } catch (err) {
        console.warn('API Fetch failed, using Mock Data');
        processApiResponse(MOCK_API_RESPONSE);
      }
    };
    fetchData();
  }, []);

  // 2. Process Response
  const processApiResponse = (json: ApiResponse) => {
    const limitMap: Record<string, {min: number, max: number}> = {};
    if (json.DX_LIMIT_LIST) {
      json.DX_LIMIT_LIST.forEach(item => {
        let min = parseFloat(item.min);
        let max = parseFloat(item.max);
        if (isNaN(min)) min = 0;
        if (isNaN(max)) max = 100;
        limitMap[item.name] = { min, max };
      });
    }
    setApiLimits(limitMap);

    if (json.data && json.data.length > 0) {
      setCartList(json.data);
      if (!selectedCartNo) {
        setSelectedCartNo(json.data[0]['대차번호']);
        updateMetricsForCart(json.data[0], limitMap);
      }
    }
  };

  // 3. Update Metrics when Cart Changes
  const updateMetricsForCart = useCallback((cartData: ApiDataItem, limits: Record<string, {min: number, max: number}>) => {
    const newMetrics: GaugeData[] = [];

    METRIC_CONFIG.forEach((config, index) => {
      const valStr = cartData[config.key];
      const val = parseFloat(valStr);
      
      let min = 0, max = 100;
      if (limits[config.key]) {
        min = limits[config.key].min;
        max = limits[config.key].max;
      }
      if (min > max) { [min, max] = [max, min]; }

      if (!isNaN(val)) {
        const isError = val < min || val > max;
        newMetrics.push({
          id: `m-${index}`,
          label: config.label,
          unit: config.unit,
          min,
          max,
          value: val,
          isError
        });
      }
    });
    setMetricsData(newMetrics);
  }, []);

  // Handle Tab Click
  const handleCartChange = (cartNo: string) => {
    setSelectedCartNo(cartNo);
    const cartData = cartList.find(c => c['대차번호'] === cartNo);
    if (cartData) {
      updateMetricsForCart(cartData, apiLimits);
    }
  };

  // Check if a specific cart has any errors
  const checkCartError = useCallback((item: ApiDataItem | string) => {
    let data;
    if (typeof item === 'string') {
      data = cartList.find(c => c['대차번호'] === item);
    } else {
      data = item;
    }
    if (!data) return false;

    return METRIC_CONFIG.some(config => {
      const val = parseFloat(data[config.key]);
      if (isNaN(val)) return false;
      const limit = apiLimits[config.key];
      if (!limit) return false;
      let { min, max } = limit;
      if (min > max) { [min, max] = [max, min]; }
      return val < min || val > max;
    });
  }, [apiLimits, cartList]);

  // Global Error State derived from currently viewed metrics
  const errorMetrics = useMemo(() => metricsData.filter(m => m.isError), [metricsData]);
  const hasCriticalError = errorMetrics.length > 0;
  const errorCount = errorMetrics.length;

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        {/* 모달 오버레이 및 컨테이너 */}
        {isModalOpen && (
          <ModalOverlay onClick={() => setIsModalOpen(false)}>
            <ModalContainer onClick={e => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>설비 선택 (M-01 ~ M-24)</ModalTitle>
                <CloseButton onClick={() => setIsModalOpen(false)}>
                  <FiX />
                </CloseButton>
              </ModalHeader>
              <MachineGrid>
                {cartList.map(item => {
                  const cNo = item['대차번호'];
                  const hasErr = checkCartError(cNo);
                  return (
                    <MachineButton 
                      key={cNo}
                      $active={selectedCartNo === cNo}
                      $hasError={hasErr}
                      onClick={() => {
                        handleCartChange(cNo);
                        setIsModalOpen(false); // 선택 시 모달 닫기
                      }}
                    >
                      {hasErr && <ErrorDot className="status-dot">!</ErrorDot>}
                      {cNo}
                    </MachineButton>
                  );
                })}
              </MachineGrid>
            </ModalContainer>
          </ModalOverlay>
        )}

        <TopNavContainer>
          <TabGroup>
            {/* 현재 선택된 설비만 표시 */}
            <Tab $active={true} $hasError={checkCartError(selectedCartNo)}>
              {checkCartError(selectedCartNo) && <ErrorDot>!</ErrorDot>}
              {selectedCartNo}
            </Tab>
            {/* 모달을 여는 버튼 추가 */}
            <Tab 
              $isAction={true} 
              onClick={() => setIsModalOpen(true)}
            >
              <FiGrid />
              설비 전체보기
            </Tab>
          </TabGroup>
        </TopNavContainer>

        <DashboardGrid>
          <LeftColumn>
            <StatusCard $type={hasCriticalError ? "error" : "good"}>
              <CardTitle>설비 상태</CardTitle>
              <CircleIconWrapper $type={hasCriticalError ? "error" : "good"}>
                <CircleIconInner $type={hasCriticalError ? "error" : "good"}>
                  {hasCriticalError ? <FiAlertTriangle strokeWidth={2.5} /> : <FiCheck strokeWidth={3} />}
                </CircleIconInner>
              </CircleIconWrapper>
              <StatusMainText>{hasCriticalError ? "점검" : "양호"}</StatusMainText>
              <StatusSubPill $type={hasCriticalError ? "error" : "good"}>
                {hasCriticalError ? <FiAlertTriangle size={14} /> : <FiCheck size={14} />} 
                {hasCriticalError ? "관리 범위 이탈 발생" : "관리 범위 내 안정적으로 운영중"}
              </StatusSubPill>
              <LegendWrapper>
                <LegendDot color="#10b981">양호</LegendDot>
                <LegendDot color="#facc15">주의</LegendDot>
                <LegendDot color="#ef4444">불량</LegendDot>
              </LegendWrapper>
            </StatusCard>

            <StatusCard $type={errorCount > 0 ? "error" : "good"}>
              <CardTitle>발생 건수</CardTitle>
              <CircleIconWrapper $type={errorCount > 0 ? "error" : "good"}>
                <CircleIconInner $type={errorCount > 0 ? "error" : "good"}>
                  {errorCount > 0 ? <FiAlertTriangle strokeWidth={2.5} /> : <FiCheck strokeWidth={3} />}
                </CircleIconInner>
              </CircleIconWrapper>
              <StatusMainText>{errorCount}건</StatusMainText>
              <StatusSubPill $type={errorCount > 0 ? "error" : "good"}>
                {errorCount > 0 ? <FiAlertTriangle size={14} /> : <FiCheck size={14} />} 
                {errorCount > 0 ? `특이사항이 ${errorCount}건 발생했습니다.` : "특이사항 없음"}
              </StatusSubPill>
              <LegendWrapper>
                <LegendDot color="#10b981">없음</LegendDot>
                <LegendDot color="#facc15">1건 이상</LegendDot>
                <LegendDot color="#ef4444">3건 이상</LegendDot>
              </LegendWrapper>
            </StatusCard>
          </LeftColumn>

          <RightColumn>
            <RightHeader>
              <RightTitle>핵심 공정 지표 및 운영 범위</RightTitle>
              <LiveBadge>LIVE</LiveBadge>
            </RightHeader>
            <MetricsGrid>
              {metricsData.map((metric) => (
                <MetricCard key={metric.id} data={metric} />
              ))}
            </MetricsGrid>
          </RightColumn>
        </DashboardGrid>
      </PageContainer>
    </>
  );
}
"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  FiAlertTriangle,
  FiCheck,
  FiGrid,
  FiX,
} from 'react-icons/fi';

// --------------------------------------------------------------------------
// 1. Global Styles
// --------------------------------------------------------------------------
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #f6f7f9;
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

  for (let i = 1; i <= 24; i += 1) {
    const id = `M-${String(i).padStart(2, '0')}`;
    const isError = i === 5 || i === 12;

    data.push({
      "time_diff": 0,
      "Serial No.": `W00${i}`,
      "Model No.": `MOD${i}`,
      "지그번호": `J${i}`,
      "대차번호": id,
      "R액 압력": isError ? '120.0' : '150.5',
      "P액 압력": '148.2',
      "R액 탱크온도": isError ? '35.5' : '26.1',
      "P액 탱크온도": '26.5',
      "R액 헤드온도": '28.0',
      "P액 헤드온도": '28.5',
      "온조#1 리턴온도": '28.0',
      "온조#2 리턴온도": '3.67',
      "온조#1 공급수압력": '28.0',
      "온조#2 공급수압력": '28.5',
    });
  }

  return data;
};

const MOCK_API_RESPONSE: ApiResponse = {
  success: true,
  data: generateMockData(),
  DX_LIMIT_LIST: [
    { name: 'R액 압력', min: '130', max: '170' },
    { name: 'P액 압력', min: '130', max: '170' },
    { name: 'R액 탱크온도', min: '20', max: '30' },
    { name: 'P액 탱크온도', min: '20', max: '30' },
    { name: 'R액 헤드온도', min: '25', max: '35' },
    { name: 'P액 헤드온도', min: '25', max: '35' },
    { name: '온조#1 리턴온도', min: '25', max: '35' },
    { name: '온조#2 리턴온도', min: '3', max: '6' },
    { name: '온조#1 공급수압력', min: '25', max: '35' },
    { name: '온조#2 공급수압력', min: '25', max: '35' },
  ],
};

// --------------------------------------------------------------------------
// 3. Styled Components
// --------------------------------------------------------------------------
const PageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  height: calc(100dvh - 60px);
  margin-top: 60px;
  padding: 24px 32px 28px;
  display: flex;
  flex-direction: column;
  background: #f6f7f9;
  color: #0f172a;
  overflow: hidden;
`;

const TopNavContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 18px;
  flex-shrink: 0;
`;

const TabGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
`;

const Tab = styled.button<{ $active?: boolean; $hasError?: boolean; $isAction?: boolean }>`
  min-height: 42px;
  max-width: 240px;
  padding: 0 18px;
  border: 1px solid ${({ $active, $isAction }) => ($active || $isAction ? '#d31145' : 'transparent')};
  border-radius: 999px;
  background: ${({ $active, $isAction }) => {
    if ($isAction) return '#d31145';
    if ($active) return '#fff5f7';
    return 'transparent';
  }};
  color: ${({ $active, $hasError, $isAction }) => {
    if ($isAction) return '#ffffff';
    if ($hasError) return '#dc2626';
    if ($active) return '#0f172a';
    return '#64748b';
  }};
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;

  &:hover {
    background: ${({ $active, $isAction }) => {
      if ($isAction) return '#b90f3b';
      if ($active) return '#fff1f4';
      return '#f8fafc';
    }};
  }
`;

const ErrorDot = styled.div`
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  background: #dc2626;
  color: #ffffff;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: min(760px, calc(100vw - 48px));
  max-height: calc(100dvh - 96px);
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e8edf4;
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

const CloseButton = styled.button`
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease;

  &:hover {
    background: #f8fafc;
    border-color: #d8dee8;
    color: #0f172a;
  }
`;

const MachineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
  max-height: calc(100dvh - 190px);
  padding-right: 2px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 999px;
  }
`;

const MachineButton = styled.button<{ $active?: boolean; $hasError?: boolean }>`
  position: relative;
  min-height: 74px;
  padding: 14px 10px;
  border: 1px solid ${({ $active, $hasError }) => {
    if ($active) return '#d31145';
    if ($hasError) return '#fecaca';
    return '#e8edf4';
  }};
  border-radius: 16px;
  background: ${({ $active, $hasError }) => {
    if ($active) return '#fff5f7';
    if ($hasError) return '#fff7f7';
    return '#f8fafc';
  }};
  color: ${({ $active, $hasError }) => {
    if ($active) return '#d31145';
    if ($hasError) return '#dc2626';
    return '#334155';
  }};
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;

  &:hover {
    background: ${({ $active, $hasError }) => {
      if ($active) return '#fff1f4';
      if ($hasError) return '#fee2e2';
      return '#ffffff';
    }};
    border-color: ${({ $active, $hasError }) => {
      if ($active) return '#d31145';
      if ($hasError) return '#fca5a5';
      return '#d8dee8';
    }};
  }

  .status-dot {
    position: absolute;
    top: 7px;
    right: 7px;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 18px;
  height: 100%;
  min-height: 0;
`;

const LeftColumn = styled.div`
  display: grid;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 18px;
  min-height: 0;
`;

const StatusCard = styled.div<{ $type: 'good' | 'error' }>`
  min-height: 0;
  padding: 26px;
  background: ${({ $type }) => ($type === 'good' ? '#ffffff' : '#fff7f7')};
  border: 1px solid ${({ $type }) => ($type === 'good' ? '#e8edf4' : '#fecaca')};
  border-radius: 28px;
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const CardTitle = styled.div`
  width: 100%;
  margin-bottom: auto;
  color: #334155;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const CircleIconWrapper = styled.div<{ $type: 'good' | 'error' }>`
  width: 128px;
  height: 128px;
  margin: 14px 0;
  border-radius: 50%;
  background: ${({ $type }) => ($type === 'good' ? '#ecfdf5' : '#fee2e2')};
  border: 1px solid ${({ $type }) => ($type === 'good' ? '#bbf7d0' : '#fecaca')};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CircleIconInner = styled.div<{ $type: 'good' | 'error' }>`
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: ${({ $type }) => ($type === 'good' ? '#15803d' : '#dc2626')};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  box-shadow: ${({ $type }) => (
    $type === 'good'
      ? '0 12px 24px rgba(21, 128, 61, 0.16)'
      : '0 12px 24px rgba(220, 38, 38, 0.16)'
  )};
`;

const StatusMainText = styled.div`
  margin-bottom: 12px;
  color: #0f172a;
  font-size: 44px;
  font-weight: 700;
  letter-spacing: -0.06em;
`;

const StatusSubPill = styled.div<{ $type: 'good' | 'error' }>`
  max-width: 100%;
  margin-bottom: auto;
  padding: 7px 12px;
  border: 1px solid ${({ $type }) => ($type === 'good' ? '#bbf7d0' : '#fecaca')};
  border-radius: 999px;
  background: ${({ $type }) => ($type === 'good' ? '#f0fdf4' : '#fef2f2')};
  color: ${({ $type }) => ($type === 'good' ? '#15803d' : '#dc2626')};
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LegendWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 999px;
`;

const LegendDot = styled.div<{ color: string }>`
  min-width: 0;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    flex: 0 0 8px;
    border-radius: 50%;
    background: ${({ color }) => color};
  }
`;

const RightColumn = styled.div`
  min-width: 0;
  min-height: 0;
  padding: 26px;
  background: #f8fafc;
  border: 1px solid #e8edf4;
  border-radius: 28px;
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const RightHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-bottom: 20px;
  flex-shrink: 0;
`;

const RightTitle = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LiveBadge = styled.div`
  flex: 0 0 auto;
  padding: 7px 12px;
  border: 1px solid #fecaca;
  border-radius: 999px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #dc2626;
  }
`;

const MetricsGrid = styled.div`
  min-height: 0;
  padding-right: 4px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 999px;
  }
`;

const MetricCardWrapper = styled.div<{ $isError: boolean }>`
  height: 142px;
  padding: 20px 22px;
  border: 1px solid ${({ $isError }) => ($isError ? '#fca5a5' : '#e5e7eb')};
  border-radius: 22px;
  background: ${({ $isError }) => ($isError ? '#fff7f7' : '#ffffff')};
  box-shadow: ${({ $isError }) => (
    $isError
      ? '0 14px 30px rgba(220, 38, 38, 0.08)'
      : '0 12px 28px rgba(15, 23, 42, 0.05)'
  )};
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
`;

const MetricName = styled.div`
  min-width: 0;
  color: #0f172a;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.03em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-flex;
  align-items: baseline;
  gap: 6px;

  .metric-unit {
    color: #64748b;
    font-size: 13px;
    font-weight: 700;
  }
`;

const MetricValueBox = styled.div<{ $isError: boolean }>`
  flex: 0 0 auto;
  min-width: 96px;
  padding: 7px 12px;
  border: 1px solid ${({ $isError }) => ($isError ? '#fecaca' : '#bbf7d0')};
  border-radius: 999px;
  background: ${({ $isError }) => ($isError ? '#fef2f2' : '#f0fdf4')};
  color: ${({ $isError }) => ($isError ? '#dc2626' : '#15803d')};
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  text-align: right;
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;

  span {
    font-size: 12px;
    font-weight: 700;
  }
`;

const GaugeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 44px;
`;

const GaugeTrack = styled.div`
  position: absolute;
  top: 8px;
  left: 0;
  width: 100%;
  height: 14px;
  background: #e8edf4;
  border-radius: 999px;
  overflow: hidden;
`;

const GaugeFill = styled.div<{ $percent: number; $isError: boolean }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  background: ${({ $isError }) => ($isError ? '#dc2626' : '#15803d')};
  border-radius: 999px;
  transition: width 0.35s ease;
`;

const GaugeMinMax = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
`;

// --------------------------------------------------------------------------
// 4. Sub-Components
// --------------------------------------------------------------------------
const MetricCard = ({ data }: { data: GaugeData }) => {
  let percent = ((data.value - data.min) / (data.max - data.min)) * 100;
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  return (
    <MetricCardWrapper $isError={data.isError}>
      <MetricHeader>
        <MetricName title={data.label}>
          {data.label}
          <span className="metric-unit">{data.unit}</span>
        </MetricName>
        <MetricValueBox $isError={data.isError} title={`${data.value}${data.unit}`}>
          {data.value}
          <span>{data.unit}</span>
        </MetricValueBox>
      </MetricHeader>

      <GaugeContainer>
        <GaugeTrack>
          <GaugeFill $percent={percent} $isError={data.isError} />
        </GaugeTrack>
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
  const [apiLimits, setApiLimits] = useState<Record<string, { min: number; max: number }>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://192.168.2.147:24830/api/DX_API000022');
        if (!res.ok) throw new Error('API Failed');

        const json: ApiResponse = await res.json();
        processApiResponse(json);
      } catch {
        console.warn('API Fetch failed, using Mock Data');
        processApiResponse(MOCK_API_RESPONSE);
      }
    };

    fetchData();
  }, []);

  // 2. Process Response
  const processApiResponse = (json: ApiResponse) => {
    const limitMap: Record<string, { min: number; max: number }> = {};

    if (json.DX_LIMIT_LIST) {
      json.DX_LIMIT_LIST.forEach((item) => {
        let min = parseFloat(item.min);
        let max = parseFloat(item.max);

        if (Number.isNaN(min)) min = 0;
        if (Number.isNaN(max)) max = 100;

        limitMap[item.name] = { min, max };
      });
    }

    setApiLimits(limitMap);

    if (json.data && json.data.length > 0) {
      const firstCartNo = json.data[0]?.['대차번호'] ?? '';

      setCartList(json.data);

      if (!selectedCartNo && firstCartNo) {
        setSelectedCartNo(firstCartNo);
        updateMetricsForCart(json.data[0], limitMap);
      }
    }
  };

  // 3. Update Metrics when Cart Changes
  const updateMetricsForCart = useCallback((cartData: ApiDataItem, limits: Record<string, { min: number; max: number }>) => {
    const newMetrics: GaugeData[] = [];

    METRIC_CONFIG.forEach((config, index) => {
      const valStr = `${cartData[config.key] ?? ''}`;
      const val = parseFloat(valStr);

      let min = limits[config.key]?.min ?? 0;
      let max = limits[config.key]?.max ?? 100;

      if (min > max) {
        [min, max] = [max, min];
      }

      if (!Number.isNaN(val)) {
        const isError = val < min || val > max;

        newMetrics.push({
          id: `m-${index}`,
          label: config.label,
          unit: config.unit,
          min,
          max,
          value: val,
          isError,
        });
      }
    });

    setMetricsData(newMetrics);
  }, []);

  const handleCartChange = (cartNo: string) => {
    setSelectedCartNo(cartNo);

    const cartData = cartList.find((cart) => cart['대차번호'] === cartNo);
    if (cartData) {
      updateMetricsForCart(cartData, apiLimits);
    }
  };

  const checkCartError = useCallback((item: ApiDataItem | string) => {
    const data = typeof item === 'string'
      ? cartList.find((cart) => cart['대차번호'] === item)
      : item;

    if (!data) return false;

    return METRIC_CONFIG.some((config) => {
      const val = parseFloat(`${data[config.key] ?? ''}`);
      if (Number.isNaN(val)) return false;

      const limit = apiLimits[config.key];
      if (!limit) return false;

      let { min, max } = limit;
      if (min > max) {
        [min, max] = [max, min];
      }

      return val < min || val > max;
    });
  }, [apiLimits, cartList]);

  const errorMetrics = useMemo(() => metricsData.filter((metric) => metric.isError), [metricsData]);
  const hasCriticalError = errorMetrics.length > 0;
  const errorCount = errorMetrics.length;

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        {isModalOpen && (
          <ModalOverlay onClick={() => setIsModalOpen(false)}>
            <ModalContainer onClick={(event) => event.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>설비 선택 (M-01 ~ M-24)</ModalTitle>
                <CloseButton type="button" onClick={() => setIsModalOpen(false)} aria-label="설비 선택 닫기">
                  <FiX size={18} />
                </CloseButton>
              </ModalHeader>

              <MachineGrid>
                {cartList.map((item, index) => {
                  const cartNo = item['대차번호'] ?? `M-${String(index + 1).padStart(2, '0')}`;
                  const hasErr = checkCartError(cartNo);

                  return (
                    <MachineButton
                      key={cartNo}
                      type="button"
                      $active={selectedCartNo === cartNo}
                      $hasError={hasErr}
                      onClick={() => {
                        handleCartChange(cartNo);
                        setIsModalOpen(false);
                      }}
                    >
                      {hasErr && <ErrorDot className="status-dot">!</ErrorDot>}
                      {cartNo}
                    </MachineButton>
                  );
                })}
              </MachineGrid>
            </ModalContainer>
          </ModalOverlay>
        )}

        <TopNavContainer>
          <TabGroup>
            <Tab type="button" $active $hasError={checkCartError(selectedCartNo)} title={selectedCartNo}>
              {checkCartError(selectedCartNo) && <ErrorDot>!</ErrorDot>}
              {selectedCartNo || '설비 선택'}
            </Tab>
            <Tab type="button" $isAction onClick={() => setIsModalOpen(true)}>
              <FiGrid size={16} />
              설비 전체보기
            </Tab>
          </TabGroup>
        </TopNavContainer>

        <DashboardGrid>
          <LeftColumn>
            <StatusCard $type={hasCriticalError ? 'error' : 'good'}>
              <CardTitle>설비 상태</CardTitle>
              <CircleIconWrapper $type={hasCriticalError ? 'error' : 'good'}>
                <CircleIconInner $type={hasCriticalError ? 'error' : 'good'}>
                  {hasCriticalError ? <FiAlertTriangle strokeWidth={2.5} /> : <FiCheck strokeWidth={3} />}
                </CircleIconInner>
              </CircleIconWrapper>
              <StatusMainText>{hasCriticalError ? '점검' : '양호'}</StatusMainText>
              <StatusSubPill $type={hasCriticalError ? 'error' : 'good'} title={hasCriticalError ? '관리 범위 이탈 발생' : '관리 범위 내 안정적으로 운영중'}>
                {hasCriticalError ? <FiAlertTriangle size={14} /> : <FiCheck size={14} />}
                {hasCriticalError ? '관리 범위 이탈 발생' : '관리 범위 내 안정적으로 운영중'}
              </StatusSubPill>
              <LegendWrapper>
                <LegendDot color="#15803d">양호</LegendDot>
                <LegendDot color="#ca8a04">주의</LegendDot>
                <LegendDot color="#dc2626">불량</LegendDot>
              </LegendWrapper>
            </StatusCard>

            <StatusCard $type={errorCount > 0 ? 'error' : 'good'}>
              <CardTitle>발생 건수</CardTitle>
              <CircleIconWrapper $type={errorCount > 0 ? 'error' : 'good'}>
                <CircleIconInner $type={errorCount > 0 ? 'error' : 'good'}>
                  {errorCount > 0 ? <FiAlertTriangle strokeWidth={2.5} /> : <FiCheck strokeWidth={3} />}
                </CircleIconInner>
              </CircleIconWrapper>
              <StatusMainText>{errorCount}건</StatusMainText>
              <StatusSubPill $type={errorCount > 0 ? 'error' : 'good'} title={errorCount > 0 ? `특이사항이 ${errorCount}건 발생했습니다.` : '특이사항 없음'}>
                {errorCount > 0 ? <FiAlertTriangle size={14} /> : <FiCheck size={14} />}
                {errorCount > 0 ? `특이사항이 ${errorCount}건 발생했습니다.` : '특이사항 없음'}
              </StatusSubPill>
              <LegendWrapper>
                <LegendDot color="#15803d">없음</LegendDot>
                <LegendDot color="#ca8a04">1건 이상</LegendDot>
                <LegendDot color="#dc2626">3건 이상</LegendDot>
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

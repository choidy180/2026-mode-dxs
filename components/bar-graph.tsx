"use client";

import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { 
  FiCheck, 
  FiAlertTriangle, 
  FiActivity, 
  FiThermometer, 
  FiClock, 
  FiBox,
  FiRefreshCw,
  FiX,
  FiAlertOctagon 
} from 'react-icons/fi';

// --------------------------------------------------------------------------
// 1. Types & Data
// --------------------------------------------------------------------------

interface GaugeData {
  id: number;
  label: string;
  unit: string;
  icon: React.ReactNode;
  min: number;
  max: number;
  value: number;
}

const METRIC_DATA: GaugeData[] = [
  { id: 1, label: 'R액 압력', unit: 'kg/m²', icon: <FiActivity />, min: 110, max: 150, value: 120.3 },
  { id: 2, label: 'R액 탱크온도', unit: '°C', icon: <FiThermometer />, min: 13, max: 23, value: 16.9 },
  { id: 3, label: 'P액 헤드온도', unit: '°C', icon: <FiThermometer />, min: 24, max: 28, value: 25.61 },
  { id: 4, label: '발포시간', unit: '초', icon: <FiClock />, min: 0.76, max: 1.66, value: 1.64 },
  { id: 5, label: '가조립무게', unit: 'g', icon: <FiBox />, min: 2375, max: 12530, value: 6952.1 },
  { id: 6, label: '믹싱모터', unit: 'rpm', icon: <FiActivity />, min: 1800, max: 2200, value: 2450 },
];

interface AlertItemData {
  id: number;
  type: 'error' | 'warning';
  title: string;
  desc: string;
  time: string;
  value?: string;
}

// --------------------------------------------------------------------------
// 2. Keyframes
// --------------------------------------------------------------------------

const pulseGreen = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 200, 150, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(0, 200, 150, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 200, 150, 0); }
`;

const pulseRed = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(238, 70, 72, 0.7); transform: scale(1); }
  50% { transform: scale(1.02); }
  70% { box-shadow: 0 0 0 20px rgba(238, 70, 72, 0); }
  100% { box-shadow: 0 0 0 0 rgba(238, 70, 72, 0); transform: scale(1); }
`;

const dangerPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const slideInRight = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// --------------------------------------------------------------------------
// 3. Styled Components (요청 사항 반영)
// --------------------------------------------------------------------------

const PageContainer = styled.div`
  background-color: #f5f7fa;
  
  /* 🔥 요청사항 반영 */
  width: calc(100vw);    /* 가로: 전체 - 60px */
  height: 100vh;
  padding-top: 24px;             /* 상단 마진 50px */
  margin-left: auto;            /* 중앙 정렬 */
  margin-right: auto;           /* 중앙 정렬 */
  
  position: relative; /* 알림창(absolute)의 기준점 */
  overflow: hidden;   /* 내부 스크롤만 허용하고 전체 스크롤 방지 */
  display: flex;
  justify-content: center;
  align-items: center;
  
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  color: #111;
  display: flex;
  flex-direction: column;
  @media (min-width: 2000px) {
    padding-top: 50px;
  }
  
  /* 컨테이너 자체에 그림자를 주어 붕 떠있는 카드 느낌을 낼 수도 있음 (선택사항) */
  /* box-shadow: 0 0 20px rgba(0,0,0,0.1); */
  /* border-radius: 8px; */
`;

const ContentWrapper = styled.div`
  width: 100%; /* 부모(PageContainer)에 꽉 차게 */
  max-width: calc(100% - 60px);
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
`;

const PageHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 70px; /* 헤더 높이 살짝 조정 */
  padding: 20px 0; /* 좌우 패딩 제거 (ContentWrapper가 꽉 차므로) */
  flex-shrink: 0;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  color: #1e293b;
  letter-spacing: -0.5px;

  @media (min-width: 2000px) {
    font-size: 42px;
  }
`;

const CurrentTime = styled.div`
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  padding: 8px 16px;
  border-radius: 99px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    background-color: #10b981;
    border-radius: 50%;
    animation: ${blink} 1.5s infinite ease-in-out;
  }

  @media (min-width: 2000px) {
    font-size: 18px;
    padding: 10px 24px;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 22% 1fr; 
  gap: 24px;
  align-items: stretch;
  flex: 1; /* 남은 높이 모두 차지 */
  min-height: 0; 
  padding-bottom: 10px; /* 하단 여유 */

  @media (max-width: 1400px) {
    grid-template-columns: 320px 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
`;

const RightColumn = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 24px 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto; /* 내용 넘치면 내부 스크롤 */
  
  /* 스크롤바 커스텀 (선택) */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9; 
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1; 
    border-radius: 4px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 16px;
  flex-shrink: 0;
  border-bottom: 1px solid #f1f5f9;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;

  @media (min-width: 2000px) {
    font-size: 30px;
  }
`;

const DateLabel = styled.span`
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  padding: 6px 12px;
  border-radius: 6px;
  
  svg {
    font-size: 14px;
    color: #94a3b8;
  }

  @media (min-width: 2000px) {
    font-size: 16px;
    padding: 8px 16px;
    svg { font-size: 18px; }
  }
`;

const MetricsList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
  flex: 1;
  width: 100%;
  gap: 12px; 
  padding-top: 16px;
`;

// --------------------------------------------------------------------------
// 4. Status Card Components
// --------------------------------------------------------------------------

const CardBase = styled.div<{ $status: 'good' | 'error', $clickable?: boolean }>`
  background: ${props => props.$status === 'good' ? 'rgb(59 255 190 / 5%)' : 'rgb(255 101 101 / 5%)'};
  border-radius: 20px;
  padding: 24px;
  flex: 1; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 2px solid ${props => props.$status === 'good' ? '#10b981' : '#ef4444'};
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  
  &:hover {
    transform: ${props => props.$clickable ? 'translateY(-4px)' : 'none'};
    box-shadow: ${props => props.$clickable ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)'};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 30%;
    background: ${props => props.$status === 'good' 
      ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.1) 0%, rgba(255,255,255,0) 100%)' 
      : 'linear-gradient(180deg, rgba(239, 68, 68, 0.1) 0%, rgba(255,255,255,0) 100%)'};
    z-index: 0;
  }
`;

const CardHeader = styled.div`
  width: 100%;
  text-align: left;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 700;
  color: #334155;
  z-index: 1;

  @media (min-width: 2000px) {
    font-size: 32px;
  }
`;

const StatusCircle = styled.div<{ $status: 'good' | 'error' }>`
  width: 12vmin;
  height: 12vmin;
  min-width: 100px; min-height: 100px;
  max-width: 150px; max-height: 150px;
  
  border-radius: 50%;
  background: ${props => props.$status === 'good' ? '#10b981' : '#ef4444'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 20px ${props => props.$status === 'good' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  z-index: 1;
  animation: ${props => props.$status === 'good' ? pulseGreen : pulseRed} 2s infinite;
  
  svg {
    width: 50%;
    height: 50%;
  }
`;

const StatusText = styled.div`
  font-size: 42px;
  font-weight: 800;
  color: #0f172a;
  z-index: 1;

  @media (min-width: 2000px) {
    font-size: 56px;
  }
`;

const StatusBadge = styled.div<{ $status: 'good' | 'error' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 20px;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 600;
  z-index: 1;
  
  ${props => props.$status === 'good' ? css`
    background-color: #D2F6EA;
    color: #01A871;
  ` : css`
    background-color: #FFDDDD;
    color: #dc2626;
  `}

  @media (min-width: 2000px) {
    font-size: 18px;
    padding: 8px 24px;
  }
`;

const LegendContainer = styled.div`
  width: 100%;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  justify-content: center;
  gap: 16px;
  z-index: 1;

  @media (min-width: 2000px) {
    padding: 12px 16px;
    gap: 24px;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;

  &::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${props => props.color};
  }

  @media (min-width: 2000px) {
    font-size: 16px;
    &::before { width: 14px; height: 14px; }
  }
`;

const StatusCard = ({ 
  type, title, mainText, subText, onClick
}: { 
  type: 'good' | 'error', title: string, mainText: string, subText: string, onClick?: () => void
}) => {
  return (
    <CardBase $status={type} onClick={onClick} $clickable={!!onClick}>
      <CardHeader>{title}</CardHeader>
      <StatusCircle $status={type}>
        {type === 'good' ? <FiCheck /> : <FiAlertTriangle />}
      </StatusCircle>
      <StatusText>{mainText}</StatusText>
      <StatusBadge $status={type}>
        {type === 'good' ? <FiCheck size={14} /> : <FiAlertTriangle size={14} />}
        {subText}
      </StatusBadge>
      <LegendContainer>
        <LegendItem color="#10b981">{type === 'good' ? '양호' : '없음'}</LegendItem>
        <LegendItem color="#f59e0b">{type === 'good' ? '주의' : '1건 이상'}</LegendItem>
        <LegendItem color="#ef4444">{type === 'good' ? '불량' : '1건 이상'}</LegendItem>
      </LegendContainer>
    </CardBase>
  );
};

// --------------------------------------------------------------------------
// 5. Metric Row
// --------------------------------------------------------------------------

const RowContainer = styled.div<{ $isError?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-radius: 16px;
  position: relative;
  flex: 1; /* 높이 균등 분배 */
  min-height: 60px; /* 너무 작아지지 않게 */
  
  ${props => props.$isError ? css`
    background: #FEF2F2;
    border: 2px solid #FCA5A5;
  ` : css`
    background: #f1f5f9;
    border: 2px solid transparent;
    &:hover { background-color: #f8fafc; border-color: #e2e8f0; }
  `}
`;

const MetricInfo = styled.div`
  width: 240px;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
  
  @media (min-width: 2000px) {
    width: 300px;
    gap: 20px;
  }
`;

const IconBox = styled.div`
  width: 44px;
  height: 44px;
  background-color: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  @media (min-width: 2000px) {
    width: 60px; height: 60px;
    font-size: 28px;
  }
`;

const MetricLabelGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetricName = styled.span`
  font-weight: 700;
  font-size: 20px;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 4px;

  @media (min-width: 2000px) {
    font-size: 28px;
  }
`;

const MetricUnit = styled.span`
  font-size: 14px;
  color: #757d88;
  font-weight: 400;

  @media (min-width: 2000px) {
    font-size: 18px;
  }
`;

const GaugeColumn = styled.div`
  flex: 1;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 2000px) {
    padding: 0 80px;
  }
`;

const TrackArea = styled.div`
  position: relative;
  width: 100%;
  height: 12px;
  margin-top: 12px;

  @media (min-width: 2000px) {
    height: 18px;
  }
`;

const GaugeTrack = styled.div<{ $isError?: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 99px;
  background: ${props => props.$isError 
    ? '#e2e8f0' 
    : 'linear-gradient(90deg, #3498db 0%, #2ecc71 40%, #fff200 70%, #fd79a8 100%)'};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%);
    background-size: 200% 100%;
    animation: ${shimmer} 3s infinite linear;
    display: ${props => props.$isError ? 'none' : 'block'};
  }
`;

const GaugeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 16px;
  color: #717983;
  font-weight: 500;
  width: 100%;

  @media (min-width: 2000px) {
    font-size: 20px;
    margin-top: 12px;
  }
`;

// 기존 top: -38px -> -28px로 수정
// 기존 미디어쿼리 top: -50px -> -38px로 수정

const GaugeMarker = styled.div<{ $percent: number, $isError?: boolean }>`
  position: absolute;
  top: 50%; /* ✅ 핵심 1: 부모(Track)의 정중앙 높이를 기준점으로 잡습니다. */
  left: ${props => props.$percent}%;
  
  /* ✅ 핵심 2: 컨테이너 크기를 0으로 없애 레이아웃 간섭을 제거합니다. */
  width: 0;
  height: 0;
  
  z-index: 10;
  transition: left 1s cubic-bezier(0.4, 0, 0.2, 1); 

  /* 텍스트 배치 (기준점으로부터 위로 띄움) */
  .value-text {
    position: absolute;
    bottom: 10px; /* 핸들 높이의 절반(6px) + 여백(4px) = 10px 위로 */
    left: 50%;
    transform: translateX(-50%); /* 가로 중앙 정렬 */
    
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.$isError ? '#ef4444' : '#0f172a'};
    white-space: nowrap;
    text-align: center;
  }

  /* 핸들 배치 (기준점에 정중앙 정렬) */
  .handle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* ✅ 핵심 3: 핸들의 중심이 트랙의 중심에 정확히 꽂히도록 함 */
    
    width: 20px;
    height: 12px; /* 트랙 높이(12px)와 동일 */
    
    background: ${props => props.$isError ? '#ef4444' : '#fff'};
    border: 2px solid ${props => props.$isError ? '#b91c1c' : '#334155'};
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    box-sizing: border-box; /* 테두리가 높이에 포함되도록 설정 */
  }

  @media (min-width: 2000px) {
    .value-text { 
      font-size: 26px; 
      bottom: 14px; /* 핸들이 커진 만큼 텍스트도 더 위로 */
    }
    .handle { 
      width: 28px; 
      height: 18px; /* QHD에서는 트랙 높이에 맞춰 18px */
      border-width: 3px; 
    }
  }
`;

const DangerPopup = styled.div`
  position: absolute;
  left: 260px; 
  top: -20px;
  z-index: 50;
  
  background: #ef4444;
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.6);
  
  display: flex;
  align-items: center;
  gap: 16px;
  animation: ${dangerPulse} 2s infinite;

  @media (min-width: 2000px) {
    left: 320px;
    padding: 16px 24px;
    top: -30px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 20px;
    width: 12px;
    height: 12px;
    background: #ef4444;
    transform: rotate(45deg);
  }

  .icon-area {
    font-size: 28px;
    display: flex;
    align-items: center;
    @media (min-width: 2000px) { font-size: 36px; }
  }

  .text-area {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .warning-title {
    font-size: 14px;
    font-weight: 800;
    color: #fee2e2;
    text-transform: uppercase;
    @media (min-width: 2000px) { font-size: 16px; }
  }

  .warning-msg {
    font-size: 15px;
    font-weight: 700;
    white-space: nowrap;
    @media (min-width: 2000px) { font-size: 18px; }
  }

  .action-btn {
    background: white;
    color: #ef4444;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    &:hover { background: #fff1f2; }
    
    @media (min-width: 2000px) { font-size: 16px; padding: 8px 16px; }
  }
`;

const ValueBox = styled.div<{ $isError?: boolean }>`
  width: 110px;
  height: 48px;
  background-color: ${props => props.$isError ? '#ef4444' : '#10b981'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 4px 6px -1px ${props => props.$isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'};
  flex-shrink: 0;

  @media (min-width: 2000px) {
    width: 140px; height: 60px;
    font-size: 24px;
  }
`;

const MetricRow = ({ data }: { data: GaugeData }) => {
  const range = data.max - data.min;
  let percent = ((data.value - data.min) / range) * 100;
  
  const isSpecOut = data.value < data.min || data.value > data.max;

  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  return (
    <RowContainer $isError={isSpecOut}>
      {isSpecOut && (
        <DangerPopup>
          <div className="icon-area"><FiAlertOctagon /></div>
          <div className="text-area">
            <span className="warning-title">CRITICAL WARNING</span>
            <span className="warning-msg">
              현재값 {data.value} (최대 {data.max}) — 즉시 점검 요망
            </span>
          </div>
          <div className="action-btn">조치완료</div>
        </DangerPopup>
      )}

      <MetricInfo>
        <IconBox>{data.icon}</IconBox>
        <MetricLabelGroup>
          <MetricName>
            {data.label} <MetricUnit>({data.unit})</MetricUnit>
          </MetricName>
        </MetricLabelGroup>
      </MetricInfo>

      <GaugeColumn>
        <TrackArea>
          <GaugeMarker $percent={percent} $isError={isSpecOut}>
            <span className="value-text">{data.value}</span>
            <div className="handle" />
          </GaugeMarker>
          <GaugeTrack $isError={isSpecOut} />
        </TrackArea>
        <GaugeLabels>
          <span>{data.min}</span>
          <span>{data.max}</span>
        </GaugeLabels>
      </GaugeColumn>

      <ValueBox $isError={isSpecOut}>
        {data.value}
      </ValueBox>
    </RowContainer>
  );
};

// --------------------------------------------------------------------------
// 6. Notification 
// --------------------------------------------------------------------------

/* 🔥 Position을 fixed -> absolute로 변경하여 PageContainer 내부에 종속되게 함 */
const NotificationContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 400px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none; 
  font-family: 'Pretendard', sans-serif;

  @media (min-width: 2000px) {
    width: 500px;
    top: 30px;
    right: 30px;
  }
`;

const SummaryBanner = styled.div`
  pointer-events: auto;
  background-color: rgba(239, 68, 68, 0.95);
  backdrop-filter: blur(4px);
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3);
  animation: ${slideInRight} 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between; 
    width: 100%;
    margin-bottom: 4px;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 700;
  }

  .close-all-btn {
    cursor: pointer;
    color: white; 
    opacity: 0.9;
    transition: all 0.2s;
    &:hover { opacity: 1; transform: scale(1.2); }
  }

  .sub-text {
    font-size: 13px;
    opacity: 0.9;
    padding-left: 28px; 
  }

  @media (min-width: 2000px) {
    padding: 20px 24px;
    .header-left { font-size: 20px; }
    .sub-text { font-size: 15px; }
  }
`;

const AlertCard = styled.div<{ $type: 'error' | 'warning' }>`
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.$type === 'error' ? '#ef4444' : '#f59e0b'};
  display: flex;
  flex-direction: column;
  animation: ${slideInRight} 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  transition: transform 0.2s;

  &:hover { transform: translateX(-4px); }

  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .badge {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    color: white;
    background-color: ${props => props.$type === 'error' ? '#ef4444' : '#f59e0b'};
  }

  .title {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
  }

  .right-side {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .time {
    font-size: 14px;
    color: #94a3b8;
  }
  
  .close-item-btn {
    cursor: pointer;
    color: #cbd5e1;
    transition: all 0.2s;
    &:hover { color: #64748b; transform: scale(1.1); }
  }

  .desc {
    font-size: 13px;
    color: #475569;
    line-height: 1.5;
    white-space: pre-wrap;
  }

  .value-highlight {
    display: block;
    margin-top: 4px;
    font-weight: 700;
    color: #0f172a;
  }

  @media (min-width: 2000px) {
    padding: 20px;
    .badge { font-size: 13px; }
    .title { font-size: 16px; }
    .desc { font-size: 15px; }
    .time { font-size: 15px; }
  }
`;

interface NotificationSystemProps {
  isOpen: boolean;
  onCloseAll: () => void;
  onCloseItem: (id: number) => void;
  alerts: AlertItemData[];
  hiddenAlertIds: number[];
}

const NotificationSystem = ({ 
  isOpen, 
  onCloseAll, 
  onCloseItem,
  alerts,
  hiddenAlertIds
}: NotificationSystemProps) => {
  const visibleAlerts = alerts.filter(a => !hiddenAlertIds.includes(a.id));
  if (!isOpen || alerts.length === 0) return null;

  return (
    <NotificationContainer>
      <SummaryBanner>
        <div className="header">
          <div className="header-left">
            <FiAlertTriangle size={20} />
            WARNING - 특이사항 발생
          </div>
          <FiX className="close-all-btn" size={24} onClick={onCloseAll} />
        </div>
        <div className="sub-text">
          총 {alerts.length}건의 알림이 있습니다
        </div>
      </SummaryBanner>

      {visibleAlerts.map(alert => (
        <AlertCard key={alert.id} $type={alert.type}>
          <div className="top-row">
            <div className="title-group">
              <div className="badge">{alert.type === 'error' ? '긴급' : '주의'}</div>
              <div className="title">{alert.title}</div>
            </div>
            <div className="right-side">
              <span className="time">{alert.time}</span>
              <FiX className="close-item-btn" size={18} onClick={() => onCloseItem(alert.id)} />
            </div>
          </div>
          <div className="desc">
            {alert.desc}
            {alert.value && <span className="value-highlight">{alert.value}</span>}
          </div>
        </AlertCard>
      ))}
    </NotificationContainer>
  );
};

// --------------------------------------------------------------------------
// 7. Main Page
// --------------------------------------------------------------------------

export default function ProcessMonitorPage() {
  const [showModal, setShowModal] = useState(false);
  const [hiddenAlertIds, setHiddenAlertIds] = useState<number[]>([]);
  
  const [alerts] = useState<AlertItemData[]>([
    {
      id: 1,
      type: 'error',
      title: 'Spec Out 발생',
      desc: 'R액 압력이 관리 상한선(150 kg/m²)을 초과하였습니다.',
      value: '현재 수치: 156.3 kg/m²',
      time: '13:45:22'
    },
    {
      id: 2,
      type: 'warning',
      title: '센서 이상 감지',
      desc: 'P액 헤드온도 센서 응답 지연이 발생하였습니다.\n점검이 필요합니다.',
      time: '17:25:06'
    }
  ]);

  const handleOpenModal = () => {
    setHiddenAlertIds([]);
    setShowModal(true);
  };

  const handleCloseItem = (id: number) => {
    setHiddenAlertIds(prev => [...prev, id]);
  };

  return (
    <PageContainer>
      <NotificationSystem 
        isOpen={showModal} 
        onCloseAll={() => setShowModal(false)}
        onCloseItem={handleCloseItem}
        alerts={alerts}
        hiddenAlertIds={hiddenAlertIds}
      />

      <ContentWrapper>
        <PageHeaderRow>
          <PageTitle>설비이상 징후 탐지 AI (GR2)</PageTitle>
          <CurrentTime>
            2025-12-18 13:53:34
          </CurrentTime>
        </PageHeaderRow>

        <DashboardGrid>
          {/* Left: Status Cards (Flex로 높이 50%씩 차지) */}
          <LeftColumn>
            <StatusCard 
              type="good"
              title="설비 상태"
              mainText="양호"
              subText="관리 범위 내 안정적으로 운영중"
            />
            <StatusCard 
              type="error"
              title="발생 건수"
              mainText={`${alerts.length}/7`}
              subText={`특이사항이 ${alerts.length}건 발생했습니다.`}
              onClick={handleOpenModal}
            />
          </LeftColumn>

          {/* Right: Metrics List (Flex로 높이 채우고 내부 아이템 간격 자동) */}
          <RightColumn>
            <SectionHeader>
              <SectionTitle>핵심 공정 지표 및 운영 범위</SectionTitle>
              <DateLabel>
                <FiRefreshCw /> 
                실시간 데이터 수신중
              </DateLabel>
            </SectionHeader>
            
            <MetricsList>
              {METRIC_DATA.map((item) => (
                <MetricRow key={item.id} data={item} />
              ))}
            </MetricsList>
            
          </RightColumn>
        </DashboardGrid>
      </ContentWrapper>
    </PageContainer>
  );
}

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Monitor, Clock, CheckCircle2, XCircle, 
  ZoomIn, Volume2, VolumeX, Siren, X,
  ClipboardX, Home, Calendar, FileText, 
  ChevronDown, ChevronLeft, ChevronRight,
  Info
} from 'lucide-react';
import styled, { createGlobalStyle } from 'styled-components';

// ─── [CONFIG] 설정 및 테마 ───
type ScreenMode = 'FHD' | 'QHD';

interface ApiData {
  TIMEVALUE: string;
  TIMEVALUE2: string;
  FILENAME1: string;
  FILENAME2: string;
  FILENAME3: string;
  FILENAME4: string;
  FILEPATH1: string;
  FILEPATH2: string;
  FILEPATH3: string;
  FILEPATH4: string;
  CDGITEM: string;
  WO: string;
  COUNT_NUM: string;
  RESULT: string;
  LABEL001: string;
  LABEL002: string;
  LABEL003: string;
  LABEL004: string;
}

interface TotalData {
  total_count: number;
  normal_count: number;
}

const LAYOUT_CONFIGS = {
  FHD: {
    padding: '24px',
    gap: '20px',
    headerHeight: '110px',
    fontSize: { title: '20px', sub: '14px', badge: '13px', metaLabel: '12px', metaValue: '15px' },
    iconSize: 20,
    cornerCardWidth: '320px',
  },
  QHD: {
    padding: '40px',
    gap: '32px',
    headerHeight: '140px',
    fontSize: { title: '28px', sub: '18px', badge: '16px', metaLabel: '14px', metaValue: '18px' },
    iconSize: 28,
    cornerCardWidth: '450px',
  }
};

const theme = {
  bg: '#F1F5F9',
  cardBg: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  accent: '#3B82F6', 
  success: '#10B981',
  danger: '#EF4444',
  border: '#E2E8F0',
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  status: {
    ok: { bg: '#F0FDF4', text: '#15803D', border: '#22C55E' },
    ng: { bg: '#FEF2F2', text: '#B91C1C', border: '#EF4444' },
    wait: { bg: '#F8FAFC', text: '#94A3B8', border: '#E2E8F0' }
  }
};

// ─── [GLOBAL STYLES (누락 수정됨)] ───
const GlobalStyles = createGlobalStyle`
  @keyframes pulse-green-soft {
    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.2); }
    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }
  
  @keyframes pulse-red-soft {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.2); }
    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes slideDownFade {
    from { 
      opacity: 0; 
      transform: translateY(-10px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  .animate-ok { 
    animation: pulse-green-soft 2s infinite; 
  }
  
  .animate-ng { 
    animation: pulse-red-soft 2s infinite; 
  }
  
  .animate-float { 
    animation: float 3s ease-in-out infinite; 
  }
  
  .custom-scrollbar::-webkit-scrollbar { 
    width: 8px; 
  }
  
  .custom-scrollbar::-webkit-scrollbar-track { 
    background: #F1F5F9; 
    border-radius: 4px; 
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb { 
    background: #CBD5E1; 
    border-radius: 4px; 
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
    background: #94A3B8; 
  }
  
  body {
    margin: 0;
    padding: 0;
    background-color: ${theme.bg};
    font-family: "Inter", -apple-system, sans-serif;
    overflow: hidden;
  }
  
  * {
    box-sizing: border-box;
  }
`;

// ─── [STYLED COMPONENTS] ───

const Container = styled.div`
  background-color: ${theme.bg};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: "Inter", -apple-system, sans-serif;
  width: 100%;
  height: calc(100vh - 64px);
  position: relative;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-shrink: 0;
`;

const ResultCard = styled.div<{ $status: 'ok' | 'ng' | 'wait' }>`
  width: 320px;
  background-color: ${theme.cardBg};
  border-radius: 16px;
  display: flex;
  align-items: center;
  padding: 0 32px;
  gap: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: ${theme.shadow};
  border: 2px solid ${props => 
    props.$status === 'ok' ? theme.status.ok.border : 
    props.$status === 'ng' ? theme.status.ng.border : 
    theme.status.wait.border
  };
`;

const ResultIconBox = styled.div<{ $status: 'ok' | 'ng' | 'wait' }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${props => 
    props.$status === 'ok' ? theme.status.ok.bg : 
    props.$status === 'ng' ? theme.status.ng.bg : 
    theme.status.wait.bg
  };
  color: ${props => 
    props.$status === 'ok' ? theme.status.ok.border : 
    props.$status === 'ng' ? theme.status.ng.border : 
    theme.status.wait.border
  };
`;

const ResultTextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ResultLabel = styled.span`
  font-size: 13px;
  color: ${theme.textSecondary};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ResultValue = styled.span<{ $status: 'ok' | 'ng' | 'wait' }>`
  font-size: 26px;
  font-weight: 800;
  line-height: 1.1;
  color: ${props => 
    props.$status === 'ok' ? theme.status.ok.text : 
    props.$status === 'ng' ? theme.status.ng.text : 
    theme.status.wait.text
  };
`;

const SoundToggleBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: 1px solid ${theme.border};
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${theme.textSecondary};
  transition: all 0.2s;

  &:hover {
    background: #F1F5F9;
    color: ${theme.textPrimary};
  }
`;

const InfoTableCard = styled.div`
  flex: 1;
  background-color: ${theme.cardBg};
  border-radius: 16px;
  border: 1px solid ${theme.border};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: ${theme.shadow};
`;

const InfoTableHeader = styled.div`
  display: flex;
  width: 100%;
  height: 40%;
  background-color: #F8FAFC;
  border-bottom: 1px solid ${theme.border};
`;

const InfoTableBody = styled.div`
  display: flex;
  width: 100%;
  height: 60%;
`;

const Th = styled.div<{ $isLast?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: ${theme.textSecondary};
  border-right: ${props => props.$isLast ? 'none' : `1px solid ${theme.border}`};
`;

const Td = styled.div<{ $isLast?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: ${props => props.$isLast ? 'none' : `1px solid ${theme.border}`};
`;

const TdValueText = styled.span<{ $color?: string }>`
  font-size: 20px;
  font-weight: 800;
  color: ${props => props.$color || theme.textPrimary};
`;

const BodyLayout = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const CornerCardWrapper = styled.div<{ $isOk: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${theme.cardBg};
  border-radius: 16px;
  box-shadow: ${theme.shadow};
  overflow: hidden;
  border: 2px solid ${props => props.$isOk ? theme.status.ok.border : theme.status.ng.border};
`;

const CornerCardHeader = styled.div`
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${theme.border};
  background-color: #FFFFFF;
`;

const CornerTitle = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: ${theme.textPrimary};
`;

const CornerBadge = styled.span<{ $isOk: boolean }>`
  background-color: ${props => props.$isOk ? theme.status.ok.border : theme.status.ng.border};
  color: #FFFFFF;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
`;

const CornerImageArea = styled.div`
  flex: 1;
  margin: 12px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background-color: #F1F5F9;
`;

const CenterColumn = styled.div`
  flex: 1;
  background-color: ${theme.cardBg};
  border-radius: 16px;
  box-shadow: ${theme.shadow};
  overflow: hidden;
  padding: 16px;
  border: 1px solid ${theme.border};
`;

const CenterImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #F8FAFC;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const EmptyStateBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90000;
  background-color: rgba(248, 250, 252, 0.65);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyStateCard = styled.div`
  background-color: ${theme.cardBg};
  padding: 48px;
  border-radius: 24px;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
  border: 1px solid ${theme.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 460px;
  position: relative;
`;

const CloseIconButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${theme.textSecondary};
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #F1F5F9;
    color: ${theme.textPrimary};
  }
`;

// ─── [UI COMPONENTS] ───

const CustomDatePicker = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const formattedDate = useMemo(() => {
    if (!value) return "날짜를 선택하세요";
    const dateObj = new Date(value);
    return dateObj.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
  }, [value]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDate = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', 
          alignItems: 'center', 
          padding: '14px 16px', 
          gap: '12px',
          background: '#FFFFFF', 
          border: `1.5px solid ${isOpen ? theme.accent : '#E2E8F0'}`,
          borderRadius: '14px', 
          cursor: 'pointer', 
          transition: 'all 0.2s',
          boxShadow: isOpen ? '0 4px 12px rgba(59, 130, 246, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)'
        }}
      >
        <Calendar size={20} color={theme.accent} />
        <span style={{ 
          flex: 1, 
          fontSize: '15px', 
          fontWeight: 700, 
          color: '#1E293B', 
          letterSpacing: '-0.3px' 
        }}>
          {formattedDate}
        </span>
        <ChevronDown 
          size={18} 
          color={theme.textSecondary} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: 'transform 0.2s' 
          }} 
        />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute', 
          top: 'calc(100% + 8px)', 
          left: 0, 
          width: '100%',
          background: '#FFFFFF', 
          borderRadius: '16px', 
          border: `1px solid ${theme.border}`,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          zIndex: 100, 
          padding: '16px', 
          animation: 'slideDownFade 0.2s ease-out'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px' 
          }}>
            <button 
              onClick={handlePrevMonth} 
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                padding: '4px', 
                borderRadius: '8px', 
                display: 'flex' 
              }} 
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F1F5F9'} 
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ChevronLeft size={20} color={theme.textPrimary} />
            </button>
            <span style={{ 
              fontSize: '16px', 
              fontWeight: 800, 
              color: theme.textPrimary 
            }}>
              {viewYear}년 {viewMonth + 1}월
            </span>
            <button 
              onClick={handleNextMonth} 
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                padding: '4px', 
                borderRadius: '8px', 
                display: 'flex' 
              }} 
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F1F5F9'} 
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ChevronRight size={20} color={theme.textPrimary} />
            </button>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '4px', 
            marginBottom: '8px' 
          }}>
            {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
              <div 
                key={day} 
                style={{ 
                  textAlign: 'center', 
                  fontSize: '13px', 
                  fontWeight: 700, 
                  color: idx === 0 ? theme.danger : (idx === 6 ? theme.accent : theme.textSecondary) 
                }}
              >
                {day}
              </div>
            ))}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '4px' 
          }}>
            {days.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              
              const isSelected = value === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isToday = new Date().toDateString() === new Date(viewYear, viewMonth, day).toDateString();
              
              return (
                <button
                  key={day}
                  onClick={() => handleSelectDate(day)}
                  style={{
                    aspectRatio: '1', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: isSelected ? theme.accent : (isToday ? '#EFF6FF' : 'transparent'),
                    color: isSelected ? '#FFFFFF' : (isToday ? theme.accent : theme.textPrimary),
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '14px', 
                    fontWeight: isSelected || isToday ? 800 : 600,
                    cursor: 'pointer', 
                    transition: 'all 0.1s'
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = isToday ? '#EFF6FF' : 'transparent'; }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const EmptyStateModal = ({ onNavigateHome, onClose }: { onNavigateHome: () => void, onClose: () => void }) => {
  return (
    <EmptyStateBackdrop>
      <EmptyStateCard>
        <CloseIconButton onClick={onClose}>
          <X size={24} strokeWidth={2.5} />
        </CloseIconButton>
        
        <div className="animate-float" style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          backgroundColor: '#EFF6FF',
          color: theme.accent,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.2)'
        }}>
          <ClipboardX size={48} strokeWidth={1.5} />
        </div>

        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 800, 
          color: theme.textPrimary, 
          margin: '0 0 12px 0' 
        }}>
          금일 검사 데이터가 없습니다
        </h2>
        <p style={{ 
          fontSize: '15px', 
          color: theme.textSecondary, 
          lineHeight: '1.6', 
          margin: '0 0 32px 0', 
          wordBreak: 'keep-all' 
        }}>
          생산 라인이 가동 중인지 확인하거나,<br/>잠시 후 다시 시도해 주세요.
        </p>

        <button 
          onClick={onNavigateHome}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            backgroundColor: '#fff', 
            color: theme.textPrimary,
            border: `1px solid ${theme.border}`, 
            padding: '12px 32px', 
            borderRadius: '12px', 
            fontWeight: 700, 
            fontSize: '15px',
            cursor: 'pointer', 
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.accent;
            e.currentTarget.style.color = theme.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.border;
            e.currentTarget.style.color = theme.textPrimary;
          }}
        >
          <Home size={18} />
          메인 화면으로 이동
        </button>
      </EmptyStateCard>
    </EmptyStateBackdrop>
  );
};

const HistoryModal = ({ isOpen, onClose, onImageClick }: { isOpen: boolean; onClose: () => void; onImageClick: (title: string, url: string) => void }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const dummyLogs = useMemo(() => {
    if (!selectedDate) return [];
    return [
      { 
        id: "log_1", time: "09:12:34", model: "GL-100", wo: "WO-A901", result: "ok", detail: "전 항목 정상 판정 완료. 특이사항 없음.",
        images: {
          main: "http://1.254.24.170:24828/images/DX_API000102/guide_img.png",
          a1: "https://dummyimage.com/600x400/020617/cbd5e1&text=A1+Normal",
          a2: "https://dummyimage.com/600x400/020617/cbd5e1&text=A2+Normal",
          a3: "https://dummyimage.com/600x400/020617/cbd5e1&text=A3+Normal",
          a4: "https://dummyimage.com/600x400/020617/cbd5e1&text=A4+Normal"
        }
      },
      { 
        id: "log_2", time: "10:05:22", model: "GL-100", wo: "WO-A901", result: "ng", detail: "좌측 상단(A1) 모서리 들뜸 현상 감지됨. 재검사 요망.",
        images: {
          main: "http://1.254.24.170:24828/images/DX_API000102/guide_img.png",
          a1: "https://dummyimage.com/600x400/7f1d1d/fca5a5&text=A1+Defect",
          a2: "https://dummyimage.com/600x400/020617/cbd5e1&text=A2+Normal",
          a3: "https://dummyimage.com/600x400/020617/cbd5e1&text=A3+Normal",
          a4: "https://dummyimage.com/600x400/020617/cbd5e1&text=A4+Normal"
        }
      },
      { 
        id: "log_3", time: "13:30:00", model: "GL-PRO", wo: "WO-B122", result: "ok", detail: "전 항목 정상 판정 완료.",
        images: {
          main: "http://1.254.24.170:24828/images/DX_API000102/guide_img.png",
          a1: "https://dummyimage.com/600x400/020617/cbd5e1&text=A1+Normal",
          a2: "https://dummyimage.com/600x400/020617/cbd5e1&text=A2+Normal",
          a3: "https://dummyimage.com/600x400/020617/cbd5e1&text=A3+Normal",
          a4: "https://dummyimage.com/600x400/020617/cbd5e1&text=A4+Normal"
        }
      },
      { 
        id: "log_4", time: "15:45:10", model: "GL-PRO", wo: "WO-B122", result: "ng", detail: "우측 하단(A4) 틈새 불량 (오차 범위 초과).",
        images: {
          main: "http://1.254.24.170:24828/images/DX_API000102/guide_img.png",
          a1: "https://dummyimage.com/600x400/020617/cbd5e1&text=A1+Normal",
          a2: "https://dummyimage.com/600x400/020617/cbd5e1&text=A2+Normal",
          a3: "https://dummyimage.com/600x400/020617/cbd5e1&text=A3+Normal",
          a4: "https://dummyimage.com/600x400/7f1d1d/fca5a5&text=A4+Defect"
        }
      },
    ];
  }, [selectedDate]);

  const selectedLog = useMemo(() => dummyLogs.find((l) => l.id === selectedLogId) || null, [dummyLogs, selectedLogId]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed', 
        inset: 0, 
        zIndex: 100000,
        backgroundColor: 'rgba(15, 23, 42, 0.6)', 
        backdropFilter: 'blur(8px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }} 
      onClick={onClose}
    >
      <div 
        style={{
          width: '1000px', 
          height: '750px', 
          backgroundColor: theme.bg,
          borderRadius: '24px', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden', 
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          border: `1px solid rgba(255,255,255,0.2)`
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        
        <div style={{
          padding: '20px 24px', 
          backgroundColor: '#fff', 
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            color: theme.textPrimary 
          }}>
            <Calendar size={22} color={theme.accent} />
            <span style={{ 
              fontSize: '18px', 
              fontWeight: 800 
            }}>
              이전 검사기록 조회
            </span>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: theme.textSecondary,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ 
          flex: 1, 
          display: 'flex', 
          overflow: 'hidden' 
        }}>
          <div style={{
            width: '320px', 
            backgroundColor: '#fff', 
            borderRight: `1px solid ${theme.border}`,
            display: 'flex', 
            flexDirection: 'column'
          }}>
            <div style={{ 
              padding: '16px', 
              borderBottom: `1px solid ${theme.border}`, 
              backgroundColor: '#F8FAFC' 
            }}>
              <CustomDatePicker 
                value={selectedDate} 
                onChange={(val) => {
                  setSelectedDate(val);
                  setSelectedLogId(null);
                }} 
              />
            </div>

            <div 
              className="custom-scrollbar" 
              style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px' 
              }}
            >
              {dummyLogs.length > 0 ? dummyLogs.map((log) => {
                const isActive = selectedLogId === log.id;
                return (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLogId(log.id)}
                    style={{
                      padding: '16px', 
                      borderRadius: '14px', 
                      cursor: 'pointer',
                      border: `1px solid ${isActive ? theme.accent : theme.border}`,
                      backgroundColor: isActive ? '#EFF6FF' : '#fff',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.1)' : 'none'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '8px' 
                    }}>
                      <span style={{ 
                        fontWeight: 800, 
                        color: isActive ? theme.accent : theme.textPrimary 
                      }}>
                        {log.time}
                      </span>
                      <span style={{ 
                        fontWeight: 800, 
                        fontSize: '13px',
                        color: log.result === 'ok' ? theme.success : theme.danger
                      }}>
                        {log.result.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: isActive ? '#60A5FA' : theme.textSecondary 
                    }}>
                      {log.model} / {log.wo}
                    </div>
                  </div>
                )
              }) : (
                <div style={{ 
                  textAlign: 'center', 
                  color: theme.textSecondary, 
                  marginTop: '40px', 
                  fontWeight: 600 
                }}>
                  해당 날짜의 기록이 없습니다.
                </div>
              )}
            </div>
          </div>

          <div 
            className="custom-scrollbar" 
            style={{ 
              flex: 1, 
              padding: '32px', 
              overflowY: 'auto', 
              backgroundColor: theme.bg 
            }}
          >
            {selectedLog ? (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '24px' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px' 
                }}>
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '16px', 
                    backgroundColor: '#E2E8F0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <FileText size={32} color={theme.textSecondary} />
                  </div>
                  <div>
                    <h3 style={{ 
                      margin: '0 0 4px 0', 
                      fontSize: '24px', 
                      fontWeight: 900, 
                      color: theme.textPrimary 
                    }}>
                      {selectedLog.model}
                    </h3>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: theme.textSecondary 
                    }}>
                      작업지시서: {selectedLog.wo}
                    </p>
                  </div>
                </div>

                <div style={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '20px', 
                  padding: '24px', 
                  border: `1px solid ${theme.border}`, 
                  boxShadow: theme.shadow 
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    paddingBottom: '16px', 
                    borderBottom: `1px solid ${theme.border}`, 
                    marginBottom: '16px' 
                  }}>
                    <span style={{ 
                      fontWeight: 700, 
                      color: theme.textSecondary 
                    }}>
                      검사 일시
                    </span>
                    <span style={{ 
                      fontWeight: 800, 
                      color: theme.textPrimary 
                    }}>
                      {selectedDate} {selectedLog.time}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    paddingBottom: '16px', 
                    borderBottom: `1px solid ${theme.border}`, 
                    marginBottom: '16px' 
                  }}>
                    <span style={{ 
                      fontWeight: 700, 
                      color: theme.textSecondary 
                    }}>
                      최종 판정
                    </span>
                    <span style={{ 
                      fontWeight: 900, 
                      color: selectedLog.result === 'ok' ? theme.success : theme.danger 
                    }}>
                      {selectedLog.result === 'ok' ? '정상 (OK)' : '불량 (NG)'}
                    </span>
                  </div>
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    padding: '20px', 
                    borderRadius: '16px' 
                  }}>
                    <strong style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: theme.textPrimary, 
                      fontWeight: 800 
                    }}>
                      상세 내용
                    </strong>
                    <p style={{ 
                      margin: 0, 
                      color: theme.textSecondary, 
                      lineHeight: '1.6', 
                      fontWeight: 600 
                    }}>
                      {selectedLog.detail}
                    </p>
                  </div>

                  <div style={{ marginTop: '32px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '16px' 
                    }}>
                      <h4 style={{ 
                        margin: 0, 
                        fontSize: '16px', 
                        fontWeight: 800, 
                        color: theme.textPrimary 
                      }}>
                        검사 이미지
                      </h4>
                      <span style={{ 
                        fontSize: '13px', 
                        color: theme.textSecondary, 
                        fontWeight: 600 
                      }}>
                        * 클릭 시 확대됩니다
                      </span>
                    </div>

                    <div
                      onClick={() => onImageClick('메인 검사 이미지', selectedLog.images.main)}
                      style={{
                        width: '100%', 
                        height: '240px', 
                        backgroundColor: '#020617', 
                        borderRadius: '16px',
                        marginBottom: '16px', 
                        cursor: 'pointer', 
                        border: `1px solid ${theme.border}`,
                        backgroundImage: `url(${selectedLog.images.main})`,
                        backgroundSize: 'contain', 
                        backgroundPosition: 'center', 
                        backgroundRepeat: 'no-repeat',
                        position: 'relative'
                      }}
                    >
                      <div style={{ 
                        position: 'absolute', 
                        bottom: '12px', 
                        right: '12px', 
                        backgroundColor: 'rgba(255,255,255,0.9)', 
                        padding: '6px', 
                        borderRadius: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <ZoomIn size={18} color={theme.textPrimary} />
                      </div>
                    </div>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '16px' 
                    }}>
                      {[
                        { key: 'a1', title: '좌측 상단 (A1)' },
                        { key: 'a2', title: '우측 상단 (A2)' },
                        { key: 'a3', title: '좌측 하단 (A3)' },
                        { key: 'a4', title: '우측 하단 (A4)' },
                      ].map((corner) => (
                        <div
                          key={corner.key}
                          onClick={() => onImageClick(corner.title, selectedLog.images[corner.key as keyof typeof selectedLog.images])}
                          style={{
                            height: '140px', 
                            backgroundColor: '#020617', 
                            borderRadius: '16px', 
                            cursor: 'pointer',
                            border: `1px solid ${theme.border}`, 
                            position: 'relative',
                            backgroundImage: `url(${selectedLog.images[corner.key as keyof typeof selectedLog.images]})`,
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center', 
                            backgroundRepeat: 'no-repeat'
                          }}
                        >
                          <div style={{ 
                            position: 'absolute', 
                            top: '8px', 
                            left: '8px', 
                            backgroundColor: 'rgba(0,0,0,0.65)', 
                            color: '#fff', 
                            padding: '4px 8px', 
                            borderRadius: '6px', 
                            fontSize: '12px', 
                            fontWeight: 700 
                          }}>
                            {corner.title}
                          </div>
                          <div style={{ 
                            position: 'absolute', 
                            bottom: '8px', 
                            right: '8px', 
                            backgroundColor: 'rgba(255,255,255,0.9)', 
                            padding: '6px', 
                            borderRadius: '8px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}>
                            <ZoomIn size={14} color={theme.textPrimary} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: theme.textSecondary, 
                fontWeight: 600 
              }}>
                좌측에서 조회할 로그를 선택해주세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageModal = ({ isOpen, onClose, title, imgUrl }: { isOpen: boolean, onClose: () => void, title: string, imgUrl: string }) => {
  if (!isOpen) return null;
  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 110000, 
        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
        backdropFilter: 'blur(12px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }} 
      onClick={onClose}
    >
      <div 
        style={{ 
          width: '90vw', 
          height: '90vh', 
          backgroundColor: '#FFFFFF', 
          borderRadius: '24px', 
          padding: '32px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px' 
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px' 
          }}>
            <ZoomIn size={24} />
            <span style={{ 
              fontSize: '24px', 
              fontWeight: 800 
            }}>
              {title}
            </span>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              border: 'none', 
              backgroundColor: 'transparent', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <X size={24} />
          </button>
        </div>
        <div style={{ 
          flex: 1, 
          borderRadius: '16px', 
          overflow: 'hidden', 
          backgroundColor: '#020617', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <img 
            src={imgUrl} 
            alt="Detail" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain' 
            }} 
          />
        </div>
      </div>
    </div>
  );
};

const SoundPermissionModal = ({ onConfirm }: { onConfirm: () => void }) => (
  <div style={{ 
    position: 'fixed', 
    inset: 0, 
    zIndex: 99999, 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    backdropFilter: 'blur(4px)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  }}>
    <div style={{ 
      backgroundColor: '#FFFFFF', 
      padding: '48px', 
      borderRadius: '28px', 
      width: '90%', 
      maxWidth: '420px', 
      textAlign: 'center', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '32px' 
    }}>
      <div style={{ 
        width: '88px', 
        height: '88px', 
        borderRadius: '50%', 
        backgroundColor: '#FEF2F2', 
        margin: '0 auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Siren size={44} color={theme.danger} />
      </div>
      <div>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 800, 
          marginBottom: '12px' 
        }}>
          불량 알림 권한 요청
        </h2>
        <p style={{ color: '#6B7280' }}>
          심각한 <strong style={{color: theme.danger}}>유격 불량이 감지</strong>되었습니다.<br />경고음을 켜시겠습니까?
        </p>
      </div>
      <button
        onClick={onConfirm}
        style={{
          width: '100%', 
          padding: '16px', 
          borderRadius: '14px', 
          border: 'none',
          background: theme.danger, 
          color: 'white', 
          fontSize: '16px', 
          fontWeight: 700,
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px',
          boxShadow: `0 4px 10px -4px ${theme.danger}60`
        }}
      >
        <Volume2 size={20} />네, 경고음 켜기
      </button>
    </div>
  </div>
);

// ─── [MAIN COMPONENT] ───
export default function GlassGapInspection() {
  const router = useRouter(); 

  const [screenMode, setScreenMode] = useState<ScreenMode>('FHD');
  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean, title: string, imgUrl: string } | null>(null);
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [totalStats, setTotalStats] = useState<TotalData | null>(null);

  const [isDefectMode, setIsDefectMode] = useState(false); 
  const [audioAllowed, setAudioAllowed] = useState(false); 
  const [showPermissionModal, setShowPermissionModal] = useState(false); 
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); 
  const [isEmptyStateClosed, setIsEmptyStateClosed] = useState(false); 

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavigateHome = () => {
    router.push('/');
  };

  const handleImageClick = (title: string, url: string) => {
    setModalInfo({ isOpen: true, title, imgUrl: url });
  };

  useEffect(() => {
    const handleResize = () => setScreenMode(window.innerWidth > 2200 ? 'QHD' : 'FHD');
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://1.254.24.170:24828/api/DX_API000023');
        const json = await response.json();
        
        if (json.success && json.data && json.data.length > 0) {
          const data: ApiData = json.data[0];
          setApiData(data);
          const hasError = data.RESULT !== '정상';
          setIsDefectMode(hasError);
          if (hasError && !audioAllowed && !showPermissionModal && !audioCtxRef.current) {
            setShowPermissionModal(true);
          }
        }

        if (json.success && json.total_data) {
          setTotalStats({
            total_count: json.total_data.total_count,
            normal_count: json.total_data.normal_count
          });
        }
      } catch (error) { console.error(error); }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, [audioAllowed, showPermissionModal]);

  useEffect(() => {
    if (isDefectMode && audioAllowed) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();

      const playBeep = () => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.15);
        osc.stop(ctx.currentTime + 0.15);
      };
      playBeep();
      intervalRef.current = setInterval(playBeep, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isDefectMode, audioAllowed]);

  const handlePermissionConfirm = () => {
    setAudioAllowed(true);
    setShowPermissionModal(false);
  };

  const toggleSound = () => setAudioAllowed(prev => !prev);
  const layout = LAYOUT_CONFIGS[screenMode];
  const guideImgUrl = "http://1.254.24.170:24828/images/DX_API000102/guide_img.png";

  const CornerCard = ({ title, status, imgUrl }: { title: string, status: string, imgUrl: string }) => {
    const isOk = status === '정상';
    return (
      <CornerCardWrapper $isOk={isOk}>
        <CornerCardHeader>
          <CornerTitle>{title}</CornerTitle>
          <CornerBadge $isOk={isOk}>{status}</CornerBadge>
        </CornerCardHeader>
        <CornerImageArea>
          <div style={{ 
            width: '100%', 
            height: '100%', 
            backgroundImage: `url(${imgUrl})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat' 
          }} />
          <button
            onClick={(e) => { e.stopPropagation(); setModalInfo({ isOpen: true, title, imgUrl }); }}
            style={{
              position: 'absolute', 
              bottom: '12px', 
              right: '12px',
              width: '36px', 
              height: '36px', 
              borderRadius: '8px',
              backgroundColor: '#FFFFFF', 
              border: '1px solid rgba(0,0,0,0.05)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s'
            }}
          >
            <ZoomIn size={18} strokeWidth={2} color={theme.textPrimary} />
          </button>
        </CornerImageArea>
      </CornerCardWrapper>
    );
  };

  const resultStr = apiData?.RESULT || '';
  const isPass = resultStr === '정상' || resultStr.toUpperCase() === 'OK';
  const isFail = !isPass && !!resultStr;

  let statusState: 'wait' | 'ok' | 'ng' = 'wait';
  let ResultIcon = Info;
  let label = "READY";

  if (isPass) {
    statusState = 'ok';
    ResultIcon = CheckCircle2;
    label = "정상 (OK)";
  } else if (isFail) {
    statusState = 'ng';
    ResultIcon = XCircle;
    label = "불량 (NG)";
  }

  const timeValue = apiData?.TIMEVALUE || '00:00:00';
  const modelValue = apiData?.CDGITEM || '-';
  const woValue = apiData?.WO || '-';

  return (
    <Container style={{ padding: layout.padding }}>
      <GlobalStyles />

      {totalStats && totalStats.total_count === 0 && !isEmptyStateClosed && (
        <EmptyStateModal 
          onNavigateHome={handleNavigateHome} 
          onClose={() => setIsEmptyStateClosed(true)} 
        />
      )}

      <HeaderRow style={{ gap: layout.gap, height: layout.headerHeight, marginBottom: layout.gap }}>
        
        <ResultCard $status={statusState}>
          <SoundToggleBtn onClick={toggleSound}>
            {audioAllowed ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </SoundToggleBtn>
          <ResultIconBox $status={statusState}>
            <ResultIcon size={36} strokeWidth={2.5} />
          </ResultIconBox>
          <ResultTextBox>
            <ResultLabel>
              <Info size={14} /> 전체 판정 결과
            </ResultLabel>
            <ResultValue $status={statusState}>{label}</ResultValue>
          </ResultTextBox>
        </ResultCard>

        <InfoTableCard>
          <InfoTableHeader>
            <Th>검사 시간</Th>
            <Th>검사 수량</Th>
            <Th>모델명 / WO</Th>
            <Th $isLast>현재 상태</Th>
          </InfoTableHeader>
          <InfoTableBody>
            <Td>
              <TdValueText>{timeValue}</TdValueText>
            </Td>
            <Td>
              {totalStats ? (
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <TdValueText>{totalStats.normal_count}</TdValueText>
                  <span style={{ fontSize: '16px', color: theme.textSecondary, margin: '0 4px' }}>/</span>
                  <span style={{ fontSize: '16px', color: theme.textSecondary, fontWeight: 700 }}>{totalStats.total_count}</span>
                </div>
              ) : (
                <TdValueText $color={theme.textSecondary}>-</TdValueText>
              )}
            </Td>
            <Td>
              <TdValueText>{modelValue}</TdValueText>
              <span style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: 500, marginTop: '2px' }}>{woValue}</span>
            </Td>
            <Td $isLast>
              <TdValueText $color={theme.textPrimary}>RUNNING</TdValueText>
            </Td>
          </InfoTableBody>
        </InfoTableCard>

      </HeaderRow>

      <BodyLayout style={{ gap: layout.gap }}>
        <SideColumn style={{ width: layout.cornerCardWidth, gap: layout.gap }}>
          <CornerCard title="좌측 상단 (camera-1)" status={apiData ? apiData.LABEL001 : "-"} imgUrl={apiData ? apiData.FILEPATH3 : ""} />
          <CornerCard title="좌측 하단 (camera-4)" status={apiData ? apiData.LABEL003 : "-"} imgUrl={apiData ? apiData.FILEPATH1 : ""} />
        </SideColumn>

        <CenterColumn>
          <CenterImageWrapper>
            <img src={guideImgUrl} alt="Main Glass Guide" style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain' }} />
          </CenterImageWrapper>
        </CenterColumn>

        <SideColumn style={{ width: layout.cornerCardWidth, gap: layout.gap }}>
          <CornerCard title="우측 상단 (camera-2)" status={apiData ? apiData.LABEL002 : "-"} imgUrl={apiData ? apiData.FILEPATH2 : ""} />
          <CornerCard title="우측 하단 (camera-3)" status={apiData ? apiData.LABEL004 : "-"} imgUrl={apiData ? apiData.FILEPATH4 : ""} />
        </SideColumn>
      </BodyLayout>

      <button
        onClick={() => setIsHistoryOpen(true)}
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 95000,
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          backgroundColor: theme.textPrimary, 
          color: '#fff',
          padding: '14px 28px', 
          borderRadius: '99px',
          fontSize: '15px', 
          fontWeight: 800,
          border: 'none', 
          cursor: 'pointer',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
        }}
      >
        <Calendar size={18} strokeWidth={2.5} />
        이전 검사기록 조회
      </button>

      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onImageClick={handleImageClick}
      />
      {showPermissionModal && <SoundPermissionModal onConfirm={handlePermissionConfirm} />}
      {modalInfo && <ImageModal isOpen={modalInfo.isOpen} onClose={() => setModalInfo(prev => prev ? { ...prev, isOpen: false } : null)} title={modalInfo.title} imgUrl={modalInfo.imgUrl} />}

    </Container>
  );
}
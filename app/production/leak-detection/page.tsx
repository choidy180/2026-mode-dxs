"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Scan, CheckCircle, AlertCircle, Activity, Box, Layers, Monitor, Cpu, Eye, X, 
    Volume2, VolumeX, AlertTriangle, CheckCircle2, XCircle, Clock, RefreshCw, 
    ClipboardX, Home, Calendar, FileText, ChevronDown, ChevronLeft, ChevronRight,
    ZoomIn, Info
} from 'lucide-react';
import styled, { createGlobalStyle } from 'styled-components';

// --- 1. 상수 및 타입 ---
const SCOPE_SIZE = 250;
const ZOOM_LEVEL = 6;
const API_URL = "http://1.254.24.170:24828/api/DX_API000025";
const GUIDE_IMAGE_URL = "http://1.254.24.170:24828/images/DX_API000102/guide_2.jpg";

type InspectionStatus = '정상' | '점검필요' | '에러';
type CropPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type ScreenMode = 'FHD' | 'QHD';

interface HighlightRect {
    top: number; 
    left: number; 
    width: number; 
    height: number;
}

interface CamData {
    id: string; 
    title: string; 
    status: InspectionStatus; 
    icon: React.ReactNode; 
    position: CropPosition;
    highlight: HighlightRect;
    specificImageUrl?: string;
}

interface TotalData {
    total_count: number;
    normal_count: number;
}

interface ApiDataItem {
    TIMEVALUE: string;
    FILENAME1: string; FILENAME2: string; FILENAME3: string; 
    FILENAME4: string; FILENAME5: string; FILENAME6: string;
    FILEPATH1: string; FILEPATH2: string; FILEPATH3: string; 
    FILEPATH4: string; FILEPATH5: string; FILEPATH6: string;
    LABEL001: string; LABEL002: string; LABEL003: string; 
    LABEL004: string; LABEL005: string; LABEL006: string;
    RESULT: string;     
    COUNT_NUM: string;
}

interface ApiResponse {
    success: boolean;
    data: ApiDataItem[];
    total_data?: TotalData;
}

// --- 2. 테마 및 설정 ---
const THEME = {
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

const LAYOUT_CONFIGS = {
    FHD: {
        padding: '24px', gap: '20px', headerHeight: '110px',
        cardHeight: '160px', cardPadding: '16px', 
        fontSize: { title: '16px', sub: '12px', badge: '12px', metaLabel: '12px', metaValue: '15px' },
        iconSize: 20, logoSize: 20, cornerCardWidth: '320px',
    },
    QHD: {
        padding: '32px', gap: '24px', headerHeight: '140px',
        cardHeight: '220px', cardPadding: '20px',
        fontSize: { title: '20px', sub: '14px', badge: '14px', metaLabel: '14px', metaValue: '18px' },
        iconSize: 30, logoSize: 28, cornerCardWidth: '450px',
    }
};

// --- STYLED COMPONENTS ---

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
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-ok { animation: pulse-green-soft 2s infinite; }
    .animate-ng { animation: pulse-red-soft 2s infinite; }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #F1F5F9; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
    
    body { margin: 0; padding: 0; background-color: ${THEME.bg}; font-family: "Inter", -apple-system, sans-serif; overflow: hidden; }
    * { box-sizing: border-box; }
`;

const PageContainer = styled.div`
    position: relative;
    background-color: ${THEME.bg};
    height: calc(100vh - 60px);     
    max-height: calc(100vh - 60px); 
    width: 100vw;
    font-family: "Inter", -apple-system, sans-serif;
    color: ${THEME.textPrimary};
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: hidden; 
`;

const HeaderRow = styled.div`
    display: flex;
    flex-shrink: 0;
`;

const ResultCard = styled.div<{ $status: 'ok' | 'ng' | 'wait' }>`
    width: 320px;
    background-color: ${THEME.cardBg};
    border-radius: 16px;
    display: flex;
    align-items: center;
    padding: 0 32px;
    gap: 20px;
    position: relative;
    overflow: hidden;
    box-shadow: ${THEME.shadow};
    border: 2px solid ${props => 
        props.$status === 'ok' ? THEME.status.ok.border : 
        props.$status === 'ng' ? THEME.status.ng.border : THEME.status.wait.border
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
        props.$status === 'ok' ? THEME.status.ok.bg : 
        props.$status === 'ng' ? THEME.status.ng.bg : THEME.status.wait.bg
    };
    color: ${props => 
        props.$status === 'ok' ? THEME.status.ok.border : 
        props.$status === 'ng' ? THEME.status.ng.border : THEME.status.wait.border
    };
`;

const ResultTextBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const ResultLabel = styled.span`
    font-size: 13px;
    color: ${THEME.textSecondary};
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
        props.$status === 'ok' ? THEME.status.ok.text : 
        props.$status === 'ng' ? THEME.status.ng.text : THEME.status.wait.text
    };
`;

const SoundToggleBtn = styled.button`
    position: absolute;
    top: 12px;
    right: 12px;
    background: transparent;
    border: 1px solid ${THEME.border};
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${THEME.textSecondary};
    transition: all 0.2s;
    &:hover { background: #F1F5F9; color: ${THEME.textPrimary}; }
`;

const InfoTableCard = styled.div`
    flex: 1;
    background-color: ${THEME.cardBg};
    border-radius: 16px;
    border: 1px solid ${THEME.border};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: ${THEME.shadow};
`;

const InfoTableHeader = styled.div`
    display: flex;
    width: 100%;
    height: 40px;
    background-color: #F8FAFC;
    border-bottom: 1px solid ${THEME.border};
`;

const InfoTableBody = styled.div`
    display: flex;
    width: 100%;
    flex: 1;
`;

const Th = styled.div<{ $isLast?: boolean }>`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: ${THEME.textSecondary};
    border-right: ${props => props.$isLast ? 'none' : `1px solid ${THEME.border}`};
`;

const Td = styled.div<{ $isLast?: boolean }>`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-right: ${props => props.$isLast ? 'none' : `1px solid ${THEME.border}`};
`;

const TdValueText = styled.span<{ $color?: string }>`
    font-size: 24px;
    font-weight: 800;
    color: ${props => props.$color || THEME.textPrimary};
`;

const TdSubText = styled.span`
    font-size: 18px;
    color: ${THEME.textSecondary};
    margin-left: 6px;
    font-weight: 600;
`;

const MainBoard = styled.div`
    flex: 1;
    background-color: #FFFFFF;
    border-radius: 16px;
    padding: 16px 24px; 
    display: flex;
    flex-direction: column;
    gap: 0px; 
    border: 1px solid ${THEME.border};
    box-shadow: ${THEME.shadow};
    min-height: 0; 
    overflow: hidden;
`;

const TopCamRow = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    flex-shrink: 1; 
    min-height: 0;
    position: relative;
    z-index: 10;
    margin-bottom: -16px; 
`;

const BottomCamRow = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    flex-shrink: 1;
    min-height: 0;
    position: relative;
    z-index: 10;
    margin-top: -16px;
`;

const CenterImageContainer = styled.div<{ $isHovered?: boolean }>`
    flex: 1;
    background-color: #F8FAFC;
    border-radius: 12px;
    border: 1px solid ${THEME.border};
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: crosshair;
    padding: 24px; 
    z-index: ${props => props.$isHovered ? 20 : 5};
    transition: z-index 0s;
    min-height: 0; 
    overflow: hidden;
`;

const CamCardWrapper = styled.div<{ $isOk: boolean }>`
    display: flex;
    flex-direction: column;
    background-color: ${THEME.cardBg};
    border-radius: 12px;
    border: 2px solid ${props => props.$isOk ? THEME.status.ok.border : THEME.status.ng.border};
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08); 
`;

const CamCardHeader = styled.div`
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${THEME.border};
    background-color: #FFFFFF;
`;

const CamTitle = styled.span`
    font-size: 16px;
    font-weight: 800;
    color: ${THEME.textPrimary};
`;

const CamBadge = styled.span<{ $isOk: boolean }>`
    background-color: ${props => props.$isOk ? THEME.status.ok.border : THEME.status.ng.border};
    color: #FFFFFF;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 700;
`;

// ✅ 해결: url() 안에 따옴표를 추가하여 쉼표나 특수문자가 포함된 URL도 안전하게 렌더링되도록 수정
const CamImageArea = styled.div<{ $imgUrl: string }>`
    flex: 1;
    background-color: #F1F5F9;
    background-image: url('${props => props.$imgUrl}'); 
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin: 8px;
    border-radius: 8px;
`;

const EmptyStateModal = ({ onNavigateHome, onClose }: { onNavigateHome: () => void, onClose: () => void }) => {
    return (
        <div 
            style={{ 
                position: 'absolute', 
                inset: 0, 
                zIndex: 9999999, 
                backgroundColor: 'rgba(15, 23, 42, 0.75)', 
                backdropFilter: 'blur(8px)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}
        >
            <div 
                style={{ 
                    backgroundColor: THEME.cardBg, 
                    padding: '48px', 
                    borderRadius: '24px', 
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', 
                    border: `1px solid ${THEME.border}`, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    textAlign: 'center', 
                    width: '460px', 
                    maxWidth: '90%', 
                    position: 'relative' 
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: THEME.textSecondary, padding: '8px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = THEME.textPrimary; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = THEME.textSecondary; }}
                >
                    <X size={24} strokeWidth={2.5} />
                </button>
                
                <div className="animate-float" style={{ 
                    width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#EFF6FF',
                    color: THEME.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '24px', boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.2)'
                }}>
                    <ClipboardX size={48} strokeWidth={1.5} />
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: 800, color: THEME.textPrimary, margin: '0 0 12px 0' }}>
                    금일 검사 데이터가 없습니다
                </h2>
                <p style={{ fontSize: '15px', color: THEME.textSecondary, lineHeight: '1.6', margin: '0 0 32px 0', wordBreak: 'keep-all' }}>
                    생산 라인이 가동 중인지 확인하거나,<br/>잠시 후 다시 시도해 주세요.
                </p>

                <button 
                    onClick={onNavigateHome}
                    style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        backgroundColor: '#fff', color: THEME.textPrimary, border: `1px solid ${THEME.border}`, 
                        padding: '12px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '15px',
                        cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = THEME.accent;
                        e.currentTarget.style.color = THEME.accent;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = THEME.border;
                        e.currentTarget.style.color = THEME.textPrimary;
                    }}
                >
                    <Home size={18} />
                    메인 화면으로 이동
                </button>
            </div>
        </div>
    );
};

// --- 3. 초기 데이터 ---
const initialTopCards: CamData[] = [
  { id: 'CAM 01', title: 'Surface Check', status: '정상', icon: <Layers />, position: 'top-left', highlight: { top: 10, left: 5, width: 32, height: 18 } },
  { id: 'CAM 02', title: 'Dimension Check', status: '정상', icon: <Box />, position: 'top-center', highlight: { top: 5, left: 42, width: 16, height: 9 } },
  { id: 'CAM 03', title: 'Scratch Check', status: '정상', icon: <Scan />, position: 'top-right', highlight: { top: 15, left: 65, width: 32, height: 18 } },
];

const initialBottomCards: CamData[] = [
  { id: 'CAM 06', title: 'Edge Check L', status: '정상', icon: <Activity />, position: 'bottom-left', highlight: { top: 60, left: 5, width: 32, height: 18 } },
  { id: 'CAM 05', title: 'Alignment', status: '정상', icon: <AlertCircle />, position: 'bottom-center', highlight: { top: 50, left: 42, width: 16, height: 9 } },
  { id: 'CAM 04', title: 'Edge Check R', status: '정상', icon: <Activity />, position: 'bottom-right', highlight: { top: 65, left: 60, width: 32, height: 18 } },
];

// --- 4. 하위 컴포넌트들 ---

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
    for (let i = 0; i < firstDayOfWeek; i++) { days.push(null); }
    for (let i = 1; i <= daysInMonth; i++) { days.push(i); }

    const formattedDate = useMemo(() => {
        if (!value) return "날짜를 선택하세요";
        const [y, m, d] = value.split('-');
        return `${y}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일`;
    }, [value]);

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } 
        else { setViewMonth(viewMonth - 1); }
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } 
        else { setViewMonth(viewMonth + 1); }
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
                    display: 'flex', alignItems: 'center', padding: '14px 16px', gap: '12px',
                    background: '#FFFFFF', border: `1.5px solid ${isOpen ? THEME.accent : '#E2E8F0'}`,
                    borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: isOpen ? '0 4px 12px rgba(59, 130, 246, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)'
                }}
            >
                <Calendar size={20} color={THEME.accent} />
                <span style={{ flex: 1, fontSize: '15px', fontWeight: 700, color: '#1E293B', letterSpacing: '-0.3px' }}>
                    {formattedDate}
                </span>
                <ChevronDown size={18} color={THEME.textSecondary} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '100%',
                    background: '#FFFFFF', borderRadius: '16px', border: `1px solid ${THEME.border}`,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    zIndex: 100, padding: '16px', animation: 'slideDownFade 0.2s ease-out'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <button 
                            onClick={handlePrevMonth} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '8px', display: 'flex' }} 
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F1F5F9'} 
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <ChevronLeft size={20} color={THEME.textPrimary} />
                        </button>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: THEME.textPrimary }}>
                            {viewYear}년 {viewMonth + 1}월
                        </span>
                        <button 
                            onClick={handleNextMonth} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '8px', display: 'flex' }} 
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F1F5F9'} 
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <ChevronRight size={20} color={THEME.textPrimary} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                        {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                            <div key={day} style={{ textAlign: 'center', fontSize: '13px', fontWeight: 700, color: idx === 0 ? THEME.danger : (idx === 6 ? THEME.accent : THEME.textSecondary) }}>
                                {day}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                        {days.map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} />;
                            
                            const isSelected = value === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            
                            return (
                                <button
                                    key={day}
                                    onClick={() => handleSelectDate(day)}
                                    style={{
                                        aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: isSelected ? THEME.accent : 'transparent',
                                        color: isSelected ? '#FFFFFF' : THEME.textPrimary,
                                        border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: isSelected ? 800 : 600,
                                        cursor: 'pointer', transition: 'all 0.1s'
                                    }}
                                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
                                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
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
                    main: GUIDE_IMAGE_URL,
                    a1: "https://dummyimage.com/600x400/020617/cbd5e1&text=CAM+01+Normal",
                    a2: "https://dummyimage.com/600x400/020617/cbd5e1&text=CAM+02+Normal",
                    a3: "https://dummyimage.com/600x400/020617/cbd5e1&text=CAM+03+Normal",
                    a4: "https://dummyimage.com/600x400/020617/cbd5e1&text=CAM+04+Normal",
                    a5: "https://dummyimage.com/600x400/020617/cbd5e1&text=CAM+05+Normal",
                    a6: "https://dummyimage.com/600x400/020617/cbd5e1&text=CAM+06+Normal"
                }
            },
            { 
                id: "log_2", time: "10:05:22", model: "GL-100", wo: "WO-A901", result: "ng", detail: "Surface Check(CAM 02) 불량 감지. 점검이 필요합니다.",
                images: {
                    main: GUIDE_IMAGE_URL,
                    a1: "https://dummyimage.com/600x400/020617/cbd5e1&text=CAM+01+Normal",
                    a2: "https://dummyimage.com/600x400/7f1d1d/fca5a5&text=CAM+02+Defect",
                    a3: "https://dummyimage.com/600x400/020617/cbd5e1&text=CAM+03+Normal",
                    a4: "https://dummyimage.com/600x400/020617/cbd5e1&text=CAM+04+Normal",
                    a5: "https://dummyimage.com/600x400/020617/cbd5e1&text=CAM+05+Normal",
                    a6: "https://dummyimage.com/600x400/020617/cbd5e1&text=CAM+06+Normal"
                }
            }
        ];
    }, [selectedDate]);

    const selectedLog = useMemo(() => dummyLogs.find((l) => l.id === selectedLogId) || null, [dummyLogs, selectedLogId]);

    if (!isOpen) return null;

    return (
        <div 
            style={{
                position: 'fixed', inset: 0, zIndex: 100000,
                backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} 
            onClick={onClose}
        >
            <div 
                style={{
                    width: '1200px', height: '800px', backgroundColor: THEME.bg,
                    borderRadius: '24px', display: 'flex', flexDirection: 'column',
                    overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                    border: `1px solid rgba(255,255,255,0.2)`
                }} 
                onClick={(e) => e.stopPropagation()}
            >
                
                <div style={{ padding: '20px 24px', backgroundColor: '#fff', borderBottom: `1px solid ${THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: THEME.textPrimary }}>
                        <Calendar size={22} color={THEME.accent} />
                        <span style={{ fontSize: '18px', fontWeight: 800 }}>이전 검사기록 조회</span>
                    </div>
                    <button 
                        onClick={onClose} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: THEME.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                    <div style={{ width: '320px', backgroundColor: '#fff', borderRight: `1px solid ${THEME.border}`, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '16px', borderBottom: `1px solid ${THEME.border}`, backgroundColor: '#F8FAFC' }}>
                            <CustomDatePicker 
                                value={selectedDate} 
                                onChange={(val) => {
                                    setSelectedDate(val);
                                    setSelectedLogId(null);
                                }} 
                            />
                        </div>

                        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {dummyLogs.length > 0 ? dummyLogs.map((log) => {
                                const isActive = selectedLogId === log.id;
                                return (
                                    <div
                                        key={log.id}
                                        onClick={() => setSelectedLogId(log.id)}
                                        style={{
                                            padding: '16px', borderRadius: '14px', cursor: 'pointer',
                                            border: `1px solid ${isActive ? THEME.accent : THEME.border}`,
                                            backgroundColor: isActive ? '#EFF6FF' : '#fff',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.1)' : 'none'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontWeight: 800, color: isActive ? THEME.accent : THEME.textPrimary }}>
                                                {log.time}
                                            </span>
                                            <span style={{ fontWeight: 800, fontSize: '13px', color: log.result === 'ok' ? THEME.status.ok.text : THEME.status.ng.text }}>
                                                {log.result.toUpperCase()}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: isActive ? '#60A5FA' : THEME.textSecondary }}>
                                            {log.model} / {log.wo}
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div style={{ textAlign: 'center', color: THEME.textSecondary, marginTop: '40px', fontWeight: 600 }}>
                                    해당 날짜의 기록이 없습니다.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="custom-scrollbar" style={{ flex: 1, padding: '32px', overflowY: 'auto', backgroundColor: THEME.bg }}>
                        {selectedLog ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FileText size={32} color={THEME.textSecondary} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 900, color: THEME.textPrimary }}>
                                            {selectedLog.model}
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: THEME.textSecondary }}>
                                            작업지시서: {selectedLog.wo}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: `1px solid ${THEME.border}`, boxShadow: THEME.shadow }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: `1px solid ${THEME.border}`, marginBottom: '16px' }}>
                                        <span style={{ fontWeight: 700, color: THEME.textSecondary }}>검사 일시</span>
                                        <span style={{ fontWeight: 800, color: THEME.textPrimary }}>
                                            {selectedDate.split('-')[0]}년 {selectedDate.split('-')[1]}월 {selectedDate.split('-')[2]}일 {selectedLog.time}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: `1px solid ${THEME.border}`, marginBottom: '16px' }}>
                                        <span style={{ fontWeight: 700, color: THEME.textSecondary }}>최종 판정</span>
                                        <span style={{ fontWeight: 900, color: selectedLog.result === 'ok' ? THEME.status.ok.text : THEME.status.ng.text }}>
                                            {selectedLog.result === 'ok' ? '정상 (OK)' : '불량 (NG)'}
                                        </span>
                                    </div>
                                    <div style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '16px' }}>
                                        <strong style={{ display: 'block', marginBottom: '8px', color: THEME.textPrimary, fontWeight: 800 }}>상세 내용</strong>
                                        <p style={{ margin: 0, color: THEME.textSecondary, lineHeight: '1.6', fontWeight: 600 }}>{selectedLog.detail}</p>
                                    </div>

                                    <div style={{ marginTop: '32px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: THEME.textPrimary }}>검사 이미지</h4>
                                            <span style={{ fontSize: '13px', color: THEME.textSecondary, fontWeight: 600 }}>* 클릭 시 확대됩니다</span>
                                        </div>

                                        <div
                                            onClick={() => onImageClick('메인 검사 이미지', selectedLog.images.main)}
                                            style={{
                                                width: '100%', height: '240px', backgroundColor: '#020617', borderRadius: '16px',
                                                marginBottom: '16px', cursor: 'pointer', border: `1px solid ${THEME.border}`,
                                                // ✅ 해결: url() 안에 따옴표를 추가
                                                backgroundImage: `url('${selectedLog.images.main}')`,
                                                backgroundSize: 'contain', 
                                                backgroundPosition: 'center', backgroundRepeat: 'no-repeat', position: 'relative'
                                            }}
                                        >
                                            <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <ZoomIn size={18} color={THEME.textPrimary} />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                            {[
                                                { key: 'a1', title: 'Top-Left (CAM 01)' },
                                                { key: 'a2', title: 'Top-Center (CAM 02)' },
                                                { key: 'a3', title: 'Top-Right (CAM 03)' },
                                                { key: 'a6', title: 'Bottom-Left (CAM 06)' },
                                                { key: 'a5', title: 'Bottom-Center (CAM 05)' },
                                                { key: 'a4', title: 'Bottom-Right (CAM 04)' },
                                            ].map((corner) => (
                                                <div
                                                    key={corner.key}
                                                    onClick={() => onImageClick(corner.title, selectedLog.images[corner.key as keyof typeof selectedLog.images])}
                                                    style={{
                                                        height: '140px', backgroundColor: '#020617', borderRadius: '16px', cursor: 'pointer',
                                                        border: `1px solid ${THEME.border}`, position: 'relative',
                                                        // ✅ 해결: url() 안에 따옴표를 추가
                                                        backgroundImage: `url('${selectedLog.images[corner.key as keyof typeof selectedLog.images]}')`,
                                                        backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
                                                    }}
                                                >
                                                    <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.65)', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                                                        {corner.title}
                                                    </div>
                                                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <ZoomIn size={14} color={THEME.textPrimary} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: THEME.textSecondary, fontWeight: 600 }}>
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
            style={{ position: 'fixed', inset: 0, zIndex: 999999, backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
            onClick={onClose}
        >
            <div 
                style={{ width: '90vw', height: '90vh', backgroundColor: '#000', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} 
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', backgroundColor: '#1E293B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#fff' }}>
                        <ZoomIn size={24} />
                        <span style={{ fontSize: '24px', fontWeight: 800 }}>{title}</span>
                    </div>
                    <button onClick={onClose} style={{ width: '40px', height: '40px', borderRadius: '12px', border: 'none', backgroundColor: 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={28} />
                    </button>
                </div>
                <div style={{ flex: 1, backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <img src={imgUrl} alt="Detail" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
            </div>
        </div>
    );
};

const SoundPermissionModal = ({ onConfirm }: { onConfirm: () => void }) => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', width: '400px', textAlign: 'center', border: '1px solid #EF4444' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#FEF2F2', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={32} color="#EF4444" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>시스템 경고 알림</h3>
            <p style={{ color: '#64748B', marginBottom: '24px' }}>이상 징후가 감지되었습니다.<br/>소리 알림을 켜시겠습니까?</p>
            <button onClick={onConfirm} style={{ backgroundColor: '#EF4444', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, width: '100%', cursor: 'pointer' }}>
                확인
            </button>
        </div>
    </div>
);

// --- MAIN COMPONENT ---
export default function VisionDashboard() {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [screenMode, setScreenMode] = useState<ScreenMode>('FHD');
  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean, title: string, imgUrl: string } | null>(null);

  // 사운드 관련 상태
  const [audioAllowed, setAudioAllowed] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEmptyStateClosed, setIsEmptyStateClosed] = useState(false);
  const [isCenterHovered, setIsCenterHovered] = useState(false);
  
  const [rawApiData, setRawApiData] = useState<ApiDataItem | null>(null);
  const [totalStats, setTotalStats] = useState<TotalData | null>(null);

  const [topCards, setTopCards] = useState<CamData[]>(initialTopCards);
  const [bottomCards, setBottomCards] = useState<CamData[]>(initialBottomCards);

  const [, setImageMetrics] = useState({ width: 0, height: 0, left: 0, top: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);
  const targetBoxRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  
  const fetchData = useCallback(async () => {
    try {
        const response = await fetch(API_URL);
        const json: ApiResponse = await response.json();

        if (json.success) {
            if (json.data.length > 0) {
                const d = json.data[0];
                setRawApiData(d);
                const getStatus = (label: string): InspectionStatus => label === '정상' ? '정상' : '에러';
                
                setTopCards([
                    { ...initialTopCards[0], status: getStatus(d.LABEL001), specificImageUrl: d.FILEPATH1 },
                    { ...initialTopCards[1], status: getStatus(d.LABEL002), specificImageUrl: d.FILEPATH2 },
                    { ...initialTopCards[2], status: getStatus(d.LABEL003), specificImageUrl: d.FILEPATH3 }
                ]);
                setBottomCards([
                    { ...initialBottomCards[0], status: getStatus(d.LABEL006), specificImageUrl: d.FILEPATH6 },
                    { ...initialBottomCards[1], status: getStatus(d.LABEL005), specificImageUrl: d.FILEPATH5 },
                    { ...initialBottomCards[2], status: getStatus(d.LABEL004), specificImageUrl: d.FILEPATH4 }
                ]);

                // 불량 상태 파악 및 모달 노출 처리
                const hasError = d.RESULT !== '정상';
                if (hasError && !audioAllowed && !showPermissionModal && !audioCtxRef.current) {
                    setShowPermissionModal(true);
                }
            }
            if (json.total_data) {
                setTotalStats({
                    total_count: json.total_data.total_count,
                    normal_count: json.total_data.normal_count
                });
            }
        }
    } catch (error) {
        console.error("API Fetch Error:", error);
    }
  }, [audioAllowed, showPermissionModal]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // API 실시간 Polling 처리
  useEffect(() => { 
      if(!isMounted) return;
      fetchData(); 
      const intervalId = setInterval(fetchData, 3000); // 3초마다 갱신
      return () => clearInterval(intervalId);
  }, [fetchData, isMounted]);

  const handleNavigateHome = () => { router.push('/'); };

  const handleImageClick = (title: string, url: string) => {
      setModalInfo({ isOpen: true, title, imgUrl: url });
  };

  // 비프음 재생 로직
  useEffect(() => {
    if (!isMounted) return;

    let intervalId: NodeJS.Timeout;
    
    if (audioAllowed && !showPermissionModal) {
        const allCards = [...topCards, ...bottomCards];
        const hasDefect = allCards.some(card => card.status === '점검필요' || card.status === '에러');
        
        if (hasDefect) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            
            if (!audioCtxRef.current && AudioContextClass) {
                audioCtxRef.current = new AudioContextClass();
            }

            const playBeep = () => {
                const ctx = audioCtxRef.current;
                if (!ctx) return;
                
                if (ctx.state === 'suspended') ctx.resume();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'square';
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start();
                gain.gain.setValueAtTime(0.1, ctx.currentTime); // 볼륨 조절
                gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.15);
                osc.stop(ctx.currentTime + 0.2);
            };

            playBeep();
            intervalId = setInterval(playBeep, 1000); 
        }
    }

    return () => { 
        if (intervalId) clearInterval(intervalId); 
    };
  }, [isMounted, audioAllowed, showPermissionModal, topCards, bottomCards]);

  useEffect(() => {
    if (!isMounted) return;
    const handleResize = () => setScreenMode(window.innerWidth > 2200 ? 'QHD' : 'FHD');
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMounted]);

  const layout = LAYOUT_CONFIGS[screenMode];

  const updateImageMetrics = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;
    const img = imageRef.current;
    const container = containerRef.current;
    if (img.naturalWidth === 0) return;
    const imageAspect = img.naturalWidth / img.naturalHeight;
    const containerRect = container.getBoundingClientRect();
    const containerAspect = containerRect.width / containerRect.height;
    
    let displayedWidth, displayedHeight, offsetLeft, offsetTop;
    if (imageAspect > containerAspect) {
      displayedWidth = containerRect.width; 
      displayedHeight = containerRect.width / imageAspect; 
      offsetLeft = 0; 
      offsetTop = (containerRect.height - displayedHeight) / 2;
    } else {
      displayedWidth = containerRect.height * imageAspect; 
      displayedHeight = containerRect.height; 
      offsetLeft = (containerRect.width - displayedWidth) / 2; 
      offsetTop = 0;
    }
    setImageMetrics({ width: displayedWidth, height: displayedHeight, left: offsetLeft, top: offsetTop });
  }, []);

  useEffect(() => { 
      if(!isMounted) return;
      updateImageMetrics(); 
      const t = setTimeout(updateImageMetrics, 300); 
      return () => clearTimeout(t); 
  }, [screenMode, updateImageMetrics, isMounted]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageRef.current || !scopeRef.current || !targetBoxRef.current) return;
    const clientX = e.clientX; 
    const clientY = e.clientY;
    
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    
    requestRef.current = requestAnimationFrame(() => {
      if (!containerRef.current || !imageRef.current || !scopeRef.current || !targetBoxRef.current) return;
      const imageRect = imageRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const isInsideImage = clientX >= imageRect.left && clientX <= imageRect.right && clientY >= imageRect.top && clientY <= imageRect.bottom;
      
      if (!isInsideImage) {
        scopeRef.current.style.opacity = '0'; 
        scopeRef.current.style.transform = 'scale(0.8)'; 
        targetBoxRef.current.style.opacity = '0'; 
        return;
      }
      
      const halfScope = SCOPE_SIZE / 2;
      const scopeLeft = clientX - containerRect.left - halfScope;
      const scopeTop = clientY - containerRect.top - halfScope;
      scopeRef.current.style.opacity = '1';
      scopeRef.current.style.transform = `translate3d(${scopeLeft}px, ${scopeTop}px, 0) scale(1)`;
      
      const relativeX = clientX - imageRect.left;
      const relativeY = clientY - imageRect.top;
      const bgX = (relativeX / imageRect.width) * 100;
      const bgY = (relativeY / imageRect.height) * 100;
      scopeRef.current.style.backgroundPosition = `${bgX}% ${bgY}%`;
      
      const targetSize = SCOPE_SIZE / ZOOM_LEVEL;
      const halfTarget = targetSize / 2;
      const targetLeft = clientX - containerRect.left - halfTarget;
      const targetTop = clientY - containerRect.top - halfTarget;
      targetBoxRef.current.style.opacity = '1';
      targetBoxRef.current.style.width = `${targetSize}px`;
      targetBoxRef.current.style.height = `${targetSize}px`;
      targetBoxRef.current.style.transform = `translate3d(${targetLeft}px, ${targetTop}px, 0)`;
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scopeRef.current) { 
        scopeRef.current.style.opacity = '0'; 
        scopeRef.current.style.transform = 'scale(0.8)'; 
    }
    if (targetBoxRef.current) { 
        targetBoxRef.current.style.opacity = '0'; 
    }
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  if (!isMounted) return null;

  const resultStr = rawApiData?.RESULT || '';
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

  const timeValue = rawApiData?.TIMEVALUE || '00:00:00';

  return (
    <PageContainer style={{ padding: layout.padding }}>
      <GlobalStyles />
      
      <HeaderRow style={{ gap: layout.gap, height: layout.headerHeight, marginBottom: layout.gap }}>
        <ResultCard $status={statusState}>
          <SoundToggleBtn onClick={() => setAudioAllowed(!audioAllowed)}>
            {audioAllowed ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </SoundToggleBtn>
          <ResultIconBox $status={statusState}>
            <ResultIcon size={36} strokeWidth={2.5} />
          </ResultIconBox>
          <ResultTextBox>
            <ResultLabel>
              <Info size={14} /> 
              전체 판정 결과
            </ResultLabel>
            <ResultValue $status={statusState}>
                {label}
            </ResultValue>
          </ResultTextBox>
        </ResultCard>

        <InfoTableCard>
          <InfoTableHeader>
            <Th>검사 시간</Th>
            <Th>검사 수량</Th>
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
                  <TdSubText>/ {totalStats.total_count}</TdSubText>
                </div>
              ) : (
                <TdValueText $color={THEME.textSecondary}>-</TdValueText>
              )}
            </Td>
            <Td $isLast>
              <TdValueText $color={THEME.textPrimary}>RUNNING</TdValueText>
            </Td>
          </InfoTableBody>
        </InfoTableCard>
      </HeaderRow>

      <MainBoard>
        <TopCamRow style={{ gap: layout.gap, height: layout.cardHeight }}>
          {topCards.map((card) => {
            const isOk = card.status === '정상';
            return (
              <CamCardWrapper key={card.id} $isOk={isOk}>
                <CamCardHeader>
                  <CamTitle>{card.title}</CamTitle>
                  <CamBadge $isOk={isOk}>{card.status}</CamBadge>
                </CamCardHeader>
                <CamImageArea 
                  $imgUrl={card.specificImageUrl || GUIDE_IMAGE_URL} 
                  onClick={() => handleImageClick(`${card.id} - Detail View`, card.specificImageUrl || GUIDE_IMAGE_URL)}
                  style={{ cursor: 'pointer' }}
                />
              </CamCardWrapper>
            );
          })}
        </TopCamRow>

        <CenterImageContainer 
            $isHovered={isCenterHovered}
            ref={containerRef} 
            onMouseMove={handleMouseMove} 
            onMouseEnter={() => setIsCenterHovered(true)}
            onMouseLeave={(e) => {
                setIsCenterHovered(false);
                handleMouseLeave(e);
            }}
        >
          <img 
            ref={imageRef} 
            src={GUIDE_IMAGE_URL} 
            alt="Main Glass Guide" 
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', display: 'block' }} 
            onLoad={updateImageMetrics} 
            onError={(e) => e.currentTarget.style.display = 'none'} 
          />
          <div 
            ref={targetBoxRef} 
            style={{
                position: 'absolute', top: 0, left: 0, width: '0px', height: '0px',
                border: `2px solid ${THEME.accent}`, boxShadow: `0 0 10px ${THEME.accent}`,
                backgroundColor: 'transparent', zIndex: 40, pointerEvents: 'none', opacity: 0
            }} 
          />
          <div 
            ref={scopeRef} 
            style={{
                position: 'absolute', top: 0, left: 0, width: `${SCOPE_SIZE}px`, height: `${SCOPE_SIZE}px`,
                borderRadius: '50%', border: `2px solid ${THEME.accent}`, backgroundColor: '#fff',
                backgroundRepeat: 'no-repeat', backgroundSize: `${ZOOM_LEVEL * 100}%`,
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)', pointerEvents: 'none', zIndex: 50,
                opacity: 0, transform: 'scale(0.8)', transition: 'opacity 0.25s, transform 0.25s',
                willChange: 'transform, opacity', 
                // ✅ 해결: url() 안에 따옴표를 추가
                backgroundImage: `url('${GUIDE_IMAGE_URL}')`
            }}
          >
            <div style={{ position: 'absolute', top: '50%', left: '15%', width: '70%', height: '1px', backgroundColor: THEME.accent, opacity: 0.5 }} />
            <div style={{ position: 'absolute', left: '50%', top: '15%', height: '70%', width: '1px', backgroundColor: THEME.accent, opacity: 0.5 }} />
          </div>
        </CenterImageContainer>

        <BottomCamRow style={{ gap: layout.gap, height: layout.cardHeight }}>
          {bottomCards.map((card) => {
            const isOk = card.status === '정상';
            return (
              <CamCardWrapper key={card.id} $isOk={isOk}>
                <CamCardHeader>
                  <CamTitle>{card.title}</CamTitle>
                  <CamBadge $isOk={isOk}>{card.status}</CamBadge>
                </CamCardHeader>
                <CamImageArea 
                  $imgUrl={card.specificImageUrl || GUIDE_IMAGE_URL} 
                  onClick={() => handleImageClick(`${card.id} - Detail View`, card.specificImageUrl || GUIDE_IMAGE_URL)}
                  style={{ cursor: 'pointer' }}
                />
              </CamCardWrapper>
            );
          })}
        </BottomCamRow>
      </MainBoard>

      <button
          onClick={() => setIsHistoryOpen(true)}
          style={{
              position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 95000,
              display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: THEME.textPrimary, color: '#fff',
              padding: '14px 28px', borderRadius: '99px', fontSize: '15px', fontWeight: 800,
              border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
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
      {showPermissionModal && (
        <SoundPermissionModal 
          onConfirm={() => { 
            setShowPermissionModal(false); 
            setAudioAllowed(true); 
          }} 
        />
      )}
      {modalInfo && (
        <ImageModal 
          isOpen={modalInfo.isOpen} 
          onClose={() => setModalInfo(null)} 
          title={modalInfo.title} 
          imgUrl={modalInfo.imgUrl} 
        />
      )}

      {totalStats && totalStats.total_count === 0 && !isEmptyStateClosed && (
          <EmptyStateModal 
              onNavigateHome={handleNavigateHome} 
              onClose={() => setIsEmptyStateClosed(true)}
          />
      )}
    </PageContainer>
  );
}
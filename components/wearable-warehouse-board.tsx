'use client';

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Search,
  Box,
  PieChart as PieIcon, 
  Package as PackageIcon, 
  Layers, 
  X as XIcon
} from "lucide-react";

// ─── [1. INTERFACES & DATA] ────────────────────────

export interface WearableSlotData {
  no: number;
  active: boolean;
}

export interface WearableZoneData {
  id: string;
  total: number;
  used: number;
  free: number;
  status: string;
  slots: WearableSlotData[];
}

export interface WearableInventoryItem {
  code: string;
  qty: number;
  loc: string;
}

// ✨ Props 타입 명시 (에러 해결의 핵심)
interface WarehouseBoardProps {
  onClose: () => void;
}

// ─── [2. STYLED COMPONENTS] ────────────────────────

// ✨ 모달 배경 (어둡게 처리 및 클릭 시 닫힘)
const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(6px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

const RedBoardContainer = styled(motion.div)`
  background: #ffffff;
  width: 95vw;
  max-width: 1600px;
  height: 85vh;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

  .board-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #f1f5f9;
  }

  .board-header .title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    font-weight: 700;
    color: #111;
  }

  .close-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    padding: 4px;
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: #f1f5f9;
    color: #111;
  }
  
  .board-body {
    display: flex;
    padding: 24px;
    gap: 24px;
    flex: 1;
    min-height: 0;
    background: #f8fafc;
  }
  
  .left-col {
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    flex-shrink: 0;
  }

  .summary-card {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    flex-shrink: 0;
  }

  .summary-card h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #111;
  }

  .chart-area {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .pie-mock {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 8px solid;
    border-right-color: #f1f5f9 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .legend {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
  }

  .legend .dot {
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 50%;
    margin-right: 8px;
  }

  .legend .secondary {
    background: #e2e8f0;
  }
  
  .inv-list-wrapper {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .search-row h3 {
    margin: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #111;
  }

  .s-box {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f1f5f9;
    padding: 8px 12px;
    border-radius: 8px;
    margin-top: 12px;
  }

  .s-box input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    width: 100%;
    color: #111;
  }
  
  .list-scroll {
    margin-top: 16px;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 4px;
  }

  .list-scroll::-webkit-scrollbar {
    width: 4px;
  }

  .list-scroll::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  
  .inv-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #f1f5f9;
    transition: all 0.2s;
  }

  .inv-item:hover {
    border-color: #cbd5e1;
  }

  .inv-item .info {
    flex: 1;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .inv-item .c {
    font-weight: bold;
    font-size: 14px;
    color: #111;
  }

  .inv-item .l {
    font-size: 12px;
    color: #64748b;
  }

  .inv-item .q {
    font-weight: bold;
    color: #ef4444;
    font-size: 16px;
  }
  
  .map-col {
    background: #fff;
    flex: 1;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    padding: 24px;
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0; 
  }

  .map-legend {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }

  .badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: bold;
  }

  .badge.empty {
    background: #f1f5f9;
    color: #64748b;
    border: 1px solid #e2e8f0;
  }

  .badge.active {
    background: #fef2f2;
    color: #ef4444;
    border: 1px solid #fca5a5;
  }

  .badge.full {
    background: #fecaca;
    color: #991b1b;
    border: 1px solid #f87171;
  }

  .badge .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  
  .zone-wrapper {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr)); /* ✨ 5분할 유동적 레이아웃 */
    gap: 16px;
    flex: 1;
    min-height: 0;
  }

  .zone-col {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .z-head .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .z-head .id {
    font-weight: bold;
    font-size: 18px;
    color: #111;
  }

  .z-head .st {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
  }

  .z-head .st.g {
    background: #dcfce7;
    color: #16a34a;
  }

  .z-head .st.o {
    background: #fef08a;
    color: #ca8a04;
  }

  .z-head .st.r {
    background: #fee2e2;
    color: #dc2626;
  }

  .usage-text {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #64748b;
    margin-bottom: 8px;
  }

  .usage-text b {
    color: #ef4444;
  }

  .bar {
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
  }

  .bar .fill {
    height: 100%;
    border-radius: 3px;
  }
  
  .slot-grid-container {
    flex: 1;
    overflow-y: auto;
    margin-top: 16px;
    background: #fff;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #f1f5f9;
  }

  .slot-grid-container::-webkit-scrollbar {
    width: 4px;
  }

  .slot-grid-container::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  .slot-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .slot {
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    border-radius: 6px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: bold;
    color: #94a3b8;
    gap: 4px;
  }

  .slot.on {
    background: #fff;
    border-color: #fca5a5;
    color: #ef4444;
  }
`;

// ─── [3. SUB COMPONENTS] ────────────────────────

const MemoizedRedInventoryItem = React.memo(({ item }: { item: WearableInventoryItem }) => (
  <div className="inv-item">
    <div className="icon">
      <Layers size={14} />
    </div>
    <div className="info">
      <div className="c">
        {item.code}
      </div>
      <div className="l">
        {item.loc}
      </div>
    </div>
    <div className="q">
      {item.qty}
    </div>
  </div>
));
MemoizedRedInventoryItem.displayName = 'MemoizedRedInventoryItem';

const MemoizedRedSlot = React.memo(({ s }: { s: WearableSlotData }) => (
    <div className={`slot ${s.active ? 'on' : ''}`}>
        {s.active && (
            <div className="icon-box">
                <Box size={14} fill="#fca5a5" color="#ef4444" />
            </div>
        )}
        {s.no}
    </div>
));
MemoizedRedSlot.displayName = 'MemoizedRedSlot';

const RedZoneColumn = React.memo(({ zone }: { zone: WearableZoneData }) => (
    <div className="zone-col">
        <div className="z-head">
            <div className="top">
                <span className="id">
                  {zone.id}
                </span>
                <span className={`st ${zone.status === '만차' ? 'r' : zone.status === '혼잡' ? 'o' : 'g'}`}>
                  {zone.status}
                </span>
            </div>
            <div className="usage-text">
                <span>
                  점유율
                </span>
                <b>
                  {Math.round((zone.used / zone.total) * 100)}%
                </b>
            </div>
            <div className="bar">
              <div 
                className="fill" 
                style={{
                  width: `${(zone.used / zone.total) * 100}%`, 
                  backgroundColor: '#ef4444'
                }}
              />
            </div>
        </div>
        <div className="slot-grid-container">
            <div className="slot-grid">
                {zone.slots.map((s) => (
                  <MemoizedRedSlot key={s.no} s={s} />
                ))}
            </div>
        </div>
    </div>
));
RedZoneColumn.displayName = 'RedZoneColumn';

// ─── [4. MAIN WAREHOUSE BOARD COMPONENT] ────────────────────────

const WarehouseBoard = ({ onClose }: WarehouseBoardProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    
    const initialMapData: WearableZoneData[] = [
        { id: 'D101', total: 10, used: 2, free: 8, status: '여유', slots: Array.from({length: 10}, (_, i) => ({ no: i+1, active: i < 2 })) },
        { id: 'D102', total: 19, used: 15, free: 4, status: '혼잡', slots: Array.from({length: 19}, (_, i) => ({ no: i+1, active: i < 15 })) },
        { id: 'D103', total: 20, used: 20, free: 0, status: '만차', slots: Array.from({length: 20}, (_, i) => ({ no: i+1, active: true })) },
        { id: 'D104', total: 20, used: 8, free: 12, status: '보통', slots: Array.from({length: 20}, (_, i) => ({ no: i+1, active: i < 8 })) },
        { id: 'D105', total: 19, used: 0, free: 19, status: '비어있음', slots: Array.from({length: 19}, (_, i) => ({ no: i+1, active: false })) },
    ];
    const mapData = initialMapData;

    const inventoryData: WearableInventoryItem[] = useMemo(() => [
        { code: 'ADC30009358', qty: 708, loc: 'D101' }, 
        { code: 'ADC30014326', qty: 294, loc: 'D102' },
        { code: 'ADC30003801', qty: 204, loc: 'D102' }, 
        { code: 'AGF04075606', qty: 182, loc: 'D103' },
        { code: 'ADC30009359', qty: 150, loc: 'D104' }, 
        { code: 'AGM76970201', qty: 120, loc: 'D101' },
        { code: 'AGM76970202', qty: 100, loc: 'D105' }, 
        { code: 'AGM76970203', qty: 50, loc: 'D101' },
        { code: 'AGM76970204', qty: 30, loc: 'D102' }, 
        { code: 'AGM76970205', qty: 10, loc: 'D103' },
        { code: 'AGM76970206', qty: 120, loc: 'D104' }, 
        { code: 'AGM76970207', qty: 100, loc: 'D105' },
    ], []);

    const filteredInventory = useMemo(() => 
        inventoryData.filter(item => 
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.loc.toLowerCase().includes(searchTerm.toLowerCase()) 
        ), 
    [inventoryData, searchTerm]);
    
    return (
        <ModalBackdrop 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
        >
            <RedBoardContainer
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            > 
                <div className="board-header"> 
                    <div className="title">
                        <LayoutGrid size={24} color="#ef4444"/> 
                        D동 실시간 적재 현황판
                    </div> 
                    <button className="close-btn" onClick={onClose}>
                        <XIcon size={28}/>
                    </button> 
                </div> 
                <div className="board-body"> 
                    <div className="left-col"> 
                        <div className="summary-card"> 
                            <h3>
                                <PieIcon size={16}/> 
                                종합 적재 현황
                            </h3> 
                            <div className="chart-area"> 
                                <div className="pie-mock" style={{borderColor: '#ef4444'}}>
                                    <span className="val">48%</span>
                                </div> 
                                <div className="legend"> 
                                    <div>
                                        <span className="dot primary" style={{background: '#ef4444'}}/>
                                        사용: <b>48</b>
                                    </div> 
                                    <div>
                                        <span className="dot secondary"/>
                                        여유: <b>52</b>
                                    </div> 
                                </div> 
                            </div> 
                        </div> 
                        <div className="inv-list-wrapper"> 
                            <div className="search-row"> 
                                <h3>
                                    <PackageIcon size={16}/> 
                                    부품 리스트
                                </h3> 
                                <div className="s-box">
                                    <Search size={14}/>
                                    <input 
                                        placeholder="검색..." 
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div> 
                            </div> 
                            <div className="list-scroll"> 
                                {filteredInventory.map((item, i) => ( 
                                    <MemoizedRedInventoryItem key={i} item={item} /> 
                                ))} 
                            </div> 
                        </div> 
                    </div> 
                    <div className="map-col"> 
                        <div className="map-legend"> 
                            <span className="badge empty">
                                <div className="dot" style={{background:'#cbd5e1'}}/> 
                                여유
                            </span>
                            <span className="badge active">
                                <div className="dot" style={{background:'#ef4444'}}/> 
                                사용
                            </span>
                            <span className="badge full">
                                <div className="dot" style={{background:'#991b1b'}}/> 
                                만차
                            </span> 
                        </div> 
                        <div className="zone-wrapper"> 
                            {mapData.map(zone => (
                                <RedZoneColumn key={zone.id} zone={zone} />
                            ))} 
                        </div> 
                    </div> 
                </div> 
            </RedBoardContainer>
        </ModalBackdrop>
    )
};

export default WarehouseBoard;
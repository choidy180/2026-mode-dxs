import { motion } from 'framer-motion';
import styled from 'styled-components';

export const VideoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 22px 24px 18px;
  background: #fff;
  border-bottom: 1px solid #eef2f7;
  border-radius: 24px 24px 0 0;

  .title-area { min-width: 0; }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    color: #64748b;
    font-size: .78rem;
    font-weight: 700;
  }
  h3 {
    margin: 0;
    color: #0f172a;
    font-size: 1.45rem;
    font-weight: 800;
    letter-spacing: -.04em;
  }
  p {
    margin: 8px 0 0;
    color: #64748b;
    font-size: .9rem;
    font-weight: 500;
  }
  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .soft-btn {
    height: 36px;
    padding: 0 14px;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    background: #fff;
    color: #475569;
    font-size: .84rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
`;

export const MonitorShell = styled.div`
  display: grid;
  /* grid-template-columns: minmax(0, 1fr) clamp(380px, 24vw, 440px); */
  gap: 18px;
  flex: 1;
  min-height: 0;
  padding: 18px 22px 24px;
  background: #fff;
  border-radius: 0 0 24px 24px;

  @media (max-width: 1500px) {
    grid-template-columns: 1fr;
  }
`;

export const CameraStage = styled.div`
  min-width: 0;
  min-height: 0;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e8edf4;
  border-radius: 24px;
`;

export const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const CamBox = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: #fff;
  border: 1px solid #e5eaf1;
  border-radius: 20px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, .055);
  contain: layout paint style;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    background: #020617;
  }
  .cam-title {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 10px;
    color: #0f172a;
    background: rgba(255, 255, 255, .92);
    border: 1px solid rgba(226, 232, 240, .9);
    border-radius: 999px;
    font-size: .78rem;
    font-weight: 800;
  }
  .live-dot,
  .wait-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
  }
  .live-dot { background: #10b981; }
  .wait-dot { background: #cbd5e1; }
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    color: #94a3b8;
    font-size: .88rem;
    font-weight: 700;
  }
  .fullscreen-btn {
    position: absolute;
    right: 12px;
    bottom: 12px;
    z-index: 1;
    width: 36px;
    height: 36px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: rgba(255, 255, 255, .94);
    color: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform .16s ease, background .16s ease;
  }
  .fullscreen-btn:hover {
    background: #fff;
    transform: translateY(-1px);
  }
`;

export const CameraFullscreenOverlay = styled(motion.div)`
  --accent: #ff3b30;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5000;
  height: 100vh;
  height: 100dvh;
  padding: 0;
  color: #0f172a;
  background: #fff;
  contain: layout paint style;

  .fullscreen-stage {
    width: 100%;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    background: #fff;
    will-change: opacity;
  }

  .fullscreen-camera-surface {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background: #05070b;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    background: #05070b;
  }

  .camera-overlay {
    position: absolute;
    top: 16px;
    left: 16px;
    right: 16px;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    pointer-events: none;
  }

  .camera-meta {
    min-width: 0;
    max-width: calc(100% - 58px);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    color: #0f172a;
    background: rgba(255, 255, 255, .9);
    border: 1px solid rgba(255, 255, 255, .78);
    border-radius: 999px;
    box-shadow: 0 12px 30px rgba(15, 23, 42, .14);
    backdrop-filter: blur(18px);
    pointer-events: auto;
  }

  .camera-meta strong,
  .stream-info {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .camera-meta strong {
    font-size: .9rem;
    font-weight: 900;
    letter-spacing: -.03em;
  }

  .camera-badge,
  .status-chip {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    border-radius: 999px;
    font-size: .72rem;
    font-weight: 900;
  }

  .camera-badge {
    padding: 0 10px;
    color: var(--accent);
    background: #fff1f0;
    border: 1px solid #ffd7d4;
  }

  .status-chip {
    gap: 6px;
    padding: 0 9px;
    color: #64748b;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }

  .status-chip::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #cbd5e1;
  }

  .status-chip.live {
    color: #c81e1e;
    background: #fff5f5;
    border-color: #fecaca;
  }

  .status-chip.live::before {
    background: var(--accent);
  }

  .stream-info {
    max-width: 170px;
    color: #64748b;
    font-size: .78rem;
    font-weight: 800;
  }

  .close-fullscreen {
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border: 1px solid rgba(255, 215, 212, .9);
    border-radius: 50%;
    background: rgba(255, 255, 255, .92);
    color: #c81e1e;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 12px 30px rgba(15, 23, 42, .14);
    backdrop-filter: blur(18px);
    transition: transform .16s ease, background .16s ease, border-color .16s ease;
    pointer-events: auto;
  }

  .close-fullscreen:hover {
    transform: translateY(-1px);
    background: #fff5f5;
    border-color: #ffb4ae;
  }

  .close-fullscreen:focus-visible {
    outline: 3px solid rgba(255, 59, 48, .22);
    outline-offset: 3px;
  }

  .empty-state {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 9px;
    color: #64748b;
    background: #fff;
  }

  .empty-icon {
    width: 76px;
    height: 76px;
    display: grid;
    place-items: center;
    color: var(--accent);
    background: #fff1f0;
    border: 1px solid #ffd7d4;
    border-radius: 24px;
  }

  .empty-state strong {
    margin-top: 6px;
    color: #0f172a;
    font-size: 1.05rem;
    font-weight: 900;
    letter-spacing: -.03em;
  }

  .empty-state span {
    color: #64748b;
    font-size: .9rem;
    font-weight: 700;
  }

  @media (max-width: 760px) {
    .camera-overlay {
      top: 12px;
      left: 12px;
      right: 12px;
    }

    .camera-meta {
      max-width: calc(100% - 52px);
      border-radius: 20px;
      flex-wrap: wrap;
    }

    .camera-meta strong,
    .stream-info {
      display: none;
    }

    .close-fullscreen {
      width: 40px;
      height: 40px;
    }
  }
`;


export const InspectionLogPanelShell = styled.aside`
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  padding: 18px;
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 24px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, .045);

  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
  }
  h4 {
    margin: 0;
    color: #0f172a;
    font-size: 1.05rem;
    font-weight: 800;
  }
  p {
    margin: 5px 0 0;
    color: #64748b;
    font-size: .82rem;
    font-weight: 600;
  }
  .count-pill {
    padding: 6px 10px;
    color: #475569;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    font-size: .78rem;
    font-weight: 800;
    white-space: nowrap;
  }
  @media (max-width: 1500px) {
    max-height: 360px;
  }
`;

export const InspectionLogList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 999px;
  }
`;

export const InspectionLogItem = styled.div<{ $done: boolean }>`
  padding: 14px;
  background: #fff;
  border: 1px solid #edf2f7;
  border-radius: 18px;

  .row-head {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
  }
  .item-code {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #2563eb;
    font-size: .88rem;
    font-weight: 900;
  }
  .badge {
    flex-shrink: 0;
    padding: 4px 8px;
    color: ${props => (props.$done ? '#047857' : '#b45309')};
    background: ${props => (props.$done ? '#ecfdf5' : '#fffbeb')};
    border: 1px solid ${props => (props.$done ? '#a7f3d0' : '#fde68a')};
    border-radius: 999px;
    font-size: .72rem;
    font-weight: 900;
  }
  .material {
    margin: 0 0 10px;
    color: #0f172a;
    font-size: .9rem;
    font-weight: 800;
  }
  .vendor {
    margin-bottom: 10px;
    color: #64748b;
    font-size: .78rem;
    font-weight: 800;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 10px;
  }
  .meta {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .meta span {
    color: #94a3b8;
    font-size: .68rem;
    font-weight: 900;
  }
  .meta strong,
  .meta code {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #334155;
    font-size: .75rem;
    font-weight: 800;
  }
`;

export const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, .4);
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled(motion.div)`
  position: fixed;
  top: calc(50% + 32px);
  left: 50%;
  z-index: 2001;
  width: 95%;
  max-width: 1400px;
  height: 80vh;
  padding: 32px;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #334155;
  border: 1px solid #f1f5f9;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, .25);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    color: #0f172a;
    font-size: 1.5rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 12px;
    white-space: nowrap;
  }
`;

export const ControlBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
`;

export const SearchInput = styled.div`
  flex: 1;
  position: relative;

  input {
    width: 100%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 12px 12px 12px 44px;
    border-radius: 12px;
    color: #334155;
    font-size: .95rem;
  }
  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  gap: 4px;
  padding: 4px;
  background: #f1f5f9;
  border-radius: 12px;
`;

export const FilterButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: 0;
  border-radius: 8px;
  background: ${props => (props.$active ? '#fff' : 'transparent')};
  color: ${props => (props.$active ? '#2563eb' : '#64748b')};
  font-size: .9rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${props => (props.$active ? '0 1px 3px rgba(0,0,0,.1)' : 'none')};
`;

export const TableWrapper = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
`;

export const StyledTable = styled.table`
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;

  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #f1f5f9;
  }
  th,
  td {
    padding: 16px 20px;
    text-align: left;
    white-space: nowrap;
    border-bottom: 1px solid #f1f5f9;
  }
  th {
    color: #475569;
    font-size: .9rem;
    font-weight: 700;
  }
  td {
    color: #334155;
    font-size: .95rem;
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  min-width: 80px;
  padding: 6px 12px;
  display: inline-flex;
  justify-content: center;
  gap: 6px;
  border-radius: 20px;
  font-size: .8rem;
  font-weight: 700;
  background: ${props => (props.$status === 'Y' ? '#dcfce7' : '#fee2e2')};
  color: ${props => (props.$status === 'Y' ? '#15803d' : '#b91c1c')};
  border: 1px solid ${props => (props.$status === 'Y' ? '#bbf7d0' : '#fecaca')};
`;

export const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const ViewAllButton = styled.button`
  border: 0;
  background: transparent;
  color: #94a3b8;
  font-size: .85rem;
  font-weight: 600;
  cursor: pointer;
`;

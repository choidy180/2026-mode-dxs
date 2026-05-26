import styled, { createGlobalStyle } from 'styled-components';

import type { InspectionTone, InspectionViewType } from '@/types/sixPointInspection';
import {
  getToneBackground,
  getToneColor,
  getToneText,
  sixPointTheme,
} from '@/styles/sixPointInspection.theme';

export const SixPointGlobalStyles = createGlobalStyle`
  @keyframes six-point-float {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-8px);
    }

    100% {
      transform: translateY(0);
    }
  }

  @keyframes six-point-connector-flow {
    to {
      stroke-dashoffset: -32;
    }
  }


  .six-point-connector-flow {
    animation: six-point-connector-flow 1.8s linear infinite;
  }

  .six-point-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .six-point-scrollbar::-webkit-scrollbar-track {
    background: #F8FAFC;
  }

  .six-point-scrollbar::-webkit-scrollbar-thumb {
    background: #D0D5DD;
    border-radius: 4px;
  }

  .six-point-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #98A2B3;
  }

  strong,
  b {
    font-weight: 700;
  }
`;

export const PageShell = styled.main`
  width: 100%;
  height: calc(100vh - 64px);
  height: calc(100dvh - 64px);
  min-height: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${sixPointTheme.bg};
  color: ${sixPointTheme.textPrimary};
`;

export const HeaderRow = styled.header`
  height: clamp(86px, 8.2vh, 112px);
  flex-shrink: 0;
  display: grid;
  grid-template-columns: clamp(260px, 16vw, 350px) minmax(0, 1fr);
  gap: clamp(8px, 0.6vw, 12px);
  padding: clamp(12px, 1vw, 20px) clamp(14px, 1.25vw, 26px) 0;
`;

export const HeaderInfoArea = styled.div`
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(430px, 1fr) clamp(168px, 11vw, 230px) clamp(82px, 5vw, 104px) clamp(154px, 9vw, 205px);
  gap: clamp(8px, 0.6vw, 12px);
  align-items: stretch;
`;

export const ResultCard = styled.section<{ $tone: InspectionTone }>`
  position: relative;
  min-width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 18px;
  border-radius: 10px;
  border: 1px solid ${({ $tone }) => `${getToneColor($tone)}40`};
  background: ${sixPointTheme.surface};
  box-shadow: ${sixPointTheme.shadow};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 16px;
    bottom: 16px;
    width: 5px;
    border-radius: 0 3px 3px 0;
    background: ${({ $tone }) => getToneColor($tone)};
  }
`;

export const ResultIconBox = styled.div<{ $tone: InspectionTone }>`
  width: clamp(46px, 2.7vw, 58px);
  height: clamp(46px, 2.7vw, 58px);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid ${({ $tone }) => `${getToneColor($tone)}30`};
  background: ${({ $tone }) => getToneBackground($tone)};
  color: ${({ $tone }) => getToneColor($tone)};
`;

export const ResultTextBox = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ResultLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${sixPointTheme.textSecondary};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const ResultValue = styled.span<{ $tone: InspectionTone }>`
  color: ${({ $tone }) => getToneText($tone)};
  font-size: clamp(22px, 2vw, 30px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.05em;
  white-space: nowrap;
`;

export const SoundToggleButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  border: 1px solid ${sixPointTheme.border};
  background: rgba(255, 255, 255, 0.76);
  color: ${sixPointTheme.textSecondary};
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease, color 0.18s ease;

  &:hover {
    border-color: rgba(225, 29, 46, 0.28);
    background: ${sixPointTheme.accentSoft};
    color: ${sixPointTheme.accent};
  }
`;

export const InfoTableCard = styled.section`
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};
  box-shadow: ${sixPointTheme.shadow};
`;

export const InfoTableHeader = styled.div`
  height: 34%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-bottom: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surfaceMuted};
`;

export const InfoTableBody = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`;

export const InfoTh = styled.div<{ $last?: boolean }>`
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: ${({ $last }) => ($last ? 'none' : `1px solid ${sixPointTheme.hairline}`)};
  color: ${sixPointTheme.textSecondary};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const InfoTd = styled.div<{ $last?: boolean }>`
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: ${({ $last }) => ($last ? 'none' : `1px solid ${sixPointTheme.hairline}`)};
`;

export const InfoValue = styled.span<{ $accent?: boolean }>`
  max-width: 100%;
  overflow: hidden;
  color: ${({ $accent }) => ($accent ? sixPointTheme.accent : sixPointTheme.textPrimary)};
  font-size: clamp(15px, 1.05vw, 20px);
  font-weight: 700;
  letter-spacing: -0.04em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HeaderSummaryCard = styled.section`
  min-width: 0;
  padding: 7px;
  display: flex;
  align-items: stretch;
  border-radius: 10px;
  border: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};
  box-shadow: ${sixPointTheme.shadow};
`;

export const SummaryChipGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
`;

export const SummaryChip = styled.button<{ $tone?: InspectionTone; $active?: boolean }>`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0 6px;
  border-radius: 9px;
  border: 1px solid ${({ $tone, $active }) => {
    if ($active && $tone) {
      return getToneColor($tone);
    }

    if ($active) {
      return sixPointTheme.textPrimary;
    }

    if ($tone) {
      return `${getToneColor($tone)}33`;
    }

    return sixPointTheme.border;
  }};
  background: ${({ $tone }) => ($tone ? getToneBackground($tone) : sixPointTheme.surface)};
  color: ${({ $tone }) => ($tone ? getToneColor($tone) : sixPointTheme.textPrimary)};
  cursor: pointer;
  transition: border-color 0.18s ease, transform 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $tone }) => ($tone ? getToneColor($tone) : sixPointTheme.textPrimary)};
  }
`;

export const SummaryLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
`;

export const SummaryCount = styled.span`
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.04em;
`;

export const CompactTypeButton = styled.button`
  min-width: 0;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 0 9px;
  border-radius: 10px;
  border: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};
  color: ${sixPointTheme.textPrimary};
  box-shadow: ${sixPointTheme.shadow};
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease, transform 0.18s ease;

  svg {
    color: ${sixPointTheme.textSecondary};
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(225, 29, 46, 0.30);
    color: ${sixPointTheme.accent};
    box-shadow: 0 22px 54px rgba(15, 23, 42, 0.13);
  }
`;

export const TypeButtonLabel = styled.span`
  color: ${sixPointTheme.accent};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const CompactTypeValue = styled.span`
  max-width: 100%;
  overflow: hidden;
  color: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HeaderHistoryButton = styled.button`
  min-width: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};
  color: ${sixPointTheme.textPrimary};
  box-shadow: ${sixPointTheme.shadow};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.02em;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease, transform 0.18s ease;

  svg {
    color: ${sixPointTheme.accent};
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(225, 29, 46, 0.30);
    color: ${sixPointTheme.accent};
    box-shadow: 0 22px 54px rgba(15, 23, 42, 0.13);
  }
`;

export const InspectionWorkspace = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  padding: clamp(8px, 0.8vw, 16px) clamp(14px, 1.25vw, 26px) clamp(14px, 1.25vw, 26px);
`;

export const MainInspectionPanel = styled.section`
  position: relative;
  z-index: 10;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};
  box-shadow: ${sixPointTheme.shadowStrong};
`;

export const MainPanelHeader = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: clamp(10px, 0.7vw, 14px) 20px;
  border-bottom: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};
`;

export const MainPanelEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${sixPointTheme.accent};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
`;

export const LiveBadge = styled.div<{ $isDefect: boolean }>`
  height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 13px;
  border-radius: 9px;
  border: 1px solid ${({ $isDefect }) => ($isDefect ? 'rgba(225, 29, 46, 0.26)' : 'rgba(18, 183, 106, 0.24)')};
  background: ${({ $isDefect }) => ($isDefect ? sixPointTheme.status.ng.bg : sixPointTheme.status.ok.bg)};
  color: ${({ $isDefect }) => ($isDefect ? sixPointTheme.status.ng.text : sixPointTheme.status.ok.text)};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const LiveDot = styled.span<{ $isDefect: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $isDefect }) => ($isDefect ? sixPointTheme.danger : sixPointTheme.success)};
  box-shadow: 0 0 0 5px ${({ $isDefect }) => ($isDefect ? 'rgba(225, 29, 46, 0.12)' : 'rgba(18, 183, 106, 0.12)')};
`;

export const MainImageStage = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  margin: clamp(6px, 0.55vw, 10px);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};
`;

export const StageSplitGrid = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(200px, 0.26fr) minmax(0, 1fr) minmax(200px, 0.26fr);
  gap: clamp(9px, 0.65vw, 13px);
  padding: clamp(9px, 0.75vw, 14px);

  @media (min-width: 2200px) {
    grid-template-rows: minmax(170px, 0.28fr) minmax(0, 1fr) minmax(170px, 0.28fr);
  }
`;

export const StageRightStackGrid = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(640px, 38vw, 920px);
  gap: clamp(12px, 0.9vw, 18px);
  padding: clamp(9px, 0.75vw, 14px);

  @media (min-width: 2200px) {
    grid-template-columns: minmax(0, 1fr) clamp(860px, 36vw, 1160px);
  }
`;

export const CameraRail = styled.div`
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: minmax(0, 1fr);
  gap: clamp(8px, 0.65vw, 12px);
`;

export const CameraStackGrid = styled.div`
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: 3 / 2;
  align-self: center;
  justify-self: center;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: clamp(8px, 0.65vw, 12px);
`;

export const CenterGuideViewport = styled.div<{ $solo?: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: ${({ $solo }) => ($solo ? '10px' : '9px')};
  border: ${({ $solo }) => ($solo ? 'none' : `1px solid ${sixPointTheme.hairline}`)};
  background: ${sixPointTheme.surface};
`;

export const GuideImage = styled.img`
  position: relative;
  z-index: 2;
  max-width: 99%;
  max-height: 97%;
  object-fit: contain;
  user-select: none;
  filter: drop-shadow(0 28px 44px rgba(15, 23, 42, 0.14));
`;

export const CornerHotspot = styled.button<{
  $tone: InspectionTone;
  $active: boolean;
  $dragging: boolean;
  $x: number;
  $y: number;
}>`
  position: absolute;
  left: ${({ $x }) => `${$x}%`};
  top: ${({ $y }) => `${$y}%`};
  z-index: 90;
  width: clamp(42px, 3.2vw, 56px);
  height: clamp(42px, 3.2vw, 56px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 10px;
  border: 1px solid ${({ $tone }) => getToneColor($tone)};
  background: rgba(255, 255, 255, 0.94);
  color: ${({ $tone }) => getToneColor($tone)};
  box-shadow: ${({ $active, $dragging, $tone }) => ($active || $dragging
    ? `0 16px 34px ${getToneColor($tone)}2B, 0 0 0 7px ${getToneBackground($tone)}`
    : '0 12px 28px rgba(15, 23, 42, 0.11)')};
  cursor: grab;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.02em;
  outline: none;
  touch-action: none;
  transform: translate(-50%, -50%) ${({ $active, $dragging }) => ($active || $dragging ? 'scale(1.06)' : 'scale(1)')};
  transition: box-shadow 0.18s ease, background 0.18s ease, transform 0.18s ease;

  &:active {
    cursor: grabbing;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 8px;
    border-radius: 9px;
    border: 1px solid ${({ $tone }) => getToneColor($tone)};
    opacity: 0.34;
    pointer-events: none;
  }
`;

export const CameraTileButton = styled.button<{
  $tone: InspectionTone;
  $active: boolean;
  $imgUrl: string;
  $focusX: number;
  $focusY: number;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  padding: 0;
  border-radius: 9px;
  border: 1px solid ${({ $tone, $active }) => ($active ? getToneColor($tone) : $tone === 'wait' ? sixPointTheme.hairline : `${getToneColor($tone)}40`)};
  background-color: #F2F4F7;
  background-image: ${({ $imgUrl }) => ($imgUrl ? `url("${$imgUrl}")` : 'none')};
  background-position: ${({ $focusX, $focusY }) => `${$focusX}% ${$focusY}%`};
  background-repeat: no-repeat;
  background-size: 220%;
  box-shadow: ${({ $active }) => ($active ? '0 24px 56px rgba(15, 23, 42, 0.16)' : '0 14px 36px rgba(15, 23, 42, 0.08)')};
  cursor: pointer;
  outline: none;
  text-align: left;
  transform: ${({ $active }) => ($active ? 'translateY(-2px)' : 'translateY(0)')};
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ $tone }) => getToneColor($tone)};
    box-shadow: 0 24px 58px rgba(15, 23, 42, 0.15);
  }
`;

export const CameraTileHeader = styled.div`
  position: absolute;
  top: 11px;
  left: 11px;
  right: 11px;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

export const CameraTileCode = styled.span<{ $tone: InspectionTone }>`
  min-width: 34px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 9px;
  border: 1px solid ${({ $tone }) => `${getToneColor($tone)}35`};
  background: rgba(255, 255, 255, 0.94);
  color: ${({ $tone }) => getToneColor($tone)};
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.10);
  font-size: 12px;
  font-weight: 700;
`;

export const CameraTileStatus = styled.span<{ $tone: InspectionTone }>`
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border-radius: 9px;
  border: 1px solid ${({ $tone }) => `${getToneColor($tone)}30`};
  background: rgba(255, 255, 255, 0.94);
  color: ${({ $tone }) => getToneText($tone)};
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.10);
  font-size: 11px;
  font-weight: 700;
`;

export const CameraTileFooter = styled.div`
  position: absolute;
  left: 11px;
  right: 11px;
  bottom: 11px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const CameraTileName = styled.span`
  min-width: 0;
  height: 31px;
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  padding: 0 11px;
  border-radius: 9px;
  border: 1px solid ${sixPointTheme.hairline};
  background: rgba(255, 255, 255, 0.94);
  color: ${sixPointTheme.textPrimary};
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.10);
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CameraTileZoom = styled.span`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.94);
  color: #d31145;
  border: 1px solid rgba(211, 17, 69, 0.2);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
  cursor: pointer;
  z-index: 5;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    background: #fff1f2;
    border-color: rgba(211, 17, 69, 0.34);
    color: #d31145;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid rgba(211, 17, 69, 0.32);
    outline-offset: 2px;
  }
`;

export const NoImageText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${sixPointTheme.textMuted};
  font-size: 13px;
  font-weight: 700;
`;

export const ConnectorSvg = styled.svg`
  position: absolute;
  inset: 0;
  z-index: 80;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
`;

export const MainPanelFooter = styled.footer`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 20px clamp(8px, 0.65vw, 12px);
  color: ${sixPointTheme.textSecondary};
  font-size: 12px;
  font-weight: 700;
`;

export const LegendGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
`;

export const LegendDot = styled.span<{ $tone: InspectionTone }>`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ $tone }) => getToneColor($tone)};
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(248, 250, 252, 0.82);
  backdrop-filter: blur(14px);
`;

export const ModalShell = styled.div`
  width: min(1120px, 92vw);
  max-height: calc(100dvh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid ${sixPointTheme.border};
  background: ${sixPointTheme.surface};
  box-shadow: ${sixPointTheme.shadowStrong};
`;

export const ModalHeader = styled.header`
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 24px;
  border-bottom: 1px solid ${sixPointTheme.hairline};
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: ${sixPointTheme.textPrimary};
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.05em;
`;

export const ModalDescription = styled.p`
  margin: 6px 0 0;
  color: ${sixPointTheme.textSecondary};
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
`;

export const ModalCloseButton = styled.button`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  border: 1px solid ${sixPointTheme.border};
  background: ${sixPointTheme.surface};
  color: ${sixPointTheme.textSecondary};
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease, color 0.18s ease;

  &:hover {
    border-color: rgba(225, 29, 46, 0.25);
    background: ${sixPointTheme.accentSoft};
    color: ${sixPointTheme.accent};
  }
`;

export const TypeOptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 22px 24px 24px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const TypeOptionCard = styled.button<{ $active: boolean }>`
  min-width: 0;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => ($active ? sixPointTheme.accent : sixPointTheme.hairline)};
  background: ${sixPointTheme.surface};
  box-shadow: ${({ $active }) => ($active ? '0 24px 58px rgba(225, 29, 46, 0.12)' : '0 16px 38px rgba(15, 23, 42, 0.07)')};
  cursor: pointer;
  text-align: left;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${sixPointTheme.accent};
    box-shadow: 0 24px 58px rgba(15, 23, 42, 0.14);
  }
`;

export const TypeOptionPreview = styled.div<{ $variant: InspectionViewType }>`
  height: 184px;
  display: grid;
  grid-template-columns: ${({ $variant }) => ($variant === 'rightStack' ? '1fr 0.88fr' : '1fr')};
  grid-template-rows: ${({ $variant }) => ($variant === 'split' ? '0.36fr 1fr 0.36fr' : '1fr')};
  gap: 10px;
  margin-bottom: 14px;
  padding: 12px;
  border-radius: 9px;
  border: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surfaceMuted};
`;

export const TypePreviewRail = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

export const TypePreviewStack = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

export const TypePreviewBlock = styled.div<{ $main?: boolean; $accent?: boolean }>`
  min-width: 0;
  min-height: 0;
  border-radius: ${({ $main }) => ($main ? '10px' : '8px')};
  border: 1px solid ${({ $accent }) => ($accent ? 'rgba(225, 29, 46, 0.32)' : sixPointTheme.hairline)};
  background: ${({ $main, $accent }) => ($main ? sixPointTheme.surface : $accent ? sixPointTheme.accentSoft : sixPointTheme.surface)};
  box-shadow: ${({ $main }) => ($main ? '0 12px 28px rgba(15, 23, 42, 0.08)' : 'none')};
`;

export const TypeOptionName = styled.div`
  color: ${sixPointTheme.textPrimary};
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.04em;
`;

export const TypeOptionText = styled.p`
  margin: 6px 0 0;
  color: ${sixPointTheme.textSecondary};
  font-size: 13px;
  font-weight: 700;
  line-height: 1.42;
  word-break: keep-all;
`;

export const ImageModalShell = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: none;
  border-radius: 0;
  background: ${sixPointTheme.bg};
  box-shadow: none;
`;

export const ImageModalTop = styled.div`
  flex-shrink: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 18px 0 22px;
  border-bottom: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};

  ${ModalCloseButton} {
    border-radius: 0;
  }
`;

export const ImageModalTitle = styled.div`
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: ${sixPointTheme.textPrimary};
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.03em;

  svg {
    flex-shrink: 0;
    color: ${sixPointTheme.accent};
  }

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ImageModalBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 18px;
  border-radius: 0;
  background: ${sixPointTheme.bg};
`;

export const ImageModalImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};
`;

export const ImageModalEmptyText = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};
  color: ${sixPointTheme.textSecondary};
  font-size: clamp(18px, 1.45vw, 24px);
  font-weight: 700;
  line-height: 1.6;
  letter-spacing: -0.03em;
  text-align: center;
  word-break: keep-all;
`;

export const SoundPermissionShell = styled.div`
  width: min(420px, 90vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  padding: 42px;
  border-radius: 10px;
  border: 1px solid ${sixPointTheme.border};
  background: ${sixPointTheme.surface};
  box-shadow: ${sixPointTheme.shadowStrong};
  text-align: center;
`;

export const SoundIconBadge = styled.div`
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${sixPointTheme.accentSoft};
  color: ${sixPointTheme.danger};
`;

export const SoundTitle = styled.h2`
  margin: 0 0 10px;
  color: ${sixPointTheme.textPrimary};
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.04em;
`;

export const SoundText = styled.p`
  margin: 0;
  color: ${sixPointTheme.textSecondary};
  line-height: 1.55;
  word-break: keep-all;
`;

export const PrimaryDangerButton = styled.button`
  width: 100%;
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 18px;
  border: none;
  border-radius: 9px;
  background: ${sixPointTheme.danger};
  color: #FFFFFF;
  box-shadow: 0 10px 28px rgba(225, 29, 46, 0.22);
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
`;

export const EmptyStateBackdrop = styled(ModalBackdrop)`
  z-index: 90000;
`;

export const EmptyStateCard = styled.div`
  position: relative;
  width: min(460px, 90vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 46px;
  border-radius: 10px;
  border: 1px solid ${sixPointTheme.border};
  background: ${sixPointTheme.surface};
  box-shadow: ${sixPointTheme.shadowStrong};
  text-align: center;
`;

export const EmptyIconBadge = styled.div`
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
  border-radius: 50%;
  border: 1px solid rgba(225, 29, 46, 0.14);
  background: ${sixPointTheme.accentSoft};
  color: ${sixPointTheme.accent};
  animation: six-point-float 3s ease-in-out infinite;
`;

export const EmptyTitle = styled.h2`
  margin: 0 0 12px;
  color: ${sixPointTheme.textPrimary};
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.04em;
`;

export const EmptyText = styled.p`
  margin: 0 0 30px;
  color: ${sixPointTheme.textSecondary};
  font-size: 15px;
  line-height: 1.6;
  word-break: keep-all;
`;

export const SecondaryButton = styled.button`
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 28px;
  border-radius: 9px;
  border: 1px solid ${sixPointTheme.border};
  background: ${sixPointTheme.surface};
  color: ${sixPointTheme.textPrimary};
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  transition: border-color 0.18s ease, color 0.18s ease;

  &:hover {
    border-color: ${sixPointTheme.accent};
    color: ${sixPointTheme.accent};
  }
`;

export const HistoryModalShell = styled.div`
  width: calc(100vw - 40px);
  height: calc(100dvh - 28px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid ${sixPointTheme.border};
  background: ${sixPointTheme.surface};
  box-shadow: ${sixPointTheme.shadowStrong};
`;

export const HistoryHeader = styled.header`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 26px;
  border-bottom: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};
`;

export const HistoryTitleGroup = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const HistoryIconBox = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid rgba(225, 29, 46, 0.14);
  background: ${sixPointTheme.accentSoft};
  color: ${sixPointTheme.accent};
`;

export const HistoryEyebrow = styled.div`
  margin-bottom: 5px;
  color: ${sixPointTheme.accent};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const HistoryTitle = styled.h2`
  margin: 0;
  color: ${sixPointTheme.textPrimary};
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.05em;
`;

export const HistoryHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const HistoryStatPill = styled.div<{ $tone?: InspectionTone }>`
  height: 38px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border-radius: 9px;
  border: 1px solid ${({ $tone }) => ($tone ? `${getToneColor($tone)}30` : sixPointTheme.hairline)};
  background: ${({ $tone }) => ($tone ? getToneBackground($tone) : sixPointTheme.surfaceMuted)};
  color: ${({ $tone }) => ($tone ? getToneText($tone) : sixPointTheme.textSecondary)};
  font-size: 12px;
  font-weight: 700;
`;

export const HistoryBody = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: clamp(330px, 22vw, 420px) minmax(0, 1fr);
  overflow: hidden;
`;

export const HistorySidebar = styled.aside`
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};
`;

export const HistorySidebarBlock = styled.div`
  flex-shrink: 0;
  padding: 18px;
  border-bottom: 1px solid ${sixPointTheme.hairline};
`;

export const SectionLabel = styled.div`
  margin-bottom: 12px;
  color: ${sixPointTheme.textSecondary};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const HistoryStatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

export const HistoryStatCard = styled.div<{ $tone?: InspectionTone }>`
  padding: 10px 8px;
  border-radius: 9px;
  border: 1px solid ${({ $tone }) => ($tone ? `${getToneColor($tone)}30` : sixPointTheme.hairline)};
  background: ${({ $tone }) => ($tone ? getToneBackground($tone) : sixPointTheme.surfaceMuted)};
  text-align: center;
`;

export const HistoryStatLabel = styled.div<{ $tone?: InspectionTone }>`
  color: ${({ $tone }) => ($tone ? getToneText($tone) : sixPointTheme.textMuted)};
  font-size: 11px;
  font-weight: 700;
`;

export const HistoryStatValue = styled.div<{ $tone?: InspectionTone }>`
  margin-top: 4px;
  color: ${({ $tone }) => ($tone ? getToneText($tone) : sixPointTheme.textPrimary)};
  font-size: 18px;
  font-weight: 700;
`;

export const HistoryLogList = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding: 14px;
  background: ${sixPointTheme.surface};
`;

export const HistoryLogButton = styled.button<{ $active: boolean; $tone: InspectionTone }>`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 16px 16px 16px 18px;
  border-radius: 9px;
  border: 1px solid ${({ $active, $tone }) => ($active ? `${getToneColor($tone)}55` : sixPointTheme.hairline)};
  background: ${({ $active, $tone }) => ($active ? getToneBackground($tone) : sixPointTheme.surface)};
  box-shadow: ${({ $active }) => ($active ? '0 14px 34px rgba(15, 23, 42, 0.08)' : '0 8px 20px rgba(15, 23, 42, 0.035)')};
  cursor: pointer;
  text-align: left;
  transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 14px;
    bottom: 14px;
    width: 4px;
    border-radius: 0 4px 4px 0;
    background: ${({ $tone }) => getToneColor($tone)};
  }
`;

export const HistoryLogTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
`;

export const HistoryLogTime = styled.span`
  color: ${sixPointTheme.textPrimary};
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

export const HistoryLogBadge = styled.span<{ $tone: InspectionTone }>`
  flex-shrink: 0;
  padding: 6px 9px;
  border-radius: 9px;
  border: 1px solid ${({ $tone }) => `${getToneColor($tone)}30`};
  background: ${sixPointTheme.surface};
  color: ${({ $tone }) => getToneText($tone)};
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
`;

export const HistoryLogMeta = styled.div`
  margin-bottom: 8px;
  color: ${sixPointTheme.textSecondary};
  font-size: 13px;
  font-weight: 700;
`;

export const HistoryLogDetail = styled.div`
  color: ${sixPointTheme.textMuted};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;
  word-break: keep-all;
`;

export const HistoryContent = styled.main`
  min-height: 0;
  overflow-y: auto;
  padding: 24px;
  background: ${sixPointTheme.bg};
`;

export const HistoryDetailStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const HistoryCard = styled.section`
  padding: 22px;
  border-radius: 10px;
  border: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};
  box-shadow: 0 18px 46px rgba(15, 23, 42, 0.07);
`;

export const HistorySelectedHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 20px;
`;

export const HistorySelectedInfo = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const HistoryResultIcon = styled.div<{ $tone: InspectionTone }>`
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid ${({ $tone }) => `${getToneColor($tone)}30`};
  background: ${({ $tone }) => getToneBackground($tone)};
  color: ${({ $tone }) => getToneText($tone)};
`;

export const HistorySelectedTitle = styled.h3`
  margin: 0;
  color: ${sixPointTheme.textPrimary};
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.06em;
`;

export const HistorySelectedMeta = styled.p`
  margin: 6px 0 0;
  color: ${sixPointTheme.textSecondary};
  font-size: 14px;
  font-weight: 700;
`;

export const HistoryResultPill = styled.div<{ $tone: InspectionTone }>`
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-radius: 9px;
  border: 1px solid ${({ $tone }) => `${getToneColor($tone)}30`};
  background: ${({ $tone }) => getToneBackground($tone)};
  color: ${({ $tone }) => getToneText($tone)};
  font-size: 13px;
  font-weight: 700;
`;

export const HistoryMetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 18px;
`;

export const HistoryMetaCell = styled.div`
  min-width: 0;
  padding: 14px;
  border-radius: 9px;
  border: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surfaceMuted};
`;

export const HistoryMetaLabel = styled.div`
  margin-bottom: 6px;
  color: ${sixPointTheme.textMuted};
  font-size: 11px;
  font-weight: 700;
`;

export const HistoryMetaValue = styled.div<{ $tone?: InspectionTone }>`
  overflow: hidden;
  color: ${({ $tone }) => ($tone ? getToneText($tone) : sixPointTheme.textPrimary)};
  font-size: 14px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HistoryDetailBox = styled.div<{ $tone: InspectionTone }>`
  padding: 16px 18px;
  border-radius: 9px;
  border: 1px solid ${({ $tone }) => ($tone === 'ng' ? 'rgba(225, 29, 46, 0.14)' : sixPointTheme.hairline)};
  background: ${({ $tone }) => ($tone === 'ng' ? sixPointTheme.accentSoft : sixPointTheme.surfaceMuted)};
`;

export const HistoryDetailTitle = styled.strong`
  display: block;
  margin-bottom: 7px;
  color: ${sixPointTheme.textPrimary};
  font-size: 14px;
  font-weight: 700;
`;

export const HistoryDetailText = styled.p`
  margin: 0;
  color: ${sixPointTheme.textSecondary};
  font-weight: 700;
  line-height: 1.6;
  word-break: keep-all;
`;

export const ImageSectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
`;

export const ImageSectionEyebrow = styled.div`
  margin-bottom: 6px;
  color: ${sixPointTheme.accent};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const ImageSectionTitle = styled.h4`
  margin: 0;
  color: ${sixPointTheme.textPrimary};
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.05em;
`;

export const ImageSectionHint = styled.span`
  color: ${sixPointTheme.textSecondary};
  font-size: 12px;
  font-weight: 700;
`;

export const HistoryImageButton = styled.button<{ $imgUrl: string; $contain?: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  padding: 0;
  border-radius: 9px;
  border: 1px solid ${sixPointTheme.hairline};
  background-color: ${sixPointTheme.surface};
  background-image: ${({ $imgUrl }) => `url("${$imgUrl}")`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: ${({ $contain }) => ($contain ? 'contain' : 'cover')};
  box-shadow: inset 0 0 0 1px rgba(17, 24, 39, 0.02);
  cursor: pointer;
`;

export const CornerImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;
`;

export const ImageChip = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border-radius: 9px;
  border: 1px solid ${sixPointTheme.hairline};
  background: rgba(255, 255, 255, 0.92);
  color: ${sixPointTheme.textPrimary};
  font-size: 12px;
  font-weight: 700;
`;

export const ImageChipCode = styled.strong`
  color: ${sixPointTheme.accent};
  font-weight: 700;
`;

export const ImageZoomChip = styled.span`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px;
  border-radius: 9px;
  border: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};
  color: ${sixPointTheme.textPrimary};
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
`;

export const HistoryEmptyPanel = styled.div`
  height: 100%;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HistoryEmptyCard = styled.div`
  width: min(440px, 100%);
  padding: 42px;
  border-radius: 10px;
  border: 1px solid ${sixPointTheme.hairline};
  background: ${sixPointTheme.surface};
  box-shadow: 0 18px 46px rgba(15, 23, 42, 0.07);
  text-align: center;
`;

export const HistoryEmptyIcon = styled.div`
  width: 74px;
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  border-radius: 10px;
  border: 1px solid rgba(225, 29, 46, 0.14);
  background: ${sixPointTheme.accentSoft};
  color: ${sixPointTheme.accent};
`;

export const HistoryEmptyTitle = styled.h3`
  margin: 0 0 10px;
  color: ${sixPointTheme.textPrimary};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.05em;
`;

export const HistoryEmptyText = styled.p`
  margin: 0;
  color: ${sixPointTheme.textSecondary};
  font-weight: 700;
  line-height: 1.6;
  word-break: keep-all;
`;

export const DatePickerRoot = styled.div`
  position: relative;
`;

export const DatePickerTrigger = styled.button<{ $open: boolean }>`
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border-radius: 9px;
  border: 1px solid ${({ $open }) => ($open ? sixPointTheme.accent : '#E2E8F0')};
  background: ${sixPointTheme.surface};
  color: ${sixPointTheme.textPrimary};
  box-shadow: ${({ $open }) => ($open ? '0 4px 12px rgba(225, 29, 46, 0.10)' : '0 2px 4px rgba(0, 0, 0, 0.02)')};
  cursor: pointer;
`;

export const DatePickerValue = styled.span`
  flex: 1;
  overflow: hidden;
  color: ${sixPointTheme.textPrimary};
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DatePickerChevron = styled.span<{ $open: boolean }>`
  display: inline-flex;
  color: ${sixPointTheme.textSecondary};
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.18s ease;
`;

export const CalendarPanel = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 100;
  width: 100%;
  padding: 16px;
  border-radius: 9px;
  border: 1px solid ${sixPointTheme.border};
  background: ${sixPointTheme.surface};
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.12);
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const CalendarNavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${sixPointTheme.textPrimary};
  cursor: pointer;

  &:hover {
    background: ${sixPointTheme.surfaceMuted};
  }
`;

export const CalendarMonthLabel = styled.span`
  color: ${sixPointTheme.textPrimary};
  font-size: 16px;
  font-weight: 700;
`;

export const CalendarWeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
  margin-bottom: 8px;
`;

export const CalendarDayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
`;

export const CalendarWeekName = styled.div<{ $weekend?: 'sun' | 'sat' }>`
  color: ${({ $weekend }) => ($weekend === 'sun' ? sixPointTheme.danger : $weekend === 'sat' ? sixPointTheme.accent : sixPointTheme.textSecondary)};
  font-size: 13px;
  font-weight: 700;
  text-align: center;
`;

export const CalendarEmptyCell = styled.div`
  aspect-ratio: 1;
`;

export const CalendarDayButton = styled.button<{ $selected: boolean; $today: boolean }>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  background: ${({ $selected, $today }) => ($selected ? sixPointTheme.accent : $today ? sixPointTheme.accentSoft : 'transparent')};
  color: ${({ $selected, $today }) => ($selected ? '#FFFFFF' : $today ? sixPointTheme.accent : sixPointTheme.textPrimary)};
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ $selected, $today }) => ($selected || $today ? 700 : 600)};

  &:hover {
    background: ${({ $selected }) => ($selected ? sixPointTheme.accent : sixPointTheme.surfaceMuted)};
  }
`;

export const EmptyCloseButton = styled(ModalCloseButton)`
  position: absolute;
  top: 14px;
  right: 14px;
`;

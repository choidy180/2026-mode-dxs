import styled, { createGlobalStyle } from 'styled-components';

import type { InspectionTone, InspectionViewType } from '@/types/glassGapInspection';
import {
  getToneBackground,
  getToneColor,
  getToneText,
  glassGapTheme,
} from '@/styles/glassGapInspection.theme';

export const GlassGapGlobalStyles = createGlobalStyle`
  @keyframes glass-gap-float {
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

  @keyframes glass-gap-connector-flow {
    to {
      stroke-dashoffset: -32;
    }
  }

  .glass-gap-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .glass-gap-scrollbar::-webkit-scrollbar-track {
    background: #F8FAFC;
  }

  .glass-gap-scrollbar::-webkit-scrollbar-thumb {
    background: #D0D5DD;
    border-radius: 4px;
  }

  .glass-gap-scrollbar::-webkit-scrollbar-thumb:hover {
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
  background: ${glassGapTheme.bg};
  color: ${glassGapTheme.textPrimary};
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
  background: ${glassGapTheme.surface};
  box-shadow: ${glassGapTheme.shadow};

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
  color: ${glassGapTheme.textSecondary};
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
  border: 1px solid ${glassGapTheme.border};
  background: rgba(255, 255, 255, 0.76);
  color: ${glassGapTheme.textSecondary};
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease, color 0.18s ease;

  &:hover {
    border-color: rgba(225, 29, 46, 0.28);
    background: ${glassGapTheme.accentSoft};
    color: ${glassGapTheme.accent};
  }
`;

export const InfoTableCard = styled.section`
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surface};
  box-shadow: ${glassGapTheme.shadow};
`;

export const InfoTableHeader = styled.div`
  height: 34%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-bottom: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surfaceMuted};
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
  border-right: ${({ $last }) => ($last ? 'none' : `1px solid ${glassGapTheme.hairline}`)};
  color: ${glassGapTheme.textSecondary};
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
  border-right: ${({ $last }) => ($last ? 'none' : `1px solid ${glassGapTheme.hairline}`)};
`;

export const InfoValue = styled.span<{ $accent?: boolean }>`
  max-width: 100%;
  overflow: hidden;
  color: ${({ $accent }) => ($accent ? glassGapTheme.accent : glassGapTheme.textPrimary)};
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
  border: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surface};
  box-shadow: ${glassGapTheme.shadow};
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
      return glassGapTheme.textPrimary;
    }

    if ($tone) {
      return `${getToneColor($tone)}33`;
    }

    return glassGapTheme.border;
  }};
  background: ${({ $tone }) => ($tone ? getToneBackground($tone) : glassGapTheme.surface)};
  color: ${({ $tone }) => ($tone ? getToneColor($tone) : glassGapTheme.textPrimary)};
  cursor: pointer;
  transition: border-color 0.18s ease, transform 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $tone }) => ($tone ? getToneColor($tone) : glassGapTheme.textPrimary)};
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
  border: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surface};
  color: ${glassGapTheme.textPrimary};
  box-shadow: ${glassGapTheme.shadow};
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease, transform 0.18s ease;

  svg {
    color: ${glassGapTheme.textSecondary};
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(225, 29, 46, 0.30);
    color: ${glassGapTheme.accent};
    box-shadow: 0 22px 54px rgba(15, 23, 42, 0.13);
  }
`;

export const TypeButtonLabel = styled.span`
  color: ${glassGapTheme.accent};
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
  border: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surface};
  color: ${glassGapTheme.textPrimary};
  box-shadow: ${glassGapTheme.shadow};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.02em;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease, transform 0.18s ease;

  svg {
    color: ${glassGapTheme.accent};
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(225, 29, 46, 0.30);
    color: ${glassGapTheme.accent};
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
  border: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surface};
  box-shadow: ${glassGapTheme.shadowStrong};
`;

export const MainPanelHeader = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: clamp(10px, 0.7vw, 14px) 20px;
  border-bottom: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surface};
`;

export const MainPanelEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${glassGapTheme.accent};
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
  background: ${({ $isDefect }) => ($isDefect ? glassGapTheme.status.ng.bg : glassGapTheme.status.ok.bg)};
  color: ${({ $isDefect }) => ($isDefect ? glassGapTheme.status.ng.text : glassGapTheme.status.ok.text)};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const LiveDot = styled.span<{ $isDefect: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $isDefect }) => ($isDefect ? glassGapTheme.danger : glassGapTheme.success)};
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
  border: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surface};
`;

export const StageSplitGrid = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(190px, 0.27fr) minmax(0, 1fr) minmax(190px, 0.27fr);
  gap: clamp(10px, 0.8vw, 16px);
  padding: clamp(10px, 0.8vw, 16px);

  @media (min-width: 2200px) {
    grid-template-columns: minmax(250px, 0.30fr) minmax(0, 1fr) minmax(250px, 0.30fr);
  }
`;

export const StageRightStackGrid = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(620px, 36vw, 900px);
  grid-template-rows: minmax(0, 1fr);
  gap: clamp(12px, 0.9vw, 18px);
  padding: clamp(10px, 0.8vw, 16px);

  @media (min-width: 2200px) {
    grid-template-columns: minmax(0, 1fr) clamp(840px, 34vw, 1040px);
  }

  @media (max-width: 1800px) {
    grid-template-columns: minmax(0, 1fr) clamp(560px, 36vw, 740px);
  }
`;

export const CameraRail = styled.div`
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: clamp(10px, 0.8vw, 14px);
`;

export const CameraStackGrid = styled.div`
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: 1 / 1;
  align-self: center;
  justify-self: stretch;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: clamp(10px, 0.8vw, 14px);
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
  border: ${({ $solo }) => ($solo ? 'none' : `1px solid ${glassGapTheme.hairline}`)};
  background: ${glassGapTheme.surface};
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
  padding: 0;
  border-radius: 9px;
  border: 1px solid ${({ $tone, $active }) => ($active ? getToneColor($tone) : $tone === 'wait' ? glassGapTheme.hairline : `${getToneColor($tone)}40`)};
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
  border: 1px solid ${glassGapTheme.hairline};
  background: rgba(255, 255, 255, 0.94);
  color: ${glassGapTheme.textPrimary};
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.10);
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CameraTileZoom = styled.span`
  width: 31px;
  height: 31px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  border: 1px solid rgba(225, 29, 46, 0.20);
  background: rgba(255, 255, 255, 0.94);
  color: ${glassGapTheme.accent};
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.10);
`;

export const NoImageText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${glassGapTheme.textMuted};
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
  color: ${glassGapTheme.textSecondary};
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
  border: 1px solid ${glassGapTheme.border};
  background: ${glassGapTheme.surface};
  box-shadow: ${glassGapTheme.shadowStrong};
`;

export const ModalHeader = styled.header`
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 24px;
  border-bottom: 1px solid ${glassGapTheme.hairline};
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: ${glassGapTheme.textPrimary};
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.05em;
`;

export const ModalDescription = styled.p`
  margin: 6px 0 0;
  color: ${glassGapTheme.textSecondary};
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
  border: 1px solid ${glassGapTheme.border};
  background: ${glassGapTheme.surface};
  color: ${glassGapTheme.textSecondary};
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease, color 0.18s ease;

  &:hover {
    border-color: rgba(225, 29, 46, 0.25);
    background: ${glassGapTheme.accentSoft};
    color: ${glassGapTheme.accent};
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
  border: 1px solid ${({ $active }) => ($active ? glassGapTheme.accent : glassGapTheme.hairline)};
  background: ${glassGapTheme.surface};
  box-shadow: ${({ $active }) => ($active ? '0 24px 58px rgba(225, 29, 46, 0.12)' : '0 16px 38px rgba(15, 23, 42, 0.07)')};
  cursor: pointer;
  text-align: left;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${glassGapTheme.accent};
    box-shadow: 0 24px 58px rgba(15, 23, 42, 0.14);
  }
`;

export const TypeOptionPreview = styled.div<{ $variant: InspectionViewType }>`
  height: 184px;
  display: grid;
  grid-template-columns: ${({ $variant }) => {
    if ($variant === 'split') {
      return '0.55fr 1fr 0.55fr';
    }

    if ($variant === 'rightStack') {
      return '1fr 0.72fr';
    }

    return '1fr';
  }};
  gap: 10px;
  margin-bottom: 14px;
  padding: 12px;
  border-radius: 9px;
  border: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surfaceMuted};
`;

export const TypePreviewRail = styled.div`
  display: grid;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

export const TypePreviewStack = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

export const TypePreviewBlock = styled.div<{ $main?: boolean; $accent?: boolean }>`
  min-width: 0;
  min-height: 0;
  border-radius: ${({ $main }) => ($main ? '10px' : '8px')};
  border: 1px solid ${({ $accent }) => ($accent ? 'rgba(225, 29, 46, 0.32)' : glassGapTheme.hairline)};
  background: ${({ $main, $accent }) => ($main ? glassGapTheme.surface : $accent ? glassGapTheme.accentSoft : glassGapTheme.surface)};
  box-shadow: ${({ $main }) => ($main ? '0 12px 28px rgba(15, 23, 42, 0.08)' : 'none')};
`;

export const TypeOptionName = styled.div`
  color: ${glassGapTheme.textPrimary};
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.04em;
`;

export const TypeOptionText = styled.p`
  margin: 6px 0 0;
  color: ${glassGapTheme.textSecondary};
  font-size: 13px;
  font-weight: 700;
  line-height: 1.42;
  word-break: keep-all;
`;

export const ImageModalShell = styled.div`
  width: min(1400px, 92vw);
  height: min(860px, 90dvh);
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px;
  border-radius: 10px;
  border: 1px solid ${glassGapTheme.border};
  background: ${glassGapTheme.surface};
  box-shadow: ${glassGapTheme.shadowStrong};
`;

export const ImageModalTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const ImageModalTitle = styled.div`
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: ${glassGapTheme.textPrimary};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.04em;
`;

export const ImageModalBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9px;
  border: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surfaceMuted};
`;

export const ImageModalImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

export const SoundPermissionShell = styled.div`
  width: min(420px, 90vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  padding: 42px;
  border-radius: 10px;
  border: 1px solid ${glassGapTheme.border};
  background: ${glassGapTheme.surface};
  box-shadow: ${glassGapTheme.shadowStrong};
  text-align: center;
`;

export const SoundIconBadge = styled.div`
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${glassGapTheme.accentSoft};
  color: ${glassGapTheme.danger};
`;

export const SoundTitle = styled.h2`
  margin: 0 0 10px;
  color: ${glassGapTheme.textPrimary};
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.04em;
`;

export const SoundText = styled.p`
  margin: 0;
  color: ${glassGapTheme.textSecondary};
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
  background: ${glassGapTheme.danger};
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
  border: 1px solid ${glassGapTheme.border};
  background: ${glassGapTheme.surface};
  box-shadow: ${glassGapTheme.shadowStrong};
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
  background: ${glassGapTheme.accentSoft};
  color: ${glassGapTheme.accent};
  animation: glass-gap-float 3s ease-in-out infinite;
`;

export const EmptyTitle = styled.h2`
  margin: 0 0 12px;
  color: ${glassGapTheme.textPrimary};
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.04em;
`;

export const EmptyText = styled.p`
  margin: 0 0 30px;
  color: ${glassGapTheme.textSecondary};
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
  border: 1px solid ${glassGapTheme.border};
  background: ${glassGapTheme.surface};
  color: ${glassGapTheme.textPrimary};
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  transition: border-color 0.18s ease, color 0.18s ease;

  &:hover {
    border-color: ${glassGapTheme.accent};
    color: ${glassGapTheme.accent};
  }
`;

export const HistoryModalShell = styled.div`
  width: calc(100vw - 40px);
  height: calc(100dvh - 28px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid ${glassGapTheme.border};
  background: ${glassGapTheme.surface};
  box-shadow: ${glassGapTheme.shadowStrong};
`;

export const HistoryHeader = styled.header`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 26px;
  border-bottom: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surface};
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
  background: ${glassGapTheme.accentSoft};
  color: ${glassGapTheme.accent};
`;

export const HistoryEyebrow = styled.div`
  margin-bottom: 5px;
  color: ${glassGapTheme.accent};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const HistoryTitle = styled.h2`
  margin: 0;
  color: ${glassGapTheme.textPrimary};
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
  border: 1px solid ${({ $tone }) => ($tone ? `${getToneColor($tone)}30` : glassGapTheme.hairline)};
  background: ${({ $tone }) => ($tone ? getToneBackground($tone) : glassGapTheme.surfaceMuted)};
  color: ${({ $tone }) => ($tone ? getToneText($tone) : glassGapTheme.textSecondary)};
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
  border-right: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surface};
`;

export const HistorySidebarBlock = styled.div`
  flex-shrink: 0;
  padding: 18px;
  border-bottom: 1px solid ${glassGapTheme.hairline};
`;

export const SectionLabel = styled.div`
  margin-bottom: 12px;
  color: ${glassGapTheme.textSecondary};
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
  border: 1px solid ${({ $tone }) => ($tone ? `${getToneColor($tone)}30` : glassGapTheme.hairline)};
  background: ${({ $tone }) => ($tone ? getToneBackground($tone) : glassGapTheme.surfaceMuted)};
  text-align: center;
`;

export const HistoryStatLabel = styled.div<{ $tone?: InspectionTone }>`
  color: ${({ $tone }) => ($tone ? getToneText($tone) : glassGapTheme.textMuted)};
  font-size: 11px;
  font-weight: 700;
`;

export const HistoryStatValue = styled.div<{ $tone?: InspectionTone }>`
  margin-top: 4px;
  color: ${({ $tone }) => ($tone ? getToneText($tone) : glassGapTheme.textPrimary)};
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
  background: ${glassGapTheme.surface};
`;

export const HistoryLogButton = styled.button<{ $active: boolean; $tone: InspectionTone }>`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 16px 16px 16px 18px;
  border-radius: 9px;
  border: 1px solid ${({ $active, $tone }) => ($active ? `${getToneColor($tone)}55` : glassGapTheme.hairline)};
  background: ${({ $active, $tone }) => ($active ? getToneBackground($tone) : glassGapTheme.surface)};
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
  color: ${glassGapTheme.textPrimary};
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

export const HistoryLogBadge = styled.span<{ $tone: InspectionTone }>`
  flex-shrink: 0;
  padding: 6px 9px;
  border-radius: 9px;
  border: 1px solid ${({ $tone }) => `${getToneColor($tone)}30`};
  background: ${glassGapTheme.surface};
  color: ${({ $tone }) => getToneText($tone)};
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
`;

export const HistoryLogMeta = styled.div`
  margin-bottom: 8px;
  color: ${glassGapTheme.textSecondary};
  font-size: 13px;
  font-weight: 700;
`;

export const HistoryLogDetail = styled.div`
  color: ${glassGapTheme.textMuted};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;
  word-break: keep-all;
`;

export const HistoryContent = styled.main`
  min-height: 0;
  overflow-y: auto;
  padding: 24px;
  background: ${glassGapTheme.bg};
`;

export const HistoryDetailStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const HistoryCard = styled.section`
  padding: 22px;
  border-radius: 10px;
  border: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surface};
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
  color: ${glassGapTheme.textPrimary};
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.06em;
`;

export const HistorySelectedMeta = styled.p`
  margin: 6px 0 0;
  color: ${glassGapTheme.textSecondary};
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
  border: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surfaceMuted};
`;

export const HistoryMetaLabel = styled.div`
  margin-bottom: 6px;
  color: ${glassGapTheme.textMuted};
  font-size: 11px;
  font-weight: 700;
`;

export const HistoryMetaValue = styled.div<{ $tone?: InspectionTone }>`
  overflow: hidden;
  color: ${({ $tone }) => ($tone ? getToneText($tone) : glassGapTheme.textPrimary)};
  font-size: 14px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HistoryDetailBox = styled.div<{ $tone: InspectionTone }>`
  padding: 16px 18px;
  border-radius: 9px;
  border: 1px solid ${({ $tone }) => ($tone === 'ng' ? 'rgba(225, 29, 46, 0.14)' : glassGapTheme.hairline)};
  background: ${({ $tone }) => ($tone === 'ng' ? glassGapTheme.accentSoft : glassGapTheme.surfaceMuted)};
`;

export const HistoryDetailTitle = styled.strong`
  display: block;
  margin-bottom: 7px;
  color: ${glassGapTheme.textPrimary};
  font-size: 14px;
  font-weight: 700;
`;

export const HistoryDetailText = styled.p`
  margin: 0;
  color: ${glassGapTheme.textSecondary};
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
  color: ${glassGapTheme.accent};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const ImageSectionTitle = styled.h4`
  margin: 0;
  color: ${glassGapTheme.textPrimary};
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.05em;
`;

export const ImageSectionHint = styled.span`
  color: ${glassGapTheme.textSecondary};
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
  border: 1px solid ${glassGapTheme.hairline};
  background-color: ${glassGapTheme.surface};
  background-image: ${({ $imgUrl }) => `url("${$imgUrl}")`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: ${({ $contain }) => ($contain ? 'contain' : 'cover')};
  box-shadow: inset 0 0 0 1px rgba(17, 24, 39, 0.02);
  cursor: pointer;
`;

export const CornerImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  border: 1px solid ${glassGapTheme.hairline};
  background: rgba(255, 255, 255, 0.92);
  color: ${glassGapTheme.textPrimary};
  font-size: 12px;
  font-weight: 700;
`;

export const ImageChipCode = styled.strong`
  color: ${glassGapTheme.accent};
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
  border: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surface};
  color: ${glassGapTheme.textPrimary};
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
  border: 1px solid ${glassGapTheme.hairline};
  background: ${glassGapTheme.surface};
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
  background: ${glassGapTheme.accentSoft};
  color: ${glassGapTheme.accent};
`;

export const HistoryEmptyTitle = styled.h3`
  margin: 0 0 10px;
  color: ${glassGapTheme.textPrimary};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.05em;
`;

export const HistoryEmptyText = styled.p`
  margin: 0;
  color: ${glassGapTheme.textSecondary};
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
  border: 1px solid ${({ $open }) => ($open ? glassGapTheme.accent : '#E2E8F0')};
  background: ${glassGapTheme.surface};
  color: ${glassGapTheme.textPrimary};
  box-shadow: ${({ $open }) => ($open ? '0 4px 12px rgba(225, 29, 46, 0.10)' : '0 2px 4px rgba(0, 0, 0, 0.02)')};
  cursor: pointer;
`;

export const DatePickerValue = styled.span`
  flex: 1;
  overflow: hidden;
  color: ${glassGapTheme.textPrimary};
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DatePickerChevron = styled.span<{ $open: boolean }>`
  display: inline-flex;
  color: ${glassGapTheme.textSecondary};
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
  border: 1px solid ${glassGapTheme.border};
  background: ${glassGapTheme.surface};
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
  color: ${glassGapTheme.textPrimary};
  cursor: pointer;

  &:hover {
    background: ${glassGapTheme.surfaceMuted};
  }
`;

export const CalendarMonthLabel = styled.span`
  color: ${glassGapTheme.textPrimary};
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
  color: ${({ $weekend }) => ($weekend === 'sun' ? glassGapTheme.danger : $weekend === 'sat' ? glassGapTheme.accent : glassGapTheme.textSecondary)};
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
  background: ${({ $selected, $today }) => ($selected ? glassGapTheme.accent : $today ? glassGapTheme.accentSoft : 'transparent')};
  color: ${({ $selected, $today }) => ($selected ? '#FFFFFF' : $today ? glassGapTheme.accent : glassGapTheme.textPrimary)};
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ $selected, $today }) => ($selected || $today ? 700 : 600)};

  &:hover {
    background: ${({ $selected }) => ($selected ? glassGapTheme.accent : glassGapTheme.surfaceMuted)};
  }
`;

export const EmptyCloseButton = styled(ModalCloseButton)`
  position: absolute;
  top: 14px;
  right: 14px;
`;

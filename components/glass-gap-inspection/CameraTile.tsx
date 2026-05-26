'use client';

import type { MouseEvent } from 'react';
import { ZoomIn } from 'lucide-react';

import type { CornerItem } from '@/types/glassGapInspection';
import { formatStatusLabel, getInspectionTone } from '@/utils/glassGapInspection';
import {
  CameraTileButton,
  CameraTileCode,
  CameraTileFooter,
  CameraTileHeader,
  CameraTileName,
  CameraTileStatus,
  CameraTileZoom,
  NoImageText,
} from '@/styles/glassGapInspection.styles';

interface CameraTileProps {
  active: boolean;
  item: CornerItem;
  onImageClick: (title: string, url: string) => void;
  onSetActive: (key: CornerItem['key'] | null) => void;
  registerRef: (key: CornerItem['key'], node: HTMLButtonElement | null) => void;
}

export default function CameraTile({
  active,
  item,
  onImageClick,
  onSetActive,
  registerRef,
}: CameraTileProps) {
  const tone = getInspectionTone(item.status);

  const handleZoomClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!item.imgUrl) return;

    onImageClick(`${item.title} (${item.camera})`, item.imgUrl);
  };

  return (
    <CameraTileButton
      ref={(node) => registerRef(item.key, node)}
      type="button"
      $active={active}
      $focusX={item.anchor.x}
      $focusY={item.anchor.y}
      $imgUrl={item.imgUrl}
      $tone={tone}
      aria-label={`${item.title} 카메라 확대 이미지 보기`}
      onClick={handleZoomClick}
      onMouseEnter={() => onSetActive(item.key)}
      onMouseLeave={() => onSetActive(null)}
    >
      {!item.imgUrl && <NoImageText>이미지 대기</NoImageText>}

      <CameraTileHeader>
        <CameraTileCode $tone={tone}>{item.code}</CameraTileCode>
        <CameraTileStatus $tone={tone}>{formatStatusLabel(item.status)}</CameraTileStatus>
      </CameraTileHeader>

      <CameraTileFooter>
        <CameraTileName>
          {item.camera} · {item.title}
        </CameraTileName>

        <CameraTileZoom>
          <ZoomIn size={15} strokeWidth={2.5} />
        </CameraTileZoom>
      </CameraTileFooter>
    </CameraTileButton>
  );
}
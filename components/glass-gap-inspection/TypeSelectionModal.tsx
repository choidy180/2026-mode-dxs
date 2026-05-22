'use client';

import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

import { TYPE_OPTIONS } from '@/constants/glassGapInspection';
import type { InspectionViewType } from '@/types/glassGapInspection';
import {
  ModalBackdrop,
  ModalCloseButton,
  ModalDescription,
  ModalHeader,
  ModalShell,
  ModalTitle,
  TypeOptionCard,
  TypeOptionGrid,
  TypeOptionName,
  TypeOptionPreview,
  TypeOptionText,
  TypePreviewBlock,
  TypePreviewRail,
  TypePreviewStack,
} from '@/styles/glassGapInspection.styles';

interface TypeSelectionModalProps {
  currentType: InspectionViewType;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: InspectionViewType) => void;
}

function TypePreviewGraphic({ variant }: { variant: InspectionViewType }) {
  if (variant === 'split') {
    return (
      <>
        <TypePreviewRail>
          <TypePreviewBlock $accent />
          <TypePreviewBlock />
        </TypePreviewRail>
        <TypePreviewBlock $main />
        <TypePreviewRail>
          <TypePreviewBlock />
          <TypePreviewBlock $accent />
        </TypePreviewRail>
      </>
    );
  }

  if (variant === 'rightStack') {
    return (
      <>
        <TypePreviewBlock $main />
        <TypePreviewStack>
          <TypePreviewBlock $accent />
          <TypePreviewBlock />
          <TypePreviewBlock />
          <TypePreviewBlock $accent />
        </TypePreviewStack>
      </>
    );
  }

  return <TypePreviewBlock $main $accent />;
}

export default function TypeSelectionModal({
  currentType,
  isOpen,
  onClose,
  onSelect,
}: TypeSelectionModalProps) {
  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <ModalBackdrop onClick={onClose}>
      <ModalShell onClick={(event) => event.stopPropagation()}>
        <ModalHeader>
          <div>
            <ModalTitle>검사 화면 TYPE 선택</ModalTitle>
            <ModalDescription>
              선택한 타입에 맞춰 메인 검사 화면 배치가 즉시 변경됩니다.
            </ModalDescription>
          </div>
          <ModalCloseButton type="button" aria-label="TYPE 선택 닫기" onClick={onClose}>
            <X size={18} strokeWidth={2.4} />
          </ModalCloseButton>
        </ModalHeader>
        <TypeOptionGrid>
          {TYPE_OPTIONS.map((option) => (
            <TypeOptionCard
              key={option.type}
              type="button"
              $active={currentType === option.type}
              onClick={() => onSelect(option.type)}
            >
              <TypeOptionPreview $variant={option.type}>
                <TypePreviewGraphic variant={option.type} />
              </TypeOptionPreview>
              <TypeOptionName>{option.name}</TypeOptionName>
              <TypeOptionText>{option.text}</TypeOptionText>
            </TypeOptionCard>
          ))}
        </TypeOptionGrid>
      </ModalShell>
    </ModalBackdrop>,
    document.body,
  );
}

'use client';

import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

import { TYPE_OPTIONS } from '@/constants/sixPointInspection';
import type { InspectionViewType } from '@/types/sixPointInspection';
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
} from '@/styles/sixPointInspection.styles';

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
          <TypePreviewBlock $accent />
        </TypePreviewRail>
        <TypePreviewBlock $main />
        <TypePreviewRail>
          <TypePreviewBlock />
          <TypePreviewBlock $accent />
          <TypePreviewBlock />
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
              6개 확대 박스 기준으로 큰 이미지, 상하 분할, 오른쪽 스택 배치를 전환합니다.
            </ModalDescription>
          </div>
          <ModalCloseButton type="button" onClick={onClose} aria-label="TYPE 선택 닫기">
            <X size={18} strokeWidth={2.4} />
          </ModalCloseButton>
        </ModalHeader>

        <TypeOptionGrid>
          {TYPE_OPTIONS.map((option) => {
            const active = currentType === option.type;

            return (
              <TypeOptionCard
                key={option.type}
                type="button"
                $active={active}
                onClick={() => onSelect(option.type)}
              >
                <TypeOptionPreview $variant={option.type}>
                  <TypePreviewGraphic variant={option.type} />
                </TypeOptionPreview>
                <TypeOptionName>{option.name}</TypeOptionName>
                <TypeOptionText>{option.text}</TypeOptionText>
              </TypeOptionCard>
            );
          })}
        </TypeOptionGrid>
      </ModalShell>
    </ModalBackdrop>,
    document.body
  );
}

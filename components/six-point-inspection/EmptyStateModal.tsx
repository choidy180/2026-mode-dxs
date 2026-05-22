'use client';

import { ClipboardX, Home, X } from 'lucide-react';

import {
  EmptyCloseButton,
  EmptyIconBadge,
  EmptyStateBackdrop,
  EmptyStateCard,
  EmptyText,
  EmptyTitle,
  SecondaryButton,
} from '@/styles/sixPointInspection.styles';

interface EmptyStateModalProps {
  onClose: () => void;
  onNavigateHome: () => void;
}

export default function EmptyStateModal({
  onClose,
  onNavigateHome,
}: EmptyStateModalProps) {
  return (
    <EmptyStateBackdrop>
      <EmptyStateCard>
        <EmptyCloseButton type="button" aria-label="데이터 없음 닫기" onClick={onClose}>
          <X size={22} />
        </EmptyCloseButton>
        <EmptyIconBadge>
          <ClipboardX size={46} strokeWidth={1.7} />
        </EmptyIconBadge>
        <EmptyTitle>금일 검사 데이터가 없습니다</EmptyTitle>
        <EmptyText>
          생산 라인이 가동 중인지 확인하거나,
          <br />
          잠시 후 다시 시도해 주세요.
        </EmptyText>
        <SecondaryButton type="button" onClick={onNavigateHome}>
          <Home size={18} />
          메인 화면으로 이동
        </SecondaryButton>
      </EmptyStateCard>
    </EmptyStateBackdrop>
  );
}

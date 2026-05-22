'use client';

import { ClipboardX, Home, X } from 'lucide-react';
import {
    EmptyIconBox,
    EmptyStateBackdrop,
    EmptyStateCard,
    EmptyText,
    EmptyTitle,
    IconButton,
    PrimaryButton,
} from '@/styles/gasketCheck.styles';

interface EmptyStateModalProps {
    onClose: () => void;
    onNavigateHome: () => void;
}

export function EmptyStateModal({
    onClose,
    onNavigateHome,
}: EmptyStateModalProps) {
    return (
        <EmptyStateBackdrop>
            <EmptyStateCard>
                <IconButton
                    type="button"
                    onClick={onClose}
                    aria-label="빈 상태 닫기"
                    style={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                    }}
                >
                    <X size={18} />
                </IconButton>

                <EmptyIconBox>
                    <ClipboardX size={40} strokeWidth={1.8} />
                </EmptyIconBox>

                <EmptyTitle>금일 검사 데이터가 없습니다</EmptyTitle>
                <EmptyText>
                    생산 라인이 가동 중인지 확인하거나,<br />잠시 후 다시 시도해 주세요.
                </EmptyText>

                <PrimaryButton type="button" onClick={onNavigateHome}>
                    <Home size={18} />
                    메인 화면으로 이동
                </PrimaryButton>
            </EmptyStateCard>
        </EmptyStateBackdrop>
    );
}

'use client';

import { createPortal } from 'react-dom';
import { Siren, Volume2 } from 'lucide-react';
import { filmTheme } from '@/styles/filmAttachmentCheck.theme';
import {
    ModalBackdrop,
    PermissionCard,
    PermissionIcon,
    PrimaryButton,
} from '@/styles/filmAttachmentCheck.styles';

interface SoundPermissionModalProps {
    isOpen: boolean;
    onConfirm: () => void;
}

export function SoundPermissionModal({
    isOpen,
    onConfirm,
}: SoundPermissionModalProps) {
    if (!isOpen || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <ModalBackdrop>
            <PermissionCard>
                <PermissionIcon>
                    <Siren size={38} />
                </PermissionIcon>

                <div>
                    <h2 style={{
                        margin: '0 0 10px 0',
                        color: filmTheme.textPrimary,
                        fontSize: '22px',
                        fontWeight: 700,
                    }}>
                        불량 알림 권한 요청
                    </h2>
                    <p style={{
                        margin: 0,
                        color: filmTheme.textSecondary,
                        fontWeight: 700,
                        lineHeight: 1.55,
                    }}>
                        부착 불량이 감지되었습니다.<br />경고음을 켜시겠습니까?
                    </p>
                </div>

                <PrimaryButton type="button" onClick={onConfirm}>
                    <Volume2 size={18} />
                    경고음 켜기
                </PrimaryButton>
            </PermissionCard>
        </ModalBackdrop>,
        document.body
    );
}

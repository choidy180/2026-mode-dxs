'use client';

import { Siren, Volume2 } from 'lucide-react';
import { createPortal } from 'react-dom';

import {
  ModalBackdrop,
  PrimaryDangerButton,
  SoundIconBadge,
  SoundPermissionShell,
  SoundText,
  SoundTitle,
} from '@/styles/sixPointInspection.styles';

interface SoundPermissionModalProps {
  onConfirm: () => void;
}

export default function SoundPermissionModal({ onConfirm }: SoundPermissionModalProps) {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <ModalBackdrop>
      <SoundPermissionShell>
        <SoundIconBadge>
          <Siren size={44} />
        </SoundIconBadge>
        <div>
          <SoundTitle>불량 알림 권한 요청</SoundTitle>
          <SoundText>
            심각한 유격 불량이 감지되었습니다.
            <br />
            경고음을 켜시겠습니까?
          </SoundText>
        </div>
        <PrimaryDangerButton type="button" onClick={onConfirm}>
          <Volume2 size={20} />
          네, 경고음 켜기
        </PrimaryDangerButton>
      </SoundPermissionShell>
    </ModalBackdrop>,
    document.body,
  );
}

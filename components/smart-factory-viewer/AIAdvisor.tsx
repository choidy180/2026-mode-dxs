'use client';

import React, { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';
import type { UnitData, ViewerUiMode } from '@/types/smartFactoryViewer';
import {
  AdvisorBody,
  AdvisorCard,
  AdvisorEyebrow,
  AdvisorHeader,
  AdvisorIcon,
  AdvisorMessage,
  AdvisorMeta,
  AdvisorTitle,
  BlinkingCursor,
  WaveBar,
  WaveStack,
} from '@/styles/smartFactoryViewer.styles';

interface AIAdvisorProps {
  errors: UnitData[];
  mode: ViewerUiMode;
  compact?: boolean;
}

export const AIAdvisor = React.memo(({ errors, mode, compact }: AIAdvisorProps) => {
  const [message, setMessage] = useState('');
  const [displayMessage, setDisplayMessage] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (errors.length > 0) {
      const target = errors[0];
      setMessage(`${target.name} 이상 감지 (${target.problem}). ${target.solution ?? '담당자 확인 필요.'}`);
    } else {
      setMessage('모든 시스템 정상 가동 중. 특이사항 없습니다.');
    }

    setIndex(0);
    setDisplayMessage('');
  }, [errors]);

  useEffect(() => {
    if (index >= message.length) return;

    const timeoutId = window.setTimeout(() => {
      setDisplayMessage((prev) => prev + message[index]);
      setIndex((prev) => prev + 1);
    }, 28);

    return () => window.clearTimeout(timeoutId);
  }, [index, message]);

  return (
    <AdvisorCard $mode={mode} $compact={compact}>
      <AdvisorHeader $mode={mode}>
        <AdvisorIcon $mode={mode}>
          <Bot size={22} />
        </AdvisorIcon>
        <AdvisorMeta>
          <AdvisorEyebrow $mode={mode}>SYSTEM ADVISOR</AdvisorEyebrow>
          <AdvisorTitle $mode={mode}>Factory AI</AdvisorTitle>
        </AdvisorMeta>
        <WaveStack>
          {[0, 0.2, 0.4, 0.1].map((delay) => (
            <WaveBar key={delay} $mode={mode} $delay={delay} />
          ))}
        </WaveStack>
      </AdvisorHeader>
      <AdvisorBody $mode={mode}>
        <AdvisorMessage $mode={mode}>
          {displayMessage}
          <BlinkingCursor $mode={mode} />
        </AdvisorMessage>
      </AdvisorBody>
    </AdvisorCard>
  );
});

AIAdvisor.displayName = 'AIAdvisor';

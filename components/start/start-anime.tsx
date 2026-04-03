'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import styled from 'styled-components';

// ==========================================
// 1. Framer Motion Variants 설정
// ==========================================

// 💡 메인 화면과 겹치면서 스르륵 투명해져 '밝아지며 열리는' 효과를 냅니다.
const overlayVariants: Variants = {
  show: { opacity: 1, backgroundColor: '#050505' },
  exit: { 
    opacity: 0, 
    backgroundColor: 'rgba(5, 5, 5, 0)',
    transition: { duration: 0.8, ease: 'easeInOut' } 
  }
};

const textContainerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { staggerChildren: 0.2, delayChildren: 0.1, duration: 0.8 },
  },
  exiting: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
};

const textItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const barContainerVariants: Variants = {
  hidden: { top: '85%', x: '-50%', opacity: 0 },
  loading: { top: '85%', x: '-50%', opacity: 1, transition: { duration: 0.8, delay: 0.5 } },
  exiting: { 
    top: '85%', 
    x: '-50%', 
    opacity: 0, 
    transition: { duration: 0.6, ease: 'easeInOut' } 
  }
};

const barFillVariants: Variants = {
  hidden: { width: '0%' },
  fill: { width: '100%', transition: { duration: 2.0, ease: 'easeInOut' } }
};


// ==========================================
// 2. Styled Components 설정
// ==========================================

const OverlayContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  pointer-events: none;
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 9999991;
  max-width: 56rem;
  padding: 0 1.5rem;
  text-align: center;
  color: #ffffff;
`;

const MainTitle = styled(motion.h1)`
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 2rem;
  line-height: 1.25;
  @media (min-width: 768px) { font-size: 3.75rem; }
  @media (min-width: 1024px) { font-size: 4.5rem; }
`;

const LogoImage = styled.img`
  height: 2.5rem;
  margin: 1.5rem auto 0;
  display: block;
  @media (min-width: 768px) { height: 4rem; }
`;

const Description = styled(motion.p)`
  font-size: 1rem;
  color: #989ba0;
  line-height: 1.4;
  word-break: keep-all;
  @media (min-width: 768px) { font-size: 1.25rem; }
`;

const SloganEng = styled.span`
  display: block;
  margin-top: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  font-size: 0.875rem;
  color: #9ca3af;
`;

const ProgressBarContainer = styled(motion.div)`
  position: absolute;
  width: 240px;
  height: 2px;
  background: rgba(255, 255, 255, 0.15);
  z-index: 9999992;
  left: 50%; 

  @media (min-width: 768px) { width: 360px; }
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: #ffffff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
`;


// ==========================================
// 3. 메인 컴포넌트
// ==========================================

interface StartAnimeProps {
  onComplete?: () => void;
}

export default function StartAnime({ onComplete }: StartAnimeProps) {
  // 상태 변경: 로딩 중 -> 요소들 퇴장 (opening/done 단계는 상위의 AnimatePresence가 처리)
  const [stage, setStage] = useState<'loading' | 'exiting'>('loading');

  const handleBarComplete = (definition: string) => {
    if (definition === 'fill') {
      setStage('exiting'); // 1. 텍스트와 프로그래스바가 페이드아웃 시작
      
      setTimeout(() => {
        // 💡 2. 텍스트가 다 사라진 정확히 이 순간에 메인 화면을 호출합니다!
        // 이 함수가 실행되면 아래 ClientLayoutWrapper에서 StartAnime를 지우게 되고,
        // 지워지는 순간 OverlayContainer의 exit(투명해지는 효과)가 발동하여 흰 화면 없이 완벽히 겹칩니다.
        if (onComplete) onComplete(); 
      }, 600);
    }
  };

  return (
    <OverlayContainer
      variants={overlayVariants}
      initial="show"
      animate="show"
      exit="exit" // 컴포넌트가 언마운트 될 때 투명해짐
    >
      <ContentWrapper
        variants={textContainerVariants}
        initial="hidden"
        animate={stage === 'loading' ? 'visible' : 'exiting'}
      >
        <MainTitle variants={textItemVariants}>
          <LogoImage src="/logo.svg" alt="클루닉스 로고" />
        </MainTitle>

        <Description variants={textItemVariants}>
          <SloganEng>CREATIVITY & ELEGANCY</SloganEng>
        </Description>
      </ContentWrapper>

      <ProgressBarContainer
        variants={barContainerVariants}
        initial="hidden"
        animate={stage === 'loading' ? 'loading' : 'exiting'}
      >
        <ProgressFill 
          variants={barFillVariants}
          initial="hidden"
          animate={stage === 'loading' ? 'fill' : 'fill'}
          onAnimationComplete={handleBarComplete} 
        />
      </ProgressBarContainer>
    </OverlayContainer>
  );
}
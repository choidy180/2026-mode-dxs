"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiBell, FiSearch } from 'react-icons/fi';
import AIAgentSystem from '../chatbot-widget';

// --- Types & Data ---
export type SubMenuItemType = { label: string; href: string; detail: string; };
export type MenuDataType = { description: string; items: SubMenuItemType[]; };

const MENU_KEYS = ["자재관리", "공정품질", "공정설비", "생산관리", "작업관리", "출하관리"];

const subMenuData: Record<string, MenuDataType> = {
  "자재관리": {
    description: "",
    items: [
      { label: "입고검수", href: "/material/inbound-inspection", detail: "" },
      { label: "자재창고", href: "/material/warehouse", detail: "" },
      { label: "공정재고", href: "/production/smart-factory-dashboard", detail: "" },
    ]
  },
  "공정품질": {
    description: "",
    items: [
      { label: "유리틈새검사", href: "/production/glass-gap-check", detail: "" },
      { label: "발포액누설 검사", href: "/production/leak-detection", detail: "" },
      { label: "가스켓 이상 탐지", href: "/production/gasket-check", detail: "" },
      { label: "필름부착확인", href: "/production/film-attachment", detail: "" },
    ]
  },
  "공정설비": {
    description: "",
    items: [
      { label: "발포 품질 예측", href: "/production/line-monitoring", detail: "" },
      { label: "발포설비 예지보전", href: "/production/foaming-inspection", detail: "" },
    ]
  },
  "생산관리": {
    description: "",
    items: [
      { label: "작업시간관리", href: "/production/takttime-dashboard", detail: "" },
    ]
  },
  "작업관리": {
    description: "",
    items: [
      { label: "Pysical AI", href: "/production/pysical-ai", detail: "" },
    ]
  },
  "출하관리": {
    description: "",
    items: [
      { label: "운송관리", href: "/transport/realtime-status", detail: "" },
      { label: "제품창고", href: "/transport/warehouse-management", detail: "" },
      { label: "출하처리", href: "/transport/shipment", detail: "" },
    ]
  },
};


// --- Styled Components ---

const NavWrapper = styled.div<{ $isDisabled: boolean }>`
  position: sticky; top: 0; width: 100%; 
  z-index: 9999; 
  ${props => props.$isDisabled && css`pointer-events: none; opacity: 0.6; cursor: not-allowed;`}
`;

const NavContainer = styled.nav`
  position: relative;
  z-index: 10001; 
  height: 64px; background: #ffffff;
  display: flex; justify-content: center;
  font-family: var(--font-pretendard), 'Pretendard', sans-serif; 
  border-bottom: 1px solid #e5e7eb; 
`;

const NavInner = styled.div`
  width: 100%; padding: 0 24px; height: 100%;
  display: flex; align-items: center; justify-content: space-between;
`;

// 💡 1. 좌측 로고 영역에 flex: 1 할당
const LogoArea = styled.div`
  flex: 1; /* 💡 공간 균형을 위해 추가 */
  display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 16px; color: #111; cursor: pointer;
  letter-spacing: -0.5px;
  h4 {
    font-family: 'A2z'; font-weight: 600 !important;
  }
`;

// 💡 2. 우측 아이콘 영역에 flex: 1과 justify-content: flex-end 할당
const IconActions = styled.div`
  flex: 1; /* 💡 공간 균형을 위해 추가 */
  display: flex; gap: 12px; align-items: center; justify-content: flex-end; /* 💡 우측으로 밀어주기 */
`;

const MenuPillContainer = styled.div`
  display: flex; align-items: center; position: relative; 
  background-color: #f3f4f6;
  border-radius: 40px;
  padding: 4px;
`;

const MenuGlider = styled.div`
  position: absolute; 
  height: calc(100% - 8px); 
  background-color: #D31145 !important; 
  border-radius: 30px; 
  z-index: 0;
  top: 4px;
  left: 0;
  transition: transform 0.4s cubic-bezier(0.2, 0, 0.2, 1), width 0.4s cubic-bezier(0.2, 0, 0.2, 1);
  will-change: transform, width;
`;

const MenuItem = styled.button<{ $isActive?: boolean }>`
  border: none; background: transparent; 
  color: ${props => props.$isActive ? '#ffffff' : '#333333'}; 
  padding: 8px 24px; 
  border-radius: 30px; 
  font-size: 15px; font-weight: 600; cursor: pointer;
  position: relative; z-index: 1; transition: color 0.2s ease; font-family: inherit;
  display: flex; align-items: center; justify-content: center; white-space: nowrap;
  
  &:hover {
    color: ${props => props.$isActive ? '#ffffff' : '#D31145'};
  }
`;

const IconButton = styled.div`
  width: 40px; height: 40px; border-radius: 50%;
  background-color: #f3f4f6;
  display: flex; align-items: center; justify-content: center;
  color: #333; cursor: pointer; position: relative;
  transition: background-color 0.2s;
  &:hover { background-color: #e5e7eb; }
`;

const Badge = styled.span`
  position: absolute; top: -2px; right: -2px;
  background-color: #ef4444; color: white;
  font-size: 10px; font-weight: 800;
  width: 18px; height: 18px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid white;
`;

const SubMenuBar = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 64px; 
  left: 0;
  width: 100%; 
  height: 48px; 
  background: #ffffff;
  display: flex; justify-content: center; align-items: center;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06); 
  
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.$isOpen ? '0' : '-5px'});
  transition: all 0.2s ease-in-out;
`;

const SubMenuInnerBar = styled.div`
  width: 100%; max-width: 1680px; padding: 0 24px;
  height: 100%; 
  display: flex; gap: 40px; justify-content: center;
`;

const SubMenuItem = styled.button<{ $isActive: boolean }>`
  background: none; border: none; cursor: pointer;
  font-size: 14px; 
  height: 100%; 
  display: flex; align-items: center; justify-content: center;
  position: relative; 
  font-weight: ${props => props.$isActive ? '700' : '500'};
  color: ${props => props.$isActive ? '#D31145' : '#888888'};
  transition: color 0.2s;
  font-family: inherit;
  
  &:hover { color: #D31145; }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: #D31145;
    opacity: ${props => props.$isActive ? 1 : 0}; 
    transition: opacity 0.2s ease;
  }
`;

const BlurOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 64px; 
  left: 0;
  width: 100vw;
  height: calc(100vh - 64px);
  background: rgba(0, 0, 0, 0.35); 
  backdrop-filter: blur(6px); 
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 9998;
`;


// --- Component ---

interface TopNavigationProps { isLoading?: boolean; }

export default function TopNavigation({ isLoading = false }: TopNavigationProps) {
  const [gliderStyle, setGliderStyle] = useState({ x: 0, width: 0 });
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const menuAreaRef = useRef<HTMLDivElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null); 

  useEffect(() => { setMounted(true); }, []);

  const getCurrentActiveMenu = useCallback(() => {
    if (!mounted || !pathname) return null;
    const activeKey = MENU_KEYS.find(key => 
      subMenuData[key].items.some(item => pathname === item.href || pathname.startsWith(item.href))
    );
    if (activeKey) return activeKey;
    
    if (pathname.includes('/material')) return "자재관리";
    if (pathname.includes('/production')) return "공정품질";
    if (pathname.includes('/transport')) return "출하관리";
    return "자재관리"; 
  }, [pathname, mounted]);

  const currentActiveMenu = getCurrentActiveMenu();
  const activeSubMenuData = hoveredMenu ? subMenuData[hoveredMenu] : null;
  const isMenuOpen = !!hoveredMenu && !isLoading;

  const handleMenuClick = (e: React.MouseEvent, menu: string) => {
    e.preventDefault(); if (isLoading) return;
    const subItems = subMenuData[menu]?.items;
    if (subItems && subItems.length > 0) {
      setHoveredMenu(null);
      router.push(subItems[0].href);
    }
  };

  const handleSubMenuClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault(); 
    if (isLoading) return;
    setHoveredMenu(null);
    router.push(href);
  };

  const updateGliderPosition = useCallback(() => {
    if (!mounted || !currentActiveMenu) { setGliderStyle({ x: 0, width: 0 }); return; }
    
    const activeIndex = MENU_KEYS.indexOf(currentActiveMenu);
    const currentTabElement = tabsRef.current[activeIndex];
    const parentElement = menuAreaRef.current;
    
    if (currentTabElement && parentElement) {
      const parentRect = parentElement.getBoundingClientRect();
      const childRect = currentTabElement.getBoundingClientRect();
      const relativeX = childRect.left - parentRect.left;
      
      setGliderStyle(prev => {
        if (Math.abs(prev.x - relativeX) < 0.5 && Math.abs(prev.width - childRect.width) < 0.5) return prev;
        return { x: relativeX, width: childRect.width };
      });
    }
  }, [currentActiveMenu, mounted]);

  useEffect(() => {
    if (!mounted) return;
    updateGliderPosition();
    const resizeObserver = new ResizeObserver(() => updateGliderPosition());
    if (menuAreaRef.current) resizeObserver.observe(menuAreaRef.current);
    tabsRef.current.forEach(tab => { if (tab) resizeObserver.observe(tab); });
    return () => resizeObserver.disconnect();
  }, [updateGliderPosition, mounted]);

  useEffect(() => {
    if (!hoveredMenu) return; 

    const handleMouseMove = (e: MouseEvent) => {
      if (subMenuRef.current) {
        const rect = subMenuRef.current.getBoundingClientRect();
        if (e.clientY > rect.bottom + 100) {
          setHoveredMenu(null);
        }
      }
    };

    const handleMouseLeaveDoc = () => {
      setHoveredMenu(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeaveDoc);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveDoc);
    };
  }, [hoveredMenu]);

  return (
    <NavWrapper $isDisabled={isLoading}>
      {/* 1단: 메인 내비게이션 바 */}
      <NavContainer>
        <NavInner>
          <LogoArea onClick={() => router.push('/master-dashboard')}>
            <div style={{ position: 'relative', width: '60px', height: '24px' }}>
              <Image src="/logo/gmt_logo.png" alt="Company Logo" fill style={{ objectFit: 'contain' }} priority />
            </div>
            <h4>고모텍 AI 관제센터</h4>
          </LogoArea>

          <MenuPillContainer ref={menuAreaRef}>
            {mounted && (
              <MenuGlider style={{ transform: `translateX(${gliderStyle.x}px)`, width: gliderStyle.width }} />
            )}
            {MENU_KEYS.map((menu, index) => {
              const isActive = mounted ? currentActiveMenu === menu : false;
              return (
                <MenuItem 
                  key={menu}
                  ref={(el) => { if(el) tabsRef.current[index] = el; }}
                  $isActive={isActive} 
                  onClick={(e) => handleMenuClick(e, menu)}
                  onMouseEnter={() => !isLoading && setHoveredMenu(menu)}
                >
                  {menu}
                </MenuItem>
              );
            })}
          </MenuPillContainer>

          <IconActions>
            <AIAgentSystem />
            <IconButton><FiSearch size={18} /></IconButton>
            <IconButton><FiBell size={18} /><Badge>2</Badge></IconButton>
          </IconActions>
        </NavInner>
      </NavContainer>

      {/* 2단: 서브메뉴 바 */}
      <SubMenuBar ref={subMenuRef} $isOpen={isMenuOpen}>
        <SubMenuInnerBar>
          {activeSubMenuData?.items.map((subItem) => (
            <SubMenuItem 
              key={subItem.label} 
              $isActive={mounted ? pathname === subItem.href : false}
              onClick={(e) => handleSubMenuClick(e, subItem.href)}
            >
              {subItem.label}
            </SubMenuItem>
          ))}
        </SubMenuInnerBar>
      </SubMenuBar>

      {/* 메뉴 호버 시 배경 블러 처리 */}
      <BlurOverlay 
        $isOpen={isMenuOpen} 
        onClick={() => setHoveredMenu(null)}
      />
      
    </NavWrapper>
  );
}
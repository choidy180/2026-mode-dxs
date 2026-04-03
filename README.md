# 🏭 Smart Factory AI Vision & Logistics Dashboard

## 📖 Project Overview
Next.js와 React 기반으로 구축된 **스마트 팩토리 통합 관제 시스템**입니다. 창고(D동)의 실시간 적재 현황을 시각화하고, AI Vision 카메라(Vuzix)와 연동하여 자재 입고부터 ERP 저장까지의 **RPA 프로세스를 실시간으로 모니터링 및 제어**하는 대시보드입니다.

## 🛠 Tech Stack
- **Framework:** Next.js 14, React 18
- **Styling:** Styled-components, Framer Motion (Animations)
- **Backend / Realtime DB:** Firebase Realtime Database
- **Visualization:** Recharts (Data), Three.js (3D Assets - *Optional if used*)
- **Icons:** Lucide-react, React-icons

## 🚀 Key Features

### 1. 📦 Real-time Warehouse Monitoring (물류 관제)
- **D동 적재 현황판:** 구역(Zone)별 점유율, 슬롯(Slot) 활성화 상태를 실시간 시각화.
- **재고 리스트:** 검색 기능을 포함한 실시간 재고(Inventory) 목록 조회.
- **Green Theme UI:** 시인성을 높인 직관적인 UI/UX 디자인 적용.

### 2. 🤖 AI Vision RPA Process (입고 자동화)
- **Event-Driven Architecture:** Firebase `logs` 데이터 변경을 감지하여 프로세스 자동 시작.
- **Step-by-Step Visualization:**
  1. 바코드 디코딩
  2. ERP 조회
  3. 입고 검사 매칭
  4. 품질 이력 분석
  5. 데이터 저장
- **Camera Feed Integration:** IP 카메라 및 웨어러블 기기(Vuzix) 스트리밍 연동.

### 3. ⚡ Logic & Error Handling (핵심 로직)
- **Queue System & Throttling:**
  - 실시간으로 들어오는 상태 값을 **Queue(대기열)**로 관리하여 데이터 유실 방지.
  - 단계별 **최소 2초 딜레이(Throttling)**를 강제 적용하여 사용자 시인성 확보.
- **Robust Error Handling:**
  - **순서 꼬임 방지:** 프로세스 역행(예: Step 2 → 1) 감지 시 즉시 실패 처리.
  - **Exception Modal:** 에러 코드(`-1`) 수신 시 붉은색 테마의 실패 모달 및 사유 출력.
  - **Auto Recovery:** 실패 시 5초 카운트다운 후 시스템 자동 리셋.

## 📅 Recent Updates (Jan 2026)
- **UI/UX Refinement:** 중첩되거나 깨지는 레이아웃 수정 및 모달 애니메이션 고도화.
- **Logic Optimization:** `onChildAdded` → `onValue` 리스너 변경을 통한 상태 감지 신뢰성 향상.
- **Performance:** 불필요한 리렌더링 방지를 위한 `React.memo` 및 `useCallback` 최적화 적용.
"# 2026-mode-dxs" 



================================================================================

### 2026-04-03 작업내용


지금까지 작업하신 내용을 바탕으로 README.md 파일에 바로 붙여넣으실 수 있도록 깔끔하게 구조화하여 요약해 드립니다. 주요 기능과 적용된 기술(UI/UX 디테일)을 중심으로 정리했습니다.

🚀 주요 작업 내역 요약 (고모텍 AI 관제센터 UI/UX 개편)
본 작업은 React(Next.js), styled-components, framer-motion을 활용하여 전반적인 관제센터의 첫인상과 대시보드 UI를 시네마틱하고 모던하게 개편하는 데 중점을 두었습니다.

1. 🎬 시네마틱 인트로 로딩 (StartAnime)
기존의 단순한 로딩 화면을 대체하여, 서비스 최초 접속 시 브랜드의 품격을 높여주는 시네마틱 애니메이션을 구현했습니다.

필름 롤 프로그래스바: 순수 CSS(repeating-linear-gradient 및 radial-gradient)를 활용해 아날로그 필름이 돌아가는 듯한 무한 롤링 효과를 구현했습니다. 모서리를 둥글게(Pill) 처리하여 현대적인 느낌을 주었습니다.

크로스페이드(Cross-fade) 화면 전환: 프로그래스바가 100% 차오르면, 텍스트가 위로 부드럽게 페이드아웃 됨과 동시에 배경의 투명도가 조절되며 메인 대시보드 화면이 자연스럽게 스르륵 밝아지도록(Overlap) 타이밍을 정교하게 맞췄습니다.

최초 접속(First Load) 제어: 페이지를 이동할 때마다 로딩이 뜨는 불편함을 없애기 위해, useRef를 활용하여 브라우저 최초 접근 시에만 애니메이션이 한 번 실행되도록 최적화했습니다. (Z-index를 활용해 GNB 헤더 완벽 차단)

2. 💊 2단 알약형 스마트 내비게이션 (TopNavigation)
기존의 거대한 메가 메뉴(Mega Menu) 방식을 탈피하고, 가독성과 공간 활용성을 높인 최신 트렌드의 2단 구조 내비게이션으로 전면 개편했습니다.

Pill 디자인 & 붉은색 글라이더: 중앙 1차 메뉴를 회색 알약 모양으로 감싸고, 마우스 호버 및 활성화된 메뉴에 따라 붉은색 배경(Glider)이 부드럽게 이동(framer-motion 활용)하도록 구현했습니다.

서브메뉴 & 블러 오버레이: 1차 메뉴 호버 시 하단에 얇은 2차 메뉴 바가 스르륵 나타나며, 동시에 메인 콘텐츠 영역이 반투명한 검은색 블러(Blur)로 덮여 사용자의 시선이 메뉴에 집중되도록 했습니다.

스마트 호버 해제 (100px 버퍼): 마우스가 서브메뉴 영역을 살짝만 벗어나도 메뉴가 닫히는 불편함을 해결하기 위해, 마우스 Y좌표를 추적하여 서브메뉴 하단 기준 100px 이상 벗어났을 때만 부드럽게 닫히도록 UX를 개선했습니다.

3. 📊 AI 관제센터 대시보드 개편 (WarehouseDashboard & DashboardPage)
수많은 데이터와 카메라 화면을 한눈에 파악할 수 있도록 좌측 데이터 영역과 우측 모니터링 영역의 UI를 고도화했습니다.

동적 SVG 반원 게이지 차트: '종합 적재 현황'에 하드코딩된 이미지가 아닌, 실제 데이터(점유율)에 맞춰 빨간색 게이지가 동적으로 차오르는 SVG 반원 차트를 자체 구현했습니다.

검수 리스트 카드 UI & 커스텀 스크롤: 리스트 항목들을 깔끔한 카드형 박스로 분리하고, 스크롤바의 트랙을 투명하게, 썸(Thumb)을 얇고 둥근 형태로 커스텀하여 좁은 공간에서도 답답해 보이지 않도록 마감했습니다.

2x2 ↔ 1x1 카메라 그리드 토글: 자재 검수 모니터링 화면을 4분할(2x2) 레이아웃으로 구성하고, 개별 카메라의 [확대] 버튼 클릭 시 해당 화면이 영역 전체(1x1)를 꽉 채우도록 동적 그리드 변환 기능을 추가했습니다.
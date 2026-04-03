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

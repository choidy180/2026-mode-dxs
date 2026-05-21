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


---

README에 바로 붙일 상세 정리와 노션 공유용 간략 리스트로 나눠서 작성하겠습니다.

3m 24s 동안 생각함

아래 내용 그대로 README 하단에 추가하면 됩니다.
작업일자는 오늘 기준으로 2026년 5월 21일로 정리했습니다.

README 추가용 작업 정리
2026-05-21 작업 내역
1. 자재검수 실시간 모니터링 화면 UI 개선

자재검수 실시간 모니터링 화면을 기존 단순 카메라 출력 구조에서, 실제 운영 화면에 가까운 형태로 개선했다. 전체 디자인 방향은 화이트 테마 기반의 애플 스타일 UI를 기준으로 정리했으며, 과한 이펙트나 장식성 요소는 제거하고 가시성, 정돈감, 화면 밀도에 집중했다.

주요 개선 방향은 다음과 같다.

화이트 테마 기반의 모던한 카드형 레이아웃 적용
붉은색 계열 포인트 컬러를 중심으로 주요 상태 강조
불필요한 그라데이션, 과한 그림자, 장식성 요소 제거
카메라 화면과 정보 패널의 시각적 구분감 개선
화면 전체를 더 넓고 실무형 대시보드처럼 사용할 수 있도록 레이아웃 정리
2. 카메라 영역 구성 변경

기존 카메라 영역을 최대 6개 카메라 기준으로 재정리했다.
초기에는 상단 3개, 하단 3개로 크기가 다른 구조를 검토했으나, 이후 화면 안정성과 비율 문제를 고려해 모든 카메라가 동일한 크기와 동일한 비율로 표시되도록 수정했다.

최종 반영 내용은 다음과 같다.

카메라 개수: 총 6개 기준
배치: 3열 그리드 기반
각 카메라 박스는 동일 크기 유지
카메라 비율은 작업 화면별 요구에 따라 4:3 또는 16:10 기준으로 정리
카메라 화면이 찌그러지지 않도록 aspect-ratio 적용
카메라 카드 내부에는 CAM 번호, 연결 상태, 확대 버튼 등을 간결하게 표시
반응형 환경에서는 2열 또는 1열로 자연스럽게 변경되도록 구성
3. 카메라 확대 화면 개선

카메라 확대 화면은 기존 박스 내부 확대 방식에서 벗어나, 페이지 전체 영역을 사용하는 방식으로 개선했다.
상단 NavBar가 약 60px을 차지하는 구조를 고려하여 확대 화면은 NavBar 영역을 제외한 나머지 화면을 기준으로 표시되도록 정리했다.

반영 내용은 다음과 같다.

확대 화면은 position: fixed 기반으로 구성
상단 NavBar 대응을 위해 top 또는 margin-top: 60px 방식 적용
최대 높이는 calc(100vh - 60px) / calc(100dvh - 60px) 기준 사용
별도 헤더 박스 제거
축소 버튼은 카메라 화면 내부 오버레이 형태로 배치
카메라 화면이 가로로도 최대한 꽉 차게 표시되도록 수정
배경 그라데이션 제거
전환 애니메이션은 성능 부담이 적은 opacity 중심으로 간소화
확대 상태에서 body/html 스크롤 잠금 처리
4. 자재검수 로그 티커 컴포넌트 추가

자재검수 로그 데이터를 화면 상단 또는 카메라 영역 주변에 표시할 수 있도록 가로형 티커 컴포넌트를 구성했다.
현재 실제 데이터 연동 전 단계이므로 더미 데이터를 기반으로 동작하도록 만들었으며, 일정 시간마다 신규 로그가 생성되어 누적되는 것처럼 보이게 구현했다.

구성 내용은 다음과 같다.

컴포넌트명: InspectionLogTicker
높이: 약 80px
카드 형태의 가로 리스트 구조
무한 슬라이드 방식으로 왼쪽으로 천천히 이동
10초마다 신규 더미 검수 로그 생성
신규 데이터는 리스트 앞쪽에 누적
최대 표시 개수는 maxItems props로 제어
데이터 생성 주기는 intervalMs props로 제어
기본 더미 데이터가 없을 경우 내부 더미 데이터 사용
입고 수량이 undefined일 수 있는 타입 문제를 고려해 Number(log.InQty ?? 0) 형태로 보완

표시 정보는 다음 항목 중심으로 간결하게 구성했다.

거래처명
검수 상태
자재명
송장번호
입고 수량
입고 시간

해당 컴포넌트는 baseLogs, intervalMs, maxItems props를 받아 사용할 수 있도록 구성했다. 기본값 기준으로는 내부 더미 데이터를 사용하고, 10초마다 신규 로그가 쌓이며, 무한 슬라이드 형태로 출력된다.

5. RPA 단계 진행 카드 컴포넌트 추가

각 카메라별로 RPA 검수 로직이 1단계부터 5단계까지 진행되는 것처럼 보이도록 더미 기반의 상태 카드 컴포넌트를 추가했다.
카메라 6대 각각에 대해 현재 진행 중인 RPA 단계를 표시하며, 일정 시간마다 단계가 변경되도록 구성했다.

구성 내용은 다음과 같다.

컴포넌트명: CameraRpaStepList
카메라 수: 6개
각 카메라별 RPA 진행 상태 표시
더미 타이머 기반으로 단계 자동 변경
기본 갱신 주기: 5초
각 카드에는 CAM 번호, 진행 상태, 현재 STEP, 진행바 표시
진행바는 현재 단계에 맞춰 증가
카드 배치는 6열 기준으로 구성
반응형에서는 2열 또는 1열로 변경

RPA 단계는 다음과 같이 구성했다.

STEP 1. 이미지 수집
STEP 2. 자재 인식
STEP 3. 송장 매칭
STEP 4. 수량 검증
STEP 5. 결과 전송

초기에는 단계별 컬러를 파랑, 보라, 노랑, 초록, 빨강 등으로 구분했으나 화면이 지나치게 알록달록해 보여 조정했다. 이후 전체 붉은색 계열로 통일했지만 단계 구분성이 떨어져 최종적으로 아래 톤으로 변경했다.

STEP 1 → 초록
STEP 2 → 연두
STEP 3 → 노랑
STEP 4 → 주황
STEP 5 → 빨강

이를 통해 진행 단계가 높아질수록 위험도 또는 완료 임박 상태처럼 직관적으로 보이도록 했다.

6. AIDashboardModal 화면 스타일 개선

기존 AIDashboardModal 화면도 동일한 디자인 방향으로 정리했다.
전체적으로 화이트 테마 기반의 깔끔한 운영 화면 형태를 유지하면서, 불필요한 상단 헤더와 장식 요소를 제거하고 실제 데이터 확인에 집중할 수 있도록 수정했다.

주요 반영 내용은 다음과 같다.

상단 헤더 영역 제거
화면 높이 기준을 100vh - 60px로 정리
NavBar 대응을 위해 position: fixed와 margin-top: 60px 방식 적용
카메라 영역은 16:10 비율 유지
화면 전체 영역을 최대한 활용하도록 수정
우측 데이터 영역 가시성 개선
우측 정보 패널 내부 카드 구분감 강화
입고 예정 리스트 카드들을 가로 배열로 유지
모든 border-left: 3px 포인트 라인 제거
과한 배경, 그라데이션, 장식성 그림자 제거
카드가 모두 흰색이라 구분이 약한 문제를 보완하기 위해 배경 대비와 테두리 색상 조정
7. 타입 오류 및 안정성 보완

작업 중 발생한 TypeScript 타입 오류를 일부 보완했다.

log.InQty undefined 가능성 대응

MaterialListItem 타입에서 InQty가 optional일 수 있어 아래 오류가 발생했다.

'log.InQty' is possibly 'undefined'.

이를 방지하기 위해 아래 방식으로 수정했다.

Number(log.InQty ?? 0).toLocaleString()
Timeout 타입 충돌 대응

Next.js Client Component 환경에서 setInterval 반환 타입이 number로 추론되면서 아래 오류가 발생했다.

Type 'number' is not assignable to type 'Timeout'.

브라우저 환경 기준으로 명확히 처리하기 위해 NodeJS.Timeout 사용을 제거하고 아래처럼 수정했다.

const timer = window.setInterval(() => {
  ...
}, 1000);

return () => window.clearInterval(timer);
8. 컴포넌트 구조 정리

기존 화면을 단일 파일 중심에서 컴포넌트 단위로 분리하는 방향으로 정리했다.
Next.js 최신 App Router 구조를 기준으로 하되, src 폴더 없이 사용하는 프로젝트 구조를 전제로 구성했다.

정리된 주요 구조는 다음과 같다.

app/
  material-monitoring/
    page.tsx

components/
  material-monitoring/
    MaterialMonitoringClient.tsx
    MonitoringSection.tsx
    CameraGrid.tsx
    CameraFrame.tsx
    CameraFullscreen.tsx
    InspectionLogTicker.tsx
    CameraRpaStepList.tsx
    InspectionLogPanel.tsx
    InspectionLogRow.tsx
    VehicleInfoCard.tsx
    PendingListCard.tsx
    MaterialListModal.tsx
    styles.ts

constants/
  material-monitoring.ts

data/
  dummy-inspection-logs.ts

hooks/
  use-camera-hosts.ts
  use-material-data.ts
  use-vehicle-data.ts
  use-vuzix-log.ts

types/
  material-monitoring.ts

utils/
  material-monitoring.ts
9. 최종 디자인 방향

오늘 작업의 최종 UI 방향은 다음 기준으로 정리했다.

화이트 테마
애플 스타일의 모던한 카드 UI
얇은 테두리 중심의 구분감
과하지 않은 그림자
붉은색 또는 상태 기반 포인트 컬러
카메라 화면 비율 유지
운영자가 빠르게 상태를 파악할 수 있는 가시성
불필요한 장식 제거
간결한 코드 구조
10. 추후 확인 필요 사항

현재 작업은 UI 및 더미 데이터 기반 동작 중심으로 구성되어 있다.
실제 운영 반영 전 아래 항목 확인이 필요하다.

실제 카메라 스트림 URL 연동 여부
카메라별 RPA 단계 상태 API 존재 여부
자재검수 로그 실제 API 데이터 매핑
입고 예정 리스트 실제 데이터 필드와 UI 매칭
더미 타이머 제거 후 실시간 데이터 기반 갱신 방식 적용
확대 화면에서 iframe 스트림 성능 확인
다양한 해상도에서 6개 카메라 + RPA 카드 배치 확인
NavBar 높이 60px 고정 여부 확인
실제 프로젝트 빌드 환경에서 styled-components / framer-motion / lucide-react 의존성 확인
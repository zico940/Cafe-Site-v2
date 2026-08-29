# AURA Cafe 주문 시스템 설계 스펙

## 프로젝트 개요

실시간 카페 주문 웹앱. 고객용(주문), 업소용(접수/제작), 개발자용(훅 시각화) 3개 화면으로 구성.
WebSocket 기반 실시간 통신, 내부 EventBus 패턴, 커피 제작 애니메이션 포함.

---

## 확정된 요구사항

| 항목 | 결정 |
|------|------|
| 고객 식별 | 번호표 방식 (주문 시 순번 발급) |
| 고객 알림 | 소리 + 화면 표시 (완료 시) |
| 메뉴 | 임의 구성 (카테고리 4개, 총 12종) |
| 메뉴 관리 | 업소 화면에서 CRUD 가능 |
| 결제 | 없음 |
| 업소 인증 | 없음 (URL 접근) |
| 웹훅 | 내부 이벤트 → WS 브로드캐스트 + DB 로그 |
| 애니메이션 | 고객 + 업소 화면 모두 |
| DB | 로컬 설치 PostgreSQL (Docker 미사용) |
| 백엔드 | Python FastAPI |
| 프론트엔드 | Next.js 15 (App Router) |

---

## 시스템 아키텍처

```
[고객 브라우저]  [업소 브라우저]  [개발자 브라우저]
      │                 │                  │
      └─────────────────┴──────────────────┘
                        │  WebSocket + REST
              ┌─────────▼──────────┐
              │   FastAPI Backend  │
              │  ┌──────────────┐  │
              │  │  EventBus    │  │
              │  │  Dispatcher  │  │
              │  └──────┬───────┘  │
              │         │          │
              │  ┌──────▼───────┐  │
              │  │  WS Manager  │  │
              │  └──────────────┘  │
              └─────────┬──────────┘
                        │
              ┌─────────▼──────────┐
              │    PostgreSQL      │
              │  menus / orders /  │
              │  webhook_logs      │
              └────────────────────┘
```

---

## 화면 및 라우팅

### 1. 고객 화면 (`/customer`)

**흐름:**
1. 메뉴 목록 표시 (카테고리 탭 필터)
2. 메뉴 선택 → 장바구니 추가
3. "주문하기" 클릭 → 번호표 발급
4. 동일 페이지에서 주문 상태 실시간 업데이트:
   - `PENDING`: "주문이 접수되었습니다" + 대기 아이콘
   - `PREPARING`: 커피 제조 애니메이션 재생
   - `COMPLETED`: 파티클 폭발 + 알림음 + "번호 N번, 준비 완료!" 표시
5. "새 주문" 버튼으로 초기화

**핵심 컴포넌트:**
- `MenuGrid` - 메뉴 카탈로그
- `CartDrawer` - 장바구니 슬라이드
- `OrderStatusPanel` - 실시간 주문 상태 (WebSocket)
- `CoffeeBrewingAnimation` - SVG 기반 제조 애니메이션
- `CompletionCelebration` - 완료 파티클 + 소리

### 2. 업소 화면 (`/owner`)

**탭 구성:**
- **주문 관리 탭**: 실시간 주문 수신, 제작 시작/완료 처리
- **메뉴 관리 탭**: 메뉴 CRUD

**주문 관리 흐름:**
1. 신규 주문 실시간 수신 (WS) + 알림음
2. "제작 시작" 클릭 → 타이머 + 진행 바 애니메이션 시작
3. "제작 완료" 클릭 → 고객에게 WebSocket 알림 전송
4. 완료된 주문은 완료 목록으로 이동

**메뉴 관리:**
- 메뉴 목록 + 추가/수정/삭제 모달
- 품절 토글 스위치

### 3. 개발자 로그 화면 (`/dev-logs`)

**표시 내용:**
- 실시간 이벤트 스트림 (WebSocket)
- 각 이벤트: 타입, 타임스탬프, 페이로드 JSON, 방향, 레이턴시
- 연결된 클라이언트 현황 (고객/업소/개발자 각 연결 수)
- 과거 로그 조회 (DB에서 페이지네이션)
- 이벤트 타입별 필터

---

## 데이터 모델

### menus 테이블

```sql
CREATE TABLE menus (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,        -- 한국어명
    name_en     VARCHAR(100) NOT NULL,        -- 영문명
    price       INTEGER NOT NULL,             -- 원 단위
    category    VARCHAR(50) NOT NULL,         -- espresso/milk_based/sweet/non_coffee
    description TEXT,
    image_url   VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);
```

### orders 테이블

```sql
CREATE TABLE orders (
    id           SERIAL PRIMARY KEY,
    order_number INTEGER NOT NULL,             -- 번호표 (1~999 순환)
    items        JSONB NOT NULL,              -- [{menu_id, name, quantity, unit_price}]
    total_price  INTEGER NOT NULL,
    status       VARCHAR(20) DEFAULT 'pending', -- pending/preparing/completed/cancelled
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW()
);
```

### webhook_logs 테이블

```sql
CREATE TABLE webhook_logs (
    id          SERIAL PRIMARY KEY,
    event_type  VARCHAR(100) NOT NULL,        -- order.created / order.preparing / order.completed
    payload     JSONB NOT NULL,
    direction   VARCHAR(50) NOT NULL,         -- ws_broadcast / internal
    latency_ms  FLOAT,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

---

## 이벤트 시스템 (훅)

### 이벤트 타입

| 이벤트 | 트리거 | 수신자 |
|--------|--------|--------|
| `order.created` | 고객이 주문 제출 | 업소 WS, 개발자 WS |
| `order.preparing` | 업소가 제작 시작 | 고객 WS (전체), 개발자 WS |
| `order.completed` | 업소가 제작 완료 | 고객 WS (전체), 개발자 WS |
| `order.cancelled` | 취소 | 고객 WS (전체), 개발자 WS |
| `menu.updated` | 메뉴 변경 | 고객 WS (전체), 개발자 WS |

### WebSocket 메시지 포맷

```json
{
  "event": "order.completed",
  "order_id": 42,
  "order_number": 7,
  "data": {
    "status": "completed",
    "items": [{"name": "아메리카노", "quantity": 2}],
    "total_price": 9000
  },
  "timestamp": "2026-08-29T10:00:00.000Z"
}
```

### EventBus 흐름

```
API 엔드포인트 (상태 변경)
        ↓
  EventBus.dispatch(event_type, payload)
        ↓
  ┌─────┴──────────────┐
  │                    │
WS 브로드캐스트     webhook_logs 저장
  │                    │
[고객/업소/개발자   [개발자 페이지
  실시간 수신]       DB 조회]
```

### WebSocket 엔드포인트

| 경로 | 대상 | 수신 이벤트 |
|------|------|------------|
| `ws://localhost:8000/ws/customer` | 고객 브라우저 | order.preparing, order.completed, order.cancelled, menu.updated |
| `ws://localhost:8000/ws/owner` | 업소 브라우저 | order.created |
| `ws://localhost:8000/ws/dev` | 개발자 브라우저 | 모든 이벤트 |

고객은 WS로 전체 이벤트를 수신하고, **프론트엔드에서 자신의 order_number로 필터링**.

---

## REST API 엔드포인트

### 메뉴

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/menus` | 전체 메뉴 조회 |
| POST | `/api/menus` | 메뉴 추가 |
| PUT | `/api/menus/{id}` | 메뉴 수정 |
| DELETE | `/api/menus/{id}` | 메뉴 삭제 |
| PATCH | `/api/menus/{id}/availability` | 품절 토글 |

### 주문

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/orders` | 주문 목록 (status 필터) |
| POST | `/api/orders` | 주문 생성 |
| PATCH | `/api/orders/{id}/status` | 상태 변경 (preparing/completed/cancelled) |

### 로그

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/logs` | webhook_logs 조회 (페이지네이션, 이벤트 필터) |
| GET | `/api/logs/stats` | 이벤트 통계 |

### 헬스체크

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/health` | 서버 상태 |
| GET | `/api/connections` | 현재 WS 연결 수 |

---

## 초기 메뉴 데이터 (시드)

| 카테고리 | 메뉴 | 가격 |
|---------|------|------|
| 에스프레소 | 에스프레소 | 3,500원 |
| 에스프레소 | 아메리카노 | 4,000원 |
| 에스프레소 | 롱블랙 | 4,500원 |
| 우유 베이스 | 카페라떼 | 4,800원 |
| 우유 베이스 | 카푸치노 | 5,000원 |
| 우유 베이스 | 플랫화이트 | 5,500원 |
| 달콤한 음료 | 바닐라라떼 | 5,500원 |
| 달콤한 음료 | 카라멜마키아토 | 6,000원 |
| 달콤한 음료 | 카페모카 | 5,800원 |
| 논커피 | 녹차라떼 | 5,500원 |
| 논커피 | 초코라떼 | 5,500원 |
| 논커피 | 허브티 | 4,500원 |

---

## 프로젝트 디렉토리 구조

```
Cafe_Site_v2/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI 앱 + 라우터 등록 + CORS + lifespan
│   │   ├── database.py            # SQLAlchemy engine + SessionLocal + Base
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── menu.py            # Menu 모델
│   │   │   ├── order.py           # Order 모델
│   │   │   └── webhook_log.py     # WebhookLog 모델
│   │   ├── schemas/
│   │   │   ├── menu.py            # Pydantic 스키마
│   │   │   ├── order.py
│   │   │   └── log.py
│   │   ├── routers/
│   │   │   ├── menus.py           # 메뉴 CRUD API
│   │   │   ├── orders.py          # 주문 API + 상태 변경
│   │   │   └── logs.py            # 로그 조회 API
│   │   ├── websocket/
│   │   │   ├── manager.py         # ConnectionManager (연결 관리 + 브로드캐스트)
│   │   │   └── router.py          # WS 엔드포인트 라우터
│   │   ├── events/
│   │   │   ├── bus.py             # EventBus (dispatch + subscribe)
│   │   │   └── handlers.py        # 이벤트 핸들러 (WS 브로드캐스트 + DB 저장)
│   │   └── seed.py                # 초기 메뉴 데이터 삽입
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # 루트 레이아웃
│   │   │   ├── page.tsx           # 루트 → /customer 리다이렉트
│   │   │   ├── customer/
│   │   │   │   └── page.tsx       # 고객 화면
│   │   │   ├── owner/
│   │   │   │   └── page.tsx       # 업소 화면
│   │   │   └── dev-logs/
│   │   │       └── page.tsx       # 개발자 로그 화면
│   │   ├── components/
│   │   │   ├── customer/
│   │   │   │   ├── MenuGrid.tsx
│   │   │   │   ├── CartDrawer.tsx
│   │   │   │   ├── OrderStatusPanel.tsx
│   │   │   │   ├── CoffeeBrewingAnimation.tsx
│   │   │   │   └── CompletionCelebration.tsx
│   │   │   ├── owner/
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   ├── OrderList.tsx
│   │   │   │   ├── PreparingTimer.tsx
│   │   │   │   └── MenuManager.tsx
│   │   │   ├── dev-logs/
│   │   │   │   ├── EventStream.tsx
│   │   │   │   ├── EventCard.tsx
│   │   │   │   └── ConnectionStatus.tsx
│   │   │   └── ui/
│   │   │       ├── Badge.tsx
│   │   │       └── LoadingSpinner.tsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts    # WS 연결/재연결 훅
│   │   │   ├── useCart.ts         # 장바구니 상태 훅
│   │   │   └── useOrderStatus.ts  # 주문 상태 추적 훅
│   │   ├── lib/
│   │   │   ├── api.ts             # REST API 클라이언트
│   │   │   └── constants.ts       # API URL, WS URL 등
│   │   └── types/
│   │       └── index.ts           # 공통 타입 정의
│   ├── public/
│   │   └── sounds/
│   │       ├── order-complete.mp3  # 완료 알림음
│   │       └── new-order.mp3       # 신규 주문 알림음
│   ├── package.json
│   ├── next.config.ts
│   └── .env.local.example
│
└── docs/
    └── superpowers/
        ├── specs/
        │   └── 2026-08-29-cafe-ordering-system-design.md
        └── plans/
            └── 2026-08-29-cafe-ordering-system.md
```

---

## 환경 설정

### backend/.env
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/cafe_db
CORS_ORIGINS=http://localhost:3000
```

### frontend/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

---

## 비기능 요구사항

- WebSocket 연결 끊김 시 자동 재연결 (최대 5회, exponential backoff)
- 모바일 반응형 (고객 화면은 모바일 우선)
- prefers-reduced-motion 존중 (애니메이션 대체)
- CORS: localhost:3000 허용
- 주문 번호: 1~999 순환 (999 이후 1로 초기화)

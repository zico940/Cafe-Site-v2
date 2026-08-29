# ☕ AURA Cafe - 스마트 카페 셀프 오더 시스템

> **비개발자도 AI를 활용해 똑같이 만들 수 있는 풀스택 카페 주문 관리 시스템**

![Next.js](https://img.shields.io/badge/Next.js-16.3.3-black?logo=next.js)
![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 프로젝트 소개

**AURA Cafe**는 태블릿에서 고객이 직접 음료를 주문하고, 점주가 주문을 받아서 실시간으로 준비 상태를 업데이트하는 **완전한 카페 운영 시스템**입니다.

### 🎯 주요 기능

| 기능 | 설명 |
|------|------|
| **🛒 고객 주문** | 카테고리별 메뉴 검색, 장바구니, 즉시 주문 |
| **🔔 실시간 알림** | WebSocket으로 주문 상태 실시간 동기화 |
| **📊 점주 대시보드** | 주문 접수 → 준비 중 → 완료 상태 관리 |
| **⚙️ 메뉴 관리** | 가격, 설명, 카테고리 동적 수정 |
| **📈 개발자 로그** | 실시간 이벤트 모니터링 (WebSocket 연결 수 등) |

---

## 🏗️ 시스템 구조

```
Cafe_Site_v2/
├── frontend/                    # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/
│   │   │   ├── customer/       # 고객 주문 페이지
│   │   │   ├── owner/          # 점주 대시보드
│   │   │   ├── dev-logs/       # 개발자 로그 모니터링
│   │   │   └── layout.tsx      # 공통 레이아웃
│   │   ├── components/         # 재사용 가능한 UI 컴포넌트
│   │   ├── hooks/              # 커스텀 React 훅 (WebSocket 등)
│   │   ├── lib/                # 유틸리티 함수 (API 호출)
│   │   └── types/              # TypeScript 타입 정의
│   └── package.json            # 프론트엔드 의존성
│
└── backend/                     # Python FastAPI 백엔드
    ├── app/
    │   ├── main.py            # FastAPI 앱 진입점
    │   ├── database.py        # PostgreSQL 연결
    │   ├── models/            # SQLAlchemy ORM 모델
    │   ├── schemas/           # Pydantic 데이터 검증
    │   ├── routers/           # API 엔드포인트
    │   ├── websocket/         # WebSocket 매니저
    │   └── events/            # 이벤트 브로드캐스팅
    ├── requirements.txt       # 백엔드 의존성
    └── .env                   # 환경 변수 (DB, CORS 등)
```

---

## 🚀 빠른 시작 (5분 안에 구동하기)

### 필수 요구사항

- **Git** (소스 코드 다운로드)
- **Node.js 18+** (프론트엔드)
- **Python 3.9+** (백엔드)
- **PostgreSQL 14+** (데이터베이스)
- **VS Code** (권장) 또는 선호하는 에디터

### 1️⃣ 레포지토리 복제

```bash
git clone https://github.com/your-github-username/Cafe-Site-v2.git
cd Cafe-Site-v2
```

### 2️⃣ 백엔드 설정

```bash
cd backend

# Python 가상환경 생성 (처음 한 번만)
python -m venv venv

# 가상환경 활성화
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# .env 파일 확인 (기본 설정)
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cafe_db
# CORS_ORIGINS=http://localhost:3000

# 서버 실행
python -m uvicorn app.main:app --reload --port 8000
```

✅ **확인**: http://localhost:8000/docs 방문하면 Swagger UI가 보임

### 3️⃣ 프론트엔드 설정

```bash
# backend 디렉토리에서 나가기
cd ../frontend

# 의존성 설치 (처음 한 번만)
npm install

# 개발 서버 실행
npm run dev
```

✅ **확인**: http://localhost:3000 방문하면 "원하시는 음료를 선택해 주세요" 페이지가 보임

### 4️⃣ 테스트하기

| 페이지 | URL | 역할 |
|--------|-----|------|
| 🧑‍💼 고객 주문 | http://localhost:3000/customer | 메뉴 보기, 주문하기 |
| 👨‍💼 점주 관리 | http://localhost:3000/owner | 주문 접수, 메뉴 관리 |
| 📊 개발자 로그 | http://localhost:3000/dev-logs | 실시간 이벤트 모니터링 |

---

## 🛠️ AI를 활용해서 직접 만들기 (비개발자 가이드)

> **아무 코딩 경험이 없어도 Claude AI의 도움으로 이 프로젝트를 복제하고 커스터마이징할 수 있습니다!**

### 사전 준비

1. **Claude 계정** 만들기: https://claude.ai
2. **Claude Code** 활성화: https://claude.ai/code
3. **이 레포지토리** 복제 (위의 "빠른 시작" 참조)
4. **VS Code** 열기

### 단계 1️⃣: 프로젝트 구조 이해하기

**Claude AI에게 할 질문:**

```
이 카페 주문 시스템의 전체 구조를 설명해줘. 
- 프론트엔드는 뭐하고, 백엔드는 뭐하고, 데이터베이스는 뭐하는지
- 고객이 주문할 때부터 점주가 완료할 때까지 데이터가 어떻게 흐르는지
- 각 폴더의 역할이 뭐하는지

아주 쉬운 말로 설명해줘. (나는 코딩을 모르는 사람이야)
```

**Claude의 답변을 읽고 이해한 후 진행하세요.**

### 단계 2️⃣: 카페 이름/로고 변경하기

**변경할 파일**: `frontend/src/app/customer/page.tsx`, `frontend/src/app/owner/page.tsx`

**Claude AI에게 할 질문:**

```
frontend/src/app/customer/page.tsx 파일을 열어줄 수 있어?

그리고:
1. "원하시는 음료를 선택해 주세요" → "우리 카페 이름으로 주문하세요"로 바꾸고
2. "갓 로스팅한 원두와..." 설명 부분을 우리 카페 소개글로 바꿔줘

우리 카페: [당신의 카페 이름과 한두 문장 설명]
```

### 단계 3️⃣: 메뉴 추가/수정하기

**변경할 파일**: `backend/app/seed.py`

**Claude AI에게 할 질문:**

```
backend/app/seed.py 파일을 열어줄 수 있어?

현재 메뉴 리스트를 보고, 다음 메뉴들로 바꿔줘:

1. 카라멜 마끼아또 - 6500원 - "달콤한 카라멜과 진한 에스프레소"
2. 초콜릿 라떼 - 5500원 - "벨기에 초콜릿의 풍부한 맛"
3. 딸기 스무디 - 7000원 - "신선한 딸기로 만든 상큼한 음료"

카테고리는:
- 에스프레소 → espresso
- 라떼/밀크 → milk_based  
- 스무디/음료 → non_coffee

json 형식으로 추가해줘.
```

### 단계 4️⃣: 색상 테마 변경하기

**변경할 파일**: `frontend/src/app/layout.tsx`, `frontend/src/app/customer/page.tsx`

**Claude AI에게 할 질문:**

```
현재 카페 색상이 갈색/커피색인데, 우리 카페 색상으로 바꾸고 싶어.

우리 카페 색상:
- 주색상: [색상명 또는 코드, 예: 파란색 #3B82F6]
- 보조색: [색상명]

현재 사용 중인 색상 코드들 (갈색계):
- #211914, #1a1410, #140f0c, #382c23, #6d4c41

이 색들을 우리 색상으로 바꿔줄 수 있어?
```

### 단계 5️⃣: 가격 정책 변경하기

**변경할 파일**: `backend/app/models/order.py`

**Claude AI에게 할 질문:**

```
우리 카페는 사이즈별 가격이 다르다. (S, M, L)

현재는 하나의 가격만 저장되는데:
- 작은 사이즈: 기본 가격
- 중간 사이즈: +1000원
- 큰 사이즈: +2000원

이렇게 구조를 바꿔줄 수 있어?
메뉴 추가할 때 세 가지 가격을 모두 입력하도록.
```

### 단계 6️⃣: 결제 기능 추가하기 (심화)

**Claude AI에게 할 질문:**

```
이 카페 주문 시스템에 카카오페이 결제를 추가하고 싶어.

- 고객이 주문 완료 후 "결제하기" 버튼이 나타나고
- 카카오페이로 결제하면
- 결제 완료 후 점주에게 "결제 완료됨" 표시가 나타나도록

어떤 파일들을 수정해야 하고, 무엇부터 시작해야 할까?
(나는 코딩을 못하니까 아주 자세히 단계별로 설명해줘)
```

### 단계 7️⃣: 배포하기 (클라우드에 올리기)

**Claude AI에게 할 질문:**

```
완성된 카페 주문 시스템을 인터넷에 올려서 모두가 접속할 수 있도록 하고 싶어.

현재 상황:
- 백엔드: Python FastAPI
- 프론트엔드: Next.js  
- 데이터베이스: PostgreSQL

Vercel (프론트엔드) + Railway (백엔드) 무료 플랜으로 배포하는 방법을 
아주 쉽게 단계별로 설명해줄 수 있어?
```

---

## 📚 추가 학습 리소스

### 아키텍처 이해하기

| 개념 | 설명 | 학습 시간 |
|------|------|----------|
| **프론트엔드** | 사용자가 보는 화면 (Next.js) | 5분 |
| **백엔드** | 데이터 처리 서버 (FastAPI) | 5분 |
| **WebSocket** | 실시간 양방향 통신 | 10분 |
| **데이터베이스** | 메뉴/주문 정보 저장 (PostgreSQL) | 5분 |

### Claude AI 프롬프트 팁

#### ✅ 좋은 프롬프트

```
파일 [경로/파일명.tsx]의 "이 부분"(라인 15-20)을 보고,
[구체적 요청]을 해줄 수 있어?

현재: [현재 상황 설명 또는 코드 조각]
원하는 결과: [원하는 결과 설명]

아주 자세하게 단계별로 해줘.
```

#### ❌ 피해야 할 프롬프트

```
"프로젝트를 만들어줘" (너무 큼)
"뭔가 이상해" (모호함)
"코드 전체를 바꿔" (위험함)
```

---

## 🔧 자주 하는 질문 (FAQ)

### Q1: PostgreSQL이 없는데 할 수 있어?

**A:** SQLite 같은 다른 DB로 바꿀 수 있어요.

**Claude에게:**
```
backend의 데이터베이스를 PostgreSQL에서 SQLite로 바꿔줄 수 있어?
파일 위치와 변경해야 할 코드를 보여줘.
```

### Q2: 로그인 기능을 추가하고 싶어

**A:** 각 고객/점주 계정을 구분할 수 있습니다.

**Claude에게:**
```
고객 로그인 페이지와 점주 로그인 페이지를 추가하고 싶어.
- 각각 다른 대시보드가 보여야 함
- 로그인 안 한 상태에서는 접근 불가

어떤 순서로 만들어야 할까?
```

### Q3: 모바일 앱으로 만들 수 있어?

**A:** React Native를 사용하면 됩니다.

**Claude에게:**
```
이 Next.js 프로젝트를 React Native로 변환하려면
어디서부터 시작해야 하고, 얼마나 복잡할까?

모바일 앱 개발이 처음인 사람에게 설명해줄 수 있어?
```

### Q4: 주문 이력을 저장하고 싶어

**A:** 데이터베이스에 이미 저장되고 있습니다. 조회 페이지만 추가하면 됩니다.

**Claude에게:**
```
고객이 자신의 이전 주문 이력을 볼 수 있는 "나의 주문" 페이지를
새로 만들고 싶어. 

현재 orders 테이블에는 모든 주문이 저장되어 있고,
고객 정보와 연결할 수 있게 하려면?
```

---

## 🐛 문제 해결 (Troubleshooting)

### 문제: 프론트엔드가 백엔드와 연결 안 됨

```
콘솔에 "Failed to fetch" 에러가 보임
```

**해결 방법:**

```bash
# 1. 백엔드가 실행 중인지 확인
# 터미널에서 Ctrl+C로 멈춤

# 2. 다시 시작
cd backend
python -m uvicorn app.main:app --reload --port 8000

# 3. 프론트엔드 브라우저 새로고침 (F5)
```

### 문제: 데이터베이스 에러

```
"UndefinedColumn" 또는 "relation does not exist"
```

**해결 방법:**

```bash
# PostgreSQL 데이터베이스 재생성
psql -U postgres
DROP DATABASE cafe_db;
CREATE DATABASE cafe_db;
```

그 다음 백엔드를 다시 시작하면 자동으로 테이블이 생성됩니다.

### 문제: "venv not found"

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# 또는
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

---

## 📖 핵심 파일 설명

### Frontend

| 파일 | 역할 |
|------|------|
| `src/app/customer/page.tsx` | 🧑‍💼 고객 주문 화면 |
| `src/app/owner/page.tsx` | 👨‍💼 점주 관리 화면 |
| `src/lib/api.ts` | 🔌 백엔드와 통신 |
| `src/hooks/useWebSocket.ts` | 📡 실시간 데이터 받기 |

### Backend

| 파일 | 역할 |
|------|------|
| `app/main.py` | 🚀 서버 시작 |
| `app/routers/orders.py` | 📝 주문 API |
| `app/routers/menus.py` | 📋 메뉴 API |
| `app/websocket/manager.py` | 📡 실시간 연결 |

---

## 🌟 이 프로젝트로 배울 수 있는 것

| 기술 | 배우는 것 |
|------|----------|
| **Next.js** | 모던 웹 프론트엔드 |
| **FastAPI** | Python 백엔드 |
| **WebSocket** | 실시간 양방향 통신 |
| **PostgreSQL** | 관계형 데이터베이스 |
| **TypeScript** | 안전한 JavaScript |
| **Tailwind CSS** | 빠른 UI 디자인 |

---

## 📞 지원 및 커뮤니티

### 도움을 받을 수 있는 곳

1. **Claude AI** (이 프로젝트 최고의 튜터!)
   - https://claude.ai/code에서 프로젝트 폴더 열기
   - 파일을 직접 보여주고 수정 요청하기

2. **GitHub Discussions**
   - 이 레포의 Discussions 탭에서 질문하기

3. **한글 커뮤니티**
   - 점주 커뮤니티, 개발자 포럼 등 활용

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

---

## 🎉 다음 단계

### Level 1️⃣: 기본 커스터마이징 (1시간)
- [ ] 카페 이름 변경
- [ ] 메뉴 수정
- [ ] 색상 테마 변경

### Level 2️⃣: 기능 추가 (2-3시간)
- [ ] 로그인 기능
- [ ] 결제 연동
- [ ] 고객 리뷰

### Level 3️⃣: 고급 기능 (1주)
- [ ] 모바일 앱
- [ ] 분석 대시보드
- [ ] 매장 관리 (여러 매장 운영)

---

**이 시스템으로 당신의 카페를 디지털화하세요! 🚀☕**

Made with ❤️ using Claude AI

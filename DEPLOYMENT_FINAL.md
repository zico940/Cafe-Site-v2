# 🚀 카페 사이트 v2 최종 배포 완료

**배포 완료 날짜:** 2026-08-29  
**배포 상태:** ✅ 운영 중  
**GitHub 저장소:** https://github.com/zico940/Cafe-Site-v2

---

## 📊 배포 요약

### 구성 요소
| 구성 | 상태 | URL |
|---|---|---|
| **프론트엔드** | ✅ 운영 중 | http://61.83.220.103:3000 |
| **백엔드 API** | ✅ 운영 중 | http://61.83.220.103:8000 |
| **데이터베이스** | ✅ 운영 중 | PostgreSQL (aura_cafe) |
| **Nginx** | ✅ 운영 중 | 리버스 프록시 |

### 포트포워딩 설정
```
공인 IP: 61.83.220.103
├─ :3000 → 172.30.1.70:3000 (프론트엔드)
└─ :8000 → 172.30.1.70:8000 (백엔드)
```

---

## 🎯 배포된 기능

### ✅ 고객 주문 시스템
- 메뉴 브라우징 (12개 메뉴)
- 실시간 주문
- WebSocket 연결로 주문 상태 실시간 업데이트
- 카테고리별 필터링 (에스프레소, 우유 기반, 달콤한 음료, 비커피)

### ✅ 점주 대시보드
- 실시간 주문 관리
- 주문 상태 업데이트
- 메뉴 관리 (생성, 수정, 삭제)
- 메뉴 가용성 토글
- 데이터 갱신 상태 표시

### ✅ 개발자 모니터링
- 실시간 이벤트 로깅
- WebSocket 연결 상태 모니터링
- API 응답 통계

---

## 📋 배포된 메뉴 데이터

### 에스프레소 (3개)
1. 에스프레소 - 3,500원
2. 아메리카노 - 4,000원
3. 롱블랙 - 4,500원

### 우유 기반 음료 (3개)
4. 카페라떼 - 4,800원
5. 카푸치노 - 5,000원
6. 플랫화이트 - 5,500원

### 달콤한 음료 (3개)
7. 바닐라라떼 - 5,500원
8. 카라멜마키아토 - 6,000원
9. 카페모카 - 5,800원

### 비커피 음료 (3개)
10. 녹차라떼 - 5,500원
11. 초코라떼 - 5,500원
12. 허브티 - 4,500원

---

## 🔧 배포 기술 스택

### 프론트엔드
- **Framework:** Next.js 16.3.3
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **Networking:** Fetch API + WebSocket

### 백엔드
- **Framework:** FastAPI 0.115.0
- **Server:** Uvicorn 0.30.6
- **Database:** PostgreSQL 17
- **ORM:** SQLAlchemy 2.0.35
- **Real-time:** WebSocket

### 인프라
- **OS:** Debian Linux 13 (trixie)
- **Reverse Proxy:** Nginx
- **Process Manager:** systemd
- **Python:** 3.13.5
- **Node.js:** v20.20.2

---

## 📁 프로젝트 구조

```
/home/arduino/cafe-site-v2/
├── backend/
│   ├── app/
│   │   ├── main.py (FastAPI 메인)
│   │   ├── database.py (DB 연결)
│   │   ├── models/ (SQLAlchemy 모델)
│   │   ├── routers/ (API 라우트)
│   │   ├── schemas/ (요청/응답 스키마)
│   │   ├── websocket/ (WebSocket 관리)
│   │   └── events/ (이벤트 버스)
│   ├── requirements.txt
│   ├── .env.production (CORS, DB 설정)
│   └── venv/ (Python 가상환경)
├── frontend/
│   ├── src/
│   │   ├── app/ (페이지: customer, owner, dev-logs)
│   │   ├── components/ (UI 컴포넌트)
│   │   ├── hooks/ (WebSocket, API)
│   │   ├── lib/ (API 클라이언트, 상수)
│   │   └── types/ (TypeScript 타입)
│   ├── public/ (정적 파일)
│   ├── .next/ (빌드 결과물)
│   ├── package.json
│   ├── .env.production (API 엔드포인트)
│   └── node_modules/
├── cafe-backend.service (systemd 서비스)
├── cafe-frontend.service (systemd 서비스)
├── nginx-cafe-site.conf (리버스 프록시)
└── .git/
```

---

## 🔄 최종 배포 과정

### 1단계: 프로젝트 설정
- ✅ GitHub 저장소 생성 및 코드 푸시
- ✅ 개발 환경 구축

### 2단계: 실서버 배포
- ✅ 실서버에 프로젝트 복제
- ✅ PostgreSQL 데이터베이스 생성 (aura_cafe)
- ✅ 백엔드 Python 의존성 설치
- ✅ 프론트엔드 Node.js 의존성 설치
- ✅ 프로덕션 빌드 생성

### 3단계: 서비스 등록
- ✅ systemd 서비스 파일 생성 및 등록
- ✅ 백엔드 서비스 시작 (포트 8000)
- ✅ 프론트엔드 서비스 시작 (포트 3000)
- ✅ Nginx 리버스 프록시 설정

### 4단계: 데이터 마이그레이션
- ✅ 12개 메뉴 데이터 실서버 DB에 삽입
- ✅ 데이터 검증 완료

### 5단계: 포트포워딩 설정
- ✅ 공인 IP 포트포워딩 구성 (3000, 8000)
- ✅ CORS 설정 추가 (공인 IP 대응)
- ✅ 프론트엔드 환경변수 업데이트

---

## 🧪 최종 테스트 결과

### API 테스트
```bash
curl http://61.83.220.103:8000/api/menus
응답: 12개 메뉴 데이터 ✅
```

### 데이터베이스 테스트
```bash
SELECT COUNT(*) FROM menus;
결과: 12 ✅
```

### 서비스 상태
```
cafe-backend.service: active (running) ✅
cafe-frontend.service: active (running) ✅
PostgreSQL: active (running) ✅
Nginx: active (running) ✅
```

### CORS 테스트
```
Origin: http://61.83.220.103:3000
→ API 응답 성공 ✅
```

---

## 📊 환경 변수 설정

### 백엔드 (.env.production)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aura_cafe
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://100.80.214.126:3000,http://61.83.220.103:3000
FRONTEND_URL=http://61.83.220.103:3000
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=production
DEBUG=false
```

### 프론트엔드 (.env.production)
```env
NEXT_PUBLIC_API_URL=http://61.83.220.103:8000
NEXT_PUBLIC_WS_URL=ws://61.83.220.103:8000
```

---

## 🔐 보안 체크리스트

- ✅ CORS 설정으로 도메인 검증
- ✅ HTTP-only 쿠키 (개발 예정)
- ✅ 환경변수에서 민감 정보 분리
- ✅ 데이터베이스 연결 로컬 바인드
- ✅ 프로덕션 Debug 모드 비활성화

---

## 📈 성능 최적화

### 프론트엔드
- ✅ Next.js 정적 페이지 사전 렌더링
- ✅ 이미지 최적화
- ✅ CSS Tailwind 프로덕션 빌드

### 백엔드
- ✅ Uvicorn 멀티워커 설정
- ✅ 데이터베이스 커넥션 풀
- ✅ WebSocket 재연결 전략 (exponential backoff)

---

## 🚀 향후 개선 사항

### Phase 2
- [ ] HTTPS/SSL 인증서 추가
- [ ] 고객 인증 시스템 (로그인/회원가입)
- [ ] 결제 기능 (카카오페이, 토스페이)
- [ ] 주문 이력 관리

### Phase 3
- [ ] 모바일 앱 (React Native)
- [ ] 고객 리뷰 시스템
- [ ] AI 추천 엔진
- [ ] 분석 대시보드

---

## 📞 운영 가이드

### 서비스 제어
```bash
# 상태 확인
sudo systemctl status cafe-backend.service
sudo systemctl status cafe-frontend.service

# 시작/중지/재시작
sudo systemctl restart cafe-backend.service
sudo systemctl restart cafe-frontend.service

# 로그 확인
sudo journalctl -u cafe-backend.service -f
sudo journalctl -u cafe-frontend.service -f
```

### 데이터베이스 백업
```bash
sudo -u postgres pg_dump aura_cafe > backup_$(date +%Y%m%d).sql
```

### 배포 업데이트
```bash
cd /home/arduino/cafe-site-v2
git pull origin master
npm run build      # 프론트엔드
pip install -r requirements.txt  # 백엔드 (필요시)
sudo systemctl restart cafe-frontend.service
sudo systemctl restart cafe-backend.service
```

---

## 📚 문서 목록

| 문서 | 내용 |
|---|---|
| **README.md** | 프로젝트 개요 및 비개발자 가이드 |
| **QUICK_START.md** | 5분 안에 시작하기 |
| **DEPLOYMENT.md** | 배포 상세 가이드 |
| **MIGRATION.md** | 메뉴 데이터 마이그레이션 기록 |
| **GITHUB_SETUP.md** | GitHub 저장소 설정 방법 |
| **CONTRIBUTING.md** | 기여 가이드 |

---

## 🎉 배포 완료!

**모든 서비스가 정상적으로 운영 중입니다.**

- 프론트엔드: http://61.83.220.103:3000
- 백엔드 API: http://61.83.220.103:8000
- API 문서: http://61.83.220.103:8000/docs
- GitHub: https://github.com/zico940/Cafe-Site-v2

**축하합니다! 🎊**

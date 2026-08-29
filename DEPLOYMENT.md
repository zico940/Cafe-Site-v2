# 🚀 Cafe Site v2 실서버 배포 가이드

## 배포 완료 ✅

**배포 날짜:** 2026-08-29  
**배포 환경:** UnoQ 보드 (Debian Linux)  
**데이터베이스:** PostgreSQL 17 (aura_cafe)

---

## 📍 실서버 접속 정보

| 항목 | 값 |
|---|---|
| **IP 주소** | `172.30.1.70` (로컬) |
| **Tailscale IP** | `100.80.214.126` (원격) |
| **SSH 접속** | `ssh arduino@172.30.1.70` |
| **사용자** | `arduino` (sudo 권한 보유) |

---

## 🌐 서비스 접속 정보

### 프론트엔드 (Next.js)
```
로컬:    http://localhost:3000
외부:    http://100.80.214.126:3000
        (또는 http://172.30.1.70:3000)
```

### 백엔드 API (FastAPI)
```
직접 접속:    http://localhost:8000
외부 접속:    http://100.80.214.126:8000
API 문서:    http://100.80.214.126:8000/docs
```

### 데이터베이스 (PostgreSQL)
```
호스트:       localhost
포트:         5432
데이터베이스:  aura_cafe
사용자:       postgres
비밀번호:     postgres (기본 설정)
```

---

## 📦 배포된 파일 구조

```
/home/arduino/cafe-site-v2/
├── backend/                      # FastAPI 백엔드
│   ├── venv/                     # Python 가상환경
│   ├── app/
│   │   ├── main.py               # FastAPI 메인
│   │   ├── models.py             # SQLAlchemy 모델
│   │   └── routers/              # API 라우트
│   ├── requirements.txt
│   └── .env.production           # 프로덕션 환경 변수
├── frontend/                     # Next.js 프론트엔드
│   ├── node_modules/
│   ├── src/
│   ├── public/
│   ├── .next/                    # 빌드 결과물
│   ├── package.json
│   └── .env.production
├── cafe-backend.service          # systemd 서비스 (백엔드)
├── cafe-frontend.service         # systemd 서비스 (프론트엔드)
└── nginx-cafe-site.conf          # Nginx 리버스 프록시
```

---

## 🔧 systemd 서비스 관리

### 서비스 상태 확인
```bash
# 백엔드
sudo systemctl status cafe-backend.service

# 프론트엔드
sudo systemctl status cafe-frontend.service
```

### 서비스 시작/중지
```bash
# 백엔드
sudo systemctl start cafe-backend.service
sudo systemctl stop cafe-backend.service

# 프론트엔드
sudo systemctl start cafe-frontend.service
sudo systemctl stop cafe-frontend.service
```

### 자동 재시작 설정
```bash
# 부팅 시 자동 시작
sudo systemctl enable cafe-backend.service
sudo systemctl enable cafe-frontend.service

# 자동 시작 해제
sudo systemctl disable cafe-backend.service
sudo systemctl disable cafe-frontend.service
```

### 로그 확인
```bash
# 백엔드 로그
sudo journalctl -u cafe-backend.service -f

# 프론트엔드 로그
sudo journalctl -u cafe-frontend.service -f
```

---

## 🗄️ 데이터베이스 관리

### PostgreSQL 접속
```bash
# 실서버에서
sudo -u postgres psql -d aura_cafe

# 로컬에서 (원격)
psql -h 100.80.214.126 -U postgres -d aura_cafe
```

### 테이블 확인
```sql
-- 모든 테이블 나열
\dt

-- 테이블 스키마 확인
\d table_name
```

### 데이터베이스 백업
```bash
# 백업 생성
sudo -u postgres pg_dump aura_cafe > backup_aura_cafe_$(date +%Y%m%d).sql

# 백업 복원
sudo -u postgres psql aura_cafe < backup_aura_cafe_20260829.sql
```

---

## 🔄 배포 업데이트 절차

### 코드 업데이트
```bash
# 실서버에서 코드 가져오기
ssh arduino@172.30.1.70
cd /home/arduino/cafe-site-v2
git pull origin master
```

### 백엔드 업데이트
```bash
# 의존성 재설치 (필요시)
cd /home/arduino/cafe-site-v2/backend
source venv/bin/activate
pip install -r requirements.txt

# 서비스 재시작
sudo systemctl restart cafe-backend.service
```

### 프론트엔드 업데이트
```bash
# 의존성 재설치 (필요시)
cd /home/arduino/cafe-site-v2/frontend
npm install

# 빌드
npm run build

# 서비스 재시작
sudo systemctl restart cafe-frontend.service
```

---

## 🌍 Nginx 리버스 프록시

### 설정 파일 위치
```
/etc/nginx/sites-available/cafe-site
/etc/nginx/sites-enabled/cafe-site (심볼릭 링크)
```

### 설정 확인
```bash
sudo nginx -t
```

### Nginx 재시작
```bash
sudo systemctl reload nginx    # 설정 다시 로드 (무중단)
sudo systemctl restart nginx   # 완전 재시작
```

### 라우팅 규칙
```
http://100.80.214.126/        → 프론트엔드 (포트 3000)
http://100.80.214.126/api/    → 백엔드 API (포트 8000)
http://100.80.214.126/docs    → FastAPI Swagger (포트 8000)
http://100.80.214.126/ws/     → WebSocket (포트 8000)
```

---

## 🧪 배포 검증

### 서비스 포트 확인
```bash
sudo ss -tlnp | grep -E ':(3000|8000|5432)'
```

### 백엔드 응답 확인
```bash
curl -s http://localhost:8000/docs | head -10
curl -s http://localhost:8000/api/menu
```

### 프론트엔드 접속 확인
```bash
curl -s http://localhost:3000 | head -20
```

### 데이터베이스 연결 확인
```bash
sudo -u postgres psql -d aura_cafe -c "SELECT version();"
```

---

## 📝 환경 변수

### 백엔드 (.env.production)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aura_cafe
FRONTEND_URL=http://100.80.214.126:3000
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=production
DEBUG=false
```

### 프론트엔드 (.env.production)
```env
NEXT_PUBLIC_API_URL=http://100.80.214.126:8000
NEXT_PUBLIC_WS_URL=ws://100.80.214.126:8000
```

---

## 🐛 트러블슈팅

### 포트 충돌 (3000 또는 8000이 이미 사용 중)
```bash
# 포트를 사용 중인 프로세스 찾기
sudo lsof -i :3000
sudo lsof -i :8000

# 프로세스 종료
sudo kill -9 <PID>
```

### 데이터베이스 연결 실패
```bash
# PostgreSQL 서비스 상태 확인
sudo systemctl status postgresql@17-main.service

# PostgreSQL 재시작
sudo systemctl restart postgresql@17-main.service
```

### 서비스가 자동 재시작 루프에 빠짐
```bash
# 로그 확인
sudo journalctl -u cafe-backend.service -n 20

# 수동으로 테스트 실행 (환경 변수 확인)
cd /home/arduino/cafe-site-v2/backend
source venv/bin/activate
python -m uvicorn app.main:app --reload
```

### Nginx 프록시 오류
```bash
# Nginx 로그 확인
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# 설정 재검증
sudo nginx -t
```

---

## 📊 포트 현황

| 포트 | 서비스 | 상태 |
|---|---|---|
| 22 | SSH | ✅ 사용 중 |
| 80 | Nginx 리버스 프록시 | ✅ 사용 중 |
| 3000 | 프론트엔드 (Next.js) | ✅ 배포됨 |
| 5432 | PostgreSQL | ✅ 사용 중 |
| 8000 | 백엔드 (FastAPI) | ✅ 배포됨 |
| 8800 | Arduino App CLI | ✅ 사용 중 |
| 8887 | AgentVault 랜딩 | ✅ 사용 중 |
| 8888 | AgentVault API | ✅ 사용 중 |
| 9999 | UnoQ 모니터링 | ✅ 사용 중 |

---

## 🔐 보안 설정 권장사항

### 1. 데이터베이스 비밀번호 변경
```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'strong_password';"
```

### 2. HTTPS 설정 (SSL/TLS)
```bash
# Let's Encrypt를 이용한 자동 SSL 설정
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 3. 방화벽 설정
```bash
# ufw 활성화
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

---

## 📞 연락처 및 지원

- **GitHub 저장소:** https://github.com/zico940/Cafe-Site-v2
- **문제 보고:** GitHub Issues 탭
- **실서버 접속:** SSH `arduino@172.30.1.70`

---

**마지막 업데이트:** 2026-08-29  
**배포 상태:** ✅ 운영 중

# ⚡ 5분 안에 시작하기

> 비개발자도 5분 안에 카페 주문 시스템을 띄울 수 있습니다!

---

## 📋 필요한 것 (설치하기)

### 1️⃣ **Git** 설치 (소스 다운로드)
- Windows: https://git-scm.com/download/win → 기본값으로 설치
- Mac: `brew install git` (터미널에서)

### 2️⃣ **Node.js** 설치 (프론트엔드)
- https://nodejs.org → LTS 버전 다운로드 → 기본값으로 설치

### 3️⃣ **Python** 설치 (백엔드)
- https://www.python.org → 3.9 이상 → **"Add Python to PATH" 체크 후 설치**

### 4️⃣ **PostgreSQL** 설치 (데이터베이스)
- https://www.postgresql.org/download → 기본값으로 설치
- 설치 시 비밀번호는 `postgres` (간단하게)

### 5️⃣ **VS Code** (선택, 권장)
- https://code.visualstudio.com → 설치

---

## 🚀 30초 빠른 실행

### 터미널 2개 열기

**터미널 1 - 백엔드:**
```bash
cd "C:\AURA_모임\프로젝트\장세진\Cafe_Site_v2\backend"
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

**터미널 2 - 프론트엔드:**
```bash
cd "C:\AURA_모임\프로젝트\장세진\Cafe_Site_v2\frontend"
npm install
npm run dev
```

✅ **끝!** http://localhost:3000 방문하세요

---

## 🎮 실제로 사용해보기

| 하고 싶은 것 | URL | 설명 |
|-------------|-----|------|
| 🧑‍💼 메뉴 보고 주문 | http://localhost:3000 | "원하시는 음료를..." 페이지 |
| 👨‍💼 주문 받기 | http://localhost:3000/owner | 점주 대시보드 |
| 📊 실시간 모니터링 | http://localhost:3000/dev-logs | 개발자용 로그 |

---

## 📚 다음: 당신의 카페로 커스터마이징

### Claude AI를 사용해서 수정하기

1. **VS Code** 열기
2. 폴더 열기: `C:\AURA_모임\프로젝트\장세진\Cafe_Site_v2`
3. **Ctrl+Shift+P** → "Claude Code" 실행
4. Claude에게 물어보기:

```
내 카페 이름은 "[카페 이름]"이고,
- 주 색상: [색상]
- 특징: [한두 문장]

이 프로젝트의:
1. 제목을 우리 카페 이름으로 바꿔줄 수 있어?
2. 색상을 우리 색상으로 바꿔줄 수 있어?

아주 쉽게 단계별로 해줘.
```

---

## 🐛 자주 나는 에러

### ❌ "command not found: python"
**해결:** Python 재설치, "Add Python to PATH" 체크

### ❌ "npm: command not found"
**해결:** Node.js 재설치, 터미널 재시작

### ❌ "PostgreSQL connection error"
**해결:** PostgreSQL 실행 중인지 확인
```bash
# Windows 서비스 확인
services.msc → PostgreSQL 찾기 → 실행 중?
```

### ❌ "Port 3000 already in use"
**해결:** 이미 실행 중인 서버 종료
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

---

## 🎯 이 다음에 뭘 할까?

### 1시간 안에
- [ ] 카페 이름 변경
- [ ] 색상 변경
- [ ] 메뉴 추가/수정

### 오늘 중에
- [ ] 로그인 추가
- [ ] 알람음 설정
- [ ] 모바일 대응

### 이번 주
- [ ] 결제 기능 (카카오페이)
- [ ] 고객 리뷰
- [ ] 통계 대시보드

### Claude AI와 함께
각 항목마다 Claude에게:
```
[원하는 기능]을 추가하고 싶어.
어느 파일을 수정해야 하고, 어떻게 시작할까?

아주 쉽게 단계별로, 코드도 보여줘.
```

---

## 📱 프로덕션 배포 (온라인에 올리기)

### Vercel (프론트엔드)
```bash
cd frontend
npm install -g vercel
vercel
```

### Railway (백엔드)
```bash
# Railway CLI 설치 후
railway up
```

자세한 가이드: **[GITHUB_SETUP.md](./GITHUB_SETUP.md)**

---

## 💬 도움이 필요하신가요?

### 방법 1: Claude AI (가장 빠름!)
- VS Code에서 "Claude Code" 실행
- 문제 설명하기

### 방법 2: README 읽기
- 자세한 설명: **[README.md](./README.md)**
- 단계별 가이드: **[README.md의 "AI를 활용해서 직접 만들기"](./README.md#-ai를-활용해서-직접-만들기-비개발자-가이드)**

### 방법 3: GitHub Issues
- 이 저장소의 Issues 탭에서 질문

---

## ✅ 체크리스트

- [ ] Node.js 설치 완료
- [ ] Python 설치 완료
- [ ] PostgreSQL 설치 완료
- [ ] `npm install` 완료
- [ ] `pip install -r requirements.txt` 완료
- [ ] 터미널 2개에서 서버 실행 중
- [ ] http://localhost:3000 접속 가능
- [ ] 메뉴가 보임
- [ ] 주문 가능

**모든 체크박스에 ✅가 되면, 당신의 카페 시스템이 준비된 것입니다!**

---

**축하합니다! 이제 당신의 카페를 디지털화할 수 있습니다!** 🚀☕

다음: 📖 [자세한 README](./README.md) | 🛠️ [GitHub 설정](./GITHUB_SETUP.md)

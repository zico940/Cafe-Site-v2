# 🚀 GitHub에 푸시하는 방법

이미 로컬 저장소가 생성되었습니다! 이제 GitHub에 올리세요.

## 단계 1: GitHub 계정 만들기 (처음 하는 경우)

1. https://github.com/signup 방문
2. 이메일 입력하고 계정 생성
3. 이메일 인증하기

## 단계 2: 새로운 저장소 생성

1. GitHub에 로그인
2. 우측 상단 `+` 클릭 → "New repository"
3. 저장소 이름: `Cafe-Site-v2`
4. 설명: `Smart Cafe Self-Order System with Real-time Updates`
5. **Public** 선택 (공개 저장소)
6. "Create repository" 클릭

## 단계 3: 로컬에서 GitHub로 푸시

**PowerShell 또는 명령 프롬프트에서:**

```bash
cd "C:\AURA_모임\프로젝트\장세진\Cafe_Site_v2"

# 원격 저장소 추가 (your-username을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/your-username/Cafe-Site-v2.git

# 기본 브랜치를 main으로 변경
git branch -M main

# GitHub로 푸시
git push -u origin main
```

### 로그인 창이 나오면

1. **GitHub에 로그인** 창이 뜸
2. GitHub 계정으로 로그인
3. 또는 Personal Access Token 사용:
   - GitHub 설정 → Developer settings → Personal access tokens
   - 새 토큰 생성 (repo 권한)
   - 토큰 값 복사
   - 비밀번호 대신 붙여넣기

## 단계 4: 확인

GitHub 사이트에서:
1. your-username/Cafe-Site-v2 저장소 방문
2. 모든 파일이 업로드되었는지 확인
3. README.md가 보이는지 확인

✅ 완료!

---

## 이후 업데이트하기

코드를 수정한 후 GitHub에 업로드:

```bash
cd "C:\AURA_모임\프로젝트\장세진\Cafe_Site_v2"

# 변경사항 확인
git status

# 모든 파일 스테이징
git add -A

# 커밋
git commit -m "feat: 고객 이름 입력 기능 추가"

# 푸시
git push
```

---

## 문제 해결

### Q: "fatal: could not read Username"
**A:** Personal Access Token을 사용하세요 (위 참조)

### Q: "permission denied"
**A:** SSH 키 설정:
```bash
ssh-keygen -t rsa -b 4096
# GitHub에 공개 키 등록
```

### Q: 이전 커밋을 수정하고 싶어요
```bash
git add .
git commit --amend --no-edit
git push --force-with-lease
```

---

**축하합니다! 이제 당신의 프로젝트가 전 세계에 공개됩니다!** 🎉

더 자세한 정보: https://docs.github.com/en/get-started

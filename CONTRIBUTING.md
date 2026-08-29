# 🤝 기여하는 방법

이 프로젝트에 기여하고 싶으신가요? 완벽합니다! 여기 가이드가 있습니다.

## 🎯 기여할 수 있는 분야

### 코드 개선
- 버그 수정
- 성능 최적화
- 새로운 기능 추가

### 문서 개선
- README 번역
- 튜토리얼 작성
- 설명 개선

### 테스트
- 버그 찾기
- 새로운 기능 테스트
- 문제 리포팅

### UI/UX 개선
- 디자인 제안
- 사용성 개선
- 접근성 향상

## 📝 코드 기여 단계

### 1단계: Fork 하기

```bash
# GitHub에서 "Fork" 버튼 클릭
# 그러면 your-username/Cafe-Site-v2로 복사됨
```

### 2단계: 로컬에 복제

```bash
git clone https://github.com/your-username/Cafe-Site-v2.git
cd Cafe-Site-v2
git remote add upstream https://github.com/original-owner/Cafe-Site-v2.git
```

### 3단계: 새 브랜치 생성

```bash
git checkout -b fix/add-customer-name
# 또는
git checkout -b feature/kakao-pay-integration
```

**브랜치 이름 규칙:**
- `fix/` - 버그 수정
- `feature/` - 새 기능
- `docs/` - 문서 개선
- `refactor/` - 코드 정리

### 4단계: 코드 수정

**Claude AI 활용 팁:**

```
Claude 코드 에디터에서:

1. 프로젝트 폴더 열기
2. "파일 [경로]를 수정해줄 수 있어?"라고 물어보기
3. 원하는 변경사항 설명하기
4. Claude가 수정한 코드 검토하고 승인하기
```

### 5단계: 테스트

```bash
# 프론트엔드
cd frontend
npm run dev
# http://localhost:3000에서 테스트

# 백엔드
cd backend
python -m uvicorn app.main:app --reload
# http://localhost:8000/docs에서 API 테스트
```

### 6단계: Commit

```bash
git add .
git commit -m "fix: 고객 이름 입력 필드 추가

- 주문 시 고객 이름 입력받음
- customer/page.tsx 수정
- owner/page.tsx에서 고객 이름 표시"
```

**Commit 메시지 규칙:**
- `fix:` - 버그 수정
- `feat:` - 새 기능
- `docs:` - 문서 변경
- `refactor:` - 코드 재구성 (기능 변화 없음)
- `test:` - 테스트 추가
- `style:` - 코드 스타일 변경

### 7단계: Push

```bash
git push origin fix/add-customer-name
```

### 8단계: Pull Request 생성

1. GitHub 사이트 방문
2. "Compare & pull request" 클릭
3. 제목 입력: `고객 이름 입력 기능 추가`
4. 설명 작성:

```
## 변경사항
- 고객이 주문할 때 이름을 입력하도록 함

## 관련 이슈
Closes #15

## 테스트
- [x] 로컬에서 테스트 완료
- [x] 모바일에서 테스트 완료

## 스크린샷
[변경 전 후 이미지]
```

5. "Create pull request" 클릭

### 9단계: Review 받기

- 코드 리뷰 기다리기
- 피드백 반영하기
- 다시 Push하기 (자동으로 PR 업데이트됨)

### 10단계: Merge

- 리뷰 통과 후 자동으로 Merge됨
- 축하합니다! 🎉

---

## 📋 체크리스트

코드 제출 전 확인하세요:

- [ ] 코드가 작동하는가?
- [ ] 다른 기능을 깨뜨리지는 않는가?
- [ ] Commit 메시지가 명확한가?
- [ ] README를 업데이트했는가? (필요하면)
- [ ] 테스트를 추가했는가? (필요하면)

---

## 🚫 피해야 할 것

❌ 직접 main/master에 Push
❌ 큰 기능을 한 번에 Submit
❌ 다른 사람이 작업 중인 파일 수정
❌ 자신의 코드만 리뷰하지 않기

---

## 💬 질문이 있으신가요?

1. **GitHub Issues** 탭에서 질문하기
2. **Discussions** 탭에서 토론하기
3. **Claude AI**에게 물어보기

---

## 🌟 성공한 기여자들

이 섹션은 우리 커뮤니티 멤버들을 소개합니다!

| 기여자 | 기여 내용 |
|--------|---------|
| @your-name | 첫 기여자! 🎉 |

---

**감사합니다! 당신의 기여가 프로젝트를 더 좋게 만듭니다.** ❤️

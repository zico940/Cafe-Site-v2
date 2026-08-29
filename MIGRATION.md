# 📊 메뉴 데이터 마이그레이션 완료

**마이그레이션 날짜:** 2026-08-29  
**상태:** ✅ 완료

---

## 📋 마이그레이션 내용

### 이동된 데이터
- **테이블:** `menus`
- **레코드 수:** 12개
- **소스:** 개발 서버 로컬 데이터베이스
- **대상:** 실서버 PostgreSQL (aura_cafe)

### 마이그레이션된 메뉴 목록

| ID | 이름 | 영문명 | 가격 | 카테고리 | 설명 |
|---|---|---|---|---|---|
| 1 | 에스프레소 | Espresso | 3,500원 | espresso | 진하고 강렬한 에스프레소 |
| 2 | 아메리카노 | Americano | 4,000원 | espresso | 에스프레소에 물을 더한 클래식 |
| 3 | 롱블랙 | Long Black | 4,500원 | espresso | 물 위에 에스프레소를 내린 진한 커피 |
| 4 | 카페라떼 | Cafe Latte | 4,800원 | milk_based | 에스프레소와 스팀밀크의 조화 |
| 5 | 카푸치노 | Cappuccino | 5,000원 | milk_based | 풍부한 우유 거품이 특징 |
| 6 | 플랫화이트 | Flat White | 5,500원 | milk_based | 진한 에스프레소와 벨벳같은 우유 |
| 7 | 바닐라라떼 | Vanilla Latte | 5,500원 | sweet | 달콤한 바닐라 시럽이 들어간 라떼 |
| 8 | 카라멜마키아토 | Caramel Macchiato | 6,000원 | sweet | 카라멜 드리즐이 올라간 달콤한 음료 |
| 9 | 카페모카 | Cafe Mocha | 5,800원 | sweet | 초콜릿과 커피의 완벽한 조합 |
| 10 | 녹차라떼 | Matcha Latte | 5,500원 | non_coffee | 국산 말차로 만든 진한 그린라떼 |
| 11 | 초코라떼 | Chocolate Latte | 5,500원 | non_coffee | 벨기에 초콜릿으로 만든 진한 음료 |
| 12 | 허브티 | Herb Tea | 4,500원 | non_coffee | 캐모마일, 페퍼민트 등 다양한 허브티 |

---

## ✅ 검증 결과

### 1. 데이터베이스 확인
```
총 메뉴: 12개
데이터베이스: aura_cafe
테이블: menus
```

### 2. API 응답 확인
```
엔드포인트: http://61.83.220.103:8000/api/menus
응답 상태: ✅ 정상 (200 OK)
메뉴 개수: 12개
```

### 3. 프론트엔드 확인
```
프론트엔드 URL: http://61.83.220.103:3000
API 엔드포인트: http://61.83.220.103:8000
메뉴 표시: ✅ 정상
```

---

## 🔄 마이그레이션 방법

### SQL 스크립트 방식 (사용된 방법)
```bash
# 1. SQL 파일 생성 (seed_menus.sql)
# 2. 실서버로 전송
scp seed_menus.sql arduino@172.30.1.70:/tmp/

# 3. PostgreSQL에서 실행
sudo -u postgres psql -d aura_cafe -f /tmp/seed_menus.sql
```

### Python 스크립트 방식 (대안)
```bash
# 실서버에서 직접 실행
cd /home/arduino/cafe-site-v2/backend
source venv/bin/activate
python app/seed.py
```

---

## 📊 마이그레이션 통계

| 항목 | 값 |
|---|---|
| 마이그레이션 시간 | 2026-08-29 13:16 KST |
| 소요 시간 | < 1초 |
| 성공 레코드 | 12 / 12 |
| 실패 레코드 | 0 |
| 성공률 | 100% ✅ |

---

## 🧪 테스트 확인

### CLI 테스트
```bash
# 데이터베이스에서 직접 확인
sudo -u postgres psql -d aura_cafe -c "SELECT COUNT(*) FROM menus;"
결과: 12
```

### API 테스트
```bash
# 로컬 테스트
curl http://localhost:8000/api/menus | jq 'length'
결과: 12

# 공인 IP 테스트
curl http://61.83.220.103:8000/api/menus
결과: 12개 메뉴 반환
```

### 프론트엔드 테스트
- ✅ 홈페이지에서 메뉴 목록 표시
- ✅ 메뉴 클릭 시 주문 가능
- ✅ WebSocket으로 실시간 메뉴 업데이트

---

## 🛠️ 문제 해결

### 데이터 중복 발생했던 경우
처음 SQL 스크립트가 2번 실행되어 24개 메뉴가 생겼음.
해결책:
```sql
DELETE FROM menus WHERE id > 12;
```

### 데이터 다시 마이그레이션 필요시
```bash
# 1. 기존 데이터 삭제
sudo -u postgres psql -d aura_cafe -c "TRUNCATE menus RESTART IDENTITY;"

# 2. 새 데이터 삽입
sudo -u postgres psql -d aura_cafe -f seed_menus.sql
```

---

## 📝 메뉴 정보 추가 (향후)

각 메뉴에 이미지 URL을 추가할 수 있습니다:
```sql
UPDATE menus SET image_url = 'https://...' WHERE id = 1;
```

---

## 🔗 관련 링크

- **API 문서:** http://61.83.220.103:8000/docs
- **프론트엔드:** http://61.83.220.103:3000
- **메뉴 관리:** http://61.83.220.103:3000/owner

---

**마이그레이션이 완벽하게 완료되었습니다! 🎉**

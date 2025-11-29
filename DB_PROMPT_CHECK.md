# DB 프롬프트 확인 방법

## 방법 1: Supabase 대시보드에서 확인

### ⚠️ 중요: 스키마 화면이 아닌 데이터 화면으로 이동해야 합니다!

### 1단계: Supabase 대시보드 접속
1. **https://supabase.com** 접속
2. 로그인 후 프로젝트 선택 (`jeongwoo-coating`)

### 2단계: Table Editor에서 데이터 확인
1. 왼쪽 메뉴에서 **"Table Editor"** 클릭
2. 테이블 목록에서 **`chatbot_settings`** 클릭
3. **중요**: 현재 스키마 화면이 보인다면:
   - 상단에 **"Table Editor"** 탭과 **"Data"** 탭이 있을 수 있습니다 → **"Data"** 탭 클릭
   - 또는 테이블 이름 옆에 있는 **"View data"** 또는 **"Browse"** 버튼 클릭
   - 또는 테이블 이름을 다시 클릭하면 데이터 화면으로 전환됩니다
4. 데이터 화면에서 확인:
   - 행(row)이 보이면: `company_id`, `setting_key`, `setting_value` 등의 값이 표시됩니다
   - 행이 없으면: 아직 데이터가 저장되지 않은 것입니다

### 3단계: 프롬프트 내용 확인
- `setting_value` 컬럼의 셀을 클릭하면 전체 내용을 편집 모드로 볼 수 있습니다
- 텍스트가 길 경우 스크롤하여 전체 내용 확인 가능
- 또는 셀을 더블클릭하면 전체 텍스트가 표시됩니다

---

## 방법 2: SQL Editor에서 쿼리로 확인

### 1단계: SQL Editor 접속
1. Supabase 대시보드에서 **"SQL Editor"** 클릭
2. **"New query"** 클릭

### 2단계: 쿼리 실행
다음 SQL 쿼리를 복사하여 실행:

```sql
-- 프롬프트 조회
SELECT 
  id,
  company_id,
  setting_key,
  setting_value,
  LENGTH(setting_value) as prompt_length,
  created_at,
  updated_at
FROM chatbot_settings
WHERE company_id = 'jeongwoo' 
  AND setting_key = 'quote_prompt';
```

### 3단계: 결과 확인
- `setting_value` 컬럼에 저장된 프롬프트 전체 내용이 표시됩니다
- `prompt_length`로 문자 수 확인 가능

---

## 방법 3: 관리자 페이지에서 확인 (웹 인터페이스)

### 1단계: 관리자 페이지 접속
1. **https://jeongwoo-coating.vercel.app/admin/chatbot-prompt** 접속
2. 관리자 비밀번호 입력하여 로그인

### 2단계: 프롬프트 확인
- 페이지 중앙의 큰 텍스트 영역에 DB에 저장된 프롬프트가 표시됩니다
- 스크롤하여 전체 내용 확인 가능
- 하단에 "문자 수"와 "마지막 수정" 시간 표시

### 3단계: 상태 확인
- 페이지 하단의 "상태" 표시 확인:
  - `✅ DB 프롬프트 사용 중` → DB에서 로드됨
  - `⚠️ 기본 프롬프트 사용 중` → DB에 없어 기본값 사용

---

## 방법 4: 브라우저 콘솔에서 확인 (개발자용)

### 1단계: 개발자 도구 열기
1. 관리자 페이지 접속
2. **F12** 또는 **우클릭 → 검사** 클릭
3. **Console** 탭 선택

### 2단계: 로그 확인
다음 로그 메시지 확인:
- `✅ DB에서 프롬프트를 성공적으로 가져왔습니다.` → 성공
- `프롬프트 길이: XXXX자` → 실제 저장된 프롬프트 길이

---

## 문제 해결

### DB에 프롬프트가 없는 경우
1. 관리자 페이지에서 프롬프트 입력
2. "저장하기" 클릭
3. 저장 성공 메시지 확인
4. Supabase Table Editor에서 다시 확인

### 프롬프트가 일부만 보이는 경우
1. Supabase Table Editor에서 `setting_value` 컬럼 전체 확인
2. 관리자 페이지의 textarea에서 스크롤하여 전체 확인
3. 브라우저 콘솔에서 프롬프트 길이 확인

### 프롬프트가 업데이트되지 않는 경우
1. Supabase Table Editor에서 `updated_at` 시간 확인
2. 관리자 페이지에서 "저장하기" 클릭 후 다시 확인
3. 브라우저 캐시 삭제 후 새로고침


# Supabase 설정 가이드

## 🚀 **Supabase 프로젝트 생성**

### **1단계: Supabase 가입**
1. **https://supabase.com** 접속
2. **"Start your project"** 버튼 클릭
3. **GitHub 계정으로 가입** (추천)

### **2단계: 새 프로젝트 생성**
1. **"New project"** 클릭
2. **조직 선택**: 개인 계정 또는 새 조직 생성
3. **프로젝트 이름**: `jeongwoo-coating`
4. **데이터베이스 비밀번호**: 안전한 비밀번호 설정
5. **리전 선택**: `Asia Northeast (Seoul)` 또는 `Asia Northeast (Tokyo)`
6. **"Create new project"** 클릭

### **3단계: 프로젝트 생성 완료**
- 약 2-3분 소요
- 생성 완료 후 대시보드로 이동

---

## 🗄️ **데이터베이스 스키마 설정**

### **1단계: SQL 에디터 접속**
1. Supabase 대시보드에서 **"SQL Editor"** 클릭
2. **"New query"** 클릭

### **2단계: 스키마 실행**
1. `supabase-schema.sql` 파일 내용을 복사
2. SQL 에디터에 붙여넣기
3. **"Run"** 버튼 클릭

### **3단계: 챗봇 관련 테이블 생성**
1. `supabase-chatbot-tables.sql` 파일 내용을 복사
2. SQL 에디터에 붙여넣기
3. **"Run"** 버튼 클릭

### **4단계: 챗봇 설정 테이블 생성**
1. `supabase-chatbot-settings.sql` 파일 내용을 복사
2. SQL 에디터에 붙여넣기
3. **"Run"** 버튼 클릭

### **5단계: 테이블 확인**
1. **"Table Editor"** 클릭
2. 다음 테이블들이 생성되었는지 확인:
   - `companies`
   - `users`
   - `posts`
   - `chatbot_sessions`
   - `chatbot_messages`
   - `chatbot_knowledge_base`
   - `chatbot_settings` ⭐ (관리자 프롬프트 저장용)

---

## 🔑 **환경변수 설정**

### **1단계: API 키 확인**
1. Supabase 대시보드에서 **"Settings"** → **"API"** 클릭
2. 다음 정보 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **2단계: 로컬 환경변수 설정**
1. `env.example` 파일을 `.env.local`로 복사:
   ```bash
   cp env.example .env.local
   ```

2. `.env.local` 파일에 실제 값 입력:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### **3단계: Vercel 환경변수 설정**
1. Vercel 대시보드 → 프로젝트 → **"Settings"** → **"Environment Variables"**
2. 다음 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `your_anon_key_here`

---

## 🎯 **기능 테스트**

### **1단계: 로컬 테스트**
```bash
npm run dev
```

### **2단계: 게시판 테스트**
1. **http://localhost:3000/board** 접속
2. **"글 작성하기"** 클릭
3. 테스트 게시글 작성
4. 작성 완료 후 목록에서 확인

### **3단계: 관리자 페이지 테스트**
1. **http://localhost:3000/admin** 접속
2. 작성된 게시글 확인
3. **"승인"** 버튼 클릭
4. 게시판에서 승인된 게시글 확인

---

## 🔒 **보안 설정**

### **Row Level Security (RLS)**
- 모든 테이블에 RLS가 활성화되어 있습니다
- 승인된 게시글만 공개적으로 조회 가능
- 사용자는 본인 데이터만 수정 가능

### **API 키 보안**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 공개 키입니다
- 프론트엔드에서 사용해도 안전합니다
- 민감한 작업은 서버 사이드에서 처리됩니다

---

## 📊 **무료 플랜 제한사항**

### **월 사용량 제한**
- **API 요청**: 50,000회/월
- **데이터베이스 크기**: 500MB
- **대역폭**: 2GB/월
- **실시간 연결**: 200개

### **정우특수코팅 예상 사용량**
- 게시글 작성: 월 100개
- 게시글 조회: 월 5,000개
- 관리자 작업: 월 200개
- **총 사용량**: 월 5,300개 (무료 한도의 10.6%)

---

## 🚨 **문제 해결**

### **연결 오류**
```bash
# 환경변수 확인
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### **데이터베이스 오류**
1. Supabase 대시보드 → **"Table Editor"** 확인
2. 테이블이 생성되었는지 확인
3. 초기 데이터(`companies` 테이블)가 있는지 확인

### **권한 오류**
1. Supabase 대시보드 → **"Authentication"** → **"Policies"** 확인
2. RLS 정책이 올바르게 설정되었는지 확인

---

## 🎉 **완료!**

Supabase 설정이 완료되었습니다!

**다음 단계:**
1. ✅ Supabase 프로젝트 생성
2. ✅ 데이터베이스 스키마 설정
3. ✅ 환경변수 설정
4. ✅ 기능 테스트
5. 🚀 **배포 및 운영 시작!**

**지원:**
- Supabase 문서: https://supabase.com/docs
- 커뮤니티: https://github.com/supabase/supabase/discussions

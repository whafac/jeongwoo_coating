# PDF 업로드 및 분석 기능 구현 계획 (NotebookLM 스타일)

## 🎯 목표

NotebookLM처럼 PDF 파일을 업로드하고, 업로드한 파일의 내용을 분석하여 챗봇이 해당 내용을 기반으로 답변할 수 있도록 구현

## 📋 현재 구조 분석

### ✅ 이미 구현된 기능
- 지식베이스 테이블 (`chatbot_knowledge_base`)
- 지식베이스 검색 기능 (`searchKnowledgeBase`)
- Gemini API 통합
- 파일 업로드 인프라 (Supabase Storage 가능)

### ❌ 추가 필요한 기능
- PDF 파일 업로드 UI
- PDF 텍스트 추출
- 추출한 텍스트를 지식베이스에 자동 저장
- 업로드한 문서를 컨텍스트로 활용

## 🏗️ 구현 방안

### 방안 1: 지식베이스에 자동 저장 (추천)
**장점:**
- 기존 지식베이스 구조 활용
- 문서 내용이 영구적으로 저장됨
- 검색 기능 자동 활용
- 관리자 페이지에서 관리 가능

**구현:**
1. PDF 업로드 → 텍스트 추출 → 지식베이스에 저장
2. 챗봇 질문 시 지식베이스 검색으로 관련 내용 찾기
3. 찾은 내용을 Gemini API 컨텍스트로 제공

### 방안 2: 세션별 임시 컨텍스트
**장점:**
- 빠른 구현
- 세션별로 독립적인 문서 관리

**단점:**
- 세션 종료 시 내용 삭제
- 검색 기능 제한적

### 방안 3: 하이브리드 (추천)
**구현:**
1. PDF 업로드 → 텍스트 추출
2. 지식베이스에 저장 (영구 보관)
3. 세션별로 "활성 문서" 지정 가능
4. 활성 문서는 우선순위 높게 검색

## 📦 필요한 패키지

```bash
npm install pdf-parse
npm install @types/pdf-parse --save-dev
```

## 🔧 구현 단계

### Step 1: PDF 파싱 라이브러리 설치
```bash
npm install pdf-parse
```

### Step 2: 파일 업로드 API 생성
`app/api/admin/chatbot/upload-document/route.ts` 생성

**기능:**
- PDF 파일 업로드 받기
- PDF 텍스트 추출
- 지식베이스에 저장
- 파일 메타데이터 저장

### Step 3: PDF 텍스트 추출 함수
`lib/pdf-parser.ts` 생성

**기능:**
- PDF 파일에서 텍스트 추출
- 페이지별 분할 (선택적)
- 메타데이터 추출 (제목, 작성자 등)

### Step 4: 지식베이스 자동 저장
업로드한 PDF 내용을 자동으로 지식베이스에 저장

**저장 형식:**
- title: PDF 파일명 또는 첫 페이지 제목
- content: 추출한 전체 텍스트
- category: "업로드 문서"
- tags: 자동 추출된 키워드
- source_file: 원본 파일명

### Step 5: 관리자 페이지에 업로드 UI 추가
`app/admin/chatbot-documents/page.tsx` 생성

**기능:**
- PDF 파일 업로드
- 업로드한 문서 목록
- 문서 삭제/수정
- 문서 내용 미리보기

### Step 6: 챗봇 응답 생성 시 문서 활용
기존 `searchKnowledgeBase` 함수 활용
- 업로드한 문서도 자동으로 검색됨
- 관련 내용이 있으면 컨텍스트로 제공

## 📝 데이터베이스 스키마 확장

### 옵션 1: 기존 테이블 활용
`chatbot_knowledge_base` 테이블에 필드 추가:
- `source_type`: 'manual' | 'uploaded_pdf'
- `source_file`: 원본 파일명
- `uploaded_at`: 업로드 시간

### 옵션 2: 새 테이블 생성 (선택적)
```sql
CREATE TABLE chatbot_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT, -- Supabase Storage 경로
  extracted_text TEXT NOT NULL,
  page_count INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

## 🎨 UI 구성

### 관리자 페이지
1. **문서 업로드 섹션**
   - 드래그 앤 드롭 또는 파일 선택
   - PDF 파일만 허용
   - 업로드 진행률 표시

2. **문서 목록**
   - 업로드한 문서 목록
   - 문서명, 업로드 날짜, 페이지 수
   - 삭제/다시 업로드 버튼

3. **문서 미리보기**
   - 추출한 텍스트 미리보기
   - 수정 가능 (선택적)

### 챗봇 UI (선택적)
- "문서 업로드" 버튼 (관리자만)
- 현재 활성 문서 표시

## 🔍 검색 개선

### 기존 검색 기능 활용
- 업로드한 PDF 내용도 자동으로 검색됨
- `searchKnowledgeBase` 함수가 자동으로 매칭

### 개선 사항
- PDF 내용은 더 긴 텍스트일 수 있으므로:
  - 청크 단위로 분할 (페이지별 또는 섹션별)
  - 각 청크를 별도 지식베이스 항목으로 저장
  - 검색 시 관련 청크만 반환

## 📊 예상 동작 흐름

### 1. 문서 업로드
```
사용자 → PDF 업로드
  ↓
서버 → PDF 텍스트 추출
  ↓
서버 → 지식베이스에 저장
  ↓
성공 메시지 표시
```

### 2. 챗봇 질문
```
사용자 → "라미네이팅 견적이 궁금해요"
  ↓
서버 → 지식베이스 검색 (업로드한 PDF 포함)
  ↓
서버 → 관련 내용 찾기
  ↓
Gemini API → 찾은 내용을 컨텍스트로 제공
  ↓
사용자 → PDF 내용 기반 답변 받기
```

## ⚠️ 주의사항

### 1. 파일 크기 제한
- PDF 파일 크기 제한 (예: 10MB)
- 큰 파일은 청크 단위로 처리

### 2. 텍스트 추출 품질
- PDF 형식에 따라 추출 품질이 다를 수 있음
- 이미지 기반 PDF는 OCR 필요 (추후 구현)

### 3. 토큰 제한
- Gemini API 토큰 제한 고려
- 긴 문서는 요약하거나 청크 단위로 처리

### 4. 보안
- 관리자만 업로드 가능
- 파일 타입 검증 (PDF만)
- 파일 크기 제한

## 🚀 구현 우선순위

### Phase 1: 기본 기능 (1-2일)
1. PDF 파싱 라이브러리 설치
2. 파일 업로드 API 생성
3. 텍스트 추출 및 지식베이스 저장
4. 관리자 페이지 업로드 UI

### Phase 2: 개선 (2-3일)
1. 문서 목록 및 관리 UI
2. 청크 단위 분할
3. 검색 개선

### Phase 3: 고급 기능 (선택적)
1. OCR 지원 (이미지 PDF)
2. 다중 문서 관리
3. 문서 버전 관리

## 💡 NotebookLM과의 차이점

### NotebookLM
- 문서를 직접 분석하여 답변 생성
- 문서 간 연결 및 참조
- 실시간 문서 업데이트

### 우리 구현
- 지식베이스에 저장 후 검색 기반 활용
- 기존 지식베이스와 통합
- 관리자 페이지에서 관리

## ✅ 구현 가능 여부

**완전히 가능합니다!**

현재 구조가 이미 지식베이스 기능을 가지고 있어서, PDF 업로드 및 텍스트 추출만 추가하면 NotebookLM과 유사한 기능을 구현할 수 있습니다.

구현을 시작할까요? 🚀


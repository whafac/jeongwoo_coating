# Gemini Pro 챗봇 연동 가이드

## 🎯 개요

정우코팅 챗봇이 Gemini Pro로 전환되었습니다. NotebookLM과 동일한 모델을 사용하여 더 효율적인 답변을 제공합니다.

## 📋 설정 방법

### 1. Google AI Studio에서 API 키 발급

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. Google 계정으로 로그인
3. "Create API Key" 클릭
4. API 키 복사

### 2. 환경 변수 설정

#### 로컬 개발 환경 (`.env.local`)

`.env.local` 파일을 생성하거나 수정:

```env
# Google Gemini API 설정
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API 설정 (주석 처리 - 나중에 되돌릴 수 있도록 보존)
# OPENAI_API_KEY=your_openai_api_key_here
# OPENAI_MODEL=gpt-3.5-turbo
```

#### Vercel 배포 환경

1. Vercel 대시보드 접속
2. 프로젝트 선택
3. Settings → Environment Variables
4. 다음 변수 추가:
   - `GEMINI_API_KEY`: 발급받은 Gemini API 키
5. 재배포

## 🔄 ChatGPT로 되돌리기 (필요시)

### 방법 1: 환경 변수만 변경

`.env.local` 파일 수정:

```env
# Gemini API 주석 처리
# GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API 활성화
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
```

그리고 `app/api/chatbot/send/route.ts` 파일 수정:

```typescript
// Gemini 주석 처리
// import { generateChatbotResponse, calculateTokenUsage, calculateCost } from '@/lib/gemini';

// ChatGPT 활성화
import { generateChatbotResponse, calculateTokenUsage, calculateCost, generateQuoteResponse } from '@/lib/openai';
```

그리고 `lib/openai.ts` 파일에서 주석 처리된 ChatGPT 코드를 활성화:

```typescript
// 주석 처리된 부분의 /* */ 제거
```

### 방법 2: 코드 수정

`lib/openai.ts` 파일에서 주석 처리된 ChatGPT API 코드를 찾아서 활성화하고, `lib/gemini.ts` 관련 코드를 주석 처리합니다.

## 📊 비용 비교

### Gemini Pro
- 입력: $0.003 / 1K 토큰
- 출력: $0.012 / 1K 토큰
- GPT-3.5 대비: 약 6.75배

### 예상 월 비용 (월 3,000회 대화 기준)
- **Gemini Pro**: 약 $16.2/월
- **GPT-3.5 Turbo**: 약 $2.4/월

## ✅ 검증 방법

### 1. 로컬 테스트

```bash
npm run dev
```

챗봇에서 다음 질문으로 테스트:
- "견적이 궁금해요"
- "연락처 알려줘"
- "파일 제출 방법"

### 2. 답변 품질 확인

- ✅ 간결한 답변 (2-3줄 이내)
- ✅ 프롬프트 내용 준수
- ✅ 불필요한 정보 제거
- ✅ NotebookLM과 유사한 수준

## 🐛 문제 해결

### 에러: "GEMINI_API_KEY is not defined"

**해결**: `.env.local` 파일에 `GEMINI_API_KEY` 추가 후 서버 재시작

### 에러: "Gemini API 응답이 비어있습니다"

**해결**: 
1. API 키 확인
2. Google AI Studio에서 API 사용량 확인
3. 네트워크 연결 확인

### ChatGPT로 되돌리고 싶어요

위의 "ChatGPT로 되돌리기" 섹션 참고

## 📝 참고 사항

1. **ChatGPT 코드 보존**: 모든 ChatGPT 관련 코드는 주석 처리되어 보존되어 있습니다.
2. **Fallback 로직**: Gemini API가 실패하면 자동으로 프롬프트 기반 답변을 생성합니다.
3. **비용 모니터링**: Google Cloud Console에서 API 사용량을 모니터링하세요.

## 🎉 완료!

이제 Gemini Pro로 챗봇이 작동합니다. NotebookLM과 유사한 수준의 효율적인 답변을 제공합니다!


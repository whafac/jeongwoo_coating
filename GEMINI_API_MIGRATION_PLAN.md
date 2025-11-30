# Gemini API 전환 계획: NotebookLM 수준의 효율적 답변 구현

## 🔍 핵심 발견: 실험 결과 분석

### 실험 조건
- **동일한 프롬프트**: 현재 DB에 저장된 프롬프트를 PDF로 변환
- **NotebookLM**: PDF 업로드 후 질문 테스트
- **현재 챗봇**: ChatGPT API 사용

### 실험 결과
- ✅ **NotebookLM**: 간결하고 맥락을 이해한 효율적인 답변
- ❌ **현재 챗봇**: 같은 프롬프트임에도 불구하고 비효율적인 답변

### 결론
**이것은 프롬프트 구조 문제가 아니라 모델/API의 차이입니다.**

같은 프롬프트를 사용했는데 결과가 다르다면:
- ✅ NotebookLM (Gemini 기반)은 프롬프트를 더 잘 이해하고 준수
- ❌ ChatGPT API (GPT-3.5-turbo)는 같은 프롬프트를 제대로 활용하지 못함

---

## 💡 왜 이런 차이가 발생하는가?

### 1. 모델의 프롬프트 이해 능력 차이

#### ChatGPT API (GPT-3.5-turbo)
- ⚠️ 긴 system prompt의 경우 핵심 지시사항을 놓칠 수 있음
- ⚠️ "간결하게 답변하라"는 지시를 완벽히 따르지 못할 수 있음
- ⚠️ 프롬프트의 모든 내용을 균등하게 참조하려는 경향
- ⚠️ System prompt의 우선순위를 제대로 인식하지 못할 수 있음

#### Gemini API (Gemini Pro) - NotebookLM 사용
- ✅ System Instructions를 더 강력하게 따름
- ✅ 프롬프트의 핵심 원칙을 우선순위로 인식
- ✅ "간결성" 지시를 더 잘 준수
- ✅ 맥락을 이해하고 필요한 정보만 추출

### 2. 프롬프트 처리 방식 차이

#### ChatGPT API
```typescript
// 현재 구현
const messages = [
  { role: 'system', content: systemPrompt }, // 전체 프롬프트
  { role: 'user', content: userMessage }
];
```
- System prompt로 전체 프롬프트를 전달
- 하지만 모델이 모든 지시사항을 균등하게 처리
- 핵심 원칙이 묻힐 수 있음

#### Gemini API
```typescript
// Gemini 구현
const model = genAI.getGenerativeModel({ 
  model: 'gemini-pro',
  systemInstruction: {
    parts: [{ text: systemPrompt }],
    role: 'system'
  }
});
```
- System Instructions를 더 강력하게 처리
- 핵심 원칙을 우선순위로 인식
- NotebookLM과 동일한 방식

---

## 🎯 Gemini API 전환의 필요성

### 실험 결과가 보여주는 것

1. **프롬프트 구조는 문제가 아님**
   - 같은 프롬프트로 NotebookLM은 잘 작동
   - 프롬프트 자체는 문제없음

2. **모델/API의 차이가 핵심**
   - Gemini는 프롬프트를 더 잘 이해하고 준수
   - ChatGPT는 같은 프롬프트를 제대로 활용하지 못함

3. **Gemini API 전환이 해결책**
   - NotebookLM과 동일한 모델 사용
   - 같은 프롬프트로 더 나은 결과 기대

---

## 🚀 Gemini API 전환 구현 계획

### Step 1: Google AI SDK 설치

```bash
npm install @google/generative-ai
```

### Step 2: 환경 변수 설정

`.env.local` 파일에 추가:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Gemini API 클라이언트 생성

`lib/gemini.ts` 파일 생성:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini 클라이언트 초기화
export const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// 프롬프트 가져오기 (기존 함수 재사용)
export async function getQuotePrompt(context: string = ''): Promise<string> {
  // 기존 lib/openai.ts의 getQuotePrompt 함수와 동일
  // ... (기존 코드 재사용)
}

// 답변 최적화 함수 (기존 함수 재사용)
function optimizeResponse(response: string): string {
  // 기존 lib/openai.ts의 optimizeResponse 함수와 동일
  // ... (기존 코드 재사용)
}

// Gemini API를 사용한 챗봇 응답 생성
export async function generateChatbotResponse(
  userMessage: string,
  context: string,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = [],
  isQuoteInquiry: boolean = false
): Promise<string> {
  // Gemini API 키가 없는 경우 기존 로직 사용
  if (!genAI) {
    // 기존 generateBasicResponse 로직 사용
    // ... (fallback)
  }

  try {
    // DB에서 프롬프트 가져오기
    const prompt = await getQuotePrompt(context);
    
    // Gemini 모델 초기화 (System Instructions 설정)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      systemInstruction: {
        parts: [{ text: prompt }],
        role: 'system'
      }
    });

    // 대화 기록을 Gemini 형식으로 변환
    const chatHistory = conversationHistory.slice(-6).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Gemini API 호출
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 200,      // 간결한 답변 강제
        temperature: 0.3,           // 정확하고 간결한 답변
        topP: 0.8,
        topK: 40,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();
    
    if (!response) {
      throw new Error('Gemini API 응답이 비어있습니다.');
    }

    // 답변 최적화 적용
    return optimizeResponse(response.trim());
  } catch (error) {
    console.error('Gemini API 오류:', error);
    throw new Error('AI 응답 생성 중 오류가 발생했습니다.');
  }
}
```

### Step 4: API 라우트 수정

`app/api/chatbot/send/route.ts` 수정:

```typescript
// 기존
import { generateChatbotResponse } from '@/lib/openai';

// 변경
import { generateChatbotResponse } from '@/lib/gemini';
// 또는
import { generateChatbotResponse as generateChatbotResponseGemini } from '@/lib/gemini';
import { generateChatbotResponse as generateChatbotResponseOpenAI } from '@/lib/openai';

// 환경 변수로 선택
const useGemini = process.env.USE_GEMINI === 'true';
const generateChatbotResponse = useGemini 
  ? generateChatbotResponseGemini 
  : generateChatbotResponseOpenAI;
```

### Step 5: 점진적 전환 (A/B 테스트)

```typescript
// app/api/chatbot/send/route.ts
const useGemini = process.env.USE_GEMINI === 'true' || 
                  sessionToken.endsWith('_gemini'); // 테스트용

if (useGemini) {
  botResponse = await generateChatbotResponseGemini(...);
} else {
  botResponse = await generateChatbotResponseOpenAI(...);
}
```

---

## 📊 예상 결과

### Before (ChatGPT API)
```
사용자: "견적이 궁금해요"
답변: "견적 문의를 도와드리겠습니다! 정우특수코팅은 1999년 설립된... (장황한 답변)"
```

### After (Gemini API)
```
사용자: "견적이 궁금해요"
답변: "어떤 코팅 서비스를 원하시나요? (UV 코팅/라미네이팅/박 코팅/형압 가공) 수량과 크기를 알려주시면 견적을 드립니다."
```

**NotebookLM과 유사한 수준의 간결하고 효율적인 답변 기대**

---

## ⚠️ 주의사항

### 1. API 키 발급
- Google Cloud Console에서 Gemini API 키 발급 필요
- 무료 티어: 일일 60 요청
- 유료 플랜 확인 필요

### 2. 한국어 지원
- Gemini의 한국어 지원 품질 테스트 필요
- 실제 대화 테스트 필수

### 3. 점진적 전환
- 한 번에 모든 것을 바꾸지 말고 점진적으로
- A/B 테스트로 결과 비교
- 문제 발생 시 롤백 가능하도록

### 4. 기존 코드 유지
- ChatGPT API 코드는 유지 (fallback용)
- 환경 변수로 선택 가능하도록

---

## 🎯 구현 우선순위

### Phase 1: Gemini API 통합 (1주일)
1. ✅ Google AI SDK 설치
2. ✅ `lib/gemini.ts` 파일 생성
3. ✅ 기존 `getQuotePrompt` 함수 재사용
4. ✅ `generateChatbotResponse` 함수 구현
5. ✅ 환경 변수 설정

### Phase 2: 점진적 전환 (1주일)
1. ✅ A/B 테스트 로직 구현
2. ✅ 일부 사용자만 Gemini 사용
3. ✅ 결과 비교 및 분석
4. ✅ 문제 해결 및 최적화

### Phase 3: 전체 전환 (1주일)
1. ✅ 모든 사용자에게 Gemini 적용
2. ✅ ChatGPT API는 fallback으로 유지
3. ✅ 모니터링 및 최적화

---

## 📝 결론

### 실험 결과가 보여주는 것

**같은 프롬프트로 NotebookLM은 잘 작동하는데 ChatGPT API는 그렇지 못하다면:**

1. ✅ **프롬프트 구조는 문제가 아님**
2. ✅ **모델/API의 차이가 핵심**
3. ✅ **Gemini API 전환이 해결책**

### 최종 추천

**Gemini API 전환을 적극 추천합니다.**

이유:
- ✅ NotebookLM과 동일한 모델 사용
- ✅ 같은 프롬프트로 더 나은 결과 기대
- ✅ 실험 결과가 이를 증명
- ✅ 프롬프트 구조 개선보다 더 효과적

### 다음 단계

1. **Gemini API 키 발급** (Google Cloud Console)
2. **코드 구현** (위 계획 참고)
3. **테스트 및 비교**
4. **점진적 전환**

이렇게 진행하면 NotebookLM 수준의 효율적인 답변을 얻을 수 있습니다! 🚀


# Gemini Pro 사용 확인 가이드

## 🔍 챗봇이 Gemini Pro를 사용하는지 확인하는 방법

### 방법 1: 서버 로그 확인 (가장 확실한 방법)

#### 1단계: 서버 로그 확인
터미널에서 `npm run dev`로 서버를 실행하면 다음과 같은 로그가 표시됩니다:

**서버 시작 시:**
```
✅ [Gemini Pro] API 키가 설정되어 있습니다.
🔑 [Gemini Pro] API 키 시작: AIzaSyBIxJ...
```

**챗봇 질문 시:**
```
🤖 [Gemini Pro] 챗봇 응답 생성 시작
📝 [Gemini Pro] 프롬프트 길이: 2847 자
✅ [Gemini Pro] 모델 초기화 완료: gemini-pro
✅ [Gemini Pro] API 응답 수신 완료
📤 [Gemini Pro] 원본 답변 길이: 156 자
✨ [Gemini Pro] 최적화된 답변 길이: 142 자
🎯 [Gemini Pro] 최종 답변: 어떤 코팅 서비스를 원하시나요? (UV 코팅/라미네이팅/박 코팅/형압 가공) 수량과 크기를 알려주시면 견적을 드립니다....
```

**Fallback 모드 (API 키 없을 때):**
```
⚠️  [Gemini Pro] API 키가 설정되지 않았습니다. Fallback 모드로 작동합니다.
⚠️  [Fallback] Gemini API 키가 없어 Fallback 모드로 작동합니다.
```

### 방법 2: 답변 품질로 확인

Gemini Pro를 사용하면:
- ✅ **간결한 답변**: 2-3줄 이내
- ✅ **프롬프트 준수**: 프롬프트 내용을 정확히 따름
- ✅ **NotebookLM 수준**: NotebookLM과 유사한 품질

Fallback 모드를 사용하면:
- ⚠️ **기본 답변**: 간단한 패턴 매칭 기반 답변
- ⚠️ **제한적**: 프롬프트를 완전히 활용하지 못함

### 방법 3: 브라우저 개발자 도구 확인

1. 브라우저에서 `F12` 또는 `Cmd+Option+I` (Mac)로 개발자 도구 열기
2. **Network** 탭 선택
3. 챗봇에서 질문 입력
4. 네트워크 요청 확인:
   - `/api/chatbot/send` 요청 확인
   - 응답 시간 확인 (Gemini Pro는 보통 1-3초)

### 방법 4: 코드에서 직접 확인

`lib/gemini.ts` 파일을 확인:
```typescript
// 이 부분이 실행되면 Gemini Pro 사용
const model = genAI.getGenerativeModel({ 
  model: 'gemini-pro',
  ...
});
```

## ✅ 확인 체크리스트

### 서버 시작 시 확인
- [ ] 서버 로그에 "✅ [Gemini Pro] API 키가 설정되어 있습니다." 메시지 표시
- [ ] API 키 시작 부분이 "AIza..."로 표시

### 챗봇 질문 시 확인
- [ ] 서버 로그에 "🤖 [Gemini Pro] 챗봇 응답 생성 시작" 메시지 표시
- [ ] "✅ [Gemini Pro] 모델 초기화 완료: gemini-pro" 메시지 표시
- [ ] "✅ [Gemini Pro] API 응답 수신 완료" 메시지 표시
- [ ] 답변이 간결하고 효율적임

## 🐛 문제 해결

### 로그에 "⚠️ [Gemini Pro] API 키가 설정되지 않았습니다" 표시

**원인**: `.env.local` 파일에 `GEMINI_API_KEY`가 없거나 잘못 설정됨

**해결**:
1. `.env.local` 파일 확인
2. `GEMINI_API_KEY=your_api_key` 형식으로 설정
3. 서버 재시작

### 로그에 "❌ [Gemini Pro] API 오류" 표시

**원인**: API 키가 유효하지 않거나 API 사용량 제한

**해결**:
1. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 API 키 확인
2. API 사용량 제한 확인
3. API 키 재발급

### Fallback 모드로 작동

**원인**: Gemini API 키가 없거나 오류 발생

**해결**:
1. API 키 설정 확인
2. 서버 재시작
3. 로그 확인

## 📊 예상 로그 출력

### 정상 작동 시
```
✅ [Gemini Pro] API 키가 설정되어 있습니다.
🔑 [Gemini Pro] API 키 시작: AIzaSyBIxJ...
🤖 [Gemini Pro] 챗봇 응답 생성 시작
📝 [Gemini Pro] 프롬프트 길이: 2847 자
✅ [Gemini Pro] 모델 초기화 완료: gemini-pro
✅ [Gemini Pro] API 응답 수신 완료
📤 [Gemini Pro] 원본 답변 길이: 156 자
✨ [Gemini Pro] 최적화된 답변 길이: 142 자
🎯 [Gemini Pro] 최종 답변: 어떤 코팅 서비스를 원하시나요?...
```

### Fallback 모드
```
⚠️  [Gemini Pro] API 키가 설정되지 않았습니다. Fallback 모드로 작동합니다.
⚠️  [Fallback] Gemini API 키가 없어 Fallback 모드로 작동합니다.
```

## 🎯 빠른 확인 방법

1. **서버 로그 확인**: 터미널에서 `[Gemini Pro]` 메시지 확인
2. **답변 품질 확인**: 간결하고 효율적인 답변인지 확인
3. **응답 시간 확인**: Gemini Pro는 보통 1-3초 소요

이제 서버 로그를 확인하면 Gemini Pro를 사용하는지 명확하게 알 수 있습니다! 🚀


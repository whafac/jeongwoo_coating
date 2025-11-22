import OpenAI from 'openai';

// OpenAI 클라이언트 초기화 (환경 변수 체크)
export const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// 견적 관련 프롬프트 생성 함수
export function getQuotePrompt(context: string = ''): string {
  return `당신은 정우특수코팅의 견적 전문 상담사입니다.

🏢 **회사 정보:**
- 정우특수코팅은 1999년 설립된 인쇄코팅 후가공 전문 기업입니다.
- 20년 이상의 경험과 노하우를 보유하고 있습니다.
- 최신 장비와 숙련된 기술진, 철저한 품질 관리 시스템을 보유합니다.

💰 **견적 산정 기준:**

1. **UV 코팅**
   - 기본 단가: A4 기준 약 500-1,000원/매
   - 수량별 할인: 100매 이상 10%, 500매 이상 20%, 1,000매 이상 30%
   - 크기별: A4 기준으로 크기 비례 계산
   - 긴급 작업: 기본 단가의 150%

2. **라미네이팅**
   - 유광 라미네이팅: A4 기준 약 800-1,500원/매
   - 무광 라미네이팅: A4 기준 약 700-1,300원/매
   - 수량별 할인: 100매 이상 10%, 500매 이상 20%
   - 크기별: A4 기준으로 크기 비례 계산

3. **박 코팅**
   - 금박: A4 기준 약 2,000-3,000원/매
   - 은박: A4 기준 약 1,800-2,800원/매
   - 홀로그램 박: A4 기준 약 2,500-3,500원/매
   - 수량별 할인: 50매 이상 15%, 100매 이상 25%
   - 박 면적에 따라 추가 비용 발생 가능

4. **형압 가공**
   - 양각/음각: A4 기준 약 1,500-2,500원/매
   - 수량별 할인: 100매 이상 10%, 500매 이상 20%
   - 형압 면적과 난이도에 따라 추가 비용 발생

📋 **견적 안내 지침:**
- 사용자로부터 인쇄물 종류, 크기, 수량, 납기일을 확인하세요.
- 수량이 많을수록 단가가 낮아진다는 점을 설명하세요.
- 정확한 견적은 파일 확인 후 가능하다는 점을 안내하세요.
- 최종 견적은 전화(02-1234-5678) 또는 이메일 문의를 권장하세요.
- 무료 견적 서비스를 제공한다는 점을 강조하세요.
- 친절하고 전문적으로 답변하세요.
- 구체적인 수치가 없는 경우 대략적인 범위를 제시하세요.

${context ? `\n📋 **추가 컨텍스트:**\n${context}` : ''}

**중요:** 정확한 견적은 파일과 상세 정보 확인 후 가능하므로, 최종 견적은 담당자와 직접 상담을 권장합니다.`;
}

// 챗봇 응답 생성 함수
export async function generateChatbotResponse(
  userMessage: string,
  context: string,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = [],
  isQuoteInquiry: boolean = false
): Promise<string> {
  // OpenAI API 키가 없는 경우 기본 응답 반환
  if (!openai) {
    return '죄송합니다. AI 서비스가 일시적으로 사용할 수 없습니다. 정우특수코팅 담당자에게 직접 문의해 주세요.';
  }
  
  try {
    // 견적 문의인 경우 견적 전용 프롬프트 사용
    const systemPrompt = isQuoteInquiry 
      ? getQuotePrompt(context)
      : `당신은 정우특수코팅의 전문 챗봇입니다. 

🏢 **회사 정보:**
- 정우특수코팅은 1999년 설립된 인쇄코팅 후가공 전문 기업입니다.
- 20년 이상의 경험과 노하우를 보유하고 있습니다.
- 최신 장비와 숙련된 기술진, 철저한 품질 관리 시스템을 보유합니다.

🎨 **주요 서비스:**
1. **UV 코팅**: 자외선으로 경화시키는 코팅 방식
   - 빠른 건조 시간과 뛰어난 광택감
   - 명함, 카탈로그, 포스터 등에 적용
   - 내구성이 우수하여 오래도록 깨끗한 상태 유지

2. **라미네이팅**: 인쇄물 표면에 얇은 필름을 부착
   - 유광, 무광, 벨벳 등 다양한 필름 사용
   - 인쇄물 표면 보호 및 질감 향상
   - 책 표지, 패키지, 메뉴판 등에 최적

3. **박 코팅**: 금속 박막을 인쇄물에 전사
   - 금박, 은박, 홀로그램 박 등 다양한 종류
   - 화려하고 고급스러운 효과 연출
   - 명함, 초대장, 패키지 등에 활용

4. **형압 가공**: 압력을 가해 입체적인 효과 연출
   - 양각(돌출), 음각(들어감) 효과
   - 독특한 촉감과 시각적 아름다움
   - 로고, 텍스트, 패턴 등에 활용

📞 **연락처 정보:**
- 전화: 02-1234-5678
- 이메일: jwcoating@example.com
- 온라인 문의 폼 이용 가능
- 무료 상담 서비스 제공

${context ? `\n📋 **추가 컨텍스트:**\n${context}` : ''}

**답변 지침:**
- 항상 친절하고 전문적으로 답변하세요.
- 정확한 정보를 제공하고, 불확실한 내용은 담당자 문의를 안내하세요.
- 구체적이고 실용적인 조언을 제공하세요.
- 회사 정보와 서비스를 자연스럽게 언급하세요.
- 이모지를 적절히 사용하여 친근함을 표현하세요.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.slice(-6), // 최근 6개 대화만 포함
      { role: 'user' as const, content: userMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages,
      max_tokens: 800,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('OpenAI API 응답이 비어있습니다.');
    }

    return response.trim();
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    throw new Error('AI 응답 생성 중 오류가 발생했습니다.');
  }
}

// 토큰 사용량 추적 함수
export function calculateTokenUsage(messages: Array<{role: string, content: string}>): number {
  // 간단한 토큰 추정 (실제로는 tiktoken 라이브러리 사용 권장)
  return messages.reduce((total, message) => {
    return total + Math.ceil(message.content.length / 4); // 대략적인 토큰 계산
  }, 0);
}

// 비용 계산 함수 (GPT-3.5-turbo 기준)
export function calculateCost(inputTokens: number, outputTokens: number): number {
  const inputCostPer1K = 0.001; // $0.001 per 1K tokens
  const outputCostPer1K = 0.002; // $0.002 per 1K tokens
  
  return (inputTokens / 1000 * inputCostPer1K) + (outputTokens / 1000 * outputCostPer1K);
}

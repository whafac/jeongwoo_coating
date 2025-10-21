import OpenAI from 'openai';

// OpenAI 클라이언트 초기화 (환경 변수 체크)
export const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// 챗봇 응답 생성 함수
export async function generateChatbotResponse(
  userMessage: string,
  context: string,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []
): Promise<string> {
  // OpenAI API 키가 없는 경우 기본 응답 반환
  if (!openai) {
    return '죄송합니다. AI 서비스가 일시적으로 사용할 수 없습니다. 정우특수코팅 담당자에게 직접 문의해 주세요.';
  }
  
  try {
    const systemPrompt = `당신은 정우특수코팅의 전문 챗봇입니다. 
    
회사 정보:
- 정우특수코팅은 1999년 설립된 인쇄코팅 후가공 전문 기업입니다.
- 20년 이상의 경험과 노하우를 보유하고 있습니다.
- UV코팅, 라미네이팅, 박코팅, 형압 가공 등 다양한 서비스를 제공합니다.

서비스 정보:
${context}

응답 지침:
1. 친근하고 전문적인 톤으로 답변하세요.
2. 정우특수코팅의 전문성을 강조하세요.
3. 구체적인 연락처나 정보가 필요한 경우 전화(02-1234-5678) 또는 온라인 문의를 안내하세요.
4. 코팅 관련 전문 용어는 쉽게 설명해 주세요.
5. 고객의 요구사항에 맞는 최적의 솔루션을 제안하세요.
6. 응답은 2-3문장으로 간결하게 작성하세요.
7. 이모지를 적절히 사용하여 친근함을 표현하세요.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.slice(-6), // 최근 6개 대화만 포함
      { role: 'user' as const, content: userMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
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

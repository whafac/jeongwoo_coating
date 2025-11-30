import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini 클라이언트 초기화
export const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Gemini API 키 확인 로그 (서버 시작 시)
if (genAI) {
  console.log('✅ [Gemini Pro] API 키가 설정되어 있습니다.');
  console.log('🔑 [Gemini Pro] API 키 시작:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');
} else {
  console.log('⚠️  [Gemini Pro] API 키가 설정되지 않았습니다. Fallback 모드로 작동합니다.');
}

// 프롬프트 가져오기 함수 (기존 함수 재사용)
export async function getQuotePrompt(context: string = ''): Promise<string> {
  // 기존 lib/openai.ts의 getQuotePrompt 함수 재사용
  const { getQuotePrompt: getPrompt } = await import('@/lib/openai');
  return getPrompt(context);
}

// 답변 최적화 함수 (기존 함수 재사용)
function optimizeResponse(response: string): string {
  let optimized = response
    // 불필요한 패턴 제거
    .replace(/프롬프트에 명시된 정보를 바탕으로/g, '')
    .replace(/프롬프트에 명시된/g, '')
    .replace(/정우특수코팅은 1999년 설립된[^]*?기업입니다\./g, '')
    .replace(/20년 이상의 경험과 노하우를[^]*?\./g, '')
    .replace(/더 자세한 정보는[^]*?문의해 주세요\./g, '')
    .replace(/친절하게 안내해 드리겠습니다! 😊/g, '')
    .replace(/친절하게 안내해 드리겠습니다\./g, '')
    .replace(/\n{3,}/g, '\n\n') // 연속된 줄바꿈 정리
    .trim();
  
  // 길이 제한 (200자)
  if (optimized.length > 200) {
    // 문장 단위로 자르기
    const sentences = optimized.split(/[.!?]\s+/);
    let result = '';
    for (const sentence of sentences) {
      if ((result + sentence).length <= 200) {
        result += sentence + '. ';
      } else {
        break;
      }
    }
    optimized = result.trim();
  }
  
  return optimized.trim();
}

// 견적 관련 기본 답변 생성 함수 (fallback용)
export async function generateQuoteResponse(userMessage: string): Promise<string> {
  const { generateQuoteResponse: getQuoteResponse } = await import('@/lib/openai');
  return getQuoteResponse(userMessage);
}

// Gemini API를 사용한 챗봇 응답 생성
export async function generateChatbotResponse(
  userMessage: string,
  context: string,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = [],
  isQuoteInquiry: boolean = false
): Promise<string> {
  // Gemini API 키가 없는 경우 기존 fallback 로직 사용
  if (!genAI) {
    console.log('⚠️  [Fallback] Gemini API 키가 없어 Fallback 모드로 작동합니다.');
    // 기존 generateQuoteResponse 또는 generateBasicResponse 사용
    const { generateQuoteResponse } = await import('@/lib/openai');
    if (isQuoteInquiry) {
      return await generateQuoteResponse(userMessage);
    }
    // 일반 문의인 경우도 DB 프롬프트 기반으로 답변 생성
    try {
      const prompt = await getQuotePrompt(context);
      const phoneMatch = prompt.match(/전화[\(\)\s]*([0-9-]+)/);
      const emailMatch = prompt.match(/이메일[:\s]*([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+)/);
      const phone = phoneMatch ? phoneMatch[1] : '02-1234-5678';
      const email = emailMatch ? emailMatch[1] : 'info@jeongwoo.co.kr';
      const messageLower = userMessage.toLowerCase();
      
      if (messageLower.includes('연락처') || messageLower.includes('전화') || messageLower.includes('연락') || messageLower.includes('연락처 안내')) {
        const contactMatch = prompt.match(/연락처 안내[^]*?(?=\n\n|$)/i);
        if (contactMatch) {
          let contactResponse = contactMatch[0];
          contactResponse = contactResponse.replace(/02-[0-9-]+/g, phone);
          contactResponse = contactResponse.replace(/info@[^\s]+/g, email);
          return contactResponse;
        }
        return `연락처 정보:\n\n📞 전화: ${phone}\n📧 이메일: ${email}\n\n온라인 문의 폼: /contact`;
      }
      
      return optimizeResponse(`어떤 도움이 필요하신가요? 견적 문의나 서비스 안내를 도와드릴 수 있습니다. 전화(${phone})로 문의해 주세요.`);
    } catch (error) {
      console.error('프롬프트 기반 답변 생성 오류:', error);
      return '죄송합니다. 일시적인 오류가 발생했습니다. 정우특수코팅 담당자에게 직접 문의해 주세요.';
    }
  }

  try {
    // DB에서 프롬프트 가져오기
    const prompt = await getQuotePrompt(context);
    
    // 사용자 메시지 분석 (서비스별 구체적 답변을 위해)
    const messageLower = userMessage.toLowerCase();
    let enhancedMessage = userMessage;
    
    // 서비스별 키워드 감지 및 메시지 보강
    if (messageLower.includes('라미네이팅') || messageLower.includes('quote-laminating')) {
      enhancedMessage = `라미네이팅 견적에 대해 구체적으로 알려주세요. 라미네이팅의 기본 단가, 수량별 할인, 필름 종류(유광/무광/벨벳), 견적에 필요한 정보를 포함해서 답변해주세요.`;
      console.log('📌 [Gemini Pro] 라미네이팅 견적 질문 감지');
    } else if (messageLower.includes('uv') && (messageLower.includes('코팅') || messageLower.includes('quote-uv'))) {
      enhancedMessage = `UV 코팅 견적에 대해 구체적으로 알려주세요. UV 코팅의 기본 단가, 수량별 할인, 견적에 필요한 정보를 포함해서 답변해주세요.`;
      console.log('📌 [Gemini Pro] UV 코팅 견적 질문 감지');
    } else if (messageLower.includes('박') && (messageLower.includes('코팅') || messageLower.includes('quote-foil'))) {
      enhancedMessage = `박 코팅 견적에 대해 구체적으로 알려주세요. 박 코팅의 기본 단가, 수량별 할인, 박 종류(금박/은박/홀로그램), 견적에 필요한 정보를 포함해서 답변해주세요.`;
      console.log('📌 [Gemini Pro] 박 코팅 견적 질문 감지');
    } else if (messageLower.includes('형압') || messageLower.includes('quote-embossing')) {
      enhancedMessage = `형압 가공 견적에 대해 구체적으로 알려주세요. 형압 가공의 기본 단가, 수량별 할인, 가공 종류(양각/음각), 견적에 필요한 정보를 포함해서 답변해주세요.`;
      console.log('📌 [Gemini Pro] 형압 가공 견적 질문 감지');
    }
    
    // Gemini 사용 확인 로그
    console.log('🤖 [Gemini Pro] 챗봇 응답 생성 시작');
    console.log('📝 [Gemini Pro] 프롬프트 길이:', prompt.length, '자');
    console.log('💬 [Gemini Pro] 사용자 메시지:', userMessage);
    if (enhancedMessage !== userMessage) {
      console.log('✨ [Gemini Pro] 메시지 보강:', enhancedMessage);
    }
    
    // Gemini 모델 초기화 (System Instructions 설정)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      systemInstruction: {
        parts: [{ text: prompt }],
        role: 'system'
      }
    });
    
    console.log('✅ [Gemini Pro] 모델 초기화 완료: gemini-pro');

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

    const result = await chat.sendMessage(enhancedMessage);
    const response = result.response.text();
    
    if (!response) {
      throw new Error('Gemini API 응답이 비어있습니다.');
    }

    // Gemini 사용 확인 로그
    console.log('✅ [Gemini Pro] API 응답 수신 완료');
    console.log('📤 [Gemini Pro] 원본 답변 길이:', response.length, '자');
    
    // 답변 최적화 적용
    const optimizedResponse = optimizeResponse(response.trim());
    console.log('✨ [Gemini Pro] 최적화된 답변 길이:', optimizedResponse.length, '자');
    console.log('🎯 [Gemini Pro] 최종 답변:', optimizedResponse.substring(0, 100) + '...');
    
    return optimizedResponse;
  } catch (error) {
    console.error('❌ [Gemini Pro] API 오류:', error);
    console.log('⚠️  [Fallback] Gemini API 오류로 인해 Fallback 모드로 전환합니다.');
    // 에러 발생 시 fallback 로직 사용
    try {
      const { generateQuoteResponse } = await import('@/lib/openai');
      if (isQuoteInquiry) {
        return await generateQuoteResponse(userMessage);
      }
      const prompt = await getQuotePrompt(context);
      const phoneMatch = prompt.match(/전화[\(\)\s]*([0-9-]+)/);
      const phone = phoneMatch ? phoneMatch[1] : '02-1234-5678';
      return optimizeResponse(`어떤 도움이 필요하신가요? 견적 문의나 서비스 안내를 도와드릴 수 있습니다. 전화(${phone})로 문의해 주세요.`);
    } catch (fallbackError) {
      console.error('Fallback 응답 생성 오류:', fallbackError);
      throw new Error('AI 응답 생성 중 오류가 발생했습니다.');
    }
  }
}

// 토큰 사용량 추적 함수 (Gemini용 - 대략적 추정)
export function calculateTokenUsage(messages: Array<{role: string, content: string}>): number {
  // 간단한 토큰 추정 (실제로는 정확한 계산 필요)
  return messages.reduce((total, message) => {
    return total + Math.ceil(message.content.length / 4); // 대략적인 토큰 계산
  }, 0);
}

// 비용 계산 함수 (Gemini Pro 기준)
export function calculateCost(inputTokens: number, outputTokens: number): number {
  const inputCostPer1K = 0.003; // $0.003 per 1K tokens (Gemini Pro)
  const outputCostPer1K = 0.012; // $0.012 per 1K tokens (Gemini Pro)
  
  return (inputTokens / 1000 * inputCostPer1K) + (outputTokens / 1000 * outputCostPer1K);
}


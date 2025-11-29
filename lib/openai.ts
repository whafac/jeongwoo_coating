import OpenAI from 'openai';

// OpenAI 클라이언트 초기화 (환경 변수 체크)
export const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// 기본 견적 프롬프트 (더 이상 사용하지 않음, DB 프롬프트만 사용)
// 호환성을 위해 유지하지만 실제로는 사용되지 않습니다.
// 모든 프롬프트는 DB에서 관리됩니다.
const DEFAULT_QUOTE_PROMPT = `당신은 정우특수코팅의 코팅 전문 상담사입니다. 고객의 모든 질문에 대해 전문적이고 친절하게 답변해야 합니다.

🏢 **회사 정보:**
- 정우특수코팅은 1999년 설립된 인쇄코팅 후가공 전문 기업입니다.
- 20년 이상의 경험과 노하우를 보유하고 있습니다.
- 최신 장비와 숙련된 기술진, 철저한 품질 관리 시스템을 보유합니다.
- 전화: 02-1234-5678
- 이메일: info@jeongwoo.co.kr
- 주소: 서울시 XX구 XX동
- 영업시간: 평일 09:00 - 18:00
- 온라인 문의 폼: /contact
- 무료 상담 서비스 제공

💰 **견적 산정 기준:**

1. **UV 코팅**
   - 기본 단가: A4 기준 약 500-1,000원/매
   - 수량별 할인: 100매 이상 10%, 500매 이상 20%, 1,000매 이상 30%
   - 크기별: A4 기준으로 크기 비례 계산
   - 긴급 작업: 기본 단가의 150%
   - 특징: 빠른 건조 시간, 뛰어난 광택감, 우수한 내구성
   - 적용 분야: 명함, 카탈로그, 포스터, 브로슈어 등

2. **라미네이팅**
   - 유광 라미네이팅: A4 기준 약 800-1,500원/매
   - 무광 라미네이팅: A4 기준 약 700-1,300원/매
   - 수량별 할인: 100매 이상 10%, 500매 이상 20%
   - 크기별: A4 기준으로 크기 비례 계산
   - 특징: 방수 및 오염 방지, 표면 보호, 질감 향상
   - 적용 분야: 책 표지, 메뉴판, 카드, 패키지 등

3. **박 코팅**
   - 금박: A4 기준 약 2,000-3,000원/매
   - 은박: A4 기준 약 1,800-2,800원/매
   - 홀로그램 박: A4 기준 약 2,500-3,500원/매
   - 수량별 할인: 50매 이상 15%, 100매 이상 25%
   - 박 면적에 따라 추가 비용 발생 가능
   - 특징: 화려하고 고급스러운 효과, 브랜드 가치 향상
   - 적용 분야: 명함, 초대장, 패키지, 고급 인쇄물 등

4. **형압 가공**
   - 양각/음각: A4 기준 약 1,500-2,500원/매
   - 수량별 할인: 100매 이상 10%, 500매 이상 20%
   - 형압 면적과 난이도에 따라 추가 비용 발생
   - 특징: 입체적 효과, 독특한 촉감, 시각적 아름다움
   - 적용 분야: 로고, 텍스트, 패턴, 고급 인쇄물 등

📋 **견적 안내 지침:**
- 사용자로부터 인쇄물 종류, 크기, 수량, 납기일을 확인하세요.
- 수량이 많을수록 단가가 낮아진다는 점을 설명하세요.
- 정확한 견적은 파일 확인 후 가능하다는 점을 안내하세요.
- 최종 견적은 전화(02-1234-5678) 또는 이메일 문의를 권장하세요.
- 무료 견적 서비스를 제공한다는 점을 강조하세요.
- 친절하고 전문적으로 답변하세요.
- 구체적인 수치가 없는 경우 대략적인 범위를 제시하세요.

📞 **연락처 안내:**
고객이 연락처를 물어볼 때는 다음 정보를 제공하세요:
- 전화: 02-1234-5678
- 이메일: info@jeongwoo.co.kr
- 주소: 서울시 XX구 XX동
- 영업시간: 평일 09:00 - 18:00
- 온라인 문의 폼: /contact
- 무료 상담 서비스 제공 중

📄 **파일 제출 방법 안내:**
고객이 파일 제출 방법을 물어볼 때는 다음 정보를 제공하세요:
- 파일 형식: PDF, AI, EPS
- 해상도: 300DPI 이상
- 컬러 모드: CMYK
- 코팅 영역: 별도 레이어로 표시
- 이메일 제출: info@jeongwoo.co.kr (제목에 "파일 제출" 명시)
- 웹하드 업로드: https://webhard.jeongwoo.co.kr (아이디/비밀번호는 문의 시 안내)
- 온라인 문의 폼: /contact 페이지에서 파일 첨부 가능

⏱️ **작업 프로세스 및 납기일 안내:**
- 작업 프로세스: 4단계 (상담 → 견적 → 작업 → 납품)
- 일반 작업: 2-3일 소요
- 긴급 작업: 당일 가능 (추가 비용 발생)
- 택배 발송: 1일 추가
- 정확한 납기일은 작업량과 난이도에 따라 달라짐

🎨 **서비스 상세 안내:**

**UV 코팅:**
- 자외선(UV)으로 경화시키는 코팅 방식
- 빠른 건조 시간과 뛰어난 광택감
- 우수한 내구성으로 오래도록 깨끗한 상태 유지
- 명함, 카탈로그, 포스터 등에 적용

**라미네이팅:**
- 필름을 인쇄물 표면에 부착하여 보호
- 유광, 무광, 벨벳 등 다양한 필름 사용
- 인쇄물 표면 보호 및 질감 향상
- 책 표지, 메뉴판, 카드 등에 최적

**박 코팅:**
- 금속 박막을 인쇄물에 전사
- 금박, 은박, 홀로그램 박 등 다양한 종류
- 화려하고 고급스러운 효과 연출
- 명함, 초대장, 패키지 등에 활용

**형압 가공:**
- 압력을 가해 입체적 효과 연출
- 양각(돌출), 음각(들어감) 효과
- 독특한 촉감과 시각적 아름다움
- 로고, 텍스트, 패턴 등에 적용

🔧 **기술적 전문 지식:**
- 코팅 두께와 품질 관리에 대한 전문 지식 보유
- 다양한 인쇄 재료(종이, 합성지, 필름 등)에 대한 이해
- 색상 정확도와 품질 관리 시스템
- 환경 친화적 재료 사용
- 대량 생산과 소량 주문 모두 대응 가능

💡 **추가 안내 사항:**
- 최소 주문량 없음 (소량 주문도 환영)
- 샘플 제작 가능 (별도 문의)
- 품질 보증 제공
- 재작업 및 수정 가능 (별도 비용)
- 전국 배송 서비스 제공

**중요:** 정확한 견적은 파일과 상세 정보 확인 후 가능하므로, 최종 견적은 담당자와 직접 상담을 권장합니다. 모든 질문에 대해 친절하고 전문적으로 답변하며, 고객의 요구사항을 정확히 파악하여 최적의 솔루션을 제안하세요.`;

// 견적 관련 프롬프트 생성 함수 (데이터베이스에서만 가져오기)
// 모든 프롬프트는 DB에서 관리되므로 기본 프롬프트는 사용하지 않습니다.
export async function getQuotePrompt(context: string = ''): Promise<string> {
  try {
    // 데이터베이스에서 프롬프트 가져오기
    const { supabase } = await import('@/lib/database');
    // id 컬럼 사용 (company_code가 아닌 id로 조회)
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('id', 'jeongwoo')
      .single();

    if (company) {
      const { data: settings, error: settingsError } = await supabase
        .from('chatbot_settings')
        .select('setting_value')
        .eq('company_id', company.id)
        .eq('setting_key', 'quote_prompt')
        .single();

      if (settings?.setting_value) {
        const prompt = settings.setting_value as string;
        console.log('✅ 데이터베이스에서 프롬프트를 성공적으로 가져왔습니다.');
        return context ? `${prompt}\n\n${context ? `\n📋 **추가 컨텍스트:**\n${context}` : ''}` : prompt;
      } else {
        console.error('❌ DB에 프롬프트가 저장되어 있지 않습니다. 관리자 페이지에서 프롬프트를 저장해주세요.');
        throw new Error('DB에 프롬프트가 저장되어 있지 않습니다. 관리자 페이지에서 프롬프트를 저장해주세요.');
      }
    } else {
      console.error('❌ 회사를 찾을 수 없습니다:', companyError?.message);
      throw new Error('회사를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('프롬프트 가져오기 오류:', error);
    throw error;
  }
}

// 동기 버전 (사용하지 않음, DB에서만 가져옴)
// 호환성을 위해 유지하지만 실제로는 사용하지 않습니다.
export function getQuotePromptSync(context: string = ''): string {
  console.warn('⚠️ getQuotePromptSync는 더 이상 사용되지 않습니다. getQuotePrompt를 사용하세요.');
  return '프롬프트는 DB에서 관리됩니다. 관리자 페이지에서 프롬프트를 확인하세요.';
}

// 기본 프롬프트 내보내기 (더 이상 사용하지 않음)
// 모든 프롬프트는 DB에서 관리되므로 이 기본 프롬프트는 사용되지 않습니다.
// 호환성을 위해 유지하지만 실제로는 사용되지 않습니다.
export { DEFAULT_QUOTE_PROMPT };

// 견적 관련 기본 답변 생성 함수 (API 키 없을 때 사용)
// 이제 데이터베이스에서 프롬프트를 가져와서 사용합니다.
export async function generateQuoteResponse(userMessage: string): Promise<string> {
  try {
    // 데이터베이스에서 프롬프트 가져오기
    const prompt = await getQuotePrompt('');
    
    // 프롬프트를 기반으로 간단한 답변 생성
    // OpenAI API가 없을 때는 프롬프트 내용을 그대로 사용하거나 간단히 요약
    const message = userMessage.toLowerCase();
    
    // 프롬프트에서 전화번호 추출 (프롬프트에 포함된 전화번호 사용)
    const phoneMatch = prompt.match(/전화[\(\)\s]*([0-9-]+)/);
    const phone = phoneMatch ? phoneMatch[1] : '02-1234-5678';
    
    // 프롬프트 내용을 기반으로 답변 생성
    if (message.includes('uv') || message.includes('코팅')) {
      // 프롬프트에서 UV 코팅 정보 추출
      const uvMatch = prompt.match(/UV 코팅[^]*?기본 단가[^]*?([0-9,]+-[0-9,]+원\/매)/);
      const uvPrice = uvMatch ? uvMatch[1] : '500-1,000원/매';
      return `✨ UV 코팅 견적 안내:\n\n📏 기본 단가: A4 기준 약 ${uvPrice}\n📦 수량별 할인:\n  • 100매 이상: 10% 할인\n  • 500매 이상: 20% 할인\n  • 1,000매 이상: 30% 할인\n\n📋 견적에 필요한 정보:\n  • 인쇄물 종류 및 크기\n  • 수량\n  • 납기일\n\n정확한 견적은 파일 확인 후 가능합니다. 전화(${phone}) 또는 온라인 문의로 상세 견적을 받아보세요! 📞`;
    }
    
    // 일반 견적 문의 - 프롬프트 내용 요약
    if (message.includes('견적') || message.includes('가격') || message.includes('비용') || message.includes('단가')) {
      // 프롬프트에서 주요 정보 추출
      return `💰 견적 문의 안내:\n\n${prompt}\n\n정확한 견적을 위해서는:\n  • 인쇄 파일\n  • 수량\n  • 납기일\n\n위 정보를 알려주시면 빠른 견적을 제공해드립니다.\n전화(${phone}) 또는 온라인 문의로 상세 견적을 받아보세요! 📞`;
    }
    
    // 기본 안내
    return `견적 문의를 도와드리겠습니다!\n\n${prompt}\n\n궁금한 점이 있으시면 전화(${phone}) 또는 온라인 문의로 연락해 주세요! 📞`;
  } catch (error) {
    console.error('프롬프트 기반 답변 생성 오류:', error);
    // 오류 발생 시 기본 답변
    return '견적 문의를 도와드리겠습니다! 정확한 견적을 위해 전화(02-1234-5678) 또는 온라인 문의로 연락해 주세요.';
  }
}

// 챗봇 응답 생성 함수
export async function generateChatbotResponse(
  userMessage: string,
  context: string,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = [],
  isQuoteInquiry: boolean = false
): Promise<string> {
  // OpenAI API 키가 없는 경우 DB 프롬프트 기반 답변 생성
  if (!openai) {
    // 견적 문의인 경우
    if (isQuoteInquiry) {
      return await generateQuoteResponse(userMessage);
    }
    // 일반 문의인 경우도 DB 프롬프트 기반으로 답변 생성
    try {
      const { getQuotePrompt } = await import('@/lib/openai');
      const prompt = await getQuotePrompt(context);
      
      // 프롬프트에서 정보 추출하여 답변 생성
      const phoneMatch = prompt.match(/전화[\(\)\s]*([0-9-]+)/);
      const emailMatch = prompt.match(/이메일[:\s]*([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+)/);
      const phone = phoneMatch ? phoneMatch[1] : '02-1234-5678';
      const email = emailMatch ? emailMatch[1] : 'info@jeongwoo.co.kr';
      
      // 사용자 메시지에 따라 프롬프트 기반 답변 생성
      const messageLower = userMessage.toLowerCase();
      
      if (messageLower.includes('연락처') || messageLower.includes('전화') || messageLower.includes('연락') || messageLower.includes('연락처 안내')) {
        // 프롬프트에서 연락처 안내 관련 내용 찾기
        const contactMatch = prompt.match(/연락처 안내[^]*?(?=\n\n|$)/i);
        if (contactMatch) {
          // 프롬프트에 연락처 안내 내용이 있으면 사용
          let contactResponse = contactMatch[0];
          // 전화번호와 이메일을 프롬프트에서 추출한 것으로 교체
          contactResponse = contactResponse.replace(/02-[0-9-]+/g, phone);
          contactResponse = contactResponse.replace(/info@[^\s]+/g, email);
          return contactResponse;
        }
        // 프롬프트에 없으면 기본 답변
        const addressMatch = prompt.match(/주소[:\s]*([^\n]+)/);
        const hoursMatch = prompt.match(/영업시간[:\s]*([^\n]+)/);
        const address = addressMatch ? addressMatch[1].trim() : '서울시 XX구 XX동';
        const hours = hoursMatch ? hoursMatch[1].trim() : '평일 09:00 - 18:00';
        return `연락처 정보:\n\n📞 전화: ${phone}\n📧 이메일: ${email}\n📍 주소: ${address}\n⏰ 영업시간: ${hours}\n\n온라인 문의 폼: /contact\n무료 상담 서비스 제공 중입니다! 😊`;
      }
      
      if (messageLower.includes('상담원') || messageLower.includes('상담원 연결')) {
        // 프롬프트에서 상담원 연결 관련 내용 찾기
        const agentMatch = prompt.match(/상담원[^]*?(?:전화|이메일|연락)[^]*?(?:\n|$)/i);
        if (agentMatch) {
          // 프롬프트에 상담원 연결 내용이 있으면 사용
          return `상담원 연결 안내:\n\n${agentMatch[0]}\n\n상담원과 직접 대화하시려면:\n📞 전화: ${phone}\n📧 이메일: ${email}\n🌐 온라인 문의: /contact\n\n전화 상담은 평일 09:00-18:00 가능합니다.\n이메일 문의는 24시간 접수 가능하며, 24시간 이내 답변드립니다.`;
        }
        // 프롬프트에 없으면 기본 답변
        return `상담원 연결 안내:\n\n상담원과 직접 대화하시려면:\n📞 전화: ${phone}\n📧 이메일: ${email}\n🌐 온라인 문의: /contact\n\n전화 상담은 평일 09:00-18:00 가능합니다.\n이메일 문의는 24시간 접수 가능하며, 24시간 이내 답변드립니다.`;
      }
      
      if (messageLower.includes('파일') && (messageLower.includes('제출') || messageLower.includes('방법'))) {
        // 프롬프트에서 파일 제출 방법 관련 내용 찾기
        const fileMatch = prompt.match(/파일 제출 방법[^]*?(?=\n\n|$)/i);
        if (fileMatch) {
          // 프롬프트에 파일 제출 방법 내용이 있으면 사용
          let fileResponse = fileMatch[0];
          // 이메일 주소를 프롬프트에서 추출한 것으로 교체
          fileResponse = fileResponse.replace(/info@[^\s]+/g, email);
          return fileResponse;
        }
        // 프롬프트에 없으면 기본 답변
        return `파일 제출 방법 안내:\n\n📄 파일 형식: PDF, AI, EPS\n📐 해상도: 300DPI 이상\n🎨 컬러 모드: CMYK\n📍 코팅 영역: 별도 레이어로 표시\n\n파일 제출 방법:\n\n📧 이메일 제출:\n• 이메일 주소: ${email}\n• 제목에 "파일 제출" 명시\n• 파일 첨부 후 발송\n\n🌐 웹하드 업로드:\n• 웹하드 주소: https://webhard.jeongwoo.co.kr\n• 아이디/비밀번호: 문의 시 안내\n• 업로드 후 담당자에게 알림\n\n💬 온라인 문의 폼:\n• /contact 페이지에서 파일 첨부 가능\n• 문의 내용과 함께 파일 제출\n\n파일 크기가 큰 경우 웹하드나 이메일을 이용해주세요.`;
      }
      
      if (messageLower.includes('납기') || messageLower.includes('소요') || messageLower.includes('시간')) {
        // 프롬프트에서 납기일 관련 내용 찾기
        const deliveryMatch = prompt.match(/납기일[^]*?(?=\n\n|$)/i) || prompt.match(/작업 프로세스[^]*?(?=\n\n|$)/i);
        if (deliveryMatch) {
          // 프롬프트에 납기일 내용이 있으면 사용
          return `작업 소요시간 안내:\n\n${deliveryMatch[0]}\n\n정확한 납기일은 작업량과 난이도에 따라 달라질 수 있으니, 상세한 문의 부탁드립니다.`;
        }
        // 프롬프트에 없으면 기본 답변
        return `작업 소요시간 안내:\n\n⏱️ 일반 작업: 2-3일\n⚡ 긴급 작업: 당일 가능 (추가 비용 발생)\n📦 택배 발송: 1일 추가\n\n정확한 납기일은 작업량과 난이도에 따라 달라질 수 있으니, 상세한 문의 부탁드립니다.`;
      }
      
      // 일반 답변 - 프롬프트 내용 요약
      return `정우특수코팅에 대해 문의해 주셔서 감사합니다! 프롬프트에 명시된 정보를 바탕으로 답변드리겠습니다.\n\n더 자세한 정보나 정확한 견적을 원하시면 전화(${phone}) 또는 이메일(${email})로 문의해 주세요. 친절하게 안내해 드리겠습니다! 😊`;
    } catch (error) {
      console.error('프롬프트 기반 답변 생성 오류:', error);
      return '죄송합니다. 일시적인 오류가 발생했습니다. 정우특수코팅 담당자에게 직접 문의해 주세요.';
    }
  }
  
  try {
    // 모든 경우에 DB에서 프롬프트 가져오기 (견적 문의든 아니든 모두 동일한 프롬프트 사용)
    const prompt = await getQuotePrompt(context);
    const systemPrompt = prompt;

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

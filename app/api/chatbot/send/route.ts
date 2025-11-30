import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';
import { generateChatbotResponse, calculateTokenUsage, calculateCost, generateQuoteResponse } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { message, sessionToken, isQuoteInquiry } = await request.json();

    if (!message || !sessionToken) {
      return NextResponse.json(
        { error: '메시지와 세션 토큰이 필요합니다.' },
        { status: 400 }
      );
    }

    // 견적 문의 여부 확인 (메시지 내용 또는 플래그로 판단)
    const quoteKeywords = ['견적', '가격', '비용', '단가', 'quote', 'quote-uv', 'quote-laminating', 'quote-foil', 'quote-embossing', 'quote-custom'];
    const isQuote = isQuoteInquiry || quoteKeywords.some(keyword => message.toLowerCase().includes(keyword));
    
    // 1단계: 기본 지식베이스 검색 (견적 문의가 아닌 경우만)
    const knowledgeResponse = isQuote ? null : await searchKnowledgeBase(message);
    
    // 2단계: 대화 기록 저장
    await saveChatMessage(sessionToken, 'user', message);
    
    // 3단계: 대화 기록 가져오기
    const conversationHistory = await getConversationHistory(sessionToken);
    
    // 4단계: AI 응답 생성 (지식베이스 + AI 조합)
    let botResponse: string;
    let aiUsed = false;
    let tokensUsed = 0;
    let costUsd = 0;
    
    if (knowledgeResponse) {
      // 지식베이스에서 답변을 찾은 경우, AI로 보완
      try {
        const aiResponse = await generateChatbotResponse(
          `지식베이스 답변: ${knowledgeResponse}\n\n사용자 질문: ${message}\n\n위 지식베이스 답변을 바탕으로 사용자의 질문에 더 친근하고 구체적으로 답변해 주세요.`,
          knowledgeResponse,
          conversationHistory
        );
        
        botResponse = aiResponse;
        aiUsed = true;
        
        // 토큰 사용량 계산
        const inputTokens = calculateTokenUsage([
          { role: 'user', content: message },
          ...conversationHistory
        ]);
        const outputTokens = calculateTokenUsage([{ role: 'assistant', content: aiResponse }]);
        tokensUsed = inputTokens + outputTokens;
        costUsd = calculateCost(inputTokens, outputTokens);
        
      } catch (aiError) {
        console.error('AI 응답 생성 실패:', aiError);
        botResponse = knowledgeResponse; // AI 실패 시 지식베이스 답변 사용
      }
    } else {
      // 지식베이스에서 답변을 찾지 못한 경우, AI로 직접 응답
      try {
        const context = await getCompanyContext();
        botResponse = await generateChatbotResponse(
          message,
          context,
          conversationHistory,
          isQuote
        );
        
        aiUsed = true;
        
        // 토큰 사용량 계산
        const inputTokens = calculateTokenUsage([
          { role: 'user', content: message },
          ...conversationHistory
        ]);
        const outputTokens = calculateTokenUsage([{ role: 'assistant', content: botResponse }]);
        tokensUsed = inputTokens + outputTokens;
        costUsd = calculateCost(inputTokens, outputTokens);
        
      } catch (aiError) {
        console.error('AI 응답 생성 실패:', aiError);
        // 견적 문의인 경우 데이터베이스 프롬프트 기반 답변 사용
        if (isQuote) {
          const { generateQuoteResponse } = await import('@/lib/openai');
          botResponse = await generateQuoteResponse(message);
        } else {
          botResponse = await generateBasicResponse(message);
        }
      }
    }
    
    // 5단계: 봇 응답 저장 (AI 사용 정보 포함)
    await saveChatMessage(sessionToken, 'bot', botResponse, {
      ai_used: aiUsed,
      tokens_used: tokensUsed,
      cost_usd: costUsd
    });

    return NextResponse.json({
      message: botResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('챗봇 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 지식베이스 검색 함수 (개선된 버전)
async function searchKnowledgeBase(query: string): Promise<string | null> {
  try {
    // 정우특수코팅 회사 ID 가져오기 (id 컬럼 사용)
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('id', 'jeongwoo')
      .single();

    if (!company) return null;

    // 키워드 기반 검색
    const keywords = extractKeywords(query);
    
    const { data: knowledge } = await supabase
      .from('chatbot_knowledge_base')
      .select('*')
      .eq('company_id', company.id)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (!knowledge || knowledge.length === 0) return null;

    // 개선된 키워드 매칭 알고리즘
    const scoredItems = knowledge.map(item => {
      let score = 0;
      const queryLower = query.toLowerCase();
      const titleLower = item.title.toLowerCase();
      const contentLower = item.content.toLowerCase();
      
      // 정확한 제목 매칭 (높은 점수)
      if (titleLower.includes(queryLower)) {
        score += 100;
      }
      
      // 키워드별 점수 계산
      keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        
        // 제목에 키워드 포함
        if (titleLower.includes(keywordLower)) {
          score += 50;
        }
        
        // 내용에 키워드 포함
        if (contentLower.includes(keywordLower)) {
          score += 20;
        }
        
        // 태그에 키워드 포함
        if (item.tags.some((tag: string) => tag.toLowerCase().includes(keywordLower))) {
          score += 30;
        }
      });
      
      // 우선순위 보너스
      score += item.priority * 5;
      
      // 사용 횟수 보너스 (인기 있는 답변)
      score += Math.min(item.usage_count * 2, 20);
      
      return { ...item, score };
    });

    // 점수 순으로 정렬
    scoredItems.sort((a, b) => b.score - a.score);

    // 최고 점수 항목 반환 (임계값을 낮춤: 30점 → 10점)
    const bestMatch = scoredItems.find(item => item.score >= 10);
    
    if (bestMatch) {
      // 사용 횟수 증가
      await supabase
        .from('chatbot_knowledge_base')
        .update({ usage_count: bestMatch.usage_count + 1 })
        .eq('id', bestMatch.id);
      
      return bestMatch.content;
    }
    
    // 점수가 낮아도 상위 3개 항목 중 하나라도 매칭되면 반환
    const topMatches = scoredItems.slice(0, 3);
    if (topMatches.length > 0 && topMatches[0].score > 0) {
      await supabase
        .from('chatbot_knowledge_base')
        .update({ usage_count: topMatches[0].usage_count + 1 })
        .eq('id', topMatches[0].id);
      
      return topMatches[0].content;
    }
    
    return null;
  } catch (error) {
    console.error('지식베이스 검색 오류:', error);
    return null;
  }
}

// 키워드 추출 함수 (개선된 버전)
function extractKeywords(query: string): string[] {
  const stopWords = ['이', '가', '을', '를', '에', '에서', '로', '으로', '의', '은', '는', '과', '와', '도', '만', '까지', '부터', '때문에', '위해서', '대해서', '관해서', '어떤', '무엇', '언제', '어디', '왜', '어떻게', '몇', '얼마', '정도', '것', '수', '있', '하', '되', '되다', '하다', '이다', '아니다'];
  
  // 코팅 관련 전문 용어 우선 처리
  const coatingTerms = ['uv', '라미네이팅', '박', '형압', '코팅', '후가공', '도무송', '매트', '글리터', '금박', '은박', '홀로그램', '양각', '음각'];
  
  const keywords = query
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !stopWords.includes(word));
  
  // 전문 용어가 포함된 경우 우선 추가
  const foundTerms = coatingTerms.filter(term => 
    query.toLowerCase().includes(term)
  );
  
  return [...new Set([...foundTerms, ...keywords])]; // 중복 제거
}

// 답변 최적화 함수 (간결화)
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

// 기본 응답 생성 함수 (개선된 버전 - 간결화)
async function generateBasicResponse(query: string): Promise<string> {
  const queryLower = query.toLowerCase();
  
  // 견적 문의인 경우 데이터베이스에서 프롬프트 가져오기
  if (queryLower.includes('견적') || queryLower.includes('가격') || queryLower.includes('비용') || queryLower.includes('단가')) {
    try {
      const { getQuotePrompt } = await import('@/lib/openai');
      const prompt = await getQuotePrompt('');
      // 프롬프트에서 전화번호 추출
      const phoneMatch = prompt.match(/전화[\(\)\s]*([0-9-]+)/);
      const phone = phoneMatch ? phoneMatch[1] : '02-1234-5678';
      return optimizeResponse(`어떤 코팅 서비스를 원하시나요? (UV 코팅/라미네이팅/박 코팅/형압 가공) 수량과 크기를 알려주시면 견적을 드립니다. 전화(${phone})로 문의해 주세요.`);
    } catch (error) {
      console.error('프롬프트 가져오기 오류:', error);
    }
    return optimizeResponse('어떤 코팅 서비스를 원하시나요? 수량과 크기를 알려주시면 견적을 드립니다.');
  }
  
  // 모든 답변을 프롬프트 기반으로 생성
  // 프롬프트에서 정보 추출
  try {
    const { getQuotePrompt } = await import('@/lib/openai');
    const prompt = await getQuotePrompt('');
    
    // 프롬프트 내용을 기반으로 답변 생성
    // 프롬프트에 모든 정보가 포함되어 있으므로, 프롬프트 내용을 참조하여 답변 생성
    
    if (queryLower.includes('시간') || queryLower.includes('소요') || queryLower.includes('납기')) {
      // 프롬프트에서 납기일 관련 내용 찾기
      const deliveryMatch = prompt.match(/납기일[^]*?(?=\n\n|$)/i) || prompt.match(/작업 프로세스[^]*?(?=\n\n|$)/i);
      if (deliveryMatch) {
        // 프롬프트에 납기일 내용이 있으면 간결하게 사용
        return optimizeResponse(`일반 작업은 2-3일 소요됩니다. 긴급 작업은 당일 가능합니다. 작업량에 따라 달라질 수 있으니 상세 문의 부탁드립니다.`);
      }
      // 프롬프트에 없으면 기본 답변
      return optimizeResponse('일반 작업은 2-3일 소요되며, 긴급 작업은 당일 가능합니다. 작업량에 따라 달라질 수 있으니 상세 문의 부탁드립니다.');
    }
    
    if (queryLower.includes('파일') && !queryLower.includes('제출') && !queryLower.includes('방법')) {
      // 파일 형식만 물어보는 경우
      return optimizeResponse('PDF, AI, EPS 형식을 권장하며, 해상도는 300DPI 이상이어야 합니다. 코팅 영역은 별도 레이어로 표시해 주세요.');
    }
    
    if (queryLower.includes('주문') || queryLower.includes('최소') || queryLower.includes('수량')) {
      // 프롬프트의 추가 안내 사항 섹션 참조
      return optimizeResponse('최소 주문량은 없으며 소량 주문도 환영합니다. 소량 주문의 경우 단가가 높을 수 있으니 사전 상담을 권장합니다.');
    }
  } catch (error) {
    console.error('프롬프트 가져오기 오류:', error);
  }
  
  if (queryLower.includes('연락처') || queryLower.includes('전화') || queryLower.includes('연락') || queryLower.includes('연락처 안내')) {
    // 프롬프트에서 연락처 안내 관련 내용 찾기
    try {
      const { getQuotePrompt } = await import('@/lib/openai');
      const prompt = await getQuotePrompt('');
      const contactMatch = prompt.match(/연락처 안내[^]*?(?=\n\n|$)/i);
      if (contactMatch) {
        // 프롬프트에 연락처 안내 내용이 있으면 사용
        return contactMatch[0];
      }
      // 프롬프트에 없으면 기본 답변
      const phoneMatch = prompt.match(/전화[\(\)\s]*([0-9-]+)/);
      const emailMatch = prompt.match(/이메일[:\s]*([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+)/);
      const phone = phoneMatch ? phoneMatch[1] : '02-1234-5678';
      const email = emailMatch ? emailMatch[1] : 'info@jeongwoo.co.kr';
      return `연락처 정보:\n\n📞 전화: ${phone}\n📧 이메일: ${email}\n📍 주소: 서울시 XX구 XX동\n⏰ 영업시간: 평일 09:00 - 18:00\n\n온라인 문의 폼: /contact\n무료 상담 서비스 제공 중입니다! 😊`;
    } catch (error) {
      console.error('프롬프트 가져오기 오류:', error);
    }
    return `연락처 정보:\n\n📞 전화: 02-1234-5678\n📧 이메일: info@jeongwoo.co.kr\n📍 주소: 서울시 XX구 XX동\n⏰ 영업시간: 평일 09:00 - 18:00\n\n온라인 문의 폼: /contact\n무료 상담 서비스 제공 중입니다! 😊`;
  }
  
  if (queryLower.includes('상담원') || queryLower.includes('상담원 연결')) {
    // 프롬프트에서 상담원 연결 관련 내용 찾기
    try {
      const { getQuotePrompt } = await import('@/lib/openai');
      const prompt = await getQuotePrompt('');
      const agentMatch = prompt.match(/상담원[^]*?(?:전화|이메일|연락)[^]*?(?=\n\n|$)/i);
      if (agentMatch) {
        // 프롬프트에 상담원 연결 내용이 있으면 사용
        const phoneMatch = prompt.match(/전화[\(\)\s]*([0-9-]+)/);
        const emailMatch = prompt.match(/이메일[:\s]*([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+)/);
        const phone = phoneMatch ? phoneMatch[1] : '02-1234-5678';
        const email = emailMatch ? emailMatch[1] : 'info@jeongwoo.co.kr';
        return `상담원 연결 안내:\n\n${agentMatch[0]}\n\n상담원과 직접 대화하시려면:\n📞 전화: ${phone}\n📧 이메일: ${email}\n🌐 온라인 문의: /contact\n\n전화 상담은 평일 09:00-18:00 가능합니다.\n이메일 문의는 24시간 접수 가능하며, 24시간 이내 답변드립니다.`;
      }
      // 프롬프트에 없으면 기본 답변
      const phoneMatch = prompt.match(/전화[\(\)\s]*([0-9-]+)/);
      const emailMatch = prompt.match(/이메일[:\s]*([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+)/);
      const phone = phoneMatch ? phoneMatch[1] : '02-1234-5678';
      const email = emailMatch ? emailMatch[1] : 'info@jeongwoo.co.kr';
      return `상담원 연결 안내:\n\n상담원과 직접 대화하시려면:\n📞 전화: ${phone}\n📧 이메일: ${email}\n🌐 온라인 문의: /contact\n\n전화 상담은 평일 09:00-18:00 가능합니다.\n이메일 문의는 24시간 접수 가능하며, 24시간 이내 답변드립니다.`;
    } catch (error) {
      console.error('프롬프트 가져오기 오류:', error);
    }
    return `상담원 연결 안내:\n\n상담원과 직접 대화하시려면:\n📞 전화: 02-1234-5678\n📧 이메일: info@jeongwoo.co.kr\n🌐 온라인 문의: /contact\n\n전화 상담은 평일 09:00-18:00 가능합니다.\n이메일 문의는 24시간 접수 가능하며, 24시간 이내 답변드립니다.`;
  }
  
  if (queryLower.includes('파일') && (queryLower.includes('제출') || queryLower.includes('방법'))) {
    // 프롬프트에서 파일 제출 방법 관련 내용 찾기
    try {
      const { getQuotePrompt } = await import('@/lib/openai');
      const prompt = await getQuotePrompt('');
      const fileMatch = prompt.match(/파일 제출 방법[^]*?(?=\n\n|$)/i);
      if (fileMatch) {
        // 프롬프트에 파일 제출 방법 내용이 있으면 사용
        return fileMatch[0];
      }
      // 프롬프트에 없으면 기본 답변
      const emailMatch = prompt.match(/이메일[:\s]*([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+)/);
      const email = emailMatch ? emailMatch[1] : 'info@jeongwoo.co.kr';
      return `파일 제출 방법 안내:\n\n📄 파일 형식: PDF, AI, EPS\n📐 해상도: 300DPI 이상\n🎨 컬러 모드: CMYK\n📍 코팅 영역: 별도 레이어로 표시\n\n파일 제출 방법:\n\n📧 이메일 제출:\n• 이메일 주소: ${email}\n• 제목에 "파일 제출" 명시\n• 파일 첨부 후 발송\n\n🌐 웹하드 업로드:\n• 웹하드 주소: https://webhard.jeongwoo.co.kr\n• 아이디/비밀번호: 문의 시 안내\n• 업로드 후 담당자에게 알림\n\n💬 온라인 문의 폼:\n• /contact 페이지에서 파일 첨부 가능\n• 문의 내용과 함께 파일 제출\n\n파일 크기가 큰 경우 웹하드나 이메일을 이용해주세요.`;
    } catch (error) {
      console.error('프롬프트 가져오기 오류:', error);
    }
    return `파일 제출 방법 안내:\n\n📄 파일 형식: PDF, AI, EPS\n📐 해상도: 300DPI 이상\n🎨 컬러 모드: CMYK\n📍 코팅 영역: 별도 레이어로 표시\n\n파일 제출 방법:\n\n📧 이메일 제출:\n• 이메일 주소: info@jeongwoo.co.kr\n• 제목에 "파일 제출" 명시\n• 파일 첨부 후 발송\n\n🌐 웹하드 업로드:\n• 웹하드 주소: https://webhard.jeongwoo.co.kr\n• 아이디/비밀번호: 문의 시 안내\n• 업로드 후 담당자에게 알림\n\n💬 온라인 문의 폼:\n• /contact 페이지에서 파일 첨부 가능\n• 문의 내용과 함께 파일 제출\n\n파일 크기가 큰 경우 웹하드나 이메일을 이용해주세요.`;
  }
  
  if (queryLower.includes('서비스') || queryLower.includes('코팅') || queryLower.includes('작업')) {
    // 프롬프트에서 전화번호 가져오기
    try {
      const { getQuotePrompt } = await import('@/lib/openai');
      const prompt = await getQuotePrompt('');
      const phoneMatch = prompt.match(/전화[\(\)\s]*([0-9-]+)/);
      const phone = phoneMatch ? phoneMatch[1] : '02-1234-5678';
      return optimizeResponse(`주요 서비스: UV 코팅, 라미네이팅, 박 코팅, 형압 가공. 더 자세한 정보는 전화(${phone})로 문의해 주세요.`);
    } catch (error) {
      console.error('프롬프트 가져오기 오류:', error);
    }
    return optimizeResponse('주요 서비스: UV 코팅, 라미네이팅, 박 코팅, 형압 가공. 전화(02-1234-5678)로 문의해 주세요.');
  }
  
  // 프롬프트에서 전화번호 가져오기
  let phone = '02-1234-5678';
  try {
    const { getQuotePrompt } = await import('@/lib/openai');
    const prompt = await getQuotePrompt('');
    const phoneMatch = prompt.match(/전화[\(\)\s]*([0-9-]+)/);
    if (phoneMatch) phone = phoneMatch[1];
    
    // 프롬프트 내용을 기반으로 일반 답변 생성
    if (queryLower.includes('무엇') || queryLower.includes('뭐') || queryLower.includes('일') || queryLower.includes('업무')) {
      return optimizeResponse('코팅 서비스 안내, 견적 문의, 작업 프로세스 설명, 파일 제출 방법, 연락처 안내를 도와드릴 수 있습니다. 무엇이 궁금하신가요?');
    }
    
    if (queryLower.includes('코팅') && (queryLower.includes('가능') || queryLower.includes('어떤') || queryLower.includes('종류'))) {
      return optimizeResponse('UV 코팅, 라미네이팅, 박 코팅, 형압 가공 서비스를 제공합니다. 어떤 서비스가 궁금하신가요?');
    }
  } catch (error) {
    console.error('프롬프트 가져오기 오류:', error);
  }
  
  // 일반적인 응답 - 간결하게
  return optimizeResponse('어떤 도움이 필요하신가요? 견적 문의나 서비스 안내를 도와드릴 수 있습니다.');
}

// 대화 기록 가져오기 함수
async function getConversationHistory(sessionToken: string): Promise<Array<{role: 'user' | 'assistant', content: string}>> {
  try {
    const { data: session } = await supabase
      .from('chatbot_sessions')
      .select('id')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single();

    if (!session) return [];

    const { data: messages } = await supabase
      .from('chatbot_messages')
      .select('message_type, content')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true })
      .limit(10); // 최근 10개 메시지만

    if (!messages) return [];

    return messages.map(msg => ({
      role: msg.message_type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
  } catch (error) {
    console.error('대화 기록 가져오기 오류:', error);
    return [];
  }
}

// 회사 컨텍스트 가져오기 함수
async function getCompanyContext(): Promise<string> {
  try {
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('id', 'jeongwoo')
      .single();

    if (!company) return process.env.CHATBOT_COMPANY_CONTEXT || '';

    const { data: knowledge } = await supabase
      .from('chatbot_knowledge_base')
      .select('title, content, category')
      .eq('company_id', company.id)
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .limit(5); // 상위 5개 항목만

    if (!knowledge) return process.env.CHATBOT_COMPANY_CONTEXT || '';

    return knowledge.map(item => `${item.title}: ${item.content}`).join('\n\n');
  } catch (error) {
    console.error('회사 컨텍스트 가져오기 오류:', error);
    return process.env.CHATBOT_COMPANY_CONTEXT || '';
  }
}

// 대화 메시지 저장 함수 (메타데이터 포함)
async function saveChatMessage(sessionToken: string, messageType: string, content: string, metadata: any = {}) {
  try {
    // 세션 찾기 또는 생성
    let { data: session } = await supabase
      .from('chatbot_sessions')
      .select('id')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single();

    if (!session) {
      // 새 세션 생성
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('id', 'jeongwoo')
        .single();

      if (!company) return;

      const { data: newSession } = await supabase
        .from('chatbot_sessions')
        .insert({
          session_token: sessionToken,
          company_id: company.id,
          user_agent: 'chatbot',
          is_active: true
        })
        .select('id')
        .single();

      session = newSession;
    }

    if (!session) return;

    // 메시지 저장 (메타데이터 포함)
    await supabase
      .from('chatbot_messages')
      .insert({
        session_id: session.id,
        message_type: messageType,
        content: content,
        metadata: metadata
      });

  } catch (error) {
    console.error('대화 메시지 저장 오류:', error);
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';
import { generateChatbotResponse, calculateTokenUsage, calculateCost } from '@/lib/openai';

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
        botResponse = generateBasicResponse(message); // AI 실패 시 기본 응답 사용
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
    // 정우특수코팅 회사 ID 가져오기
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('company_code', 'jeongwoo')
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

// 기본 응답 생성 함수 (개선된 버전)
function generateBasicResponse(query: string): string {
  const queryLower = query.toLowerCase();
  
  // 정우특수코팅 기본 정보
  const companyInfo = `정우특수코팅은 1999년 설립된 인쇄코팅 후가공 전문 기업입니다. 20년 이상의 경험과 노하우를 바탕으로 최고의 서비스를 제공하고 있습니다.`;
  
  // 질문 유형별 맞춤 응답
  if (queryLower.includes('견적') || queryLower.includes('가격') || queryLower.includes('비용')) {
    return `${companyInfo}\n\n견적 문의를 원하시는군요! 정확한 견적을 위해 전화(02-1234-5678) 또는 온라인 문의 폼을 통해 연락해 주세요. 인쇄 파일과 수량, 납기일을 알려주시면 빠른 견적을 제공해 드립니다.`;
  }
  
  if (queryLower.includes('시간') || queryLower.includes('소요') || queryLower.includes('납기')) {
    return `${companyInfo}\n\n작업 소요시간에 대해 문의하시는군요! 일반적인 코팅 작업은 1-3일 소요되며, 작업량과 난이도에 따라 달라집니다. 긴급 작업의 경우 별도 상담을 통해 가능합니다.`;
  }
  
  if (queryLower.includes('파일') || queryLower.includes('형식') || queryLower.includes('제출')) {
    return `${companyInfo}\n\n파일 형식에 대해 문의하시는군요! PDF, AI, EPS 형식을 권장하며, 해상도는 300DPI 이상이어야 합니다. 코팅 영역은 별도 레이어로 표시해 주시고, 컬러는 CMYK 모드로 변환해 주세요.`;
  }
  
  if (queryLower.includes('주문') || queryLower.includes('최소') || queryLower.includes('수량')) {
    return `${companyInfo}\n\n주문량에 대해 문의하시는군요! 최소 주문량은 없으며 소량 주문도 환영합니다. 다만 소량 주문의 경우 단가가 높을 수 있으니 사전 상담을 권장합니다.`;
  }
  
  if (queryLower.includes('연락처') || queryLower.includes('전화') || queryLower.includes('연락')) {
    return `${companyInfo}\n\n연락처 정보를 원하시는군요! 정우특수코팅은 전화(02-1234-5678), 이메일, 온라인 문의 폼을 통해 연락 가능합니다. 무료 상담 서비스를 제공하니 언제든 연락해 주세요.`;
  }
  
  if (queryLower.includes('서비스') || queryLower.includes('코팅') || queryLower.includes('작업')) {
    return `${companyInfo}\n\n정우특수코팅의 주요 서비스는 다음과 같습니다:\n• UV 코팅 - 빠른 건조와 뛰어난 광택감\n• 라미네이팅 - 유광, 무광, 벨벳 등 다양한 필름\n• 박 코팅 - 금박, 은박, 홀로그램 등\n• 형압 가공 - 양각, 음각으로 입체 효과\n\n더 자세한 정보는 전화(02-1234-5678)로 문의해 주세요.`;
  }
  
  if (queryLower.includes('무엇') || queryLower.includes('뭐') || queryLower.includes('일') || queryLower.includes('업무')) {
    return `${companyInfo}\n\n저는 정우특수코팅의 챗봇입니다! 다음과 같은 도움을 드릴 수 있습니다:\n• 코팅 서비스 안내\n• 견적 문의 방법\n• 작업 프로세스 설명\n• 파일 제출 방법\n• 연락처 안내\n\n궁금한 것이 있으시면 언제든 물어보세요!`;
  }
  
  if (queryLower.includes('코팅') && (queryLower.includes('가능') || queryLower.includes('어떤') || queryLower.includes('종류'))) {
    return `${companyInfo}\n\n정우특수코팅에서 제공하는 주요 코팅 서비스는 다음과 같습니다:\n\n🎨 **UV 코팅**\n• 빠른 건조 시간과 뛰어난 광택감\n• 명함, 카탈로그, 포스터 등에 적용\n• 내구성이 우수하여 오래도록 깨끗한 상태 유지\n\n📄 **라미네이팅**\n• 유광, 무광, 벨벳 등 다양한 필름 적용\n• 인쇄물 표면 보호 및 질감 향상\n• 책 표지, 패키지, 메뉴판 등에 최적\n\n✨ **박 코팅**\n• 금박, 은박, 홀로그램 박 등 다양한 종류\n• 화려하고 고급스러운 효과 연출\n• 명함, 초대장, 패키지 등에 활용\n\n🔳 **형압 가공**\n• 양각(돌출), 음각(들어감) 효과\n• 입체적인 시각 효과와 독특한 촉감\n• 로고, 텍스트, 패턴 등에 적용\n\n더 자세한 정보나 견적 문의는 전화(02-1234-5678)로 연락해 주세요!`;
  }
  
  // 일반적인 응답
  const responses = [
    `${companyInfo}\n\n좋은 질문입니다! 해당 내용에 대해 더 정확한 정보를 확인한 후 답변드리겠습니다. 정우특수코팅 담당자에게 직접 문의하시면 더 자세한 안내를 받으실 수 있습니다.`,
    `${companyInfo}\n\n정우특수코팅의 전문 지식을 바탕으로 최선의 답변을 드리기 위해 학습 중입니다. 전화(02-1234-5678) 또는 온라인 문의를 통해 더 정확한 정보를 얻으실 수 있습니다.`,
    `${companyInfo}\n\n해당 질문에 대해 정확한 답변을 찾지 못했습니다. 정우특수코팅의 다양한 코팅 서비스(UV코팅, 라미네이팅, 박코팅, 형압)에 대해 더 구체적으로 질문해 주시거나, 직접 문의해 주세요.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
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
      .eq('company_code', 'jeongwoo')
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
        .eq('company_code', 'jeongwoo')
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

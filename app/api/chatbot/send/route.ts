import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { message, sessionToken } = await request.json();

    if (!message || !sessionToken) {
      return NextResponse.json(
        { error: '메시지와 세션 토큰이 필요합니다.' },
        { status: 400 }
      );
    }

    // 1단계: 기본 지식베이스 검색
    const knowledgeResponse = await searchKnowledgeBase(message);
    
    // 2단계: 대화 기록 저장
    await saveChatMessage(sessionToken, 'user', message);
    
    // 3단계: 응답 생성 (현재는 기본 응답, 나중에 AI API 연동)
    let botResponse = knowledgeResponse || generateBasicResponse(message);
    
    // 4단계: 봇 응답 저장
    await saveChatMessage(sessionToken, 'bot', botResponse);

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

// 지식베이스 검색 함수
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

    // 간단한 키워드 매칭
    for (const item of knowledge) {
      if (keywords.some(keyword => 
        item.title.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(keyword))
      )) {
        // 사용 횟수 증가
        await supabase
          .from('chatbot_knowledge_base')
          .update({ usage_count: item.usage_count + 1 })
          .eq('id', item.id);
        
        return item.content;
      }
    }

    return null;
  } catch (error) {
    console.error('지식베이스 검색 오류:', error);
    return null;
  }
}

// 키워드 추출 함수
function extractKeywords(query: string): string[] {
  const stopWords = ['이', '가', '을', '를', '에', '에서', '로', '으로', '의', '은', '는', '과', '와', '도', '만', '까지', '부터', '때문에', '위해서', '대해서', '관해서'];
  
  return query
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !stopWords.includes(word));
}

// 기본 응답 생성 함수
function generateBasicResponse(query: string): string {
  const responses = [
    '죄송합니다. 해당 질문에 대한 정확한 답변을 찾지 못했습니다. 좀 더 구체적으로 질문해 주시거나, 정우특수코팅 담당자에게 직접 문의해 주세요.',
    '좋은 질문입니다! 해당 내용에 대해 정확한 정보를 확인한 후 답변드리겠습니다. 잠시만 기다려 주세요.',
    '정우특수코팅의 전문 지식을 바탕으로 최선의 답변을 드리기 위해 학습 중입니다. 곧 더 정확한 정보를 제공할 수 있도록 준비하고 있습니다.'
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// 대화 메시지 저장 함수
async function saveChatMessage(sessionToken: string, messageType: string, content: string) {
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

    // 메시지 저장
    await supabase
      .from('chatbot_messages')
      .insert({
        session_id: session.id,
        message_type: messageType,
        content: content
      });

  } catch (error) {
    console.error('대화 메시지 저장 오류:', error);
  }
}

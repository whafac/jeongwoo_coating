import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

// 대화 기록 조회 API (페이지네이션 지원)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get('sessionToken');
    const limit = parseInt(searchParams.get('limit') || '20'); // 기본 20개
    const offset = parseInt(searchParams.get('offset') || '0'); // 기본 0부터

    if (!sessionToken) {
      return NextResponse.json(
        { error: '세션 토큰이 필요합니다.' },
        { status: 400 }
      );
    }

    // 세션 찾기
    const { data: session } = await supabase
      .from('chatbot_sessions')
      .select('id')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single();

    if (!session) {
      return NextResponse.json({
        messages: [],
        totalCount: 0,
        hasMore: false
      });
    }

    // 전체 메시지 개수 조회
    const { count: totalCount } = await supabase
      .from('chatbot_messages')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', session.id);

    // 최신 메시지부터 가져오기 (내림차순)
    // offset=0이면 최신 메시지부터
    const { data: messages } = await supabase
      .from('chatbot_messages')
      .select('message_type, content, created_at')
      .eq('session_id', session.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (!messages) {
      return NextResponse.json({
        messages: [],
        totalCount: totalCount || 0,
        hasMore: false
      });
    }

    // 프론트엔드 형식으로 변환 (시간순으로 정렬하여 반환)
    const formattedMessages = messages
      .map((msg, index) => ({
        id: `msg_${offset + index}`,
        text: msg.content,
        isUser: msg.message_type === 'user',
        timestamp: new Date(msg.created_at)
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()); // 시간순 정렬

    const hasMore = totalCount ? (offset + limit < totalCount) : false;

    return NextResponse.json({
      messages: formattedMessages,
      totalCount: totalCount || 0,
      hasMore: hasMore,
      offset: offset,
      limit: limit
    });

  } catch (error) {
    console.error('대화 기록 조회 오류:', error);
    return NextResponse.json(
      { error: '대화 기록을 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}


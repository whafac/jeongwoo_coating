import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

// 대화 기록 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get('sessionToken');

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
        messages: []
      });
    }

    // 메시지 가져오기
    const { data: messages } = await supabase
      .from('chatbot_messages')
      .select('message_type, content, created_at')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true });

    if (!messages) {
      return NextResponse.json({
        messages: []
      });
    }

    // 프론트엔드 형식으로 변환
    const formattedMessages = messages.map((msg, index) => ({
      id: `msg_${index}`,
      text: msg.content,
      isUser: msg.message_type === 'user',
      timestamp: new Date(msg.created_at)
    }));

    return NextResponse.json({
      messages: formattedMessages
    });

  } catch (error) {
    console.error('대화 기록 조회 오류:', error);
    return NextResponse.json(
      { error: '대화 기록을 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}


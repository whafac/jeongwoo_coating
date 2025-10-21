import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { messageId, feedback, comment, sessionToken } = await request.json();

    if (!messageId || !feedback || !sessionToken) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 유효한 피드백 값 검증
    if (!['helpful', 'not_helpful', 'neutral'].includes(feedback)) {
      return NextResponse.json(
        { error: '유효하지 않은 피드백 값입니다.' },
        { status: 400 }
      );
    }

    // 세션 찾기
    const { data: session } = await supabase
      .from('chatbot_sessions')
      .select('id, company_id')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single();

    if (!session) {
      return NextResponse.json(
        { error: '유효하지 않은 세션입니다.' },
        { status: 404 }
      );
    }

    // 메시지 찾기
    const { data: message } = await supabase
      .from('chatbot_messages')
      .select('id, content, metadata')
      .eq('id', messageId)
      .eq('session_id', session.id)
      .single();

    if (!message) {
      return NextResponse.json(
        { error: '메시지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 피드백 저장
    const { data: feedbackData, error } = await supabase
      .from('chatbot_learning_data')
      .insert({
        company_id: session.company_id,
        user_question: message.metadata?.original_question || '',
        bot_response: message.content,
        user_feedback: feedback,
        feedback_comment: comment,
        ai_model: message.metadata?.ai_model || 'unknown',
        confidence_score: message.metadata?.confidence_score || 0
      })
      .select('id')
      .single();

    if (error) {
      console.error('피드백 저장 오류:', error);
      return NextResponse.json(
        { error: '피드백 저장에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 지식베이스 성공률 업데이트
    await updateKnowledgeBaseSuccessRate(session.company_id, message.content, feedback);

    // 분석 통계 업데이트
    await updateAnalytics(session.company_id, feedback);

    return NextResponse.json({
      success: true,
      message: '피드백이 성공적으로 저장되었습니다.',
      feedbackId: feedbackData.id
    });

  } catch (error) {
    console.error('피드백 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 지식베이스 성공률 업데이트 함수
async function updateKnowledgeBaseSuccessRate(companyId: string, response: string, feedback: string) {
  try {
    // 응답 내용과 일치하는 지식베이스 항목 찾기
    const { data: knowledgeItems } = await supabase
      .from('chatbot_knowledge_base')
      .select('id, success_rate, usage_count')
      .eq('company_id', companyId)
      .eq('is_active', true);

    if (!knowledgeItems) return;

    for (const item of knowledgeItems) {
      // 응답 내용에 지식베이스 내용이 포함되어 있는지 확인
      if (response.includes(item.id) || response.includes('지식베이스')) {
        const newUsageCount = item.usage_count + 1;
        let newSuccessRate = item.success_rate;

        // 피드백에 따른 성공률 계산
        if (feedback === 'helpful') {
          newSuccessRate = Math.min(100, item.success_rate + 2); // +2% 증가
        } else if (feedback === 'not_helpful') {
          newSuccessRate = Math.max(0, item.success_rate - 5); // -5% 감소
        }

        // 업데이트
        await supabase
          .from('chatbot_knowledge_base')
          .update({
            usage_count: newUsageCount,
            success_rate: newSuccessRate
          })
          .eq('id', item.id);
      }
    }
  } catch (error) {
    console.error('지식베이스 성공률 업데이트 오류:', error);
  }
}

// 분석 통계 업데이트 함수
async function updateAnalytics(companyId: string, feedback: string) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 오늘 날짜의 분석 데이터 찾기 또는 생성
    const { data: existingAnalytics } = await supabase
      .from('chatbot_analytics')
      .select('*')
      .eq('company_id', companyId)
      .eq('date', today)
      .single();

    if (existingAnalytics) {
      // 기존 데이터 업데이트
      const updates: any = {
        total_messages: existingAnalytics.total_messages + 1
      };

      if (feedback === 'helpful') {
        updates.user_satisfaction_score = Math.min(5.0, 
          (existingAnalytics.user_satisfaction_score * existingAnalytics.total_sessions + 5) / 
          (existingAnalytics.total_sessions + 1)
        );
      } else if (feedback === 'not_helpful') {
        updates.user_satisfaction_score = Math.max(1.0,
          (existingAnalytics.user_satisfaction_score * existingAnalytics.total_sessions + 1) / 
          (existingAnalytics.total_sessions + 1)
        );
      }

      await supabase
        .from('chatbot_analytics')
        .update(updates)
        .eq('id', existingAnalytics.id);
    } else {
      // 새 데이터 생성
      await supabase
        .from('chatbot_analytics')
        .insert({
          company_id: companyId,
          date: today,
          total_sessions: 1,
          total_messages: 1,
          user_satisfaction_score: feedback === 'helpful' ? 5.0 : 
                                 feedback === 'not_helpful' ? 1.0 : 3.0,
          common_topics: {},
          cost_total: 0
        });
    }
  } catch (error) {
    console.error('분석 통계 업데이트 오류:', error);
  }
}

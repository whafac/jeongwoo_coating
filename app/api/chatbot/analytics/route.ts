import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // 동적 서버 사용을 명시적으로 표시
    const url = new URL(request.url);
    const companyCode = url.searchParams.get('company') || 'jeongwoo';
    const period = url.searchParams.get('period') || '7'; // 기본 7일

    // 회사 ID 가져오기
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('company_code', companyCode)
      .single();

    if (!company) {
      return NextResponse.json(
        { error: '회사를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 기간 계산
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period));

    // 기본 통계 데이터
    const analyticsData = await getBasicAnalytics(company.id, startDate, endDate);
    
    // 고급 통계 데이터
    const advancedData = await getAdvancedAnalytics(company.id, startDate, endDate);

    return NextResponse.json({
      success: true,
      data: {
        period: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0],
          days: parseInt(period)
        },
        basic: analyticsData,
        advanced: advancedData
      }
    });

  } catch (error) {
    console.error('분석 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 기본 통계 데이터 가져오기
async function getBasicAnalytics(companyId: string, startDate: Date, endDate: Date) {
  try {
    // 세션 통계
    const { data: sessions } = await supabase
      .from('chatbot_sessions')
      .select('id, created_at')
      .eq('company_id', companyId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // 메시지 통계
    const { data: messages } = await supabase
      .from('chatbot_messages')
      .select('id, message_type, created_at, metadata')
      .eq('company_id', companyId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // 피드백 통계
    const { data: feedbacks } = await supabase
      .from('chatbot_learning_data')
      .select('user_feedback, created_at')
      .eq('company_id', companyId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    const totalSessions = sessions?.length || 0;
    const totalMessages = messages?.length || 0;
    const userMessages = messages?.filter(m => m.message_type === 'user').length || 0;
    const botMessages = messages?.filter(m => m.message_type === 'bot').length || 0;
    const aiMessages = messages?.filter(m => m.metadata?.ai_used).length || 0;

    // 만족도 계산
    const helpfulCount = feedbacks?.filter(f => f.user_feedback === 'helpful').length || 0;
    const notHelpfulCount = feedbacks?.filter(f => f.user_feedback === 'not_helpful').length || 0;
    const neutralCount = feedbacks?.filter(f => f.user_feedback === 'neutral').length || 0;
    const totalFeedbacks = helpfulCount + notHelpfulCount + neutralCount;
    
    const satisfactionRate = totalFeedbacks > 0 
      ? ((helpfulCount * 100 + neutralCount * 50) / (totalFeedbacks * 100)) * 100 
      : 0;

    // 비용 계산
    const totalCost = messages?.reduce((sum, msg) => {
      return sum + (msg.metadata?.cost_usd || 0);
    }, 0) || 0;

    return {
      totalSessions,
      totalMessages,
      userMessages,
      botMessages,
      aiMessages,
      satisfactionRate: Math.round(satisfactionRate * 100) / 100,
      totalFeedbacks,
      helpfulCount,
      notHelpfulCount,
      neutralCount,
      totalCost: Math.round(totalCost * 100) / 100
    };
  } catch (error) {
    console.error('기본 통계 오류:', error);
    return {};
  }
}

// 고급 통계 데이터 가져오기
async function getAdvancedAnalytics(companyId: string, startDate: Date, endDate: Date) {
  try {
    // 인기 질문 키워드
    const { data: userMessages } = await supabase
      .from('chatbot_messages')
      .select('content')
      .eq('company_id', companyId)
      .eq('message_type', 'user')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // 시간대별 사용 패턴
    const { data: hourlyData } = await supabase
      .from('chatbot_sessions')
      .select('created_at')
      .eq('company_id', companyId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // 인기 질문 키워드 분석
    const keywords = analyzeKeywords(userMessages?.map(m => m.content) || []);

    // 시간대별 패턴 분석
    const hourlyPattern = analyzeHourlyPattern(hourlyData?.map(s => s.created_at) || []);

    // 지식베이스 사용률
    const { data: knowledgeUsage } = await supabase
      .from('chatbot_knowledge_base')
      .select('title, usage_count, success_rate')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('usage_count', { ascending: false })
      .limit(10);

    return {
      popularKeywords: keywords.slice(0, 10),
      hourlyPattern,
      topKnowledgeItems: knowledgeUsage?.slice(0, 5) || []
    };
  } catch (error) {
    console.error('고급 통계 오류:', error);
    return {};
  }
}

// 키워드 분석 함수
function analyzeKeywords(messages: string[]): Array<{keyword: string, count: number}> {
  const keywordCount: {[key: string]: number} = {};
  const stopWords = ['이', '가', '을', '를', '에', '에서', '로', '으로', '의', '은', '는', '과', '와', '도', '만', '어떤', '무엇', '언제', '어디', '왜', '어떻게'];

  messages.forEach(message => {
    const words = message.toLowerCase()
      .replace(/[^\w\s가-힣]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1 && !stopWords.includes(word));

    words.forEach(word => {
      keywordCount[word] = (keywordCount[word] || 0) + 1;
    });
  });

  return Object.entries(keywordCount)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count);
}

// 시간대별 패턴 분석 함수
function analyzeHourlyPattern(timestamps: string[]): Array<{hour: number, count: number}> {
  const hourlyCount: {[key: number]: number} = {};

  timestamps.forEach(timestamp => {
    const hour = new Date(timestamp).getHours();
    hourlyCount[hour] = (hourlyCount[hour] || 0) + 1;
  });

  return Array.from({length: 24}, (_, i) => ({
    hour: i,
    count: hourlyCount[i] || 0
  }));
}

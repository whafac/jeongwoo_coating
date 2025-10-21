import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // 1. 회사 확인
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, company_code')
      .eq('company_code', 'jeongwoo')
      .single();

    if (companyError || !company) {
      return NextResponse.json({
        success: false,
        error: '회사를 찾을 수 없습니다.',
        details: companyError?.message
      });
    }

    // 2. 지식베이스 데이터 확인
    const { data: knowledge, error: knowledgeError } = await supabase
      .from('chatbot_knowledge_base')
      .select('id, title, content, category, tags, priority, is_active')
      .eq('company_id', company.id);

    if (knowledgeError) {
      return NextResponse.json({
        success: false,
        error: '지식베이스 조회 오류',
        details: knowledgeError.message
      });
    }

    // 3. 테이블 존재 여부 확인
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['chatbot_knowledge_base', 'companies']);

    return NextResponse.json({
      success: true,
      company: {
        id: company.id,
        code: company.company_code
      },
      knowledgeBase: {
        totalItems: knowledge?.length || 0,
        items: knowledge?.map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          priority: item.priority,
          isActive: item.is_active
        })) || []
      },
      tables: tableInfo?.map(t => t.table_name) || [],
      debug: {
        companyError: companyError?.message,
        knowledgeError: knowledgeError?.message,
        tableError: tableError?.message
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '서버 오류',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
}

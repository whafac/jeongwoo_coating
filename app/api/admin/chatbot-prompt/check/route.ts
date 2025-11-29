import { NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

/**
 * DB에 저장된 프롬프트 확인용 API
 * GET /api/admin/chatbot-prompt/check
 */
export async function GET() {
  try {
    // 1. 회사 확인 (id 컬럼 사용)
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('id', 'jeongwoo')
      .single();

    if (companyError || !company) {
      return NextResponse.json({
        success: false,
        error: '회사를 찾을 수 없습니다.',
        details: companyError?.message
      }, { status: 404 });
    }

    // 2. 프롬프트 조회
    const { data: settings, error: fetchError } = await supabase
      .from('chatbot_settings')
      .select('setting_value, created_at, updated_at')
      .eq('company_id', company.id)
      .eq('setting_key', 'quote_prompt')
      .single();

    if (fetchError) {
      // PGRST116은 "데이터 없음" 에러
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          exists: false,
          message: 'DB에 프롬프트가 저장되어 있지 않습니다.',
          prompt: null,
          promptLength: 0
        });
      }

      return NextResponse.json({
        success: false,
        error: '프롬프트 조회 오류',
        details: fetchError.message,
        code: fetchError.code
      }, { status: 500 });
    }

    if (!settings) {
      return NextResponse.json({
        success: false,
        exists: false,
        message: 'DB에 프롬프트가 저장되어 있지 않습니다.',
        prompt: null,
        promptLength: 0
      });
    }

    // 3. 성공 응답
    return NextResponse.json({
      success: true,
      exists: true,
      message: 'DB에서 프롬프트를 성공적으로 조회했습니다.',
      prompt: settings.setting_value,
      promptLength: settings.setting_value?.length || 0,
      createdAt: settings.created_at,
      updatedAt: settings.updated_at,
      company: {
        id: company.id
      }
    });

  } catch (error) {
    console.error('프롬프트 확인 오류:', error);
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}


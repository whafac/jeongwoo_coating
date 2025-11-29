import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

// 견적 프롬프트 조회
export async function GET(request: NextRequest) {
  try {
    // 정우특수코팅 회사 ID 가져오기 (id 컬럼 사용)
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('id', 'jeongwoo')
      .single();

    // 회사가 없으면 생성
    if (!company && !companyError) {
      const { data: newCompany, error: insertError } = await supabase
        .from('companies')
        .insert({
          id: 'jeongwoo',
          name: '정우특수코팅',
          domain: 'jeongwoo-coating.vercel.app'
        })
        .select('id')
        .single();

      if (insertError || !newCompany) {
        console.error('회사 생성 오류:', insertError);
        // 회사 생성 실패해도 기본 프롬프트 반환
        const { DEFAULT_QUOTE_PROMPT } = await import('@/lib/openai');
        return NextResponse.json({
          quotePrompt: DEFAULT_QUOTE_PROMPT,
          lastUpdated: null
        });
      }

      // 새로 생성된 회사로 설정 조회 (없으므로 기본값 반환)
      const { DEFAULT_QUOTE_PROMPT } = await import('@/lib/openai');
      return NextResponse.json({
        quotePrompt: DEFAULT_QUOTE_PROMPT,
        lastUpdated: null
      });
    }

    if (!company) {
      // 회사 조회 실패 시 기본 프롬프트 반환
      const { DEFAULT_QUOTE_PROMPT } = await import('@/lib/openai');
      return NextResponse.json({
        quotePrompt: DEFAULT_QUOTE_PROMPT,
        lastUpdated: null
      });
    }

    // chatbot_settings 테이블에서 프롬프트 조회
    const { data: settings, error: fetchError } = await supabase
      .from('chatbot_settings')
      .select('setting_value, updated_at')
      .eq('company_id', company.id)
      .eq('setting_key', 'quote_prompt')
      .single();

    if (fetchError || !settings) {
      // 기본 프롬프트 반환
      const { DEFAULT_QUOTE_PROMPT } = await import('@/lib/openai');
      return NextResponse.json({
        quotePrompt: DEFAULT_QUOTE_PROMPT,
        lastUpdated: null
      });
    }

    return NextResponse.json({
      quotePrompt: settings.setting_value as string,
      lastUpdated: settings.updated_at
    });

  } catch (error) {
    console.error('프롬프트 조회 오류:', error);
    return NextResponse.json(
      { error: '프롬프트를 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}

// 견적 프롬프트 저장
export async function POST(request: NextRequest) {
  try {
    const { quotePrompt } = await request.json();

    if (!quotePrompt || quotePrompt.trim().length === 0) {
      return NextResponse.json(
        { error: '프롬프트 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    // 정우특수코팅 회사 ID 가져오기 (id 컬럼 사용)
    let { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('id', 'jeongwoo')
      .single();

    // 회사가 없으면 생성
    if (!company && !companyError) {
      const { data: newCompany, error: insertError } = await supabase
        .from('companies')
        .insert({
          id: 'jeongwoo',
          name: '정우특수코팅',
          domain: 'jeongwoo-coating.vercel.app'
        })
        .select('id')
        .single();

      if (insertError || !newCompany) {
        console.error('회사 생성 오류:', insertError);
        return NextResponse.json(
          { error: '회사 정보를 설정할 수 없습니다. 데이터베이스를 확인해주세요.' },
          { status: 500 }
        );
      }

      company = newCompany;
    }

    if (!company) {
      return NextResponse.json(
        { error: '회사를 찾을 수 없습니다. 데이터베이스를 확인해주세요.' },
        { status: 404 }
      );
    }

    // 프롬프트를 데이터베이스에 저장
    // chatbot_settings 테이블이 있다면 사용, 없으면 새로 생성
    // 일단 간단하게 JSON 파일이나 환경변수로 저장하는 방식도 가능
    // 여기서는 Supabase에 저장하는 방식으로 구현

    // chatbot_settings 테이블이 있다고 가정
    const { data: existing } = await supabase
      .from('chatbot_settings')
      .select('id')
      .eq('company_id', company.id)
      .eq('setting_key', 'quote_prompt')
      .single();

    if (existing) {
      // 업데이트
      const { error } = await supabase
        .from('chatbot_settings')
        .update({
          setting_value: quotePrompt,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // 새로 생성
      const { error } = await supabase
        .from('chatbot_settings')
        .insert({
          company_id: company.id,
          setting_key: 'quote_prompt',
          setting_value: quotePrompt,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: '프롬프트가 성공적으로 저장되었습니다.',
      lastUpdated: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('프롬프트 저장 오류:', error);
    const errorMessage = error?.message || '알 수 없는 오류';
    return NextResponse.json(
      { 
        error: '프롬프트 저장에 실패했습니다.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}



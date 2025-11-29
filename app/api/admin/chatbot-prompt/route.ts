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
        return NextResponse.json({
          quotePrompt: '',
          lastUpdated: null,
          isDefault: true
        });
      }
      return NextResponse.json({
        quotePrompt: '',
        lastUpdated: null,
        isDefault: true
      });
    }

    if (!company) {
      return NextResponse.json({
        quotePrompt: '',
        lastUpdated: null,
        isDefault: true
      });
    }

    // chatbot_settings 테이블에서 프롬프트 조회
    const { data: settings, error: fetchError } = await supabase
      .from('chatbot_settings')
      .select('setting_value, updated_at')
      .eq('company_id', company.id)
      .eq('setting_key', 'quote_prompt')
      .single();

    // 에러 로깅 추가
    if (fetchError) {
      console.error('프롬프트 조회 에러:', fetchError);
      console.error('에러 코드:', fetchError.code);
      console.error('에러 메시지:', fetchError.message);
      console.error('에러 상세:', fetchError.details);
    }

    // settings가 없거나 에러가 발생한 경우
    if (fetchError || !settings) {
      if (fetchError && fetchError.code === 'PGRST116') {
        console.log('⚠️ DB에 프롬프트가 저장되어 있지 않습니다. 빈 프롬프트를 반환합니다.');
      } else if (fetchError) {
        console.error('⚠️ 프롬프트 조회 중 오류 발생:', fetchError);
      }
      
      return NextResponse.json({
        quotePrompt: '',
        lastUpdated: null,
        isDefault: true
      });
    }

    // DB에서 프롬프트를 성공적으로 가져온 경우
    const promptValue = settings.setting_value as string;
    console.log('✅ DB에서 프롬프트를 성공적으로 가져왔습니다.');
    console.log('프롬프트 길이:', promptValue?.length || 0, '자');
    
    return NextResponse.json({
      quotePrompt: promptValue,
      lastUpdated: settings.updated_at,
      isDefault: false
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



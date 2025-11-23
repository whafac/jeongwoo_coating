import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 관리자 로그인 인증 API
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: '비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 환경변수에서 관리자 비밀번호 가져오기
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // 기본값 (개발용)

    // 비밀번호 확인
    if (password !== adminPassword) {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 인증 성공 - 쿠키 설정
    const cookieStore = cookies();
    cookieStore.set('admin_authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24시간
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: '로그인 성공'
    });

  } catch (error) {
    console.error('인증 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 로그아웃 API
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = cookies();
    cookieStore.delete('admin_authenticated');

    return NextResponse.json({
      success: true,
      message: '로그아웃 성공'
    });

  } catch (error) {
    console.error('로그아웃 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 인증 상태 확인 API
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const isAuthenticated = cookieStore.get('admin_authenticated')?.value === 'true';

    return NextResponse.json({
      authenticated: isAuthenticated
    });

  } catch (error) {
    console.error('인증 상태 확인 오류:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}


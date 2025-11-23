import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 관리자 페이지 접근 제한
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 로그인 페이지는 제외
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // 쿠키에서 인증 상태 확인
    const isAuthenticated = request.cookies.get('admin_authenticated')?.value === 'true';

    if (!isAuthenticated) {
      // 인증되지 않은 경우 로그인 페이지로 리다이렉트
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};


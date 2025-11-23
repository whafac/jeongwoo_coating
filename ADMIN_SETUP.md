# 관리자 페이지 접근 제한 설정 가이드

## 🔒 관리자 비밀번호 설정

관리자 페이지에 접근하려면 환경변수에 관리자 비밀번호를 설정해야 합니다.

### 1. 로컬 개발 환경 설정

`.env.local` 파일에 다음을 추가하세요:

```bash
ADMIN_PASSWORD=your_secure_password_here
```

**예시:**
```bash
ADMIN_PASSWORD=JeongwooAdmin2025!
```

### 2. Vercel 프로덕션 환경 설정

1. Vercel 대시보드 접속
2. 프로젝트 선택 → **Settings** → **Environment Variables**
3. 다음 변수 추가:
   - **Name**: `ADMIN_PASSWORD`
   - **Value**: 원하는 관리자 비밀번호
   - **Environment**: Production, Preview, Development 모두 선택
4. **Save** 클릭
5. 배포 재실행 (자동으로 재배포됨)

## 📍 관리자 페이지 접근 방법

### 로그인 페이지
- **로컬**: `http://localhost:3000/admin/login`
- **프로덕션**: `https://jeongwoo-coating.vercel.app/admin/login`

### 관리자 페이지
- **로컬**: `http://localhost:3000/admin`
- **프로덕션**: `https://jeongwoo-coating.vercel.app/admin`

## 🔐 보안 기능

1. **비밀번호 인증**: 환경변수에 설정한 비밀번호로 로그인
2. **세션 관리**: 로그인 후 24시간 동안 쿠키로 인증 상태 유지
3. **자동 리다이렉트**: 인증되지 않은 사용자는 자동으로 로그인 페이지로 이동
4. **로그아웃**: 관리자 페이지에서 로그아웃 버튼으로 세션 종료

## ⚠️ 보안 권장사항

1. **강력한 비밀번호 사용**
   - 최소 12자 이상
   - 대소문자, 숫자, 특수문자 조합
   - 예: `Jeongwoo@Admin2025!`

2. **환경변수 보안**
   - `.env.local` 파일은 절대 Git에 커밋하지 마세요
   - `.gitignore`에 포함되어 있는지 확인

3. **정기적인 비밀번호 변경**
   - 보안을 위해 주기적으로 비밀번호 변경 권장

4. **HTTPS 사용**
   - 프로덕션 환경에서는 항상 HTTPS 사용
   - Vercel은 자동으로 HTTPS 제공

## 🚨 문제 해결

### 로그인이 안 되는 경우
1. 환경변수 `ADMIN_PASSWORD`가 설정되었는지 확인
2. 비밀번호가 정확한지 확인
3. 브라우저 쿠키가 차단되지 않았는지 확인

### 로그인 후에도 접근이 안 되는 경우
1. 브라우저 개발자 도구 → Application → Cookies 확인
2. `admin_authenticated` 쿠키가 있는지 확인
3. 쿠키가 있으면 삭제 후 다시 로그인

### 비밀번호를 잊어버린 경우
1. Vercel 환경변수에서 `ADMIN_PASSWORD` 수정
2. 새 비밀번호로 재배포
3. 새 비밀번호로 로그인

## 📝 참고사항

- 기본 비밀번호는 `admin123`입니다 (개발용, 프로덕션에서는 반드시 변경하세요)
- 로그인 세션은 24시간 동안 유지됩니다
- 로그아웃하면 즉시 세션이 종료됩니다
- 여러 관리자가 사용하는 경우 비밀번호를 안전하게 공유하세요


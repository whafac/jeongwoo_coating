# 정우특수코팅 홍보 웹사이트

정우특수코팅의 공식 홍보 웹사이트입니다. Next.js + React로 제작된 반응형 웹사이트입니다.

## 🌐 라이브 사이트

**배포 URL:** https://jeongwoo-coating.vercel.app

## 🚀 기술 스택

- **프레임워크**: Next.js 15
- **언어**: TypeScript
- **스타일링**: CSS Modules
- **배포**: Vercel
- **반응형**: Mobile-First Design

## ✨ 주요 기능

- ✅ 반응형 웹 디자인 (모바일, 태블릿, 데스크톱)
- ✅ 햄버거 메뉴 (모바일 768px 이하)
- ✅ 7개 페이지 (홈, 코팅서비스, 작업프로세스, 작업사례, 회사소개, 게시판, 문의하기)
- ✅ **게시판 기능** (문의/후기 작성, 조회, 관리)
- ✅ **관리자 페이지** (게시글 승인/거부/삭제)
- ✅ **PlanetScale 데이터베이스** 연동
- ✅ SEO 최적화
- ✅ 빠른 로딩 속도

## 📄 페이지 구성

- **홈** (`/`): 메인 페이지
- **코팅서비스** (`/services`): UV코팅, 라미네이팅, 박, 형압 소개
- **작업프로세스** (`/process`): 4단계 작업 과정 안내
- **작업사례** (`/portfolio`): 포트폴리오 및 실적
- **회사소개** (`/about`): 회사 정보, 비전, 미션
- **게시판** (`/board`): 문의/후기 게시판
- **관리자** (`/admin`): 게시글 관리 (승인/거부/삭제)
- **문의하기** (`/contact`): 온라인 문의 폼

## 🛠️ 로컬 개발

### 요구사항
- Node.js 18.18.0 이상
- npm 또는 yarn
- PlanetScale 계정 (게시판 기능용)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에서 PlanetScale 데이터베이스 정보 설정

# 개발 서버 실행
npm run dev

# 브라우저에서 열기
open http://localhost:3000
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm start
```

## 📁 프로젝트 구조

```
jeongwoo_coating/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   ├── globals.css        # 전역 스타일
│   ├── services/          # 코팅서비스 페이지
│   ├── process/           # 작업프로세스 페이지
│   ├── portfolio/         # 작업사례 페이지
│   ├── about/             # 회사소개 페이지
│   └── contact/           # 문의하기 페이지
├── components/            # 재사용 컴포넌트
│   ├── Header.tsx         # 헤더 (네비게이션)
│   ├── Footer.tsx         # 푸터
│   └── *.module.css       # 컴포넌트 스타일
└── public/                # 정적 파일
```

## 🎨 디자인

- **색상 테마**: 신뢰감 있는 블루(#2C5F8D) + 활기찬 오렌지(#E67E22)
- **반응형**: 모바일 우선 디자인
- **햄버거 메뉴**: 768px 이하에서 자동 활성화
- **애니메이션**: 호버 효과, 슬라이드 메뉴

## 🚀 Vercel 배포

### 자동 배포 (추천)

1. GitHub 저장소에 푸시
2. https://vercel.com 접속 및 로그인
3. "New Project" → GitHub 저장소 선택
4. 자동 감지 및 배포 완료!

### 배포 후 URL
```
https://jeongwoo-coating.vercel.app
```

### 커스텀 도메인 연결 (선택)
Vercel 대시보드 → Settings → Domains에서 설정 가능

## 🔄 업데이트

코드 수정 후:

```bash
git add .
git commit -m "Update content"
git push
```

Vercel이 자동으로 재배포합니다! (30초 소요)

## 💡 게시판 기능 설정

### 1. PlanetScale 데이터베이스 설정

1. **PlanetScale 가입**: https://planetscale.com
2. **새 프로젝트 생성**: "jeongwoo-coating" 
3. **데이터베이스 생성**: `database-schema.sql` 실행
4. **연결 정보 복사**: Host, Username, Password

### 2. 환경 변수 설정

```bash
# .env.local 파일 생성
DATABASE_HOST=your-database-host.planetscale.com
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
```

### 3. 게시판 기능

- ✅ **문의 게시판**: 고객 문의 작성/조회
- ✅ **후기 게시판**: 작업 후기 작성/조회
- ✅ **관리자 페이지**: 게시글 승인/거부/삭제
- ✅ **실시간 업데이트**: 게시글 상태 변경

### 4. 향후 확장

**다른 업체 추가 시:**
```sql
INSERT INTO companies (id, name, domain) VALUES 
('company2', '새 업체', 'company2.vercel.app');
```

## 📝 커스터마이징

### 색상 변경
`app/globals.css` 파일의 CSS 변수:
```css
:root {
  --primary-color: #2C5F8D;
  --accent-color: #E67E22;
}
```

### 연락처 정보
- `components/Footer.tsx`
- `app/about/page.tsx`
- `app/contact/page.tsx`

## 📞 지원

문의사항:
- 전화: 02-XXXX-XXXX
- 이메일: info@jeongwoo.co.kr

---

© 2025 정우특수코팅. All rights reserved.

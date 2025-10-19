-- RLS 정책 임시 비활성화 (테스트용)
-- 주의: 실제 운영에서는 보안상 위험할 수 있습니다

-- 게시글 테이블 RLS 비활성화
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- 사용자 테이블 RLS 비활성화  
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 회사 테이블 RLS 비활성화
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;

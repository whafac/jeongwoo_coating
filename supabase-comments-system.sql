-- 댓글 시스템을 위한 데이터베이스 스키마
-- 기존 replies 테이블을 comments로 확장

-- 기존 replies 테이블 삭제 (데이터가 있다면 백업 필요)
DROP TABLE IF EXISTS replies CASCADE;

-- 새로운 comments 테이블 생성 (댓글 + 대댓글 지원)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id), -- 대댓글용 (NULL이면 최상위 댓글)
  author_type VARCHAR(10) NOT NULL CHECK (author_type IN ('admin', 'customer')),
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(100), -- 고객인 경우에만
  author_phone VARCHAR(20), -- 고객인 경우에만
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
CREATE INDEX idx_comments_author_type ON comments(author_type);

-- RLS 비활성화 (테스트용)
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- 트리거 함수 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_comments_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_comments_updated_at 
  BEFORE UPDATE ON comments 
  FOR EACH ROW EXECUTE FUNCTION update_comments_updated_at_column();

-- 샘플 데이터 (기존 답글 데이터가 있다면 마이그레이션 필요)
-- INSERT INTO comments (post_id, author_type, author_name, content) 
-- SELECT post_id, 'admin', admin_name, content FROM replies;

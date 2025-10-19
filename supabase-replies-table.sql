-- 답글 테이블 생성
CREATE TABLE replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  admin_name VARCHAR(100) DEFAULT '관리자',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_replies_post_id ON replies(post_id);
CREATE INDEX idx_replies_created_at ON replies(created_at);

-- RLS 비활성화 (테스트용)
ALTER TABLE replies DISABLE ROW LEVEL SECURITY;

-- 트리거 함수 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_replies_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_replies_updated_at 
  BEFORE UPDATE ON replies 
  FOR EACH ROW EXECUTE FUNCTION update_replies_updated_at_column();

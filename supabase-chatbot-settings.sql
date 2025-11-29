-- 챗봇 설정 테이블 생성
-- 프롬프트 및 기타 챗봇 설정을 저장하는 테이블

CREATE TABLE IF NOT EXISTS chatbot_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id VARCHAR(50) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, setting_key)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_chatbot_settings_company ON chatbot_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_settings_key ON chatbot_settings(setting_key);

-- RLS 정책 설정
ALTER TABLE chatbot_settings ENABLE ROW LEVEL SECURITY;

-- 모든 접근 허용 (관리자 페이지에서 사용)
CREATE POLICY "Enable all access for chatbot_settings" ON chatbot_settings FOR ALL USING (true);

-- 업데이트 시간 자동 갱신 트리거
CREATE TRIGGER update_chatbot_settings_updated_at 
  BEFORE UPDATE ON chatbot_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 완료 메시지
SELECT '챗봇 설정 테이블이 성공적으로 생성되었습니다!' as message;


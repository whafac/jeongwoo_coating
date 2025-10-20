-- 챗봇 관련 테이블 생성

-- 1. 챗봇 대화 세션 테이블
CREATE TABLE IF NOT EXISTS chatbot_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_token VARCHAR(255) NOT NULL, -- 익명 사용자 세션 구분용
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  user_agent TEXT, -- 브라우저 정보
  ip_address INET -- IP 주소 (개인정보 보호를 위해 해시화 권장)
);

-- 2. 챗봇 메시지 테이블
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chatbot_sessions(id) ON DELETE CASCADE,
  message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'bot', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- 추가 메타데이터 (예: AI 모델 정보, 신뢰도 점수 등)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  response_time_ms INTEGER, -- 응답 시간 (밀리초)
  tokens_used INTEGER, -- AI API 토큰 사용량
  cost_usd DECIMAL(10, 6) -- AI API 비용 (USD)
);

-- 3. 챗봇 지식베이스 테이블
CREATE TABLE IF NOT EXISTS chatbot_knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100), -- FAQ, 서비스정보, 작업프로세스 등
  tags TEXT[], -- 검색용 태그
  priority INTEGER DEFAULT 0, -- 우선순위 (높을수록 먼저 검색)
  usage_count INTEGER DEFAULT 0, -- 사용 횟수
  success_rate DECIMAL(5, 2) DEFAULT 0, -- 성공률 (%)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- 4. 챗봇 학습 데이터 테이블
CREATE TABLE IF NOT EXISTS chatbot_learning_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_question TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  user_feedback VARCHAR(20) CHECK (user_feedback IN ('helpful', 'not_helpful', 'neutral')),
  feedback_comment TEXT,
  improvement_suggestion TEXT,
  ai_model VARCHAR(100), -- 사용된 AI 모델
  confidence_score DECIMAL(5, 2), -- AI 응답 신뢰도
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 챗봇 분석 통계 테이블
CREATE TABLE IF NOT EXISTS chatbot_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  user_satisfaction_score DECIMAL(3, 2), -- 평균 만족도 (1-5)
  common_topics JSONB DEFAULT '{}', -- 자주 묻는 주제
  response_time_avg INTEGER, -- 평균 응답 시간
  cost_total DECIMAL(10, 2), -- 일일 총 비용
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, date)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_chatbot_sessions_company ON chatbot_sessions(company_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_sessions_active ON chatbot_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_session ON chatbot_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_type ON chatbot_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_company ON chatbot_knowledge_base(company_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_category ON chatbot_knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_chatbot_knowledge_priority ON chatbot_knowledge_base(priority DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_learning_company ON chatbot_learning_data(company_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_analytics_company_date ON chatbot_analytics(company_id, date);

-- RLS 정책 (Row Level Security)
ALTER TABLE chatbot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_analytics ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성 (임시로 모든 접근 허용 - 나중에 보안 강화)
CREATE POLICY "Enable all access for chatbot_sessions" ON chatbot_sessions FOR ALL USING (true);
CREATE POLICY "Enable all access for chatbot_messages" ON chatbot_messages FOR ALL USING (true);
CREATE POLICY "Enable all access for chatbot_knowledge_base" ON chatbot_knowledge_base FOR ALL USING (true);
CREATE POLICY "Enable all access for chatbot_learning_data" ON chatbot_learning_data FOR ALL USING (true);
CREATE POLICY "Enable all access for chatbot_analytics" ON chatbot_analytics FOR ALL USING (true);

-- 업데이트 시간 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chatbot_sessions_updated_at BEFORE UPDATE ON chatbot_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chatbot_knowledge_base_updated_at BEFORE UPDATE ON chatbot_knowledge_base FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chatbot_learning_data_updated_at BEFORE UPDATE ON chatbot_learning_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 초기 지식베이스 데이터 삽입 (정우특수코팅용)
INSERT INTO chatbot_knowledge_base (company_id, title, content, category, tags, priority) VALUES
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '정우특수코팅 소개',
  '정우특수코팅은 인쇄코팅 후가공 전문 업체입니다. UV코팅, 라미네이팅, 박 등 다양한 코팅 서비스를 제공하며, 20년 이상의 경험과 노하우를 바탕으로 고품질의 서비스를 제공하고 있습니다.',
  '회사소개',
  ARRAY['정우특수코팅', '회사소개', '전문업체'],
  10
),
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  'UV코팅이란?',
  'UV코팅은 자외선을 이용한 코팅 기술로, 표면을 보호하고 광택을 높이는 후가공 기술입니다. 빠른 건조 속도와 우수한 내구성을 자랑하며, 브로슈어, 카탈로그, 명함 등에 널리 사용됩니다.',
  '서비스정보',
  ARRAY['UV코팅', '자외선', '광택', '후가공'],
  9
),
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '라미네이팅이란?',
  '라미네이팅은 인쇄물에 투명한 필름을 붙여 표면을 보호하고 강도를 높이는 후가공 기술입니다. 매트 라미네이팅과 글리터 라미네이팅으로 나뉘며, 포스터, 배너, 책 표지 등에 사용됩니다.',
  '서비스정보',
  ARRAY['라미네이팅', '필름', '보호', '강도'],
  9
),
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '작업 소요시간',
  '일반적인 코팅 작업은 1-3일 소요됩니다. 작업량과 난이도에 따라 달라질 수 있으며, 긴급 작업의 경우 별도 상담을 통해 가능합니다.',
  'FAQ',
  ARRAY['작업시간', '소요시간', '기간'],
  8
),
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '최소 주문량',
  '최소 주문량은 없으며, 소량 주문도 환영합니다. 다만 소량 주문의 경우 단가가 높을 수 있으니 사전 상담을 권장합니다.',
  'FAQ',
  ARRAY['최소주문량', '소량주문', '단가'],
  8
);

-- 완료 메시지
SELECT '챗봇 관련 테이블이 성공적으로 생성되었습니다!' as message;

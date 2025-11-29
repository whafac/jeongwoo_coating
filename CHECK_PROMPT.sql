-- DB에 저장된 프롬프트 확인 쿼리
-- Supabase SQL Editor에서 실행하세요

-- 1. 먼저 companies 테이블에서 정우특수코팅 회사 ID 확인
SELECT id, company_code, name 
FROM companies 
WHERE company_code = 'jeongwoo' OR id = 'jeongwoo';

-- 2. chatbot_settings 테이블에서 프롬프트 확인
SELECT 
  id,
  company_id,
  setting_key,
  setting_value,
  LENGTH(setting_value) as prompt_length,
  created_at,
  updated_at
FROM chatbot_settings
WHERE company_id = 'jeongwoo' 
  AND setting_key = 'quote_prompt';

-- 3. 만약 데이터가 없다면, 전체 chatbot_settings 테이블 확인
SELECT * FROM chatbot_settings;

-- 4. companies 테이블의 모든 데이터 확인
SELECT * FROM companies;


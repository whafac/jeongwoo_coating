-- 확장된 지식베이스 데이터 (사이트 내용 기반)

-- 기존 데이터 삭제 (테스트용)
DELETE FROM chatbot_knowledge_base WHERE company_id = (SELECT id FROM companies WHERE company_code = 'jeongwoo');

-- 1. 회사 정보 및 소개
INSERT INTO chatbot_knowledge_base (company_id, title, content, category, tags, priority) VALUES
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '정우특수코팅 회사 소개',
  '정우특수코팅은 1999년 설립된 인쇄코팅 후가공 전문 기업입니다. 20년이 넘는 경험과 노하우를 바탕으로 고객에게 최상의 서비스를 제공하고 있습니다. 최신 장비와 숙련된 기술진, 그리고 철저한 품질 관리 시스템을 통해 고객의 인쇄물에 완벽한 마감을 제공합니다.',
  '회사소개',
  ARRAY['정우특수코팅', '회사소개', '설립', '1999년', '전문기업'],
  10
),
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '정우특수코팅 비전과 미션',
  '정우특수코팅의 비전은 "인쇄코팅 후가공의 새로운 표준을 제시하는 글로벌 리더"입니다. 미션은 "고객의 성공을 위한 최고 품질의 코팅 서비스 제공"입니다. 최신 기술과 창의적 아이디어로 고객의 브랜드 가치를 극대화합니다.',
  '회사소개',
  ARRAY['비전', '미션', '글로벌리더', '브랜드가치', '고객성공'],
  9
);

-- 2. UV 코팅 상세 정보
INSERT INTO chatbot_knowledge_base (company_id, title, content, category, tags, priority) VALUES
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  'UV 코팅 상세 정보',
  'UV 코팅은 자외선(UV)으로 경화시키는 코팅 방식으로, 빠른 건조 시간과 뛰어난 광택감이 특징입니다. 인쇄물에 고급스러운 마감을 제공하며, 내구성이 우수하여 오래도록 깨끗한 상태를 유지할 수 있습니다. 뛰어난 광택감과 선명한 발색, 빠른 건조로 신속한 납기 가능, 우수한 내구성 및 내마모성이 주요 특징입니다.',
  '서비스정보',
  ARRAY['UV코팅', '자외선', '경화', '광택감', '건조', '내구성', '발색'],
  10
),
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  'UV 코팅 적용 분야',
  'UV 코팅은 명함, 카탈로그, 포스터, 브로슈어, 책 표지 등 다양한 인쇄물에 적용됩니다. 특히 고급스러운 마감이 필요한 명함이나 카탈로그에 많이 사용되며, 부분 UV 코팅을 통한 도무송 효과도 가능합니다.',
  '서비스정보',
  ARRAY['UV코팅', '명함', '카탈로그', '포스터', '브로슈어', '부분UV', '도무송'],
  9
);

-- 3. 라미네이팅 상세 정보
INSERT INTO chatbot_knowledge_base (company_id, title, content, category, tags, priority) VALUES
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '라미네이팅 상세 정보',
  '라미네이팅은 인쇄물에 투명한 필름을 붙여 표면을 보호하고 강도를 높이는 후가공 기술입니다. 매트 라미네이팅과 글리터 라미네이팅으로 나뉘며, 포스터, 배너, 책 표지 등에 사용됩니다. 내구성 향상과 보호 기능이 뛰어나며, 다양한 표면 질감을 제공할 수 있습니다.',
  '서비스정보',
  ARRAY['라미네이팅', '필름', '보호', '강도', '매트', '글리터', '표면질감'],
  10
),
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '라미네이팅 종류와 특징',
  '라미네이팅은 유광(글리터)과 무광(매트)으로 구분됩니다. 유광 라미네이팅은 광택이 나는 표면으로 고급스러운 느낌을 주며, 무광 라미네이팅은 은은한 광택으로 세련된 느낌을 줍니다. 책 표지, 제품 카탈로그, 포스터 등에 널리 사용됩니다.',
  '서비스정보',
  ARRAY['라미네이팅', '유광', '무광', '글리터', '매트', '광택', '고급스러움'],
  9
);

-- 4. 박 코팅 상세 정보
INSERT INTO chatbot_knowledge_base (company_id, title, content, category, tags, priority) VALUES
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '박 코팅 상세 정보',
  '박 코팅은 금속 박막을 인쇄물에 전사하여 화려하고 고급스러운 효과를 연출합니다. 금박, 은박, 홀로그램 박 등 다양한 종류의 박을 사용하여 브랜드 가치를 극대화할 수 있습니다. 금박은 고급스럽고 화려한 느낌, 은박은 세련되고 모던한 느낌, 홀로그램박은 독특하고 눈길을 끄는 효과를 제공합니다.',
  '서비스정보',
  ARRAY['박코팅', '금박', '은박', '홀로그램박', '전사', '고급스러움', '브랜드가치'],
  10
),
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '박 코팅 적용 분야',
  '박 코팅은 명함, 초대장, 패키지, 고급 브로슈어 등에 최적입니다. 특히 특별한 이벤트나 고급 브랜드의 마케팅 자료에 많이 사용되며, 브랜드의 프리미엄 이미지를 강화하는 데 효과적입니다.',
  '서비스정보',
  ARRAY['박코팅', '명함', '초대장', '패키지', '브로슈어', '이벤트', '프리미엄'],
  9
);

-- 5. 형압 가공 상세 정보
INSERT INTO chatbot_knowledge_base (company_id, title, content, category, tags, priority) VALUES
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '형압 가공 상세 정보',
  '형압 가공은 인쇄물에 압력을 가하여 입체적인 패턴이나 디자인을 만드는 후가공 기술입니다. 양각 형압은 패턴이 돌출되는 효과를, 음각 형압은 패턴이 들어가는 효과를 만들어냅니다. 입체감과 촉감을 통해 고급스러운 느낌을 제공하며, 명함, 청첩장, 고급 패키지 등에 사용됩니다.',
  '서비스정보',
  ARRAY['형압가공', '양각', '음각', '입체감', '촉감', '고급스러움', '패턴'],
  10
);

-- 6. 작업 프로세스 정보
INSERT INTO chatbot_knowledge_base (company_id, title, content, category, tags, priority) VALUES
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '정우특수코팅 작업 프로세스',
  '정우특수코팅의 작업 프로세스는 4단계로 구성됩니다. 1단계: 상담 및 견적 - 고객 요구사항 파악 및 최적 솔루션 제안, 2단계: 디자인 검토 - 인쇄 파일 검토 및 코팅 최적화 방안 제시, 3단계: 시제품 제작 - 소량 시제품 제작으로 품질 확인, 4단계: 본 작업 및 납품 - 품질 검수 후 최종 납품',
  '작업프로세스',
  ARRAY['작업프로세스', '상담', '견적', '디자인검토', '시제품', '본작업', '납품'],
  10
),
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '작업 소요시간 및 납기',
  '일반적인 코팅 작업은 1-3일 소요됩니다. 작업량과 난이도에 따라 달라질 수 있으며, 긴급 작업의 경우 별도 상담을 통해 가능합니다. 대량 작업의 경우 1주일 정도 소요될 수 있으며, 시제품 제작은 1-2일 정도 소요됩니다.',
  '작업프로세스',
  ARRAY['작업시간', '소요시간', '납기', '긴급작업', '대량작업', '시제품'],
  9
);

-- 7. 포트폴리오 및 실적
INSERT INTO chatbot_knowledge_base (company_id, title, content, category, tags, priority) VALUES
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '정우특수코팅 작업 사례',
  '정우특수코팅은 다양한 작업 사례를 보유하고 있습니다. 명함 UV 코팅, 카탈로그 무광 라미네이팅, 초대장 금박, 명함 양각 형압, 책 표지 유광 라미네이팅, 패키지 은박, 포스터 부분 UV, 청첩장 음각 형압 등 다양한 코팅 기술을 적용한 성공 사례들이 있습니다.',
  '포트폴리오',
  ARRAY['작업사례', '포트폴리오', '명함', '카탈로그', '초대장', '책표지', '패키지', '포스터', '청첩장'],
  9
);

-- 8. FAQ - 자주 묻는 질문
INSERT INTO chatbot_knowledge_base (company_id, title, content, category, tags, priority) VALUES
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '최소 주문량 문의',
  '최소 주문량은 없으며, 소량 주문도 환영합니다. 다만 소량 주문의 경우 단가가 높을 수 있으니 사전 상담을 권장합니다. 대량 주문 시에는 할인 혜택을 제공합니다.',
  'FAQ',
  ARRAY['최소주문량', '소량주문', '단가', '할인', '대량주문'],
  10
),
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '견적 문의 방법',
  '견적 문의는 전화, 이메일, 온라인 문의 폼을 통해 가능합니다. 정확한 견적을 위해 인쇄 파일, 수량, 납기일 등을 미리 준비해 주시면 됩니다. 무료 견적 서비스를 제공합니다.',
  'FAQ',
  ARRAY['견적문의', '전화', '이메일', '온라인문의', '무료견적'],
  10
),
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '파일 형식 및 요구사항',
  '인쇄 파일은 PDF, AI, EPS 형식을 권장합니다. 해상도는 300DPI 이상이어야 하며, 코팅 영역은 별도 레이어로 표시해 주시면 됩니다. 컬러는 CMYK 모드로 변환해 주세요.',
  'FAQ',
  ARRAY['파일형식', 'PDF', 'AI', 'EPS', '해상도', 'DPI', 'CMYK', '레이어'],
  9
),
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '품질 보장 및 A/S',
  '정우특수코팅은 모든 작업에 대해 품질을 보장합니다. 작업 완료 후 품질 검수를 거쳐 납품하며, 문제가 있을 경우 무료 재작업 서비스를 제공합니다. A/S는 작업 완료 후 1개월간 제공됩니다.',
  'FAQ',
  ARRAY['품질보장', 'A/S', '재작업', '무료', '품질검수', '보장'],
  9
),
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '배송 및 납품',
  '서울 및 수도권 지역은 무료 배송을 제공합니다. 기타 지역은 별도 배송비가 발생할 수 있습니다. 긴급 납품이 필요한 경우 당일 배송도 가능합니다.',
  'FAQ',
  ARRAY['배송', '납품', '무료배송', '수도권', '배송비', '당일배송', '긴급납품'],
  8
);

-- 9. 전문 용어 사전
INSERT INTO chatbot_knowledge_base (company_id, title, content, category, tags, priority) VALUES
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '코팅 관련 전문 용어',
  'UV: 자외선을 이용한 코팅 기술, 라미네이팅: 필름을 붙이는 후가공 기술, 박: 금속박막을 전사하는 기술, 형압: 압력을 가해 입체감을 만드는 기술, 도무송: 부분적으로 코팅을 적용하는 기술, 매트: 무광 표면 처리, 글리터: 유광 표면 처리',
  '전문용어',
  ARRAY['전문용어', 'UV', '라미네이팅', '박', '형압', '도무송', '매트', '글리터'],
  8
),
(
  (SELECT id FROM companies WHERE company_code = 'jeongwoo'),
  '인쇄 관련 용어',
  'CMYK: 청록, 자홍, 노랑, 검정의 4색 인쇄 방식, DPI: 인치당 도트 수로 해상도를 나타내는 단위, 블리드: 인쇄물 가장자리까지 색상을 칠하는 것, 트림: 인쇄 후 여백을 자르는 작업',
  '전문용어',
  ARRAY['CMYK', 'DPI', '블리드', '트림', '인쇄용어', '해상도'],
  7
);

-- 완료 메시지
SELECT '확장된 지식베이스 데이터가 성공적으로 추가되었습니다!' as message;

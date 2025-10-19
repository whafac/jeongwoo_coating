-- 정우특수코팅 게시판 데이터베이스 스키마
-- PlanetScale에서 실행할 SQL

-- 회사/업체 테이블 (향후 확장 고려)
CREATE TABLE companies (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  domain VARCHAR(100) UNIQUE,
  settings JSON,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 사용자 테이블
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 게시글 테이블
CREATE TABLE posts (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  company_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category ENUM('inquiry', 'review', 'notice') DEFAULT 'inquiry',
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
  
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  
  INDEX idx_company_category (company_id, category),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- 댓글 테이블 (향후 확장용)
CREATE TABLE comments (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 초기 데이터 삽입
INSERT INTO companies (id, name, domain) VALUES 
('jeongwoo', '정우특수코팅', 'jeongwoo-coating.vercel.app');

-- 샘플 사용자 (테스트용)
INSERT INTO users (id, email, name, phone) VALUES 
('sample-user-1', 'test@example.com', '테스트 사용자', '010-1234-5678');

-- 샘플 게시글 (테스트용)
INSERT INTO posts (company_id, user_id, title, content, category, status) VALUES 
('jeongwoo', 'sample-user-1', '샘플 문의입니다', '정우특수코팅 서비스에 대해 문의드립니다.', 'inquiry', 'approved'),
('jeongwoo', 'sample-user-1', '작업 후기', '정우특수코팅에서 작업한 결과가 매우 만족스럽습니다.', 'review', 'approved');

import { connect } from '@planetscale/database';

// PlanetScale 데이터베이스 연결 설정
// 실제 배포 시에는 환경변수로 설정
const config = {
  host: process.env.DATABASE_HOST || 'localhost',
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  // PlanetScale에서는 ssl: true 필요
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

export const db = connect(config);

// 데이터베이스 스키마 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  created_at: Date;
}

export interface Post {
  id: string;
  company_id: string;
  user_id: string;
  title: string;
  content: string;
  category: 'inquiry' | 'review' | 'notice';
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
  updated_at?: Date;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  settings?: any;
  created_at: Date;
}

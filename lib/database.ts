import { createClient } from '@supabase/supabase-js';

// Supabase 데이터베이스 연결 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

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

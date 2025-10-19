import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// 게시글 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company') || 'jeongwoo';
    const category = searchParams.get('category') || 'inquiry';
    
    const result = await db.execute(`
      SELECT p.*, u.name as user_name, u.email as user_email 
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.company_id = ? AND p.category = ? AND p.status = 'approved'
      ORDER BY p.created_at DESC
    `, [companyId, category]);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// 새 게시글 작성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category = 'inquiry', userEmail, userName, userPhone } = body;
    
    // 사용자 확인 또는 생성
    let userResult = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [userEmail]
    );
    
    let userId;
    if (userResult.rows.length === 0) {
      // 새 사용자 생성
      const newUserResult = await db.execute(`
        INSERT INTO users (email, name, phone) 
        VALUES (?, ?, ?)
      `, [userEmail, userName, userPhone]);
      userId = newUserResult.insertId;
    } else {
      userId = userResult.rows[0].id;
    }
    
    // 게시글 생성
    const result = await db.execute(`
      INSERT INTO posts (company_id, user_id, title, content, category, status) 
      VALUES (?, ?, ?, ?, ?, 'pending')
    `, ['jeongwoo', userId, title, content, category]);
    
    return NextResponse.json({ 
      success: true, 
      postId: result.insertId,
      message: '문의가 성공적으로 등록되었습니다. 빠른 시일 내에 답변드리겠습니다.'
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

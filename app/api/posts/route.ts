import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

// 게시글 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company') || 'jeongwoo';
    const category = searchParams.get('category') || 'inquiry';
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!posts_user_id_fkey (
          name,
          email
        )
      `)
      .eq('company_id', companyId)
      .eq('category', category)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // 데이터 형식 변환
    const formattedPosts = posts?.map(post => ({
      ...post,
      user_name: post.users?.name,
      user_email: post.users?.email
    })) || [];
    
    return NextResponse.json(formattedPosts);
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
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();
    
    let userId;
    if (existingUser) {
      userId = existingUser.id;
    } else {
      // 새 사용자 생성
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: userEmail,
          name: userName,
          phone: userPhone
        })
        .select('id')
        .single();
      
      if (userError) throw userError;
      userId = newUser.id;
    }
    
    // 게시글 생성
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        company_id: 'jeongwoo',
        user_id: userId,
        title,
        content,
        category,
        status: 'pending'
      })
      .select('id')
      .single();
    
    if (postError) throw postError;
    
    return NextResponse.json({ 
      success: true, 
      postId: post.id,
      message: '문의가 성공적으로 등록되었습니다. 빠른 시일 내에 답변드리겠습니다.'
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

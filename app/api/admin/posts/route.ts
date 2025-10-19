import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

// 관리자용 게시글 목록 조회 (승인 대기 포함)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company') || 'jeongwoo';
    const status = searchParams.get('status') || 'all';
    
    let query = `
      SELECT p.*, u.name as user_name, u.email as user_email, u.phone as user_phone
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.company_id = ?
    `;
    const params = [companyId];
    
    if (status !== 'all') {
      query += ' AND p.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY p.created_at DESC';
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!posts_user_id_fkey (
          name,
          email,
          phone
        )
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // 데이터 형식 변환
    const formattedPosts = posts?.map(post => ({
      ...post,
      user_name: post.users?.name,
      user_email: post.users?.email,
      user_phone: post.users?.phone
    })) || [];
    
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// 게시글 상태 변경 (승인/거부)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, status } = body;
    
    if (!postId || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('posts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', postId);
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      message: `게시글이 ${status === 'approved' ? '승인' : status === 'rejected' ? '거부' : '대기'} 처리되었습니다.`
    });
  } catch (error) {
    console.error('Error updating post status:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// 게시글 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      message: '게시글이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

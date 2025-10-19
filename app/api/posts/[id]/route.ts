import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

// 특정 게시글 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      .eq('id', params.id)
      .eq('status', 'approved')
      .single();
    
    if (error || !posts) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // 데이터 형식 변환
    const formattedPost = {
      ...posts,
      user_name: posts.users?.name,
      user_email: posts.users?.email,
      user_phone: posts.users?.phone
    };
    
    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// 게시글 삭제 (관리자용)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 실제로는 관리자 인증 확인 필요
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', params.id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

// 특정 게시글의 답글 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }
    
    const { data: replies, error } = await supabase
      .from('replies')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return NextResponse.json(replies || []);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
  }
}

// 새 답글 작성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, content, adminName = '관리자' } = body;
    
    if (!postId || !content) {
      return NextResponse.json({ error: 'Post ID and content required' }, { status: 400 });
    }
    
    const { data: reply, error } = await supabase
      .from('replies')
      .insert({
        post_id: postId,
        admin_name: adminName,
        content
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      reply,
      message: '답변이 성공적으로 등록되었습니다.'
    });
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 });
  }
}

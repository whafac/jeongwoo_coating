import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

// 특정 게시글의 댓글 목록 조회 (트리 구조)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }
    
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // 트리 구조로 변환
    const commentsMap = new Map();
    const rootComments: any[] = [];
    
    comments?.forEach(comment => {
      commentsMap.set(comment.id, { ...comment, replies: [] });
    });
    
    comments?.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentsMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentsMap.get(comment.id));
        }
      } else {
        rootComments.push(commentsMap.get(comment.id));
      }
    });
    
    return NextResponse.json(rootComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// 새 댓글 작성 (관리자 답변 또는 고객 추가 문의)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      postId, 
      parentId, 
      authorType, 
      authorName, 
      authorEmail, 
      authorPhone, 
      content 
    } = body;
    
    if (!postId || !authorType || !authorName || !content) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }
    
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        parent_id: parentId || null,
        author_type: authorType,
        author_name: authorName,
        author_email: authorEmail,
        author_phone: authorPhone,
        content
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      comment,
      message: authorType === 'admin' ? '답변이 등록되었습니다.' : '추가 문의가 등록되었습니다.'
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

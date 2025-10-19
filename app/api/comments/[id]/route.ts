import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

// 댓글 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { content } = body;
    
    if (!content) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }
    
    const { data: comment, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', params.id)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      comment,
      message: '댓글이 수정되었습니다.'
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

// 댓글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', params.id);
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      message: '댓글이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}

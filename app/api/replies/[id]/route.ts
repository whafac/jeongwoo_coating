import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';

// 답글 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { content, adminName } = body;
    
    if (!content) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }
    
    const updateData: any = { content };
    if (adminName) updateData.admin_name = adminName;
    
    const { data: reply, error } = await supabase
      .from('replies')
      .update(updateData)
      .eq('id', params.id)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      reply,
      message: '답변이 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    console.error('Error updating reply:', error);
    return NextResponse.json({ error: 'Failed to update reply' }, { status: 500 });
  }
}

// 답글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('replies')
      .delete()
      .eq('id', params.id);
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      message: '답변이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('Error deleting reply:', error);
    return NextResponse.json({ error: 'Failed to delete reply' }, { status: 500 });
  }
}

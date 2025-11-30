import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';
import { extractTextFromPDF, chunkText, extractKeywords } from '@/lib/pdf-parser';

// 파일 크기 제한 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // 관리자 인증 확인
    const authCookie = request.cookies.get('admin_authenticated');
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 401 }
      );
    }

    // FormData에서 파일 가져오기
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 확인
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'PDF 파일만 업로드할 수 있습니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 확인
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `파일 크기는 ${MAX_FILE_SIZE / 1024 / 1024}MB를 초과할 수 없습니다.` },
        { status: 400 }
      );
    }

    // 회사 정보 가져오기
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('id', 'jeongwoo')
      .single();

    if (!company || companyError) {
      console.error('회사 조회 오류:', companyError);
      return NextResponse.json(
        { error: '회사 정보를 찾을 수 없습니다.' },
        { status: 500 }
      );
    }

    // 파일을 Buffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('📄 [PDF Upload] 파일 업로드 시작:', file.name);
    console.log('📄 [PDF Upload] 파일 크기:', (file.size / 1024).toFixed(2), 'KB');

    // PDF에서 텍스트 추출
    const pdfResult = await extractTextFromPDF(buffer);
    console.log('✅ [PDF Upload] 텍스트 추출 완료');
    console.log('📄 [PDF Upload] 페이지 수:', pdfResult.pageCount);
    console.log('📄 [PDF Upload] 추출된 텍스트 길이:', pdfResult.text.length, '자');

    // 텍스트가 너무 긴 경우 청크 단위로 분할
    const chunks = pdfResult.text.length > 5000 
      ? chunkText(pdfResult.text, 5000)
      : [pdfResult.text];

    console.log('📄 [PDF Upload] 청크 수:', chunks.length);

    // 키워드 추출
    const keywords = extractKeywords(pdfResult.text);
    console.log('📄 [PDF Upload] 추출된 키워드:', keywords.slice(0, 5).join(', '));

    // 지식베이스에 저장
    const savedItems = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const title = chunks.length > 1 
        ? `${file.name} (${i + 1}/${chunks.length})`
        : file.name.replace('.pdf', '');

      const { data: knowledgeItem, error: saveError } = await supabase
        .from('chatbot_knowledge_base')
        .insert({
          company_id: company.id,
          title: title,
          content: chunk,
          category: '업로드 문서',
          tags: keywords,
          priority: 10, // 업로드 문서는 높은 우선순위
          is_active: true,
        })
        .select()
        .single();

      if (saveError) {
        console.error('지식베이스 저장 오류:', saveError);
        throw new Error(`지식베이스 저장 실패: ${saveError.message}`);
      }

      savedItems.push(knowledgeItem);
    }

    console.log('✅ [PDF Upload] 지식베이스 저장 완료:', savedItems.length, '개 항목');

    return NextResponse.json({
      success: true,
      message: 'PDF 파일이 성공적으로 업로드되었습니다.',
      data: {
        fileName: file.name,
        pageCount: pdfResult.pageCount,
        textLength: pdfResult.text.length,
        chunksCount: chunks.length,
        savedItemsCount: savedItems.length,
        keywords: keywords.slice(0, 10),
        info: pdfResult.info,
      },
    });

  } catch (error: any) {
    console.error('PDF 업로드 오류:', error);
    return NextResponse.json(
      { 
        error: error.message || 'PDF 업로드 중 오류가 발생했습니다.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// 업로드한 문서 목록 조회
export async function GET(request: NextRequest) {
  try {
    // 관리자 인증 확인
    const authCookie = request.cookies.get('admin_authenticated');
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 401 }
      );
    }

    // 회사 정보 가져오기
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('id', 'jeongwoo')
      .single();

    if (!company || companyError) {
      return NextResponse.json(
        { error: '회사 정보를 찾을 수 없습니다.' },
        { status: 500 }
      );
    }

    // 업로드한 문서 목록 조회 (category가 '업로드 문서'인 항목)
    const { data: documents, error: fetchError } = await supabase
      .from('chatbot_knowledge_base')
      .select('id, title, content, tags, created_at, updated_at, usage_count')
      .eq('company_id', company.id)
      .eq('category', '업로드 문서')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('문서 목록 조회 오류:', fetchError);
      return NextResponse.json(
        { error: '문서 목록을 불러올 수 없습니다.' },
        { status: 500 }
      );
    }

    // 중복 제거 (같은 파일명의 청크들을 하나로 묶기)
    const uniqueDocuments = documents.reduce((acc: any[], doc: any) => {
      const baseName = doc.title.replace(/\s*\(\d+\/\d+\)$/, ''); // "(1/3)" 같은 부분 제거
      const existing = acc.find(d => d.baseName === baseName);
      
      if (existing) {
        existing.chunks.push({
          id: doc.id,
          title: doc.title,
          content: doc.content.substring(0, 200) + '...', // 미리보기용
          created_at: doc.created_at,
          usage_count: doc.usage_count,
        });
      } else {
        acc.push({
          baseName: baseName,
          fileName: baseName,
          chunks: [{
            id: doc.id,
            title: doc.title,
            content: doc.content.substring(0, 200) + '...',
            created_at: doc.created_at,
            usage_count: doc.usage_count,
          }],
          tags: doc.tags || [],
          totalChunks: 1,
          firstUploaded: doc.created_at,
          lastUpdated: doc.updated_at,
        });
      }
      
      return acc;
    }, []);

    // 총 청크 수 업데이트
    uniqueDocuments.forEach((doc: any) => {
      doc.totalChunks = doc.chunks.length;
    });

    return NextResponse.json({
      success: true,
      documents: uniqueDocuments,
      totalCount: uniqueDocuments.length,
    });

  } catch (error: any) {
    console.error('문서 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '문서 목록을 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}

// 문서 삭제
export async function DELETE(request: NextRequest) {
  try {
    // 관리자 인증 확인
    const authCookie = request.cookies.get('admin_authenticated');
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json(
        { error: '문서 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 문서 삭제 (is_active를 false로 변경)
    const { error: deleteError } = await supabase
      .from('chatbot_knowledge_base')
      .update({ is_active: false })
      .eq('id', documentId);

    if (deleteError) {
      console.error('문서 삭제 오류:', deleteError);
      return NextResponse.json(
        { error: '문서 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '문서가 삭제되었습니다.',
    });

  } catch (error: any) {
    console.error('문서 삭제 오류:', error);
    return NextResponse.json(
      { error: '문서 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}


import pdf from 'pdf-parse';

export interface PDFParseResult {
  text: string;
  pageCount: number;
  info?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
  };
}

/**
 * PDF 파일에서 텍스트를 추출합니다.
 * @param buffer PDF 파일의 Buffer
 * @returns 추출된 텍스트와 메타데이터
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<PDFParseResult> {
  try {
    const data = await pdf(buffer);
    
    return {
      text: data.text,
      pageCount: data.numpages,
      info: {
        title: data.info?.Title,
        author: data.info?.Author,
        subject: data.info?.Subject,
        creator: data.info?.Creator,
      },
    };
  } catch (error) {
    console.error('PDF 파싱 오류:', error);
    throw new Error('PDF 파일을 읽을 수 없습니다. 파일이 손상되었거나 지원되지 않는 형식일 수 있습니다.');
  }
}

/**
 * 추출한 텍스트를 청크 단위로 분할합니다.
 * @param text 추출한 텍스트
 * @param maxChunkSize 최대 청크 크기 (문자 수)
 * @returns 분할된 텍스트 배열
 */
export function chunkText(text: string, maxChunkSize: number = 2000): string[] {
  const chunks: string[] = [];
  const lines = text.split('\n');
  let currentChunk = '';

  for (const line of lines) {
    if ((currentChunk + line).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = line + '\n';
    } else {
      currentChunk += line + '\n';
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * 텍스트에서 키워드를 추출합니다.
 * @param text 추출할 텍스트
 * @returns 추출된 키워드 배열
 */
export function extractKeywords(text: string): string[] {
  // 간단한 키워드 추출 (한글 단어 추출)
  const words = text.match(/[가-힣]{2,}/g) || [];
  const wordCount: { [key: string]: number } = {};
  
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // 빈도수 기준으로 정렬하고 상위 10개 반환
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}


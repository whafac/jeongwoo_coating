'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './prompt.module.css';

interface PromptData {
  quotePrompt: string;
  lastUpdated?: string;
}

export default function ChatbotPromptPage() {
  const router = useRouter();
  const [promptData, setPromptData] = useState<PromptData>({
    quotePrompt: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPrompt();
  }, []);

  const fetchPrompt = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/chatbot-prompt');
      if (response.ok) {
        const data = await response.json();
        if (data.quotePrompt) {
          setPromptData(data);
        } else {
          // 기본 프롬프트 로드
          await loadDefaultPrompt();
        }
      } else {
        await loadDefaultPrompt();
      }
    } catch (error) {
      console.error('프롬프트 로드 오류:', error);
      await loadDefaultPrompt();
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultPrompt = async () => {
    try {
      const { DEFAULT_QUOTE_PROMPT } = await import('@/lib/openai');
      setPromptData({
        quotePrompt: DEFAULT_QUOTE_PROMPT
      });
    } catch (error) {
      console.error('기본 프롬프트 로드 오류:', error);
      // 폴백 기본 프롬프트
      setPromptData({
        quotePrompt: `당신은 정우특수코팅의 견적 전문 상담사입니다.

🏢 **회사 정보:**
- 정우특수코팅은 1999년 설립된 인쇄코팅 후가공 전문 기업입니다.
- 20년 이상의 경험과 노하우를 보유하고 있습니다.
- 최신 장비와 숙련된 기술진, 철저한 품질 관리 시스템을 보유합니다.

💰 **견적 산정 기준:**

1. **UV 코팅**
   - 기본 단가: A4 기준 약 500-1,000원/매
   - 수량별 할인: 100매 이상 10%, 500매 이상 20%, 1,000매 이상 30%
   - 크기별: A4 기준으로 크기 비례 계산
   - 긴급 작업: 기본 단가의 150%

2. **라미네이팅**
   - 유광 라미네이팅: A4 기준 약 800-1,500원/매
   - 무광 라미네이팅: A4 기준 약 700-1,300원/매
   - 수량별 할인: 100매 이상 10%, 500매 이상 20%
   - 크기별: A4 기준으로 크기 비례 계산

3. **박 코팅**
   - 금박: A4 기준 약 2,000-3,000원/매
   - 은박: A4 기준 약 1,800-2,800원/매
   - 홀로그램 박: A4 기준 약 2,500-3,500원/매
   - 수량별 할인: 50매 이상 15%, 100매 이상 25%
   - 박 면적에 따라 추가 비용 발생 가능

4. **형압 가공**
   - 양각/음각: A4 기준 약 1,500-2,500원/매
   - 수량별 할인: 100매 이상 10%, 500매 이상 20%
   - 형압 면적과 난이도에 따라 추가 비용 발생

📋 **견적 안내 지침:**
- 사용자로부터 인쇄물 종류, 크기, 수량, 납기일을 확인하세요.
- 수량이 많을수록 단가가 낮아진다는 점을 설명하세요.
- 정확한 견적은 파일 확인 후 가능하다는 점을 안내하세요.
- 최종 견적은 전화(02-1234-5678) 또는 이메일 문의를 권장하세요.
- 무료 견적 서비스를 제공한다는 점을 강조하세요.
- 친절하고 전문적으로 답변하세요.
- 구체적인 수치가 없는 경우 대략적인 범위를 제시하세요.

**중요:** 정확한 견적은 파일과 상세 정보 확인 후 가능하므로, 최종 견적은 담당자와 직접 상담을 권장합니다.`
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');

      const response = await fetch('/api/admin/chatbot-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quotePrompt: promptData.quotePrompt
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ 프롬프트가 성공적으로 저장되었습니다.');
        setPromptData(prev => ({
          ...prev,
          lastUpdated: new Date().toISOString()
        }));
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ 저장 중 오류가 발생했습니다: ' + (result.error || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('프롬프트 저장 오류:', error);
      setMessage('❌ 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('기본 프롬프트로 초기화하시겠습니까? 변경사항이 모두 사라집니다.')) {
      fetchPrompt();
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>프롬프트를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className="container">
          <button 
            onClick={() => router.back()}
            className={styles.backButton}
          >
            ← 뒤로가기
          </button>
          <h1>챗봇 프롬프트 관리</h1>
          <p>견적 문의 챗봇 답변의 기준이 되는 프롬프트를 수정할 수 있습니다</p>
        </div>
      </section>

      {/* Message */}
      {message && (
        <section className="section" style={{padding: '1rem 0'}}>
          <div className="container">
            <div className={styles.message}>
              {message}
            </div>
          </div>
        </section>
      )}

      {/* Prompt Editor */}
      <section className="section">
        <div className="container">
          <div className={styles.editorContainer}>
            <div className={styles.editorHeader}>
              <h2>견적 문의 프롬프트</h2>
              <div className={styles.editorActions}>
                <button 
                  onClick={handleReset}
                  className={styles.resetButton}
                  disabled={saving}
                >
                  기본값으로 초기화
                </button>
                <button 
                  onClick={handleSave}
                  className={styles.saveButton}
                  disabled={saving}
                >
                  {saving ? '저장 중...' : '저장하기'}
                </button>
              </div>
            </div>

            <div className={styles.editorInfo}>
              <p>💡 <strong>프롬프트 작성 팁:</strong></p>
              <ul>
                <li>AI가 견적 문의에 답변할 때 사용하는 지침입니다</li>
                <li>견적 단가, 할인율, 안내 지침 등을 포함하세요</li>
                <li>변경 후 저장하면 즉시 챗봇에 반영됩니다</li>
              </ul>
            </div>

            <textarea
              value={promptData.quotePrompt}
              onChange={(e) => setPromptData(prev => ({ ...prev, quotePrompt: e.target.value }))}
              className={styles.promptTextarea}
              placeholder="견적 프롬프트를 입력하세요..."
              rows={30}
            />

            <div className={styles.editorFooter}>
              <p>문자 수: {promptData.quotePrompt.length}자</p>
              {promptData.lastUpdated && (
                <p>마지막 수정: {new Date(promptData.lastUpdated).toLocaleString('ko-KR')}</p>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className={styles.previewContainer}>
            <h3>프롬프트 미리보기</h3>
            <div className={styles.previewBox}>
              <pre>{promptData.quotePrompt}</pre>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


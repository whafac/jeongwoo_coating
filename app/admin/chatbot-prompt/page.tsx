'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './prompt.module.css';

interface PromptData {
  quotePrompt: string;
  lastUpdated?: string;
  isDefault?: boolean;
}

type ViewMode = 'current' | 'default' | 'all';

export default function ChatbotPromptPage() {
  const router = useRouter();
  const [promptData, setPromptData] = useState<PromptData>({
    quotePrompt: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('current');
  const [defaultPrompt, setDefaultPrompt] = useState<string>('');
  const [buttonAnswers, setButtonAnswers] = useState<Record<string, string>>({});

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      try {
        await fetch('/api/admin/auth', {
          method: 'DELETE',
        });
        document.cookie = 'admin_authenticated=; path=/; max-age=0';
        window.location.href = '/admin/login';
      } catch (error) {
        console.error('로그아웃 오류:', error);
        document.cookie = 'admin_authenticated=; path=/; max-age=0';
        window.location.href = '/admin/login';
      }
    }
  };

  useEffect(() => {
    fetchPrompt();
    loadDefaultPromptForView();
    loadButtonAnswers();
  }, []);

  const loadDefaultPromptForView = async () => {
    try {
      const { DEFAULT_QUOTE_PROMPT } = await import('@/lib/openai');
      setDefaultPrompt(DEFAULT_QUOTE_PROMPT);
    } catch (error) {
      console.error('기본 프롬프트 로드 오류:', error);
    }
  };

  const loadButtonAnswers = async () => {
    try {
      // Chatbot.tsx의 answers 객체를 동적으로 가져오기
      const answers = {
        '서비스 안내': '정우특수코팅의 주요 서비스를 안내해드리겠습니다. 어떤 서비스에 대해 알고 싶으신가요?',
        '견적 문의': '견적 문의를 도와드리겠습니다! 어떤 코팅 서비스의 견적이 궁금하신가요? 아래 버튼을 선택하시거나 자유롭게 질문해주세요. 📋',
        'UV 코팅 견적': 'UV 코팅 견적 문의입니다. 아래 정보를 알려주시면 더 정확한 견적을 제공해드릴 수 있습니다:\n\n• 인쇄물 종류 및 크기\n• 수량\n• 납기일\n\n자유롭게 질문해주세요! 💬',
        '라미네이팅 견적': '라미네이팅 견적 문의입니다. 아래 정보를 알려주시면 더 정확한 견적을 제공해드릴 수 있습니다:\n\n• 인쇄물 종류 및 크기\n• 유광/무광 선택\n• 수량\n• 납기일\n\n자유롭게 질문해주세요! 💬',
        '박 코팅 견적': '박 코팅 견적 문의입니다. 아래 정보를 알려주시면 더 정확한 견적을 제공해드릴 수 있습니다:\n\n• 인쇄물 종류 및 크기\n• 박 종류 (금박/은박/홀로그램)\n• 수량\n• 납기일\n\n자유롭게 질문해주세요! 💬',
        '형압 가공 견적': '형압 가공 견적 문의입니다. 아래 정보를 알려주시면 더 정확한 견적을 제공해드릴 수 있습니다:\n\n• 인쇄물 종류 및 크기\n• 형압 종류 (양각/음각)\n• 수량\n• 납기일\n\n자유롭게 질문해주세요! 💬',
        '작업 프로세스': '작업 프로세스는 4단계로 진행됩니다:\n\n1️⃣ 상담 - 요구사항 확인\n2️⃣ 견적 - 비용 산정\n3️⃣ 작업 - 코팅 진행\n4️⃣ 납품 - 완제품 전달\n\n일반적으로 2-3일 소요되며, 급한 경우 당일 작업도 가능합니다.',
        '납기일 문의': '작업 소요시간 안내:\n\n⏱️ 일반 작업: 2-3일\n⚡ 긴급 작업: 당일 가능 (추가 비용 발생)\n📦 택배 발송: 1일 추가\n\n정확한 납기일은 작업량과 난이도에 따라 달라질 수 있으니, 상세한 문의 부탁드립니다.',
        'UV 코팅 서비스': '✨ UV 코팅 서비스 안내:\n\n자외선(UV)으로 경화시키는 코팅 방식으로:\n• 빠른 건조 시간\n• 뛰어난 광택감\n• 우수한 내구성\n• 명함, 카탈로그, 포스터 등에 적용\n\n더 자세한 정보는 /services 페이지에서 확인하실 수 있습니다.',
        '라미네이팅 서비스': '📄 라미네이팅 서비스 안내:\n\n필름을 인쇄물 표면에 부착하여 보호:\n• 유광/무광 라미네이팅\n• 방수 및 오염 방지\n• 책 표지, 메뉴판, 카드 등에 최적\n\n더 자세한 정보는 /services 페이지에서 확인하실 수 있습니다.',
        '박 코팅 서비스': '🌟 박 코팅 서비스 안내:\n\n금속 박막을 인쇄물에 전사:\n• 금박, 은박, 홀로그램 박\n• 화려하고 고급스러운 효과\n• 명함, 초대장, 패키지 등에 활용\n\n더 자세한 정보는 /services 페이지에서 확인하실 수 있습니다.',
        '형압 가공 서비스': '🎨 형압 가공 서비스 안내:\n\n압력을 가하여 입체적 효과:\n• 양각 (돌출)\n• 음각 (들어감)\n• 독특한 촉감과 시각적 효과\n• 명함, 초대장, 고급 인쇄물에 적용\n\n더 자세한 정보는 /services 페이지에서 확인하실 수 있습니다.',
        '상담원 연결': '(DB 프롬프트에서 "상담원 연결" 섹션을 찾아 사용하거나, 기본 답변 사용)',
        '파일 제출 방법': '(DB 프롬프트에서 "파일 제출 방법" 섹션을 찾아 사용하거나, 기본 답변 사용)',
        '연락처 안내': '(DB 프롬프트에서 "연락처 안내" 섹션을 찾아 사용하거나, 기본 답변 사용)'
      };
      setButtonAnswers(answers);
    } catch (error) {
      console.error('버튼 답변 로드 오류:', error);
    }
  };

  // textarea 높이 자동 조정
  useEffect(() => {
    const textarea = document.querySelector(`.${styles.promptTextarea}`) as HTMLTextAreaElement;
    if (textarea && promptData.quotePrompt) {
      // 약간의 지연을 두고 높이 조정 (렌더링 완료 후)
      setTimeout(() => {
        textarea.style.height = 'auto';
        const newHeight = Math.max(800, textarea.scrollHeight + 100);
        textarea.style.height = `${newHeight}px`;
        console.log('📏 textarea 높이 조정:', newHeight, 'px, 내용 길이:', promptData.quotePrompt.length);
      }, 100);
    }
  }, [promptData.quotePrompt]);

  const fetchPrompt = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/chatbot-prompt');
      const data = await response.json();
      
      if (response.ok) {
        if (data.quotePrompt && data.quotePrompt.trim().length > 0) {
          const promptLength = data.quotePrompt.length;
          const promptPreview = data.quotePrompt.substring(0, 100) + '...';
          
          console.log('✅ 프롬프트 로드 성공:', {
            길이: promptLength,
            기본값여부: data.isDefault ? '기본값' : 'DB값',
            마지막수정: data.lastUpdated,
            미리보기: promptPreview
          });
          
          // 프롬프트 전체 내용 확인
          console.log('📄 프롬프트 전체 내용 (처음 500자):', data.quotePrompt.substring(0, 500));
          console.log('📄 프롬프트 전체 내용 (마지막 500자):', data.quotePrompt.substring(Math.max(0, promptLength - 500)));
          
          setPromptData({
            quotePrompt: data.quotePrompt,
            lastUpdated: data.lastUpdated,
            isDefault: data.isDefault || false
          });
          
          // 프롬프트가 기본값인지 확인
          if (data.isDefault) {
            console.warn('⚠️ 기본 프롬프트를 사용 중입니다. DB에 저장된 프롬프트가 없거나 조회에 실패했습니다.');
            console.warn('💡 기본 프롬프트 길이:', promptLength, '자');
          } else {
            console.log('✅ DB에서 저장된 프롬프트를 성공적으로 로드했습니다.');
            console.log('💡 DB 프롬프트 길이:', promptLength, '자');
            
            // 기본 프롬프트 길이와 비교
            const { DEFAULT_QUOTE_PROMPT } = await import('@/lib/openai');
            const defaultLength = DEFAULT_QUOTE_PROMPT.length;
            console.log('📊 기본 프롬프트 길이:', defaultLength, '자');
            console.log('📊 차이:', promptLength - defaultLength, '자');
            
            if (promptLength < defaultLength * 0.8) {
              console.warn('⚠️ DB 프롬프트가 기본 프롬프트보다 훨씬 짧습니다. 일부 내용이 누락되었을 수 있습니다.');
            }
          }
        } else {
          console.warn('⚠️ 프롬프트가 비어있습니다. 기본 프롬프트를 로드합니다.');
          await loadDefaultPrompt();
        }
      } else {
        console.error('❌ API 응답 오류:', data.error);
        setMessage('⚠️ 프롬프트를 불러오는 중 오류가 발생했습니다: ' + (data.error || '알 수 없는 오류'));
        await loadDefaultPrompt();
      }
    } catch (error) {
      console.error('❌ 프롬프트 로드 오류:', error);
      setMessage('⚠️ 프롬프트를 불러오는 중 네트워크 오류가 발생했습니다.');
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

  const handleMergeAllPrompts = async () => {
    try {
      const { DEFAULT_QUOTE_PROMPT } = await import('@/lib/openai');
      
      // 예상질문 버튼 답변들을 프롬프트 형식으로 변환
      const buttonAnswersText = Object.entries(buttonAnswers)
        .map(([key, value]) => {
          if (value && value !== '(DB 프롬프트에서 "상담원 연결" 섹션을 찾아 사용하거나, 기본 답변 사용)' &&
              value !== '(DB 프롬프트에서 "파일 제출 방법" 섹션을 찾아 사용하거나, 기본 답변 사용)' &&
              value !== '(DB 프롬프트에서 "연락처 안내" 섹션을 찾아 사용하거나, 기본 답변 사용)') {
            return `**${key}:**\n${value}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n\n');
      
      // 모든 프롬프트 통합
      const mergedPrompt = `${promptData.quotePrompt}

---

## 📚 **추가 프롬프트 내용 (기본 프롬프트에서 통합)**

${DEFAULT_QUOTE_PROMPT}

---

## 🎯 **예상질문 버튼 답변**

${buttonAnswersText}

---

**중요:** 위의 모든 내용은 챗봇이 답변을 생성할 때 참고하는 통합 프롬프트입니다. 관리자 페이지에서 이 프롬프트를 수정하면 모든 챗봇 답변이 업데이트됩니다.`;
      
      const shouldMerge = confirm(
        `모든 프롬프트를 통합하시겠습니까?\n\n` +
        `- 현재 DB 프롬프트: ${promptData.quotePrompt.length}자\n` +
        `- 기본 프롬프트: ${DEFAULT_QUOTE_PROMPT.length}자\n` +
        `- 예상질문 답변: ${Object.keys(buttonAnswers).length}개\n\n` +
        `통합 후 모든 챗봇 답변이 이 프롬프트를 기반으로 생성됩니다.\n\n` +
        `기존 하드코딩된 프롬프트는 제거되고 DB 프롬프트만 사용됩니다.`
      );
      
      if (shouldMerge) {
        setPromptData({
          quotePrompt: mergedPrompt,
          lastUpdated: promptData.lastUpdated,
          isDefault: false
        });
        setMessage('✅ 모든 프롬프트를 통합했습니다. 저장하기를 클릭하여 DB에 저장하세요. 저장 후 코드에서 하드코딩된 프롬프트가 제거됩니다.');
      }
    } catch (error) {
      console.error('프롬프트 통합 오류:', error);
      setMessage('❌ 프롬프트 통합 중 오류가 발생했습니다.');
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
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem'}}>
            <div style={{flex: 1}}>
              <button 
                onClick={() => router.back()}
                className={styles.backButton}
              >
                ← 뒤로가기
              </button>
              <h1>챗봇 프롬프트 관리</h1>
              <p>견적 문의 챗봇 답변의 기준이 되는 프롬프트를 수정할 수 있습니다</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn"
              style={{background: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)', marginTop: '2rem'}}
            >
              🚪 로그아웃
            </button>
          </div>
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
              <h2>챗봇 프롬프트 관리</h2>
              <div className={styles.viewModeTabs} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e0e0e0' }}>
                <button
                  onClick={() => setViewMode('current')}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    background: viewMode === 'current' ? '#2c5f8d' : 'transparent',
                    color: viewMode === 'current' ? 'white' : '#666',
                    cursor: 'pointer',
                    borderBottom: viewMode === 'current' ? '2px solid #2c5f8d' : '2px solid transparent',
                    marginBottom: '-2px'
                  }}
                >
                  현재 DB 프롬프트
                </button>
                <button
                  onClick={() => setViewMode('default')}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    background: viewMode === 'default' ? '#2c5f8d' : 'transparent',
                    color: viewMode === 'default' ? 'white' : '#666',
                    cursor: 'pointer',
                    borderBottom: viewMode === 'default' ? '2px solid #2c5f8d' : '2px solid transparent',
                    marginBottom: '-2px'
                  }}
                >
                  기본 프롬프트 (참고)
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    background: viewMode === 'all' ? '#2c5f8d' : 'transparent',
                    color: viewMode === 'all' ? 'white' : '#666',
                    cursor: 'pointer',
                    borderBottom: viewMode === 'all' ? '2px solid #2c5f8d' : '2px solid transparent',
                    marginBottom: '-2px'
                  }}
                >
                  전체 프롬프트 보기
                </button>
              </div>
              <div className={styles.editorActions}>
                <button 
                  onClick={handleMergeAllPrompts}
                  className={styles.resetButton}
                  disabled={saving}
                  style={{ background: '#4caf50', color: 'white', border: 'none' }}
                >
                  모든 프롬프트 통합
                </button>
                <button 
                  onClick={handleReset}
                  className={styles.resetButton}
                  disabled={saving}
                >
                  기본값으로 초기화
                </button>
                {viewMode === 'current' && (
                  <button 
                    onClick={handleSave}
                    className={styles.saveButton}
                    disabled={saving}
                  >
                    {saving ? '저장 중...' : '저장하기'}
                  </button>
                )}
              </div>
            </div>

            <div className={styles.editorInfo}>
              <p>💡 <strong>프롬프트 작성 팁:</strong></p>
              <ul>
                <li>AI가 견적 문의에 답변할 때 사용하는 지침입니다</li>
                <li>견적 단가, 할인율, 안내 지침 등을 포함하세요</li>
                <li>변경 후 저장하면 즉시 챗봇에 반영됩니다</li>
                <li>프롬프트는 DB에 저장되며, 모든 챗봇 답변의 기준이 됩니다</li>
              </ul>
              <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f0f0f0', borderRadius: '4px', fontSize: '12px' }}>
                <strong>디버그 정보:</strong>
                <br />프롬프트 길이: {promptData.quotePrompt.length}자
                <br />마지막 수정: {promptData.lastUpdated ? new Date(promptData.lastUpdated).toLocaleString('ko-KR') : '없음'}
                <br />상태: {promptData.isDefault ? '⚠️ 기본 프롬프트' : '✅ DB 프롬프트'}
                <br />프롬프트 시작: {promptData.quotePrompt.substring(0, 50)}...
                <br />프롬프트 끝: ...{promptData.quotePrompt.substring(Math.max(0, promptData.quotePrompt.length - 50))}
                <br />브라우저 콘솔(F12)에서 상세 로그를 확인하세요.
              </div>
            </div>

            {viewMode === 'current' && (
              <textarea
                value={promptData.quotePrompt}
                onChange={(e) => setPromptData(prev => ({ ...prev, quotePrompt: e.target.value }))}
                className={styles.promptTextarea}
                placeholder="견적 프롬프트를 입력하세요..."
                style={{ 
                  height: 'auto',
                  minHeight: '800px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.max(800, target.scrollHeight + 50)}px`;
                }}
              />
            )}
            
            {viewMode === 'default' && (
              <textarea
                value={defaultPrompt}
                readOnly
                className={styles.promptTextarea}
                style={{ 
                  height: 'auto',
                  minHeight: '800px',
                  background: '#f5f5f5',
                  cursor: 'not-allowed'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.max(800, target.scrollHeight + 50)}px`;
                }}
              />
            )}
            
            {viewMode === 'all' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <h3 style={{ marginBottom: '1rem', color: '#2c5f8d' }}>1. 현재 DB 프롬프트 ({promptData.quotePrompt.length}자)</h3>
                  <textarea
                    value={promptData.quotePrompt}
                    onChange={(e) => setPromptData(prev => ({ ...prev, quotePrompt: e.target.value }))}
                    className={styles.promptTextarea}
                    style={{ 
                      height: 'auto',
                      minHeight: '400px',
                      maxHeight: '600px'
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${Math.max(400, Math.min(600, target.scrollHeight + 50))}px`;
                    }}
                  />
                </div>
                
                <div>
                  <h3 style={{ marginBottom: '1rem', color: '#2c5f8d' }}>2. 기본 프롬프트 (참고용, {defaultPrompt.length}자)</h3>
                  <textarea
                    value={defaultPrompt}
                    readOnly
                    className={styles.promptTextarea}
                    style={{ 
                      height: 'auto',
                      minHeight: '400px',
                      maxHeight: '600px',
                      background: '#f5f5f5',
                      cursor: 'not-allowed'
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${Math.max(400, Math.min(600, target.scrollHeight + 50))}px`;
                    }}
                  />
                </div>
                
                <div>
                  <h3 style={{ marginBottom: '1rem', color: '#2c5f8d' }}>3. 예상질문 버튼 답변 (참고용)</h3>
                  <div style={{ 
                    background: '#f5f5f5', 
                    padding: '1.5rem', 
                    borderRadius: '8px',
                    maxHeight: '600px',
                    overflowY: 'auto'
                  }}>
                    {Object.entries(buttonAnswers).map(([key, value]) => (
                      <div key={key} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #ddd' }}>
                        <h4 style={{ color: '#2c5f8d', marginBottom: '0.5rem' }}>{key}</h4>
                        <pre style={{ 
                          whiteSpace: 'pre-wrap', 
                          wordWrap: 'break-word',
                          fontFamily: 'inherit',
                          fontSize: '14px',
                          lineHeight: '1.6',
                          margin: 0
                        }}>{value}</pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className={styles.editorFooter}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <p><strong>문자 수:</strong> {promptData.quotePrompt.length}자</p>
                  {promptData.lastUpdated && (
                    <p><strong>마지막 수정:</strong> {new Date(promptData.lastUpdated).toLocaleString('ko-KR')}</p>
                  )}
                  {promptData.isDefault !== undefined && (
                    <p style={{ color: promptData.isDefault ? '#ff9800' : '#4caf50' }}>
                      <strong>상태:</strong> {promptData.isDefault ? '⚠️ 기본 프롬프트 사용 중' : '✅ DB 프롬프트 사용 중'}
                    </p>
                  )}
                </div>
                {promptData.quotePrompt.length === 0 && (
                  <p style={{ color: '#f44336' }}>⚠️ 프롬프트가 비어있습니다. 기본 프롬프트를 로드하거나 새로 입력해주세요.</p>
                )}
                {promptData.isDefault && promptData.quotePrompt.length > 0 && (
                  <p style={{ color: '#ff9800', background: '#fff3e0', padding: '0.5rem', borderRadius: '4px' }}>
                    ⚠️ 현재 기본 프롬프트를 표시하고 있습니다. 저장하면 DB에 저장되며, 다음부터는 DB 프롬프트가 로드됩니다.
                  </p>
                )}
              </div>
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


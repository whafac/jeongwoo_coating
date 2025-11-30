'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './prompt.module.css';

interface PromptData {
  quotePrompt: string;
  lastUpdated?: string;
  isDefault?: boolean;
}

export default function ChatbotPromptPage() {
  const router = useRouter();
  const [promptData, setPromptData] = useState<PromptData>({
    quotePrompt: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
  }, []);

  // textarea 높이 자동 조정 (스크롤 위치 유지) - 편집 모드일 때만
  useEffect(() => {
    if (!isEditing || !textareaRef.current) return;
    
    const textarea = textareaRef.current;
    // 편집 모드가 아닐 때는 높이 조정하지 않음
    if (textarea && promptData.quotePrompt) {
      // 현재 스크롤 위치 및 커서 위치 저장
      const scrollTop = textarea.scrollTop;
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      
      // 약간의 지연을 두고 높이 조정 (렌더링 완료 후)
      const timeoutId = setTimeout(() => {
        textarea.style.height = 'auto';
        const newHeight = Math.max(800, textarea.scrollHeight + 100);
        textarea.style.height = `${newHeight}px`;
        
        // 스크롤 위치 및 커서 위치 복원 (여러 프레임에 걸쳐 복원)
        requestAnimationFrame(() => {
          textarea.scrollTop = scrollTop;
          if (selectionStart !== null && selectionEnd !== null) {
            textarea.setSelectionRange(selectionStart, selectionEnd);
          }
          // 한 번 더 확인하여 확실히 복원
          requestAnimationFrame(() => {
            if (Math.abs(textarea.scrollTop - scrollTop) > 1) {
              textarea.scrollTop = scrollTop;
            }
          });
        });
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [promptData.quotePrompt, isEditing]);

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
            console.warn('⚠️ DB에 저장된 프롬프트가 없습니다. 관리자 페이지에서 프롬프트를 입력하고 저장해주세요.');
          } else {
            console.log('✅ DB에서 저장된 프롬프트를 성공적으로 로드했습니다.');
            console.log('💡 DB 프롬프트 길이:', promptLength, '자');
          }
        } else {
          console.warn('⚠️ 프롬프트가 비어있습니다. 관리자 페이지에서 프롬프트를 입력하고 저장해주세요.');
          setPromptData({
            quotePrompt: '',
            lastUpdated: null,
            isDefault: true
          });
        }
      } else {
        console.error('❌ API 응답 오류:', data.error);
        setMessage('⚠️ 프롬프트를 불러오는 중 오류가 발생했습니다: ' + (data.error || '알 수 없는 오류'));
        setPromptData({
          quotePrompt: '',
          lastUpdated: null,
          isDefault: true
        });
      }
    } catch (error) {
      console.error('❌ 프롬프트 로드 오류:', error);
      setMessage('⚠️ 프롬프트를 불러오는 중 네트워크 오류가 발생했습니다.');
      setPromptData({
        quotePrompt: '',
        lastUpdated: null,
        isDefault: true
      });
    } finally {
      setLoading(false);
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
        setIsEditing(false); // 저장 후 편집 모드 종료
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
    if (confirm('현재 프롬프트를 지우고 새로 시작하시겠습니까? 변경사항이 모두 사라집니다.')) {
      setPromptData({
        quotePrompt: '',
        lastUpdated: null,
        isDefault: true
      });
      setMessage('✅ 프롬프트가 초기화되었습니다. 새로운 내용을 입력하고 저장하세요.');
      setIsEditing(false);
    }
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing && textareaRef.current) {
      // 편집 모드로 전환 시 textarea에 포커스
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    // 현재 스크롤 위치 및 커서 위치 저장
    const scrollTop = target.scrollTop;
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;
    
    // 값 업데이트
    setPromptData(prev => ({ ...prev, quotePrompt: target.value }));
    
    // 높이 조정 및 스크롤 위치 복원
    requestAnimationFrame(() => {
      target.style.height = 'auto';
      const newHeight = Math.max(800, target.scrollHeight + 50);
      target.style.height = `${newHeight}px`;
      
      // 스크롤 위치 복원
      requestAnimationFrame(() => {
        target.scrollTop = scrollTop;
        target.setSelectionRange(selectionStart, selectionEnd);
        // 한 번 더 확인
        requestAnimationFrame(() => {
          if (Math.abs(target.scrollTop - scrollTop) > 1) {
            target.scrollTop = scrollTop;
          }
        });
      });
    });
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    // 현재 스크롤 위치 및 커서 위치 저장
    const scrollTop = target.scrollTop;
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;
    
    // 높이 조정
    target.style.height = 'auto';
    const newHeight = Math.max(800, target.scrollHeight + 50);
    target.style.height = `${newHeight}px`;
    
    // 스크롤 위치 및 커서 위치 복원
    requestAnimationFrame(() => {
      target.scrollTop = scrollTop;
      target.setSelectionRange(selectionStart, selectionEnd);
      // 한 번 더 확인하여 확실히 복원
      requestAnimationFrame(() => {
        if (Math.abs(target.scrollTop - scrollTop) > 1) {
          target.scrollTop = scrollTop;
          target.setSelectionRange(selectionStart, selectionEnd);
        }
      });
    });
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
              <p>모든 챗봇 답변의 기준이 되는 프롬프트를 수정할 수 있습니다.</p>
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
              <h2>현재 DB 프롬프트</h2>
              <div className={styles.editorActions}>
                {!isEditing ? (
                  <button 
                    onClick={handleToggleEdit}
                    className={styles.editButton}
                    disabled={saving}
                  >
                    ✏️ 프롬프트 수정
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleToggleEdit}
                      className={styles.cancelButton}
                      disabled={saving}
                    >
                      취소
                    </button>
                    <button 
                      onClick={handleReset}
                      className={styles.resetButton}
                      disabled={saving}
                    >
                      초기화
                    </button>
                    <button 
                      onClick={handleSave}
                      className={styles.saveButton}
                      disabled={saving}
                    >
                      {saving ? '저장 중...' : '저장하기'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={styles.editorInfo}>
              <p>💡 <strong>프롬프트 작성 팁:</strong></p>
              <ul>
                <li>AI가 답변할 때 사용하는 모든 지침을 여기에 작성하세요.</li>
                <li>회사 정보, 견적 기준, 서비스 상세, 연락처, 파일 제출 방법, 납기일 등 모든 정보를 포함하세요.</li>
                <li>변경 후 저장하면 즉시 챗봇에 반영됩니다.</li>
                <li>프롬프트는 DB에 저장되며, 모든 챗봇 답변의 유일한 기준이 됩니다.</li>
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

            <textarea
              ref={textareaRef}
              value={promptData.quotePrompt}
              onChange={handleTextareaChange}
              onInput={handleTextareaInput}
              className={styles.promptTextarea}
              placeholder="챗봇 프롬프트를 입력하세요. 회사 정보, 견적 기준, 서비스 상세, 연락처, 파일 제출 방법, 납기일 등 모든 정보를 여기에 작성해주세요."
              readOnly={!isEditing}
              style={{ 
                height: 'auto',
                minHeight: '800px',
                cursor: isEditing ? 'text' : 'default',
                backgroundColor: isEditing ? 'white' : '#f9f9f9'
              }}
            />

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
                  <p style={{ color: '#f44336' }}>⚠️ 프롬프트가 비어있습니다. 새로운 내용을 입력하고 저장해주세요.</p>
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


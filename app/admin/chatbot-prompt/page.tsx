'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './prompt.module.css';

interface PromptData {
  quotePrompt: string;
  lastUpdated?: string;
  isDefault?: boolean;
}

interface Document {
  baseName: string;
  fileName: string;
  chunks: Array<{
    id: string;
    title: string;
    content: string;
    created_at: string;
    usage_count: number;
  }>;
  tags: string[];
  totalChunks: number;
  firstUploaded: string;
  lastUpdated: string;
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
  
  // 문서 업로드 관련 상태
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showDocuments, setShowDocuments] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    fetchDocuments();
  }, []);

  // textarea 높이 자동 조정 (스크롤 위치 유지) - 편집 모드일 때만
  useEffect(() => {
    if (!isEditing || !textareaRef.current) return;
    
    const textarea = textareaRef.current;
    // 편집 모드가 아닐 때는 높이 조정하지 않음
    if (textarea && promptData.quotePrompt) {
      // 현재 스크롤 위치 및 커서 위치 저장 (textarea와 window 모두)
      const textareaScrollTop = textarea.scrollTop;
      const windowScrollY = window.scrollY;
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      
      // 약간의 지연을 두고 높이 조정 (렌더링 완료 후)
      const timeoutId = setTimeout(() => {
        textarea.style.scrollBehavior = 'auto';
        textarea.style.height = 'auto';
        const newHeight = Math.max(800, textarea.scrollHeight + 100);
        textarea.style.height = `${newHeight}px`;
        
        // 스크롤 위치 및 커서 위치 복원 (여러 프레임에 걸쳐 복원)
        requestAnimationFrame(() => {
          // window 스크롤 위치 복원
          window.scrollTo({
            top: windowScrollY,
            behavior: 'auto'
          });
          
          // textarea 스크롤 위치 복원
          textarea.scrollTop = textareaScrollTop;
          if (selectionStart !== null && selectionEnd !== null) {
            textarea.setSelectionRange(selectionStart, selectionEnd);
          }
          
          // 한 번 더 확인하여 확실히 복원
          requestAnimationFrame(() => {
            if (Math.abs(textarea.scrollTop - textareaScrollTop) > 1) {
              textarea.scrollTop = textareaScrollTop;
            }
            if (Math.abs(window.scrollY - windowScrollY) > 1) {
              window.scrollTo({
                top: windowScrollY,
                behavior: 'auto'
              });
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

  // 문서 목록 가져오기
  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/admin/chatbot/upload-document');
      const data = await response.json();
      
      if (response.ok && data.success) {
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('문서 목록 조회 오류:', error);
    }
  };

  // 파일 업로드 처리
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage('❌ PDF 파일만 업로드할 수 있습니다.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage('❌ 파일 크기는 10MB를 초과할 수 없습니다.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setMessage('');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/chatbot/upload-document', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage(`✅ PDF 파일이 성공적으로 업로드되었습니다. (${result.data.pageCount}페이지, ${result.data.chunksCount}개 청크로 분할)`);
        setUploadProgress(100);
        fetchDocuments(); // 문서 목록 새로고침
        setTimeout(() => {
          setMessage('');
          setUploadProgress(0);
        }, 5000);
      } else {
        setMessage(`❌ 업로드 실패: ${result.error || '알 수 없는 오류'}`);
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      setMessage('❌ 파일 업로드 중 오류가 발생했습니다.');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 문서 삭제
  const handleDeleteDocument = async (chunkId: string, fileName: string) => {
    if (!confirm(`"${fileName}" 문서를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/chatbot/upload-document?id=${chunkId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage('✅ 문서가 삭제되었습니다.');
        fetchDocuments(); // 문서 목록 새로고침
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`❌ 삭제 실패: ${result.error || '알 수 없는 오류'}`);
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      console.error('문서 삭제 오류:', error);
      setMessage('❌ 문서 삭제 중 오류가 발생했습니다.');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    // 현재 스크롤 위치 및 커서 위치 저장 (textarea와 window 모두)
    const textareaScrollTop = target.scrollTop;
    const windowScrollY = window.scrollY;
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;
    
    // 값 업데이트
    setPromptData(prev => ({ ...prev, quotePrompt: target.value }));
    
    // 높이 조정 및 스크롤 위치 복원
    requestAnimationFrame(() => {
      // 높이 조정 전에 scrollIntoView 방지
      target.style.scrollBehavior = 'auto';
      
      target.style.height = 'auto';
      const newHeight = Math.max(800, target.scrollHeight + 50);
      target.style.height = `${newHeight}px`;
      
      // 스크롤 위치 복원 (여러 프레임에 걸쳐 확실하게)
      requestAnimationFrame(() => {
        // window 스크롤 위치 복원
        window.scrollTo({
          top: windowScrollY,
          behavior: 'auto'
        });
        
        // textarea 스크롤 위치 복원
        target.scrollTop = textareaScrollTop;
        target.setSelectionRange(selectionStart, selectionEnd);
        
        // 한 번 더 확인하여 확실히 복원
        requestAnimationFrame(() => {
          if (Math.abs(target.scrollTop - textareaScrollTop) > 1) {
            target.scrollTop = textareaScrollTop;
          }
          if (Math.abs(window.scrollY - windowScrollY) > 1) {
            window.scrollTo({
              top: windowScrollY,
              behavior: 'auto'
            });
          }
        });
      });
    });
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    // 현재 스크롤 위치 및 커서 위치 저장 (textarea와 window 모두)
    const textareaScrollTop = target.scrollTop;
    const windowScrollY = window.scrollY;
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;
    
    // scrollIntoView 방지
    target.style.scrollBehavior = 'auto';
    
    // 높이 조정
    target.style.height = 'auto';
    const newHeight = Math.max(800, target.scrollHeight + 50);
    target.style.height = `${newHeight}px`;
    
    // 스크롤 위치 및 커서 위치 복원 (즉시 실행)
    // 높이 조정 직후 바로 복원
    target.scrollTop = textareaScrollTop;
    window.scrollTo({
      top: windowScrollY,
      behavior: 'auto'
    });
    
    // requestAnimationFrame으로도 복원 (더 확실하게)
    requestAnimationFrame(() => {
      window.scrollTo({
        top: windowScrollY,
        behavior: 'auto'
      });
      target.scrollTop = textareaScrollTop;
      target.setSelectionRange(selectionStart, selectionEnd);
      
      // 한 번 더 확인하여 확실히 복원
      requestAnimationFrame(() => {
        if (Math.abs(target.scrollTop - textareaScrollTop) > 1) {
          target.scrollTop = textareaScrollTop;
        }
        if (Math.abs(window.scrollY - windowScrollY) > 1) {
          window.scrollTo({
            top: windowScrollY,
            behavior: 'auto'
          });
        }
        target.setSelectionRange(selectionStart, selectionEnd);
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
              onKeyDown={(e) => {
                // Enter 키 입력 시 스크롤 위치 유지
                if (e.key === 'Enter') {
                  const target = e.currentTarget;
                  const textareaScrollTop = target.scrollTop;
                  const windowScrollY = window.scrollY;
                  const selectionStart = target.selectionStart;
                  
                  // 다음 프레임에서 스크롤 위치 복원
                  requestAnimationFrame(() => {
                    window.scrollTo({
                      top: windowScrollY,
                      behavior: 'auto'
                    });
                    target.scrollTop = textareaScrollTop;
                    target.setSelectionRange(selectionStart, selectionStart);
                    
                    // 한 번 더 확인
                    requestAnimationFrame(() => {
                      if (Math.abs(window.scrollY - windowScrollY) > 1) {
                        window.scrollTo({
                          top: windowScrollY,
                          behavior: 'auto'
                        });
                      }
                      if (Math.abs(target.scrollTop - textareaScrollTop) > 1) {
                        target.scrollTop = textareaScrollTop;
                      }
                    });
                  });
                }
              }}
              className={styles.promptTextarea}
              placeholder="챗봇 프롬프트를 입력하세요. 회사 정보, 견적 기준, 서비스 상세, 연락처, 파일 제출 방법, 납기일 등 모든 정보를 여기에 작성해주세요."
              readOnly={!isEditing}
              style={{ 
                height: 'auto',
                minHeight: '800px',
                cursor: isEditing ? 'text' : 'default',
                backgroundColor: isEditing ? 'white' : '#f9f9f9',
                scrollBehavior: 'auto'
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

      {/* Document Upload Section */}
      <section className="section" style={{background: '#f9f9f9'}}>
        <div className="container">
          <div className={styles.documentSection}>
            <div className={styles.documentHeader}>
              <h2>📄 문서 업로드 (NotebookLM 스타일)</h2>
              <button
                onClick={() => setShowDocuments(!showDocuments)}
                className={styles.toggleButton}
              >
                {showDocuments ? '▲ 문서 목록 숨기기' : '▼ 문서 목록 보기'}
              </button>
            </div>
            
            <p style={{marginBottom: '1.5rem', color: '#666'}}>
              PDF 파일을 업로드하면 자동으로 텍스트를 추출하여 지식베이스에 저장합니다. 
              챗봇이 업로드한 문서의 내용을 기반으로 답변할 수 있습니다.
            </p>

            {/* 파일 업로드 영역 */}
            <div className={styles.uploadArea}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{display: 'none'}}
                id="pdf-upload-input"
              />
              <label
                htmlFor="pdf-upload-input"
                className={styles.uploadLabel}
                style={{
                  opacity: uploading ? 0.6 : 1,
                  cursor: uploading ? 'not-allowed' : 'pointer'
                }}
              >
                {uploading ? (
                  <div style={{textAlign: 'center'}}>
                    <div style={{marginBottom: '1rem'}}>📤 업로드 중...</div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#e0e0e0',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        background: '#4caf50',
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📄</div>
                    <div style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
                      PDF 파일 업로드
                    </div>
                    <div style={{color: '#666', fontSize: '0.9rem'}}>
                      클릭하거나 드래그하여 파일을 선택하세요
                      <br />
                      <span style={{fontSize: '0.8rem'}}>(최대 10MB, PDF만 가능)</span>
                    </div>
                  </>
                )}
              </label>
            </div>

            {/* 문서 목록 */}
            {showDocuments && (
              <div className={styles.documentList}>
                <h3 style={{marginBottom: '1rem'}}>업로드된 문서 목록 ({documents.length}개)</h3>
                {documents.length === 0 ? (
                  <div style={{padding: '2rem', textAlign: 'center', color: '#999'}}>
                    업로드된 문서가 없습니다.
                  </div>
                ) : (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    {documents.map((doc, index) => (
                      <div key={index} className={styles.documentItem}>
                        <div style={{flex: 1}}>
                          <h4 style={{marginBottom: '0.5rem'}}>{doc.fileName}</h4>
                          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.9rem', color: '#666'}}>
                            <span>📄 {doc.totalChunks}개 청크</span>
                            <span>📅 {new Date(doc.firstUploaded).toLocaleDateString('ko-KR')}</span>
                            {doc.tags.length > 0 && (
                              <span>🏷️ {doc.tags.slice(0, 3).join(', ')}</span>
                            )}
                          </div>
                          {doc.chunks.length > 0 && (
                            <div style={{
                              marginTop: '0.5rem',
                              padding: '0.5rem',
                              background: '#f5f5f5',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              color: '#666'
                            }}>
                              <strong>미리보기:</strong> {doc.chunks[0].content}
                            </div>
                          )}
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                          {doc.chunks.map((chunk) => (
                            <button
                              key={chunk.id}
                              onClick={() => handleDeleteDocument(chunk.id, doc.fileName)}
                              className={styles.deleteButton}
                              style={{
                                padding: '0.5rem 1rem',
                                background: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                              }}
                            >
                              삭제
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}


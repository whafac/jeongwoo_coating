'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Chatbot.module.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  aiGenerated?: boolean;
  feedbackSubmitted?: boolean;
  buttons?: QuickButton[];
}

interface QuickButton {
  id: string;
  label: string;
  action?: string;
  category?: string;
}

// 질문 카테고리와 답변 정의
const questionCategories = {
  main: [
    { id: 'service', label: '서비스 안내', category: 'service' },
    { id: 'quote', label: '견적 문의', category: 'quote' },
    { id: 'process', label: '작업 프로세스', category: 'process' },
    { id: 'file', label: '파일 제출 방법', category: 'file' },
    { id: 'delivery', label: '납기일 문의', category: 'delivery' },
    { id: 'contact', label: '연락처 안내', category: 'contact' },
    { id: 'agent', label: '상담원 연결', category: 'agent' },
  ],
  service: [
    { id: 'uv', label: 'UV 코팅', category: 'uv' },
    { id: 'laminating', label: '라미네이팅', category: 'laminating' },
    { id: 'foil', label: '박 코팅', category: 'foil' },
    { id: 'embossing', label: '형압 가공', category: 'embossing' },
    { id: 'back', label: '← 뒤로가기', category: 'main' },
  ],
  quote: [
    { id: 'quote-uv', label: 'UV 코팅 견적', category: 'quote-uv' },
    { id: 'quote-laminating', label: '라미네이팅 견적', category: 'quote-laminating' },
    { id: 'quote-foil', label: '박 코팅 견적', category: 'quote-foil' },
    { id: 'quote-embossing', label: '형압 가공 견적', category: 'quote-embossing' },
    { id: 'quote-custom', label: '자유 질문', category: 'quote-custom' },
    { id: 'back', label: '← 뒤로가기', category: 'main' },
  ],
};

// 하드코딩된 answers 객체 제거
// 모든 답변은 DB 프롬프트를 기반으로 API를 통해 생성됩니다.
// 이전 answers 객체의 내용은 관리자 페이지의 DB 프롬프트에 통합되어 관리됩니다.

// 세션 토큰 관리 함수
const getSessionToken = (): string => {
  if (typeof window === 'undefined') {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  const stored = localStorage.getItem('chatbot_session_token');
  if (stored) {
    return stored;
  }
  
  const newToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('chatbot_session_token', newToken);
  return newToken;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]); // 초기 상태를 빈 배열로 시작
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState<string | null>(null);
  const [sessionToken] = useState<string>(getSessionToken());
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [historyOffset, setHistoryOffset] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 챗봇이 열릴 때 이전 대화 기록 불러오기
  useEffect(() => {
    if (isOpen && !historyLoaded) {
      loadConversationHistory();
    }
  }, [isOpen, historyLoaded]);

  // 대화 기록 불러오기 함수 (최근 메시지만)
  const loadConversationHistory = async (offset: number = 0, append: boolean = false) => {
    try {
      setIsLoadingHistory(true);
      const limit = 20; // 한 번에 20개씩
      const response = await fetch(`/api/chatbot/history?sessionToken=${sessionToken}&limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        // API 응답 실패 시 처리
        console.error('대화 기록 API 응답 실패:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('에러 상세:', errorData);
        
        // 대화 기록이 없거나 세션이 없는 경우 초기 메시지 표시
        if (!append) {
          setMessages([{
            id: '1',
            text: '안녕하세요! 정우특수코팅 챗봇입니다. 😊\n궁금한 것이 있으시면 아래 버튼을 클릭해주세요!',
            isUser: false,
            timestamp: new Date(),
            buttons: questionCategories.main
          }]);
        }
        setHasMoreHistory(false);
        setHistoryLoaded(true);
        return;
      }
      
      const data = await response.json();
      console.log('대화 기록 로드 결과:', { 
        messageCount: data.messages?.length || 0, 
        hasMore: data.hasMore,
        totalCount: data.totalCount,
        sessionToken: sessionToken.substring(0, 20) + '...'
      });
      
      if (data.messages && data.messages.length > 0) {
        // 이전 대화 기록이 있으면 불러오기
        const loadedMessages: Message[] = data.messages.map((msg: any, index: number) => ({
          id: msg.id || `loaded_${offset + index}`,
          text: msg.text,
          isUser: msg.isUser,
          timestamp: new Date(msg.timestamp),
          buttons: undefined // 버튼은 나중에 마지막 메시지에만 추가
        }));
        
        if (append) {
          // 이전 메시지를 앞에 추가
          setMessages(prev => [...loadedMessages, ...prev]);
        } else {
          // 새로 불러오기 (최근 메시지)
          setMessages(loadedMessages);
          // 마지막 메시지가 봇 메시지면 버튼 추가
          if (loadedMessages.length > 0 && !loadedMessages[loadedMessages.length - 1].isUser) {
            loadedMessages[loadedMessages.length - 1].buttons = questionCategories.main;
            setMessages([...loadedMessages]);
          }
        }
        
        setHasMoreHistory(data.hasMore || false);
        setHistoryOffset(data.offset + data.limit);
      } else {
        // 대화 기록이 없으면 초기 메시지만 표시
        if (!append) {
          setMessages([{
            id: '1',
            text: '안녕하세요! 정우특수코팅 챗봇입니다. 😊\n궁금한 것이 있으시면 아래 버튼을 클릭해주세요!',
            isUser: false,
            timestamp: new Date(),
            buttons: questionCategories.main
          }]);
        }
        setHasMoreHistory(false);
      }
      setHistoryLoaded(true);
    } catch (error) {
      console.error('대화 기록 불러오기 오류:', error);
      // 에러 발생 시에도 초기 메시지 표시
      if (!append) {
        setMessages([{
          id: '1',
          text: '안녕하세요! 정우특수코팅 챗봇입니다. 😊\n궁금한 것이 있으시면 아래 버튼을 클릭해주세요!',
          isUser: false,
          timestamp: new Date(),
          buttons: questionCategories.main
        }]);
      }
      setHasMoreHistory(false);
      setHistoryLoaded(true);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // 이전 대화 더 불러오기
  const loadMoreHistory = async () => {
    if (isLoadingHistory || !hasMoreHistory) return;
    await loadConversationHistory(historyOffset, true);
  };

  const handleButtonClick = async (buttonId: string, buttonLabel: string, category?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: buttonLabel,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // 뒤로가기 버튼 처리
    if (category === 'main' || buttonId === 'back') {
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: '다른 궁금한 사항이 있으시면 아래 버튼을 선택해주세요! 😊',
          isUser: false,
          timestamp: new Date(),
          buttons: questionCategories.main
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 300);
      return;
    }

    // 카테고리 버튼 클릭 시 다음 단계 버튼 표시
    const answerKey = category || buttonId;
    
    // 모든 답변을 DB 프롬프트 기반으로 생성하므로 하드코딩된 answers 객체는 사용하지 않음
    // 카테고리별 다음 단계 버튼이 있는 경우에도 API를 통해 답변 생성

    // 모든 답변을 API를 통해 DB 프롬프트 기반으로 생성
    // 하드코딩된 answers 객체 대신 API 호출
    try {
      // 견적 관련 질문인지 확인
      const isQuote = buttonId.startsWith('quote-') || category?.startsWith('quote') || answerKey === 'quote';
      
      const response = await fetch('/api/chatbot/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: buttonLabel,
          sessionToken: sessionToken,
          isQuoteInquiry: isQuote
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 답변에 따라 다음 버튼 결정
        let nextButtons = questionCategories.main;
        if (isQuote) {
          nextButtons = questionCategories.quote;
        } else if (answerKey === 'service') {
          nextButtons = questionCategories.service;
        } else if (answerKey && questionCategories[answerKey as keyof typeof questionCategories]) {
          nextButtons = questionCategories[answerKey as keyof typeof questionCategories];
        }
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          isUser: false,
          timestamp: new Date(),
          aiGenerated: data.aiUsed || false,
          buttons: nextButtons
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || '응답을 받을 수 없습니다.');
      }
    } catch (error) {
      console.error('챗봇 API 오류:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '죄송합니다. 일시적인 오류가 발생했습니다. 상담원에게 직접 문의해 주세요.',
        isUser: false,
        timestamp: new Date(),
        buttons: [{ id: 'agent', label: '상담원 연결', action: 'agent' }]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
    return;

    // AI 응답이 필요한 경우
    try {
      // 견적 관련 질문인지 확인
      const isQuote = buttonId.startsWith('quote-') || category?.startsWith('quote');
      
      const response = await fetch('/api/chatbot/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: buttonLabel,
          sessionToken: sessionToken,
          isQuoteInquiry: isQuote
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 견적 관련 질문인 경우 견적 버튼 유지
        const nextButtons = isQuote ? questionCategories.quote : questionCategories.main;
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          isUser: false,
          timestamp: new Date(),
          aiGenerated: data.aiUsed || false,
          buttons: nextButtons
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || '응답을 받을 수 없습니다.');
      }
    } catch (error) {
      console.error('챗봇 API 오류:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '죄송합니다. 일시적인 오류가 발생했습니다. 상담원에게 직접 문의해 주세요.',
        isUser: false,
        timestamp: new Date(),
        buttons: [{ id: 'agent', label: '상담원 연결', action: 'agent' }]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      // 대화 기록에서 견적 문의 컨텍스트 확인
      const recentMessages = messages.slice(-5).filter(m => !m.isUser);
      const isQuoteContext = recentMessages.some(m => 
        m.text.includes('견적') || m.buttons?.some(b => b.id.startsWith('quote-'))
      );
      
      const response = await fetch('/api/chatbot/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          sessionToken: sessionToken,
          isQuoteInquiry: isQuoteContext || /견적|가격|비용|단가/.test(currentInput)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 견적 문의 컨텍스트인 경우 견적 버튼 유지
        const quoteContext = isQuoteContext || /견적|가격|비용|단가/.test(currentInput);
        const nextButtons = quoteContext ? questionCategories.quote : questionCategories.main;
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          isUser: false,
          timestamp: new Date(),
          aiGenerated: data.aiUsed || false,
          buttons: nextButtons
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || '응답을 받을 수 없습니다.');
      }
    } catch (error) {
      console.error('챗봇 API 오류:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '죄송합니다. 일시적인 오류가 발생했습니다. 상담원에게 직접 문의해 주세요.',
        isUser: false,
        timestamp: new Date(),
        buttons: [{ id: 'agent', label: '상담원 연결', action: 'agent' }]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleFeedback = async (messageId: string, feedback: 'helpful' | 'not_helpful' | 'neutral') => {
    setFeedbackSubmitting(messageId);
    
    try {
      const response = await fetch('/api/chatbot/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          feedback,
          sessionToken
        }),
      });

      if (response.ok) {
        // 피드백 제출 완료 표시
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, feedbackSubmitted: true }
            : msg
        ));
      }
    } catch (error) {
      console.error('피드백 제출 오류:', error);
    } finally {
      setFeedbackSubmitting(null);
    }
  };

  return (
    <>
      {/* 챗봇 토글 버튼 */}
      <button 
        className={`${styles.chatbotToggle} ${isOpen ? styles.open : ''}`}
        onClick={toggleChatbot}
        aria-label="챗봇 열기/닫기"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* 챗봇 창 */}
      {isOpen && (
        <div className={styles.chatbotContainer}>
          <div className={styles.chatbotHeader}>
            <div className={styles.chatbotTitle}>
              <span className={styles.chatbotIcon}>🤖</span>
              <span>정우특수코팅 도우미</span>
            </div>
            <button 
              className={styles.closeButton}
              onClick={toggleChatbot}
              aria-label="챗봇 닫기"
            >
              ✕
            </button>
          </div>

          <div className={styles.messagesContainer}>
            {/* 이전 대화 보기 버튼 */}
            {hasMoreHistory && (
              <div className={styles.loadMoreContainer}>
                <button
                  className={styles.loadMoreButton}
                  onClick={loadMoreHistory}
                  disabled={isLoadingHistory}
                >
                  {isLoadingHistory ? '불러오는 중...' : '📜 이전 대화내용 보기'}
                </button>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${message.isUser ? styles.userMessage : styles.botMessage}`}
              >
                <div className={styles.messageContent}>
                  <div className={styles.messageText}>
                    {message.text.split('\n').map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                    {message.aiGenerated && (
                      <span className={styles.aiIndicator}>🤖 AI</span>
                    )}
                  </div>
                  
                  {/* 버튼 영역 */}
                  {message.buttons && message.buttons.length > 0 && (
                    <div className={styles.quickButtons}>
                      {message.buttons.map((button) => (
                        <button
                          key={button.id}
                          className={styles.quickButton}
                          onClick={() => handleButtonClick(button.id, button.label, button.category)}
                          disabled={isLoading}
                        >
                          {button.label}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputContainer}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="궁금한 것을 물어보세요..."
              className={styles.messageInput}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className={styles.sendButton}
            >
              📤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

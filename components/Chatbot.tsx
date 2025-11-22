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
}

// 질문 카테고리와 답변 정의
const questionCategories = {
  main: [
    { id: 'service', label: '📋 서비스 안내', category: 'service' },
    { id: 'quote', label: '💰 견적 문의', category: 'quote' },
    { id: 'process', label: '⚙️ 작업 프로세스', category: 'process' },
    { id: 'file', label: '📎 파일 제출 방법', category: 'file' },
    { id: 'delivery', label: '⏰ 납기일 문의', category: 'delivery' },
    { id: 'contact', label: '📞 연락처 안내', category: 'contact' },
    { id: 'agent', label: '👤 상담원 연결', category: 'agent' },
  ],
  service: [
    { id: 'uv', label: '✨ UV 코팅', category: 'uv' },
    { id: 'laminating', label: '📄 라미네이팅', category: 'laminating' },
    { id: 'foil', label: '🌟 박 코팅', category: 'foil' },
    { id: 'embossing', label: '🎨 형압 가공', category: 'embossing' },
    { id: 'back', label: '← 뒤로가기', category: 'main' },
  ],
  quote: [
    { id: 'quote-uv', label: '✨ UV 코팅 견적', category: 'quote-uv' },
    { id: 'quote-laminating', label: '📄 라미네이팅 견적', category: 'quote-laminating' },
    { id: 'quote-foil', label: '🌟 박 코팅 견적', category: 'quote-foil' },
    { id: 'quote-embossing', label: '🎨 형압 가공 견적', category: 'quote-embossing' },
    { id: 'quote-custom', label: '💬 자유 질문', category: 'quote-custom' },
    { id: 'back', label: '← 뒤로가기', category: 'main' },
  ],
};

const answers: Record<string, { text: string; nextButtons?: string }> = {
  service: {
    text: '정우특수코팅의 주요 서비스를 안내해드리겠습니다. 어떤 서비스에 대해 알고 싶으신가요?',
    nextButtons: 'service'
  },
  quote: {
    text: '견적 문의를 도와드리겠습니다! 어떤 코팅 서비스의 견적이 궁금하신가요? 아래 버튼을 선택하시거나 자유롭게 질문해주세요. 📋',
    nextButtons: 'quote'
  },
  'quote-uv': {
    text: 'UV 코팅 견적 문의입니다. 아래 정보를 알려주시면 더 정확한 견적을 제공해드릴 수 있습니다:\n\n• 인쇄물 종류 및 크기\n• 수량\n• 납기일\n\n자유롭게 질문해주세요! 💬'
  },
  'quote-laminating': {
    text: '라미네이팅 견적 문의입니다. 아래 정보를 알려주시면 더 정확한 견적을 제공해드릴 수 있습니다:\n\n• 인쇄물 종류 및 크기\n• 유광/무광 선택\n• 수량\n• 납기일\n\n자유롭게 질문해주세요! 💬'
  },
  'quote-foil': {
    text: '박 코팅 견적 문의입니다. 아래 정보를 알려주시면 더 정확한 견적을 제공해드릴 수 있습니다:\n\n• 인쇄물 종류 및 크기\n• 박 종류 (금박/은박/홀로그램)\n• 수량\n• 납기일\n\n자유롭게 질문해주세요! 💬'
  },
  'quote-embossing': {
    text: '형압 가공 견적 문의입니다. 아래 정보를 알려주시면 더 정확한 견적을 제공해드릴 수 있습니다:\n\n• 인쇄물 종류 및 크기\n• 형압 종류 (양각/음각)\n• 수량\n• 납기일\n\n자유롭게 질문해주세요! 💬'
  },
  'quote-custom': {
    text: '코팅 견적에 대해 자유롭게 질문해주세요! 인쇄물 종류, 수량, 납기일 등 필요한 정보를 알려주시면 정확한 견적을 도와드리겠습니다. 💬'
  },
  process: {
    text: '작업 프로세스는 4단계로 진행됩니다:\n\n1️⃣ 상담 - 요구사항 확인\n2️⃣ 견적 - 비용 산정\n3️⃣ 작업 - 코팅 진행\n4️⃣ 납품 - 완제품 전달\n\n일반적으로 2-3일 소요되며, 급한 경우 당일 작업도 가능합니다.'
  },
  file: {
    text: '파일 제출 방법 안내:\n\n📄 파일 형식: PDF, AI, EPS\n📐 해상도: 300DPI 이상\n🎨 컬러 모드: CMYK\n📍 코팅 영역: 별도 레이어로 표시\n\n파일은 이메일 또는 온라인 문의 폼으로 제출 가능합니다.'
  },
  delivery: {
    text: '작업 소요시간 안내:\n\n⏱️ 일반 작업: 2-3일\n⚡ 긴급 작업: 당일 가능 (추가 비용 발생)\n📦 택배 발송: 1일 추가\n\n정확한 납기일은 작업량과 난이도에 따라 달라질 수 있으니, 상세한 문의 부탁드립니다.'
  },
  contact: {
    text: '연락처 정보:\n\n📞 전화: 02-1234-5678\n📧 이메일: info@jeongwoo.co.kr\n📍 주소: 서울시 XX구 XX동\n⏰ 영업시간: 평일 09:00 - 18:00\n\n온라인 문의 폼: /contact\n무료 상담 서비스 제공 중입니다! 😊'
  },
  agent: {
    text: '상담원 연결 안내:\n\n상담원과 직접 대화하시려면:\n📞 전화: 02-1234-5678\n📧 이메일: info@jeongwoo.co.kr\n🌐 온라인 문의: /contact\n\n전화 상담은 평일 09:00-18:00 가능합니다.\n이메일 문의는 24시간 접수 가능하며, 24시간 이내 답변드립니다.'
  },
  uv: {
    text: '✨ UV 코팅 서비스 안내:\n\n자외선(UV)으로 경화시키는 코팅 방식으로:\n• 빠른 건조 시간\n• 뛰어난 광택감\n• 우수한 내구성\n• 명함, 카탈로그, 포스터 등에 적용\n\n더 자세한 정보는 /services 페이지에서 확인하실 수 있습니다.'
  },
  laminating: {
    text: '📄 라미네이팅 서비스 안내:\n\n필름을 인쇄물 표면에 부착하여 보호:\n• 유광/무광 라미네이팅\n• 방수 및 오염 방지\n• 책 표지, 메뉴판, 카드 등에 최적\n\n더 자세한 정보는 /services 페이지에서 확인하실 수 있습니다.'
  },
  foil: {
    text: '🌟 박 코팅 서비스 안내:\n\n금속 박막을 인쇄물에 전사:\n• 금박, 은박, 홀로그램 박\n• 화려하고 고급스러운 효과\n• 명함, 초대장, 패키지 등에 활용\n\n더 자세한 정보는 /services 페이지에서 확인하실 수 있습니다.'
  },
  embossing: {
    text: '🎨 형압 가공 서비스 안내:\n\n압력을 가하여 입체적 효과:\n• 양각 (돌출)\n• 음각 (들어감)\n• 독특한 촉감과 시각적 효과\n• 명함, 초대장, 고급 인쇄물에 적용\n\n더 자세한 정보는 /services 페이지에서 확인하실 수 있습니다.'
  },
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! 정우특수코팅 챗봇입니다. 😊\n궁금한 것이 있으시면 아래 버튼을 클릭해주세요!',
      isUser: false,
      timestamp: new Date(),
      buttons: questionCategories.main
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    
    // 먼저 카테고리별 다음 단계 버튼이 있는지 확인
    if (answerKey && questionCategories[answerKey as keyof typeof questionCategories]) {
      const answer = answers[answerKey];
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: answer ? answer.text : `${buttonLabel}에 대한 정보입니다.`,
          isUser: false,
          timestamp: new Date(),
          buttons: questionCategories[answerKey as keyof typeof questionCategories]
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 500);
      return;
    }

    // 즉시 답변이 있는 경우
    const answer = answers[answerKey];
    
    if (answer) {
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: answer.text,
          isUser: false,
          timestamp: new Date(),
          buttons: answer.nextButtons ? questionCategories[answer.nextButtons as keyof typeof questionCategories] : questionCategories.main
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 500);
      return;
    }

    // AI 응답이 필요한 경우
    try {
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
        buttons: [{ id: 'agent', label: '👤 상담원 연결', action: 'agent' }]
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
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
        buttons: [{ id: 'agent', label: '👤 상담원 연결', action: 'agent' }]
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
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
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
                  
                  {/* 피드백 버튼 (봇 메시지에만 표시) */}
                  {!message.isUser && !message.feedbackSubmitted && (
                    <div className={styles.feedbackSection}>
                      <span className={styles.feedbackLabel}>이 답변이 도움이 되었나요?</span>
                      <div className={styles.feedbackButtons}>
                        <button
                          className={`${styles.feedbackBtn} ${styles.helpful}`}
                          onClick={() => handleFeedback(message.id, 'helpful')}
                          disabled={feedbackSubmitting === message.id}
                        >
                          👍 도움됨
                        </button>
                        <button
                          className={`${styles.feedbackBtn} ${styles.neutral}`}
                          onClick={() => handleFeedback(message.id, 'neutral')}
                          disabled={feedbackSubmitting === message.id}
                        >
                          😐 보통
                        </button>
                        <button
                          className={`${styles.feedbackBtn} ${styles.notHelpful}`}
                          onClick={() => handleFeedback(message.id, 'not_helpful')}
                          disabled={feedbackSubmitting === message.id}
                        >
                          👎 도움안됨
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* 피드백 제출 완료 표시 */}
                  {!message.isUser && message.feedbackSubmitted && (
                    <div className={styles.feedbackSubmitted}>
                      <span>피드백을 주셔서 감사합니다! 🙏</span>
                    </div>
                  )}
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

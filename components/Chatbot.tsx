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
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! 정우특수코팅 챗봇입니다. 궁금한 것이 있으시면 언제든 물어보세요! 😊',
      isUser: false,
      timestamp: new Date()
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
      // 세션 토큰 생성 (간단한 구현)
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const response = await fetch('/api/chatbot/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          sessionToken: sessionToken
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          isUser: false,
          timestamp: new Date(),
          aiGenerated: data.aiUsed || false
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || '응답을 받을 수 없습니다.');
      }
    } catch (error) {
      console.error('챗봇 API 오류:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        isUser: false,
        timestamp: new Date()
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
                    {message.text}
                    {message.aiGenerated && (
                      <span className={styles.aiIndicator}>🤖 AI</span>
                    )}
                  </div>
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

'use client';

import { useState, useEffect } from 'react';
import styles from './chatbot-analytics.module.css';

interface AnalyticsData {
  period: {
    start: string;
    end: string;
    days: number;
  };
  basic: {
    totalSessions: number;
    totalMessages: number;
    userMessages: number;
    botMessages: number;
    aiMessages: number;
    satisfactionRate: number;
    totalFeedbacks: number;
    helpfulCount: number;
    notHelpfulCount: number;
    neutralCount: number;
    totalCost: number;
  };
  advanced: {
    popularKeywords: Array<{keyword: string, count: number}>;
    hourlyPattern: Array<{hour: number, count: number}>;
    topKnowledgeItems: Array<{title: string, usage_count: number, success_rate: number}>;
  };
}

export default function ChatbotAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/chatbot/analytics?period=${period}&company=jeongwoo`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('분석 데이터 가져오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>분석 데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🤖 챗봇 분석 대시보드</h1>
        <div className={styles.periodSelector}>
          <label>기간:</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="1">1일</option>
            <option value="7">7일</option>
            <option value="30">30일</option>
            <option value="90">90일</option>
          </select>
        </div>
      </div>

      <div className={styles.periodInfo}>
        📅 분석 기간: {data.period.start} ~ {data.period.end} ({data.period.days}일간)
      </div>

      {/* 기본 통계 카드 */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statValue}>{data.basic.totalSessions}</div>
          <div className={styles.statLabel}>총 세션</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💬</div>
          <div className={styles.statValue}>{data.basic.totalMessages}</div>
          <div className={styles.statLabel}>총 메시지</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🤖</div>
          <div className={styles.statValue}>{data.basic.aiMessages}</div>
          <div className={styles.statLabel}>AI 응답</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>😊</div>
          <div className={styles.statValue}>{data.basic.satisfactionRate}%</div>
          <div className={styles.statLabel}>만족도</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statValue}>${data.basic.totalCost}</div>
          <div className={styles.statLabel}>총 비용</div>
        </div>
      </div>

      {/* 피드백 분석 */}
      <div className={styles.section}>
        <h2>📊 피드백 분석</h2>
        <div className={styles.feedbackGrid}>
          <div className={styles.feedbackCard}>
            <div className={styles.feedbackIcon}>👍</div>
            <div className={styles.feedbackCount}>{data.basic.helpfulCount}</div>
            <div className={styles.feedbackLabel}>도움됨</div>
          </div>
          
          <div className={styles.feedbackCard}>
            <div className={styles.feedbackIcon}>😐</div>
            <div className={styles.feedbackCount}>{data.basic.neutralCount}</div>
            <div className={styles.feedbackLabel}>보통</div>
          </div>
          
          <div className={styles.feedbackCard}>
            <div className={styles.feedbackIcon}>👎</div>
            <div className={styles.feedbackCount}>{data.basic.notHelpfulCount}</div>
            <div className={styles.feedbackLabel}>도움안됨</div>
          </div>
        </div>
      </div>

      {/* 인기 키워드 */}
      <div className={styles.section}>
        <h2>🔥 인기 키워드</h2>
        <div className={styles.keywordsList}>
          {data.advanced.popularKeywords.map((item, index) => (
            <div key={index} className={styles.keywordItem}>
              <span className={styles.keywordRank}>#{index + 1}</span>
              <span className={styles.keywordText}>{item.keyword}</span>
              <span className={styles.keywordCount}>{item.count}회</span>
            </div>
          ))}
        </div>
      </div>

      {/* 시간대별 패턴 */}
      <div className={styles.section}>
        <h2>⏰ 시간대별 사용 패턴</h2>
        <div className={styles.hourlyChart}>
          {data.advanced.hourlyPattern.map((item) => (
            <div key={item.hour} className={styles.hourBar}>
              <div 
                className={styles.hourBarFill}
                style={{ height: `${(item.count / Math.max(...data.advanced.hourlyPattern.map(h => h.count))) * 100}%` }}
              />
              <span className={styles.hourLabel}>{item.hour}시</span>
            </div>
          ))}
        </div>
      </div>

      {/* 인기 지식베이스 */}
      <div className={styles.section}>
        <h2>📚 인기 지식베이스</h2>
        <div className={styles.knowledgeList}>
          {data.advanced.topKnowledgeItems.map((item, index) => (
            <div key={index} className={styles.knowledgeItem}>
              <div className={styles.knowledgeTitle}>{item.title}</div>
              <div className={styles.knowledgeStats}>
                <span>사용: {item.usage_count}회</span>
                <span>성공률: {item.success_rate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

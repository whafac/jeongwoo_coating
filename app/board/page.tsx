'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './board.module.css';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  user_name: string;
  created_at: string;
}


export default function Board() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inquiry' | 'review'>('inquiry');

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?company=jeongwoo&category=${activeTab}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className="container">
          <h1>문의 게시판</h1>
          <p>정우특수코팅에 문의하거나 작업 후기를 남겨보세요</p>
        </div>
      </section>

      {/* Board Content */}
      <section className="section">
        <div className="container">
          {/* Tab Navigation */}
          <div className={styles.tabNav}>
            <button 
              className={`${styles.tab} ${activeTab === 'inquiry' ? styles.active : ''}`}
              onClick={() => setActiveTab('inquiry')}
            >
              문의 게시판
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'review' ? styles.active : ''}`}
              onClick={() => setActiveTab('review')}
            >
              후기 게시판
            </button>
          </div>

          {/* Post List */}
          <div className={styles.postList}>
            {loading ? (
              <div className={styles.loading}>게시글을 불러오는 중...</div>
            ) : posts.length === 0 ? (
              <div className={styles.empty}>
                <p>아직 등록된 {activeTab === 'inquiry' ? '문의' : '후기'}가 없습니다.</p>
                <p>첫 번째 {activeTab === 'inquiry' ? '문의' : '후기'}를 작성해보세요!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="card">
                  <div className={styles.postHeader}>
                    <h3>{post.title}</h3>
                    <span className={styles.date}>{formatDate(post.created_at)}</span>
                  </div>
                  <div className={styles.postContent}>
                    <p>{post.content}</p>
                  </div>
                  <div className={styles.postFooter}>
                    <span className={styles.author}>작성자: {post.user_name}</span>
                    <Link href={`/board/${post.id}`} className="btn btn-secondary">
                      자세히 보기
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Write Button */}
          <div className={styles.writeButton}>
            <Link 
              href={`/board/write?category=${activeTab}`} 
              className="btn"
              style={{fontSize: '1.1rem', padding: '15px 30px'}}
            >
              {activeTab === 'inquiry' ? '문의 작성하기' : '후기 작성하기'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

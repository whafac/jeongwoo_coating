'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  created_at: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/posts?company=jeongwoo&status=${activeTab}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePostStatus = async (postId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, status }),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ ' + result.message);
        fetchPosts(); // 목록 새로고침
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setMessage('❌ 오류가 발생했습니다.');
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      const response = await fetch(`/api/admin/posts?id=${postId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ ' + result.message);
        fetchPosts(); // 목록 새로고침
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setMessage('❌ 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '대기';
      case 'approved': return '승인';
      case 'rejected': return '거부';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'inquiry': return '문의';
      case 'review': return '후기';
      case 'notice': return '공지';
      default: return category;
    }
  };

  return (
    <>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className="container">
          <h1>관리자 페이지</h1>
          <p>정우특수코팅 게시판 관리</p>
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

      {/* Admin Content */}
      <section className="section">
        <div className="container">
          {/* Tab Navigation */}
          <div className={styles.tabNav}>
            <button 
              className={`${styles.tab} ${activeTab === 'pending' ? styles.active : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              승인 대기 ({posts.filter(p => p.status === 'pending').length})
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'approved' ? styles.active : ''}`}
              onClick={() => setActiveTab('approved')}
            >
              승인됨
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'rejected' ? styles.active : ''}`}
              onClick={() => setActiveTab('rejected')}
            >
              거부됨
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
              onClick={() => setActiveTab('all')}
            >
              전체
            </button>
          </div>

          {/* Post List */}
          <div className={styles.postList}>
            {loading ? (
              <div className={styles.loading}>게시글을 불러오는 중...</div>
            ) : posts.length === 0 ? (
              <div className={styles.empty}>
                <p>해당 상태의 게시글이 없습니다.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="card">
                  <div className={styles.postHeader}>
                    <div className={styles.postMeta}>
                      <span className={`${styles.status} ${styles[getStatusColor(post.status)]}`}>
                        {getStatusLabel(post.status)}
                      </span>
                      <span className={styles.category}>{getCategoryLabel(post.category)}</span>
                      <span className={styles.date}>{formatDate(post.created_at)}</span>
                    </div>
                    <div className={styles.postActions}>
                      {post.status === 'pending' && (
                        <>
                          <button 
                            className={`${styles.actionBtn} ${styles.approve}`}
                            onClick={() => updatePostStatus(post.id, 'approved')}
                          >
                            승인
                          </button>
                          <button 
                            className={`${styles.actionBtn} ${styles.reject}`}
                            onClick={() => updatePostStatus(post.id, 'rejected')}
                          >
                            거부
                          </button>
                        </>
                      )}
                      <button 
                        className={`${styles.actionBtn} ${styles.delete}`}
                        onClick={() => deletePost(post.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.postTitle}>
                    <h3>{post.title}</h3>
                  </div>
                  
                  <div className={styles.postContent}>
                    <p>{post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}</p>
                  </div>
                  
                  <div className={styles.postFooter}>
                    <div className={styles.userInfo}>
                      <span><strong>작성자:</strong> {post.user_name}</span>
                      <span><strong>이메일:</strong> {post.user_email}</span>
                      {post.user_phone && <span><strong>연락처:</strong> {post.user_phone}</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

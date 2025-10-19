'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './board.module.css';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  user_name: string;
  created_at: string;
}

interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  author_type: 'admin' | 'customer';
  author_name: string;
  author_email?: string;
  content: string;
  created_at: string;
  replies: Comment[];
}


export default function Board() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inquiry' | 'review'>('inquiry');
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({});
  const [showReplyForm, setShowReplyForm] = useState<Record<string, boolean>>({});

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

  const fetchComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      const data = await response.json();
      setPostComments(prev => ({
        ...prev,
        [postId]: data
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const togglePostExpansion = async (postId: string) => {
    // 아코디언 방식: 한 번에 하나만 열기
    if (expandedPosts.has(postId)) {
      // 이미 열려있는 경우 닫기
      setExpandedPosts(new Set());
    } else {
      // 다른 드롭이 열려있는 경우 순차적으로 처리
      if (expandedPosts.size > 0) {
        // 1단계: 먼저 기존 드롭 닫기 (빠르게)
        setExpandedPosts(new Set());
        
        // 2단계: 닫힘 애니메이션 완료 후 새 드롭 열기
        setTimeout(async () => {
          setExpandedPosts(new Set([postId]));
          await fetchComments(postId);
          
          // 3단계: 새로 열린 드롭 위치로 부드럽게 스크롤
          setTimeout(() => {
            const element = document.getElementById(`post-${postId}`);
            if (element) {
              const elementTop = element.offsetTop;
              const offset = 20;
              
              window.scrollTo({
                top: elementTop - offset,
                behavior: 'smooth'
              });
            }
          }, 100);
        }, 500); // 닫힘 애니메이션 시간 (500ms)
      } else {
        // 기존 드롭이 없는 경우 바로 열기
        setExpandedPosts(new Set([postId]));
        await fetchComments(postId);
        
        // 새로 열린 드롭 위치로 부드럽게 스크롤
        setTimeout(() => {
          const element = document.getElementById(`post-${postId}`);
          if (element) {
            const elementTop = element.offsetTop;
            const offset = 20;
            
            window.scrollTo({
              top: elementTop - offset,
              behavior: 'smooth'
            });
          }
        }, 150);
      }
    }
  };

  const toggleReplyForm = (postId: string) => {
    setShowReplyForm(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const submitReply = async (postId: string, content: string, userName: string, userEmail: string) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          authorType: 'customer',
          authorName: userName,
          authorEmail: userEmail,
          content
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create reply');
      }

      const result = await response.json();
      alert(result.message);
      await fetchComments(postId);
      setShowReplyForm(prev => ({ ...prev, [postId]: false }));
    } catch (error) {
      console.error('Error creating reply:', error);
      alert('답글 작성 중 오류가 발생했습니다.');
    }
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
              <div className={styles.compactBoard}>
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    id={`post-${post.id}`}
                    className={`${styles.compactPost} ${expandedPosts.has(post.id) ? styles.expanded : ''}`}
                  >
                    {/* 컴팩트한 게시글 헤더 */}
                    <div 
                      className={styles.postSummary}
                      onClick={() => togglePostExpansion(post.id)}
                    >
                      <div className={styles.postInfo}>
                        <span className={`${styles.status} ${styles[post.status]}`}>
                          {post.status === 'pending' ? '승인 대기' : '승인됨'}
                        </span>
                        <h3 className={styles.postTitle}>{post.title}</h3>
                      </div>
                      <div className={styles.postMeta}>
                        <span className={styles.author}>{post.user_name}</span>
                        <span className={styles.date}>{formatDate(post.created_at)}</span>
                        <span className={styles.expandIcon}>
                          {expandedPosts.has(post.id) ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                    
                    {/* 드롭다운 내용 영역 */}
                    {expandedPosts.has(post.id) && (
                      <div className={styles.expandedContent}>
                        <div className={styles.postContent}>
                          <h4>문의 내용:</h4>
                          <p>{post.content}</p>
                        </div>
                        
                        {/* 댓글/답글 영역 */}
                        <div className={styles.commentsSection}>
                          <div className={styles.commentsHeader}>
                            <h4>대화 내용</h4>
                            <button 
                              className={styles.replyBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleReplyForm(post.id);
                              }}
                            >
                              추가 문의하기
                            </button>
                          </div>
                          
                          {/* 댓글 목록 */}
                          {postComments[post.id] && postComments[post.id].length > 0 ? (
                            <div className={styles.commentsList}>
                              {postComments[post.id].map((comment) => (
                                <div key={comment.id} className={styles.commentItem}>
                                  <div className={styles.commentHeader}>
                                    <span className={`${styles.commentAuthor} ${styles[comment.author_type]}`}>
                                      {comment.author_type === 'admin' ? '👨‍💼 관리자' : '👤 고객'}
                                    </span>
                                    <span className={styles.commentDate}>{formatDate(comment.created_at)}</span>
                                  </div>
                                  <div className={styles.commentContent}>{comment.content}</div>
                                  
                                  {/* 대댓글 */}
                                  {comment.replies && comment.replies.length > 0 && (
                                    <div className={styles.repliesList}>
                                      {comment.replies.map((reply) => (
                                        <div key={reply.id} className={`${styles.commentItem} ${styles.replyItem}`}>
                                          <div className={styles.commentHeader}>
                                            <span className={`${styles.commentAuthor} ${styles[reply.author_type]}`}>
                                              {reply.author_type === 'admin' ? '👨‍💼 관리자' : '👤 고객'}
                                            </span>
                                            <span className={styles.commentDate}>{formatDate(reply.created_at)}</span>
                                          </div>
                                          <div className={styles.commentContent}>{reply.content}</div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className={styles.noComments}>아직 답변이 없습니다.</p>
                          )}
                          
                          {/* 추가 문의 폼 */}
                          {showReplyForm[post.id] && (
                            <div className={styles.replyForm}>
                              <h5>추가 문의 작성</h5>
                              <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target as HTMLFormElement);
                                const content = formData.get('content') as string;
                                const userName = formData.get('userName') as string;
                                const userEmail = formData.get('userEmail') as string;
                                if (content && userName && userEmail) {
                                  submitReply(post.id, content, userName, userEmail);
                                }
                              }}>
                                <input 
                                  type="text" 
                                  name="userName" 
                                  placeholder="이름" 
                                  required 
                                  className={styles.inputField}
                                />
                                <input 
                                  type="email" 
                                  name="userEmail" 
                                  placeholder="이메일" 
                                  required 
                                  className={styles.inputField}
                                />
                                <textarea 
                                  name="content" 
                                  placeholder="추가 문의 내용을 입력하세요..."
                                  required 
                                  className={styles.textareaField}
                                  rows={3}
                                />
                                <div className={styles.formActions}>
                                  <button type="submit" className={styles.submitBtn}>문의 등록</button>
                                  <button 
                                    type="button" 
                                    className={styles.cancelBtn}
                                    onClick={() => toggleReplyForm(post.id)}
                                  >
                                    취소
                                  </button>
                                </div>
                              </form>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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

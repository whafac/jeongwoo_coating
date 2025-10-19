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

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [message, setMessage] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);

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

  const fetchComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const openReplyModal = async (post: Post) => {
    setSelectedPost(post);
    await fetchComments(post.id);
    setShowReplyModal(true);
  };

  const closeReplyModal = () => {
    setShowReplyModal(false);
    setSelectedPost(null);
    setComments([]);
    setNewComment('');
  };

  const submitComment = async () => {
    if (!selectedPost || !newComment.trim()) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: selectedPost.id,
          authorType: 'admin',
          authorName: '관리자',
          content: newComment
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      const result = await response.json();
      setMessage('✅ ' + result.message);
      setTimeout(() => setMessage(''), 3000);
      setNewComment('');
      await fetchComments(selectedPost.id);
    } catch (error) {
      console.error('Error creating comment:', error);
      setMessage('❌ 답글 작성 중 오류가 발생했습니다.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setMessage('✅ 댓글이 삭제되었습니다.');
      setTimeout(() => setMessage(''), 3000);
      if (selectedPost) {
        await fetchComments(selectedPost.id);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setMessage('❌ 댓글 삭제 중 오류가 발생했습니다.');
      setTimeout(() => setMessage(''), 3000);
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
                        className={`${styles.actionBtn} ${styles.reply}`}
                        onClick={() => openReplyModal(post)}
                      >
                        답글
                      </button>
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
                    <div className={styles.replyStatus}>
                      <button 
                        className={styles.replyCountBtn}
                        onClick={() => openReplyModal(post)}
                      >
                        댓글 {comments.length}개
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Reply Modal */}
      {showReplyModal && selectedPost && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>답글 작성</h2>
              <button className={styles.closeBtn} onClick={closeReplyModal}>×</button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.postInfo}>
                <h3>{selectedPost.title}</h3>
                <p><strong>작성자:</strong> {selectedPost.user_name} ({selectedPost.user_email})</p>
                <p><strong>내용:</strong> {selectedPost.content}</p>
              </div>

              <div className={styles.existingReplies}>
                <h4>대화 내용</h4>
                {comments.length === 0 ? (
                  <p>아직 댓글이 없습니다.</p>
                ) : (
                  <div className={styles.commentsList}>
                    {comments.map((comment) => (
                      <div key={comment.id} className={styles.commentItem}>
                        <div className={styles.commentHeader}>
                          <span className={`${styles.commentAuthor} ${styles[comment.author_type]}`}>
                            {comment.author_type === 'admin' ? '👨‍💼 관리자' : '👤 고객'}
                          </span>
                          <span className={styles.commentDate}>{formatDate(comment.created_at)}</span>
                          <button 
                            className={styles.deleteReplyBtn}
                            onClick={() => deleteComment(comment.id)}
                          >
                            삭제
                          </button>
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
                                  <button 
                                    className={styles.deleteReplyBtn}
                                    onClick={() => deleteComment(reply.id)}
                                  >
                                    삭제
                                  </button>
                                </div>
                                <div className={styles.commentContent}>{reply.content}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.replyForm}>
                <h4>새 답글 작성</h4>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="답글을 입력하세요..."
                  className={styles.replyTextarea}
                  rows={4}
                />
                <div className={styles.replyActions}>
                  <button 
                    className={`${styles.actionBtn} ${styles.submit}`}
                    onClick={submitComment}
                    disabled={!newComment.trim()}
                  >
                    답글 작성
                  </button>
                  <button 
                    className={`${styles.actionBtn} ${styles.cancel}`}
                    onClick={closeReplyModal}
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

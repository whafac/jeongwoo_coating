'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './detail.module.css';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  created_at: string;
}

export default function PostDetail() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${params.id}`);
      
      if (!response.ok) {
        throw new Error('게시글을 찾을 수 없습니다.');
      }
      
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError(error instanceof Error ? error.message : '게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'inquiry':
        return '문의';
      case 'review':
        return '후기';
      case 'notice':
        return '공지';
      default:
        return category;
    }
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className={styles.loading}>
            <h2>게시글을 불러오는 중...</h2>
          </div>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="section">
        <div className="container">
          <div className={styles.error}>
            <h2>❌ {error || '게시글을 찾을 수 없습니다.'}</h2>
            <Link href="/board" className="btn">
              게시판으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/board">게시판</Link>
            <span> / </span>
            <span>{getCategoryLabel(post.category)}</span>
          </div>
          <h1>{post.title}</h1>
        </div>
      </section>

      {/* Post Content */}
      <section className="section">
        <div className="container">
          <div className="card">
            <div className={styles.postHeader}>
              <div className={styles.postMeta}>
                <span className={styles.category}>{getCategoryLabel(post.category)}</span>
                <span className={styles.date}>{formatDate(post.created_at)}</span>
              </div>
              <div className={styles.authorInfo}>
                <span className={styles.author}>작성자: {post.user_name}</span>
              </div>
            </div>
            
            <div className={styles.postContent}>
              <div className={styles.contentText}>
                {post.content.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
            
            <div className={styles.postFooter}>
              <Link href="/board" className="btn btn-secondary">
                목록으로
              </Link>
              <Link 
                href={`/board/write?category=${post.category}`} 
                className="btn"
              >
                {getCategoryLabel(post.category)} 작성하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

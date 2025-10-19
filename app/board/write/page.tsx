'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './write.module.css';

export default function WritePost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'inquiry';
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    userName: '',
    userEmail: '',
    userPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          category: category
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ ' + result.message);
        setFormData({
          title: '',
          content: '',
          userName: '',
          userEmail: '',
          userPhone: ''
        });
        // 3초 후 게시판으로 이동
        setTimeout(() => {
          router.push('/board');
        }, 3000);
      } else {
        setMessage('❌ 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className="container">
          <h1>{category === 'inquiry' ? '문의 작성' : '후기 작성'}</h1>
          <p>{category === 'inquiry' ? '궁금한 사항을 문의해주세요' : '작업 후기를 남겨주세요'}</p>
        </div>
      </section>

      {/* Success Message */}
      {message && (
        <section className="section" style={{padding: '2rem 0'}}>
          <div className="container">
            <div className={styles.successMessage}>
              {message}
            </div>
          </div>
        </section>
      )}

      {/* Write Form */}
      <section className="section">
        <div className="container">
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>제목 <span style={{color: 'red'}}>*</span></label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={category === 'inquiry' ? '문의 제목을 입력해주세요' : '후기 제목을 입력해주세요'}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>내용 <span style={{color: 'red'}}>*</span></label>
                <textarea 
                  name="content" 
                  required 
                  rows={8}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder={category === 'inquiry' ? '문의 내용을 자세히 입력해주세요' : '작업 후기를 자세히 작성해주세요'}
                />
              </div>

              <div className={styles.formGroup}>
                <label>이름 <span style={{color: 'red'}}>*</span></label>
                <input 
                  type="text" 
                  name="userName" 
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="성함을 입력해주세요"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>이메일 <span style={{color: 'red'}}>*</span></label>
                <input 
                  type="email" 
                  name="userEmail" 
                  required
                  value={formData.userEmail}
                  onChange={handleChange}
                  placeholder="이메일 주소를 입력해주세요"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>연락처</label>
                <input 
                  type="tel" 
                  name="userPhone"
                  value={formData.userPhone}
                  onChange={handleChange}
                  placeholder="연락처를 입력해주세요 (선택사항)"
                />
              </div>
              
              <div className={styles.formActions}>
                <Link href="/board" className="btn btn-secondary">
                  취소
                </Link>
                <button 
                  type="submit" 
                  className="btn" 
                  disabled={loading}
                  style={{fontSize: '1.1rem', padding: '15px 30px'}}
                >
                  {loading ? '등록 중...' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

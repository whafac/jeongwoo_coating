'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 이미 로그인되어 있으면 관리자 페이지로 리다이렉트
    const isAuthenticated = document.cookie.includes('admin_authenticated=true');
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 로그인 성공 - 쿠키에 인증 정보 저장
        document.cookie = 'admin_authenticated=true; path=/; max-age=86400'; // 24시간
        router.push('/admin');
      } else {
        setError(data.error || '비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginHeader}>
          <h1>관리자 로그인</h1>
          <p>정우특수코팅 관리자 페이지</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 비밀번호를 입력하세요"
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading || !password}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>관리자만 접근 가능한 페이지입니다.</p>
        </div>
      </div>
    </div>
  );
}


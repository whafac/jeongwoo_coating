'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 이미 로그인되어 있는지 확인
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth');
        const data = await response.json();
        if (data.authenticated) {
          router.push('/admin');
        }
      } catch (error) {
        console.error('인증 확인 오류:', error);
      }
    };
    checkAuth();
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
        credentials: 'include', // 쿠키 포함
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 로그인 성공 - 서버에서 쿠키가 설정되었으므로 강제 리다이렉트
        window.location.href = '/admin';
      } else {
        setError(data.error || '비밀번호가 올바르지 않습니다.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      setError('로그인 중 오류가 발생했습니다.');
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
            <div className={styles.passwordInputContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="관리자 비밀번호를 입력하세요"
                required
                autoFocus
                disabled={isLoading}
                className={styles.passwordInput}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
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


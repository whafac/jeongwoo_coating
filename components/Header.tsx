'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>✨</span>
              <span>정우특수코팅</span>
            </Link>
            <ul className={styles.navLinks}>
              <li><Link href="/">홈</Link></li>
              <li><Link href="/services">코팅서비스</Link></li>
              <li><Link href="/process">작업프로세스</Link></li>
              <li><Link href="/portfolio">작업사례</Link></li>
              <li><Link href="/about">회사소개</Link></li>
              <li><Link href="/board">게시판</Link></li>
              <li><Link href="/chatbot-analytics">챗봇분석</Link></li>
              <li><Link href="/contact">문의하기</Link></li>
            </ul>
            <div className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`} onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </nav>
        </div>
      </header>

      <div className={`${styles.overlay} ${isMenuOpen ? styles.active : ''}`} onClick={closeMenu}></div>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ''}`}>
        <div className={styles.mobileMenuHeader}>
          <button 
            className={styles.closeButton}
            onClick={closeMenu}
            aria-label="메뉴 닫기"
          >
            ✕
          </button>
        </div>
        <ul>
          <li><Link href="/" onClick={closeMenu}>홈</Link></li>
          <li><Link href="/services" onClick={closeMenu}>코팅서비스</Link></li>
          <li><Link href="/process" onClick={closeMenu}>작업프로세스</Link></li>
          <li><Link href="/portfolio" onClick={closeMenu}>작업사례</Link></li>
          <li><Link href="/about" onClick={closeMenu}>회사소개</Link></li>
          <li><Link href="/board" onClick={closeMenu}>게시판</Link></li>
          <li><Link href="/chatbot-analytics" onClick={closeMenu}>챗봇분석</Link></li>
          <li><Link href="/contact" onClick={closeMenu}>문의하기</Link></li>
        </ul>
      </div>
    </>
  );
}


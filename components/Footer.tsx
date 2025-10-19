import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerInfo}>
          <div>
            <h3>정우특수코팅</h3>
            <p>인쇄코팅 후가공 전문 업체</p>
            <p>고품질 코팅 서비스로 귀사의 인쇄물을<br />더욱 완벽하게 만들어드립니다.</p>
          </div>
          <div>
            <h3>서비스</h3>
            <p><Link href="/services">UV 코팅</Link></p>
            <p><Link href="/services">라미네이팅</Link></p>
            <p><Link href="/services">박 코팅</Link></p>
            <p><Link href="/services">형압 가공</Link></p>
          </div>
          <div>
            <h3>회사 정보</h3>
            <p><Link href="/about">회사소개</Link></p>
            <p><Link href="/portfolio">작업사례</Link></p>
            <p><Link href="/contact">문의하기</Link></p>
          </div>
          <div>
            <h3>연락처</h3>
            <p>📞 전화: 02-XXXX-XXXX</p>
            <p>📧 이메일: info@jeongwoo.co.kr</p>
            <p>📍 주소: 서울시 XX구 XX동</p>
            <p>⏰ 영업시간: 평일 09:00 - 18:00</p>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>&copy; 2025 정우특수코팅. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


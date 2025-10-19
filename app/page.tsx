import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1>정우특수코팅</h1>
          <p className={styles.subtitle}>인쇄코팅 후가공 전문 기업</p>
          <p className={styles.description}>
            완벽한 마감, 최고의 품질로<br />귀사의 인쇄물을 한 단계 업그레이드 합니다
          </p>
          <div className={styles.buttons}>
            <Link href="/services" className="btn" style={{background: 'var(--accent-color)'}}>
              서비스 보기
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              무료 상담
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>주요 코팅 서비스</h2>
            <p>다양한 인쇄물에 최적화된 코팅 솔루션을 제공합니다</p>
          </div>
          
          <div className={styles.servicesGrid}>
            <div className="card">
              <div className={styles.serviceIcon}>✨</div>
              <h3>UV 코팅</h3>
              <p>광택감과 내구성이 뛰어난 UV 코팅으로 인쇄물의 품질을 한층 높여드립니다.</p>
              <Link href="/services" className="btn">자세히 보기</Link>
            </div>
            
            <div className="card">
              <div className={styles.serviceIcon}>📄</div>
              <h3>라미네이팅</h3>
              <p>유광, 무광 라미네이팅으로 인쇄물을 보호하고 고급스러운 마감을 제공합니다.</p>
              <Link href="/services" className="btn">자세히 보기</Link>
            </div>
            
            <div className="card">
              <div className={styles.serviceIcon}>🌟</div>
              <h3>박 코팅</h3>
              <p>금박, 은박, 홀로그램 박 등으로 고급스럽고 화려한 연출이 가능합니다.</p>
              <Link href="/services" className="btn">자세히 보기</Link>
            </div>
            
            <div className="card">
              <div className={styles.serviceIcon}>🎨</div>
              <h3>형압 가공</h3>
              <p>양각, 음각 형압으로 입체적이고 독특한 디자인을 구현합니다.</p>
              <Link href="/services" className="btn">자세히 보기</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section" style={{background: 'var(--light-gray)'}}>
        <div className="container">
          <div className="section-header">
            <h2>정우특수코팅을 선택해야 하는 이유</h2>
            <p>20년 이상의 경험과 노하우로 최상의 결과를 보장합니다</p>
          </div>
          
          <div className={styles.featuresGrid}>
            <div className="card text-center">
              <div className={styles.featureEmoji}>🏆</div>
              <h3>최고 품질</h3>
              <p>최신 장비와 숙련된 기술력으로 최상의 품질을 보장합니다.</p>
            </div>
            
            <div className="card text-center">
              <div className={styles.featureEmoji}>⚡</div>
              <h3>신속한 납기</h3>
              <p>효율적인 작업 프로세스로 약속된 납기를 정확히 지킵니다.</p>
            </div>
            
            <div className="card text-center">
              <div className={styles.featureEmoji}>💰</div>
              <h3>합리적 가격</h3>
              <p>고품질 서비스를 경쟁력 있는 가격으로 제공합니다.</p>
            </div>
            
            <div className="card text-center">
              <div className={styles.featureEmoji}>🤝</div>
              <h3>맞춤 솔루션</h3>
              <p>고객의 요구사항에 맞는 최적의 코팅 솔루션을 제안합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Preview */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>간편한 작업 프로세스</h2>
            <p>상담부터 납품까지 체계적인 시스템으로 진행됩니다</p>
          </div>
          
          <div className={styles.processGrid}>
            <div className="text-center">
              <div className={styles.processNumber}>1</div>
              <h3>상담</h3>
              <p>요구사항 확인</p>
            </div>
            
            <div className="text-center">
              <div className={styles.processNumber}>2</div>
              <h3>견적</h3>
              <p>비용 산정</p>
            </div>
            
            <div className="text-center">
              <div className={styles.processNumber}>3</div>
              <h3>작업</h3>
              <p>코팅 진행</p>
            </div>
            
            <div className="text-center">
              <div className={styles.processNumber}>4</div>
              <h3>납품</h3>
              <p>완제품 전달</p>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <Link href="/process" className="btn">프로세스 자세히 보기</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section" style={{background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)', color: 'var(--white)'}}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div>
              <h3>20+</h3>
              <p>업계 경력 (년)</p>
            </div>
            <div>
              <h3>5,000+</h3>
              <p>완료 프로젝트</p>
            </div>
            <div>
              <h3>1,000+</h3>
              <p>거래 기업</p>
            </div>
            <div>
              <h3>98%</h3>
              <p>고객 만족도</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{background: 'var(--accent-color)', color: 'var(--white)', textAlign: 'center'}}>
        <div className="container">
          <h2 style={{fontSize: '2.5rem', marginBottom: '1.5rem'}}>
            지금 바로 무료 상담을 받아보세요
          </h2>
          <p style={{fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto'}}>
            전문가가 귀사의 프로젝트에 최적화된 코팅 솔루션을 제안해드립니다
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/contact" className="btn" style={{background: 'var(--white)', color: 'var(--accent-color)'}}>
              무료 상담 신청
            </Link>
            <Link href="/portfolio" className="btn" style={{background: 'var(--primary-dark)'}}>
              작업 사례 보기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

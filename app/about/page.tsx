import Link from 'next/link';
import styles from './about.module.css';

export const metadata = {
  title: '회사소개 - 정우특수코팅',
  description: '정우특수코팅은 20년 이상의 경험으로 최고의 인쇄코팅 후가공을 제공합니다',
};

export default function About() {
  return (
    <>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className="container">
          <h1>회사소개</h1>
          <p>정우특수코팅은 20년 이상의 경험으로 최고의 인쇄코팅 후가공을 제공합니다</p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="section">
        <div className="container">
          <div className={styles.companyIntro}>
            <div>
              <h2>정우특수코팅</h2>
              <p className={styles.introParagraph}>
                1999년 설립된 정우특수코팅은 인쇄코팅 후가공 분야의 선도 기업으로, 
                20년이 넘는 경험과 노하우를 바탕으로 고객에게 최상의 서비스를 제공하고 있습니다.
              </p>
              <p>
                최신 장비와 숙련된 기술진, 그리고 철저한 품질 관리 시스템을 통해 
                고객의 인쇄물에 완벽한 마감을 제공합니다.
              </p>
              <p>
                UV 코팅, 라미네이팅, 박 코팅, 형압 가공 등 다양한 후가공 서비스를 제공하며,
                고객의 요구사항에 맞는 최적의 솔루션을 제안합니다.
              </p>
            </div>
            <div className={styles.companyBox}>
              <div className={styles.companyBoxInner}>
                <div className={styles.companyEmoji}>✨</div>
                <h3>정우특수코팅</h3>
                <p>인쇄코팅 후가공 전문</p>
                <div className={styles.sinceYear}>Since 1999</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section" style={{background: 'var(--light-gray)'}}>
        <div className="container">
          <div className={styles.visionMissionGrid}>
            <div className="card" style={{borderLeft: '4px solid var(--accent-color)'}}>
              <h3>비전 (Vision)</h3>
              <p>
                대한민국 최고의 인쇄코팅 후가공 전문 기업으로 성장하여,
                고품질 서비스를 통해 고객의 가치를 극대화하고 
                업계의 표준을 선도하는 기업이 되겠습니다.
              </p>
            </div>
            <div className="card" style={{borderLeft: '4px solid var(--primary-color)'}}>
              <h3>미션 (Mission)</h3>
              <p>
                최첨단 기술과 오랜 경험을 바탕으로 고객에게 최상의 코팅 서비스를 제공하며,
                지속적인 혁신과 품질 향상을 통해 
                고객의 성공 파트너가 되겠습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>핵심 가치</h2>
            <p>정우특수코팅이 추구하는 4가지 핵심 가치</p>
          </div>
          
          <div className={styles.valuesGrid}>
            <div className="card text-center">
              <div className={styles.valueEmoji}>🏆</div>
              <h3>품질 최우선</h3>
              <p>최상의 품질을 제공하기 위해 모든 공정에서 철저한 품질 관리를 실시합니다.</p>
            </div>
            
            <div className="card text-center">
              <div className={styles.valueEmoji}>🤝</div>
              <h3>고객 만족</h3>
              <p>고객의 요구사항을 정확히 파악하고 최적의 솔루션을 제공하여 만족도를 높입니다.</p>
            </div>
            
            <div className="card text-center">
              <div className={styles.valueEmoji}>💡</div>
              <h3>지속적 혁신</h3>
              <p>최신 기술 도입과 지속적인 연구개발로 업계를 선도하는 기업이 되겠습니다.</p>
            </div>
            
            <div className="card text-center">
              <div className={styles.valueEmoji}>⚡</div>
              <h3>신속 정확</h3>
              <p>효율적인 작업 프로세스로 약속된 납기를 정확히 지키며 신속하게 대응합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info Table */}
      <section className="section" style={{background: 'var(--light-gray)'}}>
        <div className="container">
          <div className="section-header">
            <h2>회사 정보</h2>
            <p>정우특수코팅의 상세 정보</p>
          </div>
          
          <div className="card" style={{maxWidth: '800px', margin: '0 auto'}}>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>회사명</div>
              <div className={styles.infoValue}>정우특수코팅</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>설립일</div>
              <div className={styles.infoValue}>1999년</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>주요 사업</div>
              <div className={styles.infoValue}>인쇄코팅 후가공 (UV코팅, 라미네이팅, 박, 형압 등)</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>전화</div>
              <div className={styles.infoValue}>02-XXXX-XXXX</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>이메일</div>
              <div className={styles.infoValue}>info@jeongwoo.co.kr</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>주소</div>
              <div className={styles.infoValue}>서울시 XX구 XX동 XX번지</div>
            </div>
            <div className={styles.infoRow} style={{borderBottom: 'none'}}>
              <div className={styles.infoLabel}>영업시간</div>
              <div className={styles.infoValue}>평일 09:00 - 18:00 (주말 및 공휴일 휴무)</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{background: 'var(--accent-color)', color: 'var(--white)', textAlign: 'center'}}>
        <div className="container">
          <h2>정우특수코팅과 함께하세요</h2>
          <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>
            20년 경험의 전문가가 귀사의 성공 파트너가 되어드리겠습니다
          </p>
          <Link href="/contact" className="btn" style={{background: 'var(--white)', color: 'var(--accent-color)', fontSize: '1.1rem', padding: '15px 30px'}}>
            문의하기
          </Link>
        </div>
      </section>
    </>
  );
}


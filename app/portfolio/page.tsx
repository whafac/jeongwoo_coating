import Link from 'next/link';
import styles from './portfolio.module.css';

export const metadata = {
  title: '작업 사례 - 정우특수코팅',
  description: '정우특수코팅의 다양한 코팅 작업 사례를 확인하세요',
};

export default function Portfolio() {
  const portfolioItems = [
    { title: '명함 UV 코팅', category: 'UV 코팅', description: '고급 명함에 UV 코팅을 적용하여 광택감과 내구성을 향상시킨 사례', emoji: '✨', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { title: '카탈로그 무광 라미네이팅', category: '라미네이팅', description: '제품 카탈로그에 무광 라미네이팅을 적용한 세련된 마감 사례', emoji: '📄', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { title: '초대장 금박', category: '박 코팅', description: '고급스러운 초대장에 금박을 적용하여 특별함을 더한 사례', emoji: '🌟', gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' },
    { title: '명함 양각 형압', category: '형압', description: '입체적인 디자인을 위한 양각 형압 처리 사례', emoji: '🎨', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { title: '책 표지 유광 라미네이팅', category: '라미네이팅', description: '책 표지에 유광 라미네이팅을 적용하여 보호와 미를 동시에', emoji: '📚', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { title: '패키지 은박', category: '박 코팅', description: '제품 패키지에 은박을 적용한 모던하고 세련된 마감', emoji: '🎁', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
    { title: '포스터 부분 UV', category: 'UV 코팅', description: '포스터의 특정 부분에만 UV를 적용한 도무송 코팅 사례', emoji: '📋', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { title: '청첩장 음각 형압', category: '형압', description: '청첩장에 음각 형압을 적용하여 우아한 느낌을 연출', emoji: '💌', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
    { title: '명함 UV + 박', category: '복합 작업', description: 'UV 코팅과 금박을 함께 적용한 프리미엄 명함 사례', emoji: '📇', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  ];

  const categoryColors: Record<string, string> = {
    'UV 코팅': 'var(--accent-color)',
    '라미네이팅': 'var(--primary-color)',
    '박 코팅': '#FFD700',
    '형압': 'var(--primary-dark)',
    '복합 작업': 'var(--accent-light)',
  };

  return (
    <>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className="container">
          <h1>작업 사례</h1>
          <p>정우특수코팅의 다양한 코팅 작업 사례를 확인하세요</p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="section">
        <div className="container">
          <div className={styles.portfolioGrid}>
            {portfolioItems.map((item, index) => (
              <div key={index} className="card" style={{padding: 0, overflow: 'hidden'}}>
                <div style={{height: '250px', background: item.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem'}}>
                  {item.emoji}
                </div>
                <div style={{padding: '1.5rem'}}>
                  <div className={styles.categoryBadge} style={{background: categoryColors[item.category] || 'var(--primary-color)'}}>
                    {item.category}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{background: 'var(--light-gray)'}}>
        <div className="container">
          <div className="section-header">
            <h2>작업 실적</h2>
            <p>숫자로 보는 정우특수코팅의 경험과 전문성</p>
          </div>
          
          <div className={styles.statsGrid}>
            <div className="card text-center">
              <h3>5,000+</h3>
              <p>완료 프로젝트</p>
            </div>
            <div className="card text-center">
              <h3>1,000+</h3>
              <p>거래 기업</p>
            </div>
            <div className="card text-center">
              <h3>20+</h3>
              <p>업계 경력 (년)</p>
            </div>
            <div className="card text-center">
              <h3>98%</h3>
              <p>고객 만족도</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{background: 'var(--accent-color)', color: 'var(--white)', textAlign: 'center'}}>
        <div className="container">
          <h2>귀사의 프로젝트도 성공 사례로 만들어보세요</h2>
          <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>
            20년 경험의 전문가가 최상의 코팅 서비스를 제공합니다
          </p>
          <Link href="/contact" className="btn" style={{background: 'var(--white)', color: 'var(--accent-color)', fontSize: '1.1rem', padding: '15px 30px'}}>
            프로젝트 시작하기
          </Link>
        </div>
      </section>
    </>
  );
}


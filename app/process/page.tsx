import Link from 'next/link';
import styles from './process.module.css';


export default function Process() {
  return (
    <>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className="container">
          <h1>작업 프로세스</h1>
          <p>체계적이고 투명한 작업 과정으로 최상의 결과를 보장합니다</p>
        </div>
      </section>

      {/* Process Overview */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>간편한 4단계 프로세스</h2>
            <p>상담부터 납품까지 모든 과정을 투명하게 진행합니다</p>
          </div>
          
          <div className={styles.processGrid}>
            <div className="card text-center" style={{borderTop: '4px solid var(--accent-color)'}}>
              <div className={styles.stepNumber}>1</div>
              <h3>상담 및 접수</h3>
              <p>고객의 요구사항과 인쇄물 사양을 확인하고 최적의 코팅 방법을 제안합니다.</p>
              <div className={styles.stepDetails}>
                <p>📞 전화, 이메일, 방문 상담<br />📋 인쇄물 사양 확인<br />💡 코팅 방법 제안</p>
              </div>
            </div>
            
            <div className="card text-center" style={{borderTop: '4px solid var(--primary-color)'}}>
              <div className={styles.stepNumber} style={{background: 'var(--primary-color)'}}>2</div>
              <h3>견적 및 계약</h3>
              <p>정확한 견적을 산출하고 작업 일정과 납기를 협의합니다.</p>
              <div className={styles.stepDetails}>
                <p>💰 정확한 견적 산출<br />📅 작업 일정 협의<br />✍️ 계약 체결</p>
              </div>
            </div>
            
            <div className="card text-center" style={{borderTop: '4px solid var(--accent-light)'}}>
              <div className={styles.stepNumber} style={{background: 'var(--accent-light)'}}>3</div>
              <h3>작업 진행</h3>
              <p>최신 장비와 숙련된 기술력으로 완벽한 코팅 작업을 진행합니다.</p>
              <div className={styles.stepDetails}>
                <p>🔧 전문 장비 작업<br />👨‍🔬 품질 관리<br />📊 진행 상황 공유</p>
              </div>
            </div>
            
            <div className="card text-center" style={{borderTop: '4px solid var(--primary-dark)'}}>
              <div className={styles.stepNumber} style={{background: 'var(--primary-dark)'}}>4</div>
              <h3>검수 및 납품</h3>
              <p>최종 품질 검수 후 약속된 일정에 맞춰 안전하게 납품합니다.</p>
              <div className={styles.stepDetails}>
                <p>✅ 최종 품질 검수<br />📦 안전한 포장<br />🚚 정시 납품</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Control */}
      <section className="section" style={{background: 'var(--light-gray)'}}>
        <div className="container">
          <div className="section-header">
            <h2>품질 관리 시스템</h2>
            <p>완벽한 품질을 위한 철저한 관리 체계</p>
          </div>
          
          <div className={styles.qualityGrid}>
            <div className="card text-center">
              <div className={styles.qualityEmoji}>🔍</div>
              <h3>사전 검수</h3>
              <p>작업 전 인쇄물 상태를 꼼꼼히 확인하여 최상의 결과를 준비합니다.</p>
            </div>
            
            <div className="card text-center">
              <div className={styles.qualityEmoji}>⚙️</div>
              <h3>공정 관리</h3>
              <p>작업 중 실시간으로 품질을 모니터링하고 즉시 조치합니다.</p>
            </div>
            
            <div className="card text-center">
              <div className={styles.qualityEmoji}>✅</div>
              <h3>최종 검수</h3>
              <p>완성된 제품의 품질을 다시 한번 철저히 검사합니다.</p>
            </div>
            
            <div className="card text-center">
              <div className={styles.qualityEmoji}>📋</div>
              <h3>문서화</h3>
              <p>모든 작업 과정을 기록하여 일관된 품질을 유지합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{background: 'var(--accent-color)', color: 'var(--white)', textAlign: 'center'}}>
        <div className="container">
          <h2>프로젝트를 시작할 준비가 되셨나요?</h2>
          <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>
            체계적인 프로세스로 완벽한 결과물을 제공해드리겠습니다
          </p>
          <Link href="/contact" className="btn" style={{background: 'var(--white)', color: 'var(--accent-color)', fontSize: '1.1rem', padding: '15px 30px'}}>
            지금 문의하기
          </Link>
        </div>
      </section>
    </>
  );
}


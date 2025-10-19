<?= $this->extend('layouts/main') ?>

<?= $this->section('content') ?>

<!-- Hero Section -->
<section class="hero" style="background: linear-gradient(135deg, rgba(44, 95, 141, 0.95) 0%, rgba(26, 58, 92, 0.95) 100%), url('https://images.unsplash.com/photo-1528158222524-d4d912d2e208?w=1600') center/cover; color: var(--white); padding: 8rem 0 6rem; text-align: center;">
    <div class="container">
        <h1 style="font-size: 3.5rem; margin-bottom: 1.5rem; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
            정우특수코팅
        </h1>
        <p style="font-size: 1.5rem; margin-bottom: 1rem; max-width: 700px; margin-left: auto; margin-right: auto; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
            인쇄코팅 후가공 전문 기업
        </p>
        <p style="font-size: 1.2rem; margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto; opacity: 0.95;">
            완벽한 마감, 최고의 품질로<br>귀사의 인쇄물을 한 단계 업그레이드 합니다
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="/services" class="btn" style="background: var(--accent-color); font-size: 1.1rem; padding: 15px 30px;">서비스 보기</a>
            <a href="/contact" class="btn btn-secondary" style="font-size: 1.1rem; padding: 15px 30px;">무료 상담</a>
        </div>
    </div>
</section>

<!-- Services Section -->
<section class="section">
    <div class="container">
        <div class="section-header">
            <h2>주요 코팅 서비스</h2>
            <p>다양한 인쇄물에 최적화된 코팅 솔루션을 제공합니다</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
            <div class="card">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2.5rem;">✨</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem; text-align: center;">UV 코팅</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; text-align: center; line-height: 1.8;">
                    광택감과 내구성이 뛰어난 UV 코팅으로 인쇄물의 품질을 한층 높여드립니다.
                </p>
                <a href="/services" class="btn" style="width: 100%; text-align: center;">자세히 보기</a>
            </div>
            
            <div class="card">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2.5rem;">📄</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem; text-align: center;">라미네이팅</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; text-align: center; line-height: 1.8;">
                    유광, 무광 라미네이팅으로 인쇄물을 보호하고 고급스러운 마감을 제공합니다.
                </p>
                <a href="/services" class="btn" style="width: 100%; text-align: center;">자세히 보기</a>
            </div>
            
            <div class="card">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2.5rem;">🌟</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem; text-align: center;">박 코팅</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; text-align: center; line-height: 1.8;">
                    금박, 은박, 홀로그램 박 등으로 고급스럽고 화려한 연출이 가능합니다.
                </p>
                <a href="/services" class="btn" style="width: 100%; text-align: center;">자세히 보기</a>
            </div>
            
            <div class="card">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2.5rem;">🎨</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem; text-align: center;">형압 가공</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; text-align: center; line-height: 1.8;">
                    양각, 음각 형압으로 입체적이고 독특한 디자인을 구현합니다.
                </p>
                <a href="/services" class="btn" style="width: 100%; text-align: center;">자세히 보기</a>
            </div>
        </div>
    </div>
</section>

<!-- Why Choose Us Section -->
<section class="section" style="background: var(--light-gray);">
    <div class="container">
        <div class="section-header">
            <h2>정우특수코팅을 선택해야 하는 이유</h2>
            <p>20년 이상의 경험과 노하우로 최상의 결과를 보장합니다</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
            <div class="card text-center">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">🏆</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">최고 품질</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    최신 장비와 숙련된 기술력으로 최상의 품질을 보장합니다.
                </p>
            </div>
            
            <div class="card text-center">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">⚡</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">신속한 납기</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    효율적인 작업 프로세스로 약속된 납기를 정확히 지킵니다.
                </p>
            </div>
            
            <div class="card text-center">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">💰</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">합리적 가격</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    고품질 서비스를 경쟁력 있는 가격으로 제공합니다.
                </p>
            </div>
            
            <div class="card text-center">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">🤝</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">맞춤 솔루션</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    고객의 요구사항에 맞는 최적의 코팅 솔루션을 제안합니다.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Process Preview -->
<section class="section">
    <div class="container">
        <div class="section-header">
            <h2>간편한 작업 프로세스</h2>
            <p>상담부터 납품까지 체계적인 시스템으로 진행됩니다</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; max-width: 900px; margin: 0 auto;">
            <div class="text-center">
                <div style="width: 70px; height: 70px; background: var(--accent-color); color: var(--white); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: bold; margin: 0 auto 1rem;">1</div>
                <h3 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 1.2rem;">상담</h3>
                <p style="color: var(--text-secondary); font-size: 0.95rem;">요구사항 확인</p>
            </div>
            
            <div class="text-center">
                <div style="width: 70px; height: 70px; background: var(--accent-color); color: var(--white); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: bold; margin: 0 auto 1rem;">2</div>
                <h3 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 1.2rem;">견적</h3>
                <p style="color: var(--text-secondary); font-size: 0.95rem;">비용 산정</p>
            </div>
            
            <div class="text-center">
                <div style="width: 70px; height: 70px; background: var(--accent-color); color: var(--white); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: bold; margin: 0 auto 1rem;">3</div>
                <h3 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 1.2rem;">작업</h3>
                <p style="color: var(--text-secondary); font-size: 0.95rem;">코팅 진행</p>
            </div>
            
            <div class="text-center">
                <div style="width: 70px; height: 70px; background: var(--accent-color); color: var(--white); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: bold; margin: 0 auto 1rem;">4</div>
                <h3 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 1.2rem;">납품</h3>
                <p style="color: var(--text-secondary); font-size: 0.95rem;">완제품 전달</p>
            </div>
        </div>
        
        <div class="text-center mt-4">
            <a href="/process" class="btn">프로세스 자세히 보기</a>
        </div>
    </div>
</section>

<!-- Stats Section -->
<section class="section" style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%); color: var(--white);">
    <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: center;">
            <div>
                <h3 style="font-size: 3.5rem; margin-bottom: 0.5rem; color: var(--accent-color); font-weight: bold;">20+</h3>
                <p style="font-size: 1.2rem; opacity: 0.95;">업계 경력 (년)</p>
            </div>
            <div>
                <h3 style="font-size: 3.5rem; margin-bottom: 0.5rem; color: var(--accent-color); font-weight: bold;">5,000+</h3>
                <p style="font-size: 1.2rem; opacity: 0.95;">완료 프로젝트</p>
            </div>
            <div>
                <h3 style="font-size: 3.5rem; margin-bottom: 0.5rem; color: var(--accent-color); font-weight: bold;">1,000+</h3>
                <p style="font-size: 1.2rem; opacity: 0.95;">거래 기업</p>
            </div>
            <div>
                <h3 style="font-size: 3.5rem; margin-bottom: 0.5rem; color: var(--accent-color); font-weight: bold;">98%</h3>
                <p style="font-size: 1.2rem; opacity: 0.95;">고객 만족도</p>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="section" style="background: var(--accent-color); color: var(--white); text-align: center;">
    <div class="container">
        <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">
            지금 바로 무료 상담을 받아보세요
        </h2>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto; opacity: 0.95;">
            전문가가 귀사의 프로젝트에 최적화된 코팅 솔루션을 제안해드립니다
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="/contact" class="btn" style="background: var(--white); color: var(--accent-color); font-size: 1.1rem; padding: 15px 30px;">무료 상담 신청</a>
            <a href="/portfolio" class="btn" style="background: var(--primary-dark); font-size: 1.1rem; padding: 15px 30px;">작업 사례 보기</a>
        </div>
    </div>
</section>

<?= $this->endSection() ?>


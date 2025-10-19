<?= $this->extend('layouts/main') ?>

<?= $this->section('content') ?>

<!-- Page Header -->
<section style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%); color: var(--white); padding: 5rem 0 4rem; text-align: center;">
    <div class="container">
        <h1 style="font-size: 3rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">회사소개</h1>
        <p style="font-size: 1.2rem; max-width: 600px; margin: 0 auto; opacity: 0.95;">
            정우특수코팅은 20년 이상의 경험으로 최고의 인쇄코팅 후가공을 제공합니다
        </p>
    </div>
</section>

<!-- Company Introduction -->
<section class="section">
    <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
            <div>
                <h2 style="color: var(--primary-color); font-size: 2.5rem; margin-bottom: 1.5rem;">정우특수코팅</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.8; font-size: 1.1rem;">
                    1999년 설립된 정우특수코팅은 인쇄코팅 후가공 분야의 선도 기업으로, 
                    20년이 넘는 경험과 노하우를 바탕으로 고객에게 최상의 서비스를 제공하고 있습니다.
                </p>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.8;">
                    최신 장비와 숙련된 기술진, 그리고 철저한 품질 관리 시스템을 통해 
                    고객의 인쇄물에 완벽한 마감을 제공합니다.
                </p>
                <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.8;">
                    UV 코팅, 라미네이팅, 박 코팅, 형압 가공 등 다양한 후가공 서비스를 제공하며,
                    고객의 요구사항에 맞는 최적의 솔루션을 제안합니다.
                </p>
            </div>
            <div>
                <div style="background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); padding: 3rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <div style="background: var(--white); padding: 2rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 5rem; margin-bottom: 1rem;">✨</div>
                        <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.8rem;">정우특수코팅</h3>
                        <p style="color: var(--text-secondary); font-size: 1.1rem;">인쇄코팅 후가공 전문</p>
                        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                            <p style="color: var(--accent-color); font-weight: bold; font-size: 1.3rem;">Since 1999</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Vision & Mission -->
<section class="section" style="background: var(--light-gray);">
    <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">
            <div class="card" style="border-left: 4px solid var(--accent-color);">
                <h3 style="color: var(--primary-color); font-size: 2rem; margin-bottom: 1rem;">비전 (Vision)</h3>
                <p style="color: var(--text-secondary); line-height: 1.8; font-size: 1.05rem;">
                    대한민국 최고의 인쇄코팅 후가공 전문 기업으로 성장하여,
                    고품질 서비스를 통해 고객의 가치를 극대화하고 
                    업계의 표준을 선도하는 기업이 되겠습니다.
                </p>
            </div>
            <div class="card" style="border-left: 4px solid var(--primary-color);">
                <h3 style="color: var(--primary-color); font-size: 2rem; margin-bottom: 1rem;">미션 (Mission)</h3>
                <p style="color: var(--text-secondary); line-height: 1.8; font-size: 1.05rem;">
                    최첨단 기술과 오랜 경험을 바탕으로 고객에게 최상의 코팅 서비스를 제공하며,
                    지속적인 혁신과 품질 향상을 통해 
                    고객의 성공 파트너가 되겠습니다.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Core Values -->
<section class="section">
    <div class="container">
        <div class="section-header">
            <h2>핵심 가치</h2>
            <p>정우특수코팅이 추구하는 4가지 핵심 가치</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
            <div class="card text-center">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">🏆</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">품질 최우선</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    최상의 품질을 제공하기 위해 모든 공정에서 철저한 품질 관리를 실시합니다.
                </p>
            </div>
            
            <div class="card text-center">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">🤝</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">고객 만족</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    고객의 요구사항을 정확히 파악하고 최적의 솔루션을 제공하여 만족도를 높입니다.
                </p>
            </div>
            
            <div class="card text-center">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">💡</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">지속적 혁신</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    최신 기술 도입과 지속적인 연구개발로 업계를 선도하는 기업이 되겠습니다.
                </p>
            </div>
            
            <div class="card text-center">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">⚡</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">신속 정확</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    효율적인 작업 프로세스로 약속된 납기를 정확히 지키며 신속하게 대응합니다.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Facilities -->
<section class="section" style="background: var(--light-gray);">
    <div class="container">
        <div class="section-header">
            <h2>보유 장비</h2>
            <p>최신 장비로 최상의 품질을 보장합니다</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
            <div class="card">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">UV 코팅기</h3>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem;">
                    최신 자동 UV 코팅기로 균일하고 완벽한 코팅을 제공합니다.
                </p>
                <ul style="color: var(--text-secondary); line-height: 1.8; font-size: 0.95rem;">
                    <li>• 전면/부분 UV 가능</li>
                    <li>• 고속 작업 가능</li>
                    <li>• 정밀 제어 시스템</li>
                </ul>
            </div>
            
            <div class="card">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">라미네이팅기</h3>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem;">
                    고성능 라미네이팅기로 유광/무광 작업을 완벽하게 처리합니다.
                </p>
                <ul style="color: var(--text-secondary); line-height: 1.8; font-size: 0.95rem;">
                    <li>• 자동 온도 조절</li>
                    <li>• 다양한 사이즈 지원</li>
                    <li>• 기포 방지 시스템</li>
                </ul>
            </div>
            
            <div class="card">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">박 코팅기</h3>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem;">
                    정밀한 박 코팅으로 고급스러운 마감을 제공합니다.
                </p>
                <ul style="color: var(--text-secondary); line-height: 1.8; font-size: 0.95rem;">
                    <li>• 금박/은박/홀로그램박</li>
                    <li>• 정밀 위치 제어</li>
                    <li>• 다양한 디자인 적용</li>
                </ul>
            </div>
            
            <div class="card">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">형압기</h3>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem;">
                    입체감 있는 형압 가공으로 독특한 효과를 연출합니다.
                </p>
                <ul style="color: var(--text-secondary); line-height: 1.8; font-size: 0.95rem;">
                    <li>• 양각/음각 가공</li>
                    <li>• 정밀 압력 조절</li>
                    <li>• 맞춤형 형판 제작</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- Company Info -->
<section class="section">
    <div class="container">
        <div class="section-header">
            <h2>회사 정보</h2>
            <p>정우특수코팅의 상세 정보</p>
        </div>
        
        <div class="card" style="max-width: 800px; margin: 0 auto;">
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                <div style="color: var(--primary-color); font-weight: bold;">회사명</div>
                <div style="color: var(--text-secondary);">정우특수코팅</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                <div style="color: var(--primary-color); font-weight: bold;">설립일</div>
                <div style="color: var(--text-secondary);">1999년</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                <div style="color: var(--primary-color); font-weight: bold;">주요 사업</div>
                <div style="color: var(--text-secondary);">인쇄코팅 후가공 (UV코팅, 라미네이팅, 박, 형압 등)</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                <div style="color: var(--primary-color); font-weight: bold;">전화</div>
                <div style="color: var(--text-secondary);">02-XXXX-XXXX</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                <div style="color: var(--primary-color); font-weight: bold;">이메일</div>
                <div style="color: var(--text-secondary);">info@jeongwoo.co.kr</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                <div style="color: var(--primary-color); font-weight: bold;">주소</div>
                <div style="color: var(--text-secondary);">서울시 XX구 XX동 XX번지</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem;">
                <div style="color: var(--primary-color); font-weight: bold;">영업시간</div>
                <div style="color: var(--text-secondary);">평일 09:00 - 18:00 (주말 및 공휴일 휴무)</div>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="section" style="background: var(--accent-color); color: var(--white); text-align: center;">
    <div class="container">
        <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem;">정우특수코팅과 함께하세요</h2>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
            20년 경험의 전문가가 귀사의 성공 파트너가 되어드리겠습니다
        </p>
        <a href="/contact" class="btn" style="background: var(--white); color: var(--accent-color); font-size: 1.1rem; padding: 15px 30px;">문의하기</a>
    </div>
</section>

<?= $this->endSection() ?>


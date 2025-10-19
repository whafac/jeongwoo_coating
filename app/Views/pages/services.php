<?= $this->extend('layouts/main') ?>

<?= $this->section('content') ?>

<!-- Page Header -->
<section style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%); color: var(--white); padding: 5rem 0 4rem; text-align: center;">
    <div class="container">
        <h1 style="font-size: 3rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">코팅 서비스</h1>
        <p style="font-size: 1.2rem; max-width: 600px; margin: 0 auto; opacity: 0.95;">
            다양한 인쇄코팅 후가공 서비스로 완벽한 마감을 제공합니다
        </p>
    </div>
</section>

<!-- UV Coating -->
<section class="section">
    <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
            <div>
                <div style="display: inline-block; background: var(--accent-color); color: var(--white); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; margin-bottom: 1rem;">인기 서비스</div>
                <h2 style="color: var(--primary-color); font-size: 2.5rem; margin-bottom: 1.5rem;">UV 코팅</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.8;">
                    자외선(UV)으로 경화시키는 코팅 방식으로, 빠른 건조 시간과 뛰어난 광택감이 특징입니다.
                    인쇄물에 고급스러운 마감을 제공하며, 내구성이 우수하여 오래도록 깨끗한 상태를 유지할 수 있습니다.
                </p>
                <h4 style="color: var(--primary-color); margin-bottom: 1rem;">주요 특징</h4>
                <ul style="color: var(--text-secondary); line-height: 2; margin-bottom: 1.5rem;">
                    <li>✓ 뛰어난 광택감과 선명한 발색</li>
                    <li>✓ 빠른 건조로 신속한 납기 가능</li>
                    <li>✓ 우수한 내구성 및 내마모성</li>
                    <li>✓ 명함, 카탈로그, 포스터 등 다양한 인쇄물에 적용</li>
                </ul>
                <a href="/contact" class="btn">견적 문의</a>
            </div>
            <div>
                <div style="background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); padding: 3rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <div style="background: var(--white); padding: 2rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 5rem; margin-bottom: 1rem;">✨</div>
                        <h3 style="color: var(--primary-color); margin-bottom: 1rem;">UV 코팅</h3>
                        <p style="color: var(--text-secondary);">고급스러운 광택 마감</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Laminating -->
<section class="section" style="background: var(--light-gray);">
    <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
            <div style="order: 2;">
                <div style="display: inline-block; background: var(--primary-color); color: var(--white); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; margin-bottom: 1rem;">추천 서비스</div>
                <h2 style="color: var(--primary-color); font-size: 2.5rem; margin-bottom: 1.5rem;">라미네이팅</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.8;">
                    필름을 인쇄물 표면에 부착하여 보호하는 후가공 방식입니다.
                    유광과 무광 라미네이팅으로 다양한 느낌을 연출할 수 있으며, 방수 기능으로 인쇄물을 오랫동안 보호합니다.
                </p>
                <h4 style="color: var(--primary-color); margin-bottom: 1rem;">서비스 종류</h4>
                <ul style="color: var(--text-secondary); line-height: 2; margin-bottom: 1.5rem;">
                    <li>✓ 유광 라미네이팅 - 광택감 있는 고급스러운 마감</li>
                    <li>✓ 무광 라미네이팅 - 차분하고 세련된 느낌</li>
                    <li>✓ 방수 및 오염 방지 효과</li>
                    <li>✓ 책 표지, 메뉴판, 카드 등에 최적</li>
                </ul>
                <a href="/contact" class="btn">견적 문의</a>
            </div>
            <div style="order: 1;">
                <div style="background: linear-gradient(135deg, var(--accent-color), var(--primary-color)); padding: 3rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <div style="background: var(--white); padding: 2rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 5rem; margin-bottom: 1rem;">📄</div>
                        <h3 style="color: var(--primary-color); margin-bottom: 1rem;">라미네이팅</h3>
                        <p style="color: var(--text-secondary);">보호와 미를 동시에</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Foil Stamping -->
<section class="section">
    <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
            <div>
                <div style="display: inline-block; background: #FFD700; color: var(--dark-gray); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; margin-bottom: 1rem; font-weight: bold;">프리미엄</div>
                <h2 style="color: var(--primary-color); font-size: 2.5rem; margin-bottom: 1.5rem;">박 코팅</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.8;">
                    금속 박막을 인쇄물에 전사하여 화려하고 고급스러운 효과를 연출합니다.
                    금박, 은박, 홀로그램 박 등 다양한 종류의 박을 사용하여 브랜드 가치를 극대화할 수 있습니다.
                </p>
                <h4 style="color: var(--primary-color); margin-bottom: 1rem;">박 종류</h4>
                <ul style="color: var(--text-secondary); line-height: 2; margin-bottom: 1.5rem;">
                    <li>✓ 금박 - 고급스럽고 화려한 느낌</li>
                    <li>✓ 은박 - 세련되고 모던한 느낌</li>
                    <li>✓ 홀로그램박 - 독특하고 눈길을 끄는 효과</li>
                    <li>✓ 명함, 초대장, 패키지 등에 최적</li>
                </ul>
                <a href="/contact" class="btn">견적 문의</a>
            </div>
            <div>
                <div style="background: linear-gradient(135deg, #FFD700, #FFA500); padding: 3rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <div style="background: var(--white); padding: 2rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 5rem; margin-bottom: 1rem;">🌟</div>
                        <h3 style="color: var(--primary-color); margin-bottom: 1rem;">박 코팅</h3>
                        <p style="color: var(--text-secondary);">화려함의 정점</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Embossing -->
<section class="section" style="background: var(--light-gray);">
    <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
            <div style="order: 2;">
                <h2 style="color: var(--primary-color); font-size: 2.5rem; margin-bottom: 1.5rem;">형압 가공</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.8;">
                    압력을 가하여 인쇄물에 입체적인 효과를 주는 가공 방식입니다.
                    양각과 음각 형압으로 독특하고 고급스러운 느낌을 연출할 수 있습니다.
                </p>
                <h4 style="color: var(--primary-color); margin-bottom: 1rem;">형압 종류</h4>
                <ul style="color: var(--text-secondary); line-height: 2; margin-bottom: 1.5rem;">
                    <li>✓ 양각 - 돌출된 입체감</li>
                    <li>✓ 음각 - 파인 듯한 깊이감</li>
                    <li>✓ 촉감까지 고려한 디자인</li>
                    <li>✓ 명함, 초대장, 고급 인쇄물에 적용</li>
                </ul>
                <a href="/contact" class="btn">견적 문의</a>
            </div>
            <div style="order: 1;">
                <div style="background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); padding: 3rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <div style="background: var(--white); padding: 2rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 5rem; margin-bottom: 1rem;">🎨</div>
                        <h3 style="color: var(--primary-color); margin-bottom: 1rem;">형압 가공</h3>
                        <p style="color: var(--text-secondary);">입체적인 아름다움</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Additional Services -->
<section class="section">
    <div class="container">
        <div class="section-header">
            <h2>추가 후가공 서비스</h2>
            <p>더욱 완벽한 마감을 위한 다양한 옵션</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
            <div class="card text-center">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">도무송 코팅</h3>
                <p style="color: var(--text-secondary); line-height: 1.6;">
                    부분적으로 광택을 주어 디자인 포인트를 강조합니다.
                </p>
            </div>
            
            <div class="card text-center">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">톰슨 가공</h3>
                <p style="color: var(--text-secondary); line-height: 1.6;">
                    원하는 모양으로 정밀하게 재단하는 후가공입니다.
                </p>
            </div>
            
            <div class="card text-center">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">미싱 가공</h3>
                <p style="color: var(--text-secondary); line-height: 1.6;">
                    쉽게 뜯을 수 있도록 점선을 만드는 가공입니다.
                </p>
            </div>
            
            <div class="card text-center">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">오시 가공</h3>
                <p style="color: var(--text-secondary); line-height: 1.6;">
                    접기 쉽도록 접는 선을 만드는 가공입니다.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="section" style="background: var(--accent-color); color: var(--white); text-align: center;">
    <div class="container">
        <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem;">어떤 코팅이 적합할지 고민되시나요?</h2>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
            전문가가 귀사의 프로젝트에 최적화된 코팅 방법을 추천해드립니다
        </p>
        <a href="/contact" class="btn" style="background: var(--white); color: var(--accent-color); font-size: 1.1rem; padding: 15px 30px;">무료 상담 받기</a>
    </div>
</section>

<?= $this->endSection() ?>


<?= $this->extend('layouts/main') ?>

<?= $this->section('content') ?>

<!-- Page Header -->
<section style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%); color: var(--white); padding: 5rem 0 4rem; text-align: center;">
    <div class="container">
        <h1 style="font-size: 3rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">작업 사례</h1>
        <p style="font-size: 1.2rem; max-width: 600px; margin: 0 auto; opacity: 0.95;">
            정우특수코팅의 다양한 코팅 작업 사례를 확인하세요
        </p>
    </div>
</section>

<!-- Portfolio Categories -->
<section class="section">
    <div class="container">
        <div style="text-align: center; margin-bottom: 3rem;">
            <div style="display: inline-flex; gap: 1rem; flex-wrap: wrap; justify-content: center; background: var(--light-gray); padding: 1rem; border-radius: 10px;">
                <button class="btn" style="padding: 0.7rem 1.5rem;">전체</button>
                <button class="btn-secondary" style="padding: 0.7rem 1.5rem; background: var(--white); color: var(--primary-color); border: 1px solid var(--border-color);">UV 코팅</button>
                <button class="btn-secondary" style="padding: 0.7rem 1.5rem; background: var(--white); color: var(--primary-color); border: 1px solid var(--border-color);">라미네이팅</button>
                <button class="btn-secondary" style="padding: 0.7rem 1.5rem; background: var(--white); color: var(--primary-color); border: 1px solid var(--border-color);">박 코팅</button>
                <button class="btn-secondary" style="padding: 0.7rem 1.5rem; background: var(--white); color: var(--primary-color); border: 1px solid var(--border-color);">형압</button>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
            <!-- Portfolio Item 1 -->
            <div class="card" style="padding: 0; overflow: hidden;">
                <div style="height: 250px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                    ✨
                </div>
                <div style="padding: 1.5rem;">
                    <div style="display: inline-block; background: var(--accent-color); color: var(--white); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; margin-bottom: 1rem;">UV 코팅</div>
                    <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">명함 UV 코팅</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                        고급 명함에 UV 코팅을 적용하여 광택감과 내구성을 향상시킨 사례
                    </p>
                </div>
            </div>
            
            <!-- Portfolio Item 2 -->
            <div class="card" style="padding: 0; overflow: hidden;">
                <div style="height: 250px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                    📄
                </div>
                <div style="padding: 1.5rem;">
                    <div style="display: inline-block; background: var(--primary-color); color: var(--white); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; margin-bottom: 1rem;">라미네이팅</div>
                    <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">카탈로그 무광 라미네이팅</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                        제품 카탈로그에 무광 라미네이팅을 적용한 세련된 마감 사례
                    </p>
                </div>
            </div>
            
            <!-- Portfolio Item 3 -->
            <div class="card" style="padding: 0; overflow: hidden;">
                <div style="height: 250px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                    🌟
                </div>
                <div style="padding: 1.5rem;">
                    <div style="display: inline-block; background: #FFD700; color: var(--dark-gray); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; margin-bottom: 1rem; font-weight: bold;">박 코팅</div>
                    <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">초대장 금박</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                        고급스러운 초대장에 금박을 적용하여 특별함을 더한 사례
                    </p>
                </div>
            </div>
            
            <!-- Portfolio Item 4 -->
            <div class="card" style="padding: 0; overflow: hidden;">
                <div style="height: 250px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                    🎨
                </div>
                <div style="padding: 1.5rem;">
                    <div style="display: inline-block; background: var(--primary-dark); color: var(--white); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; margin-bottom: 1rem;">형압</div>
                    <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">명함 양각 형압</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                        입체적인 디자인을 위한 양각 형압 처리 사례
                    </p>
                </div>
            </div>
            
            <!-- Portfolio Item 5 -->
            <div class="card" style="padding: 0; overflow: hidden;">
                <div style="height: 250px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                    📚
                </div>
                <div style="padding: 1.5rem;">
                    <div style="display: inline-block; background: var(--primary-color); color: var(--white); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; margin-bottom: 1rem;">라미네이팅</div>
                    <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">책 표지 유광 라미네이팅</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                        책 표지에 유광 라미네이팅을 적용하여 보호와 미를 동시에
                    </p>
                </div>
            </div>
            
            <!-- Portfolio Item 6 -->
            <div class="card" style="padding: 0; overflow: hidden;">
                <div style="height: 250px; background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                    🎁
                </div>
                <div style="padding: 1.5rem;">
                    <div style="display: inline-block; background: #C0C0C0; color: var(--dark-gray); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; margin-bottom: 1rem; font-weight: bold;">박 코팅</div>
                    <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">패키지 은박</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                        제품 패키지에 은박을 적용한 모던하고 세련된 마감
                    </p>
                </div>
            </div>
            
            <!-- Portfolio Item 7 -->
            <div class="card" style="padding: 0; overflow: hidden;">
                <div style="height: 250px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); display: flex; align-items: center; justify-content: center; color: #333; font-size: 3rem;">
                    📋
                </div>
                <div style="padding: 1.5rem;">
                    <div style="display: inline-block; background: var(--accent-color); color: var(--white); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; margin-bottom: 1rem;">UV 코팅</div>
                    <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">포스터 부분 UV</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                        포스터의 특정 부분에만 UV를 적용한 도무송 코팅 사례
                    </p>
                </div>
            </div>
            
            <!-- Portfolio Item 8 -->
            <div class="card" style="padding: 0; overflow: hidden;">
                <div style="height: 250px; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                    💌
                </div>
                <div style="padding: 1.5rem;">
                    <div style="display: inline-block; background: var(--primary-dark); color: var(--white); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; margin-bottom: 1rem;">형압</div>
                    <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">청첩장 음각 형압</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                        청첩장에 음각 형압을 적용하여 우아한 느낌을 연출
                    </p>
                </div>
            </div>
            
            <!-- Portfolio Item 9 -->
            <div class="card" style="padding: 0; overflow: hidden;">
                <div style="height: 250px; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); display: flex; align-items: center; justify-content: center; color: #333; font-size: 3rem;">
                    📇
                </div>
                <div style="padding: 1.5rem;">
                    <div style="display: inline-block; background: var(--accent-light); color: var(--white); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; margin-bottom: 1rem;">복합 작업</div>
                    <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">명함 UV + 박</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                        UV 코팅과 금박을 함께 적용한 프리미엄 명함 사례
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Stats -->
<section class="section" style="background: var(--light-gray);">
    <div class="container">
        <div class="section-header">
            <h2>작업 실적</h2>
            <p>숫자로 보는 정우특수코팅의 경험과 전문성</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center;">
            <div class="card">
                <h3 style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--accent-color); font-weight: bold;">5,000+</h3>
                <p style="font-size: 1.1rem; color: var(--text-secondary);">완료 프로젝트</p>
            </div>
            <div class="card">
                <h3 style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--accent-color); font-weight: bold;">1,000+</h3>
                <p style="font-size: 1.1rem; color: var(--text-secondary);">거래 기업</p>
            </div>
            <div class="card">
                <h3 style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--accent-color); font-weight: bold;">20+</h3>
                <p style="font-size: 1.1rem; color: var(--text-secondary);">업계 경력 (년)</p>
            </div>
            <div class="card">
                <h3 style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--accent-color); font-weight: bold;">98%</h3>
                <p style="font-size: 1.1rem; color: var(--text-secondary);">고객 만족도</p>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="section" style="background: var(--accent-color); color: var(--white); text-align: center;">
    <div class="container">
        <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem;">귀사의 프로젝트도 성공 사례로 만들어보세요</h2>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
            20년 경험의 전문가가 최상의 코팅 서비스를 제공합니다
        </p>
        <a href="/contact" class="btn" style="background: var(--white); color: var(--accent-color); font-size: 1.1rem; padding: 15px 30px;">프로젝트 시작하기</a>
    </div>
</section>

<?= $this->endSection() ?>


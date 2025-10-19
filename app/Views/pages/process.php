<?= $this->extend('layouts/main') ?>

<?= $this->section('content') ?>

<!-- Page Header -->
<section style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%); color: var(--white); padding: 5rem 0 4rem; text-align: center;">
    <div class="container">
        <h1 style="font-size: 3rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">작업 프로세스</h1>
        <p style="font-size: 1.2rem; max-width: 600px; margin: 0 auto; opacity: 0.95;">
            체계적이고 투명한 작업 과정으로 최상의 결과를 보장합니다
        </p>
    </div>
</section>

<!-- Process Overview -->
<section class="section">
    <div class="container">
        <div class="section-header">
            <h2>간편한 4단계 프로세스</h2>
            <p>상담부터 납품까지 모든 과정을 투명하게 진행합니다</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem; margin-bottom: 3rem;">
            <div class="card text-center" style="border-top: 4px solid var(--accent-color);">
                <div style="width: 80px; height: 80px; background: var(--accent-color); color: var(--white); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; margin: 0 auto 1.5rem;">1</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">상담 및 접수</h3>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem;">
                    고객의 요구사항과 인쇄물 사양을 확인하고 최적의 코팅 방법을 제안합니다.
                </p>
                <div style="background: var(--light-gray); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        📞 전화, 이메일, 방문 상담<br>
                        📋 인쇄물 사양 확인<br>
                        💡 코팅 방법 제안
                    </p>
                </div>
            </div>
            
            <div class="card text-center" style="border-top: 4px solid var(--primary-color);">
                <div style="width: 80px; height: 80px; background: var(--primary-color); color: var(--white); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; margin: 0 auto 1.5rem;">2</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">견적 및 계약</h3>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem;">
                    정확한 견적을 산출하고 작업 일정과 납기를 협의합니다.
                </p>
                <div style="background: var(--light-gray); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        💰 정확한 견적 산출<br>
                        📅 작업 일정 협의<br>
                        ✍️ 계약 체결
                    </p>
                </div>
            </div>
            
            <div class="card text-center" style="border-top: 4px solid var(--accent-light);">
                <div style="width: 80px; height: 80px; background: var(--accent-light); color: var(--white); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; margin: 0 auto 1.5rem;">3</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">작업 진행</h3>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem;">
                    최신 장비와 숙련된 기술력으로 완벽한 코팅 작업을 진행합니다.
                </p>
                <div style="background: var(--light-gray); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        🔧 전문 장비 작업<br>
                        👨‍🔬 품질 관리<br>
                        📊 진행 상황 공유
                    </p>
                </div>
            </div>
            
            <div class="card text-center" style="border-top: 4px solid var(--primary-dark);">
                <div style="width: 80px; height: 80px; background: var(--primary-dark); color: var(--white); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; margin: 0 auto 1.5rem;">4</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">검수 및 납품</h3>
                <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem;">
                    최종 품질 검수 후 약속된 일정에 맞춰 안전하게 납품합니다.
                </p>
                <div style="background: var(--light-gray); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        ✅ 최종 품질 검수<br>
                        📦 안전한 포장<br>
                        🚚 정시 납품
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Detailed Process -->
<section class="section" style="background: var(--light-gray);">
    <div class="container">
        <div class="section-header">
            <h2>세부 작업 과정</h2>
            <p>각 단계별 상세한 작업 내용을 안내합니다</p>
        </div>
        
        <div style="max-width: 800px; margin: 0 auto;">
            <div style="position: relative; padding-left: 40px; border-left: 3px solid var(--accent-color); margin-bottom: 2rem;">
                <div style="position: absolute; left: -12px; top: 0; width: 20px; height: 20px; background: var(--accent-color); border-radius: 50%;"></div>
                <div class="card" style="margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">1단계: 상담 및 접수</h3>
                    <ul style="color: var(--text-secondary); line-height: 2;">
                        <li>• 고객 요구사항 상세 청취</li>
                        <li>• 인쇄물 종류, 수량, 용지 사양 확인</li>
                        <li>• 원하는 코팅 스타일 및 효과 파악</li>
                        <li>• 샘플 제공 (필요시)</li>
                        <li>• 최적의 코팅 방법 제안</li>
                    </ul>
                </div>
            </div>
            
            <div style="position: relative; padding-left: 40px; border-left: 3px solid var(--primary-color); margin-bottom: 2rem;">
                <div style="position: absolute; left: -12px; top: 0; width: 20px; height: 20px; background: var(--primary-color); border-radius: 50%;"></div>
                <div class="card" style="margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">2단계: 견적 및 계약</h3>
                    <ul style="color: var(--text-secondary); line-height: 2;">
                        <li>• 작업 범위에 따른 정확한 견적 산출</li>
                        <li>• 작업 소요 시간 및 납기 협의</li>
                        <li>• 계약서 작성 및 서명</li>
                        <li>• 선금 입금 확인 (계약 조건에 따라)</li>
                        <li>• 작업 스케줄 확정</li>
                    </ul>
                </div>
            </div>
            
            <div style="position: relative; padding-left: 40px; border-left: 3px solid var(--accent-light); margin-bottom: 2rem;">
                <div style="position: absolute; left: -12px; top: 0; width: 20px; height: 20px; background: var(--accent-light); border-radius: 50%;"></div>
                <div class="card" style="margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">3단계: 작업 진행</h3>
                    <ul style="color: var(--text-secondary); line-height: 2;">
                        <li>• 인쇄물 접수 및 상태 확인</li>
                        <li>• 장비 세팅 및 사전 테스트</li>
                        <li>• 코팅 작업 진행</li>
                        <li>• 중간 품질 검수</li>
                        <li>• 건조 및 마무리 작업</li>
                        <li>• 고객에게 진행 상황 공유</li>
                    </ul>
                </div>
            </div>
            
            <div style="position: relative; padding-left: 40px; border-left: 3px solid var(--primary-dark); margin-bottom: 2rem;">
                <div style="position: absolute; left: -12px; top: 0; width: 20px; height: 20px; background: var(--primary-dark); border-radius: 50%;"></div>
                <div class="card">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">4단계: 검수 및 납품</h3>
                    <ul style="color: var(--text-secondary); line-height: 2;">
                        <li>• 최종 품질 검사 (색상, 광택, 접착력 등)</li>
                        <li>• 불량품 제거 및 재작업</li>
                        <li>• 고객 확인 (필요시 방문 검수)</li>
                        <li>• 안전한 포장</li>
                        <li>• 약속된 일정에 맞춰 납품</li>
                        <li>• 사후 관리 및 피드백 수렴</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Quality Control -->
<section class="section">
    <div class="container">
        <div class="section-header">
            <h2>품질 관리 시스템</h2>
            <p>완벽한 품질을 위한 철저한 관리 체계</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
            <div class="card text-center">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">🔍</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">사전 검수</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    작업 전 인쇄물 상태를 꼼꼼히 확인하여 최상의 결과를 준비합니다.
                </p>
            </div>
            
            <div class="card text-center">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">⚙️</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">공정 관리</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    작업 중 실시간으로 품질을 모니터링하고 즉시 조치합니다.
                </p>
            </div>
            
            <div class="card text-center">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">✅</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">최종 검수</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    완성된 제품의 품질을 다시 한번 철저히 검사합니다.
                </p>
            </div>
            
            <div class="card text-center">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">📋</div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">문서화</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    모든 작업 과정을 기록하여 일관된 품질을 유지합니다.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="section" style="background: var(--accent-color); color: var(--white); text-align: center;">
    <div class="container">
        <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem;">프로젝트를 시작할 준비가 되셨나요?</h2>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
            체계적인 프로세스로 완벽한 결과물을 제공해드리겠습니다
        </p>
        <a href="/contact" class="btn" style="background: var(--white); color: var(--accent-color); font-size: 1.1rem; padding: 15px 30px;">지금 문의하기</a>
    </div>
</section>

<?= $this->endSection() ?>


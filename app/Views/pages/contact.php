<?= $this->extend('layouts/main') ?>

<?= $this->section('content') ?>

<!-- Page Header -->
<section style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%); color: var(--white); padding: 5rem 0 4rem; text-align: center;">
    <div class="container">
        <h1 style="font-size: 3rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">문의하기</h1>
        <p style="font-size: 1.2rem; max-width: 600px; margin: 0 auto; opacity: 0.95;">
            궁금하신 사항이나 견적 요청은 언제든지 문의해주세요
        </p>
    </div>
</section>

<!-- Success/Error Messages -->
<?php if (session()->getFlashdata('success')): ?>
<section class="section" style="padding: 2rem 0;">
    <div class="container">
        <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 1rem 1.5rem; border-radius: 5px; text-align: center;">
            <strong>✓</strong> <?= session()->getFlashdata('success') ?>
        </div>
    </div>
</section>
<?php endif; ?>

<?php if (session()->getFlashdata('error')): ?>
<section class="section" style="padding: 2rem 0;">
    <div class="container">
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 1rem 1.5rem; border-radius: 5px; text-align: center;">
            <strong>✗</strong> <?= session()->getFlashdata('error') ?>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- Contact Form & Info -->
<section class="section">
    <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem;">
            <!-- Contact Form -->
            <div>
                <h2 style="color: var(--primary-color); font-size: 2rem; margin-bottom: 1.5rem;">온라인 문의</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.8;">
                    아래 양식을 작성해주시면 빠른 시일 내에 답변드리겠습니다.
                </p>
                
                <form method="post" action="/contact" style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <?= csrf_field() ?>
                    
                    <div>
                        <label style="display: block; color: var(--primary-color); font-weight: bold; margin-bottom: 0.5rem;">
                            이름 <span style="color: red;">*</span>
                        </label>
                        <input type="text" name="name" required 
                            value="<?= old('name') ?>"
                            style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 5px; font-size: 1rem;">
                        <?php if (session()->getFlashdata('errors')['name'] ?? null): ?>
                            <small style="color: red;"><?= session()->getFlashdata('errors')['name'] ?></small>
                        <?php endif; ?>
                    </div>
                    
                    <div>
                        <label style="display: block; color: var(--primary-color); font-weight: bold; margin-bottom: 0.5rem;">
                            회사명
                        </label>
                        <input type="text" name="company" 
                            value="<?= old('company') ?>"
                            style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 5px; font-size: 1rem;">
                    </div>
                    
                    <div>
                        <label style="display: block; color: var(--primary-color); font-weight: bold; margin-bottom: 0.5rem;">
                            이메일 <span style="color: red;">*</span>
                        </label>
                        <input type="email" name="email" required 
                            value="<?= old('email') ?>"
                            style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 5px; font-size: 1rem;">
                        <?php if (session()->getFlashdata('errors')['email'] ?? null): ?>
                            <small style="color: red;"><?= session()->getFlashdata('errors')['email'] ?></small>
                        <?php endif; ?>
                    </div>
                    
                    <div>
                        <label style="display: block; color: var(--primary-color); font-weight: bold; margin-bottom: 0.5rem;">
                            연락처 <span style="color: red;">*</span>
                        </label>
                        <input type="tel" name="phone" required 
                            value="<?= old('phone') ?>"
                            placeholder="010-1234-5678"
                            style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 5px; font-size: 1rem;">
                        <?php if (session()->getFlashdata('errors')['phone'] ?? null): ?>
                            <small style="color: red;"><?= session()->getFlashdata('errors')['phone'] ?></small>
                        <?php endif; ?>
                    </div>
                    
                    <div>
                        <label style="display: block; color: var(--primary-color); font-weight: bold; margin-bottom: 0.5rem;">
                            문의 내용 <span style="color: red;">*</span>
                        </label>
                        <textarea name="message" required rows="6" 
                            style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 5px; font-size: 1rem; resize: vertical;"><?= old('message') ?></textarea>
                        <?php if (session()->getFlashdata('errors')['message'] ?? null): ?>
                            <small style="color: red;"><?= session()->getFlashdata('errors')['message'] ?></small>
                        <?php endif; ?>
                    </div>
                    
                    <button type="submit" class="btn" style="padding: 1rem 2rem; font-size: 1.1rem;">
                        문의 보내기
                    </button>
                </form>
            </div>
            
            <!-- Contact Information -->
            <div>
                <h2 style="color: var(--primary-color); font-size: 2rem; margin-bottom: 1.5rem;">연락처 정보</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.8;">
                    전화나 이메일로도 편하게 문의하실 수 있습니다.
                </p>
                
                <div class="card" style="margin-bottom: 2rem;">
                    <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="font-size: 2rem; color: var(--accent-color);">📞</div>
                        <div>
                            <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">전화</h3>
                            <p style="color: var(--text-secondary); line-height: 1.6;">
                                02-XXXX-XXXX<br>
                                <small>평일 09:00 - 18:00</small>
                            </p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="font-size: 2rem; color: var(--accent-color);">📧</div>
                        <div>
                            <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">이메일</h3>
                            <p style="color: var(--text-secondary); line-height: 1.6;">
                                info@jeongwoo.co.kr<br>
                                <small>24시간 접수 가능</small>
                            </p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="font-size: 2rem; color: var(--accent-color);">📍</div>
                        <div>
                            <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">주소</h3>
                            <p style="color: var(--text-secondary); line-height: 1.6;">
                                서울시 XX구 XX동 XX번지<br>
                                <small>주차 가능</small>
                            </p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: start; gap: 1rem;">
                        <div style="font-size: 2rem; color: var(--accent-color);">⏰</div>
                        <div>
                            <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">영업시간</h3>
                            <p style="color: var(--text-secondary); line-height: 1.6;">
                                평일: 09:00 - 18:00<br>
                                토/일/공휴일: 휴무
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="card" style="background: var(--light-gray);">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">빠른 상담 안내</h3>
                    <ul style="color: var(--text-secondary); line-height: 2;">
                        <li>✓ 전화 문의 시 빠른 상담 가능</li>
                        <li>✓ 온라인 문의는 24시간 이내 답변</li>
                        <li>✓ 방문 상담은 사전 예약 필수</li>
                        <li>✓ 견적은 무료로 제공</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- FAQ Section -->
<section class="section" style="background: var(--light-gray);">
    <div class="container">
        <div class="section-header">
            <h2>자주 묻는 질문</h2>
            <p>고객님들이 자주 문의하시는 내용입니다</p>
        </div>
        
        <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
            <div class="card">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Q. 최소 주문 수량이 있나요?</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    A. 최소 주문 수량은 없습니다. 소량부터 대량까지 모두 가능하며, 
                    수량에 따라 단가가 달라질 수 있습니다.
                </p>
            </div>
            
            <div class="card">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Q. 작업 기간은 얼마나 걸리나요?</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    A. 작업 종류와 수량에 따라 다르지만, 일반적으로 2-3일 정도 소요됩니다. 
                    급한 경우 당일 작업도 가능하니 문의해주세요.
                </p>
            </div>
            
            <div class="card">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Q. 샘플을 먼저 볼 수 있나요?</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    A. 네, 샘플 제공이 가능합니다. 방문하시거나 요청하시면 
                    다양한 코팅 샘플을 보여드립니다.
                </p>
            </div>
            
            <div class="card">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Q. 결제 방법은 어떻게 되나요?</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    A. 현금, 계좌이체, 카드 결제 모두 가능합니다. 
                    거래처 등록 후 월말 결제도 가능합니다.
                </p>
            </div>
            
            <div class="card">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Q. 택배 발송이 가능한가요?</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    A. 네, 전국 택배 발송이 가능합니다. 택배비는 착불 또는 선불 중 선택하실 수 있습니다.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="section" style="background: var(--accent-color); color: var(--white); text-align: center;">
    <div class="container">
        <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem;">지금 바로 문의하세요</h2>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
            전문가가 귀사의 프로젝트에 최적화된 솔루션을 제안해드립니다
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="tel:02-XXXX-XXXX" class="btn" style="background: var(--white); color: var(--accent-color); font-size: 1.1rem; padding: 15px 30px;">📞 전화 상담</a>
            <a href="mailto:info@jeongwoo.co.kr" class="btn" style="background: var(--primary-dark); font-size: 1.1rem; padding: 15px 30px;">📧 이메일 문의</a>
        </div>
    </div>
</section>

<?= $this->endSection() ?>


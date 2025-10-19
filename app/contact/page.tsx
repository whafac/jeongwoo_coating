'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 현재는 로컬 상태만 처리 (나중에 API 연결 가능)
    console.log('문의 내용:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', company: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className="container">
          <h1>문의하기</h1>
          <p>궁금하신 사항이나 견적 요청은 언제든지 문의해주세요</p>
        </div>
      </section>

      {/* Success Message */}
      {submitted && (
        <section className="section" style={{padding: '2rem 0'}}>
          <div className="container">
            <div className={styles.successMessage}>
              <strong>✓</strong> 문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.
            </div>
          </div>
        </section>
      )}

      {/* Contact Form & Info */}
      <section className="section">
        <div className="container">
          <div className={styles.contactGrid}>
            {/* Contact Form */}
            <div>
              <h2>온라인 문의</h2>
              <p className={styles.formDescription}>
                아래 양식을 작성해주시면 빠른 시일 내에 답변드리겠습니다.
              </p>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>이름 <span style={{color: 'red'}}>*</span></label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>회사명</label>
                  <input 
                    type="text" 
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>이메일 <span style={{color: 'red'}}>*</span></label>
                  <input 
                    type="email" 
                    name="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>연락처 <span style={{color: 'red'}}>*</span></label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required
                    placeholder="010-1234-5678"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>문의 내용 <span style={{color: 'red'}}>*</span></label>
                  <textarea 
                    name="message" 
                    required 
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                
                <button type="submit" className="btn" style={{padding: '1rem 2rem', fontSize: '1.1rem', width: '100%'}}>
                  문의 보내기
                </button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2>연락처 정보</h2>
              <p className={styles.contactDescription}>
                전화나 이메일로도 편하게 문의하실 수 있습니다.
              </p>
              
              <div className="card" style={{marginBottom: '2rem'}}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>📞</div>
                  <div>
                    <h3>전화</h3>
                    <p>02-XXXX-XXXX<br /><small>평일 09:00 - 18:00</small></p>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>📧</div>
                  <div>
                    <h3>이메일</h3>
                    <p>info@jeongwoo.co.kr<br /><small>24시간 접수 가능</small></p>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>📍</div>
                  <div>
                    <h3>주소</h3>
                    <p>서울시 XX구 XX동 XX번지<br /><small>주차 가능</small></p>
                  </div>
                </div>
                
                <div className={styles.contactItem} style={{marginBottom: 0}}>
                  <div className={styles.contactIcon}>⏰</div>
                  <div>
                    <h3>영업시간</h3>
                    <p>평일: 09:00 - 18:00<br />토/일/공휴일: 휴무</p>
                  </div>
                </div>
              </div>
              
              <div className="card" style={{background: 'var(--light-gray)'}}>
                <h3>빠른 상담 안내</h3>
                <ul className={styles.consultList}>
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

      {/* FAQ Section */}
      <section className="section" style={{background: 'var(--light-gray)'}}>
        <div className="container">
          <div className="section-header">
            <h2>자주 묻는 질문</h2>
            <p>고객님들이 자주 문의하시는 내용입니다</p>
          </div>
          
          <div className={styles.faqList}>
            <div className="card">
              <h3>Q. 최소 주문 수량이 있나요?</h3>
              <p>A. 최소 주문 수량은 없습니다. 소량부터 대량까지 모두 가능하며, 수량에 따라 단가가 달라질 수 있습니다.</p>
            </div>
            
            <div className="card">
              <h3>Q. 작업 기간은 얼마나 걸리나요?</h3>
              <p>A. 작업 종류와 수량에 따라 다르지만, 일반적으로 2-3일 정도 소요됩니다. 급한 경우 당일 작업도 가능하니 문의해주세요.</p>
            </div>
            
            <div className="card">
              <h3>Q. 샘플을 먼저 볼 수 있나요?</h3>
              <p>A. 네, 샘플 제공이 가능합니다. 방문하시거나 요청하시면 다양한 코팅 샘플을 보여드립니다.</p>
            </div>
            
            <div className="card">
              <h3>Q. 결제 방법은 어떻게 되나요?</h3>
              <p>A. 현금, 계좌이체, 카드 결제 모두 가능합니다. 거래처 등록 후 월말 결제도 가능합니다.</p>
            </div>
            
            <div className="card">
              <h3>Q. 택배 발송이 가능한가요?</h3>
              <p>A. 네, 전국 택배 발송이 가능합니다. 택배비는 착불 또는 선불 중 선택하실 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{background: 'var(--accent-color)', color: 'var(--white)', textAlign: 'center'}}>
        <div className="container">
          <h2>지금 바로 문의하세요</h2>
          <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>
            전문가가 귀사의 프로젝트에 최적화된 솔루션을 제안해드립니다
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <a href="tel:02-XXXX-XXXX" className="btn" style={{background: 'var(--white)', color: 'var(--accent-color)', fontSize: '1.1rem', padding: '15px 30px'}}>
              📞 전화 상담
            </a>
            <a href="mailto:info@jeongwoo.co.kr" className="btn" style={{background: 'var(--primary-dark)', fontSize: '1.1rem', padding: '15px 30px'}}>
              📧 이메일 문의
            </a>
          </div>
        </div>
      </section>
    </>
  );
}


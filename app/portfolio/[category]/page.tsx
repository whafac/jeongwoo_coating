'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './gallery.module.css';

// 카테고리별 이미지 데이터
const categoryImages: Record<string, Array<{id: string, src: string, alt: string, title?: string}>> = {
  'UV 코팅': [
    { id: '1', src: '/uv_coating001.jpg', alt: 'UV 코팅 작업 샘플 1', title: '명함 UV 코팅' },
    // 여기에 추가 이미지 경로를 넣으세요
    // { id: '2', src: '/portfolio/uv-coating/sample2.jpg', alt: 'UV 코팅 작업 샘플 2' },
    // { id: '3', src: '/portfolio/uv-coating/sample3.jpg', alt: 'UV 코팅 작업 샘플 3' },
  ],
  '라미네이팅': [
    // { id: '1', src: '/portfolio/laminating/sample1.jpg', alt: '라미네이팅 작업 샘플 1' },
    // 추가 이미지 경로를 넣으세요
  ],
  '박 코팅': [
    // { id: '1', src: '/portfolio/foil-stamping/sample1.jpg', alt: '박 코팅 작업 샘플 1' },
    // 추가 이미지 경로를 넣으세요
  ],
  '형압': [
    // { id: '1', src: '/portfolio/embossing/sample1.jpg', alt: '형압 작업 샘플 1' },
    // 추가 이미지 경로를 넣으세요
  ],
  '복합 작업': [
    // { id: '1', src: '/portfolio/composite/sample1.jpg', alt: '복합 작업 샘플 1' },
    // 추가 이미지 경로를 넣으세요
  ],
};

const categoryInfo: Record<string, { emoji: string, gradient: string, description: string }> = {
  'UV 코팅': {
    emoji: '✨',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: '자외선(UV)으로 경화시키는 코팅 방식으로, 빠른 건조 시간과 뛰어난 광택감이 특징입니다.'
  },
  '라미네이팅': {
    emoji: '📄',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: '필름을 인쇄물 표면에 부착하여 보호하는 후가공 방식입니다.'
  },
  '박 코팅': {
    emoji: '🌟',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    description: '금속 박막을 인쇄물에 전사하여 화려하고 고급스러운 효과를 연출합니다.'
  },
  '형압': {
    emoji: '🎨',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    description: '압력을 가하여 인쇄물에 입체적인 효과를 주는 가공 방식입니다.'
  },
  '복합 작업': {
    emoji: '📇',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    description: '여러 가지 코팅 기법을 조합하여 완성도 높은 마감을 제공합니다.'
  },
};

export default function CategoryGallery() {
  const params = useParams();
  const router = useRouter();
  const category = decodeURIComponent(params.category as string);
  const images = categoryImages[category] || [];
  const info = categoryInfo[category];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!info) {
    return (
      <div className={styles.errorContainer}>
        <h1>카테고리를 찾을 수 없습니다</h1>
        <Link href="/portfolio" className="btn">포트폴리오로 돌아가기</Link>
      </div>
    );
  }

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      {/* Page Header */}
      <section className={styles.pageHeader} style={{ background: info.gradient }}>
        <div className="container">
          <Link href="/portfolio" className={styles.backButton}>
            ← 돌아가기
          </Link>
          <div className={styles.headerContent}>
            <div className={styles.categoryIcon}>{info.emoji}</div>
            <h1>{category}</h1>
            <p>{info.description}</p>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="section">
        <div className="container">
          {images.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>{info.emoji}</div>
              <h2>이미지를 준비 중입니다</h2>
              <p>곧 업로드될 예정입니다.</p>
              <Link href="/portfolio" className="btn">포트폴리오로 돌아가기</Link>
            </div>
          ) : (
            <>
              <div className={styles.galleryInfo}>
                <p>총 <strong>{images.length}개</strong>의 작업 사례</p>
              </div>
              <div className={styles.galleryGrid}>
                {images.map((image) => (
                  <div 
                    key={image.id} 
                    className={styles.galleryItem}
                    onClick={() => handleImageClick(image.src)}
                  >
                    <div className={styles.imageWrapper}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.galleryImage}
                        style={{ objectFit: 'cover' }}
                      />
                      <div className={styles.imageOverlay}>
                        <span className={styles.zoomIcon}>🔍</span>
                      </div>
                    </div>
                    {image.title && (
                      <div className={styles.imageTitle}>{image.title}</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className={styles.modal} onClick={closeModal}>
          <button className={styles.closeButton} onClick={closeModal}>✕</button>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="확대 이미지"
              width={1200}
              height={800}
              className={styles.modalImage}
              style={{ width: '100%', height: 'auto', maxHeight: '90vh' }}
            />
          </div>
        </div>
      )}
    </>
  );
}


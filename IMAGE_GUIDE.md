# 이미지 추가 가이드

## 📸 실제 촬영한 코팅 이미지를 페이지에 추가하는 방법

### 1. 이미지 파일 준비

**이미지 파일을 `public` 폴더에 저장합니다:**

```
public/
  ├── uv-coating.jpg       (UV 코팅 이미지)
  ├── laminating.jpg       (라미네이팅 이미지)
  ├── foil-stamping.jpg    (박 코팅 이미지)
  └── embossing.jpg        (형압 가공 이미지)
```

**권장 사항:**
- 파일 형식: JPG, PNG, WebP
- 파일 크기: 500KB 이하 (웹 최적화)
- 이미지 크기: 800x800px ~ 1200x1200px
- 파일명: 영어, 소문자, 하이픈 사용 (예: `uv-coating-sample.jpg`)

### 2. 코드 수정 위치

**파일: `app/services/page.tsx`**

현재 이미지가 표시되는 부분:
```tsx
<div className={styles.serviceImage}>
  <Image
    src="/uv-coating.svg"    // 👈 이 부분을 변경
    alt="UV 코팅"
    width={300}
    height={300}
    priority
    style={{ width: '100%', height: 'auto' }}
  />
</div>
```

### 3. 실제 이미지로 변경하는 방법

#### 방법 1: SVG를 실제 이미지로 교체

```tsx
// app/services/page.tsx

// UV 코팅 섹션 (17-55줄)
<div className={styles.serviceImage}>
  <Image
    src="/uv-coating.jpg"        // 👈 실제 이미지 파일명
    alt="UV 코팅 샘플"
    width={400}                   // 실제 이미지 너비
    height={400}                  // 실제 이미지 높이
    priority
    style={{ width: '100%', height: 'auto' }}
  />
</div>
```

#### 방법 2: 여러 이미지 사용 (갤러리 형식)

```tsx
<div className={styles.serviceImage}>
  <Image
    src="/uv-coating-sample1.jpg"
    alt="UV 코팅 샘플 1"
    width={400}
    height={400}
    priority
    className={styles.coatingImage}
  />
  <Image
    src="/uv-coating-sample2.jpg"
    alt="UV 코팅 샘플 2"
    width={400}
    height={400}
    className={styles.coatingImage}
  />
</div>
```

### 4. 각 서비스별 이미지 추가 위치

#### UV 코팅 (40-47줄)
```tsx
<Image
  src="/uv-coating.jpg"      // 실제 이미지 경로
  alt="UV 코팅"
  width={400}
  height={400}
/>
```

#### 라미네이팅 (67-73줄)
```tsx
<div className={styles.serviceBox}>
  <div className={styles.serviceBoxInner}>
    <div className={styles.serviceImage}>
      <Image
        src="/laminating.jpg"     // 실제 이미지 경로
        alt="라미네이팅"
        width={400}
        height={400}
        priority
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
    <h3>라미네이팅</h3>
    <p>보호와 미를 동시에</p>
  </div>
</div>
```

#### 박 코팅 (98-104줄)
```tsx
<Image
  src="/foil-stamping.jpg"    // 실제 이미지 경로
  alt="박 코팅"
  width={400}
  height={400}
/>
```

#### 형압 가공 (128-134줄)
```tsx
<Image
  src="/embossing.jpg"         // 실제 이미지 경로
  alt="형압 가공"
  width={400}
  height={400}
/>
```

### 5. CSS 스타일 조정 (선택사항)

**파일: `app/services/services.module.css`**

이미지 스타일 커스터마이징:
```css
.serviceImage {
  width: 100%;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border-radius: 10px;        /* 둥근 모서리 */
  overflow: hidden;            /* 이미지가 둥근 모서리를 넘지 않도록 */
}

/* 이미지에 그림자 효과 추가 */
.serviceImage img {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.serviceImage img:hover {
  transform: scale(1.05);      /* 호버 시 확대 효과 */
}
```

### 6. 이미지 최적화 팁

1. **이미지 압축**: TinyPNG, Squoosh 등으로 압축
2. **WebP 형식 사용**: 더 작은 파일 크기
3. **lazy loading**: `priority` 속성 제거하여 필요할 때만 로드

```tsx
<Image
  src="/uv-coating.jpg"
  alt="UV 코팅"
  width={400}
  height={400}
  // priority 제거 → 자동 lazy loading
  loading="lazy"
/>
```

### 7. 외부 이미지 URL 사용 (선택사항)

클라우드 저장소(CDN)에서 이미지 사용:
```tsx
<Image
  src="https://your-image-storage.com/uv-coating.jpg"
  alt="UV 코팅"
  width={400}
  height={400}
/>
```

**중요**: `next.config.js`에 외부 도메인 등록 필요:
```js
module.exports = {
  images: {
    domains: ['your-image-storage.com'],
  },
}
```

---

## 📝 요약

1. ✅ 이미지 파일을 `public` 폴더에 저장
2. ✅ `app/services/page.tsx` 파일에서 `src="/이미지파일명.jpg"` 수정
3. ✅ `width`와 `height` 속성을 실제 이미지 크기에 맞게 조정
4. ✅ (선택) CSS로 스타일 조정

## 예시

**실제 촬영한 UV 코팅 이미지가 `uv-coating-real.jpg`인 경우:**

```tsx
<Image
  src="/uv-coating-real.jpg"    // public 폴더의 파일명
  alt="실제 UV 코팅 작업 샘플"
  width={600}                    // 이미지 실제 너비
  height={600}                   // 이미지 실제 높이
  priority
  style={{ width: '100%', height: 'auto' }}
/>
```


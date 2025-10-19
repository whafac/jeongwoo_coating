# 🚀 Vercel 배포 가이드 (3분 완성!)

## 왜 Next.js + Vercel인가?

✅ **무료 영구 사용** - 슬립모드 없음!  
✅ **자동 HTTPS** - SSL 인증서 자동 발급  
✅ **초고속 배포** - GitHub 푸시 → 30초 후 배포 완료  
✅ **무제한 대역폭** - 트래픽 제한 없음  
✅ **전 세계 CDN** - 빠른 속도  
✅ **자동 재배포** - 코드 수정 시 자동 배포  

---

## 📝 Vercel 배포 단계

### 1단계: Vercel 가입 (30초)

1. https://vercel.com 접속
2. **"Sign Up"** 클릭
3. **"Continue with GitHub"** 선택
4. GitHub 계정으로 로그인

### 2단계: 새 프로젝트 만들기 (1분)

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. **"Import Git Repository"** 섹션에서 저장소 찾기
3. **"whafac/jeongwoo_coating"** 선택
4. **"Import"** 클릭

### 3단계: 프로젝트 설정 (30초)

**자동 감지됨!** Vercel이 자동으로 Next.js를 인식합니다.

확인 항목:
```
Framework Preset: Next.js
Root Directory: ./
Build Command: next build (자동)
Output Directory: .next (자동)
Install Command: npm install (자동)
```

**아무것도 수정하지 않아도 됩니다!**

### 4단계: 배포! (1분)

**"Deploy"** 버튼 클릭!

배포 진행:
- 🔵 Building... (30-60초)
- 🟢 Deployed! (완료)

---

## 🌐 배포 완료!

### 생성된 URL

배포 완료 후 다음 형식의 URL이 생성됩니다:

```
https://jeongwoo-coating.vercel.app
```

또는

```
https://jeongwoo-coating-xxxxx.vercel.app
```

**이 URL을 누구나 접속 가능합니다!**

---

## 📱 모든 페이지 URL

| 페이지 | URL |
|--------|-----|
| **홈** | https://jeongwoo-coating.vercel.app/ |
| **코팅서비스** | https://jeongwoo-coating.vercel.app/services |
| **작업프로세스** | https://jeongwoo-coating.vercel.app/process |
| **작업사례** | https://jeongwoo-coating.vercel.app/portfolio |
| **회사소개** | https://jeongwoo-coating.vercel.app/about |
| **문의하기** | https://jeongwoo-coating.vercel.app/contact |

---

## 🔄 자동 재배포

코드를 수정하고 GitHub에 푸시하면:

```bash
git add .
git commit -m "내용 수정"
git push
```

**30초 후 자동으로 재배포됩니다!**

---

## 🌟 커스텀 도메인 연결 (선택사항)

실제 도메인(예: jeongwoo.co.kr)을 연결하려면:

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Domains** 클릭
3. 도메인 입력 (예: jeongwoo.co.kr)
4. DNS 설정 안내에 따라 도메인 등록업체에서 설정
5. 완료! (자동 HTTPS 적용)

---

## ✅ Next.js vs PHP 비교

| 항목 | Next.js + Vercel | PHP + Render |
|------|-----------------|--------------|
| **배포 시간** | 30초 | 5-10분 |
| **설정 난이도** | ⭐ 매우 쉬움 | ⭐⭐⭐⭐ 어려움 |
| **무료 플랜** | 영구 무료 | 제한적 |
| **슬립모드** | 없음! | 15분 후 슬립 |
| **속도** | 매우 빠름 (CDN) | 보통 |
| **자동 재배포** | ✅ | ✅ |
| **HTTPS** | 자동 | 자동 |

---

## 💬 도움이 필요하시면

Vercel 배포 중 문제가 있다면:

1. Vercel 대시보드 → 프로젝트 → **Deployments** → 로그 확인
2. 에러 메시지 복사해서 문의

---

**지금 바로 https://vercel.com 에서 배포해보세요!** 🚀


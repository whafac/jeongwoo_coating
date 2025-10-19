# 정우특수코팅 배포 가이드

## GitHub 저장소 연결

```bash
# 1. GitHub 원격 저장소 추가 (본인의 저장소 URL로 변경)
git remote add origin https://github.com/YOUR_USERNAME/jeongwoo_coating.git

# 2. 파일 추가
git add .

# 3. 커밋
git commit -m "Initial commit: 정우특수코팅 웹사이트"

# 4. GitHub에 푸시
git branch -M main
git push -u origin main
```

## 배포 옵션

CodeIgniter 4는 PHP 프레임워크이므로 PHP를 지원하는 호스팅이 필요합니다.

### 옵션 1: Render.com (무료, 추천)

**장점:**
- 무료 플랜 제공
- GitHub 연동 자동 배포
- SSL 인증서 자동 제공
- 설정이 간단

**단점:**
- 무료 플랜은 15분 비활성 후 슬립모드 (첫 접속 시 느림)

**배포 방법:**
1. https://render.com 가입
2. "New +" → "Web Service" 선택
3. GitHub 저장소 연결
4. 설정:
   - Name: `jeongwoo-coating`
   - Environment: `PHP`
   - Build Command: `composer install`
   - Start Command: `php spark serve --host=0.0.0.0 --port=$PORT`
5. "Create Web Service" 클릭

### 옵션 2: Railway.app (무료 크레딧)

**장점:**
- GitHub 자동 배포
- 초기 $5 무료 크레딧
- 빠른 속도

**배포 방법:**
1. https://railway.app 가입
2. "New Project" → "Deploy from GitHub repo"
3. jeongwoo_coating 선택
4. 자동 배포 완료

### 옵션 3: 한국 호스팅 (유료, 안정적)

**Cafe24, 가비아, 호스팅케이알 등:**
- 월 1,000~5,000원
- 한국 서버로 빠른 속도
- 안정적인 서비스
- FTP로 파일 업로드

**배포 방법:**
1. 호스팅 신청
2. FTP로 파일 업로드 (public 폴더 내용을 public_html로)
3. 데이터베이스 설정
4. `.env` 파일 수정

### 옵션 4: 000webhost (무료, 제한적)

**장점:**
- 완전 무료
- PHP, MySQL 지원

**단점:**
- 1시간 비활성 시 슬립모드
- 광고 표시
- 제한적인 리소스

## 필요한 설정 파일

### 1. Procfile (Render, Railway용)
```
web: php spark serve --host=0.0.0.0 --port=$PORT
```

### 2. render.yaml (Render용)
```yaml
services:
  - type: web
    name: jeongwoo-coating
    env: php
    buildCommand: composer install
    startCommand: php spark serve --host=0.0.0.0 --port=$PORT
```

### 3. .env (배포 시 수정 필요)
```env
CI_ENVIRONMENT = production
app.baseURL = 'https://your-domain.com/'
app.forceGlobalSecureRequests = true
```

## 추천 배포 방법

**무료로 시작:** Render.com
**본격 운영:** Cafe24, 가비아 등 한국 호스팅

## 주의사항

1. `.env` 파일은 GitHub에 올리지 마세요 (보안)
2. `writable/` 폴더 권한 확인 (777)
3. 데이터베이스 연결 정보 업데이트
4. production 환경에서는 디버그 모드 비활성화


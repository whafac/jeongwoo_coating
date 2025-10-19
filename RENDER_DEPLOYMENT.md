# Render.com 배포 가이드

## 🚀 Render.com에서 정우특수코팅 배포하기

### 1단계: Render.com 접속 및 로그인
- https://render.com 접속
- **Sign Up with GitHub** 또는 기존 계정으로 로그인

### 2단계: 새 Web Service 생성
1. 대시보드에서 **"New +"** 버튼 클릭
2. **"Web Service"** 선택
3. GitHub 저장소 연결 허용 (처음이라면)
4. **"jeongwoo_coating"** 저장소 찾아서 **Connect** 클릭

### 3단계: 서비스 설정

#### 기본 설정
```
Name: jeongwoo-coating
Region: Singapore (or Oregon - 한국과 가까운 지역)
Branch: main
Root Directory: (비워두기)
Environment: PHP
```

#### Build & Deploy
```
Build Command: composer install --no-dev --optimize-autoloader
Start Command: php spark serve --host=0.0.0.0 --port=$PORT
```

#### Instance Type
```
Instance Type: Free
```

### 4단계: 환경 변수 추가 (Advanced 섹션)

**Environment Variables** 섹션에서 추가:

| Key | Value |
|-----|-------|
| `CI_ENVIRONMENT` | `production` |
| `app.baseURL` | `https://jeongwoo-coating.onrender.com/` |

### 5단계: Create Web Service

**"Create Web Service"** 버튼 클릭!

---

## 📊 배포 상태 확인

### 배포 로그 보기
1. Render 대시보드에서 `jeongwoo-coating` 서비스 클릭
2. **"Logs"** 탭에서 실시간 로그 확인
3. 다음과 같은 메시지가 나오면 성공:
   ```
   CodeIgniter development server started on http://0.0.0.0:$PORT
   ```

### 배포 시간
- **첫 배포**: 3-10분 소요
- **이후 배포**: 2-5분 소요

### 배포 상태
- 🔵 **Building**: 빌드 중
- 🟢 **Live**: 배포 완료, 접속 가능
- 🔴 **Failed**: 배포 실패 (로그 확인 필요)

---

## 🔍 문제 해결

### Not Found (404) 에러

**원인:**
1. 배포가 아직 진행 중
2. 빌드 실패
3. Start Command 오류

**해결:**
1. Render 대시보드 → Logs 확인
2. 빌드 로그에서 에러 확인
3. 에러가 있다면:
   - `composer install` 실패 → PHP 버전 확인
   - Start Command 오류 → 명령어 재확인

### 500 Internal Server Error

**원인:**
- 환경 변수 미설정
- 파일 권한 문제

**해결:**
1. Environment Variables 확인
2. `CI_ENVIRONMENT=production` 설정 확인

### 15분 후 슬립모드

**무료 플랜 제한:**
- 15분 비활성 시 슬립모드 진입
- 첫 접속 시 10-30초 대기 (자동 깨어남)

**해결:**
- 유료 플랜 업그레이드 ($7/월)
- 또는 다른 호스팅 사용

---

## 🌟 배포 완료 후 접속 URL

```
https://jeongwoo-coating.onrender.com
```

### 페이지 목록
- 홈: https://jeongwoo-coating.onrender.com/
- 코팅서비스: https://jeongwoo-coating.onrender.com/services
- 작업프로세스: https://jeongwoo-coating.onrender.com/process
- 작업사례: https://jeongwoo-coating.onrender.com/portfolio
- 회사소개: https://jeongwoo-coating.onrender.com/about
- 문의하기: https://jeongwoo-coating.onrender.com/contact

---

## 🔄 자동 배포

GitHub에 푸시하면 자동으로 재배포됩니다:

```bash
git add .
git commit -m "Update website"
git push
```

Render가 자동으로 감지하고 재배포합니다!

---

## 💡 다음 단계

1. **로그 확인**: Render 대시보드에서 배포 상태 확인
2. **테스트**: 모든 페이지 정상 작동 확인
3. **도메인 연결**: jeongwoo.co.kr 같은 커스텀 도메인 (선택사항)

---

## ⚠️ 현재 상태 확인 방법

Render 대시보드에서:
1. **Events** 탭: 배포 히스토리
2. **Logs** 탭: 실시간 로그
3. **Settings** 탭: 설정 수정

배포 중이라면 "Building..." 또는 "Deploying..." 표시됩니다.


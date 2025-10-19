# 정우특수코팅 홍보 웹사이트

정우특수코팅의 공식 홍보 웹사이트입니다. CodeIgniter 4 프레임워크를 기반으로 제작되었습니다.

## 프로젝트 소개

정우특수코팅은 인쇄코팅 후가공 전문 업체로, UV 코팅, 라미네이팅, 박 코팅, 형압 가공 등 다양한 후가공 서비스를 제공합니다.

## 기술 스택

- **프레임워크**: CodeIgniter 4
- **언어**: PHP 8.1+
- **데이터베이스**: MySQL/MariaDB
- **프론트엔드**: HTML5, CSS3, JavaScript (Vanilla)
- **반응형**: Mobile-First Design

## 주요 기능

- 반응형 웹 디자인 (모바일, 태블릿, 데스크톱)
- 햄버거 메뉴 (모바일 화면)
- 서비스 소개 페이지
- 작업 프로세스 안내
- 포트폴리오/작업 사례
- 회사 소개
- 온라인 문의 폼

## 설치 방법

### 1. 요구사항

- PHP 8.1 이상
- Composer
- MySQL 5.7 이상 또는 MariaDB 10.3 이상
- Apache 또는 Nginx 웹 서버

### 2. 설치 단계

```bash
# 1. 프로젝트 클론 또는 다운로드
cd /path/to/jeongwoo_coating

# 2. Composer 의존성 설치
composer install

# 3. 환경 설정 파일 생성
cp env .env

# 4. .env 파일 수정 (데이터베이스 설정 등)
nano .env

# 5. 데이터베이스 생성
mysql -u root -p
CREATE DATABASE jeongwoo_coating CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
exit;

# 6. 마이그레이션 실행
php spark migrate

# 7. 개발 서버 실행
php spark serve
```

### 3. 웹 서버 설정

#### Apache (.htaccess 사용)

`.htaccess` 파일은 이미 포함되어 있습니다. `mod_rewrite` 모듈이 활성화되어 있는지 확인하세요.

#### Nginx

```nginx
server {
    listen 80;
    server_name jeongwoo.co.kr;
    root /path/to/jeongwoo_coating/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## 프로젝트 구조

```
jeongwoo_coating/
├── app/
│   ├── Config/          # 설정 파일
│   ├── Controllers/     # 컨트롤러
│   ├── Models/          # 모델
│   ├── Views/           # 뷰 파일
│   │   ├── layouts/     # 레이아웃
│   │   └── pages/       # 페이지
│   └── Database/        # 마이그레이션, 시드
├── public/              # 공개 폴더 (웹 루트)
│   ├── index.php        # 프론트 컨트롤러
│   └── .htaccess        # Apache 설정
├── writable/            # 캐시, 로그, 세션
└── vendor/              # Composer 패키지
```

## 페이지 구성

- **홈** (`/`): 메인 페이지
- **코팅서비스** (`/services`): UV코팅, 라미네이팅, 박, 형압 소개
- **작업프로세스** (`/process`): 4단계 작업 과정 안내
- **작업사례** (`/portfolio`): 포트폴리오 및 실적
- **회사소개** (`/about`): 회사 정보 및 비전
- **문의하기** (`/contact`): 온라인 문의 폼

## 데이터베이스

### contacts 테이블

문의 내용을 저장하는 테이블입니다.

```sql
CREATE TABLE contacts (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    company VARCHAR(100) NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME NULL,
    updated_at DATETIME NULL
);
```

## 개발 가이드

### 새 페이지 추가하기

1. `app/Controllers/Home.php`에 메서드 추가
2. `app/Config/Routes.php`에 라우트 추가
3. `app/Views/pages/`에 뷰 파일 생성
4. `app/Views/layouts/main.php`의 네비게이션에 링크 추가

### 스타일 커스터마이징

모든 스타일은 `app/Views/layouts/main.php`의 `<style>` 태그 내에 정의되어 있습니다.

CSS 변수를 수정하여 쉽게 색상을 변경할 수 있습니다:

```css
:root {
    --primary-color: #2C5F8D;
    --accent-color: #E67E22;
    /* ... */
}
```

## 배포

### 프로덕션 설정

1. `.env` 파일에서 환경을 `production`으로 변경
2. 데이터베이스 설정 업데이트
3. `app.baseURL` 설정을 실제 도메인으로 변경
4. `forceGlobalSecureRequests`를 `true`로 설정 (HTTPS 사용 시)

```env
CI_ENVIRONMENT = production
app.baseURL = 'https://jeongwoo.co.kr/'
app.forceGlobalSecureRequests = true
```

## 라이선스

© 2025 정우특수코팅. All rights reserved.

## 지원

문의사항이 있으시면 아래로 연락주세요:

- 전화: 02-XXXX-XXXX
- 이메일: info@jeongwoo.co.kr
- 주소: 서울시 XX구 XX동


# 정우특수코팅 웹사이트 설치 가이드

## 빠른 시작 가이드

이 가이드는 정우특수코팅 웹사이트를 로컬 개발 환경에서 실행하는 방법을 안내합니다.

## 1. 시스템 요구사항

### 필수 요구사항
- **PHP**: 8.1 이상
- **Composer**: 최신 버전
- **데이터베이스**: MySQL 5.7+ 또는 MariaDB 10.3+
- **웹 서버**: Apache 2.4+ (mod_rewrite 활성화) 또는 Nginx

### 권장 사항
- PHP 확장: intl, mbstring, json, mysqlnd
- PHP 메모리 제한: 최소 256MB

## 2. 설치 단계

### Step 1: Composer 의존성 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다:

```bash
cd /Users/hoon/projects/jeongwoo_coating
composer install
```

만약 `composer.lock` 파일이 없다면:

```bash
composer update
```

### Step 2: 환경 설정 파일 구성

`.env` 파일이 이미 생성되어 있습니다. 필요에 따라 수정하세요:

```bash
nano .env
```

주요 설정 항목:

```env
# 환경 설정
CI_ENVIRONMENT = development

# 애플리케이션 URL
app.baseURL = 'http://localhost:8080/'

# 데이터베이스 설정
database.default.hostname = localhost
database.default.database = jeongwoo_coating
database.default.username = root
database.default.password = 
database.default.DBDriver = MySQLi
database.default.port = 3306
```

### Step 3: 데이터베이스 생성

MySQL/MariaDB에 접속하여 데이터베이스를 생성합니다:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE jeongwoo_coating CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
exit;
```

### Step 4: 데이터베이스 마이그레이션 실행

테이블을 생성하기 위해 마이그레이션을 실행합니다:

```bash
php spark migrate
```

성공 메시지가 표시되면 정상적으로 완료된 것입니다.

### Step 5: 개발 서버 실행

내장 개발 서버를 실행합니다:

```bash
php spark serve
```

또는 특정 포트로 실행:

```bash
php spark serve --port=8080
```

브라우저에서 다음 URL로 접속합니다:
```
http://localhost:8080
```

## 3. 웹 서버 설정

### Apache 설정

`.htaccess` 파일이 이미 포함되어 있으므로 `mod_rewrite` 모듈만 활성화하면 됩니다:

```bash
# Ubuntu/Debian
sudo a2enmod rewrite
sudo systemctl restart apache2

# CentOS/RHEL
# httpd.conf 파일에서 LoadModule rewrite_module 확인
sudo systemctl restart httpd
```

VirtualHost 설정 예시:

```apache
<VirtualHost *:80>
    ServerName jeongwoo.local
    DocumentRoot /Users/hoon/projects/jeongwoo_coating/public
    
    <Directory /Users/hoon/projects/jeongwoo_coating/public>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/jeongwoo_error.log
    CustomLog ${APACHE_LOG_DIR}/jeongwoo_access.log combined
</VirtualHost>
```

### Nginx 설정

Nginx 설정 파일 예시:

```nginx
server {
    listen 80;
    server_name jeongwoo.local;
    root /Users/hoon/projects/jeongwoo_coating/public;

    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

## 4. 권한 설정

`writable` 디렉토리에 쓰기 권한을 부여합니다:

```bash
chmod -R 777 writable/
```

프로덕션 환경에서는 더 제한적인 권한을 사용하세요:

```bash
chmod -R 755 writable/
chown -R www-data:www-data writable/
```

## 5. 기본 데이터 확인

웹사이트가 정상적으로 동작하는지 확인하세요:

1. 홈페이지 접속: `http://localhost:8080/`
2. 각 메뉴 확인:
   - 코팅서비스
   - 작업프로세스
   - 작업사례
   - 회사소개
   - 문의하기

3. 문의 폼 테스트:
   - `/contact` 페이지에서 문의 폼 작성
   - 제출 후 데이터베이스에 저장되는지 확인

```bash
mysql -u root -p jeongwoo_coating
SELECT * FROM contacts;
```

## 6. 문제 해결

### Composer 오류

**문제**: `composer install` 시 오류 발생

**해결**:
```bash
composer diagnose
composer clear-cache
composer install --no-scripts
```

### 데이터베이스 연결 오류

**문제**: "Unable to connect to the database"

**해결**:
1. `.env` 파일의 데이터베이스 설정 확인
2. MySQL 서비스 실행 상태 확인
3. 데이터베이스 사용자 권한 확인

```sql
GRANT ALL PRIVILEGES ON jeongwoo_coating.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### 404 에러 발생

**문제**: 모든 페이지에서 404 에러 발생

**해결**:
1. Apache: `mod_rewrite` 모듈 활성화 확인
2. `.htaccess` 파일 존재 확인
3. `AllowOverride All` 설정 확인

### 권한 오류

**문제**: "Unable to write to writable directory"

**해결**:
```bash
# 개발 환경
chmod -R 777 writable/

# 프로덕션 환경
chown -R www-data:www-data writable/
chmod -R 755 writable/
```

## 7. 개발 팁

### 디버그 모드

`.env` 파일에서 환경을 `development`로 설정하면 상세한 에러 메시지를 볼 수 있습니다:

```env
CI_ENVIRONMENT = development
```

### 캐시 클리어

```bash
php spark cache:clear
```

### 라우트 확인

```bash
php spark routes
```

### 데이터베이스 초기화

```bash
# 모든 마이그레이션 롤백
php spark migrate:rollback

# 다시 마이그레이션 실행
php spark migrate
```

## 8. 다음 단계

- 회사 정보 수정: `app/Views/layouts/main.php`의 footer 부분
- 연락처 정보 업데이트: `app/Views/pages/about.php`, `contact.php`
- 색상 테마 변경: `app/Views/layouts/main.php`의 CSS 변수
- 이미지 추가: `public/images/` 디렉토리에 실제 이미지 업로드

## 9. 프로덕션 배포

프로덕션 환경에 배포하기 전:

1. `.env` 파일 업데이트:
```env
CI_ENVIRONMENT = production
app.baseURL = 'https://jeongwoo.co.kr/'
app.forceGlobalSecureRequests = true
```

2. 디버그 모드 비활성화
3. 데이터베이스 백업 설정
4. HTTPS 인증서 설치
5. 보안 헤더 설정

## 지원

문제가 발생하면 다음을 참조하세요:

- CodeIgniter 4 공식 문서: https://codeigniter.com/user_guide/
- 프로젝트 README: `README.md`

또는 문의:
- 이메일: info@jeongwoo.co.kr
- 전화: 02-XXXX-XXXX


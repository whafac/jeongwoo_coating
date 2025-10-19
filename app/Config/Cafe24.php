<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Cafe24 extends BaseConfig
{
    /**
     * 카페24 호스팅 환경 설정
     */
    
    /**
     * 카페24 서버 정보
     */
    public string $serverHost = 'whafac0730.cafe24.com';
    public string $ftpHost = 'whafac0730.cafe24.com';
    public int $ftpPort = 21;
    public string $ftpUsername = 'whafac0730';
    public string $ftpPassword = 'whafac*2025';
    
    /**
     * 데이터베이스 정보
     */
    public string $dbHost = 'localhost';
    public string $dbName = 'whafac0730';
    public string $dbUsername = 'whafac0730';
    public string $dbPassword = 'whafac*2025';
    public int $dbPort = 3306;
    public string $dbCharset = 'utf8mb4';
    public string $dbCollation = 'utf8mb4_general_ci';
    
    /**
     * 도메인 설정
     */
    public array $domains = [
        'hubcns.com' => [
            'type' => 'production',
            'ssl' => false, // SSL 인증서 설치 전까지 false
            'www_redirect' => true,
            'base_url' => 'http://hubcns.com/',
        ],
        'www.hubcns.com' => [
            'type' => 'production',
            'ssl' => false, // SSL 인증서 설치 전까지 false
            'www_redirect' => false,
            'base_url' => 'http://hubcns.com/',
        ],
        'whafac0730.mycafe24.com' => [
            'type' => 'staging',
            'ssl' => false, // SSL 인증서 설치 전까지 false
            'www_redirect' => false,
            'base_url' => 'http://whafac0730.mycafe24.com/',
        ],
    ];
    
    /**
     * 파일 권한 설정
     */
    public array $filePermissions = [
        'writable' => 0755,
        'cache' => 0755,
        'logs' => 0755,
        'session' => 0755,
        'uploads' => 0755,
        'app' => 0755,
        'public' => 0755,
        'index_php' => 0644,
        'htaccess' => 0644,
    ];
    
    /**
     * PHP 설정
     */
    public array $phpSettings = [
        'memory_limit' => '256M',
        'max_execution_time' => 30,
        'max_input_time' => 60,
        'post_max_size' => '64M',
        'upload_max_filesize' => '64M',
        'max_file_uploads' => 20,
        'date.timezone' => 'Asia/Seoul',
    ];
    
    /**
     * 보안 설정
     */
    public array $security = [
        'force_https' => false, // SSL 인증서 설치 전까지 false
        'hide_server_info' => true,
        'disable_directory_browsing' => true,
        'enable_csrf_protection' => true,
        'session_secure' => false, // HTTP 환경에서는 false
        'session_httponly' => true,
        'session_samesite' => 'Lax', // HTTP 환경에서는 Lax로 설정
    ];
    
    /**
     * 성능 설정
     */
    public array $performance = [
        'enable_gzip' => true,
        'enable_caching' => true,
        'cache_duration' => 3600, // 1시간
        'enable_opcache' => true,
        'opcache_memory' => 128,
        'opcache_max_files' => 4000,
    ];
    
    /**
     * 이메일 설정
     */
    public array $email = [
        'protocol' => 'smtp',
        'smtp_host' => 'smtp.cafe24.com',
        'smtp_port' => 587,
        'smtp_user' => 'noreply@hubcns.com',
        'smtp_pass' => 'whafac*2025',
        'smtp_crypto' => 'tls',
        'mailtype' => 'html',
        'charset' => 'utf-8',
        'wordwrap' => true,
    ];
    
    /**
     * 로깅 설정
     */
    public array $logging = [
        'threshold' => 4, // ERROR 레벨
        'log_path' => WRITEPATH . 'logs/',
        'log_file' => 'log-' . date('Y-m-d') . '.log',
        'log_php_errors' => true,
        'log_database_queries' => false,
    ];
    
    /**
     * 현재 도메인 설정 반환
     */
    public function getCurrentDomainConfig(): array
    {
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        
        // www 제거
        $host = str_replace('www.', '', $host);
        
        // 포트 번호 제거
        $host = explode(':', $host)[0];
        
        // 정확한 도메인 매치
        if (isset($this->domains[$host])) {
            return $this->domains[$host];
        }
        
        // 부분 매치
        foreach ($this->domains as $domain => $config) {
            if (strpos($host, $domain) !== false) {
                return $config;
            }
        }
        
        // 기본값
        return $this->domains['whafac0730.mycafe24.com'];
    }
    
    /**
     * 카페24 환경인지 확인
     */
    public function isCafe24Environment(): bool
    {
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        return strpos($host, 'cafe24.com') !== false || strpos($host, 'mycafe24.com') !== false;
    }
    
    /**
     * 프로덕션 환경인지 확인
     */
    public function isProductionEnvironment(): bool
    {
        $config = $this->getCurrentDomainConfig();
        return $config['type'] === 'production';
    }
    
    /**
     * SSL 사용 여부 확인
     */
    public function isSSLEnabled(): bool
    {
        $config = $this->getCurrentDomainConfig();
        return $config['ssl'] ?? false;
    }
    
    /**
     * www 리다이렉트 필요 여부 확인
     */
    public function needsWwwRedirect(): bool
    {
        $config = $this->getCurrentDomainConfig();
        return $config['www_redirect'] ?? false;
    }
}

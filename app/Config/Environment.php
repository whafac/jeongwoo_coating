<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Environment extends BaseConfig
{
    /**
     * 현재 환경 설정
     */
    public string $environment = 'production';

    /**
     * 도메인별 환경 설정
     */
    public array $domainConfigs = [
        'hubcns.com' => [
            'environment' => 'production',
            'baseURL' => 'https://hubcns.com/',
            'forceHTTPS' => true,
            'debug' => false,
            'cache' => true,
            'compression' => true,
        ],
        'whafac0730.mycafe24.com' => [
            'environment' => 'production',
            'baseURL' => 'https://whafac0730.mycafe24.com/',
            'forceHTTPS' => true,
            'debug' => false,
            'cache' => true,
            'compression' => true,
        ],
        'localhost' => [
            'environment' => 'development',
            'baseURL' => 'http://localhost/',
            'forceHTTPS' => false,
            'debug' => true,
            'cache' => false,
            'compression' => false,
        ],
    ];

    /**
     * 프로덕션 환경 설정
     */
    public function __construct()
    {
        parent::__construct();
        
        // 현재 도메인 감지
        $currentDomain = $this->detectCurrentDomain();
        
        // 도메인별 설정 적용
        if (isset($this->domainConfigs[$currentDomain])) {
            $config = $this->domainConfigs[$currentDomain];
            $this->environment = $config['environment'];
            
            // 환경별 설정 적용
            if ($this->environment === 'production') {
                // 에러 표시 비활성화
                error_reporting(0);
                ini_set('display_errors', 0);
                
                // 로그 활성화
                ini_set('log_errors', 1);
                ini_set('error_log', WRITEPATH . 'logs/php_errors.log');
                
                // 성능 최적화
                ini_set('opcache.enable', 1);
                ini_set('opcache.memory_consumption', 128);
                ini_set('opcache.max_accelerated_files', 4000);
            } else {
                // 개발 환경
                error_reporting(E_ALL);
                ini_set('display_errors', 1);
                ini_set('log_errors', 1);
            }
        }
    }

    /**
     * 현재 도메인 감지
     */
    private function detectCurrentDomain(): string
    {
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        
        // www 제거
        $host = str_replace('www.', '', $host);
        
        // 포트 번호 제거
        $host = explode(':', $host)[0];
        
        // 허용된 도메인인지 확인
        foreach (array_keys($this->domainConfigs) as $domain) {
            if (strpos($host, $domain) !== false) {
                return $domain;
            }
        }
        
        return 'localhost';
    }

    /**
     * 환경별 설정 반환
     */
    public function getEnvironmentConfig(): array
    {
        $currentDomain = $this->detectCurrentDomain();
        
        if (isset($this->domainConfigs[$currentDomain])) {
            return $this->domainConfigs[$currentDomain];
        }
        
        return [
            'environment' => 'development',
            'debug' => true,
            'cache' => false,
            'compression' => false,
        ];
    }

    /**
     * 현재 도메인 반환
     */
    public function getCurrentDomain(): string
    {
        return $this->detectCurrentDomain();
    }
}

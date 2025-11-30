/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    esmExternals: false
  },
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config, { isServer }) => {
    // 서버 사이드에서만 pdf-parse 관련 모듈 처리
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'pdf-parse': 'commonjs pdf-parse',
        'pdfjs-dist': 'commonjs pdfjs-dist'
      });
    }
    
    // pdf-parse 관련 모듈을 클라이언트 번들에서 제외
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    
    return config;
  }
};

module.exports = nextConfig;

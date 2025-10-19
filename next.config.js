/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    esmExternals: false
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;

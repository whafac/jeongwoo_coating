import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    esmExternals: false
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
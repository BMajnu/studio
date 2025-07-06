const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    APP_VERSION: process.env.npm_package_version,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [],
  },
  experimental: {
    // Allow server actions from the browser preview and other development origins
    allowedDevOrigins: ['http://localhost:9002', 'http://127.0.0.1:*'],
    // Increase server action timeout and payload limits
    serverActions: {
      bodySizeLimit: '50mb', // Increase from default 4mb to 50mb
    },
  },
  // External packages moved from experimental to root config
  serverExternalPackages: ['canvas'],
  serverRuntimeConfig: {
    port: 9003,
  },
  // Session storage configuration
  publicRuntimeConfig: {
    sessionStorageConfig: {
      // Limit session size to prevent quota issues
      maxSessionSize: 1024 * 1024, // 1MB max session size
      compressSession: true,       // Enable compression for large sessions
    }
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

const path = require('path');

// Normalize NODE_ENV to avoid Next.js non-standard warning during dev.
if (!['development', 'production', 'test'].includes(process.env.NODE_ENV || '')) {
  console.warn(
    `⚠ Detected non-standard NODE_ENV ("${process.env.NODE_ENV}"). ` +
    'Forcing it to "development" to keep Next.js happy.'
  );
  process.env.NODE_ENV = 'development';
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    APP_VERSION: process.env.npm_package_version,
    ENABLE_FIREBASE_MONITORING: process.env.ENABLE_FIREBASE_MONITORING || 'false',
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

// Conditionally apply custom webpack settings only when Turbopack is NOT being used (e.g. production build).
if (!process.env.TURBOPACK) {
  /**
   * @param {import('webpack').Configuration} config
   */
  nextConfig.webpack = (config) => {
    // Suppress warnings triggered by dynamic requires in 3rd-party libs we cannot control.
    config.ignoreWarnings = [
      // @opentelemetry/instrumentation: dynamic dependency expression
      {
        module: /@opentelemetry[\\/]instrumentation/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
      // handlebars: require.extensions usage
      {
        module: /handlebars[\\/]lib[\\/]index\.js/,
        message: /require\.extensions is not supported by webpack/,
      },
      // Ignore font loading issues
      {
        message: /Can't resolve '@vercel\/turbopack-next\/internal\/font\/google\/font'/,
      },
    ];

    // Ensure resolve is defined
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Stub optional Genkit Firebase plugin to avoid module-not-found
      '@genkit-ai/firebase': path.resolve(__dirname, 'src/shims/genkit-firebase-stub.ts'),
      // Fix for pdfjs-dist
      'pdfjs-dist/build/pdf.worker.entry': 'pdfjs-dist/build/pdf.worker.mjs'
    };

    // Fix for pdfjs-dist canvas dependency
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      fs: false,
    };

    return config;
  };
}

module.exports = nextConfig;

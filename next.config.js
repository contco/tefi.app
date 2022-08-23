const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const nextConfig = {
  env: {
    SERVER_END_POINT: process.env.SERVER_END_POINT,
    DGRAPH_API_KEY: process.env.DGRAPH_API_KEY,
    DGRAPH_API_URL: process.env.DGRAPH_API_URL,
    ADDRESS: process.env.ADDRESS,
    FILTER_POST_UST: process.env.FILTER_POST_UST,
  },
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    runtimeCaching,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    });

    return config;
  },
  images: {
    domains: ['storage.googleapis.com'],
  },
};

module.exports = process.env.NODE_ENV === 'production' ? withPWA(nextConfig) : nextConfig;
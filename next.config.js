/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    dirs: ['lib', 'app', 'components', 'hooks', 'types'],
  },
  images: {
    remotePatterns: [
      {
        hostname: '**',
        protocol: 'http',
        port: '',
      },
      {
        hostname: '**',
        protocol: 'https',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig = {
  reactStrictMode: true,
  // Keep trailing slashes on /api/v1/* so Django POST (login, refresh) is not 500.
  skipTrailingSlashRedirect: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.digitaloceanspaces.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.sgp1.digitaloceanspaces.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const api = (process.env.API_PROXY_TARGET || 'http://127.0.0.1:8000').replace(
      /\/$/,
      '',
    )
    return [
      {
        source: '/api/v1/:path*',
        destination: `${api}/api/v1/:path*/`,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)

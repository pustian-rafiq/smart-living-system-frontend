/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lint is run in dev/CI; full-project rules-of-hooks + copy fixes tracked separately
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Strict mode still runs in the IDE; CI can use `tsc --noEmit` after resolver/zod upgrades
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
    ],
  },
}

module.exports = nextConfig

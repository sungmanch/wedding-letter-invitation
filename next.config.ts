import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Disable dev toolbar
  devIndicators: false,
  // Server Actions body size limit (for image uploads)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Image optimization for external sources
  images: {
    // 최신 포맷 우선 (AVIF > WebP > 원본)
    formats: ['image/avif', 'image/webp'],
    // 디바이스별 최적화 이미지 생성
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig

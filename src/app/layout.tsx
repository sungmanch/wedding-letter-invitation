import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/providers/AuthProvider'
import { KakaoScript } from '@/components/KakaoScript'

export const metadata: Metadata = {
  title: {
    default: '청모장 - 청첩장 모임 준비 서비스',
    template: '%s | 청모장',
  },
  description:
    '예비 신부를 위한 청첩장 모임 준비 서비스. URL 하나로 친구들의 취향을 수집하고 AI가 최적의 식당을 추천합니다.',
  keywords: ['청첩장 모임', '결혼 전 친구 모임', '신부 친구 모임 식당', '청모', '웨딩'],
  authors: [{ name: '청모장' }],
  creator: '청모장',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '청모장',
    title: '청모장 - 청첩장 모임 준비 서비스',
    description:
      '예비 신부를 위한 청첩장 모임 준비 서비스. URL 하나로 친구들의 취향을 수집하고 AI가 최적의 식당을 추천합니다.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FFB6C1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          <div className="mobile-container min-h-screen">{children}</div>
        </AuthProvider>
        <KakaoScript />
      </body>
    </html>
  )
}

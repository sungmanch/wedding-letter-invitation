import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/providers/AuthProvider'
import { KakaoScript } from '@/components/KakaoScript'

export const metadata: Metadata = {
  title: {
    default: '모바일 청첩장 - AI가 만들어주는 나만의 청첩장',
    template: '%s | 모바일 청첩장',
  },
  description:
    'AI가 당신만의 특별한 청첩장을 디자인해드립니다. 대화하듯 쉽게 만들고, 카카오톡으로 바로 공유하세요.',
  keywords: ['모바일 청첩장', '청첩장 만들기', 'AI 청첩장', '웨딩 초대장', '결혼 청첩장'],
  authors: [{ name: '청모장' }],
  creator: '청모장',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '모바일 청첩장',
    title: '모바일 청첩장 - AI가 만들어주는 나만의 청첩장',
    description:
      'AI가 당신만의 특별한 청첩장을 디자인해드립니다. 대화하듯 쉽게 만들고, 카카오톡으로 바로 공유하세요.',
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
          <div className="wedding-desktop-container min-h-screen">{children}</div>
        </AuthProvider>
        <KakaoScript />
      </body>
    </html>
  )
}

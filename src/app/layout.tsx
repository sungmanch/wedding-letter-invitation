import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/providers/AuthProvider'
import { KakaoScript } from '@/components/KakaoScript'

export const metadata: Metadata = {
  title: {
    default: 'Maison de Letter - AI가 만들어주는 나만의 청첩장',
    template: '%s | Maison de Letter',
  },
  description:
    'AI가 당신만의 특별한 청첩장을 디자인해드립니다. 대화하듯 쉽게 만들고, 카카오톡으로 바로 공유하세요.',
  keywords: ['모바일 청첩장', '청첩장 만들기', 'AI 청첩장', '웨딩 초대장', '결혼 청첩장', 'Maison de Letter'],
  authors: [{ name: 'Maison de Letter' }],
  creator: 'Maison de Letter',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'Maison de Letter',
    title: 'Maison de Letter - AI가 만들어주는 나만의 청첩장',
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

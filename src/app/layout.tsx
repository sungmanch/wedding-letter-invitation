import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/providers/AuthProvider'
import { KakaoScript } from '@/components/KakaoScript'

const BASE_URL = 'https://maisondeletter.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Maison de Letter - 당신만의 이야기를 담은 청첩장',
    template: '%s | Maison de Letter',
  },
  description:
    '템플릿을 선택하고 섹션을 꾸며 나만의 청첩장을 완성하세요. 모바일 청첩장 제작부터 카카오톡 공유까지, 간편하게 웨딩 초대장을 만들 수 있습니다.',
  keywords: [
    '모바일 청첩장',
    '청첩장 만들기',
    '웨딩 초대장',
    '결혼 청첩장',
    '모바일 청첩장 제작',
    '무료 청첩장',
    '카카오톡 청첩장',
    '디지털 청첩장',
    'Maison de Letter',
  ],
  authors: [{ name: 'Maison de Letter' }],
  creator: 'Maison de Letter',
  publisher: 'Maison de Letter',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: BASE_URL,
    siteName: 'Maison de Letter',
    title: 'Maison de Letter - 당신만의 이야기를 담은 청첩장',
    description:
      '템플릿을 선택하고 섹션을 꾸며 나만의 청첩장을 완성하세요. 모바일 청첩장 제작부터 카카오톡 공유까지.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maison de Letter - 당신만의 이야기를 담은 청첩장',
    description: '템플릿을 선택하고 섹션을 꾸며 나만의 청첩장을 완성하세요.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    // Google Search Console 등록 후 추가
    // google: 'verification-code',
    // Naver Webmaster 등록 후 추가
    // other: { 'naver-site-verification': 'verification-code' },
  },
}

// JSON-LD 구조화 데이터 (Organization + WebSite + SoftwareApplication)
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Maison de Letter',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Maison de Letter',
      description: '당신만의 이야기를 담은 청첩장',
      publisher: { '@id': `${BASE_URL}/#organization` },
      inLanguage: 'ko-KR',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Maison de Letter',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'KRW',
      },
      description:
        '템플릿을 선택하고 섹션을 꾸며 나만의 청첩장을 완성하세요. 모바일 청첩장 제작 서비스.',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '150',
      },
    },
    // FAQ 스키마 (AEO 최적화 - AI가 답변할 수 있는 구조화된 질문/답변)
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '모바일 청첩장은 어떻게 만드나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Maison de Letter에서 템플릿을 선택하고, 섹션별로 원하는 디자인을 고른 후, 웨딩 정보를 입력하면 나만의 모바일 청첩장이 완성됩니다. 완성된 청첩장은 카카오톡으로 바로 공유할 수 있습니다.',
          },
        },
        {
          '@type': 'Question',
          name: '모바일 청첩장 제작 비용은 얼마인가요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Maison de Letter는 기본 기능을 무료로 제공합니다. 프리미엄 템플릿과 추가 기능은 유료로 이용 가능합니다.',
          },
        },
        {
          '@type': 'Question',
          name: '청첩장에 어떤 정보를 넣을 수 있나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '신랑신부 정보, 결혼식 일시와 장소, 오시는 길(지도), 갤러리 사진, 축의금 계좌 정보, 방명록, RSVP 참석 여부 확인 등 다양한 섹션을 추가할 수 있습니다.',
          },
        },
      ],
    },
  ],
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
      <head>
        {/* JSON-LD 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Template Fonts - Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Calistoga&family=Inknut+Antiqua:wght@300;400;500;600;700&family=Kodchasan:wght@200;300;400;500;600;700&family=Alata&family=Bangers&family=Outfit:wght@100;200;300;400;500;600;700;800;900&family=The+Nautigal:wght@400;700&family=Nanum+Brush+Script&family=Nanum+Pen+Script&family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Sans+KR:wght@100;300;400;500;700;900&family=Noto+Serif+KR:wght@200;300;400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
        {/* NanumSquare - jsDelivr CDN */}
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/moonspam/NanumSquare@2.0/nanumsquare.css"
        />
        {/* Pretendard - jsDelivr CDN */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          <div className="wedding-desktop-container min-h-screen">{children}</div>
        </AuthProvider>
        <KakaoScript />
      </body>
    </html>
  )
}

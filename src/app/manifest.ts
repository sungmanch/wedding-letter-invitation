import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Maison de Letter - 나만의 청첩장',
    short_name: 'Maison de Letter',
    description:
      '당신만의 이야기를 담은 청첩장. 템플릿을 선택하고 섹션을 꾸며 특별한 웨딩 초대장을 만드세요.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFBF5',
    theme_color: '#FFB6C1',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['lifestyle', 'social'],
    lang: 'ko',
  }
}

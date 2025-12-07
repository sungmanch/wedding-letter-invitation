/**
 * Gallery Section - 기본 템플릿
 * 웨딩 사진 갤러리
 */

import type { Screen } from '../../schema/layout'

export const galleryTemplate: Screen = {
  id: 'gallery',
  name: '갤러리',
  type: 'gallery',
  sectionType: 'gallery',
  root: {
    id: 'gallery-root',
    type: 'container',
    style: {
      padding: 24,
      backgroundColor: '#fff',
    },
    children: [
      {
        id: 'gallery-title',
        type: 'text',
        props: {
          content: '갤러리',
          as: 'h2',
        },
        style: {
          fontSize: 24,
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 24,
          color: '#333',
        },
      },
      {
        id: 'gallery-grid',
        type: 'gallery',
        props: {
          images: '{{photos.gallery}}',
          layout: 'masonry',
          columns: 2,
          gap: 8,
          aspectRatio: 'auto',
          lightbox: true,
        },
        style: {
          borderRadius: 8,
          overflow: 'hidden',
        },
      },
    ],
  },
}

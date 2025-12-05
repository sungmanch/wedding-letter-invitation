/**
 * Super Editor - Gallery Section Skeleton
 * 갤러리 섹션
 */

import type { SectionSkeleton } from '../types'

export const gallerySkeleton: SectionSkeleton = {
  sectionType: 'gallery',
  name: '갤러리',
  description: '웨딩 사진 갤러리를 표시합니다.',
  defaultVariant: 'grid',
  variants: [
    // ============================================
    // Grid Variant
    // ============================================
    {
      id: 'grid',
      name: '그리드',
      description: '균일한 그리드 레이아웃',
      tags: ['minimal', 'clean', 'modern'],
      structure: {
        id: 'gallery-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'gallery-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'gallery-title',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.displayMd.fontFamily',
                  fontSize: '$token.typography.displayMd.fontSize',
                  fontWeight: '$token.typography.displayMd.fontWeight',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: '갤러리',
                  as: 'h2',
                },
              },
              {
                id: 'gallery-grid',
                type: 'gallery',
                tokenStyle: {
                  borderRadius: '$token.borders.radiusMd',
                },
                props: {
                  images: '{{photos.gallery}}',
                  layout: 'grid',
                  columns: 3,
                  gap: 4,
                  aspectRatio: '1:1',
                  objectFit: 'cover',
                  onClick: 'lightbox',
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'gallery-images',
          path: 'photos.gallery',
          type: 'images',
          required: true,
          description: '갤러리 이미지 배열',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
          { id: 'stagger', name: '순차 등장', preset: 'stagger', trigger: 'inView', duration: 600 },
        ],
        layouts: [
          { id: '2col', name: '2열', props: { columns: 2 } },
          { id: '3col', name: '3열', props: { columns: 3 } },
          { id: '4col', name: '4열', props: { columns: 4 } },
        ],
      },
    },

    // ============================================
    // Masonry Variant
    // ============================================
    {
      id: 'masonry',
      name: '메이슨리',
      description: '불규칙한 높이의 메이슨리 레이아웃',
      tags: ['elegant', 'dynamic', 'artistic'],
      structure: {
        id: 'gallery-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'gallery-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'gallery-title',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.displayMd.fontFamily',
                  fontSize: '$token.typography.displayMd.fontSize',
                  fontWeight: '$token.typography.displayMd.fontWeight',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: '갤러리',
                  as: 'h2',
                },
              },
              {
                id: 'gallery-masonry',
                type: 'masonry',
                tokenStyle: {
                  borderRadius: '$token.borders.radiusSm',
                },
                props: {
                  images: '{{photos.gallery}}',
                  columns: 2,
                  gap: 8,
                  objectFit: 'cover',
                  onClick: 'lightbox',
                  animation: 'fade-in',
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'gallery-images',
          path: 'photos.gallery',
          type: 'images',
          required: true,
          description: '갤러리 이미지 배열',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'stagger', name: '순차 등장', preset: 'stagger', trigger: 'inView', duration: 600 },
          { id: 'scale', name: '스케일 인', preset: 'scale-in', trigger: 'inView', duration: 500 },
        ],
        layouts: [
          { id: '2col', name: '2열', props: { columns: 2 } },
          { id: '3col', name: '3열', props: { columns: 3 } },
        ],
      },
    },

    // ============================================
    // Carousel Variant
    // ============================================
    {
      id: 'carousel',
      name: '캐러셀',
      description: '슬라이드 형태의 갤러리',
      tags: ['playful', 'interactive', 'modern'],
      structure: {
        id: 'gallery-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'gallery-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'gallery-title',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.displayMd.fontFamily',
                  fontSize: '$token.typography.displayMd.fontSize',
                  fontWeight: '$token.typography.displayMd.fontWeight',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: '갤러리',
                  as: 'h2',
                },
              },
              {
                id: 'gallery-carousel',
                type: 'carousel',
                tokenStyle: {
                  borderRadius: '$token.borders.radiusLg',
                },
                style: {
                  overflow: 'hidden',
                },
                props: {
                  images: '{{photos.gallery}}',
                  aspectRatio: '4:3',
                  objectFit: 'cover',
                  autoplay: true,
                  autoplayInterval: 4000,
                  infinite: true,
                  showDots: true,
                  showArrows: false,
                  effect: 'slide',
                  onClick: 'lightbox',
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'gallery-images',
          path: 'photos.gallery',
          type: 'images',
          required: true,
          description: '갤러리 이미지 배열',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
        ],
        layouts: [
          { id: 'slide', name: '슬라이드', props: { effect: 'slide' } },
          { id: 'fade', name: '페이드', props: { effect: 'fade' } },
          { id: 'coverflow', name: '커버플로우', props: { effect: 'coverflow' } },
        ],
      },
    },
  ],
}

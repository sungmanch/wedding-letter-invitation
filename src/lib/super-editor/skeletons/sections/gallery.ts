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
                  fontFamily: '$token.typography.sectionTitle.fontFamily',
                  fontSize: '$token.typography.sectionTitle.fontSize',
                  fontWeight: '$token.typography.sectionTitle.fontWeight',
                  letterSpacing: '$token.typography.sectionTitle.letterSpacing',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
                  textTransform: 'uppercase',
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
    // Grid Seamless Variant (여백 없는 꽉 찬 그리드)
    // ============================================
    {
      id: 'grid-seamless',
      name: '꽉 찬 그리드',
      description: '여백 없이 꽉 채워진 인스타그램 스타일 그리드',
      tags: ['instagram', 'seamless', 'modern', 'full-bleed'],
      structure: {
        id: 'gallery-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
        },
        children: [
          {
            id: 'gallery-content',
            type: 'column',
            children: [
              {
                id: 'gallery-title',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.sectionTitle.fontFamily',
                  fontSize: '$token.typography.sectionTitle.fontSize',
                  fontWeight: '$token.typography.sectionTitle.fontWeight',
                  letterSpacing: '$token.typography.sectionTitle.letterSpacing',
                  color: '$token.colors.text.primary',
                  padding: '$token.spacing.lg',
                },
                style: {
                  textAlign: 'center',
                  textTransform: 'uppercase',
                },
                props: {
                  content: '갤러리',
                  as: 'h2',
                },
              },
              {
                id: 'gallery-grid-seamless',
                type: 'gallery',
                style: {
                  borderRadius: 0,
                },
                props: {
                  images: '{{photos.gallery}}',
                  layout: 'grid',
                  columns: 3,
                  gap: 0,
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
                  fontFamily: '$token.typography.sectionTitle.fontFamily',
                  fontSize: '$token.typography.sectionTitle.fontSize',
                  fontWeight: '$token.typography.sectionTitle.fontWeight',
                  letterSpacing: '$token.typography.sectionTitle.letterSpacing',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
                  textTransform: 'uppercase',
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
                  fontFamily: '$token.typography.sectionTitle.fontFamily',
                  fontSize: '$token.typography.sectionTitle.fontSize',
                  fontWeight: '$token.typography.sectionTitle.fontWeight',
                  letterSpacing: '$token.typography.sectionTitle.letterSpacing',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
                  textTransform: 'uppercase',
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
                  effect: '{{gallery.effect}}',
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
        {
          id: 'gallery-effect',
          path: 'gallery.effect',
          type: 'select',
          required: false,
          defaultValue: 'slide',
          description: '캐러셀 전환 효과',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
        ],
      },
    },

    // ============================================
    // Film Strip Variant (필름 롤 스타일)
    // ============================================
    {
      id: 'film-strip',
      name: '필름 스트립',
      description: '복고풍 영화 필름 롤 스타일 갤러리',
      tags: ['retro', 'cinematic', 'vintage', 'film'],
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
                  fontFamily: '$token.typography.sectionTitle.fontFamily',
                  fontSize: '$token.typography.sectionTitle.fontSize',
                  fontWeight: '$token.typography.sectionTitle.fontWeight',
                  letterSpacing: '$token.typography.sectionTitle.letterSpacing',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
                  textTransform: 'uppercase',
                },
                props: {
                  content: '갤러리',
                  as: 'h2',
                },
              },
              {
                id: 'gallery-film-strip',
                type: 'carousel',
                style: {
                  overflow: 'hidden',
                  position: 'relative',
                },
                props: {
                  images: '{{photos.gallery}}',
                  aspectRatio: '3:4',
                  objectFit: 'cover',
                  autoplay: true,
                  autoplayInterval: 3000,
                  infinite: true,
                  showDots: false,
                  showArrows: false,
                  effect: '{{gallery.effect}}',
                  slidesToShow: 2,
                  spacing: 12,
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
        {
          id: 'gallery-effect',
          path: 'gallery.effect',
          type: 'select',
          required: false,
          defaultValue: 'film-strip',
          description: '갤러리 전환 효과',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
        ],
      },
    },

    // ============================================
    // Vertical Swipe Variant (샘플 2-4.png 참고)
    // ============================================
    {
      id: 'vertical-swipe',
      name: '세로형 스와이프',
      description: '세로형 풀 이미지 스와이프 갤러리',
      tags: ['fullscreen', 'immersive', 'elegant'],
      structure: {
        id: 'gallery-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
        },
        children: [
          {
            id: 'gallery-content',
            type: 'column',
            children: [
              {
                id: 'gallery-title',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.sectionTitle.fontFamily',
                  fontSize: '$token.typography.sectionTitle.fontSize',
                  fontWeight: '$token.typography.sectionTitle.fontWeight',
                  letterSpacing: '$token.typography.sectionTitle.letterSpacing',
                  color: '$token.colors.text.primary',
                  padding: '$token.spacing.lg',
                },
                style: {
                  textAlign: 'center',
                  textTransform: 'uppercase',
                },
                props: {
                  content: '갤러리',
                  as: 'h2',
                },
              },
              {
                id: 'gallery-swiper',
                type: 'carousel',
                style: {
                  width: '100%',
                },
                props: {
                  images: '{{photos.gallery}}',
                  direction: 'vertical',
                  aspectRatio: '3:4',
                  objectFit: 'cover',
                  fullWidth: true,
                  autoplay: false,
                  infinite: true,
                  showDots: true,
                  showArrows: false,
                  effect: 'slide',
                  onClick: 'lightbox',
                  spaceBetween: 0,
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
          { id: '3:4', name: '3:4 비율', props: { aspectRatio: '3:4' } },
          { id: '4:5', name: '4:5 비율', props: { aspectRatio: '4:5' } },
          { id: '9:16', name: '9:16 비율', props: { aspectRatio: '9:16' } },
        ],
      },
    },
  ],
}

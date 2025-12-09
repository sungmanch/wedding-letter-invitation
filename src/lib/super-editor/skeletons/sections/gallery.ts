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
    // Elegant Dark Variant (다크 배경 + 필기체 타이틀)
    // ============================================
    {
      id: 'elegant-dark',
      name: '엘레건트 다크',
      description: '다크 배경에 필기체 타이틀과 둥근 그리드',
      tags: ['dark', 'elegant', 'script', 'luxury'],
      structure: {
        id: 'gallery-root',
        type: 'container',
        style: {
          backgroundColor: '#1a1a1a',
          padding: '48px 0',
        },
        children: [
          {
            id: 'gallery-content',
            type: 'column',
            style: {
              gap: '8px',
              alignItems: 'center',
            },
            children: [
              {
                id: 'gallery-title',
                type: 'text',
                style: {
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '42px',
                  fontWeight: '400',
                  fontStyle: 'italic',
                  color: '#ffffff',
                  textAlign: 'center',
                  marginBottom: '4px',
                },
                props: {
                  content: 'Gallery',
                  as: 'h2',
                },
              },
              {
                id: 'gallery-subtitle',
                type: 'text',
                style: {
                  fontSize: '13px',
                  fontWeight: '300',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textAlign: 'center',
                  marginBottom: '24px',
                },
                props: {
                  content: '클릭하면 확대가 가능합니다',
                  as: 'p',
                },
              },
              {
                id: 'gallery-grid-dark',
                type: 'gallery',
                style: {
                  padding: '0 4px',
                },
                props: {
                  images: '{{photos.gallery}}',
                  layout: 'grid',
                  columns: 3,
                  gap: 4,
                  aspectRatio: '3:4',
                  objectFit: 'cover',
                  borderRadius: 8,
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
    // Accordion Stack Variant (클릭 확장)
    // ============================================
    {
      id: 'accordion-stack',
      name: '아코디언 스택',
      description: '클릭하면 이미지가 확장되는 세로 스택 갤러리',
      tags: ['interactive', 'film', 'elegant', 'dark'],
      structure: {
        id: 'gallery-root',
        type: 'container',
        style: {
          backgroundColor: '#1a1a1a',
        },
        children: [
          {
            id: 'gallery-content',
            type: 'column',
            style: {
              alignItems: 'center',
            },
            children: [
              {
                id: 'gallery-header',
                type: 'column',
                style: {
                  padding: '48px 24px 24px',
                  alignItems: 'center',
                  gap: '8px',
                },
                children: [
                  {
                    id: 'gallery-title',
                    type: 'text',
                    style: {
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '38px',
                      fontWeight: '400',
                      fontStyle: 'italic',
                      color: '#ffffff',
                      textAlign: 'center',
                    },
                    props: {
                      content: 'Film Photos',
                      as: 'h2',
                    },
                  },
                  {
                    id: 'gallery-subtitle',
                    type: 'text',
                    style: {
                      fontSize: '13px',
                      fontWeight: '300',
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                    },
                    props: {
                      content: '클릭하면 확장이 가능합니다',
                      as: 'p',
                    },
                  },
                ],
              },
              {
                id: 'gallery-accordion',
                type: 'accordion-stack',
                style: {
                  width: '100%',
                },
                props: {
                  images: '{{photos.gallery}}',
                  collapsedHeight: 140,
                  expandedHeight: 320,
                  gap: 4,
                  duration: 400,
                  onClick: 'expand',
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
          { id: 'compact', name: '컴팩트', props: { collapsedHeight: 100, expandedHeight: 250 } },
          { id: 'normal', name: '보통', props: { collapsedHeight: 140, expandedHeight: 320 } },
          { id: 'tall', name: '크게', props: { collapsedHeight: 180, expandedHeight: 400 } },
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
    // Coverflow Dark Variant (3D 카드 캐러셀)
    // ============================================
    {
      id: 'coverflow-dark',
      name: '커버플로우 다크',
      description: '다크 배경의 3D 카드 스타일 캐러셀',
      tags: ['3d', 'coverflow', 'dark', 'elegant', 'cards'],
      structure: {
        id: 'gallery-root',
        type: 'container',
        style: {
          backgroundColor: '#1a1a1a',
          padding: '48px 0 24px',
        },
        children: [
          {
            id: 'gallery-content',
            type: 'column',
            style: {
              gap: '16px',
              alignItems: 'center',
            },
            children: [
              {
                id: 'gallery-header',
                type: 'column',
                style: {
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                },
                children: [
                  {
                    id: 'gallery-title',
                    type: 'text',
                    style: {
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '32px',
                      fontWeight: '400',
                      fontStyle: 'italic',
                      color: '#ffffff',
                      textAlign: 'center',
                      lineHeight: '1.2',
                    },
                    props: {
                      content: 'Self Snapshots',
                      as: 'h2',
                    },
                  },
                  {
                    id: 'gallery-subtitle',
                    type: 'text',
                    style: {
                      fontSize: '13px',
                      fontWeight: '300',
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                    },
                    props: {
                      content: '클릭하면 확대가 가능합니다',
                      as: 'p',
                    },
                  },
                ],
              },
              {
                id: 'gallery-coverflow',
                type: 'carousel',
                style: {
                  width: '100%',
                  minHeight: '400px',
                },
                props: {
                  images: '{{photos.gallery}}',
                  aspectRatio: '3:4',
                  objectFit: 'cover',
                  autoplay: false,
                  infinite: true,
                  showDots: true,
                  showArrows: true,
                  effect: 'coverflow',
                  onClick: 'lightbox',
                },
              },
              {
                id: 'gallery-hint',
                type: 'text',
                style: {
                  fontSize: '13px',
                  fontWeight: '300',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textAlign: 'center',
                  marginTop: '16px',
                },
                props: {
                  content: '위아래로 스크롤하세요',
                  as: 'p',
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
      },
    },

    // ============================================
    // Film Strip Variant (무한 스크롤 + 양끝 페이드)
    // ============================================
    {
      id: 'film-strip',
      name: '필름 스트립',
      description: '양쪽이 흐릿하게 페이드되며 자동으로 흘러가는 갤러리',
      tags: ['cinematic', 'film', 'marquee', 'auto-scroll'],
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
                id: 'gallery-film-strip',
                type: 'film-strip',
                style: {
                  width: '100%',
                },
                props: {
                  images: '{{photos.gallery}}',
                  direction: 'left',
                  speed: 30,
                  gap: 12,
                  imageHeight: 200,
                  borderRadius: 12,
                  fadeWidth: 60,
                  pauseOnHover: true,
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
          { id: 'slow', name: '느리게', props: { speed: 20 } },
          { id: 'normal', name: '보통', props: { speed: 30 } },
          { id: 'fast', name: '빠르게', props: { speed: 50 } },
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

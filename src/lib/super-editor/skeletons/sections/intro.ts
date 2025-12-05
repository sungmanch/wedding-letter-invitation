/**
 * Super Editor - Intro Section Skeleton
 * 인트로 섹션 (순서 고정: 1번)
 */

import type { SectionSkeleton } from '../types'

export const introSkeleton: SectionSkeleton = {
  sectionType: 'intro',
  name: '인트로',
  description: '청첩장 첫 화면. 메인 이미지와 신랑/신부 이름, 결혼 날짜를 표시합니다.',
  defaultVariant: 'elegant',
  variants: [
    // ============================================
    // Minimal Variant
    // ============================================
    {
      id: 'minimal',
      name: '미니멀',
      description: '깔끔하고 간결한 디자인',
      tags: ['minimal', 'modern', 'clean'],
      structure: {
        id: 'intro-root',
        type: 'fullscreen',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
        },
        children: [
          {
            id: 'intro-container',
            type: 'column',
            tokenStyle: {
              padding: '$token.spacing.section',
              gap: '$token.spacing.lg',
            },
            style: {
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            },
            children: [
              {
                id: 'intro-image',
                type: 'image',
                tokenStyle: {
                  borderRadius: '$token.borders.radiusMd',
                },
                style: {
                  width: '80%',
                  maxWidth: '320px',
                },
                props: {
                  src: '{{photos.main}}',
                  aspectRatio: '3:4',
                  objectFit: 'cover',
                },
              },
              {
                id: 'intro-names',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.displayLg.fontFamily',
                  fontSize: '$token.typography.displayLg.fontSize',
                  fontWeight: '$token.typography.displayLg.fontWeight',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: '{{couple.groom.name}} & {{couple.bride.name}}',
                  as: 'h1',
                },
              },
              {
                id: 'intro-date',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.bodyMd.fontFamily',
                  fontSize: '$token.typography.bodyMd.fontSize',
                  color: '$token.colors.text.secondary',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: '{{wedding.date}}',
                  as: 'p',
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'main-photo',
          path: 'photos.main',
          type: 'image',
          required: true,
          description: '메인 사진',
        },
        {
          id: 'groom-name',
          path: 'couple.groom.name',
          type: 'text',
          required: true,
          description: '신랑 이름',
        },
        {
          id: 'bride-name',
          path: 'couple.bride.name',
          type: 'text',
          required: true,
          description: '신부 이름',
        },
        {
          id: 'wedding-date',
          path: 'wedding.date',
          type: 'date',
          required: true,
          description: '결혼 날짜',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 800 },
          { id: 'slide-up', name: '슬라이드 업', preset: 'slide-up', trigger: 'mount', duration: 600 },
        ],
      },
    },

    // ============================================
    // Elegant Variant
    // ============================================
    {
      id: 'elegant',
      name: '엘레강스',
      description: '우아하고 세련된 디자인',
      tags: ['elegant', 'luxury', 'classic'],
      structure: {
        id: 'intro-root',
        type: 'fullscreen',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
        },
        children: [
          {
            id: 'intro-bg-image',
            type: 'image',
            style: {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
            },
            props: {
              src: '{{photos.main}}',
              objectFit: 'cover',
            },
          },
          {
            id: 'intro-overlay',
            type: 'overlay',
            style: {
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
            },
            children: [
              {
                id: 'intro-content',
                type: 'column',
                tokenStyle: {
                  padding: '$token.spacing.section',
                  gap: '$token.spacing.md',
                },
                style: {
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '100%',
                  paddingBottom: '60px',
                },
                children: [
                  {
                    id: 'intro-label',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.caption.fontFamily',
                      fontSize: '$token.typography.caption.fontSize',
                    },
                    style: {
                      color: 'rgba(255,255,255,0.8)',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                    },
                    props: {
                      content: 'Wedding Invitation',
                      as: 'span',
                    },
                  },
                  {
                    id: 'intro-names',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayLg.fontFamily',
                      fontSize: '$token.typography.displayLg.fontSize',
                      fontWeight: '$token.typography.displayLg.fontWeight',
                    },
                    style: {
                      color: '#FFFFFF',
                      textAlign: 'center',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    },
                    props: {
                      content: '{{couple.groom.name}} & {{couple.bride.name}}',
                      as: 'h1',
                    },
                  },
                  {
                    id: 'intro-divider',
                    type: 'divider',
                    style: {
                      width: '60px',
                      backgroundColor: 'rgba(255,255,255,0.6)',
                    },
                    props: {
                      thickness: 1,
                    },
                  },
                  {
                    id: 'intro-date',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodyLg.fontFamily',
                      fontSize: '$token.typography.bodyLg.fontSize',
                    },
                    style: {
                      color: 'rgba(255,255,255,0.9)',
                      textAlign: 'center',
                    },
                    props: {
                      content: '{{wedding.date}} {{wedding.time}}',
                      as: 'p',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'main-photo',
          path: 'photos.main',
          type: 'image',
          required: true,
          description: '메인 사진 (전체 배경)',
        },
        {
          id: 'groom-name',
          path: 'couple.groom.name',
          type: 'text',
          required: true,
          description: '신랑 이름',
        },
        {
          id: 'bride-name',
          path: 'couple.bride.name',
          type: 'text',
          required: true,
          description: '신부 이름',
        },
        {
          id: 'wedding-date',
          path: 'wedding.date',
          type: 'date',
          required: true,
          description: '결혼 날짜',
        },
        {
          id: 'wedding-time',
          path: 'wedding.time',
          type: 'text',
          required: false,
          description: '결혼 시간',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 1000 },
          { id: 'blur', name: '블러 인', preset: 'blur-in', trigger: 'mount', duration: 800 },
        ],
      },
    },

    // ============================================
    // Romantic Variant
    // ============================================
    {
      id: 'romantic',
      name: '로맨틱',
      description: '따뜻하고 감성적인 디자인',
      tags: ['romantic', 'warm', 'cozy'],
      structure: {
        id: 'intro-root',
        type: 'fullscreen',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
        },
        children: [
          {
            id: 'intro-container',
            type: 'column',
            tokenStyle: {
              padding: '$token.spacing.xl',
              gap: '$token.spacing.lg',
            },
            style: {
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            },
            children: [
              {
                id: 'intro-frame',
                type: 'container',
                tokenStyle: {
                  borderRadius: '$token.borders.radiusFull',
                  boxShadow: '$token.shadows.lg',
                },
                style: {
                  overflow: 'hidden',
                  width: '200px',
                  height: '200px',
                },
                children: [
                  {
                    id: 'intro-image',
                    type: 'image',
                    style: {
                      width: '100%',
                      height: '100%',
                    },
                    props: {
                      src: '{{photos.main}}',
                      objectFit: 'cover',
                    },
                  },
                ],
              },
              {
                id: 'intro-text-group',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                style: {
                  alignItems: 'center',
                },
                children: [
                  {
                    id: 'intro-names',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayMd.fontFamily',
                      fontSize: '$token.typography.displayMd.fontSize',
                      fontWeight: '$token.typography.displayMd.fontWeight',
                      color: '$token.colors.brand',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '{{couple.groom.name}} ♥ {{couple.bride.name}}',
                      as: 'h1',
                    },
                  },
                  {
                    id: 'intro-message',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodyMd.fontFamily',
                      fontSize: '$token.typography.bodyMd.fontSize',
                      color: '$token.colors.text.secondary',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '저희 두 사람이 사랑으로 하나가 됩니다',
                      as: 'p',
                    },
                  },
                  {
                    id: 'intro-date',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingSm.fontFamily',
                      fontSize: '$token.typography.headingSm.fontSize',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      textAlign: 'center',
                      marginTop: '12px',
                    },
                    props: {
                      content: '{{wedding.date}}',
                      as: 'p',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'main-photo',
          path: 'photos.main',
          type: 'image',
          required: true,
          description: '메인 사진 (원형)',
        },
        {
          id: 'groom-name',
          path: 'couple.groom.name',
          type: 'text',
          required: true,
          description: '신랑 이름',
        },
        {
          id: 'bride-name',
          path: 'couple.bride.name',
          type: 'text',
          required: true,
          description: '신부 이름',
        },
        {
          id: 'wedding-date',
          path: 'wedding.date',
          type: 'date',
          required: true,
          description: '결혼 날짜',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'scale', name: '스케일 인', preset: 'scale-in', trigger: 'mount', duration: 700 },
          { id: 'bounce', name: '바운스', preset: 'bounce-in', trigger: 'mount', duration: 800 },
        ],
      },
    },
  ],
}

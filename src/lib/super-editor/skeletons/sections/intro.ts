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
                  whiteSpace: 'nowrap',
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
          {
            id: 'slide-up',
            name: '슬라이드 업',
            preset: 'slide-up',
            trigger: 'mount',
            duration: 600,
          },
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
                      whiteSpace: 'nowrap',
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
                      whiteSpace: 'nowrap',
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
                      content: '{{intro.message}}',
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
        {
          id: 'intro-message',
          path: 'intro.message',
          type: 'text',
          required: false,
          description: '인트로 문구',
          defaultValue: '저희 두 사람이 사랑으로 하나가 됩니다',
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

    // ============================================
    // Cinematic Variant (Legacy - Wong Kar-wai Style)
    // ============================================
    {
      id: 'cinematic',
      name: '시네마틱',
      description: '화양연화 스타일 - 필름 그레인, 비네트, 레드/틸 오버레이',
      tags: ['cinematic', 'dramatic', 'film', 'vintage', 'artistic'],
      structure: {
        id: 'intro-root',
        type: 'fullscreen',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
        },
        style: {
          overflow: 'hidden',
          position: 'relative',
        },
        children: [
          // 1. Background Image with flicker
          {
            id: 'intro-bg-container',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
            },
            props: {
              className: 'cinematic-flicker',
            },
            children: [
              {
                id: 'intro-bg-image',
                type: 'image',
                style: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.7) contrast(1.2) saturate(1.1)',
                },
                props: {
                  src: '{{photos.main}}',
                  objectFit: 'cover',
                },
              },
            ],
          },
          // 2. Red/Teal Gradient Overlay (화양연화 시그니처)
          {
            id: 'intro-color-overlay',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(139,38,53,0.4) 0%, rgba(139,38,53,0.3) 30%, rgba(26,77,77,0.2) 70%, rgba(0,0,0,0.6) 100%)',
              mixBlendMode: 'multiply',
            },
          },
          // 3. Gold Highlight Layer
          {
            id: 'intro-gold-highlight',
            type: 'container',
            tokenStyle: {
              background:
                'radial-gradient(ellipse at 30% 20%, $token.colors.accent 0%, transparent 50%)',
            },
            style: {
              position: 'absolute',
              inset: 0,
              opacity: 0.15,
              mixBlendMode: 'overlay',
            },
          },
          // 4. Vignette Effect
          {
            id: 'intro-vignette',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
            },
          },
          // 5. Film Grain Overlay
          {
            id: 'intro-film-grain',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            },
            props: {
              className: 'cinematic-grain',
            },
          },
          // 6. Content Layer
          {
            id: 'intro-content-layer',
            type: 'container',
            style: {
              position: 'relative',
              zIndex: 40,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '40px 24px',
            },
            children: [
              // Top Section
              {
                id: 'intro-top-section',
                type: 'row',
                style: {
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                },
                children: [
                  {
                    id: 'intro-vertical-text',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodyMd.fontFamily',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      fontSize: '12px',
                      letterSpacing: '0.15em',
                      opacity: 0.6,
                    },
                    props: {
                      content: '우리의 시작',
                    },
                  },
                  {
                    id: 'intro-wedding-label',
                    type: 'text',
                    tokenStyle: {
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      fontSize: '10px',
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      opacity: 0.5,
                    },
                    props: {
                      content: 'Wedding Ceremony',
                    },
                  },
                ],
              },
              // Middle Section (Names & Date)
              {
                id: 'intro-middle-section',
                type: 'column',
                style: {
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  marginTop: '-40px',
                },
                children: [
                  // Top decorative line
                  {
                    id: 'intro-top-line',
                    type: 'container',
                    tokenStyle: {
                      background:
                        'linear-gradient(to bottom, transparent, $token.colors.accent, transparent)',
                    },
                    style: {
                      width: '1px',
                      height: '48px',
                      marginBottom: '24px',
                      opacity: 0.6,
                    },
                  },
                  // Groom Name
                  {
                    id: 'intro-groom-name',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayLg.fontFamily',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      fontSize: '2.5rem',
                      lineHeight: 1.1,
                      fontWeight: 300,
                      letterSpacing: '0.2em',
                      textShadow:
                        '0 0 40px rgba(139,38,53,0.3), 0 0 80px rgba(139,38,53,0.2)',
                    },
                    props: {
                      content: '{{couple.groom.name}}',
                      as: 'h1',
                    },
                  },
                  // Ampersand
                  {
                    id: 'intro-ampersand',
                    type: 'text',
                    tokenStyle: {
                      color: '$token.colors.accent',
                    },
                    style: {
                      fontSize: '1.125rem',
                      letterSpacing: '0.15em',
                      margin: '12px 0',
                      opacity: 0.8,
                    },
                    props: {
                      content: '&',
                    },
                  },
                  // Bride Name
                  {
                    id: 'intro-bride-name',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayLg.fontFamily',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      fontSize: '2.5rem',
                      lineHeight: 1.1,
                      fontWeight: 300,
                      letterSpacing: '0.2em',
                      textShadow:
                        '0 0 40px rgba(139,38,53,0.3), 0 0 80px rgba(139,38,53,0.2)',
                    },
                    props: {
                      content: '{{couple.bride.name}}',
                      as: 'h1',
                    },
                  },
                  // Decorative divider
                  {
                    id: 'intro-divider',
                    type: 'row',
                    style: {
                      alignItems: 'center',
                      gap: '16px',
                      margin: '32px 0',
                    },
                    children: [
                      {
                        id: 'intro-line-left',
                        type: 'container',
                        tokenStyle: {
                          background:
                            'linear-gradient(to right, transparent, $token.colors.accent)',
                        },
                        style: {
                          width: '48px',
                          height: '1px',
                          opacity: 0.5,
                        },
                      },
                      {
                        id: 'intro-diamond',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.accent',
                        },
                        style: {
                          width: '6px',
                          height: '6px',
                          transform: 'rotate(45deg)',
                          opacity: 0.6,
                        },
                      },
                      {
                        id: 'intro-line-right',
                        type: 'container',
                        tokenStyle: {
                          background:
                            'linear-gradient(to left, transparent, $token.colors.accent)',
                        },
                        style: {
                          width: '48px',
                          height: '1px',
                          opacity: 0.5,
                        },
                      },
                    ],
                  },
                  // Date
                  {
                    id: 'intro-date',
                    type: 'text',
                    tokenStyle: {
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      fontSize: '0.875rem',
                      letterSpacing: '0.25em',
                      marginBottom: '4px',
                      opacity: 0.9,
                    },
                    props: {
                      content: '{{wedding.dateDisplay}}',
                    },
                  },
                ],
              },
              // Bottom Section
              {
                id: 'intro-bottom-section',
                type: 'column',
                tokenStyle: {
                  borderTopColor: '$token.colors.accent',
                },
                style: {
                  borderTopWidth: '1px',
                  borderTopStyle: 'solid',
                  paddingTop: '24px',
                  opacity: 0.2,
                },
                children: [
                  {
                    id: 'intro-location-label',
                    type: 'text',
                    tokenStyle: {
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      fontSize: '10px',
                      letterSpacing: '0.4em',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                      opacity: 0.4,
                    },
                    props: {
                      content: 'Location',
                    },
                  },
                  {
                    id: 'intro-venue',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodyMd.fontFamily',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      fontSize: '0.875rem',
                      letterSpacing: '0.05em',
                      opacity: 0.9,
                    },
                    props: {
                      content: '{{venue.name}}',
                    },
                  },
                ],
              },
            ],
          },
          // 7. Film Frame Edges
          {
            id: 'intro-film-edge-top',
            type: 'container',
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              zIndex: 40,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
            },
          },
          {
            id: 'intro-film-edge-bottom',
            type: 'container',
            style: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              zIndex: 40,
              background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
            },
          },
        ],
      },
      slots: [
        {
          id: 'main-photo',
          path: 'photos.main',
          type: 'image',
          required: true,
          description: '메인 사진 (영화 같은 분위기 권장)',
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
          path: 'wedding.dateDisplay',
          type: 'date',
          required: true,
          description: '결혼 날짜',
        },
        {
          id: 'venue-name',
          path: 'venue.name',
          type: 'text',
          required: false,
          description: '예식장 이름',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 1200 },
          {
            id: 'stagger',
            name: '순차 등장',
            preset: 'stagger',
            trigger: 'mount',
            duration: 1500,
          },
        ],
      },
    },

    // ============================================
    // Polaroid Variant
    // ============================================
    {
      id: 'polaroid',
      name: '폴라로이드',
      description: '레트로 감성의 폴라로이드 스타일',
      tags: ['retro', 'casual', 'fun', 'vintage'],
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
            style: {
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '40px 24px',
            },
            children: [
              {
                id: 'intro-polaroid-frame',
                type: 'container',
                style: {
                  backgroundColor: '#FFFFFF',
                  padding: '12px 12px 48px 12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
                  transform: 'rotate(-2deg)',
                },
                children: [
                  {
                    id: 'intro-image',
                    type: 'image',
                    style: {
                      width: '260px',
                      height: '260px',
                    },
                    props: {
                      src: '{{photos.main}}',
                      objectFit: 'cover',
                    },
                  },
                  {
                    id: 'intro-polaroid-text',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodyMd.fontFamily',
                      color: '$token.colors.text.secondary',
                    },
                    style: {
                      textAlign: 'center',
                      marginTop: '12px',
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                    },
                    props: {
                      content: '{{couple.groom.name}} & {{couple.bride.name}}',
                      as: 'p',
                    },
                  },
                ],
              },
              {
                id: 'intro-date-container',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.xs',
                },
                style: {
                  alignItems: 'center',
                  marginTop: '32px',
                },
                children: [
                  {
                    id: 'intro-label',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.caption.fontFamily',
                      fontSize: '$token.typography.caption.fontSize',
                      color: '$token.colors.text.muted',
                    },
                    style: {
                      letterSpacing: '0.1em',
                    },
                    props: {
                      content: 'SAVE THE DATE',
                      as: 'span',
                    },
                  },
                  {
                    id: 'intro-date',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingMd.fontFamily',
                      fontSize: '$token.typography.headingMd.fontSize',
                      fontWeight: '$token.typography.headingMd.fontWeight',
                      color: '$token.colors.text.primary',
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
          description: '메인 사진 (정사각형 권장)',
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
          { id: 'drop', name: '떨어지기', preset: 'drop-in', trigger: 'mount', duration: 600 },
          { id: 'swing', name: '흔들리기', preset: 'swing-in', trigger: 'mount', duration: 800 },
        ],
      },
    },

    // ============================================
    // Split Variant
    // ============================================
    {
      id: 'split',
      name: '스플릿',
      description: '좌우 분할로 사진과 텍스트를 나눔',
      tags: ['modern', 'unique', 'bold', 'editorial'],
      structure: {
        id: 'intro-root',
        type: 'fullscreen',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
        },
        children: [
          {
            id: 'intro-split-container',
            type: 'row',
            style: {
              height: '100%',
            },
            children: [
              {
                id: 'intro-image-half',
                type: 'container',
                style: {
                  width: '50%',
                  height: '100%',
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
                id: 'intro-text-half',
                type: 'column',
                tokenStyle: {
                  backgroundColor: '$token.colors.surface',
                  padding: '$token.spacing.lg',
                },
                style: {
                  width: '50%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: [
                  {
                    id: 'intro-text-group',
                    type: 'column',
                    tokenStyle: {
                      gap: '$token.spacing.md',
                    },
                    style: {
                      alignItems: 'flex-start',
                    },
                    children: [
                      {
                        id: 'intro-label',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.caption.fontFamily',
                          fontSize: '$token.typography.caption.fontSize',
                          color: '$token.colors.text.muted',
                        },
                        style: {
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                        },
                        props: {
                          content: 'Wedding',
                          as: 'span',
                        },
                      },
                      {
                        id: 'intro-names',
                        type: 'column',
                        tokenStyle: {
                          gap: '$token.spacing.xs',
                        },
                        children: [
                          {
                            id: 'intro-groom',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.displayMd.fontFamily',
                              fontSize: '$token.typography.displayMd.fontSize',
                              fontWeight: '$token.typography.displayMd.fontWeight',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '{{couple.groom.name}}',
                              as: 'h1',
                            },
                          },
                          {
                            id: 'intro-bride',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.displayMd.fontFamily',
                              fontSize: '$token.typography.displayMd.fontSize',
                              fontWeight: '$token.typography.displayMd.fontWeight',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '{{couple.bride.name}}',
                              as: 'h1',
                            },
                          },
                        ],
                      },
                      {
                        id: 'intro-divider',
                        type: 'divider',
                        tokenStyle: {
                          backgroundColor: '$token.colors.border',
                        },
                        style: {
                          width: '40px',
                        },
                        props: {
                          thickness: 2,
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
        ],
      },
      slots: [
        {
          id: 'main-photo',
          path: 'photos.main',
          type: 'image',
          required: true,
          description: '메인 사진 (세로형 권장)',
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
          {
            id: 'slide',
            name: '슬라이드',
            preset: 'slide-left',
            trigger: 'mount',
            duration: 800,
          },
          {
            id: 'reveal',
            name: '순차 공개',
            preset: 'stagger',
            trigger: 'mount',
            duration: 1000,
          },
        ],
      },
    },

    // ============================================
    // Magazine Variant (Legacy - Vogue Cover Style)
    // ============================================
    {
      id: 'magazine',
      name: '매거진',
      description: 'Vogue 커버 스타일 - MAISON 마스트헤드 + 좌측 정렬 + 골드 라인',
      tags: ['editorial', 'chic', 'trendy', 'fashion', 'luxury'],
      structure: {
        id: 'intro-root',
        type: 'fullscreen',
        style: {
          backgroundColor: '#0A0A0A',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // 1. Full bleed photo background
          {
            id: 'intro-bg-container',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
            },
            children: [
              {
                id: 'intro-bg-image',
                type: 'image',
                style: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.9) contrast(1.05)',
                },
                props: {
                  src: '{{photos.main}}',
                  objectFit: 'cover',
                },
              },
            ],
          },
          // 2. Bottom gradient for text readability
          {
            id: 'intro-bottom-gradient',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 25%, transparent 50%)',
            },
          },
          // 3. Top gradient for masthead
          {
            id: 'intro-top-gradient',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%)',
            },
          },
          // 4. Content Layer
          {
            id: 'intro-content-layer',
            type: 'container',
            style: {
              position: 'relative',
              zIndex: 10,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px',
            },
            children: [
              // Masthead - Top
              {
                id: 'intro-masthead',
                type: 'row',
                style: {
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                },
                children: [
                  // MAISON logo
                  {
                    id: 'intro-logo',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayLg.fontFamily',
                    },
                    style: {
                      fontSize: '1.125rem',
                      fontWeight: 300,
                      letterSpacing: '0.4em',
                      textTransform: 'uppercase',
                      color: '#FFFFFF',
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    },
                    props: {
                      content: 'MAISON',
                      as: 'h1',
                    },
                  },
                  // Special Issue label
                  {
                    id: 'intro-special-issue',
                    type: 'text',
                    style: {
                      fontSize: '7px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      opacity: 0.8,
                      color: '#FFFFFF',
                    },
                    props: {
                      content: 'Special Issue',
                    },
                  },
                ],
              },
              // Main Title - Bottom Left
              {
                id: 'intro-main-title',
                type: 'column',
                style: {
                  alignItems: 'flex-start',
                },
                children: [
                  // Tag line with gold line
                  {
                    id: 'intro-tagline',
                    type: 'row',
                    style: {
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    },
                    children: [
                      {
                        id: 'intro-gold-line',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.accent',
                        },
                        style: {
                          width: '24px',
                          height: '1px',
                        },
                      },
                      {
                        id: 'intro-wedding-label',
                        type: 'text',
                        tokenStyle: {
                          color: '$token.colors.accent',
                        },
                        style: {
                          fontSize: '7px',
                          letterSpacing: '0.3em',
                          textTransform: 'uppercase',
                        },
                        props: {
                          content: 'Wedding',
                        },
                      },
                    ],
                  },
                  // Groom Name
                  {
                    id: 'intro-groom-name',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayLg.fontFamily',
                    },
                    style: {
                      fontSize: '1.5rem',
                      fontWeight: 300,
                      letterSpacing: '0.1em',
                      lineHeight: 1.2,
                      color: '#FFFFFF',
                      textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                    },
                    props: {
                      content: '{{couple.groom.name}}',
                      as: 'h1',
                    },
                  },
                  // Ampersand
                  {
                    id: 'intro-ampersand-row',
                    type: 'row',
                    style: {
                      alignItems: 'center',
                      gap: '8px',
                      margin: '4px 0',
                    },
                    children: [
                      {
                        id: 'intro-ampersand',
                        type: 'text',
                        tokenStyle: {
                          color: '$token.colors.accent',
                        },
                        style: {
                          fontSize: '0.875rem',
                          fontWeight: 300,
                          fontStyle: 'italic',
                        },
                        props: {
                          content: '&',
                        },
                      },
                    ],
                  },
                  // Bride Name
                  {
                    id: 'intro-bride-name',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayLg.fontFamily',
                    },
                    style: {
                      fontSize: '1.5rem',
                      fontWeight: 300,
                      letterSpacing: '0.1em',
                      lineHeight: 1.2,
                      color: '#FFFFFF',
                      textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                    },
                    props: {
                      content: '{{couple.bride.name}}',
                      as: 'h1',
                    },
                  },
                  // Date & Issue info
                  {
                    id: 'intro-date-info',
                    type: 'row',
                    style: {
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '12px',
                    },
                    children: [
                      {
                        id: 'intro-date',
                        type: 'text',
                        style: {
                          fontSize: '8px',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.8)',
                        },
                        props: {
                          content: '{{wedding.dateDisplay}}',
                        },
                      },
                      {
                        id: 'intro-date-divider',
                        type: 'container',
                        style: {
                          width: '1px',
                          height: '12px',
                          backgroundColor: 'rgba(255,255,255,0.25)',
                        },
                      },
                      {
                        id: 'intro-exclusive',
                        type: 'text',
                        tokenStyle: {
                          color: '$token.colors.accent',
                        },
                        style: {
                          fontSize: '7px',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                        },
                        props: {
                          content: 'Exclusive',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // 5. Magazine border frame
          {
            id: 'intro-border-frame',
            type: 'container',
            style: {
              position: 'absolute',
              top: '8px',
              left: '8px',
              right: '8px',
              bottom: '8px',
              pointerEvents: 'none',
              border: '1px solid rgba(255,255,255,0.08)',
            },
          },
        ],
      },
      slots: [
        {
          id: 'main-photo',
          path: 'photos.main',
          type: 'image',
          required: true,
          description: '메인 사진 (화보 스타일 권장)',
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
          path: 'wedding.dateDisplay',
          type: 'date',
          required: true,
          description: '결혼 날짜',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 800 },
          { id: 'zoom', name: '줌 인', preset: 'zoom-in', trigger: 'mount', duration: 1000 },
        ],
      },
    },

    // ============================================
    // Typewriter Variant
    // ============================================
    {
      id: 'typewriter',
      name: '타자기',
      description: '빈티지한 타자기 스타일',
      tags: ['vintage', 'literary', 'nostalgic', 'story'],
      structure: {
        id: 'intro-root',
        type: 'fullscreen',
        style: {
          backgroundColor: '#FDF8F3',
        },
        children: [
          {
            id: 'intro-container',
            type: 'column',
            style: {
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '40px 32px',
            },
            children: [
              {
                id: 'intro-paper',
                type: 'container',
                style: {
                  backgroundColor: '#FFFFFF',
                  padding: '40px 32px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  maxWidth: '320px',
                  width: '100%',
                },
                children: [
                  {
                    id: 'intro-content',
                    type: 'column',
                    style: {
                      alignItems: 'center',
                      gap: '24px',
                    },
                    children: [
                      {
                        id: 'intro-header',
                        type: 'text',
                        style: {
                          fontFamily: '"Courier New", monospace',
                          fontSize: '12px',
                          color: '#666666',
                          letterSpacing: '0.3em',
                          textTransform: 'uppercase',
                        },
                        props: {
                          content: '— Wedding Invitation —',
                          as: 'span',
                        },
                      },
                      {
                        id: 'intro-image',
                        type: 'image',
                        tokenStyle: {
                          borderRadius: '$token.borders.radiusSm',
                        },
                        style: {
                          width: '100%',
                          aspectRatio: '4/3',
                        },
                        props: {
                          src: '{{photos.main}}',
                          objectFit: 'cover',
                        },
                      },
                      {
                        id: 'intro-names',
                        type: 'text',
                        style: {
                          fontFamily: '"Courier New", monospace',
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#333333',
                          textAlign: 'center',
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                        },
                        props: {
                          content: '{{couple.groom.name}} & {{couple.bride.name}}',
                          as: 'h1',
                        },
                      },
                      {
                        id: 'intro-divider',
                        type: 'text',
                        style: {
                          fontFamily: '"Courier New", monospace',
                          fontSize: '14px',
                          color: '#999999',
                        },
                        props: {
                          content: '• • •',
                          as: 'span',
                        },
                      },
                      {
                        id: 'intro-date',
                        type: 'text',
                        style: {
                          fontFamily: '"Courier New", monospace',
                          fontSize: '14px',
                          color: '#666666',
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
          {
            id: 'typewriter',
            name: '타이핑',
            preset: 'typewriter',
            trigger: 'mount',
            duration: 2000,
          },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 800 },
        ],
      },
    },

    // ============================================
    // Floating Variant
    // ============================================
    {
      id: 'floating',
      name: '플로팅',
      description: '공중에 떠있는 듯한 가벼운 느낌',
      tags: ['airy', 'light', 'dreamy', 'soft'],
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
            style: {
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '60px 24px',
            },
            children: [
              {
                id: 'intro-floating-card',
                type: 'container',
                tokenStyle: {
                  backgroundColor: '$token.colors.surface',
                  borderRadius: '$token.borders.radiusLg',
                  boxShadow: '$token.shadows.lg',
                },
                style: {
                  padding: '32px 24px',
                  maxWidth: '300px',
                  width: '100%',
                },
                children: [
                  {
                    id: 'intro-card-content',
                    type: 'column',
                    tokenStyle: {
                      gap: '$token.spacing.lg',
                    },
                    style: {
                      alignItems: 'center',
                    },
                    children: [
                      {
                        id: 'intro-image-wrapper',
                        type: 'container',
                        tokenStyle: {
                          borderRadius: '$token.borders.radiusMd',
                          boxShadow: '$token.shadows.md',
                        },
                        style: {
                          overflow: 'hidden',
                          width: '100%',
                        },
                        children: [
                          {
                            id: 'intro-image',
                            type: 'image',
                            style: {
                              width: '100%',
                              aspectRatio: '1/1',
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
                              fontFamily: '$token.typography.headingLg.fontFamily',
                              fontSize: '$token.typography.headingLg.fontSize',
                              fontWeight: '$token.typography.headingLg.fontWeight',
                              color: '$token.colors.text.primary',
                            },
                            style: {
                              textAlign: 'center',
                              whiteSpace: 'nowrap',
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
                ],
              },
              {
                id: 'intro-scroll-hint',
                type: 'text',
                tokenStyle: {
                  color: '$token.colors.text.muted',
                },
                style: {
                  fontSize: '12px',
                  marginTop: '32px',
                  opacity: 0.6,
                },
                props: {
                  content: 'Scroll down ↓',
                  as: 'span',
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
          description: '메인 사진 (정사각형 권장)',
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
          { id: 'float', name: '떠오르기', preset: 'float', trigger: 'mount', duration: 800 },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 600 },
        ],
      },
    },

    // ============================================
    // Exhibition Variant (Legacy - Gallery Style)
    // ============================================
    {
      id: 'exhibition',
      name: '전시',
      description: '미술관 갤러리 스타일 - 중앙 액자 + 뮤지엄 플라카드',
      tags: ['gallery', 'artistic', 'minimal', 'museum', 'modern'],
      structure: {
        id: 'intro-root',
        type: 'fullscreen',
        style: {
          backgroundColor: '#111827',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // 1. Gallery Background
          {
            id: 'intro-gallery-bg',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
            },
            children: [
              {
                id: 'intro-gallery-img',
                type: 'image',
                style: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                },
                props: {
                  src: '/examples/images/gallery.png',
                  objectFit: 'cover',
                },
              },
            ],
          },
          // 2. Main Photo Frame - centered
          {
            id: 'intro-frame-container',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: '15%',
            },
            children: [
              {
                id: 'intro-photo-frame',
                type: 'container',
                style: {
                  position: 'relative',
                  width: '55%',
                  aspectRatio: '3/4',
                  overflow: 'hidden',
                  boxShadow:
                    '0 30px 60px rgba(0,0,0,0.4), 0 15px 30px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.25)',
                },
                children: [
                  {
                    id: 'intro-photo',
                    type: 'image',
                    style: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    },
                    props: {
                      src: '{{photos.main}}',
                      objectFit: 'cover',
                    },
                  },
                ],
              },
            ],
          },
          // 3. Bottom gradient overlay
          {
            id: 'intro-bottom-gradient',
            type: 'container',
            style: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '96px',
              pointerEvents: 'none',
              background:
                'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.4) 100%)',
            },
          },
          // 4. Museum Placard
          {
            id: 'intro-placard-container',
            type: 'container',
            style: {
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
            },
            children: [
              {
                id: 'intro-placard',
                type: 'container',
                style: {
                  padding: '12px 16px',
                  textAlign: 'center',
                  borderRadius: '2px',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
                children: [
                  // Names
                  {
                    id: 'intro-names-row',
                    type: 'row',
                    style: {
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    children: [
                      {
                        id: 'intro-groom-name',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayMd.fontFamily',
                        },
                        style: {
                          fontSize: '0.875rem',
                          letterSpacing: '0.025em',
                          fontWeight: 300,
                          fontStyle: 'italic',
                          color: '#1f2937',
                        },
                        props: {
                          content: '{{couple.groom.name}}',
                          as: 'h1',
                        },
                      },
                      {
                        id: 'intro-ampersand',
                        type: 'text',
                        style: {
                          fontSize: '0.875rem',
                          marginLeft: '4px',
                          marginRight: '4px',
                          color: '#9CA3AF',
                        },
                        props: {
                          content: '&',
                        },
                      },
                      {
                        id: 'intro-bride-name',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayMd.fontFamily',
                        },
                        style: {
                          fontSize: '0.875rem',
                          letterSpacing: '0.025em',
                          fontWeight: 300,
                          fontStyle: 'italic',
                          color: '#1f2937',
                        },
                        props: {
                          content: '{{couple.bride.name}}',
                          as: 'h1',
                        },
                      },
                    ],
                  },
                  // Divider
                  {
                    id: 'intro-placard-divider',
                    type: 'container',
                    style: {
                      width: '24px',
                      height: '1px',
                      backgroundColor: '#D1D5DB',
                      margin: '6px auto',
                    },
                  },
                  // Date
                  {
                    id: 'intro-date',
                    type: 'text',
                    style: {
                      fontSize: '7px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontWeight: 500,
                      color: '#374151',
                    },
                    props: {
                      content: '{{wedding.dateDisplay}}',
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
          description: '메인 사진 (3:4 비율 권장)',
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
          path: 'wedding.dateDisplay',
          type: 'date',
          required: true,
          description: '결혼 날짜',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 800 },
          { id: 'scale', name: '스케일 인', preset: 'scale-in', trigger: 'mount', duration: 700 },
        ],
      },
    },

    // ============================================
    // Gothic Variant (Legacy - Victorian Frame)
    // ============================================
    {
      id: 'gothic',
      name: '고딕 로맨스',
      description: '빅토리안 액자 스타일 - 다마스크 패턴 + 골드 프레임',
      tags: ['gothic', 'romantic', 'vintage', 'dark', 'ornate'],
      structure: {
        id: 'intro-root',
        type: 'fullscreen',
        style: {
          backgroundColor: '#0D0B0A',
          overflow: 'hidden',
          position: 'relative',
        },
        children: [
          // 1. Victorian damask wallpaper pattern
          {
            id: 'intro-wallpaper-pattern',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              opacity: 0.08,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0C25 5 30 10 30 20C30 30 25 35 20 40C15 35 10 30 10 20C10 10 15 5 20 0Z' fill='%23C9A962' fill-opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
            },
          },
          // 2. Main content
          {
            id: 'intro-main-content',
            type: 'container',
            style: {
              position: 'relative',
              zIndex: 10,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
            },
            children: [
              // Ornate Gold Frame with Photo
              {
                id: 'intro-ornate-frame',
                type: 'container',
                style: {
                  position: 'relative',
                  width: '85%',
                  aspectRatio: '3/4',
                },
                children: [
                  // Frame glow
                  {
                    id: 'intro-frame-glow',
                    type: 'container',
                    tokenStyle: {
                      background:
                        'linear-gradient(135deg, $token.colors.accent 0%, rgba(139,115,85,0.125) 50%, $token.colors.accent 100%)',
                    },
                    style: {
                      position: 'absolute',
                      top: '-4px',
                      left: '-4px',
                      right: '-4px',
                      bottom: '-4px',
                      borderRadius: '2px',
                      filter: 'blur(4px)',
                      opacity: 0.25,
                    },
                  },
                  // Frame border
                  {
                    id: 'intro-frame-border',
                    type: 'container',
                    tokenStyle: {
                      background:
                        'linear-gradient(145deg, $token.colors.accent 0%, rgba(139,115,85,1) 50%, $token.colors.accent 100%)',
                    },
                    style: {
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '2px',
                      padding: '4px',
                    },
                    children: [
                      {
                        id: 'intro-inner-shadow',
                        type: 'container',
                        style: {
                          position: 'absolute',
                          top: '4px',
                          left: '4px',
                          right: '4px',
                          bottom: '4px',
                          borderRadius: '2px',
                          backgroundColor: '#1A1412',
                          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8)',
                        },
                      },
                    ],
                  },
                  // Photo container
                  {
                    id: 'intro-photo-container',
                    type: 'container',
                    style: {
                      position: 'absolute',
                      top: '4px',
                      left: '4px',
                      right: '4px',
                      bottom: '4px',
                      overflow: 'hidden',
                      borderRadius: '2px',
                      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
                    },
                    children: [
                      {
                        id: 'intro-photo',
                        type: 'image',
                        style: {
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: 'brightness(0.85) contrast(1.05) sepia(0.15)',
                        },
                        props: {
                          src: '{{photos.main}}',
                          objectFit: 'cover',
                        },
                      },
                      // Vignette
                      {
                        id: 'intro-vignette',
                        type: 'container',
                        style: {
                          position: 'absolute',
                          inset: 0,
                          background:
                            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
                        },
                      },
                    ],
                  },
                  // Corner ornaments (4 corners)
                  {
                    id: 'intro-corner-tl',
                    type: 'container',
                    style: {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '16px',
                      height: '16px',
                    },
                    children: [
                      {
                        id: 'intro-corner-tl-h',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.accent',
                        },
                        style: {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '16px',
                          height: '4px',
                          opacity: 0.6,
                        },
                      },
                      {
                        id: 'intro-corner-tl-v',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.accent',
                        },
                        style: {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '4px',
                          height: '16px',
                          opacity: 0.6,
                        },
                      },
                    ],
                  },
                  {
                    id: 'intro-corner-tr',
                    type: 'container',
                    style: {
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '16px',
                      height: '16px',
                    },
                    children: [
                      {
                        id: 'intro-corner-tr-h',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.accent',
                        },
                        style: {
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '16px',
                          height: '4px',
                          opacity: 0.6,
                        },
                      },
                      {
                        id: 'intro-corner-tr-v',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.accent',
                        },
                        style: {
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '4px',
                          height: '16px',
                          opacity: 0.6,
                        },
                      },
                    ],
                  },
                  {
                    id: 'intro-corner-bl',
                    type: 'container',
                    style: {
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '16px',
                      height: '16px',
                    },
                    children: [
                      {
                        id: 'intro-corner-bl-h',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.accent',
                        },
                        style: {
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '16px',
                          height: '4px',
                          opacity: 0.6,
                        },
                      },
                      {
                        id: 'intro-corner-bl-v',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.accent',
                        },
                        style: {
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '4px',
                          height: '16px',
                          opacity: 0.6,
                        },
                      },
                    ],
                  },
                  {
                    id: 'intro-corner-br',
                    type: 'container',
                    style: {
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '16px',
                      height: '16px',
                    },
                    children: [
                      {
                        id: 'intro-corner-br-h',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.accent',
                        },
                        style: {
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: '16px',
                          height: '4px',
                          opacity: 0.6,
                        },
                      },
                      {
                        id: 'intro-corner-br-v',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.accent',
                        },
                        style: {
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: '4px',
                          height: '16px',
                          opacity: 0.6,
                        },
                      },
                    ],
                  },
                ],
              },
              // Gallery Placard
              {
                id: 'intro-gallery-placard',
                type: 'column',
                style: {
                  marginTop: '16px',
                  textAlign: 'center',
                  alignItems: 'center',
                },
                children: [
                  // Decorative line with diamond
                  {
                    id: 'intro-deco-line',
                    type: 'row',
                    style: {
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    },
                    children: [
                      {
                        id: 'intro-line-left',
                        type: 'container',
                        tokenStyle: {
                          background:
                            'linear-gradient(to right, transparent, $token.colors.accent)',
                        },
                        style: {
                          width: '32px',
                          height: '1px',
                          opacity: 0.6,
                        },
                      },
                      {
                        id: 'intro-diamond',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.accent',
                        },
                        style: {
                          width: '6px',
                          height: '6px',
                          transform: 'rotate(45deg)',
                          opacity: 0.8,
                        },
                      },
                      {
                        id: 'intro-line-right',
                        type: 'container',
                        tokenStyle: {
                          background:
                            'linear-gradient(to left, transparent, $token.colors.accent)',
                        },
                        style: {
                          width: '32px',
                          height: '1px',
                          opacity: 0.6,
                        },
                      },
                    ],
                  },
                  // Names
                  {
                    id: 'intro-names-row',
                    type: 'row',
                    style: {
                      alignItems: 'center',
                    },
                    children: [
                      {
                        id: 'intro-groom-name',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayMd.fontFamily',
                        },
                        style: {
                          fontSize: '1rem',
                          fontWeight: 300,
                          letterSpacing: '0.2em',
                          fontStyle: 'italic',
                          color: '#F5E6D3',
                        },
                        props: {
                          content: '{{couple.groom.name}}',
                          as: 'h1',
                        },
                      },
                      {
                        id: 'intro-ampersand',
                        type: 'text',
                        tokenStyle: {
                          color: '$token.colors.accent',
                        },
                        style: {
                          fontSize: '0.75rem',
                          marginLeft: '8px',
                          marginRight: '8px',
                        },
                        props: {
                          content: '&',
                        },
                      },
                      {
                        id: 'intro-bride-name',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayMd.fontFamily',
                        },
                        style: {
                          fontSize: '1rem',
                          fontWeight: 300,
                          letterSpacing: '0.2em',
                          fontStyle: 'italic',
                          color: '#F5E6D3',
                        },
                        props: {
                          content: '{{couple.bride.name}}',
                          as: 'h1',
                        },
                      },
                    ],
                  },
                  // Date
                  {
                    id: 'intro-date',
                    type: 'text',
                    style: {
                      fontSize: '8px',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      marginTop: '8px',
                      color: 'rgba(245,230,211,0.6)',
                    },
                    props: {
                      content: '{{wedding.dateDisplay}}',
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
          description: '메인 사진 (세피아 톤 권장)',
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
          path: 'wedding.dateDisplay',
          type: 'date',
          required: true,
          description: '결혼 날짜',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 1000 },
          { id: 'scale', name: '스케일 인', preset: 'scale-in', trigger: 'mount', duration: 800 },
        ],
      },
    },

    // ============================================
    // Old Money Variant (Legacy - Quiet Luxury)
    // ============================================
    {
      id: 'oldmoney',
      name: '올드머니',
      description: 'Quiet Luxury 스타일 - 아이보리 + 코튼 페이퍼 텍스처',
      tags: ['luxury', 'elegant', 'classic', 'cream', 'refined'],
      structure: {
        id: 'intro-root',
        type: 'fullscreen',
        style: {
          backgroundColor: '#FAF8F5',
          overflow: 'hidden',
          position: 'relative',
        },
        children: [
          // 1. Cotton paper texture
          {
            id: 'intro-paper-texture',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              opacity: 0.04,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
            },
          },
          // 2. Image section - top 65%
          {
            id: 'intro-image-section',
            type: 'container',
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '65%',
            },
            children: [
              {
                id: 'intro-main-image',
                type: 'image',
                style: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(1.05) contrast(0.92) saturate(0.7) sepia(0.15)',
                },
                props: {
                  src: '{{photos.main}}',
                  objectFit: 'cover',
                },
              },
              // Ivory tone overlay
              {
                id: 'intro-ivory-overlay',
                type: 'container',
                style: {
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(250,248,240,0.15)',
                  mixBlendMode: 'overlay',
                },
              },
              // Smooth fade to ivory
              {
                id: 'intro-fade-overlay',
                type: 'container',
                style: {
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 70%, #FAF8F5 100%)',
                },
              },
            ],
          },
          // 3. Content layer - bottom
          {
            id: 'intro-content-layer',
            type: 'container',
            style: {
              position: 'relative',
              zIndex: 10,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
              textAlign: 'center',
              padding: '32px 32px 16px',
            },
            children: [
              // Groom Name
              {
                id: 'intro-groom-name',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.displayLg.fontFamily',
                },
                style: {
                  fontSize: '1.125rem',
                  letterSpacing: '0.25em',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  color: '#2C2C2C',
                },
                props: {
                  content: '{{couple.groom.name}}',
                  as: 'h1',
                },
              },
              // "and" text
              {
                id: 'intro-and-text',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.bodyMd.fontFamily',
                },
                style: {
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  margin: '8px 0',
                  color: '#8A8580',
                },
                props: {
                  content: 'and',
                },
              },
              // Bride Name
              {
                id: 'intro-bride-name',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.displayLg.fontFamily',
                },
                style: {
                  fontSize: '1.125rem',
                  letterSpacing: '0.25em',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  color: '#2C2C2C',
                },
                props: {
                  content: '{{couple.bride.name}}',
                  as: 'h1',
                },
              },
              // Thin divider line
              {
                id: 'intro-divider',
                type: 'container',
                style: {
                  width: '40px',
                  height: '1px',
                  marginTop: '16px',
                  marginBottom: '12px',
                  backgroundColor: '#D4D0C8',
                },
              },
              // Date
              {
                id: 'intro-date',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.bodyMd.fontFamily',
                },
                style: {
                  fontSize: '8px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#8A8580',
                },
                props: {
                  content: '{{wedding.dateDisplay}}',
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
          description: '메인 사진 (밝은 톤 권장)',
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
          path: 'wedding.dateDisplay',
          type: 'date',
          required: true,
          description: '결혼 날짜',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 800 },
          {
            id: 'slide-up',
            name: '슬라이드 업',
            preset: 'slide-up',
            trigger: 'mount',
            duration: 700,
          },
        ],
      },
    },

    // ============================================
    // Monogram Variant (Legacy - Navy & Gold)
    // ============================================
    {
      id: 'monogram',
      name: '모노그램',
      description: '네이비 + 다이아몬드 패턴 + 골드 프레임',
      tags: ['classic', 'navy', 'gold', 'formal', 'traditional'],
      structure: {
        id: 'intro-root',
        type: 'fullscreen',
        style: {
          backgroundColor: '#0F2338',
          overflow: 'hidden',
          position: 'relative',
        },
        children: [
          // 1. Diamond pattern background
          {
            id: 'intro-diamond-pattern',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              opacity: 0.06,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23C5A572' fill-opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px',
            },
          },
          // 2. Content layout
          {
            id: 'intro-content-layout',
            type: 'container',
            style: {
              position: 'relative',
              zIndex: 10,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px',
            },
            children: [
              // Top decoration
              {
                id: 'intro-top-decoration',
                type: 'column',
                style: {
                  alignItems: 'center',
                  marginTop: '12px',
                  marginBottom: '12px',
                },
                children: [
                  {
                    id: 'intro-deco-row',
                    type: 'row',
                    style: {
                      alignItems: 'center',
                      gap: '8px',
                    },
                    children: [
                      {
                        id: 'intro-line-left',
                        type: 'container',
                        tokenStyle: {
                          background:
                            'linear-gradient(to right, transparent, $token.colors.accent)',
                        },
                        style: {
                          width: '24px',
                          height: '1px',
                          opacity: 0.6,
                        },
                      },
                      {
                        id: 'intro-diamond',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.accent',
                        },
                        style: {
                          width: '4px',
                          height: '4px',
                          transform: 'rotate(45deg)',
                          opacity: 0.8,
                        },
                      },
                      {
                        id: 'intro-line-right',
                        type: 'container',
                        tokenStyle: {
                          background:
                            'linear-gradient(to left, transparent, $token.colors.accent)',
                        },
                        style: {
                          width: '24px',
                          height: '1px',
                          opacity: 0.6,
                        },
                      },
                    ],
                  },
                ],
              },
              // Photo Frame
              {
                id: 'intro-photo-frame',
                type: 'container',
                style: {
                  position: 'relative',
                  flex: 1,
                  width: '90%',
                  maxHeight: '60%',
                },
                children: [
                  // Gold border frame
                  {
                    id: 'intro-gold-border',
                    type: 'container',
                    tokenStyle: {
                      borderColor: '$token.colors.accent',
                    },
                    style: {
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '2px',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    },
                  },
                  // Photo container
                  {
                    id: 'intro-photo-container',
                    type: 'container',
                    style: {
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      right: '2px',
                      bottom: '2px',
                      overflow: 'hidden',
                      borderRadius: '2px',
                    },
                    children: [
                      {
                        id: 'intro-photo',
                        type: 'image',
                        style: {
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: 'brightness(0.95) contrast(1.02)',
                        },
                        props: {
                          src: '{{photos.main}}',
                          objectFit: 'cover',
                        },
                      },
                    ],
                  },
                ],
              },
              // Bottom text
              {
                id: 'intro-bottom-text',
                type: 'column',
                style: {
                  marginTop: '12px',
                  textAlign: 'center',
                  alignItems: 'center',
                },
                children: [
                  // Groom Name
                  {
                    id: 'intro-groom-name',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayMd.fontFamily',
                    },
                    style: {
                      fontSize: '0.875rem',
                      letterSpacing: '0.2em',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      color: '#F8F5F0',
                    },
                    props: {
                      content: '{{couple.groom.name}}',
                      as: 'h1',
                    },
                  },
                  // "and" divider row
                  {
                    id: 'intro-and-row',
                    type: 'row',
                    style: {
                      alignItems: 'center',
                      gap: '8px',
                      margin: '4px 0',
                    },
                    children: [
                      {
                        id: 'intro-and-line-left',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.accent',
                        },
                        style: {
                          width: '16px',
                          height: '1px',
                          opacity: 0.6,
                        },
                      },
                      {
                        id: 'intro-and-text',
                        type: 'text',
                        tokenStyle: {
                          color: '$token.colors.accent',
                        },
                        style: {
                          fontSize: '9px',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                        },
                        props: {
                          content: 'and',
                        },
                      },
                      {
                        id: 'intro-and-line-right',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.accent',
                        },
                        style: {
                          width: '16px',
                          height: '1px',
                          opacity: 0.6,
                        },
                      },
                    ],
                  },
                  // Bride Name
                  {
                    id: 'intro-bride-name',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayMd.fontFamily',
                    },
                    style: {
                      fontSize: '0.875rem',
                      letterSpacing: '0.2em',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      color: '#F8F5F0',
                    },
                    props: {
                      content: '{{couple.bride.name}}',
                      as: 'h1',
                    },
                  },
                  // Date
                  {
                    id: 'intro-date',
                    type: 'text',
                    style: {
                      fontSize: '7px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      marginTop: '8px',
                      color: 'rgba(248,245,240,0.6)',
                    },
                    props: {
                      content: '{{wedding.dateDisplay}}',
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
          description: '메인 사진 (정장/드레스 컷 권장)',
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
          path: 'wedding.dateDisplay',
          type: 'date',
          required: true,
          description: '결혼 날짜',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 800 },
          { id: 'scale', name: '스케일 인', preset: 'scale-in', trigger: 'mount', duration: 700 },
        ],
      },
    },

    // ============================================
    // Jewel Variant (Legacy - Opera Stage)
    // ============================================
    {
      id: 'jewel',
      name: '주얼 벨벳',
      description: '오페라 무대 스타일 - 버건디/에메랄드 커튼 + 스포트라이트',
      tags: ['luxury', 'dramatic', 'theater', 'jewel', 'opulent'],
      structure: {
        id: 'intro-root',
        type: 'fullscreen',
        style: {
          backgroundColor: '#0A0A0A',
          overflow: 'hidden',
          position: 'relative',
        },
        children: [
          // 1. Stage background with radial gradient
          {
            id: 'intro-stage-bg',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 150% 100% at 50% 100%, #0A0A0A 0%, #000 100%)',
            },
          },
          // 2. Left Curtain Drape (burgundy)
          {
            id: 'intro-left-curtain',
            type: 'container',
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '18%',
              background:
                'linear-gradient(to right, #722F37 0%, rgba(114,47,55,0.87) 60%, rgba(114,47,55,0.6) 80%, transparent 100%)',
            },
            children: [
              // Curtain folds
              {
                id: 'intro-left-folds',
                type: 'container',
                style: {
                  position: 'absolute',
                  inset: 0,
                  background:
                    'repeating-linear-gradient(to right, transparent 0px, rgba(0,0,0,0.2) 2px, transparent 4px, rgba(255,255,255,0.05) 8px, transparent 10px)',
                },
              },
              // Velvet sheen
              {
                id: 'intro-left-sheen',
                type: 'container',
                style: {
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.2) 100%)',
                },
              },
            ],
          },
          // 3. Right Curtain Drape (emerald)
          {
            id: 'intro-right-curtain',
            type: 'container',
            style: {
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '18%',
              background:
                'linear-gradient(to left, #1B4D3E 0%, rgba(27,77,62,0.87) 60%, rgba(27,77,62,0.6) 80%, transparent 100%)',
            },
            children: [
              // Curtain folds
              {
                id: 'intro-right-folds',
                type: 'container',
                style: {
                  position: 'absolute',
                  inset: 0,
                  background:
                    'repeating-linear-gradient(to left, transparent 0px, rgba(0,0,0,0.2) 2px, transparent 4px, rgba(255,255,255,0.05) 8px, transparent 10px)',
                },
              },
              // Velvet sheen
              {
                id: 'intro-right-sheen',
                type: 'container',
                style: {
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.2) 100%)',
                },
              },
            ],
          },
          // 4. Top Valance
          {
            id: 'intro-top-valance',
            type: 'container',
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8%',
              background:
                'linear-gradient(to bottom, #722F37 0%, rgba(114,47,55,0.8) 70%, transparent 100%)',
            },
            children: [
              // Gold trim
              {
                id: 'intro-gold-trim',
                type: 'container',
                tokenStyle: {
                  background:
                    'linear-gradient(to right, transparent 10%, $token.colors.accent 30%, $token.colors.accent 50%, $token.colors.accent 70%, transparent 90%)',
                },
                style: {
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  opacity: 0.6,
                },
              },
            ],
          },
          // 5. Stage center - Photo area
          {
            id: 'intro-stage-center',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12% 20%',
            },
            children: [
              // Spotlight glow
              {
                id: 'intro-spotlight',
                type: 'container',
                style: {
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,255,255,0.08) 0%, transparent 70%)',
                },
              },
              // Photo frame container
              {
                id: 'intro-photo-frame',
                type: 'container',
                style: {
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  maxHeight: '70%',
                },
                children: [
                  // Gold frame border
                  {
                    id: 'intro-gold-frame',
                    type: 'container',
                    tokenStyle: {
                      borderColor: '$token.colors.accent',
                    },
                    style: {
                      position: 'absolute',
                      inset: 0,
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      boxShadow:
                        '0 0 30px rgba(212,175,114,0.2), 0 10px 40px rgba(0,0,0,0.5)',
                    },
                  },
                  // Photo container
                  {
                    id: 'intro-photo-container',
                    type: 'container',
                    style: {
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      right: '2px',
                      bottom: '2px',
                      overflow: 'hidden',
                    },
                    children: [
                      {
                        id: 'intro-photo',
                        type: 'image',
                        style: {
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: 'brightness(0.9) contrast(1.05)',
                        },
                        props: {
                          src: '{{photos.main}}',
                          objectFit: 'cover',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // 6. Bottom stage area - Names
          {
            id: 'intro-bottom-stage',
            type: 'container',
            style: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '22%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            },
            children: [
              // Stage floor gradient
              {
                id: 'intro-floor-gradient',
                type: 'container',
                style: {
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                },
              },
              // Content
              {
                id: 'intro-bottom-content',
                type: 'column',
                style: {
                  position: 'relative',
                  zIndex: 10,
                  textAlign: 'center',
                  alignItems: 'center',
                },
                children: [
                  // Gold ornament (star shape)
                  {
                    id: 'intro-gold-ornament',
                    type: 'row',
                    style: {
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    },
                    children: [
                      {
                        id: 'intro-ornament-line-left',
                        type: 'container',
                        tokenStyle: {
                          background:
                            'linear-gradient(to right, transparent, $token.colors.accent)',
                        },
                        style: {
                          width: '24px',
                          height: '1px',
                          opacity: 0.6,
                        },
                      },
                      // Star shape
                      {
                        id: 'intro-star',
                        type: 'container',
                        style: {
                          width: '12px',
                          height: '12px',
                          position: 'relative',
                        },
                        props: {
                          className: 'jewel-star',
                        },
                      },
                      {
                        id: 'intro-ornament-line-right',
                        type: 'container',
                        tokenStyle: {
                          background:
                            'linear-gradient(to left, transparent, $token.colors.accent)',
                        },
                        style: {
                          width: '24px',
                          height: '1px',
                          opacity: 0.6,
                        },
                      },
                    ],
                  },
                  // Names row
                  {
                    id: 'intro-names-row',
                    type: 'row',
                    style: {
                      alignItems: 'center',
                    },
                    children: [
                      {
                        id: 'intro-groom-name',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayMd.fontFamily',
                        },
                        style: {
                          fontSize: '1rem',
                          letterSpacing: '0.15em',
                          fontWeight: 300,
                          color: '#F5EDE3',
                          textShadow: '0 0 20px rgba(212,175,114,0.3)',
                        },
                        props: {
                          content: '{{couple.groom.name}}',
                          as: 'h1',
                        },
                      },
                      {
                        id: 'intro-ampersand',
                        type: 'text',
                        tokenStyle: {
                          color: '$token.colors.accent',
                        },
                        style: {
                          fontSize: '0.75rem',
                          marginLeft: '8px',
                          marginRight: '8px',
                        },
                        props: {
                          content: '&',
                        },
                      },
                      {
                        id: 'intro-bride-name',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayMd.fontFamily',
                        },
                        style: {
                          fontSize: '1rem',
                          letterSpacing: '0.15em',
                          fontWeight: 300,
                          color: '#F5EDE3',
                          textShadow: '0 0 20px rgba(212,175,114,0.3)',
                        },
                        props: {
                          content: '{{couple.bride.name}}',
                          as: 'h1',
                        },
                      },
                    ],
                  },
                  // Date
                  {
                    id: 'intro-date',
                    type: 'text',
                    style: {
                      fontSize: '7px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      marginTop: '8px',
                      color: 'rgba(245,237,227,0.6)',
                    },
                    props: {
                      content: '{{wedding.dateDisplay}}',
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
          description: '메인 사진 (드라마틱한 조명 권장)',
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
          path: 'wedding.dateDisplay',
          type: 'date',
          required: true,
          description: '결혼 날짜',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 1000 },
          {
            id: 'scale',
            name: '스케일 인',
            preset: 'scale-in',
            trigger: 'mount',
            duration: 800,
          },
        ],
      },
    },
  ],
}

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

    // ============================================
    // Cinematic Variant
    // ============================================
    {
      id: 'cinematic',
      name: '시네마틱',
      description: '영화 오프닝처럼 드라마틱한 텍스트 연출',
      tags: ['cinematic', 'dramatic', 'modern', 'bold'],
      structure: {
        id: 'intro-root',
        type: 'fullscreen',
        style: {
          backgroundColor: '#000000',
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
              opacity: 0.7,
            },
            props: {
              src: '{{photos.main}}',
              objectFit: 'cover',
            },
          },
          {
            id: 'intro-content',
            type: 'column',
            style: {
              position: 'relative',
              zIndex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '40px 24px',
            },
            children: [
              {
                id: 'intro-top-line',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.caption.fontFamily',
                  fontSize: '$token.typography.caption.fontSize',
                },
                style: {
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  marginBottom: '24px',
                },
                props: {
                  content: 'The Wedding of',
                  as: 'span',
                },
              },
              {
                id: 'intro-groom-name',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.displayLg.fontFamily',
                  fontSize: '$token.typography.displayLg.fontSize',
                  fontWeight: '$token.typography.displayLg.fontWeight',
                },
                style: {
                  color: '#FFFFFF',
                  textAlign: 'center',
                  letterSpacing: '0.1em',
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
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '24px',
                  margin: '16px 0',
                },
                props: {
                  content: '&',
                  as: 'span',
                },
              },
              {
                id: 'intro-bride-name',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.displayLg.fontFamily',
                  fontSize: '$token.typography.displayLg.fontSize',
                  fontWeight: '$token.typography.displayLg.fontWeight',
                },
                style: {
                  color: '#FFFFFF',
                  textAlign: 'center',
                  letterSpacing: '0.1em',
                },
                props: {
                  content: '{{couple.bride.name}}',
                  as: 'h1',
                },
              },
              {
                id: 'intro-date',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.bodyMd.fontFamily',
                  fontSize: '$token.typography.bodyMd.fontSize',
                },
                style: {
                  color: 'rgba(255,255,255,0.7)',
                  textAlign: 'center',
                  marginTop: '32px',
                  letterSpacing: '0.15em',
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
          description: '메인 사진 (어두운 배경)',
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
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 1200 },
          { id: 'stagger', name: '순차 등장', preset: 'stagger-fade', trigger: 'mount', duration: 1500 },
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
          { id: 'slide', name: '슬라이드', preset: 'slide-in-left', trigger: 'mount', duration: 800 },
          { id: 'reveal', name: '순차 공개', preset: 'clip-reveal', trigger: 'mount', duration: 1000 },
        ],
      },
    },

    // ============================================
    // Magazine Variant
    // ============================================
    {
      id: 'magazine',
      name: '매거진',
      description: '잡지 커버 스타일의 세련된 디자인',
      tags: ['editorial', 'chic', 'trendy', 'fashion'],
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
            id: 'intro-content',
            type: 'column',
            style: {
              position: 'relative',
              zIndex: 1,
              height: '100%',
              padding: '32px 24px',
              justifyContent: 'space-between',
            },
            children: [
              {
                id: 'intro-header',
                type: 'row',
                style: {
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  width: '100%',
                },
                children: [
                  {
                    id: 'intro-issue',
                    type: 'text',
                    style: {
                      color: '#FFFFFF',
                      fontSize: '10px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    },
                    props: {
                      content: 'Special Edition',
                      as: 'span',
                    },
                  },
                  {
                    id: 'intro-date-top',
                    type: 'text',
                    style: {
                      color: '#FFFFFF',
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    },
                    props: {
                      content: '{{wedding.date}}',
                      as: 'span',
                    },
                  },
                ],
              },
              {
                id: 'intro-footer',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                style: {
                  alignItems: 'flex-start',
                },
                children: [
                  {
                    id: 'intro-headline',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayLg.fontFamily',
                    },
                    style: {
                      color: '#FFFFFF',
                      fontSize: '42px',
                      fontWeight: '700',
                      lineHeight: '1.1',
                      textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    },
                    props: {
                      content: '{{couple.groom.name}} & {{couple.bride.name}}',
                      as: 'h1',
                    },
                  },
                  {
                    id: 'intro-subline',
                    type: 'text',
                    style: {
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '14px',
                      letterSpacing: '0.05em',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    },
                    props: {
                      content: 'The Wedding Celebration',
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
          { id: 'typewriter', name: '타이핑', preset: 'typewriter', trigger: 'mount', duration: 2000 },
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
          { id: 'float', name: '떠오르기', preset: 'float-up', trigger: 'mount', duration: 800 },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 600 },
        ],
      },
    },
  ],
}

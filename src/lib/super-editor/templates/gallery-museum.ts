/**
 * Gallery Museum Style Wedding Invitation Template
 * 미술관 갤러리 스타일 청첩장 템플릿
 * - 깔끔한 그림자
 * - 플래카드 카드 스타일
 * - 모던 미니멀
 */

import type { LayoutSchema } from '../schema/layout'
import type { StyleSchema } from '../schema/style'
import type { EditorSchema } from '../schema/editor'

// ============================================
// Layout Schema - 미술관 갤러리 UI 구조
// ============================================

export const galleryMuseumLayoutSchema: LayoutSchema = {
  version: '1.0',
  meta: {
    id: 'gallery-museum-v1',
    name: '미술관 갤러리 청첩장',
    category: 'letter',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  screens: [
    // ========== Screen 1: 인트로 (풀스크린) ==========
    {
      id: 'intro',
      type: 'intro',
      sectionType: 'intro',
      root: {
        id: 'intro-container',
        type: 'fullscreen',
        props: { minHeight: '100vh' },
        style: {
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#111827',
        },
        children: [
          // 갤러리 배경 이미지
          {
            id: 'gallery-bg',
            type: 'animated',
            props: {
              animation: { preset: 'fade-in', duration: 1200 },
              trigger: 'mount',
            },
            children: [
              {
                id: 'gallery-bg-image',
                type: 'image',
                props: {
                  src: '{{photos.galleryBackground}}',
                  objectFit: 'cover',
                },
                style: {
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                },
              },
            ],
          },

          // 메인 사진 (중앙, 액자 스타일)
          {
            id: 'main-photo-frame',
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
                id: 'photo-frame',
                type: 'animated',
                props: {
                  animation: { preset: 'scale-in', duration: 1000, delay: 300 },
                  trigger: 'mount',
                },
                children: [
                  {
                    id: 'photo-frame-inner',
                    type: 'container',
                    style: {
                      boxShadow: `
                        0 30px 60px rgba(0,0,0,0.4),
                        0 15px 30px rgba(0,0,0,0.3),
                        0 5px 15px rgba(0,0,0,0.25),
                        0 2px 8px rgba(0,0,0,0.2)
                      `,
                    },
                    children: [
                      {
                        id: 'couple-photo',
                        type: 'image',
                        props: {
                          src: '{{photos.main}}',
                          objectFit: 'cover',
                        },
                        style: {
                          width: 200,
                          height: 350,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // 하단 텍스트 그라디언트 오버레이
          {
            id: 'text-overlay-gradient',
            type: 'container',
            style: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 192,
              background: `linear-gradient(
                180deg,
                transparent 0%,
                rgba(0,0,0,0.02) 30%,
                rgba(0,0,0,0.15) 70%,
                rgba(0,0,0,0.4) 100%
              )`,
              pointerEvents: 'none',
            },
          },

          // 플래카드 (미술관 작품 설명 스타일)
          {
            id: 'placard',
            type: 'container',
            style: {
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
            },
            children: [
              {
                id: 'placard-animated',
                type: 'animated',
                props: {
                  animation: { preset: 'slide-up', duration: 1000, delay: 600 },
                  trigger: 'mount',
                },
                children: [
                  {
                    id: 'placard-card',
                    type: 'container',
                    style: {
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      padding: '20px 32px',
                      textAlign: 'center',
                      borderRadius: 2,
                    },
                    children: [
                      // 이름
                      {
                        id: 'names',
                        type: 'text',
                        props: { content: '{{couple.bride.name}} & {{couple.groom.name}}', as: 'h1' },
                        style: {
                          fontFamily: '"Cormorant", serif',
                          fontSize: 20,
                          fontWeight: 300,
                          fontStyle: 'italic',
                          letterSpacing: '0.05em',
                          color: '#1f2937',
                        },
                      },

                      // 구분선
                      {
                        id: 'divider',
                        type: 'container',
                        style: {
                          width: 40,
                          height: 1,
                          backgroundColor: '#d1d5db',
                          margin: '12px auto',
                        },
                      },

                      // 날짜
                      {
                        id: 'date',
                        type: 'text',
                        props: { content: '{{wedding.date}}', as: 'p' },
                        style: {
                          fontFamily: '"Inter", sans-serif',
                          fontSize: 10,
                          fontWeight: 500,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: '#374151',
                        },
                      },

                      // 시간
                      {
                        id: 'time',
                        type: 'text',
                        props: { content: '{{wedding.time}}', as: 'p' },
                        style: {
                          fontFamily: '"Inter", sans-serif',
                          fontSize: 9,
                          letterSpacing: '0.15em',
                          color: '#6b7280',
                          marginTop: 4,
                        },
                      },

                      // 장소
                      {
                        id: 'venue-section',
                        type: 'container',
                        style: {
                          marginTop: 12,
                          paddingTop: 12,
                          borderTop: '1px solid #e5e7eb',
                        },
                        children: [
                          {
                            id: 'venue-name',
                            type: 'text',
                            props: { content: '{{wedding.venue.name}}', as: 'p' },
                            style: {
                              fontFamily: '"Inter", sans-serif',
                              fontSize: 8,
                              fontWeight: 500,
                              letterSpacing: '0.2em',
                              textTransform: 'uppercase',
                              color: '#6b7280',
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

          // 스크롤 인디케이터
          {
            id: 'scroll-indicator',
            type: 'container',
            style: {
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
            },
            children: [
              {
                id: 'scroll-animated',
                type: 'animated',
                props: {
                  animation: { preset: 'float', duration: 1500 },
                  trigger: 'mount',
                },
                children: [
                  {
                    id: 'scroll-arrow',
                    type: 'text',
                    props: { content: '↓', as: 'span' },
                    style: {
                      color: 'rgba(255, 255, 255, 0.4)',
                      fontSize: 16,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
}

// ============================================
// Style Schema - 미술관 갤러리 스타일
// ============================================

export const galleryMuseumStyleSchema: StyleSchema = {
  version: '1.0',
  meta: {
    id: 'gallery-museum-style-v1',
    name: '미술관 갤러리 스타일',
    mood: ['minimal', 'elegant', 'modern'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  theme: {
    colors: {
      primary: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
      },
      background: {
        default: '#111827',
        paper: 'rgba(255, 255, 255, 0.95)',
        subtle: '#1f2937',
      },
      text: {
        primary: '#1f2937',
        secondary: '#374151',
        muted: '#6b7280',
        inverse: '#ffffff',
      },
    },
    typography: {
      fonts: {
        heading: {
          family: '"Cormorant", serif',
          fallback: 'Georgia, serif',
        },
        body: {
          family: '"Inter", sans-serif',
          fallback: 'system-ui, sans-serif',
        },
      },
      sizes: {
        xs: '0.5rem',
        sm: '0.5625rem',
        base: '0.625rem',
        lg: '0.75rem',
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      weights: {
        regular: 300,
        medium: 400,
        semibold: 500,
        bold: 600,
      },
      lineHeights: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
      },
      letterSpacing: {
        tight: '0.02em',
        normal: '0.05em',
        wide: '0.15em',
      },
    },
    spacing: {
      unit: 4,
      scale: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
      },
    },
    borders: {
      radius: {
        none: '0',
        sm: '2px',
        md: '4px',
        lg: '8px',
        xl: '16px',
        full: '9999px',
      },
      width: {
        thin: '1px',
        default: '2px',
        thick: '4px',
      },
      style: 'solid',
      color: '#e5e7eb',
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px rgba(0,0,0,0.05)',
      md: '0 4px 20px rgba(0,0,0,0.1)',
      lg: '0 15px 30px rgba(0,0,0,0.3)',
      xl: `
        0 30px 60px rgba(0,0,0,0.4),
        0 15px 30px rgba(0,0,0,0.3),
        0 5px 15px rgba(0,0,0,0.25),
        0 2px 8px rgba(0,0,0,0.2)
      `,
    },
    animation: {
      duration: {
        fast: 150,
        normal: 300,
        slow: 1000,
        slower: 1200,
      },
      easing: {
        default: 'ease-out',
        in: 'ease-in',
        out: 'ease-out',
        inOut: 'ease-in-out',
      },
      stagger: {
        delay: 300,
        from: 'start',
      },
    },
  },
  tokens: {
    gallery: {
      photoFrame: `
        0 30px 60px rgba(0,0,0,0.4),
        0 15px 30px rgba(0,0,0,0.3),
        0 5px 15px rgba(0,0,0,0.25),
        0 2px 8px rgba(0,0,0,0.2)
      `,
      placard: 'rgba(255, 255, 255, 0.95)',
      placardBlur: '10px',
    },
  },
  components: {
    custom: {
      placard: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        padding: '20px 32px',
        borderRadius: '2px',
      },
      photoFrame: {
        boxShadow: `
          0 30px 60px rgba(0,0,0,0.4),
          0 15px 30px rgba(0,0,0,0.3),
          0 5px 15px rgba(0,0,0,0.25),
          0 2px 8px rgba(0,0,0,0.2)
        `,
      },
    },
  },
}

// ============================================
// Editor Schema - 사용자 입력 필드 정의
// ============================================

export const galleryMuseumEditorSchema: EditorSchema = {
  version: '1.0',
  meta: {
    id: 'gallery-museum-editor-v1',
    name: '미술관 갤러리 청첩장 편집기',
    description: '미술관처럼 우아하고 깔끔한 청첩장을 만들어보세요',
    layoutId: 'gallery-museum-v1',
    styleId: 'gallery-museum-style-v1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  sections: [
    // 1. 신랑 정보
    {
      id: 'groom',
      title: '신랑 정보',
      description: '신랑 이름을 입력해주세요',
      icon: '🤵',
      order: 0,
      fields: [
        {
          id: 'groom-name',
          type: 'text',
          label: '신랑 이름 (한글)',
          dataPath: 'couple.groom.name',
          placeholder: '홍길동',
          required: true,
          order: 0,
        },
        {
          id: 'groom-name-en',
          type: 'text',
          label: '신랑 이름 (영문)',
          dataPath: 'couple.groom.nameEn',
          placeholder: 'Gildong',
          description: '플래카드에 표시될 영문 이름',
          required: true,
          order: 1,
        },
      ],
    },

    // 2. 신부 정보
    {
      id: 'bride',
      title: '신부 정보',
      description: '신부 이름을 입력해주세요',
      icon: '👰',
      order: 1,
      fields: [
        {
          id: 'bride-name',
          type: 'text',
          label: '신부 이름 (한글)',
          dataPath: 'couple.bride.name',
          placeholder: '김영희',
          required: true,
          order: 0,
        },
        {
          id: 'bride-name-en',
          type: 'text',
          label: '신부 이름 (영문)',
          dataPath: 'couple.bride.nameEn',
          placeholder: 'Jiyoon',
          description: '플래카드에 표시될 영문 이름',
          required: true,
          order: 1,
        },
      ],
    },

    // 3. 사진
    {
      id: 'photos',
      title: '사진',
      description: '갤러리 배경과 메인 사진',
      icon: '📷',
      order: 2,
      fields: [
        {
          id: 'gallery-background',
          type: 'image',
          label: '갤러리 배경',
          dataPath: 'photos.galleryBackground',
          description: '미술관/갤러리 이미지 (배경으로 사용)',
          order: 0,
        },
        {
          id: 'main-photo',
          type: 'image',
          label: '메인 사진',
          dataPath: 'photos.main',
          description: '액자 안에 들어갈 웨딩 사진 (세로 비율 권장)',
          required: true,
          order: 1,
        },
      ],
    },

    // 4. 예식 정보
    {
      id: 'wedding',
      title: '예식 일시',
      description: '예식 날짜와 시간을 입력해주세요',
      icon: '💒',
      order: 3,
      fields: [
        {
          id: 'wedding-date',
          type: 'date',
          label: '예식 날짜',
          dataPath: 'wedding.date',
          required: true,
          order: 0,
        },
        {
          id: 'wedding-time',
          type: 'time',
          label: '예식 시간',
          dataPath: 'wedding.time',
          required: true,
          order: 1,
        },
        {
          id: 'wedding-date-display',
          type: 'text',
          label: '날짜 표시',
          dataPath: 'wedding.dateDisplay',
          placeholder: '2025. 11. 30 (Sun)',
          description: '플래카드에 표시될 날짜 형식',
          order: 2,
        },
        {
          id: 'wedding-time-display',
          type: 'text',
          label: '시간 표시',
          dataPath: 'wedding.timeDisplay',
          placeholder: '11:30 AM',
          description: '플래카드에 표시될 시간 형식',
          order: 3,
        },
      ],
    },

    // 5. 예식장 정보
    {
      id: 'venue',
      title: '예식장 정보',
      description: '예식장 위치 정보를 입력해주세요',
      icon: '📍',
      order: 4,
      fields: [
        {
          id: 'venue-name',
          type: 'text',
          label: '예식장 이름 (한글)',
          dataPath: 'venue.name',
          placeholder: '청담 더채플',
          required: true,
          order: 0,
        },
        {
          id: 'venue-name-en',
          type: 'text',
          label: '예식장 이름 (영문)',
          dataPath: 'venue.nameEn',
          placeholder: 'The Chapel at Cheongdam',
          description: '플래카드에 표시될 영문 이름',
          order: 1,
        },
        {
          id: 'venue-address',
          type: 'textarea',
          label: '주소',
          dataPath: 'venue.address',
          placeholder: '서울시 강남구 청담동 123',
          order: 2,
        },
      ],
    },
  ],
}

// ============================================
// Sample User Data
// ============================================

export const galleryMuseumSampleData = {
  couple: {
    groom: {
      name: '홍길동',
      englishName: 'Gildong',
    },
    bride: {
      name: '김지윤',
      englishName: 'Jiyoon',
    },
  },
  wedding: {
    date: '2025년 11월 30일',
    time: '오전 11시 30분',
    venue: {
      name: '청담 더채플',
      hall: '그랜드볼룸',
      address: '서울시 강남구 청담동 123-45',
    },
  },
  photos: {
    galleryBackground: 'https://picsum.photos/seed/gallery-bg/600/900',
    main: 'https://picsum.photos/seed/gallery-main/400/600',
  },
}

// ============================================
// Export combined template
// ============================================

export const galleryMuseumTemplate = {
  layout: galleryMuseumLayoutSchema,
  style: galleryMuseumStyleSchema,
  editor: galleryMuseumEditorSchema,
  sampleData: galleryMuseumSampleData,
}

export default galleryMuseumTemplate

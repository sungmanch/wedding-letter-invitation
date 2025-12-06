/**
 * Wong Kar-wai Film Style Wedding Invitation Template
 * 왕가위 영화풍 청첩장 템플릿
 * - 필름 그레인 효과
 * - 빈티지 컬러 (레드/골드/크림)
 * - 세로 텍스트
 */

import type { LayoutSchema } from '../schema/layout'
import type { StyleSchema } from '../schema/style'
import type { EditorSchema } from '../schema/editor'

// ============================================
// Layout Schema - 왕가위 영화풍 UI 구조
// ============================================

export const wkwFilmLayoutSchema: LayoutSchema = {
  version: '1.0',
  meta: {
    id: 'wkw-film-v1',
    name: '왕가위 영화풍 청첩장',
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
          backgroundColor: '#000',
        },
        children: [
          // 배경 이미지
          {
            id: 'bg-image',
            type: 'image',
            props: {
              src: '{{photos.main}}',
              objectFit: 'cover',
            },
            style: {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              filter: 'brightness(0.7) contrast(1.2) saturate(1.1)',
            },
          },

          // 레드/웜 틴트 오버레이 (왕가위 시그니처)
          {
            id: 'red-tint-overlay',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg,
                rgba(139, 38, 53, 0.4) 0%,
                rgba(180, 60, 60, 0.3) 30%,
                rgba(26, 77, 77, 0.2) 70%,
                rgba(0, 0, 0, 0.6) 100%)`,
              mixBlendMode: 'multiply',
            },
          },

          // 골드 광채 오버레이
          {
            id: 'gold-glow-overlay',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at 30% 20%,
                rgba(201, 169, 98, 0.15) 0%,
                transparent 50%)`,
              mixBlendMode: 'overlay',
            },
          },

          // 비네팅 효과
          {
            id: 'vignette-overlay',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at center,
                transparent 40%,
                rgba(0, 0, 0, 0.7) 100%)`,
            },
          },

          // 필름 그레인 오버레이 (CSS 애니메이션으로 구현)
          {
            id: 'film-grain-overlay',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              opacity: 0.15,
              pointerEvents: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            },
          },

          // 콘텐츠 레이어
          {
            id: 'content-layer',
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
              // 상단 섹션: 세로 텍스트 + 날짜
              {
                id: 'top-section',
                type: 'row',
                props: { justify: 'between', align: 'start' },
                children: [
                  // 왼쪽 세로 텍스트
                  {
                    id: 'vertical-text',
                    type: 'text',
                    props: { content: '우리의 시작', as: 'span' },
                    style: {
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      fontFamily: '"Noto Serif KR", serif',
                      fontSize: 12,
                      letterSpacing: '0.2em',
                      color: 'rgba(245, 230, 211, 0.6)',
                    },
                  },
                  // 오른쪽 웨딩 세레모니 텍스트
                  {
                    id: 'ceremony-label',
                    type: 'text',
                    props: { content: 'Wedding Ceremony', as: 'span' },
                    style: {
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: 10,
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      color: 'rgba(245, 230, 211, 0.5)',
                      textAlign: 'right',
                    },
                  },
                ],
              },

              // 중앙 섹션: 이름 + 날짜
              {
                id: 'center-section',
                type: 'column',
                props: { align: 'center' },
                style: {
                  flex: 1,
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginTop: -40,
                },
                children: [
                  // 장식 라인
                  {
                    id: 'decorative-line-top',
                    type: 'container',
                    style: {
                      width: 1,
                      height: 48,
                      background: 'linear-gradient(to bottom, transparent, rgba(201, 169, 98, 0.6), transparent)',
                      marginBottom: 24,
                    },
                  },

                  // 신부 이름
                  {
                    id: 'bride-name',
                    type: 'animated',
                    props: {
                      animation: { preset: 'fade-in', duration: 1200 },
                      trigger: 'mount',
                    },
                    children: [
                      {
                        id: 'bride-name-text',
                        type: 'text',
                        props: { content: '{{couple.bride.name}}', as: 'h1' },
                        style: {
                          fontFamily: '"Cormorant Garamond", serif',
                          fontSize: '2.5rem',
                          fontWeight: 300,
                          letterSpacing: '0.2em',
                          color: '#F5E6D3',
                          textShadow: '0 0 40px rgba(220, 38, 38, 0.3), 0 0 80px rgba(220, 38, 38, 0.2)',
                        },
                      },
                    ],
                  },

                  // & 기호
                  {
                    id: 'ampersand',
                    type: 'text',
                    props: { content: '&', as: 'p' },
                    style: {
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: 18,
                      color: 'rgba(201, 169, 98, 0.8)',
                      letterSpacing: '0.2em',
                      margin: '12px 0',
                    },
                  },

                  // 신랑 이름
                  {
                    id: 'groom-name',
                    type: 'animated',
                    props: {
                      animation: { preset: 'fade-in', duration: 1200, delay: 300 },
                      trigger: 'mount',
                    },
                    children: [
                      {
                        id: 'groom-name-text',
                        type: 'text',
                        props: { content: '{{couple.groom.name}}', as: 'h1' },
                        style: {
                          fontFamily: '"Cormorant Garamond", serif',
                          fontSize: '2.5rem',
                          fontWeight: 300,
                          letterSpacing: '0.2em',
                          color: '#F5E6D3',
                          textShadow: '0 0 40px rgba(220, 38, 38, 0.3), 0 0 80px rgba(220, 38, 38, 0.2)',
                        },
                      },
                    ],
                  },

                  // 장식 다이아몬드
                  {
                    id: 'decorative-diamond',
                    type: 'animated',
                    props: {
                      animation: { preset: 'fade-in', duration: 1200, delay: 600 },
                      trigger: 'mount',
                    },
                    children: [
                      {
                        id: 'diamond-row',
                        type: 'row',
                        props: { align: 'center', justify: 'center' },
                        style: { margin: '32px 0', gap: 16 },
                        children: [
                          {
                            id: 'line-left',
                            type: 'container',
                            style: {
                              width: 48,
                              height: 1,
                              background: 'linear-gradient(to right, transparent, rgba(201, 169, 98, 0.5))',
                            },
                          },
                          {
                            id: 'diamond',
                            type: 'container',
                            style: {
                              width: 6,
                              height: 6,
                              backgroundColor: 'rgba(201, 169, 98, 0.6)',
                              transform: 'rotate(45deg)',
                            },
                          },
                          {
                            id: 'line-right',
                            type: 'container',
                            style: {
                              width: 48,
                              height: 1,
                              background: 'linear-gradient(to left, transparent, rgba(201, 169, 98, 0.5))',
                            },
                          },
                        ],
                      },
                    ],
                  },

                  // 날짜
                  {
                    id: 'date-section',
                    type: 'animated',
                    props: {
                      animation: { preset: 'fade-in', duration: 1200, delay: 600 },
                      trigger: 'mount',
                    },
                    children: [
                      {
                        id: 'date-text',
                        type: 'text',
                        props: { content: '{{wedding.date}}', as: 'p' },
                        style: {
                          fontFamily: '"Cormorant Garamond", serif',
                          fontSize: 14,
                          letterSpacing: '0.25em',
                          color: 'rgba(245, 230, 211, 0.9)',
                          marginBottom: 4,
                        },
                      },
                      {
                        id: 'time-text',
                        type: 'text',
                        props: { content: '{{wedding.time}}', as: 'p' },
                        style: {
                          fontFamily: '"Cormorant Garamond", serif',
                          fontSize: 12,
                          letterSpacing: '0.3em',
                          color: 'rgba(245, 230, 211, 0.6)',
                        },
                      },
                    ],
                  },
                ],
              },

              // 하단 섹션: 장소
              {
                id: 'bottom-section',
                type: 'animated',
                props: {
                  animation: { preset: 'fade-in', duration: 1200, delay: 900 },
                  trigger: 'mount',
                },
                children: [
                  {
                    id: 'location-container',
                    type: 'container',
                    style: {
                      borderTop: '1px solid rgba(201, 169, 98, 0.2)',
                      paddingTop: 24,
                    },
                    children: [
                      {
                        id: 'location-label',
                        type: 'text',
                        props: { content: 'Location', as: 'p' },
                        style: {
                          fontFamily: '"Cormorant Garamond", serif',
                          fontSize: 10,
                          letterSpacing: '0.4em',
                          textTransform: 'uppercase',
                          color: 'rgba(245, 230, 211, 0.4)',
                          marginBottom: 8,
                        },
                      },
                      {
                        id: 'venue-name-en',
                        type: 'text',
                        props: { content: '{{wedding.venue.name}}', as: 'p' },
                        style: {
                          fontFamily: '"Noto Serif KR", serif',
                          fontSize: 14,
                          letterSpacing: '0.1em',
                          color: 'rgba(245, 230, 211, 0.9)',
                        },
                      },
                      {
                        id: 'venue-name-kr',
                        type: 'text',
                        props: { content: '{{wedding.venue.hall}}', as: 'p' },
                        style: {
                          fontFamily: '"Noto Serif KR", serif',
                          fontSize: 12,
                          color: 'rgba(245, 230, 211, 0.5)',
                          marginTop: 4,
                        },
                      },
                    ],
                  },

                  // 스크롤 인디케이터
                  {
                    id: 'scroll-indicator',
                    type: 'column',
                    props: { align: 'center' },
                    style: {
                      marginTop: 32,
                      opacity: 0.5,
                    },
                    children: [
                      {
                        id: 'scroll-text',
                        type: 'text',
                        props: { content: 'Scroll', as: 'span' },
                        style: {
                          fontFamily: '"Cormorant Garamond", serif',
                          fontSize: 8,
                          letterSpacing: '0.3em',
                          textTransform: 'uppercase',
                          color: 'rgba(245, 230, 211, 0.5)',
                          marginBottom: 8,
                        },
                      },
                      {
                        id: 'scroll-line',
                        type: 'animated',
                        props: {
                          animation: { preset: 'pulse', duration: 1500 },
                          trigger: 'mount',
                        },
                        children: [
                          {
                            id: 'scroll-line-inner',
                            type: 'container',
                            style: {
                              width: 1,
                              height: 24,
                              background: 'linear-gradient(to bottom, rgba(245, 230, 211, 0.5), transparent)',
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

          // 필름 프레임 가장자리 (상단)
          {
            id: 'film-edge-top',
            type: 'container',
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent)',
              zIndex: 40,
            },
          },

          // 필름 프레임 가장자리 (하단)
          {
            id: 'film-edge-bottom',
            type: 'container',
            style: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent)',
              zIndex: 40,
            },
          },
        ],
      },
    },
  ],
}

// ============================================
// Style Schema - 왕가위 스타일
// ============================================

export const wkwFilmStyleSchema: StyleSchema = {
  version: '1.0',
  meta: {
    id: 'wkw-film-style-v1',
    name: '왕가위 영화 스타일',
    mood: ['romantic', 'elegant', 'vintage'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  theme: {
    colors: {
      primary: {
        50: '#FDF2F4',
        100: '#FCE4E8',
        200: '#FACDD5',
        300: '#F5A3B5',
        400: '#ED6D8A',
        500: '#8B2635', // wkw-red
        600: '#7A2130',
        700: '#651C28',
        800: '#541824',
        900: '#481621',
      },
      neutral: {
        50: '#F5E6D3', // wkw-cream
        100: '#EDD9C3',
        200: '#E0C9AE',
        300: '#D4B898',
        400: '#C9A962', // wkw-gold
        500: '#A8884D',
        600: '#8A6E3D',
        700: '#6D562F',
        800: '#1A4D4D', // wkw-teal
        900: '#000000',
      },
      background: {
        default: '#000000',
        paper: '#1a1a1a',
        subtle: '#0d0d0d',
      },
      text: {
        primary: '#F5E6D3',
        secondary: 'rgba(245, 230, 211, 0.8)',
        muted: 'rgba(245, 230, 211, 0.5)',
        inverse: '#000000',
      },
    },
    typography: {
      fonts: {
        heading: {
          family: '"Cormorant Garamond", serif',
          fallback: 'Georgia, serif',
        },
        body: {
          family: '"Noto Serif KR", serif',
          fallback: '"Batang", serif',
        },
      },
      sizes: {
        xs: '0.5rem',
        sm: '0.75rem',
        base: '0.875rem',
        lg: '1rem',
        xl: '1.125rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      weights: {
        regular: 300,
        medium: 400,
        semibold: 500,
        bold: 600,
      },
      lineHeights: {
        tight: 1.1,
        normal: 1.4,
        relaxed: 1.6,
      },
      letterSpacing: {
        tight: '0',
        normal: '0.1em',
        wide: '0.2em',
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
        xl: '12px',
        full: '9999px',
      },
      width: {
        thin: '1px',
        default: '2px',
        thick: '4px',
      },
      style: 'solid',
      color: 'rgba(201, 169, 98, 0.3)',
    },
    shadows: {
      none: 'none',
      sm: '0 0 10px rgba(139, 38, 53, 0.2)',
      md: '0 0 20px rgba(139, 38, 53, 0.3)',
      lg: '0 0 40px rgba(139, 38, 53, 0.3), 0 0 80px rgba(139, 38, 53, 0.2)',
      xl: '0 0 60px rgba(220, 38, 38, 0.4)',
    },
    animation: {
      duration: {
        fast: 150,
        normal: 500,
        slow: 1200,
        slower: 2000,
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
    wkw: {
      red: '#8B2635',
      gold: '#C9A962',
      cream: '#F5E6D3',
      teal: '#1A4D4D',
      filmGrain: 'rgba(255, 255, 255, 0.15)',
      redTint: 'rgba(139, 38, 53, 0.4)',
      vignette: 'rgba(0, 0, 0, 0.7)',
    },
  },
  components: {
    custom: {
      verticalText: {
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
      },
      textGlow: {
        textShadow: '0 0 40px rgba(220, 38, 38, 0.3), 0 0 80px rgba(220, 38, 38, 0.2)',
      },
    },
  },
}

// ============================================
// Editor Schema - 사용자 입력 필드 정의
// ============================================

export const wkwFilmEditorSchema: EditorSchema = {
  version: '1.0',
  meta: {
    id: 'wkw-film-editor-v1',
    name: '왕가위 청첩장 편집기',
    description: '왕가위 영화처럼 감성적인 청첩장을 만들어보세요',
    layoutId: 'wkw-film-v1',
    styleId: 'wkw-film-style-v1',
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
          description: '인트로에 표시될 영문 이름',
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
          description: '인트로에 표시될 영문 이름',
          required: true,
          order: 1,
        },
      ],
    },

    // 3. 메인 사진
    {
      id: 'main-photo',
      title: '메인 사진',
      description: '인트로 배경에 사용될 웨딩 사진',
      icon: '📷',
      order: 2,
      fields: [
        {
          id: 'main-photo',
          type: 'image',
          label: '메인 사진',
          dataPath: 'photos.main',
          description: '세로 비율 사진을 권장합니다 (영화 느낌)',
          required: true,
          order: 0,
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
          placeholder: '2025. 11. 30',
          description: '인트로에 표시될 날짜 형식',
          order: 2,
        },
        {
          id: 'wedding-day-time-display',
          type: 'text',
          label: '요일/시간 표시',
          dataPath: 'wedding.dayTimeDisplay',
          placeholder: 'SUNDAY · 11:30 AM',
          description: '인트로에 표시될 요일과 시간 형식',
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
          description: '인트로에 표시될 영문 이름',
          order: 1,
        },
        {
          id: 'venue-hall',
          type: 'text',
          label: '홀 이름',
          dataPath: 'venue.hall',
          placeholder: '그랜드볼룸 3층',
          order: 2,
        },
        {
          id: 'venue-address',
          type: 'textarea',
          label: '주소',
          dataPath: 'venue.address',
          placeholder: '서울시 강남구 청담동 123',
          order: 3,
        },
      ],
    },
  ],
}

// ============================================
// Sample User Data
// ============================================

export const wkwFilmSampleData = {
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
    main: 'https://picsum.photos/seed/wkw-main/600/900',
  },
}

// ============================================
// Export combined template
// ============================================

export const wkwFilmTemplate = {
  layout: wkwFilmLayoutSchema,
  style: wkwFilmStyleSchema,
  editor: wkwFilmEditorSchema,
  sampleData: wkwFilmSampleData,
}

export default wkwFilmTemplate

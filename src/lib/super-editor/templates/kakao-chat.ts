/**
 * KakaoTalk Style Wedding Invitation Template
 * 카카오톡 채팅 스타일 청첩장 템플릿
 */

import type { LayoutSchema } from '../schema/layout'
import type { StyleSchema } from '../schema/style'
import type { EditorSchema } from '../schema/editor'

// ============================================
// Layout Schema - 카카오톡 채팅 UI 구조
// ============================================

export const kakaoLayoutSchema: LayoutSchema = {
  version: '1.0',
  meta: {
    id: 'kakao-chat-v1',
    name: '카카오톡 채팅 청첩장',
    category: 'chat',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  screens: [
    // ========== Screen 1: 채팅방 메인 ==========
    {
      id: 'chat-main',
      type: 'content',
      root: {
        id: 'chat-container',
        type: 'container',
        style: {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#B2C7D9',
        },
        children: [
          // 채팅방 헤더
          {
            id: 'chat-header',
            type: 'container',
            style: {
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: '#B2C7D9',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
            },
            children: [
              {
                id: 'back-icon',
                type: 'text',
                props: { content: '←', as: 'span' },
                style: { fontSize: 20, marginRight: 16, color: '#333' },
              },
              {
                id: 'chat-title',
                type: 'text',
                props: { content: '{{couple.groom.name}} ♥ {{couple.bride.name}}', as: 'h1' },
                style: { fontSize: 17, fontWeight: 600, color: '#333', flex: 1 },
              },
              {
                id: 'member-count',
                type: 'text',
                props: { content: '2', as: 'span' },
                style: { fontSize: 14, color: '#888', marginRight: 12 },
              },
              {
                id: 'menu-icon',
                type: 'text',
                props: { content: '☰', as: 'span' },
                style: { fontSize: 20, color: '#333' },
              },
            ],
          },

          // 채팅 메시지 영역
          {
            id: 'chat-messages',
            type: 'scroll-container',
            props: { direction: 'vertical' },
            style: {
              flex: 1,
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              overflowY: 'auto',
            },
            children: [
              // 날짜 구분선
              {
                id: 'date-divider',
                type: 'container',
                style: {
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: 8,
                },
                children: [
                  {
                    id: 'date-badge',
                    type: 'text',
                    props: { content: '{{wedding.dateDisplay}}', as: 'span' },
                    style: {
                      fontSize: 12,
                      color: '#fff',
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      padding: '4px 12px',
                      borderRadius: 12,
                    },
                  },
                ],
              },

              // 신랑 메시지 1 - 인사
              {
                id: 'groom-msg-1',
                type: 'container',
                style: {
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                },
                children: [
                  {
                    id: 'groom-avatar',
                    type: 'avatar',
                    props: {
                      src: '{{photos.groomProfile}}',
                      size: 40,
                      shape: 'rounded',
                    },
                    style: {
                      flexShrink: 0,
                    },
                  },
                  {
                    id: 'groom-bubble-wrap-1',
                    type: 'container',
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      maxWidth: '70%',
                    },
                    children: [
                      {
                        id: 'groom-name-label',
                        type: 'text',
                        props: { content: '{{couple.groom.name}}', as: 'span' },
                        style: { fontSize: 12, color: '#333', marginBottom: 2 },
                      },
                      {
                        id: 'groom-bubble-1',
                        type: 'container',
                        style: {
                          backgroundColor: '#fff',
                          padding: '10px 14px',
                          borderRadius: '4px 16px 16px 16px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        },
                        children: [
                          {
                            id: 'groom-text-1',
                            type: 'text',
                            props: { content: '{{greeting.groomMessage}}', as: 'p' },
                            style: { fontSize: 14, lineHeight: 1.5, color: '#333', whiteSpace: 'pre-wrap' },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },

              // 신부 메시지 1 - 답장
              {
                id: 'bride-msg-1',
                type: 'container',
                style: {
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                },
                children: [
                  {
                    id: 'bride-avatar',
                    type: 'avatar',
                    props: {
                      src: '{{photos.brideProfile}}',
                      size: 40,
                      shape: 'rounded',
                    },
                    style: {
                      flexShrink: 0,
                    },
                  },
                  {
                    id: 'bride-bubble-wrap-1',
                    type: 'container',
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      maxWidth: '70%',
                    },
                    children: [
                      {
                        id: 'bride-name-label',
                        type: 'text',
                        props: { content: '{{couple.bride.name}}', as: 'span' },
                        style: { fontSize: 12, color: '#333', marginBottom: 2 },
                      },
                      {
                        id: 'bride-bubble-1',
                        type: 'container',
                        style: {
                          backgroundColor: '#fff',
                          padding: '10px 14px',
                          borderRadius: '4px 16px 16px 16px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        },
                        children: [
                          {
                            id: 'bride-text-1',
                            type: 'text',
                            props: { content: '{{greeting.brideMessage}}', as: 'p' },
                            style: { fontSize: 14, lineHeight: 1.5, color: '#333', whiteSpace: 'pre-wrap' },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },

              // 메인 사진 (공유된 이미지)
              {
                id: 'shared-photo',
                type: 'container',
                style: {
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 8,
                  marginBottom: 8,
                },
                children: [
                  {
                    id: 'main-photo-bubble',
                    type: 'container',
                    style: {
                      backgroundColor: '#fff',
                      padding: 4,
                      borderRadius: 16,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      maxWidth: '80%',
                    },
                    children: [
                      {
                        id: 'main-photo',
                        type: 'image',
                        props: {
                          src: '{{photos.main}}',
                          aspectRatio: '3:4',
                          objectFit: 'cover',
                        },
                        style: {
                          width: '100%',
                          borderRadius: 12,
                        },
                      },
                    ],
                  },
                ],
              },

              // 신랑 메시지 2 - 날짜 안내
              {
                id: 'groom-msg-2',
                type: 'container',
                style: {
                  display: 'flex',
                  justifyContent: 'flex-end',
                },
                children: [
                  {
                    id: 'groom-bubble-2',
                    type: 'container',
                    style: {
                      backgroundColor: '#FEE500',
                      padding: '10px 14px',
                      borderRadius: '16px 16px 4px 16px',
                      maxWidth: '70%',
                    },
                    children: [
                      {
                        id: 'groom-text-2',
                        type: 'text',
                        props: { content: '우리 결혼해요! 💍', as: 'p' },
                        style: { fontSize: 14, lineHeight: 1.5, color: '#333', fontWeight: 500 },
                      },
                    ],
                  },
                ],
              },

              // 신부 메시지 2 - 장소 안내
              {
                id: 'bride-msg-2',
                type: 'container',
                style: {
                  display: 'flex',
                  justifyContent: 'flex-end',
                },
                children: [
                  {
                    id: 'bride-bubble-2',
                    type: 'container',
                    style: {
                      backgroundColor: '#FEE500',
                      padding: '10px 14px',
                      borderRadius: '16px 16px 4px 16px',
                      maxWidth: '70%',
                    },
                    children: [
                      {
                        id: 'bride-text-2',
                        type: 'text',
                        props: { content: '{{wedding.dateDisplay}} {{wedding.timeDisplay}}', as: 'p' },
                        style: { fontSize: 14, lineHeight: 1.5, color: '#333' },
                      },
                      {
                        id: 'bride-text-3',
                        type: 'text',
                        props: { content: '{{venue.name}} {{venue.hall}}', as: 'p' },
                        style: { fontSize: 14, lineHeight: 1.5, color: '#333', marginTop: 4 },
                      },
                    ],
                  },
                ],
              },

              // 지도 링크 카드
              {
                id: 'map-card',
                type: 'container',
                style: {
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 4,
                },
                children: [
                  {
                    id: 'map-bubble',
                    type: 'container',
                    style: {
                      backgroundColor: '#fff',
                      borderRadius: 16,
                      overflow: 'hidden',
                      maxWidth: '80%',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    },
                    children: [
                      {
                        id: 'map-preview',
                        type: 'container',
                        style: {
                          height: 100,
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        children: [
                          {
                            id: 'map-icon',
                            type: 'text',
                            props: { content: '📍', as: 'span' },
                            style: { fontSize: 32 },
                          },
                        ],
                      },
                      {
                        id: 'map-info',
                        type: 'container',
                        style: {
                          padding: '12px 14px',
                        },
                        children: [
                          {
                            id: 'venue-name',
                            type: 'text',
                            props: { content: '{{venue.name}}', as: 'p' },
                            style: { fontSize: 14, fontWeight: 600, color: '#333' },
                          },
                          {
                            id: 'venue-hall',
                            type: 'text',
                            props: { content: '{{venue.hall}}', as: 'p' },
                            style: { fontSize: 13, color: '#555', marginTop: 2 },
                          },
                          {
                            id: 'venue-address',
                            type: 'text',
                            props: { content: '{{venue.address}}', as: 'p' },
                            style: { fontSize: 12, color: '#888', marginTop: 4, whiteSpace: 'pre-wrap' },
                          },
                        ],
                      },
                      // 지도 버튼들
                      {
                        id: 'map-buttons',
                        type: 'container',
                        style: {
                          display: 'flex',
                          borderTop: '1px solid #e5e7eb',
                        },
                        children: [
                          {
                            id: 'kakao-map-btn',
                            type: 'button',
                            props: {
                              label: '카카오맵',
                              href: '{{venue.kakaoMapUrl}}',
                            },
                            style: {
                              flex: 1,
                              padding: '12px',
                              fontSize: 13,
                              fontWeight: 500,
                              color: '#333',
                              backgroundColor: '#fff',
                              border: 'none',
                              borderRight: '1px solid #e5e7eb',
                              cursor: 'pointer',
                            },
                          },
                          {
                            id: 'naver-map-btn',
                            type: 'button',
                            props: {
                              label: '네이버지도',
                              href: '{{venue.naverMapUrl}}',
                            },
                            style: {
                              flex: 1,
                              padding: '12px',
                              fontSize: 13,
                              fontWeight: 500,
                              color: '#333',
                              backgroundColor: '#fff',
                              border: 'none',
                              cursor: 'pointer',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },

              // 갤러리 섹션 (여러 사진)
              {
                id: 'gallery-section',
                type: 'container',
                style: {
                  marginTop: 16,
                },
                children: [
                  {
                    id: 'gallery-label',
                    type: 'container',
                    style: {
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: 8,
                    },
                    children: [
                      {
                        id: 'gallery-badge',
                        type: 'text',
                        props: { content: '📸 우리의 사진', as: 'span' },
                        style: {
                          fontSize: 12,
                          color: '#fff',
                          backgroundColor: 'rgba(0,0,0,0.25)',
                          padding: '4px 12px',
                          borderRadius: 12,
                        },
                      },
                    ],
                  },
                  {
                    id: 'gallery-grid',
                    type: 'grid',
                    props: {
                      images: '{{photos.gallery}}',
                      columns: 3,
                      gap: 4,
                    },
                    style: {
                      borderRadius: 12,
                      overflow: 'hidden',
                    },
                  },
                ],
              },

              // 마음 전하기 버튼
              {
                id: 'account-section',
                type: 'container',
                style: {
                  marginTop: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                },
                children: [
                  {
                    id: 'account-groom',
                    type: 'button',
                    props: {
                      label: '💰 신랑측 마음 전하기',
                      variant: 'outline',
                    },
                    style: {
                      width: '100%',
                      padding: '14px',
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#333',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    },
                  },
                  {
                    id: 'account-bride',
                    type: 'button',
                    props: {
                      label: '💰 신부측 마음 전하기',
                      variant: 'outline',
                    },
                    style: {
                      width: '100%',
                      padding: '14px',
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#333',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    },
                  },
                ],
              },

              // 참석 여부 버튼
              {
                id: 'rsvp-section',
                type: 'container',
                style: {
                  marginTop: 16,
                },
                children: [
                  {
                    id: 'rsvp-button',
                    type: 'button',
                    props: {
                      label: '✅ 참석 여부 전달하기',
                      variant: 'primary',
                    },
                    style: {
                      width: '100%',
                      padding: '14px',
                      backgroundColor: '#FEE500',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#333',
                    },
                  },
                ],
              },

              // 하단 여백
              {
                id: 'bottom-spacer',
                type: 'spacer',
                props: { height: 40 },
              },
            ],
          },

          // 채팅 입력창 (장식용)
          {
            id: 'chat-input',
            type: 'container',
            style: {
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              backgroundColor: '#fff',
              borderTop: '1px solid #e5e7eb',
              gap: 8,
            },
            children: [
              {
                id: 'plus-btn',
                type: 'text',
                props: { content: '+', as: 'span' },
                style: {
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '50%',
                  fontSize: 20,
                  color: '#666',
                },
              },
              {
                id: 'input-field',
                type: 'container',
                style: {
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: 20,
                },
                children: [
                  {
                    id: 'input-placeholder',
                    type: 'text',
                    props: { content: '축하 메시지를 남겨주세요', as: 'span' },
                    style: { fontSize: 14, color: '#9ca3af' },
                  },
                ],
              },
              {
                id: 'send-btn',
                type: 'text',
                props: { content: '➤', as: 'span' },
                style: {
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FEE500',
                  borderRadius: '50%',
                  fontSize: 16,
                  color: '#333',
                },
              },
            ],
          },
        ],
      },
    },
  ],
}

// ============================================
// Style Schema - 카카오톡 스타일
// ============================================

export const kakaoStyleSchema: StyleSchema = {
  version: '1.0',
  meta: {
    id: 'kakao-style-v1',
    name: '카카오톡 스타일',
    mood: ['playful', 'minimal'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  theme: {
    colors: {
      primary: {
        50: '#FFFDE7',
        100: '#FFF9C4',
        200: '#FFF59D',
        300: '#FFF176',
        400: '#FFEE58',
        500: '#FEE500', // 카카오 노랑
        600: '#FDD835',
        700: '#FBC02D',
        800: '#F9A825',
        900: '#F57F17',
      },
      neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e7eb',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
      },
      background: {
        default: '#B2C7D9', // 카카오톡 채팅방 배경
        paper: '#ffffff',
        subtle: '#f3f4f6',
      },
      text: {
        primary: '#1f2937',
        secondary: '#6b7280',
        muted: '#9ca3af',
        inverse: '#ffffff',
      },
    },
    typography: {
      fonts: {
        heading: {
          family: '"Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
          fallback: 'system-ui, sans-serif',
        },
        body: {
          family: '"Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
          fallback: 'system-ui, sans-serif',
        },
      },
      sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      weights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeights: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0',
        wide: '0.02em',
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
        sm: '4px',
        md: '8px',
        lg: '12px',
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
      md: '0 2px 4px rgba(0,0,0,0.1)',
      lg: '0 4px 8px rgba(0,0,0,0.1)',
      xl: '0 8px 16px rgba(0,0,0,0.1)',
    },
    animation: {
      duration: {
        fast: 150,
        normal: 300,
        slow: 500,
        slower: 700,
      },
      easing: {
        default: 'ease',
        in: 'ease-in',
        out: 'ease-out',
        inOut: 'ease-in-out',
      },
      stagger: {
        delay: 100,
        from: 'start',
      },
    },
  },
  tokens: {
    chat: {
      bubbleMine: '#FEE500',
      bubbleOther: '#ffffff',
      background: '#B2C7D9',
    },
  },
  components: {
    custom: {
      chatBubble: {
        padding: '10px 14px',
        borderRadius: '16px',
        fontSize: '14px',
        lineHeight: 1.5,
      },
    },
  },
}

// ============================================
// Editor Schema - 사용자 입력 필드 정의
// ============================================

export const kakaoEditorSchema: EditorSchema = {
  version: '1.0',
  meta: {
    id: 'kakao-editor-v1',
    name: '카카오톡 청첩장 편집기',
    description: '카카오톡 채팅 스타일의 모바일 청첩장을 만들어보세요',
    layoutId: 'kakao-chat-v1',
    styleId: 'kakao-style-v1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  sections: [
    // 1. 신랑 정보 + 메시지 (화면 순서: 헤더 → 신랑 메시지)
    {
      id: 'groom',
      title: '신랑 정보',
      description: '신랑 이름과 프로필, 인사 메시지를 입력해주세요',
      icon: '🤵',
      order: 0,
      fields: [
        {
          id: 'groom-name',
          type: 'text',
          label: '신랑 이름',
          dataPath: 'couple.groom.name',
          placeholder: '홍길동',
          required: true,
          order: 0,
        },
        {
          id: 'groom-profile',
          type: 'image',
          label: '프로필 사진',
          dataPath: 'photos.groomProfile',
          description: '카카오톡 프로필처럼 보이는 사진',
          order: 1,
        },
        {
          id: 'groom-message',
          type: 'textarea',
          label: '인사 메시지',
          dataPath: 'greeting.groomMessage',
          placeholder: '안녕하세요! 드디어 저희가 결혼합니다 😊',
          description: '신랑이 보내는 첫 번째 메시지',
          order: 2,
        },
      ],
    },

    // 2. 신부 정보 + 메시지 (화면 순서: 신부 메시지)
    {
      id: 'bride',
      title: '신부 정보',
      description: '신부 이름과 프로필, 인사 메시지를 입력해주세요',
      icon: '👰',
      order: 1,
      fields: [
        {
          id: 'bride-name',
          type: 'text',
          label: '신부 이름',
          dataPath: 'couple.bride.name',
          placeholder: '김영희',
          required: true,
          order: 0,
        },
        {
          id: 'bride-profile',
          type: 'image',
          label: '프로필 사진',
          dataPath: 'photos.brideProfile',
          description: '카카오톡 프로필처럼 보이는 사진',
          order: 1,
        },
        {
          id: 'bride-message',
          type: 'textarea',
          label: '인사 메시지',
          dataPath: 'greeting.brideMessage',
          placeholder: '오랜 시간 함께해온 우리, 이제 평생을 약속하려 합니다 💕',
          description: '신부가 보내는 답장 메시지',
          order: 2,
        },
      ],
    },

    // 3. 메인 사진 (화면 순서: 공유된 이미지)
    {
      id: 'main-photo',
      title: '메인 사진',
      description: '채팅방에서 공유되는 대표 웨딩 사진',
      icon: '📷',
      order: 2,
      fields: [
        {
          id: 'main-photo',
          type: 'image',
          label: '메인 사진',
          dataPath: 'photos.main',
          description: '세로 비율(3:4) 사진을 권장합니다',
          required: true,
          order: 0,
        },
      ],
    },

    // 4. 예식 정보 (화면 순서: 결혼해요 메시지 → 일시/장소)
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
          label: '날짜 표시 형식',
          dataPath: 'wedding.dateDisplay',
          placeholder: '2025년 5월 15일 토요일',
          description: '청첩장에 표시될 날짜 형식',
          order: 2,
        },
        {
          id: 'wedding-time-display',
          type: 'text',
          label: '시간 표시 형식',
          dataPath: 'wedding.timeDisplay',
          placeholder: '오후 2시',
          description: '청첩장에 표시될 시간 형식',
          order: 3,
        },
      ],
    },

    // 5. 예식장 정보 (화면 순서: 지도 카드)
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
          label: '예식장 이름',
          dataPath: 'venue.name',
          placeholder: '그랜드 웨딩홀',
          required: true,
          order: 0,
        },
        {
          id: 'venue-hall',
          type: 'text',
          label: '홀 이름',
          dataPath: 'venue.hall',
          placeholder: '그랜드볼룸 3층',
          order: 1,
        },
        {
          id: 'venue-address',
          type: 'textarea',
          label: '주소',
          dataPath: 'venue.address',
          placeholder: '서울시 강남구 테헤란로 123',
          required: true,
          order: 2,
        },
        {
          id: 'venue-lat',
          type: 'text',
          label: '위도',
          dataPath: 'venue.lat',
          placeholder: '37.5665',
          order: 3,
        },
        {
          id: 'venue-lng',
          type: 'text',
          label: '경도',
          dataPath: 'venue.lng',
          placeholder: '126.9780',
          order: 4,
        },
        {
          id: 'kakao-map-url',
          type: 'text',
          label: '카카오맵 URL',
          dataPath: 'venue.kakaoMapUrl',
          placeholder: 'https://map.kakao.com/...',
          description: '카카오맵에서 장소 검색 후 공유 링크를 복사해주세요',
          order: 5,
        },
        {
          id: 'naver-map-url',
          type: 'text',
          label: '네이버지도 URL',
          dataPath: 'venue.naverMapUrl',
          placeholder: 'https://map.naver.com/...',
          description: '네이버지도에서 장소 검색 후 공유 링크를 복사해주세요',
          order: 6,
        },
      ],
    },

    // 6. 갤러리 (화면 순서: 우리의 사진)
    {
      id: 'gallery',
      title: '갤러리',
      description: '더 많은 웨딩 사진을 추가해주세요',
      icon: '📸',
      order: 5,
      fields: [
        {
          id: 'gallery',
          type: 'imageList',
          label: '갤러리 사진',
          dataPath: 'photos.gallery',
          description: '최대 9장 권장',
          maxItems: 9,
          sortable: true,
          order: 0,
        },
      ],
    },

    // 7. 계좌 정보 (화면 순서: 마음 전하기 버튼)
    {
      id: 'accounts',
      title: '마음 전하기',
      description: '축의금 계좌 정보를 입력해주세요',
      icon: '💰',
      order: 6,
      collapsed: true,
      fields: [
        {
          id: 'groom-bank',
          type: 'text',
          label: '신랑측 은행',
          dataPath: 'accounts.groom.bank',
          placeholder: '카카오뱅크',
          order: 0,
        },
        {
          id: 'groom-account',
          type: 'text',
          label: '신랑측 계좌번호',
          dataPath: 'accounts.groom.accountNumber',
          placeholder: '3333-00-0000000',
          order: 1,
        },
        {
          id: 'groom-holder',
          type: 'text',
          label: '신랑측 예금주',
          dataPath: 'accounts.groom.holder',
          placeholder: '홍길동',
          order: 2,
        },
        {
          id: 'bride-bank',
          type: 'text',
          label: '신부측 은행',
          dataPath: 'accounts.bride.bank',
          placeholder: '카카오뱅크',
          order: 3,
        },
        {
          id: 'bride-account',
          type: 'text',
          label: '신부측 계좌번호',
          dataPath: 'accounts.bride.accountNumber',
          placeholder: '3333-00-0000000',
          order: 4,
        },
        {
          id: 'bride-holder',
          type: 'text',
          label: '신부측 예금주',
          dataPath: 'accounts.bride.holder',
          placeholder: '김영희',
          order: 5,
        },
      ],
    },
  ],
}

// ============================================
// Sample User Data
// ============================================

export const kakaoSampleData = {
  couple: {
    groom: { name: '김민준' },
    bride: { name: '이서연' },
  },
  wedding: {
    date: '2025-05-15',
    time: '14:00',
    dateDisplay: '2025년 5월 15일 토요일',
    timeDisplay: '오후 2시',
  },
  venue: {
    name: '더채플 앳 청담',
    hall: '그랜드볼룸',
    address: '서울시 강남구 청담동 123-45',
    lat: 37.5234,
    lng: 127.0456,
    kakaoMapUrl: 'https://map.kakao.com/link/map/더채플앳청담,37.5234,127.0456',
    naverMapUrl: 'https://map.naver.com/v5/search/더채플앳청담',
  },
  greeting: {
    groomMessage: '안녕하세요! 드디어 저희가 결혼합니다 😊\n오랫동안 함께해온 저희의 새로운 시작을 함께해주세요.',
    brideMessage: '소중한 분들을 모시고 저희의 사랑을 약속하려 합니다 💕\n바쁘시더라도 와주시면 정말 감사하겠습니다!',
  },
  photos: {
    groomProfile: 'https://picsum.photos/seed/groom/200/200',
    brideProfile: 'https://picsum.photos/seed/bride/200/200',
    main: 'https://picsum.photos/seed/wedding-main/400/533',
    gallery: [
      'https://picsum.photos/seed/w1/300/300',
      'https://picsum.photos/seed/w2/300/300',
      'https://picsum.photos/seed/w3/300/300',
      'https://picsum.photos/seed/w4/300/300',
      'https://picsum.photos/seed/w5/300/300',
      'https://picsum.photos/seed/w6/300/300',
    ],
  },
  accounts: {
    groom: {
      bank: '카카오뱅크',
      accountNumber: '3333-00-1234567',
      holder: '김민준',
    },
    bride: {
      bank: '카카오뱅크',
      accountNumber: '3333-00-7654321',
      holder: '이서연',
    },
  },
}

// ============================================
// Export combined template
// ============================================

export const kakaoTemplate = {
  layout: kakaoLayoutSchema,
  style: kakaoStyleSchema,
  editor: kakaoEditorSchema,
  sampleData: kakaoSampleData,
}

export default kakaoTemplate

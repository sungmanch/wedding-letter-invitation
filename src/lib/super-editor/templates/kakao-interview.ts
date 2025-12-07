/**
 * KakaoTalk Interview Style Wedding Invitation Template
 * 카카오톡 인터뷰 스타일 청첩장 템플릿
 * - 인터뷰어-커플 대화 형식
 * - 순차 등장 애니메이션 (sequence + animated)
 * - 태그 시스템 (신랑/신부/둘 다)
 */

import type { LayoutSchema } from '../schema/layout'
import type { StyleSchema } from '../schema/style'

// ============================================
// Layout Schema - 카카오톡 인터뷰 UI 구조
// ============================================

export const kakaoInterviewLayoutSchema: LayoutSchema = {
  version: '1.0',
  meta: {
    id: 'kakao-interview-v1',
    name: '카카오톡 인터뷰 청첩장',
    category: 'chat',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  screens: [
    // ========== Screen 1: 인터뷰 메인 ==========
    {
      id: 'interview-main',
      type: 'content',
      sectionType: 'intro',
      root: {
        id: 'interview-container',
        type: 'container',
        style: {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        },
        children: [
          // 채팅 헤더
          {
            id: 'chat-header',
            type: 'container',
            style: {
              position: 'sticky',
              top: 0,
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 16px',
              backgroundColor: '#fff',
              borderBottom: '1px solid #e5e7eb',
            },
            children: [
              {
                id: 'header-content',
                type: 'column',
                props: { align: 'center' },
                children: [
                  {
                    id: 'header-title',
                    type: 'text',
                    props: { content: '💒 Wedding Interview', as: 'p' },
                    style: {
                      fontFamily: '"Noto Sans KR", sans-serif',
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#1f2937',
                    },
                  },
                  {
                    id: 'header-subtitle',
                    type: 'text',
                    props: { content: '{{couple.bride.name}} & {{couple.groom.name}}', as: 'p' },
                    style: {
                      fontFamily: '"Noto Sans KR", sans-serif',
                      fontSize: 12,
                      color: '#6b7280',
                    },
                  },
                ],
              },
            ],
          },

          // 채팅 영역
          {
            id: 'chat-area',
            type: 'scroll-container',
            props: { direction: 'vertical' },
            style: {
              flex: 1,
              background: 'linear-gradient(180deg, #9BBBD4 0%, #7BA3C7 100%)',
              padding: '16px',
              paddingBottom: 96,
            },
            children: [
              // 인터뷰 시작 섹션
              {
                id: 'section-intro',
                type: 'container',
                style: {
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '20px 0',
                },
                children: [
                  {
                    id: 'section-intro-badge',
                    type: 'text',
                    props: { content: '🎤 웨딩 인터뷰', as: 'span' },
                    style: {
                      fontFamily: '"Noto Sans KR", sans-serif',
                      fontSize: 12,
                      fontWeight: 500,
                      padding: '8px 20px',
                      borderRadius: 20,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#4b5563',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    },
                  },
                ],
              },

              // 인터뷰 메시지 시퀀스
              {
                id: 'interview-sequence',
                type: 'sequence',
                props: { staggerDelay: 1200, direction: 'forward' },
                children: [
                  // 인터뷰어 인사
                  {
                    id: 'interviewer-intro',
                    type: 'animated',
                    props: {
                      animation: { preset: 'slide-left', duration: 400 },
                      trigger: 'inView',
                    },
                    children: [
                      {
                        id: 'interviewer-intro-msg',
                        type: 'container',
                        style: {
                          display: 'flex',
                          gap: 12,
                          alignItems: 'flex-start',
                          padding: '8px 0',
                        },
                        children: [
                          {
                            id: 'interviewer-avatar',
                            type: 'container',
                            style: {
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              backgroundColor: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 18,
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              flexShrink: 0,
                            },
                            children: [
                              {
                                id: 'interviewer-emoji',
                                type: 'text',
                                props: { content: '🎤', as: 'span' },
                              },
                            ],
                          },
                          {
                            id: 'interviewer-bubble',
                            type: 'container',
                            style: {
                              backgroundColor: '#fff',
                              padding: '12px 16px',
                              borderRadius: '4px 18px 18px 18px',
                              maxWidth: '80%',
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
                            },
                            children: [
                              {
                                id: 'interviewer-text',
                                type: 'text',
                                props: { content: '안녕하세요! 오늘 결혼을 앞둔 두 분을 만나봤습니다 ☺️', as: 'p' },
                                style: {
                                  fontFamily: '"Noto Sans KR", sans-serif',
                                  fontSize: 14,
                                  lineHeight: 1.6,
                                  color: '#1f2937',
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },

                  // 첫 만남 질문
                  {
                    id: 'q-first-meeting',
                    type: 'animated',
                    props: {
                      animation: { preset: 'slide-left', duration: 400 },
                      trigger: 'inView',
                    },
                    children: [
                      {
                        id: 'q-first-meeting-msg',
                        type: 'container',
                        style: {
                          display: 'flex',
                          gap: 12,
                          alignItems: 'flex-start',
                          padding: '8px 0',
                        },
                        children: [
                          {
                            id: 'q-avatar',
                            type: 'container',
                            style: {
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              backgroundColor: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 18,
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              flexShrink: 0,
                            },
                            children: [
                              {
                                id: 'q-emoji',
                                type: 'text',
                                props: { content: '🎤', as: 'span' },
                              },
                            ],
                          },
                          {
                            id: 'q-bubble',
                            type: 'container',
                            style: {
                              backgroundColor: '#fff',
                              padding: '12px 16px',
                              borderRadius: '4px 18px 18px 18px',
                              maxWidth: '80%',
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
                            },
                            children: [
                              {
                                id: 'q-text',
                                type: 'text',
                                props: { content: '{{interview.question1}}', as: 'p' },
                                style: {
                                  fontFamily: '"Noto Sans KR", sans-serif',
                                  fontSize: 14,
                                  lineHeight: 1.6,
                                  color: '#1f2937',
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },

                  // 신랑 답변
                  {
                    id: 'a-groom-1',
                    type: 'animated',
                    props: {
                      animation: { preset: 'slide-right', duration: 400 },
                      trigger: 'inView',
                    },
                    children: [
                      {
                        id: 'a-groom-1-msg',
                        type: 'container',
                        style: {
                          display: 'flex',
                          justifyContent: 'flex-end',
                          padding: '8px 0',
                        },
                        children: [
                          {
                            id: 'a-groom-1-bubble',
                            type: 'container',
                            style: {
                              backgroundColor: '#FEE500',
                              padding: '12px 16px',
                              borderRadius: '18px 4px 18px 18px',
                              maxWidth: '80%',
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                            },
                            children: [
                              {
                                id: 'a-groom-1-tag',
                                type: 'text',
                                props: { content: '{{couple.groom.name}}', as: 'span' },
                                style: {
                                  display: 'inline-block',
                                  fontFamily: '"Noto Sans KR", sans-serif',
                                  fontSize: 11,
                                  fontWeight: 600,
                                  padding: '2px 8px',
                                  borderRadius: 10,
                                  marginBottom: 6,
                                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                  color: '#2563eb',
                                },
                              },
                              {
                                id: 'a-groom-1-text',
                                type: 'text',
                                props: { content: '{{interview.answer1Groom}}', as: 'p' },
                                style: {
                                  fontFamily: '"Noto Sans KR", sans-serif',
                                  fontSize: 14,
                                  lineHeight: 1.6,
                                  color: '#3c1e1e',
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },

                  // 신부 답변
                  {
                    id: 'a-bride-1',
                    type: 'animated',
                    props: {
                      animation: { preset: 'slide-right', duration: 400 },
                      trigger: 'inView',
                    },
                    children: [
                      {
                        id: 'a-bride-1-msg',
                        type: 'container',
                        style: {
                          display: 'flex',
                          justifyContent: 'flex-end',
                          padding: '8px 0',
                        },
                        children: [
                          {
                            id: 'a-bride-1-bubble',
                            type: 'container',
                            style: {
                              backgroundColor: '#FEE500',
                              padding: '12px 16px',
                              borderRadius: '18px 4px 18px 18px',
                              maxWidth: '80%',
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                            },
                            children: [
                              {
                                id: 'a-bride-1-tag',
                                type: 'text',
                                props: { content: '{{couple.bride.name}}', as: 'span' },
                                style: {
                                  display: 'inline-block',
                                  fontFamily: '"Noto Sans KR", sans-serif',
                                  fontSize: 11,
                                  fontWeight: 600,
                                  padding: '2px 8px',
                                  borderRadius: 10,
                                  marginBottom: 6,
                                  backgroundColor: 'rgba(236, 72, 153, 0.15)',
                                  color: '#db2777',
                                },
                              },
                              {
                                id: 'a-bride-1-text',
                                type: 'text',
                                props: { content: '{{interview.answer1Bride}}', as: 'p' },
                                style: {
                                  fontFamily: '"Noto Sans KR", sans-serif',
                                  fontSize: 14,
                                  lineHeight: 1.6,
                                  color: '#3c1e1e',
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },

                  // 사진 공유
                  {
                    id: 'shared-image',
                    type: 'animated',
                    props: {
                      animation: { preset: 'scale-in', duration: 500 },
                      trigger: 'inView',
                    },
                    children: [
                      {
                        id: 'shared-image-container',
                        type: 'container',
                        style: {
                          display: 'flex',
                          justifyContent: 'center',
                          padding: '12px 0',
                        },
                        children: [
                          {
                            id: 'shared-image-frame',
                            type: 'container',
                            style: {
                              borderRadius: 16,
                              overflow: 'hidden',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            },
                            children: [
                              {
                                id: 'shared-photo',
                                type: 'image',
                                props: {
                                  src: '{{photos.main}}',
                                  objectFit: 'cover',
                                },
                                style: {
                                  width: 224,
                                  height: 224,
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },

                  // 결혼 발표 시스템 메시지
                  {
                    id: 'system-announcement',
                    type: 'animated',
                    props: {
                      animation: { preset: 'scale-in', duration: 500 },
                      trigger: 'inView',
                    },
                    children: [
                      {
                        id: 'announcement-container',
                        type: 'container',
                        style: {
                          textAlign: 'center',
                          padding: '30px 16px',
                        },
                        children: [
                          {
                            id: 'announcement-card',
                            type: 'container',
                            style: {
                              display: 'inline-block',
                              background: 'linear-gradient(135deg, #FEE500 0%, #FFD700 100%)',
                              color: '#3c1e1e',
                              fontFamily: '"Noto Sans KR", sans-serif',
                              fontWeight: 700,
                              fontSize: 18,
                              padding: '20px 40px',
                              borderRadius: 30,
                              boxShadow: '0 6px 20px rgba(254, 229, 0, 0.4)',
                            },
                            children: [
                              {
                                id: 'announcement-text',
                                type: 'text',
                                props: { content: '💒 저희 결혼합니다', as: 'span' },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },

                  // 결혼 정보 카드
                  {
                    id: 'wedding-info-card',
                    type: 'animated',
                    props: {
                      animation: { preset: 'scale-in', duration: 500 },
                      trigger: 'inView',
                    },
                    children: [
                      {
                        id: 'info-card-container',
                        type: 'container',
                        style: {
                          padding: '12px 0',
                        },
                        children: [
                          {
                            id: 'info-card',
                            type: 'container',
                            style: {
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              borderRadius: 16,
                              padding: 20,
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              textAlign: 'center',
                            },
                            children: [
                              {
                                id: 'info-date-icon',
                                type: 'text',
                                props: { content: '📅', as: 'p' },
                                style: { fontSize: 32, marginBottom: 12 },
                              },
                              {
                                id: 'info-date',
                                type: 'text',
                                props: { content: '{{wedding.date}}', as: 'p' },
                                style: {
                                  fontFamily: '"Noto Sans KR", sans-serif',
                                  fontSize: 18,
                                  fontWeight: 700,
                                  color: '#1f2937',
                                },
                              },
                              {
                                id: 'info-time',
                                type: 'text',
                                props: { content: '{{wedding.time}}', as: 'p' },
                                style: {
                                  fontFamily: '"Noto Sans KR", sans-serif',
                                  fontSize: 14,
                                  color: '#4b5563',
                                },
                              },
                              {
                                id: 'info-divider',
                                type: 'container',
                                style: {
                                  borderTop: '1px solid #e5e7eb',
                                  margin: '16px 0',
                                },
                              },
                              {
                                id: 'info-venue-icon',
                                type: 'text',
                                props: { content: '📍', as: 'p' },
                                style: { fontSize: 32, marginBottom: 12 },
                              },
                              {
                                id: 'info-venue-name',
                                type: 'text',
                                props: { content: '{{wedding.venue.name}}', as: 'p' },
                                style: {
                                  fontFamily: '"Noto Sans KR", sans-serif',
                                  fontSize: 16,
                                  fontWeight: 700,
                                  color: '#1f2937',
                                },
                              },
                              {
                                id: 'info-venue-address',
                                type: 'text',
                                props: { content: '{{wedding.venue.address}}', as: 'p' },
                                style: {
                                  fontFamily: '"Noto Sans KR", sans-serif',
                                  fontSize: 13,
                                  color: '#6b7280',
                                  marginTop: 4,
                                },
                              },
                              {
                                id: 'map-button',
                                type: 'button',
                                props: {
                                  label: '지도 보기',
                                  variant: 'primary',
                                },
                                style: {
                                  marginTop: 16,
                                  padding: '8px 24px',
                                  backgroundColor: '#FEE500',
                                  color: '#3c1e1e',
                                  border: 'none',
                                  borderRadius: 9999,
                                  fontSize: 14,
                                  fontWeight: 500,
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },

                  // 마지막 인사
                  {
                    id: 'closing-message',
                    type: 'animated',
                    props: {
                      animation: { preset: 'slide-right', duration: 400 },
                      trigger: 'inView',
                    },
                    children: [
                      {
                        id: 'closing-msg',
                        type: 'container',
                        style: {
                          display: 'flex',
                          justifyContent: 'flex-end',
                          padding: '8px 0',
                        },
                        children: [
                          {
                            id: 'closing-bubble',
                            type: 'container',
                            style: {
                              backgroundColor: '#FEE500',
                              padding: '12px 16px',
                              borderRadius: '18px 4px 18px 18px',
                              maxWidth: '80%',
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                            },
                            children: [
                              {
                                id: 'closing-tag',
                                type: 'text',
                                props: { content: '{{couple.bride.name}} & {{couple.groom.name}}', as: 'span' },
                                style: {
                                  display: 'inline-block',
                                  fontFamily: '"Noto Sans KR", sans-serif',
                                  fontSize: 11,
                                  fontWeight: 600,
                                  padding: '2px 8px',
                                  borderRadius: 10,
                                  marginBottom: 6,
                                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                                  color: '#9333ea',
                                },
                              },
                              {
                                id: 'closing-text',
                                type: 'text',
                                props: { content: '{{interview.closingMessage}}', as: 'p', html: true },
                                style: {
                                  fontFamily: '"Noto Sans KR", sans-serif',
                                  fontSize: 14,
                                  lineHeight: 1.6,
                                  color: '#3c1e1e',
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
            ],
          },

          // 하단 입력창 (장식용)
          {
            id: 'input-area',
            type: 'container',
            style: {
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              maxWidth: 375,
              margin: '0 auto',
              padding: 12,
              backgroundColor: '#fff',
              borderTop: '1px solid #e5e7eb',
            },
            children: [
              {
                id: 'input-placeholder',
                type: 'container',
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: [
                  {
                    id: 'input-text',
                    type: 'text',
                    props: { content: '💕 감사합니다 💕', as: 'p' },
                    style: {
                      fontFamily: '"Noto Sans KR", sans-serif',
                      fontSize: 14,
                      color: '#9ca3af',
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
// Style Schema - 카카오톡 인터뷰 스타일
// ============================================

export const kakaoInterviewStyleSchema: StyleSchema = {
  version: '1.0',
  meta: {
    id: 'kakao-interview-style-v1',
    name: '카카오톡 인터뷰 스타일',
    mood: ['playful', 'modern', 'cozy'],
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
        default: 'linear-gradient(180deg, #9BBBD4 0%, #7BA3C7 100%)',
        paper: '#ffffff',
        subtle: '#f3f4f6',
      },
      text: {
        primary: '#1f2937',
        secondary: '#4b5563',
        muted: '#9ca3af',
        inverse: '#ffffff',
      },
    },
    typography: {
      fonts: {
        heading: {
          family: '"Noto Sans KR", sans-serif',
          fallback: 'system-ui, sans-serif',
        },
        body: {
          family: '"Noto Sans KR", sans-serif',
          fallback: 'system-ui, sans-serif',
        },
      },
      sizes: {
        xs: '0.6875rem',
        sm: '0.75rem',
        base: '0.875rem',
        lg: '0.9375rem',
        xl: '1.125rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      weights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeights: {
        tight: 1.25,
        normal: 1.6,
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
        md: '10px',
        lg: '16px',
        xl: '18px',
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
      md: '0 2px 8px rgba(0,0,0,0.1)',
      lg: '0 4px 12px rgba(0,0,0,0.15)',
      xl: '0 6px 20px rgba(254, 229, 0, 0.4)',
    },
    animation: {
      duration: {
        fast: 150,
        normal: 400,
        slow: 500,
        slower: 1200,
      },
      easing: {
        default: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        in: 'ease-in',
        out: 'ease-out',
        inOut: 'ease-in-out',
      },
      stagger: {
        delay: 1200,
        from: 'start',
      },
    },
  },
  tokens: {
    kakao: {
      yellow: '#FEE500',
      brown: '#3C1E1E',
      chatBg: 'linear-gradient(180deg, #9BBBD4 0%, #7BA3C7 100%)',
      bubbleInterviewer: '#ffffff',
      bubbleCouple: '#FEE500',
    },
    tags: {
      groomBg: 'rgba(59, 130, 246, 0.15)',
      groomColor: '#2563eb',
      brideBg: 'rgba(236, 72, 153, 0.15)',
      brideColor: '#db2777',
      bothBg: 'rgba(168, 85, 247, 0.15)',
      bothColor: '#9333ea',
    },
  },
  components: {
    custom: {
      bubbleInterviewer: {
        backgroundColor: '#ffffff',
        padding: '12px 16px',
        borderRadius: '4px 18px 18px 18px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
      },
      bubbleCouple: {
        backgroundColor: '#FEE500',
        padding: '12px 16px',
        borderRadius: '18px 4px 18px 18px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      },
      answerTag: {
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 10,
        marginBottom: 6,
      },
    },
  },
}

// ============================================
// Editor Schema - 사용자 입력 필드 정의
// ============================================

export const kakaoInterviewEditorSchema = {
  version: '1.0',
  meta: {
    id: 'kakao-interview-editor-v1',
    name: '카카오톡 인터뷰 청첩장 편집기',
    description: '인터뷰 형식의 재미있는 청첩장을 만들어보세요',
    layoutId: 'kakao-interview-v1',
    styleId: 'kakao-interview-style-v1',
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
          label: '신랑 이름',
          dataPath: 'couple.groom.name',
          placeholder: '길동',
          required: true,
          order: 0,
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
          label: '신부 이름',
          dataPath: 'couple.bride.name',
          placeholder: '지윤',
          required: true,
          order: 0,
        },
      ],
    },

    // 3. 인터뷰 Q&A
    {
      id: 'interview',
      title: '인터뷰 질문/답변',
      description: '인터뷰 형식의 질문과 답변을 입력해주세요',
      icon: '🎤',
      order: 2,
      fields: [
        {
          id: 'question1',
          type: 'text',
          label: '첫 번째 질문',
          dataPath: 'interview.question1',
          placeholder: '두 분은 어떻게 처음 만나게 되셨나요?',
          order: 0,
        },
        {
          id: 'answer1-groom',
          type: 'textarea',
          label: '신랑 답변',
          dataPath: 'interview.answer1Groom',
          placeholder: '친구 소개로 만났어요. 2019년 봄이었죠 🌸',
          order: 1,
        },
        {
          id: 'answer1-bride',
          type: 'textarea',
          label: '신부 답변',
          dataPath: 'interview.answer1Bride',
          placeholder: '첫인상이 좀 차가워 보였는데... 알고 보니 엄청 긴장한 거였대요 ㅋㅋ',
          order: 2,
        },
        {
          id: 'closing-message',
          type: 'textarea',
          label: '마무리 메시지',
          dataPath: 'interview.closingMessage',
          placeholder: '저희의 새로운 시작을 함께 축복해주세요.\n소중한 분들을 모시고 사랑의 결실을 맺으려 합니다. 💕',
          description: '마지막에 함께 전하는 메시지',
          order: 3,
        },
      ],
    },

    // 4. 사진
    {
      id: 'photos',
      title: '사진',
      description: '채팅방에 공유될 사진',
      icon: '📷',
      order: 3,
      fields: [
        {
          id: 'main-photo',
          type: 'image',
          label: '메인 사진',
          dataPath: 'photos.main',
          description: '정사각형 비율 권장',
          required: true,
          order: 0,
        },
      ],
    },

    // 5. 예식 정보
    {
      id: 'wedding',
      title: '예식 일시',
      description: '예식 날짜와 시간을 입력해주세요',
      icon: '💒',
      order: 4,
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
          placeholder: '2025년 11월 30일',
          order: 2,
        },
        {
          id: 'wedding-day-time-display',
          type: 'text',
          label: '요일/시간 표시',
          dataPath: 'wedding.dayTimeDisplay',
          placeholder: '일요일 오전 11시 30분',
          order: 3,
        },
      ],
    },

    // 6. 예식장 정보
    {
      id: 'venue',
      title: '예식장 정보',
      description: '예식장 위치 정보를 입력해주세요',
      icon: '📍',
      order: 5,
      fields: [
        {
          id: 'venue-name',
          type: 'text',
          label: '예식장 이름',
          dataPath: 'venue.name',
          placeholder: '청담 더채플',
          required: true,
          order: 0,
        },
        {
          id: 'venue-address',
          type: 'textarea',
          label: '주소',
          dataPath: 'venue.address',
          placeholder: '서울 강남구 청담동',
          order: 1,
        },
      ],
    },
  ],
}

// ============================================
// Sample User Data
// ============================================

export const kakaoInterviewSampleData = {
  couple: {
    groom: {
      name: '길동',
      englishName: 'Gildong',
    },
    bride: {
      name: '지윤',
      englishName: 'Jiyoon',
    },
  },
  interview: {
    question1: '두 분은 어떻게 처음 만나게 되셨나요?',
    answer1Groom: '친구 소개로 만났어요. 2019년 봄이었죠 🌸',
    answer1Bride: '첫인상이 좀 차가워 보였는데... 알고 보니 엄청 긴장한 거였대요 ㅋㅋ',
    closingMessage: '저희의 새로운 시작을 함께 축복해주세요.<br/>소중한 분들을 모시고 사랑의 결실을 맺으려 합니다. 💕',
  },
  wedding: {
    date: '2025년 11월 30일',
    time: '오전 11시 30분',
    venue: {
      name: '청담 더채플',
      hall: '그랜드볼룸',
      address: '서울 강남구 청담동',
    },
  },
  photos: {
    main: 'https://picsum.photos/seed/interview-main/400/400',
  },
}

// ============================================
// Export combined template
// ============================================

export const kakaoInterviewTemplate = {
  layout: kakaoInterviewLayoutSchema,
  style: kakaoInterviewStyleSchema,
  sampleData: kakaoInterviewSampleData,
}

export default kakaoInterviewTemplate

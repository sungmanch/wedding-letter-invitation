/**
 * Super Editor - Date Section Skeleton
 * 예식 날짜 섹션
 */

import type { SectionSkeleton } from '../types'

export const dateSkeleton: SectionSkeleton = {
  sectionType: 'date',
  name: '예식 일시',
  description: '결혼식 날짜와 시간, D-day 카운트다운을 표시합니다.',
  defaultVariant: 'countdown',
  variants: [
    // ============================================
    // Countdown Variant
    // ============================================
    {
      id: 'countdown',
      name: '카운트다운',
      description: 'D-day 카운트다운을 강조하는 레이아웃',
      tags: ['modern', 'dynamic', 'interactive'],
      structure: {
        id: 'date-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'date-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            style: {
              alignItems: 'center',
            },
            children: [
              {
                id: 'date-title',
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
                  content: '예식 일시',
                  as: 'h2',
                },
              },
              {
                id: 'date-info',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.xs',
                },
                style: {
                  alignItems: 'center',
                },
                children: [
                  {
                    id: 'date-full',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingLg.fontFamily',
                      fontSize: '$token.typography.headingLg.fontSize',
                      fontWeight: '$token.typography.headingLg.fontWeight',
                      color: '$token.colors.brand',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '{{wedding.date}}',
                      as: 'p',
                    },
                  },
                  {
                    id: 'date-time',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodyLg.fontFamily',
                      fontSize: '$token.typography.bodyLg.fontSize',
                      color: '$token.colors.text.secondary',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '{{wedding.time}}',
                      as: 'p',
                    },
                  },
                ],
              },
              {
                id: 'date-countdown',
                type: 'countdown',
                props: {
                  date: '{{wedding.date}}',
                  time: '{{wedding.time}}',
                  showCards: true,
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'wedding-date',
          path: 'wedding.date',
          type: 'date',
          required: true,
          description: '예식 날짜',
          defaultValue: '2025-03-15',
        },
        {
          id: 'wedding-time',
          path: 'wedding.time',
          type: 'time',
          required: true,
          description: '예식 시간',
          defaultValue: '14:00',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
          { id: 'stagger', name: '순차 등장', preset: 'stagger', trigger: 'inView', duration: 600 },
        ],
      },
    },

    // ============================================
    // Calendar Variant
    // ============================================
    {
      id: 'calendar',
      name: '캘린더',
      description: '달력 형태로 날짜를 표시하는 레이아웃',
      tags: ['classic', 'elegant', 'traditional'],
      structure: {
        id: 'date-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'date-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            style: {
              alignItems: 'center',
            },
            children: [
              {
                id: 'date-title',
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
                  content: '예식 일시',
                  as: 'h2',
                },
              },
              {
                id: 'date-info',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.xs',
                },
                style: {
                  alignItems: 'center',
                },
                children: [
                  // 숨김 데이터 참조 (변수 추출용 - wedding.time 필드 노출)
                  {
                    id: 'date-time-hidden',
                    type: 'text',
                    style: {
                      display: 'none',
                    },
                    props: {
                      content: '{{wedding.time}}',
                      as: 'span',
                    },
                  },
                  {
                    id: 'date-full-ko',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingMd.fontFamily',
                      fontSize: '$token.typography.headingMd.fontSize',
                      fontWeight: '$token.typography.headingMd.fontWeight',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '{{wedding.dateDisplay}} | {{wedding.timeDisplay}}',
                      as: 'p',
                    },
                  },
                ],
              },
              {
                id: 'date-calendar-wrapper',
                type: 'column',
                tokenStyle: {
                  padding: '$token.spacing.lg',
                  backgroundColor: '$token.colors.surface',
                  borderRadius: '$token.borders.radiusMd',
                },
                style: {
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '360px',
                },
                children: [
                  {
                    id: 'date-calendar',
                    type: 'calendar',
                    props: {
                      date: '{{wedding.date}}',
                      locale: 'ko',
                      highlightStyle: 'circle',
                      showHolidayColor: true,
                      showSaturdayColor: true,
                    },
                  },
                ],
              },
              {
                id: 'date-countdown',
                type: 'countdown',
                props: {
                  date: '{{wedding.date}}',
                  time: '{{wedding.time}}',
                  showCards: true,
                },
              },
              {
                id: 'date-dday-text',
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
                  content: '{{couple.groom.name}} ♥ {{couple.bride.name}} 결혼식이 {{countdown.days}}일 남았습니다',
                  as: 'p',
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'wedding-date',
          path: 'wedding.date',
          type: 'date',
          required: true,
          description: '예식 날짜',
          defaultValue: '2025-03-15',
        },
        {
          id: 'wedding-time',
          path: 'wedding.time',
          type: 'time',
          required: true,
          description: '예식 시간',
          defaultValue: '14:00',
        },
        {
          id: 'groom-name',
          path: 'couple.groom.name',
          type: 'text',
          required: true,
          description: '신랑 이름',
          defaultValue: '신랑',
        },
        {
          id: 'bride-name',
          path: 'couple.bride.name',
          type: 'text',
          required: true,
          description: '신부 이름',
          defaultValue: '신부',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 600 },
          { id: 'scale', name: '스케일 인', preset: 'scale-in', trigger: 'inView', duration: 500 },
        ],
      },
    },

    // ============================================
    // Save The Date Variant
    // ============================================
    {
      id: 'save-the-date',
      name: 'Save The Date',
      description: '영문 스타일의 세이브더데이트 레이아웃 (코너 프레임 펼침 + 블러 해제 애니메이션)',
      tags: ['modern', 'western', 'elegant', 'minimal', 'animated'],
      structure: {
        id: 'date-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'date-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            style: {
              alignItems: 'center',
              position: 'relative',
              minHeight: '600px',
              paddingTop: '40px',
              paddingBottom: '40px',
            },
            children: [
              // 코너 프레임 장식 (각 코너별 scroll-trigger)
              {
                id: 'corner-frame',
                type: 'container',
                style: {
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  pointerEvents: 'none',
                },
                children: [
                  // 좌상단 코너
                  {
                    id: 'corner-tl-trigger',
                    type: 'scroll-trigger',
                    style: {
                      position: 'absolute',
                      top: '0',
                      left: '20px',
                    },
                    props: {
                      animation: { preset: 'corner-expand-tl' },
                      scrub: true,
                    },
                    children: [
                      {
                        id: 'corner-tl',
                        type: 'text',
                        tokenStyle: {
                          color: '$token.colors.text.primary',
                        },
                        style: {
                          fontSize: '24px',
                          fontWeight: '100',
                        },
                        props: {
                          content: '┌',
                          as: 'span',
                        },
                      },
                    ],
                  },
                  // 우상단 코너
                  {
                    id: 'corner-tr-trigger',
                    type: 'scroll-trigger',
                    style: {
                      position: 'absolute',
                      top: '0',
                      right: '20px',
                    },
                    props: {
                      animation: { preset: 'corner-expand-tr' },
                      scrub: true,
                    },
                    children: [
                      {
                        id: 'corner-tr',
                        type: 'text',
                        tokenStyle: {
                          color: '$token.colors.text.primary',
                        },
                        style: {
                          fontSize: '24px',
                          fontWeight: '100',
                        },
                        props: {
                          content: '┐',
                          as: 'span',
                        },
                      },
                    ],
                  },
                  // 좌하단 코너
                  {
                    id: 'corner-bl-trigger',
                    type: 'scroll-trigger',
                    style: {
                      position: 'absolute',
                      bottom: '0',
                      left: '20px',
                    },
                    props: {
                      animation: { preset: 'corner-expand-bl' },
                      scrub: true,
                    },
                    children: [
                      {
                        id: 'corner-bl',
                        type: 'text',
                        tokenStyle: {
                          color: '$token.colors.text.primary',
                        },
                        style: {
                          fontSize: '24px',
                          fontWeight: '100',
                        },
                        props: {
                          content: '└',
                          as: 'span',
                        },
                      },
                    ],
                  },
                  // 우하단 코너
                  {
                    id: 'corner-br-trigger',
                    type: 'scroll-trigger',
                    style: {
                      position: 'absolute',
                      bottom: '0',
                      right: '20px',
                    },
                    props: {
                      animation: { preset: 'corner-expand-br' },
                      scrub: true,
                    },
                    children: [
                      {
                        id: 'corner-br',
                        type: 'text',
                        tokenStyle: {
                          color: '$token.colors.text.primary',
                        },
                        style: {
                          fontSize: '24px',
                          fontWeight: '100',
                        },
                        props: {
                          content: '┘',
                          as: 'span',
                        },
                      },
                    ],
                  },
                ],
              },
              // 메인 콘텐츠 (블러 해제 애니메이션)
              {
                id: 'main-content-trigger',
                type: 'scroll-trigger',
                style: {
                  width: '100%',
                },
                props: {
                  animation: { preset: 'blur-reveal' },
                  scrub: true,
                },
                children: [
                  {
                    id: 'main-content',
                    type: 'column',
                    tokenStyle: {
                      gap: '$token.spacing.md',
                    },
                    style: {
                      alignItems: 'center',
                    },
                    children: [
                      // Save The Date 타이틀
                      {
                        id: 'save-the-date-title',
                        type: 'row',
                        style: {
                          alignItems: 'baseline',
                          justifyContent: 'center',
                          gap: '8px',
                        },
                        children: [
                          {
                            id: 'save-text',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.sectionTitle.fontFamily',
                              color: '$token.colors.text.primary',
                            },
                            style: {
                              fontSize: '14px',
                              fontWeight: '600',
                              letterSpacing: '0.15em',
                              textTransform: 'uppercase',
                            },
                            props: {
                              content: 'SAVE',
                              as: 'span',
                            },
                          },
                          {
                            id: 'the-text',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.displayLg.fontFamily',
                              color: '$token.colors.text.primary',
                            },
                            style: {
                              fontSize: '20px',
                              fontStyle: 'italic',
                              fontWeight: '400',
                            },
                            props: {
                              content: 'The',
                              as: 'span',
                            },
                          },
                          {
                            id: 'date-text',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.sectionTitle.fontFamily',
                              color: '$token.colors.text.primary',
                            },
                            style: {
                              fontSize: '14px',
                              fontWeight: '600',
                              letterSpacing: '0.15em',
                              textTransform: 'uppercase',
                            },
                            props: {
                              content: 'DATE',
                              as: 'span',
                            },
                          },
                        ],
                      },
                      // 날짜 대형 표시
                      {
                        id: 'date-large',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayLg.fontFamily',
                          color: '$token.colors.text.primary',
                        },
                        style: {
                          fontSize: '48px',
                          fontWeight: '300',
                          letterSpacing: '0.05em',
                          textAlign: 'center',
                        },
                        props: {
                          content: '{{wedding.dateFormatted}}',
                          as: 'p',
                        },
                      },
                      // 요일 + 설명
                      {
                        id: 'date-description',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodyMd.fontFamily',
                          color: '$token.colors.text.secondary',
                        },
                        style: {
                          fontSize: '12px',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          textAlign: 'center',
                        },
                        props: {
                          content: '{{wedding.dayOfWeek}} {{wedding.season}} {{wedding.timeOfDay}}',
                          as: 'p',
                        },
                      },
                      // 시간 대형 표시
                      {
                        id: 'time-large',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayLg.fontFamily',
                          color: '$token.colors.text.primary',
                        },
                        style: {
                          fontSize: '56px',
                          fontWeight: '300',
                          textAlign: 'center',
                        },
                        props: {
                          content: '{{wedding.time12h}}',
                          as: 'p',
                        },
                      },
                      // Coming Soon 장식
                      {
                        id: 'coming-soon',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodyMd.fontFamily',
                          color: '$token.colors.text.secondary',
                        },
                        style: {
                          fontSize: '11px',
                          letterSpacing: '0.3em',
                          textAlign: 'center',
                        },
                        props: {
                          content: '★ COMING SOON ★',
                          as: 'p',
                        },
                      },
                      // 카운트다운 (영문 스타일)
                      {
                        id: 'date-countdown',
                        type: 'countdown',
                        props: {
                          date: '{{wedding.date}}',
                          time: '{{wedding.time}}',
                          showCards: false,
                          format: 'english',
                          separator: ' ',
                        },
                      },
                    ],
                  },
                ],
              },
              // 미니 캘린더 (별도 scroll-trigger)
              {
                id: 'calendar-trigger',
                type: 'scroll-trigger',
                style: {
                  width: '100%',
                  maxWidth: '320px',
                  marginTop: '16px',
                },
                props: {
                  animation: { preset: 'scroll-fade-in' },
                  scrub: true,
                },
                children: [
                  {
                    id: 'mini-calendar-wrapper',
                    type: 'column',
                    tokenStyle: {
                      padding: '$token.spacing.md',
                    },
                    style: {
                      alignItems: 'center',
                      width: '100%',
                    },
                    children: [
                      {
                        id: 'mini-calendar',
                        type: 'calendar',
                        props: {
                          date: '{{wedding.date}}',
                          locale: 'en',
                          highlightStyle: 'circle',
                          showHolidayColor: false,
                          showSaturdayColor: false,
                          minimal: true,
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
          id: 'wedding-date',
          path: 'wedding.date',
          type: 'date',
          required: true,
          description: '예식 날짜',
          defaultValue: '2025-06-21',
        },
        {
          id: 'wedding-time',
          path: 'wedding.time',
          type: 'time',
          required: true,
          description: '예식 시간',
          defaultValue: '18:00',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'blur-reveal', name: '블러 리빌 (기본)', preset: 'blur-in', trigger: 'inView', duration: 800 },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 600 },
        ],
      },
    },

    // ============================================
    // Typography Bold Variant
    // ============================================
    {
      id: 'typography-bold',
      name: '볼드 타이포',
      description: '대형 볼드 타이포그래피 중심의 미니멀 레이아웃 (커플 사진 포함)',
      tags: ['modern', 'bold', 'minimal', 'typography', 'photo'],
      structure: {
        id: 'date-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'date-content',
            type: 'column',
            style: {
              alignItems: 'flex-start',
              position: 'relative',
              minHeight: '700px',
              padding: '40px 24px',
            },
            children: [
              // 월/일 대형 표시
              {
                id: 'date-month-day',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.displayLg.fontFamily',
                  color: '$token.colors.text.primary',
                },
                style: {
                  fontSize: '80px',
                  fontWeight: '900',
                  letterSpacing: '-0.02em',
                  lineHeight: '0.9',
                },
                props: {
                  content: '{{wedding.monthDay}}',
                  as: 'p',
                },
              },
              // PLEASE SAVE THE DATE
              {
                id: 'save-the-date-text',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.bodyMd.fontFamily',
                  color: '$token.colors.text.primary',
                },
                style: {
                  fontSize: '11px',
                  fontWeight: '500',
                  letterSpacing: '0.1em',
                  marginTop: '8px',
                },
                props: {
                  content: 'PLEASE SAVE THE DATE',
                  as: 'p',
                },
              },
              // /연도
              {
                id: 'date-year',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.displayLg.fontFamily',
                  color: '$token.colors.text.primary',
                },
                style: {
                  fontSize: '80px',
                  fontWeight: '900',
                  letterSpacing: '-0.02em',
                  lineHeight: '0.9',
                  marginTop: '16px',
                },
                props: {
                  content: '/{{wedding.year}}',
                  as: 'p',
                },
              },
              // A CELEBRATION OF OUR LOVE
              {
                id: 'celebration-text',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.bodyMd.fontFamily',
                  color: '$token.colors.text.primary',
                },
                style: {
                  fontSize: '11px',
                  fontWeight: '500',
                  letterSpacing: '0.1em',
                  marginTop: '8px',
                  alignSelf: 'flex-end',
                  marginRight: '40px',
                },
                props: {
                  content: 'A CELEBRATION OF OUR LOVE',
                  as: 'p',
                },
              },
              // 시간 대형 표시 (깜빡이는 콜론)
              {
                id: 'time-large',
                type: 'row',
                style: {
                  alignItems: 'center',
                  marginTop: '16px',
                },
                children: [
                  {
                    id: 'time-hours',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayLg.fontFamily',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      fontSize: '80px',
                      fontWeight: '900',
                      letterSpacing: '-0.02em',
                      lineHeight: '0.9',
                    },
                    props: {
                      content: '{{wedding.hours}}',
                      as: 'span',
                    },
                  },
                  {
                    id: 'time-colon',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayLg.fontFamily',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      fontSize: '80px',
                      fontWeight: '900',
                      lineHeight: '0.9',
                      animation: 'blink 2s ease-in-out infinite',
                    },
                    props: {
                      content: ':',
                      as: 'span',
                    },
                  },
                  {
                    id: 'time-minutes',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayLg.fontFamily',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      fontSize: '80px',
                      fontWeight: '900',
                      letterSpacing: '-0.02em',
                      lineHeight: '0.9',
                    },
                    props: {
                      content: '{{wedding.minutes}}',
                      as: 'span',
                    },
                  },
                ],
              },
              // 하단 영역 (텍스트 + 사진)
              {
                id: 'bottom-section',
                type: 'row',
                style: {
                  marginTop: 'auto',
                  paddingTop: '40px',
                  width: '100%',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                },
                children: [
                  // 이름 텍스트 블록
                  {
                    id: 'names-block',
                    type: 'column',
                    style: {
                      alignItems: 'flex-start',
                      gap: '2px',
                    },
                    children: [
                      {
                        id: 'names-line1',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodyMd.fontFamily',
                          color: '$token.colors.text.primary',
                        },
                        style: {
                          fontSize: '12px',
                          fontWeight: '700',
                          letterSpacing: '0.05em',
                        },
                        props: {
                          content: '{{couple.groom.nameEn}}',
                          as: 'span',
                        },
                      },
                      {
                        id: 'names-line2',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodyMd.fontFamily',
                          color: '$token.colors.text.primary',
                        },
                        style: {
                          fontSize: '12px',
                          fontWeight: '700',
                          letterSpacing: '0.05em',
                        },
                        props: {
                          content: 'AND',
                          as: 'span',
                        },
                      },
                      {
                        id: 'names-line3',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodyMd.fontFamily',
                          color: '$token.colors.text.primary',
                        },
                        style: {
                          fontSize: '12px',
                          fontWeight: '700',
                          letterSpacing: '0.05em',
                        },
                        props: {
                          content: '{{couple.bride.nameEn}}',
                          as: 'span',
                        },
                      },
                      {
                        id: 'names-line4',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodyMd.fontFamily',
                          color: '$token.colors.text.primary',
                        },
                        style: {
                          fontSize: '12px',
                          fontWeight: '700',
                          letterSpacing: '0.05em',
                        },
                        props: {
                          content: 'ARE GETTING',
                          as: 'span',
                        },
                      },
                      {
                        id: 'names-line5',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodyMd.fontFamily',
                          color: '$token.colors.text.primary',
                        },
                        style: {
                          fontSize: '12px',
                          fontWeight: '700',
                          letterSpacing: '0.05em',
                        },
                        props: {
                          content: 'MARRIED',
                          as: 'span',
                        },
                      },
                    ],
                  },
                  // 커플 사진
                  {
                    id: 'couple-photo',
                    type: 'image',
                    style: {
                      width: '140px',
                      height: '180px',
                      objectFit: 'cover',
                      filter: 'grayscale(100%)',
                    },
                    props: {
                      src: '{{photos.couple}}',
                      alt: '커플 사진',
                    },
                  },
                ],
              },
              // 세로 텍스트 (장소) - 오른쪽 상단
              {
                id: 'vertical-venue',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.bodyMd.fontFamily',
                  color: '$token.colors.text.secondary',
                },
                style: {
                  position: 'absolute',
                  top: '40px',
                  right: '24px',
                  writingMode: 'vertical-rl',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                },
                props: {
                  content: '{{venue.name}} {{venue.hall}}',
                  as: 'p',
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'wedding-date',
          path: 'wedding.date',
          type: 'date',
          required: true,
          description: '예식 날짜',
          defaultValue: '2025-05-30',
        },
        {
          id: 'wedding-time',
          path: 'wedding.time',
          type: 'time',
          required: true,
          description: '예식 시간',
          defaultValue: '14:00',
        },
        {
          id: 'groom-name-en',
          path: 'couple.groom.nameEn',
          type: 'text',
          required: true,
          description: '신랑 영문 이름',
          defaultValue: 'GROOM',
        },
        {
          id: 'bride-name-en',
          path: 'couple.bride.nameEn',
          type: 'text',
          required: true,
          description: '신부 영문 이름',
          defaultValue: 'BRIDE',
        },
        {
          id: 'couple-photo',
          path: 'photos.couple',
          type: 'image',
          required: false,
          description: '커플 사진',
          defaultValue: '/images/placeholder-couple.jpg',
        },
        {
          id: 'venue-name',
          path: 'venue.name',
          type: 'text',
          required: false,
          description: '예식장 이름',
          defaultValue: '예식장',
        },
        {
          id: 'venue-hall',
          path: 'venue.hall',
          type: 'text',
          required: false,
          description: '홀 이름',
          defaultValue: '',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'stagger', name: '순차 등장', preset: 'stagger', trigger: 'inView', duration: 600 },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
        ],
      },
    },

    // ============================================
    // Calendar Heart Variant
    // ============================================
    {
      id: 'calendar-heart',
      name: '하트 캘린더',
      description: '미니멀한 캘린더에 하트 모양으로 날짜를 강조하는 레이아웃',
      tags: ['minimal', 'romantic', 'heart', 'calendar'],
      structure: {
        id: 'date-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'date-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            style: {
              alignItems: 'center',
            },
            children: [
              // SAVE OUR DATE 타이틀
              {
                id: 'save-our-date-title',
                type: 'column',
                style: {
                  alignItems: 'center',
                  gap: '4px',
                },
                children: [
                  {
                    id: 'save-our-date-text',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.sectionTitle.fontFamily',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      fontSize: '14px',
                      fontWeight: '400',
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                    },
                    props: {
                      content: 'SAVE OUR DATE',
                      as: 'p',
                    },
                  },
                  {
                    id: 'month-year-text',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodyMd.fontFamily',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      fontSize: '13px',
                      fontWeight: '400',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                    },
                    props: {
                      content: '{{wedding.monthNameEn}} {{wedding.year}}',
                      as: 'p',
                    },
                  },
                ],
              },
              // 하트 캘린더
              {
                id: 'heart-calendar-wrapper',
                type: 'column',
                tokenStyle: {
                  padding: '$token.spacing.md',
                },
                style: {
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '340px',
                },
                children: [
                  {
                    id: 'heart-calendar',
                    type: 'calendar',
                    props: {
                      date: '{{wedding.date}}',
                      locale: 'en',
                      highlightStyle: 'heart',
                      showHolidayColor: false,
                      showSaturdayColor: false,
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
          id: 'wedding-date',
          path: 'wedding.date',
          type: 'date',
          required: true,
          description: '예식 날짜',
          defaultValue: '2026-09-19',
        },
        {
          id: 'wedding-time',
          path: 'wedding.time',
          type: 'time',
          required: true,
          description: '예식 시간',
          defaultValue: '14:00',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 600 },
          { id: 'scale', name: '스케일 인', preset: 'scale-in', trigger: 'inView', duration: 500 },
        ],
      },
    },

    // ============================================
    // Letterpress Variant
    // ============================================
    {
      id: 'letterpress',
      name: '레터프레스',
      description: '활판 인쇄 스타일의 빈티지 캘린더 (클래식 음각 효과)',
      tags: ['vintage', 'classic', 'letterpress', 'elegant', 'retro'],
      structure: {
        id: 'date-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'date-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            style: {
              alignItems: 'center',
            },
            children: [
              // 레터프레스 타이틀
              {
                id: 'letterpress-title',
                type: 'text',
                style: {
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#8B8680',
                  textShadow: '0 1px 0 rgba(255,255,255,0.4)',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                },
                props: {
                  content: 'SAVE THE DATE',
                  as: 'p',
                },
              },
              // 레터프레스 캘린더
              {
                id: 'letterpress-calendar-wrapper',
                type: 'column',
                style: {
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '360px',
                },
                children: [
                  {
                    id: 'letterpress-calendar',
                    type: 'calendar',
                    props: {
                      date: '{{wedding.date}}',
                      locale: 'en',
                      variant: 'letterpress',
                      highlightStyle: 'circle',
                      showHolidayColor: false,
                      showSaturdayColor: false,
                    },
                  },
                ],
              },
              // 날짜 텍스트 (레터프레스 스타일)
              {
                id: 'letterpress-date-text',
                type: 'text',
                style: {
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  color: '#3D3D3D',
                  textShadow: '0 1px 0 rgba(255,255,255,0.3), 0 -1px 1px rgba(0,0,0,0.1)',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  textAlign: 'center',
                },
                props: {
                  content: '{{wedding.dateDisplay}} | {{wedding.timeDisplay}}',
                  as: 'p',
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'wedding-date',
          path: 'wedding.date',
          type: 'date',
          required: true,
          description: '예식 날짜',
          defaultValue: '2025-09-20',
        },
        {
          id: 'wedding-time',
          path: 'wedding.time',
          type: 'time',
          required: true,
          description: '예식 시간',
          defaultValue: '14:00',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 700 },
        ],
      },
    },

    // ============================================
    // Letterpress Border Variant
    // ============================================
    {
      id: 'letterpress-border',
      name: '레터프레스 (테두리)',
      description: '이중 테두리와 각인된 프레임의 레터프레스 스타일',
      tags: ['vintage', 'classic', 'letterpress', 'border', 'frame', 'elegant'],
      structure: {
        id: 'date-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'date-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            style: {
              alignItems: 'center',
            },
            children: [
              // 레터프레스 테두리 타이틀
              {
                id: 'letterpress-border-title',
                type: 'text',
                style: {
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#9A9590',
                  textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                },
                props: {
                  content: '· SAVE THE DATE ·',
                  as: 'p',
                },
              },
              // 레터프레스 테두리 캘린더
              {
                id: 'letterpress-border-calendar-wrapper',
                type: 'column',
                style: {
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '380px',
                },
                children: [
                  {
                    id: 'letterpress-border-calendar',
                    type: 'calendar',
                    props: {
                      date: '{{wedding.date}}',
                      locale: 'en',
                      variant: 'letterpress-border',
                      highlightStyle: 'circle',
                      showHolidayColor: false,
                      showSaturdayColor: false,
                    },
                  },
                ],
              },
              // 날짜/시간 텍스트
              {
                id: 'letterpress-border-date-text',
                type: 'text',
                style: {
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  color: '#4A4A4A',
                  textShadow: '0 1px 0 rgba(255,255,255,0.4)',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  textAlign: 'center',
                },
                props: {
                  content: '{{wedding.dateDisplay}} · {{wedding.timeDisplay}}',
                  as: 'p',
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'wedding-date',
          path: 'wedding.date',
          type: 'date',
          required: true,
          description: '예식 날짜',
          defaultValue: '2025-09-20',
        },
        {
          id: 'wedding-time',
          path: 'wedding.time',
          type: 'time',
          required: true,
          description: '예식 시간',
          defaultValue: '14:00',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 700 },
        ],
      },
    },

    // ============================================
    // Letterpress Deep Variant
    // ============================================
    {
      id: 'letterpress-deep',
      name: '레터프레스 (깊은 음각)',
      description: '더 강한 프레스 효과와 어두운 톤의 레터프레스 스타일',
      tags: ['vintage', 'classic', 'letterpress', 'deep', 'bold', 'dramatic'],
      structure: {
        id: 'date-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'date-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            style: {
              alignItems: 'center',
            },
            children: [
              // 깊은 음각 타이틀
              {
                id: 'letterpress-deep-title',
                type: 'text',
                style: {
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#2D2D2D',
                  textShadow: '0 2px 0 rgba(255,255,255,0.25), 0 -1px 2px rgba(0,0,0,0.2)',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                },
                props: {
                  content: 'SAVE THE DATE',
                  as: 'p',
                },
              },
              // 깊은 음각 캘린더
              {
                id: 'letterpress-deep-calendar-wrapper',
                type: 'column',
                style: {
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '360px',
                },
                children: [
                  {
                    id: 'letterpress-deep-calendar',
                    type: 'calendar',
                    props: {
                      date: '{{wedding.date}}',
                      locale: 'en',
                      variant: 'letterpress-deep',
                      highlightStyle: 'circle',
                      showHolidayColor: false,
                      showSaturdayColor: false,
                    },
                  },
                ],
              },
              // 깊은 음각 날짜 텍스트
              {
                id: 'letterpress-deep-date-text',
                type: 'text',
                style: {
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: '#2D2D2D',
                  textShadow: '0 2px 1px rgba(255,255,255,0.2), 0 -2px 2px rgba(0,0,0,0.25)',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  textAlign: 'center',
                },
                props: {
                  content: '{{wedding.dateDisplay}} | {{wedding.timeDisplay}}',
                  as: 'p',
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'wedding-date',
          path: 'wedding.date',
          type: 'date',
          required: true,
          description: '예식 날짜',
          defaultValue: '2025-09-20',
        },
        {
          id: 'wedding-time',
          path: 'wedding.time',
          type: 'time',
          required: true,
          description: '예식 시간',
          defaultValue: '14:00',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 700 },
        ],
      },
    },

    // ============================================
    // Week Heart Variant
    // ============================================
    {
      id: 'week-heart',
      name: '주간 하트',
      description: '결혼식 주간만 표시하는 미니멀 캘린더 (하트 강조)',
      tags: ['minimal', 'romantic', 'heart', 'week', 'elegant'],
      structure: {
        id: 'date-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'date-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            style: {
              alignItems: 'center',
            },
            children: [
              // 주간 하트 캘린더
              {
                id: 'week-calendar-wrapper',
                type: 'column',
                tokenStyle: {
                  padding: '$token.spacing.lg',
                },
                style: {
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '360px',
                },
                children: [
                  {
                    id: 'week-calendar',
                    type: 'calendar',
                    props: {
                      date: '{{wedding.date}}',
                      locale: 'en',
                      highlightStyle: 'heart',
                      weekOnly: true,
                      showMonth: true,
                      showHolidayColor: false,
                      showSaturdayColor: false,
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
          id: 'wedding-date',
          path: 'wedding.date',
          type: 'date',
          required: true,
          description: '예식 날짜',
          defaultValue: '2026-09-18',
        },
        {
          id: 'wedding-time',
          path: 'wedding.time',
          type: 'time',
          required: true,
          description: '예식 시간',
          defaultValue: '14:00',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 600 },
          { id: 'scale', name: '스케일 인', preset: 'scale-in', trigger: 'inView', duration: 500 },
        ],
      },
    },

    // ============================================
    // Photo Overlay Variant (투명 프레스 효과)
    // ============================================
    {
      id: 'photo-overlay',
      name: '포토 오버레이',
      description: '사진 위에 날짜가 투명하게 프레스된 스타일',
      tags: ['modern', 'photo', 'overlay', 'elegant', 'minimal'],
      structure: {
        id: 'date-root',
        type: 'container',
        style: {
          position: 'relative',
          width: '100%',
          minHeight: '500px',
          overflow: 'hidden',
        },
        children: [
          // 배경 사진
          {
            id: 'background-photo',
            type: 'image',
            style: {
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            },
            props: {
              src: '{{photos.couple}}',
              alt: '커플 사진',
            },
          },
          // 오버레이 콘텐츠
          {
            id: 'overlay-content',
            type: 'column',
            style: {
              position: 'relative',
              zIndex: '1',
              minHeight: '500px',
              padding: '40px 24px',
              justifyContent: 'space-between',
            },
            children: [
              // 상단: 프레스된 날짜 (세로 배치)
              {
                id: 'pressed-date-column',
                type: 'column',
                style: {
                  alignItems: 'flex-start',
                  gap: '0',
                },
                children: [
                  // 월 (2자리)
                  {
                    id: 'pressed-month',
                    type: 'text',
                    style: {
                      fontSize: '100px',
                      fontWeight: '300',
                      lineHeight: '0.9',
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      color: 'rgba(255, 255, 255, 0.9)',
                      mixBlendMode: 'overlay',
                      textShadow: '0 1px 2px rgba(0,0,0,0.08)',
                      letterSpacing: '-0.02em',
                    },
                    props: {
                      content: '{{wedding.monthPadded}}',
                      as: 'span',
                    },
                  },
                  // 일 (2자리)
                  {
                    id: 'pressed-day',
                    type: 'text',
                    style: {
                      fontSize: '100px',
                      fontWeight: '300',
                      lineHeight: '0.9',
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      color: 'rgba(255, 255, 255, 0.9)',
                      mixBlendMode: 'overlay',
                      textShadow: '0 1px 2px rgba(0,0,0,0.08)',
                      letterSpacing: '-0.02em',
                    },
                    props: {
                      content: '{{wedding.dayPadded}}',
                      as: 'span',
                    },
                  },
                  // 연도 (2자리)
                  {
                    id: 'pressed-year',
                    type: 'text',
                    style: {
                      fontSize: '100px',
                      fontWeight: '300',
                      lineHeight: '0.9',
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      color: 'rgba(255, 255, 255, 0.9)',
                      mixBlendMode: 'overlay',
                      textShadow: '0 1px 2px rgba(0,0,0,0.08)',
                      letterSpacing: '-0.02em',
                    },
                    props: {
                      content: '{{wedding.yearShort}}',
                      as: 'span',
                    },
                  },
                ],
              },
              // 하단: 감사 메시지 + 이름
              {
                id: 'bottom-info',
                type: 'column',
                style: {
                  alignItems: 'flex-end',
                  gap: '4px',
                },
                children: [
                  {
                    id: 'thank-you-text',
                    type: 'text',
                    style: {
                      fontSize: '12px',
                      fontWeight: '400',
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontStyle: 'italic',
                      color: '#333333',
                      letterSpacing: '0.05em',
                    },
                    props: {
                      content: 'Thank you for coming today.',
                      as: 'p',
                    },
                  },
                  {
                    id: 'couple-names',
                    type: 'text',
                    style: {
                      fontSize: '14px',
                      fontWeight: '500',
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      color: '#333333',
                      letterSpacing: '0.1em',
                    },
                    props: {
                      content: '{{couple.groom.nameEn}} & {{couple.bride.nameEn}}',
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
          id: 'wedding-date',
          path: 'wedding.date',
          type: 'date',
          required: true,
          description: '예식 날짜',
          defaultValue: '2024-06-04',
        },
        {
          id: 'wedding-time',
          path: 'wedding.time',
          type: 'time',
          required: true,
          description: '예식 시간',
          defaultValue: '14:00',
        },
        {
          id: 'couple-photo',
          path: 'photos.couple',
          type: 'image',
          required: true,
          description: '커플 사진',
          defaultValue: '/images/placeholder-couple.jpg',
        },
        {
          id: 'groom-name-en',
          path: 'couple.groom.nameEn',
          type: 'text',
          required: true,
          description: '신랑 영문 이름',
          defaultValue: 'Minato',
        },
        {
          id: 'bride-name-en',
          path: 'couple.bride.nameEn',
          type: 'text',
          required: true,
          description: '신부 영문 이름',
          defaultValue: 'Yuki',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 800 },
        ],
      },
    },
  ],
}

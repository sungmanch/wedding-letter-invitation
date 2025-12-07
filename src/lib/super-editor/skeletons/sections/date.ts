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
                type: 'row',
                tokenStyle: {
                  gap: '$token.spacing.md',
                  padding: '$token.spacing.lg',
                  backgroundColor: '$token.colors.background',
                  borderRadius: '$token.borders.radiusMd',
                },
                style: {
                  justifyContent: 'center',
                },
                children: [
                  {
                    id: 'countdown-days',
                    type: 'column',
                    tokenStyle: {
                      gap: '$token.spacing.xs',
                    },
                    style: {
                      alignItems: 'center',
                      minWidth: '60px',
                    },
                    children: [
                      {
                        id: 'days-value',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayLg.fontFamily',
                          fontSize: '$token.typography.displayLg.fontSize',
                          fontWeight: '$token.typography.displayLg.fontWeight',
                          color: '$token.colors.brand',
                        },
                        props: {
                          content: '{{countdown.days}}',
                          as: 'span',
                        },
                      },
                      {
                        id: 'days-label',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.caption.fontFamily',
                          fontSize: '$token.typography.caption.fontSize',
                          color: '$token.colors.text.muted',
                        },
                        props: {
                          content: 'DAYS',
                          as: 'span',
                        },
                      },
                    ],
                  },
                  {
                    id: 'countdown-hours',
                    type: 'column',
                    tokenStyle: {
                      gap: '$token.spacing.xs',
                    },
                    style: {
                      alignItems: 'center',
                      minWidth: '60px',
                    },
                    children: [
                      {
                        id: 'hours-value',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayLg.fontFamily',
                          fontSize: '$token.typography.displayLg.fontSize',
                          fontWeight: '$token.typography.displayLg.fontWeight',
                          color: '$token.colors.brand',
                        },
                        props: {
                          content: '{{countdown.hours}}',
                          as: 'span',
                        },
                      },
                      {
                        id: 'hours-label',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.caption.fontFamily',
                          fontSize: '$token.typography.caption.fontSize',
                          color: '$token.colors.text.muted',
                        },
                        props: {
                          content: 'HOURS',
                          as: 'span',
                        },
                      },
                    ],
                  },
                  {
                    id: 'countdown-mins',
                    type: 'column',
                    tokenStyle: {
                      gap: '$token.spacing.xs',
                    },
                    style: {
                      alignItems: 'center',
                      minWidth: '60px',
                    },
                    children: [
                      {
                        id: 'mins-value',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayLg.fontFamily',
                          fontSize: '$token.typography.displayLg.fontSize',
                          fontWeight: '$token.typography.displayLg.fontWeight',
                          color: '$token.colors.brand',
                        },
                        props: {
                          content: '{{countdown.minutes}}',
                          as: 'span',
                        },
                      },
                      {
                        id: 'mins-label',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.caption.fontFamily',
                          fontSize: '$token.typography.caption.fontSize',
                          color: '$token.colors.text.muted',
                        },
                        props: {
                          content: 'MINS',
                          as: 'span',
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
          description: '결혼 날짜',
          defaultValue: '2025년 3월 15일',
        },
        {
          id: 'wedding-time',
          path: 'wedding.time',
          type: 'text',
          required: false,
          description: '결혼 시간',
          defaultValue: '오후 2시',
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
                  {
                    id: 'date-full-en',
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
                      content: '{{wedding.dateEn}} | {{wedding.timeEn}}',
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
                type: 'row',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                style: {
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                },
                children: [
                  {
                    id: 'countdown-days',
                    type: 'column',
                    tokenStyle: {
                      padding: '$token.spacing.md',
                      backgroundColor: '$token.colors.background',
                      borderRadius: '$token.borders.radiusMd',
                      boxShadow: '$token.shadows.md',
                      gap: '$token.spacing.xs',
                    },
                    style: {
                      alignItems: 'center',
                      minWidth: '70px',
                    },
                    children: [
                      {
                        id: 'days-value',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayLg.fontFamily',
                          fontSize: '$token.typography.displayLg.fontSize',
                          fontWeight: '$token.typography.displayLg.fontWeight',
                          color: '$token.colors.text.primary',
                        },
                        props: {
                          content: '{{countdown.days}}',
                          as: 'span',
                        },
                      },
                      {
                        id: 'days-label',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.caption.fontFamily',
                          fontSize: '$token.typography.caption.fontSize',
                          color: '$token.colors.text.muted',
                        },
                        props: {
                          content: 'DAYS',
                          as: 'span',
                        },
                      },
                    ],
                  },
                  {
                    id: 'countdown-hours',
                    type: 'column',
                    tokenStyle: {
                      padding: '$token.spacing.md',
                      backgroundColor: '$token.colors.background',
                      borderRadius: '$token.borders.radiusMd',
                      boxShadow: '$token.shadows.md',
                      gap: '$token.spacing.xs',
                    },
                    style: {
                      alignItems: 'center',
                      minWidth: '70px',
                    },
                    children: [
                      {
                        id: 'hours-value',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayLg.fontFamily',
                          fontSize: '$token.typography.displayLg.fontSize',
                          fontWeight: '$token.typography.displayLg.fontWeight',
                          color: '$token.colors.text.primary',
                        },
                        props: {
                          content: '{{countdown.hours}}',
                          as: 'span',
                        },
                      },
                      {
                        id: 'hours-label',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.caption.fontFamily',
                          fontSize: '$token.typography.caption.fontSize',
                          color: '$token.colors.text.muted',
                        },
                        props: {
                          content: 'HOURS',
                          as: 'span',
                        },
                      },
                    ],
                  },
                  {
                    id: 'countdown-minutes',
                    type: 'column',
                    tokenStyle: {
                      padding: '$token.spacing.md',
                      backgroundColor: '$token.colors.background',
                      borderRadius: '$token.borders.radiusMd',
                      boxShadow: '$token.shadows.md',
                      gap: '$token.spacing.xs',
                    },
                    style: {
                      alignItems: 'center',
                      minWidth: '70px',
                    },
                    children: [
                      {
                        id: 'minutes-value',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayLg.fontFamily',
                          fontSize: '$token.typography.displayLg.fontSize',
                          fontWeight: '$token.typography.displayLg.fontWeight',
                          color: '$token.colors.text.primary',
                        },
                        props: {
                          content: '{{countdown.minutes}}',
                          as: 'span',
                        },
                      },
                      {
                        id: 'minutes-label',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.caption.fontFamily',
                          fontSize: '$token.typography.caption.fontSize',
                          color: '$token.colors.text.muted',
                        },
                        props: {
                          content: 'MINUTES',
                          as: 'span',
                        },
                      },
                    ],
                  },
                  {
                    id: 'countdown-seconds',
                    type: 'column',
                    tokenStyle: {
                      padding: '$token.spacing.md',
                      backgroundColor: '$token.colors.background',
                      borderRadius: '$token.borders.radiusMd',
                      boxShadow: '$token.shadows.md',
                      gap: '$token.spacing.xs',
                    },
                    style: {
                      alignItems: 'center',
                      minWidth: '70px',
                    },
                    children: [
                      {
                        id: 'seconds-value',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.displayLg.fontFamily',
                          fontSize: '$token.typography.displayLg.fontSize',
                          fontWeight: '$token.typography.displayLg.fontWeight',
                          color: '$token.colors.text.primary',
                        },
                        props: {
                          content: '{{countdown.seconds}}',
                          as: 'span',
                        },
                      },
                      {
                        id: 'seconds-label',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.caption.fontFamily',
                          fontSize: '$token.typography.caption.fontSize',
                          color: '$token.colors.text.muted',
                        },
                        props: {
                          content: 'SECONDS',
                          as: 'span',
                        },
                      },
                    ],
                  },
                ],
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
  ],
}

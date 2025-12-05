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
                  fontFamily: '$token.typography.displayMd.fontFamily',
                  fontSize: '$token.typography.displayMd.fontSize',
                  fontWeight: '$token.typography.displayMd.fontWeight',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
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
                  fontFamily: '$token.typography.displayMd.fontFamily',
                  fontSize: '$token.typography.displayMd.fontSize',
                  fontWeight: '$token.typography.displayMd.fontWeight',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: '예식 일시',
                  as: 'h2',
                },
              },
              {
                id: 'date-calendar-card',
                type: 'column',
                tokenStyle: {
                  padding: '$token.spacing.lg',
                  backgroundColor: '$token.colors.surface',
                  borderRadius: '$token.borders.radiusMd',
                  boxShadow: '$token.shadows.sm',
                  gap: '$token.spacing.md',
                },
                style: {
                  alignItems: 'center',
                  minWidth: '280px',
                },
                children: [
                  {
                    id: 'calendar-month',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingMd.fontFamily',
                      fontSize: '$token.typography.headingMd.fontSize',
                      fontWeight: '$token.typography.headingMd.fontWeight',
                      color: '$token.colors.brand',
                    },
                    props: {
                      content: '{{wedding.month}}',
                      as: 'p',
                    },
                  },
                  {
                    id: 'calendar-day',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayLg.fontFamily',
                      fontWeight: '$token.typography.displayLg.fontWeight',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      fontSize: '72px',
                      lineHeight: 1,
                    },
                    props: {
                      content: '{{wedding.day}}',
                      as: 'p',
                    },
                  },
                  {
                    id: 'calendar-weekday',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodyMd.fontFamily',
                      fontSize: '$token.typography.bodyMd.fontSize',
                      color: '$token.colors.text.secondary',
                    },
                    props: {
                      content: '{{wedding.weekday}}',
                      as: 'p',
                    },
                  },
                  {
                    id: 'calendar-divider',
                    type: 'divider',
                    tokenStyle: {
                      backgroundColor: '$token.colors.divider',
                    },
                    style: {
                      width: '80%',
                    },
                    props: {
                      thickness: 1,
                    },
                  },
                  {
                    id: 'calendar-time',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingSm.fontFamily',
                      fontSize: '$token.typography.headingSm.fontSize',
                      color: '$token.colors.text.primary',
                    },
                    props: {
                      content: '{{wedding.time}}',
                      as: 'p',
                    },
                  },
                ],
              },
              {
                id: 'date-dday',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.bodySm.fontFamily',
                  fontSize: '$token.typography.bodySm.fontSize',
                  color: '$token.colors.text.muted',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: '결혼식까지 D-{{countdown.days}}',
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
          description: '결혼 날짜',
        },
        {
          id: 'wedding-month',
          path: 'wedding.month',
          type: 'text',
          required: true,
          description: '월 (예: 2024년 12월)',
        },
        {
          id: 'wedding-day',
          path: 'wedding.day',
          type: 'text',
          required: true,
          description: '일 (예: 25)',
        },
        {
          id: 'wedding-weekday',
          path: 'wedding.weekday',
          type: 'text',
          required: true,
          description: '요일 (예: 토요일)',
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
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 600 },
          { id: 'scale', name: '스케일 인', preset: 'scale-in', trigger: 'inView', duration: 500 },
        ],
      },
    },
  ],
}

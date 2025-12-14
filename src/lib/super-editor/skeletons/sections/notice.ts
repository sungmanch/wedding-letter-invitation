/**
 * Super Editor - Notice Section Skeleton
 * 공지사항 섹션 (셔틀버스, 주차, 식사 안내 등)
 */

import type { SectionSkeleton } from '../types'

export const noticeSkeleton: SectionSkeleton = {
  sectionType: 'notice',
  name: '공지사항',
  description: '셔틀버스, 주차, 식사 등 안내사항을 표시합니다.',
  defaultVariant: 'list',
  variants: [
    // ============================================
    // List Variant
    // ============================================
    {
      id: 'list',
      name: '목록형',
      description: '아이콘과 함께 목록으로 표시',
      tags: ['clean', 'simple', 'minimal'],
      structure: {
        id: 'notice-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'notice-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'notice-title',
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
                  content: '안내사항',
                  as: 'h2',
                },
              },
              // 공지사항 목록 (repeat)
              {
                id: 'notice-list',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.md',
                },
                props: {
                  repeat: '{{notice.items}}',
                },
                children: [
                  {
                    id: 'notice-item',
                    type: 'row',
                    tokenStyle: {
                      gap: '$token.spacing.md',
                      padding: '$token.spacing.md',
                      backgroundColor: '$token.colors.background',
                      borderRadius: '$token.borders.radiusMd',
                    },
                    style: {
                      alignItems: 'flex-start',
                    },
                    children: [
                      // 아이콘
                      {
                        id: 'notice-item-icon',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.brand',
                          borderRadius: '$token.borders.radiusFull',
                        },
                        style: {
                          width: '40px',
                          height: '40px',
                          minWidth: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        children: [
                          {
                            id: 'notice-item-icon-text',
                            type: 'text',
                            tokenStyle: {
                              color: '$token.colors.text.onBrand',
                              fontSize: '$token.typography.bodyMd.fontSize',
                            },
                            props: {
                              content: '{{item.icon}}',
                              as: 'span',
                            },
                          },
                        ],
                      },
                      // 내용
                      {
                        id: 'notice-item-content',
                        type: 'column',
                        tokenStyle: {
                          gap: '$token.spacing.xs',
                        },
                        style: {
                          flex: 1,
                        },
                        children: [
                          {
                            id: 'notice-item-title',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodySm.fontFamily',
                              fontSize: '$token.typography.bodySm.fontSize',
                              fontWeight: '600',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '{{item.title}}',
                              as: 'h3',
                            },
                          },
                          {
                            id: 'notice-item-description',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodySm.fontFamily',
                              fontSize: '$token.typography.bodySm.fontSize',
                              color: '$token.colors.text.secondary',
                              lineHeight: '1.6',
                            },
                            props: {
                              content: '{{item.content}}',
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
        ],
      },
      slots: [
        {
          id: 'notice-items-slot',
          path: 'notice.items',
          nodeId: 'notice-list',
          property: 'repeat',
          defaultValue: [],
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
          { id: 'stagger', name: '순차 등장', preset: 'stagger-up', trigger: 'inView', duration: 400 },
        ],
      },
    },

    // ============================================
    // Accordion Variant
    // ============================================
    {
      id: 'accordion',
      name: '접기형',
      description: '클릭하면 내용이 펼쳐지는 아코디언',
      tags: ['compact', 'interactive', 'organized'],
      structure: {
        id: 'notice-accordion-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'notice-accordion-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'notice-accordion-title',
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
                  content: '안내사항',
                  as: 'h2',
                },
              },
              // 아코디언 목록
              {
                id: 'notice-accordion-list',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                props: {
                  repeat: '{{notice.items}}',
                },
                children: [
                  {
                    id: 'notice-accordion-item',
                    type: 'column',
                    tokenStyle: {
                      backgroundColor: '$token.colors.background',
                      borderRadius: '$token.borders.radiusMd',
                      overflow: 'hidden',
                    },
                    children: [
                      // 헤더 (클릭 영역)
                      {
                        id: 'notice-accordion-header',
                        type: 'row',
                        tokenStyle: {
                          padding: '$token.spacing.md',
                          gap: '$token.spacing.sm',
                        },
                        style: {
                          alignItems: 'center',
                          cursor: 'pointer',
                        },
                        props: {
                          action: {
                            type: 'custom',
                            handler: 'toggleAccordion',
                          },
                        },
                        children: [
                          {
                            id: 'notice-accordion-icon',
                            type: 'text',
                            tokenStyle: {
                              fontSize: '$token.typography.bodyMd.fontSize',
                            },
                            props: {
                              content: '{{item.icon}}',
                              as: 'span',
                            },
                          },
                          {
                            id: 'notice-accordion-item-title',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodySm.fontFamily',
                              fontSize: '$token.typography.bodySm.fontSize',
                              fontWeight: '600',
                              color: '$token.colors.text.primary',
                            },
                            style: {
                              flex: 1,
                            },
                            props: {
                              content: '{{item.title}}',
                              as: 'span',
                            },
                          },
                          {
                            id: 'notice-accordion-chevron',
                            type: 'text',
                            tokenStyle: {
                              color: '$token.colors.text.tertiary',
                            },
                            props: {
                              content: '▼',
                              as: 'span',
                            },
                          },
                        ],
                      },
                      // 내용 (접히는 영역)
                      {
                        id: 'notice-accordion-body',
                        type: 'container',
                        tokenStyle: {
                          padding: '$token.spacing.md',
                          borderTop: '1px solid',
                          borderColor: '$token.colors.border',
                        },
                        props: {
                          collapsible: true,
                          defaultCollapsed: true,
                        },
                        children: [
                          {
                            id: 'notice-accordion-item-content',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodySm.fontFamily',
                              fontSize: '$token.typography.bodySm.fontSize',
                              color: '$token.colors.text.secondary',
                              lineHeight: '1.6',
                            },
                            props: {
                              content: '{{item.content}}',
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
        ],
      },
      slots: [
        {
          id: 'notice-accordion-items-slot',
          path: 'notice.items',
          nodeId: 'notice-accordion-list',
          property: 'repeat',
          defaultValue: [],
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
        ],
      },
    },

    // ============================================
    // Card Variant
    // ============================================
    {
      id: 'card',
      name: '카드형',
      description: '그리드 카드 레이아웃',
      tags: ['visual', 'modern', 'grid'],
      structure: {
        id: 'notice-card-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'notice-card-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'notice-card-title',
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
                  content: '안내사항',
                  as: 'h2',
                },
              },
              // 카드 그리드
              {
                id: 'notice-card-grid',
                type: 'grid',
                style: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                },
                props: {
                  repeat: '{{notice.items}}',
                },
                children: [
                  {
                    id: 'notice-card-item',
                    type: 'column',
                    tokenStyle: {
                      backgroundColor: '$token.colors.background',
                      borderRadius: '$token.borders.radiusMd',
                      padding: '$token.spacing.md',
                      gap: '$token.spacing.sm',
                    },
                    style: {
                      alignItems: 'center',
                      textAlign: 'center',
                    },
                    children: [
                      {
                        id: 'notice-card-icon',
                        type: 'container',
                        tokenStyle: {
                          backgroundColor: '$token.colors.brand',
                          borderRadius: '$token.borders.radiusFull',
                        },
                        style: {
                          width: '48px',
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        children: [
                          {
                            id: 'notice-card-icon-text',
                            type: 'text',
                            tokenStyle: {
                              color: '$token.colors.text.onBrand',
                              fontSize: '$token.typography.bodyLg.fontSize',
                            },
                            props: {
                              content: '{{item.icon}}',
                              as: 'span',
                            },
                          },
                        ],
                      },
                      {
                        id: 'notice-card-item-title',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodySm.fontFamily',
                          fontSize: '$token.typography.bodySm.fontSize',
                          fontWeight: '600',
                          color: '$token.colors.text.primary',
                        },
                        props: {
                          content: '{{item.title}}',
                          as: 'h3',
                        },
                      },
                      {
                        id: 'notice-card-item-content',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodyXs.fontFamily',
                          fontSize: '$token.typography.bodyXs.fontSize',
                          color: '$token.colors.text.secondary',
                          lineHeight: '1.5',
                        },
                        props: {
                          content: '{{item.content}}',
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
          id: 'notice-card-items-slot',
          path: 'notice.items',
          nodeId: 'notice-card-grid',
          property: 'repeat',
          defaultValue: [],
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
          { id: 'stagger', name: '순차 등장', preset: 'stagger-scale', trigger: 'inView', duration: 300 },
        ],
      },
    },
  ],
}

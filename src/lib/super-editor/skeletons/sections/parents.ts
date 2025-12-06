/**
 * Super Editor - Parents Section Skeleton
 * 혼주 소개 섹션
 */

import type { SectionSkeleton } from '../types'

export const parentsSkeleton: SectionSkeleton = {
  sectionType: 'parents',
  name: '혼주 소개',
  description: '양가 혼주님 정보를 표시합니다.',
  defaultVariant: 'traditional',
  variants: [
    // ============================================
    // Traditional Variant
    // ============================================
    {
      id: 'traditional',
      name: '전통적',
      description: '격식있는 전통적 레이아웃',
      tags: ['traditional', 'formal', 'classic'],
      structure: {
        id: 'parents-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'parents-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'parents-title',
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
                  content: 'FAMILY',
                  as: 'h2',
                },
              },
              {
                id: 'parents-row',
                type: 'row',
                tokenStyle: {
                  gap: '$token.spacing.xl',
                },
                style: {
                  justifyContent: 'center',
                },
                children: [
                  // 신랑측 혼주
                  {
                    id: 'groom-parents',
                    type: 'column',
                    tokenStyle: {
                      gap: '$token.spacing.sm',
                    },
                    style: {
                      alignItems: 'center',
                      flex: 1,
                    },
                    children: [
                      {
                        id: 'groom-label',
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
                          content: '신랑측',
                          as: 'span',
                        },
                      },
                      {
                        id: 'groom-father-row',
                        type: 'row',
                        tokenStyle: {
                          gap: '$token.spacing.xs',
                        },
                        style: {
                          justifyContent: 'center',
                        },
                        children: [
                          {
                            id: 'groom-father-deceased',
                            type: 'conditional',
                            props: {
                              condition: 'parents.groom.father.status',
                              operator: 'equals',
                              value: 'deceased',
                            },
                            children: [
                              {
                                id: 'groom-father-deceased-text',
                                type: 'text',
                                tokenStyle: {
                                  fontFamily: '$token.typography.bodyMd.fontFamily',
                                  fontSize: '$token.typography.bodyMd.fontSize',
                                  color: '$token.colors.text.muted',
                                },
                                props: {
                                  content: '故',
                                  as: 'span',
                                },
                              },
                            ],
                          },
                          {
                            id: 'groom-father',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodyMd.fontFamily',
                              fontSize: '$token.typography.bodyMd.fontSize',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '{{parents.groom.father.name}}',
                              as: 'span',
                            },
                          },
                        ],
                      },
                      {
                        id: 'groom-mother-row',
                        type: 'row',
                        tokenStyle: {
                          gap: '$token.spacing.xs',
                        },
                        style: {
                          justifyContent: 'center',
                        },
                        children: [
                          {
                            id: 'groom-mother-deceased',
                            type: 'conditional',
                            props: {
                              condition: 'parents.groom.mother.status',
                              operator: 'equals',
                              value: 'deceased',
                            },
                            children: [
                              {
                                id: 'groom-mother-deceased-text',
                                type: 'text',
                                tokenStyle: {
                                  fontFamily: '$token.typography.bodyMd.fontFamily',
                                  fontSize: '$token.typography.bodyMd.fontSize',
                                  color: '$token.colors.text.muted',
                                },
                                props: {
                                  content: '故',
                                  as: 'span',
                                },
                              },
                            ],
                          },
                          {
                            id: 'groom-mother',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodyMd.fontFamily',
                              fontSize: '$token.typography.bodyMd.fontSize',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '{{parents.groom.mother.name}}',
                              as: 'span',
                            },
                          },
                        ],
                      },
                      {
                        id: 'groom-son',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.headingSm.fontFamily',
                          fontSize: '$token.typography.headingSm.fontSize',
                          fontWeight: '$token.typography.headingSm.fontWeight',
                          color: '$token.colors.brand',
                        },
                        style: {
                          textAlign: 'center',
                          marginTop: '8px',
                        },
                        props: {
                          content: '아들 {{couple.groom.name}}',
                          as: 'p',
                        },
                      },
                    ],
                  },
                  // 구분선
                  {
                    id: 'parents-divider',
                    type: 'divider',
                    tokenStyle: {
                      backgroundColor: '$token.colors.divider',
                    },
                    props: {
                      orientation: 'vertical',
                      thickness: 1,
                    },
                  },
                  // 신부측 혼주
                  {
                    id: 'bride-parents',
                    type: 'column',
                    tokenStyle: {
                      gap: '$token.spacing.sm',
                    },
                    style: {
                      alignItems: 'center',
                      flex: 1,
                    },
                    children: [
                      {
                        id: 'bride-label',
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
                          content: '신부측',
                          as: 'span',
                        },
                      },
                      {
                        id: 'bride-father-row',
                        type: 'row',
                        tokenStyle: {
                          gap: '$token.spacing.xs',
                        },
                        style: {
                          justifyContent: 'center',
                        },
                        children: [
                          {
                            id: 'bride-father-deceased',
                            type: 'conditional',
                            props: {
                              condition: 'parents.bride.father.status',
                              operator: 'equals',
                              value: 'deceased',
                            },
                            children: [
                              {
                                id: 'bride-father-deceased-text',
                                type: 'text',
                                tokenStyle: {
                                  fontFamily: '$token.typography.bodyMd.fontFamily',
                                  fontSize: '$token.typography.bodyMd.fontSize',
                                  color: '$token.colors.text.muted',
                                },
                                props: {
                                  content: '故',
                                  as: 'span',
                                },
                              },
                            ],
                          },
                          {
                            id: 'bride-father',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodyMd.fontFamily',
                              fontSize: '$token.typography.bodyMd.fontSize',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '{{parents.bride.father.name}}',
                              as: 'span',
                            },
                          },
                        ],
                      },
                      {
                        id: 'bride-mother-row',
                        type: 'row',
                        tokenStyle: {
                          gap: '$token.spacing.xs',
                        },
                        style: {
                          justifyContent: 'center',
                        },
                        children: [
                          {
                            id: 'bride-mother-deceased',
                            type: 'conditional',
                            props: {
                              condition: 'parents.bride.mother.status',
                              operator: 'equals',
                              value: 'deceased',
                            },
                            children: [
                              {
                                id: 'bride-mother-deceased-text',
                                type: 'text',
                                tokenStyle: {
                                  fontFamily: '$token.typography.bodyMd.fontFamily',
                                  fontSize: '$token.typography.bodyMd.fontSize',
                                  color: '$token.colors.text.muted',
                                },
                                props: {
                                  content: '故',
                                  as: 'span',
                                },
                              },
                            ],
                          },
                          {
                            id: 'bride-mother',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodyMd.fontFamily',
                              fontSize: '$token.typography.bodyMd.fontSize',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '{{parents.bride.mother.name}}',
                              as: 'span',
                            },
                          },
                        ],
                      },
                      {
                        id: 'bride-daughter',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.headingSm.fontFamily',
                          fontSize: '$token.typography.headingSm.fontSize',
                          fontWeight: '$token.typography.headingSm.fontWeight',
                          color: '$token.colors.brand',
                        },
                        style: {
                          textAlign: 'center',
                          marginTop: '8px',
                        },
                        props: {
                          content: '딸 {{couple.bride.name}}',
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
          id: 'groom-father',
          path: 'parents.groom.father.name',
          type: 'text',
          required: true,
          description: '신랑 아버지 성함',
        },
        {
          id: 'groom-mother',
          path: 'parents.groom.mother.name',
          type: 'text',
          required: true,
          description: '신랑 어머니 성함',
        },
        {
          id: 'bride-father',
          path: 'parents.bride.father.name',
          type: 'text',
          required: true,
          description: '신부 아버지 성함',
        },
        {
          id: 'bride-mother',
          path: 'parents.bride.mother.name',
          type: 'text',
          required: true,
          description: '신부 어머니 성함',
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
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
        ],
      },
    },

    // ============================================
    // Modern Variant
    // ============================================
    {
      id: 'modern',
      name: '모던',
      description: '간결하고 현대적인 레이아웃',
      tags: ['modern', 'minimal', 'clean'],
      structure: {
        id: 'parents-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'parents-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'parents-title',
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
                  content: 'FAMILY',
                  as: 'h2',
                },
              },
              {
                id: 'parents-cards',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.md',
                },
                children: [
                  // 신랑측 카드
                  {
                    id: 'groom-card',
                    type: 'container',
                    tokenStyle: {
                      padding: '$token.spacing.lg',
                      backgroundColor: '$token.colors.background',
                      borderRadius: '$token.borders.radiusMd',
                    },
                    children: [
                      {
                        id: 'groom-card-content',
                        type: 'row',
                        tokenStyle: {
                          gap: '$token.spacing.md',
                        },
                        style: {
                          alignItems: 'center',
                        },
                        children: [
                          {
                            id: 'groom-label',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.caption.fontFamily',
                              fontSize: '$token.typography.caption.fontSize',
                              color: '$token.colors.text.muted',
                            },
                            style: {
                              width: '60px',
                            },
                            props: {
                              content: '신랑측',
                              as: 'span',
                            },
                          },
                          {
                            id: 'groom-names',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodyMd.fontFamily',
                              fontSize: '$token.typography.bodyMd.fontSize',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content:
                                '{{parents.groom.father.name}} · {{parents.groom.mother.name}}의 아들 {{couple.groom.name}}',
                              as: 'p',
                            },
                          },
                        ],
                      },
                    ],
                  },
                  // 신부측 카드
                  {
                    id: 'bride-card',
                    type: 'container',
                    tokenStyle: {
                      padding: '$token.spacing.lg',
                      backgroundColor: '$token.colors.background',
                      borderRadius: '$token.borders.radiusMd',
                    },
                    children: [
                      {
                        id: 'bride-card-content',
                        type: 'row',
                        tokenStyle: {
                          gap: '$token.spacing.md',
                        },
                        style: {
                          alignItems: 'center',
                        },
                        children: [
                          {
                            id: 'bride-label',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.caption.fontFamily',
                              fontSize: '$token.typography.caption.fontSize',
                              color: '$token.colors.text.muted',
                            },
                            style: {
                              width: '60px',
                            },
                            props: {
                              content: '신부측',
                              as: 'span',
                            },
                          },
                          {
                            id: 'bride-names',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodyMd.fontFamily',
                              fontSize: '$token.typography.bodyMd.fontSize',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content:
                                '{{parents.bride.father.name}} · {{parents.bride.mother.name}}의 딸 {{couple.bride.name}}',
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
          id: 'groom-father',
          path: 'parents.groom.father.name',
          type: 'text',
          required: true,
          description: '신랑 아버지 성함',
        },
        {
          id: 'groom-mother',
          path: 'parents.groom.mother.name',
          type: 'text',
          required: true,
          description: '신랑 어머니 성함',
        },
        {
          id: 'bride-father',
          path: 'parents.bride.father.name',
          type: 'text',
          required: true,
          description: '신부 아버지 성함',
        },
        {
          id: 'bride-mother',
          path: 'parents.bride.mother.name',
          type: 'text',
          required: true,
          description: '신부 어머니 성함',
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
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'slide-up', name: '슬라이드 업', preset: 'slide-up', trigger: 'inView', duration: 500 },
        ],
      },
    },
  ],
}

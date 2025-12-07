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
                  content: '혼주 소개',
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
          defaultValue: '홍판서',
        },
        {
          id: 'groom-mother',
          path: 'parents.groom.mother.name',
          type: 'text',
          required: true,
          description: '신랑 어머니 성함',
          defaultValue: '김순자',
        },
        {
          id: 'bride-father',
          path: 'parents.bride.father.name',
          type: 'text',
          required: true,
          description: '신부 아버지 성함',
          defaultValue: '김철수',
        },
        {
          id: 'bride-mother',
          path: 'parents.bride.mother.name',
          type: 'text',
          required: true,
          description: '신부 어머니 성함',
          defaultValue: '이영희',
        },
        {
          id: 'groom-name',
          path: 'couple.groom.name',
          type: 'text',
          required: true,
          description: '신랑 이름',
          defaultValue: '홍길동',
        },
        {
          id: 'bride-name',
          path: 'couple.bride.name',
          type: 'text',
          required: true,
          description: '신부 이름',
          defaultValue: '김영희',
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
    // Elegant Variant (세로 배치)
    // ============================================
    {
      id: 'elegant',
      name: '엘레강스',
      description: '세로 배치, 한 줄 부모 소개',
      tags: ['elegant', 'vertical', 'clean'],
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
              gap: '$token.spacing.xl',
            },
            children: [
              // 신랑측 섹션
              {
                id: 'groom-section',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.md',
                },
                style: {
                  alignItems: 'center',
                },
                children: [
                  // 부모 이름 행: 아버지 · 어머니 의 아들
                  {
                    id: 'groom-parents-row',
                    type: 'row',
                    tokenStyle: {
                      gap: '$token.spacing.xs',
                    },
                    style: {
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    },
                    children: [
                      // 아버지 (故 표시 포함)
                      {
                        id: 'groom-father-deceased',
                        type: 'conditional',
                        props: {
                          condition: 'parents.groom.father.deceased',
                          operator: 'equals',
                          value: true,
                        },
                        children: [
                          {
                            id: 'groom-father-deceased-icon',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodyMd.fontFamily',
                              fontSize: '$token.typography.bodyMd.fontSize',
                              color: '$token.colors.text.muted',
                            },
                            props: {
                              content: '{{parents.deceasedIcon}}',
                              as: 'span',
                            },
                          },
                        ],
                      },
                      {
                        id: 'groom-father-name',
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
                      {
                        id: 'groom-parents-separator',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodyMd.fontFamily',
                          fontSize: '$token.typography.bodyMd.fontSize',
                          color: '$token.colors.text.muted',
                        },
                        style: {
                          margin: '0 4px',
                        },
                        props: {
                          content: '·',
                          as: 'span',
                        },
                      },
                      // 어머니 (故 표시 포함)
                      {
                        id: 'groom-mother-deceased',
                        type: 'conditional',
                        props: {
                          condition: 'parents.groom.mother.deceased',
                          operator: 'equals',
                          value: true,
                        },
                        children: [
                          {
                            id: 'groom-mother-deceased-icon',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodyMd.fontFamily',
                              fontSize: '$token.typography.bodyMd.fontSize',
                              color: '$token.colors.text.muted',
                            },
                            props: {
                              content: '{{parents.deceasedIcon}}',
                              as: 'span',
                            },
                          },
                        ],
                      },
                      {
                        id: 'groom-mother-name',
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
                      {
                        id: 'groom-relation',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodyMd.fontFamily',
                          fontSize: '$token.typography.bodyMd.fontSize',
                          color: '$token.colors.text.primary',
                        },
                        style: {
                          marginLeft: '8px',
                        },
                        props: {
                          content: '의 아들',
                          as: 'span',
                        },
                      },
                    ],
                  },
                  // 신랑 정보 행: 신랑 라벨 + 이름
                  {
                    id: 'groom-info-row',
                    type: 'row',
                    tokenStyle: {
                      gap: '$token.spacing.xl',
                    },
                    style: {
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      width: '100%',
                    },
                    children: [
                      {
                        id: 'groom-label',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodyMd.fontFamily',
                          fontSize: '$token.typography.bodyMd.fontSize',
                          color: '$token.colors.text.muted',
                        },
                        props: {
                          content: '신랑',
                          as: 'span',
                        },
                      },
                      {
                        id: 'groom-name',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.headingMd.fontFamily',
                          fontSize: '$token.typography.headingMd.fontSize',
                          fontWeight: '$token.typography.headingMd.fontWeight',
                          color: '$token.colors.text.primary',
                        },
                        props: {
                          content: '{{couple.groom.name}}',
                          as: 'span',
                        },
                      },
                    ],
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
                  orientation: 'horizontal',
                  thickness: 1,
                },
              },
              // 신부측 섹션
              {
                id: 'bride-section',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.md',
                },
                style: {
                  alignItems: 'center',
                },
                children: [
                  // 부모 이름 행: 아버지 · 어머니 의 딸
                  {
                    id: 'bride-parents-row',
                    type: 'row',
                    tokenStyle: {
                      gap: '$token.spacing.xs',
                    },
                    style: {
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    },
                    children: [
                      // 아버지 (故 표시 포함)
                      {
                        id: 'bride-father-deceased',
                        type: 'conditional',
                        props: {
                          condition: 'parents.bride.father.deceased',
                          operator: 'equals',
                          value: true,
                        },
                        children: [
                          {
                            id: 'bride-father-deceased-icon',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodyMd.fontFamily',
                              fontSize: '$token.typography.bodyMd.fontSize',
                              color: '$token.colors.text.muted',
                            },
                            props: {
                              content: '{{parents.deceasedIcon}}',
                              as: 'span',
                            },
                          },
                        ],
                      },
                      {
                        id: 'bride-father-name',
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
                      {
                        id: 'bride-parents-separator',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodyMd.fontFamily',
                          fontSize: '$token.typography.bodyMd.fontSize',
                          color: '$token.colors.text.muted',
                        },
                        style: {
                          margin: '0 4px',
                        },
                        props: {
                          content: '·',
                          as: 'span',
                        },
                      },
                      // 어머니 (故 표시 포함)
                      {
                        id: 'bride-mother-deceased',
                        type: 'conditional',
                        props: {
                          condition: 'parents.bride.mother.deceased',
                          operator: 'equals',
                          value: true,
                        },
                        children: [
                          {
                            id: 'bride-mother-deceased-icon',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodyMd.fontFamily',
                              fontSize: '$token.typography.bodyMd.fontSize',
                              color: '$token.colors.text.muted',
                            },
                            props: {
                              content: '{{parents.deceasedIcon}}',
                              as: 'span',
                            },
                          },
                        ],
                      },
                      {
                        id: 'bride-mother-name',
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
                      {
                        id: 'bride-relation',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodyMd.fontFamily',
                          fontSize: '$token.typography.bodyMd.fontSize',
                          color: '$token.colors.text.primary',
                        },
                        style: {
                          marginLeft: '8px',
                        },
                        props: {
                          content: '의 딸',
                          as: 'span',
                        },
                      },
                    ],
                  },
                  // 신부 정보 행: 신부 라벨 + 이름
                  {
                    id: 'bride-info-row',
                    type: 'row',
                    tokenStyle: {
                      gap: '$token.spacing.xl',
                    },
                    style: {
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      width: '100%',
                    },
                    children: [
                      {
                        id: 'bride-label',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.bodyMd.fontFamily',
                          fontSize: '$token.typography.bodyMd.fontSize',
                          color: '$token.colors.text.muted',
                        },
                        props: {
                          content: '신부',
                          as: 'span',
                        },
                      },
                      {
                        id: 'bride-name',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.headingMd.fontFamily',
                          fontSize: '$token.typography.headingMd.fontSize',
                          fontWeight: '$token.typography.headingMd.fontWeight',
                          color: '$token.colors.text.primary',
                        },
                        props: {
                          content: '{{couple.bride.name}}',
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
          id: 'deceased-icon',
          path: 'parents.deceasedIcon',
          type: 'text',
          required: false,
          description: '고인 표시 아이콘',
          defaultValue: '故',
        },
        {
          id: 'groom-father',
          path: 'parents.groom.father.name',
          type: 'text',
          required: true,
          description: '신랑 아버지 성함',
          defaultValue: '정동석',
        },
        {
          id: 'groom-mother',
          path: 'parents.groom.mother.name',
          type: 'text',
          required: true,
          description: '신랑 어머니 성함',
          defaultValue: '윤혜진',
        },
        {
          id: 'bride-father',
          path: 'parents.bride.father.name',
          type: 'text',
          required: true,
          description: '신부 아버지 성함',
          defaultValue: '김재현',
        },
        {
          id: 'bride-mother',
          path: 'parents.bride.mother.name',
          type: 'text',
          required: true,
          description: '신부 어머니 성함',
          defaultValue: '서수진',
        },
        {
          id: 'groom-name',
          path: 'couple.groom.name',
          type: 'text',
          required: true,
          description: '신랑 이름',
          defaultValue: '세진',
        },
        {
          id: 'bride-name',
          path: 'couple.bride.name',
          type: 'text',
          required: true,
          description: '신부 이름',
          defaultValue: '유정',
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
                  content: '혼주 소개',
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
          defaultValue: '홍판서',
        },
        {
          id: 'groom-mother',
          path: 'parents.groom.mother.name',
          type: 'text',
          required: true,
          description: '신랑 어머니 성함',
          defaultValue: '김순자',
        },
        {
          id: 'bride-father',
          path: 'parents.bride.father.name',
          type: 'text',
          required: true,
          description: '신부 아버지 성함',
          defaultValue: '김철수',
        },
        {
          id: 'bride-mother',
          path: 'parents.bride.mother.name',
          type: 'text',
          required: true,
          description: '신부 어머니 성함',
          defaultValue: '이영희',
        },
        {
          id: 'groom-name',
          path: 'couple.groom.name',
          type: 'text',
          required: true,
          description: '신랑 이름',
          defaultValue: '홍길동',
        },
        {
          id: 'bride-name',
          path: 'couple.bride.name',
          type: 'text',
          required: true,
          description: '신부 이름',
          defaultValue: '김영희',
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

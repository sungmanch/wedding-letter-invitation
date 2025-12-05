/**
 * Super Editor - Greeting Section Skeleton
 * 인사말 섹션
 */

import type { SectionSkeleton } from '../types'

export const greetingSkeleton: SectionSkeleton = {
  sectionType: 'greeting',
  name: '인사말',
  description: '신랑/신부의 인사말을 표시합니다.',
  defaultVariant: 'simple',
  variants: [
    // ============================================
    // Simple Variant
    // ============================================
    {
      id: 'simple',
      name: '심플',
      description: '깔끔한 중앙 정렬 인사말',
      tags: ['simple', 'clean', 'minimal'],
      structure: {
        id: 'greeting-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'greeting-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            style: {
              alignItems: 'center',
            },
            children: [
              {
                id: 'greeting-title',
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
                  content: '{{greeting.title}}',
                  as: 'h2',
                },
              },
              {
                id: 'greeting-divider',
                type: 'divider',
                tokenStyle: {
                  backgroundColor: '$token.colors.brand',
                },
                style: {
                  width: '40px',
                },
                props: {
                  thickness: 2,
                },
              },
              {
                id: 'greeting-message',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.bodyMd.fontFamily',
                  fontSize: '$token.typography.bodyMd.fontSize',
                  color: '$token.colors.text.secondary',
                },
                style: {
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                  lineHeight: '1.8',
                  maxWidth: '320px',
                },
                props: {
                  content: '{{greeting.content}}',
                  as: 'p',
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'greeting-title',
          path: 'greeting.title',
          type: 'text',
          required: false,
          description: '인사말 제목',
          defaultValue: '저희 결혼합니다',
        },
        {
          id: 'greeting-content',
          path: 'greeting.content',
          type: 'text',
          required: false,
          description: '인사말 내용',
          defaultValue: '서로를 향한 마음을 모아\n평생을 함께하고자 합니다.\n\n귀한 걸음 하시어\n저희의 새 출발을 축복해 주시면\n더없는 기쁨이 되겠습니다.',
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
    // Elegant Variant
    // ============================================
    {
      id: 'elegant',
      name: '엘레강스',
      description: '우아한 배경과 함께하는 인사말',
      tags: ['elegant', 'luxury', 'classic'],
      structure: {
        id: 'greeting-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'greeting-card',
            type: 'container',
            tokenStyle: {
              backgroundColor: '$token.colors.background',
              borderRadius: '$token.borders.radiusMd',
              boxShadow: '$token.shadows.md',
              padding: '$token.spacing.xl',
            },
            children: [
              {
                id: 'greeting-content',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.lg',
                },
                style: {
                  alignItems: 'center',
                },
                children: [
                  {
                    id: 'greeting-icon',
                    type: 'text',
                    tokenStyle: {
                      color: '$token.colors.brand',
                    },
                    style: {
                      fontSize: '32px',
                    },
                    props: {
                      content: '♥',
                      as: 'span',
                    },
                  },
                  {
                    id: 'greeting-title',
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
                      content: '{{greeting.title}}',
                      as: 'h2',
                    },
                  },
                  {
                    id: 'greeting-message',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodyMd.fontFamily',
                      fontSize: '$token.typography.bodyMd.fontSize',
                      color: '$token.colors.text.secondary',
                    },
                    style: {
                      textAlign: 'center',
                      whiteSpace: 'pre-line',
                      lineHeight: '1.8',
                    },
                    props: {
                      content: '{{greeting.content}}',
                      as: 'p',
                    },
                  },
                  {
                    id: 'greeting-names',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingSm.fontFamily',
                      fontSize: '$token.typography.headingSm.fontSize',
                      color: '$token.colors.brand',
                    },
                    style: {
                      textAlign: 'center',
                      marginTop: '8px',
                    },
                    props: {
                      content: '{{couple.groom.name}} · {{couple.bride.name}}',
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
          id: 'greeting-title',
          path: 'greeting.title',
          type: 'text',
          required: false,
          description: '인사말 제목',
          defaultValue: '저희 결혼합니다',
        },
        {
          id: 'greeting-content',
          path: 'greeting.content',
          type: 'text',
          required: false,
          description: '인사말 내용',
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

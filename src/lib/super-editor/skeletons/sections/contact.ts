/**
 * Super Editor - Contact Section Skeleton
 * 연락처 섹션 (신랑/신부 전화/SMS)
 */

import type { SectionSkeleton } from '../types'

export const contactSkeleton: SectionSkeleton = {
  sectionType: 'contact',
  name: '연락처',
  description: '신랑/신부 연락처를 표시합니다.',
  defaultVariant: 'icon-buttons',
  variants: [
    // ============================================
    // Icon Buttons Variant (샘플 1.png 참고)
    // ============================================
    {
      id: 'icon-buttons',
      name: '아이콘 버튼',
      description: '전화/SMS 아이콘 버튼 형태',
      tags: ['minimal', 'clean', 'modern'],
      structure: {
        id: 'contact-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.lg',
        },
        children: [
          {
            id: 'contact-title',
            type: 'text',
            tokenStyle: {
              fontFamily: '$token.typography.sectionTitle.fontFamily',
              fontSize: '$token.typography.sectionTitle.fontSize',
              fontWeight: '$token.typography.sectionTitle.fontWeight',
              letterSpacing: '$token.typography.sectionTitle.letterSpacing',
              color: '$token.colors.text.primary',
              marginBottom: '$token.spacing.lg',
            },
            style: {
              textAlign: 'center',
              textTransform: 'uppercase',
            },
            props: {
              content: 'CONTACT',
              as: 'h2',
            },
          },
          {
            id: 'contact-row',
            type: 'row',
            style: {
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '48px',
            },
            children: [
              // 신랑 영역
              {
                id: 'groom-contact',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                style: {
                  alignItems: 'center',
                },
                children: [
                  {
                    id: 'groom-label',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingSm.fontFamily',
                      fontSize: '$token.typography.headingSm.fontSize',
                      fontWeight: '$token.typography.headingSm.fontWeight',
                      color: '$token.colors.brand',
                    },
                    props: {
                      content: '신랑',
                      as: 'span',
                    },
                  },
                  {
                    id: 'groom-buttons',
                    type: 'row',
                    tokenStyle: {
                      gap: '$token.spacing.md',
                    },
                    children: [
                      {
                        id: 'groom-call-btn',
                        type: 'button',
                        tokenStyle: {
                          color: '$token.colors.text.secondary',
                        },
                        props: {
                          icon: 'phone',
                          size: 'md',
                          variant: 'ghost',
                          ariaLabel: '신랑에게 전화',
                          action: {
                            type: 'call',
                            phone: '{{couple.groom.phone}}',
                          },
                        },
                      },
                      {
                        id: 'groom-sms-btn',
                        type: 'button',
                        tokenStyle: {
                          color: '$token.colors.text.secondary',
                        },
                        props: {
                          icon: 'message',
                          size: 'md',
                          variant: 'ghost',
                          ariaLabel: '신랑에게 문자',
                          action: {
                            type: 'sms',
                            phone: '{{couple.groom.phone}}',
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              // 신부 영역
              {
                id: 'bride-contact',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                style: {
                  alignItems: 'center',
                },
                children: [
                  {
                    id: 'bride-label',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingSm.fontFamily',
                      fontSize: '$token.typography.headingSm.fontSize',
                      fontWeight: '$token.typography.headingSm.fontWeight',
                      color: '$token.colors.brand',
                    },
                    props: {
                      content: '신부',
                      as: 'span',
                    },
                  },
                  {
                    id: 'bride-buttons',
                    type: 'row',
                    tokenStyle: {
                      gap: '$token.spacing.md',
                    },
                    children: [
                      {
                        id: 'bride-call-btn',
                        type: 'button',
                        tokenStyle: {
                          color: '$token.colors.text.secondary',
                        },
                        props: {
                          icon: 'phone',
                          size: 'md',
                          variant: 'ghost',
                          ariaLabel: '신부에게 전화',
                          action: {
                            type: 'call',
                            phone: '{{couple.bride.phone}}',
                          },
                        },
                      },
                      {
                        id: 'bride-sms-btn',
                        type: 'button',
                        tokenStyle: {
                          color: '$token.colors.text.secondary',
                        },
                        props: {
                          icon: 'message',
                          size: 'md',
                          variant: 'ghost',
                          ariaLabel: '신부에게 문자',
                          action: {
                            type: 'sms',
                            phone: '{{couple.bride.phone}}',
                          },
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
          id: 'groom-phone',
          path: 'couple.groom.phone',
          type: 'phone',
          required: true,
          description: '신랑 전화번호',
        },
        {
          id: 'bride-phone',
          path: 'couple.bride.phone',
          type: 'phone',
          required: true,
          description: '신부 전화번호',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 300 },
        ],
      },
    },

    // ============================================
    // With Names Variant
    // ============================================
    {
      id: 'with-names',
      name: '이름 포함',
      description: '신랑/신부 이름과 함께 표시',
      tags: ['detailed', 'elegant', 'informative'],
      structure: {
        id: 'contact-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.lg',
        },
        children: [
          {
            id: 'contact-title',
            type: 'text',
            tokenStyle: {
              fontFamily: '$token.typography.sectionTitle.fontFamily',
              fontSize: '$token.typography.sectionTitle.fontSize',
              fontWeight: '$token.typography.sectionTitle.fontWeight',
              letterSpacing: '$token.typography.sectionTitle.letterSpacing',
              color: '$token.colors.text.primary',
              marginBottom: '$token.spacing.lg',
            },
            style: {
              textAlign: 'center',
              textTransform: 'uppercase',
            },
            props: {
              content: 'CONTACT',
              as: 'h2',
            },
          },
          {
            id: 'contact-row',
            type: 'row',
            style: {
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '48px',
            },
            children: [
              // 신랑 영역
              {
                id: 'groom-contact',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.xs',
                },
                style: {
                  alignItems: 'center',
                },
                children: [
                  {
                    id: 'groom-role',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodySm.fontFamily',
                      fontSize: '$token.typography.bodySm.fontSize',
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
                      fontFamily: '$token.typography.headingSm.fontFamily',
                      fontSize: '$token.typography.headingSm.fontSize',
                      fontWeight: '$token.typography.headingSm.fontWeight',
                      color: '$token.colors.text.primary',
                    },
                    props: {
                      content: '{{couple.groom.name}}',
                      as: 'span',
                    },
                  },
                  {
                    id: 'groom-buttons',
                    type: 'row',
                    tokenStyle: {
                      gap: '$token.spacing.sm',
                    },
                    style: {
                      marginTop: '8px',
                    },
                    children: [
                      {
                        id: 'groom-call-btn',
                        type: 'button',
                        tokenStyle: {
                          color: '$token.colors.text.secondary',
                        },
                        props: {
                          icon: 'phone',
                          size: 'sm',
                          variant: 'ghost',
                          action: {
                            type: 'call',
                            phone: '{{couple.groom.phone}}',
                          },
                        },
                      },
                      {
                        id: 'groom-sms-btn',
                        type: 'button',
                        tokenStyle: {
                          color: '$token.colors.text.secondary',
                        },
                        props: {
                          icon: 'message',
                          size: 'sm',
                          variant: 'ghost',
                          action: {
                            type: 'sms',
                            phone: '{{couple.groom.phone}}',
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              // 신부 영역
              {
                id: 'bride-contact',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.xs',
                },
                style: {
                  alignItems: 'center',
                },
                children: [
                  {
                    id: 'bride-role',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodySm.fontFamily',
                      fontSize: '$token.typography.bodySm.fontSize',
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
                      fontFamily: '$token.typography.headingSm.fontFamily',
                      fontSize: '$token.typography.headingSm.fontSize',
                      fontWeight: '$token.typography.headingSm.fontWeight',
                      color: '$token.colors.text.primary',
                    },
                    props: {
                      content: '{{couple.bride.name}}',
                      as: 'span',
                    },
                  },
                  {
                    id: 'bride-buttons',
                    type: 'row',
                    tokenStyle: {
                      gap: '$token.spacing.sm',
                    },
                    style: {
                      marginTop: '8px',
                    },
                    children: [
                      {
                        id: 'bride-call-btn',
                        type: 'button',
                        tokenStyle: {
                          color: '$token.colors.text.secondary',
                        },
                        props: {
                          icon: 'phone',
                          size: 'sm',
                          variant: 'ghost',
                          action: {
                            type: 'call',
                            phone: '{{couple.bride.phone}}',
                          },
                        },
                      },
                      {
                        id: 'bride-sms-btn',
                        type: 'button',
                        tokenStyle: {
                          color: '$token.colors.text.secondary',
                        },
                        props: {
                          icon: 'message',
                          size: 'sm',
                          variant: 'ghost',
                          action: {
                            type: 'sms',
                            phone: '{{couple.bride.phone}}',
                          },
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
          id: 'groom-name',
          path: 'couple.groom.name',
          type: 'text',
          required: true,
          description: '신랑 이름',
        },
        {
          id: 'groom-phone',
          path: 'couple.groom.phone',
          type: 'phone',
          required: true,
          description: '신랑 전화번호',
        },
        {
          id: 'bride-name',
          path: 'couple.bride.name',
          type: 'text',
          required: true,
          description: '신부 이름',
        },
        {
          id: 'bride-phone',
          path: 'couple.bride.phone',
          type: 'phone',
          required: true,
          description: '신부 전화번호',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 300 },
        ],
      },
    },
  ],
}

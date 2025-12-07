/**
 * Super Editor - Guestbook Section Skeleton
 * 방명록 섹션
 */

import type { SectionSkeleton } from '../types'

export const guestbookSkeleton: SectionSkeleton = {
  sectionType: 'guestbook',
  name: '축하 메시지',
  description: '방명록과 축하 메시지를 표시합니다.',
  defaultVariant: 'card',
  variants: [
    // ============================================
    // Card Variant
    // ============================================
    {
      id: 'card',
      name: '카드',
      description: '카드 형태의 메시지 목록',
      tags: ['modern', 'clean', 'elegant'],
      structure: {
        id: 'guestbook-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'guestbook-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'guestbook-title',
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
                  content: '방명록',
                  as: 'h2',
                },
              },
              {
                id: 'guestbook-description',
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
                  content: '축하의 마음을 전해주세요',
                  as: 'p',
                },
              },
              // 메시지 입력 폼
              {
                id: 'guestbook-form',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.md',
                  padding: '$token.spacing.lg',
                  backgroundColor: '$token.colors.background',
                  borderRadius: '$token.borders.radiusMd',
                },
                children: [
                  {
                    id: 'guestbook-name-input',
                    type: 'input',
                    tokenStyle: {
                      borderRadius: '$token.borders.radiusSm',
                      borderColor: '$token.colors.border',
                    },
                    props: {
                      type: 'text',
                      name: 'name',
                      placeholder: '이름',
                      required: true,
                      maxLength: 20,
                    },
                  },
                  {
                    id: 'guestbook-message-input',
                    type: 'input',
                    tokenStyle: {
                      borderRadius: '$token.borders.radiusSm',
                      borderColor: '$token.colors.border',
                    },
                    props: {
                      type: 'textarea',
                      name: 'message',
                      placeholder: '축하 메시지를 입력해주세요',
                      required: true,
                      maxLength: 200,
                      rows: 3,
                    },
                  },
                  {
                    id: 'guestbook-submit',
                    type: 'button',
                    tokenStyle: {
                      backgroundColor: '$token.colors.brand',
                      color: '$token.colors.text.onBrand',
                      borderRadius: '$token.borders.radiusMd',
                    },
                    props: {
                      label: '메시지 남기기',
                      variant: 'primary',
                      size: 'md',
                      action: {
                        type: 'custom',
                        handler: 'submitGuestbook',
                      },
                    },
                  },
                ],
              },
              // 메시지 목록
              {
                id: 'guestbook-messages',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.md',
                },
                children: [
                  {
                    id: 'guestbook-list',
                    type: 'repeat',
                    props: {
                      dataPath: 'guestbook.messages',
                      as: 'msg',
                      limit: 10,
                    },
                    children: [
                      {
                        id: 'message-card',
                        type: 'container',
                        tokenStyle: {
                          padding: '$token.spacing.md',
                          backgroundColor: '$token.colors.background',
                          borderRadius: '$token.borders.radiusMd',
                          boxShadow: '$token.shadows.sm',
                        },
                        children: [
                          {
                            id: 'message-content',
                            type: 'column',
                            tokenStyle: {
                              gap: '$token.spacing.sm',
                            },
                            children: [
                              {
                                id: 'message-text',
                                type: 'text',
                                tokenStyle: {
                                  fontFamily: '$token.typography.bodyMd.fontFamily',
                                  fontSize: '$token.typography.bodyMd.fontSize',
                                  color: '$token.colors.text.primary',
                                },
                                props: {
                                  content: '{{msg.message}}',
                                  as: 'p',
                                },
                              },
                              {
                                id: 'message-meta',
                                type: 'row',
                                tokenStyle: {
                                  gap: '$token.spacing.sm',
                                },
                                style: {
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                },
                                children: [
                                  {
                                    id: 'message-author',
                                    type: 'text',
                                    tokenStyle: {
                                      fontFamily: '$token.typography.bodySm.fontFamily',
                                      fontSize: '$token.typography.bodySm.fontSize',
                                      color: '$token.colors.brand',
                                    },
                                    props: {
                                      content: '{{msg.name}}',
                                      as: 'span',
                                    },
                                  },
                                  {
                                    id: 'message-date',
                                    type: 'text',
                                    tokenStyle: {
                                      fontFamily: '$token.typography.caption.fontFamily',
                                      fontSize: '$token.typography.caption.fontSize',
                                      color: '$token.colors.text.muted',
                                    },
                                    props: {
                                      content: '{{msg.createdAt}}',
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
                ],
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'guestbook-messages',
          path: 'guestbook.messages',
          type: 'text',
          required: false,
          description: '방명록 메시지 목록',
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
    // Minimal Variant
    // ============================================
    {
      id: 'minimal',
      name: '미니멀',
      description: '간결한 목록 형태',
      tags: ['minimal', 'simple', 'clean'],
      structure: {
        id: 'guestbook-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'guestbook-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'guestbook-title',
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
                  content: '방명록',
                  as: 'h2',
                },
              },
              // 간단한 입력 폼
              {
                id: 'guestbook-simple-form',
                type: 'row',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                children: [
                  {
                    id: 'guestbook-input',
                    type: 'input',
                    tokenStyle: {
                      borderRadius: '$token.borders.radiusSm',
                      borderColor: '$token.colors.border',
                    },
                    style: {
                      flex: 1,
                    },
                    props: {
                      type: 'text',
                      name: 'message',
                      placeholder: '축하 메시지를 남겨주세요',
                      required: true,
                      maxLength: 100,
                    },
                  },
                  {
                    id: 'guestbook-btn',
                    type: 'button',
                    tokenStyle: {
                      backgroundColor: '$token.colors.brand',
                      color: '$token.colors.text.onBrand',
                      borderRadius: '$token.borders.radiusSm',
                    },
                    props: {
                      label: '등록',
                      variant: 'primary',
                      size: 'md',
                      action: {
                        type: 'custom',
                        handler: 'submitGuestbook',
                      },
                    },
                  },
                ],
              },
              // 메시지 목록 (간단)
              {
                id: 'guestbook-list-minimal',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                children: [
                  {
                    id: 'messages-repeat',
                    type: 'repeat',
                    props: {
                      dataPath: 'guestbook.messages',
                      as: 'msg',
                      limit: 5,
                    },
                    children: [
                      {
                        id: 'msg-row',
                        type: 'row',
                        tokenStyle: {
                          gap: '$token.spacing.sm',
                          padding: '$token.spacing.sm',
                          borderRadius: '$token.borders.radiusSm',
                        },
                        style: {
                          borderBottom: '1px solid var(--color-divider)',
                        },
                        children: [
                          {
                            id: 'msg-name',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodySm.fontFamily',
                              fontSize: '$token.typography.bodySm.fontSize',
                              color: '$token.colors.brand',
                            },
                            style: {
                              minWidth: '60px',
                            },
                            props: {
                              content: '{{msg.name}}',
                              as: 'span',
                            },
                          },
                          {
                            id: 'msg-text',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodyMd.fontFamily',
                              fontSize: '$token.typography.bodyMd.fontSize',
                              color: '$token.colors.text.primary',
                            },
                            style: {
                              flex: 1,
                            },
                            props: {
                              content: '{{msg.message}}',
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
          id: 'guestbook-messages',
          path: 'guestbook.messages',
          type: 'text',
          required: false,
          description: '방명록 메시지 목록',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 400 },
        ],
      },
    },
  ],
}

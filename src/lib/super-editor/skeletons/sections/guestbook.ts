/**
 * Super Editor - Guestbook Section Skeleton
 * 축하 메시지 섹션
 */

import type { SectionSkeleton } from '../types'

export const guestbookSkeleton: SectionSkeleton = {
  sectionType: 'guestbook',
  name: '축하 메시지',
  description: '방명록과 축하 메시지를 표시합니다.',
  defaultVariant: 'block',
  variants: [
    // ============================================
    // FAB (Floating Action Button) Variant
    // ============================================
    {
      id: 'fab',
      name: 'FAB',
      description: '하단 플로팅 버튼 형태 (스크롤 후 노출)',
      tags: ['minimal', 'modern', 'clean'],
      structure: {
        id: 'guestbook-fab-root',
        type: 'container',
        style: {
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
        },
        props: {
          // 스크롤 후 나타남 - 렌더러/빌더에서 처리
          showAfterScroll: 200,
        },
        children: [
          {
            id: 'guestbook-fab-btn',
            type: 'button',
            tokenStyle: {
              backgroundColor: '$token.colors.brand',
              color: '$token.colors.text.onBrand',
              borderRadius: '$token.borders.radiusFull',
              boxShadow: '$token.shadows.lg',
            },
            style: {
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            },
            props: {
              label: '💬',
              variant: 'primary',
              size: 'lg',
              action: {
                type: 'custom',
                handler: 'openGuestbookModal',
              },
            },
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
          { id: 'scale', name: '스케일 인', preset: 'scale-in', trigger: 'mount', duration: 300 },
          { id: 'slide-up', name: '슬라이드 업', preset: 'slide-up', trigger: 'mount', duration: 300 },
        ],
      },
    },

    // ============================================
    // Block Variant
    // ============================================
    {
      id: 'block',
      name: '블록',
      description: '인라인 폼과 메시지 카드 목록',
      tags: ['elegant', 'detailed', 'modern'],
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
                  content: '축하 메시지',
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
  ],
}

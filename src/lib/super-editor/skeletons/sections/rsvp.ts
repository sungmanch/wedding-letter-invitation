/**
 * Super Editor - RSVP Section Skeleton
 * 참석 여부 수집 섹션
 */

import type { SectionSkeleton } from '../types'

export const rsvpSkeleton: SectionSkeleton = {
  sectionType: 'rsvp',
  name: '참석 여부',
  description: '하객의 참석 여부를 수집합니다.',
  defaultVariant: 'inline',
  variants: [
    // ============================================
    // Inline Variant
    // ============================================
    {
      id: 'inline',
      name: '인라인',
      description: '페이지 내 인라인 폼',
      tags: ['clean', 'modern', 'minimal'],
      structure: {
        id: 'rsvp-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'rsvp-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'rsvp-title',
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
                  content: '{{rsvp.title}}',
                  as: 'h2',
                },
              },
              {
                id: 'rsvp-description',
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
                  content: '{{rsvp.description}}',
                  as: 'p',
                },
              },
              // RSVP 폼
              {
                id: 'rsvp-form',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.md',
                  padding: '$token.spacing.lg',
                  backgroundColor: '$token.colors.background',
                  borderRadius: '$token.borders.radiusMd',
                },
                children: [
                  // 이름 입력
                  {
                    id: 'rsvp-name-input',
                    type: 'input',
                    tokenStyle: {
                      borderRadius: '$token.borders.radiusSm',
                      borderColor: '$token.colors.border',
                    },
                    props: {
                      type: 'text',
                      name: 'guestName',
                      placeholder: '이름',
                      required: true,
                      maxLength: 20,
                    },
                  },
                  // 연락처 입력
                  {
                    id: 'rsvp-phone-input',
                    type: 'input',
                    tokenStyle: {
                      borderRadius: '$token.borders.radiusSm',
                      borderColor: '$token.colors.border',
                    },
                    props: {
                      type: 'tel',
                      name: 'guestPhone',
                      placeholder: '연락처 (선택)',
                      required: false,
                    },
                  },
                  // 참석 여부 선택
                  {
                    id: 'rsvp-attending-group',
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
                        id: 'rsvp-attending-yes',
                        type: 'button',
                        tokenStyle: {
                          borderRadius: '$token.borders.radiusMd',
                          borderColor: '$token.colors.border',
                        },
                        props: {
                          label: '참석',
                          variant: 'outline',
                          size: 'md',
                          name: 'attending',
                          value: 'yes',
                          action: {
                            type: 'custom',
                            handler: 'selectRsvpOption',
                          },
                        },
                      },
                      {
                        id: 'rsvp-attending-no',
                        type: 'button',
                        tokenStyle: {
                          borderRadius: '$token.borders.radiusMd',
                          borderColor: '$token.colors.border',
                        },
                        props: {
                          label: '불참',
                          variant: 'outline',
                          size: 'md',
                          name: 'attending',
                          value: 'no',
                          action: {
                            type: 'custom',
                            handler: 'selectRsvpOption',
                          },
                        },
                      },
                      {
                        id: 'rsvp-attending-maybe',
                        type: 'button',
                        tokenStyle: {
                          borderRadius: '$token.borders.radiusMd',
                          borderColor: '$token.colors.border',
                        },
                        props: {
                          label: '미정',
                          variant: 'outline',
                          size: 'md',
                          name: 'attending',
                          value: 'maybe',
                          action: {
                            type: 'custom',
                            handler: 'selectRsvpOption',
                          },
                        },
                      },
                    ],
                  },
                  // 동행인 수 (조건부)
                  {
                    id: 'rsvp-guest-count',
                    type: 'row',
                    tokenStyle: {
                      gap: '$token.spacing.sm',
                    },
                    style: {
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    props: {
                      conditional: '{{rsvp.showGuestCount}}',
                    },
                    children: [
                      {
                        id: 'rsvp-guest-count-label',
                        type: 'text',
                        tokenStyle: {
                          fontSize: '$token.typography.bodySm.fontSize',
                          color: '$token.colors.text.secondary',
                        },
                        props: {
                          content: '동행인',
                          as: 'span',
                        },
                      },
                      {
                        id: 'rsvp-guest-count-input',
                        type: 'input',
                        tokenStyle: {
                          borderRadius: '$token.borders.radiusSm',
                          borderColor: '$token.colors.border',
                        },
                        style: {
                          width: '80px',
                          textAlign: 'center',
                        },
                        props: {
                          type: 'number',
                          name: 'guestCount',
                          min: 0,
                          max: 10,
                          defaultValue: 0,
                        },
                      },
                      {
                        id: 'rsvp-guest-count-suffix',
                        type: 'text',
                        tokenStyle: {
                          fontSize: '$token.typography.bodySm.fontSize',
                          color: '$token.colors.text.secondary',
                        },
                        props: {
                          content: '명',
                          as: 'span',
                        },
                      },
                    ],
                  },
                  // 신랑측/신부측 선택
                  {
                    id: 'rsvp-side-group',
                    type: 'row',
                    tokenStyle: {
                      gap: '$token.spacing.sm',
                    },
                    style: {
                      justifyContent: 'center',
                    },
                    children: [
                      {
                        id: 'rsvp-side-groom',
                        type: 'button',
                        tokenStyle: {
                          borderRadius: '$token.borders.radiusMd',
                          borderColor: '$token.colors.border',
                        },
                        props: {
                          label: '신랑측',
                          variant: 'outline',
                          size: 'sm',
                          name: 'side',
                          value: 'groom',
                          action: {
                            type: 'custom',
                            handler: 'selectRsvpSide',
                          },
                        },
                      },
                      {
                        id: 'rsvp-side-bride',
                        type: 'button',
                        tokenStyle: {
                          borderRadius: '$token.borders.radiusMd',
                          borderColor: '$token.colors.border',
                        },
                        props: {
                          label: '신부측',
                          variant: 'outline',
                          size: 'sm',
                          name: 'side',
                          value: 'bride',
                          action: {
                            type: 'custom',
                            handler: 'selectRsvpSide',
                          },
                        },
                      },
                    ],
                  },
                  // 메시지 입력 (조건부)
                  {
                    id: 'rsvp-message-input',
                    type: 'input',
                    tokenStyle: {
                      borderRadius: '$token.borders.radiusSm',
                      borderColor: '$token.colors.border',
                    },
                    props: {
                      type: 'textarea',
                      name: 'message',
                      placeholder: '축하 메시지 (선택)',
                      required: false,
                      maxLength: 200,
                      rows: 2,
                      conditional: '{{rsvp.showMessage}}',
                    },
                  },
                  // 제출 버튼
                  {
                    id: 'rsvp-submit',
                    type: 'button',
                    tokenStyle: {
                      backgroundColor: '$token.colors.brand',
                      color: '$token.colors.text.onBrand',
                      borderRadius: '$token.borders.radiusMd',
                    },
                    style: {
                      marginTop: '8px',
                    },
                    props: {
                      label: '참석 여부 전송',
                      variant: 'primary',
                      size: 'md',
                      action: {
                        type: 'custom',
                        handler: 'submitRsvp',
                      },
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
          id: 'rsvp-title-slot',
          path: 'rsvp.title',
          type: 'text',
          required: false,
          description: 'RSVP 섹션 제목',
          defaultValue: '참석 여부를 알려주세요',
        },
        {
          id: 'rsvp-description-slot',
          path: 'rsvp.description',
          type: 'text',
          required: false,
          description: 'RSVP 섹션 설명',
          defaultValue: '참석 여부를 미리 알려주시면 준비에 큰 도움이 됩니다.',
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
    // Popup Variant
    // ============================================
    {
      id: 'popup',
      name: '팝업',
      description: '페이지 진입 시 팝업으로 표시',
      tags: ['attention', 'prominent', 'modal'],
      structure: {
        id: 'rsvp-popup-root',
        type: 'container',
        style: {
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        props: {
          showOnMount: true,
          dismissable: true,
        },
        children: [
          // 오버레이
          {
            id: 'rsvp-popup-overlay',
            type: 'container',
            style: {
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            props: {
              action: {
                type: 'custom',
                handler: 'closeRsvpPopup',
              },
            },
          },
          // 모달 컨텐츠
          {
            id: 'rsvp-popup-modal',
            type: 'column',
            tokenStyle: {
              backgroundColor: '$token.colors.background',
              borderRadius: '$token.borders.radiusLg',
              padding: '$token.spacing.xl',
              gap: '$token.spacing.md',
            },
            style: {
              position: 'relative',
              maxWidth: '90%',
              width: '360px',
              maxHeight: '90vh',
              overflowY: 'auto',
            },
            children: [
              {
                id: 'rsvp-popup-close',
                type: 'button',
                style: {
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                },
                props: {
                  label: '✕',
                  variant: 'ghost',
                  size: 'sm',
                  action: {
                    type: 'custom',
                    handler: 'closeRsvpPopup',
                  },
                },
              },
              {
                id: 'rsvp-popup-title',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.sectionTitle.fontFamily',
                  fontSize: '$token.typography.sectionTitle.fontSize',
                  fontWeight: '$token.typography.sectionTitle.fontWeight',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: '{{rsvp.title}}',
                  as: 'h2',
                },
              },
              // 폼 필드 (inline과 동일한 구조)
              {
                id: 'rsvp-popup-form',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.md',
                },
                children: [
                  {
                    id: 'rsvp-popup-name',
                    type: 'input',
                    tokenStyle: {
                      borderRadius: '$token.borders.radiusSm',
                      borderColor: '$token.colors.border',
                    },
                    props: {
                      type: 'text',
                      name: 'guestName',
                      placeholder: '이름',
                      required: true,
                    },
                  },
                  {
                    id: 'rsvp-popup-attending',
                    type: 'row',
                    tokenStyle: { gap: '$token.spacing.sm' },
                    style: { justifyContent: 'center' },
                    children: [
                      {
                        id: 'rsvp-popup-yes',
                        type: 'button',
                        tokenStyle: { borderRadius: '$token.borders.radiusMd' },
                        props: { label: '참석', variant: 'outline', name: 'attending', value: 'yes' },
                      },
                      {
                        id: 'rsvp-popup-no',
                        type: 'button',
                        tokenStyle: { borderRadius: '$token.borders.radiusMd' },
                        props: { label: '불참', variant: 'outline', name: 'attending', value: 'no' },
                      },
                    ],
                  },
                  {
                    id: 'rsvp-popup-submit',
                    type: 'button',
                    tokenStyle: {
                      backgroundColor: '$token.colors.brand',
                      color: '$token.colors.text.onBrand',
                      borderRadius: '$token.borders.radiusMd',
                    },
                    props: {
                      label: '전송',
                      variant: 'primary',
                      action: { type: 'custom', handler: 'submitRsvp' },
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
          id: 'rsvp-popup-title-slot',
          path: 'rsvp.title',
          type: 'text',
          required: false,
          description: 'RSVP 팝업 제목',
          defaultValue: '참석 여부를 알려주세요',
        },
      ],
      options: {
        animations: [
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 300 },
        ],
      },
    },
  ],
}

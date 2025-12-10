/**
 * Super Editor - Invitation Section Skeleton
 * RSVP 참석 여부 확인 섹션
 */

import type { SectionSkeleton } from '../types'

export const invitationSkeleton: SectionSkeleton = {
  sectionType: 'invitation',
  name: '참석 여부',
  description: 'RSVP 참석 여부 확인 폼을 표시합니다.',
  defaultVariant: 'envelope',
  variants: [
    // ============================================
    // Envelope Variant (편지봉투 스타일 - 기본)
    // ============================================
    {
      id: 'envelope',
      name: '편지봉투',
      description: '스크롤 시 편지봉투에서 카드가 올라오는 패럴랙스 효과',
      tags: ['elegant', 'interactive', 'romantic'],
      structure: {
        id: 'invitation-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'invitation-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            style: {
              maxWidth: '360px',
              margin: '0 auto',
            },
            children: [
              // 헤더
              {
                id: 'invitation-header',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                style: {
                  alignItems: 'center',
                  textAlign: 'center',
                },
                children: [
                  {
                    id: 'invitation-title',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayMd.fontFamily',
                      fontSize: '$token.typography.displayMd.fontSize',
                      fontWeight: '$token.typography.displayMd.fontWeight',
                      letterSpacing: '$token.typography.displayMd.letterSpacing',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '{{invitation.title}}',
                      as: 'h2',
                    },
                  },
                  {
                    id: 'invitation-description',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodyMd.fontFamily',
                      fontSize: '$token.typography.bodyMd.fontSize',
                      color: '$token.colors.text.secondary',
                      lineHeight: '$token.typography.bodyMd.lineHeight',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '{{invitation.description}}',
                      as: 'p',
                    },
                  },
                ],
              },
              // 편지봉투 컴포넌트
              {
                id: 'envelope-wrapper',
                type: 'envelope',
                tokenStyle: {
                  backgroundColor: '$token.colors.surface',
                },
                props: {
                  envelopeColor: 'var(--color-surface)',
                  cardColor: 'var(--color-background)',
                  flapColor: 'var(--color-surface)',
                  parallaxIntensity: 0.6,
                },
                children: [
                  // RSVP 카드 내용
                  {
                    id: 'rsvp-card-content',
                    type: 'column',
                    tokenStyle: {
                      padding: '$token.spacing.lg',
                      gap: '$token.spacing.md',
                    },
                    style: {
                      height: '100%',
                    },
                    children: [
                      // RSVP 라벨
                      {
                        id: 'rsvp-label',
                        type: 'text',
                        tokenStyle: {
                          fontFamily: '$token.typography.headingMd.fontFamily',
                          fontSize: '$token.typography.headingMd.fontSize',
                          fontWeight: '$token.typography.headingMd.fontWeight',
                          color: '$token.colors.text.primary',
                        },
                        style: {
                          textAlign: 'center',
                          fontStyle: 'italic',
                        },
                        props: {
                          content: 'RSVP',
                          as: 'h3',
                        },
                      },
                      // 입력 폼
                      {
                        id: 'rsvp-form',
                        type: 'column',
                        tokenStyle: {
                          gap: '$token.spacing.md',
                        },
                        children: [
                          // 이름/전화번호 행
                          {
                            id: 'rsvp-inputs-row',
                            type: 'row',
                            tokenStyle: {
                              gap: '$token.spacing.sm',
                            },
                            children: [
                              // 성명 입력
                              {
                                id: 'rsvp-name-group',
                                type: 'column',
                                tokenStyle: {
                                  gap: '$token.spacing.xs',
                                },
                                style: {
                                  flex: 1,
                                },
                                children: [
                                  {
                                    id: 'rsvp-name-input',
                                    type: 'input',
                                    tokenStyle: {
                                      borderRadius: '$token.borders.radiusSm',
                                      borderColor: '$token.colors.border',
                                      backgroundColor: '$token.colors.surface',
                                    },
                                    style: {
                                      padding: '12px',
                                      textAlign: 'center',
                                    },
                                    props: {
                                      type: 'text',
                                      name: 'guestName',
                                      placeholder: '성명',
                                      required: true,
                                      maxLength: 20,
                                    },
                                  },
                                  {
                                    id: 'rsvp-name-label',
                                    type: 'text',
                                    tokenStyle: {
                                      fontFamily: '$token.typography.caption.fontFamily',
                                      fontSize: '$token.typography.caption.fontSize',
                                      color: '$token.colors.text.muted',
                                    },
                                    style: {
                                      textAlign: 'center',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.1em',
                                    },
                                    props: {
                                      content: 'NAME',
                                      as: 'span',
                                    },
                                  },
                                ],
                              },
                              // 전화번호 입력
                              {
                                id: 'rsvp-phone-group',
                                type: 'column',
                                tokenStyle: {
                                  gap: '$token.spacing.xs',
                                },
                                style: {
                                  flex: 1,
                                },
                                children: [
                                  {
                                    id: 'rsvp-phone-input',
                                    type: 'input',
                                    tokenStyle: {
                                      borderRadius: '$token.borders.radiusSm',
                                      borderColor: '$token.colors.border',
                                      backgroundColor: '$token.colors.surface',
                                    },
                                    style: {
                                      padding: '12px',
                                      textAlign: 'center',
                                    },
                                    props: {
                                      type: 'tel',
                                      name: 'guestPhone',
                                      placeholder: '01012345678',
                                      required: true,
                                      maxLength: 13,
                                    },
                                  },
                                  {
                                    id: 'rsvp-phone-label',
                                    type: 'text',
                                    tokenStyle: {
                                      fontFamily: '$token.typography.caption.fontFamily',
                                      fontSize: '$token.typography.caption.fontSize',
                                      color: '$token.colors.text.muted',
                                    },
                                    style: {
                                      textAlign: 'center',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.1em',
                                    },
                                    props: {
                                      content: 'PHONE',
                                      as: 'span',
                                    },
                                  },
                                ],
                              },
                            ],
                          },
                          // 참석 인원 카운터
                          {
                            id: 'rsvp-count-group',
                            type: 'column',
                            tokenStyle: {
                              gap: '$token.spacing.xs',
                            },
                            style: {
                              alignItems: 'center',
                              paddingTop: '8px',
                            },
                            children: [
                              {
                                id: 'rsvp-counter',
                                type: 'row',
                                style: {
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '16px',
                                },
                                children: [
                                  {
                                    id: 'rsvp-minus-btn',
                                    type: 'button',
                                    tokenStyle: {
                                      borderColor: '$token.colors.border',
                                      color: '$token.colors.text.secondary',
                                    },
                                    style: {
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: 'transparent',
                                      border: '1px solid',
                                      cursor: 'pointer',
                                      fontSize: '18px',
                                    },
                                    props: {
                                      label: '−',
                                      variant: 'outline',
                                      size: 'sm',
                                      action: {
                                        type: 'custom',
                                        handler: 'decrementGuestCount',
                                      },
                                    },
                                  },
                                  {
                                    id: 'rsvp-count-display',
                                    type: 'text',
                                    tokenStyle: {
                                      fontFamily: '$token.typography.headingMd.fontFamily',
                                      fontSize: '$token.typography.headingMd.fontSize',
                                      fontWeight: '$token.typography.headingMd.fontWeight',
                                      color: '$token.colors.text.primary',
                                    },
                                    style: {
                                      minWidth: '50px',
                                      textAlign: 'center',
                                    },
                                    props: {
                                      content: '1명',
                                      as: 'span',
                                      dataBinding: 'guestCount',
                                    },
                                  },
                                  {
                                    id: 'rsvp-plus-btn',
                                    type: 'button',
                                    tokenStyle: {
                                      borderColor: '$token.colors.border',
                                      color: '$token.colors.text.secondary',
                                    },
                                    style: {
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: 'transparent',
                                      border: '1px solid',
                                      cursor: 'pointer',
                                      fontSize: '18px',
                                    },
                                    props: {
                                      label: '+',
                                      variant: 'outline',
                                      size: 'sm',
                                      action: {
                                        type: 'custom',
                                        handler: 'incrementGuestCount',
                                      },
                                    },
                                  },
                                ],
                              },
                              {
                                id: 'rsvp-count-label',
                                type: 'text',
                                tokenStyle: {
                                  fontFamily: '$token.typography.caption.fontFamily',
                                  fontSize: '$token.typography.caption.fontSize',
                                  color: '$token.colors.text.muted',
                                },
                                style: {
                                  textAlign: 'center',
                                },
                                props: {
                                  content: '참석 인원',
                                  as: 'span',
                                },
                              },
                            ],
                          },
                          // 제출 버튼
                          {
                            id: 'rsvp-submit',
                            type: 'button',
                            tokenStyle: {
                              backgroundColor: '$token.colors.brand',
                              color: '$token.colors.text.onBrand',
                              borderRadius: '$token.borders.radiusSm',
                            },
                            style: {
                              width: '100%',
                              padding: '14px',
                              marginTop: '4px',
                              fontWeight: '500',
                              border: 'none',
                              cursor: 'pointer',
                            },
                            props: {
                              label: '회신하기',
                              variant: 'primary',
                              size: 'lg',
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
            ],
          },
        ],
      },
      slots: [
        {
          id: 'invitation-title',
          path: 'invitation.title',
          type: 'text',
          required: false,
          description: '초대 타이틀',
          defaultValue: "Let's Party Together",
        },
        {
          id: 'invitation-description',
          path: 'invitation.description',
          type: 'text',
          required: false,
          description: '초대 설명',
          defaultValue: '원활한 식사 제공을 위해 참석 인원 확인이 필요합니다',
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
    // Card Variant (카드 스타일)
    // ============================================
    {
      id: 'card',
      name: '카드',
      description: '깔끔한 카드 형태의 RSVP 폼',
      tags: ['clean', 'modern', 'simple'],
      structure: {
        id: 'invitation-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'invitation-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            style: {
              maxWidth: '340px',
              margin: '0 auto',
            },
            children: [
              // 헤더
              {
                id: 'invitation-header',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                style: {
                  alignItems: 'center',
                  textAlign: 'center',
                },
                children: [
                  {
                    id: 'invitation-title',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayMd.fontFamily',
                      fontSize: '$token.typography.displayMd.fontSize',
                      fontWeight: '$token.typography.displayMd.fontWeight',
                      letterSpacing: '$token.typography.displayMd.letterSpacing',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '{{invitation.title}}',
                      as: 'h2',
                    },
                  },
                  {
                    id: 'invitation-description',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodyMd.fontFamily',
                      fontSize: '$token.typography.bodyMd.fontSize',
                      color: '$token.colors.text.secondary',
                      lineHeight: '$token.typography.bodyMd.lineHeight',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '{{invitation.description}}',
                      as: 'p',
                    },
                  },
                ],
              },
              // RSVP 카드
              {
                id: 'rsvp-card',
                type: 'container',
                tokenStyle: {
                  backgroundColor: '$token.colors.surface',
                  borderRadius: '$token.borders.radiusMd',
                  padding: '$token.spacing.lg',
                },
                style: {
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                },
                children: [
                  // RSVP 라벨
                  {
                    id: 'rsvp-label',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingMd.fontFamily',
                      fontSize: '$token.typography.headingMd.fontSize',
                      fontWeight: '$token.typography.headingMd.fontWeight',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      textAlign: 'center',
                      marginBottom: '20px',
                      fontStyle: 'italic',
                    },
                    props: {
                      content: 'RSVP',
                      as: 'h3',
                    },
                  },
                  // 입력 폼
                  {
                    id: 'rsvp-form',
                    type: 'column',
                    tokenStyle: {
                      gap: '$token.spacing.md',
                    },
                    children: [
                      // 이름/전화번호 행
                      {
                        id: 'rsvp-inputs-row',
                        type: 'row',
                        tokenStyle: {
                          gap: '$token.spacing.sm',
                        },
                        children: [
                          // 성명 입력
                          {
                            id: 'rsvp-name-group',
                            type: 'column',
                            tokenStyle: {
                              gap: '$token.spacing.xs',
                            },
                            style: {
                              flex: 1,
                            },
                            children: [
                              {
                                id: 'rsvp-name-input',
                                type: 'input',
                                tokenStyle: {
                                  borderRadius: '$token.borders.radiusSm',
                                  borderColor: '$token.colors.border',
                                  backgroundColor: '$token.colors.background',
                                },
                                style: {
                                  padding: '12px',
                                  textAlign: 'center',
                                },
                                props: {
                                  type: 'text',
                                  name: 'guestName',
                                  placeholder: '성명',
                                  required: true,
                                  maxLength: 20,
                                },
                              },
                              {
                                id: 'rsvp-name-label',
                                type: 'text',
                                tokenStyle: {
                                  fontFamily: '$token.typography.caption.fontFamily',
                                  fontSize: '$token.typography.caption.fontSize',
                                  color: '$token.colors.text.muted',
                                },
                                style: {
                                  textAlign: 'center',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.1em',
                                },
                                props: {
                                  content: 'NAME',
                                  as: 'span',
                                },
                              },
                            ],
                          },
                          // 전화번호 입력
                          {
                            id: 'rsvp-phone-group',
                            type: 'column',
                            tokenStyle: {
                              gap: '$token.spacing.xs',
                            },
                            style: {
                              flex: 1,
                            },
                            children: [
                              {
                                id: 'rsvp-phone-input',
                                type: 'input',
                                tokenStyle: {
                                  borderRadius: '$token.borders.radiusSm',
                                  borderColor: '$token.colors.border',
                                  backgroundColor: '$token.colors.background',
                                },
                                style: {
                                  padding: '12px',
                                  textAlign: 'center',
                                },
                                props: {
                                  type: 'tel',
                                  name: 'guestPhone',
                                  placeholder: '01012345678',
                                  required: true,
                                  maxLength: 13,
                                },
                              },
                              {
                                id: 'rsvp-phone-label',
                                type: 'text',
                                tokenStyle: {
                                  fontFamily: '$token.typography.caption.fontFamily',
                                  fontSize: '$token.typography.caption.fontSize',
                                  color: '$token.colors.text.muted',
                                },
                                style: {
                                  textAlign: 'center',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.1em',
                                },
                                props: {
                                  content: 'PHONE',
                                  as: 'span',
                                },
                              },
                            ],
                          },
                        ],
                      },
                      // 참석 인원 카운터
                      {
                        id: 'rsvp-count-group',
                        type: 'column',
                        tokenStyle: {
                          gap: '$token.spacing.xs',
                        },
                        style: {
                          alignItems: 'center',
                          paddingTop: '8px',
                        },
                        children: [
                          {
                            id: 'rsvp-counter',
                            type: 'row',
                            style: {
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '16px',
                            },
                            children: [
                              {
                                id: 'rsvp-minus-btn',
                                type: 'button',
                                tokenStyle: {
                                  borderColor: '$token.colors.border',
                                  color: '$token.colors.text.secondary',
                                },
                                style: {
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: 'transparent',
                                  border: '1px solid',
                                  cursor: 'pointer',
                                },
                                props: {
                                  label: '−',
                                  variant: 'outline',
                                  size: 'sm',
                                  action: {
                                    type: 'custom',
                                    handler: 'decrementGuestCount',
                                  },
                                },
                              },
                              {
                                id: 'rsvp-count-display',
                                type: 'text',
                                tokenStyle: {
                                  fontFamily: '$token.typography.headingMd.fontFamily',
                                  fontSize: '$token.typography.headingMd.fontSize',
                                  fontWeight: '$token.typography.headingMd.fontWeight',
                                  color: '$token.colors.text.primary',
                                },
                                style: {
                                  minWidth: '60px',
                                  textAlign: 'center',
                                },
                                props: {
                                  content: '1명',
                                  as: 'span',
                                  dataBinding: 'guestCount',
                                },
                              },
                              {
                                id: 'rsvp-plus-btn',
                                type: 'button',
                                tokenStyle: {
                                  borderColor: '$token.colors.border',
                                  color: '$token.colors.text.secondary',
                                },
                                style: {
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: 'transparent',
                                  border: '1px solid',
                                  cursor: 'pointer',
                                },
                                props: {
                                  label: '+',
                                  variant: 'outline',
                                  size: 'sm',
                                  action: {
                                    type: 'custom',
                                    handler: 'incrementGuestCount',
                                  },
                                },
                              },
                            ],
                          },
                          {
                            id: 'rsvp-count-label',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.caption.fontFamily',
                              fontSize: '$token.typography.caption.fontSize',
                              color: '$token.colors.text.muted',
                            },
                            style: {
                              textAlign: 'center',
                            },
                            props: {
                              content: '참석 인원',
                              as: 'span',
                            },
                          },
                        ],
                      },
                      // 제출 버튼
                      {
                        id: 'rsvp-submit',
                        type: 'button',
                        tokenStyle: {
                          backgroundColor: '$token.colors.brand',
                          color: '$token.colors.text.onBrand',
                          borderRadius: '$token.borders.radiusSm',
                        },
                        style: {
                          width: '100%',
                          padding: '14px',
                          marginTop: '8px',
                          fontWeight: '500',
                          border: 'none',
                          cursor: 'pointer',
                        },
                        props: {
                          label: '회신하기',
                          variant: 'primary',
                          size: 'lg',
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
        ],
      },
      slots: [
        {
          id: 'invitation-title',
          path: 'invitation.title',
          type: 'text',
          required: false,
          description: '초대 타이틀',
          defaultValue: "Let's Party Together",
        },
        {
          id: 'invitation-description',
          path: 'invitation.description',
          type: 'text',
          required: false,
          description: '초대 설명',
          defaultValue: '원활한 식사 제공을 위해 참석 인원 확인이 필요합니다',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
        ],
      },
    },
  ],
}

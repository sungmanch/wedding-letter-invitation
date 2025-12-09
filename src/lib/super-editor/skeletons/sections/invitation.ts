/**
 * Super Editor - Invitation Section Skeleton
 * RSVP 참석 여부 확인 섹션 (편지봉투 스타일)
 */

import type { SectionSkeleton } from '../types'

export const invitationSkeleton: SectionSkeleton = {
  sectionType: 'invitation',
  name: '참석 여부',
  description: '편지봉투 스타일의 RSVP 참석 여부 확인 폼을 표시합니다.',
  defaultVariant: 'envelope',
  variants: [
    // ============================================
    // Envelope Variant (편지봉투 스타일)
    // ============================================
    {
      id: 'envelope',
      name: '편지봉투',
      description: '스크롤 시 편지봉투에서 카드가 올라오는 인터랙티브 효과',
      tags: ['elegant', 'interactive', 'romantic'],
      structure: {
        id: 'invitation-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        style: {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // 타이틀 영역
          {
            id: 'invitation-header',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.md',
            },
            style: {
              alignItems: 'center',
              textAlign: 'center',
              marginBottom: '40px',
            },
            children: [
              {
                id: 'invitation-title',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.displayLg.fontFamily',
                  fontSize: '$token.typography.displayLg.fontSize',
                  fontWeight: '$token.typography.displayLg.fontWeight',
                  letterSpacing: '$token.typography.displayLg.letterSpacing',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: "{{invitation.title}}",
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
                  maxWidth: '280px',
                },
                props: {
                  content: '{{invitation.description}}',
                  as: 'p',
                },
              },
            ],
          },
          // 편지봉투 컨테이너
          {
            id: 'envelope-container',
            type: 'container',
            style: {
              position: 'relative',
              width: '100%',
              maxWidth: '320px',
              aspectRatio: '1 / 0.7',
            },
            props: {
              className: 'envelope-wrapper',
            },
            children: [
              // 봉투 뒷면 (삼각형 덮개)
              {
                id: 'envelope-flap',
                type: 'container',
                tokenStyle: {
                  backgroundColor: '$token.colors.surface',
                },
                style: {
                  position: 'absolute',
                  top: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '160px solid transparent',
                  borderRight: '160px solid transparent',
                  borderTop: '100px solid',
                  zIndex: 3,
                },
                props: {
                  className: 'envelope-flap',
                },
              },
              // 봉투 본체
              {
                id: 'envelope-body',
                type: 'container',
                tokenStyle: {
                  backgroundColor: '$token.colors.surface',
                },
                style: {
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  height: '70%',
                  borderRadius: '0 0 8px 8px',
                  zIndex: 2,
                },
                props: {
                  className: 'envelope-body',
                },
              },
              // RSVP 카드 (스크롤 시 올라옴)
              {
                id: 'rsvp-card',
                type: 'container',
                tokenStyle: {
                  backgroundColor: '$token.colors.background',
                  borderRadius: '$token.borders.radiusMd',
                },
                style: {
                  position: 'absolute',
                  bottom: '10%',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(60%)',
                  width: '90%',
                  padding: '24px 20px',
                  boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
                  zIndex: 1,
                  transition: 'transform 0.6s ease-out',
                },
                props: {
                  className: 'rsvp-card',
                },
                children: [
                  // RSVP 타이틀
                  {
                    id: 'rsvp-title',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingLg.fontFamily',
                      fontSize: '$token.typography.headingLg.fontSize',
                      fontWeight: '$token.typography.headingLg.fontWeight',
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
                                  placeholder: '01099990000',
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
          { id: 'scroll-reveal', name: '스크롤 등장', preset: 'slide-up', trigger: 'inView', duration: 600 },
        ],
      },
    },

    // ============================================
    // Simple Variant (심플 폼)
    // ============================================
    {
      id: 'simple',
      name: '심플',
      description: '카드 없이 깔끔한 폼 형태',
      tags: ['minimal', 'clean', 'modern'],
      structure: {
        id: 'invitation-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
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
              maxWidth: '320px',
              margin: '0 auto',
            },
            children: [
              // 섹션 타이틀
              {
                id: 'invitation-title',
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
                  content: 'RSVP',
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
              // 입력 폼
              {
                id: 'rsvp-form',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.md',
                  backgroundColor: '$token.colors.background',
                  padding: '$token.spacing.lg',
                  borderRadius: '$token.borders.radiusMd',
                },
                children: [
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
                      placeholder: '성명',
                      required: true,
                      maxLength: 20,
                    },
                  },
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
                      placeholder: '연락처',
                      required: true,
                      maxLength: 13,
                    },
                  },
                  {
                    id: 'rsvp-count-input',
                    type: 'input',
                    tokenStyle: {
                      borderRadius: '$token.borders.radiusSm',
                      borderColor: '$token.colors.border',
                    },
                    props: {
                      type: 'number',
                      name: 'guestCount',
                      placeholder: '참석 인원',
                      required: true,
                      min: 1,
                      max: 10,
                      defaultValue: 1,
                    },
                  },
                  {
                    id: 'rsvp-submit',
                    type: 'button',
                    tokenStyle: {
                      backgroundColor: '$token.colors.brand',
                      color: '$token.colors.text.onBrand',
                      borderRadius: '$token.borders.radiusMd',
                    },
                    props: {
                      label: '참석 여부 제출',
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
          id: 'invitation-description',
          path: 'invitation.description',
          type: 'text',
          required: false,
          description: '안내 문구',
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

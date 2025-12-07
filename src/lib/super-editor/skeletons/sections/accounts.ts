/**
 * Super Editor - Accounts Section Skeleton
 * 계좌번호 섹션
 */

import type { SectionSkeleton } from '../types'

export const accountsSkeleton: SectionSkeleton = {
  sectionType: 'accounts',
  name: '축의금 안내',
  description: '축의금 계좌 정보를 표시합니다.',
  defaultVariant: 'tabs',
  variants: [
    // ============================================
    // Tabs Variant
    // ============================================
    {
      id: 'tabs',
      name: '탭',
      description: '신랑/신부측 탭으로 구분',
      tags: ['modern', 'clean', 'interactive'],
      structure: {
        id: 'accounts-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'accounts-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'accounts-title',
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
                  content: '마음 전하실 곳',
                  as: 'h2',
                },
              },
              {
                id: 'accounts-description',
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
                  content: '참석이 어려우신 분들을 위해 계좌번호를 안내드립니다',
                  as: 'p',
                },
              },
              // 신랑측 계좌
              {
                id: 'groom-accounts',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                children: [
                  {
                    id: 'groom-accounts-label',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingSm.fontFamily',
                      fontSize: '$token.typography.headingSm.fontSize',
                      fontWeight: '$token.typography.headingSm.fontWeight',
                      color: '$token.colors.brand',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '신랑측 계좌',
                      as: 'h3',
                    },
                  },
                  {
                    id: 'groom-accounts-list',
                    type: 'repeat',
                    props: {
                      dataPath: 'accounts.groom',
                      as: 'account',
                    },
                    children: [
                      {
                        id: 'groom-account-item',
                        type: 'container',
                        tokenStyle: {
                          padding: '$token.spacing.md',
                          backgroundColor: '$token.colors.background',
                          borderRadius: '$token.borders.radiusMd',
                        },
                        children: [
                          {
                            id: 'groom-account-row',
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
                                id: 'groom-account-info',
                                type: 'column',
                                tokenStyle: {
                                  gap: '$token.spacing.xs',
                                },
                                children: [
                                  {
                                    id: 'groom-account-name',
                                    type: 'text',
                                    tokenStyle: {
                                      fontFamily: '$token.typography.bodySm.fontFamily',
                                      fontSize: '$token.typography.bodySm.fontSize',
                                      color: '$token.colors.text.muted',
                                    },
                                    props: {
                                      content: '{{account.bank}} {{account.holder}}',
                                      as: 'span',
                                    },
                                  },
                                  {
                                    id: 'groom-account-number',
                                    type: 'text',
                                    tokenStyle: {
                                      fontFamily: '$token.typography.bodyMd.fontFamily',
                                      fontSize: '$token.typography.bodyMd.fontSize',
                                      color: '$token.colors.text.primary',
                                    },
                                    props: {
                                      content: '{{account.number}}',
                                      as: 'p',
                                    },
                                  },
                                ],
                              },
                              {
                                id: 'groom-copy-btn',
                                type: 'button',
                                tokenStyle: {
                                  backgroundColor: '$token.colors.brand',
                                  color: '$token.colors.text.onBrand',
                                  borderRadius: '$token.borders.radiusSm',
                                },
                                props: {
                                  label: '복사',
                                  size: 'sm',
                                  variant: 'primary',
                                  action: {
                                    type: 'copy',
                                    value: '{{account.number}}',
                                    toast: '계좌번호가 복사되었습니다',
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
              // 신부측 계좌
              {
                id: 'bride-accounts',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                children: [
                  {
                    id: 'bride-accounts-label',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingSm.fontFamily',
                      fontSize: '$token.typography.headingSm.fontSize',
                      fontWeight: '$token.typography.headingSm.fontWeight',
                      color: '$token.colors.brand',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '신부측 계좌',
                      as: 'h3',
                    },
                  },
                  {
                    id: 'bride-accounts-list',
                    type: 'repeat',
                    props: {
                      dataPath: 'accounts.bride',
                      as: 'account',
                    },
                    children: [
                      {
                        id: 'bride-account-item',
                        type: 'container',
                        tokenStyle: {
                          padding: '$token.spacing.md',
                          backgroundColor: '$token.colors.background',
                          borderRadius: '$token.borders.radiusMd',
                        },
                        children: [
                          {
                            id: 'bride-account-row',
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
                                id: 'bride-account-info',
                                type: 'column',
                                tokenStyle: {
                                  gap: '$token.spacing.xs',
                                },
                                children: [
                                  {
                                    id: 'bride-account-name',
                                    type: 'text',
                                    tokenStyle: {
                                      fontFamily: '$token.typography.bodySm.fontFamily',
                                      fontSize: '$token.typography.bodySm.fontSize',
                                      color: '$token.colors.text.muted',
                                    },
                                    props: {
                                      content: '{{account.bank}} {{account.holder}}',
                                      as: 'span',
                                    },
                                  },
                                  {
                                    id: 'bride-account-number',
                                    type: 'text',
                                    tokenStyle: {
                                      fontFamily: '$token.typography.bodyMd.fontFamily',
                                      fontSize: '$token.typography.bodyMd.fontSize',
                                      color: '$token.colors.text.primary',
                                    },
                                    props: {
                                      content: '{{account.number}}',
                                      as: 'p',
                                    },
                                  },
                                ],
                              },
                              {
                                id: 'bride-copy-btn',
                                type: 'button',
                                tokenStyle: {
                                  backgroundColor: '$token.colors.brand',
                                  color: '$token.colors.text.onBrand',
                                  borderRadius: '$token.borders.radiusSm',
                                },
                                props: {
                                  label: '복사',
                                  size: 'sm',
                                  variant: 'primary',
                                  action: {
                                    type: 'copy',
                                    value: '{{account.number}}',
                                    toast: '계좌번호가 복사되었습니다',
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
        ],
      },
      slots: [
        {
          id: 'groom-accounts',
          path: 'accounts.groom',
          type: 'account',
          required: true,
          description: '신랑측 계좌 목록',
          defaultValue: [
            { label: '신랑', bank: '국민은행', holder: '홍길동', number: '123-456-789012' },
          ],
        },
        {
          id: 'bride-accounts',
          path: 'accounts.bride',
          type: 'account',
          required: true,
          description: '신부측 계좌 목록',
          defaultValue: [
            { label: '신부', bank: '신한은행', holder: '김영희', number: '110-123-456789' },
          ],
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
    // Accordion Variant
    // ============================================
    {
      id: 'accordion',
      name: '아코디언',
      description: '접었다 펼 수 있는 아코디언 형태',
      tags: ['compact', 'minimal', 'interactive'],
      structure: {
        id: 'accounts-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'accounts-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'accounts-title',
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
                  content: '마음 전하실 곳',
                  as: 'h2',
                },
              },
              {
                id: 'accounts-accordion',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                children: [
                  // 신랑측 아코디언
                  {
                    id: 'groom-accordion',
                    type: 'container',
                    tokenStyle: {
                      backgroundColor: '$token.colors.background',
                      borderRadius: '$token.borders.radiusMd',
                      padding: '$token.spacing.md',
                    },
                    children: [
                      {
                        id: 'groom-accordion-header',
                        type: 'row',
                        style: {
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                        },
                        children: [
                          {
                            id: 'groom-accordion-title',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.headingSm.fontFamily',
                              fontSize: '$token.typography.headingSm.fontSize',
                              fontWeight: '$token.typography.headingSm.fontWeight',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '신랑측 계좌',
                              as: 'h3',
                            },
                          },
                        ],
                      },
                      {
                        id: 'groom-accordion-content',
                        type: 'column',
                        tokenStyle: {
                          gap: '$token.spacing.sm',
                          padding: '$token.spacing.md',
                        },
                        children: [
                          {
                            id: 'groom-accounts-repeat',
                            type: 'repeat',
                            props: {
                              dataPath: 'accounts.groom',
                              as: 'account',
                            },
                            children: [
                              {
                                id: 'groom-account-compact',
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
                                    id: 'groom-compact-text',
                                    type: 'text',
                                    tokenStyle: {
                                      fontFamily: '$token.typography.bodySm.fontFamily',
                                      fontSize: '$token.typography.bodySm.fontSize',
                                      color: '$token.colors.text.primary',
                                    },
                                    props: {
                                      content: '{{account.bank}} {{account.number}} ({{account.holder}})',
                                      as: 'p',
                                    },
                                  },
                                  {
                                    id: 'groom-compact-copy',
                                    type: 'button',
                                    tokenStyle: {
                                      color: '$token.colors.brand',
                                    },
                                    props: {
                                      label: '복사',
                                      size: 'sm',
                                      variant: 'ghost',
                                      action: {
                                        type: 'copy',
                                        value: '{{account.number}}',
                                        toast: '복사되었습니다',
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
                  // 신부측 아코디언
                  {
                    id: 'bride-accordion',
                    type: 'container',
                    tokenStyle: {
                      backgroundColor: '$token.colors.background',
                      borderRadius: '$token.borders.radiusMd',
                      padding: '$token.spacing.md',
                    },
                    children: [
                      {
                        id: 'bride-accordion-header',
                        type: 'row',
                        style: {
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                        },
                        children: [
                          {
                            id: 'bride-accordion-title',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.headingSm.fontFamily',
                              fontSize: '$token.typography.headingSm.fontSize',
                              fontWeight: '$token.typography.headingSm.fontWeight',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '신부측 계좌',
                              as: 'h3',
                            },
                          },
                        ],
                      },
                      {
                        id: 'bride-accordion-content',
                        type: 'column',
                        tokenStyle: {
                          gap: '$token.spacing.sm',
                          padding: '$token.spacing.md',
                        },
                        children: [
                          {
                            id: 'bride-accounts-repeat',
                            type: 'repeat',
                            props: {
                              dataPath: 'accounts.bride',
                              as: 'account',
                            },
                            children: [
                              {
                                id: 'bride-account-compact',
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
                                    id: 'bride-compact-text',
                                    type: 'text',
                                    tokenStyle: {
                                      fontFamily: '$token.typography.bodySm.fontFamily',
                                      fontSize: '$token.typography.bodySm.fontSize',
                                      color: '$token.colors.text.primary',
                                    },
                                    props: {
                                      content: '{{account.bank}} {{account.number}} ({{account.holder}})',
                                      as: 'p',
                                    },
                                  },
                                  {
                                    id: 'bride-compact-copy',
                                    type: 'button',
                                    tokenStyle: {
                                      color: '$token.colors.brand',
                                    },
                                    props: {
                                      label: '복사',
                                      size: 'sm',
                                      variant: 'ghost',
                                      action: {
                                        type: 'copy',
                                        value: '{{account.number}}',
                                        toast: '복사되었습니다',
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
            ],
          },
        ],
      },
      slots: [
        {
          id: 'groom-accounts',
          path: 'accounts.groom',
          type: 'account',
          required: true,
          description: '신랑측 계좌 목록',
          defaultValue: [
            { label: '신랑', bank: '국민은행', holder: '홍길동', number: '123-456-789012' },
          ],
        },
        {
          id: 'bride-accounts',
          path: 'accounts.bride',
          type: 'account',
          required: true,
          description: '신부측 계좌 목록',
          defaultValue: [
            { label: '신부', bank: '신한은행', holder: '김영희', number: '110-123-456789' },
          ],
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'slide-up', name: '슬라이드 업', preset: 'slide-up', trigger: 'inView', duration: 400 },
        ],
      },
    },

    // ============================================
    // Modal Popup Variant (샘플 6-7.png 참고)
    // ============================================
    {
      id: 'modal-popup',
      name: '팝업 모달',
      description: '버튼 클릭 시 모달로 계좌 표시',
      tags: ['clean', 'minimal', 'modern'],
      structure: {
        id: 'accounts-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'accounts-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            style: {
              alignItems: 'center',
            },
            children: [
              // 타이틀
              {
                id: 'accounts-title',
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
                  content: '마음 전하실 곳',
                  as: 'h2',
                },
              },
              // 서브타이틀
              {
                id: 'accounts-subtitle',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.bodySm.fontFamily',
                  fontSize: '$token.typography.bodySm.fontSize',
                  color: '$token.colors.text.muted',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: '축복의 의미로 축의금을 전달해보세요.',
                  as: 'p',
                },
              },
              // 버튼 영역
              {
                id: 'accounts-buttons',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.md',
                },
                style: {
                  width: '100%',
                  maxWidth: '320px',
                },
                children: [
                  // 신랑측 계좌번호 버튼
                  {
                    id: 'groom-accounts-btn',
                    type: 'button',
                    tokenStyle: {
                      borderColor: '$token.colors.border',
                      borderRadius: '$token.borders.radiusFull',
                      backgroundColor: '$token.colors.background',
                    },
                    style: {
                      width: '100%',
                    },
                    props: {
                      label: '신랑 측 계좌번호',
                      variant: 'outline',
                      size: 'lg',
                      action: {
                        type: 'modal',
                        target: 'groom-modal',
                      },
                    },
                  },
                  // 신부측 계좌번호 버튼
                  {
                    id: 'bride-accounts-btn',
                    type: 'button',
                    tokenStyle: {
                      borderColor: '$token.colors.border',
                      borderRadius: '$token.borders.radiusFull',
                      backgroundColor: '$token.colors.background',
                    },
                    style: {
                      width: '100%',
                    },
                    props: {
                      label: '신부 측 계좌번호',
                      variant: 'outline',
                      size: 'lg',
                      action: {
                        type: 'modal',
                        target: 'bride-modal',
                      },
                    },
                  },
                ],
              },
            ],
          },
          // 신랑측 모달
          {
            id: 'groom-modal',
            type: 'overlay',
            props: {
              visible: false,
              title: '신랑 계좌',
              showClose: true,
            },
            children: [
              {
                id: 'groom-modal-content',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.lg',
                  padding: '$token.spacing.lg',
                },
                children: [
                  {
                    id: 'groom-accounts-repeat',
                    type: 'repeat',
                    props: {
                      dataPath: 'accounts.groom',
                      as: 'account',
                    },
                    children: [
                      {
                        id: 'groom-account-card',
                        type: 'column',
                        tokenStyle: {
                          gap: '$token.spacing.xs',
                          padding: '$token.spacing.md',
                          borderRadius: '$token.borders.radiusMd',
                        },
                        style: {
                          borderBottom: '1px solid #eee',
                          paddingBottom: '16px',
                        },
                        children: [
                          // 계좌 라벨 (relation에서 렌더링 시 변환: self→신랑/신부 계좌, father→부 계좌, mother→모 계좌)
                          {
                            id: 'account-relation',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.headingSm.fontFamily',
                              fontSize: '$token.typography.headingSm.fontSize',
                              fontWeight: '$token.typography.headingSm.fontWeight',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '{{account.relation}}',
                              as: 'h4',
                            },
                          },
                          // 은행/예금주
                          {
                            id: 'account-bank-holder',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodySm.fontFamily',
                              fontSize: '$token.typography.bodySm.fontSize',
                              color: '$token.colors.text.muted',
                            },
                            props: {
                              content: '{{account.bank}} (예금주:{{account.holder}})',
                              as: 'span',
                            },
                          },
                          // 계좌번호
                          {
                            id: 'account-number',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodyLg.fontFamily',
                              fontSize: '$token.typography.bodyLg.fontSize',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '{{account.number}}',
                              as: 'p',
                            },
                          },
                          // 복사 버튼
                          {
                            id: 'account-copy-btn',
                            type: 'button',
                            tokenStyle: {
                              backgroundColor: '$token.colors.brand',
                              color: '$token.colors.text.onBrand',
                              borderRadius: '$token.borders.radiusFull',
                            },
                            style: {
                              marginTop: '8px',
                            },
                            props: {
                              label: '계좌번호 복사',
                              size: 'sm',
                              variant: 'primary',
                              action: {
                                type: 'copy',
                                value: '{{account.number}}',
                                toast: '계좌번호가 복사되었습니다',
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
          // 신부측 모달
          {
            id: 'bride-modal',
            type: 'overlay',
            props: {
              visible: false,
              title: '신부 계좌',
              showClose: true,
            },
            children: [
              {
                id: 'bride-modal-content',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.lg',
                  padding: '$token.spacing.lg',
                },
                children: [
                  {
                    id: 'bride-accounts-repeat',
                    type: 'repeat',
                    props: {
                      dataPath: 'accounts.bride',
                      as: 'account',
                    },
                    children: [
                      {
                        id: 'bride-account-card',
                        type: 'column',
                        tokenStyle: {
                          gap: '$token.spacing.xs',
                          padding: '$token.spacing.md',
                          borderRadius: '$token.borders.radiusMd',
                        },
                        style: {
                          borderBottom: '1px solid #eee',
                          paddingBottom: '16px',
                        },
                        children: [
                          // 계좌 라벨 (relation에서 렌더링 시 변환)
                          {
                            id: 'account-relation',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.headingSm.fontFamily',
                              fontSize: '$token.typography.headingSm.fontSize',
                              fontWeight: '$token.typography.headingSm.fontWeight',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '{{account.relation}}',
                              as: 'h4',
                            },
                          },
                          // 은행/예금주
                          {
                            id: 'account-bank-holder',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodySm.fontFamily',
                              fontSize: '$token.typography.bodySm.fontSize',
                              color: '$token.colors.text.muted',
                            },
                            props: {
                              content: '{{account.bank}} (예금주:{{account.holder}})',
                              as: 'span',
                            },
                          },
                          // 계좌번호
                          {
                            id: 'account-number',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodyLg.fontFamily',
                              fontSize: '$token.typography.bodyLg.fontSize',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '{{account.number}}',
                              as: 'p',
                            },
                          },
                          // 복사 버튼
                          {
                            id: 'account-copy-btn',
                            type: 'button',
                            tokenStyle: {
                              backgroundColor: '$token.colors.brand',
                              color: '$token.colors.text.onBrand',
                              borderRadius: '$token.borders.radiusFull',
                            },
                            style: {
                              marginTop: '8px',
                            },
                            props: {
                              label: '계좌번호 복사',
                              size: 'sm',
                              variant: 'primary',
                              action: {
                                type: 'copy',
                                value: '{{account.number}}',
                                toast: '계좌번호가 복사되었습니다',
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
          id: 'groom-accounts',
          path: 'accounts.groom',
          type: 'account',
          required: true,
          description: '신랑측 계좌 목록 (label, bank, holder, number)',
          defaultValue: [
            { label: '신랑', bank: '국민은행', holder: '홍길동', number: '123-456-789012' },
          ],
        },
        {
          id: 'bride-accounts',
          path: 'accounts.bride',
          type: 'account',
          required: true,
          description: '신부측 계좌 목록 (label, bank, holder, number)',
          defaultValue: [
            { label: '신부', bank: '신한은행', holder: '김영희', number: '110-123-456789' },
          ],
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

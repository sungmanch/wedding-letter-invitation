/**
 * Accounts Section - 기본 템플릿
 * 축의금 계좌 정보 (최대 6개: 신랑, 신부, 신랑 부/모, 신부 부/모)
 */

import type { Screen } from '../../schema/layout'

export const accountsTemplate: Screen = {
  id: 'accounts',
  name: '마음 전하실 곳',
  type: 'content',
  sectionType: 'accounts',
  root: {
    id: 'accounts-root',
    type: 'container',
    style: {
      padding: 24,
      backgroundColor: '#fff',
    },
    children: [
      {
        id: 'accounts-title',
        type: 'text',
        props: {
          content: '마음 전하실 곳',
          as: 'h2',
        },
        style: {
          fontSize: 24,
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 8,
          color: '#333',
        },
      },
      {
        id: 'accounts-subtitle',
        type: 'text',
        props: {
          content: '축하의 마음을 전해주세요',
          as: 'p',
        },
        style: {
          fontSize: 14,
          color: '#888',
          textAlign: 'center',
          marginBottom: 24,
        },
      },
      {
        id: 'accounts-row',
        type: 'row',
        style: {
          gap: 16,
        },
        children: [
          // 신랑측
          {
            id: 'accounts-groom-side',
            type: 'column',
            style: {
              flex: 1,
              gap: 12,
            },
            children: [
              {
                id: 'groom-side-title',
                type: 'text',
                props: {
                  content: '신랑측',
                  as: 'h3',
                },
                style: {
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: 'center',
                  marginBottom: 8,
                  color: '#333',
                },
              },
              // 신랑 본인
              {
                id: 'groom-account',
                type: 'conditional',
                props: {
                  condition: '{{accounts.groom.enabled}}',
                },
                children: [
                  {
                    id: 'groom-account-card',
                    type: 'container',
                    style: {
                      padding: 16,
                      backgroundColor: '#f8f8f8',
                      borderRadius: 8,
                    },
                    children: [
                      {
                        id: 'groom-account-name',
                        type: 'text',
                        props: {
                          content: '{{accounts.groom.name}}',
                          as: 'p',
                        },
                        style: {
                          fontSize: 14,
                          fontWeight: 600,
                          marginBottom: 8,
                        },
                      },
                      {
                        id: 'groom-accounts-repeat',
                        type: 'repeat',
                        props: {
                          items: '{{accounts.groom.accounts}}',
                          as: 'account',
                        },
                        children: [
                          {
                            id: 'groom-account-item',
                            type: 'row',
                            style: {
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 4,
                            },
                            children: [
                              {
                                id: 'groom-bank-number',
                                type: 'text',
                                props: {
                                  content: '{{account.bank}} {{account.number}}',
                                  as: 'span',
                                },
                                style: {
                                  fontSize: 13,
                                  color: '#666',
                                },
                              },
                              {
                                id: 'groom-copy-btn',
                                type: 'button',
                                props: {
                                  label: '복사',
                                  variant: 'ghost',
                                  size: 'sm',
                                  action: {
                                    type: 'copy',
                                    value: '{{account.number}}',
                                  },
                                },
                                style: {
                                  fontSize: 12,
                                  padding: '4px 8px',
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
              // 신랑 아버지
              {
                id: 'groom-father-account',
                type: 'conditional',
                props: {
                  condition: '{{accounts.groomFather.enabled}}',
                },
                children: [
                  {
                    id: 'groom-father-card',
                    type: 'container',
                    style: {
                      padding: 16,
                      backgroundColor: '#f8f8f8',
                      borderRadius: 8,
                    },
                    children: [
                      {
                        id: 'groom-father-name',
                        type: 'text',
                        props: {
                          content: '{{accounts.groomFather.name}}',
                          as: 'p',
                        },
                        style: {
                          fontSize: 14,
                          fontWeight: 600,
                          marginBottom: 8,
                        },
                      },
                      {
                        id: 'groom-father-accounts-repeat',
                        type: 'repeat',
                        props: {
                          items: '{{accounts.groomFather.accounts}}',
                          as: 'account',
                        },
                        children: [
                          {
                            id: 'groom-father-account-item',
                            type: 'row',
                            style: {
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 4,
                            },
                            children: [
                              {
                                id: 'groom-father-bank-number',
                                type: 'text',
                                props: {
                                  content: '{{account.bank}} {{account.number}}',
                                  as: 'span',
                                },
                                style: {
                                  fontSize: 13,
                                  color: '#666',
                                },
                              },
                              {
                                id: 'groom-father-copy-btn',
                                type: 'button',
                                props: {
                                  label: '복사',
                                  variant: 'ghost',
                                  size: 'sm',
                                  action: {
                                    type: 'copy',
                                    value: '{{account.number}}',
                                  },
                                },
                                style: {
                                  fontSize: 12,
                                  padding: '4px 8px',
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
              // 신랑 어머니
              {
                id: 'groom-mother-account',
                type: 'conditional',
                props: {
                  condition: '{{accounts.groomMother.enabled}}',
                },
                children: [
                  {
                    id: 'groom-mother-card',
                    type: 'container',
                    style: {
                      padding: 16,
                      backgroundColor: '#f8f8f8',
                      borderRadius: 8,
                    },
                    children: [
                      {
                        id: 'groom-mother-name',
                        type: 'text',
                        props: {
                          content: '{{accounts.groomMother.name}}',
                          as: 'p',
                        },
                        style: {
                          fontSize: 14,
                          fontWeight: 600,
                          marginBottom: 8,
                        },
                      },
                      {
                        id: 'groom-mother-accounts-repeat',
                        type: 'repeat',
                        props: {
                          items: '{{accounts.groomMother.accounts}}',
                          as: 'account',
                        },
                        children: [
                          {
                            id: 'groom-mother-account-item',
                            type: 'row',
                            style: {
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 4,
                            },
                            children: [
                              {
                                id: 'groom-mother-bank-number',
                                type: 'text',
                                props: {
                                  content: '{{account.bank}} {{account.number}}',
                                  as: 'span',
                                },
                                style: {
                                  fontSize: 13,
                                  color: '#666',
                                },
                              },
                              {
                                id: 'groom-mother-copy-btn',
                                type: 'button',
                                props: {
                                  label: '복사',
                                  variant: 'ghost',
                                  size: 'sm',
                                  action: {
                                    type: 'copy',
                                    value: '{{account.number}}',
                                  },
                                },
                                style: {
                                  fontSize: 12,
                                  padding: '4px 8px',
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
          // 신부측
          {
            id: 'accounts-bride-side',
            type: 'column',
            style: {
              flex: 1,
              gap: 12,
            },
            children: [
              {
                id: 'bride-side-title',
                type: 'text',
                props: {
                  content: '신부측',
                  as: 'h3',
                },
                style: {
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: 'center',
                  marginBottom: 8,
                  color: '#333',
                },
              },
              // 신부 본인
              {
                id: 'bride-account',
                type: 'conditional',
                props: {
                  condition: '{{accounts.bride.enabled}}',
                },
                children: [
                  {
                    id: 'bride-account-card',
                    type: 'container',
                    style: {
                      padding: 16,
                      backgroundColor: '#f8f8f8',
                      borderRadius: 8,
                    },
                    children: [
                      {
                        id: 'bride-account-name',
                        type: 'text',
                        props: {
                          content: '{{accounts.bride.name}}',
                          as: 'p',
                        },
                        style: {
                          fontSize: 14,
                          fontWeight: 600,
                          marginBottom: 8,
                        },
                      },
                      {
                        id: 'bride-accounts-repeat',
                        type: 'repeat',
                        props: {
                          items: '{{accounts.bride.accounts}}',
                          as: 'account',
                        },
                        children: [
                          {
                            id: 'bride-account-item',
                            type: 'row',
                            style: {
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 4,
                            },
                            children: [
                              {
                                id: 'bride-bank-number',
                                type: 'text',
                                props: {
                                  content: '{{account.bank}} {{account.number}}',
                                  as: 'span',
                                },
                                style: {
                                  fontSize: 13,
                                  color: '#666',
                                },
                              },
                              {
                                id: 'bride-copy-btn',
                                type: 'button',
                                props: {
                                  label: '복사',
                                  variant: 'ghost',
                                  size: 'sm',
                                  action: {
                                    type: 'copy',
                                    value: '{{account.number}}',
                                  },
                                },
                                style: {
                                  fontSize: 12,
                                  padding: '4px 8px',
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
              // 신부 아버지
              {
                id: 'bride-father-account',
                type: 'conditional',
                props: {
                  condition: '{{accounts.brideFather.enabled}}',
                },
                children: [
                  {
                    id: 'bride-father-card',
                    type: 'container',
                    style: {
                      padding: 16,
                      backgroundColor: '#f8f8f8',
                      borderRadius: 8,
                    },
                    children: [
                      {
                        id: 'bride-father-name',
                        type: 'text',
                        props: {
                          content: '{{accounts.brideFather.name}}',
                          as: 'p',
                        },
                        style: {
                          fontSize: 14,
                          fontWeight: 600,
                          marginBottom: 8,
                        },
                      },
                      {
                        id: 'bride-father-accounts-repeat',
                        type: 'repeat',
                        props: {
                          items: '{{accounts.brideFather.accounts}}',
                          as: 'account',
                        },
                        children: [
                          {
                            id: 'bride-father-account-item',
                            type: 'row',
                            style: {
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 4,
                            },
                            children: [
                              {
                                id: 'bride-father-bank-number',
                                type: 'text',
                                props: {
                                  content: '{{account.bank}} {{account.number}}',
                                  as: 'span',
                                },
                                style: {
                                  fontSize: 13,
                                  color: '#666',
                                },
                              },
                              {
                                id: 'bride-father-copy-btn',
                                type: 'button',
                                props: {
                                  label: '복사',
                                  variant: 'ghost',
                                  size: 'sm',
                                  action: {
                                    type: 'copy',
                                    value: '{{account.number}}',
                                  },
                                },
                                style: {
                                  fontSize: 12,
                                  padding: '4px 8px',
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
              // 신부 어머니
              {
                id: 'bride-mother-account',
                type: 'conditional',
                props: {
                  condition: '{{accounts.brideMother.enabled}}',
                },
                children: [
                  {
                    id: 'bride-mother-card',
                    type: 'container',
                    style: {
                      padding: 16,
                      backgroundColor: '#f8f8f8',
                      borderRadius: 8,
                    },
                    children: [
                      {
                        id: 'bride-mother-name',
                        type: 'text',
                        props: {
                          content: '{{accounts.brideMother.name}}',
                          as: 'p',
                        },
                        style: {
                          fontSize: 14,
                          fontWeight: 600,
                          marginBottom: 8,
                        },
                      },
                      {
                        id: 'bride-mother-accounts-repeat',
                        type: 'repeat',
                        props: {
                          items: '{{accounts.brideMother.accounts}}',
                          as: 'account',
                        },
                        children: [
                          {
                            id: 'bride-mother-account-item',
                            type: 'row',
                            style: {
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 4,
                            },
                            children: [
                              {
                                id: 'bride-mother-bank-number',
                                type: 'text',
                                props: {
                                  content: '{{account.bank}} {{account.number}}',
                                  as: 'span',
                                },
                                style: {
                                  fontSize: 13,
                                  color: '#666',
                                },
                              },
                              {
                                id: 'bride-mother-copy-btn',
                                type: 'button',
                                props: {
                                  label: '복사',
                                  variant: 'ghost',
                                  size: 'sm',
                                  action: {
                                    type: 'copy',
                                    value: '{{account.number}}',
                                  },
                                },
                                style: {
                                  fontSize: 12,
                                  padding: '4px 8px',
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
}

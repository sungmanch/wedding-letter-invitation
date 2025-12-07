/**
 * Contact Section Template
 * 연락처 섹션 기본 템플릿
 */

import type { Screen } from '../../schema/layout'

export const contactTemplate: Screen = {
  id: 'contact-section',
  name: '연락처',
  type: 'content',
  sectionType: 'contact',
  root: {
    id: 'contact-root',
    type: 'container',
    style: {
      backgroundColor: 'var(--color-background)',
      padding: '32px 24px',
    },
    children: [
      {
        id: 'contact-row',
        type: 'row',
        style: {
          justifyContent: 'space-around',
          alignItems: 'flex-start',
        },
        children: [
          // 신랑 연락처
          {
            id: 'groom-contact',
            type: 'column',
            style: {
              gap: '8px',
              alignItems: 'center',
            },
            children: [
              {
                id: 'groom-label',
                type: 'text',
                style: {
                  fontFamily: 'var(--typo-heading-sm-font-family)',
                  fontSize: 'var(--typo-heading-sm-font-size)',
                  fontWeight: 'var(--typo-heading-sm-font-weight)',
                  color: 'var(--color-brand)',
                },
                props: {
                  content: '신랑',
                  as: 'span',
                },
              },
              {
                id: 'groom-buttons',
                type: 'row',
                style: {
                  gap: '16px',
                },
                children: [
                  {
                    id: 'groom-call-btn',
                    type: 'button',
                    style: {
                      color: 'var(--color-text-secondary)',
                    },
                    props: {
                      icon: 'phone',
                      size: 'md',
                      variant: 'ghost',
                      ariaLabel: '신랑에게 전화',
                      action: {
                        type: 'tel',
                        value: '{{couple.groom.phone}}',
                      },
                    },
                  },
                  {
                    id: 'groom-sms-btn',
                    type: 'button',
                    style: {
                      color: 'var(--color-text-secondary)',
                    },
                    props: {
                      icon: 'message',
                      size: 'md',
                      variant: 'ghost',
                      ariaLabel: '신랑에게 문자',
                      action: {
                        type: 'sms',
                        value: '{{couple.groom.phone}}',
                      },
                    },
                  },
                ],
              },
            ],
          },
          // 신부 연락처
          {
            id: 'bride-contact',
            type: 'column',
            style: {
              gap: '8px',
              alignItems: 'center',
            },
            children: [
              {
                id: 'bride-label',
                type: 'text',
                style: {
                  fontFamily: 'var(--typo-heading-sm-font-family)',
                  fontSize: 'var(--typo-heading-sm-font-size)',
                  fontWeight: 'var(--typo-heading-sm-font-weight)',
                  color: 'var(--color-brand)',
                },
                props: {
                  content: '신부',
                  as: 'span',
                },
              },
              {
                id: 'bride-buttons',
                type: 'row',
                style: {
                  gap: '16px',
                },
                children: [
                  {
                    id: 'bride-call-btn',
                    type: 'button',
                    style: {
                      color: 'var(--color-text-secondary)',
                    },
                    props: {
                      icon: 'phone',
                      size: 'md',
                      variant: 'ghost',
                      ariaLabel: '신부에게 전화',
                      action: {
                        type: 'tel',
                        value: '{{couple.bride.phone}}',
                      },
                    },
                  },
                  {
                    id: 'bride-sms-btn',
                    type: 'button',
                    style: {
                      color: 'var(--color-text-secondary)',
                    },
                    props: {
                      icon: 'message',
                      size: 'md',
                      variant: 'ghost',
                      ariaLabel: '신부에게 문자',
                      action: {
                        type: 'sms',
                        value: '{{couple.bride.phone}}',
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
}

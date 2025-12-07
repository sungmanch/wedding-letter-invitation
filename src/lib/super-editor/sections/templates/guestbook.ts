/**
 * Guestbook Section - 기본 템플릿
 * 축하 메시지 / 방명록
 */

import type { Screen } from '../../schema/layout'

export const guestbookTemplate: Screen = {
  id: 'guestbook',
  name: '축하 메시지',
  type: 'form',
  sectionType: 'guestbook',
  root: {
    id: 'guestbook-root',
    type: 'container',
    style: {
      padding: 24,
      backgroundColor: '#faf5f0',
    },
    children: [
      {
        id: 'guestbook-title',
        type: 'text',
        props: {
          content: '축하 메시지',
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
        id: 'guestbook-subtitle',
        type: 'text',
        props: {
          content: '신랑 신부에게 축하의 말씀을 전해주세요',
          as: 'p',
        },
        style: {
          fontSize: 14,
          color: '#888',
          textAlign: 'center',
          marginBottom: 24,
        },
      },
      // 메시지 목록
      {
        id: 'guestbook-messages',
        type: 'conditional',
        props: {
          condition: '{{guestbook.messages.length}}',
        },
        children: [
          {
            id: 'messages-list',
            type: 'column',
            style: {
              gap: 12,
              marginBottom: 24,
            },
            children: [
              {
                id: 'messages-repeat',
                type: 'repeat',
                props: {
                  items: '{{guestbook.messages}}',
                  as: 'message',
                },
                children: [
                  {
                    id: 'message-card',
                    type: 'container',
                    style: {
                      padding: 16,
                      backgroundColor: '#fff',
                      borderRadius: 12,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    },
                    children: [
                      {
                        id: 'message-header',
                        type: 'row',
                        style: {
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 8,
                        },
                        children: [
                          {
                            id: 'message-author',
                            type: 'text',
                            props: {
                              content: '{{message.name}}',
                              as: 'span',
                            },
                            style: {
                              fontSize: 14,
                              fontWeight: 600,
                              color: '#333',
                            },
                          },
                          {
                            id: 'message-date',
                            type: 'text',
                            props: {
                              content: '{{message.createdAt | date}}',
                              as: 'span',
                            },
                            style: {
                              fontSize: 12,
                              color: '#999',
                            },
                          },
                        ],
                      },
                      {
                        id: 'message-content',
                        type: 'text',
                        props: {
                          content: '{{message.content}}',
                          as: 'p',
                        },
                        style: {
                          fontSize: 14,
                          color: '#555',
                          lineHeight: 1.6,
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
      // CTA 버튼
      {
        id: 'guestbook-cta',
        type: 'button',
        props: {
          label: '{{guestbook.ctaText}}',
          variant: 'primary',
          action: {
            type: 'openModal',
            modal: 'guestbook-form',
          },
        },
        style: {
          width: '100%',
          padding: '14px 24px',
          fontSize: 16,
          fontWeight: 600,
          borderRadius: 12,
          backgroundColor: '#e11d48',
          color: '#fff',
        },
      },
    ],
  },
}

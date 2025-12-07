/**
 * Greeting Section Template
 * 인사말 섹션 기본 템플릿
 */

import type { Screen } from '../../schema/layout'

export const greetingTemplate: Screen = {
  id: 'greeting-section',
  name: '인사말',
  type: 'content',
  sectionType: 'greeting',
  root: {
    id: 'greeting-root',
    type: 'container',
    style: {
      backgroundColor: 'var(--color-background)',
      padding: '64px 24px',
    },
    children: [
      {
        id: 'greeting-content',
        type: 'column',
        style: {
          gap: '24px',
          alignItems: 'center',
        },
        children: [
          {
            id: 'greeting-title',
            type: 'text',
            style: {
              fontFamily: 'var(--typo-display-md-font-family)',
              fontSize: 'var(--typo-display-md-font-size)',
              fontWeight: 'var(--typo-display-md-font-weight)',
              color: 'var(--color-text-primary)',
              textAlign: 'center',
            },
            props: {
              content: '{{greeting.title}}',
              as: 'h2',
            },
          },
          {
            id: 'greeting-divider',
            type: 'divider',
            style: {
              backgroundColor: 'var(--color-brand)',
              width: '40px',
            },
            props: {
              thickness: 2,
            },
          },
          {
            id: 'greeting-message',
            type: 'text',
            style: {
              fontFamily: 'var(--typo-body-md-font-family)',
              fontSize: 'var(--typo-body-md-font-size)',
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
              whiteSpace: 'pre-line',
              lineHeight: '1.8',
              maxWidth: '320px',
            },
            props: {
              content: '{{greeting.content}}',
              as: 'p',
            },
          },
        ],
      },
    ],
  },
}

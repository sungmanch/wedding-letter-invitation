/**
 * Date Section - 기본 템플릿
 * 예식 날짜, 시간, D-day 카운터
 */

import type { Screen } from '../../schema/layout'

export const dateTemplate: Screen = {
  id: 'date',
  name: '예식 일시',
  type: 'content',
  sectionType: 'date',
  root: {
    id: 'date-root',
    type: 'container',
    style: {
      padding: 24,
      backgroundColor: '#faf5f0',
      textAlign: 'center',
    },
    children: [
      {
        id: 'date-title',
        type: 'text',
        props: {
          content: '예식 일시',
          as: 'h2',
        },
        style: {
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 24,
          color: '#333',
        },
      },
      {
        id: 'date-display',
        type: 'column',
        style: {
          alignItems: 'center',
          gap: 8,
          marginBottom: 24,
        },
        children: [
          {
            id: 'date-date',
            type: 'text',
            props: {
              content: '{{wedding.dateDisplay}}',
              as: 'p',
            },
            style: {
              fontSize: 20,
              fontWeight: 600,
              color: '#333',
            },
          },
          {
            id: 'date-time',
            type: 'text',
            props: {
              content: '{{wedding.timeDisplay}}',
              as: 'p',
            },
            style: {
              fontSize: 16,
              color: '#666',
            },
          },
        ],
      },
      {
        id: 'date-dday',
        type: 'container',
        style: {
          padding: 20,
          backgroundColor: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
        children: [
          {
            id: 'dday-label',
            type: 'text',
            props: {
              content: '결혼식까지',
              as: 'p',
            },
            style: {
              fontSize: 14,
              color: '#888',
              marginBottom: 8,
            },
          },
          {
            id: 'dday-count',
            type: 'text',
            props: {
              content: '{{wedding.dday}}',
              as: 'p',
            },
            style: {
              fontSize: 32,
              fontWeight: 700,
              color: '#e11d48',
            },
          },
        ],
      },
    ],
  },
}

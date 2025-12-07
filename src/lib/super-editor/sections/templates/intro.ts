/**
 * Intro Section - 기본 템플릿
 * AI가 동적으로 레이아웃을 생성하므로 이것은 폴백 템플릿
 */

import type { Screen } from '../../schema/layout'

export const introTemplate: Screen = {
  id: 'intro',
  name: '인트로',
  type: 'intro',
  sectionType: 'intro',
  root: {
    id: 'intro-root',
    type: 'fullscreen',
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#faf5f0',
    },
    children: [
      {
        id: 'intro-bg',
        type: 'image',
        props: {
          src: '{{photos.main}}',
          objectFit: 'cover',
        },
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        },
      },
      {
        id: 'intro-overlay',
        type: 'container',
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 1,
        },
      },
      {
        id: 'intro-content',
        type: 'column',
        style: {
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: '#fff',
          padding: 24,
        },
        children: [
          {
            id: 'intro-names',
            type: 'text',
            props: {
              content: '{{couple.groom.name}} & {{couple.bride.name}}',
              as: 'h1',
            },
            style: {
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 16,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            },
          },
          {
            id: 'intro-date',
            type: 'text',
            props: {
              content: '{{wedding.dateDisplay}}',
              as: 'p',
            },
            style: {
              fontSize: 18,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            },
          },
        ],
      },
    ],
  },
}

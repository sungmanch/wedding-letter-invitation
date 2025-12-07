/**
 * Glassmorphism Intro Builder
 * 글래스모피즘 스타일
 * 반투명 유리 효과, 오로라 배경, 플로팅 요소
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate } from './types'

export const buildGlassmorphismIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
  const { preset, data } = ctx
  const { groomName, brideName, weddingDate } = data
  const { formatted: dateFormatted } = formatDate(weddingDate)
  const colors = preset.defaultColors
  const fonts = preset.defaultFonts

  const root: PrimitiveNode = {
    id: uid('glass-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: colors.background,
      position: 'relative',
      overflow: 'hidden',
    },
    children: [
      // Aurora Background
      {
        id: uid('aurora'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(168,85,247,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(236,72,153,0.3) 0%, transparent 60%)
          `,
        },
      },

      // Glass Card Container
      {
        id: uid('glass-card-wrapper'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        children: [
          {
            id: uid('glass-card'),
            type: 'container',
            style: {
              width: '80%',
              padding: '24px 16px',
              borderRadius: '24px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            },
            children: [
              // Wedding label
              {
                id: uid('label'),
                type: 'text',
                style: {
                  fontSize: '8px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                  color: colors.textMuted,
                },
                props: {
                  content: 'Wedding',
                },
              },
              // Groom Name
              {
                id: uid('groom-name'),
                type: 'text',
                style: {
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: colors.text,
                  fontFamily: fonts.title.family,
                },
                props: {
                  content: groomName,
                  as: 'h1',
                },
              },
              // Heart
              {
                id: uid('heart'),
                type: 'text',
                style: {
                  fontSize: '1rem',
                  margin: '8px 0',
                  color: colors.accent,
                },
                props: {
                  content: '♥',
                },
              },
              // Bride Name
              {
                id: uid('bride-name'),
                type: 'text',
                style: {
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: colors.text,
                  fontFamily: fonts.title.family,
                },
                props: {
                  content: brideName,
                  as: 'h1',
                },
              },
              // Date
              {
                id: uid('date'),
                type: 'text',
                style: {
                  fontSize: '0.75rem',
                  marginTop: '16px',
                  color: colors.textMuted,
                },
                props: {
                  content: dateFormatted,
                },
              },
            ],
          },
        ],
      },

      // Floating objects
      {
        id: uid('float-1'),
        type: 'text',
        style: {
          position: 'absolute',
          top: '16px',
          left: '16px',
          fontSize: '24px',
        },
        props: {
          content: '💕',
          className: 'glass-float',
        },
      },
      {
        id: uid('float-2'),
        type: 'text',
        style: {
          position: 'absolute',
          bottom: '48px',
          right: '16px',
          fontSize: '24px',
        },
        props: {
          content: '💍',
          className: 'glass-float-delayed',
        },
      },
    ],
  }

  return {
    root,
    additionalStyles: GLASSMORPHISM_STYLES,
  }
}

const GLASSMORPHISM_STYLES = `
@keyframes glassFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.glass-float {
  animation: glassFloat 3s ease-in-out infinite;
}

.glass-float-delayed {
  animation: glassFloat 3s ease-in-out infinite;
  animation-delay: 1.5s;
}
`

/**
 * Typography Intro Builder
 * 키네틱 타이포그래피 스타일
 * 대담한 텍스트, 미니멀 디자인, 타이포 중심
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate } from './types'

export const buildTypographyIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
  const { preset, data } = ctx
  const { groomName, brideName, weddingDate } = data
  const { formatted: dateFormatted } = formatDate(weddingDate)
  const colors = preset.defaultColors
  const fonts = preset.defaultFonts

  const root: PrimitiveNode = {
    id: uid('typo-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: colors.background,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    children: [
      // Content
      {
        id: uid('content'),
        type: 'column',
        style: {
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 16px',
        },
        children: [
          // WE text
          {
            id: uid('we'),
            type: 'text',
            style: {
              fontSize: '3rem',
              fontWeight: 700,
              letterSpacing: '-0.05em',
              lineHeight: 0.9,
              color: colors.text,
              fontFamily: fonts.title.family,
            },
            props: {
              content: 'WE',
              as: 'h1',
            },
          },
          // ARE text
          {
            id: uid('are'),
            type: 'text',
            style: {
              fontSize: '3rem',
              fontWeight: 700,
              letterSpacing: '-0.05em',
              lineHeight: 0.9,
              marginTop: '-4px',
              color: colors.text,
              fontFamily: fonts.title.family,
            },
            props: {
              content: 'ARE',
              as: 'h1',
            },
          },
          // GETTING MARRIED text
          {
            id: uid('married'),
            type: 'text',
            style: {
              fontSize: '10px',
              letterSpacing: '0.2em',
              marginTop: '8px',
              color: colors.textMuted,
            },
            props: {
              content: 'GETTING MARRIED',
            },
          },
          // Divider
          {
            id: uid('divider'),
            type: 'container',
            style: {
              width: '48px',
              height: '2px',
              margin: '24px auto',
              backgroundColor: colors.text,
            },
          },
          // Names
          {
            id: uid('names'),
            type: 'row',
            style: {
              alignItems: 'center',
              gap: '8px',
            },
            children: [
              {
                id: uid('groom-name'),
                type: 'text',
                style: {
                  fontSize: '1rem',
                  color: colors.text,
                },
                props: {
                  content: groomName,
                },
              },
              {
                id: uid('ampersand'),
                type: 'text',
                style: {
                  fontSize: '0.75rem',
                  color: colors.accent,
                },
                props: {
                  content: '&',
                },
              },
              {
                id: uid('bride-name'),
                type: 'text',
                style: {
                  fontSize: '1rem',
                  color: colors.text,
                },
                props: {
                  content: brideName,
                },
              },
            ],
          },
          // Date
          {
            id: uid('date'),
            type: 'text',
            style: {
              fontSize: '0.75rem',
              marginTop: '16px',
              fontFamily: 'monospace',
              color: colors.textMuted,
            },
            props: {
              content: dateFormatted.replace(/-/g, '.'),
            },
          },
        ],
      },

      // Corner accents
      {
        id: uid('corner-tl'),
        type: 'container',
        style: {
          position: 'absolute',
          top: '24px',
          left: '24px',
          width: '16px',
          height: '16px',
          borderLeft: `2px solid ${colors.text}`,
          borderTop: `2px solid ${colors.text}`,
          opacity: 0.3,
        },
      },
      {
        id: uid('corner-br'),
        type: 'container',
        style: {
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          width: '16px',
          height: '16px',
          borderRight: `2px solid ${colors.text}`,
          borderBottom: `2px solid ${colors.text}`,
          opacity: 0.3,
        },
      },
    ],
  }

  return { root }
}

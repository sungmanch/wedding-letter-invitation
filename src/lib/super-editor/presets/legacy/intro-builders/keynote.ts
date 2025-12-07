/**
 * Keynote Intro Builder
 * Apple Keynote 프레젠테이션 스타일
 * 깔끔한 타이포그래피, 미니멀 디자인
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate } from './types'

export const buildKeynoteIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
  const { preset, data } = ctx
  const { groomName, brideName, weddingDate, mainImage } = data
  const { formatted: dateFormatted } = formatDate(weddingDate)
  const colors = preset.defaultColors
  const fonts = preset.defaultFonts
  const stickyTexts = (preset.intro.settings?.stickyTexts as string[]) || ['우리의 사랑']

  const root: PrimitiveNode = {
    id: uid('keynote-root'),
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
      // Background image (if provided, subtle)
      ...(mainImage ? [createBackgroundImage(mainImage)] : []),

      // Main content
      {
        id: uid('content'),
        type: 'column',
        style: {
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 24px',
          zIndex: 10,
        },
        children: [
          // Sticky text (subtitle)
          {
            id: uid('sticky-text'),
            type: 'text',
            style: {
              fontSize: '12px',
              letterSpacing: '0.1em',
              marginBottom: '16px',
              color: colors.textMuted,
            },
            props: {
              content: stickyTexts[0],
            },
          },
          // Groom Name
          {
            id: uid('groom-name'),
            type: 'text',
            style: {
              fontSize: '2rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: colors.text,
              fontFamily: fonts.title.family,
            },
            props: {
              content: groomName,
              as: 'h1',
            },
          },
          // Ampersand
          {
            id: uid('ampersand'),
            type: 'text',
            style: {
              fontSize: '1rem',
              margin: '8px 0',
              color: colors.accent,
            },
            props: {
              content: '&',
            },
          },
          // Bride Name
          {
            id: uid('bride-name'),
            type: 'text',
            style: {
              fontSize: '2rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
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
              fontSize: '12px',
              marginTop: '24px',
              color: colors.textMuted,
            },
            props: {
              content: dateFormatted,
            },
          },
        ],
      },
    ],
  }

  return { root }
}

function createBackgroundImage(src: string): PrimitiveNode {
  return {
    id: uid('bg-container'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.1,
    },
    children: [
      {
        id: uid('bg-img'),
        type: 'image',
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        },
        props: {
          src,
          alt: 'Background',
          objectFit: 'cover',
        },
      },
    ],
  }
}

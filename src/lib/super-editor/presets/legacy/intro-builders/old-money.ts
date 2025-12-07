/**
 * Old Money Intro Builder
 * Quiet Luxury with letterpress texture
 * 아이보리 배경 + Cotton paper 텍스처 + 이미지 상단 65% + 하단 텍스트
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate, withOpacity } from './types'

// Old Money 고유 색상 (IntroPreview.tsx 기준)
const OLD_MONEY_COLORS = {
  ivory: '#FAF8F5',
  charcoal: '#2C2C2C',
  warmGray: '#8A8580',
  border: '#D4D0C8',
}

export const buildOldMoneyIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
  const { data } = ctx
  const { groomName, brideName, weddingDate, mainImage } = data

  // 날짜 포맷
  const isBinding = (val: string) => val.startsWith('{{')
  let dateFormatted: string
  if (isBinding(weddingDate)) {
    dateFormatted = '{{wedding.dateDisplay}}'
  } else {
    const formatted = formatDate(weddingDate)
    dateFormatted = formatted.formatted
  }

  const root: PrimitiveNode = {
    id: uid('oldmoney-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: OLD_MONEY_COLORS.ivory,
      overflow: 'hidden',
      position: 'relative',
    },
    children: [
      // 1. Cotton paper texture - subtle letterpress feel
      createPaperTexture(),
      // 2. User image - larger portion with elegant fade (if provided)
      ...(mainImage ? [createImageSection(mainImage)] : []),
      // 3. Content - compact typography, bottom portion
      createContentLayer(groomName, brideName, dateFormatted),
    ],
  }

  return {
    root,
    additionalStyles: OLD_MONEY_STYLES,
  }
}

/**
 * Cotton paper texture - subtle letterpress feel
 */
function createPaperTexture(): PrimitiveNode {
  return {
    id: uid('paper-texture'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.04,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
    },
  }
}

/**
 * Image section - top 65% with elegant fade
 */
function createImageSection(mainImage: string): PrimitiveNode {
  return {
    id: uid('image-section'),
    type: 'container',
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '65%',
    },
    children: [
      // Main image
      {
        id: uid('main-image'),
        type: 'image',
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(1.05) contrast(0.92) saturate(0.7) sepia(0.15)',
        },
        props: {
          src: mainImage,
          alt: 'Preview',
          objectFit: 'cover',
        },
      },
      // Ivory tone overlay
      {
        id: uid('ivory-overlay'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          background: 'rgba(250, 248, 240, 0.15)',
          mixBlendMode: 'overlay',
        },
      },
      // Smooth fade to ivory
      {
        id: uid('fade-overlay'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, transparent 70%, ${OLD_MONEY_COLORS.ivory} 100%)`,
        },
      },
    ],
  }
}

/**
 * Content layer - bottom portion with typography
 */
function createContentLayer(
  groomName: string,
  brideName: string,
  dateFormatted: string
): PrimitiveNode {
  return {
    id: uid('content-layer'),
    type: 'container',
    style: {
      position: 'relative',
      zIndex: 10,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      textAlign: 'center',
      padding: '32px 32px 16px',
    },
    children: [
      // Groom Name
      {
        id: uid('groom-name'),
        type: 'text',
        style: {
          fontSize: '1.125rem',
          letterSpacing: '0.25em',
          fontWeight: 400,
          textTransform: 'uppercase',
          color: OLD_MONEY_COLORS.charcoal,
          fontFamily: 'Cormorant Garamond, serif',
        },
        props: {
          content: groomName,
          as: 'h1',
        },
      },
      // "and" text
      {
        id: uid('and-text'),
        type: 'text',
        style: {
          fontSize: '10px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          margin: '8px 0',
          color: OLD_MONEY_COLORS.warmGray,
          fontFamily: 'Cormorant Garamond, serif',
        },
        props: {
          content: 'and',
        },
      },
      // Bride Name
      {
        id: uid('bride-name'),
        type: 'text',
        style: {
          fontSize: '1.125rem',
          letterSpacing: '0.25em',
          fontWeight: 400,
          textTransform: 'uppercase',
          color: OLD_MONEY_COLORS.charcoal,
          fontFamily: 'Cormorant Garamond, serif',
        },
        props: {
          content: brideName,
          as: 'h1',
        },
      },
      // Thin divider line
      {
        id: uid('divider'),
        type: 'container',
        style: {
          width: '40px',
          height: '1px',
          marginTop: '16px',
          marginBottom: '12px',
          backgroundColor: OLD_MONEY_COLORS.border,
        },
      },
      // Date - formal style
      {
        id: uid('date'),
        type: 'text',
        style: {
          fontSize: '8px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: OLD_MONEY_COLORS.warmGray,
          fontFamily: 'Cormorant Garamond, serif',
        },
        props: {
          content: dateFormatted,
        },
      },
    ],
  }
}

const OLD_MONEY_STYLES = `
/* Old Money - Quiet Luxury */
/* No additional animations needed for this design */
`

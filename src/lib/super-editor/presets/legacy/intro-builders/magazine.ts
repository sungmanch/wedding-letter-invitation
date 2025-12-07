/**
 * Magazine Intro Builder
 * Vogue Cover Style - Full bleed editorial layout
 * 전체 이미지 배경 + MAISON 마스트헤드 + 좌측 정렬 텍스트
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate, withOpacity } from './types'

// Magazine 고유 색상 (IntroPreview.tsx 기준)
const MAG_COLORS = {
  white: '#FFFFFF',
  black: '#0A0A0A',
  gold: '#C9A962',
}

export const buildMagazineIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
  const { data } = ctx
  const { groomName, brideName, weddingDate, mainImage } = data

  // 데이터 바인딩 표현식인지 확인
  const isBinding = (val: string) => val.startsWith('{{')

  // 날짜 포맷
  const dateFormatted = isBinding(weddingDate)
    ? '{{wedding.dateDisplay}}'
    : formatDate(weddingDate).formatted

  const root: PrimitiveNode = {
    id: uid('magazine-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: MAG_COLORS.black,
      position: 'relative',
      overflow: 'hidden',
    },
    children: [
      // 1. Full bleed photo background
      ...(mainImage ? [createBackgroundImage(mainImage)] : []),
      // 2. Bottom gradient for text readability
      createBottomGradient(),
      // 3. Top gradient for masthead
      createTopGradient(),
      // 4. Content Layer
      createContentLayer(groomName, brideName, dateFormatted),
      // 5. Magazine border frame
      createBorderFrame(),
    ],
  }

  return { root }
}

/**
 * Full bleed background image
 */
function createBackgroundImage(src: string): PrimitiveNode {
  return {
    id: uid('bg-image'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
    },
    children: [
      {
        id: uid('bg-img'),
        type: 'image',
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.9) contrast(1.05)',
        },
        props: {
          src,
          alt: 'Cover',
          objectFit: 'cover',
        },
      },
    ],
  }
}

/**
 * Bottom gradient for text readability
 */
function createBottomGradient(): PrimitiveNode {
  return {
    id: uid('bottom-gradient'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 25%, transparent 50%)`,
    },
  }
}

/**
 * Top gradient for masthead
 */
function createTopGradient(): PrimitiveNode {
  return {
    id: uid('top-gradient'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, transparent 20%)`,
    },
  }
}

/**
 * Content layer with masthead and main title
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
      justifyContent: 'space-between',
      padding: '16px',
    },
    children: [
      // Masthead - Top
      createMasthead(),
      // Main Title - Bottom Left
      createMainTitle(groomName, brideName, dateFormatted),
    ],
  }
}

/**
 * Masthead with MAISON logo and Special Issue label
 */
function createMasthead(): PrimitiveNode {
  return {
    id: uid('masthead'),
    type: 'row',
    style: {
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    children: [
      // MAISON logo
      {
        id: uid('logo'),
        type: 'text',
        style: {
          fontSize: '1.125rem',
          fontWeight: 300,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: MAG_COLORS.white,
          fontFamily: 'Cormorant Garamond, serif',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        },
        props: {
          content: 'MAISON',
          as: 'h1',
        },
      },
      // Special Issue label
      {
        id: uid('special-issue'),
        type: 'text',
        style: {
          fontSize: '7px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: 0.8,
          color: MAG_COLORS.white,
        },
        props: {
          content: 'Special Issue',
        },
      },
    ],
  }
}

/**
 * Main Title section at bottom left
 */
function createMainTitle(
  groomName: string,
  brideName: string,
  dateFormatted: string
): PrimitiveNode {
  return {
    id: uid('main-title'),
    type: 'column',
    style: {
      alignItems: 'flex-start',
    },
    children: [
      // Tag line with gold line
      {
        id: uid('tagline'),
        type: 'row',
        style: {
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        },
        children: [
          {
            id: uid('gold-line'),
            type: 'container',
            style: {
              width: '24px',
              height: '1px',
              backgroundColor: MAG_COLORS.gold,
            },
          },
          {
            id: uid('wedding-label'),
            type: 'text',
            style: {
              fontSize: '7px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: MAG_COLORS.gold,
            },
            props: {
              content: 'Wedding',
            },
          },
        ],
      },
      // Groom Name
      {
        id: uid('groom-name'),
        type: 'text',
        style: {
          fontSize: '1.5rem',
          fontWeight: 300,
          letterSpacing: '0.1em',
          lineHeight: 1.2,
          color: MAG_COLORS.white,
          fontFamily: 'Cormorant Garamond, serif',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        },
        props: {
          content: groomName,
          as: 'h1',
        },
      },
      // Ampersand
      {
        id: uid('ampersand'),
        type: 'row',
        style: {
          alignItems: 'center',
          gap: '8px',
          margin: '4px 0',
        },
        children: [
          {
            id: uid('amp'),
            type: 'text',
            style: {
              fontSize: '0.875rem',
              fontWeight: 300,
              fontStyle: 'italic',
              color: MAG_COLORS.gold,
            },
            props: {
              content: '&',
            },
          },
        ],
      },
      // Bride Name
      {
        id: uid('bride-name'),
        type: 'text',
        style: {
          fontSize: '1.5rem',
          fontWeight: 300,
          letterSpacing: '0.1em',
          lineHeight: 1.2,
          color: MAG_COLORS.white,
          fontFamily: 'Cormorant Garamond, serif',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        },
        props: {
          content: brideName,
          as: 'h1',
        },
      },
      // Date & Issue info
      {
        id: uid('date-info'),
        type: 'row',
        style: {
          alignItems: 'center',
          gap: '12px',
          marginTop: '12px',
        },
        children: [
          {
            id: uid('date'),
            type: 'text',
            style: {
              fontSize: '8px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: withOpacity(MAG_COLORS.white, 0.8),
            },
            props: {
              content: dateFormatted,
            },
          },
          {
            id: uid('divider'),
            type: 'container',
            style: {
              width: '1px',
              height: '12px',
              backgroundColor: withOpacity(MAG_COLORS.white, 0.25),
            },
          },
          {
            id: uid('exclusive'),
            type: 'text',
            style: {
              fontSize: '7px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: MAG_COLORS.gold,
            },
            props: {
              content: 'Exclusive',
            },
          },
        ],
      },
    ],
  }
}

/**
 * Magazine border frame
 */
function createBorderFrame(): PrimitiveNode {
  return {
    id: uid('border-frame'),
    type: 'container',
    style: {
      position: 'absolute',
      top: '8px',
      left: '8px',
      right: '8px',
      bottom: '8px',
      pointerEvents: 'none',
      border: `1px solid ${withOpacity(MAG_COLORS.white, 0.08)}`,
    },
  }
}

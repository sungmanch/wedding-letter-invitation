/**
 * Monogram Crest Intro Builder
 * Clean Portrait with Gold Frame
 * 네이비 다크 배경 + 다이아몬드 패턴 + 골드 프레임 + 이미지 중앙
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate, withOpacity } from './types'

// Monogram 고유 색상 (IntroPreview.tsx 기준)
const MONO_COLORS = {
  navy: '#1A3A5C',
  navyDark: '#0F2338',
  gold: '#C5A572',
  goldLight: '#D4BC8E',
  cream: '#F8F5F0',
}

export const buildMonogramIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
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
    id: uid('monogram-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: MONO_COLORS.navyDark,
      overflow: 'hidden',
      position: 'relative',
    },
    children: [
      // 1. Subtle damask diamond pattern
      createDiamondPattern(),
      // 2. Content Layout
      createContentLayout(groomName, brideName, dateFormatted, mainImage),
    ],
  }

  return {
    root,
    additionalStyles: MONOGRAM_STYLES,
  }
}

/**
 * Diamond pattern background
 */
function createDiamondPattern(): PrimitiveNode {
  return {
    id: uid('diamond-pattern'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.06,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23C5A572' fill-opacity='0.5'/%3E%3C/svg%3E")`,
      backgroundSize: '30px 30px',
    },
  }
}

/**
 * Main content layout
 */
function createContentLayout(
  groomName: string,
  brideName: string,
  dateFormatted: string,
  mainImage?: string
): PrimitiveNode {
  return {
    id: uid('content-layout'),
    type: 'container',
    style: {
      position: 'relative',
      zIndex: 10,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px',
    },
    children: [
      // Top spacing with decorative line
      createTopDecoration(),
      // Center: Photo Frame
      createPhotoFrame(mainImage),
      // Bottom: Names and Date
      createBottomText(groomName, brideName, dateFormatted),
    ],
  }
}

/**
 * Top decorative element
 */
function createTopDecoration(): PrimitiveNode {
  return {
    id: uid('top-decoration'),
    type: 'column',
    style: {
      alignItems: 'center',
      marginTop: '12px',
      marginBottom: '12px',
    },
    children: [
      {
        id: uid('deco-row'),
        type: 'row',
        style: {
          alignItems: 'center',
          gap: '8px',
        },
        children: [
          {
            id: uid('line-left'),
            type: 'container',
            style: {
              width: '24px',
              height: '1px',
              background: `linear-gradient(to right, transparent, ${withOpacity(MONO_COLORS.gold, 0.6)})`,
            },
          },
          {
            id: uid('diamond'),
            type: 'container',
            style: {
              width: '4px',
              height: '4px',
              transform: 'rotate(45deg)',
              backgroundColor: withOpacity(MONO_COLORS.gold, 0.8),
            },
          },
          {
            id: uid('line-right'),
            type: 'container',
            style: {
              width: '24px',
              height: '1px',
              background: `linear-gradient(to left, transparent, ${withOpacity(MONO_COLORS.gold, 0.6)})`,
            },
          },
        ],
      },
    ],
  }
}

/**
 * Photo frame with gold border
 */
function createPhotoFrame(mainImage?: string): PrimitiveNode {
  return {
    id: uid('photo-frame'),
    type: 'container',
    style: {
      position: 'relative',
      flex: 1,
      width: '90%',
      maxHeight: '60%',
    },
    children: [
      // Gold border frame
      {
        id: uid('gold-border'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          borderRadius: '2px',
          border: `2px solid ${MONO_COLORS.gold}`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.4), inset 0 0 0 1px ${withOpacity(MONO_COLORS.gold, 0.3)}`,
        },
      },
      // Photo container
      {
        id: uid('photo-container'),
        type: 'container',
        style: {
          position: 'absolute',
          top: '2px',
          left: '2px',
          right: '2px',
          bottom: '2px',
          overflow: 'hidden',
          borderRadius: '2px',
        },
        children: mainImage
          ? [
              {
                id: uid('photo'),
                type: 'image' as const,
                style: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.95) contrast(1.02)',
                },
                props: {
                  src: mainImage,
                  alt: 'Portrait',
                  objectFit: 'cover',
                },
              },
            ]
          : [
              {
                id: uid('placeholder'),
                type: 'container' as const,
                style: {
                  width: '100%',
                  height: '100%',
                  backgroundColor: MONO_COLORS.navy,
                },
              },
            ],
      },
    ],
  }
}

/**
 * Bottom text section with names and date
 */
function createBottomText(
  groomName: string,
  brideName: string,
  dateFormatted: string
): PrimitiveNode {
  return {
    id: uid('bottom-text'),
    type: 'column',
    style: {
      marginTop: '12px',
      textAlign: 'center',
      alignItems: 'center',
    },
    children: [
      // Groom Name
      {
        id: uid('groom-name'),
        type: 'text',
        style: {
          fontSize: '0.875rem',
          letterSpacing: '0.2em',
          fontWeight: 400,
          textTransform: 'uppercase',
          color: MONO_COLORS.cream,
          fontFamily: 'Cormorant Garamond, serif',
        },
        props: {
          content: groomName,
          as: 'h1',
        },
      },
      // "and" divider row
      {
        id: uid('and-row'),
        type: 'row',
        style: {
          alignItems: 'center',
          gap: '8px',
          margin: '4px 0',
        },
        children: [
          {
            id: uid('and-line-left'),
            type: 'container',
            style: {
              width: '16px',
              height: '1px',
              backgroundColor: withOpacity(MONO_COLORS.gold, 0.6),
            },
          },
          {
            id: uid('and-text'),
            type: 'text',
            style: {
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: MONO_COLORS.gold,
            },
            props: {
              content: 'and',
            },
          },
          {
            id: uid('and-line-right'),
            type: 'container',
            style: {
              width: '16px',
              height: '1px',
              backgroundColor: withOpacity(MONO_COLORS.gold, 0.6),
            },
          },
        ],
      },
      // Bride Name
      {
        id: uid('bride-name'),
        type: 'text',
        style: {
          fontSize: '0.875rem',
          letterSpacing: '0.2em',
          fontWeight: 400,
          textTransform: 'uppercase',
          color: MONO_COLORS.cream,
          fontFamily: 'Cormorant Garamond, serif',
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
          fontSize: '7px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginTop: '8px',
          color: withOpacity(MONO_COLORS.cream, 0.6),
        },
        props: {
          content: dateFormatted,
        },
      },
    ],
  }
}

const MONOGRAM_STYLES = `
/* Monogram Crest - Navy and Gold */
/* No additional animations needed for this design */
`

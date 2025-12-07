/**
 * Jewel Velvet Intro Builder
 * Opera Stage with Velvet Curtains
 * 다크 배경 + 버건디/에메랄드 커튼 + 골드 프레임 + 오페라 무대 스타일
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate, withOpacity } from './types'

// Jewel Velvet 고유 색상 (IntroPreview.tsx 기준)
const JEWEL_COLORS = {
  emerald: '#1B4D3E',
  burgundy: '#722F37',
  gold: '#D4AF72',
  cream: '#F5EDE3',
  dark: '#0A0A0A',
}

export const buildJewelVelvetIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
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
    id: uid('jewel-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: JEWEL_COLORS.dark,
      overflow: 'hidden',
      position: 'relative',
    },
    children: [
      // 1. Stage background with radial gradient
      createStageBackground(),
      // 2. Left Curtain Drape
      createLeftCurtain(),
      // 3. Right Curtain Drape
      createRightCurtain(),
      // 4. Top Valance
      createTopValance(),
      // 5. Stage center - Photo area
      createStageCenter(mainImage),
      // 6. Bottom stage area - Names
      createBottomStage(groomName, brideName, dateFormatted),
    ],
  }

  return {
    root,
    additionalStyles: JEWEL_VELVET_STYLES,
  }
}

/**
 * Stage background with radial gradient
 */
function createStageBackground(): PrimitiveNode {
  return {
    id: uid('stage-bg'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(ellipse 150% 100% at 50% 100%, ${JEWEL_COLORS.dark} 0%, #000 100%)`,
    },
  }
}

/**
 * Left Curtain Drape (burgundy)
 */
function createLeftCurtain(): PrimitiveNode {
  return {
    id: uid('left-curtain'),
    type: 'container',
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '18%',
      background: `linear-gradient(to right, ${JEWEL_COLORS.burgundy} 0%, ${withOpacity(JEWEL_COLORS.burgundy, 0.87)} 60%, ${withOpacity(JEWEL_COLORS.burgundy, 0.6)} 80%, transparent 100%)`,
    },
    children: [
      // Curtain folds
      {
        id: uid('left-folds'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(to right, transparent 0px, rgba(0,0,0,0.2) 2px, transparent 4px, rgba(255,255,255,0.05) 8px, transparent 10px)`,
        },
      },
      // Velvet sheen
      {
        id: uid('left-sheen'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.2) 100%)`,
        },
      },
    ],
  }
}

/**
 * Right Curtain Drape (emerald)
 */
function createRightCurtain(): PrimitiveNode {
  return {
    id: uid('right-curtain'),
    type: 'container',
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '18%',
      background: `linear-gradient(to left, ${JEWEL_COLORS.emerald} 0%, ${withOpacity(JEWEL_COLORS.emerald, 0.87)} 60%, ${withOpacity(JEWEL_COLORS.emerald, 0.6)} 80%, transparent 100%)`,
    },
    children: [
      // Curtain folds
      {
        id: uid('right-folds'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(to left, transparent 0px, rgba(0,0,0,0.2) 2px, transparent 4px, rgba(255,255,255,0.05) 8px, transparent 10px)`,
        },
      },
      // Velvet sheen
      {
        id: uid('right-sheen'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.2) 100%)`,
        },
      },
    ],
  }
}

/**
 * Top Valance
 */
function createTopValance(): PrimitiveNode {
  return {
    id: uid('top-valance'),
    type: 'container',
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '8%',
      background: `linear-gradient(to bottom, ${JEWEL_COLORS.burgundy} 0%, ${withOpacity(JEWEL_COLORS.burgundy, 0.8)} 70%, transparent 100%)`,
    },
    children: [
      // Gold trim
      {
        id: uid('gold-trim'),
        type: 'container',
        style: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(to right, transparent 10%, ${withOpacity(JEWEL_COLORS.gold, 0.6)} 30%, ${withOpacity(JEWEL_COLORS.gold, 0.8)} 50%, ${withOpacity(JEWEL_COLORS.gold, 0.6)} 70%, transparent 90%)`,
        },
      },
    ],
  }
}

/**
 * Stage center - Photo area with spotlight
 */
function createStageCenter(mainImage?: string): PrimitiveNode {
  return {
    id: uid('stage-center'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12% 20%',
    },
    children: [
      // Spotlight glow
      {
        id: uid('spotlight'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,255,255,0.08) 0%, transparent 70%)`,
        },
      },
      // Photo frame container
      createPhotoFrame(mainImage),
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
      width: '100%',
      height: '100%',
      maxHeight: '70%',
    },
    children: [
      // Gold frame border
      {
        id: uid('gold-frame'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          border: `2px solid ${JEWEL_COLORS.gold}`,
          boxShadow: `0 0 30px rgba(212, 175, 114, 0.2), 0 10px 40px rgba(0,0,0,0.5)`,
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
                  filter: 'brightness(0.9) contrast(1.05)',
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
                  backgroundColor: JEWEL_COLORS.dark,
                },
              },
            ],
      },
    ],
  }
}

/**
 * Bottom stage area - Names and date
 */
function createBottomStage(
  groomName: string,
  brideName: string,
  dateFormatted: string
): PrimitiveNode {
  return {
    id: uid('bottom-stage'),
    type: 'container',
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '22%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    children: [
      // Stage floor gradient
      {
        id: uid('floor-gradient'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)`,
        },
      },
      // Content
      createBottomContent(groomName, brideName, dateFormatted),
    ],
  }
}

/**
 * Bottom content with gold ornament and names
 */
function createBottomContent(
  groomName: string,
  brideName: string,
  dateFormatted: string
): PrimitiveNode {
  return {
    id: uid('bottom-content'),
    type: 'column',
    style: {
      position: 'relative',
      zIndex: 10,
      textAlign: 'center',
      alignItems: 'center',
    },
    children: [
      // Gold ornament (star shape)
      {
        id: uid('gold-ornament'),
        type: 'row',
        style: {
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        },
        children: [
          {
            id: uid('ornament-line-left'),
            type: 'container',
            style: {
              width: '24px',
              height: '1px',
              background: `linear-gradient(to right, transparent, ${withOpacity(JEWEL_COLORS.gold, 0.6)})`,
            },
          },
          // Star shape using container
          {
            id: uid('star'),
            type: 'container',
            style: {
              width: '12px',
              height: '12px',
              position: 'relative',
            },
            props: {
              className: 'jewel-star',
            },
          },
          {
            id: uid('ornament-line-right'),
            type: 'container',
            style: {
              width: '24px',
              height: '1px',
              background: `linear-gradient(to left, transparent, ${withOpacity(JEWEL_COLORS.gold, 0.6)})`,
            },
          },
        ],
      },
      // Names row
      {
        id: uid('names-row'),
        type: 'row',
        style: {
          alignItems: 'center',
        },
        children: [
          {
            id: uid('groom-name'),
            type: 'text',
            style: {
              fontSize: '1rem',
              letterSpacing: '0.15em',
              fontWeight: 300,
              color: JEWEL_COLORS.cream,
              fontFamily: 'Cormorant Garamond, serif',
              textShadow: `0 0 20px rgba(212, 175, 114, 0.3)`,
            },
            props: {
              content: groomName,
              as: 'h1',
            },
          },
          {
            id: uid('ampersand'),
            type: 'text',
            style: {
              fontSize: '0.75rem',
              marginLeft: '8px',
              marginRight: '8px',
              color: JEWEL_COLORS.gold,
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
              letterSpacing: '0.15em',
              fontWeight: 300,
              color: JEWEL_COLORS.cream,
              fontFamily: 'Cormorant Garamond, serif',
              textShadow: `0 0 20px rgba(212, 175, 114, 0.3)`,
            },
            props: {
              content: brideName,
              as: 'h1',
            },
          },
        ],
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
          color: withOpacity(JEWEL_COLORS.cream, 0.6),
        },
        props: {
          content: dateFormatted,
        },
      },
    ],
  }
}

const JEWEL_VELVET_STYLES = `
/* Jewel Velvet - Opera Stage */
/* Star decoration using CSS */
.jewel-star::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(212, 175, 114, 0.6);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}
`

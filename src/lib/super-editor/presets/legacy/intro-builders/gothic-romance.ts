/**
 * Gothic Romance Intro Builder
 * Victorian Antique Portrait Frame 스타일
 * 다크 월페이퍼 + 빅토리안 다마스크 패턴 + 골드 프레임
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate, withOpacity } from './types'

// Gothic Romance 고유 색상 (IntroPreview.tsx 기준)
const GOTHIC_COLORS = {
  burgundy: '#722F37',
  gold: '#C9A962',
  goldDark: '#8B7355',
  cream: '#F5E6D3',
  dark: '#1A1412',
  wallpaper: '#0D0B0A',
}

export const buildGothicRomanceIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
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
    id: uid('gothic-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: GOTHIC_COLORS.wallpaper,
      overflow: 'hidden',
      position: 'relative',
    },
    children: [
      // 1. Victorian damask wallpaper pattern
      createWallpaperPattern(),
      // 2. Main content area
      createMainContent(groomName, brideName, dateFormatted, mainImage),
    ],
  }

  return {
    root,
    additionalStyles: GOTHIC_ROMANCE_STYLES,
  }
}

/**
 * Victorian damask wallpaper pattern
 * SVG 패턴을 배경 이미지로 사용
 */
function createWallpaperPattern(): PrimitiveNode {
  return {
    id: uid('wallpaper-pattern'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.08,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0C25 5 30 10 30 20C30 30 25 35 20 40C15 35 10 30 10 20C10 10 15 5 20 0Z' fill='%23C9A962' fill-opacity='0.5'/%3E%3C/svg%3E")`,
      backgroundSize: '40px 40px',
    },
  }
}

/**
 * Main content: frame + text
 */
function createMainContent(
  groomName: string,
  brideName: string,
  dateFormatted: string,
  mainImage?: string
): PrimitiveNode {
  return {
    id: uid('main-content'),
    type: 'container',
    style: {
      position: 'relative',
      zIndex: 10,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
    },
    children: [
      // Ornate Gold Frame with Photo
      createOrnateFrame(mainImage),
      // Gallery Placard - Below Frame
      createGalleryPlacard(groomName, brideName, dateFormatted),
    ],
  }
}

/**
 * Ornate Gold Frame with Photo
 * 3:4 비율의 골드 프레임
 */
function createOrnateFrame(mainImage?: string): PrimitiveNode {
  return {
    id: uid('ornate-frame'),
    type: 'container',
    style: {
      position: 'relative',
      width: '85%',
      aspectRatio: '3/4',
    },
    children: [
      // Outer frame glow
      createFrameGlow(),
      // Frame border - ornate gold gradient
      createFrameBorder(),
      // Photo container
      createPhotoContainer(mainImage),
      // Frame corner ornaments (4 corners)
      createCornerOrnament('top-left'),
      createCornerOrnament('top-right'),
      createCornerOrnament('bottom-left'),
      createCornerOrnament('bottom-right'),
    ],
  }
}

/**
 * Outer frame glow effect
 */
function createFrameGlow(): PrimitiveNode {
  return {
    id: uid('frame-glow'),
    type: 'container',
    style: {
      position: 'absolute',
      top: '-4px',
      left: '-4px',
      right: '-4px',
      bottom: '-4px',
      borderRadius: '2px',
      background: `linear-gradient(135deg, ${withOpacity(GOTHIC_COLORS.gold, 0.25)} 0%, ${withOpacity(GOTHIC_COLORS.goldDark, 0.125)} 50%, ${withOpacity(GOTHIC_COLORS.gold, 0.25)} 100%)`,
      filter: 'blur(4px)',
    },
  }
}

/**
 * Frame border - ornate gold gradient
 */
function createFrameBorder(): PrimitiveNode {
  return {
    id: uid('frame-border'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '2px',
      background: `linear-gradient(145deg, ${GOTHIC_COLORS.gold} 0%, ${GOTHIC_COLORS.goldDark} 50%, ${GOTHIC_COLORS.gold} 100%)`,
      padding: '4px',
    },
    children: [
      // Inner frame shadow
      {
        id: uid('inner-shadow'),
        type: 'container',
        style: {
          position: 'absolute',
          top: '4px',
          left: '4px',
          right: '4px',
          bottom: '4px',
          borderRadius: '2px',
          backgroundColor: GOTHIC_COLORS.dark,
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8)',
        },
      },
    ],
  }
}

/**
 * Photo container with vignette
 */
function createPhotoContainer(mainImage?: string): PrimitiveNode {
  return {
    id: uid('photo-container'),
    type: 'container',
    style: {
      position: 'absolute',
      top: '4px',
      left: '4px',
      right: '4px',
      bottom: '4px',
      overflow: 'hidden',
      borderRadius: '2px',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
    },
    children: [
      // Photo or placeholder
      mainImage
        ? {
            id: uid('photo'),
            type: 'image' as const,
            style: {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.85) contrast(1.05) sepia(0.15)',
            },
            props: {
              src: mainImage,
              alt: 'Portrait',
              objectFit: 'cover',
            },
          }
        : {
            id: uid('placeholder'),
            type: 'container' as const,
            style: {
              width: '100%',
              height: '100%',
              backgroundColor: GOTHIC_COLORS.dark,
            },
          },
      // Subtle vignette on photo
      {
        id: uid('vignette'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
        },
      },
    ],
  }
}

/**
 * Frame corner ornament SVG
 */
function createCornerOrnament(position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'): PrimitiveNode {
  const positionStyles: Record<string, Record<string, string | number>> = {
    'top-left': { top: 0, left: 0, transform: 'none' },
    'top-right': { top: 0, right: 0, transform: 'rotate(90deg)' },
    'bottom-left': { bottom: 0, left: 0, transform: 'rotate(-90deg)' },
    'bottom-right': { bottom: 0, right: 0, transform: 'rotate(180deg)' },
  }

  return {
    id: uid(`corner-${position}`),
    type: 'container',
    style: {
      position: 'absolute',
      width: '16px',
      height: '16px',
      ...positionStyles[position],
    },
    props: {
      // SVG corner ornament will be rendered via className
      className: 'gothic-corner-ornament',
      'data-position': position,
    },
    children: [
      // L-shape path
      {
        id: uid('corner-l'),
        type: 'container',
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '16px',
          height: '4px',
          backgroundColor: withOpacity(GOTHIC_COLORS.gold, 0.6),
        },
      },
      {
        id: uid('corner-l-v'),
        type: 'container',
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '16px',
          backgroundColor: withOpacity(GOTHIC_COLORS.gold, 0.6),
        },
      },
      // Circle decoration
      {
        id: uid('corner-circle'),
        type: 'container',
        style: {
          position: 'absolute',
          top: '4px',
          left: '4px',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: withOpacity(GOTHIC_COLORS.gold, 0.4),
        },
      },
    ],
  }
}

/**
 * Gallery Placard - Below Frame
 */
function createGalleryPlacard(groomName: string, brideName: string, dateFormatted: string): PrimitiveNode {
  return {
    id: uid('gallery-placard'),
    type: 'column',
    style: {
      marginTop: '16px',
      textAlign: 'center',
      alignItems: 'center',
    },
    children: [
      // Decorative line with diamond
      {
        id: uid('deco-line'),
        type: 'row',
        style: {
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        },
        children: [
          {
            id: uid('line-left'),
            type: 'container',
            style: {
              width: '32px',
              height: '1px',
              background: `linear-gradient(to right, transparent, ${withOpacity(GOTHIC_COLORS.gold, 0.6)})`,
            },
          },
          {
            id: uid('diamond'),
            type: 'container',
            style: {
              width: '6px',
              height: '6px',
              transform: 'rotate(45deg)',
              backgroundColor: withOpacity(GOTHIC_COLORS.gold, 0.8),
            },
          },
          {
            id: uid('line-right'),
            type: 'container',
            style: {
              width: '32px',
              height: '1px',
              background: `linear-gradient(to left, transparent, ${withOpacity(GOTHIC_COLORS.gold, 0.6)})`,
            },
          },
        ],
      },
      // Names - Gallery label style
      {
        id: uid('names'),
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
              fontWeight: 300,
              letterSpacing: '0.2em',
              fontStyle: 'italic',
              color: GOTHIC_COLORS.cream,
              fontFamily: 'Cormorant Garamond, serif',
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
              color: GOTHIC_COLORS.gold,
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
              fontWeight: 300,
              letterSpacing: '0.2em',
              fontStyle: 'italic',
              color: GOTHIC_COLORS.cream,
              fontFamily: 'Cormorant Garamond, serif',
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
          fontSize: '8px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginTop: '8px',
          color: withOpacity(GOTHIC_COLORS.cream, 0.6),
        },
        props: {
          content: dateFormatted,
        },
      },
    ],
  }
}

const GOTHIC_ROMANCE_STYLES = `
/* Gothic Romance - Victorian Portrait Frame */
/* No additional animations needed for this design */
`

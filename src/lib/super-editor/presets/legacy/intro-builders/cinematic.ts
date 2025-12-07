/**
 * Cinematic Intro Builder
 * Wong Kar-wai / 화양연화 스타일
 * 필름 그레인, 레드/틸 오버레이, 비네트 효과
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate, withOpacity } from './types'

// Cinematic 고유의 오버레이 색상 (화양연화 무드)
const CINEMATIC_OVERLAY = {
  red: '#8B2635',
  teal: '#1A4D4D',
}

export const buildCinematicIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
  const { preset, data } = ctx
  const { groomName, brideName, weddingDate, venueName, mainImage } = data
  const colors = preset.defaultColors
  const fonts = preset.defaultFonts

  // 데이터 바인딩 표현식인지 확인 (런타임에 치환될 경우)
  const isBinding = (val: string) => val.startsWith('{{')

  // 날짜 포맷: 바인딩 표현식이면 그대로 사용, 아니면 포맷팅
  let dateFormatted: string
  let weekday: string
  if (isBinding(weddingDate)) {
    // 바인딩 표현식 사용 시 런타임에 치환되므로 표현식 그대로 사용
    dateFormatted = '{{wedding.dateDisplay}}'
    weekday = '{{wedding.weekday}}'
  } else {
    const formatted = formatDate(weddingDate)
    dateFormatted = formatted.formatted
    weekday = formatted.weekday
  }

  // Root: fullscreen with preset background color
  const root: PrimitiveNode = {
    id: uid('cinematic-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: colors.background,
      overflow: 'hidden',
      position: 'relative',
    },
    children: [
      // 1. Background Image (with film flicker class)
      createBackgroundImage(mainImage || ''),

      // 2. Red/Teal Gradient Overlay (Wong Kar-wai signature)
      createColorOverlay(),

      // 3. Gold Highlight Layer (using preset accent)
      createGoldHighlight(colors.accent),

      // 4. Vignette Effect
      createVignette(),

      // 5. Film Grain Overlay (CSS animation)
      createFilmGrain(),

      // 6. Content Layer
      createContentLayer(fonts, colors, groomName, brideName, dateFormatted, weekday, venueName),

      // 7. Film Frame Edges
      createFilmFrameEdges(),
    ],
  }

  return {
    root,
    additionalStyles: CINEMATIC_STYLES,
  }
}

// ============================================
// Component Builders
// ============================================

function createBackgroundImage(src: string): PrimitiveNode {
  return {
    id: uid('bg-image'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
    },
    props: {
      className: 'cinematic-flicker',
    },
    children: [
      {
        id: uid('bg-img'),
        type: 'image',
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.7) contrast(1.2) saturate(1.1)',
        },
        props: {
          src,
          alt: 'Wedding',
          objectFit: 'cover',
        },
      },
    ],
  }
}

function createColorOverlay(): PrimitiveNode {
  // 화양연화 시그니처 오버레이 (cinematic 전용)
  return {
    id: uid('color-overlay'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(180deg, ${withOpacity(CINEMATIC_OVERLAY.red, 0.4)} 0%, ${withOpacity(CINEMATIC_OVERLAY.red, 0.3)} 30%, ${withOpacity(CINEMATIC_OVERLAY.teal, 0.2)} 70%, rgba(0, 0, 0, 0.6) 100%)`,
      mixBlendMode: 'multiply',
    },
  }
}

function createGoldHighlight(accentColor: string): PrimitiveNode {
  return {
    id: uid('gold-highlight'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(ellipse at 30% 20%, ${withOpacity(accentColor, 0.15)} 0%, transparent 50%)`,
      mixBlendMode: 'overlay',
    },
  }
}

function createVignette(): PrimitiveNode {
  return {
    id: uid('vignette'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.7) 100%)',
    },
  }
}

function createFilmGrain(): PrimitiveNode {
  return {
    id: uid('film-grain'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
    },
    props: {
      className: 'cinematic-grain',
    },
  }
}

function createContentLayer(
  fonts: { title: { family: string }; body: { family: string } },
  colors: { text: string; accent: string; textMuted?: string },
  groomName: string,
  brideName: string,
  dateFormatted: string,
  weekday: string,
  venueName?: string
): PrimitiveNode {
  return {
    id: uid('content-layer'),
    type: 'container',
    style: {
      position: 'relative',
      zIndex: 40,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '40px 24px',
    },
    children: [
      // Top Section
      createTopSection(fonts.body.family, colors.text),
      // Middle Section (Names & Date)
      createMiddleSection(fonts.title.family, colors, groomName, brideName, dateFormatted, weekday),
      // Bottom Section (Location)
      createBottomSection(fonts.body.family, colors, venueName),
    ],
  }
}

function createTopSection(bodyFont: string, textColor: string): PrimitiveNode {
  return {
    id: uid('top-section'),
    type: 'row',
    style: {
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    children: [
      // Left vertical text
      {
        id: uid('vertical-text'),
        type: 'text',
        style: {
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          fontSize: '12px',
          letterSpacing: '0.15em',
          opacity: 0.6,
          color: textColor,
          fontFamily: bodyFont,
        },
        props: {
          content: '우리의 시작',
        },
      },
      // Right corner label
      {
        id: uid('wedding-label'),
        type: 'text',
        style: {
          fontSize: '10px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: withOpacity(textColor, 0.5),
        },
        props: {
          content: 'Wedding Ceremony',
        },
      },
    ],
  }
}

function createMiddleSection(
  titleFont: string,
  colors: { text: string; accent: string },
  groomName: string,
  brideName: string,
  dateFormatted: string,
  weekday: string
): PrimitiveNode {
  return {
    id: uid('middle-section'),
    type: 'column',
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      marginTop: '-40px',
    },
    children: [
      // Top decorative line
      {
        id: uid('top-line'),
        type: 'container',
        style: {
          width: '1px',
          height: '48px',
          marginBottom: '24px',
          background: `linear-gradient(to bottom, transparent, ${withOpacity(colors.accent, 0.6)}, transparent)`,
        },
      },
      // Groom Name
      {
        id: uid('groom-name'),
        type: 'text',
        style: {
          fontSize: '2.5rem',
          lineHeight: 1.1,
          fontWeight: 300,
          letterSpacing: '0.2em',
          color: colors.text,
          fontFamily: titleFont,
          textShadow: `0 0 40px ${withOpacity(CINEMATIC_OVERLAY.red, 0.3)}, 0 0 80px ${withOpacity(CINEMATIC_OVERLAY.red, 0.2)}`,
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
          fontSize: '1.125rem',
          letterSpacing: '0.15em',
          margin: '12px 0',
          color: withOpacity(colors.accent, 0.8),
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
          fontSize: '2.5rem',
          lineHeight: 1.1,
          fontWeight: 300,
          letterSpacing: '0.2em',
          color: colors.text,
          fontFamily: titleFont,
          textShadow: `0 0 40px ${withOpacity(CINEMATIC_OVERLAY.red, 0.3)}, 0 0 80px ${withOpacity(CINEMATIC_OVERLAY.red, 0.2)}`,
        },
        props: {
          content: brideName,
          as: 'h1',
        },
      },
      // Decorative divider
      createDecorativeDivider(colors.accent),
      // Date
      {
        id: uid('date'),
        type: 'text',
        style: {
          fontSize: '0.875rem',
          letterSpacing: '0.25em',
          marginBottom: '4px',
          color: withOpacity(colors.text, 0.9),
        },
        props: {
          content: dateFormatted,
        },
      },
      // Weekday
      {
        id: uid('weekday'),
        type: 'text',
        style: {
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          color: withOpacity(colors.text, 0.6),
        },
        props: {
          content: weekday,
        },
      },
    ],
  }
}

function createDecorativeDivider(accentColor: string): PrimitiveNode {
  return {
    id: uid('divider'),
    type: 'row',
    style: {
      alignItems: 'center',
      gap: '16px',
      margin: '32px 0',
    },
    children: [
      {
        id: uid('line-left'),
        type: 'container',
        style: {
          width: '48px',
          height: '1px',
          background: `linear-gradient(to right, transparent, ${withOpacity(accentColor, 0.5)})`,
        },
      },
      {
        id: uid('diamond'),
        type: 'container',
        style: {
          width: '6px',
          height: '6px',
          transform: 'rotate(45deg)',
          backgroundColor: withOpacity(accentColor, 0.6),
        },
      },
      {
        id: uid('line-right'),
        type: 'container',
        style: {
          width: '48px',
          height: '1px',
          background: `linear-gradient(to left, transparent, ${withOpacity(accentColor, 0.5)})`,
        },
      },
    ],
  }
}

function createBottomSection(
  bodyFont: string,
  colors: { text: string; accent: string },
  venueName?: string
): PrimitiveNode {
  return {
    id: uid('bottom-section'),
    type: 'column',
    style: {
      borderTop: `1px solid ${withOpacity(colors.accent, 0.2)}`,
      paddingTop: '24px',
    },
    children: [
      {
        id: uid('location-label'),
        type: 'text',
        style: {
          fontSize: '10px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          marginBottom: '8px',
          color: withOpacity(colors.text, 0.4),
        },
        props: {
          content: 'Location',
        },
      },
      ...(venueName
        ? [
            {
              id: uid('venue-name'),
              type: 'text' as const,
              style: {
                fontSize: '0.875rem',
                letterSpacing: '0.05em',
                color: withOpacity(colors.text, 0.9),
                fontFamily: bodyFont,
              },
              props: {
                content: venueName,
              },
            },
          ]
        : []),
      // Scroll indicator
      createScrollIndicator(colors.text),
    ],
  }
}

function createScrollIndicator(textColor: string): PrimitiveNode {
  return {
    id: uid('scroll-indicator'),
    type: 'column',
    style: {
      alignItems: 'center',
      gap: '8px',
      marginTop: '32px',
      opacity: 0.5,
    },
    children: [
      {
        id: uid('scroll-text'),
        type: 'text',
        style: {
          fontSize: '8px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: withOpacity(textColor, 0.5),
        },
        props: {
          content: 'Scroll',
        },
      },
      {
        id: uid('scroll-line'),
        type: 'container',
        style: {
          width: '1px',
          height: '24px',
          background: `linear-gradient(to bottom, ${withOpacity(textColor, 0.5)}, transparent)`,
        },
        props: {
          className: 'animate-pulse',
        },
      },
    ],
  }
}

function createFilmFrameEdges(): PrimitiveNode {
  return {
    id: uid('film-edges'),
    type: 'container',
    children: [
      {
        id: uid('edge-top'),
        type: 'container',
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          zIndex: 40,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
        },
      },
      {
        id: uid('edge-bottom'),
        type: 'container',
        style: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          zIndex: 40,
          background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
        },
      },
    ],
  }
}

// ============================================
// CSS Styles
// ============================================

const CINEMATIC_STYLES = `
/* Film grain animation */
@keyframes cinematicGrain {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -10%); }
  20% { transform: translate(-15%, 5%); }
  30% { transform: translate(7%, -25%); }
  40% { transform: translate(-5%, 25%); }
  50% { transform: translate(-15%, 10%); }
  60% { transform: translate(15%, 0%); }
  70% { transform: translate(0%, 15%); }
  80% { transform: translate(3%, 35%); }
  90% { transform: translate(-10%, 10%); }
}

.cinematic-grain::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.15;
  pointer-events: none;
  animation: cinematicGrain 0.5s steps(10) infinite;
  z-index: 50;
}

/* Film flicker effect */
@keyframes cinematicFlicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.98; }
  75% { opacity: 0.99; }
}

.cinematic-flicker {
  animation: cinematicFlicker 0.15s infinite;
}
`

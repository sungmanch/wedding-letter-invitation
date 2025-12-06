/**
 * Pixel Intro Builder
 * 8-bit 픽셀 아트 스타일
 * 레트로 게임 느낌, 픽셀 하트, 스캔라인
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid } from './types'

export const buildPixelIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
  const { preset, data } = ctx
  const { groomName, brideName } = data
  const colors = preset.defaultColors
  const gameTitle = (preset.intro.settings?.gameTitle as string) || 'WEDDING QUEST'

  const root: PrimitiveNode = {
    id: uid('pixel-root'),
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
      // Scanlines overlay
      {
        id: uid('scanlines'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(0deg, ${colors.text} 0px, ${colors.text} 1px, transparent 1px, transparent 3px)`,
        },
      },

      // Game Title
      {
        id: uid('title'),
        type: 'text',
        style: {
          fontSize: '1rem',
          letterSpacing: '0.1em',
          marginBottom: '32px',
          color: colors.text,
          textShadow: `2px 2px 0 ${colors.secondary}`,
          fontFamily: '"Press Start 2P", monospace',
        },
        props: {
          content: gameTitle,
          as: 'h1',
        },
      },

      // Characters and Heart row
      {
        id: uid('characters'),
        type: 'row',
        style: {
          alignItems: 'center',
          gap: '24px',
          marginBottom: '32px',
        },
        children: [
          // Groom name
          {
            id: uid('groom-name'),
            type: 'text',
            style: {
              fontSize: '12px',
              color: colors.text,
              fontFamily: '"Press Start 2P", monospace',
            },
            props: {
              content: groomName,
            },
          },
          // Pixel Heart
          createPixelHeart(colors.accent),
          // Bride name
          {
            id: uid('bride-name'),
            type: 'text',
            style: {
              fontSize: '12px',
              color: colors.text,
              fontFamily: '"Press Start 2P", monospace',
            },
            props: {
              content: brideName,
            },
          },
        ],
      },

      // Press Start
      {
        id: uid('press-start'),
        type: 'text',
        style: {
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: colors.text,
          fontFamily: '"Press Start 2P", monospace',
        },
        props: {
          content: '▶ PRESS START',
          className: 'pixel-blink',
        },
      },
    ],
  }

  return {
    root,
    additionalStyles: PIXEL_STYLES,
  }
}

function createPixelHeart(color: string): PrimitiveNode {
  // 7x6 pixel heart pattern
  const pattern = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ]

  const pixels: PrimitiveNode[] = []
  pattern.forEach((row, rowIndex) => {
    row.forEach((filled, colIndex) => {
      if (filled) {
        pixels.push({
          id: uid(`pixel-${rowIndex}-${colIndex}`),
          type: 'container',
          style: {
            gridColumn: colIndex + 1,
            gridRow: rowIndex + 1,
            backgroundColor: color,
          },
        })
      }
    })
  })

  return {
    id: uid('pixel-heart'),
    type: 'container',
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 4px)',
      gridTemplateRows: 'repeat(6, 4px)',
      gap: '1px',
    },
    children: pixels,
  }
}

const PIXEL_STYLES = `
@keyframes pixelBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.pixel-blink {
  animation: pixelBlink 1s steps(1) infinite;
}
`

/**
 * Vinyl Intro Builder
 * LP 레코드 스타일
 * 레트로 바이닐 디스크, 음악적 요소
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate } from './types'

export const buildVinylIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
  const { preset, data } = ctx
  const { groomName, brideName, weddingDate } = data
  const { formatted: dateFormatted } = formatDate(weddingDate)
  const colors = preset.defaultColors

  const root: PrimitiveNode = {
    id: uid('vinyl-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: colors.background,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    children: [
      // Vinyl Record
      {
        id: uid('vinyl-disc'),
        type: 'container',
        style: {
          width: '75%',
          aspectRatio: '1/1',
          borderRadius: '50%',
          backgroundColor: '#1a1a1a',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        },
        children: [
          // Grooves
          ...createGrooves(),
          // Center Label
          {
            id: uid('center-label'),
            type: 'container',
            style: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '33.33%',
              aspectRatio: '1/1',
              borderRadius: '50%',
              backgroundColor: colors.accent,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            },
            children: [
              {
                id: uid('label-groom'),
                type: 'text',
                style: {
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#ffffff',
                },
                props: {
                  content: groomName,
                },
              },
              {
                id: uid('label-amp'),
                type: 'text',
                style: {
                  fontSize: '8px',
                  color: 'rgba(255,255,255,0.7)',
                },
                props: {
                  content: '&',
                },
              },
              {
                id: uid('label-bride'),
                type: 'text',
                style: {
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#ffffff',
                },
                props: {
                  content: brideName,
                },
              },
            ],
          },
          // Center hole
          {
            id: uid('center-hole'),
            type: 'container',
            style: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: colors.background,
            },
          },
        ],
      },
      // Date below vinyl
      {
        id: uid('date'),
        type: 'text',
        style: {
          fontSize: '0.75rem',
          marginTop: '32px',
          color: colors.textMuted,
        },
        props: {
          content: dateFormatted,
        },
      },
    ],
  }

  return {
    root,
    additionalStyles: VINYL_STYLES,
  }
}

function createGrooves(): PrimitiveNode[] {
  return [2, 4, 6].map((inset, i) => ({
    id: uid(`groove-${i}`),
    type: 'container' as const,
    style: {
      position: 'absolute',
      inset: `${inset * 4}%`,
      borderRadius: '50%',
      border: '1px solid rgba(55, 55, 55, 0.5)',
    },
  }))
}

const VINYL_STYLES = `
@keyframes vinylSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.vinyl-spinning {
  animation: vinylSpin 3s linear infinite;
}
`

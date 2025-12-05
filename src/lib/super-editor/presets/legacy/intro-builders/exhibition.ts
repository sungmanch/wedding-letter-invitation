/**
 * Exhibition Intro Builder
 * 갤러리/전시회 스타일
 * 액자 프레임, 아트 갤러리 느낌
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate } from './types'

export const buildExhibitionIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
  const { preset, data } = ctx
  const { groomName, brideName, weddingDate, mainImage } = data
  const { formatted: dateFormatted } = formatDate(weddingDate)
  const colors = preset.defaultColors
  const fonts = preset.defaultFonts

  const root: PrimitiveNode = {
    id: uid('exhibition-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    children: [
      // Frame
      {
        id: uid('frame'),
        type: 'container',
        style: {
          width: '80%',
          aspectRatio: '3/4',
          border: `4px solid ${colors.text}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Image or Text content
          ...(mainImage
            ? [
                {
                  id: uid('frame-img'),
                  type: 'image' as const,
                  style: {
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  },
                  props: {
                    src: mainImage,
                    alt: 'Wedding',
                    objectFit: 'cover' as const,
                  },
                },
                // Overlay text on image
                {
                  id: uid('overlay-text'),
                  type: 'container' as const,
                  style: {
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '24px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
                  },
                  children: [
                    {
                      id: uid('names'),
                      type: 'text' as const,
                      style: {
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        color: '#ffffff',
                        fontFamily: fonts.title.family,
                      },
                      props: {
                        content: `${groomName} & ${brideName}`,
                      },
                    },
                    {
                      id: uid('date'),
                      type: 'text' as const,
                      style: {
                        fontSize: '0.75rem',
                        marginTop: '8px',
                        color: 'rgba(255,255,255,0.8)',
                      },
                      props: {
                        content: dateFormatted,
                      },
                    },
                  ],
                },
              ]
            : [
                // No image - text only
                {
                  id: uid('text-content'),
                  type: 'column' as const,
                  style: {
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '16px',
                  },
                  children: [
                    {
                      id: uid('label'),
                      type: 'text' as const,
                      style: {
                        fontSize: '8px',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                        color: colors.textMuted,
                      },
                      props: {
                        content: 'Wedding Exhibition',
                      },
                    },
                    {
                      id: uid('names'),
                      type: 'text' as const,
                      style: {
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: colors.text,
                        fontFamily: fonts.title.family,
                      },
                      props: {
                        content: `${groomName} & ${brideName}`,
                      },
                    },
                    {
                      id: uid('date'),
                      type: 'text' as const,
                      style: {
                        fontSize: '0.75rem',
                        marginTop: '16px',
                        color: colors.textMuted,
                      },
                      props: {
                        content: dateFormatted,
                      },
                    },
                  ],
                },
              ]),
        ],
      },
    ],
  }

  return { root }
}

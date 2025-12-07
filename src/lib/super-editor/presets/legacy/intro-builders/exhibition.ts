/**
 * Exhibition Intro Builder
 * Gallery style - Museum/Art Gallery feel
 * 갤러리 배경 + 중앙 사진 프레임 + 뮤지엄 플라카드
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate } from './types'

export const buildExhibitionIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
  const { preset, data } = ctx
  const { groomName, brideName, weddingDate, mainImage } = data
  const fonts = preset.defaultFonts

  // 데이터 바인딩 표현식인지 확인
  const isBinding = (val: string) => val.startsWith('{{')

  // 날짜 포맷
  const dateFormatted = isBinding(weddingDate)
    ? '{{wedding.dateDisplay}}'
    : formatDate(weddingDate).formatted

  const root: PrimitiveNode = {
    id: uid('exhibition-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: '#111827', // gray-900
      position: 'relative',
      overflow: 'hidden',
    },
    children: [
      // 1. Gallery Background
      createGalleryBackground(),
      // 2. Main Photo Frame - centered
      createPhotoFrame(mainImage),
      // 3. Bottom gradient overlay
      createBottomGradient(),
      // 4. Wedding Info - Museum Placard Style
      createMuseumPlacard(groomName, brideName, dateFormatted, fonts.title.family),
    ],
  }

  return { root }
}

/**
 * Gallery background image
 */
function createGalleryBackground(): PrimitiveNode {
  return {
    id: uid('gallery-bg'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
    },
    children: [
      {
        id: uid('gallery-img'),
        type: 'image',
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        },
        props: {
          src: '/examples/images/gallery.png',
          alt: 'Gallery Background',
          objectFit: 'cover',
        },
      },
    ],
  }
}

/**
 * Main Photo Frame - centered with heavy shadow
 */
function createPhotoFrame(mainImage?: string): PrimitiveNode {
  return {
    id: uid('photo-frame-container'),
    type: 'container',
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '15%',
    },
    children: [
      {
        id: uid('photo-frame'),
        type: 'container',
        style: {
          position: 'relative',
          width: '55%',
          aspectRatio: '3/4',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4), 0 15px 30px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.25)',
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
                },
                props: {
                  src: mainImage,
                  alt: 'Couple Photo',
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
                  backgroundColor: '#E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: [
                  {
                    id: uid('placeholder-text'),
                    type: 'text',
                    style: {
                      color: '#9CA3AF',
                      fontSize: '0.75rem',
                    },
                    props: {
                      content: 'Photo',
                    },
                  },
                ],
              },
            ],
      },
    ],
  }
}

/**
 * Bottom gradient overlay
 */
function createBottomGradient(): PrimitiveNode {
  return {
    id: uid('bottom-gradient'),
    type: 'container',
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '96px',
      pointerEvents: 'none',
      background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.4) 100%)',
    },
  }
}

/**
 * Museum Placard - white card at bottom
 */
function createMuseumPlacard(
  groomName: string,
  brideName: string,
  dateFormatted: string,
  titleFont: string
): PrimitiveNode {
  return {
    id: uid('placard-container'),
    type: 'container',
    style: {
      position: 'absolute',
      bottom: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    children: [
      {
        id: uid('placard'),
        type: 'container',
        style: {
          padding: '12px 16px',
          textAlign: 'center',
          borderRadius: '2px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
        children: [
          // Names
          {
            id: uid('names'),
            type: 'row',
            style: {
              justifyContent: 'center',
              alignItems: 'center',
            },
            children: [
              {
                id: uid('groom-name'),
                type: 'text',
                style: {
                  fontSize: '0.875rem',
                  letterSpacing: '0.025em',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: '#1f2937',
                  fontFamily: titleFont,
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
                  fontSize: '0.875rem',
                  marginLeft: '4px',
                  marginRight: '4px',
                  color: '#9CA3AF',
                },
                props: {
                  content: '&',
                },
              },
              {
                id: uid('bride-name'),
                type: 'text',
                style: {
                  fontSize: '0.875rem',
                  letterSpacing: '0.025em',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: '#1f2937',
                  fontFamily: titleFont,
                },
                props: {
                  content: brideName,
                  as: 'h1',
                },
              },
            ],
          },
          // Divider
          {
            id: uid('divider'),
            type: 'container',
            style: {
              width: '24px',
              height: '1px',
              backgroundColor: '#D1D5DB',
              margin: '6px auto',
            },
          },
          // Date
          {
            id: uid('date'),
            type: 'text',
            style: {
              fontSize: '7px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color: '#374151',
            },
            props: {
              content: dateFormatted,
            },
          },
        ],
      },
    ],
  }
}

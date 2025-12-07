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
  const colors = preset.defaultColors
  const fonts = preset.defaultFonts

  // 데이터 바인딩 표현식인지 확인
  const isBinding = (val: string) => val.startsWith('{{')

  // 날짜 포맷: 바인딩 표현식이면 그대로 사용
  const dateFormatted = isBinding(weddingDate)
    ? '{{wedding.dateDisplay}}'
    : formatDate(weddingDate).formatted

  // 이름 표현식: 바인딩이면 조합 표현식, 아니면 실제 값
  const namesContent = isBinding(groomName)
    ? '{{couple.groom.name}} & {{couple.bride.name}}'
    : `${groomName} & ${brideName}`

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
          // 이미지 (항상 생성, 바인딩 표현식은 런타임에 치환됨)
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
              src: mainImage || '',
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
                  content: namesContent,
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
        ],
      },
    ],
  }

  return { root }
}

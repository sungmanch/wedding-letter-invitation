/**
 * Magazine Intro Builder
 * 보그/에디토리얼 매거진 스타일
 * 대담한 타이포그래피, 에디토리얼 레이아웃
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate } from './types'

export const buildMagazineIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
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

  const root: PrimitiveNode = {
    id: uid('magazine-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: colors.background,
      position: 'relative',
    },
    children: [
      // Background image (subtle) - 항상 생성, 바인딩 표현식은 런타임에 치환됨
      {
        id: uid('bg-img'),
        type: 'image' as const,
        style: {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.3,
        },
        props: {
          src: mainImage || '',
          alt: 'Background',
          objectFit: 'cover' as const,
        },
      },

      // Content overlay
      {
        id: uid('content'),
        type: 'container',
        style: {
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '24px',
        },
        children: [
          // Special Issue label
          {
            id: uid('label'),
            type: 'text',
            style: {
              fontSize: '8px',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              marginBottom: '16px',
              color: colors.textMuted,
            },
            props: {
              content: 'Special Issue',
            },
          },
          // Groom Name (large)
          {
            id: uid('groom-name'),
            type: 'text',
            style: {
              fontSize: '2.5rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.9,
              color: colors.text,
              fontFamily: fonts.title.family,
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
              fontSize: '0.875rem',
              margin: '8px 0',
              color: colors.accent,
            },
            props: {
              content: '&',
            },
          },
          // Bride Name (large)
          {
            id: uid('bride-name'),
            type: 'text',
            style: {
              fontSize: '2.5rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.9,
              color: colors.text,
              fontFamily: fonts.title.family,
            },
            props: {
              content: brideName,
              as: 'h1',
            },
          },
          // Divider line
          {
            id: uid('divider'),
            type: 'container',
            style: {
              width: '32px',
              height: '2px',
              marginTop: '24px',
              backgroundColor: colors.accent,
            },
          },
          // Date
          {
            id: uid('date'),
            type: 'text',
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
    ],
  }

  return { root }
}

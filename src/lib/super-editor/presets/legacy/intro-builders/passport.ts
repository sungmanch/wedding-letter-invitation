/**
 * Passport Intro Builder
 * 여권/여행 스타일
 * 여권 커버 디자인, 스탬프 효과
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate } from './types'

export const buildPassportIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
  const { preset, data } = ctx
  const { groomName, brideName, weddingDate } = data
  const { formatted: dateFormatted } = formatDate(weddingDate)
  const colors = preset.defaultColors

  // Passport navy color
  const passportColor = '#1E3A5F'

  const root: PrimitiveNode = {
    id: uid('passport-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    children: [
      // Passport Cover
      {
        id: uid('passport-cover'),
        type: 'container',
        style: {
          width: '80%',
          aspectRatio: '3/4',
          borderRadius: '8px',
          backgroundColor: passportColor,
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
        children: [
          // Emblem circle
          {
            id: uid('emblem'),
            type: 'container',
            style: {
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: `2px solid ${colors.secondary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            },
            children: [
              {
                id: uid('emblem-icon'),
                type: 'text',
                style: {
                  fontSize: '24px',
                },
                props: {
                  content: '✈️',
                },
              },
            ],
          },
          // PASSPORT text
          {
            id: uid('passport-text'),
            type: 'text',
            style: {
              fontSize: '12px',
              letterSpacing: '0.15em',
              marginBottom: '8px',
              color: colors.secondary,
            },
            props: {
              content: 'PASSPORT',
            },
          },
          // Subtitle
          {
            id: uid('subtitle'),
            type: 'text',
            style: {
              fontSize: '8px',
              letterSpacing: '0.1em',
              color: `${colors.secondary}80`,
            },
            props: {
              content: 'WEDDING JOURNEY',
            },
          },
          // Names
          {
            id: uid('names'),
            type: 'text',
            style: {
              fontSize: '0.75rem',
              marginTop: '24px',
              color: colors.secondary,
            },
            props: {
              content: `${groomName} & ${brideName}`,
            },
          },
          // Date
          {
            id: uid('date'),
            type: 'text',
            style: {
              fontSize: '10px',
              marginTop: '8px',
              color: `${colors.secondary}80`,
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

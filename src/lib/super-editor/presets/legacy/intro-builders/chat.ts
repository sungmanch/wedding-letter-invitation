/**
 * Chat Intro Builder
 * 메신저 대화 스타일
 * 카카오톡/iMessage 느낌의 채팅 UI
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate } from './types'

export const buildChatIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
  const { preset, data } = ctx
  const { groomName, brideName, weddingDate } = data
  const { formatted: dateFormatted } = formatDate(weddingDate)
  const colors = preset.defaultColors

  const root: PrimitiveNode = {
    id: uid('chat-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: colors.background,
      display: 'flex',
      flexDirection: 'column',
    },
    children: [
      // Chat Header
      {
        id: uid('header'),
        type: 'row',
        style: {
          padding: '12px 16px',
          borderBottom: `1px solid ${colors.text}10`,
          alignItems: 'center',
          gap: '8px',
        },
        children: [
          // Avatars
          {
            id: uid('avatars'),
            type: 'row',
            style: {
              marginLeft: '-4px',
            },
            children: [
              {
                id: uid('avatar-groom'),
                type: 'container',
                style: {
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: colors.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#ffffff',
                  fontWeight: 500,
                },
                children: [
                  {
                    id: uid('avatar-groom-text'),
                    type: 'text',
                    props: { content: groomName[0] },
                  },
                ],
              },
              {
                id: uid('avatar-bride'),
                type: 'container',
                style: {
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: colors.secondary,
                  fontWeight: 500,
                  marginLeft: '-8px',
                  border: '2px solid #ffffff',
                },
                children: [
                  {
                    id: uid('avatar-bride-text'),
                    type: 'text',
                    props: { content: brideName[0] },
                  },
                ],
              },
            ],
          },
          // Names
          {
            id: uid('header-names'),
            type: 'text',
            style: {
              fontSize: '12px',
              fontWeight: 500,
              color: colors.text,
            },
            props: {
              content: `${groomName} & ${brideName}`,
            },
          },
        ],
      },

      // Chat Messages
      {
        id: uid('messages'),
        type: 'column',
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '16px',
          gap: '8px',
        },
        children: [
          // Message from groom (right)
          {
            id: uid('msg-groom'),
            type: 'row',
            style: {
              justifyContent: 'flex-end',
            },
            children: [
              {
                id: uid('bubble-groom'),
                type: 'container',
                style: {
                  padding: '8px 12px',
                  borderRadius: '16px',
                  backgroundColor: colors.primary,
                  maxWidth: '70%',
                },
                children: [
                  {
                    id: uid('bubble-groom-text'),
                    type: 'text',
                    style: {
                      fontSize: '13px',
                      color: colors.secondary,
                    },
                    props: {
                      content: '우리 결혼해요! 💍',
                    },
                  },
                ],
              },
            ],
          },
          // Message from bride (left)
          {
            id: uid('msg-bride'),
            type: 'row',
            style: {
              justifyContent: 'flex-start',
            },
            children: [
              {
                id: uid('bubble-bride'),
                type: 'container',
                style: {
                  padding: '8px 12px',
                  borderRadius: '16px',
                  backgroundColor: colors.surface,
                  maxWidth: '70%',
                },
                children: [
                  {
                    id: uid('bubble-bride-text'),
                    type: 'text',
                    style: {
                      fontSize: '13px',
                      color: colors.text,
                    },
                    props: {
                      content: '네! 좋아요 ❤️',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },

      // Date badge at bottom
      {
        id: uid('date-badge'),
        type: 'row',
        style: {
          justifyContent: 'center',
          padding: '12px 16px',
        },
        children: [
          {
            id: uid('date-pill'),
            type: 'container',
            style: {
              padding: '4px 12px',
              borderRadius: '12px',
              backgroundColor: `${colors.text}10`,
            },
            children: [
              {
                id: uid('date-text'),
                type: 'text',
                style: {
                  fontSize: '10px',
                  color: colors.textMuted,
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

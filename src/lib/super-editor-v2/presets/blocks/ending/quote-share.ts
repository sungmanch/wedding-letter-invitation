/**
 * Ending Block Preset: Quote Share
 *
 * 영화 인용문과 카카오톡/링크 공유 버튼이 포함된 엔딩 블록
 * - Auto Layout 기반
 * - 커버 이미지 위 인용문 오버레이
 * - 카카오톡 공유 + 링크 복사 버튼
 */

import type { BlockPreset } from '../types'
import { ENDING_COMMON_BINDINGS, ENDING_COMMON_TAGS } from './_shared'

export const ENDING_QUOTE_SHARE: BlockPreset = {
  id: 'ending-quote-share',
  blockType: 'ending',
  variant: 'quote-share',
  name: 'Quote Share',
  nameKo: '인용문 공유',
  description: '영화 인용문과 카카오톡/링크 공유 버튼이 포함된 엔딩 블록',

  tags: [...ENDING_COMMON_TAGS, 'quote', 'movie', 'kakao', 'link', '인용문', '영화', '카카오톡', 'auto-layout'],
  complexity: 'medium',
  bindings: [...ENDING_COMMON_BINDINGS, 'custom.quoteText', 'custom.quoteSource'],

  // ─── Layout (Auto Layout First!) ───
  layout: {
    mode: 'auto',
    direction: 'vertical',
    gap: 24,
    padding: {
      top: 40,
      right: 0,
      bottom: 60,
      left: 0,
    },
    alignItems: 'center',
  },
  defaultHeight: { type: 'hug' },

  // ─── Elements ───
  defaultElements: [
    // 1. 인사말 텍스트
    {
      id: 'thanks-message',
      type: 'text',
      layoutMode: 'auto',
      sizing: {
        width: { type: 'fill' },
        height: { type: 'hug' },
      },
      zIndex: 1,
      value: '저희 두 사람, 예쁘게 잘 살겠습니다. 감사합니다.',
      props: { type: 'text' },
      style: {
        text: {
          fontFamily: 'var(--font-body)',
          fontSize: 16,
          fontWeight: 400,
          color: 'var(--fg-default)',
          textAlign: 'center',
          lineHeight: 1.6,
        },
      },
    },

    // 2. 커버 이미지 + 인용문 오버레이 그룹
    {
      id: 'cover-group',
      type: 'group',
      layoutMode: 'auto',
      sizing: {
        width: { type: 'fill' },
        height: { type: 'fixed', value: 360, unit: 'px' },
      },
      zIndex: 1,
      props: {
        type: 'group',
        layout: {
          direction: 'vertical',
          alignItems: 'center',
          justifyContent: 'end',
          padding: { bottom: 16 },
        },
      },
      children: [
        // 2-1. 배경 이미지 (absolute로 전체 채움)
        {
          id: 'cover-image',
          type: 'image',
          layoutMode: 'absolute',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          zIndex: 0,
          binding: 'ending.photo',
          value: 'https://picsum.photos/seed/ending/800/600',
          props: {
            type: 'image',
            objectFit: 'cover',
          },
          style: {
            background: '#D0D0D0',
          },
        },
        // 2-2. 블랙 오버레이 30%
        {
          id: 'cover-overlay',
          type: 'box',
          layoutMode: 'absolute',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          zIndex: 1,
          props: {
            type: 'box',
          },
          style: {
            background: 'rgba(0, 0, 0, 0.3)',
          },
        },
        // 2-3. 그라데이션 오버레이 (위 0% → 아래 100%)
        {
          id: 'gradient-overlay',
          type: 'box',
          layoutMode: 'absolute',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          zIndex: 2,
          props: {
            type: 'box',
          },
          style: {
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)',
          },
        },
        // 2-4. 인용문 컨테이너 (auto layout)
        {
          id: 'quote-container',
          type: 'group',
          layoutMode: 'auto',
          sizing: {
            width: { type: 'fill' },
            height: { type: 'hug' },
          },
          zIndex: 3,
          props: {
            type: 'group',
            layout: {
              direction: 'vertical',
              gap: 16,
              padding: { top: 40, right: 24, bottom: 24, left: 24 },
              alignItems: 'center',
            },
          },
          children: [
            // 인용문 텍스트
            {
              id: 'quote-text',
              type: 'text',
              layoutMode: 'auto',
              sizing: {
                width: { type: 'fill' },
                height: { type: 'hug' },
              },
              zIndex: 1,
              binding: 'custom.quoteText',
              value: '"우리는 매일 시간을 여행한다.\n우리가 할 수 있는 최선은,\n이 멋진 여행을 즐기는 것뿐이다."',
              props: { type: 'text' },
              style: {
                text: {
                  fontFamily: 'var(--font-body)',
                  fontSize: 15,
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.9)',
                  textAlign: 'center',
                  lineHeight: 1.8,
                },
              },
            },
            // 인용 출처
            {
              id: 'quote-source',
              type: 'text',
              layoutMode: 'auto',
              sizing: {
                width: { type: 'fill' },
                height: { type: 'hug' },
              },
              zIndex: 1,
              binding: 'custom.quoteSource',
              value: '- 영화 『어바웃 타임』 중',
              props: { type: 'text' },
              style: {
                text: {
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#FFFFFF',
                  textAlign: 'center',
                  lineHeight: 1.4,
                },
              },
            },
          ],
        },
      ],
    },

    // 3. 버튼 그룹
    {
      id: 'button-group',
      type: 'group',
      layoutMode: 'auto',
      sizing: {
        width: { type: 'fixed', value: 320, unit: 'px' },
        height: { type: 'hug' },
      },
      constraints: {
        maxWidth: 400,
      },
      zIndex: 1,
      props: {
        type: 'group',
        layout: {
          direction: 'vertical',
          gap: 12,
          alignItems: 'stretch',
        },
      },
      children: [
        // 카카오톡 공유 버튼
        {
          id: 'kakao-share-button',
          type: 'button',
          layoutMode: 'auto',
          sizing: {
            width: { type: 'fill' },
            height: { type: 'fixed', value: 52, unit: 'px' },
          },
          zIndex: 1,
          props: {
            type: 'button',
            label: '카카오로 공유하기',
            action: 'share',
            icon: 'kakao-talk',
          },
          style: {
            text: {
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 500,
              color: '#1A1A1A',
              textAlign: 'center',
            },
            background: '#FFEB3B',
            border: {
              width: 0,
              color: 'transparent',
              style: 'solid',
              radius: 8,
            },
          },
        },
        // 공유하기 버튼 (native share)
        {
          id: 'native-share-button',
          type: 'button',
          layoutMode: 'auto',
          sizing: {
            width: { type: 'fill' },
            height: { type: 'fixed', value: 52, unit: 'px' },
          },
          zIndex: 1,
          props: {
            type: 'button',
            label: '공유하기',
            action: 'share',
          },
          style: {
            text: {
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 500,
              color: 'var(--fg-default)',
              textAlign: 'center',
            },
            background: 'transparent',
            border: {
              width: 1,
              color: 'var(--border-default)',
              style: 'solid',
              radius: 8,
            },
          },
        },
      ],
    },

  ],

  // ─── AI Hints ───
  aiHints: {
    mood: ['warm', 'cinematic', 'emotional'],
    style: ['modern', 'minimal', 'elegant'],
    useCase: ['ending', 'share', 'outro', 'closing'],
  },

  recommendedThemes: ['minimal-light', 'modern-mono'],
  recommendedAnimations: ['fade-in', 'slide-up'],
}

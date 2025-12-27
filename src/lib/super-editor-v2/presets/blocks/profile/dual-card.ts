/**
 * Profile Block - Dual Card Preset
 *
 * 신랑/신부 프로필을 교차 배치 카드로 보여주는 카드 형식 (Auto Layout)
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'

const ELEMENTS: PresetElement[] = [
  // Section Title (English)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    value: 'About Us',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'Cormorant Garamond',
        fontSize: 18,
        fontWeight: 400,
        color: 'var(--accent-default)',
        textAlign: 'center',
        letterSpacing: 0.1,
      },
    },
  },
  // Section Title (Korean)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    value: '저희를 소개합니다',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'Noto Serif KR',
        fontSize: 22,
        fontWeight: 500,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },
  // ═══════════════════════════════════════
  // 신랑 그룹 (사진 왼쪽, 정보 오른쪽)
  // ═══════════════════════════════════════
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: {
        direction: 'horizontal',
        gap: 16,
        alignItems: 'start',
      },
    },
    children: [
      // Groom Photo (42%)
      {
        id: 'groom-photo',
        type: 'image',
        zIndex: 1,
        sizing: { width: { type: 'fixed', value: 42, unit: '%' }, height: { type: 'fixed', value: 200, unit: 'px' } },
        binding: 'couple.groom.photo',
        props: { type: 'image', objectFit: 'cover' },
      },
      // Groom Info Group
      {
        id: 'groom-info',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: {
            direction: 'vertical',
            gap: 8,
            alignItems: 'start',
          },
        },
        children: [
          // Groom Label (신랑 뱃지)
          {
            id: 'groom-label',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
            value: '신랑',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 12,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'center',
              },
              border: {
                width: 1,
                color: 'var(--border-default)',
                style: 'solid',
                radius: 12,
              },
            },
          },
          // Groom Name
          {
            id: 'groom-name',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            binding: 'couple.groom.name',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'Noto Serif KR',
                fontSize: 20,
                fontWeight: 600,
                color: 'var(--fg-default)',
                textAlign: 'left',
              },
            },
          },
          // Groom Parents
          {
            id: 'groom-parents',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            props: {
              type: 'text',
              format: '{parents.groom.father.name} · {parents.groom.mother.name}의 {parents.groom.birthOrder}',
            },
            style: {
              text: {
                fontSize: 12,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'left',
              },
            },
          },
          // Groom Birth Date
          {
            id: 'groom-birthdate',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            binding: 'couple.groom.birthDate',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 12,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'left',
              },
            },
          },
          // Groom MBTI
          {
            id: 'groom-mbti',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
            binding: 'couple.groom.mbti',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--fg-default)',
                textAlign: 'left',
              },
            },
          },
          // Groom Tags
          {
            id: 'groom-tags',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            binding: 'couple.groom.tags',
            value: '#캠핑 #러닝',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 12,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'left',
              },
            },
          },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════
  // 신부 그룹 (정보 왼쪽, 사진 오른쪽 - reverse)
  // ═══════════════════════════════════════
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: {
        direction: 'horizontal',
        gap: 16,
        alignItems: 'start',
        reverse: true,  // 사진이 오른쪽으로 이동
      },
    },
    children: [
      // Bride Photo (42%)
      {
        id: 'bride-photo',
        type: 'image',
        zIndex: 1,
        sizing: { width: { type: 'fixed', value: 42, unit: '%' }, height: { type: 'fixed', value: 200, unit: 'px' } },
        binding: 'couple.bride.photo',
        props: { type: 'image', objectFit: 'cover' },
      },
      // Bride Info Group
      {
        id: 'bride-info',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: {
            direction: 'vertical',
            gap: 8,
            alignItems: 'start',
          },
        },
        children: [
          // Bride Label (신부 뱃지)
          {
            id: 'bride-label',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
            value: '신부',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 12,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'center',
              },
              border: {
                width: 1,
                color: 'var(--border-default)',
                style: 'solid',
                radius: 12,
              },
            },
          },
          // Bride Name
          {
            id: 'bride-name',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            binding: 'couple.bride.name',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'Noto Serif KR',
                fontSize: 20,
                fontWeight: 600,
                color: 'var(--fg-default)',
                textAlign: 'left',
              },
            },
          },
          // Bride Parents
          {
            id: 'bride-parents',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            props: {
              type: 'text',
              format: '{parents.bride.father.name} · {parents.bride.mother.name}의 {parents.bride.birthOrder}',
            },
            style: {
              text: {
                fontSize: 12,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'left',
              },
            },
          },
          // Bride Birth Date
          {
            id: 'bride-birthdate',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            binding: 'couple.bride.birthDate',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 12,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'left',
              },
            },
          },
          // Bride MBTI
          {
            id: 'bride-mbti',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
            binding: 'couple.bride.mbti',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--fg-default)',
                textAlign: 'left',
              },
            },
          },
          // Bride Tags
          {
            id: 'bride-tags',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            binding: 'couple.bride.tags',
            value: '#스노우보드 #캠핑',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 12,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'left',
              },
            },
          },
        ],
      },
    ],
  },
]

export const PROFILE_DUAL_CARD: BlockPreset = {
  id: 'profile-dual-card',
  blockType: 'profile',
  variant: 'dual-card',
  name: 'Dual Card',
  nameKo: '듀얼 카드',
  description: '신랑/신부 프로필을 교차 배치 카드로 보여주는 카드 형식 (Auto Layout)',
  tags: ['elegant', 'minimal', 'modern', 'card', 'dual', 'alternate', 'light', 'auto-layout'],
  complexity: 'medium',
  bindings: [
    'couple.groom.name',
    'couple.groom.photo',
    'couple.groom.birthDate',
    'couple.groom.mbti',
    'couple.groom.tags',
    'couple.bride.name',
    'couple.bride.photo',
    'couple.bride.birthDate',
    'couple.bride.mbti',
    'couple.bride.tags',
    'parents.groom.father.name',
    'parents.groom.mother.name',
    'parents.groom.birthOrder',
    'parents.bride.father.name',
    'parents.bride.mother.name',
    'parents.bride.birthOrder',
  ],
  defaultHeight: HUG_HEIGHT,
  layout: AUTO_LAYOUT_VERTICAL,
  defaultElements: ELEMENTS,
  specialComponents: ['card', 'badge', 'tag-list', 'group'],
  recommendedAnimations: ['fade-in', 'stagger-fade-up', 'slide-in-left', 'slide-in-right'],
  recommendedThemes: ['classic-ivory', 'minimal-light', 'romantic-blush'],
  aiHints: {
    mood: ['elegant', 'warm', 'friendly'],
    style: ['card-layout', 'alternating', 'clean', 'auto-layout'],
    useCase: ['커플 소개', 'About Us', '프로필 정보'],
  },
}

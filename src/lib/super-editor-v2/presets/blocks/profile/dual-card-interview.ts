/**
 * Profile Block - Dual Card Preset (양옆 여백 버전)
 *
 * 신랑/신부 프로필을 좌우로 나란히 배치하는 레이아웃 (양옆 24px 여백)
 */

import type { BlockPreset, PresetElement } from '../types'
import type { BlockLayout, SizeMode } from '../../../schema/types'
import { FONT_SIZE } from '../tokens'

// 이 프리셋 전용 레이아웃 (양옆 24px 여백)
const LAYOUT_WITH_PADDING: BlockLayout = {
  mode: 'auto',
  direction: 'vertical',
  gap: 32,
  padding: { top: 60, right: 24, bottom: 60, left: 24 },
  alignItems: 'center',
}

const HUG_HEIGHT: SizeMode = { type: 'hug' }

const ELEMENTS: PresetElement[] = [
  // ═══════════════════════════════════════
  // 섹션 헤더
  // ═══════════════════════════════════════
  {
    id: 'section-label',
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    value: 'ABOUT US',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.sm,
        fontWeight: 600,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        letterSpacing: 2,
      },
    },
  },
  {
    id: 'section-title',
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    value: '저희를 소개합니다.',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: FONT_SIZE['3xl'],
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },

  // ═══════════════════════════════════════
  // 프로필 카드 그룹 (좌우 2컬럼)
  // ═══════════════════════════════════════
  {
    id: 'profile-cards',
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: {
        direction: 'horizontal',
        gap: 8,
        alignItems: 'start',
        justifyContent: 'center',
      },
    },
    children: [
      // ─── 신부 프로필 카드 (왼쪽) ───
      {
        id: 'bride-card',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fill-portion', value: 1 }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: {
            direction: 'vertical',
            gap: 8,
            alignItems: 'center',
          },
        },
        children: [
          {
            id: 'bride-photo',
            type: 'image',
            zIndex: 1,
            sizing: {
              width: { type: 'fill' },
              height: { type: 'fixed', value: 200, unit: 'px' },
            },
            binding: 'couple.bride.photo',
            props: { type: 'image', objectFit: 'cover' },
          },
          {
            id: 'bride-name',
            type: 'text',
            zIndex: 1,
            sizing: { height: { type: 'hug' } },
            binding: 'couple.bride.name',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-heading)',
                fontSize: FONT_SIZE.lg,
                fontWeight: 500,
                color: 'var(--fg-default)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'bride-birthdate',
            type: 'text',
            zIndex: 1,
            sizing: { height: { type: 'hug' } },
            binding: 'couple.bride.birthDate',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: FONT_SIZE.base,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'bride-intro',
            type: 'text',
            zIndex: 1,
            sizing: { height: { type: 'hug' } },
            binding: 'couple.bride.intro',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: FONT_SIZE.base,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'bride-tags-group',
            type: 'group',
            zIndex: 1,
            sizing: { height: { type: 'hug' } },
            props: {
              type: 'group',
              layout: {
                direction: 'horizontal',
                gap: 8,
                alignItems: 'center',
                justifyContent: 'center',
              },
            },
            children: [
              {
                id: 'bride-mbti',
                type: 'text',
                zIndex: 1,
                sizing: { height: { type: 'hug' } },
                binding: 'couple.bride.mbti',
                props: { type: 'text', format: '#{couple.bride.mbti}' },
                style: {
                  text: {
                    fontFamily: 'var(--font-body)',
                    fontSize: FONT_SIZE.sm,
                    fontWeight: 500,
                    color: 'var(--accent-default)',
                    textAlign: 'center',
                  },
                },
              },
              {
                id: 'bride-tags',
                type: 'text',
                zIndex: 1,
                sizing: { height: { type: 'hug' } },
                binding: 'couple.bride.tags',
                props: { type: 'text' },
                style: {
                  text: {
                    fontFamily: 'var(--font-body)',
                    fontSize: FONT_SIZE.sm,
                    fontWeight: 500,
                    color: 'var(--accent-default)',
                    textAlign: 'center',
                  },
                },
              },
            ],
          },
        ],
      },
      // ─── 신랑 프로필 카드 (오른쪽) ───
      {
        id: 'groom-card',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fill-portion', value: 1 }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: {
            direction: 'vertical',
            gap: 8,
            alignItems: 'center',
          },
        },
        children: [
          {
            id: 'groom-photo',
            type: 'image',
            zIndex: 1,
            sizing: {
              width: { type: 'fill' },
              height: { type: 'fixed', value: 200, unit: 'px' },
            },
            binding: 'couple.groom.photo',
            props: { type: 'image', objectFit: 'cover' },
          },
          {
            id: 'groom-name',
            type: 'text',
            zIndex: 1,
            sizing: { height: { type: 'hug' } },
            binding: 'couple.groom.name',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-heading)',
                fontSize: FONT_SIZE.lg,
                fontWeight: 500,
                color: 'var(--fg-default)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'groom-birthdate',
            type: 'text',
            zIndex: 1,
            sizing: { height: { type: 'hug' } },
            binding: 'couple.groom.birthDate',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: FONT_SIZE.base,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'groom-intro',
            type: 'text',
            zIndex: 1,
            sizing: { height: { type: 'hug' } },
            binding: 'couple.groom.intro',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: FONT_SIZE.base,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'groom-tags-group',
            type: 'group',
            zIndex: 1,
            sizing: { height: { type: 'hug' } },
            props: {
              type: 'group',
              layout: {
                direction: 'horizontal',
                gap: 8,
                alignItems: 'center',
                justifyContent: 'center',
              },
            },
            children: [
              {
                id: 'groom-mbti',
                type: 'text',
                zIndex: 1,
                sizing: { height: { type: 'hug' } },
                binding: 'couple.groom.mbti',
                props: { type: 'text', format: '#{couple.groom.mbti}' },
                style: {
                  text: {
                    fontFamily: 'var(--font-body)',
                    fontSize: FONT_SIZE.sm,
                    fontWeight: 500,
                    color: 'var(--accent-default)',
                    textAlign: 'center',
                  },
                },
              },
              {
                id: 'groom-tags',
                type: 'text',
                zIndex: 1,
                sizing: { height: { type: 'hug' } },
                binding: 'couple.groom.tags',
                props: { type: 'text' },
                style: {
                  text: {
                    fontFamily: 'var(--font-body)',
                    fontSize: FONT_SIZE.sm,
                    fontWeight: 500,
                    color: 'var(--accent-default)',
                    textAlign: 'center',
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
]

export const PROFILE_DUAL_CARD_INTERVIEW: BlockPreset = {
  id: 'profile-dual-card-interview',
  blockType: 'profile',
  variant: 'dual-card-interview',
  name: 'Dual Card (Padded)',
  nameKo: '좌우 프로필 (여백)',
  description: '신랑/신부 프로필을 좌우로 나란히 배치하는 레이아웃 (양옆 24px 여백)',
  tags: ['modern', 'dual-column', 'minimal', 'card', 'auto-layout'],
  complexity: 'medium',
  bindings: [
    'couple.bride.name',
    'couple.bride.photo',
    'couple.bride.birthDate',
    'couple.bride.intro',
    'couple.bride.mbti',
    'couple.bride.tags',
    'couple.groom.name',
    'couple.groom.photo',
    'couple.groom.birthDate',
    'couple.groom.intro',
    'couple.groom.mbti',
    'couple.groom.tags',
  ],
  defaultHeight: HUG_HEIGHT,
  layout: LAYOUT_WITH_PADDING,
  defaultElements: ELEMENTS,
  specialComponents: ['card', 'tag-list', 'group'],
  recommendedAnimations: ['fade-in', 'stagger-fade-up'],
  recommendedThemes: ['simple-pink', 'simple-coral', 'hero-minimal-overlay', 'hero-dark-romantic'],
  aiHints: {
    mood: ['modern', 'minimal', 'friendly'],
    style: ['dual-column', 'side-by-side', 'card', 'auto-layout'],
    useCase: ['커플 소개', 'About Us', '프로필 정보'],
  },
  relatedPresets: ['profile-dual-card', 'profile-split-photo', 'interview-accordion'],
}

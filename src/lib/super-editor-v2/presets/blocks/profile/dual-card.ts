/**
 * Profile Block - Dual Card Preset
 *
 * 신랑/신부 프로필을 좌우로 나란히 배치하고 MBTI, 태그를 표시하는 레이아웃
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'
import { FONT_SIZE } from '../tokens'

const ELEMENTS: PresetElement[] = [
  // Section Label (English)
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
        color: 'var(--accent-default)',
        textAlign: 'center',
        letterSpacing: 2,
      },
    },
  },
  // Section Title (Korean)
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
  // 프로필 카드 그룹 (좌우 2컬럼 - 나란히 배치)
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
          // 신부 사진
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
          // 신부 이름
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
          // 신부 생년월일
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
          // 신부 직업/소개
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
          // 신부 태그 그룹 (MBTI + tags)
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
          // 신랑 사진
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
          // 신랑 이름
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
          // 신랑 생년월일
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
          // 신랑 직업/소개
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
          // 신랑 태그 그룹 (MBTI + tags)
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

export const PROFILE_DUAL_CARD: BlockPreset = {
  id: 'profile-dual-card',
  blockType: 'profile',
  variant: 'dual-card',
  name: 'Dual Card',
  nameKo: '좌우 프로필',
  description: '신랑/신부 프로필을 좌우로 나란히 배치하고 MBTI, 태그를 표시하는 레이아웃',
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
  layout: AUTO_LAYOUT_VERTICAL,
  defaultElements: ELEMENTS,
  specialComponents: ['card', 'tag-list', 'group'],
  recommendedAnimations: ['fade-in', 'stagger-fade-up'],
  recommendedThemes: ['simple-pink', 'minimal-light', 'romantic-blush'],
  aiHints: {
    mood: ['modern', 'minimal', 'friendly'],
    style: ['dual-column', 'side-by-side', 'card', 'auto-layout'],
    useCase: ['커플 소개', 'About Us', '프로필 정보'],
  },
}

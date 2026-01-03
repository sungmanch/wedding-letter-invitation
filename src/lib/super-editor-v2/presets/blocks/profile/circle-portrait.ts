/**
 * Profile Block - Circle Portrait Preset
 *
 * 원형 사진과 화살표 장식으로 신랑신부를 소개하는 캐주얼한 프로필 레이아웃 (Auto Layout)
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'

// ============================================
// 화살표 SVG 경로
// ============================================
const ARROW_L_TO_R = '/assets/arrow_l_to_r.svg'
const ARROW_R_TO_L = '/assets/arrow_r_to_l.svg'

// ============================================
// 요소 정의
// ============================================
const ELEMENTS: PresetElement[] = [
  // ═══════════════════════════════════════
  // 헤더 영역
  // ═══════════════════════════════════════

  // Section Title (English) - 세로 회전
  {
    id: 'title-en',
    type: 'text',
    layoutMode: 'absolute',
    x: 2,
    y: 8,
    width: 10,
    height: 20,
    rotation: -90,  // 세로 텍스트 효과
    zIndex: 1,
    value: 'ABOUT US',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-display)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'left',
        letterSpacing: 0.15,
      },
    },
  },

  // Section Title (Korean)
  {
    id: 'title-ko',
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    value: '저희를 소개합니다.',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 18,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },

  // ═══════════════════════════════════════
  // 신랑 프로필 그룹
  // ═══════════════════════════════════════
  {
    id: 'groom-profile',
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: {
        direction: 'horizontal',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    children: [
      // 원형 사진 컨테이너
      {
        id: 'groom-photo-container',
        type: 'group',
        zIndex: 1,
        sizing: {
          width: { type: 'fixed', value: 140, unit: 'px' },
          height: { type: 'hug' },
        },
        props: {
          type: 'group',
          layout: {
            direction: 'vertical',
            gap: 8,
            alignItems: 'center',
          },
        },
        children: [
          // 원형 사진
          {
            id: 'groom-photo',
            type: 'image',
            zIndex: 1,
            sizing: {
              width: { type: 'fixed', value: 140, unit: 'px' },
              height: { type: 'fixed', value: 140, unit: 'px' },
            },
            binding: 'couple.groom.photo',
            props: { type: 'image', objectFit: 'cover' },
            style: {
              border: { width: 0, color: 'transparent', style: 'solid', radius: 9999 },
              background: 'var(--bg-card)',
            },
          },
          // MBTI (이미지 중앙 하단에 겹침)
          {
            id: 'groom-mbti',
            type: 'text',
            layoutMode: 'absolute',
            x: 0,
            y: 90,
            width: 100,
            height: 20,
            zIndex: 2,
            binding: 'couple.groom.mbti',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: 24,
                fontWeight: 600,
                color: 'var(--accent-default)',
                textAlign: 'center',
              },
            },
          },
        ],
      },

      // 화살표 장식 (absolute within group)
      {
        id: 'groom-arrow',
        type: 'image',
        layoutMode: 'absolute',
        x: 38,
        y: 0,
        width: 25,
        height: 12,
        zIndex: 2,
        value: ARROW_L_TO_R,
        props: { type: 'image', objectFit: 'contain' },
      },

      // 정보 그룹
      {
        id: 'groom-info',
        type: 'group',
        zIndex: 1,
        sizing: {
          width: { type: 'fixed', value: 120, unit: 'px' },
          height: { type: 'hug' },
        },
        props: {
          type: 'group',
          layout: {
            direction: 'vertical',
            gap: 4,
            alignItems: 'start',
          },
        },
        children: [
          // 신랑 라벨 + 이름
          {
            id: 'groom-label-name',
            type: 'group',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            props: {
              type: 'group',
              layout: {
                direction: 'horizontal',
                gap: 8,
                alignItems: 'center',
              },
            },
            children: [
              {
                id: 'groom-label',
                type: 'text',
                zIndex: 1,
                sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
                value: '신랑',
                props: { type: 'text' },
                style: {
                  text: {
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--accent-default)',
                    textAlign: 'left',
                  },
                },
              },
              {
                id: 'groom-name',
                type: 'text',
                zIndex: 1,
                sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
                binding: 'couple.groom.name',
                props: { type: 'text' },
                style: {
                  text: {
                    fontFamily: 'var(--font-heading)',
                    fontSize: 16,
                    fontWeight: 500,
                    color: 'var(--fg-default)',
                    textAlign: 'left',
                  },
                },
              },
            ],
          },
          // 생년월일
          {
            id: 'groom-birthdate',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            binding: 'couple.groom.birthDate',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'left',
              },
            },
          },
          // 직업
          {
            id: 'groom-job',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            binding: 'custom.groomJob',
            value: '직업',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 400,
                color: 'var(--fg-default)',
                textAlign: 'left',
              },
            },
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 신부 프로필 그룹 (reverse)
  // ═══════════════════════════════════════
  {
    id: 'bride-profile',
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: {
        direction: 'horizontal',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    children: [
      // 정보 그룹 (왼쪽)
      {
        id: 'bride-info',
        type: 'group',
        zIndex: 1,
        sizing: {
          width: { type: 'fixed', value: 120, unit: 'px' },
          height: { type: 'hug' },
        },
        props: {
          type: 'group',
          layout: {
            direction: 'vertical',
            gap: 4,
            alignItems: 'start',
          },
        },
        children: [
          // 신부 라벨 + 이름
          {
            id: 'bride-label-name',
            type: 'group',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            props: {
              type: 'group',
              layout: {
                direction: 'horizontal',
                gap: 8,
                alignItems: 'center',
              },
            },
            children: [
              {
                id: 'bride-label',
                type: 'text',
                zIndex: 1,
                sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
                value: '신부',
                props: { type: 'text' },
                style: {
                  text: {
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--accent-default)',
                    textAlign: 'left',
                  },
                },
              },
              {
                id: 'bride-name',
                type: 'text',
                zIndex: 1,
                sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
                binding: 'couple.bride.name',
                props: { type: 'text' },
                style: {
                  text: {
                    fontFamily: 'var(--font-heading)',
                    fontSize: 16,
                    fontWeight: 500,
                    color: 'var(--fg-default)',
                    textAlign: 'left',
                  },
                },
              },
            ],
          },
          // 생년월일
          {
            id: 'bride-birthdate',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            binding: 'couple.bride.birthDate',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'left',
              },
            },
          },
          // 직업
          {
            id: 'bride-job',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            binding: 'custom.brideJob',
            value: '직업',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 400,
                color: 'var(--fg-default)',
                textAlign: 'left',
              },
            },
          },
        ],
      },

      // 화살표 장식 (absolute within group)
      {
        id: 'bride-arrow',
        type: 'image',
        layoutMode: 'absolute',
        x: 32,
        y: 38,
        width: 25,
        height: 12,
        zIndex: 2,
        value: ARROW_R_TO_L,
        props: { type: 'image', objectFit: 'contain' },
      },

      // 원형 사진 컨테이너
      {
        id: 'bride-photo-container',
        type: 'group',
        zIndex: 1,
        sizing: {
          width: { type: 'fixed', value: 140, unit: 'px' },
          height: { type: 'hug' },
        },
        props: {
          type: 'group',
          layout: {
            direction: 'vertical',
            gap: 8,
            alignItems: 'center',
          },
        },
        children: [
          // 원형 사진
          {
            id: 'bride-photo',
            type: 'image',
            zIndex: 1,
            sizing: {
              width: { type: 'fixed', value: 140, unit: 'px' },
              height: { type: 'fixed', value: 140, unit: 'px' },
            },
            binding: 'couple.bride.photo',
            props: { type: 'image', objectFit: 'cover' },
            style: {
              border: { width: 0, color: 'transparent', style: 'solid', radius: 9999 },
              background: 'var(--bg-card)',
            },
          },
          // MBTI (이미지 중앙 하단에 겹침)
          {
            id: 'bride-mbti',
            type: 'text',
            layoutMode: 'absolute',
            x: 0,
            y: 90,
            width: 100,
            height: 20,
            zIndex: 2,
            binding: 'couple.bride.mbti',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: 24,
                fontWeight: 600,
                color: 'var(--accent-default)',
                textAlign: 'center',
              },
            },
          },
        ],
      },
    ],
  },
]

// ============================================
// 프리셋 Export
// ============================================
export const PROFILE_CIRCLE_PORTRAIT: BlockPreset = {
  id: 'profile-circle-portrait',
  blockType: 'profile',
  variant: 'circle-portrait',
  name: 'Circle Portrait',
  nameKo: '서클 포트레이트',
  description: '원형 사진과 화살표 장식으로 신랑신부를 소개하는 캐주얼한 프로필 레이아웃 (Auto Layout)',
  tags: ['casual', 'circle', 'portrait', 'arrow', 'mbti', 'light', 'playful', 'profile', 'about-us', 'auto-layout'],
  complexity: 'medium',
  bindings: [
    'couple.groom.name',
    'couple.groom.photo',
    'couple.groom.birthDate',
    'couple.groom.mbti',
    'couple.bride.name',
    'couple.bride.photo',
    'couple.bride.birthDate',
    'couple.bride.mbti',
    'custom.groomJob',
    'custom.brideJob',
  ],
  defaultHeight: HUG_HEIGHT,
  layout: {
    ...AUTO_LAYOUT_VERTICAL,
    gap: 40,
    padding: { top: 60, right: 24, bottom: 60, left: 24 },
  },
  defaultElements: ELEMENTS,
  specialComponents: ['circle-photo', 'arrow-decoration', 'group'],
  recommendedAnimations: ['fade-in', 'slide-in-left', 'slide-in-right', 'stagger-fade-up'],
  recommendedThemes: ['simple-blue', 'modern-mono', 'minimal-light'],
  aiHints: {
    mood: ['casual', 'playful', 'friendly', 'modern'],
    style: ['circle-photo', 'arrow-decoration', 'mbti-display', 'auto-layout'],
    useCase: ['커플 소개', 'About Us', '프로필 정보', '신랑신부 소개', 'MBTI 소개'],
  },
  relatedPresets: ['profile-split-photo', 'profile-dual-card'],
}

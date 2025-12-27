/**
 * Wreath Block - Decline Preset
 *
 * 꽃 장식과 함께 화환을 정중히 사양하는 안내 블록
 * 하트 중심의 대칭 꽃 장식 + 2줄 텍스트 구성
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'

// ============================================
// Default Elements
// ============================================

const WREATH_DECLINE_ELEMENTS: PresetElement[] = [
  // Floral Decoration (Heart + Flowers)
  {
    type: 'image',
    layoutMode: 'auto',
    sizing: {
      width: { type: 'fixed', value: 200, unit: 'px' },
      height: { type: 'fixed', value: 120, unit: 'px' },
    },
    alignSelf: 'center',
    zIndex: 1,
    value: '/assets/flower1.svg',
    props: {
      type: 'image',
      objectFit: 'contain',
    },
  },
  // Main Title
  {
    type: 'text',
    layoutMode: 'auto',
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    zIndex: 1,
    value: '화환은 정중히 사양합니다.',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 20,
        fontWeight: 600,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.5,
      },
    },
  },
  // Subtitle / Thank you message
  {
    type: 'text',
    layoutMode: 'auto',
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    zIndex: 1,
    value: '따뜻한 마음에 깊이 감사드립니다.',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 20,
        fontWeight: 600,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.5,
      },
    },
  },
]

// ============================================
// Wreath Decline Preset
// ============================================

export const WREATH_DECLINE: BlockPreset = {
  id: 'wreath-decline',
  blockType: 'wreath',
  variant: 'decline',
  name: 'Decline',
  nameKo: '화환 사양',
  description: '꽃 장식과 함께 화환을 정중히 사양하는 안내 블록. 하트 중심의 대칭 꽃 장식과 감사 메시지로 구성됩니다.',
  tags: ['wreath', 'decline', 'floral', 'centered', 'elegant', 'auto-layout'],
  complexity: 'low',
  bindings: [],
  defaultHeight: HUG_HEIGHT,
  layout: {
    ...AUTO_LAYOUT_VERTICAL,
    gap: 12,
    padding: { top: 48, right: 24, bottom: 48, left: 24 },
  },
  defaultElements: WREATH_DECLINE_ELEMENTS,
  specialComponents: [],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['minimal-light', 'classic-ivory', 'romantic-blush'],
  aiHints: {
    mood: ['elegant', 'grateful', 'polite'],
    style: ['floral', 'centered', 'simple'],
    useCase: ['화환사양', '화환거절', '화환안내'],
  },
}

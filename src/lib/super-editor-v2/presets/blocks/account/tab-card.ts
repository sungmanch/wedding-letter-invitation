/**
 * Account Block - Tab Card Preset
 *
 * 신랑측/신부측 탭으로 전환하며 카드 형태로 계좌 정보를 표시합니다.
 * 각 카드에는 계좌번호, 예금주, 복사 버튼, 카카오페이 버튼이 포함됩니다.
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'
import { FONT_SIZE } from '../tokens'

// ============================================
// Default Elements
// ============================================

const ACCOUNT_TAB_CARD_ELEMENTS: PresetElement[] = [
  // English Section Label
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'custom.accountEngTitle',
    value: 'ACCOUNT',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.base,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        letterSpacing: 0.2,
      },
    },
  },
  // Korean Title
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'custom.accountTitle',
    value: '마음 전하는 곳',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: FONT_SIZE['3xl'],
        fontWeight: 600,
        color: 'var(--fg-emphasis)',
        textAlign: 'center',
      },
    },
  },
  // Description
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'custom.accountDescription',
    value: '참석이 어려운 분들을 위해 안내드립니다.\n너그러운 마음으로 양해 부탁드립니다.',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.body,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
]

// ============================================
// Account Tab Card Preset
// ============================================

export const ACCOUNT_TAB_CARD: BlockPreset = {
  id: 'account-tab-card',
  blockType: 'account',
  variant: 'tab-card',
  name: 'Tab Card',
  nameKo: '탭 카드형',
  description: '신랑측/신부측 탭으로 전환하며 카드 형태로 계좌 정보를 표시합니다',
  tags: ['minimal', 'tab', 'card', 'modern', 'auto-layout'],
  complexity: 'medium',
  bindings: [
    'accounts.groom',
    'accounts.bride',
    'accounts.kakaopay.groom',
    'accounts.kakaopay.bride',
    'custom.accountEngTitle',
    'custom.accountTitle',
    'custom.accountDescription',
  ],
  defaultHeight: HUG_HEIGHT,
  layout: AUTO_LAYOUT_VERTICAL,
  defaultElements: ACCOUNT_TAB_CARD_ELEMENTS,
  specialComponents: ['account-tab-view'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['minimal-light', 'modern-mono'],
  aiHints: {
    mood: ['minimal', 'clean', 'professional'],
    style: ['tab-navigation', 'card-list', 'rounded-buttons'],
    useCase: ['account-info', 'money-transfer', 'kakaopay'],
  },
}

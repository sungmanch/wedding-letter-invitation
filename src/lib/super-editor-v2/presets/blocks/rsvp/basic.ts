/**
 * RSVP Block - Basic Preset
 *
 * 심플한 중앙 정렬 RSVP 섹션
 * 팝업 모달을 트리거하는 기본형
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'

// ============================================
// Default Elements
// ============================================

const RSVP_BASIC_ELEMENTS: PresetElement[] = [
  // English Title (R.S.V.P.)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'custom.rsvpEngTitle',
    value: 'R.S.V.P.',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-accent)',
        fontSize: 14,
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
    binding: 'rsvp.title',
    value: '참석 의사 전달',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 24,
        fontWeight: 600,
        color: 'var(--fg-emphasis)',
        textAlign: 'center',
      },
    },
  },
  // Description (hug 모드로 텍스트 길이에 맞게 확장)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'rsvp.description',
    value: '신랑, 신부에게 참석의사를\n미리 전달할 수 있어요.',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 16,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // CTA Button
  {
    type: 'button',
    zIndex: 1,
    sizing: { width: { type: 'fixed', value: 70, unit: '%' }, height: { type: 'hug' } },
    alignSelf: 'center',
    props: {
      type: 'button',
      label: '✓ 참석 의사 전달하기',
      action: 'rsvp-modal',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 16,
        fontWeight: 500,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
      background: 'var(--bg-card)',
      border: { width: 0, color: 'transparent', style: 'solid', radius: 50 },
      shadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
  },
]

// ============================================
// RSVP Basic Preset
// ============================================

export const RSVP_BASIC: BlockPreset = {
  id: 'rsvp-basic',
  blockType: 'rsvp',
  variant: 'basic',
  name: 'Basic RSVP',
  nameKo: '기본형',
  description: '심플한 중앙 정렬 RSVP 섹션으로 팝업 모달을 트리거합니다',
  tags: ['minimal', 'centered', 'light', 'simple', 'auto-layout'],
  complexity: 'low',
  bindings: ['rsvp.title', 'rsvp.description', 'custom.rsvpEngTitle'],
  defaultHeight: HUG_HEIGHT,
  layout: AUTO_LAYOUT_VERTICAL,
  defaultElements: RSVP_BASIC_ELEMENTS,
  specialComponents: ['rsvp-modal'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['minimal-light', 'classic-ivory'],
  aiHints: {
    mood: ['minimal', 'clean', 'simple'],
    style: ['centered', 'card-button', 'light-background'],
    useCase: ['popup-trigger', 'rsvp-collection'],
  },

  // Modal Design
  modal: {
    style: {
      background: 'var(--bg-card)',
      borderRadius: 16,
      padding: 24,
    },

    header: {
      title: '참석 의사 전달',
      showCloseButton: true,
      style: {
        text: {
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-lg)',
          fontWeight: 600,
          color: 'var(--fg-emphasis)',
        },
      },
    },

    sections: [
      {
        id: 'attendance',
        label: '가능 여부를 선택해 주세요.',
        type: 'toggle',
        options: [
          { value: 'yes', label: '가능', icon: '✓' },
          { value: 'no', label: '불가' },
        ],
        style: {
          activeBackground: 'var(--fg-default)',
          activeColor: 'var(--fg-inverse)',
          inactiveBackground: 'transparent',
          inactiveColor: 'var(--fg-muted)',
          borderColor: 'var(--border-default)',
        },
      },
      {
        id: 'side',
        label: '신랑 & 신부에게 전달될 정보를 입력해 주세요.',
        type: 'tab',
        options: [
          { value: 'groom', label: '신랑측', icon: '👤' },
          { value: 'bride', label: '신부측', icon: '👤' },
        ],
        style: {
          activeBackground: 'transparent',
          activeBorderColor: 'var(--accent-default)',
          inactiveBorderColor: 'var(--border-muted)',
        },
      },
      {
        id: 'name',
        label: '성함',
        type: 'text-input',
        placeholder: '(필수) 대표자 한 분의 성함을 입력해 주세요.',
        required: true,
        style: {
          labelColor: 'var(--fg-default)',
          inputBorderColor: 'var(--border-default)',
          placeholderColor: 'var(--fg-muted)',
        },
      },
      {
        id: 'bus',
        label: '버스 탑승 여부',
        type: 'radio',
        options: [
          { value: 'yes', label: '탑승함' },
          { value: 'no', label: '탑승안함' },
        ],
        style: {
          activeColor: 'var(--fg-default)',
          inactiveColor: 'var(--fg-muted)',
        },
      },
      {
        id: 'privacy',
        type: 'checkbox',
        label: '개인정보 수집 및 이용 동의(필수)',
        description:
          '참석여부 전달을 위한 개인정보 수집 및 이용에 동의해주세요.\n항목: 성함,연락처,동행인 성함 · 보유기간: 청첩장 이용 종료시 까지',
        required: true,
        style: {
          labelColor: 'var(--fg-default)',
          descriptionColor: 'var(--fg-muted)',
          checkboxColor: 'var(--accent-default)',
        },
      },
    ],

    submitButton: {
      label: '신랑 & 신부에게 전달하기',
      style: {
        background: 'var(--fg-default)',
        color: 'var(--fg-inverse)',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-base)',
        fontWeight: 600,
        borderRadius: 8,
        padding: '16px 24px',
      },
    },
  },
}

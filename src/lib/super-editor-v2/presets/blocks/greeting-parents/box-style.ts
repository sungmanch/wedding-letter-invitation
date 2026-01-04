/**
 * Greeting Parents Block - Box Style Preset
 *
 * 혼주 정보를 라운드 카드 박스 안에 배치하고,
 * "의 아들/딸"을 핑크 강조색으로 표시하는 모던 레이아웃
 * Absolute 레이아웃
 */

import type { BlockPreset, PresetElement } from '../types'
import { FONT_SIZE } from '../tokens'

const ELEMENTS: PresetElement[] = [
  // 1. 영문 레이블 "INVITATION" (핑크 강조)
  {
    type: 'text',
    x: 10,
    y: 4,
    width: 80,
    height: 4,
    zIndex: 1,
    value: 'INVITATION',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-accent)',
        fontSize: FONT_SIZE.sm,
        fontWeight: 400,
        color: 'var(--accent-default)',
        textAlign: 'center',
        lineHeight: 1.4,
        letterSpacing: 0.15,
      },
    },
  },
  // 2. 메인 제목 "소중한 분들을 초대합니다."
  {
    type: 'text',
    x: 10,
    y: 11,
    width: 80,
    height: 7,
    zIndex: 1,
    binding: 'greeting.title',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: FONT_SIZE['2xl'],
        fontWeight: 400,
        color: 'var(--fg-emphasis)',
        textAlign: 'center',
        lineHeight: 1.5,
        letterSpacing: 0.02,
      },
    },
  },
  // 3. 인사말 본문
  {
    type: 'text',
    x: 10,
    y: 21,
    width: 80,
    height: 35,
    zIndex: 1,
    binding: 'greeting.content',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.body,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.9,
        letterSpacing: 0.01,
      },
    },
  },
  // 4. 혼주 카드 배경
  {
    type: 'shape',
    x: 10,
    y: 58,
    width: 80,
    height: 14,
    zIndex: 0,
    props: {
      type: 'shape',
      shape: 'rectangle',
      fill: 'var(--bg-card)',
    },
    style: {
      border: {
        width: 0,
        color: 'transparent',
        style: 'solid',
        radius: 12,
      },
    },
  },
  // 5. 신랑측 혼주 정보
  {
    type: 'text',
    x: 12,
    y: 58,
    width: 76,
    height: 8,
    zIndex: 1,
    props: {
      type: 'text',
      format:
        '{parents.groom.father.name} · {parents.groom.mother.name}의 {parents.groom.birthOrder}  {couple.groom.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.md,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.8,
      },
    },
  },
  // 6. 신부측 혼주 정보
  {
    type: 'text',
    x: 12,
    y: 64,
    width: 76,
    height: 8,
    zIndex: 1,
    props: {
      type: 'text',
      format:
        '{parents.bride.father.name} · {parents.bride.mother.name}의 {parents.bride.birthOrder}  {couple.bride.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.md,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.8,
      },
    },
  },
  // 7. 축하 연락하기 버튼 (contact-modal)
  {
    type: 'button',
    x: 15,
    y: 78,
    width: 70,
    height: 6,
    zIndex: 1,
    props: {
      type: 'button',
      label: '📞  축하 연락하기',
      action: 'contact-modal',
    },
    style: {
      background: 'var(--bg-section)',
      border: {
        width: 1,
        color: 'var(--border-default)',
        style: 'solid',
        radius: 8,
      },
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.body,
        fontWeight: 500,
        color: 'var(--fg-default)',
      },
    },
  },
]

export const GREETING_PARENTS_BOX_STYLE: BlockPreset = {
  id: 'greeting-parents-box-style',
  blockType: 'greeting-parents',
  variant: 'box-style',
  name: 'Box Style',
  nameKo: '박스 스타일',
  description:
    '혼주 정보를 라운드 카드 박스 안에 배치하고, "의 아들/딸"을 핑크 강조색으로 표시하는 모던 레이아웃',
  tags: [
    'minimal',
    'modern',
    'card-style',
    'pink-accent',
    'centered',
    'box-parents',
    'with-contact',
  ],
  complexity: 'low',
  bindings: [
    'greeting.title',
    'greeting.content',
    'couple.groom.name',
    'couple.groom.phone',
    'couple.bride.name',
    'couple.bride.phone',
    'parents.groom.birthOrder',
    'parents.groom.father.name',
    'parents.groom.father.phone',
    'parents.groom.mother.name',
    'parents.groom.mother.phone',
    'parents.bride.birthOrder',
    'parents.bride.father.name',
    'parents.bride.father.phone',
    'parents.bride.mother.name',
    'parents.bride.mother.phone',
  ],
  defaultHeight: 100,
  defaultElements: ELEMENTS,
  specialComponents: ['contact-modal'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['minimal-light', 'classic-ivory', 'romantic-blush'],
  relatedPresets: ['contact-minimal'],
  aiHints: {
    mood: ['minimal', 'modern', 'clean', 'elegant'],
    style: ['centered', 'card-layout', 'accent-highlight', 'boxed'],
    useCase: ['modern-wedding', 'simple-invitation', 'pink-theme'],
  },
}

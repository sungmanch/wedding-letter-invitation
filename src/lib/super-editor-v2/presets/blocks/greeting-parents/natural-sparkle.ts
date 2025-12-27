/**
 * Greeting Parents Block - Natural Sparkle Preset
 *
 * 올리브 그린 강조와 별 장식이 있는 자연스러운 인사말 레이아웃
 * Auto Layout + Absolute 장식 요소 혼합
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'

const ELEMENTS: PresetElement[] = [
  // ─── Auto Layout 콘텐츠 ───
  // 1. 제목 "소중한 분들을 초대합니다." (올리브 그린 강조)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'greeting.title',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 20,
        fontWeight: 500,
        color: 'var(--accent-secondary)',
        textAlign: 'center',
        lineHeight: 1.4,
        letterSpacing: 0.02,
      },
    },
  },
  // 2. 인사말 본문 (hug 모드로 텍스트 길이에 맞게 확장)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    constraints: { minHeight: 120 },
    binding: 'greeting.content',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 2.0,
        letterSpacing: 0.01,
      },
    },
  },
  // 3. 신랑측 혼주 정보
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'text',
      format:
        '{parents.groom.father.name} · {parents.groom.mother.name}의 {parents.groom.birthOrder} {couple.groom.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // 4. 신부측 혼주 정보
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'text',
      format:
        '{parents.bride.father.name} · {parents.bride.mother.name}의 {parents.bride.birthOrder} {couple.bride.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // 5. 연락하기 버튼 (contact-modal)
  {
    type: 'button',
    zIndex: 1,
    sizing: { width: { type: 'fixed', value: 60, unit: '%' }, height: { type: 'hug' } },
    alignSelf: 'center',
    props: {
      type: 'button',
      label: '연락하기',
      action: 'contact-modal',
    },
    style: {
      background: 'var(--bg-card)',
      border: {
        width: 1,
        color: 'var(--border-default)',
        style: 'solid',
        radius: 24,
      },
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--fg-default)',
      },
    },
  },
  // ─── Absolute 장식 요소 (별 sparkle) ───
  {
    type: 'shape',
    layoutMode: 'absolute',
    x: 8,
    y: 60,
    width: 4,
    height: 4,
    zIndex: 0,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: 'var(--accent-secondary)',
      svgPath: 'M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z',
    },
  },
  {
    type: 'shape',
    layoutMode: 'absolute',
    x: 85,
    y: 65,
    width: 3,
    height: 3,
    zIndex: 0,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: 'var(--accent-secondary)',
      svgPath: 'M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z',
    },
  },
  {
    type: 'shape',
    layoutMode: 'absolute',
    x: 12,
    y: 85,
    width: 2.5,
    height: 2.5,
    zIndex: 0,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: 'var(--accent-secondary)',
      svgPath: 'M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z',
    },
  },
  {
    type: 'shape',
    layoutMode: 'absolute',
    x: 82,
    y: 80,
    width: 3.5,
    height: 3.5,
    zIndex: 0,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: 'var(--accent-secondary)',
      svgPath: 'M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z',
    },
  },
  {
    type: 'shape',
    layoutMode: 'absolute',
    x: 5,
    y: 75,
    width: 2,
    height: 2,
    zIndex: 0,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: 'var(--accent-secondary)',
      svgPath: 'M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z',
    },
  },
  {
    type: 'shape',
    layoutMode: 'absolute',
    x: 90,
    y: 88,
    width: 2.5,
    height: 2.5,
    zIndex: 0,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: 'var(--accent-secondary)',
      svgPath: 'M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z',
    },
  },
]

export const GREETING_PARENTS_NATURAL_SPARKLE: BlockPreset = {
  id: 'greeting-parents-natural-sparkle',
  blockType: 'greeting-parents',
  variant: 'natural-sparkle',
  name: 'Natural Sparkle',
  nameKo: '내추럴 스파클',
  description:
    '올리브 그린 강조와 별 장식이 있는 자연스러운 인사말 레이아웃. 연락하기 버튼 포함.',
  tags: ['natural', 'elegant', 'sparkle', 'olive', 'contact-button', 'warm', 'auto-layout', 'mixed'],
  complexity: 'medium',
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
  defaultHeight: HUG_HEIGHT,
  layout: AUTO_LAYOUT_VERTICAL,
  defaultElements: ELEMENTS,
  specialComponents: ['contact-modal'],
  recommendedAnimations: ['fade-in', 'stagger-fade'],
  recommendedThemes: ['classic-ivory', 'romantic-garden'],
  aiHints: {
    mood: ['natural', 'warm', 'elegant', 'romantic'],
    style: ['organic', 'fresh', 'inviting', 'decorated'],
    useCase: ['garden-wedding', 'outdoor-ceremony', 'spring-wedding', 'natural-theme'],
  },
}

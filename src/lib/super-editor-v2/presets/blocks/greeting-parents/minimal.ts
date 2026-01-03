/**
 * Greeting Parents Block - Minimal Preset
 *
 * 깔끔하고 미니멀한 중앙 정렬 인사말 레이아웃
 * INVITATION 레이블, 구분선, 연락하기 버튼 포함
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'

const ELEMENTS: PresetElement[] = [
  // 1. 영문 레이블 "INVITATION"
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    value: 'INVITATION',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-accent)',
        fontSize: 12,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        lineHeight: 1.4,
        letterSpacing: 0.15,
      },
    },
  },
  // 2. 메인 제목 "소중한 분들을 초대합니다."
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'greeting.title',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 22,
        fontWeight: 400,
        color: 'var(--fg-emphasis)',
        textAlign: 'center',
        lineHeight: 1.5,
        letterSpacing: 0.02,
      },
    },
  },
  // 3. 인사말 본문 (hug 모드로 텍스트 길이에 맞게 확장)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    constraints: { minHeight: 100 },
    binding: 'greeting.content',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.9,
        letterSpacing: 0.01,
      },
    },
  },
  // 4. 구분선
  {
    type: 'divider',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 1, unit: 'px' } },
    props: {
      type: 'divider',
      dividerStyle: 'solid',
    },
    style: {
      background: 'var(--border-muted)',
    },
  },
  // 5. 신랑측 혼주 정보
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'text',
      format:
        '{parents.groom.father.name} · {parents.groom.mother.name} {parents.groom.birthOrder} {couple.groom.name}',
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
  // 6. 신부측 혼주 정보
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'text',
      format:
        '{parents.bride.father.name} · {parents.bride.mother.name} {parents.bride.birthOrder} {couple.bride.name}',
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
  // 7. 축하 연락하기 버튼 (contact-modal)
  {
    type: 'button',
    zIndex: 1,
    sizing: { width: { type: 'fixed', value: 70, unit: '%' }, height: { type: 'hug' } },
    alignSelf: 'center',
    props: {
      type: 'button',
      label: '축하 연락하기',
      action: 'contact-modal',
    },
    style: {
      background: 'var(--bg-section)',
      border: {
        width: 1,
        color: 'var(--border-default)',
        style: 'solid',
        radius: 4,
      },
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--fg-default)',
      },
    },
  },
]

export const GREETING_PARENTS_MINIMAL: BlockPreset = {
  id: 'greeting-parents-minimal',
  blockType: 'greeting-parents',
  variant: 'minimal',
  name: 'Minimal',
  nameKo: '미니멀',
  description:
    '깔끔하고 미니멀한 중앙 정렬 인사말 레이아웃. INVITATION 레이블, 구분선, 연락하기 버튼 포함.',
  tags: ['minimal', 'clean', 'centered', 'modern', 'simple', 'auto-layout'],
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
  defaultHeight: HUG_HEIGHT,
  layout: AUTO_LAYOUT_VERTICAL,
  defaultElements: ELEMENTS,
  specialComponents: ['contact-modal'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['minimal-light', 'classic-ivory'],
  relatedPresets: ['contact-minimal'],
  aiHints: {
    mood: ['minimal', 'clean', 'modern', 'elegant'],
    style: ['simple', 'centered', 'balanced', 'understated'],
    useCase: ['modern-wedding', 'simple-invitation', 'minimalist-design'],
  },
}

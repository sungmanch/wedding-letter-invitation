/**
 * Greeting Parents Block - Baptismal Preset
 *
 * 이름과 세례명이 함께 표시되는 카톨릭형 소개
 * Auto Layout (vertical + nested horizontal)
 */

import type { BlockPreset, PresetElement } from '../types'
import type { VariablePath } from '../../../schema/types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'
import { FONT_SIZE } from '../tokens'

// ═══════════════════════════════════════════════
// 공통 스타일
// ═══════════════════════════════════════════════
const PARENT_NAME_STYLE = {
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  fontWeight: 400,
  color: 'var(--fg-default)',
  textAlign: 'center' as const,
  lineHeight: 1.4,
}

const BAPTISMAL_NAME_STYLE = {
  fontFamily: 'var(--font-body)',
  fontSize: FONT_SIZE.xs,
  fontWeight: 400,
  color: 'var(--fg-muted)',
  textAlign: 'center' as const,
  lineHeight: 1.2,
}

const COUPLE_NAME_STYLE = {
  fontFamily: 'var(--font-heading)',
  fontSize: 15,
  fontWeight: 500,
  color: 'var(--fg-emphasis)',
  textAlign: 'center' as const,
  lineHeight: 1.4,
}

// ═══════════════════════════════════════════════
// 부모 + 세례명 컨테이너 (세로 배치: 이름 위, 세례명 아래)
// ═══════════════════════════════════════════════
const createParentWithBaptismal = (
  nameBinding: VariablePath,
  baptismalBinding: VariablePath
): PresetElement => ({
  type: 'group',
  zIndex: 1,
  sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
  props: {
    type: 'group',
    layout: {
      direction: 'vertical',
      gap: 2,
      alignItems: 'center',
    },
  },
  children: [
    {
      type: 'text',
      zIndex: 1,
      sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
      binding: nameBinding,
      props: { type: 'text' },
      style: { text: PARENT_NAME_STYLE },
    },
    {
      type: 'text',
      zIndex: 1,
      sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
      binding: baptismalBinding,
      props: { type: 'text' },
      style: { text: BAPTISMAL_NAME_STYLE },
    },
  ],
})

// ═══════════════════════════════════════════════
// 신랑/신부 + 세례명 컨테이너
// ═══════════════════════════════════════════════
const createCoupleWithBaptismal = (
  nameBinding: VariablePath,
  baptismalBinding: VariablePath
): PresetElement => ({
  type: 'group',
  zIndex: 1,
  sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
  props: {
    type: 'group',
    layout: {
      direction: 'vertical',
      gap: 2,
      alignItems: 'center',
    },
  },
  children: [
    {
      type: 'text',
      zIndex: 1,
      sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
      binding: nameBinding,
      props: { type: 'text' },
      style: { text: COUPLE_NAME_STYLE },
    },
    {
      type: 'text',
      zIndex: 1,
      sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
      binding: baptismalBinding,
      props: { type: 'text' },
      style: { text: BAPTISMAL_NAME_STYLE },
    },
  ],
})

// ═══════════════════════════════════════════════
// 구분점 요소
// ═══════════════════════════════════════════════
const SEPARATOR_DOT: PresetElement = {
  type: 'text',
  zIndex: 1,
  sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
  value: '·',
  props: { type: 'text' },
  style: { text: PARENT_NAME_STYLE },
}

// ═══════════════════════════════════════════════
// 혼주 한 줄 (부모1 · 부모2 의 서열 신랑/신부)
// ═══════════════════════════════════════════════
const createFamilyRow = (side: 'groom' | 'bride'): PresetElement => ({
  type: 'group',
  zIndex: 1,
  sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
  props: {
    type: 'group',
    layout: {
      direction: 'horizontal',
      gap: 6,
      alignItems: 'start',
      justifyContent: 'center',
    },
  },
  children: [
    // 아버지 (이름 + 세례명)
    createParentWithBaptismal(
      `parents.${side}.father.name` as VariablePath,
      `parents.${side}.father.baptismalName` as VariablePath
    ),
    // 구분점
    SEPARATOR_DOT,
    // 어머니 (이름 + 세례명)
    createParentWithBaptismal(
      `parents.${side}.mother.name` as VariablePath,
      `parents.${side}.mother.baptismalName` as VariablePath
    ),
    // "의 서열"
    {
      type: 'text',
      zIndex: 1,
      sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
      props: {
        type: 'text',
        format: `의 {parents.${side}.birthOrder}`,
      },
      style: {
        text: {
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          fontWeight: 400,
          color: 'var(--fg-muted)',
          textAlign: 'center',
          lineHeight: 1.4,
        },
      },
    },
    // 신랑/신부 (이름 + 세례명)
    createCoupleWithBaptismal(
      `couple.${side}.name` as VariablePath,
      `couple.${side}.baptismalName` as VariablePath
    ),
  ],
})

const ELEMENTS: PresetElement[] = [
  // 1. 메인 제목
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
        fontWeight: 400,
        color: 'var(--fg-emphasis)',
        textAlign: 'center',
        lineHeight: 1.5,
        letterSpacing: 0.02,
      },
    },
  },
  // 2. 인사말 본문
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
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.9,
        letterSpacing: 0.01,
      },
    },
  },
  // 3. 구분선
  {
    type: 'divider',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 1, unit: 'px' } },
    props: { type: 'divider', dividerStyle: 'solid' },
    style: { background: 'var(--border-muted)' },
  },
  // 4. 신랑측 혼주 정보
  createFamilyRow('groom'),
  // 5. 신부측 혼주 정보
  createFamilyRow('bride'),
  // 6. 축하 연락하기 버튼 (contact-modal)
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

export const GREETING_PARENTS_BAPTISMAL: BlockPreset = {
  id: 'greeting-parents-baptismal',
  blockType: 'greeting-parents',
  variant: 'baptismal',
  name: 'Baptismal',
  nameKo: '카톨릭',
  description: '이름과 세례명이 함께 표시되는 카톨릭형 소개',
  tags: ['catholic', 'baptismal', 'religious', 'minimal', 'clean', 'centered', 'auto-layout'],
  complexity: 'medium',
  bindings: [
    'greeting.title',
    'greeting.content',
    // 신랑측
    'couple.groom.name',
    'couple.groom.baptismalName',
    'parents.groom.birthOrder',
    'parents.groom.father.name',
    'parents.groom.father.baptismalName',
    'parents.groom.mother.name',
    'parents.groom.mother.baptismalName',
    // 신부측
    'couple.bride.name',
    'couple.bride.baptismalName',
    'parents.bride.birthOrder',
    'parents.bride.father.name',
    'parents.bride.father.baptismalName',
    'parents.bride.mother.name',
    'parents.bride.mother.baptismalName',
  ],
  defaultHeight: HUG_HEIGHT,
  layout: AUTO_LAYOUT_VERTICAL,
  defaultElements: ELEMENTS,
  specialComponents: ['contact-modal'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['hero-minimal-overlay', 'hero-classic-elegant'],
  relatedPresets: ['contact-minimal'],
  aiHints: {
    mood: ['religious', 'traditional', 'reverent', 'elegant'],
    style: ['centered', 'clean', 'formal', 'auto-layout'],
    useCase: ['catholic-wedding', 'christian-wedding', 'religious-ceremony', 'baptismal-name'],
  },
}

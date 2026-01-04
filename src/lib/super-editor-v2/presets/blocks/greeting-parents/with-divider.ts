/**
 * Greeting Parents Block - With Divider Preset
 *
 * 제목과 본문 사이에 구분선이 있는 클래식한 인사말 레이아웃
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'
import { FONT_SIZE } from '../tokens'

const ELEMENTS: PresetElement[] = [
  // 1. 제목
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'greeting.title',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: FONT_SIZE['3xl'],
        fontWeight: 400,
        color: 'var(--fg-emphasis)',
        textAlign: 'center',
        lineHeight: 1.4,
        letterSpacing: 0.02,
      },
    },
  },
  // 2. 구분선
  {
    type: 'divider',
    zIndex: 1,
    sizing: { width: { type: 'fixed', value: 60, unit: '%' }, height: { type: 'fixed', value: 1, unit: 'px' } },
    alignSelf: 'center',
    props: {
      type: 'divider',
      dividerStyle: 'solid',
    },
    style: {
      background: 'var(--border-muted)',
    },
  },
  // 3. 인사말 본문 (hug 모드로 텍스트 길이에 맞게 확장)
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
        fontSize: FONT_SIZE.md,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.8,
        letterSpacing: 0.01,
      },
    },
  },
  // 4. 신랑측 혼주
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'text',
      format:
        '{parents.groom.father.name}·{parents.groom.mother.name}의 {parents.groom.birthOrder} {couple.groom.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.base,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // 5. 신부측 혼주
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'text',
      format:
        '{parents.bride.father.name}·{parents.bride.mother.name}의 {parents.bride.birthOrder} {couple.bride.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.base,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
]

export const GREETING_PARENTS_WITH_DIVIDER: BlockPreset = {
  id: 'greeting-parents-with-divider',
  blockType: 'greeting-parents',
  variant: 'with-divider',
  name: 'With Divider',
  nameKo: '클래식 구분선',
  description: '제목과 본문 사이에 구분선이 있는 클래식한 인사말 레이아웃',
  tags: ['classic', 'minimal', 'centered', 'with-divider', 'serif', 'auto-layout'],
  complexity: 'low',
  bindings: [
    'greeting.title',
    'greeting.content',
    'couple.groom.name',
    'couple.bride.name',
    'parents.groom.birthOrder',
    'parents.groom.father.name',
    'parents.groom.mother.name',
    'parents.bride.birthOrder',
    'parents.bride.father.name',
    'parents.bride.mother.name',
  ],
  defaultHeight: HUG_HEIGHT,
  layout: AUTO_LAYOUT_VERTICAL,
  defaultElements: ELEMENTS,
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['classic-ivory', 'minimal-light'],
  aiHints: {
    mood: ['elegant', 'traditional', 'formal'],
    style: ['clean', 'simple', 'timeless'],
    useCase: ['traditional-wedding', 'classic-invitation', 'formal-ceremony'],
  },
}

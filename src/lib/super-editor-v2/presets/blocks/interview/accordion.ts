/**
 * Interview Block - Accordion Preset
 *
 * 인터뷰 Q&A를 아코디언 형태로 표시하는 레이아웃
 * - 섹션 제목 (우리 두 사람의 이야기)
 * - 섹션 설명
 * - 아코디언 컴포넌트 (InterviewAccordion)
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'
import { FONT_SIZE } from '../tokens'

const ELEMENTS: PresetElement[] = [
  // 섹션 제목
  {
    id: 'interview-title',
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'interview.title',
    value: '우리 두 사람의 이야기',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: FONT_SIZE.xl,
        fontWeight: 500,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },
  // 섹션 설명
  {
    id: 'interview-subtitle',
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'interview.subtitle',
    value: '결혼을 앞두고 저희 두 사람의\n인터뷰를 준비했습니다.',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.base,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // 아코디언 플레이스홀더 (렌더러에서 InterviewAccordion으로 대체)
  {
    id: 'interview-accordion',
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'interview.items',
    props: {
      type: 'group',
      layout: {
        direction: 'vertical',
        gap: 0,
      },
      hideWhenEmpty: true,
    },
    // 렌더러에서 이 요소를 InterviewAccordion 컴포넌트로 대체
    // data-component="interview-accordion" 속성으로 식별
    children: [],
  },
]

export const INTERVIEW_ACCORDION: BlockPreset = {
  id: 'interview-accordion',
  blockType: 'interview',
  variant: 'accordion',
  name: 'Accordion',
  nameKo: '아코디언',
  description: '인터뷰 Q&A를 아코디언 형태로 표시하는 레이아웃',
  tags: ['interview', 'qa', 'accordion', 'storytelling', 'auto-layout'],
  complexity: 'low',
  bindings: [
    'interview.title',
    'interview.subtitle',
    'interview.items',
  ],
  defaultHeight: HUG_HEIGHT,
  layout: AUTO_LAYOUT_VERTICAL,
  defaultElements: ELEMENTS,
  specialComponents: ['interview-accordion'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['simple-pink', 'simple-coral', 'minimal-light'],
  aiHints: {
    mood: ['warm', 'personal', 'storytelling'],
    style: ['accordion', 'collapsible', 'qa-format'],
    useCase: ['커플 인터뷰', 'Q&A', '이야기'],
  },
  relatedPresets: ['profile-dual-card', 'profile-dual-card-interview'],
}

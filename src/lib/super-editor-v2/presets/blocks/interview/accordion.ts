/**
 * Interview Block - Accordion Preset
 *
 * 인터뷰 Q&A를 아코디언 형태로 표시하는 레이아웃
 * - 섹션 제목 (우리 두 사람의 이야기)
 * - 섹션 설명
 * - 아코디언 컴포넌트 (InterviewAccordion)
 *
 * 데이터 구조:
 * interview: {
 *   title: string,           // "우리 두 사람의 이야기"
 *   subtitle: string,        // 설명 텍스트
 *   items: Array<{           // Q&A 배열 (최대 5개)
 *     question: string,      // "첫인상은 어땠나요?"
 *     groomAnswer: string,   // 신랑 답변
 *     brideAnswer: string    // 신부 답변
 *   }>
 * }
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
  // InterviewAccordion 컴포넌트는 auto-layout-block.tsx에서 직접 렌더링
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
  recommendedThemes: ['simple-pink', 'simple-coral', 'hero-minimal-overlay'],
  aiHints: {
    mood: ['warm', 'personal', 'storytelling'],
    style: ['accordion', 'collapsible', 'qa-format'],
    useCase: ['커플 인터뷰', 'Q&A', '이야기'],
  },
  relatedPresets: ['profile-dual-card', 'profile-dual-card-interview'],
}

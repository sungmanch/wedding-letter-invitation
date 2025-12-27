/**
 * Greeting Parents Block - Baptismal Preset
 *
 * 이름과 세례명이 함께 표시되는 카톨릭형 소개
 * Absolute 레이아웃 (복잡한 2행 구조)
 */

import type { BlockPreset, PresetElement } from '../types'

const ELEMENTS: PresetElement[] = [
  // 2. 메인 제목
  {
    type: 'text',
    x: 10,
    y: 9,
    width: 80,
    height: 6,
    zIndex: 1,
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
  // 3. 인사말 본문
  {
    type: 'text',
    x: 10,
    y: 18,
    width: 80,
    height: 20,
    zIndex: 1,
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
  // 4. 구분선
  {
    type: 'divider',
    x: 10,
    y: 42,
    width: 80,
    height: 0.3,
    zIndex: 1,
    props: { type: 'divider', dividerStyle: 'solid' },
    style: { background: 'var(--border-muted)' },
  },
  // ═══════════════════════════════════════════════
  // 신랑측 (이름 + 세례명 - 중앙 정렬)
  // ═══════════════════════════════════════════════
  // 5. 신랑 아버지 이름
  {
    type: 'text',
    x: 10,
    y: 47,
    width: 16,
    height: 5,
    zIndex: 1,
    binding: 'parents.groom.father.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.4,
      },
    },
  },
  // 6. 신랑 아버지 세례명
  {
    type: 'text',
    x: 10,
    y: 52,
    width: 16,
    height: 3,
    zIndex: 1,
    binding: 'parents.groom.father.baptismalName',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        lineHeight: 1.2,
      },
    },
  },
  // 7. 구분점 ·
  {
    type: 'text',
    x: 26,
    y: 47,
    width: 4,
    height: 5,
    zIndex: 1,
    value: '·',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.4,
      },
    },
  },
  // 8. 신랑 어머니 이름
  {
    type: 'text',
    x: 30,
    y: 47,
    width: 16,
    height: 5,
    zIndex: 1,
    binding: 'parents.groom.mother.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.4,
      },
    },
  },
  // 9. 신랑 어머니 세례명
  {
    type: 'text',
    x: 30,
    y: 52,
    width: 16,
    height: 3,
    zIndex: 1,
    binding: 'parents.groom.mother.baptismalName',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        lineHeight: 1.2,
      },
    },
  },
  // 10. "의" + 서열
  {
    type: 'text',
    x: 46,
    y: 47,
    width: 14,
    height: 5,
    zIndex: 1,
    props: {
      type: 'text',
      format: '의 {parents.groom.birthOrder}',
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
  // 11. 신랑 이름
  {
    type: 'text',
    x: 60,
    y: 47,
    width: 30,
    height: 5,
    zIndex: 1,
    binding: 'couple.groom.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 15,
        fontWeight: 500,
        color: 'var(--fg-emphasis)',
        textAlign: 'center',
        lineHeight: 1.4,
      },
    },
  },
  // 12. 신랑 세례명
  {
    type: 'text',
    x: 60,
    y: 52,
    width: 30,
    height: 3,
    zIndex: 1,
    binding: 'couple.groom.baptismalName',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        lineHeight: 1.2,
      },
    },
  },
  // ═══════════════════════════════════════════════
  // 신부측 (이름 + 세례명 - 중앙 정렬)
  // ═══════════════════════════════════════════════
  // 13. 신부 아버지 이름
  {
    type: 'text',
    x: 10,
    y: 60,
    width: 16,
    height: 5,
    zIndex: 1,
    binding: 'parents.bride.father.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.4,
      },
    },
  },
  // 14. 신부 아버지 세례명
  {
    type: 'text',
    x: 10,
    y: 65,
    width: 16,
    height: 3,
    zIndex: 1,
    binding: 'parents.bride.father.baptismalName',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        lineHeight: 1.2,
      },
    },
  },
  // 15. 구분점 ·
  {
    type: 'text',
    x: 26,
    y: 60,
    width: 4,
    height: 5,
    zIndex: 1,
    value: '·',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.4,
      },
    },
  },
  // 16. 신부 어머니 이름
  {
    type: 'text',
    x: 30,
    y: 60,
    width: 16,
    height: 5,
    zIndex: 1,
    binding: 'parents.bride.mother.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.4,
      },
    },
  },
  // 17. 신부 어머니 세례명
  {
    type: 'text',
    x: 30,
    y: 65,
    width: 16,
    height: 3,
    zIndex: 1,
    binding: 'parents.bride.mother.baptismalName',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        lineHeight: 1.2,
      },
    },
  },
  // 18. "의" + 서열
  {
    type: 'text',
    x: 46,
    y: 60,
    width: 14,
    height: 5,
    zIndex: 1,
    props: {
      type: 'text',
      format: '의 {parents.bride.birthOrder}',
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
  // 19. 신부 이름
  {
    type: 'text',
    x: 60,
    y: 60,
    width: 30,
    height: 5,
    zIndex: 1,
    binding: 'couple.bride.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 15,
        fontWeight: 500,
        color: 'var(--fg-emphasis)',
        textAlign: 'center',
        lineHeight: 1.4,
      },
    },
  },
  // 20. 신부 세례명
  {
    type: 'text',
    x: 60,
    y: 65,
    width: 30,
    height: 3,
    zIndex: 1,
    binding: 'couple.bride.baptismalName',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        lineHeight: 1.2,
      },
    },
  },
  // 9. 축하 연락하기 버튼
  {
    type: 'button',
    x: 20,
    y: 78,
    width: 60,
    height: 7,
    zIndex: 1,
    props: {
      type: 'button',
      label: '📞 축하 연락하기',
      action: 'show-block',
      targetBlockType: 'contact',
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
  tags: ['catholic', 'baptismal', 'religious', 'minimal', 'clean', 'centered', 'two-row-parents'],
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
  defaultHeight: 100,
  defaultElements: ELEMENTS,
  specialComponents: ['contact-block'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['minimal-light', 'classic-ivory'],
  relatedPresets: ['contact-minimal'],
  aiHints: {
    mood: ['religious', 'traditional', 'reverent', 'elegant'],
    style: ['centered', 'clean', 'formal', 'two-row'],
    useCase: ['catholic-wedding', 'christian-wedding', 'religious-ceremony', 'baptismal-name'],
  },
}

/**
 * Contact Block - Minimal Preset
 *
 * 깔끔한 카드형 연락처 오버레이
 * 신랑측/신부측 탭 전환, 전화하기/문자 보내기 버튼 포함
 */

import type { BlockPreset, PresetElement } from '../types'

// ============================================
// Default Elements
// ============================================

const MINIMAL_CONTACT_ELEMENTS: PresetElement[] = [
  // 1. 닫기 버튼
  {
    type: 'button',
    x: 85,
    y: 2,
    width: 10,
    height: 5,
    zIndex: 10,
    props: {
      type: 'button',
      label: '✕',
      action: 'show-block', // 자기 자신을 닫음
      targetBlockType: 'contact',
    },
    style: {
      background: 'transparent',
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 20,
        fontWeight: 300,
        color: 'var(--fg-muted)',
      },
    },
  },
  // 2. 제목 "축하 연락하기"
  {
    type: 'text',
    x: 8,
    y: 8,
    width: 84,
    height: 6,
    zIndex: 1,
    value: '축하 연락하기',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 22,
        fontWeight: 600,
        color: 'var(--fg-emphasis)',
        textAlign: 'left',
        lineHeight: 1.4,
      },
    },
  },
  // 3. 설명 "직접 축하의 마음을 전해보세요."
  {
    type: 'text',
    x: 8,
    y: 15,
    width: 84,
    height: 4,
    zIndex: 1,
    value: '직접 축하의 마음을 전해보세요.',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'left',
        lineHeight: 1.4,
      },
    },
  },
  // 4. 탭 영역 - 신랑측/신부측 토글
  // (실제 구현은 렌더러에서 처리, 여기선 위치/스타일만 정의)
  {
    type: 'shape',
    x: 25,
    y: 22,
    width: 50,
    height: 6,
    zIndex: 1,
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
        radius: 24,
      },
    },
  },
  // 5. 신랑측 탭 버튼
  {
    type: 'button',
    x: 26,
    y: 22.5,
    width: 24,
    height: 5,
    zIndex: 2,
    value: 'groom',
    props: {
      type: 'button',
      label: '신랑측',
      action: 'link', // 탭 전환용 (렌더러에서 처리)
    },
    style: {
      background: 'var(--bg-section)',
      border: {
        width: 0,
        color: 'transparent',
        style: 'solid',
        radius: 20,
      },
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--fg-default)',
      },
    },
  },
  // 6. 신부측 탭 버튼
  {
    type: 'button',
    x: 50,
    y: 22.5,
    width: 24,
    height: 5,
    zIndex: 2,
    value: 'bride',
    props: {
      type: 'button',
      label: '신부측',
      action: 'link',
    },
    style: {
      background: 'transparent',
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--fg-muted)',
      },
    },
  },
  // 7. 연락처 카드 - 신랑 본인
  {
    type: 'shape',
    x: 8,
    y: 32,
    width: 84,
    height: 14,
    zIndex: 1,
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
        radius: 8,
      },
    },
  },
  // 8. 신랑 라벨
  {
    type: 'text',
    x: 12,
    y: 34,
    width: 20,
    height: 4,
    zIndex: 2,
    value: '신랑',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'left',
      },
    },
  },
  // 9. 신랑 이름
  {
    type: 'text',
    x: 60,
    y: 34,
    width: 28,
    height: 4,
    zIndex: 2,
    binding: 'couple.groom.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 500,
        color: 'var(--fg-default)',
        textAlign: 'right',
      },
    },
  },
  // 10. 전화하기 버튼
  {
    type: 'button',
    x: 12,
    y: 40,
    width: 38,
    height: 5,
    zIndex: 2,
    binding: 'couple.groom.phone',
    props: {
      type: 'button',
      label: '전화하기',
      action: 'phone',
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
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--fg-default)',
      },
    },
  },
  // 11. 문자 보내기 버튼
  {
    type: 'button',
    x: 52,
    y: 40,
    width: 38,
    height: 5,
    zIndex: 2,
    binding: 'couple.groom.phone',
    props: {
      type: 'button',
      label: '문자 보내기',
      action: 'link', // sms: 링크로 처리
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
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--fg-default)',
      },
    },
  },
  // 12. 연락처 카드 - 신랑 아버지
  {
    type: 'shape',
    x: 8,
    y: 48,
    width: 84,
    height: 14,
    zIndex: 1,
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
        radius: 8,
      },
    },
  },
  // 13. 신랑 아버지 라벨
  {
    type: 'text',
    x: 12,
    y: 50,
    width: 20,
    height: 4,
    zIndex: 2,
    value: '신랑 아버지',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'left',
      },
    },
  },
  // 14. 신랑 아버지 이름
  {
    type: 'text',
    x: 60,
    y: 50,
    width: 28,
    height: 4,
    zIndex: 2,
    binding: 'parents.groom.father.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 500,
        color: 'var(--fg-default)',
        textAlign: 'right',
      },
    },
  },
  // 15. 전화하기 버튼 (아버지)
  {
    type: 'button',
    x: 12,
    y: 56,
    width: 38,
    height: 5,
    zIndex: 2,
    binding: 'parents.groom.father.phone',
    props: {
      type: 'button',
      label: '전화하기',
      action: 'phone',
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
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--fg-default)',
      },
    },
  },
  // 16. 문자 보내기 버튼 (아버지)
  {
    type: 'button',
    x: 52,
    y: 56,
    width: 38,
    height: 5,
    zIndex: 2,
    binding: 'parents.groom.father.phone',
    props: {
      type: 'button',
      label: '문자 보내기',
      action: 'link',
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
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--fg-default)',
      },
    },
  },
  // 17. 연락처 카드 - 신랑 어머니
  {
    type: 'shape',
    x: 8,
    y: 64,
    width: 84,
    height: 14,
    zIndex: 1,
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
        radius: 8,
      },
    },
  },
  // 18. 신랑 어머니 라벨
  {
    type: 'text',
    x: 12,
    y: 66,
    width: 20,
    height: 4,
    zIndex: 2,
    value: '신랑 어머니',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'left',
      },
    },
  },
  // 19. 신랑 어머니 이름
  {
    type: 'text',
    x: 60,
    y: 66,
    width: 28,
    height: 4,
    zIndex: 2,
    binding: 'parents.groom.mother.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 500,
        color: 'var(--fg-default)',
        textAlign: 'right',
      },
    },
  },
  // 20. 전화하기 버튼 (어머니)
  {
    type: 'button',
    x: 12,
    y: 72,
    width: 38,
    height: 5,
    zIndex: 2,
    binding: 'parents.groom.mother.phone',
    props: {
      type: 'button',
      label: '전화하기',
      action: 'phone',
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
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--fg-default)',
      },
    },
  },
  // 21. 문자 보내기 버튼 (어머니)
  {
    type: 'button',
    x: 52,
    y: 72,
    width: 38,
    height: 5,
    zIndex: 2,
    binding: 'parents.groom.mother.phone',
    props: {
      type: 'button',
      label: '문자 보내기',
      action: 'link',
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
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--fg-default)',
      },
    },
  },
]

// ============================================
// Contact Minimal Preset
// ============================================

export const CONTACT_MINIMAL: BlockPreset = {
  id: 'contact-minimal',
  blockType: 'contact',
  variant: 'minimal',
  name: 'Minimal',
  nameKo: '미니멀',
  description:
    '깔끔한 카드형 연락처 오버레이. 신랑측/신부측 탭 전환, 전화하기/문자 보내기 버튼 포함.',
  tags: ['minimal', 'clean', 'card', 'overlay', 'tab'],
  complexity: 'medium',
  bindings: [
    'couple.groom.name',
    'couple.groom.phone',
    'couple.bride.name',
    'couple.bride.phone',
    'parents.groom.father.name',
    'parents.groom.father.phone',
    'parents.groom.mother.name',
    'parents.groom.mother.phone',
    'parents.bride.father.name',
    'parents.bride.father.phone',
    'parents.bride.mother.name',
    'parents.bride.mother.phone',
  ],
  defaultHeight: 85,
  defaultElements: MINIMAL_CONTACT_ELEMENTS,
  specialComponents: ['tab-toggle', 'phone-action', 'sms-action'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['minimal-light', 'classic-ivory'],
  relatedPresets: ['greeting-parents-minimal'],
  aiHints: {
    mood: ['minimal', 'clean', 'functional'],
    style: ['card-based', 'tabbed', 'accessible'],
    useCase: ['contact-overlay', 'phone-directory', 'family-contacts'],
  },
}

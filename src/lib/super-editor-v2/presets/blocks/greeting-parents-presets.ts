/**
 * Super Editor v2 - Greeting Parents Block Presets
 *
 * 인사말 + 혼주정보 블록 프리셋
 * Phase 4: Auto Layout 마이그레이션 완료
 */

import type { BlockPreset, PresetElement } from './types'
import type { BlockLayout, SizeMode } from '../../schema/types'

// ============================================
// Auto Layout Configuration
// ============================================

const AUTO_LAYOUT_VERTICAL: BlockLayout = {
  mode: 'auto',
  direction: 'vertical',
  gap: 24,
  padding: { top: 40, right: 32, bottom: 40, left: 32 },
  alignItems: 'center',
}

const HUG_HEIGHT: SizeMode = { type: 'hug' }

// ============================================
// Greeting Parents Preset IDs
// ============================================

export type GreetingParentsPresetId =
  | 'greeting-parents-minimal'
  | 'greeting-parents-with-divider'
  | 'greeting-parents-natural-sparkle'
  | 'greeting-parents-baptismal'
  | 'greeting-parents-balloon-heart'
  | 'greeting-parents-box-style'
  | 'greeting-parents-ribbon'

// ============================================
// Default Elements
// ============================================

// ============================================
// Minimal Elements (이미지 분석 기반)
// ============================================

const MINIMAL_ELEMENTS: PresetElement[] = [
  // 1. 영문 레이블 "INVITATION"
  {
    type: 'text',
    x: 10,
    y: 3,
    width: 80,
    height: 4,
    zIndex: 1,
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
    x: 10,
    y: 10,
    width: 80,
    height: 8,
    zIndex: 1,
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
  // 3. 인사말 본문
  {
    type: 'text',
    x: 10,
    y: 22,
    width: 80,
    height: 30,
    zIndex: 1,
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
    x: 10,
    y: 56,
    width: 80,
    height: 0.3,
    zIndex: 1,
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
    x: 10,
    y: 62,
    width: 80,
    height: 6,
    zIndex: 1,
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
    x: 10,
    y: 72,
    width: 80,
    height: 6,
    zIndex: 1,
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
  // 7. 축하 연락하기 버튼 (contact 블록 표시)
  {
    type: 'button',
    x: 15,
    y: 84,
    width: 70,
    height: 8,
    zIndex: 1,
    props: {
      type: 'button',
      label: '축하 연락하기',
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

const WITH_DIVIDER_ELEMENTS: PresetElement[] = [
  // 1. 제목 (width: 80 → x: 10으로 중앙 정렬)
  {
    type: 'text',
    x: 10,
    y: 8,
    width: 80,
    height: 6,
    zIndex: 1,
    binding: 'greeting.title',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 24,
        fontWeight: 400,
        color: 'var(--fg-emphasis)',
        textAlign: 'center',
        lineHeight: 1.4,
        letterSpacing: 0.02,
      },
    },
  },
  // 2. 구분선 (width: 60 → x: 20으로 중앙 정렬)
  {
    type: 'divider',
    x: 20,
    y: 18,
    width: 60,
    height: 0.5,
    zIndex: 1,
    props: {
      type: 'divider',
      dividerStyle: 'solid',
    },
    style: {
      background: 'var(--border-muted)',
    },
  },
  // 3. 인사말 본문 (width: 86 → x: 7으로 중앙 정렬)
  {
    type: 'text',
    x: 7,
    y: 28,
    width: 86,
    height: 45,
    zIndex: 1,
    binding: 'greeting.content',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 16,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.8,
        letterSpacing: 0.01,
      },
    },
  },
  // 4. 신랑측 혼주 (width: 70 → x: 15으로 중앙 정렬)
  {
    type: 'text',
    x: 15,
    y: 78,
    width: 70,
    height: 8,
    zIndex: 1,
    props: {
      type: 'text',
      format:
        '{parents.groom.father.name}·{parents.groom.mother.name}의 {parents.groom.birthOrder} {couple.groom.name}',
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
  // 5. 신부측 혼주 (width: 70 → x: 15으로 중앙 정렬)
  {
    type: 'text',
    x: 15,
    y: 88,
    width: 70,
    height: 8,
    zIndex: 1,
    props: {
      type: 'text',
      format:
        '{parents.bride.father.name}·{parents.bride.mother.name}의 {parents.bride.birthOrder} {couple.bride.name}',
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
]

// ============================================
// Natural Sparkle Elements (이미지 분석 기반)
// ============================================

const NATURAL_SPARKLE_ELEMENTS: PresetElement[] = [
  // 1. 제목 "소중한 분들을 초대합니다." (올리브 그린 강조)
  {
    type: 'text',
    x: 10,
    y: 3,
    width: 80,
    height: 5,
    zIndex: 1,
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
  // 2. 인사말 본문 (3단락 구조)
  {
    type: 'text',
    x: 10,
    y: 12,
    width: 80,
    height: 40,
    zIndex: 1,
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
    x: 10,
    y: 58,
    width: 80,
    height: 5,
    zIndex: 1,
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
    x: 10,
    y: 65,
    width: 80,
    height: 5,
    zIndex: 1,
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
    x: 20,
    y: 78,
    width: 60,
    height: 7,
    zIndex: 1,
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
  // 6~11. 별 장식 (sparkle) - 랜덤 위치
  {
    type: 'shape',
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

// ============================================
// Baptismal Elements (세례명 포함 카톨릭형)
// ============================================

const BAPTISMAL_ELEMENTS: PresetElement[] = [
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

// ============================================
// Balloon Heart Elements (하트 풍선 아이콘 스타일)
// ============================================

const BALLOON_HEART_ELEMENTS: PresetElement[] = [
  // 1. 하트 풍선 아이콘 (greeting1.svg)
  {
    type: 'shape',
    x: 45,
    y: 2,
    width: 10,
    height: 8,
    zIndex: 1,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: 'var(--fg-default)',
      svgViewBox: '0 0 50 50',
      svgPath:
        'M39.102 17.7064C37.4332 16.4367 34.6952 16.5966 33.3562 18.2763C33.2463 18.4063 33.1164 18.6062 32.9965 18.8262C31.4976 16.6466 28.6197 15.5469 26.9109 18.4663C24.4028 22.7254 29.7988 26.3547 31.3177 29.9539C30.0786 33.9931 27.4305 37.6124 25.0023 41.1216C23.8232 36.6725 22.8039 32.2435 22.4242 27.5044C22.1144 23.6352 22.1944 19.816 22.4242 15.9968C26.2614 13.8372 33.7959 10.6679 31.8273 5.039C30.6482 1.65969 26.6012 0.919841 24.4727 3.10939C23.7133 -0.749818 17.7476 -1.07975 15.4293 2.49952C12.2017 7.5085 15.9989 13.9472 20.8853 16.0667C20.2858 21.7756 20.4357 27.8243 21.345 33.6332C17.298 32.4934 14.0004 30.0639 11.772 26.6846C11.772 26.6846 11.792 26.6746 11.792 26.6646C13.7605 23.8752 17.8975 17.2565 13.0111 14.957C10.393 13.7272 7.97478 15.4769 7.69499 17.8464C6.41592 16.6566 4.82708 15.7968 3.00841 16.3867C0.959913 17.0565 -0.179253 19.1961 0.0206004 21.2757C0.250432 23.6152 1.90922 25.4648 3.96771 26.4646C5.7664 27.3444 8.53437 28.0143 10.5629 27.2945C13.0011 31.1337 17.0381 33.9131 21.5349 34.7629C22.4042 39.7319 23.8332 44.5009 25.8517 48.7001C26.1515 49.32 27.1208 48.8801 26.9509 48.2402C26.3813 46.1206 25.8017 44.041 25.2421 41.9715C25.3221 41.9715 25.412 41.9315 25.472 41.8515C28.5397 38.3022 31.6575 34.1531 32.8466 29.554C35.6046 29.0041 38.7123 27.3844 40.1512 24.9749C41.5003 22.7154 41.3204 19.3761 39.112 17.6964L39.102 17.7064ZM9.63357 22.2255C9.40374 21.5256 8.3545 21.8056 8.52438 22.5254C8.82416 23.8152 9.30381 25.0449 9.92336 26.1947C7.34524 25.7348 4.68719 25.9247 2.70863 23.6852C1.44956 22.2555 0.939928 19.936 2.38887 18.4463C4.29747 16.4867 6.51585 18.3863 7.84488 19.946C8.40447 20.6058 9.32379 19.656 8.78419 19.0062C8.72423 18.9362 8.65428 18.8562 8.59433 18.7862C8.60432 15.4469 13.9504 14.807 13.9104 18.8862C13.8905 21.2457 12.1018 23.3453 10.9926 25.3848C10.453 24.3951 9.9933 23.3353 9.63357 22.2155V22.2255ZM21.0052 14.987C18.9168 13.5473 17.188 11.6477 16.3886 9.16816C15.829 7.43851 15.6592 5.33894 16.5885 3.66928C18.2772 0.669893 23.1637 0.839858 23.0537 4.87903C23.0537 5.20897 23.2636 5.41892 23.5234 5.5189C23.7333 5.67887 24.093 5.63888 24.2729 5.36893C24.3228 5.31894 24.3628 5.24896 24.3928 5.16897C24.9624 3.96922 26.7011 2.95943 28.0001 3.27936C29.0094 3.51931 30.0486 4.57909 30.3884 5.5389C31.0579 7.45851 29.8388 9.23814 28.3799 10.3279C26.5612 11.6876 24.5227 12.7874 22.5641 13.9672C22.734 11.8276 22.9338 9.68805 23.1537 7.52849C23.1936 7.10858 22.5441 7.03859 22.4342 7.42851C21.7947 9.82802 21.315 12.3675 20.9853 14.987H21.0052ZM39.142 23.5252C38.1027 26.0947 35.5546 26.8446 33.2063 27.7744C33.3862 26.4846 33.4062 25.1549 33.2163 23.8052C33.1164 23.1053 31.9073 23.2653 31.9772 23.9751C32.1271 25.5048 32.0072 26.9645 31.7174 28.3842C31.1878 27.0945 30.3384 25.9747 29.479 24.785C28.6097 23.5752 27.7603 22.3255 27.7903 20.7858C27.8203 19.1961 28.9994 17.5464 30.7481 18.3363C31.5775 18.7162 32.217 20.0859 32.6767 20.8258C32.9965 21.3457 33.8259 21.0657 33.7659 20.4858C33.7859 20.4659 33.8159 20.4559 33.8359 20.4259C34.0157 20.2159 33.8359 19.986 33.616 20.0159C33.616 19.9959 33.606 19.986 33.596 19.966C34.3455 19.3261 34.5753 18.6462 35.6845 18.3963C36.404 18.2363 37.2534 18.2863 37.8929 18.6662C39.5517 19.626 39.8015 21.9056 39.142 23.5352V23.5252Z',
    },
  },
  // 2. 메인 제목 "소중한 분들을 초대합니다."
  {
    type: 'text',
    x: 10,
    y: 12,
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
    y: 22,
    width: 80,
    height: 32,
    zIndex: 1,
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
  // 4. 구분선
  {
    type: 'divider',
    x: 10,
    y: 58,
    width: 80,
    height: 0.3,
    zIndex: 1,
    props: { type: 'divider', dividerStyle: 'solid' },
    style: { background: 'var(--border-muted)' },
  },
  // 5. 신랑측 혼주 정보
  {
    type: 'text',
    x: 10,
    y: 64,
    width: 80,
    height: 6,
    zIndex: 1,
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
    x: 10,
    y: 73,
    width: 80,
    height: 6,
    zIndex: 1,
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
  // 7. 축하 연락하기 버튼
  {
    type: 'button',
    x: 15,
    y: 84,
    width: 70,
    height: 8,
    zIndex: 1,
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

// ============================================
// Box Style Elements (혼주 카드 박스 + 핑크 강조)
// ============================================

const BOX_STYLE_ELEMENTS: PresetElement[] = [
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
        fontSize: 12,
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
        fontSize: 22,
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
        fontSize: 15,
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
        fontSize: 16,
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
        fontSize: 16,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.8,
      },
    },
  },
  // 7. 축하 연락하기 버튼
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
      action: 'show-block',
      targetBlockType: 'contact',
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
        fontSize: 15,
        fontWeight: 500,
        color: 'var(--fg-default)',
      },
    },
  },
]

// ============================================
// Ribbon Style Elements (핑크 리본 + 카드형 혼주)
// ============================================

const RIBBON_ELEMENTS: PresetElement[] = [
  // 1. 핑크 리본 장식 (greeting2.svg)
  {
    type: 'shape',
    x: 10,
    y: 3,
    width: 20,
    height: 5,
    zIndex: 1,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: '#EF90CB',
      svgViewBox: '0 0 76 22',
      svgPath:
        'M75.8957 13.3064C75.1689 8.87589 71.0272 6.32442 67.1343 4.88056C55.2069 0.440209 43.847 4.03996 33.0546 9.53848C26.9913 12.624 20.5398 16.4611 13.5705 16.8567C9.39892 17.094 4.90872 15.7688 2.64869 12.0207C1.23492 9.67694 1.17519 6.85845 2.71838 4.54432C3.36553 3.58505 4.17198 2.85323 5.12776 2.30931C6.49175 2.20053 7.99512 2.14119 8.89116 3.28836C9.41884 3.96085 9.5184 4.80145 9.45866 5.66183C9.30932 6.25519 9.12015 6.9079 8.87125 7.63971C8.20419 7.43203 7.93537 8.45065 8.58252 8.6781C11.5494 9.7066 14.377 7.42215 13.8493 4.27731C13.3316 1.17203 10.0959 -0.311387 7.18867 0.0545216C6.28267 0.173195 5.41649 0.459988 4.62 0.865455C4.45074 0.885234 4.27153 0.905012 4.10228 0.934681C3.78368 0.984128 3.61443 1.23136 3.58456 1.49838C1.45396 3.04113 0.0302388 5.58271 0.000370536 8.23308C-0.0394538 12.357 3.13654 15.8677 6.80039 17.3907C17.5032 21.8508 29.9184 12.4756 39.1677 8.30231C46.2166 5.1278 53.7036 3.52571 61.4096 5.01901C64.8245 5.68161 68.8169 6.809 71.4851 9.1528C74.0936 11.4471 75.4278 15.1062 72.7994 18.0731C72.6301 18.2511 72.4509 18.3994 72.2816 18.5576C70.9774 19.0917 69.8026 19.8136 68.2594 19.4675C67.2339 19.24 66.3578 18.528 65.9396 17.6478C66.1089 16.8468 66.4673 15.8776 67.0049 14.7304C68.0304 15.0172 68.4585 13.4547 67.443 13.1481C64.6055 12.2779 61.6983 14.3546 62.0667 17.4302C62.5047 21.1684 66.6266 22.6024 69.8922 21.7717C73.7054 20.8124 76.5628 17.2621 75.9056 13.2965L75.8957 13.3064Z',
    },
  },
  // 2. 메인 제목 "소중한 분들을 초대합니다."
  {
    type: 'text',
    x: 10,
    y: 10,
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
    height: 32,
    zIndex: 1,
    binding: 'greeting.content',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'left',
        lineHeight: 1.9,
        letterSpacing: 0.01,
      },
    },
  },
  // 4. 혼주 카드 배경
  {
    type: 'shape',
    x: 10,
    y: 54,
    width: 80,
    height: 18,
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
        radius: 8,
      },
    },
  },
  // 5. 신랑측 혼주 정보 (카드 안)
  {
    type: 'text',
    x: 12,
    y: 56,
    width: 76,
    height: 6,
    zIndex: 1,
    props: {
      type: 'text',
      format:
        '{parents.groom.father.name} · {parents.groom.mother.name}의 {parents.groom.birthOrder}  {couple.groom.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // 6. 신부측 혼주 정보 (카드 안)
  {
    type: 'text',
    x: 12,
    y: 64,
    width: 76,
    height: 6,
    zIndex: 1,
    props: {
      type: 'text',
      format:
        '{parents.bride.father.name} · {parents.bride.mother.name}의 {parents.bride.birthOrder}  {couple.bride.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // 7. 구분선
  {
    type: 'divider',
    x: 10,
    y: 76,
    width: 80,
    height: 0.3,
    zIndex: 1,
    props: { type: 'divider', dividerStyle: 'solid' },
    style: { background: 'var(--border-muted)' },
  },
  // 8. 축하 연락하기 버튼
  {
    type: 'button',
    x: 10,
    y: 80,
    width: 80,
    height: 6,
    zIndex: 1,
    props: {
      type: 'button',
      label: '📞  축하 연락하기',
      action: 'show-block',
      targetBlockType: 'contact',
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
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--fg-default)',
      },
    },
  },
]

// ============================================
// Greeting Parents Block Presets
// ============================================

export const GREETING_PARENTS_PRESETS: Record<GreetingParentsPresetId, BlockPreset> = {
  'greeting-parents-minimal': {
    id: 'greeting-parents-minimal',
    blockType: 'greeting-parents',
    variant: 'minimal',
    name: 'Minimal',
    nameKo: '미니멀',
    description:
      '깔끔하고 미니멀한 중앙 정렬 인사말 레이아웃. INVITATION 레이블, 구분선, 연락하기 버튼 포함.',
    tags: ['minimal', 'clean', 'centered', 'modern', 'simple'],
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
    defaultElements: MINIMAL_ELEMENTS,
    specialComponents: ['contact-block'],
    recommendedAnimations: ['fade-in', 'slide-up'],
    recommendedThemes: ['minimal-light', 'classic-ivory'],
    relatedPresets: ['contact-minimal'],
    aiHints: {
      mood: ['minimal', 'clean', 'modern', 'elegant'],
      style: ['simple', 'centered', 'balanced', 'understated'],
      useCase: ['modern-wedding', 'simple-invitation', 'minimalist-design'],
    },
  },

  'greeting-parents-with-divider': {
    id: 'greeting-parents-with-divider',
    blockType: 'greeting-parents',
    variant: 'with-divider',
    name: 'With Divider',
    nameKo: '클래식 구분선',
    description: '제목과 본문 사이에 구분선이 있는 클래식한 인사말 레이아웃',
    tags: ['classic', 'minimal', 'centered', 'with-divider', 'serif'],
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
    defaultHeight: 100,
    defaultElements: WITH_DIVIDER_ELEMENTS,
    recommendedAnimations: ['fade-in', 'slide-up'],
    recommendedThemes: ['classic-ivory', 'minimal-light'],
    aiHints: {
      mood: ['elegant', 'traditional', 'formal'],
      style: ['clean', 'simple', 'timeless'],
      useCase: ['traditional-wedding', 'classic-invitation', 'formal-ceremony'],
    },
  },

  'greeting-parents-natural-sparkle': {
    id: 'greeting-parents-natural-sparkle',
    blockType: 'greeting-parents',
    variant: 'natural-sparkle',
    name: 'Natural Sparkle',
    nameKo: '내추럴 스파클',
    description:
      '올리브 그린 강조와 별 장식이 있는 자연스러운 인사말 레이아웃. 연락하기 버튼 포함.',
    tags: ['natural', 'elegant', 'sparkle', 'olive', 'contact-button', 'warm'],
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
    defaultHeight: 100,
    defaultElements: NATURAL_SPARKLE_ELEMENTS,
    specialComponents: ['contact-modal'],
    recommendedAnimations: ['fade-in', 'stagger-fade'],
    recommendedThemes: ['classic-ivory', 'romantic-garden'],
    aiHints: {
      mood: ['natural', 'warm', 'elegant', 'romantic'],
      style: ['organic', 'fresh', 'inviting', 'decorated'],
      useCase: ['garden-wedding', 'outdoor-ceremony', 'spring-wedding', 'natural-theme'],
    },
  },

  'greeting-parents-baptismal': {
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
    defaultElements: BAPTISMAL_ELEMENTS,
    specialComponents: ['contact-block'],
    recommendedAnimations: ['fade-in', 'slide-up'],
    recommendedThemes: ['minimal-light', 'classic-ivory'],
    relatedPresets: ['contact-minimal'],
    aiHints: {
      mood: ['religious', 'traditional', 'reverent', 'elegant'],
      style: ['centered', 'clean', 'formal', 'two-row'],
      useCase: ['catholic-wedding', 'christian-wedding', 'religious-ceremony', 'baptismal-name'],
    },
  },

  'greeting-parents-balloon-heart': {
    id: 'greeting-parents-balloon-heart',
    blockType: 'greeting-parents',
    variant: 'balloon-heart',
    name: 'Balloon Heart',
    nameKo: '하트 풍선1',
    description: '하트 풍선 아이콘과 함께 중앙 정렬된 인사말 레이아웃',
    tags: ['minimal', 'centered', 'light', 'with-icon', 'with-contact'],
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
    defaultElements: BALLOON_HEART_ELEMENTS,
    specialComponents: ['contact-modal'],
    recommendedAnimations: ['fade-in', 'slide-up'],
    recommendedThemes: ['minimal-light', 'classic-ivory'],
    aiHints: {
      mood: ['minimal', 'clean', 'simple'],
      style: ['centered', 'text-focused', 'icon-header'],
      useCase: ['formal', 'traditional', 'all-purpose'],
    },
  },

  'greeting-parents-box-style': {
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
    defaultElements: BOX_STYLE_ELEMENTS,
    specialComponents: ['contact-block'],
    recommendedAnimations: ['fade-in', 'slide-up'],
    recommendedThemes: ['minimal-light', 'classic-ivory', 'romantic-blush'],
    relatedPresets: ['contact-minimal'],
    aiHints: {
      mood: ['minimal', 'modern', 'clean', 'elegant'],
      style: ['centered', 'card-layout', 'accent-highlight', 'boxed'],
      useCase: ['modern-wedding', 'simple-invitation', 'pink-theme'],
    },
  },

  'greeting-parents-ribbon': {
    id: 'greeting-parents-ribbon',
    blockType: 'greeting-parents',
    variant: 'ribbon',
    name: 'Ribbon',
    nameKo: '리본 장식',
    description: '리본 포인트와 카드형 혼주 정보를 포함한 클래식 스타일',
    tags: ['elegant', 'classic', 'card', 'ribbon', 'pink-accent', 'with-contact'],
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
    defaultElements: RIBBON_ELEMENTS,
    specialComponents: ['contact-block'],
    recommendedAnimations: ['fade-in', 'slide-up'],
    recommendedThemes: ['classic-ivory', 'minimal-light', 'romantic-blush'],
    relatedPresets: ['contact-minimal'],
    aiHints: {
      mood: ['elegant', 'romantic', 'classic'],
      style: ['card-layout', 'ribbon-decoration', 'soft-colors'],
      useCase: ['traditional-wedding', 'elegant-invitation', 'korean-style'],
    },
  },
}

// ============================================
// Helper Functions
// ============================================

export function getGreetingParentsPreset(id: GreetingParentsPresetId): BlockPreset {
  return GREETING_PARENTS_PRESETS[id]
}

export function getGreetingParentsPresetIds(): GreetingParentsPresetId[] {
  return Object.keys(GREETING_PARENTS_PRESETS) as GreetingParentsPresetId[]
}

export function getGreetingParentsPresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(GREETING_PARENTS_PRESETS).filter((p) => p.complexity === complexity)
}

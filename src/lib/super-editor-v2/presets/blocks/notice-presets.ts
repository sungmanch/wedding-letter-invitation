/**
 * Super Editor v2 - Notice Block Presets
 *
 * 공지사항/안내 블록 프리셋
 * 화환안내, 포토부스, 식사안내, 주차안내 등
 */

import type { BlockPreset, PresetElement } from './types'

// ============================================
// Notice Preset IDs
// ============================================

export type NoticePresetId = 'notice-classic-label'

// ============================================
// Default Elements
// ============================================

/**
 * Classic Label 스타일 요소
 * - 영문 NOTICE 라벨
 * - 한글 제목 (accent 색상)
 * - 본문 내용
 * - 옵셔널 이미지
 *
 * notice.items[] 배열을 렌더러에서 반복 처리
 * 각 아이템은 이 요소 구조를 따름
 */
const NOTICE_CLASSIC_LABEL_ELEMENTS: PresetElement[] = [
  // English Label (NOTICE)
  {
    type: 'text',
    x: 0,
    y: 2,
    width: 100,
    height: 5,
    zIndex: 1,
    value: 'NOTICE',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-accent)',
        fontSize: 12,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        letterSpacing: 0.2,
      },
    },
  },
  // Korean Title (바인딩: notice.items[].title)
  {
    type: 'text',
    x: 10,
    y: 8,
    width: 80,
    height: 8,
    zIndex: 1,
    value: '공지사항 제목',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 20,
        fontWeight: 600,
        color: 'var(--accent-secondary)',
        textAlign: 'center',
        lineHeight: 1.4,
      },
    },
  },
  // Content (바인딩: notice.items[].content)
  {
    type: 'text',
    x: 10,
    y: 18,
    width: 80,
    height: 20,
    zIndex: 1,
    value: '공지사항 내용이 여기에 표시됩니다.\n여러 줄로 작성할 수 있습니다.',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.8,
      },
    },
  },
  // Optional Image (바인딩: notice.items[].image, 조건부 렌더링)
  {
    type: 'image',
    x: 10,
    y: 42,
    width: 80,
    height: 50,
    zIndex: 1,
    props: {
      type: 'image',
      objectFit: 'cover',
    },
  },
]

// ============================================
// Notice Block Presets
// ============================================

export const NOTICE_PRESETS: Record<NoticePresetId, BlockPreset> = {
  'notice-classic-label': {
    id: 'notice-classic-label',
    blockType: 'notice',
    variant: 'classic-label',
    name: 'Classic Label',
    nameKo: '클래식 라벨',
    description: '영문 NOTICE 라벨과 한글 제목이 조화롭게 배치된 클래식 공지 스타일',
    tags: ['elegant', 'classic', 'centered', 'label', 'minimal', 'light'],
    complexity: 'low',
    bindings: ['notice.items'],
    defaultHeight: 45, // 이미지 없을 때 기준, 이미지 있으면 동적 조정
    defaultElements: NOTICE_CLASSIC_LABEL_ELEMENTS,
    specialComponents: ['notice-item-renderer'],
    recommendedAnimations: ['fade-in', 'slide-up'],
    recommendedThemes: ['classic-ivory', 'minimal-light', 'romantic-blush'],
    aiHints: {
      mood: ['elegant', 'classic', 'refined'],
      style: ['centered', 'label-title', 'vertical-stack'],
      useCase: ['화환안내', '포토부스', '식사안내', '주차안내', '일반공지'],
    },
  },
}

// ============================================
// Helper Functions
// ============================================

export function getNoticePreset(id: NoticePresetId): BlockPreset {
  return NOTICE_PRESETS[id]
}

export function getNoticePresetIds(): NoticePresetId[] {
  return Object.keys(NOTICE_PRESETS) as NoticePresetId[]
}

export function getNoticePresetsByComplexity(complexity: 'low' | 'medium' | 'high'): BlockPreset[] {
  return Object.values(NOTICE_PRESETS).filter((p) => p.complexity === complexity)
}

/**
 * Notice Block - Classic Label Preset
 *
 * 영문 NOTICE 라벨과 한글 제목이 조화롭게 배치된 클래식 공지 스타일
 * 화환안내, 포토부스, 식사안내, 주차안내 등에 사용
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'

// ============================================
// Default Elements
// ============================================

/**
 * Classic Label 스타일 요소 (Auto Layout)
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
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
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
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
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
  // Content (바인딩: notice.items[].content) - hug 모드로 텍스트 길이에 맞게 확장
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
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
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 200, unit: 'px' } },
    props: {
      type: 'image',
      objectFit: 'cover',
    },
  },
]

// ============================================
// Notice Classic Label Preset
// ============================================

export const NOTICE_CLASSIC_LABEL: BlockPreset = {
  id: 'notice-classic-label',
  blockType: 'notice',
  variant: 'classic-label',
  name: 'Classic Label',
  nameKo: '클래식 라벨',
  description: '영문 NOTICE 라벨과 한글 제목이 조화롭게 배치된 클래식 공지 스타일',
  tags: ['elegant', 'classic', 'centered', 'label', 'minimal', 'light', 'auto-layout'],
  complexity: 'low',
  bindings: ['notice.items'],
  defaultHeight: HUG_HEIGHT,
  layout: AUTO_LAYOUT_VERTICAL,
  defaultElements: NOTICE_CLASSIC_LABEL_ELEMENTS,
  specialComponents: ['notice-item-renderer'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['classic-ivory', 'minimal-light', 'romantic-blush'],
  aiHints: {
    mood: ['elegant', 'classic', 'refined'],
    style: ['centered', 'label-title', 'vertical-stack'],
    useCase: ['화환안내', '포토부스', '식사안내', '주차안내', '일반공지'],
  },
}

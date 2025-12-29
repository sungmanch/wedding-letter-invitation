/**
 * Gallery Block Preset - Mixed Layout (혼합)
 *
 * 다양한 크기의 사진을 혼합 배치하는 갤러리
 * - 큰 사진 1장 + 작은 사진 여러 장 조합
 * - 클릭 시 Lightbox 확대
 * - 스와이프로 다음/이전 이미지 (loop)
 * - 더보기 버튼으로 추가 사진 표시
 */

import type { BlockPreset } from '../types'
import {
  GALLERY_COMMON_BINDINGS,
  GALLERY_AI_HINTS,
  GALLERY_SPECIAL_COMPONENTS,
  GALLERY_RECOMMENDED_THEMES,
  createGalleryHeaderElements,
  createGalleryGridElement,
  createMoreButtonElement,
} from './_shared'

export const GALLERY_MIXED: BlockPreset = {
  id: 'gallery-mixed',
  blockType: 'gallery',
  variant: 'mixed',
  name: 'Mixed Layout',
  nameKo: '혼합',
  description: '큰 사진과 작은 사진을 혼합 배치하는 동적인 갤러리 레이아웃.',

  tags: ['gallery', 'grid', 'mixed', 'dynamic', 'masonry', 'creative'],
  complexity: 'medium',
  bindings: GALLERY_COMMON_BINDINGS,

  defaultHeight: { type: 'hug' },

  layout: {
    mode: 'auto',
    direction: 'vertical',
    gap: 16,
    padding: {
      top: 40,
      right: 24,
      bottom: 40,
      left: 24,
    },
    alignItems: 'center',
  },

  defaultElements: [
    // Header (라벨, 제목, 설명)
    ...createGalleryHeaderElements(),

    // Gallery Grid (혼합 비율)
    createGalleryGridElement({
      columns: 3,
      aspectRatio: 'mixed',
      gap: 4,
      initialRows: 2,
      showMoreButton: true,
    }),

    // More Button
    createMoreButtonElement(),
  ],

  specialComponents: GALLERY_SPECIAL_COMPONENTS,
  recommendedThemes: [...GALLERY_RECOMMENDED_THEMES],

  aiHints: {
    mood: ['creative', 'dynamic', 'modern'],
    style: ['masonry', 'mixed', 'collage'],
    useCase: [...GALLERY_AI_HINTS.useCase],
  },

  relatedPresets: [
    'gallery-square-3col',
    'gallery-rect-3col',
    'gallery-square-2col',
  ],
}

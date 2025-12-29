/**
 * Gallery Block Preset - Square 3 Column (정사각_3단)
 *
 * 3열 정사각형(1:1) 그리드 갤러리
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

export const GALLERY_SQUARE_3COL: BlockPreset = {
  id: 'gallery-square-3col',
  blockType: 'gallery',
  variant: 'square-3col',
  name: 'Square 3 Column',
  nameKo: '정사각 3단',
  description: '3열 정사각형(1:1) 그리드 갤러리. 깔끔하고 균형잡힌 레이아웃.',

  tags: ['gallery', 'grid', 'square', '3-column', 'minimal', 'clean'],
  complexity: 'low',
  bindings: GALLERY_COMMON_BINDINGS,

  // Gallery는 absolute 모드 (이미지 그리드 배치)
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

    // Gallery Grid (3열, 정사각형)
    createGalleryGridElement({
      columns: 3,
      aspectRatio: '1:1',
      gap: 4,
      initialRows: 3,
      showMoreButton: true,
    }),

    // More Button
    createMoreButtonElement(),
  ],

  specialComponents: GALLERY_SPECIAL_COMPONENTS,
  recommendedThemes: [...GALLERY_RECOMMENDED_THEMES],

  aiHints: {
    mood: [...GALLERY_AI_HINTS.mood],
    style: ['grid', 'square', 'compact'],
    useCase: [...GALLERY_AI_HINTS.useCase],
  },

  relatedPresets: [
    'gallery-square-2col',
    'gallery-rect-3col',
    'gallery-mixed',
  ],
}

/**
 * Gallery Block Preset - Rectangle 2 Column (직사각_2단)
 *
 * 2열 세로형(3:4) 그리드 갤러리
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

export const GALLERY_RECT_2COL: BlockPreset = {
  id: 'gallery-rect-2col',
  blockType: 'gallery',
  variant: 'rect-2col',
  name: 'Rectangle 2 Column',
  nameKo: '직사각 2단',
  description: '2열 세로형(3:4) 그리드 갤러리. 큰 포트레이트 사진을 강조하는 레이아웃.',

  tags: ['gallery', 'grid', 'rectangle', 'portrait', '2-column', 'large', 'emphasis'],
  complexity: 'low',
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

    // Gallery Grid (2열, 3:4 비율)
    createGalleryGridElement({
      columns: 2,
      aspectRatio: '3:4',
      gap: 8,
      initialRows: 2,
      showMoreButton: true,
    }),

    // More Button
    createMoreButtonElement(),
  ],

  specialComponents: GALLERY_SPECIAL_COMPONENTS,
  recommendedThemes: [...GALLERY_RECOMMENDED_THEMES],

  aiHints: {
    mood: ['elegant', 'romantic', 'luxurious'],
    style: ['grid', 'portrait', 'large'],
    useCase: [...GALLERY_AI_HINTS.useCase],
  },

  relatedPresets: [
    'gallery-rect-3col',
    'gallery-square-2col',
    'gallery-mixed',
  ],
}

/**
 * Super Editor - All Primitives Export
 * 29개 기본 블록 렌더러
 */

// Types
export * from './types'

// Render utilities (circular import 방지를 위해 분리)
export {
  renderPrimitiveNode,
  createNodeRenderer,
  getRenderer,
  setRenderers,
} from './render-node'
import { setRenderers } from './render-node'

// Layout (6개)
export * from './layout'
import { layoutRenderers } from './layout'

// Content (9개)
export * from './content'
import { contentRenderers } from './content'

// Image Collection (6개)
export * from './image-collection'
import { imageCollectionRenderers } from './image-collection'

// Animation (5개)
export * from './animation'
import { animationRenderers } from './animation'

// Logic (2개)
export * from './logic'
import { logicRenderers } from './logic'

// Audio (1개)
export * from './audio'
import { bgmPlayerRenderer } from './audio'
const audioRenderers = { 'bgm-player': bgmPlayerRenderer }

// Interactive (1개)
export * from './interactive'
import { interactiveRenderers } from './interactive'

// Custom (1개)
export * from './custom'
import { customRenderer } from './custom'
const customRenderers = { custom: customRenderer }

// ============================================
// All Renderers Combined
// ============================================

import type { PrimitiveRenderer } from './types'

export const allRenderers: Record<string, PrimitiveRenderer> = {
  ...layoutRenderers,
  ...contentRenderers,
  ...imageCollectionRenderers,
  ...animationRenderers,
  ...logicRenderers,
  ...audioRenderers,
  ...interactiveRenderers,
  ...customRenderers,
}

// 렌더러 레지스트리 초기화
setRenderers(allRenderers)

// ============================================
// Renderer Categories
// ============================================

export const rendererCategories = {
  layout: {
    label: '레이아웃',
    renderers: layoutRenderers,
    types: ['container', 'row', 'column', 'scroll-container', 'overlay', 'fullscreen'],
  },
  content: {
    label: '콘텐츠',
    renderers: contentRenderers,
    types: ['text', 'image', 'video', 'avatar', 'button', 'spacer', 'divider', 'input', 'map-embed', 'calendar'],
  },
  imageCollection: {
    label: '이미지 컬렉션',
    renderers: imageCollectionRenderers,
    types: ['gallery', 'carousel', 'grid', 'collage', 'masonry', 'vinyl-selector', 'film-strip'],
  },
  animation: {
    label: '애니메이션',
    renderers: animationRenderers,
    types: ['animated', 'sequence', 'parallel', 'scroll-trigger', 'transition'],
  },
  logic: {
    label: '로직',
    renderers: logicRenderers,
    types: ['conditional', 'repeat'],
  },
  audio: {
    label: '오디오',
    renderers: audioRenderers,
    types: ['bgm-player'],
  },
  interactive: {
    label: '인터랙티브',
    renderers: interactiveRenderers,
    types: ['photobooth'],
  },
  custom: {
    label: '확장',
    renderers: customRenderers,
    types: ['custom'],
  },
}

// ============================================
// Statistics
// ============================================

export const primitiveStats = {
  total: Object.keys(allRenderers).length,
  layout: Object.keys(layoutRenderers).length,
  content: Object.keys(contentRenderers).length,
  imageCollection: Object.keys(imageCollectionRenderers).length,
  animation: Object.keys(animationRenderers).length,
  logic: Object.keys(logicRenderers).length,
  audio: Object.keys(audioRenderers).length,
  interactive: Object.keys(interactiveRenderers).length,
  custom: Object.keys(customRenderers).length,
}

// 33개 확인 (32 + film-strip)
console.assert(
  primitiveStats.total === 33,
  `Expected 33 primitives, got ${primitiveStats.total}`
)

/**
 * Super Editor - All Primitives Export
 * 29개 기본 블록 렌더러
 */

// Types
export * from './types'

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

// Custom (1개)
export * from './custom'
import { customRenderer } from './custom'
const customRenderers = { custom: customRenderer }

// ============================================
// All Renderers Combined
// ============================================

import type { PrimitiveNode } from '../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from './types'

export const allRenderers: Record<string, PrimitiveRenderer> = {
  ...layoutRenderers,
  ...contentRenderers,
  ...imageCollectionRenderers,
  ...animationRenderers,
  ...logicRenderers,
  ...audioRenderers,
  ...customRenderers,
}

/**
 * 노드 타입에 따른 렌더러 가져오기
 */
export function getRenderer(type: string): PrimitiveRenderer | undefined {
  return allRenderers[type]
}

/**
 * 노드 렌더링 함수
 */
export function renderPrimitiveNode(
  node: PrimitiveNode,
  context: RenderContext
): React.ReactNode {
  const renderer = getRenderer(node.type)

  if (!renderer) {
    console.warn(`Unknown primitive type: ${node.type}`)
    return null
  }

  return renderer.render(node, context)
}

/**
 * 컨텍스트와 함께 렌더링 함수 생성
 */
export function createNodeRenderer(
  baseContext: Omit<RenderContext, 'renderNode'>
): RenderContext {
  const context: RenderContext = {
    ...baseContext,
    renderNode: (node: PrimitiveNode) => renderPrimitiveNode(node, context),
  }
  return context
}

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
    types: ['text', 'image', 'video', 'avatar', 'button', 'spacer', 'divider', 'input', 'map-embed'],
  },
  imageCollection: {
    label: '이미지 컬렉션',
    renderers: imageCollectionRenderers,
    types: ['gallery', 'carousel', 'grid', 'collage', 'masonry', 'vinyl-selector'],
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
  custom: Object.keys(customRenderers).length,
}

// 30개 확인 (29 + custom)
console.assert(
  primitiveStats.total === 30,
  `Expected 30 primitives, got ${primitiveStats.total}`
)

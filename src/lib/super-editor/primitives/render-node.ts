/**
 * Render Node - 노드 렌더링 유틸리티
 * circular import를 피하기 위해 분리
 */

import type { PrimitiveNode } from '../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from './types'

// 렌더러 레지스트리 (lazy initialization)
let renderers: Record<string, PrimitiveRenderer> | null = null

/**
 * 렌더러 레지스트리 설정 (index.ts에서 호출)
 */
export function setRenderers(r: Record<string, PrimitiveRenderer>) {
  renderers = r
}

/**
 * 노드 타입에 따른 렌더러 가져오기
 */
export function getRenderer(type: string): PrimitiveRenderer | undefined {
  return renderers?.[type]
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

/**
 * Super Editor v2 - Size Resolution Utilities
 *
 * SizeMode 타입을 CSS 값으로 변환하고,
 * 하위 호환성을 위한 헬퍼 함수 제공
 */

import type { CSSProperties } from 'react'
import type { SizeMode, Block, Element } from '../schema/types'

// ============================================
// Block Height Resolution
// ============================================

/**
 * Block의 height가 number인지 SizeMode인지 확인하고 숫자로 반환
 * 하위 호환성: 기존 number 타입은 그대로 반환
 * SizeMode: fixed만 숫자로 반환, 나머지는 기본값 반환
 */
export function resolveBlockHeightNumber(
  height: number | SizeMode,
  defaultHeight: number = 100
): number {
  if (typeof height === 'number') {
    return height
  }

  // SizeMode인 경우
  switch (height.type) {
    case 'fixed':
      return height.value
    case 'hug':
    case 'fill':
    case 'fill-portion':
    default:
      return defaultHeight
  }
}

/**
 * Block의 height를 CSS 스타일로 변환
 */
export function resolveBlockHeightStyle(
  height: number | SizeMode
): CSSProperties {
  if (typeof height === 'number') {
    // 기존 동작: vh 단위로 해석
    return { height: `${height}vh` }
  }

  // SizeMode인 경우
  switch (height.type) {
    case 'fixed': {
      const unit = height.unit ?? 'vh'
      return { height: `${height.value}${unit}` }
    }
    case 'hug':
      return {
        height: 'fit-content',
        minHeight: 0,
      }
    case 'fill':
      return {
        height: '100%',
        flex: '1 1 0',
      }
    case 'fill-portion':
      return {
        flex: `${height.value} 1 0`,
      }
    default:
      return {}
  }
}

/**
 * Block이 Auto Layout 모드인지 확인
 */
export function isAutoLayoutBlock(block: Block): boolean {
  return block.layout?.mode === 'auto'
}

// ============================================
// Element Size Resolution
// ============================================

/**
 * Element의 좌표/크기가 정의되어 있는지 확인 (Absolute 모드용)
 */
export function hasAbsolutePosition(element: Element): boolean {
  return (
    element.x !== undefined &&
    element.y !== undefined &&
    element.width !== undefined &&
    element.height !== undefined
  )
}

/**
 * Element의 x, y, width, height를 안전하게 가져오기 (기본값 적용)
 */
export function getElementPosition(element: Element) {
  return {
    x: element.x ?? 0,
    y: element.y ?? 0,
    width: element.width ?? 100,
    height: element.height ?? 10,
  }
}

/**
 * SizeMode를 CSS 스타일로 변환
 */
export function resolveSizeMode(
  prop: 'width' | 'height',
  mode: SizeMode | undefined,
  defaultMode: SizeMode = { type: 'hug' }
): CSSProperties {
  const m = mode ?? defaultMode

  switch (m.type) {
    case 'fixed': {
      const unit = m.unit ?? 'px'
      return { [prop]: `${m.value}${unit}` }
    }
    case 'hug':
      return { [prop]: 'fit-content' }
    case 'fill':
      return {
        [prop]: '100%',
        ...(prop === 'width' ? { flex: '1 1 0' } : {}),
      }
    case 'fill-portion':
      return { flex: `${m.value} 1 0` }
    default:
      return {}
  }
}

/**
 * Element가 Auto Layout 모드인지 확인
 */
export function isAutoLayoutElement(element: Element): boolean {
  return element.layoutMode === 'auto'
}

/**
 * Auto Layout Element의 CSS 스타일 생성
 */
export function getAutoLayoutElementStyle(element: Element): CSSProperties {
  const style: CSSProperties = {
    // 크기
    ...resolveSizeMode('width', element.sizing?.width, { type: 'fill' }),
    ...resolveSizeMode('height', element.sizing?.height, { type: 'hug' }),

    // 제약
    minWidth: element.constraints?.minWidth,
    maxWidth: element.constraints?.maxWidth,
    minHeight: element.constraints?.minHeight,
    maxHeight: element.constraints?.maxHeight,

    // 자기 정렬
    alignSelf: element.alignSelf,

    // z-index
    zIndex: element.zIndex,
  }

  return style
}

'use client'

/**
 * Auto Layout Block Renderer
 *
 * Flexbox 기반 Auto Layout 블록 렌더링
 * - 요소들이 direction에 따라 자동 배치
 * - absolute 요소와 auto 요소 분리 렌더링
 * - hug/fill 크기 모드 지원
 */

import { useMemo, type CSSProperties } from 'react'
import type { Block, BlockLayout, Element } from '../schema/types'
import { useBlockTokens } from '../context/block-context'
import { useDocument } from '../context/document-context'
import { ElementRenderer } from './element-renderer'
import { AutoLayoutElement } from './auto-layout-element'
import { resolveBlockHeightStyle } from '../utils/size-resolver'

// ============================================
// Types
// ============================================

export interface AutoLayoutBlockProps {
  block: Block
  editable?: boolean
  onElementClick?: (elementId: string) => void
}

// ============================================
// Main Component
// ============================================

export function AutoLayoutBlock({
  block,
  editable = false,
  onElementClick,
}: AutoLayoutBlockProps) {
  const tokens = useBlockTokens()
  const { viewport } = useDocument()
  const layout = block.layout!

  // absolute 요소와 auto 요소 분리
  const { absoluteElements, autoElements } = useMemo(() => {
    const absolute: Element[] = []
    const auto: Element[] = []

    for (const element of block.elements ?? []) {
      if (element.layoutMode === 'absolute') {
        absolute.push(element)
      } else {
        // layoutMode가 없거나 'auto'인 경우 auto로 취급
        auto.push(element)
      }
    }

    return { absoluteElements: absolute, autoElements: auto }
  }, [block.elements])

  // 컨테이너 스타일 계산
  const containerStyle = useMemo<CSSProperties>(() => {
    const style: CSSProperties = {
      // Flexbox 레이아웃
      display: 'flex',
      flexDirection: layout.direction === 'horizontal' ? 'row' : 'column',
      gap: layout.gap ? `${layout.gap}px` : undefined,
      alignItems: mapAlignItems(layout.alignItems),
      justifyContent: mapJustifyContent(layout.justifyContent),
      flexWrap: layout.wrap ? 'wrap' : 'nowrap',

      // 패딩
      paddingTop: layout.padding?.top,
      paddingRight: layout.padding?.right,
      paddingBottom: layout.padding?.bottom,
      paddingLeft: layout.padding?.left,

      // 블록 높이
      ...resolveBlockHeightStyle(block.height),

      // 기본 스타일
      position: 'relative',
      width: '100%',
      overflow: 'hidden',

      // 토큰 기반 스타일
      backgroundColor: tokens.bgSection,
      color: tokens.fgDefault,
    }

    return style
  }, [layout, block.height, tokens, viewport])

  return (
    <div
      className="se2-block se2-block--auto-layout"
      data-block-id={block.id}
      data-block-type={block.type}
      data-layout-mode="auto"
      style={containerStyle}
    >
      {/* Absolute 요소 (배경, 장식 등) */}
      {absoluteElements.map(element => (
        <ElementRenderer
          key={element.id}
          element={element}
          editable={editable}
          onClick={onElementClick}
        />
      ))}

      {/* Auto Layout 요소 (콘텐츠) */}
      {autoElements.map(element => (
        <AutoLayoutElement
          key={element.id}
          element={element}
          editable={editable}
          onClick={onElementClick}
        />
      ))}
    </div>
  )
}

// ============================================
// Utility Functions
// ============================================

/**
 * alignItems 값을 CSS flexbox 값으로 변환
 */
function mapAlignItems(
  value: BlockLayout['alignItems']
): CSSProperties['alignItems'] {
  switch (value) {
    case 'start':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'end':
      return 'flex-end'
    case 'stretch':
      return 'stretch'
    default:
      return 'stretch'
  }
}

/**
 * justifyContent 값을 CSS flexbox 값으로 변환
 */
function mapJustifyContent(
  value: BlockLayout['justifyContent']
): CSSProperties['justifyContent'] {
  switch (value) {
    case 'start':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'end':
      return 'flex-end'
    case 'space-between':
      return 'space-between'
    case 'space-around':
      return 'space-around'
    default:
      return 'flex-start'
  }
}

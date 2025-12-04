'use client'

import type { PrimitiveNode, ScrollContainerProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps } from '../types'

export function ScrollContainer({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<ScrollContainerProps>(node)
  const baseStyle = toInlineStyle(node.style)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  const getOverflow = () => {
    switch (props.direction) {
      case 'horizontal':
        return { overflowX: 'auto' as const, overflowY: 'hidden' as const }
      case 'both':
        return { overflow: 'auto' as const }
      case 'vertical':
      default:
        return { overflowX: 'hidden' as const, overflowY: 'auto' as const }
    }
  }

  const getSnapStyle = (): React.CSSProperties => {
    if (!props.snap) return {}

    const snapAxis =
      props.direction === 'horizontal'
        ? 'x'
        : props.direction === 'both'
          ? 'both'
          : 'y'

    return {
      scrollSnapType: `${snapAxis} ${props.snapType || 'mandatory'}`,
    }
  }

  const style: React.CSSProperties = {
    ...getOverflow(),
    ...getSnapStyle(),
    WebkitOverflowScrolling: 'touch',
    ...baseStyle,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // 스크롤바 숨기기 CSS
  const hideScrollbarStyle = props.hideScrollbar
    ? {
        scrollbarWidth: 'none' as const,
        msOverflowStyle: 'none' as const,
      }
    : {}

  return (
    <div
      data-node-id={node.id}
      data-node-type="scroll-container"
      style={{ ...style, ...hideScrollbarStyle }}
      className={props.hideScrollbar ? 'hide-scrollbar' : undefined}
      onClick={
        context.mode === 'edit'
          ? (e) => {
              e.stopPropagation()
              context.onSelectNode?.(node.id)
            }
          : undefined
      }
    >
      {node.children?.map((child) => context.renderNode(child))}
    </div>
  )
}

export const scrollContainerRenderer: PrimitiveRenderer<ScrollContainerProps> = {
  type: 'scroll-container',
  render: (node, context) => (
    <ScrollContainer key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'direction',
      label: '스크롤 방향',
      type: 'select',
      options: [
        { value: 'vertical', label: '세로' },
        { value: 'horizontal', label: '가로' },
        { value: 'both', label: '양방향' },
      ],
      defaultValue: 'vertical',
    },
    {
      key: 'snap',
      label: '스냅 스크롤',
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'snapType',
      label: '스냅 타입',
      type: 'select',
      options: [
        { value: 'mandatory', label: '필수' },
        { value: 'proximity', label: '근접' },
      ],
      defaultValue: 'mandatory',
    },
    {
      key: 'hideScrollbar',
      label: '스크롤바 숨기기',
      type: 'boolean',
      defaultValue: false,
    },
  ],
}

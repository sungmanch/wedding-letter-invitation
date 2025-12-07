'use client'

import type { PrimitiveNode, ContainerProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { getNodeProps, mergeNodeStyles, getNodeEventHandlers } from '../types'

// 확장된 노드 타입 (tokenStyle, events 포함)
interface ExtendedNode extends PrimitiveNode {
  tokenStyle?: Record<string, unknown>
  events?: import('../../context/EventContext').NodeEventHandler[]
}

export function Container({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const extNode = node as ExtendedNode
  const props = getNodeProps<ContainerProps>(node)

  // 토큰 스타일 + 직접 스타일 병합
  const mergedStyle = mergeNodeStyles(extNode, context)

  // 이벤트 핸들러 생성
  const eventHandlers = getNodeEventHandlers(extNode, context)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 편집 모드 클릭 핸들러
  const handleClick = context.mode === 'edit'
    ? (e: React.MouseEvent) => {
        e.stopPropagation()
        context.onSelectNode?.(node.id)
      }
    : eventHandlers.onClick

  return (
    <div
      data-node-id={node.id}
      data-node-type="container"
      className={props.className}
      style={{
        ...mergedStyle,
        outline: isSelected ? '2px solid #3b82f6' : undefined,
      }}
      onClick={handleClick}
      onScroll={eventHandlers.onScroll}
      onMouseEnter={eventHandlers.onMouseEnter}
      onMouseLeave={eventHandlers.onMouseLeave}
    >
      {node.children?.map((child) => context.renderNode(child))}
    </div>
  )
}

export const containerRenderer: PrimitiveRenderer<ContainerProps> = {
  type: 'container',
  render: (node, context) => (
    <Container key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'className',
      label: '클래스명',
      type: 'text',
    },
  ],
}

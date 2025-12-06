'use client'

import type { PrimitiveNode, RowProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { getNodeProps, mergeNodeStyles, getNodeEventHandlers } from '../types'

// 확장된 노드 타입 (tokenStyle, events 포함)
interface ExtendedNode extends PrimitiveNode {
  tokenStyle?: Record<string, unknown>
  events?: import('../../context/EventContext').NodeEventHandler[]
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
}

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
}

export function Row({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const extNode = node as ExtendedNode
  const props = getNodeProps<RowProps>(node)

  // 토큰 스타일 + 직접 스타일 병합
  const mergedStyle = mergeNodeStyles(extNode, context)

  // 이벤트 핸들러 생성
  const eventHandlers = getNodeEventHandlers(extNode, context)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: props.gap,
    alignItems: props.align ? alignMap[props.align] : undefined,
    justifyContent: props.justify ? justifyMap[props.justify] : undefined,
    flexWrap: props.wrap ? 'wrap' : undefined,
    ...mergedStyle,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  const handleClick = context.mode === 'edit'
    ? (e: React.MouseEvent) => {
        e.stopPropagation()
        context.onSelectNode?.(node.id)
      }
    : eventHandlers.onClick

  return (
    <div
      data-node-id={node.id}
      data-node-type="row"
      style={style}
      onClick={handleClick}
      onMouseEnter={eventHandlers.onMouseEnter}
      onMouseLeave={eventHandlers.onMouseLeave}
    >
      {node.children?.map((child) => context.renderNode(child))}
    </div>
  )
}

export const rowRenderer: PrimitiveRenderer<RowProps> = {
  type: 'row',
  render: (node, context) => <Row key={node.id} node={node} context={context} />,
  editableProps: [
    {
      key: 'gap',
      label: '간격',
      type: 'spacing',
      defaultValue: 0,
    },
    {
      key: 'align',
      label: '세로 정렬',
      type: 'select',
      options: [
        { value: 'start', label: '시작' },
        { value: 'center', label: '가운데' },
        { value: 'end', label: '끝' },
        { value: 'stretch', label: '늘리기' },
      ],
    },
    {
      key: 'justify',
      label: '가로 정렬',
      type: 'select',
      options: [
        { value: 'start', label: '시작' },
        { value: 'center', label: '가운데' },
        { value: 'end', label: '끝' },
        { value: 'between', label: '균등 분배' },
        { value: 'around', label: '균등 여백' },
      ],
    },
    {
      key: 'wrap',
      label: '줄바꿈',
      type: 'boolean',
      defaultValue: false,
    },
  ],
}

'use client'

import type { PrimitiveNode, RowProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps } from '../types'

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
  const props = getNodeProps<RowProps>(node)
  const baseStyle = toInlineStyle(node.style)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: props.gap,
    alignItems: props.align ? alignMap[props.align] : undefined,
    justifyContent: props.justify ? justifyMap[props.justify] : undefined,
    flexWrap: props.wrap ? 'wrap' : undefined,
    ...baseStyle,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  return (
    <div
      data-node-id={node.id}
      data-node-type="row"
      style={style}
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

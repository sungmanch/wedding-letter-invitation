'use client'

import type { PrimitiveNode, SpacerProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { getNodeProps, mergeNodeStyles } from '../types'

// 확장된 노드 타입 (tokenStyle 포함)
interface ExtendedNode extends PrimitiveNode {
  tokenStyle?: Record<string, unknown>
}

export function Spacer({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const extNode = node as ExtendedNode
  const props = getNodeProps<SpacerProps>(node)
  const style = mergeNodeStyles(extNode, context)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  const spacerStyle: React.CSSProperties = {
    height:
      props.height !== undefined
        ? typeof props.height === 'number'
          ? `${props.height}px`
          : props.height
        : '16px',
    width:
      props.width !== undefined
        ? typeof props.width === 'number'
          ? `${props.width}px`
          : props.width
        : undefined,
    flexShrink: 0,
    ...style,
    outline: isSelected ? '2px dashed #3b82f6' : undefined,
    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : undefined,
  }

  return (
    <div
      data-node-id={node.id}
      data-node-type="spacer"
      style={spacerStyle}
      onClick={
        context.mode === 'edit'
          ? (e) => {
              e.stopPropagation()
              context.onSelectNode?.(node.id)
            }
          : undefined
      }
    />
  )
}

export const spacerRenderer: PrimitiveRenderer<SpacerProps> = {
  type: 'spacer',
  render: (node, context) => (
    <Spacer key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'height',
      label: '높이',
      type: 'spacing',
      defaultValue: 16,
    },
    {
      key: 'width',
      label: '너비',
      type: 'spacing',
    },
  ],
}

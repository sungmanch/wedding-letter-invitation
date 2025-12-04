'use client'

import type { PrimitiveNode, FullscreenProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps } from '../types'

export function Fullscreen({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<FullscreenProps>(node)
  const baseStyle = toInlineStyle(node.style)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  const style: React.CSSProperties = {
    width: '100%',
    minHeight: props.minHeight || '100vh',
    maxHeight: props.maxHeight,
    position: 'relative',
    ...baseStyle,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  return (
    <div
      data-node-id={node.id}
      data-node-type="fullscreen"
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

export const fullscreenRenderer: PrimitiveRenderer<FullscreenProps> = {
  type: 'fullscreen',
  render: (node, context) => (
    <Fullscreen key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'minHeight',
      label: '최소 높이',
      type: 'text',
      defaultValue: '100vh',
    },
    {
      key: 'maxHeight',
      label: '최대 높이',
      type: 'text',
    },
  ],
}

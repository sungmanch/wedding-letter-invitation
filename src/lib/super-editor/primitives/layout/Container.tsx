'use client'

import type { PrimitiveNode, ContainerProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps } from '../types'

export function Container({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<ContainerProps>(node)
  const style = toInlineStyle(node.style)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  return (
    <div
      data-node-id={node.id}
      data-node-type="container"
      className={props.className}
      style={{
        ...style,
        outline: isSelected ? '2px solid #3b82f6' : undefined,
      }}
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

'use client'

import type { PrimitiveNode, DividerProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps } from '../types'

export function Divider({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<DividerProps>(node)
  const style = toInlineStyle(node.style)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  const isHorizontal = props.orientation !== 'vertical'
  const thickness = props.thickness || 1
  const variant = props.variant || 'solid'
  const color = props.color || '#e5e7eb'

  const dividerStyle: React.CSSProperties = {
    ...(isHorizontal
      ? {
          width: '100%',
          height: `${thickness}px`,
          borderTop: `${thickness}px ${variant} ${color}`,
        }
      : {
          height: '100%',
          width: `${thickness}px`,
          borderLeft: `${thickness}px ${variant} ${color}`,
        }),
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  return (
    <div
      data-node-id={node.id}
      data-node-type="divider"
      role="separator"
      aria-orientation={props.orientation || 'horizontal'}
      style={dividerStyle}
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

export const dividerRenderer: PrimitiveRenderer<DividerProps> = {
  type: 'divider',
  render: (node, context) => (
    <Divider key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'orientation',
      label: '방향',
      type: 'select',
      options: [
        { value: 'horizontal', label: '가로' },
        { value: 'vertical', label: '세로' },
      ],
      defaultValue: 'horizontal',
    },
    {
      key: 'variant',
      label: '스타일',
      type: 'select',
      options: [
        { value: 'solid', label: '실선' },
        { value: 'dashed', label: '대시' },
        { value: 'dotted', label: '점선' },
      ],
      defaultValue: 'solid',
    },
    {
      key: 'thickness',
      label: '두께',
      type: 'number',
      defaultValue: 1,
    },
    {
      key: 'color',
      label: '색상',
      type: 'color',
      defaultValue: '#e5e7eb',
    },
  ],
}

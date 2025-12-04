'use client'

import type { PrimitiveNode, OverlayProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps } from '../types'

const positionStyles: Record<
  NonNullable<OverlayProps['position']>,
  React.CSSProperties
> = {
  center: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  top: {
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  bottom: {
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  left: {
    top: '50%',
    left: 0,
    transform: 'translateY(-50%)',
  },
  right: {
    top: '50%',
    right: 0,
    transform: 'translateY(-50%)',
  },
  custom: {},
}

export function Overlay({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<OverlayProps>(node)
  const baseStyle = toInlineStyle(node.style)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id
  const position = props.position || 'center'

  const insetStyle =
    props.inset !== undefined
      ? typeof props.inset === 'number'
        ? { inset: `${props.inset}px` }
        : { inset: props.inset }
      : {}

  const style: React.CSSProperties = {
    position: 'absolute',
    zIndex: 10,
    ...positionStyles[position],
    ...insetStyle,
    ...baseStyle,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  return (
    <div
      data-node-id={node.id}
      data-node-type="overlay"
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

export const overlayRenderer: PrimitiveRenderer<OverlayProps> = {
  type: 'overlay',
  render: (node, context) => (
    <Overlay key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'position',
      label: '위치',
      type: 'select',
      options: [
        { value: 'center', label: '중앙' },
        { value: 'top', label: '상단' },
        { value: 'bottom', label: '하단' },
        { value: 'left', label: '좌측' },
        { value: 'right', label: '우측' },
        { value: 'custom', label: '커스텀' },
      ],
      defaultValue: 'center',
    },
    {
      key: 'inset',
      label: '여백',
      type: 'spacing',
    },
  ],
}

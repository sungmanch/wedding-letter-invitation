'use client'

import { useEffect, useRef, useState, Children, cloneElement, isValidElement } from 'react'
import type { PrimitiveNode, SequenceProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps } from '../types'

export function Sequence({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<SequenceProps>(node)
  const style = toInlineStyle(node.style)
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  const staggerDelay = props.staggerDelay || 100
  const direction = props.direction || 'forward'

  // IntersectionObserver
  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const containerStyle: React.CSSProperties = {
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // 자식 노드 렌더링 (딜레이 적용)
  const children = node.children || []
  const orderedChildren =
    direction === 'reverse' ? [...children].reverse() : children

  return (
    <div
      ref={ref}
      data-node-id={node.id}
      data-node-type="sequence"
      style={containerStyle}
      onClick={
        context.mode === 'edit'
          ? (e) => {
              e.stopPropagation()
              context.onSelectNode?.(node.id)
            }
          : undefined
      }
    >
      {orderedChildren.map((child, index) => {
        const delay = index * staggerDelay

        return (
          <div
            key={child.id}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.5s ease ${delay}ms`,
            }}
          >
            {context.renderNode(child)}
          </div>
        )
      })}
    </div>
  )
}

export const sequenceRenderer: PrimitiveRenderer<SequenceProps> = {
  type: 'sequence',
  render: (node, context) => (
    <Sequence key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'staggerDelay',
      label: '딜레이 간격 (ms)',
      type: 'number',
      defaultValue: 100,
    },
    {
      key: 'direction',
      label: '방향',
      type: 'select',
      options: [
        { value: 'forward', label: '정방향' },
        { value: 'reverse', label: '역방향' },
      ],
      defaultValue: 'forward',
    },
  ],
}

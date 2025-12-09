'use client'

import { useEffect, useRef, useState } from 'react'
import type { PrimitiveNode, ParallelProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps } from '../types'

export function Parallel({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  getNodeProps<ParallelProps>(node)
  const style = toInlineStyle(node.style)
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

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

  // 모든 자식이 동시에 애니메이션
  return (
    <div
      ref={ref}
      data-node-id={node.id}
      data-node-type="parallel"
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
      {node.children?.map((child) => (
        <div
          key={child.id}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 0.5s ease',
          }}
        >
          {context.renderNode(child)}
        </div>
      ))}
    </div>
  )
}

export const parallelRenderer: PrimitiveRenderer<ParallelProps> = {
  type: 'parallel',
  render: (node, context) => (
    <Parallel key={node.id} node={node} context={context} />
  ),
  editableProps: [],
}

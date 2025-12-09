'use client'

import { useState, useRef } from 'react'
import type { PrimitiveNode } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, getValueByPath } from '../types'

export interface AccordionStackProps {
  /** 이미지 배열 또는 데이터 바인딩 경로 */
  images: string[] | string
  /** 축소된 상태의 이미지 높이 (px) */
  collapsedHeight?: number
  /** 확장된 상태의 이미지 높이 (px) */
  expandedHeight?: number
  /** 이미지 간 간격 (px) */
  gap?: number
  /** 애니메이션 지속시간 (ms) */
  duration?: number
  /** 클릭 동작 */
  onClick?: 'expand' | 'lightbox' | 'both'
}

export function AccordionStack({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<AccordionStackProps>(node)
  const style = toInlineStyle(node.style)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 이미지 배열 해결
  let images: string[] = []
  if (typeof props.images === 'string') {
    if (props.images.startsWith('{{')) {
      const path = props.images.replace(/^\{\{|\}\}$/g, '').trim()
      const resolved = getValueByPath(context.data, path)
      if (Array.isArray(resolved)) {
        images = resolved as string[]
      }
    } else {
      images = [props.images]
    }
  } else if (Array.isArray(props.images)) {
    images = props.images
  }

  const collapsedHeight = props.collapsedHeight || 120
  const expandedHeight = props.expandedHeight || 300
  const gap = props.gap ?? 4
  const duration = props.duration || 400
  const onClick = props.onClick || 'expand'

  const handleImageClick = (index: number) => {
    if (context.mode === 'edit') return

    if (onClick === 'expand' || onClick === 'both') {
      setExpandedIndex(expandedIndex === index ? null : index)
    }

    if (onClick === 'lightbox' || onClick === 'both') {
      // Lightbox 이벤트 발생
      const event = new CustomEvent('open-lightbox', {
        detail: { images, currentIndex: index },
      })
      window.dispatchEvent(event)
    }
  }

  if (images.length === 0) {
    return (
      <div
        data-node-id={node.id}
        data-node-type="accordion-stack"
        style={{
          padding: '40px',
          textAlign: 'center',
          color: '#999',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          ...style,
        }}
      >
        이미지를 추가해주세요
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      data-node-id={node.id}
      data-node-type="accordion-stack"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`,
        width: '100%',
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
      {images.map((src, index) => {
        const isExpanded = expandedIndex === index
        const currentHeight = isExpanded ? expandedHeight : collapsedHeight

        return (
          <div
            key={index}
            onClick={() => handleImageClick(index)}
            style={{
              position: 'relative',
              width: '100%',
              height: `${currentHeight}px`,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: `height ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`갤러리 이미지 ${index + 1}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                width: '100%',
                height: 'auto',
                minHeight: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                transform: 'translateY(-50%)',
                transition: `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export const accordionStackRenderer: PrimitiveRenderer<AccordionStackProps> = {
  type: 'accordion-stack',
  render: (node, context) => (
    <AccordionStack key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'collapsedHeight',
      label: '축소 높이 (px)',
      type: 'number',
      defaultValue: 120,
    },
    {
      key: 'expandedHeight',
      label: '확장 높이 (px)',
      type: 'number',
      defaultValue: 300,
    },
    {
      key: 'gap',
      label: '간격 (px)',
      type: 'number',
      defaultValue: 4,
    },
    {
      key: 'duration',
      label: '애니메이션 (ms)',
      type: 'number',
      defaultValue: 400,
    },
    {
      key: 'onClick',
      label: '클릭 동작',
      type: 'select',
      options: [
        { value: 'expand', label: '확장만' },
        { value: 'lightbox', label: '라이트박스만' },
        { value: 'both', label: '확장 + 라이트박스' },
      ],
      defaultValue: 'expand',
    },
  ],
}

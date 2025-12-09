'use client'

import { useState, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { PrimitiveNode } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, getValueByPath } from '../types'

// GSAP 플러그인 등록
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP)
}

export interface AccordionStackProps {
  /** 이미지 배열 또는 데이터 바인딩 경로 */
  images: string[] | string
  /** 기본 상태의 이미지 높이 (px) - 아무것도 선택 안됐을 때 */
  collapsedHeight?: number
  /** 확장된 상태의 이미지 높이 (px) */
  expandedHeight?: number
  /** 최소화된 상태의 이미지 높이 (px) - 다른 이미지가 확장됐을 때 */
  minimizedHeight?: number
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
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

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
  const minimizedHeight = props.minimizedHeight || 60
  const gap = props.gap ?? 4
  const duration = (props.duration || 400) / 1000
  const onClick = props.onClick || 'expand'

  // GSAP 확장/축소 애니메이션
  useGSAP(() => {
    if (!containerRef.current) return

    itemRefs.current.forEach((item, index) => {
      if (!item) return

      const isExpanded = expandedIndex === index
      const isMinimized = expandedIndex !== null && expandedIndex !== index

      // 확장된 것이 있으면: 확장된 것은 expandedHeight, 나머지는 minimizedHeight
      // 확장된 것이 없으면: 모두 collapsedHeight
      let targetHeight: number
      if (isExpanded) {
        targetHeight = expandedHeight
      } else if (isMinimized) {
        targetHeight = minimizedHeight
      } else {
        targetHeight = collapsedHeight
      }

      gsap.to(item, {
        height: targetHeight,
        duration,
        ease: 'power2.out',
      })

      // 내부 이미지 스케일 및 밝기 애니메이션
      const img = item.querySelector('img')
      if (img) {
        gsap.to(img, {
          scale: isExpanded ? 1.05 : 1,
          filter: isMinimized ? 'brightness(0.7)' : 'brightness(1)',
          duration,
          ease: 'power2.out',
        })
      }
    })
  }, { scope: containerRef, dependencies: [expandedIndex, collapsedHeight, expandedHeight, minimizedHeight, duration] })

  const handleImageClick = (index: number) => {
    if (context.mode === 'edit') return

    if (onClick === 'expand' || onClick === 'both') {
      setExpandedIndex(expandedIndex === index ? null : index)
    }

    if (onClick === 'lightbox' || onClick === 'both') {
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
      {images.map((src, index) => (
        <div
          key={index}
          ref={(el) => { itemRefs.current[index] = el }}
          onClick={() => handleImageClick(index)}
          style={{
            position: 'relative',
            width: '100%',
            height: `${collapsedHeight}px`,
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
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
              willChange: 'transform',
            }}
          />
        </div>
      ))}
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
      label: '기본 높이 (px)',
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
      key: 'minimizedHeight',
      label: '최소화 높이 (px)',
      type: 'number',
      defaultValue: 60,
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

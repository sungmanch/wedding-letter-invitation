'use client'

import { useRef, useMemo } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { PrimitiveNode } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, getValueByPath } from '../types'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP)
}

export interface PolaroidProps {
  images: string[] | string
  layout?: 'scattered' | 'grid' | 'stack'
  maxRotation?: number
  frameColor?: string
  shadowIntensity?: number
  onClick?: 'lightbox' | 'none'
}

export function Polaroid({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<PolaroidProps>(node)
  const style = toInlineStyle(node.style)
  const containerRef = useRef<HTMLDivElement>(null)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

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

  const layout = props.layout || 'scattered'
  const maxRotation = props.maxRotation ?? 8
  const frameColor = props.frameColor || '#ffffff'
  const shadowIntensity = props.shadowIntensity ?? 0.15

  // 각 폴라로이드의 랜덤 회전값 생성 (메모이제이션)
  const rotations = useMemo(() => {
    return images.map(() => (Math.random() - 0.5) * 2 * maxRotation)
  }, [images.length, maxRotation])

  // GSAP 호버 애니메이션
  useGSAP(() => {
    if (!containerRef.current || context.mode === 'edit') return

    const items = containerRef.current.querySelectorAll('.polaroid-item')

    items.forEach((item) => {
      const originalRotation = item.getAttribute('data-rotation') || '0'

      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          scale: 1.05,
          rotation: 0,
          zIndex: 10,
          duration: 0.3,
          ease: 'power2.out',
        })
      })

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          scale: 1,
          rotation: parseFloat(originalRotation),
          zIndex: 1,
          duration: 0.3,
          ease: 'power2.out',
        })
      })
    })
  }, { scope: containerRef, dependencies: [context.mode, images.length] })

  const handleClick = (index: number) => {
    if (props.onClick === 'lightbox' && context.mode !== 'edit') {
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
        data-node-type="polaroid"
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

  const getLayoutStyle = (): React.CSSProperties => {
    switch (layout) {
      case 'grid':
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          padding: '16px',
        }
      case 'stack':
        return {
          position: 'relative',
          height: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }
      case 'scattered':
      default:
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '32px',
          padding: '16px',
        }
    }
  }

  const getItemStyle = (index: number): React.CSSProperties => {
    const rotation = rotations[index] || 0
    const baseStyle: React.CSSProperties = {
      backgroundColor: frameColor,
      padding: '12px 12px 40px 12px',
      boxShadow: `0 4px 20px rgba(0, 0, 0, ${shadowIntensity}), 0 2px 8px rgba(0, 0, 0, ${shadowIntensity * 0.5})`,
      cursor: props.onClick === 'lightbox' ? 'pointer' : 'default',
      willChange: 'transform',
    }

    if (layout === 'stack') {
      return {
        ...baseStyle,
        position: 'absolute',
        transform: `rotate(${rotation}deg) translateX(${(index - images.length / 2) * 20}px)`,
        zIndex: images.length - index,
      }
    }

    return {
      ...baseStyle,
      transform: `rotate(${rotation}deg)`,
    }
  }

  return (
    <div
      ref={containerRef}
      data-node-id={node.id}
      data-node-type="polaroid"
      style={{
        ...getLayoutStyle(),
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
          className="polaroid-item"
          data-rotation={rotations[index]}
          onClick={() => handleClick(index)}
          style={getItemStyle(index)}
        >
          <img
            src={src}
            alt={`폴라로이드 ${index + 1}`}
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      ))}
    </div>
  )
}

export const polaroidRenderer: PrimitiveRenderer<PolaroidProps> = {
  type: 'polaroid',
  render: (node, context) => <Polaroid key={node.id} node={node} context={context} />,
  editableProps: [
    {
      key: 'layout',
      label: '레이아웃',
      type: 'select',
      options: [
        { value: 'scattered', label: '흩어진' },
        { value: 'grid', label: '정렬' },
        { value: 'stack', label: '겹침' },
      ],
      defaultValue: 'scattered',
    },
    {
      key: 'maxRotation',
      label: '최대 회전 (도)',
      type: 'number',
      defaultValue: 8,
    },
    {
      key: 'frameColor',
      label: '프레임 색상',
      type: 'color',
      defaultValue: '#ffffff',
    },
  ],
}

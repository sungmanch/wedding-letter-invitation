'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { PrimitiveNode } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, getValueByPath } from '../types'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP)
}

export interface FlipCardsProps {
  images: string[] | string
  columns?: 2 | 3
  gap?: number
  flipDirection?: 'horizontal' | 'vertical'
  backContent?: 'caption' | 'overlay' | 'none'
  onClick?: 'lightbox' | 'none'
}

export function FlipCards({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<FlipCardsProps>(node)
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

  const columns = typeof props.columns === 'string' ? parseInt(props.columns, 10) : (props.columns || 2)
  const gap = props.gap ?? 8
  const flipDirection = props.flipDirection || 'horizontal'
  const backContent = props.backContent || 'overlay'

  // GSAP 플립 애니메이션
  useGSAP(() => {
    if (!containerRef.current || context.mode === 'edit') return

    const cards = containerRef.current.querySelectorAll('.flip-card')

    cards.forEach((card) => {
      const inner = card.querySelector('.flip-card-inner') as HTMLElement
      if (!inner) return

      const isHorizontal = flipDirection === 'horizontal'
      const flipProp = isHorizontal ? 'rotateY' : 'rotateX'

      // 초기 상태 설정
      gsap.set(inner, {
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      })

      card.addEventListener('mouseenter', () => {
        gsap.to(inner, {
          [flipProp]: 180,
          duration: 0.6,
          ease: 'power2.out',
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(inner, {
          [flipProp]: 0,
          duration: 0.6,
          ease: 'power2.out',
        })
      })

      // 터치 디바이스 토글
      let isFlipped = false
      card.addEventListener('touchend', (e) => {
        e.preventDefault()
        isFlipped = !isFlipped
        gsap.to(inner, {
          [flipProp]: isFlipped ? 180 : 0,
          duration: 0.6,
          ease: 'power2.out',
        })
      })
    })
  }, { scope: containerRef, dependencies: [context.mode, images.length, flipDirection] })

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
        data-node-type="flip-cards"
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

  const isHorizontal = flipDirection === 'horizontal'

  return (
    <div
      ref={containerRef}
      data-node-id={node.id}
      data-node-type="flip-cards"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        perspective: '1000px',
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
          className="flip-card"
          onClick={() => handleClick(index)}
          style={{
            aspectRatio: '3 / 4',
            cursor: props.onClick === 'lightbox' ? 'pointer' : 'default',
            perspective: '1000px',
          }}
        >
          <div
            className="flip-card-inner"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* 앞면 */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <img
                src={src}
                alt={`갤러리 ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            {/* 뒷면 */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: isHorizontal ? 'rotateY(180deg)' : 'rotateX(180deg)',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {backContent === 'overlay' && (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <img
                    src={src}
                    alt={`갤러리 ${index + 1} 뒷면`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      filter: 'brightness(0.6) saturate(0.8)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 500,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    {index + 1} / {images.length}
                  </div>
                </div>
              )}
              {backContent === 'caption' && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'var(--color-surface, #f5f5f5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ color: 'var(--color-text-primary, #333)' }}>
                    Photo {index + 1}
                  </span>
                </div>
              )}
              {backContent === 'none' && (
                <img
                  src={src}
                  alt={`갤러리 ${index + 1} 뒷면`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transform: 'scale(-1, 1)',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const flipCardsRenderer: PrimitiveRenderer<FlipCardsProps> = {
  type: 'flip-cards',
  render: (node, context) => <FlipCards key={node.id} node={node} context={context} />,
  editableProps: [
    {
      key: 'columns',
      label: '컬럼 수',
      type: 'select',
      options: [
        { value: '2', label: '2열' },
        { value: '3', label: '3열' },
      ],
      defaultValue: '2',
    },
    {
      key: 'flipDirection',
      label: '플립 방향',
      type: 'select',
      options: [
        { value: 'horizontal', label: '가로 회전' },
        { value: 'vertical', label: '세로 회전' },
      ],
      defaultValue: 'horizontal',
    },
    {
      key: 'backContent',
      label: '뒷면 내용',
      type: 'select',
      options: [
        { value: 'overlay', label: '오버레이' },
        { value: 'caption', label: '캡션' },
        { value: 'none', label: '미러' },
      ],
      defaultValue: 'overlay',
    },
    {
      key: 'gap',
      label: '간격 (px)',
      type: 'number',
      defaultValue: 8,
    },
  ],
}

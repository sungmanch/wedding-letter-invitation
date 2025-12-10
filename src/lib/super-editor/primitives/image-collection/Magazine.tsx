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

export interface MagazineProps {
  images: string[] | string
  gap?: number
  pattern?: 'featured-left' | 'featured-right' | 'alternating'
  onClick?: 'lightbox' | 'none'
}

export function Magazine({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<MagazineProps>(node)
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

  const gap = props.gap ?? 4
  const pattern = props.pattern || 'featured-right'

  // GSAP 호버 애니메이션
  useGSAP(() => {
    if (!containerRef.current || context.mode === 'edit') return

    const items = containerRef.current.querySelectorAll('.magazine-item')

    items.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
        })
      })

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          scale: 1,
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
        data-node-type="magazine"
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

  // 이미지를 3개씩 그룹으로 나눔 (1개 큰 것 + 2개 작은 것)
  const renderGroups = () => {
    const groups: React.ReactNode[] = []
    let imageIndex = 0

    while (imageIndex < images.length) {
      const groupIndex = groups.length
      const isLeftFeatured = pattern === 'featured-left' ||
        (pattern === 'alternating' && groupIndex % 2 === 0)

      const featuredImage = images[imageIndex]
      const smallImages = images.slice(imageIndex + 1, imageIndex + 3)

      groups.push(
        <div
          key={groupIndex}
          style={{
            display: 'grid',
            gridTemplateColumns: isLeftFeatured ? '2fr 1fr' : '1fr 2fr',
            gap: `${gap}px`,
          }}
        >
          {isLeftFeatured ? (
            <>
              {/* 큰 이미지 (왼쪽) */}
              <div
                className="magazine-item"
                onClick={() => handleClick(imageIndex)}
                style={{
                  gridRow: 'span 2',
                  cursor: props.onClick === 'lightbox' ? 'pointer' : 'default',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={featuredImage}
                  alt={`매거진 ${imageIndex + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              {/* 작은 이미지들 (오른쪽) */}
              {smallImages.map((src, i) => (
                <div
                  key={i}
                  className="magazine-item"
                  onClick={() => handleClick(imageIndex + 1 + i)}
                  style={{
                    cursor: props.onClick === 'lightbox' ? 'pointer' : 'default',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={src}
                    alt={`매거진 ${imageIndex + 2 + i}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      aspectRatio: '1 / 1',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
              ))}
              {/* 이미지가 1개만 있을 경우 빈 공간 */}
              {smallImages.length === 1 && <div />}
            </>
          ) : (
            <>
              {/* 작은 이미지들 (왼쪽) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
                {smallImages.map((src, i) => (
                  <div
                    key={i}
                    className="magazine-item"
                    onClick={() => handleClick(imageIndex + 1 + i)}
                    style={{
                      flex: 1,
                      cursor: props.onClick === 'lightbox' ? 'pointer' : 'default',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={src}
                      alt={`매거진 ${imageIndex + 2 + i}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                ))}
              </div>
              {/* 큰 이미지 (오른쪽) */}
              <div
                className="magazine-item"
                onClick={() => handleClick(imageIndex)}
                style={{
                  cursor: props.onClick === 'lightbox' ? 'pointer' : 'default',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={featuredImage}
                  alt={`매거진 ${imageIndex + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            </>
          )}
        </div>
      )

      imageIndex += 1 + smallImages.length
    }

    return groups
  }

  return (
    <div
      ref={containerRef}
      data-node-id={node.id}
      data-node-type="magazine"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`,
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
      {renderGroups()}
    </div>
  )
}

export const magazineRenderer: PrimitiveRenderer<MagazineProps> = {
  type: 'magazine',
  render: (node, context) => <Magazine key={node.id} node={node} context={context} />,
  editableProps: [
    {
      key: 'pattern',
      label: '패턴',
      type: 'select',
      options: [
        { value: 'featured-left', label: '왼쪽 강조' },
        { value: 'featured-right', label: '오른쪽 강조' },
        { value: 'alternating', label: '번갈아' },
      ],
      defaultValue: 'featured-right',
    },
    {
      key: 'gap',
      label: '간격 (px)',
      type: 'number',
      defaultValue: 4,
    },
  ],
}

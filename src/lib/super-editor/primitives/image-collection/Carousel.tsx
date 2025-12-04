'use client'

import { useState, useEffect, useRef } from 'react'
import type { PrimitiveNode, CarouselProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, getValueByPath } from '../types'

export function Carousel({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<CarouselProps>(node)
  const style = toInlineStyle(node.style)
  const [currentIndex, setCurrentIndex] = useState(0)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

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

  const effect = props.effect || 'slide'
  const slidesToShow = props.slidesToShow || 1

  // 자동 재생
  useEffect(() => {
    if (props.autoplay && context.mode !== 'edit' && images.length > 1) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) =>
          props.infinite
            ? (prev + 1) % images.length
            : Math.min(prev + 1, images.length - 1)
        )
      }, props.autoplayInterval || 3000)
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [props.autoplay, props.autoplayInterval, props.infinite, images.length, context.mode])

  const goTo = (index: number) => {
    if (props.infinite) {
      setCurrentIndex((index + images.length) % images.length)
    } else {
      setCurrentIndex(Math.max(0, Math.min(index, images.length - 1)))
    }
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // Fade 효과
  if (effect === 'fade') {
    return (
      <div
        data-node-id={node.id}
        data-node-type="carousel"
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
        <div style={{ position: 'relative', width: '100%', aspectRatio: props.aspectRatio?.replace(':', '/') || '16/9' }}>
          {images.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={src}
              alt={`슬라이드 ${index + 1}`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: props.objectFit || 'cover',
                opacity: index === currentIndex ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}
            />
          ))}
        </div>

        <CarouselControls />
      </div>
    )
  }

  // Slide 효과 (기본)
  return (
    <div
      data-node-id={node.id}
      data-node-type="carousel"
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
      <div
        style={{
          display: 'flex',
          gap: `${props.spacing || 0}px`,
          transform: `translateX(calc(-${currentIndex * (100 / slidesToShow)}% - ${currentIndex * (props.spacing || 0)}px))`,
          transition: 'transform 0.5s ease',
        }}
      >
        {images.map((src, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={index}
            src={src}
            alt={`슬라이드 ${index + 1}`}
            style={{
              flex: `0 0 calc(${100 / slidesToShow}% - ${((slidesToShow - 1) * (props.spacing || 0)) / slidesToShow}px)`,
              aspectRatio: props.aspectRatio?.replace(':', '/') || '16/9',
              objectFit: props.objectFit || 'cover',
              borderRadius: '8px',
            }}
          />
        ))}
      </div>

      <CarouselControls />
    </div>
  )

  function CarouselControls() {
    return (
      <>
        {/* 화살표 */}
        {props.showArrows !== false && images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goTo(currentIndex - 1)
              }}
              style={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '8px 12px',
                backgroundColor: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goTo(currentIndex + 1)
              }}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '8px 12px',
                backgroundColor: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              ›
            </button>
          </>
        )}

        {/* 도트 인디케이터 */}
        {props.showDots !== false && images.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
              zIndex: 10,
            }}
          >
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  goTo(index)
                }}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor:
                    index === currentIndex
                      ? 'rgba(255,255,255,1)'
                      : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              />
            ))}
          </div>
        )}
      </>
    )
  }
}

export const carouselRenderer: PrimitiveRenderer<CarouselProps> = {
  type: 'carousel',
  render: (node, context) => (
    <Carousel key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'autoplay',
      label: '자동 재생',
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'autoplayInterval',
      label: '재생 간격 (ms)',
      type: 'number',
      defaultValue: 3000,
    },
    {
      key: 'infinite',
      label: '무한 반복',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'effect',
      label: '효과',
      type: 'select',
      options: [
        { value: 'slide', label: '슬라이드' },
        { value: 'fade', label: '페이드' },
      ],
      defaultValue: 'slide',
    },
    {
      key: 'slidesToShow',
      label: '표시 개수',
      type: 'number',
      defaultValue: 1,
    },
    {
      key: 'showArrows',
      label: '화살표 표시',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'showDots',
      label: '도트 표시',
      type: 'boolean',
      defaultValue: true,
    },
  ],
}

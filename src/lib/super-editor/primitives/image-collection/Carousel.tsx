'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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

  // 스와이프 상태
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const dragStartX = useRef(0)
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

  // effect 해결 (데이터 바인딩 지원)
  let effect: NonNullable<CarouselProps['effect']> = 'slide'
  if (props.effect) {
    if (typeof props.effect === 'string' && props.effect.startsWith('{{')) {
      const path = props.effect.replace(/^\{\{|\}\}$/g, '').trim()
      const resolved = getValueByPath(context.data, path)
      if (typeof resolved === 'string' && resolved) {
        effect = resolved as NonNullable<CarouselProps['effect']>
      }
    } else {
      effect = props.effect
    }
  }
  const slidesToShow = props.slidesToShow || 1

  // 자동 재생
  useEffect(() => {
    if (props.autoplay && context.mode !== 'edit' && images.length > 1 && !isDragging) {
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
  }, [props.autoplay, props.autoplayInterval, props.infinite, images.length, context.mode, isDragging])

  // 스와이프 핸들러
  const handleDragStart = useCallback((clientX: number) => {
    if (context.mode === 'edit') return
    setIsDragging(true)
    dragStartX.current = clientX
    setDragOffset(0)
  }, [context.mode])

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return
    const diff = clientX - dragStartX.current
    setDragOffset(diff)
  }, [isDragging])

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 50 // 스와이프 임계값 (px)
    if (dragOffset > threshold) {
      // 왼쪽으로 스와이프 (이전)
      goTo(currentIndex - 1)
    } else if (dragOffset < -threshold) {
      // 오른쪽으로 스와이프 (다음)
      goTo(currentIndex + 1)
    }
    setDragOffset(0)
  }, [isDragging, dragOffset, currentIndex])

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX)
  }
  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX)
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX)
  }
  const handleMouseUp = () => {
    handleDragEnd()
  }
  const handleMouseLeave = () => {
    if (isDragging) handleDragEnd()
  }

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
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    touchAction: 'pan-y pinch-zoom',
  }

  // 공통 스와이프 이벤트 props
  const swipeProps = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
  }

  // Fade 효과
  if (effect === 'fade') {
    return (
      <div
        ref={containerRef}
        data-node-id={node.id}
        data-node-type="carousel"
        style={containerStyle}
        {...swipeProps}
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

  // Coverflow 효과
  if (effect === 'coverflow') {
    return (
      <div
        ref={containerRef}
        data-node-id={node.id}
        data-node-type="carousel"
        style={{ ...containerStyle, perspective: '1000px' }}
        {...swipeProps}
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
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px',
            position: 'relative',
          }}
        >
          {images.map((src, index) => {
            const offset = index - currentIndex
            const isActive = offset === 0
            const translateX = offset * 60
            const rotateY = offset * -35
            const scale = isActive ? 1 : 0.75
            const zIndex = images.length - Math.abs(offset)
            const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.2

            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={src}
                alt={`슬라이드 ${index + 1}`}
                onClick={(e) => {
                  e.stopPropagation()
                  goTo(index)
                }}
                style={{
                  position: 'absolute',
                  width: '65%',
                  aspectRatio: props.aspectRatio?.replace(':', '/') || '4/3',
                  objectFit: props.objectFit || 'cover',
                  borderRadius: '12px',
                  boxShadow: isActive ? '0 20px 40px rgba(0,0,0,0.3)' : '0 10px 20px rgba(0,0,0,0.2)',
                  transform: `translateX(${translateX}%) rotateY(${rotateY}deg) scale(${scale})`,
                  transition: 'all 0.5s ease',
                  zIndex,
                  opacity,
                  cursor: 'pointer',
                }}
              />
            )
          })}
        </div>

        <CarouselControls />
      </div>
    )
  }

  // Cards 효과 (카드 스택)
  if (effect === 'cards') {
    return (
      <div
        ref={containerRef}
        data-node-id={node.id}
        data-node-type="carousel"
        style={{ ...containerStyle, perspective: '1200px' }}
        {...swipeProps}
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
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '350px',
            position: 'relative',
          }}
        >
          {images.map((src, index) => {
            const offset = index - currentIndex
            const isActive = offset === 0
            const translateY = isActive ? 0 : 20
            const translateX = offset * 30
            const scale = isActive ? 1 : 0.9
            const zIndex = images.length - Math.abs(offset)
            const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.15

            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={src}
                alt={`슬라이드 ${index + 1}`}
                onClick={(e) => {
                  e.stopPropagation()
                  goTo(index)
                }}
                style={{
                  position: 'absolute',
                  width: '75%',
                  aspectRatio: props.aspectRatio?.replace(':', '/') || '4/3',
                  objectFit: props.objectFit || 'cover',
                  borderRadius: '16px',
                  boxShadow: isActive
                    ? '0 25px 50px rgba(0,0,0,0.25)'
                    : '0 10px 30px rgba(0,0,0,0.15)',
                  transform: `translateX(${translateX}%) translateY(${translateY}px) scale(${scale})`,
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  zIndex,
                  opacity,
                  cursor: 'pointer',
                }}
              />
            )
          })}
        </div>

        <CarouselControls />
      </div>
    )
  }

  // Cube 효과 (3D 큐브)
  if (effect === 'cube') {
    return (
      <div
        ref={containerRef}
        data-node-id={node.id}
        data-node-type="carousel"
        style={{
          ...containerStyle,
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
        {...swipeProps}
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
            width: '100%',
            aspectRatio: props.aspectRatio?.replace(':', '/') || '4/3',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: `rotateY(${-currentIndex * 90}deg)`,
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {images.slice(0, 4).map((src, index) => {
            const rotations = [0, 90, 180, 270]
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={src}
                alt={`슬라이드 ${index + 1}`}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: props.objectFit || 'cover',
                  backfaceVisibility: 'hidden',
                  transform: `rotateY(${rotations[index]}deg) translateZ(calc(50% - 1px))`,
                }}
              />
            )
          })}
        </div>

        <CarouselControls maxIndex={Math.min(images.length, 4)} />
      </div>
    )
  }

  // Flip 효과
  if (effect === 'flip') {
    return (
      <div
        ref={containerRef}
        data-node-id={node.id}
        data-node-type="carousel"
        style={{
          ...containerStyle,
          perspective: '1200px',
        }}
        {...swipeProps}
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
            width: '100%',
            aspectRatio: props.aspectRatio?.replace(':', '/') || '4/3',
            position: 'relative',
            transformStyle: 'preserve-3d',
          }}
        >
          {images.map((src, index) => {
            const isActive = index === currentIndex
            const isPrev = index === (currentIndex - 1 + images.length) % images.length
            const rotateY = isActive ? 0 : isPrev ? -180 : 180

            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={src}
                alt={`슬라이드 ${index + 1}`}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: props.objectFit || 'cover',
                  borderRadius: '12px',
                  backfaceVisibility: 'hidden',
                  transform: `rotateY(${rotateY}deg)`,
                  transition: 'transform 0.6s ease',
                  zIndex: isActive ? 1 : 0,
                }}
              />
            )
          })}
        </div>

        <CarouselControls />
      </div>
    )
  }

  // Film Strip 효과 (필름 롤 스타일)
  if (effect === 'film-strip') {
    return (
      <div
        ref={containerRef}
        data-node-id={node.id}
        data-node-type="carousel"
        style={{
          ...containerStyle,
          backgroundColor: '#1a1a1a',
          padding: '0',
        }}
        {...swipeProps}
        onClick={
          context.mode === 'edit'
            ? (e) => {
                e.stopPropagation()
                context.onSelectNode?.(node.id)
              }
            : undefined
        }
      >
        {/* 상단 필름 구멍 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '8px 4px',
          backgroundColor: '#1a1a1a',
        }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`top-${i}`}
              style={{
                width: '12px',
                height: '8px',
                backgroundColor: '#333',
                borderRadius: '2px',
              }}
            />
          ))}
        </div>

        {/* 이미지 슬라이더 */}
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              gap: `${props.spacing || 12}px`,
              padding: '4px 12px',
              transform: `translateX(calc(-${currentIndex * (100 / slidesToShow)}% - ${currentIndex * (props.spacing || 12)}px))`,
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
                  flex: `0 0 calc(${100 / slidesToShow}% - ${((slidesToShow - 1) * (props.spacing || 12)) / slidesToShow}px)`,
                  aspectRatio: props.aspectRatio?.replace(':', '/') || '3/4',
                  objectFit: props.objectFit || 'cover',
                  borderRadius: '4px',
                  border: '3px solid #f5f5f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              />
            ))}
          </div>
        </div>

        {/* 하단 필름 구멍 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '8px 4px',
          backgroundColor: '#1a1a1a',
        }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`bottom-${i}`}
              style={{
                width: '12px',
                height: '8px',
                backgroundColor: '#333',
                borderRadius: '2px',
              }}
            />
          ))}
        </div>

        <CarouselControls darkMode />
      </div>
    )
  }

  // Slide 효과 (기본)
  return (
    <div
      ref={containerRef}
      data-node-id={node.id}
      data-node-type="carousel"
      style={containerStyle}
      {...swipeProps}
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
          transform: `translateX(calc(-${currentIndex * (100 / slidesToShow)}% - ${currentIndex * (props.spacing || 0)}px + ${dragOffset}px))`,
          transition: isDragging ? 'none' : 'transform 0.5s ease',
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

  function CarouselControls({ maxIndex, darkMode }: { maxIndex?: number; darkMode?: boolean } = {}) {
    const totalSlides = maxIndex || images.length
    const arrowBg = darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)'
    const arrowColor = darkMode ? '#fff' : '#000'
    const dotActiveColor = darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,1)'
    const dotInactiveColor = darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)'

    return (
      <>
        {/* 화살표 */}
        {props.showArrows !== false && totalSlides > 1 && (
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
                backgroundColor: arrowBg,
                color: arrowColor,
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
                backgroundColor: arrowBg,
                color: arrowColor,
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
        {props.showDots !== false && totalSlides > 1 && (
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
            {Array.from({ length: totalSlides }).map((_, index) => (
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
                      ? dotActiveColor
                      : dotInactiveColor,
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
        { value: 'coverflow', label: '커버플로우' },
        { value: 'cards', label: '카드 스택' },
        { value: 'cube', label: '큐브' },
        { value: 'flip', label: '플립' },
        { value: 'film-strip', label: '필름 스트립' },
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

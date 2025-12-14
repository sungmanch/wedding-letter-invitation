'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { PrimitiveNode, CarouselProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, getValueByPath } from '../types'

// GSAP 플러그인 등록
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
}

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
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<gsap.core.Tween | null>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const currentX = useRef(0)

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
  const totalSlides = images.length

  // 슬라이드 이동
  const goTo = useCallback((index: number, animate = true) => {
    let targetIndex = index
    if (props.infinite) {
      targetIndex = ((index % totalSlides) + totalSlides) % totalSlides
    } else {
      targetIndex = Math.max(0, Math.min(index, totalSlides - 1))
    }

    setCurrentIndex(targetIndex)

    if (trackRef.current && effect === 'slide') {
      const slideWidth = containerRef.current?.offsetWidth || 0
      gsap.to(trackRef.current, {
        x: -targetIndex * slideWidth,
        duration: animate ? 0.5 : 0,
        ease: 'power2.out',
      })
    }
  }, [props.infinite, totalSlides, effect])

  // GSAP 드래그 핸들링
  useGSAP(() => {
    if (!containerRef.current || context.mode === 'edit' || images.length <= 1) return
    if (effect !== 'slide') return // 슬라이드 효과에서만 드래그 적용

    const container = containerRef.current
    const track = trackRef.current
    if (!track) return

    const slideWidth = container.offsetWidth

    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true
      startX.current = e.clientX
      currentX.current = gsap.getProperty(track, 'x') as number

      gsap.killTweensOf(track)
      container.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return

      const diff = e.clientX - startX.current
      const newX = currentX.current + diff

      // 경계 저항감 (rubber band effect)
      const minX = -(totalSlides - 1) * slideWidth
      const maxX = 0

      let boundedX = newX
      if (newX > maxX) {
        boundedX = maxX + (newX - maxX) * 0.3
      } else if (newX < minX) {
        boundedX = minX + (newX - minX) * 0.3
      }

      gsap.set(track, { x: boundedX })
    }

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDragging.current) return
      isDragging.current = false

      container.releasePointerCapture(e.pointerId)

      const diff = e.clientX - startX.current
      const velocity = diff / 100 // 간단한 속도 계산

      // 스냅할 인덱스 결정
      let targetIndex = currentIndex
      if (Math.abs(diff) > slideWidth * 0.2 || Math.abs(velocity) > 0.5) {
        if (diff > 0) {
          targetIndex = currentIndex - 1
        } else {
          targetIndex = currentIndex + 1
        }
      }

      goTo(targetIndex)
    }

    container.addEventListener('pointerdown', handlePointerDown)
    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerup', handlePointerUp)
    container.addEventListener('pointercancel', handlePointerUp)

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerup', handlePointerUp)
      container.removeEventListener('pointercancel', handlePointerUp)
    }
  }, { scope: containerRef, dependencies: [currentIndex, totalSlides, effect, context.mode, images.length] })

  // Coverflow/Cards 효과를 위한 GSAP 애니메이션
  useGSAP(() => {
    if (!containerRef.current || images.length === 0) return
    if (effect !== 'coverflow' && effect !== 'cards') return

    const items = containerRef.current.querySelectorAll('.carousel-item')

    items.forEach((item, index) => {
      const offset = index - currentIndex
      const isActive = offset === 0

      if (effect === 'coverflow') {
        gsap.to(item, {
          x: `${offset * 60}%`,
          rotateY: offset * -35,
          scale: isActive ? 1 : 0.75,
          zIndex: totalSlides - Math.abs(offset),
          opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.2,
          duration: 0.5,
          ease: 'power2.out',
        })
      } else if (effect === 'cards') {
        gsap.to(item, {
          x: `${offset * 30}%`,
          y: isActive ? 0 : 20,
          scale: isActive ? 1 : 0.9,
          zIndex: totalSlides - Math.abs(offset),
          opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.15,
          duration: 0.4,
          ease: 'power2.out',
        })
      }
    })
  }, { scope: containerRef, dependencies: [currentIndex, effect, images.length] })

  // 자동 재생
  useEffect(() => {
    if (!props.autoplay || context.mode === 'edit' || images.length <= 1) return

    const interval = props.autoplayInterval || 3000

    const tick = () => {
      if (!isDragging.current) {
        goTo(currentIndex + 1)
      }
    }

    autoplayRef.current = gsap.delayedCall(interval / 1000, tick)

    return () => {
      autoplayRef.current?.kill()
    }
  }, [props.autoplay, props.autoplayInterval, currentIndex, context.mode, images.length, goTo])

  // 터치/드래그 for coverflow/cards
  const handleItemClick = (index: number) => {
    if (context.mode === 'edit') return
    if (index !== currentIndex) {
      goTo(index)
    } else if (props.onClick === 'lightbox') {
      const event = new CustomEvent('open-lightbox', {
        detail: { images, currentIndex: index },
      })
      window.dispatchEvent(event)
    }
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
    cursor: effect === 'slide' ? 'grab' : 'default',
    userSelect: 'none',
    touchAction: 'pan-y pinch-zoom',
  }

  if (images.length === 0) {
    return (
      <div
        data-node-id={node.id}
        data-node-type="carousel"
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

  // Fade 효과
  if (effect === 'fade') {
    return (
      <div
        ref={containerRef}
        data-node-id={node.id}
        data-node-type="carousel"
        style={containerStyle}
        onClick={context.mode === 'edit' ? (e) => { e.stopPropagation(); context.onSelectNode?.(node.id) } : undefined}
      >
        <div style={{ position: 'relative', width: '100%', aspectRatio: props.aspectRatio?.replace(':', '/') || '16/9' }}>
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`슬라이드 ${index + 1}`}
              onClick={() => handleItemClick(index)}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: props.objectFit || 'cover',
                opacity: index === currentIndex ? 1 : 0,
                transition: 'opacity 0.5s ease',
                cursor: 'pointer',
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
        onClick={context.mode === 'edit' ? (e) => { e.stopPropagation(); context.onSelectNode?.(node.id) } : undefined}
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
          {images.map((src, index) => (
            <img
              key={index}
              className="carousel-item"
              src={src}
              alt={`슬라이드 ${index + 1}`}
              onClick={() => handleItemClick(index)}
              style={{
                position: 'absolute',
                width: '65%',
                aspectRatio: props.aspectRatio?.replace(':', '/') || '3/4',
                objectFit: props.objectFit || 'cover',
                borderRadius: '12px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </div>
        <CarouselControls />
      </div>
    )
  }

  // Cards 효과
  if (effect === 'cards') {
    return (
      <div
        ref={containerRef}
        data-node-id={node.id}
        data-node-type="carousel"
        style={{ ...containerStyle, perspective: '1200px' }}
        onClick={context.mode === 'edit' ? (e) => { e.stopPropagation(); context.onSelectNode?.(node.id) } : undefined}
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
          {images.map((src, index) => (
            <img
              key={index}
              className="carousel-item"
              src={src}
              alt={`슬라이드 ${index + 1}`}
              onClick={() => handleItemClick(index)}
              style={{
                position: 'absolute',
                width: '75%',
                aspectRatio: props.aspectRatio?.replace(':', '/') || '4/3',
                objectFit: props.objectFit || 'cover',
                borderRadius: '16px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                cursor: 'pointer',
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </div>
        <CarouselControls />
      </div>
    )
  }

  // Cube 효과
  if (effect === 'cube') {
    return (
      <div
        ref={containerRef}
        data-node-id={node.id}
        data-node-type="carousel"
        style={{ ...containerStyle, perspective: '1200px', perspectiveOrigin: '50% 50%' }}
        onClick={context.mode === 'edit' ? (e) => { e.stopPropagation(); context.onSelectNode?.(node.id) } : undefined}
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

  // Scroll Horizontal 효과 - 수직 스크롤 중 pin되어 가로 스크롤 진행
  if (effect === 'scroll-horizontal') {
    return (
      <ScrollHorizontalCarousel
        node={node}
        context={context}
        images={images}
        props={props}
        style={style}
        isSelected={isSelected}
      />
    )
  }

  // Slide 효과 (기본) - GSAP 드래그 적용
  return (
    <div
      ref={containerRef}
      data-node-id={node.id}
      data-node-type="carousel"
      style={containerStyle}
      onClick={context.mode === 'edit' ? (e) => { e.stopPropagation(); context.onSelectNode?.(node.id) } : undefined}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: `${props.spacing || 0}px`,
          willChange: 'transform',
        }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`슬라이드 ${index + 1}`}
            onClick={() => {
              if (props.onClick === 'lightbox' && !isDragging.current) {
                const event = new CustomEvent('open-lightbox', {
                  detail: { images, currentIndex: index },
                })
                window.dispatchEvent(event)
              }
            }}
            style={{
              flex: `0 0 calc(${100 / slidesToShow}% - ${((slidesToShow - 1) * (props.spacing || 0)) / slidesToShow}px)`,
              aspectRatio: props.aspectRatio?.replace(':', '/') || '16/9',
              objectFit: props.objectFit || 'cover',
              borderRadius: '8px',
              pointerEvents: 'auto',
              cursor: props.onClick === 'lightbox' ? 'pointer' : 'default',
            }}
          />
        ))}
      </div>
      <CarouselControls />
    </div>
  )

  function CarouselControls({ maxIndex }: { maxIndex?: number } = {}) {
    const total = maxIndex || images.length
    const isDark = effect === 'coverflow' || effect === 'cards'
    const arrowBg = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)'
    const arrowColor = isDark ? '#fff' : '#333'
    const dotActiveColor = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)'
    const dotInactiveColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'

    return (
      <>
        {props.showArrows !== false && total > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goTo(currentIndex - 1) }}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: arrowBg,
                color: arrowColor,
                border: 'none',
                borderRadius: '50%',
                fontSize: '20px',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'background-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goTo(currentIndex + 1) }}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: arrowBg,
                color: arrowColor,
                border: 'none',
                borderRadius: '50%',
                fontSize: '20px',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'background-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
            >
              ›
            </button>
          </>
        )}

        {props.showDots !== false && total > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              zIndex: 10,
            }}
          >
            {Array.from({ length: total }).map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); goTo(index) }}
                style={{
                  width: index === currentIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: index === currentIndex ? dotActiveColor : dotInactiveColor,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        )}
      </>
    )
  }
}

// ScrollHorizontalCarousel - 수직 스크롤 중 pin되어 가로 스크롤 진행
function ScrollHorizontalCarousel({
  node,
  context,
  images,
  props,
  style,
  isSelected,
}: {
  node: PrimitiveNode
  context: RenderContext
  images: string[]
  props: CarouselProps
  style: React.CSSProperties
  isSelected: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)

  // 스크롤 부모 찾기 (PhoneFrame 내부 스크롤 컨테이너 지원)
  const findScrollParent = (element: HTMLElement): HTMLElement | Window => {
    let parent = element.parentElement
    while (parent) {
      const { overflow, overflowY } = window.getComputedStyle(parent)
      if (overflow === 'auto' || overflow === 'scroll' || overflowY === 'auto' || overflowY === 'scroll') {
        return parent
      }
      parent = parent.parentElement
    }
    return window
  }

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current || context.mode === 'edit' || images.length === 0) return

    const container = containerRef.current
    const track = trackRef.current
    const scrollParent = findScrollParent(container)

    // 트랙의 총 이동 거리 계산 (트랙 너비 - 컨테이너 너비)
    const totalWidth = track.scrollWidth
    const viewportWidth = container.offsetWidth
    const scrollDistance = totalWidth - viewportWidth

    if (scrollDistance <= 0) return

    // 수직 스크롤 거리 설정 (가로 스크롤 거리만큼 수직으로 스크롤해야 함)
    const scrollMultiplier = props.spacing ? 1.5 : 1 // 간격이 있으면 스크롤 거리 증가

    triggerRef.current = ScrollTrigger.create({
      trigger: container,
      scroller: scrollParent === window ? undefined : scrollParent,
      start: 'top top',
      end: () => `+=${scrollDistance * scrollMultiplier}`,
      pin: true,
      anticipatePin: 1,
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(track, {
          x: -scrollDistance * self.progress,
        })
      },
    })

    return () => {
      triggerRef.current?.kill()
    }
  }, { scope: containerRef, dependencies: [context.mode, images.length, props.spacing] })

  const handleImageClick = (index: number) => {
    if (context.mode === 'edit') return
    if (props.onClick === 'lightbox') {
      const event = new CustomEvent('open-lightbox', {
        detail: { images, currentIndex: index },
      })
      window.dispatchEvent(event)
    }
  }

  return (
    <div
      ref={containerRef}
      data-node-id={node.id}
      data-node-type="carousel"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
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
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: `${props.spacing || 16}px`,
          height: '100%',
          alignItems: 'center',
          padding: '0 24px',
          willChange: 'transform',
        }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`슬라이드 ${index + 1}`}
            onClick={() => handleImageClick(index)}
            style={{
              flex: '0 0 auto',
              height: '80%',
              width: 'auto',
              aspectRatio: props.aspectRatio?.replace(':', '/') || '3/4',
              objectFit: props.objectFit || 'cover',
              borderRadius: '12px',
              cursor: props.onClick === 'lightbox' ? 'pointer' : 'default',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            }}
          />
        ))}
      </div>

      {/* 스크롤 힌트 표시 */}
      {context.mode !== 'edit' && (
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary, #666)' }}>
            스크롤하여 더 보기
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: 'var(--color-text-secondary, #666)', animation: 'bounce 2s infinite' }}
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(5px); }
          60% { transform: translateY(3px); }
        }
      `}</style>
    </div>
  )
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
        { value: 'scroll-horizontal', label: '가로 스크롤 (Pin)' },
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

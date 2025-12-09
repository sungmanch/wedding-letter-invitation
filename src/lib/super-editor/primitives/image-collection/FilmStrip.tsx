'use client'

import { useRef, useState, useEffect } from 'react'
import type { PrimitiveNode } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, getValueByPath } from '../types'

export interface FilmStripProps {
  /** 이미지 배열 또는 데이터 바인딩 경로 */
  images: string[] | string
  /** 스크롤 방향 ('left' | 'right') */
  direction?: 'left' | 'right'
  /** 스크롤 속도 (px/s) */
  speed?: number
  /** 이미지 간 간격 (px) */
  gap?: number
  /** 이미지 높이 (px) */
  imageHeight?: number
  /** 이미지 border-radius (px) */
  borderRadius?: number
  /** 양쪽 페이드 너비 (px) */
  fadeWidth?: number
  /** 호버 시 일시정지 */
  pauseOnHover?: boolean
  /** 클릭 동작 */
  onClick?: 'lightbox' | 'none'
}

export function FilmStrip({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<FilmStripProps>(node)
  const style = toInlineStyle(node.style)
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const animationRef = useRef<number | null>(null)
  const offsetRef = useRef(0)

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

  const direction = props.direction || 'left'
  const speed = props.speed || 30
  const gap = props.gap ?? 12
  const imageHeight = props.imageHeight || 200
  const borderRadius = props.borderRadius ?? 12
  const fadeWidth = props.fadeWidth ?? 60
  const pauseOnHover = props.pauseOnHover ?? true

  // 무한 스크롤을 위해 이미지 복제 (최소 3배)
  const duplicatedImages = images.length > 0
    ? [...images, ...images, ...images]
    : []

  // 애니메이션 루프
  useEffect(() => {
    if (context.mode === 'edit' || images.length === 0) return

    const track = trackRef.current
    if (!track) return

    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      if (isPaused) {
        lastTime = currentTime
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      const moveAmount = speed * deltaTime

      if (direction === 'left') {
        offsetRef.current -= moveAmount
      } else {
        offsetRef.current += moveAmount
      }

      // 한 세트 길이 계산
      const singleSetWidth = track.scrollWidth / 3

      // 무한 스크롤 리셋
      if (direction === 'left' && offsetRef.current <= -singleSetWidth) {
        offsetRef.current += singleSetWidth
      } else if (direction === 'right' && offsetRef.current >= 0) {
        offsetRef.current -= singleSetWidth
      }

      track.style.transform = `translateX(${offsetRef.current}px)`
      animationRef.current = requestAnimationFrame(animate)
    }

    // 초기 오프셋 설정 (right 방향일 때)
    if (direction === 'right') {
      const track = trackRef.current
      if (track) {
        const singleSetWidth = track.scrollWidth / 3
        offsetRef.current = -singleSetWidth
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [context.mode, images.length, speed, direction, isPaused])

  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true)
  }

  const handleMouseLeave = () => {
    if (pauseOnHover) setIsPaused(false)
  }

  const handleImageClick = (src: string, index: number) => {
    if (props.onClick === 'lightbox' && context.mode !== 'edit') {
      // Lightbox 이벤트 발생
      const event = new CustomEvent('open-lightbox', {
        detail: { images, currentIndex: index % images.length },
      })
      window.dispatchEvent(event)
    }
  }

  if (images.length === 0) {
    return (
      <div
        data-node-id={node.id}
        data-node-type="film-strip"
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
      data-node-type="film-strip"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        ...style,
        outline: isSelected ? '2px solid #3b82f6' : undefined,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={
        context.mode === 'edit'
          ? (e) => {
              e.stopPropagation()
              context.onSelectNode?.(node.id)
            }
          : undefined
      }
    >
      {/* 왼쪽 페이드 그라데이션 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${fadeWidth}px`,
          background: 'linear-gradient(to right, var(--color-surface, #fff) 0%, transparent 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      {/* 오른쪽 페이드 그라데이션 */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: `${fadeWidth}px`,
          background: 'linear-gradient(to left, var(--color-surface, #fff) 0%, transparent 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      {/* 이미지 트랙 */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: `${gap}px`,
          willChange: 'transform',
        }}
      >
        {duplicatedImages.map((src, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${index}-${src}`}
            src={src}
            alt={`갤러리 이미지 ${(index % images.length) + 1}`}
            onClick={() => handleImageClick(src, index)}
            style={{
              height: `${imageHeight}px`,
              width: 'auto',
              objectFit: 'cover',
              borderRadius: `${borderRadius}px`,
              flexShrink: 0,
              cursor: props.onClick === 'lightbox' ? 'pointer' : 'default',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export const filmStripRenderer: PrimitiveRenderer<FilmStripProps> = {
  type: 'film-strip',
  render: (node, context) => (
    <FilmStrip key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'direction',
      label: '방향',
      type: 'select',
      options: [
        { value: 'left', label: '왼쪽으로' },
        { value: 'right', label: '오른쪽으로' },
      ],
      defaultValue: 'left',
    },
    {
      key: 'speed',
      label: '속도 (px/s)',
      type: 'number',
      defaultValue: 30,
    },
    {
      key: 'gap',
      label: '간격 (px)',
      type: 'number',
      defaultValue: 12,
    },
    {
      key: 'imageHeight',
      label: '이미지 높이 (px)',
      type: 'number',
      defaultValue: 200,
    },
    {
      key: 'borderRadius',
      label: '모서리 둥글기 (px)',
      type: 'number',
      defaultValue: 12,
    },
    {
      key: 'fadeWidth',
      label: '페이드 너비 (px)',
      type: 'number',
      defaultValue: 60,
    },
    {
      key: 'pauseOnHover',
      label: '호버 시 정지',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'onClick',
      label: '클릭 동작',
      type: 'select',
      options: [
        { value: 'lightbox', label: '라이트박스' },
        { value: 'none', label: '없음' },
      ],
      defaultValue: 'lightbox',
    },
  ],
}

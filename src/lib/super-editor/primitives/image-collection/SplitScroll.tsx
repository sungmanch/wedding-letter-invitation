'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { PrimitiveNode } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, getValueByPath } from '../types'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP)
}

export interface SplitScrollProps {
  images: string[] | string
  gap?: number
  speed?: number
  onClick?: 'lightbox' | 'none'
}

export function SplitScroll({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<SplitScrollProps>(node)
  const style = toInlineStyle(node.style)
  const containerRef = useRef<HTMLDivElement>(null)
  const leftTrackRef = useRef<HTMLDivElement>(null)
  const rightTrackRef = useRef<HTMLDivElement>(null)
  const tweenLeftRef = useRef<gsap.core.Tween | null>(null)
  const tweenRightRef = useRef<gsap.core.Tween | null>(null)

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

  const gap = props.gap ?? 8
  const speed = props.speed || 30

  // 이미지를 좌우로 나눔
  const leftImages = images.filter((_, i) => i % 2 === 0)
  const rightImages = images.filter((_, i) => i % 2 === 1)

  // 무한 스크롤을 위해 복제
  const duplicatedLeft = [...leftImages, ...leftImages, ...leftImages]
  const duplicatedRight = [...rightImages, ...rightImages, ...rightImages]

  // GSAP 반대 방향 스크롤 애니메이션
  useGSAP(() => {
    if (context.mode === 'edit' || images.length === 0) return

    const leftTrack = leftTrackRef.current
    const rightTrack = rightTrackRef.current
    if (!leftTrack || !rightTrack) return

    // 왼쪽 트랙 높이 계산
    const leftSingleHeight = leftTrack.scrollHeight / 3
    const rightSingleHeight = rightTrack.scrollHeight / 3

    // 왼쪽: 위로 스크롤
    const leftDuration = leftSingleHeight / speed
    gsap.set(leftTrack, { y: 0 })
    tweenLeftRef.current = gsap.to(leftTrack, {
      y: -leftSingleHeight,
      duration: leftDuration,
      ease: 'none',
      repeat: -1,
      onRepeat: () => {
        gsap.set(leftTrack, { y: 0 })
      },
    })

    // 오른쪽: 아래로 스크롤 (시작 위치를 -height에서)
    const rightDuration = rightSingleHeight / speed
    gsap.set(rightTrack, { y: -rightSingleHeight })
    tweenRightRef.current = gsap.to(rightTrack, {
      y: 0,
      duration: rightDuration,
      ease: 'none',
      repeat: -1,
      onRepeat: () => {
        gsap.set(rightTrack, { y: -rightSingleHeight })
      },
    })

    return () => {
      tweenLeftRef.current?.kill()
      tweenRightRef.current?.kill()
    }
  }, { scope: containerRef, dependencies: [context.mode, images.length, speed] })

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
        data-node-type="split-scroll"
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
      data-node-type="split-scroll"
      style={{
        display: 'flex',
        gap: `${gap}px`,
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
      {/* 왼쪽 열 (위로 스크롤) */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div
          ref={leftTrackRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${gap}px`,
            willChange: 'transform',
          }}
        >
          {duplicatedLeft.map((src, index) => {
            const originalIndex = (index % leftImages.length) * 2
            return (
              <img
                key={`left-${index}`}
                src={src}
                alt={`갤러리 ${originalIndex + 1}`}
                onClick={() => handleClick(originalIndex)}
                style={{
                  width: '100%',
                  aspectRatio: '3 / 4',
                  objectFit: 'cover',
                  cursor: props.onClick === 'lightbox' ? 'pointer' : 'default',
                  borderRadius: '4px',
                }}
              />
            )
          })}
        </div>
      </div>

      {/* 오른쪽 열 (아래로 스크롤) */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div
          ref={rightTrackRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${gap}px`,
            willChange: 'transform',
          }}
        >
          {duplicatedRight.map((src, index) => {
            const originalIndex = (index % rightImages.length) * 2 + 1
            return (
              <img
                key={`right-${index}`}
                src={src}
                alt={`갤러리 ${originalIndex + 1}`}
                onClick={() => handleClick(originalIndex)}
                style={{
                  width: '100%',
                  aspectRatio: '3 / 4',
                  objectFit: 'cover',
                  cursor: props.onClick === 'lightbox' ? 'pointer' : 'default',
                  borderRadius: '4px',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const splitScrollRenderer: PrimitiveRenderer<SplitScrollProps> = {
  type: 'split-scroll',
  render: (node, context) => <SplitScroll key={node.id} node={node} context={context} />,
  editableProps: [
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
      defaultValue: 8,
    },
  ],
}

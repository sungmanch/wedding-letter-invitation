'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { PrimitiveNode } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, getValueByPath } from '../types'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
}

export interface ParallaxStackProps {
  images: string[] | string
  gap?: number
  intensity?: number // 패럴랙스 강도 (0.1 ~ 1)
  direction?: 'up' | 'down' | 'mixed'
  overlay?: boolean
  onClick?: 'lightbox' | 'none'
}

export function ParallaxStack({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<ParallaxStackProps>(node)
  const style = toInlineStyle(node.style)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

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

  const gap = props.gap ?? 16
  const intensity = props.intensity ?? 0.3
  const direction = props.direction || 'mixed'
  const overlay = props.overlay ?? true

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

  // GSAP ScrollTrigger 패럴랙스 애니메이션
  useGSAP(() => {
    if (!containerRef.current || context.mode === 'edit' || images.length === 0) return

    const scrollParent = findScrollParent(containerRef.current)

    imageRefs.current.forEach((item, index) => {
      if (!item) return

      const img = item.querySelector('img')
      if (!img) return

      // 방향에 따른 이동량 계산
      let yOffset: number
      if (direction === 'up') {
        yOffset = -100 * intensity
      } else if (direction === 'down') {
        yOffset = 100 * intensity
      } else {
        // mixed: 홀수/짝수 번갈아
        yOffset = (index % 2 === 0 ? -1 : 1) * 100 * intensity
      }

      gsap.fromTo(
        img,
        {
          y: -yOffset,
        },
        {
          y: yOffset,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            scroller: scrollParent === window ? undefined : scrollParent,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, { scope: containerRef, dependencies: [context.mode, images.length, intensity, direction] })

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
        data-node-type="parallax-stack"
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
      data-node-type="parallax-stack"
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
      {images.map((src, index) => (
        <div
          key={index}
          ref={(el) => { imageRefs.current[index] = el }}
          onClick={() => handleClick(index)}
          style={{
            position: 'relative',
            width: '100%',
            height: '300px',
            overflow: 'hidden',
            borderRadius: '8px',
            cursor: props.onClick === 'lightbox' ? 'pointer' : 'default',
          }}
        >
          <img
            src={src}
            alt={`패럴랙스 ${index + 1}`}
            style={{
              position: 'absolute',
              top: '-20%',
              left: 0,
              width: '100%',
              height: '140%',
              objectFit: 'cover',
              willChange: 'transform',
            }}
          />
          {overlay && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(
                  to bottom,
                  transparent 0%,
                  transparent 60%,
                  rgba(0, 0, 0, 0.4) 100%
                )`,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export const parallaxStackRenderer: PrimitiveRenderer<ParallaxStackProps> = {
  type: 'parallax-stack',
  render: (node, context) => <ParallaxStack key={node.id} node={node} context={context} />,
  editableProps: [
    {
      key: 'intensity',
      label: '패럴랙스 강도',
      type: 'number',
      defaultValue: 0.3,
    },
    {
      key: 'direction',
      label: '이동 방향',
      type: 'select',
      options: [
        { value: 'up', label: '위로' },
        { value: 'down', label: '아래로' },
        { value: 'mixed', label: '번갈아' },
      ],
      defaultValue: 'mixed',
    },
    {
      key: 'overlay',
      label: '그라데이션 오버레이',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'gap',
      label: '간격 (px)',
      type: 'number',
      defaultValue: 16,
    },
  ],
}

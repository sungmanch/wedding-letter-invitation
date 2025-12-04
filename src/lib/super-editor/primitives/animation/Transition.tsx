'use client'

import { useState, useEffect, useRef, TouchEvent as ReactTouchEvent } from 'react'
import type { PrimitiveNode, TransitionProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps } from '../types'
import { getTransitionPreset } from '../../animations/transitions'

export function Transition({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<TransitionProps>(node)
  const style = toInlineStyle(node.style)
  const ref = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const touchStartY = useRef(0)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  const children = node.children || []
  const trigger = props.trigger || 'scroll'
  const duration = props.duration || 500
  const snapToChildren = props.snapToChildren !== false

  // Get transition preset
  const preset = getTransitionPreset(props.preset)

  // 스크롤 트리거
  useEffect(() => {
    if (trigger !== 'scroll' || !ref.current || context.mode === 'edit') return

    const handleScroll = () => {
      if (!ref.current || !snapToChildren) return

      const rect = ref.current.getBoundingClientRect()
      const scrollY = -rect.top
      const childHeight = ref.current.clientHeight

      if (childHeight > 0) {
        const rawIndex = scrollY / childHeight
        const progress = rawIndex - Math.floor(rawIndex)

        if (rawIndex >= 0 && rawIndex < children.length) {
          setCurrentIndex(Math.floor(rawIndex))
          setScrollProgress(progress)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [trigger, children.length, context.mode, snapToChildren])

  // 스와이프 트리거
  const handleTouchStart = (e: ReactTouchEvent) => {
    if (trigger !== 'swipe') return
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: ReactTouchEvent) => {
    if (trigger !== 'swipe') return
    const touchEndY = e.changedTouches[0].clientY
    const diff = touchStartY.current - touchEndY

    if (Math.abs(diff) > 50) {
      // 50px 이상 스와이프
      if (diff > 0 && currentIndex < children.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
      }
    }
  }

  // 클릭 트리거
  const handleClick = () => {
    if (trigger !== 'click' || context.mode === 'edit') return
    setCurrentIndex((prev) => (prev + 1) % children.length)
  }

  // 자동 트리거
  useEffect(() => {
    if (trigger !== 'auto' || context.mode === 'edit') return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % children.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [trigger, children.length, context.mode])

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: snapToChildren ? `${children.length * 100}vh` : 'auto',
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  const viewportStyle: React.CSSProperties = {
    position: snapToChildren ? 'sticky' : 'relative',
    top: 0,
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
  }

  // 트랜지션 스타일 계산
  const getChildStyle = (index: number): React.CSSProperties => {
    const isEntering = index === currentIndex
    const isExiting = index === currentIndex - 1

    if (!preset) {
      return {
        position: 'absolute',
        inset: 0,
        opacity: isEntering ? 1 : 0,
        transition: `opacity ${duration}ms ease`,
        pointerEvents: isEntering ? 'auto' : 'none',
      }
    }

    // 스크롤 연동 트랜지션
    if (trigger === 'scroll' && snapToChildren) {
      const isNext = index === currentIndex + 1

      if (isEntering) {
        // 현재 화면 (나가는 중)
        const exitFrame = preset.exitKeyframes
        const progress = scrollProgress

        return {
          position: 'absolute',
          inset: 0,
          ...interpolateKeyframes(exitFrame, progress),
          pointerEvents: 'auto',
        }
      }

      if (isNext) {
        // 다음 화면 (들어오는 중)
        const enterFrame = preset.enterKeyframes
        const progress = scrollProgress

        return {
          position: 'absolute',
          inset: 0,
          ...interpolateKeyframes(enterFrame, progress),
          pointerEvents: 'none',
        }
      }

      return {
        position: 'absolute',
        inset: 0,
        opacity: 0,
        pointerEvents: 'none',
      }
    }

    // 일반 트랜지션
    return {
      position: 'absolute',
      inset: 0,
      opacity: isEntering ? 1 : 0,
      transform: isEntering ? 'translateY(0)' : 'translateY(100%)',
      transition: `all ${duration}ms ease`,
      pointerEvents: isEntering ? 'auto' : 'none',
    }
  }

  // 키프레임 보간
  function interpolateKeyframes(
    keyframes: { offset: number; [key: string]: unknown }[],
    progress: number
  ): React.CSSProperties {
    const result: React.CSSProperties = {}

    // 간단한 선형 보간
    const firstFrame = keyframes[0]
    const lastFrame = keyframes[keyframes.length - 1]

    for (const key of Object.keys(firstFrame)) {
      if (key === 'offset') continue

      const start = firstFrame[key]
      const end = lastFrame[key]

      if (typeof start === 'number' && typeof end === 'number') {
        (result as Record<string, number>)[key] = start + (end - start) * progress
      } else {
        (result as Record<string, unknown>)[key] = progress > 0.5 ? end : start
      }
    }

    return result
  }

  return (
    <div
      ref={ref}
      data-node-id={node.id}
      data-node-type="transition"
      style={containerStyle}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={
        context.mode === 'edit'
          ? (e) => {
              e.stopPropagation()
              context.onSelectNode?.(node.id)
            }
          : handleClick
      }
    >
      <div style={viewportStyle}>
        {children.map((child, index) => (
          <div key={child.id} style={getChildStyle(index)}>
            {context.renderNode(child)}
          </div>
        ))}
      </div>

      {/* 도트 인디케이터 */}
      {children.length > 1 && (
        <div
          style={{
            position: 'fixed',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 100,
          }}
        >
          {children.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentIndex(index)
              }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor:
                  index === currentIndex
                    ? 'rgba(255,255,255,1)'
                    : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const transitionRenderer: PrimitiveRenderer<TransitionProps> = {
  type: 'transition',
  render: (node, context) => (
    <Transition key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'preset',
      label: '트랜지션',
      type: 'select',
      options: [
        { value: 'crossfade', label: '크로스페이드' },
        { value: 'slide-vertical', label: '세로 슬라이드' },
        { value: 'slide-horizontal', label: '가로 슬라이드' },
        { value: 'zoom', label: '줌' },
        { value: 'parallax-scroll', label: '패럴랙스 스크롤' },
      ],
      defaultValue: 'crossfade',
    },
    {
      key: 'trigger',
      label: '트리거',
      type: 'select',
      options: [
        { value: 'scroll', label: '스크롤' },
        { value: 'swipe', label: '스와이프' },
        { value: 'click', label: '클릭' },
        { value: 'auto', label: '자동' },
      ],
      defaultValue: 'scroll',
    },
    {
      key: 'duration',
      label: '지속 시간 (ms)',
      type: 'number',
      defaultValue: 500,
    },
    {
      key: 'snapToChildren',
      label: '화면 단위 스냅',
      type: 'boolean',
      defaultValue: true,
    },
  ],
}

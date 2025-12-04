'use client'

import { useEffect, useRef, useState } from 'react'
import type { PrimitiveNode, ScrollTriggerProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps } from '../types'
import { getAnimationPreset } from '../../animations/presets'

export function ScrollTrigger({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<ScrollTriggerProps>(node)
  const style = toInlineStyle(node.style)
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // Scroll progress 계산
  useEffect(() => {
    if (!ref.current || context.mode === 'edit') return

    const handleScroll = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // 요소가 화면에 들어오는 비율 계산
      const start = windowHeight // 화면 하단에서 시작
      const end = -rect.height // 화면 상단을 벗어날 때 종료

      const currentProgress = (start - rect.top) / (start - end)
      const clampedProgress = Math.max(0, Math.min(1, currentProgress))

      setProgress(clampedProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 초기값 설정

    return () => window.removeEventListener('scroll', handleScroll)
  }, [context.mode])

  // Get animation preset
  const preset = props.animation?.preset
    ? getAnimationPreset(props.animation.preset)
    : null

  // Scrub 모드에서 스타일 계산
  const getScrubStyle = (): React.CSSProperties => {
    if (!preset || !props.scrub) return {}

    // 첫 번째와 마지막 키프레임 사이를 progress로 보간
    const firstFrame = preset.keyframes[0]
    const lastFrame = preset.keyframes[preset.keyframes.length - 1]

    const interpolate = (
      start: string | number | undefined,
      end: string | number | undefined
    ): string | number | undefined => {
      if (start === undefined || end === undefined) return end

      // 숫자 보간
      if (typeof start === 'number' && typeof end === 'number') {
        return start + (end - start) * progress
      }

      // opacity 보간
      if (
        typeof start === 'string' &&
        typeof end === 'string' &&
        !isNaN(Number(start)) &&
        !isNaN(Number(end))
      ) {
        const startNum = Number(start)
        const endNum = Number(end)
        return startNum + (endNum - startNum) * progress
      }

      // transform 보간 (단순화)
      if (
        typeof start === 'string' &&
        typeof end === 'string' &&
        start.includes('translate')
      ) {
        // translateY(30px) → translateY(0)
        const startMatch = start.match(/translateY\((\d+)px\)/)
        const endMatch = end.match(/translateY\((\d+)px\)/) || { 1: '0' }

        if (startMatch) {
          const startY = parseInt(startMatch[1])
          const endY = parseInt(endMatch[1])
          const currentY = startY + (endY - startY) * progress
          return `translateY(${currentY}px)`
        }
      }

      return progress > 0.5 ? end : start
    }

    return {
      opacity: interpolate(
        firstFrame.opacity as number,
        lastFrame.opacity as number
      ) as number,
      transform: interpolate(
        firstFrame.transform as string,
        lastFrame.transform as string
      ) as string,
    }
  }

  const containerStyle: React.CSSProperties = {
    ...style,
    ...(props.scrub ? getScrubStyle() : {}),
    ...(props.pin
      ? {
          position: 'sticky' as const,
          top: 0,
        }
      : {}),
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // 개발 모드에서 마커 표시
  const showMarkers = props.markers && context.mode === 'edit'

  return (
    <div
      ref={ref}
      data-node-id={node.id}
      data-node-type="scroll-trigger"
      data-progress={progress.toFixed(2)}
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
      {showMarkers && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '4px 8px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            fontSize: '12px',
            borderRadius: '4px',
            zIndex: 100,
          }}
        >
          Progress: {(progress * 100).toFixed(0)}%
        </div>
      )}
      {node.children?.map((child) => context.renderNode(child))}
    </div>
  )
}

export const scrollTriggerRenderer: PrimitiveRenderer<ScrollTriggerProps> = {
  type: 'scroll-trigger',
  render: (node, context) => (
    <ScrollTrigger key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'animation.preset',
      label: '애니메이션',
      type: 'select',
      options: [
        { value: 'fade-in', label: '페이드 인' },
        { value: 'slide-up', label: '슬라이드 업' },
        { value: 'scale-in', label: '스케일 인' },
      ],
      defaultValue: 'fade-in',
    },
    {
      key: 'scrub',
      label: '스크롤 연동',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'pin',
      label: '고정 (Sticky)',
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'markers',
      label: '마커 표시 (개발용)',
      type: 'boolean',
      defaultValue: false,
    },
  ],
}

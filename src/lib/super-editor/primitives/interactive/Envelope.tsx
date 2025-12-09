'use client'

import { useEffect, useRef, useState } from 'react'
import type { PrimitiveNode } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { mergeNodeStyles, getNodeProps } from '../types'

/**
 * Envelope Props
 */
export interface EnvelopeProps {
  /** 편지봉투 색상 */
  envelopeColor?: string
  /** 카드 배경색 */
  cardColor?: string
  /** 봉투 flap 색상 (기본: envelopeColor와 동일) */
  flapColor?: string
  /** 패럴랙스 강도 (0~1, 기본 0.5) - 카드가 봉투보다 얼마나 느리게 움직이는지 */
  parallaxIntensity?: number
}

/**
 * 편지봉투에서 카드가 올라오는 패럴랙스 효과 컴포넌트
 *
 * 레이어 구조 (z-index 순서):
 * 1. envelope-back (z-1): 봉투 뒷면 - 열린 삼각형 flap
 * 2. invitation-card (z-2): 인비테이션 카드 - 패럴랙스로 느리게 이동
 * 3. envelope-front (z-3): 봉투 앞면 - 봉투와 함께 이동
 */
export function Envelope({ node, context }: { node: PrimitiveNode; context: RenderContext }) {
  console.log('hey')
  const props = getNodeProps<EnvelopeProps>(node)
  const style = mergeNodeStyles(
    node as PrimitiveNode & { tokenStyle?: Record<string, unknown> },
    context
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const lastProgressRef = useRef<number>(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [resolvedColors, setResolvedColors] = useState({
    envelope: '#f5f5f5',
    card: '#ffffff',
    flap: '#f5f5f5',
  })
  const [mounted, setMounted] = useState(false)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id
  const isEditMode = context.mode === 'edit'

  // 색상 설정
  const envelopeColor = props.envelopeColor || 'var(--color-surface, #f5f5f5)'
  const cardColor = props.cardColor || 'var(--color-background, #ffffff)'
  const flapColor = props.flapColor || envelopeColor
  const parallaxIntensity = props.parallaxIntensity ?? 0.6

  // 마운트 플래그 설정 (hydration 이슈 방지)
  useEffect(() => {
    setMounted(true)
  }, [])

  // CSS 변수를 실제 색상값으로 변환
  useEffect(() => {
    if (!containerRef.current || !mounted) return

    // 약간의 지연 후 색상 계산 (CSS 변수가 적용된 후)
    const timer = setTimeout(() => {
      if (!containerRef.current) return
      const computedStyle = getComputedStyle(containerRef.current)
      const surfaceColor = computedStyle.getPropertyValue('--color-surface').trim() || '#f5f5f5'
      const bgColor = computedStyle.getPropertyValue('--color-background').trim() || '#ffffff'

      setResolvedColors({
        envelope: surfaceColor,
        card: bgColor,
        flap: surfaceColor,
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [envelopeColor, cardColor, flapColor, mounted])

  // RAF 기반 스크롤 progress 계산 (스크롤 이벤트 대신 매 프레임 체크)
  useEffect(() => {
    if (!containerRef.current || !mounted) return

    // 스크롤 컨테이너 찾기
    const findScrollContainer = (element: HTMLElement): HTMLElement | null => {
      let parent = element.parentElement
      while (parent) {
        // scrollHeight > clientHeight이면 스크롤 가능
        if (parent.scrollHeight > parent.clientHeight + 10) {
          return parent
        }
        parent = parent.parentElement
      }
      return null
    }

    const scrollContainer = findScrollContainer(containerRef.current)

    console.log('[Envelope] Init - scrollContainer:', scrollContainer?.className || 'none')

    const updateProgress = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()

      // 스크롤 컨테이너 기준 또는 뷰포트 기준으로 계산
      let viewportHeight: number
      let viewportTop: number

      if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect()
        viewportHeight = containerRect.height
        viewportTop = containerRect.top
      } else {
        viewportHeight = window.innerHeight
        viewportTop = 0
      }

      const relativeTop = rect.top - viewportTop

      // 요소가 화면 하단에서 시작해서 상단 30%에 도달할 때까지
      const start = viewportHeight
      const end = viewportHeight * 0.3

      const progress = (start - relativeTop) / (start - end)
      const clampedProgress = Math.max(0, Math.min(1, progress))

      // 값이 변경되었을 때만 state 업데이트 (성능 최적화)
      if (Math.abs(clampedProgress - lastProgressRef.current) > 0.001) {
        lastProgressRef.current = clampedProgress
        setScrollProgress(clampedProgress)
      }

      rafRef.current = requestAnimationFrame(updateProgress)
    }

    // RAF 시작
    rafRef.current = requestAnimationFrame(updateProgress)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [mounted])

  // 카드의 패럴랙스 transform 계산
  // progress 0 → 카드가 봉투 안에 숨어있음 (translateY: 50%)
  // progress 1 → 카드가 완전히 올라옴 (translateY: -30%)
  const startY = 50 // 시작 위치 (봉투 안)
  const endY = -30 // 끝 위치 (봉투 위로)
  const cardTranslateY = startY + (endY - startY) * scrollProgress

  return (
    <div
      ref={containerRef}
      data-node-id={node.id}
      data-node-type="envelope"
      className={isSelected ? 'ring-2 ring-blue-500' : ''}
      style={{
        ...style,
        position: 'relative',
        width: '100%',
        maxWidth: '320px',
        margin: '0 auto',
        aspectRatio: '1 / 1.2',
      }}
      onClick={() => context.onSelectNode?.(node.id)}
    >
      {/* 1. 봉투 뒷면 - 열린 삼각형 flap */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '35%',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {/* SVG로 삼각형 flap 그리기 */}
        <svg
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <polygon points="0,0 100,0 50,50" fill={resolvedColors.flap} />
        </svg>
      </div>

      {/* 2. 인비테이션 카드 - 패럴랙스 효과 */}
      <div
        style={{
          position: 'absolute',
          left: '5%',
          right: '5%',
          top: '25%',
          height: '70%',
          zIndex: 2,
          transform: `translateY(${cardTranslateY}%)`,
          transition: isEditMode ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: resolvedColors.card,
            borderRadius: '8px',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >
          {/* 카드 내용 - children 렌더링 */}
          {node.children?.map((child) => context.renderNode(child))}
        </div>
      </div>

      {/* 3. 봉투 앞면 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          backgroundColor: resolvedColors.envelope,
          borderRadius: '0 0 8px 8px',
          zIndex: 3,
        }}
      >
        {/* 봉투 안쪽 그림자 효과 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '20px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)',
          }}
        />
      </div>

      {/* 디버그: 스크롤 progress (개발 모드에서만) */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            zIndex: 20,
            padding: '4px 8px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            borderRadius: '4px',
            fontSize: '10px',
          }}
        >
          {(scrollProgress * 100).toFixed(0)}%
        </div>
      )}
    </div>
  )
}

// 렌더러 export
export const envelopeRenderer: PrimitiveRenderer<EnvelopeProps> = {
  type: 'envelope',
  render: (node, context) => <Envelope key={node.id} node={node} context={context} />,
  editableProps: [
    {
      key: 'envelopeColor',
      label: '봉투 색상',
      type: 'color',
      defaultValue: '#f5f5f5',
    },
    {
      key: 'cardColor',
      label: '카드 색상',
      type: 'color',
      defaultValue: '#ffffff',
    },
    {
      key: 'flapColor',
      label: 'Flap 색상',
      type: 'color',
      defaultValue: '#f5f5f5',
    },
    {
      key: 'parallaxIntensity',
      label: '패럴랙스 강도',
      type: 'number',
      defaultValue: 0.5,
    },
  ],
}

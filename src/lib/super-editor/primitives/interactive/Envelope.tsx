'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
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
export function Envelope({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<EnvelopeProps>(node)
  const style = mergeNodeStyles(node as PrimitiveNode & { tokenStyle?: Record<string, unknown> }, context)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [resolvedFlapColor, setResolvedFlapColor] = useState('#f5f5f5')

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id
  const isEditMode = context.mode === 'edit'

  // 색상 설정 - CSS 변수는 나중에 resolved
  const envelopeColor = props.envelopeColor || 'var(--color-surface, #f5f5f5)'
  const cardColor = props.cardColor || 'var(--color-background, #ffffff)'
  const flapColor = props.flapColor || envelopeColor
  const parallaxIntensity = props.parallaxIntensity ?? 0.5

  // CSS 변수를 실제 색상값으로 변환 (SVG fill에서 사용하기 위해)
  useEffect(() => {
    if (!containerRef.current) return
    const computedStyle = getComputedStyle(containerRef.current)
    // CSS 변수에서 실제 색상 추출
    const surfaceColor = computedStyle.getPropertyValue('--color-surface').trim()
    if (surfaceColor) {
      setResolvedFlapColor(surfaceColor)
    } else {
      // fallback: 직접 지정된 색상이면 그대로 사용
      setResolvedFlapColor(flapColor.startsWith('var(') ? '#f5f5f5' : flapColor)
    }
  }, [flapColor])

  // 스크롤 가능한 부모 요소 찾기
  const findScrollParent = useCallback((element: HTMLElement | null): HTMLElement | Window => {
    if (!element) return window

    let parent = element.parentElement
    while (parent) {
      const { overflow, overflowY } = getComputedStyle(parent)
      if (
        overflow === 'auto' ||
        overflow === 'scroll' ||
        overflowY === 'auto' ||
        overflowY === 'scroll'
      ) {
        if (parent.scrollHeight > parent.clientHeight) {
          return parent
        }
      }
      parent = parent.parentElement
    }
    return window
  }, [])

  // 스크롤 progress 계산
  useEffect(() => {
    if (!containerRef.current || isEditMode) return

    const scrollParent = findScrollParent(containerRef.current)
    const isWindow = scrollParent === window

    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()

      let viewportHeight: number
      let viewportTop: number

      if (isWindow) {
        viewportHeight = window.innerHeight
        viewportTop = 0
      } else {
        const containerRect = (scrollParent as HTMLElement).getBoundingClientRect()
        viewportHeight = containerRect.height
        viewportTop = containerRect.top
      }

      const relativeTop = rect.top - viewportTop

      // 요소가 화면 하단에서 시작해서 중앙을 지날 때까지
      const start = viewportHeight
      const end = viewportHeight * 0.3

      const progress = (start - relativeTop) / (start - end)
      const clampedProgress = Math.max(0, Math.min(1, progress))

      setScrollProgress(clampedProgress)
    }

    scrollParent.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => scrollParent.removeEventListener('scroll', handleScroll)
  }, [isEditMode, findScrollParent])

  // 카드의 패럴랙스 transform 계산
  // progress 0 → 카드가 봉투 안에 숨어있음 (translateY: 50%)
  // progress 1 → 카드가 완전히 올라옴 (translateY: -50%)
  // parallaxIntensity가 높을수록 더 많이 올라옴
  const startY = 50 // 시작 위치 (봉투 안)
  const endY = -50 * parallaxIntensity // 끝 위치 (봉투 위로)
  const cardTranslateY = isEditMode
    ? 0 // 에디터에서는 중간 상태로 표시
    : startY + (endY - startY) * scrollProgress

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
          <polygon
            points="0,0 100,0 50,50"
            fill={resolvedFlapColor}
          />
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
            backgroundColor: cardColor,
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
          backgroundColor: envelopeColor,
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

      {/* 에디터 모드 안내 */}
      {isEditMode && (
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            padding: '8px 16px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            borderRadius: '20px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          스크롤 시 카드가 올라옵니다
        </div>
      )}

      {/* 디버그: 스크롤 progress (개발 모드에서만) */}
      {process.env.NODE_ENV === 'development' && !isEditMode && (
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

'use client'

/**
 * Floating Renderer - 플로팅 요소 렌더링
 *
 * 블록과 독립적으로 화면에 고정되는 요소들
 * (음악 버튼, 스크롤 인디케이터 등)
 */

import { useMemo, useState, useEffect, type CSSProperties } from 'react'
import type { FloatingElement } from '../schema/types'
import { useDocument } from '../context/document-context'
import { ElementRenderer } from './element-renderer'

// ============================================
// Types
// ============================================

export interface FloatingRendererProps {
  elements: FloatingElement[]
}

// ============================================
// Main Component
// ============================================

export function FloatingRenderer({ elements }: FloatingRendererProps) {
  return (
    <div className="se2-floating-container">
      {elements.map(floating => (
        <FloatingElementWrapper key={floating.id} floating={floating} />
      ))}
    </div>
  )
}

// ============================================
// Floating Element Wrapper
// ============================================

interface FloatingElementWrapperProps {
  floating: FloatingElement
}

function FloatingElementWrapper({ floating }: FloatingElementWrapperProps) {
  const { sharedState } = useDocument()
  const [isVisible, setIsVisible] = useState(true)
  const [scrollY, setScrollY] = useState(0)

  // 스크롤 추적
  useEffect(() => {
    if (floating.showCondition?.type !== 'scroll') return

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [floating.showCondition?.type])

  // 가시성 조건 체크
  useEffect(() => {
    if (!floating.showCondition) {
      setIsVisible(true)
      return
    }

    switch (floating.showCondition.type) {
      case 'scroll':
        setIsVisible(scrollY >= (floating.showCondition.value as number))
        break

      case 'time':
        const timer = setTimeout(() => {
          setIsVisible(true)
        }, floating.showCondition.value as number)
        setIsVisible(false)
        return () => clearTimeout(timer)

      case 'state':
        const stateKey = floating.showCondition.value as string
        setIsVisible(!!sharedState[stateKey])
        break

      default:
        setIsVisible(true)
    }
  }, [floating.showCondition, scrollY, sharedState])

  // 위치 스타일 계산
  const positionStyle = useMemo<CSSProperties>(() => {
    const style: CSSProperties = {
      position: floating.position,
      zIndex: 1000,
    }

    // 앵커에 따른 위치 설정
    const offset = floating.offset ?? { x: 0, y: 0 }

    switch (floating.anchor) {
      case 'top-left':
        style.top = offset.y
        style.left = offset.x
        break
      case 'top-right':
        style.top = offset.y
        style.right = offset.x
        break
      case 'bottom-left':
        style.bottom = offset.y
        style.left = offset.x
        break
      case 'bottom-right':
        style.bottom = offset.y
        style.right = offset.x
        break
      case 'center':
        style.top = '50%'
        style.left = '50%'
        style.transform = `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`
        break
    }

    // 가시성
    style.opacity = isVisible ? 1 : 0
    style.pointerEvents = isVisible ? 'auto' : 'none'
    style.transition = 'opacity 0.3s ease'

    return style
  }, [floating.position, floating.anchor, floating.offset, isVisible])

  return (
    <div
      className="se2-floating-element"
      data-floating-id={floating.id}
      style={positionStyle}
    >
      <ElementRenderer element={floating.element} />
    </div>
  )
}

// ============================================
// Exports
// ============================================

export { FloatingRenderer as default }

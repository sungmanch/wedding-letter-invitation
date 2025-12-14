'use client'

import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { PrimitiveNode } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { mergeNodeStyles, getNodeProps } from '../types'

// GSAP 플러그인 등록 (클라이언트에서만)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// SSR-safe useLayoutEffect
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

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
  console.log('[Envelope] Rendering')
  const props = getNodeProps<EnvelopeProps>(node)
  const style = mergeNodeStyles(
    node as PrimitiveNode & { tokenStyle?: Record<string, unknown> },
    context
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const envelopeRef = useRef<HTMLDivElement>(null) // 봉투 뒷면 (z-1)
  const frontRef = useRef<HTMLDivElement>(null) // 봉투 앞면 (z-3)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [resolvedColors, setResolvedColors] = useState({
    envelope: '#f5f5f5',
    card: '#ffffff',
    flap: '#f5f5f5',
  })
  const [mounted, setMounted] = useState(false)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 색상 설정
  const envelopeColor = props.envelopeColor || 'var(--color-surface, #f5f5f5)'
  const cardColor = props.cardColor || 'var(--color-background, #ffffff)'
  const flapColor = props.flapColor || envelopeColor

  // 마운트 플래그 설정 (hydration 이슈 방지)
  useEffect(() => {
    setMounted(true)
  }, [])

  // CSS 변수를 실제 색상값으로 변환
  useEffect(() => {
    if (!containerRef.current || !mounted) return

    const timer = setTimeout(() => {
      if (!containerRef.current) return
      const computedStyle = getComputedStyle(containerRef.current)
      const rawSurface = computedStyle.getPropertyValue('--color-surface').trim()
      const rawBg = computedStyle.getPropertyValue('--color-background').trim()

      // 유효한 색상인지 확인 (빈 문자열이나 초기값 제외)
      const isValidColor = (color: string) => color && color !== 'initial' && color !== 'inherit'

      const surfaceColor = isValidColor(rawSurface) ? rawSurface : '#f5f5f5'
      const bgColor = isValidColor(rawBg) ? rawBg : '#ffffff'

      console.log('[Envelope] Resolved colors - surface:', rawSurface, '->', surfaceColor, 'bg:', rawBg, '->', bgColor)

      setResolvedColors({
        envelope: surfaceColor,
        card: bgColor,
        flap: surfaceColor,
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [envelopeColor, cardColor, flapColor, mounted])

  // GSAP ScrollTrigger 설정
  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || !cardRef.current || !envelopeRef.current || !frontRef.current || !mounted) return

    // 스크롤 컨테이너 찾기
    const findScrollContainer = (element: HTMLElement): HTMLElement | null => {
      let parent = element.parentElement
      while (parent) {
        // data-scroll-container 속성 확인 (PhoneFrame)
        if (parent.dataset.scrollContainer === 'true') {
          console.log('[Envelope] Found scroll container by data attribute:', parent.className)
          return parent
        }
        // overflow-y: auto/scroll 확인
        const computedStyle = getComputedStyle(parent)
        const overflowY = computedStyle.overflowY
        if (overflowY === 'auto' || overflowY === 'scroll') {
          console.log('[Envelope] Found scroll container by overflow:', parent.className)
          return parent
        }
        parent = parent.parentElement
      }
      return null
    }

    const scrollContainer = findScrollContainer(containerRef.current)
    console.log('[Envelope] GSAP Init - scrollContainer:', scrollContainer?.className || 'window')

    // 초기 위치 설정
    gsap.set(cardRef.current, { y: 0 })
    gsap.set(envelopeRef.current, { y: 0 })
    gsap.set(frontRef.current, { y: 0 })

    // ScrollTrigger 설정
    // 봉투 (뒷면+앞면): 느리게 아래로 이동
    // 카드: 빠르게 위로 이동
    // 상대적으로 카드가 봉투에서 빠져나오는 효과
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      scroller: scrollContainer || undefined,
      start: 'top 50%', // 화면 중앙에서 시작
      end: 'top 30%', // 화면 상단 30% 지점에서 완료
      scrub: 0.3,
      onUpdate: (self) => {
        if (!cardRef.current || !envelopeRef.current || !frontRef.current) return

        // 봉투 (뒷면+앞면): 느리게 아래로 이동 (0 → 150px)
        const envelopeY = self.progress * 150
        // 카드: 빠르게 위로 이동 (0 → -400px)
        const cardY = self.progress * -400

        gsap.set(envelopeRef.current, { y: envelopeY })
        gsap.set(frontRef.current, { y: envelopeY })
        gsap.set(cardRef.current, { y: cardY })
        setScrollProgress(self.progress)
      },
      onRefresh: (self) => {
        if (!cardRef.current || !envelopeRef.current || !frontRef.current) return
        const envelopeY = self.progress * 150
        const cardY = self.progress * -400
        gsap.set(envelopeRef.current, { y: envelopeY })
        gsap.set(frontRef.current, { y: envelopeY })
        gsap.set(cardRef.current, { y: cardY })
        setScrollProgress(self.progress)
      },
      invalidateOnRefresh: true,
      // markers: true,
    })

    return () => {
      trigger.kill()
    }
  }, [mounted])

  // 크기 상수
  const ENVELOPE_WIDTH = 300
  const ENVELOPE_HEIGHT = 180 // 봉투 본체 높이
  const FLAP_HEIGHT = 50 // 삼각형 flap 높이
  const CARD_MARGIN = 12

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
        minHeight: '100dvh', // 모바일 화면 꽉 채우기
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-background)', // 배경색 명시
      }}
      onClick={() => context.onSelectNode?.(node.id)}
    >
      {/* 봉투+카드 래퍼 - 중앙 정렬, 고정 크기 */}
      <div
        style={{
          position: 'relative',
          width: `${ENVELOPE_WIDTH}px`,
          height: `${ENVELOPE_HEIGHT + FLAP_HEIGHT}px`,
          flexShrink: 0,
          flexGrow: 0,
        }}
      >
        {/* 1. 편지 카드 - 위로 올라옴 (z-index 2) */}
        <div
          ref={cardRef}
          style={{
            position: 'absolute',
            left: `${CARD_MARGIN}px`,
            right: `${CARD_MARGIN}px`,
            top: `${FLAP_HEIGHT + 20}px`,
            zIndex: 2,
          }}
        >
          <div
            style={{
              backgroundColor: resolvedColors.card,
              borderRadius: '4px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              padding: '20px 16px',
            }}
          >
            {node.children?.map((child) => context.renderNode(child))}
          </div>
        </div>

        {/* 2. 봉투 뒷면 - 오각형 (직사각형 + 아래로 뾰족한 삼각형) - z-1 */}
        <div
          ref={envelopeRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${ENVELOPE_WIDTH}px`,
            height: `${ENVELOPE_HEIGHT + FLAP_HEIGHT}px`,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <svg
            width={ENVELOPE_WIDTH}
            height={ENVELOPE_HEIGHT + FLAP_HEIGHT}
            viewBox={`0 0 ${ENVELOPE_WIDTH} ${ENVELOPE_HEIGHT + FLAP_HEIGHT}`}
          >
            {/* 뒷면: 직사각형 + 아래 삼각형 flap */}
            <polygon
              points={`0,0 ${ENVELOPE_WIDTH},0 ${ENVELOPE_WIDTH},${ENVELOPE_HEIGHT} ${ENVELOPE_WIDTH / 2},${ENVELOPE_HEIGHT + FLAP_HEIGHT} 0,${ENVELOPE_HEIGHT}`}
              fill={resolvedColors.flap}
            />
          </svg>
        </div>

        {/* 3. 봉투 앞면 - 오각형 (위쪽 V자 컷 + 직사각형) - z-3 */}
        <div
          ref={frontRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${ENVELOPE_WIDTH}px`,
            height: `${ENVELOPE_HEIGHT + FLAP_HEIGHT}px`,
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          <svg
            width={ENVELOPE_WIDTH}
            height={ENVELOPE_HEIGHT + FLAP_HEIGHT}
            viewBox={`0 0 ${ENVELOPE_WIDTH} ${ENVELOPE_HEIGHT + FLAP_HEIGHT}`}
          >
            {/* 앞면: V자 컷 (위) + 직사각형 (아래) */}
            <polygon
              points={`0,0 ${ENVELOPE_WIDTH / 2},${FLAP_HEIGHT} ${ENVELOPE_WIDTH},0 ${ENVELOPE_WIDTH},${ENVELOPE_HEIGHT} 0,${ENVELOPE_HEIGHT}`}
              fill={resolvedColors.envelope}
            />
          </svg>
        </div>
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

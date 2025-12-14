/**
 * Super Editor v2 - Scroll Manager
 *
 * ScrollTrigger 관리, 수평 스크롤, 패럴랙스 효과
 * Lenis와 GSAP ScrollTrigger 통합
 */

'use client'

import { useEffect, useRef, useCallback, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { AnimationAction } from '../schema/types'
import { applyAction, convertToGsapVars, getLenis } from './animation-runtime'

// GSAP 플러그인 등록
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ============================================
// Types
// ============================================

export interface HorizontalScrollConfig {
  container: string
  track: string
  items?: string[]

  pin: {
    enabled: boolean
    spacing?: boolean
    anticipatePin?: number
  }

  scrollDistance?: number | 'auto' | string
  scrub?: boolean | number
  snap?:
    | boolean
    | number
    | {
        snapTo: number[] | 'items'
        duration?: { min: number; max: number }
        ease?: string
      }

  itemAnimation?: {
    entrance?: AnimationAction
    stagger?: number
    from?: 'left' | 'right'
  }

  showScrollHint?: boolean
  scrollHintDuration?: number
}

export interface ParallaxConfig {
  layers: Array<{
    target: string
    speed: number
    direction?: 'vertical' | 'horizontal' | 'both'
    offset?: { x?: number; y?: number }
    scale?: { from?: number; to?: number }
    opacity?: { from?: number; to?: number }
    rotate?: { from?: number; to?: number }
  }>

  trigger?: string
  start?: string
  end?: string
}

export interface ScrollManagerResult {
  refresh: () => void
  scrollTo: (target: string | number | HTMLElement, options?: ScrollToOptions) => void
  getProgress: () => number
  destroy: () => void
}

interface ScrollToOptions {
  offset?: number
  duration?: number
  easing?: (t: number) => number
}

// ============================================
// Scroll Manager Hook
// ============================================

/**
 * 문서 레벨 스크롤 매니저 훅
 */
export function useScrollManager(
  containerRef: RefObject<HTMLElement>,
  disabled = false
): ScrollManagerResult {
  const scrollTriggersRef = useRef<ScrollTrigger[]>([])
  const timelinesRef = useRef<gsap.core.Timeline[]>([])

  // ScrollTrigger 새로고침
  const refresh = useCallback(() => {
    ScrollTrigger.refresh()
  }, [])

  // 스크롤 이동
  const scrollTo = useCallback(
    (
      target: string | number | HTMLElement,
      options?: ScrollToOptions
    ) => {
      const lenis = getLenis()
      if (lenis) {
        lenis.scrollTo(target, options)
      } else {
        // Lenis 없으면 기본 스크롤
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' })
        } else if (typeof target === 'string') {
          const element = document.querySelector(target)
          element?.scrollIntoView({ behavior: 'smooth' })
        } else {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    []
  )

  // 현재 스크롤 진행률 (0-1)
  const getProgress = useCallback(() => {
    if (!containerRef.current) return 0
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    return docHeight > 0 ? scrollTop / docHeight : 0
  }, [containerRef])

  // 정리
  const destroy = useCallback(() => {
    scrollTriggersRef.current.forEach((st) => st.kill())
    scrollTriggersRef.current = []

    timelinesRef.current.forEach((tl) => tl.kill())
    timelinesRef.current = []
  }, [])

  // Unmount 시 정리
  useEffect(() => {
    return destroy
  }, [destroy])

  return {
    refresh,
    scrollTo,
    getProgress,
    destroy,
  }
}

// ============================================
// Horizontal Scroll Controller
// ============================================

export interface HorizontalScrollControllerProps {
  blockId: string
  config: HorizontalScrollConfig
  containerRef: RefObject<HTMLDivElement>
}

/**
 * 수평 스크롤 컨트롤러 훅
 */
export function useHorizontalScroll({
  blockId,
  config,
  containerRef,
}: HorizontalScrollControllerProps): { destroy: () => void } {
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const itemTimelinesRef = useRef<gsap.core.Timeline[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const track = container.querySelector(
      `[data-element-id="${config.track}"]`
    ) as HTMLElement

    if (!track) {
      console.warn(`Track element "${config.track}" not found`)
      return
    }

    // 스크롤 거리 계산
    const getScrollDistance = () => {
      if (config.scrollDistance === 'auto') {
        return track.scrollWidth - container.offsetWidth
      }
      if (typeof config.scrollDistance === 'string') {
        return parseScrollDistance(config.scrollDistance, container)
      }
      return config.scrollDistance || track.scrollWidth - container.offsetWidth
    }

    const lenis = getLenis()

    // 메인 타임라인
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        pin: config.pin.enabled,
        pinSpacing: config.pin.spacing ?? true,
        anticipatePin: config.pin.anticipatePin ?? 1,
        scrub: config.scrub ?? 1,
        snap: config.snap ? resolveSnapConfig(config.snap, config.items) : undefined,
        invalidateOnRefresh: true,

        onEnter: () => {
          if (lenis) {
            lenis.options.gestureOrientation = 'both'
          }
        },
        onLeave: () => {
          if (lenis) {
            lenis.options.gestureOrientation = 'vertical'
          }
        },
        onLeaveBack: () => {
          if (lenis) {
            lenis.options.gestureOrientation = 'vertical'
          }
        },
      },
    })

    // 트랙 수평 이동
    timeline.to(track, {
      x: () => -getScrollDistance(),
      ease: 'none',
    })

    timelineRef.current = timeline

    // 아이템별 애니메이션
    if (config.items && config.itemAnimation?.entrance) {
      const items = config.items
        .map((id) => container.querySelector(`[data-element-id="${id}"]`))
        .filter(Boolean) as HTMLElement[]

      items.forEach((item, index) => {
        const itemTl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            containerAnimation: timeline,
            start: 'left 80%',
            end: 'left 20%',
            scrub: true,
          },
        })

        if (config.itemAnimation?.entrance) {
          applyAction(itemTl, config.itemAnimation.entrance, item)
        }

        itemTimelinesRef.current.push(itemTl)
      })
    }

    // 스크롤 힌트
    if (config.showScrollHint) {
      showScrollHint(container, config.scrollHintDuration || 3000)
    }

    return () => {
      timeline.scrollTrigger?.kill()
      timeline.kill()
      itemTimelinesRef.current.forEach((tl) => {
        tl.scrollTrigger?.kill()
        tl.kill()
      })
      itemTimelinesRef.current = []
    }
  }, [blockId, config, containerRef])

  const destroy = useCallback(() => {
    timelineRef.current?.scrollTrigger?.kill()
    timelineRef.current?.kill()
    itemTimelinesRef.current.forEach((tl) => {
      tl.scrollTrigger?.kill()
      tl.kill()
    })
  }, [])

  return { destroy }
}

// ============================================
// Parallax Controller
// ============================================

export interface ParallaxControllerProps {
  config: ParallaxConfig
  containerRef: RefObject<HTMLElement>
}

/**
 * 패럴랙스 효과 훅
 */
export function useParallax({
  config,
  containerRef,
}: ParallaxControllerProps): { destroy: () => void } {
  const timelinesRef = useRef<gsap.core.Timeline[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // 트리거 요소
    const trigger = config.trigger
      ? document.querySelector(`[data-block-id="${config.trigger}"]`) || container
      : container

    const cleanups: (() => void)[] = []

    config.layers.forEach((layer) => {
      const target = document.querySelector(`[data-element-id="${layer.target}"]`)
      if (!target) return

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: config.start || 'top bottom',
          end: config.end || 'bottom top',
          scrub: true,
        },
      })

      // 이동 계산
      const movement: gsap.TweenVars = {}

      if (layer.direction !== 'horizontal') {
        movement.y = `${(1 - layer.speed) * 100}%`
      }
      if (layer.direction !== 'vertical') {
        movement.x = `${(1 - layer.speed) * 100}%`
      }

      if (layer.offset) {
        if (layer.offset.y) movement.y = `+=${layer.offset.y}`
        if (layer.offset.x) movement.x = `+=${layer.offset.x}`
      }

      // 스케일
      if (layer.scale) {
        gsap.set(target, { scale: layer.scale.from || 1 })
        movement.scale = layer.scale.to
      }

      // 투명도
      if (layer.opacity) {
        gsap.set(target, { opacity: layer.opacity.from || 1 })
        movement.opacity = layer.opacity.to
      }

      // 회전
      if (layer.rotate) {
        gsap.set(target, { rotation: layer.rotate.from || 0 })
        movement.rotation = layer.rotate.to
      }

      timeline.to(target, movement)
      timelinesRef.current.push(timeline)

      cleanups.push(() => {
        timeline.scrollTrigger?.kill()
        timeline.kill()
      })
    })

    return () => {
      cleanups.forEach((fn) => fn())
      timelinesRef.current = []
    }
  }, [config, containerRef])

  const destroy = useCallback(() => {
    timelinesRef.current.forEach((tl) => {
      tl.scrollTrigger?.kill()
      tl.kill()
    })
  }, [])

  return { destroy }
}

// ============================================
// Block Visibility Observer
// ============================================

export interface BlockVisibilityOptions {
  threshold?: number
  rootMargin?: string
  onEnter?: (blockId: string) => void
  onLeave?: (blockId: string) => void
}

/**
 * 블록 가시성 감시 훅
 */
export function useBlockVisibility(
  options: BlockVisibilityOptions = {}
): {
  visibleBlocks: Set<string>
  observe: (element: HTMLElement) => void
  unobserve: (element: HTMLElement) => void
} {
  const visibleBlocksRef = useRef<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const { threshold = 0.1, rootMargin = '0px', onEnter, onLeave } = options

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const blockId = (entry.target as HTMLElement).dataset.blockId
          if (!blockId) return

          if (entry.isIntersecting) {
            visibleBlocksRef.current.add(blockId)
            onEnter?.(blockId)
          } else {
            visibleBlocksRef.current.delete(blockId)
            onLeave?.(blockId)
          }
        })
      },
      { threshold, rootMargin }
    )

    return () => {
      observerRef.current?.disconnect()
    }
  }, [options])

  const observe = useCallback((element: HTMLElement) => {
    observerRef.current?.observe(element)
  }, [])

  const unobserve = useCallback((element: HTMLElement) => {
    observerRef.current?.unobserve(element)
  }, [])

  return {
    visibleBlocks: visibleBlocksRef.current,
    observe,
    unobserve,
  }
}

// ============================================
// Utility Functions
// ============================================

function parseScrollDistance(value: string, container: HTMLElement): number {
  if (value.endsWith('vw')) {
    const vw = parseFloat(value)
    return (vw / 100) * window.innerWidth
  }
  if (value.endsWith('vh')) {
    const vh = parseFloat(value)
    return (vh / 100) * window.innerHeight
  }
  if (value.endsWith('%')) {
    const percent = parseFloat(value)
    return (percent / 100) * container.offsetWidth
  }
  return parseFloat(value) || 0
}

function resolveSnapConfig(
  snap: HorizontalScrollConfig['snap'],
  items?: string[]
): ScrollTrigger.Vars['snap'] {
  if (snap === true) {
    return { snapTo: 1 / (items?.length || 1) }
  }
  if (typeof snap === 'number') {
    return { snapTo: snap }
  }
  if (typeof snap === 'object') {
    if (snap.snapTo === 'items' && items) {
      return {
        snapTo: items.map((_, i) => i / (items.length - 1)),
        duration: snap.duration,
        ease: snap.ease || 'power1.inOut',
      }
    }
    return snap as ScrollTrigger.Vars['snap']
  }
  return undefined
}

function showScrollHint(container: HTMLElement, duration: number): void {
  const hint = document.createElement('div')
  hint.className = 'scroll-hint'
  hint.style.cssText = `
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.8);
    font-size: 24px;
    pointer-events: none;
    z-index: 100;
  `
  hint.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  `
  container.style.position = 'relative'
  container.appendChild(hint)

  gsap.fromTo(
    hint,
    { opacity: 0, x: -10 },
    {
      opacity: 1,
      x: 10,
      duration: 0.8,
      repeat: 3,
      yoyo: true,
      ease: 'power1.inOut',
      onComplete: () => {
        gsap.to(hint, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => hint.remove(),
        })
      },
    }
  )
}

// ============================================
// Performance Optimization
// ============================================

/**
 * 뷰포트 밖 ScrollTrigger 일시 중지
 */
export function setupViewportOptimization(): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const blockId = (entry.target as HTMLElement).dataset?.blockId
        if (!blockId) return

        const triggers = ScrollTrigger.getAll().filter((st) => {
          const trigger = st.vars.trigger as HTMLElement
          return trigger?.dataset?.blockId === blockId
        })

        triggers.forEach((st) => {
          if (entry.isIntersecting) {
            st.enable()
          } else {
            st.disable()
          }
        })
      })
    },
    { rootMargin: '100px' }
  )

  document.querySelectorAll('[data-block-id]').forEach((el) => {
    observer.observe(el)
  })

  return () => observer.disconnect()
}

/**
 * will-change 최적화 적용
 */
export function optimizeElement(
  element: HTMLElement,
  properties: string[] = ['transform', 'opacity']
): () => void {
  element.style.willChange = properties.join(', ')
  return () => {
    element.style.willChange = 'auto'
  }
}

/**
 * 모든 ScrollTrigger 정리
 */
export function cleanupAllScrollTriggers(): void {
  ScrollTrigger.getAll().forEach((st) => st.kill())
}

/**
 * ScrollTrigger 새로고침 (리사이즈 후 호출)
 */
export function refreshScrollTriggers(): void {
  ScrollTrigger.refresh()
}

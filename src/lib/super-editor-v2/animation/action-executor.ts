/**
 * Super Editor v2 - Action Executor
 *
 * 블록/요소 레벨 애니메이션 컨트롤러
 * 프리셋 해석, entrance/scroll/hover 애니메이션 관리
 */

'use client'

import { useEffect, useRef, useCallback, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type {
  BlockAnimationConfig,
  ElementAnimationConfig,
  EntranceAnimation,
  ScrollAnimation,
  HoverAnimation,
  LoopAnimation,
  AnimationAction,
  Interaction,
  GlobalAnimation,
} from '../schema/types'
import {
  applyAction,
  convertToGsapVars,
  getSpeedMultiplier,
  getDefaultEasing,
  type ResolveContext,
} from './animation-runtime'
import { setupInteraction, type TriggerCleanup } from './trigger-handler'
import {
  getEntrancePreset,
  getScrollPreset,
  getHoverPreset,
} from '../presets/animation-presets'

// ============================================
// Types
// ============================================

export interface AnimationControllerOptions {
  blockId?: string
  elementId?: string
  globalConfig: GlobalAnimation
  disabled?: boolean
}

export interface AnimationControllerResult {
  cleanup: () => void
  play: (action: AnimationAction) => gsap.core.Timeline
  stop: () => void
  isPlaying: boolean
}

// ============================================
// Block Animation Controller
// ============================================

export interface BlockAnimationControllerProps {
  blockId: string
  animation: BlockAnimationConfig
  blockRef: RefObject<HTMLDivElement>
  globalConfig: GlobalAnimation
  disabled?: boolean
}

/**
 * 블록 레벨 애니메이션 컨트롤러 훅
 */
export function useBlockAnimationController({
  blockId,
  animation,
  blockRef,
  globalConfig,
  disabled = false,
}: BlockAnimationControllerProps): AnimationControllerResult {
  const timelinesRef = useRef<gsap.core.Timeline[]>([])
  const cleanupsRef = useRef<TriggerCleanup[]>([])
  const isPlayingRef = useRef(false)

  // Entrance 애니메이션
  useEffect(() => {
    if (disabled || !animation.entrance || !blockRef.current) return

    const element = blockRef.current
    const entranceConfig = animation.entrance
    const action = resolveEntranceAction(entranceConfig, globalConfig)

    if (!action) return

    // 초기 상태 설정 (from 값이 있으면)
    if (action.type === 'tween' && action.from) {
      gsap.set(element, convertToGsapVars(action.from))
    }

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          isPlayingRef.current = true
        },
      },
      delay: (entranceConfig.delay || 0) / 1000,
      onComplete: () => {
        isPlayingRef.current = false
      },
    })

    applyAction(timeline, action, element)
    timelinesRef.current.push(timeline)

    return () => {
      timeline.scrollTrigger?.kill()
      timeline.kill()
    }
  }, [animation.entrance, blockId, blockRef, globalConfig, disabled])

  // Scroll 연동 애니메이션
  useEffect(() => {
    if (disabled || !animation.scroll || !blockRef.current) return

    const element = blockRef.current
    const scrollConfig = animation.scroll
    const action = scrollConfig.action

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: scrollConfig.trigger.start || 'top bottom',
        end: scrollConfig.trigger.end || 'bottom top',
        scrub: scrollConfig.trigger.scrub ?? true,
        once: scrollConfig.trigger.once,
      },
    })

    applyAction(timeline, action, element)
    timelinesRef.current.push(timeline)

    return () => {
      timeline.scrollTrigger?.kill()
      timeline.kill()
    }
  }, [animation.scroll, blockId, blockRef, disabled])

  // Interactions
  useEffect(() => {
    if (disabled || !animation.interactions || !blockRef.current) return

    const element = blockRef.current
    const cleanups: TriggerCleanup[] = []

    animation.interactions.forEach((interaction) => {
      const cleanup = setupInteraction(interaction, { container: element })
      if (cleanup) cleanups.push(cleanup)
    })

    cleanupsRef.current = cleanups

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [animation.interactions, blockRef, disabled])

  // Play 함수
  const play = useCallback(
    (action: AnimationAction): gsap.core.Timeline => {
      if (!blockRef.current) return gsap.timeline()

      isPlayingRef.current = true
      const timeline = gsap.timeline({
        onComplete: () => {
          isPlayingRef.current = false
        },
      })
      applyAction(timeline, action, blockRef.current)
      timelinesRef.current.push(timeline)
      return timeline
    },
    [blockRef]
  )

  // Stop 함수
  const stop = useCallback(() => {
    timelinesRef.current.forEach((tl) => {
      tl.pause()
    })
    isPlayingRef.current = false
  }, [])

  // Cleanup
  const cleanup = useCallback(() => {
    timelinesRef.current.forEach((tl) => {
      tl.scrollTrigger?.kill()
      tl.kill()
    })
    timelinesRef.current = []

    cleanupsRef.current.forEach((fn) => fn())
    cleanupsRef.current = []

    isPlayingRef.current = false
  }, [])

  // Unmount 시 정리
  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    cleanup,
    play,
    stop,
    get isPlaying() {
      return isPlayingRef.current
    },
  }
}

// ============================================
// Element Animation Controller
// ============================================

export interface ElementAnimationControllerProps {
  elementId: string
  animation: ElementAnimationConfig
  elementRef: RefObject<HTMLElement>
  globalConfig: GlobalAnimation
  disabled?: boolean
}

/**
 * 요소 레벨 애니메이션 컨트롤러 훅
 */
export function useElementAnimationController({
  elementId,
  animation,
  elementRef,
  globalConfig,
  disabled = false,
}: ElementAnimationControllerProps): AnimationControllerResult {
  const timelinesRef = useRef<gsap.core.Timeline[]>([])
  const cleanupsRef = useRef<TriggerCleanup[]>([])
  const isPlayingRef = useRef(false)
  const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null)

  // Entrance 애니메이션
  useEffect(() => {
    if (disabled || !animation.entrance || !elementRef.current) return

    const element = elementRef.current
    const entranceConfig = animation.entrance
    const action = resolveEntranceAction(entranceConfig, globalConfig)

    if (!action) return

    // 초기 상태 설정
    if (action.type === 'tween' && action.from) {
      gsap.set(element, convertToGsapVars(action.from))
    }

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        once: true,
      },
      delay: (entranceConfig.delay || 0) / 1000,
    })

    applyAction(timeline, action, element)
    timelinesRef.current.push(timeline)

    return () => {
      timeline.scrollTrigger?.kill()
      timeline.kill()
    }
  }, [animation.entrance, elementId, elementRef, globalConfig, disabled])

  // Hover 애니메이션
  useEffect(() => {
    if (disabled || !animation.hover || !elementRef.current) return

    const element = elementRef.current
    const hoverConfig = animation.hover
    const action = resolveHoverAction(hoverConfig, globalConfig)

    if (!action) return

    const onMouseEnter = () => {
      hoverTimelineRef.current?.kill()
      hoverTimelineRef.current = gsap.timeline()
      applyAction(hoverTimelineRef.current, action, element)
    }

    const onMouseLeave = () => {
      hoverTimelineRef.current?.reverse()
    }

    element.addEventListener('mouseenter', onMouseEnter)
    element.addEventListener('mouseleave', onMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', onMouseEnter)
      element.removeEventListener('mouseleave', onMouseLeave)
      hoverTimelineRef.current?.kill()
    }
  }, [animation.hover, elementRef, globalConfig, disabled])

  // Loop 애니메이션
  useEffect(() => {
    if (disabled || !animation.loop || !elementRef.current) return

    const element = elementRef.current
    const loopConfig = animation.loop
    const action = loopConfig.action

    const timeline = gsap.timeline({
      repeat: loopConfig.iterations === -1 ? -1 : (loopConfig.iterations || 1) - 1,
      yoyo: loopConfig.direction === 'alternate',
    })

    applyAction(timeline, action, element)
    timelinesRef.current.push(timeline)

    return () => {
      timeline.kill()
    }
  }, [animation.loop, elementRef, disabled])

  // Interactions
  useEffect(() => {
    if (disabled || !animation.interactions || !elementRef.current) return

    const element = elementRef.current
    const cleanups: TriggerCleanup[] = []

    animation.interactions.forEach((interaction) => {
      const cleanup = setupInteraction(interaction, { container: element })
      if (cleanup) cleanups.push(cleanup)
    })

    cleanupsRef.current = cleanups

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [animation.interactions, elementRef, disabled])

  // Play 함수
  const play = useCallback(
    (action: AnimationAction): gsap.core.Timeline => {
      if (!elementRef.current) return gsap.timeline()

      isPlayingRef.current = true
      const timeline = gsap.timeline({
        onComplete: () => {
          isPlayingRef.current = false
        },
      })
      applyAction(timeline, action, elementRef.current)
      timelinesRef.current.push(timeline)
      return timeline
    },
    [elementRef]
  )

  // Stop 함수
  const stop = useCallback(() => {
    timelinesRef.current.forEach((tl) => tl.pause())
    hoverTimelineRef.current?.pause()
    isPlayingRef.current = false
  }, [])

  // Cleanup
  const cleanup = useCallback(() => {
    timelinesRef.current.forEach((tl) => {
      tl.scrollTrigger?.kill()
      tl.kill()
    })
    timelinesRef.current = []

    hoverTimelineRef.current?.kill()
    hoverTimelineRef.current = null

    cleanupsRef.current.forEach((fn) => fn())
    cleanupsRef.current = []

    isPlayingRef.current = false
  }, [])

  // Unmount 시 정리
  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    cleanup,
    play,
    stop,
    get isPlaying() {
      return isPlayingRef.current
    },
  }
}

// ============================================
// Preset Resolution
// ============================================

/**
 * Entrance 프리셋 또는 커스텀 액션 해석
 */
function resolveEntranceAction(
  config: EntranceAnimation,
  globalConfig: GlobalAnimation
): AnimationAction | null {
  // 커스텀 액션이 있으면 우선
  if (config.custom) {
    return applyDurationOverride(config.custom, config.duration, globalConfig)
  }

  // 프리셋 해석
  if (config.preset) {
    const preset = getEntrancePreset(config.preset)
    if (preset) {
      return applyDurationOverride(preset.action, config.duration, globalConfig)
    }
  }

  return null
}

/**
 * Hover 프리셋 또는 커스텀 액션 해석
 */
function resolveHoverAction(
  config: HoverAnimation,
  globalConfig: GlobalAnimation
): AnimationAction | null {
  const action = config.action

  if (typeof action === 'string') {
    // 프리셋 ID
    const preset = getHoverPreset(action as string)
    return preset?.action || null
  }

  return applyDurationOverride(action, config.duration, globalConfig)
}

/**
 * Duration 오버라이드 적용
 */
function applyDurationOverride(
  action: AnimationAction,
  durationOverride: number | undefined,
  globalConfig: GlobalAnimation
): AnimationAction {
  if (!durationOverride) return action

  const speedMultiplier = getSpeedMultiplier(globalConfig)
  const adjustedDuration = durationOverride * speedMultiplier

  // 액션 타입에 따라 duration 적용
  if (action.type === 'tween') {
    return { ...action, duration: adjustedDuration }
  }

  if (action.type === 'timeline') {
    return { ...action, totalDuration: adjustedDuration }
  }

  return action
}

// ============================================
// Utility Functions
// ============================================

/**
 * 요소에 will-change 최적화 적용
 */
export function optimizeForAnimation(
  element: HTMLElement,
  properties: string[] = ['transform', 'opacity']
): () => void {
  element.style.willChange = properties.join(', ')

  return () => {
    element.style.willChange = 'auto'
  }
}

/**
 * 모든 블록 애니메이션 정리
 */
export function cleanupAllBlockAnimations(): void {
  ScrollTrigger.getAll().forEach((st) => st.kill())
  gsap.globalTimeline.clear()
}

/**
 * 특정 블록의 애니메이션 정리
 */
export function cleanupBlockAnimations(blockId: string): void {
  const element = document.querySelector(`[data-block-id="${blockId}"]`)
  if (element) {
    gsap.killTweensOf(element)
    gsap.killTweensOf(element.querySelectorAll('*'))
  }

  ScrollTrigger.getAll()
    .filter((st) => {
      const trigger = st.vars.trigger as HTMLElement
      return trigger?.dataset?.blockId === blockId
    })
    .forEach((st) => st.kill())
}

/**
 * Super Editor v2 - Trigger Handler
 *
 * 트리거 감지 및 처리
 * scroll, gesture, event, time 트리거 지원
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type {
  Trigger,
  ScrollTrigger as ScrollTriggerType,
  GestureTrigger,
  EventTrigger,
  TimeTrigger,
  StateTrigger,
  AnimationAction,
  Interaction,
} from '../schema/types'
import { applyAction, type ResolveContext } from './animation-runtime'

// ============================================
// Types
// ============================================

export type TriggerCleanup = () => void

export interface TriggerSetupOptions {
  container: HTMLElement
  onStateTransition?: (to: string) => void
}

// ============================================
// Main Trigger Setup
// ============================================

/**
 * 인터랙션의 트리거를 설정하고 cleanup 함수 반환
 */
export function setupInteraction(
  interaction: Interaction,
  options: TriggerSetupOptions
): TriggerCleanup | undefined {
  if (interaction.enabled === false) return undefined

  const { trigger, action, condition } = interaction
  const { container } = options

  // 조건 체크
  if (condition) {
    // 미디어 쿼리 체크
    if (condition.media && typeof window !== 'undefined') {
      if (!window.matchMedia(condition.media).matches) {
        return undefined
      }
    }
    // state, expression 조건은 런타임에 체크
  }

  return setupTrigger(trigger, action, options)
}

/**
 * 트리거 타입에 따라 적절한 핸들러 설정
 */
export function setupTrigger(
  trigger: Trigger,
  action: AnimationAction,
  options: TriggerSetupOptions
): TriggerCleanup | undefined {
  switch (trigger.type) {
    case 'scroll':
      return setupScrollTrigger(trigger, action, options)

    case 'gesture':
      return setupGestureTrigger(trigger, action, options)

    case 'event':
      return setupEventTrigger(trigger, action, options)

    case 'time':
      return setupTimeTrigger(trigger, action, options)

    case 'state':
      return setupStateTrigger(trigger, action, options)

    default:
      console.warn(`Unknown trigger type: ${(trigger as Trigger).type}`)
      return undefined
  }
}

// ============================================
// Scroll Trigger
// ============================================

function setupScrollTrigger(
  trigger: ScrollTriggerType,
  action: AnimationAction,
  options: TriggerSetupOptions
): TriggerCleanup {
  const { container } = options

  // 타겟 요소 결정
  const targetElement = trigger.target
    ? document.querySelector(`[data-block-id="${trigger.target}"]`) ||
      document.querySelector(`[data-element-id="${trigger.target}"]`) ||
      container
    : container

  const scrollTriggerConfig: ScrollTrigger.Vars = {
    trigger: targetElement,
    start: trigger.start,
    end: trigger.end,
    scrub: trigger.scrub,
    once: trigger.once,
  }

  let timeline: gsap.core.Timeline

  if (trigger.scrub) {
    // Scrub 모드: 스크롤 진행률에 1:1 연동
    timeline = gsap.timeline({ scrollTrigger: scrollTriggerConfig })
    applyAction(timeline, action, container)
  } else {
    // 일반 모드: 트리거 지점에서 1회 실행
    timeline = gsap.timeline({
      scrollTrigger: {
        ...scrollTriggerConfig,
        onEnter: trigger.enter !== false ? () => {
          const tl = gsap.timeline()
          applyAction(tl, action, container)
        } : undefined,
        onLeave: trigger.leave ? () => {
          // leave 액션이 필요한 경우 별도 처리
        } : undefined,
        onEnterBack: trigger.direction === 'both' || trigger.direction === 'up' ? () => {
          const tl = gsap.timeline()
          applyAction(tl, action, container)
        } : undefined,
      },
    })
  }

  return () => {
    timeline.scrollTrigger?.kill()
    timeline.kill()
  }
}

// ============================================
// Gesture Trigger
// ============================================

interface GestureState {
  startX: number
  startY: number
  startTime: number
  isActive: boolean
}

function setupGestureTrigger(
  trigger: GestureTrigger,
  action: AnimationAction,
  options: TriggerSetupOptions
): TriggerCleanup {
  const { container } = options

  // 타겟 요소들 찾기
  const targets = findGestureTargets(trigger.target, container)
  if (targets.length === 0) return () => {}

  const handlers: Array<{
    element: Element
    type: string
    handler: EventListener
    options?: AddEventListenerOptions
  }> = []

  const gestureStates = new Map<Element, GestureState>()

  targets.forEach((target) => {
    const context: ResolveContext = {
      triggeredElement: (target as HTMLElement).dataset?.elementId,
    }

    switch (trigger.gesture) {
      case 'tap':
        addHandler(target, 'click', () => {
          const tl = gsap.timeline()
          applyAction(tl, action, target as HTMLElement, context)
        })
        break

      case 'double-tap':
        addHandler(target, 'dblclick', () => {
          const tl = gsap.timeline()
          applyAction(tl, action, target as HTMLElement, context)
        })
        break

      case 'long-press':
        setupLongPress(target, action, context, 500)
        break

      case 'hover':
        addHandler(target, 'mouseenter', () => {
          const tl = gsap.timeline()
          applyAction(tl, action, target as HTMLElement, context)
        })
        break

      case 'swipe':
        setupSwipe(target, trigger, action, context)
        break

      case 'drag':
        setupDrag(target, trigger, action, context)
        break

      case 'pinch':
        // Pinch는 터치 이벤트 2개 이상 필요 - 복잡한 구현
        console.warn('Pinch gesture requires additional implementation')
        break
    }
  })

  function addHandler(
    element: Element,
    type: string,
    handler: EventListener,
    eventOptions?: AddEventListenerOptions
  ) {
    element.addEventListener(type, handler, eventOptions)
    handlers.push({ element, type, handler, options: eventOptions })
  }

  function setupLongPress(
    element: Element,
    action: AnimationAction,
    context: ResolveContext,
    duration: number
  ) {
    let timeoutId: number | null = null

    const onStart = () => {
      timeoutId = window.setTimeout(() => {
        const tl = gsap.timeline()
        applyAction(tl, action, element as HTMLElement, context)
      }, duration)
    }

    const onEnd = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }

    addHandler(element, 'mousedown', onStart)
    addHandler(element, 'mouseup', onEnd)
    addHandler(element, 'mouseleave', onEnd)
    addHandler(element, 'touchstart', onStart, { passive: true })
    addHandler(element, 'touchend', onEnd)
    addHandler(element, 'touchcancel', onEnd)
  }

  function setupSwipe(
    element: Element,
    trigger: GestureTrigger,
    action: AnimationAction,
    context: ResolveContext
  ) {
    const SWIPE_THRESHOLD = 50
    const VELOCITY_THRESHOLD = 0.3

    const onTouchStart = (e: TouchEvent) => {
      gestureStates.set(element, {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        startTime: Date.now(),
        isActive: true,
      })
    }

    const onTouchEnd = (e: TouchEvent) => {
      const state = gestureStates.get(element)
      if (!state?.isActive) return

      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const deltaX = endX - state.startX
      const deltaY = endY - state.startY
      const deltaTime = Date.now() - state.startTime
      const velocity = Math.sqrt(deltaX ** 2 + deltaY ** 2) / deltaTime

      if (velocity < VELOCITY_THRESHOLD) return

      // 방향 체크
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY)
      const isVertical = !isHorizontal

      let direction: 'left' | 'right' | 'up' | 'down' | null = null

      if (isHorizontal && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        direction = deltaX > 0 ? 'right' : 'left'
      } else if (isVertical && Math.abs(deltaY) > SWIPE_THRESHOLD) {
        direction = deltaY > 0 ? 'down' : 'up'
      }

      if (!direction) return

      // 트리거 방향과 매칭 체크
      const triggerDirection = trigger.direction
      const shouldTrigger =
        !triggerDirection ||
        triggerDirection === direction ||
        (triggerDirection === 'horizontal' && (direction === 'left' || direction === 'right')) ||
        (triggerDirection === 'vertical' && (direction === 'up' || direction === 'down'))

      if (shouldTrigger) {
        const tl = gsap.timeline()
        applyAction(tl, action, element as HTMLElement, {
          ...context,
        })
      }

      gestureStates.delete(element)
    }

    addHandler(element, 'touchstart', onTouchStart as EventListener, { passive: true })
    addHandler(element, 'touchend', onTouchEnd as EventListener)
  }

  function setupDrag(
    element: Element,
    trigger: GestureTrigger,
    action: AnimationAction,
    context: ResolveContext
  ) {
    let isDragging = false
    let startX = 0
    let startY = 0

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      startX = e.clientX
      startY = e.clientY
      ;(element as HTMLElement).style.cursor = 'grabbing'
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      // 축 제한
      const axis = trigger.axis
      const x = axis === 'y' ? 0 : deltaX
      const y = axis === 'x' ? 0 : deltaY

      // 범위 제한
      const bounds = trigger.bounds
      const clampedX = bounds ? Math.max(bounds.min, Math.min(bounds.max, x)) : x
      const clampedY = bounds ? Math.max(bounds.min, Math.min(bounds.max, y)) : y

      gsap.set(element, { x: clampedX, y: clampedY })
    }

    const onMouseUp = () => {
      if (!isDragging) return
      isDragging = false
      ;(element as HTMLElement).style.cursor = 'grab'

      // 드래그 완료 시 액션 실행
      const tl = gsap.timeline()
      applyAction(tl, action, element as HTMLElement, context)
    }

    addHandler(element, 'mousedown', onMouseDown as EventListener)
    addHandler(document.body, 'mousemove', onMouseMove as EventListener)
    addHandler(document.body, 'mouseup', onMouseUp as EventListener)
  }

  return () => {
    handlers.forEach(({ element, type, handler, options: opts }) => {
      element.removeEventListener(type, handler, opts)
    })
    gestureStates.clear()
  }
}

function findGestureTargets(target: string, container: HTMLElement): Element[] {
  // 와일드카드 (photo-*)
  if (target.includes('*')) {
    const prefix = target.replace('*', '')
    return Array.from(container.querySelectorAll(`[data-element-id^="${prefix}"]`))
  }

  // 일반 ID
  const element =
    container.querySelector(`[data-element-id="${target}"]`) ||
    document.querySelector(`[data-element-id="${target}"]`)

  return element ? [element] : [container]
}

// ============================================
// Event Trigger
// ============================================

function setupEventTrigger(
  trigger: EventTrigger,
  action: AnimationAction,
  options: TriggerSetupOptions
): TriggerCleanup {
  const { container } = options

  // 타겟 결정
  const targetElement = trigger.target
    ? document.querySelector(`[data-element-id="${trigger.target}"]`) || document
    : document

  const handler = (e: Event) => {
    const context: ResolveContext = {
      triggeredElement: (e.target as HTMLElement)?.dataset?.elementId,
    }

    const tl = gsap.timeline()
    applyAction(tl, action, container, context)
  }

  targetElement.addEventListener(trigger.event, handler)

  return () => {
    targetElement.removeEventListener(trigger.event, handler)
  }
}

// ============================================
// Time Trigger
// ============================================

function setupTimeTrigger(
  trigger: TimeTrigger,
  action: AnimationAction,
  options: TriggerSetupOptions
): TriggerCleanup {
  const { container } = options
  const timeouts: number[] = []
  const intervals: number[] = []

  const execute = () => {
    const tl = gsap.timeline()
    applyAction(tl, action, container)
  }

  if (trigger.repeat && trigger.repeat !== 1) {
    // 반복 실행
    const interval = trigger.interval || trigger.delay

    // 첫 실행은 delay 후
    const firstTimeout = window.setTimeout(() => {
      execute()

      // 이후 interval마다 반복
      const intervalId = window.setInterval(execute, interval)
      intervals.push(intervalId)

      // 횟수 제한이 있으면 카운트
      if (trigger.repeat! > 0) {
        let count = 1
        const checkInterval = window.setInterval(() => {
          count++
          if (count >= trigger.repeat!) {
            window.clearInterval(intervalId)
            window.clearInterval(checkInterval)
          }
        }, interval)
        intervals.push(checkInterval)
      }
    }, trigger.delay)

    timeouts.push(firstTimeout)
  } else {
    // 1회 실행
    const timeoutId = window.setTimeout(execute, trigger.delay)
    timeouts.push(timeoutId)
  }

  return () => {
    timeouts.forEach(clearTimeout)
    intervals.forEach(clearInterval)
  }
}

// ============================================
// State Trigger
// ============================================

function setupStateTrigger(
  trigger: StateTrigger,
  action: AnimationAction,
  options: TriggerSetupOptions
): TriggerCleanup {
  const { container, onStateTransition } = options

  // State 트리거는 상태 머신에서 관리
  // 여기서는 커스텀 이벤트 리스너로 구현
  const eventName = `state:${trigger.to}`

  const handler = (e: CustomEvent) => {
    const fromState = e.detail?.from
    if (trigger.from && trigger.from !== '*' && trigger.from !== fromState) {
      return
    }

    const tl = gsap.timeline()
    applyAction(tl, action, container)
  }

  container.addEventListener(eventName, handler as EventListener)

  return () => {
    container.removeEventListener(eventName, handler as EventListener)
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * 상태 전이 이벤트 발생
 */
export function emitStateTransition(
  container: HTMLElement,
  to: string,
  from?: string
): void {
  const event = new CustomEvent(`state:${to}`, {
    detail: { from, to },
    bubbles: true,
  })
  container.dispatchEvent(event)
}

/**
 * 트리거 매칭 체크
 */
export function matchesTrigger(registered: Trigger, fired: Trigger): boolean {
  if (registered.type !== fired.type) return false

  switch (registered.type) {
    case 'scroll':
      // 스크롤 트리거는 ScrollTrigger에서 관리
      return false

    case 'gesture':
      return (
        registered.gesture === (fired as GestureTrigger).gesture &&
        registered.target === (fired as GestureTrigger).target
      )

    case 'event':
      return (
        registered.event === (fired as EventTrigger).event &&
        (!registered.target || registered.target === (fired as EventTrigger).target)
      )

    case 'state':
      return registered.to === (fired as StateTrigger).to

    case 'time':
      // 타임 트리거는 자동 실행
      return false

    default:
      return false
  }
}

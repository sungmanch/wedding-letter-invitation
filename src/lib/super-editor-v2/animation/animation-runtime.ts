/**
 * Super Editor v2 - Animation Runtime
 *
 * GSAP + Lenis 기반 애니메이션 런타임
 * 선언적 AnimationAction을 실제 애니메이션으로 변환
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import type {
  AnimationAction,
  AnimationProperties,
  TweenAction,
  SpringAction,
  SequenceAction,
  TimelineAction,
  StaggerAction,
  SetAction,
  GlobalAnimation,
  AnimationMood,
} from '../schema/types'

// GSAP 플러그인 등록
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ============================================
// Types
// ============================================

export interface LenisConfig {
  duration?: number
  easing?: (t: number) => number
  orientation?: 'vertical' | 'horizontal'
  gestureOrientation?: 'vertical' | 'horizontal' | 'both'
  smoothWheel?: boolean
  wheelMultiplier?: number
  touchMultiplier?: number
  infinite?: boolean
}

export interface ResolveContext {
  triggeredElement?: string
  activePhoto?: string
  originalX?: number
  originalY?: number
  index?: number
}

// ============================================
// Lenis 관리
// ============================================

let lenisInstance: Lenis | null = null
let lenisRafId: number | null = null

export const LENIS_EASING_PRESETS = {
  smooth: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  snappy: (t: number) => 1 - Math.pow(1 - t, 3),
  cinematic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
} as const

export function initLenis(config: LenisConfig = {}): Lenis {
  if (lenisInstance) return lenisInstance

  lenisInstance = new Lenis({
    duration: config.duration ?? 1.2,
    easing: config.easing ?? LENIS_EASING_PRESETS.smooth,
    orientation: config.orientation ?? 'vertical',
    gestureOrientation: config.gestureOrientation ?? 'vertical',
    smoothWheel: config.smoothWheel ?? true,
    wheelMultiplier: config.wheelMultiplier ?? 1,
    touchMultiplier: config.touchMultiplier ?? 2,
  })

  // Lenis → GSAP ScrollTrigger 동기화
  lenisInstance.on('scroll', ScrollTrigger.update)

  // GSAP ticker에 Lenis RAF 연결
  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000)
  })

  // ScrollTrigger가 Lenis의 스크롤 위치 사용하도록 설정
  gsap.ticker.lagSmoothing(0)

  return lenisInstance
}

export function destroyLenis(): void {
  if (lenisRafId) {
    cancelAnimationFrame(lenisRafId)
    lenisRafId = null
  }
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
}

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function scrollTo(
  target: string | number | HTMLElement,
  options?: { offset?: number; duration?: number; easing?: (t: number) => number }
): void {
  lenisInstance?.scrollTo(target, options)
}

// ============================================
// Mood 기반 설정
// ============================================

const MOOD_DURATION_MULTIPLIER: Record<AnimationMood, number> = {
  minimal: 0.5,
  subtle: 0.8,
  elegant: 1.0,
  playful: 0.7,
  dramatic: 1.3,
  cinematic: 1.5,
}

const MOOD_EASING: Record<AnimationMood, string> = {
  minimal: 'power1.out',
  subtle: 'power2.inOut',
  elegant: 'power2.out',
  playful: 'back.out(1.7)',
  dramatic: 'expo.out',
  cinematic: 'power4.out',
}

export function getSpeedMultiplier(config: GlobalAnimation): number {
  return (config.speed ?? 1) * MOOD_DURATION_MULTIPLIER[config.mood ?? 'elegant']
}

export function getDefaultEasing(config: GlobalAnimation): string {
  return MOOD_EASING[config.mood ?? 'elegant']
}

export function getDefaultDuration(
  type: 'fast' | 'normal' | 'slow',
  config: GlobalAnimation
): number {
  const base = type === 'fast' ? 200 : type === 'normal' ? 400 : 800
  return base * getSpeedMultiplier(config)
}

// ============================================
// AnimationProperties → GSAP 변환
// ============================================

export function convertToGsapVars(props: AnimationProperties): gsap.TweenVars {
  const vars: gsap.TweenVars = {}

  // Transform
  if (props.x !== undefined) vars.x = props.x
  if (props.y !== undefined) vars.y = props.y
  if (props.z !== undefined) vars.z = props.z
  if (props.scale !== undefined) vars.scale = props.scale
  if (props.scaleX !== undefined) vars.scaleX = props.scaleX
  if (props.scaleY !== undefined) vars.scaleY = props.scaleY
  if (props.rotate !== undefined) vars.rotation = props.rotate
  if (props.rotateX !== undefined) vars.rotationX = props.rotateX
  if (props.rotateY !== undefined) vars.rotationY = props.rotateY
  if (props.skewX !== undefined) vars.skewX = props.skewX
  if (props.skewY !== undefined) vars.skewY = props.skewY
  if (props.transformOrigin !== undefined) vars.transformOrigin = props.transformOrigin
  if (props.perspective !== undefined) vars.perspective = props.perspective

  // Opacity & Visibility
  if (props.opacity !== undefined) vars.opacity = props.opacity
  if (props.visibility !== undefined) vars.visibility = props.visibility

  // Filter - 개별 필터를 조합
  const filters: string[] = []
  if (props.blur !== undefined) filters.push(`blur(${props.blur}px)`)
  if (props.brightness !== undefined) filters.push(`brightness(${props.brightness})`)
  if (props.contrast !== undefined) filters.push(`contrast(${props.contrast})`)
  if (props.grayscale !== undefined) filters.push(`grayscale(${props.grayscale})`)
  if (props.saturate !== undefined) filters.push(`saturate(${props.saturate})`)
  if (props.sepia !== undefined) filters.push(`sepia(${props.sepia})`)
  if (props.hueRotate !== undefined) filters.push(`hue-rotate(${props.hueRotate}deg)`)
  if (filters.length > 0) vars.filter = filters.join(' ')

  // Clip & Mask
  if (props.clipPath !== undefined) vars.clipPath = props.clipPath
  if (props.maskImage !== undefined) vars.maskImage = props.maskImage

  // Size
  if (props.width !== undefined) vars.width = props.width
  if (props.height !== undefined) vars.height = props.height

  // Color
  if (props.backgroundColor !== undefined) vars.backgroundColor = props.backgroundColor
  if (props.color !== undefined) vars.color = props.color
  if (props.borderColor !== undefined) vars.borderColor = props.borderColor

  // SVG
  if (props.strokeDashoffset !== undefined) vars.strokeDashoffset = props.strokeDashoffset
  if (props.strokeDasharray !== undefined) vars.strokeDasharray = props.strokeDasharray
  if (props.pathLength !== undefined) vars.attr = { ...vars.attr, pathLength: props.pathLength }

  // CSS Variables
  Object.keys(props).forEach((key) => {
    if (key.startsWith('--')) {
      vars[key] = props[key as keyof AnimationProperties]
    }
  })

  return vars
}

// ============================================
// Target 해석
// ============================================

export function resolveTargets(
  target: string | string[],
  defaultTarget: HTMLElement,
  context?: ResolveContext
): HTMLElement | HTMLElement[] | NodeListOf<Element> {
  // 배열 처리
  if (Array.isArray(target)) {
    return target.flatMap((t) => {
      const result = resolveTargetsInternal(t, defaultTarget, context)
      if (result instanceof NodeList) {
        return Array.from(result) as HTMLElement[]
      }
      return [result]
    }) as HTMLElement[]
  }

  return resolveTargetsInternal(target, defaultTarget, context)
}

function resolveTargetsInternal(
  target: string,
  defaultTarget: HTMLElement,
  context?: ResolveContext
): HTMLElement | NodeListOf<Element> {
  // self 또는 빈 문자열 → 기본 타겟
  if (target === 'self' || target === '') {
    return defaultTarget
  }

  // children → 자식 요소들
  if (target === 'children') {
    return defaultTarget.querySelectorAll(':scope > *')
  }

  // 동적 변수 ($activePhoto, $triggeredElement 등)
  if (target.startsWith('$')) {
    const resolved = resolveDynamicVariable(target, context)
    if (resolved) {
      const element = document.querySelector(`[data-element-id="${resolved}"]`)
      return (element as HTMLElement) || defaultTarget
    }
    return defaultTarget
  }

  // 와일드카드 (photo-*)
  if (target.includes('*')) {
    const selector = `[data-element-id^="${target.replace('*', '')}"]`
    return document.querySelectorAll(selector)
  }

  // 일반 ID → data-element-id 또는 data-block-id로 검색
  const element =
    document.querySelector(`[data-element-id="${target}"]`) ||
    document.querySelector(`[data-block-id="${target}"]`)
  return (element as HTMLElement) || defaultTarget
}

function resolveDynamicVariable(
  variable: string,
  context?: ResolveContext
): string | undefined {
  if (!context) return undefined

  switch (variable) {
    case '$triggeredElement':
      return context.triggeredElement
    case '$activePhoto':
      return context.activePhoto
    default:
      return undefined
  }
}

// ============================================
// 액션 실행기
// ============================================

/**
 * AnimationAction을 GSAP Timeline에 적용
 */
export function applyAction(
  timeline: gsap.core.Timeline,
  action: AnimationAction,
  defaultTarget: HTMLElement,
  context?: ResolveContext
): void {
  switch (action.type) {
    case 'tween':
      applyTweenAction(timeline, action, defaultTarget, context)
      break

    case 'sequence':
      applySequenceAction(timeline, action, defaultTarget, context)
      break

    case 'timeline':
      applyTimelineAction(timeline, action, defaultTarget, context)
      break

    case 'spring':
      applySpringAction(timeline, action, defaultTarget, context)
      break

    case 'stagger':
      applyStaggerAction(timeline, action, defaultTarget, context)
      break

    case 'set':
      applySetAction(timeline, action, defaultTarget, context)
      break

    // path, morph는 추가 GSAP 플러그인 필요
    case 'path':
    case 'morph':
      console.warn(`Action type "${action.type}" requires additional GSAP plugins`)
      break

    default:
      console.warn(`Unknown action type: ${(action as AnimationAction).type}`)
  }
}

function applyTweenAction(
  timeline: gsap.core.Timeline,
  action: TweenAction,
  defaultTarget: HTMLElement,
  context?: ResolveContext
): void {
  const targets = resolveTargets(action.target, defaultTarget, context)

  const toVars: gsap.TweenVars = {
    ...convertToGsapVars(action.to),
    duration: action.duration / 1000,
    ease: action.easing || 'power2.out',
    delay: (action.delay || 0) / 1000,
  }

  if (action.iterations !== undefined) {
    toVars.repeat = action.iterations === -1 ? -1 : action.iterations - 1
  }

  if (action.direction === 'alternate') {
    toVars.yoyo = true
  }

  if (action.fill) {
    // GSAP는 기본적으로 'forwards' 동작
    // 'backwards'나 'both'는 별도 처리 필요
  }

  if (action.from) {
    timeline.fromTo(targets, convertToGsapVars(action.from), toVars)
  } else {
    timeline.to(targets, toVars)
  }
}

function applySequenceAction(
  timeline: gsap.core.Timeline,
  action: SequenceAction,
  defaultTarget: HTMLElement,
  context?: ResolveContext
): void {
  action.steps.forEach((step) => {
    applyAction(timeline, step, defaultTarget, context)
  })
}

function applyTimelineAction(
  timeline: gsap.core.Timeline,
  action: TimelineAction,
  defaultTarget: HTMLElement,
  context?: ResolveContext
): void {
  action.tracks.forEach((track) => {
    const position = resolveTimelinePosition(track.at)
    const childTimeline = gsap.timeline()
    applyAction(childTimeline, track.action, defaultTarget, context)
    timeline.add(childTimeline, position)
  })
}

function resolveTimelinePosition(at: number | string): number | string {
  if (typeof at === 'number') {
    return at / 1000 // ms → seconds
  }

  // 'prev-end', '+=100', '<' 등 GSAP position 문법 그대로 사용
  if (at.includes('+=') || at.includes('-=')) {
    // ms를 seconds로 변환
    const match = at.match(/([+-]=)(\d+)/)
    if (match) {
      const operator = match[1]
      const value = parseInt(match[2], 10) / 1000
      return `${operator}${value}`
    }
  }

  if (at === 'prev-end') return '>'
  if (at === 'prev-start') return '<'

  // 퍼센트
  if (at.endsWith('%')) {
    return at
  }

  return at
}

function applySpringAction(
  timeline: gsap.core.Timeline,
  action: SpringAction,
  defaultTarget: HTMLElement,
  context?: ResolveContext
): void {
  const targets = resolveTargets(action.target, defaultTarget, context)

  // GSAP elastic easing으로 spring 효과 시뮬레이션
  const stiffness = action.stiffness ?? 100
  const damping = action.damping ?? 10

  // elastic 파라미터 계산 (근사치)
  const amplitude = Math.min(2, Math.max(0.5, stiffness / 100))
  const period = Math.max(0.1, damping / 50)

  timeline.to(targets, {
    ...convertToGsapVars(action.to),
    ease: `elastic.out(${amplitude}, ${period})`,
    duration: 0.8 + damping / 20,
  })
}

function applyStaggerAction(
  timeline: gsap.core.Timeline,
  action: StaggerAction,
  defaultTarget: HTMLElement,
  context?: ResolveContext
): void {
  const targets = resolveTargets(action.targets, defaultTarget, context)

  const staggerConfig: number | gsap.StaggerVars =
    typeof action.stagger === 'number'
      ? action.stagger / 1000
      : {
          each: (action.stagger.each || 100) / 1000,
          from: (action.stagger.from || 'start') as gsap.StaggerVars['from'],
          grid: action.stagger.grid,
          axis: action.stagger.axis,
        }

  const innerAction = action.action
  if (innerAction.type === 'tween') {
    const toVars: gsap.TweenVars = {
      ...convertToGsapVars(innerAction.to),
      duration: (innerAction.duration || 400) / 1000,
      ease: innerAction.easing || 'power2.out',
      stagger: staggerConfig,
    }

    if (innerAction.from) {
      timeline.fromTo(targets, convertToGsapVars(innerAction.from), toVars)
    } else {
      timeline.to(targets, toVars)
    }
  } else if (innerAction.type === 'spring') {
    const stiffness = innerAction.stiffness ?? 100
    const damping = innerAction.damping ?? 10
    const amplitude = Math.min(2, Math.max(0.5, stiffness / 100))
    const period = Math.max(0.1, damping / 50)

    timeline.to(targets, {
      ...convertToGsapVars(innerAction.to),
      ease: `elastic.out(${amplitude}, ${period})`,
      duration: 0.8,
      stagger: staggerConfig,
    })
  }
}

function applySetAction(
  timeline: gsap.core.Timeline,
  action: SetAction,
  defaultTarget: HTMLElement,
  context?: ResolveContext
): void {
  const targets = resolveTargets(action.target, defaultTarget, context)
  timeline.set(targets, convertToGsapVars(action.properties))
}

// ============================================
// 편의 함수
// ============================================

/**
 * 단일 액션을 즉시 실행
 */
export function playAction(
  action: AnimationAction,
  target: HTMLElement,
  context?: ResolveContext
): gsap.core.Timeline {
  const timeline = gsap.timeline()
  applyAction(timeline, action, target, context)
  return timeline
}

/**
 * 현재 타겟의 모든 애니메이션 중지
 */
export function killAnimations(target: HTMLElement | string): void {
  if (typeof target === 'string') {
    const element = document.querySelector(`[data-element-id="${target}"]`)
    if (element) {
      gsap.killTweensOf(element)
    }
  } else {
    gsap.killTweensOf(target)
  }
}

/**
 * 모든 ScrollTrigger 정리
 */
export function killAllScrollTriggers(): void {
  ScrollTrigger.getAll().forEach((st) => st.kill())
}

/**
 * reduced-motion 체크
 */
export function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * reduced-motion 시 Lenis 설정
 */
export function getReducedMotionLenisConfig(): LenisConfig {
  return {
    duration: 0,
    smoothWheel: false,
  }
}

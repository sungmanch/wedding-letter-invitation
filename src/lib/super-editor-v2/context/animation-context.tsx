'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import type {
  GlobalAnimation,
  AnimationMood,
  AnimationAction,
  Trigger,
  Interaction,
} from '../schema/types'

// ============================================
// Types
// ============================================

export interface AnimationState {
  // 현재 상태 (state machine)
  currentState: string
  previousState: string | null

  // 활성 애니메이션 ID 목록
  activeAnimations: Set<string>

  // 완료된 애니메이션 ID 목록 (once 트리거용)
  completedAnimations: Set<string>

  // 스크롤 진행률 (0-1)
  scrollProgress: number

  // 현재 보이는 블록 ID 목록
  visibleBlocks: Set<string>

  // 로딩 완료 여부
  isLoaded: boolean
}

export interface AnimationController {
  // 애니메이션 실행
  play: (animationId: string, action: AnimationAction) => Promise<void>

  // 애니메이션 중지
  stop: (animationId: string) => void

  // 모든 애니메이션 중지
  stopAll: () => void

  // 상태 전이
  transitionTo: (newState: string) => void

  // 트리거 발동
  fireTrigger: (trigger: Trigger) => void

  // 애니메이션 완료 처리
  markCompleted: (animationId: string) => void

  // 블록 가시성 업데이트
  setBlockVisible: (blockId: string, visible: boolean) => void

  // 스크롤 진행률 업데이트
  setScrollProgress: (progress: number) => void
}

export interface AnimationContextValue {
  // 전역 애니메이션 설정
  config: GlobalAnimation

  // 현재 상태
  state: AnimationState

  // 컨트롤러
  controller: AnimationController

  // 전역 속도 배율
  speedMultiplier: number

  // 무드에 따른 기본 duration
  getDefaultDuration: (type: 'fast' | 'normal' | 'slow') => number

  // 무드에 따른 기본 easing
  getDefaultEasing: () => string

  // 인터랙션 등록/해제
  registerInteraction: (interaction: Interaction) => void
  unregisterInteraction: (interactionId: string) => void
}

// ============================================
// Context
// ============================================

const AnimationContext = createContext<AnimationContextValue | null>(null)

// ============================================
// Hooks
// ============================================

export function useAnimation(): AnimationContextValue {
  const ctx = useContext(AnimationContext)
  if (!ctx) {
    throw new Error('useAnimation must be used within AnimationProvider')
  }
  return ctx
}

export function useAnimationState(): AnimationState {
  const { state } = useAnimation()
  return state
}

export function useAnimationController(): AnimationController {
  const { controller } = useAnimation()
  return controller
}

/**
 * 현재 상태 머신 상태 가져오기
 */
export function useCurrentState(): string {
  const { state } = useAnimation()
  return state.currentState
}

/**
 * 블록 가시성 체크
 */
export function useBlockVisibility(blockId: string): boolean {
  const { state } = useAnimation()
  return state.visibleBlocks.has(blockId)
}

// ============================================
// Provider
// ============================================

interface AnimationProviderProps {
  children: ReactNode
  config: GlobalAnimation
  initialState?: string
}

// 무드별 duration 배율
const MOOD_DURATION_MULTIPLIER: Record<AnimationMood, number> = {
  minimal: 0.5,
  subtle: 0.8,
  elegant: 1.0,
  playful: 0.7,
  dramatic: 1.3,
  cinematic: 1.5,
}

// 무드별 기본 easing
const MOOD_EASING: Record<AnimationMood, string> = {
  minimal: 'ease-out',
  subtle: 'ease-in-out',
  elegant: 'cubic-bezier(0.4, 0, 0.2, 1)',
  playful: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  dramatic: 'cubic-bezier(0.19, 1, 0.22, 1)',
  cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
}

export function AnimationProvider({
  children,
  config,
  initialState = 'idle',
}: AnimationProviderProps) {
  // 상태
  const [state, setState] = useState<AnimationState>({
    currentState: initialState,
    previousState: null,
    activeAnimations: new Set(),
    completedAnimations: new Set(),
    scrollProgress: 0,
    visibleBlocks: new Set(),
    isLoaded: false,
  })

  // 등록된 인터랙션
  const interactionsRef = useRef<Map<string, Interaction>>(new Map())

  // 로딩 완료 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setState(prev => ({ ...prev, isLoaded: true }))
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // 속도 배율 계산
  const speedMultiplier = (config.speed ?? 1) *
    MOOD_DURATION_MULTIPLIER[config.mood ?? 'elegant']

  // 기본 duration 계산
  const getDefaultDuration = useCallback((type: 'fast' | 'normal' | 'slow') => {
    const base = type === 'fast' ? 200 : type === 'normal' ? 400 : 800
    return base * speedMultiplier
  }, [speedMultiplier])

  // 기본 easing
  const getDefaultEasing = useCallback(() => {
    return MOOD_EASING[config.mood ?? 'elegant']
  }, [config.mood])

  // 컨트롤러
  const controller: AnimationController = {
    play: async (animationId, action) => {
      setState(prev => ({
        ...prev,
        activeAnimations: new Set([...prev.activeAnimations, animationId]),
      }))

      // 실제 애니메이션 실행은 animation-runtime에서 처리
      // 여기서는 상태 관리만

      // TODO: GSAP 통합 후 실제 애니메이션 실행
    },

    stop: (animationId) => {
      setState(prev => {
        const newActive = new Set(prev.activeAnimations)
        newActive.delete(animationId)
        return { ...prev, activeAnimations: newActive }
      })
    },

    stopAll: () => {
      setState(prev => ({
        ...prev,
        activeAnimations: new Set(),
      }))
    },

    transitionTo: (newState) => {
      setState(prev => ({
        ...prev,
        previousState: prev.currentState,
        currentState: newState,
      }))

      // 상태 전이 트리거 발동
      for (const interaction of interactionsRef.current.values()) {
        if (
          interaction.trigger.type === 'state' &&
          interaction.trigger.to === newState
        ) {
          controller.play(interaction.id, interaction.action)
        }
      }
    },

    fireTrigger: (trigger) => {
      for (const interaction of interactionsRef.current.values()) {
        if (matchesTrigger(interaction.trigger, trigger)) {
          controller.play(interaction.id, interaction.action)
        }
      }
    },

    markCompleted: (animationId) => {
      setState(prev => ({
        ...prev,
        activeAnimations: (() => {
          const newActive = new Set(prev.activeAnimations)
          newActive.delete(animationId)
          return newActive
        })(),
        completedAnimations: new Set([...prev.completedAnimations, animationId]),
      }))
    },

    setBlockVisible: (blockId, visible) => {
      setState(prev => {
        const newVisible = new Set(prev.visibleBlocks)
        if (visible) {
          newVisible.add(blockId)
        } else {
          newVisible.delete(blockId)
        }
        return { ...prev, visibleBlocks: newVisible }
      })
    },

    setScrollProgress: (progress) => {
      setState(prev => ({ ...prev, scrollProgress: progress }))
    },
  }

  // 인터랙션 등록
  const registerInteraction = useCallback((interaction: Interaction) => {
    interactionsRef.current.set(interaction.id, interaction)
  }, [])

  // 인터랙션 해제
  const unregisterInteraction = useCallback((interactionId: string) => {
    interactionsRef.current.delete(interactionId)
  }, [])

  const value: AnimationContextValue = {
    config,
    state,
    controller,
    speedMultiplier,
    getDefaultDuration,
    getDefaultEasing,
    registerInteraction,
    unregisterInteraction,
  }

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  )
}

// ============================================
// Utility Functions
// ============================================

/**
 * 두 트리거가 매칭되는지 확인
 */
function matchesTrigger(registered: Trigger, fired: Trigger): boolean {
  if (registered.type !== fired.type) return false

  switch (registered.type) {
    case 'scroll':
      // 스크롤 트리거는 별도 처리 (scroll-manager에서)
      return false

    case 'gesture':
      return (
        registered.gesture === (fired as typeof registered).gesture &&
        registered.target === (fired as typeof registered).target
      )

    case 'event':
      return (
        registered.event === (fired as typeof registered).event &&
        (!registered.target || registered.target === (fired as typeof registered).target)
      )

    case 'state':
      return registered.to === (fired as typeof registered).to

    case 'time':
      // 타임 트리거는 별도 처리
      return false

    default:
      return false
  }
}

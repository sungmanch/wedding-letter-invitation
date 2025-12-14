/**
 * Super Editor v2 - State Machine
 *
 * 애니메이션 상태 머신 구현
 * 복잡한 인터랙션 시퀀스 관리 (예: 갤러리 라이트박스)
 */

import gsap from 'gsap'
import type {
  AnimationAction,
  AnimationProperties,
  Interaction,
  Trigger,
} from '../schema/types'
import { applyAction, convertToGsapVars, type ResolveContext } from './animation-runtime'
import { setupInteraction, emitStateTransition, type TriggerCleanup } from './trigger-handler'

// ============================================
// Types
// ============================================

/**
 * 상태 머신 정의 (JSON 스키마)
 */
export interface AnimationStateMachine {
  id: string
  initial: string

  states: {
    [stateName: string]: {
      properties?: AnimationProperties
      onEnter?: AnimationAction
      onExit?: AnimationAction
      interactions?: Interaction[]
    }
  }

  transitions: {
    from: string | '*' // '*' = 모든 상태에서
    to: string
    trigger: Trigger
    animation?: AnimationAction
    guard?: string // 조건 표현식
  }[]
}

/**
 * 상태 머신 인스턴스
 */
export interface StateMachineInstance {
  readonly id: string
  readonly currentState: string
  readonly previousState: string | null
  transition: (to: string, context?: ResolveContext) => boolean
  canTransition: (to: string) => boolean
  reset: () => void
  destroy: () => void
}

/**
 * 상태 머신 복잡도 제한
 */
export const STATE_MACHINE_CONSTRAINTS = {
  maxStates: 5,
  maxTransitions: 10,
  maxDepth: 3,
  allowCycles: false,
  maxActionsPerState: 3,
} as const

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

// ============================================
// State Machine Factory
// ============================================

/**
 * 상태 머신 인스턴스 생성
 */
export function createStateMachine(
  definition: AnimationStateMachine,
  container: HTMLElement,
  context?: ResolveContext
): StateMachineInstance {
  let currentState = definition.initial
  let previousState: string | null = null
  const cleanups: TriggerCleanup[] = []
  const stateTimelines = new Map<string, gsap.core.Timeline>()

  // 현재 상태의 인터랙션 활성화
  const activateState = (stateName: string, ctx?: ResolveContext) => {
    const state = definition.states[stateName]
    if (!state) {
      console.warn(`State "${stateName}" not found in state machine "${definition.id}"`)
      return
    }

    // 속성 적용
    if (state.properties) {
      gsap.set(container, convertToGsapVars(state.properties))
    }

    // onEnter 실행
    if (state.onEnter) {
      const timeline = gsap.timeline()
      applyAction(timeline, state.onEnter, container, ctx)
      stateTimelines.set(`${stateName}-enter`, timeline)
    }

    // 인터랙션 설정
    state.interactions?.forEach((interaction) => {
      const cleanup = setupInteraction(interaction, {
        container,
        onStateTransition: (to) => instance.transition(to, ctx),
      })
      if (cleanup) cleanups.push(cleanup)
    })

    // 이 상태에서 가능한 전이 트리거 설정
    definition.transitions
      .filter((t) => t.from === stateName || t.from === '*')
      .forEach((transition) => {
        const cleanup = setupInteraction(
          {
            id: `${definition.id}-trans-${transition.from}-${transition.to}`,
            trigger: transition.trigger,
            action: {
              type: 'set',
              target: 'self',
              properties: {},
            },
          },
          {
            container,
            onStateTransition: () => instance.transition(transition.to, ctx),
          }
        )
        if (cleanup) cleanups.push(cleanup)
      })
  }

  // 상태 비활성화
  const deactivateState = (stateName: string, ctx?: ResolveContext) => {
    const state = definition.states[stateName]
    if (!state) return

    // onExit 실행
    if (state.onExit) {
      const timeline = gsap.timeline()
      applyAction(timeline, state.onExit, container, ctx)
      stateTimelines.set(`${stateName}-exit`, timeline)
    }

    // 현재 상태의 모든 인터랙션 정리
    cleanups.forEach((cleanup) => cleanup())
    cleanups.length = 0
  }

  // 인스턴스 정의
  const instance: StateMachineInstance = {
    get id() {
      return definition.id
    },

    get currentState() {
      return currentState
    },

    get previousState() {
      return previousState
    },

    transition(to: string, ctx?: ResolveContext): boolean {
      // 유효한 전이인지 확인
      const transition = definition.transitions.find(
        (t) => (t.from === currentState || t.from === '*') && t.to === to
      )

      if (!transition) {
        console.warn(
          `No valid transition from "${currentState}" to "${to}" in state machine "${definition.id}"`
        )
        return false
      }

      // Guard 조건 체크
      if (transition.guard) {
        // 간단한 표현식 평가 (보안상 eval 대신 제한된 표현식만)
        const guardResult = evaluateGuard(transition.guard, ctx)
        if (!guardResult) {
          return false
        }
      }

      // 이전 상태 비활성화
      deactivateState(currentState, ctx)

      // 전이 애니메이션 실행
      if (transition.animation) {
        const timeline = gsap.timeline()
        applyAction(timeline, transition.animation, container, ctx)
      }

      // 상태 변경
      previousState = currentState
      currentState = to

      // 상태 전이 이벤트 발생
      emitStateTransition(container, to, previousState)

      // 새 상태 활성화
      activateState(to, ctx)

      return true
    },

    canTransition(to: string): boolean {
      return definition.transitions.some(
        (t) => (t.from === currentState || t.from === '*') && t.to === to
      )
    },

    reset() {
      deactivateState(currentState)
      previousState = null
      currentState = definition.initial
      activateState(currentState)
    },

    destroy() {
      // 모든 인터랙션 정리
      cleanups.forEach((cleanup) => cleanup())
      cleanups.length = 0

      // 모든 타임라인 정리
      stateTimelines.forEach((tl) => tl.kill())
      stateTimelines.clear()
    },
  }

  // 초기 상태 활성화
  activateState(currentState, context)

  return instance
}

// ============================================
// Guard Evaluation
// ============================================

/**
 * Guard 조건 평가 (제한된 표현식만 지원)
 */
function evaluateGuard(guard: string, context?: ResolveContext): boolean {
  // 간단한 패턴만 지원
  // 예: "hasPhoto", "!isEmpty", "count > 0"

  if (!context) return true

  // 불리언 플래그
  if (guard.startsWith('!')) {
    const flag = guard.slice(1)
    return !(context as Record<string, unknown>)[flag]
  }

  // 단순 플래그
  if (!guard.includes(' ')) {
    return !!(context as Record<string, unknown>)[guard]
  }

  // 비교 표현식 (예: "count > 0")
  const compareMatch = guard.match(/^(\w+)\s*(>|<|>=|<=|===|!==)\s*(\d+)$/)
  if (compareMatch) {
    const [, key, operator, valueStr] = compareMatch
    const contextValue = (context as Record<string, unknown>)[key]
    const compareValue = parseInt(valueStr, 10)

    if (typeof contextValue !== 'number') return false

    switch (operator) {
      case '>':
        return contextValue > compareValue
      case '<':
        return contextValue < compareValue
      case '>=':
        return contextValue >= compareValue
      case '<=':
        return contextValue <= compareValue
      case '===':
        return contextValue === compareValue
      case '!==':
        return contextValue !== compareValue
    }
  }

  // 지원하지 않는 표현식은 true 반환
  console.warn(`Unsupported guard expression: ${guard}`)
  return true
}

// ============================================
// Validation
// ============================================

/**
 * 상태 머신 복잡도 검증
 */
export function validateStateMachine(
  definition: AnimationStateMachine
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const stateCount = Object.keys(definition.states).length
  const transitionCount = definition.transitions.length

  // 1. 상태 개수 제한
  if (stateCount > STATE_MACHINE_CONSTRAINTS.maxStates) {
    errors.push(
      `상태 개수 초과: ${stateCount}/${STATE_MACHINE_CONSTRAINTS.maxStates}`
    )
  }

  // 2. 전이 개수 제한
  if (transitionCount > STATE_MACHINE_CONSTRAINTS.maxTransitions) {
    errors.push(
      `전이 개수 초과: ${transitionCount}/${STATE_MACHINE_CONSTRAINTS.maxTransitions}`
    )
  }

  // 3. 초기 상태 존재 확인
  if (!definition.states[definition.initial]) {
    errors.push(`초기 상태 "${definition.initial}"이 정의되지 않음`)
  }

  // 4. 전이 대상 상태 존재 확인
  definition.transitions.forEach((transition, index) => {
    if (!definition.states[transition.to]) {
      errors.push(
        `전이 #${index + 1}: 대상 상태 "${transition.to}"이 정의되지 않음`
      )
    }
    if (transition.from !== '*' && !definition.states[transition.from]) {
      errors.push(
        `전이 #${index + 1}: 출발 상태 "${transition.from}"이 정의되지 않음`
      )
    }
  })

  // 5. 상태당 액션 수 제한
  Object.entries(definition.states).forEach(([stateName, state]) => {
    let actionCount = 0
    if (state.onEnter) actionCount++
    if (state.onExit) actionCount++
    if (state.interactions) actionCount += state.interactions.length

    if (actionCount > STATE_MACHINE_CONSTRAINTS.maxActionsPerState) {
      warnings.push(
        `상태 "${stateName}": 액션 수 권장치 초과 (${actionCount}/${STATE_MACHINE_CONSTRAINTS.maxActionsPerState})`
      )
    }
  })

  // 6. 순환 참조 검사
  if (!STATE_MACHINE_CONSTRAINTS.allowCycles) {
    const cycles = detectCycles(definition)
    if (cycles.length > 0) {
      errors.push(
        `순환 참조 감지: ${cycles.map((c) => c.join(' → ')).join(', ')}`
      )
    }
  }

  // 7. 도달 불가능한 상태 검사
  const reachableStates = findReachableStates(definition)
  Object.keys(definition.states).forEach((stateName) => {
    if (!reachableStates.has(stateName) && stateName !== definition.initial) {
      warnings.push(`상태 "${stateName}"에 도달할 수 없음`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * 순환 참조 감지
 */
function detectCycles(definition: AnimationStateMachine): string[][] {
  const cycles: string[][] = []
  const visited = new Set<string>()
  const recursionStack = new Set<string>()
  const path: string[] = []

  function dfs(state: string) {
    visited.add(state)
    recursionStack.add(state)
    path.push(state)

    // 이 상태에서 갈 수 있는 모든 상태
    const nextStates = definition.transitions
      .filter((t) => t.from === state || t.from === '*')
      .map((t) => t.to)

    for (const next of nextStates) {
      if (!visited.has(next)) {
        dfs(next)
      } else if (recursionStack.has(next)) {
        // 순환 발견
        const cycleStart = path.indexOf(next)
        cycles.push([...path.slice(cycleStart), next])
      }
    }

    path.pop()
    recursionStack.delete(state)
  }

  dfs(definition.initial)

  return cycles
}

/**
 * 도달 가능한 상태 찾기
 */
function findReachableStates(definition: AnimationStateMachine): Set<string> {
  const reachable = new Set<string>()
  const queue = [definition.initial]

  while (queue.length > 0) {
    const current = queue.shift()!
    if (reachable.has(current)) continue
    reachable.add(current)

    // 이 상태에서 갈 수 있는 모든 상태
    definition.transitions
      .filter((t) => t.from === current || t.from === '*')
      .forEach((t) => {
        if (!reachable.has(t.to)) {
          queue.push(t.to)
        }
      })
  }

  return reachable
}

// ============================================
// Prebuilt State Machines
// ============================================

/**
 * 갤러리 라이트박스 상태 머신 생성
 */
export function createGalleryLightboxMachine(
  containerId: string
): AnimationStateMachine {
  return {
    id: `${containerId}-lightbox`,
    initial: 'grid',

    states: {
      grid: {
        properties: { opacity: 1 },
      },
      expanded: {
        onEnter: {
          type: 'sequence',
          steps: [
            {
              type: 'tween',
              target: '$triggeredElement',
              to: { rotate: -3 },
              duration: 50,
            },
            {
              type: 'tween',
              target: '$triggeredElement',
              to: { rotate: 3 },
              duration: 50,
            },
            {
              type: 'spring',
              target: '$triggeredElement',
              to: { scale: 2.5, rotate: 0 },
              stiffness: 200,
              damping: 20,
            },
          ],
        },
        onExit: {
          type: 'spring',
          target: '$triggeredElement',
          to: { scale: 1, x: 0, y: 0 },
          stiffness: 200,
          damping: 20,
        },
      },
    },

    transitions: [
      {
        from: 'grid',
        to: 'expanded',
        trigger: {
          type: 'gesture',
          gesture: 'tap',
          target: 'photo-*',
        },
      },
      {
        from: 'expanded',
        to: 'grid',
        trigger: {
          type: 'gesture',
          gesture: 'tap',
          target: 'overlay',
        },
      },
      {
        from: 'expanded',
        to: 'grid',
        trigger: {
          type: 'event',
          event: 'keydown',
          target: 'document',
        },
        guard: 'isEscapeKey',
      },
    ],
  }
}

/**
 * 메뉴 토글 상태 머신 생성
 */
export function createMenuToggleMachine(
  containerId: string
): AnimationStateMachine {
  return {
    id: `${containerId}-menu`,
    initial: 'closed',

    states: {
      closed: {
        properties: { height: 0, opacity: 0 },
      },
      open: {
        onEnter: {
          type: 'tween',
          target: 'self',
          from: { height: 0, opacity: 0 },
          to: { height: 'auto', opacity: 1 },
          duration: 300,
          easing: 'ease-out',
        },
        onExit: {
          type: 'tween',
          target: 'self',
          to: { height: 0, opacity: 0 },
          duration: 200,
          easing: 'ease-in',
        },
      },
    },

    transitions: [
      {
        from: 'closed',
        to: 'open',
        trigger: {
          type: 'gesture',
          gesture: 'tap',
          target: 'menu-toggle',
        },
      },
      {
        from: 'open',
        to: 'closed',
        trigger: {
          type: 'gesture',
          gesture: 'tap',
          target: 'menu-toggle',
        },
      },
      {
        from: 'open',
        to: 'closed',
        trigger: {
          type: 'event',
          event: 'click',
          target: 'document',
        },
      },
    ],
  }
}

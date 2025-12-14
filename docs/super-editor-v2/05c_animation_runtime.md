# Super Editor v2 - 애니메이션 런타임

> **목표**: GSAP + Lenis 기반 애니메이션 실행 및 상태 머신 관리
> **핵심 원칙**: 선언적 액션 → GSAP Timeline 변환, 스무스 스크롤 통합

---

## 0. Lenis + GSAP 통합

### 0.1 전역 초기화

```typescript
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface LenisConfig {
  duration?: number           // 스크롤 지속시간 (기본: 1.2)
  easing?: (t: number) => number
  orientation?: 'vertical' | 'horizontal'
  gestureOrientation?: 'vertical' | 'horizontal' | 'both'
  smoothWheel?: boolean
  wheelMultiplier?: number
  touchMultiplier?: number
  infinite?: boolean
}

let lenisInstance: Lenis | null = null

function initLenis(config: LenisConfig = {}): Lenis {
  if (lenisInstance) return lenisInstance

  lenisInstance = new Lenis({
    duration: config.duration ?? 1.2,
    easing: config.easing ?? ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
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

function destroyLenis(): void {
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
}

function getLenis(): Lenis | null {
  return lenisInstance
}
```

### 0.2 React Provider

```typescript
interface AnimationProviderProps {
  children: React.ReactNode
  lenisConfig?: LenisConfig
  disabled?: boolean  // 에디터 모드에서 비활성화
}

const AnimationContext = createContext<{
  lenis: Lenis | null
  timelines: Map<string, gsap.core.Timeline>
  stateMachines: Map<string, StateMachineInstance>
  registerTimeline: (id: string, tl: gsap.core.Timeline) => void
  registerStateMachine: (id: string, sm: StateMachineInstance) => void
  scrollTo: (target: string | number | HTMLElement, options?: ScrollToOptions) => void
} | null>(null)

function AnimationProvider({
  children,
  lenisConfig,
  disabled = false
}: AnimationProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const timelinesRef = useRef(new Map<string, gsap.core.Timeline>())
  const stateMachinesRef = useRef(new Map<string, StateMachineInstance>())

  useEffect(() => {
    if (disabled) return

    const instance = initLenis(lenisConfig)
    setLenis(instance)

    return () => {
      // 모든 타임라인 정리
      timelinesRef.current.forEach(tl => tl.kill())
      timelinesRef.current.clear()

      // 모든 상태 머신 정리
      stateMachinesRef.current.forEach(sm => sm.destroy())
      stateMachinesRef.current.clear()

      // ScrollTrigger 정리
      ScrollTrigger.getAll().forEach(st => st.kill())

      destroyLenis()
    }
  }, [disabled, lenisConfig])

  const scrollTo = useCallback((
    target: string | number | HTMLElement,
    options?: { offset?: number; duration?: number; easing?: (t: number) => number }
  ) => {
    lenis?.scrollTo(target, options)
  }, [lenis])

  const registerTimeline = useCallback((id: string, tl: gsap.core.Timeline) => {
    timelinesRef.current.get(id)?.kill()
    timelinesRef.current.set(id, tl)
  }, [])

  const registerStateMachine = useCallback((id: string, sm: StateMachineInstance) => {
    stateMachinesRef.current.get(id)?.destroy()
    stateMachinesRef.current.set(id, sm)
  }, [])

  return (
    <AnimationContext.Provider value={{
      lenis,
      timelines: timelinesRef.current,
      stateMachines: stateMachinesRef.current,
      registerTimeline,
      registerStateMachine,
      scrollTo,
    }}>
      {children}
    </AnimationContext.Provider>
  )
}

function useAnimation() {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider')
  }
  return context
}
```

### 0.3 문서 레벨 설정 (AI용)

```typescript
interface DocumentAnimationConfig {
  lenis?: {
    enabled: boolean
    duration?: number
    easing?: 'smooth' | 'snappy' | 'cinematic'  // 프리셋
  }
  mood?: 'minimal' | 'elegant' | 'playful' | 'cinematic' | 'dramatic'
  speed?: 'slow' | 'normal' | 'fast'
  reducedMotion?: boolean  // prefers-reduced-motion 자동 감지
}

const LENIS_EASING_PRESETS = {
  smooth: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  snappy: (t: number) => 1 - Math.pow(1 - t, 3),
  cinematic: (t: number) => t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2,
}
```

---

## 1. BlockAnimationController

```typescript
interface BlockAnimationControllerProps {
  blockId: string
  animation: BlockAnimationConfig
  blockRef: RefObject<HTMLDivElement>
}

function BlockAnimationController({
  blockId,
  animation,
  blockRef,
}: BlockAnimationControllerProps) {
  const { registerTimeline, registerStateMachine } = useAnimation()

  // Entrance 애니메이션
  useEffect(() => {
    if (!animation.entrance || !blockRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: blockRef.current,
        start: 'top 80%',
        once: true,
      },
    })

    const entranceAction = resolvePreset(animation.entrance) || animation.entrance
    applyAction(tl, entranceAction, blockRef.current)

    registerTimeline(`${blockId}-entrance`, tl)

    return () => {
      tl.kill()
    }
  }, [animation.entrance, blockId, blockRef, registerTimeline])

  // 스크롤 연동 애니메이션
  useEffect(() => {
    if (!animation.scroll || !blockRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: blockRef.current,
        start: animation.scroll.start || 'top bottom',
        end: animation.scroll.end || 'bottom top',
        scrub: animation.scroll.scrub ?? true,
      },
    })

    applyAction(tl, animation.scroll.action, blockRef.current)

    registerTimeline(`${blockId}-scroll`, tl)

    return () => {
      tl.kill()
    }
  }, [animation.scroll, blockId, blockRef, registerTimeline])

  // 인터랙션
  useEffect(() => {
    if (!animation.interactions) return

    const cleanups = animation.interactions.map(interaction => {
      return setupInteraction(interaction, blockRef.current!)
    })

    return () => {
      cleanups.forEach(cleanup => cleanup?.())
    }
  }, [animation.interactions, blockRef])

  // 상태 머신
  useEffect(() => {
    if (!animation.stateMachine || !blockRef.current) return

    const sm = createStateMachineInstance(
      animation.stateMachine,
      blockRef.current
    )

    registerStateMachine(`${blockId}-sm`, sm)

    return () => {
      sm.destroy()
    }
  }, [animation.stateMachine, blockId, blockRef, registerStateMachine])

  return null
}
```

---

## 2. 액션 실행기

```typescript
/**
 * AnimationAction을 GSAP Timeline에 적용
 */
function applyAction(
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
      action.steps.forEach(step => {
        applyAction(timeline, step, defaultTarget, context)
      })
      break

    case 'timeline':
      action.tracks.forEach(track => {
        const position = resolveTimelinePosition(track.at)
        applyAction(timeline, track.action, defaultTarget, context)
        // GSAP position parameter
      })
      break

    case 'spring':
      applySpringAction(timeline, action, defaultTarget, context)
      break

    case 'path':
      applyPathAction(timeline, action, defaultTarget)
      break

    case 'morph':
      applyMorphAction(timeline, action, defaultTarget)
      break

    case 'stagger':
      applyStaggerAction(timeline, action, defaultTarget, context)
      break

    case 'set':
      applySetAction(timeline, action, defaultTarget)
      break
  }
}

function applyTweenAction(
  timeline: gsap.core.Timeline,
  action: TweenAction,
  defaultTarget: HTMLElement,
  context?: ResolveContext
): void {
  const targets = resolveTargets(action.target, defaultTarget, context)

  const fromVars = action.from ? convertToGsapVars(action.from) : undefined
  const toVars = {
    ...convertToGsapVars(action.to),
    duration: action.duration / 1000,
    ease: action.easing || 'power2.out',
    delay: (action.delay || 0) / 1000,
  }

  if (fromVars) {
    timeline.fromTo(targets, fromVars, toVars)
  } else {
    timeline.to(targets, toVars)
  }
}

function applySpringAction(
  timeline: gsap.core.Timeline,
  action: SpringAction,
  defaultTarget: HTMLElement,
  context?: ResolveContext
): void {
  const target = resolveTargets(action.target, defaultTarget, context)

  // GSAP physics plugin 또는 커스텀 spring 구현
  timeline.to(target, {
    ...convertToGsapVars(action.to),
    ease: `elastic.out(${action.stiffness || 100}, ${action.damping || 10})`,
    duration: 0.8,
  })
}

function applyPathAction(
  timeline: gsap.core.Timeline,
  action: PathAction,
  defaultTarget: HTMLElement
): void {
  const target = document.querySelector(`[data-element-id="${action.target}"]`) || defaultTarget

  timeline.to(target, {
    motionPath: {
      path: action.path,
      align: action.path,
      alignOrigin: [0.5, 0.5],
      autoRotate: action.align,
      start: action.start || 0,
      end: action.end || 1,
    },
    duration: action.duration / 1000,
    ease: action.easing || 'none',
  })
}

function applyMorphAction(
  timeline: gsap.core.Timeline,
  action: MorphAction,
  defaultTarget: HTMLElement
): void {
  const target = document.querySelector(`[data-element-id="${action.target}"] path`) || defaultTarget

  timeline.to(target, {
    morphSVG: action.toPath,
    duration: action.duration / 1000,
    ease: action.easing || 'power2.inOut',
  })
}

function applyStaggerAction(
  timeline: gsap.core.Timeline,
  action: StaggerAction,
  defaultTarget: HTMLElement,
  context?: ResolveContext
): void {
  const targets = resolveTargets(action.targets, defaultTarget, context)

  const staggerConfig = typeof action.stagger === 'number'
    ? action.stagger / 1000
    : {
        each: (action.stagger.each || 100) / 1000,
        from: action.stagger.from || 'start',
        grid: action.stagger.grid,
        axis: action.stagger.axis,
      }

  timeline.to(targets, {
    ...convertToGsapVars(action.action.to),
    duration: (action.action.duration || 400) / 1000,
    stagger: staggerConfig,
  })
}

function applySetAction(
  timeline: gsap.core.Timeline,
  action: SetAction,
  defaultTarget: HTMLElement
): void {
  const targets = resolveTargets(action.target, defaultTarget)
  timeline.set(targets, convertToGsapVars(action.properties))
}
```

---

## 3. AnimationProperties → GSAP 변환

```typescript
function convertToGsapVars(props: AnimationProperties): gsap.TweenVars {
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

  // Opacity
  if (props.opacity !== undefined) vars.opacity = props.opacity
  if (props.visibility !== undefined) vars.visibility = props.visibility

  // Filter
  if (props.blur !== undefined) vars.filter = `blur(${props.blur}px)`
  if (props.brightness !== undefined) {
    vars.filter = (vars.filter || '') + ` brightness(${props.brightness})`
  }
  if (props.grayscale !== undefined) {
    vars.filter = (vars.filter || '') + ` grayscale(${props.grayscale})`
  }

  // Clip
  if (props.clipPath !== undefined) vars.clipPath = props.clipPath

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

  // CSS Variables
  Object.keys(props).forEach(key => {
    if (key.startsWith('--')) {
      vars[key] = props[key as keyof AnimationProperties]
    }
  })

  return vars
}
```

---

## 4. 타겟 리졸버

```typescript
function resolveTargets(
  target: string | string[],
  defaultTarget: HTMLElement,
  context?: ResolveContext
): HTMLElement | HTMLElement[] | NodeList {
  // 배열 처리
  if (Array.isArray(target)) {
    return target.flatMap(t => resolveTargets(t, defaultTarget, context)) as HTMLElement[]
  }

  // 동적 변수
  if (target.startsWith('$')) {
    const resolved = resolveDynamicVariable(target, context)
    if (resolved) {
      return document.querySelector(`[data-element-id="${resolved}"]`) as HTMLElement
    }
    return defaultTarget
  }

  // 와일드카드 (photo-*)
  if (target.includes('*')) {
    const selector = `[data-element-id^="${target.replace('*', '')}"]`
    return document.querySelectorAll(selector)
  }

  // 일반 ID
  const element = document.querySelector(`[data-element-id="${target}"]`)
  return (element as HTMLElement) || defaultTarget
}
```

---

## 5. 인터랙션 설정

```typescript
function setupInteraction(
  interaction: Interaction,
  container: HTMLElement
): (() => void) | undefined {
  if (interaction.enabled === false) return undefined

  const { trigger, action, condition } = interaction

  // 조건 체크
  if (condition) {
    if (condition.media && !window.matchMedia(condition.media).matches) {
      return undefined
    }
    // state, expression 체크는 런타임에
  }

  switch (trigger.type) {
    case 'scroll':
      return setupScrollTrigger(trigger, action, container)

    case 'gesture':
      return setupGestureTrigger(trigger, action, container)

    case 'event':
      return setupEventTrigger(trigger, action, container)

    case 'time':
      return setupTimeTrigger(trigger, action)

    default:
      return undefined
  }
}

function setupScrollTrigger(
  trigger: ScrollTrigger,
  action: AnimationAction,
  container: HTMLElement
): () => void {
  const target = trigger.target
    ? document.querySelector(`[data-block-id="${trigger.target}"]`) || container
    : container

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: target,
      start: trigger.start,
      end: trigger.end,
      scrub: trigger.scrub,
      once: trigger.once,
      onEnter: trigger.enter ? () => applyAction(gsap.timeline(), action, container as HTMLElement) : undefined,
      onLeave: trigger.leave ? () => {} : undefined,
    },
  })

  if (trigger.scrub) {
    applyAction(tl, action, container as HTMLElement)
  }

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
  }
}

function setupGestureTrigger(
  trigger: GestureTrigger,
  action: AnimationAction,
  container: HTMLElement
): () => void {
  const targets = trigger.target.includes('*')
    ? container.querySelectorAll(`[data-element-id^="${trigger.target.replace('*', '')}"]`)
    : [container.querySelector(`[data-element-id="${trigger.target}"]`) || container]

  const handlers: Array<{ element: Element; type: string; handler: EventListener }> = []

  targets.forEach(target => {
    if (!target) return

    let handler: EventListener
    let eventType: string

    switch (trigger.gesture) {
      case 'tap':
        eventType = 'click'
        handler = () => {
          applyAction(gsap.timeline(), action, target as HTMLElement, {
            triggeredElement: (target as HTMLElement).dataset.elementId,
          })
        }
        break

      case 'hover':
        eventType = 'mouseenter'
        handler = () => {
          applyAction(gsap.timeline(), action, target as HTMLElement)
        }
        break

      // swipe, pinch, drag는 별도 제스처 라이브러리 필요
      default:
        return
    }

    target.addEventListener(eventType, handler)
    handlers.push({ element: target, type: eventType, handler })
  })

  return () => {
    handlers.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler)
    })
  }
}

function setupEventTrigger(
  trigger: EventTrigger,
  action: AnimationAction,
  container: HTMLElement
): () => void {
  const target = trigger.target
    ? document.querySelector(`[data-element-id="${trigger.target}"]`) || document
    : document

  const handler = (e: Event) => {
    applyAction(gsap.timeline(), action, container, {
      triggeredElement: (e.target as HTMLElement)?.dataset?.elementId,
    })
  }

  target.addEventListener(trigger.event, handler)

  return () => {
    target.removeEventListener(trigger.event, handler)
  }
}

function setupTimeTrigger(
  trigger: TimeTrigger,
  action: AnimationAction
): () => void {
  const timeouts: number[] = []
  const intervals: number[] = []

  const execute = () => {
    applyAction(gsap.timeline(), action, document.body)
  }

  if (trigger.repeat && trigger.repeat !== 1) {
    const intervalId = window.setInterval(
      execute,
      trigger.interval || trigger.delay
    )
    intervals.push(intervalId)

    if (trigger.repeat > 0) {
      let count = 0
      const checkInterval = window.setInterval(() => {
        count++
        if (count >= trigger.repeat!) {
          window.clearInterval(intervalId)
          window.clearInterval(checkInterval)
        }
      }, trigger.interval || trigger.delay)
      intervals.push(checkInterval)
    }
  } else {
    const timeoutId = window.setTimeout(execute, trigger.delay)
    timeouts.push(timeoutId)
  }

  return () => {
    timeouts.forEach(clearTimeout)
    intervals.forEach(clearInterval)
  }
}
```

---

## 6. 상태 머신 인스턴스

```typescript
interface StateMachineInstance {
  currentState: string
  transition: (to: string) => void
  destroy: () => void
}

function createStateMachineInstance(
  definition: AnimationStateMachine,
  container: HTMLElement
): StateMachineInstance {
  let currentState = definition.initial
  const cleanups: Array<() => void> = []

  // 현재 상태의 인터랙션 활성화
  const activateState = (stateName: string) => {
    const state = definition.states[stateName]
    if (!state) return

    // onEnter 실행
    if (state.onEnter) {
      applyAction(gsap.timeline(), state.onEnter, container)
    }

    // 속성 적용
    if (state.properties) {
      gsap.set(container, convertToGsapVars(state.properties))
    }

    // 인터랙션 설정
    state.interactions?.forEach(interaction => {
      const cleanup = setupInteraction(interaction, container)
      if (cleanup) cleanups.push(cleanup)
    })
  }

  // 전이 트리거 설정
  definition.transitions.forEach(trans => {
    if (trans.from !== '*' && trans.from !== currentState) return

    const triggerCleanup = setupInteraction(
      {
        id: `trans-${trans.from}-${trans.to}`,
        trigger: trans.trigger,
        action: {
          type: 'set',
          target: container.dataset.elementId || 'self',
          properties: {},
        },
      },
      container
    )

    // 실제 전이는 커스텀 이벤트로 처리
    // (setupInteraction 확장 필요)
  })

  // 초기 상태 활성화
  activateState(currentState)

  return {
    get currentState() {
      return currentState
    },
    transition(to: string) {
      const transition = definition.transitions.find(
        t => (t.from === currentState || t.from === '*') && t.to === to
      )

      if (!transition) {
        console.warn(`No transition from ${currentState} to ${to}`)
        return
      }

      // onExit
      const oldState = definition.states[currentState]
      if (oldState?.onExit) {
        applyAction(gsap.timeline(), oldState.onExit, container)
      }

      // 전이 애니메이션
      if (transition.animation) {
        applyAction(gsap.timeline(), transition.animation, container)
      }

      // 상태 변경
      currentState = to

      // 새 상태 활성화
      activateState(to)
    },
    destroy() {
      cleanups.forEach(cleanup => cleanup())
    },
  }
}
```

---

## 7. Pin + 수평 스크롤 시스템

갤러리, 타임라인 등 수평 스크롤이 필요한 섹션을 위한 시스템.

### 7.1 HorizontalScrollAction 타입

```typescript
interface HorizontalScrollAction {
  type: 'horizontal-scroll'
  container: string           // 고정될 컨테이너 ID
  track: string               // 수평 이동할 트랙 ID
  items?: string[]            // 개별 아이템 ID (스태거 효과용)

  // Pin 설정
  pin: {
    enabled: boolean
    spacing?: boolean         // pin 종료 후 여백 유지
    anticipatePin?: number    // 1 = pin 시작 전 준비
  }

  // 스크롤 거리 계산
  scrollDistance?: number | 'auto' | string  // 'auto' = 트랙 너비 - 컨테이너 너비

  // 아이템 애니메이션
  itemAnimation?: {
    entrance?: AnimationAction    // 아이템 진입 애니메이션
    stagger?: number              // ms 단위
    from?: 'left' | 'right'
  }

  // 스크롤 연동
  scrub?: boolean | number        // true = 1:1, 숫자 = 지연
  snap?: boolean | number | {     // 스냅 포인트
    snapTo: number[] | 'items'
    duration?: { min: number, max: number }
    ease?: string
  }

  // 스크롤 방향 힌트 (모바일)
  showScrollHint?: boolean
  scrollHintDuration?: number
}
```

### 7.2 수평 스크롤 컨트롤러

```typescript
interface HorizontalScrollControllerProps {
  blockId: string
  config: HorizontalScrollAction
  containerRef: RefObject<HTMLDivElement>
}

function HorizontalScrollController({
  blockId,
  config,
  containerRef,
}: HorizontalScrollControllerProps) {
  const { registerTimeline, lenis } = useAnimation()

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const track = container.querySelector(`[data-element-id="${config.track}"]`) as HTMLElement

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
        // '200vw', '300%' 등 처리
        return parseScrollDistance(config.scrollDistance, container)
      }
      return config.scrollDistance || track.scrollWidth - container.offsetWidth
    }

    // Lenis 일시 정지 (pin 영역에서)
    let lenisWasPaused = false

    const tl = gsap.timeline({
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
          // Pin 영역 진입 시 Lenis 터치 제스처 방향 전환
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
    tl.to(track, {
      x: () => -(getScrollDistance()),
      ease: 'none',
    })

    // 아이템별 스태거 애니메이션
    if (config.items && config.itemAnimation) {
      const items = config.items.map(id =>
        container.querySelector(`[data-element-id="${id}"]`)
      ).filter(Boolean)

      if (config.itemAnimation.entrance) {
        const entranceAction = config.itemAnimation.entrance
        const stagger = (config.itemAnimation.stagger || 100) / 1000

        // 각 아이템이 뷰포트에 들어올 때 애니메이션
        items.forEach((item, index) => {
          const itemTl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              containerAnimation: tl,
              start: 'left 80%',
              end: 'left 20%',
              scrub: true,
            },
          })

          applyAction(itemTl, entranceAction, item as HTMLElement)
        })
      }
    }

    registerTimeline(`${blockId}-horizontal`, tl)

    // 스크롤 힌트 애니메이션
    if (config.showScrollHint) {
      showScrollHint(container, config.scrollHintDuration || 3000)
    }

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [blockId, config, containerRef, lenis, registerTimeline])

  return null
}

function resolveSnapConfig(
  snap: HorizontalScrollAction['snap'],
  items?: string[]
): gsap.plugins.ScrollTriggerConfigVars['snap'] {
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
    return snap as gsap.plugins.ScrollTriggerConfigVars['snap']
  }
  return undefined
}

function showScrollHint(container: HTMLElement, duration: number) {
  const hint = document.createElement('div')
  hint.className = 'scroll-hint'
  hint.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  `
  container.appendChild(hint)

  gsap.fromTo(hint,
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
          onComplete: () => hint.remove()
        })
      }
    }
  )
}
```

### 7.3 갤러리 블록 컴포넌트

```typescript
interface GalleryBlockConfig {
  type: 'gallery'
  layout: 'horizontal-scroll' | 'grid' | 'masonry' | 'carousel'

  // 수평 스크롤 전용
  horizontalScroll?: HorizontalScrollAction

  // 공통
  items: Array<{
    id: string
    src: string
    alt?: string
    caption?: string
  }>

  // 스타일
  itemSize?: {
    width: number | string
    height: number | string
    aspectRatio?: string
  }
  gap?: number

  // 인터랙션
  onItemClick?: 'lightbox' | 'expand' | 'none'
  hoverEffect?: 'zoom' | 'lift' | 'glow' | 'none'
}

function GalleryBlock({ block }: { block: Block<GalleryBlockConfig> }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { content } = block

  if (content.layout !== 'horizontal-scroll') {
    return <StandardGallery block={block} />
  }

  return (
    <div
      ref={containerRef}
      data-block-id={block.id}
      className="gallery-container"
      style={{
        overflow: 'hidden',
        width: '100%',
        height: content.itemSize?.height || '100vh',
      }}
    >
      {/* 수평 트랙 */}
      <div
        data-element-id={content.horizontalScroll?.track || 'gallery-track'}
        className="gallery-track"
        style={{
          display: 'flex',
          gap: content.gap || 16,
          height: '100%',
          width: 'fit-content',
        }}
      >
        {content.items.map((item, index) => (
          <div
            key={item.id}
            data-element-id={item.id}
            className="gallery-item"
            style={{
              width: content.itemSize?.width || '80vw',
              height: '100%',
              flexShrink: 0,
            }}
          >
            <img
              src={item.src}
              alt={item.alt || ''}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {item.caption && (
              <div className="gallery-caption">{item.caption}</div>
            )}
          </div>
        ))}
      </div>

      {/* 수평 스크롤 컨트롤러 */}
      {content.horizontalScroll && (
        <HorizontalScrollController
          blockId={block.id}
          config={content.horizontalScroll}
          containerRef={containerRef}
        />
      )}
    </div>
  )
}
```

### 7.4 AI용 갤러리 프리셋

```typescript
const GALLERY_PRESETS = {
  'cinematic-horizontal': {
    id: 'cinematic-horizontal',
    name: '시네마틱 수평 갤러리',
    meta: {
      mood: ['cinematic', 'dramatic', 'elegant'],
      keywords: { ko: ['영화', '수평', '갤러리'], en: ['cinematic', 'horizontal', 'gallery'] },
      description: '화면 전체를 사용한 시네마틱 수평 스크롤 갤러리',
    },
    config: {
      layout: 'horizontal-scroll',
      horizontalScroll: {
        type: 'horizontal-scroll',
        container: 'gallery-container',
        track: 'gallery-track',
        pin: { enabled: true, spacing: true, anticipatePin: 1 },
        scrollDistance: 'auto',
        scrub: 1,
        snap: { snapTo: 'items', duration: { min: 0.2, max: 0.5 } },
        itemAnimation: {
          entrance: {
            type: 'tween',
            from: { opacity: 0.3, scale: 0.9, blur: 5 },
            to: { opacity: 1, scale: 1, blur: 0 },
            duration: 800,
          },
          stagger: 100,
        },
        showScrollHint: true,
      },
      itemSize: { width: '85vw', height: '100vh', aspectRatio: '16/9' },
      gap: 32,
      hoverEffect: 'none',  // 스크롤 중에는 hover 비활성화
    } as GalleryBlockConfig,
  },

  'polaroid-scroll': {
    id: 'polaroid-scroll',
    name: '폴라로이드 슬라이드',
    meta: {
      mood: ['playful', 'romantic', 'casual'],
      keywords: { ko: ['폴라로이드', '사진', '추억'], en: ['polaroid', 'photo', 'memory'] },
      description: '폴라로이드 스타일 사진들이 회전하며 나타나는 갤러리',
    },
    config: {
      layout: 'horizontal-scroll',
      horizontalScroll: {
        type: 'horizontal-scroll',
        container: 'gallery-container',
        track: 'gallery-track',
        pin: { enabled: true, spacing: true },
        scrollDistance: 'auto',
        scrub: 0.5,
        snap: { snapTo: 'items', duration: { min: 0.1, max: 0.3 } },
        itemAnimation: {
          entrance: {
            type: 'timeline',
            tracks: [
              {
                at: 0,
                action: {
                  type: 'tween',
                  from: { opacity: 0, y: 50, rotate: -15 },
                  to: { opacity: 1, y: 0, rotate: 0 },
                  duration: 600,
                  easing: 'back.out(1.7)',
                },
              },
              {
                at: 200,
                action: {
                  type: 'spring',
                  to: { scale: 1 },
                  stiffness: 200,
                  damping: 15,
                },
              },
            ],
          },
          stagger: 150,
          from: 'left',
        },
      },
      itemSize: { width: '300px', height: '380px' },
      gap: 24,
      hoverEffect: 'lift',
    } as GalleryBlockConfig,
  },

  'magazine-spread': {
    id: 'magazine-spread',
    name: '매거진 스프레드',
    meta: {
      mood: ['elegant', 'minimal', 'sophisticated'],
      keywords: { ko: ['매거진', '화보', '편집'], en: ['magazine', 'editorial', 'spread'] },
      description: '잡지 화보처럼 크고 작은 사진이 교차하는 갤러리',
    },
    config: {
      layout: 'horizontal-scroll',
      horizontalScroll: {
        type: 'horizontal-scroll',
        container: 'gallery-container',
        track: 'gallery-track',
        pin: { enabled: true, spacing: true },
        scrollDistance: 'auto',
        scrub: true,
        snap: false,  // 자유 스크롤
        itemAnimation: {
          entrance: {
            type: 'tween',
            from: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
            to: { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
            duration: 1000,
            easing: 'power3.out',
          },
          stagger: 200,
        },
      },
      // 아이템 사이즈는 개별 지정 (AI가 동적으로 설정)
      gap: 48,
      hoverEffect: 'zoom',
    } as GalleryBlockConfig,
  },
}
```

### 7.5 선언적 JSON 예시 (AI 생성용)

```json
{
  "id": "block-gallery",
  "type": "gallery",
  "content": {
    "layout": "horizontal-scroll",
    "horizontalScroll": {
      "type": "horizontal-scroll",
      "container": "gallery-container",
      "track": "gallery-track",
      "items": ["photo-1", "photo-2", "photo-3", "photo-4", "photo-5"],
      "pin": {
        "enabled": true,
        "spacing": true,
        "anticipatePin": 1
      },
      "scrollDistance": "auto",
      "scrub": 1,
      "snap": {
        "snapTo": "items",
        "duration": { "min": 0.2, "max": 0.5 },
        "ease": "power1.inOut"
      },
      "itemAnimation": {
        "entrance": {
          "type": "tween",
          "from": { "opacity": 0, "scale": 0.8, "y": 30 },
          "to": { "opacity": 1, "scale": 1, "y": 0 },
          "duration": 600,
          "easing": "power2.out"
        },
        "stagger": 100
      },
      "showScrollHint": true,
      "scrollHintDuration": 3000
    },
    "items": [
      { "id": "photo-1", "src": "{{photos.0}}", "caption": "우리의 시작" },
      { "id": "photo-2", "src": "{{photos.1}}", "caption": "첫 여행" },
      { "id": "photo-3", "src": "{{photos.2}}", "caption": "프로포즈" },
      { "id": "photo-4", "src": "{{photos.3}}", "caption": "약혼" },
      { "id": "photo-5", "src": "{{photos.4}}", "caption": "결혼" }
    ],
    "itemSize": {
      "width": "80vw",
      "height": "100vh"
    },
    "gap": 40
  },
  "animation": {
    "entrance": "fade-in"
  }
}
```

---

## 8. Parallax + Depth 시스템

### 8.1 ParallaxAction

```typescript
interface ParallaxAction {
  type: 'parallax'
  layers: Array<{
    target: string
    speed: number           // 1 = 기본, 0.5 = 느리게, 2 = 빠르게
    direction?: 'vertical' | 'horizontal' | 'both'
    offset?: { x?: number, y?: number }
    scale?: { from?: number, to?: number }
    opacity?: { from?: number, to?: number }
    rotate?: { from?: number, to?: number }
  }>

  // 스크롤 범위
  trigger?: string          // 기본: 부모 블록
  start?: string            // 'top bottom'
  end?: string              // 'bottom top'
}

function applyParallaxAction(
  action: ParallaxAction,
  defaultTarget: HTMLElement
): () => void {
  const cleanups: Array<() => void> = []

  const trigger = action.trigger
    ? document.querySelector(`[data-block-id="${action.trigger}"]`) || defaultTarget
    : defaultTarget

  action.layers.forEach(layer => {
    const target = document.querySelector(`[data-element-id="${layer.target}"]`)
    if (!target) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: action.start || 'top bottom',
        end: action.end || 'bottom top',
        scrub: true,
      },
    })

    const movement = {
      y: layer.direction !== 'horizontal'
        ? `${(1 - layer.speed) * 100}%`
        : 0,
      x: layer.direction !== 'vertical'
        ? `${(1 - layer.speed) * 100}%`
        : 0,
    }

    if (layer.offset) {
      movement.y = `+=${layer.offset.y || 0}`
      movement.x = `+=${layer.offset.x || 0}`
    }

    const vars: gsap.TweenVars = { ...movement }

    if (layer.scale) {
      vars.scale = layer.scale.to
      gsap.set(target, { scale: layer.scale.from || 1 })
    }

    if (layer.opacity) {
      vars.opacity = layer.opacity.to
      gsap.set(target, { opacity: layer.opacity.from || 1 })
    }

    if (layer.rotate) {
      vars.rotation = layer.rotate.to
      gsap.set(target, { rotation: layer.rotate.from || 0 })
    }

    tl.to(target, vars)

    cleanups.push(() => {
      tl.scrollTrigger?.kill()
      tl.kill()
    })
  })

  return () => cleanups.forEach(fn => fn())
}
```

### 8.2 Depth 프리셋 (AI용)

```typescript
const PARALLAX_PRESETS = {
  'gentle-depth': {
    id: 'gentle-depth',
    name: '은은한 깊이감',
    meta: { mood: ['elegant', 'minimal'], intensity: 'subtle' },
    action: {
      type: 'parallax',
      layers: [
        { target: 'background', speed: 0.3 },
        { target: 'midground', speed: 0.6 },
        { target: 'foreground', speed: 1 },
      ],
    },
  },

  'dramatic-depth': {
    id: 'dramatic-depth',
    name: '드라마틱 깊이감',
    meta: { mood: ['cinematic', 'dramatic'], intensity: 'dramatic' },
    action: {
      type: 'parallax',
      layers: [
        { target: 'background', speed: 0.2, scale: { from: 1.1, to: 1 } },
        { target: 'midground', speed: 0.5, opacity: { from: 0.7, to: 1 } },
        { target: 'foreground', speed: 1.2 },
        { target: 'floating-elements', speed: 1.5, rotate: { from: -5, to: 5 } },
      ],
    },
  },

  'horizontal-drift': {
    id: 'horizontal-drift',
    name: '수평 드리프트',
    meta: { mood: ['playful', 'dynamic'], intensity: 'medium' },
    action: {
      type: 'parallax',
      layers: [
        { target: 'bg-left', speed: 0.5, direction: 'horizontal' },
        { target: 'bg-right', speed: 0.3, direction: 'horizontal' },
        { target: 'content', speed: 1, direction: 'vertical' },
      ],
    },
  },
}
```

---

## 9. 모바일 최적화

### 9.1 터치 제스처 + Lenis 통합

```typescript
interface TouchConfig {
  swipeThreshold?: number    // px, 스와이프 감지 임계값
  velocityThreshold?: number // 속도 임계값
  preventScroll?: 'horizontal' | 'vertical' | 'none'
}

function setupTouchGestures(
  element: HTMLElement,
  config: TouchConfig = {}
): () => void {
  const { swipeThreshold = 50, velocityThreshold = 0.3 } = config
  const lenis = getLenis()

  let startX = 0
  let startY = 0
  let startTime = 0

  const onTouchStart = (e: TouchEvent) => {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
    startTime = Date.now()
  }

  const onTouchEnd = (e: TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const deltaX = endX - startX
    const deltaY = endY - startY
    const deltaTime = Date.now() - startTime
    const velocity = Math.sqrt(deltaX ** 2 + deltaY ** 2) / deltaTime

    // 수평 스와이프 감지
    if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      const direction = deltaX > 0 ? 'right' : 'left'
      element.dispatchEvent(new CustomEvent('swipe', {
        detail: { direction, velocity, deltaX, deltaY }
      }))
    }

    // 수직 스와이프
    if (Math.abs(deltaY) > swipeThreshold && Math.abs(deltaY) > Math.abs(deltaX)) {
      const direction = deltaY > 0 ? 'down' : 'up'
      element.dispatchEvent(new CustomEvent('swipe', {
        detail: { direction, velocity, deltaX, deltaY }
      }))
    }
  }

  element.addEventListener('touchstart', onTouchStart, { passive: true })
  element.addEventListener('touchend', onTouchEnd, { passive: true })

  return () => {
    element.removeEventListener('touchstart', onTouchStart)
    element.removeEventListener('touchend', onTouchEnd)
  }
}
```

### 9.2 성능 최적화

```typescript
// will-change 자동 관리
function optimizeForAnimation(element: HTMLElement, properties: string[]) {
  element.style.willChange = properties.join(', ')

  return () => {
    element.style.willChange = 'auto'
  }
}

// 뷰포트 밖 애니메이션 일시 정지
function setupViewportOptimization() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const blockId = (entry.target as HTMLElement).dataset.blockId
      if (!blockId) return

      const timelines = ScrollTrigger.getAll().filter(
        st => st.vars.trigger === entry.target
      )

      timelines.forEach(st => {
        if (entry.isIntersecting) {
          st.enable()
        } else {
          st.disable()
        }
      })
    })
  }, { rootMargin: '100px' })

  document.querySelectorAll('[data-block-id]').forEach(el => {
    observer.observe(el)
  })

  return () => observer.disconnect()
}

// reduced-motion 대응
function checkReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getReducedMotionConfig(): Partial<LenisConfig> {
  return {
    duration: 0,
    smoothWheel: false,
  }
}
```

---

## 10. 관련 문서

| 문서 | 내용 |
|------|------|
| [02a_triggers_actions.md](./02a_triggers_actions.md) | 트리거/액션 타입 정의 |
| [02b_state_machine.md](./02b_state_machine.md) | 상태 머신 정의 |
| [05a_context_providers.md](./05a_context_providers.md) | 컨텍스트 시스템 |

---

## 11. 의존성

```json
{
  "dependencies": {
    "@gsap/react": "^2.1.2",
    "gsap": "^3.14.1",
    "lenis": "^1.3.16"
  }
}
```

**GSAP 플러그인 (필요시)**:
- `ScrollTrigger` - 스크롤 연동 (기본 포함)
- `MotionPathPlugin` - SVG 경로 이동
- `MorphSVGPlugin` - SVG 형태 변환 (Club 라이선스)
- `ScrollSmoother` - GSAP 자체 스무스 스크롤 (Lenis 대신 사용 가능)

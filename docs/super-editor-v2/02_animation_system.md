# Super Editor v2 - 애니메이션 시스템

> **목표**: 완전 유연한 애니메이션 시스템으로 복잡한 인터랙션 지원
> **핵심 원칙**: 트리거 중심 + 상태 머신 + 합성 가능한 액션

---

## 1. 설계 원칙

### 1.1 핵심 결정사항

| 항목 | 결정 |
|------|------|
| **트리거 중심** | 모든 애니메이션은 트리거에서 시작 |
| **상태 머신** | 조건부 전환과 복잡한 흐름 지원 |
| **합성 가능** | 작은 단위를 조합해 복잡한 애니메이션 생성 |
| **제스처 네이티브** | 터치/마우스 인터랙션 1급 시민 |
| **AI 친화적** | 맥락 이해를 위한 의미적 메타데이터 |

### 1.2 지원 시나리오

| 시나리오 | 예시 |
|---------|------|
| 스크롤 연동 reveal | 예식장 정보가 보이면 blur 해제 |
| 제스처 기반 인터랙션 | 갤러리 탭 → 흔들림 → 확대 → 스와이프 |
| 스크롤 프로그레스 | 종이비행기가 스크롤에 따라 경로 이동 |
| 상태 전환 | 비행기 → 편지 → 접힌 비행기 morph |
| 이벤트 트리거 | 폼 제출 시 애니메이션 실행 |
| Parallax | 배경/전경 다른 속도로 이동 |
| 병렬 애니메이션 | 크기 확대 + blur 해제 동시 실행 |

---

## 2. 계층 구조

| 레벨 | 저장 위치 | 내용 |
|-----|----------|------|
| **전역 설정** | `document.animation` | mood, speed, easingPresets, sharedState |
| **Floating 요소** | `document.floatingElements` | 블록 독립적 고정 요소 |
| **전역 인터랙션** | `document.globalInteractions` | 문서 레벨 인터랙션 |
| **블록 설정** | `block.animation` | entrance, scroll, interactions, stateMachine |
| **요소 설정** | `element.animation` | entrance, hover, loop, interactions, stateMachine |
| **프리셋 정의** | 코드 (하드코딩) | 재사용 가능한 애니메이션 패턴 |

---

## 3. 트리거 시스템

모든 애니메이션의 시작점. 언제 애니메이션이 실행되는지 정의.

```typescript
type Trigger =
  | ScrollTrigger
  | GestureTrigger
  | EventTrigger
  | StateTrigger
  | TimeTrigger
```

### 3.1 ScrollTrigger

스크롤 위치 기반 트리거.

```typescript
interface ScrollTrigger {
  type: 'scroll'

  // 관찰 대상 (없으면 뷰포트)
  target?: string           // 요소/블록 ID

  // 트리거 범위
  start: string             // 'top center', '50%', '200px'
  end?: string              // 없으면 start 지점에서 1회 실행

  // 스크롤 연동
  scrub?: boolean | number  // true = 1:1 연동, number = 부드러움 정도

  // 스크롤 방향
  direction?: 'down' | 'up' | 'both'

  // 진입/이탈
  enter?: boolean           // 영역 진입 시
  leave?: boolean           // 영역 이탈 시

  // 반복
  once?: boolean            // 1회만 실행 (기본: false)
}
```

**예시**:
```json
{
  "type": "scroll",
  "target": "block-venue",
  "start": "top 80%",
  "end": "top 30%",
  "scrub": true
}
```

### 3.2 GestureTrigger

터치/마우스 제스처 기반 트리거.

```typescript
interface GestureTrigger {
  type: 'gesture'
  gesture: 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch' | 'drag' | 'hover'

  // 대상 요소 (필수)
  target: string            // 요소 ID, 'photo-*' 와일드카드 가능

  // swipe 옵션
  direction?: 'left' | 'right' | 'up' | 'down' | 'horizontal' | 'vertical'

  // pinch 옵션
  scale?: 'in' | 'out'

  // drag 옵션
  axis?: 'x' | 'y' | 'both'
  bounds?: { min: number, max: number }
}
```

**예시**:
```json
{
  "type": "gesture",
  "gesture": "tap",
  "target": "photo-*"
}
```

### 3.3 EventTrigger

DOM/커스텀 이벤트 기반 트리거.

```typescript
interface EventTrigger {
  type: 'event'
  event:
    | 'click'
    | 'form-submit'
    | 'input-focus'
    | 'input-blur'
    | 'video-end'
    | 'audio-end'
    | 'animation-end'
    | 'load'
    | string                // 커스텀 이벤트명

  target?: string           // 요소 ID (없으면 document)
}
```

**예시**:
```json
{
  "type": "event",
  "event": "form-submit",
  "target": "guestbook-form"
}
```

### 3.4 StateTrigger

상태 머신 전이 트리거.

```typescript
interface StateTrigger {
  type: 'state'
  from?: string             // 이전 상태 ('*' = 모든 상태)
  to: string                // 진입할 상태
}
```

### 3.5 TimeTrigger

시간 기반 트리거.

```typescript
interface TimeTrigger {
  type: 'time'
  delay: number             // ms, 페이지 로드 후
  repeat?: number           // 반복 횟수 (-1 = 무한)
  interval?: number         // 반복 간격 ms
}
```

---

## 4. 애니메이션 액션

트리거 발생 시 실행할 동작 정의.

```typescript
type AnimationAction =
  | TweenAction
  | SequenceAction
  | TimelineAction
  | SpringAction
  | PathAction
  | MorphAction
  | StaggerAction
  | SetAction
```

### 4.1 TweenAction

단일 속성 변환 (가장 기본).

```typescript
interface TweenAction {
  type: 'tween'
  target: string | string[]   // 요소 ID(s)

  from?: AnimationProperties  // 시작 상태 (생략 시 현재 상태)
  to: AnimationProperties     // 종료 상태

  duration: number            // ms
  easing?: EasingFunction     // 기본: 'ease-out'
  delay?: number              // ms

  // 반복/방향
  direction?: 'normal' | 'reverse' | 'alternate'
  iterations?: number         // 반복 횟수

  // 완료 후 상태
  fill?: 'none' | 'forwards' | 'backwards' | 'both'
}
```

**예시**:
```json
{
  "type": "tween",
  "target": "venue-info",
  "from": { "blur": 10, "opacity": 0.3 },
  "to": { "blur": 0, "opacity": 1 },
  "duration": 800,
  "easing": "ease-out"
}
```

### 4.2 SequenceAction

순차 실행 (이전 완료 후 다음 시작).

```typescript
interface SequenceAction {
  type: 'sequence'
  steps: AnimationAction[]
}
```

**예시** (흔들림 → 확대):
```json
{
  "type": "sequence",
  "steps": [
    { "type": "tween", "target": "$activePhoto", "to": { "rotate": -3 }, "duration": 50 },
    { "type": "tween", "target": "$activePhoto", "to": { "rotate": 3 }, "duration": 50 },
    { "type": "tween", "target": "$activePhoto", "to": { "rotate": 0 }, "duration": 50 },
    { "type": "spring", "target": "$activePhoto", "to": { "scale": 2.5 } }
  ]
}
```

### 4.3 TimelineAction

병렬 + 타이밍 제어.

```typescript
interface TimelineAction {
  type: 'timeline'
  tracks: {
    action: AnimationAction
    at: number | string       // ms, '%', 'prev-end', 'prev-start', '+=100'
  }[]
  totalDuration?: number      // 전체 길이 (scrub 연동용)
}
```

**예시** (크기 확대 + blur 해제 동시):
```json
{
  "type": "timeline",
  "tracks": [
    {
      "at": 0,
      "action": {
        "type": "tween",
        "target": "mask-box",
        "from": { "clipPath": "inset(45% 45% 45% 45%)" },
        "to": { "clipPath": "inset(0% 0% 0% 0%)" },
        "duration": 800
      }
    },
    {
      "at": 0,
      "action": {
        "type": "tween",
        "target": "content",
        "from": { "blur": 20 },
        "to": { "blur": 0 },
        "duration": 800
      }
    }
  ]
}
```

### 4.4 SpringAction

물리 기반 스프링 애니메이션.

```typescript
interface SpringAction {
  type: 'spring'
  target: string

  to: AnimationProperties

  stiffness?: number          // 강성 (기본: 100)
  damping?: number            // 감쇠 (기본: 10)
  mass?: number               // 질량 (기본: 1)
  velocity?: number           // 초기 속도
}
```

**예시**:
```json
{
  "type": "spring",
  "target": "photo-1",
  "to": { "scale": 2.5, "x": "50vw", "y": "50vh" },
  "stiffness": 200,
  "damping": 20
}
```

### 4.5 PathAction

SVG 경로 따라 이동.

```typescript
interface PathAction {
  type: 'path'
  target: string

  path: string                // SVG path 'd' 속성
  align?: boolean             // 경로 방향으로 회전
  alignOffset?: number        // 회전 오프셋 (degrees)

  start?: number              // 0-1, 시작 지점
  end?: number                // 0-1, 끝 지점

  duration: number
  easing?: EasingFunction
}
```

**예시**:
```json
{
  "type": "path",
  "target": "paper-plane",
  "path": "M 10,5 Q 30,15 50,10 T 70,20 T 90,15",
  "align": true,
  "alignOffset": 15,
  "duration": 1000
}
```

### 4.6 MorphAction

SVG 형태 변환.

```typescript
interface MorphAction {
  type: 'morph'
  target: string

  fromPath?: string           // 시작 SVG path (생략 시 현재)
  toPath: string              // 끝 SVG path

  duration: number
  easing?: EasingFunction
}
```

**예시** (비행기 → 편지):
```json
{
  "type": "morph",
  "target": "paper-plane",
  "toPath": "M 20,20 L 80,20 L 80,80 L 20,80 Z",
  "duration": 800,
  "easing": "ease-out"
}
```

### 4.7 StaggerAction

여러 요소 순차 애니메이션.

```typescript
interface StaggerAction {
  type: 'stagger'
  targets: string | string[]  // 여러 요소

  action: TweenAction | SpringAction

  stagger: number | {
    each?: number             // 각 요소 간 딜레이 ms
    from?: 'first' | 'last' | 'center' | 'edges' | number
    grid?: [number, number]   // 그리드 stagger [rows, cols]
    axis?: 'x' | 'y'
  }
}
```

**예시**:
```json
{
  "type": "stagger",
  "targets": ["photo-1", "photo-2", "photo-3", "photo-4"],
  "action": {
    "type": "tween",
    "to": { "opacity": 1, "y": 0 },
    "duration": 400
  },
  "stagger": { "each": 100, "from": "first" }
}
```

### 4.8 SetAction

즉시 값 설정 (애니메이션 없이).

```typescript
interface SetAction {
  type: 'set'
  target: string | string[]
  properties: AnimationProperties
}
```

---

## 5. 애니메이션 속성

변환 가능한 모든 속성.

```typescript
interface AnimationProperties {
  // Transform
  x?: number | string           // px, %, vw, vh
  y?: number | string
  z?: number | string
  scale?: number
  scaleX?: number
  scaleY?: number
  scaleZ?: number
  rotate?: number               // degrees
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  skewX?: number
  skewY?: number

  // 3D
  perspective?: number
  transformOrigin?: string      // 'center', '0% 100%'

  // Opacity & Visibility
  opacity?: number
  visibility?: 'visible' | 'hidden'

  // Filter
  blur?: number                 // px
  brightness?: number           // 0-2
  contrast?: number
  grayscale?: number            // 0-1
  saturate?: number
  sepia?: number
  hueRotate?: number            // degrees

  // Clip & Mask
  clipPath?: string             // 'circle(50%)', 'inset(0 0 0 0)'
  maskImage?: string

  // Size
  width?: number | string
  height?: number | string

  // Color
  backgroundColor?: string
  color?: string
  borderColor?: string

  // SVG 전용
  strokeDashoffset?: number
  strokeDasharray?: string
  pathLength?: number

  // Custom CSS 변수
  [key: `--${string}`]?: string | number
}
```

### 5.1 Easing Functions

```typescript
type EasingFunction =
  | 'linear'
  | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  | 'spring' | 'bounce'
  | `cubic-bezier(${number}, ${number}, ${number}, ${number})`
  | `steps(${number}, ${'start' | 'end'})`
  | string                      // 커스텀 프리셋 이름
```

---

## 6. 상태 머신

복잡한 상태 전환 로직 정의.

### 6.0 복잡도 제한

AI가 생성하는 상태 머신의 복잡도를 제한하여 디버깅 용이성과 성능을 보장.

```typescript
const STATE_MACHINE_CONSTRAINTS = {
  maxStates: 5,           // 최대 상태 개수
  maxTransitions: 10,     // 최대 전이 개수
  maxDepth: 3,            // 최대 전이 경로 깊이
  allowCycles: false,     // 순환 참조 허용 여부 (기본: 불허)
  maxActionsPerState: 3,  // 상태당 최대 액션 수 (onEnter + onExit + interactions)
} as const

function validateStateMachineComplexity(
  sm: AnimationStateMachine
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const stateCount = Object.keys(sm.states).length
  const transitionCount = sm.transitions.length

  // 1. 상태 개수 제한
  if (stateCount > STATE_MACHINE_CONSTRAINTS.maxStates) {
    errors.push(`상태 개수 초과: ${stateCount}/${STATE_MACHINE_CONSTRAINTS.maxStates}`)
  }

  // 2. 전이 개수 제한
  if (transitionCount > STATE_MACHINE_CONSTRAINTS.maxTransitions) {
    errors.push(`전이 개수 초과: ${transitionCount}/${STATE_MACHINE_CONSTRAINTS.maxTransitions}`)
  }

  // 3. 순환 참조 검사
  if (!STATE_MACHINE_CONSTRAINTS.allowCycles) {
    const cycles = detectCycles(sm)
    if (cycles.length > 0) {
      errors.push(`순환 참조 감지: ${cycles.map(c => c.join(' → ')).join(', ')}`)
    }
  }

  // 4. 전이 경로 깊이 검사
  const maxDepth = calculateMaxDepth(sm)
  if (maxDepth > STATE_MACHINE_CONSTRAINTS.maxDepth) {
    warnings.push(`전이 경로 깊이 ${maxDepth} - 복잡한 흐름일 수 있음`)
  }

  // 5. 상태당 액션 수 검사
  for (const [stateName, state] of Object.entries(sm.states)) {
    const actionCount =
      (state.onEnter ? 1 : 0) +
      (state.onExit ? 1 : 0) +
      (state.interactions?.length || 0)
    if (actionCount > STATE_MACHINE_CONSTRAINTS.maxActionsPerState) {
      warnings.push(`상태 '${stateName}'의 액션 수 ${actionCount} - 단순화 권장`)
    }
  }

  // 6. 도달 불가능한 상태 검사
  const reachableStates = findReachableStates(sm)
  const unreachable = Object.keys(sm.states).filter(s => !reachableStates.has(s) && s !== sm.initial)
  if (unreachable.length > 0) {
    warnings.push(`도달 불가능한 상태: ${unreachable.join(', ')}`)
  }

  return { valid: errors.length === 0, errors, warnings }
}

/**
 * 순환 참조 탐지 (DFS with Back-edge Detection)
 *
 * 알고리즘:
 * - inStack: 현재 DFS 경로에 있는 노드 (O(1) 체크)
 * - visited: 탐색 완료된 노드 (중복 탐색 방지)
 * - path: 순환 경로 추출용 배열
 *
 * 순환 탐지 조건:
 * - 현재 노드가 inStack에 있으면 → 백 엣지 발견 → 순환 존재
 */
function detectCycles(sm: AnimationStateMachine): string[][] {
  const cycles: string[][] = []
  const visited = new Set<string>()
  const inStack = new Set<string>()  // 현재 DFS 스택에 있는 노드
  const path: string[] = []          // 순환 경로 추출용

  function dfs(state: string) {
    // Case 1: 현재 DFS 스택에 있는 노드 재방문 → 순환 발견 (백 엣지)
    // 이 시점에서 state는 아직 path에 push 전이지만,
    // 이전 재귀 호출에서 이미 path에 추가되어 있음
    if (inStack.has(state)) {
      const cycleStart = path.indexOf(state)
      // 예: path=['A','B','C'], state='A' → cycle=['A','B','C','A']
      cycles.push([...path.slice(cycleStart), state])
      return
    }

    // Case 2: 이미 완전히 탐색된 노드 → 스킵 (다른 경로에서 방문 완료)
    if (visited.has(state)) return

    // 현재 노드 탐색 시작
    visited.add(state)
    inStack.add(state)
    path.push(state)

    // 인접 노드 탐색
    const outgoing = sm.transitions.filter(t => t.from === state || t.from === '*')
    for (const t of outgoing) {
      dfs(t.to)
    }

    // 현재 노드 탐색 완료 → 스택에서 제거 (백트래킹)
    path.pop()
    inStack.delete(state)
  }

  dfs(sm.initial)
  return cycles
}
```

### 6.1 StateMachine 구조

```typescript
interface AnimationStateMachine {
  id: string

  // 초기 상태
  initial: string

  // 상태 정의
  states: {
    [stateName: string]: {
      // 이 상태일 때 요소 속성
      properties?: AnimationProperties

      // 진입 시 실행할 애니메이션
      onEnter?: AnimationAction

      // 이탈 시 실행할 애니메이션
      onExit?: AnimationAction

      // 이 상태에서 활성화될 인터랙션
      interactions?: Interaction[]
    }
  }

  // 전이 정의
  transitions: {
    from: string | '*'          // '*' = 모든 상태에서
    to: string
    trigger: Trigger
    animation?: AnimationAction // 전이 중 애니메이션
    guard?: string              // 조건 표현식
  }[]
}
```

**예시** (갤러리 라이트박스):
```json
{
  "id": "gallery-lightbox",
  "initial": "grid",
  "states": {
    "grid": {
      "interactions": [{
        "trigger": { "type": "gesture", "gesture": "tap", "target": "photo-*" }
      }]
    },
    "expanded": {
      "onEnter": {
        "type": "sequence",
        "steps": [
          { "type": "tween", "target": "$activePhoto", "to": { "rotate": -3 }, "duration": 50 },
          { "type": "tween", "target": "$activePhoto", "to": { "rotate": 3 }, "duration": 50 },
          { "type": "spring", "target": "$activePhoto", "to": { "scale": 2.5 } }
        ]
      },
      "onExit": {
        "type": "spring",
        "target": "$activePhoto",
        "to": { "scale": 1, "x": "$originalX", "y": "$originalY" }
      }
    }
  },
  "transitions": [
    { "from": "grid", "to": "expanded", "trigger": { "type": "gesture", "gesture": "tap", "target": "photo-*" } },
    { "from": "expanded", "to": "grid", "trigger": { "type": "event", "event": "click", "target": "overlay" } }
  ]
}
```

### 6.1 동적 변수

상태 머신에서 사용 가능한 특수 변수:

| 변수 | 설명 |
|------|------|
| `$activePhoto` | 현재 활성화된 요소 |
| `$triggeredElement` | 트리거를 발생시킨 요소 |
| `$originalX`, `$originalY` | 요소의 원래 위치 |
| `$index` | stagger에서 현재 인덱스 |

---

## 7. 인터랙션

트리거와 액션을 연결.

```typescript
interface Interaction {
  id: string
  name?: string               // 디버깅/AI용 설명

  // 언제 실행?
  trigger: Trigger

  // 무엇을 실행?
  action: AnimationAction

  // 조건부 실행
  condition?: {
    state?: string            // 특정 상태일 때만
    media?: string            // 미디어 쿼리 '(min-width: 768px)'
    expression?: string       // 'data.photos.length > 5'
  }

  // 다른 인터랙션 취소
  cancels?: string[]          // 인터랙션 ID 목록

  // 활성화 여부
  enabled?: boolean
}
```

---

## 8. Floating 요소

블록에 속하지 않는 독립적인 고정 요소.

```typescript
interface FloatingElement {
  id: string
  type: 'svg' | 'image' | 'lottie' | 'text' | 'html'

  // 위치
  position: 'fixed' | 'absolute' | 'sticky'
  anchor: {
    x: 'left' | 'center' | 'right' | number   // vw
    y: 'top' | 'center' | 'bottom' | number   // vh
  }
  offset?: { x: number, y: number }

  // 콘텐츠
  content: string             // SVG, 이미지 URL, Lottie JSON URL 등

  // 크기
  width: number | string
  height: number | string

  // z-index
  zIndex: number

  // 스크롤 범위 (이 범위에서만 보임)
  scrollRange?: {
    start: string             // '0%', 'block-greeting top'
    end: string               // '100%', 'block-guestbook bottom'
  }

  // 인터랙션
  interactions?: Interaction[]

  // 상태 머신
  stateMachine?: AnimationStateMachine
}
```

**예시** (종이비행기):
```json
{
  "id": "paper-plane",
  "type": "svg",
  "position": "fixed",
  "anchor": { "x": 10, "y": 5 },
  "width": "8vw",
  "height": "8vw",
  "content": "<svg>...</svg>",
  "zIndex": 1000,
  "scrollRange": {
    "start": "block-intro bottom",
    "end": "100%"
  },
  "stateMachine": {
    "id": "paper-plane-journey",
    "initial": "flying",
    "states": {
      "flying": {},
      "letter": {},
      "sent": {}
    },
    "transitions": [
      { "from": "flying", "to": "letter", "trigger": { "type": "scroll", "target": "block-guestbook", "start": "top center" } },
      { "from": "letter", "to": "sent", "trigger": { "type": "event", "event": "form-submit", "target": "guestbook-form" } }
    ]
  }
}
```

---

## 9. 문서 레벨 통합

### 9.1 EditorDocument 확장

```typescript
interface EditorDocument {
  // ... 기존 필드 ...

  // 전역 애니메이션 설정
  animation: {
    // 기존
    mood: AnimationMood
    speed: number
    scrollBehavior: 'smooth' | 'snap'

    // 신규: 전역 이징 프리셋
    easingPresets?: {
      [name: string]: string  // 'bouncy': 'cubic-bezier(.68,-0.55,.265,1.55)'
    }

    // 신규: 공유 상태 (여러 인터랙션이 공유)
    sharedState?: {
      [key: string]: any
    }
  }

  // 블록 독립 요소
  floatingElements?: FloatingElement[]

  // 전역 인터랙션
  globalInteractions?: Interaction[]

  // 블록들
  blocks: Block[]
}
```

### 9.2 Block 확장

```typescript
interface Block {
  // ... 기존 필드 ...

  animation?: {
    // 기존
    entrance?: EntranceConfig
    scroll?: ScrollConfig
    sequence?: ScrollSequence

    // 신규
    interactions?: Interaction[]
    stateMachine?: AnimationStateMachine
  }
}
```

### 9.3 Element 확장

```typescript
interface Element {
  // ... 기존 필드 ...

  animation?: {
    // 기존
    entrance?: EntranceConfig
    hover?: HoverConfig
    loop?: LoopConfig

    // 신규
    interactions?: Interaction[]
    stateMachine?: AnimationStateMachine
  }
}
```

---

## 10. 프리셋 시스템

재사용 가능한 애니메이션 패턴. 코드에 하드코딩.

### 10.1 프리셋 구조

```typescript
interface AnimationPreset {
  id: string
  name: string

  // AI 추천용 메타데이터
  meta: {
    mood: AnimationMood[]
    suitableFor: (BlockType | 'any')[]
    keywords: {
      ko: string[]
      en: string[]
    }
    description: string
    intensity: 'subtle' | 'medium' | 'dramatic'
    pairsWith?: string[]
  }

  // 실제 애니메이션
  action: AnimationAction
}
```

### 10.2 Entrance 프리셋

```typescript
const ENTRANCE_PRESETS = [
  {
    id: 'fade-in',
    name: '페이드 인',
    meta: {
      mood: ['minimal', 'elegant'],
      suitableFor: ['any'],
      keywords: { ko: ['부드럽게', '자연스럽게'], en: ['soft', 'gentle'] },
      description: '투명도만 변화하는 기본 등장',
      intensity: 'subtle'
    },
    action: {
      type: 'tween',
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 500,
      easing: 'ease-out'
    }
  },
  {
    id: 'cinematic-fade',
    name: '시네마틱 페이드',
    meta: {
      mood: ['cinematic', 'romantic'],
      suitableFor: ['intro'],
      keywords: { ko: ['영화', '드라마틱'], en: ['movie', 'dramatic'] },
      description: '느린 페이드 + 줌 + 블러 해제',
      intensity: 'medium'
    },
    action: {
      type: 'tween',
      from: { opacity: 0, scale: 1.1, blur: 10 },
      to: { opacity: 1, scale: 1, blur: 0 },
      duration: 1200,
      easing: 'ease-out'
    }
  }
]
```

---

## 11. AI 통합

### 11.1 AI 컨텍스트 구조

AI가 수정 시 맥락을 완전히 이해하기 위한 컨텍스트.

```typescript
interface AIAnimationContext {
  // 1. 현재 선택된 대상
  selection: {
    type: 'element' | 'block' | 'floating' | 'interaction' | 'state'
    id: string
    path: string              // 'blocks[0].elements[2].animation.interactions[0]'
  }

  // 2. 선택된 대상의 전체 정보
  target: {
    current: Element | Block | FloatingElement | Interaction
    parent?: Block
    document?: EditorDocument
  }

  // 3. 의미적 맥락 (AI 이해용)
  semantic: {
    role: string              // "스크롤 진행 표시 종이비행기"
    binding?: string          // 변수 바인딩
    animationSummary: string  // "스크롤 0-80%에서 곡선 경로로 이동"
    relatedElements: {
      id: string
      role: string
      relationship: 'sibling' | 'triggers' | 'triggered-by' | 'overlaps'
    }[]
  }

  // 4. 수정 가능한 옵션
  modifiable: {
    properties: string[]
    constraints?: string[]
  }

  // 5. 변경 히스토리
  history: {
    action: string
    before: any
    after: any
    timestamp: number
  }[]
}
```

### 11.2 의미적 요약 자동 생성

```typescript
function summarizeAnimation(animation: any): string {
  if (!animation) return "애니메이션 없음"

  const parts: string[] = []

  if (animation.entrance) {
    parts.push(`진입: ${animation.entrance.preset} (${animation.entrance.duration || 'default'}ms)`)
  }

  if (animation.stateMachine) {
    const sm = animation.stateMachine
    const stateNames = Object.keys(sm.states).join(' → ')
    parts.push(`상태 머신: ${stateNames}`)
  }

  if (animation.interactions) {
    animation.interactions.forEach(i => {
      parts.push(`인터랙션: ${describeTrigger(i.trigger)} → ${describeAction(i.action)}`)
    })
  }

  return parts.join('\n')
}
```

### 11.3 AI 프롬프트 템플릿

```handlebars
당신은 청첩장 애니메이션 에디터입니다.

## 현재 컨텍스트

### 선택된 요소
- ID: {{selection.id}}
- 역할: {{semantic.role}}
- 위치: {{selection.path}}

### 현재 애니메이션 상태
{{semantic.animationSummary}}

### 전체 JSON
```json
{{target.current | json}}
```

### 관련 요소들
{{#each semantic.relatedElements}}
- {{this.id}}: {{this.role}} ({{this.relationship}})
{{/each}}

### 수정 가능한 속성
{{modifiable.properties | join(", ")}}

## 사용자 요청
"{{userPrompt}}"

## 출력 형식 (JSON Patch - RFC 6902)
```json
{
  "analysis": {
    "intent": "사용자 의도 요약",
    "affectedProperties": ["x", "y", "animation.entrance"],
    "approach": "접근 방식 설명"
  },
  "patches": [
    { "op": "replace", "path": "/blocks/0/elements/1/x", "value": 10 },
    { "op": "replace", "path": "/blocks/0/elements/1/y", "value": 20 },
    { "op": "add", "path": "/blocks/0/elements/-", "value": { "id": "new-elem", "type": "text" } },
    { "op": "remove", "path": "/blocks/0/elements/2" }
  ],
  "explanation": "사용자에게 보여줄 변경 설명"
}
```

### JSON Patch 연산자
| op | 설명 | 예시 |
|----|------|------|
| `replace` | 기존 값 교체 | `{"op": "replace", "path": "/x", "value": 50}` |
| `add` | 새 값 추가 (배열: `-`는 끝에 추가) | `{"op": "add", "path": "/elements/-", "value": {...}}` |
| `remove` | 값 삭제 | `{"op": "remove", "path": "/elements/2"}` |
| `move` | 값 이동 | `{"op": "move", "from": "/a", "path": "/b"}` |
| `copy` | 값 복사 | `{"op": "copy", "from": "/a", "path": "/b"}` |
| `test` | 값 검증 (적용 전 확인) | `{"op": "test", "path": "/x", "value": 10}` |
```

### 11.4 AI 출력 검증

```typescript
interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

interface AIOutput {
  analysis: {
    intent: string
    affectedProperties: string[]
    approach: string
  }
  patches: JsonPatch[]
  explanation: string
}

interface JsonPatch {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test'
  path: string
  value?: unknown
  from?: string  // move, copy 용
}

function validateAIOutput(
  context: AIAnimationContext,
  aiOutput: AIOutput
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // 1. JSON Patch 형식 검증
  if (!Array.isArray(aiOutput.patches)) {
    errors.push("patches는 배열이어야 함")
    return { valid: false, errors, warnings }
  }

  for (const patch of aiOutput.patches) {
    // 1-1. 필수 필드 검증
    if (!['add', 'remove', 'replace', 'move', 'copy', 'test'].includes(patch.op)) {
      errors.push(`유효하지 않은 op: ${patch.op}`)
    }
    if (typeof patch.path !== 'string' || !patch.path.startsWith('/')) {
      errors.push(`유효하지 않은 path: ${patch.path}`)
    }

    // 1-2. op별 필수 필드
    if (['add', 'replace', 'test'].includes(patch.op) && patch.value === undefined) {
      errors.push(`${patch.op} 연산에 value 필요: ${patch.path}`)
    }
    if (['move', 'copy'].includes(patch.op) && !patch.from) {
      errors.push(`${patch.op} 연산에 from 필요: ${patch.path}`)
    }

    // 1-3. path 존재 여부 (remove, replace, move, copy, test)
    if (['remove', 'replace', 'move', 'copy', 'test'].includes(patch.op)) {
      if (!pathExists(context.target.document, patch.path)) {
        errors.push(`존재하지 않는 경로: ${patch.path}`)
      }
    }
  }

  // 2. 참조 무결성 (새로 추가되는 요소의 target ID)
  const newElements = aiOutput.patches
    .filter(p => p.op === 'add' && p.value)
    .map(p => p.value)

  for (const elem of newElements) {
    const referencedIds = extractTargetIds(elem)
    referencedIds.forEach(id => {
      if (!id.startsWith('$') && !elementExists(context.target.document, id)) {
        errors.push(`존재하지 않는 요소 참조: ${id}`)
      }
    })
  }

  // 3. 수정 가능한 속성 범위 체크
  const modifiablePaths = context.modifiable.properties.map(p => `/${p.replace(/\./g, '/')}`)
  for (const patch of aiOutput.patches) {
    const isAllowed = modifiablePaths.some(mp => patch.path.startsWith(mp))
    if (!isAllowed && context.modifiable.constraints?.includes('strict')) {
      errors.push(`수정 불가능한 경로: ${patch.path}`)
    }
  }

  // 4. 성능 경고
  const animationPatches = aiOutput.patches.filter(p => p.path.includes('animation'))
  if (animationPatches.length > 10) {
    warnings.push("많은 애니메이션 변경 - 성능 영향 가능")
  }

  // 5. 상태 머신 복잡도 검증
  const stateMachinePatches = aiOutput.patches.filter(p => p.path.includes('stateMachine'))
  for (const patch of stateMachinePatches) {
    if (patch.op === 'add' || patch.op === 'replace') {
      const smValidation = validateStateMachineComplexity(patch.value)
      errors.push(...smValidation.errors)
      warnings.push(...smValidation.warnings)
    }
  }

  return { valid: errors.length === 0, errors, warnings }
}
```

---

## 12. 구현 예시

### 12.1 예식장 blur → 선명 (스크롤 트리거)

```json
{
  "id": "venue-reveal",
  "trigger": {
    "type": "scroll",
    "target": "block-venue",
    "start": "top 80%",
    "end": "top 30%",
    "scrub": true
  },
  "action": {
    "type": "tween",
    "target": "venue-info-group",
    "from": { "blur": 10, "opacity": 0.3, "y": 30 },
    "to": { "blur": 0, "opacity": 1, "y": 0 },
    "duration": 1000
  }
}
```

### 12.2 Parallax 효과

```json
{
  "interactions": [
    {
      "id": "parallax-bg",
      "trigger": { "type": "scroll", "scrub": true, "start": "top bottom", "end": "bottom top" },
      "action": {
        "type": "tween",
        "target": "background",
        "from": { "y": "0" },
        "to": { "y": "-20vh" },
        "duration": 1000
      }
    },
    {
      "id": "parallax-fg",
      "trigger": { "type": "scroll", "scrub": true, "start": "top bottom", "end": "bottom top" },
      "action": {
        "type": "tween",
        "target": "foreground",
        "from": { "y": "0" },
        "to": { "y": "-50vh" },
        "duration": 1000
      }
    }
  ]
}
```

### 12.3 병렬 애니메이션 (크기 + blur)

```json
{
  "type": "timeline",
  "tracks": [
    {
      "at": 0,
      "action": {
        "type": "tween",
        "target": "reveal-box",
        "from": { "clipPath": "inset(45% 45% 45% 45%)" },
        "to": { "clipPath": "inset(0% 0% 0% 0%)" },
        "duration": 800
      }
    },
    {
      "at": 0,
      "action": {
        "type": "tween",
        "target": "content",
        "from": { "blur": 20 },
        "to": { "blur": 0 },
        "duration": 800
      }
    }
  ]
}
```

### 12.4 종이비행기 전체 여정

```json
{
  "floatingElements": [{
    "id": "paper-plane",
    "type": "svg",
    "position": "fixed",
    "anchor": { "x": 10, "y": 5 },
    "width": "8vw",
    "height": "8vw",
    "zIndex": 1000,
    "scrollRange": { "start": "block-intro bottom", "end": "100%" },
    "stateMachine": {
      "id": "paper-plane-journey",
      "initial": "flying",
      "states": {
        "flying": {
          "interactions": [{
            "trigger": { "type": "scroll", "start": "block-intro bottom", "end": "block-guestbook top", "scrub": true },
            "action": { "type": "path", "target": "paper-plane", "path": "M 10,5 Q 30,15 50,10 T 70,20 T 90,15", "align": true }
          }]
        },
        "letter": {
          "onEnter": {
            "type": "morph",
            "target": "paper-plane",
            "toPath": "M 20,20 L 80,20 L 80,80 L 20,80 Z",
            "duration": 800
          }
        },
        "sent": {
          "onEnter": {
            "type": "sequence",
            "steps": [
              { "type": "morph", "target": "paper-plane", "toPath": "M 10,50 L 30,30 L 30,50 L 30,70 Z", "duration": 400 },
              { "type": "tween", "target": "paper-plane", "to": { "x": "120vw", "rotate": 15 }, "duration": 600, "easing": "ease-in" }
            ]
          }
        }
      },
      "transitions": [
        { "from": "flying", "to": "letter", "trigger": { "type": "scroll", "target": "block-guestbook", "start": "top center" } },
        { "from": "letter", "to": "sent", "trigger": { "type": "event", "event": "form-submit", "target": "guestbook-form" } }
      ]
    }
  }]
}
```

---

## 13. 다음 단계

- [ ] `03_variables.md` - 변수 시스템 상세
- [ ] `04_editor_ui.md` - 에디터 UI 설계
- [ ] `05_renderer.md` - 렌더링 + 애니메이션 런타임
- [ ] `06_ai_prompts.md` - AI 프롬프트 상세 + 테스트 케이스

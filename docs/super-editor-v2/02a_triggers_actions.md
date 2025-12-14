# Super Editor v2 - 애니메이션 트리거 & 액션

> **목표**: 완전 유연한 애니메이션 시스템으로 복잡한 인터랙션 지원
> **핵심 원칙**: 트리거 중심 + 합성 가능한 액션

---

## 1. 설계 원칙

### 1.1 핵심 결정사항

| 항목 | 결정 |
|------|------|
| **트리거 중심** | 모든 애니메이션은 트리거에서 시작 |
| **합성 가능** | 작은 단위를 조합해 복잡한 애니메이션 생성 |
| **제스처 네이티브** | 터치/마우스 인터랙션 1급 시민 |
| **AI 친화적** | 맥락 이해를 위한 의미적 메타데이터 |

### 1.2 지원 시나리오

| 시나리오 | 예시 |
|---------|------|
| 스크롤 연동 reveal | 예식장 정보가 보이면 blur 해제 |
| 제스처 기반 인터랙션 | 갤러리 탭 → 흔들림 → 확대 → 스와이프 |
| Parallax 효과 | 배경/전경 다른 속도로 이동 |
| 병렬 애니메이션 | 크기 확대 + blur 해제 동시 실행 |

---

## 2. 계층 구조

| 레벨 | 저장 위치 | 내용 |
|-----|----------|------|
| **전역 설정** | `document.animation` | mood, speed, easingPresets |
| **Floating 요소** | `document.floatingElements` | 블록 독립적 고정 요소 |
| **블록 설정** | `block.animation` | entrance, scroll, interactions |
| **요소 설정** | `element.animation` | entrance, hover, loop, interactions |

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
  target?: string           // 요소/블록 ID
  start: string             // 'top center', '50%', '200px'
  end?: string              // 없으면 start 지점에서 1회 실행
  scrub?: boolean | number  // true = 1:1 연동
  direction?: 'down' | 'up' | 'both'
  enter?: boolean
  leave?: boolean
  once?: boolean
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
  target: string            // 요소 ID, 'photo-*' 와일드카드 가능
  direction?: 'left' | 'right' | 'up' | 'down' | 'horizontal' | 'vertical'
  scale?: 'in' | 'out'
  axis?: 'x' | 'y' | 'both'
  bounds?: { min: number, max: number }
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
  target?: string
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
  delay: number             // ms
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
  | HorizontalScrollAction  // Pin + 수평 스크롤
  | ParallaxAction          // 레이어별 패럴랙스
```

### 4.1 TweenAction

단일 속성 변환 (가장 기본).

```typescript
interface TweenAction {
  type: 'tween'
  target: string | string[]
  from?: AnimationProperties
  to: AnimationProperties
  duration: number
  easing?: EasingFunction
  delay?: number
  direction?: 'normal' | 'reverse' | 'alternate'
  iterations?: number
  fill?: 'none' | 'forwards' | 'backwards' | 'both'
}
```

### 4.2 SequenceAction

순차 실행.

```typescript
interface SequenceAction {
  type: 'sequence'
  steps: AnimationAction[]
}
```

### 4.3 TimelineAction

병렬 + 타이밍 제어.

```typescript
interface TimelineAction {
  type: 'timeline'
  tracks: {
    action: AnimationAction
    at: number | string       // ms, '%', 'prev-end', '+=100'
  }[]
  totalDuration?: number
}
```

### 4.4 SpringAction

물리 기반 스프링 애니메이션.

```typescript
interface SpringAction {
  type: 'spring'
  target: string
  to: AnimationProperties
  stiffness?: number          // 기본: 100
  damping?: number            // 기본: 10
  mass?: number               // 기본: 1
  velocity?: number
}
```

### 4.5 PathAction

SVG 경로 따라 이동.

```typescript
interface PathAction {
  type: 'path'
  target: string
  path: string                // SVG path 'd' 속성
  align?: boolean
  alignOffset?: number
  start?: number              // 0-1
  end?: number
  duration: number
  easing?: EasingFunction
}
```

### 4.6 MorphAction

SVG 형태 변환.

```typescript
interface MorphAction {
  type: 'morph'
  target: string
  fromPath?: string
  toPath: string
  duration: number
  easing?: EasingFunction
}
```

### 4.7 StaggerAction

여러 요소 순차 애니메이션.

```typescript
interface StaggerAction {
  type: 'stagger'
  targets: string | string[]
  action: TweenAction | SpringAction
  stagger: number | {
    each?: number
    from?: 'first' | 'last' | 'center' | 'edges' | number
    grid?: [number, number]
    axis?: 'x' | 'y'
  }
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

### 4.9 HorizontalScrollAction

Pin 상태에서 수평 스크롤 (갤러리, 타임라인용).

```typescript
interface HorizontalScrollAction {
  type: 'horizontal-scroll'
  container: string           // 고정될 컨테이너 ID
  track: string               // 수평 이동할 트랙 ID
  items?: string[]            // 개별 아이템 ID

  pin: {
    enabled: boolean
    spacing?: boolean         // pin 종료 후 여백 유지
    anticipatePin?: number    // 1 = pin 시작 전 준비
  }

  scrollDistance?: number | 'auto' | string
  scrub?: boolean | number
  snap?: boolean | number | {
    snapTo: number[] | 'items'
    duration?: { min: number, max: number }
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
```

**예시**:
```json
{
  "type": "horizontal-scroll",
  "container": "gallery-section",
  "track": "gallery-track",
  "items": ["photo-1", "photo-2", "photo-3"],
  "pin": { "enabled": true, "spacing": true },
  "scrollDistance": "auto",
  "scrub": 1,
  "snap": { "snapTo": "items" },
  "itemAnimation": {
    "entrance": {
      "type": "tween",
      "from": { "opacity": 0, "scale": 0.9 },
      "to": { "opacity": 1, "scale": 1 },
      "duration": 600
    },
    "stagger": 100
  }
}
```

### 4.10 ParallaxAction

레이어별 스크롤 속도 차이로 깊이감 연출.

```typescript
interface ParallaxAction {
  type: 'parallax'
  layers: Array<{
    target: string
    speed: number             // 1 = 기본, 0.5 = 느리게, 2 = 빠르게
    direction?: 'vertical' | 'horizontal' | 'both'
    offset?: { x?: number, y?: number }
    scale?: { from?: number, to?: number }
    opacity?: { from?: number, to?: number }
    rotate?: { from?: number, to?: number }
  }>

  trigger?: string
  start?: string
  end?: string
}
```

**예시**:
```json
{
  "type": "parallax",
  "layers": [
    { "target": "bg-image", "speed": 0.3 },
    { "target": "mid-layer", "speed": 0.6, "opacity": { "from": 0.7, "to": 1 } },
    { "target": "content", "speed": 1 },
    { "target": "floating-petals", "speed": 1.5, "rotate": { "from": -10, "to": 10 } }
  ],
  "start": "top bottom",
  "end": "bottom top"
}
```

---

## 5. 애니메이션 속성

```typescript
interface AnimationProperties {
  // Transform
  x?: number | string
  y?: number | string
  z?: number | string
  scale?: number
  scaleX?: number
  scaleY?: number
  rotate?: number
  rotateX?: number
  rotateY?: number
  skewX?: number
  skewY?: number

  // 3D
  perspective?: number
  transformOrigin?: string

  // Opacity & Visibility
  opacity?: number
  visibility?: 'visible' | 'hidden'

  // Filter
  blur?: number
  brightness?: number
  contrast?: number
  grayscale?: number
  saturate?: number
  sepia?: number
  hueRotate?: number

  // Clip & Mask
  clipPath?: string
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

## 6. 인터랙션

트리거와 액션을 연결.

```typescript
interface Interaction {
  id: string
  name?: string
  trigger: Trigger
  action: AnimationAction
  condition?: {
    state?: string
    media?: string
    expression?: string
  }
  cancels?: string[]
  enabled?: boolean
}
```

---

## 7. 프리셋 시스템

### 7.1 프리셋 구조

```typescript
interface AnimationPreset {
  id: string
  name: string
  meta: {
    mood: AnimationMood[]
    suitableFor: (BlockType | 'any')[]
    keywords: { ko: string[], en: string[] }
    description: string
    intensity: 'subtle' | 'medium' | 'dramatic'
    pairsWith?: string[]
  }
  action: AnimationAction
}
```

### 7.2 Entrance 프리셋 예시

```typescript
const ENTRANCE_PRESETS = [
  {
    id: 'fade-in',
    name: '페이드 인',
    meta: {
      mood: ['minimal', 'elegant'],
      suitableFor: ['any'],
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
      suitableFor: ['hero'],
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

## 8. 구현 예시

### 8.1 예식장 blur → 선명

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

### 8.2 Parallax 효과

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
        "to": { "y": "-20vh" }
      }
    },
    {
      "id": "parallax-fg",
      "trigger": { "type": "scroll", "scrub": true, "start": "top bottom", "end": "bottom top" },
      "action": {
        "type": "tween",
        "target": "foreground",
        "from": { "y": "0" },
        "to": { "y": "-50vh" }
      }
    }
  ]
}
```

### 8.3 병렬 애니메이션

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

---

## 9. 관련 문서

| 문서 | 내용 |
|------|------|
| [02b_state_machine.md](./02b_state_machine.md) | 상태 머신, Floating 요소, AI 통합 |
| [05c_animation_runtime.md](./05c_animation_runtime.md) | 애니메이션 런타임 (GSAP) |

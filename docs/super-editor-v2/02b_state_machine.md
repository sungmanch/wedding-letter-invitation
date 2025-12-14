# Super Editor v2 - 상태 머신 & Floating 요소

> **목표**: 복잡한 상태 전환 로직과 블록 독립 요소 지원
> **핵심 원칙**: 상태 머신 + Floating 요소 + AI 통합

---

## 1. 상태 머신

복잡한 상태 전환 로직 정의.

### 1.1 복잡도 제한

AI가 생성하는 상태 머신의 복잡도를 제한.

```typescript
const STATE_MACHINE_CONSTRAINTS = {
  maxStates: 5,           // 최대 상태 개수
  maxTransitions: 10,     // 최대 전이 개수
  maxDepth: 3,            // 최대 전이 경로 깊이
  allowCycles: false,     // 순환 참조 허용 여부
  maxActionsPerState: 3,  // 상태당 최대 액션 수
} as const
```

### 1.2 StateMachine 구조

```typescript
interface AnimationStateMachine {
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
    from: string | '*'          // '*' = 모든 상태에서
    to: string
    trigger: Trigger
    animation?: AnimationAction
    guard?: string              // 조건 표현식
  }[]
}
```

### 1.3 갤러리 라이트박스 예시

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

### 1.4 동적 변수

상태 머신에서 사용 가능한 특수 변수:

| 변수 | 설명 |
|------|------|
| `$activePhoto` | 현재 활성화된 요소 |
| `$triggeredElement` | 트리거를 발생시킨 요소 |
| `$originalX`, `$originalY` | 요소의 원래 위치 |
| `$index` | stagger에서 현재 인덱스 |

### 1.5 복잡도 검증

```typescript
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

  return { valid: errors.length === 0, errors, warnings }
}
```

---

## 2. Floating 요소

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
  content: string

  // 크기
  width: number | string
  height: number | string

  // z-index
  zIndex: number

  // 스크롤 범위 (이 범위에서만 보임)
  scrollRange?: {
    start: string             // '0%', 'block-greeting top'
    end: string
  }

  // 인터랙션
  interactions?: Interaction[]

  // 상태 머신
  stateMachine?: AnimationStateMachine
}
```

### 2.1 종이비행기 예시

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
    "start": "block-hero bottom",
    "end": "100%"
  },
  "stateMachine": {
    "id": "paper-plane-journey",
    "initial": "flying",
    "states": {
      "flying": {
        "interactions": [{
          "trigger": { "type": "scroll", "start": "block-hero bottom", "end": "block-guestbook top", "scrub": true },
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
}
```

---

## 3. 문서 레벨 통합

### 3.1 EditorDocument 확장

```typescript
interface EditorDocument {
  // ... 기존 필드 ...

  animation: {
    mood: AnimationMood
    speed: number
    scrollBehavior: 'smooth' | 'snap'
    easingPresets?: {
      [name: string]: string
    }
    sharedState?: {
      [key: string]: any
    }
  }

  floatingElements?: FloatingElement[]
  globalInteractions?: Interaction[]
  blocks: Block[]
}
```

### 3.2 Block 확장

```typescript
interface Block {
  // ... 기존 필드 ...

  animation?: {
    entrance?: EntranceConfig
    scroll?: ScrollConfig
    sequence?: ScrollSequence
    interactions?: Interaction[]
    stateMachine?: AnimationStateMachine
  }
}
```

### 3.3 Element 확장

```typescript
interface Element {
  // ... 기존 필드 ...

  animation?: {
    entrance?: EntranceConfig
    hover?: HoverConfig
    loop?: LoopConfig
    interactions?: Interaction[]
    stateMachine?: AnimationStateMachine
  }
}
```

---

## 4. AI 통합

### 4.1 AI 컨텍스트 구조

```typescript
interface AIAnimationContext {
  selection: {
    type: 'element' | 'block' | 'floating' | 'interaction' | 'state'
    id: string
    path: string
  }

  target: {
    current: Element | Block | FloatingElement | Interaction
    parent?: Block
    document?: EditorDocument
  }

  semantic: {
    role: string
    binding?: string
    animationSummary: string
    relatedElements: {
      id: string
      role: string
      relationship: 'sibling' | 'triggers' | 'triggered-by' | 'overlaps'
    }[]
  }

  modifiable: {
    properties: string[]
    constraints?: string[]
  }

  history: {
    action: string
    before: any
    after: any
    timestamp: number
  }[]
}
```

### 4.2 AI 프롬프트 템플릿

```handlebars
당신은 청첩장 애니메이션 에디터입니다.

## 현재 컨텍스트

### 선택된 요소
- ID: {{selection.id}}
- 역할: {{semantic.role}}

### 현재 애니메이션 상태
{{semantic.animationSummary}}

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
    { "op": "add", "path": "/blocks/0/elements/-", "value": { ... } },
    { "op": "remove", "path": "/blocks/0/elements/2" }
  ],
  "explanation": "사용자에게 보여줄 변경 설명"
}
```
```

### 4.3 AI 출력 검증

```typescript
function validateAIOutput(
  context: AIAnimationContext,
  aiOutput: AIOutput
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // 1. JSON Patch 형식 검증
  for (const patch of aiOutput.patches) {
    if (!['add', 'remove', 'replace', 'move', 'copy', 'test'].includes(patch.op)) {
      errors.push(`유효하지 않은 op: ${patch.op}`)
    }
  }

  // 2. 상태 머신 복잡도 검증
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

## 5. 관련 문서

| 문서 | 내용 |
|------|------|
| [02a_triggers_actions.md](./02a_triggers_actions.md) | 트리거, 액션 타입 |
| [05c_animation_runtime.md](./05c_animation_runtime.md) | 애니메이션 런타임 |

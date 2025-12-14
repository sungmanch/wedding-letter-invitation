# Super Editor v2 - 컨텍스트 시스템 & 변수 바인딩

> **목표**: 문서 데이터 제공 및 변수 바인딩 해석
> **핵심 원칙**: React Context + 런타임 바인딩 해석

---

## 1. 설계 원칙

### 1.1 핵심 결정사항

| 항목 | 결정 |
|------|------|
| **렌더링 방식** | 선언적 JSON → React 컴포넌트 트리 |
| **애니메이션 라이브러리** | GSAP (스크롤, 상태 머신) + Framer Motion (제스처) |
| **변수 해석** | 런타임에 바인딩 경로 → 실제 값 변환 |
| **좌표 시스템** | vw/vh → px 변환 (뷰포트 기준) |
| **성능 최적화** | 가상화 (긴 문서), 메모이제이션, 지연 로딩 |
| **SSR 지원** | 초기 HTML 생성 + 클라이언트 하이드레이션 |

### 1.2 렌더링 파이프라인

```
EditorDocument
    ↓
DocumentRenderer (전역 스타일/애니메이션 컨텍스트)
    ↓
┌─────────────────────────────────────────────────┐
│ FloatingElementsRenderer (블록 독립 요소)        │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ BlockRenderer (각 블록)                          │
│   ├── ElementRenderer (각 요소)                  │
│   │     └── 변수 바인딩 해석                      │
│   │     └── 타입별 컴포넌트 렌더링                 │
│   │     └── 스타일 적용                          │
│   └── AnimationController (블록 애니메이션)       │
└─────────────────────────────────────────────────┘
```

---

## 2. DocumentContext

전체 문서 데이터와 전역 설정 제공.

```typescript
interface DocumentContextValue {
  // 문서 데이터
  document: EditorDocument
  data: WeddingData

  // 전역 스타일 (해석된 결과)
  // @see 01_data_schema.md §7.10 ResolvedStyle
  style: ResolvedStyle  // = GlobalStyle

  // 전역 애니메이션 설정
  animation: GlobalAnimation

  // 공유 상태 (애니메이션 간 통신)
  sharedState: Record<string, unknown>
  setSharedState: (key: string, value: unknown) => void

  // 뷰포트 정보
  viewport: {
    width: number
    height: number
    isDesktop: boolean
  }
}

const DocumentContext = createContext<DocumentContextValue | null>(null)

function useDocument() {
  const ctx = useContext(DocumentContext)
  if (!ctx) throw new Error('useDocument must be used within DocumentProvider')
  return ctx
}
```

---

## 3. AnimationContext

애니메이션 런타임 상태 관리.

```typescript
interface AnimationContextValue {
  // GSAP Timeline 레지스트리
  timelines: Map<string, gsap.core.Timeline>
  registerTimeline: (id: string, tl: gsap.core.Timeline) => void
  getTimeline: (id: string) => gsap.core.Timeline | undefined

  // 상태 머신 레지스트리
  stateMachines: Map<string, StateMachineInstance>
  registerStateMachine: (id: string, sm: StateMachineInstance) => void

  // 활성 요소 트래킹
  activeElement: string | null
  setActiveElement: (id: string | null) => void

  // 원래 위치 저장 (복원용)
  originalPositions: Map<string, { x: number; y: number }>
}

const AnimationContext = createContext<AnimationContextValue | null>(null)

function useAnimation() {
  const ctx = useContext(AnimationContext)
  if (!ctx) throw new Error('useAnimation must be used within AnimationProvider')
  return ctx
}
```

---

## 4. BlockContext

현재 블록 정보 제공 (요소 렌더링에서 사용).

```typescript
interface BlockContextValue {
  block: Block
  blockRef: RefObject<HTMLDivElement>

  // 블록 내 상대 좌표 → 절대 좌표 변환
  toAbsolutePosition: (relativeY: number) => number
}

const BlockContext = createContext<BlockContextValue | null>(null)

function useBlock() {
  const ctx = useContext(BlockContext)
  if (!ctx) throw new Error('useBlock must be used within BlockProvider')
  return ctx
}
```

---

## 5. 변수 바인딩 해석

### 5.1 바인딩 리졸버

```typescript
import { COMPUTED_FIELDS } from './computed-fields'

/**
 * 바인딩 경로를 실제 값으로 해석
 */
function resolveBinding(
  binding: string,
  data: WeddingData,
  context?: ResolveContext
): unknown {
  // 1. Computed 필드 체크
  if (COMPUTED_FIELDS[binding]) {
    return COMPUTED_FIELDS[binding].compute(data)
  }

  // 2. 동적 변수 체크 ($activePhoto 등)
  if (binding.startsWith('$')) {
    return resolveDynamicVariable(binding, context)
  }

  // 3. 일반 경로 해석
  return getValueByPath(data, binding)
}

/**
 * 객체에서 경로로 값 추출
 * 'photos.gallery[0].url' → data.photos.gallery[0].url
 */
function getValueByPath(obj: unknown, path: string): unknown {
  const segments = parsePath(path)

  let current: unknown = obj
  for (const segment of segments) {
    if (current == null) return undefined

    if (typeof segment === 'number') {
      // 배열 인덱스
      current = (current as unknown[])[segment]
    } else {
      // 객체 속성
      current = (current as Record<string, unknown>)[segment]
    }
  }

  return current
}

/**
 * 경로 파싱
 * 'photos.gallery[0].url' → ['photos', 'gallery', 0, 'url']
 */
function parsePath(path: string): (string | number)[] {
  const result: (string | number)[] = []
  const regex = /([^.\[\]]+)|\[(\d+)\]/g

  let match
  while ((match = regex.exec(path)) !== null) {
    if (match[1]) {
      result.push(match[1])
    } else if (match[2]) {
      result.push(parseInt(match[2], 10))
    }
  }

  return result
}
```

### 5.2 포맷 문자열 보간

```typescript
/**
 * '{groom.name} ♥ {bride.name}' → '김철수 ♥ 이영희'
 */
function interpolate(format: string, data: WeddingData): string {
  return format.replace(/\{([^}]+)\}/g, (_, path) => {
    const value = resolveBinding(path, data)
    return value != null ? String(value) : ''
  })
}
```

### 5.3 동적 변수 리졸버

```typescript
interface ResolveContext {
  activeElement?: string
  triggeredElement?: string
  index?: number
  originalPositions?: Map<string, { x: number; y: number }>
}

function resolveDynamicVariable(
  binding: string,
  context?: ResolveContext
): unknown {
  switch (binding) {
    case '$activePhoto':
    case '$activeElement':
      return context?.activeElement

    case '$triggeredElement':
      return context?.triggeredElement

    case '$index':
      return context?.index

    case '$originalX':
      return context?.originalPositions?.get(context.activeElement || '')?.x

    case '$originalY':
      return context?.originalPositions?.get(context.activeElement || '')?.y

    default:
      console.warn(`Unknown dynamic variable: ${binding}`)
      return undefined
  }
}
```

---

## 6. AnimationProvider

```typescript
function AnimationProvider({ children }: { children: React.ReactNode }) {
  const timelinesRef = useRef(new Map<string, gsap.core.Timeline>())
  const stateMachinesRef = useRef(new Map<string, StateMachineInstance>())
  const originalPositionsRef = useRef(new Map<string, { x: number; y: number }>())
  const [activeElement, setActiveElement] = useState<string | null>(null)

  const registerTimeline = useCallback((id: string, tl: gsap.core.Timeline) => {
    timelinesRef.current.set(id, tl)
  }, [])

  const getTimeline = useCallback((id: string) => {
    return timelinesRef.current.get(id)
  }, [])

  const registerStateMachine = useCallback((id: string, sm: StateMachineInstance) => {
    stateMachinesRef.current.set(id, sm)
  }, [])

  // 클린업
  useEffect(() => {
    return () => {
      timelinesRef.current.forEach(tl => tl.kill())
      timelinesRef.current.clear()
    }
  }, [])

  const value: AnimationContextValue = {
    timelines: timelinesRef.current,
    registerTimeline,
    getTimeline,
    stateMachines: stateMachinesRef.current,
    registerStateMachine,
    activeElement,
    setActiveElement,
    originalPositions: originalPositionsRef.current,
  }

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  )
}
```

---

## 7. 관련 문서

| 문서 | 내용 |
|------|------|
| [05b_block_element_renderer.md](./05b_block_element_renderer.md) | 블록/요소 렌더러 |
| [05c_animation_runtime.md](./05c_animation_runtime.md) | 애니메이션 런타임 |
| [01a_core_schema.md](./01a_core_schema.md) | 코어 데이터 스키마 |

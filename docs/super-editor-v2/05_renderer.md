# Super Editor v2 - 렌더러 시스템

> **목표**: 블록/요소 구조를 실제 화면에 렌더링하고, 변수 바인딩 해석 + 애니메이션 런타임 실행
> **핵심 원칙**: 선언적 데이터 → React 컴포넌트 변환 + GSAP/Framer Motion 기반 애니메이션

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

## 2. 컨텍스트 시스템

### 2.1 DocumentContext

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

### 2.2 AnimationContext

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

### 2.3 BlockContext

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

## 3. 변수 바인딩 해석

### 3.1 바인딩 리졸버

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

### 3.2 포맷 문자열 보간

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

### 3.3 동적 변수 리졸버

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

## 4. 문서 렌더러

### 4.1 DocumentRenderer

```typescript
interface DocumentRendererProps {
  document: EditorDocument
  mode: 'preview' | 'viewer'  // 에디터 프리뷰 vs 최종 뷰어
  onBlockClick?: (blockId: string) => void
  selectedBlockId?: string | null
}

function DocumentRenderer({
  document,
  mode,
  onBlockClick,
  selectedBlockId,
}: DocumentRendererProps) {
  const [sharedState, setSharedStateMap] = useState<Record<string, unknown>>({})
  const [viewport, setViewport] = useState({ width: 390, height: 844, isDesktop: false })

  // 뷰포트 크기 감지
  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        isDesktop: window.innerWidth >= 768,
      })
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  const setSharedState = useCallback((key: string, value: unknown) => {
    setSharedStateMap(prev => ({ ...prev, [key]: value }))
  }, [])

  const contextValue: DocumentContextValue = {
    document,
    data: document.data,
    style: document.style,
    animation: document.animation,
    sharedState,
    setSharedState,
    viewport,
  }

  return (
    <DocumentContext.Provider value={contextValue}>
      <AnimationProvider>
        <div
          className={cn(
            'document-renderer',
            mode === 'preview' && 'preview-mode',
            mode === 'viewer' && 'viewer-mode'
          )}
          style={getDocumentStyles(document.style)}
        >
          {/* Floating Elements (블록 독립) */}
          {document.floatingElements?.map(floating => (
            <FloatingElementRenderer
              key={floating.id}
              floating={floating}
            />
          ))}

          {/* 전역 인터랙션 */}
          <GlobalInteractionsController
            interactions={document.globalInteractions}
          />

          {/* 블록 목록 */}
          <div className="blocks-container">
            {document.blocks
              .filter(block => block.enabled)
              .map(block => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  isSelected={block.id === selectedBlockId}
                  onClick={() => onBlockClick?.(block.id)}
                />
              ))}
          </div>
        </div>
      </AnimationProvider>
    </DocumentContext.Provider>
  )
}

/**
 * ResolvedStyle → CSS 변수 변환
 *
 * @see 01_data_schema.md §7.10 ResolvedStyle 타입 정의
 */
function getDocumentStyles(resolved: ResolvedStyle): CSSProperties {
  return {
    // 시맨틱 토큰 (색상)
    '--color-bg-page': resolved.tokens['bg-page'],
    '--color-bg-section': resolved.tokens['bg-section'],
    '--color-bg-section-alt': resolved.tokens['bg-section-alt'],
    '--color-fg-default': resolved.tokens['fg-default'],
    '--color-fg-muted': resolved.tokens['fg-muted'],
    '--color-fg-emphasis': resolved.tokens['fg-emphasis'],
    '--color-accent': resolved.tokens['accent-default'],
    '--color-accent-hover': resolved.tokens['accent-hover'],
    '--color-accent-active': resolved.tokens['accent-active'],
    '--color-border-default': resolved.tokens['border-default'],
    '--color-border-muted': resolved.tokens['border-muted'],

    // 타이포그래피
    '--font-heading': resolved.typography.fontStacks.heading?.family.join(', '),
    '--font-body': resolved.typography.fontStacks.body?.family.join(', '),

    // 이펙트
    '--radius-sm': `${resolved.effects.radius.sm}px`,
    '--radius-md': `${resolved.effects.radius.md}px`,
    '--radius-lg': `${resolved.effects.radius.lg}px`,
    '--radius-full': `${resolved.effects.radius.full}px`,
    '--shadow-sm': resolved.effects.shadows.sm,
    '--shadow-md': resolved.effects.shadows.md,
    '--shadow-lg': resolved.effects.shadows.lg,

    // 기본 스타일 적용
    backgroundColor: resolved.tokens['bg-page'],
    color: resolved.tokens['fg-default'],
  } as CSSProperties
}
```

### 4.2 AnimationProvider

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

## 5. 블록 렌더러

### 5.1 BlockRenderer

```typescript
interface BlockRendererProps {
  block: Block
  isSelected?: boolean
  onClick?: () => void
}

function BlockRenderer({ block, isSelected, onClick }: BlockRendererProps) {
  const { style, data } = useDocument()
  const blockRef = useRef<HTMLDivElement>(null)

  // 블록 스타일 계산 (전역 + 오버라이드)
  const blockStyle = useMemo(() => {
    const base: CSSProperties = {
      position: 'relative',
      minHeight: `${block.height}vh`,
      overflow: 'hidden',
    }

    // 블록 배경 오버라이드
    if (block.style?.background) {
      const bg = block.style.background
      if (bg.type === 'color') {
        base.backgroundColor = bg.value
      } else if (bg.type === 'gradient') {
        base.background = bg.value
      } else if (bg.type === 'image') {
        base.backgroundImage = `url(${bg.value})`
        base.backgroundSize = 'cover'
        base.backgroundPosition = 'center'
        if (bg.overlay) {
          // pseudo-element로 처리하거나 별도 div
        }
      }
    }

    // 패딩 오버라이드
    if (block.style?.padding) {
      base.paddingTop = `${block.style.padding.top}vh`
      base.paddingBottom = `${block.style.padding.bottom}vh`
    }

    return base
  }, [block.height, block.style])

  const contextValue: BlockContextValue = useMemo(() => ({
    block,
    blockRef,
    toAbsolutePosition: (relativeY: number) => {
      if (!blockRef.current) return relativeY
      const rect = blockRef.current.getBoundingClientRect()
      return rect.top + (relativeY / 100) * rect.height
    },
  }), [block])

  return (
    <BlockContext.Provider value={contextValue}>
      <section
        ref={blockRef}
        data-block-id={block.id}
        data-block-type={block.type}
        className={cn(
          'block-renderer',
          `block-type-${block.type}`,
          isSelected && 'ring-2 ring-primary'
        )}
        style={blockStyle}
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
      >
        {/* 요소들 렌더링 */}
        {block.elements.map(element => (
          <ElementRenderer
            key={element.id}
            element={element}
          />
        ))}

        {/* 블록 애니메이션 컨트롤러 */}
        {block.animation && (
          <BlockAnimationController
            blockId={block.id}
            animation={block.animation}
            blockRef={blockRef}
          />
        )}

        {/* 선택 하이라이트 오버레이 */}
        {isSelected && (
          <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
        )}
      </section>
    </BlockContext.Provider>
  )
}
```

---

## 6. 요소 렌더러

### 6.1 ElementRenderer (메인)

```typescript
interface ElementRendererProps {
  element: Element
}

function ElementRenderer({ element }: ElementRendererProps) {
  const { data, style: globalStyle } = useDocument()
  const elementRef = useRef<HTMLDivElement>(null)

  // 변수 바인딩 해석
  const resolvedValue = useMemo(() => {
    if (element.binding) {
      return resolveBinding(element.binding, data)
    }
    if (element.props.type === 'text' && element.props.format) {
      return interpolate(element.props.format, data)
    }
    return element.value
  }, [element.binding, element.value, element.props, data])

  // 위치/크기 스타일
  const positionStyle: CSSProperties = useMemo(() => ({
    position: 'absolute',
    left: `${element.x}%`,
    top: `${element.y}%`,
    width: `${element.width}%`,
    height: `${element.height}%`,
    transform: `translate(-50%, -50%) rotate(${element.rotation || 0}deg)`,
    zIndex: element.zIndex,
  }), [element.x, element.y, element.width, element.height, element.rotation, element.zIndex])

  // 타입별 컴포넌트 렌더링
  const content = useMemo(() => {
    switch (element.type) {
      case 'text':
        return (
          <TextElement
            value={resolvedValue as string}
            style={element.style?.text}
            globalStyle={globalStyle}
          />
        )

      case 'image':
        return (
          <ImageElement
            value={resolvedValue as PhotoData | string}
            props={element.props as ImageProps}
            style={element.style}
          />
        )

      case 'shape':
        return (
          <ShapeElement
            props={element.props as ShapeProps}
            style={element.style}
          />
        )

      case 'button':
        return (
          <ButtonElement
            props={element.props as ButtonProps}
            value={resolvedValue}
            style={element.style}
          />
        )

      case 'icon':
        return (
          <IconElement
            props={element.props as IconProps}
          />
        )

      case 'divider':
        return (
          <DividerElement
            props={element.props as DividerProps}
            style={element.style}
          />
        )

      case 'map':
        return (
          <MapElement
            coordinates={resolvedValue as { lat: number; lng: number }}
            props={element.props as MapProps}
          />
        )

      case 'calendar':
        return (
          <CalendarElement
            date={resolvedValue as string}
            props={element.props as CalendarProps}
          />
        )

      default:
        console.warn(`Unknown element type: ${element.type}`)
        return null
    }
  }, [element.type, element.props, element.style, resolvedValue, globalStyle])

  return (
    <div
      ref={elementRef}
      data-element-id={element.id}
      data-element-type={element.type}
      className="element-renderer"
      style={positionStyle}
    >
      {content}

      {/* 요소 애니메이션 컨트롤러 */}
      {element.animation && (
        <ElementAnimationController
          elementId={element.id}
          animation={element.animation}
          elementRef={elementRef}
        />
      )}
    </div>
  )
}
```

### 6.2 TextElement

```typescript
interface TextElementProps {
  value: string
  style?: TextStyle
  globalStyle: GlobalStyle
}

function TextElement({ value, style, globalStyle }: TextElementProps) {
  const textStyle: CSSProperties = useMemo(() => ({
    fontFamily: style?.fontFamily || globalStyle.fonts.body.family,
    fontSize: `${style?.fontSize || globalStyle.fonts.body.size}vw`,
    fontWeight: style?.fontWeight || globalStyle.fonts.body.weight,
    color: style?.color || globalStyle.colors.text.primary,
    textAlign: style?.textAlign || 'center',
    lineHeight: style?.lineHeight || globalStyle.fonts.body.lineHeight,
    letterSpacing: `${style?.letterSpacing || globalStyle.fonts.body.letterSpacing}em`,
    whiteSpace: 'pre-wrap',  // 줄바꿈 유지
    wordBreak: 'keep-all',   // 한글 단어 단위 줄바꿈
  }), [style, globalStyle])

  return (
    <div className="text-element" style={textStyle}>
      {value}
    </div>
  )
}
```

### 6.3 ImageElement

```typescript
interface ImageElementProps {
  value: PhotoData | string
  props: ImageProps
  style?: ElementStyle
}

function ImageElement({ value, props, style }: ImageElementProps) {
  const src = typeof value === 'string' ? value : value?.url
  const alt = typeof value === 'object' ? value?.alt : ''

  if (!src) {
    return <div className="image-placeholder">이미지 없음</div>
  }

  return (
    <div className="image-element" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        src={src}
        alt={alt || ''}
        fill
        style={{
          objectFit: props.objectFit || 'cover',
          borderRadius: style?.border?.radius ? `${style.border.radius}px` : undefined,
        }}
      />

      {/* 오버레이 */}
      {props.overlay && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: props.overlay }}
        />
      )}
    </div>
  )
}
```

### 6.4 MapElement

```typescript
interface MapElementProps {
  coordinates: { lat: number; lng: number } | undefined
  props: MapProps
}

function MapElement({ coordinates, props }: MapElementProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<kakao.maps.Map | null>(null)

  // 카카오맵 초기화
  useEffect(() => {
    if (!coordinates || !mapRef.current) return

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`
    script.async = true

    script.onload = () => {
      kakao.maps.load(() => {
        const options = {
          center: new kakao.maps.LatLng(coordinates.lat, coordinates.lng),
          level: props.zoom || 3,
        }

        const mapInstance = new kakao.maps.Map(mapRef.current!, options)
        setMap(mapInstance)

        // 마커 추가
        if (props.showMarker !== false) {
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(coordinates.lat, coordinates.lng),
          })
          marker.setMap(mapInstance)
        }
      })
    }

    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [coordinates, props.zoom, props.showMarker])

  if (!coordinates) {
    return <div className="map-placeholder">좌표 정보 없음</div>
  }

  return <div ref={mapRef} className="map-element" style={{ width: '100%', height: '100%' }} />
}
```

### 6.5 CalendarElement

```typescript
interface CalendarElementProps {
  date: string  // ISO 8601: '2025-03-15'
  props: CalendarProps
}

function CalendarElement({ date, props }: CalendarElementProps) {
  const { data } = useDocument()

  const weddingDate = useMemo(() => {
    if (!date) return null
    return new Date(date)
  }, [date])

  const dday = useMemo(() => {
    if (!weddingDate) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }, [weddingDate])

  if (!weddingDate) {
    return <div className="calendar-placeholder">날짜 정보 없음</div>
  }

  const year = weddingDate.getFullYear()
  const month = weddingDate.getMonth()
  const day = weddingDate.getDate()
  const dayOfWeek = weddingDate.getDay()

  // 달력 그리드 생성
  const calendar = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const weeks: (number | null)[][] = []
    let week: (number | null)[] = Array(firstDay).fill(null)

    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d)
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }

    if (week.length > 0) {
      while (week.length < 7) week.push(null)
      weeks.push(week)
    }

    return weeks
  }, [year, month])

  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  const highlightColor = props.highlightColor || 'var(--color-accent)'

  return (
    <div className="calendar-element">
      {/* 헤더 */}
      <div className="calendar-header">
        <span className="calendar-year">{year}년</span>
        <span className="calendar-month">{month + 1}월</span>
      </div>

      {/* 요일 */}
      <div className="calendar-days">
        {dayNames.map((name, i) => (
          <div
            key={name}
            className={cn(
              'calendar-day-name',
              i === 0 && 'text-red-500',
              i === 6 && 'text-blue-500'
            )}
          >
            {name}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="calendar-grid">
        {calendar.map((week, wi) => (
          <div key={wi} className="calendar-week">
            {week.map((d, di) => (
              <div
                key={di}
                className={cn(
                  'calendar-date',
                  d === day && 'highlighted'
                )}
                style={d === day ? { backgroundColor: highlightColor, color: '#fff' } : undefined}
              >
                {d}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* D-day */}
      {props.showDday && dday !== null && (
        <div className="calendar-dday">
          {dday === 0 ? 'D-Day' : dday > 0 ? `D-${dday}` : `D+${Math.abs(dday)}`}
        </div>
      )}
    </div>
  )
}
```

### 6.6 ButtonElement

```typescript
interface ButtonElementProps {
  props: ButtonProps
  value: unknown  // 바인딩된 값 (전화번호, URL 등)
  style?: ElementStyle
}

function ButtonElement({ props, value, style }: ButtonElementProps) {
  const handleClick = useCallback(() => {
    switch (props.action) {
      case 'phone':
        if (value) window.location.href = `tel:${value}`
        break

      case 'link':
        if (value) window.open(value as string, '_blank')
        break

      case 'map':
        // 지도 앱 열기
        const coords = value as { lat: number; lng: number }
        if (coords) {
          window.open(`https://map.kakao.com/link/map/${coords.lat},${coords.lng}`, '_blank')
        }
        break

      case 'copy':
        if (value) {
          navigator.clipboard.writeText(String(value))
          toast.success('복사되었습니다')
        }
        break

      case 'share':
        if (navigator.share) {
          navigator.share({
            title: document.title,
            url: window.location.href,
          })
        }
        break
    }
  }, [props.action, value])

  return (
    <button
      className="button-element"
      onClick={handleClick}
      style={{
        backgroundColor: style?.background || 'var(--color-primary)',
        color: style?.text?.color || '#fff',
        borderRadius: style?.border?.radius ? `${style.border.radius}px` : '8px',
        padding: '12px 24px',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {props.label}
    </button>
  )
}
```

---

## 7. 애니메이션 런타임

### 7.1 BlockAnimationController

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

### 7.2 액션 실행기

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

### 7.3 AnimationProperties → GSAP 변환

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

### 7.4 타겟 리졸버

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

### 7.5 인터랙션 설정

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

### 7.6 상태 머신 인스턴스

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

## 8. Floating 요소 렌더러

### 8.1 FloatingElementRenderer

```typescript
interface FloatingElementRendererProps {
  floating: FloatingElement
}

function FloatingElementRenderer({ floating }: FloatingElementRendererProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  // 스크롤 범위 가시성
  useEffect(() => {
    if (!floating.scrollRange) return

    const checkVisibility = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollY / docHeight

      // start/end 파싱 (간단화된 버전)
      const startPercent = parseScrollPosition(floating.scrollRange!.start)
      const endPercent = parseScrollPosition(floating.scrollRange!.end)

      setIsVisible(progress >= startPercent && progress <= endPercent)
    }

    window.addEventListener('scroll', checkVisibility, { passive: true })
    checkVisibility()

    return () => window.removeEventListener('scroll', checkVisibility)
  }, [floating.scrollRange])

  if (!isVisible) return null

  const style: CSSProperties = {
    position: floating.position,
    zIndex: floating.zIndex,
    width: floating.width,
    height: floating.height,
    ...resolveAnchor(floating.anchor, floating.offset),
  }

  return (
    <div
      ref={elementRef}
      data-floating-id={floating.id}
      className="floating-element"
      style={style}
    >
      <FloatingContent type={floating.type} content={floating.content} />

      {/* 인터랙션 */}
      {floating.interactions && (
        <InteractionsController
          interactions={floating.interactions}
          containerRef={elementRef}
        />
      )}

      {/* 상태 머신 */}
      {floating.stateMachine && (
        <StateMachineController
          definition={floating.stateMachine}
          containerRef={elementRef}
        />
      )}
    </div>
  )
}

function resolveAnchor(
  anchor: FloatingElement['anchor'],
  offset?: { x: number; y: number }
): CSSProperties {
  const style: CSSProperties = {}

  // X 위치
  if (anchor.x === 'left') {
    style.left = offset?.x || 0
  } else if (anchor.x === 'center') {
    style.left = '50%'
    style.transform = 'translateX(-50%)'
  } else if (anchor.x === 'right') {
    style.right = offset?.x || 0
  } else {
    style.left = `${anchor.x}vw`
  }

  // Y 위치
  if (anchor.y === 'top') {
    style.top = offset?.y || 0
  } else if (anchor.y === 'center') {
    style.top = '50%'
    style.transform = (style.transform || '') + ' translateY(-50%)'
  } else if (anchor.y === 'bottom') {
    style.bottom = offset?.y || 0
  } else {
    style.top = `${anchor.y}vh`
  }

  return style
}

function FloatingContent({
  type,
  content,
}: {
  type: FloatingElement['type']
  content: string
}) {
  switch (type) {
    case 'svg':
      return <div dangerouslySetInnerHTML={{ __html: content }} />

    case 'image':
      return <Image src={content} alt="" fill style={{ objectFit: 'contain' }} />

    case 'lottie':
      return <LottiePlayer src={content} autoplay loop />

    case 'text':
      return <span>{content}</span>

    case 'html':
      return <div dangerouslySetInnerHTML={{ __html: content }} />

    default:
      return null
  }
}

function parseScrollPosition(position: string): number {
  if (position.endsWith('%')) {
    return parseFloat(position) / 100
  }

  // 'block-id top' 형식은 별도 처리 필요
  // 간단화를 위해 0.5 반환
  return 0.5
}
```

---

## 9. 성능 최적화

### 9.1 가상화 (긴 문서)

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualizedBlocks({ blocks }: { blocks: Block[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: blocks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => blocks[index].height * (window.innerHeight / 100),
    overscan: 2,  // 위/아래 2개 블록 미리 렌더
  })

  return (
    <div ref={parentRef} style={{ height: '100vh', overflow: 'auto' }}>
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <BlockRenderer block={blocks[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 9.2 메모이제이션

```typescript
// 블록 메모이제이션
const MemoizedBlockRenderer = memo(BlockRenderer, (prev, next) => {
  return (
    prev.block.id === next.block.id &&
    prev.block.enabled === next.block.enabled &&
    prev.isSelected === next.isSelected &&
    JSON.stringify(prev.block.elements) === JSON.stringify(next.block.elements)
  )
})

// 요소 메모이제이션
const MemoizedElementRenderer = memo(ElementRenderer, (prev, next) => {
  return prev.element.id === next.element.id
})

// 스타일 메모이제이션
const useComputedStyles = (element: Element, globalStyle: GlobalStyle) => {
  return useMemo(() => {
    return computeElementStyles(element, globalStyle)
  }, [element.style, globalStyle])
}
```

### 9.3 이미지 지연 로딩

```typescript
function LazyImage({
  src,
  alt,
  ...props
}: ImageProps & { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }  // 200px 전에 로드 시작
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} className="lazy-image-container">
      {isLoaded ? (
        <Image src={src} alt={alt} {...props} />
      ) : (
        <div className="image-skeleton" />
      )}
    </div>
  )
}
```

### 9.4 애니메이션 throttle

```typescript
function useThrottledScroll(callback: (scrollY: number) => void, delay = 16) {
  const lastCall = useRef(0)
  const rafId = useRef<number>()

  useEffect(() => {
    const handler = () => {
      const now = Date.now()
      if (now - lastCall.current >= delay) {
        lastCall.current = now
        callback(window.scrollY)
      }
    }

    const throttledHandler = () => {
      if (rafId.current) return
      rafId.current = requestAnimationFrame(() => {
        handler()
        rafId.current = undefined
      })
    }

    window.addEventListener('scroll', throttledHandler, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledHandler)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [callback, delay])
}
```

---

## 10. SSR 지원

### 10.1 서버 렌더링

```typescript
// app/se/[id]/page.tsx
async function InvitationPage({ params }: { params: { id: string } }) {
  const document = await getInvitationDocument(params.id)

  if (!document) {
    notFound()
  }

  return (
    <>
      {/* OG 메타데이터 */}
      <InvitationMetadata document={document} />

      {/* 서버 렌더링된 정적 HTML */}
      <Suspense fallback={<InvitationSkeleton />}>
        <ClientDocumentRenderer document={document} />
      </Suspense>
    </>
  )
}
```

### 10.2 클라이언트 하이드레이션

```typescript
'use client'

function ClientDocumentRenderer({ document }: { document: EditorDocument }) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)

    // GSAP 플러그인 등록
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, MorphSVGPlugin)
  }, [])

  if (!isHydrated) {
    // 서버에서 렌더링된 정적 HTML
    return <StaticDocumentRenderer document={document} />
  }

  // 클라이언트에서 인터랙티브 렌더링
  return <DocumentRenderer document={document} mode="viewer" />
}

// 정적 렌더링 (애니메이션 없음)
function StaticDocumentRenderer({ document }: { document: EditorDocument }) {
  return (
    <div className="document-static">
      {document.blocks
        .filter(b => b.enabled)
        .map(block => (
          <StaticBlockRenderer key={block.id} block={block} data={document.data} />
        ))}
    </div>
  )
}
```

---

## 11. 스타일 시스템 런타임

### 11.1 스타일 해석 파이프라인

```typescript
function resolveStyleSystem(input: StyleSystem): ResolvedStyle {
  // 1. 기본값 로드
  let result = cloneDeep(DEFAULT_STYLE)

  // 2. 프리셋 병합 (레벨 1)
  if (input.preset && THEME_PRESETS[input.preset]) {
    result = mergeDeep(result, THEME_PRESETS[input.preset])
  }

  // 3. 빠른 설정 적용 (레벨 2)
  if (input.quick) {
    // 사진 추출
    if (input.quick.photoExtraction?.enabled) {
      const extracted = await extractPaletteOptimized(
        input.quick.photoExtraction.source,
        input.quick.photoExtraction
      )
      result = applyExtractedPalette(result, extracted)
    }

    // 색상 오버라이드
    if (input.quick.dominantColor) {
      result = derivePaletteFromDominant(result, input.quick.dominantColor)
    }
    if (input.quick.accentColor) {
      result.tokens['accent-default'] = input.quick.accentColor
      result.tokens['accent-hover'] = lighten(input.quick.accentColor, 0.1)
      result.tokens['accent-active'] = darken(input.quick.accentColor, 0.1)
    }

    // 무드/대비 조정
    if (input.quick.mood) {
      result = adjustMood(result, input.quick.mood)
    }
    if (input.quick.contrast) {
      result = adjustContrast(result, input.quick.contrast)
    }
  }

  // 4. 고급 설정 오버라이드 (레벨 3)
  if (input.advanced) {
    if (input.advanced.palette) {
      result.palette = input.advanced.palette
    }
    if (input.advanced.tokens) {
      result.tokens = { ...result.tokens, ...input.advanced.tokens }
    }
    if (input.advanced.blockOverrides) {
      result.blockOverrides = input.advanced.blockOverrides
    }
  }

  // 5. 타이포그래피 해석
  result.typography = resolveTypography(input.typography)

  // 6. 이펙트 해석
  result.effects = resolveEffects(input.effects)

  // 7. 대비 검증 및 자동 보정
  result = ensureAccessibleContrast(result)

  return result
}
```

### 11.2 CSS 변수 생성

```typescript
function generateCSSVariables(resolved: ResolvedStyle): string {
  const vars: string[] = []

  // 색상 토큰
  for (const [key, value] of Object.entries(resolved.tokens)) {
    if (typeof value === 'string') {
      vars.push(`--${key}: ${value};`)
    } else if (isGradient(value)) {
      vars.push(`--${key}: ${gradientToCSS(value)};`)
    }
  }

  // 팔레트 색상
  resolved.palette.forEach((color, i) => {
    vars.push(`--palette-${i}: ${typeof color.value === 'string' ? color.value : gradientToCSS(color.value)};`)
    if (color.variants) {
      vars.push(`--palette-${i}-light: ${color.variants.light};`)
      vars.push(`--palette-${i}-dark: ${color.variants.dark};`)
      vars.push(`--palette-${i}-muted: ${color.variants.muted};`)
    }
  })

  // 타이포그래피
  for (const [stackId, stack] of Object.entries(resolved.typography.fontStacks)) {
    vars.push(`--font-${stackId}: ${stack.family.join(', ')};`)
  }

  for (const [scaleId, style] of Object.entries(resolved.typography.scale)) {
    vars.push(`--type-${scaleId}-size: ${style.size}${style.sizeUnit};`)
    vars.push(`--type-${scaleId}-weight: ${style.weight};`)
    vars.push(`--type-${scaleId}-line-height: ${style.lineHeight};`)
  }

  // 이펙트
  for (const [key, value] of Object.entries(resolved.effects.shadows)) {
    vars.push(`--shadow-${key}: ${value};`)
  }

  for (const [key, value] of Object.entries(resolved.effects.radius)) {
    vars.push(`--radius-${key}: ${value}px;`)
  }

  return `:root {\n  ${vars.join('\n  ')}\n}`
}

// 그라데이션 → CSS 변환
function gradientToCSS(g: GradientValue): string {
  const stops = g.stops
    .map(s => {
      const color = s.opacity !== undefined
        ? hexToRgba(s.color, s.opacity)
        : s.color
      return `${color} ${s.position}%`
    })
    .join(', ')

  switch (g.type) {
    case 'linear':
      return `linear-gradient(${g.angle || 180}deg, ${stops})`
    case 'radial':
      const shape = g.shape || 'ellipse'
      const pos = g.position || 'center'
      return `radial-gradient(${shape} at ${pos}, ${stops})`
    case 'conic':
      return `conic-gradient(from ${g.from || 0}deg, ${stops})`
  }
}
```

### 11.3 K-means 사진 팔레트 추출

이미지를 **100x100으로 축소** 후 K-means 실행하여 성능과 품질 모두 확보.

```typescript
interface PhotoPaletteConfig {
  extraction: {
    algorithm: 'kmeans'
    colorCount: number        // 추출할 색상 개수 (4-8)
    optimization: {
      resizeWidth: number     // 기본: 100
      resizeHeight: number    // 기본: 100
      maxIterations: number   // 기본: 10
      convergenceThreshold: number
    }
  }
  mapping: {
    dominant: 'most-common' | 'most-saturated' | 'darkest' | 'lightest'
    accent: 'complementary' | 'second-common' | 'most-saturated'
    text: 'auto-contrast'
  }
}

interface ExtractedPalette {
  colors: ExtractedColor[]
  mappedTokens: Partial<SemanticTokens>
  contrastValidation: ContrastValidation
  meta: {
    sourceHash: string
    extractedAt: number
    algorithm: string
    processingTime: number
  }
}

/**
 * 사진에서 색상 팔레트 추출 (최적화 버전)
 *
 * ⚠️ 성능 고려사항:
 * - K-means 클러스터링은 CPU 집약적 작업
 * - 메인 스레드 블로킹 방지를 위해 Web Worker 사용 권장
 * - 아래 코드는 Worker 분리 전 참조 구현
 *
 * @see style/extraction/kmeans.worker.ts (실제 구현 시 Worker 분리)
 */
async function extractPaletteOptimized(
  imageUrl: string,
  config: PhotoPaletteConfig
): Promise<ExtractedPalette> {
  const startTime = performance.now()

  // 1. 이미지 로드 및 리사이즈 (100x100)
  const { width, height } = config.extraction.optimization
  const resizedPixels = await loadAndResizeImage(imageUrl, width, height)

  // 2. K-means 클러스터링 (Worker에서 실행 권장)
  // TODO: Web Worker로 분리하여 UI 블로킹 방지
  // const clusters = await kmeansWorker.postMessage({ pixels, options })
  const { colorCount, optimization } = config.extraction
  const clusters = kMeansClustering(resizedPixels, {
    k: colorCount,
    maxIterations: optimization.maxIterations,
    convergenceThreshold: optimization.convergenceThreshold,
  })

  // 3. 클러스터 → 색상 변환 (population 계산)
  const totalPixels = width * height
  const colors: ExtractedColor[] = clusters
    .map(cluster => ({
      hex: rgbToHex(cluster.centroid),
      rgb: cluster.centroid as [number, number, number],
      hsl: rgbToHsl(cluster.centroid),
      lab: rgbToLab(cluster.centroid),
      population: cluster.size / totalPixels,
    }))
    .sort((a, b) => b.population - a.population)

  // 4. 토큰 자동 매핑
  const mappedTokens = mapColorsToTokens(colors, config.mapping)

  // 5. 대비 검증
  const contrastValidation = validateAllContrasts(mappedTokens)

  return {
    colors,
    mappedTokens,
    contrastValidation,
    meta: {
      sourceHash: await hashImage(imageUrl),
      extractedAt: Date.now(),
      algorithm: 'kmeans-optimized',
      processingTime: performance.now() - startTime,
    },
  }
}

// K-means 핵심 알고리즘
function kMeansClustering(
  pixels: number[][],
  options: { k: number; maxIterations: number; convergenceThreshold: number }
): Cluster[] {
  const { k, maxIterations, convergenceThreshold } = options

  // 초기 중심점 선택 (k-means++)
  let centroids = initializeCentroidsKMeansPlusPlus(pixels, k)
  let clusters: Cluster[] = []

  for (let iter = 0; iter < maxIterations; iter++) {
    // 1. 각 픽셀을 가장 가까운 중심에 할당
    clusters = Array.from({ length: k }, () => ({
      centroid: [0, 0, 0],
      pixels: [] as number[][],
      size: 0,
    }))

    for (const pixel of pixels) {
      const nearestIdx = findNearestCentroid(pixel, centroids)
      clusters[nearestIdx].pixels.push(pixel)
      clusters[nearestIdx].size++
    }

    // 2. 중심점 재계산
    const prevCentroids = centroids
    centroids = clusters.map(cluster => {
      if (cluster.size === 0) return cluster.centroid
      return [
        cluster.pixels.reduce((sum, p) => sum + p[0], 0) / cluster.size,
        cluster.pixels.reduce((sum, p) => sum + p[1], 0) / cluster.size,
        cluster.pixels.reduce((sum, p) => sum + p[2], 0) / cluster.size,
      ]
    })

    // 3. 수렴 체크
    const maxMovement = Math.max(
      ...centroids.map((c, i) => colorDistance(c, prevCentroids[i]))
    )
    if (maxMovement < convergenceThreshold) break
  }

  // 최종 중심점 저장
  clusters.forEach((cluster, i) => {
    cluster.centroid = centroids[i]
  })

  return clusters.filter(c => c.size > 0)
}

// 이미지 로드 및 리사이즈 (Canvas 사용)
async function loadAndResizeImage(
  url: string,
  targetWidth: number,
  targetHeight: number
): Promise<number[][]> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight)
      const pixels: number[][] = []

      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] < 128) continue // 투명 픽셀 제외
        pixels.push([
          imageData.data[i],     // R
          imageData.data[i + 1], // G
          imageData.data[i + 2], // B
        ])
      }

      resolve(pixels)
    }

    img.onerror = reject
    img.src = url
  })
}
```

### 11.4 색상 매핑 및 대비 검증

```typescript
function mapColorsToTokens(
  colors: ExtractedColor[],
  mapping: PhotoPaletteConfig['mapping']
): Partial<SemanticTokens> {
  // Dominant 선택
  let dominant: ExtractedColor
  switch (mapping.dominant) {
    case 'most-common':
      dominant = colors[0]
      break
    case 'most-saturated':
      dominant = [...colors].sort((a, b) => b.hsl[1] - a.hsl[1])[0]
      break
    case 'darkest':
      dominant = [...colors].sort((a, b) => a.hsl[2] - b.hsl[2])[0]
      break
    case 'lightest':
      dominant = [...colors].sort((a, b) => b.hsl[2] - a.hsl[2])[0]
      break
  }

  // Accent 선택
  let accent: ExtractedColor
  switch (mapping.accent) {
    case 'complementary':
      accent = findComplementary(dominant, colors)
      break
    case 'second-common':
      accent = colors.find(c => c.hex !== dominant.hex) || dominant
      break
    case 'most-saturated':
      accent = [...colors]
        .filter(c => c.hex !== dominant.hex)
        .sort((a, b) => b.hsl[1] - a.hsl[1])[0] || dominant
      break
  }

  // Text 자동 계산 (대비 기반)
  const isDark = dominant.hsl[2] < 0.5
  const textDefault = isDark ? '#FFFFFF' : '#1A1A1A'
  const textMuted = isDark ? '#CCCCCC' : '#666666'

  return {
    'bg-page': dominant.hex,
    'bg-section': dominant.hex,
    'bg-section-alt': adjustLightness(dominant.hex, isDark ? 0.1 : -0.1),
    'fg-default': textDefault,
    'fg-muted': textMuted,
    'fg-emphasis': accent.hex,
    'accent-default': accent.hex,
    'accent-secondary': colors[2]?.hex || accent.hex,
  }
}

interface ContrastValidation {
  pairs: {
    foreground: string
    background: string
    ratio: number
    wcagAA: boolean   // >= 4.5:1
    wcagAAA: boolean  // >= 7:1
  }[]
  passesAA: boolean
  passesAAA: boolean
  suggestions?: string[]
}

function validateAllContrasts(tokens: Partial<SemanticTokens>): ContrastValidation {
  const pairs = [
    { fg: 'fg-default', bg: 'bg-page' },
    { fg: 'fg-default', bg: 'bg-section' },
    { fg: 'fg-muted', bg: 'bg-page' },
    { fg: 'fg-emphasis', bg: 'bg-page' },
  ]

  const results = pairs.map(({ fg, bg }) => {
    const fgColor = tokens[fg as keyof SemanticTokens] as string
    const bgColor = tokens[bg as keyof SemanticTokens] as string

    if (!fgColor || !bgColor) return null

    const ratio = getContrastRatio(fgColor, bgColor)
    return {
      foreground: fg,
      background: bg,
      ratio,
      wcagAA: ratio >= 4.5,
      wcagAAA: ratio >= 7,
    }
  }).filter(Boolean) as ContrastValidation['pairs']

  const passesAA = results.every(r => r.wcagAA)
  const passesAAA = results.every(r => r.wcagAAA)

  const suggestions: string[] = []
  results.forEach(r => {
    if (!r.wcagAA) {
      suggestions.push(
        `${r.foreground}/${r.background} 대비 부족 (${r.ratio.toFixed(2)}:1)`
      )
    }
  })

  return { pairs: results, passesAA, passesAAA, suggestions }
}
```

---

## 12. 디렉토리 구조

```
src/lib/super-editor-v2/
├── renderers/
│   ├── DocumentRenderer.tsx     # 최상위 문서 렌더러
│   ├── BlockRenderer.tsx        # 블록 렌더러
│   ├── ElementRenderer.tsx      # 요소 라우터
│   ├── FloatingRenderer.tsx     # 플로팅 요소
│   │
│   ├── elements/
│   │   ├── TextElement.tsx
│   │   ├── ImageElement.tsx
│   │   ├── ShapeElement.tsx
│   │   ├── ButtonElement.tsx
│   │   ├── IconElement.tsx
│   │   ├── DividerElement.tsx
│   │   ├── MapElement.tsx
│   │   └── CalendarElement.tsx
│   │
│   └── static/
│       ├── StaticDocumentRenderer.tsx
│       └── StaticBlockRenderer.tsx
│
├── animation/
│   ├── AnimationProvider.tsx    # 애니메이션 컨텍스트
│   ├── BlockAnimationController.tsx
│   ├── ElementAnimationController.tsx
│   ├── action-executor.ts       # 액션 실행기
│   ├── trigger-setup.ts         # 트리거 설정
│   ├── state-machine.ts         # 상태 머신 런타임
│   └── gsap-utils.ts            # GSAP 변환 유틸
│
├── context/
│   ├── DocumentContext.tsx
│   ├── AnimationContext.tsx
│   └── BlockContext.tsx
│
├── binding/
│   ├── resolver.ts              # 바인딩 리졸버
│   ├── interpolate.ts           # 포맷 보간
│   ├── path-utils.ts            # 경로 파싱
│   └── computed-fields.ts       # Computed 필드 정의
│
├── optimization/
│   ├── virtualization.tsx       # 가상화
│   ├── memoization.ts           # 메모이제이션 래퍼
│   ├── lazy-image.tsx           # 지연 로딩 이미지
│   └── throttle.ts              # 스크롤 쓰로틀
│
├── style/
│   ├── resolver.ts              # resolveStyleSystem()
│   ├── css-generator.ts         # generateCSSVariables()
│   ├── extraction/
│   │   ├── kmeans.ts            # K-means 클러스터링
│   │   ├── palette.ts           # extractPaletteOptimized()
│   │   └── mapping.ts           # mapColorsToTokens()
│   └── utils/
│       ├── color.ts             # 색상 변환 (rgb/hsl/lab)
│       ├── contrast.ts          # WCAG 대비 계산
│       └── derive.ts            # derivePaletteFromDominant()
│
└── types/
    ├── document.ts              # EditorDocument 타입
    ├── block.ts                 # Block 타입
    ├── element.ts               # Element 타입
    ├── animation.ts             # Animation 타입
    └── style.ts                 # Style 타입
```

---

## 13. 다음 단계

- [x] `01_data_schema.md` - 블록/요소 구조 + 스타일 시스템 타입
- [x] `02_animation_system.md` - 애니메이션 시스템
- [x] `03_variables.md` - 변수 시스템
- [x] `04_editor_ui.md` - 에디터 UI + AI 컨텍스트 압축
- [x] `05_renderer.md` - 렌더링 시스템 + 스타일 런타임 (현재 문서)
- [x] `06_web_worker.md` - Web Worker 시스템 (K-means 색상 추출 등)
- [ ] `07_ai_prompts.md` - AI 프롬프트 템플릿 + 컨텍스트 주입

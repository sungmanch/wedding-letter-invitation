# Super Editor v2 - 블록 & 요소 렌더러

> **목표**: 블록과 요소를 실제 화면에 렌더링
> **핵심 원칙**: 선언적 데이터 → React 컴포넌트 변환

---

## 1. DocumentRenderer

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

---

## 2. BlockRenderer

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

## 3. ElementRenderer (메인)

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

---

## 4. 개별 요소 컴포넌트

### 4.1 TextElement

```typescript
interface TextElementProps {
  value: string
  style?: TextStyle
  globalStyle: GlobalStyle
}

function TextElement({ value, style, globalStyle }: TextElementProps) {
  const bodyFont = globalStyle.typography.fontStacks.body
  const bodyScale = globalStyle.typography.scale.body

  const textStyle: CSSProperties = useMemo(() => ({
    fontFamily: style?.fontFamily || bodyFont.family.join(', '),
    fontSize: `${style?.fontSize || bodyScale.size}${bodyScale.sizeUnit}`,
    fontWeight: style?.fontWeight || bodyScale.weight,
    color: style?.color || globalStyle.tokens['fg-default'],
    textAlign: style?.textAlign || 'center',
    lineHeight: style?.lineHeight || bodyScale.lineHeight,
    letterSpacing: `${style?.letterSpacing || bodyScale.letterSpacing}em`,
    whiteSpace: 'pre-wrap',  // 줄바꿈 유지
    wordBreak: 'keep-all',   // 한글 단어 단위 줄바꿈
  }), [style, globalStyle, bodyFont, bodyScale])

  return (
    <div className="text-element" style={textStyle}>
      {value}
    </div>
  )
}
```

### 4.2 ImageElement

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

### 4.3 MapElement

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

### 4.4 CalendarElement

```typescript
interface CalendarElementProps {
  date: string  // ISO 8601: '2025-03-15'
  props: CalendarProps
}

function CalendarElement({ date, props }: CalendarElementProps) {
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

### 4.5 ButtonElement

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

## 5. Floating 요소 렌더러

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
```

---

## 6. 관련 문서

| 문서 | 내용 |
|------|------|
| [05a_context_providers.md](./05a_context_providers.md) | 컨텍스트 시스템 |
| [05c_animation_runtime.md](./05c_animation_runtime.md) | 애니메이션 런타임 |
| [05d_style_resolver.md](./05d_style_resolver.md) | 스타일 해석 |

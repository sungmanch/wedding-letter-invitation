# Super Editor v2 - 스타일 시스템 런타임

> **목표**: 3-Level 스타일 시스템 해석 및 K-means 색상 추출
> **핵심 원칙**: 선언적 스타일 → CSS 변수 변환

---

## 1. 스타일 해석 파이프라인

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

---

## 2. CSS 변수 생성

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

---

## 3. K-means 사진 팔레트 추출

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
 * @see 06_web_worker.md (실제 구현 시 Worker 분리)
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
```

---

## 4. K-means 핵심 알고리즘

```typescript
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

---

## 5. 색상 매핑 및 대비 검증

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

## 6. 성능 최적화

### 6.1 가상화 (긴 문서)

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

### 6.2 메모이제이션

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

### 6.3 이미지 지연 로딩

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

---

## 7. SSR 지원

### 7.1 서버 렌더링

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

### 7.2 클라이언트 하이드레이션

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

## 8. 관련 문서

| 문서 | 내용 |
|------|------|
| [01b_style_system.md](./01b_style_system.md) | 3-Level 스타일 시스템 |
| [06_web_worker.md](./06_web_worker.md) | Web Worker (K-means 분리) |
| [05a_context_providers.md](./05a_context_providers.md) | 컨텍스트 시스템 |

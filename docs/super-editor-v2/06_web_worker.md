# Super Editor v2 - Web Worker 시스템

> **목표**: CPU 집약적 작업을 메인 스레드에서 분리하여 UI 블로킹 방지
> **핵심 원칙**: 이미지 처리, 색상 추출, 애니메이션 계산 등을 Worker에서 비동기 실행

---

## 1. 설계 원칙

### 1.1 핵심 결정사항

| 항목 | 결정 |
|------|------|
| **Worker 유형** | Dedicated Worker (단일 스레드) |
| **통신 방식** | postMessage + Transferable Objects |
| **번들링** | Next.js worker-loader 또는 Comlink |
| **폴백** | Worker 미지원 시 메인 스레드 실행 |
| **타입 안전성** | 공유 타입 정의 + Comlink 래퍼 |

### 1.2 Worker가 필요한 작업

| 작업 | 예상 시간 (메인) | 블로킹 영향 | 우선순위 |
|------|-----------------|------------|----------|
| **K-means 색상 추출** | 50-200ms | 스타일 편집 시 프리뷰 멈춤 | 🔴 High |
| **이미지 리사이즈** | 30-100ms | 갤러리 업로드 시 지연 | 🟡 Medium |
| **WCAG 대비 검증** | 10-30ms | 스타일 변경마다 발생 | 🟢 Low |
| **애니메이션 경로 계산** | 20-50ms | 복잡한 path 애니메이션 | 🟢 Low |

---

## 2. 아키텍처

### 2.1 전체 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                        Main Thread                               │
├─────────────────────────────────────────────────────────────────┤
│  StyleEditor.tsx                                                 │
│       │                                                          │
│       ▼                                                          │
│  useColorExtraction() ──────┐                                    │
│       │                     │                                    │
│       ▼                     ▼                                    │
│  WorkerPool ◄──────── workerManager.ts                          │
│       │                     │                                    │
└───────│─────────────────────│────────────────────────────────────┘
        │ postMessage         │ terminate
        ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Worker Thread                             │
├─────────────────────────────────────────────────────────────────┤
│  kmeans.worker.ts                                                │
│       │                                                          │
│       ├── loadAndResizeImage()                                   │
│       ├── kMeansClustering()                                     │
│       ├── mapColorsToTokens()                                    │
│       └── validateContrasts()                                    │
│                                                                  │
│  [OffscreenCanvas] ◄─── 이미지 처리                              │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 디렉토리 구조

```
src/lib/super-editor-v2/
├── workers/
│   ├── index.ts                 # Worker 매니저 (싱글톤)
│   ├── types.ts                 # 공유 타입 정의
│   │
│   ├── kmeans.worker.ts         # K-means 색상 추출
│   ├── image.worker.ts          # 이미지 리사이즈/최적화
│   ├── contrast.worker.ts       # WCAG 대비 검증
│   └── path.worker.ts           # 애니메이션 경로 계산
│
├── hooks/
│   ├── useColorExtraction.ts    # K-means 훅
│   ├── useImageProcessor.ts     # 이미지 처리 훅
│   └── useContrastChecker.ts    # 대비 검증 훅
│
└── style/
    └── extraction/
        ├── palette.ts           # 메인 스레드 폴백
        └── kmeans.ts            # 알고리즘 (Worker에서 import)
```

---

## 3. K-means Worker 구현

### 3.1 공유 타입 정의

```typescript
// workers/types.ts

/** Worker 요청 메시지 */
export interface KmeansRequest {
  type: 'EXTRACT_PALETTE'
  payload: {
    imageData: ImageData        // Transferable
    options: {
      colorCount: number        // 추출할 색상 개수 (4-8)
      maxIterations: number     // 최대 반복 횟수 (기본: 10)
      convergenceThreshold: number
    }
    mapping: {
      dominant: 'most-common' | 'most-saturated' | 'darkest' | 'lightest'
      accent: 'complementary' | 'second-common' | 'most-saturated'
    }
  }
}

/** Worker 응답 메시지 */
export interface KmeansResponse {
  type: 'EXTRACT_PALETTE_RESULT'
  payload: ExtractedPalette
}

export interface KmeansErrorResponse {
  type: 'EXTRACT_PALETTE_ERROR'
  error: string
}

/** 추출된 색상 정보 */
export interface ExtractedColor {
  hex: string
  rgb: [number, number, number]
  hsl: [number, number, number]
  lab: [number, number, number]
  population: number  // 0-1 비율
}

/** 추출 결과 */
export interface ExtractedPalette {
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

export interface ContrastValidation {
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
```

### 3.2 Worker 구현

```typescript
// workers/kmeans.worker.ts

import type { KmeansRequest, KmeansResponse, KmeansErrorResponse, ExtractedColor } from './types'

// Worker 컨텍스트
const ctx: Worker = self as unknown as Worker

ctx.onmessage = async (event: MessageEvent<KmeansRequest>) => {
  const { type, payload } = event.data

  if (type !== 'EXTRACT_PALETTE') {
    return
  }

  const startTime = performance.now()

  try {
    const { imageData, options, mapping } = payload

    // 1. ImageData → 픽셀 배열 변환
    const pixels = imageDataToPixels(imageData)

    // 2. K-means 클러스터링
    const clusters = kMeansClustering(pixels, options)

    // 3. 클러스터 → 색상 변환
    const totalPixels = imageData.width * imageData.height
    const colors: ExtractedColor[] = clusters
      .map(cluster => ({
        hex: rgbToHex(cluster.centroid),
        rgb: cluster.centroid as [number, number, number],
        hsl: rgbToHsl(cluster.centroid),
        lab: rgbToLab(cluster.centroid),
        population: cluster.size / totalPixels,
      }))
      .sort((a, b) => b.population - a.population)

    // 4. 토큰 매핑
    const mappedTokens = mapColorsToTokens(colors, mapping)

    // 5. 대비 검증
    const contrastValidation = validateAllContrasts(mappedTokens)

    // 6. 결과 전송
    const response: KmeansResponse = {
      type: 'EXTRACT_PALETTE_RESULT',
      payload: {
        colors,
        mappedTokens,
        contrastValidation,
        meta: {
          sourceHash: hashPixels(pixels),
          extractedAt: Date.now(),
          algorithm: 'kmeans-worker',
          processingTime: performance.now() - startTime,
        },
      },
    }

    ctx.postMessage(response)

  } catch (error) {
    const errorResponse: KmeansErrorResponse = {
      type: 'EXTRACT_PALETTE_ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
    ctx.postMessage(errorResponse)
  }
}

// ─────────────────────────────────────────────────────────────
// K-means 핵심 알고리즘
// ─────────────────────────────────────────────────────────────

interface Cluster {
  centroid: number[]
  pixels: number[][]
  size: number
}

function imageDataToPixels(imageData: ImageData): number[][] {
  const pixels: number[][] = []
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    // 투명 픽셀 제외
    if (data[i + 3] < 128) continue

    pixels.push([data[i], data[i + 1], data[i + 2]])
  }

  return pixels
}

function kMeansClustering(
  pixels: number[][],
  options: { colorCount: number; maxIterations: number; convergenceThreshold: number }
): Cluster[] {
  const { colorCount: k, maxIterations, convergenceThreshold } = options

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

function initializeCentroidsKMeansPlusPlus(pixels: number[][], k: number): number[][] {
  const centroids: number[][] = []

  // 첫 번째 중심점: 랜덤 선택
  centroids.push(pixels[Math.floor(Math.random() * pixels.length)])

  // 나머지 중심점: 거리 기반 확률적 선택
  for (let i = 1; i < k; i++) {
    const distances = pixels.map(pixel => {
      const minDist = Math.min(
        ...centroids.map(c => colorDistance(pixel, c))
      )
      return minDist * minDist  // 거리 제곱으로 가중치
    })

    const totalDist = distances.reduce((a, b) => a + b, 0)
    let random = Math.random() * totalDist

    for (let j = 0; j < pixels.length; j++) {
      random -= distances[j]
      if (random <= 0) {
        centroids.push(pixels[j])
        break
      }
    }
  }

  return centroids
}

function findNearestCentroid(pixel: number[], centroids: number[][]): number {
  let minDist = Infinity
  let nearestIdx = 0

  for (let i = 0; i < centroids.length; i++) {
    const dist = colorDistance(pixel, centroids[i])
    if (dist < minDist) {
      minDist = dist
      nearestIdx = i
    }
  }

  return nearestIdx
}

function colorDistance(a: number[], b: number[]): number {
  // 유클리드 거리 (RGB 공간)
  return Math.sqrt(
    (a[0] - b[0]) ** 2 +
    (a[1] - b[1]) ** 2 +
    (a[2] - b[2]) ** 2
  )
}

// ─────────────────────────────────────────────────────────────
// 색상 변환 유틸
// ─────────────────────────────────────────────────────────────

function rgbToHex(rgb: number[]): string {
  return '#' + rgb.map(c =>
    Math.round(c).toString(16).padStart(2, '0')
  ).join('')
}

function rgbToHsl(rgb: number[]): [number, number, number] {
  const r = rgb[0] / 255
  const g = rgb[1] / 255
  const b = rgb[2] / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) {
    return [0, 0, l]
  }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h = 0
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
    case g: h = ((b - r) / d + 2) / 6; break
    case b: h = ((r - g) / d + 4) / 6; break
  }

  return [h, s, l]
}

function rgbToLab(rgb: number[]): [number, number, number] {
  // RGB → XYZ → LAB
  let r = rgb[0] / 255
  let g = rgb[1] / 255
  let b = rgb[2] / 255

  // sRGB → Linear RGB
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

  // Linear RGB → XYZ (D65 illuminant)
  const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047
  const y = (r * 0.2126729 + g * 0.7151522 + b * 0.0721750) / 1.00000
  const z = (r * 0.0193339 + g * 0.1191920 + b * 0.9503041) / 1.08883

  // XYZ → LAB
  const f = (t: number) => t > 0.008856 ? Math.cbrt(t) : (7.787 * t) + 16 / 116

  const L = (116 * f(y)) - 16
  const a = 500 * (f(x) - f(y))
  const bLab = 200 * (f(y) - f(z))

  return [L, a, bLab]
}

// ─────────────────────────────────────────────────────────────
// 토큰 매핑
// ─────────────────────────────────────────────────────────────

function mapColorsToTokens(
  colors: ExtractedColor[],
  mapping: KmeansRequest['payload']['mapping']
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

function findComplementary(target: ExtractedColor, colors: ExtractedColor[]): ExtractedColor {
  // 색상환에서 반대편 색상 찾기 (Hue 차이 최대화)
  return colors
    .filter(c => c.hex !== target.hex)
    .sort((a, b) => {
      const diffA = Math.abs(a.hsl[0] - target.hsl[0])
      const diffB = Math.abs(b.hsl[0] - target.hsl[0])
      const compDiffA = Math.min(diffA, 1 - diffA)  // 색상환 wrap-around
      const compDiffB = Math.min(diffB, 1 - diffB)
      return compDiffB - compDiffA  // 차이가 큰 순서
    })[0] || target
}

function adjustLightness(hex: string, amount: number): string {
  // hex → hsl → adjust → hex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const hsl = rgbToHsl([r, g, b])
  hsl[2] = Math.max(0, Math.min(1, hsl[2] + amount))

  return hslToHex(hsl)
}

function hslToHex(hsl: [number, number, number]): string {
  const [h, s, l] = hsl

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h * 6) % 2 - 1))
  const m = l - c / 2

  let r = 0, g = 0, b = 0
  if (h < 1/6) { r = c; g = x; b = 0 }
  else if (h < 2/6) { r = x; g = c; b = 0 }
  else if (h < 3/6) { r = 0; g = c; b = x }
  else if (h < 4/6) { r = 0; g = x; b = c }
  else if (h < 5/6) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }

  return rgbToHex([
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ])
}

// ─────────────────────────────────────────────────────────────
// 대비 검증
// ─────────────────────────────────────────────────────────────

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
        `${r.foreground}/${r.background} 대비 부족 (${r.ratio.toFixed(2)}:1, 최소 4.5:1 필요)`
      )
    }
  })

  return { pairs: results, passesAA, passesAAA, suggestions }
}

function getContrastRatio(fg: string, bg: string): number {
  const fgLum = getRelativeLuminance(fg)
  const bgLum = getRelativeLuminance(bg)

  const lighter = Math.max(fgLum, bgLum)
  const darker = Math.min(fgLum, bgLum)

  return (lighter + 0.05) / (darker + 0.05)
}

function getRelativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function hashPixels(pixels: number[][]): string {
  // 간단한 해시 (실제 구현에서는 crypto 사용)
  const sample = pixels.slice(0, 100).flat()
  return sample.reduce((hash, val) => ((hash << 5) - hash) + val, 0).toString(16)
}

// 타입 선언 (SemanticTokens는 외부에서 import)
type SemanticTokens = Record<string, string>
```

### 3.3 Worker 매니저

```typescript
// workers/index.ts

import type { KmeansRequest, KmeansResponse, KmeansErrorResponse, ExtractedPalette } from './types'

/**
 * Worker 풀 매니저 (싱글톤)
 *
 * 사용법:
 * const palette = await workerManager.extractPalette(imageData, options)
 */
class WorkerManager {
  private kmeansWorker: Worker | null = null
  private pendingRequests = new Map<string, {
    resolve: (value: ExtractedPalette) => void
    reject: (error: Error) => void
  }>()

  private requestId = 0

  /**
   * K-means 색상 추출
   */
  async extractPalette(
    imageData: ImageData,
    options: KmeansRequest['payload']['options'],
    mapping: KmeansRequest['payload']['mapping']
  ): Promise<ExtractedPalette> {
    // Worker 미지원 시 폴백
    if (typeof Worker === 'undefined') {
      return this.extractPaletteFallback(imageData, options, mapping)
    }

    // Worker 초기화
    if (!this.kmeansWorker) {
      this.kmeansWorker = new Worker(
        new URL('./kmeans.worker.ts', import.meta.url)
      )
      this.kmeansWorker.onmessage = this.handleKmeansMessage.bind(this)
      this.kmeansWorker.onerror = this.handleWorkerError.bind(this)
    }

    return new Promise((resolve, reject) => {
      const id = String(++this.requestId)
      this.pendingRequests.set(id, { resolve, reject })

      const request: KmeansRequest & { id: string } = {
        id,
        type: 'EXTRACT_PALETTE',
        payload: { imageData, options, mapping },
      }

      // ImageData는 Transferable
      this.kmeansWorker!.postMessage(request, [imageData.data.buffer])
    })
  }

  private handleKmeansMessage(event: MessageEvent<(KmeansResponse | KmeansErrorResponse) & { id: string }>) {
    const { id, type } = event.data
    const pending = this.pendingRequests.get(id)

    if (!pending) return
    this.pendingRequests.delete(id)

    if (type === 'EXTRACT_PALETTE_RESULT') {
      pending.resolve((event.data as KmeansResponse).payload)
    } else if (type === 'EXTRACT_PALETTE_ERROR') {
      pending.reject(new Error((event.data as KmeansErrorResponse).error))
    }
  }

  private handleWorkerError(error: ErrorEvent) {
    console.error('Worker error:', error)
    // 모든 대기 중인 요청 reject
    this.pendingRequests.forEach(({ reject }) => {
      reject(new Error('Worker crashed'))
    })
    this.pendingRequests.clear()
    this.kmeansWorker = null
  }

  /**
   * 메인 스레드 폴백 (Worker 미지원 환경)
   */
  private async extractPaletteFallback(
    imageData: ImageData,
    options: KmeansRequest['payload']['options'],
    mapping: KmeansRequest['payload']['mapping']
  ): Promise<ExtractedPalette> {
    // 동적 import로 번들 분리
    const { extractPaletteSync } = await import('../style/extraction/palette')
    return extractPaletteSync(imageData, options, mapping)
  }

  /**
   * 리소스 정리
   */
  terminate() {
    if (this.kmeansWorker) {
      this.kmeansWorker.terminate()
      this.kmeansWorker = null
    }
    this.pendingRequests.clear()
  }
}

// 싱글톤 export
export const workerManager = new WorkerManager()
```

---

## 4. React 훅

### 4.1 useColorExtraction

```typescript
// hooks/useColorExtraction.ts

import { useState, useCallback, useRef, useEffect } from 'react'
import { workerManager } from '../workers'
import type { ExtractedPalette, KmeansRequest } from '../workers/types'

interface UseColorExtractionOptions {
  colorCount?: number
  maxIterations?: number
  convergenceThreshold?: number
  dominantMapping?: KmeansRequest['payload']['mapping']['dominant']
  accentMapping?: KmeansRequest['payload']['mapping']['accent']
}

interface UseColorExtractionReturn {
  palette: ExtractedPalette | null
  isExtracting: boolean
  error: Error | null
  extract: (imageUrl: string) => Promise<void>
  reset: () => void
}

export function useColorExtraction(
  options: UseColorExtractionOptions = {}
): UseColorExtractionReturn {
  const {
    colorCount = 6,
    maxIterations = 10,
    convergenceThreshold = 1,
    dominantMapping = 'most-common',
    accentMapping = 'complementary',
  } = options

  const [palette, setPalette] = useState<ExtractedPalette | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const abortRef = useRef<AbortController | null>(null)

  const extract = useCallback(async (imageUrl: string) => {
    // 이전 요청 취소
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setIsExtracting(true)
    setError(null)

    try {
      // 1. 이미지 로드 및 리사이즈 (100x100)
      const imageData = await loadImageAsImageData(imageUrl, 100, 100)

      // 취소 체크
      if (abortRef.current.signal.aborted) return

      // 2. Worker에서 추출
      const result = await workerManager.extractPalette(
        imageData,
        { colorCount, maxIterations, convergenceThreshold },
        { dominant: dominantMapping, accent: accentMapping }
      )

      // 취소 체크
      if (abortRef.current.signal.aborted) return

      setPalette(result)

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err : new Error('Unknown error'))

    } finally {
      setIsExtracting(false)
    }
  }, [colorCount, maxIterations, convergenceThreshold, dominantMapping, accentMapping])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setPalette(null)
    setError(null)
    setIsExtracting(false)
  }, [])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  return { palette, isExtracting, error, extract, reset }
}

/**
 * 이미지 URL → ImageData 변환 (리사이즈 포함)
 */
async function loadImageAsImageData(
  url: string,
  width: number,
  height: number
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      // OffscreenCanvas 사용 (가능한 경우)
      if (typeof OffscreenCanvas !== 'undefined') {
        const canvas = new OffscreenCanvas(width, height)
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        resolve(ctx.getImageData(0, 0, width, height))
      } else {
        // 폴백: 일반 Canvas
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        resolve(ctx.getImageData(0, 0, width, height))
      }
    }

    img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
    img.src = url
  })
}
```

### 4.2 사용 예시

```typescript
// components/StyleEditor.tsx

import { useColorExtraction } from '../hooks/useColorExtraction'

function PhotoPaletteExtractor({ photoUrl, onPaletteExtracted }) {
  const {
    palette,
    isExtracting,
    error,
    extract,
  } = useColorExtraction({
    colorCount: 6,
    dominantMapping: 'most-common',
    accentMapping: 'complementary',
  })

  // 사진 변경 시 자동 추출
  useEffect(() => {
    if (photoUrl) {
      extract(photoUrl)
    }
  }, [photoUrl, extract])

  // 추출 완료 시 콜백
  useEffect(() => {
    if (palette) {
      onPaletteExtracted(palette)
    }
  }, [palette, onPaletteExtracted])

  if (isExtracting) {
    return (
      <div className="palette-loading">
        <Spinner />
        <span>색상 분석 중...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="palette-error">
        <span>색상 추출 실패: {error.message}</span>
        <button onClick={() => extract(photoUrl)}>재시도</button>
      </div>
    )
  }

  if (!palette) return null

  return (
    <div className="extracted-palette">
      <div className="palette-colors">
        {palette.colors.map((color, i) => (
          <div
            key={i}
            className="color-chip"
            style={{ backgroundColor: color.hex }}
            title={`${color.hex} (${Math.round(color.population * 100)}%)`}
          />
        ))}
      </div>

      {!palette.contrastValidation.passesAA && (
        <div className="contrast-warning">
          ⚠️ 일부 색상 조합의 대비가 낮습니다
          <ul>
            {palette.contrastValidation.suggestions?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="palette-meta">
        처리 시간: {palette.meta.processingTime.toFixed(0)}ms
      </div>
    </div>
  )
}
```

---

## 5. Next.js 설정

### 5.1 next.config.js

```javascript
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Worker 파일 처리
    config.module.rules.push({
      test: /\.worker\.ts$/,
      use: {
        loader: 'worker-loader',
        options: {
          filename: 'static/[hash].worker.js',
          publicPath: '/_next/',
        },
      },
    })

    // Worker 파일을 서버 번들에서 제외
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'worker_threads': 'commonjs worker_threads',
      })
    }

    return config
  },
}

module.exports = nextConfig
```

### 5.2 대안: Comlink 사용

```typescript
// workers/kmeans.comlink.ts

import * as Comlink from 'comlink'

const kmeansApi = {
  extractPalette(
    imageData: ImageData,
    options: ExtractOptions,
    mapping: MappingOptions
  ): ExtractedPalette {
    // ... 동일한 구현
  }
}

Comlink.expose(kmeansApi)

// ─────────────────────────────────────────────────────────────

// hooks/useColorExtraction.comlink.ts

import * as Comlink from 'comlink'

const worker = new Worker(new URL('./kmeans.comlink.ts', import.meta.url))
const kmeansApi = Comlink.wrap<typeof import('./kmeans.comlink')>(worker)

// 사용:
const result = await kmeansApi.extractPalette(imageData, options, mapping)
```

---

## 6. 성능 벤치마크

### 6.1 예상 성능 개선

| 시나리오 | 메인 스레드 | Worker | 개선율 |
|----------|------------|--------|--------|
| **100x100 이미지, 6색 추출** | ~150ms (블로킹) | ~150ms (비블로킹) | UI 응답성 ∞ |
| **다중 이미지 동시 처리** | 순차 실행 | 병렬 실행 | 2-4x |
| **스타일 편집 중 프리뷰** | 버벅임 | 부드러움 | UX 향상 |

### 6.2 메모리 고려사항

- ImageData 전송 시 `Transferable` 사용으로 복사 비용 제거
- Worker 당 ~5MB 메모리 사용
- 싱글톤 패턴으로 Worker 재사용

---

## 7. 다음 단계

- [x] K-means Worker 구현
- [ ] 이미지 리사이즈 Worker
- [ ] WCAG 대비 검증 Worker
- [ ] 애니메이션 경로 계산 Worker
- [ ] Worker 풀링 (다중 요청 시)
- [ ] SharedArrayBuffer 지원 (고성능 시나리오)

---

## 8. 참고 문서

- [05_renderer.md §11.3](./05_renderer.md) - K-means 알고리즘 원본
- [01_data_schema.md §7.10](./01_data_schema.md) - ResolvedStyle 타입
- [MDN: Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [Comlink](https://github.com/GoogleChromeLabs/comlink) - Worker RPC 라이브러리

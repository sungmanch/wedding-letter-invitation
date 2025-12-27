/**
 * Template Matcher Service
 *
 * 사용자 레퍼런스 분석 결과와 사전 정의된 템플릿 메타데이터를 비교하여
 * 가장 유사한 템플릿을 선택하는 알고리즘
 */

import { TEMPLATE_CATALOG } from '../config/template-catalog'
import type { TemplateMetadata } from '../schema/template-metadata'

// ============================================
// Types
// ============================================

/**
 * 사용자 레퍼런스 분석 결과
 * (analyze-reference API 응답 타입과 동일)
 */
export interface AnalysisResult {
  mood: string[]
  colors: string[]
  typography: string
  layout: string
  keywords: string[]
  summary: string
}

/**
 * 템플릿 매칭 결과
 */
export interface MatchResult {
  /** 템플릿 ID */
  templateId: string

  /** 전체 유사도 점수 (0.0 ~ 1.0) */
  score: number

  /** 세부 점수 */
  matchDetails: {
    moodScore: number
    colorScore: number
    typographyScore: number
    layoutScore: number
    keywordScore: number
  }
}

/**
 * 매칭 옵션
 */
export interface MatchOptions {
  /** 최소 점수 (이하는 매칭 실패) */
  minScore?: number

  /** 반환할 최대 결과 수 (기본: 1) */
  topN?: number
}

// ============================================
// Similarity Scoring Weights
// ============================================

const WEIGHTS = {
  mood: 0.25, // 분위기
  color: 0.2, // 색상
  typography: 0.15, // 타이포그래피
  layout: 0.2, // 레이아웃
  keyword: 0.2, // 키워드
} as const

// ============================================
// Main Matching Function
// ============================================

/**
 * 사용자 레퍼런스와 가장 유사한 템플릿 선택
 *
 * @param userAnalysis 사용자 레퍼런스 분석 결과
 * @param options 매칭 옵션
 * @returns 매칭 결과 (없으면 null)
 */
export function matchBestTemplate(
  userAnalysis: AnalysisResult,
  options?: MatchOptions
): MatchResult | null {
  const minScore = options?.minScore ?? 0.4
  const topN = options?.topN ?? 1

  // 모든 템플릿에 대해 유사도 계산
  const results = TEMPLATE_CATALOG.map((template) =>
    calculateSimilarity(userAnalysis, template)
  )
    .filter((result) => result.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)

  return results.length > 0 ? results[0] : null
}

/**
 * 모든 템플릿의 매칭 결과 반환 (디버깅용)
 */
export function matchAllTemplates(
  userAnalysis: AnalysisResult
): MatchResult[] {
  return TEMPLATE_CATALOG.map((template) =>
    calculateSimilarity(userAnalysis, template)
  ).sort((a, b) => b.score - a.score)
}

// ============================================
// Similarity Calculation
// ============================================

/**
 * 사용자 분석 결과와 템플릿 간 유사도 계산
 */
function calculateSimilarity(
  userAnalysis: AnalysisResult,
  template: TemplateMetadata
): MatchResult {
  // 1. Mood 유사도 (Jaccard similarity)
  const moodScore = jaccardSimilarity(userAnalysis.mood, template.mood)

  // 2. Color 유사도 (RGB Euclidean distance)
  const colorScore = calculateColorSimilarity(
    userAnalysis.colors,
    template.colors
  )

  // 3. Typography 유사도 (exact/similar match)
  const typographyScore = calculateTypographyScore(
    userAnalysis.typography,
    template.typography
  )

  // 4. Layout 유사도 (exact/similar match)
  const layoutScore = calculateLayoutScore(
    userAnalysis.layout,
    template.layout
  )

  // 5. Keyword 유사도 (Jaccard similarity)
  const keywordScore = jaccardSimilarity(
    userAnalysis.keywords,
    template.keywords
  )

  // 가중치 적용하여 최종 점수 계산
  const totalScore =
    moodScore * WEIGHTS.mood +
    colorScore * WEIGHTS.color +
    typographyScore * WEIGHTS.typography +
    layoutScore * WEIGHTS.layout +
    keywordScore * WEIGHTS.keyword

  return {
    templateId: template.id,
    score: totalScore,
    matchDetails: {
      moodScore,
      colorScore,
      typographyScore,
      layoutScore,
      keywordScore,
    },
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Jaccard Similarity (집합 간 유사도)
 *
 * 교집합 크기 / 합집합 크기
 * @returns 0.0 ~ 1.0
 */
function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a.map((s) => s.toLowerCase().trim()))
  const setB = new Set(b.map((s) => s.toLowerCase().trim()))

  const intersection = new Set([...setA].filter((x) => setB.has(x)))
  const union = new Set([...setA, ...setB])

  return union.size === 0 ? 0 : intersection.size / union.size
}

/**
 * 색상 유사도 계산
 *
 * 사용자 색상 각각에 대해 템플릿 색상 중 가장 가까운 색상과의 거리 계산
 * RGB Euclidean distance 사용
 *
 * @returns 0.0 ~ 1.0 (1.0이 가장 유사)
 */
function calculateColorSimilarity(
  userColors: string[],
  templateColors: string[]
): number {
  if (userColors.length === 0 || templateColors.length === 0) return 0

  // 각 사용자 색상에 대해 가장 가까운 템플릿 색상 찾기
  const distances = userColors.map((userColor) => {
    const userRgb = hexToRgb(userColor)
    const minDistance = Math.min(
      ...templateColors.map((templateColor) => {
        const templateRgb = hexToRgb(templateColor)
        return rgbDistance(userRgb, templateRgb)
      })
    )
    return minDistance
  })

  // 평균 거리 계산
  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length

  // 최대 거리: sqrt(255^2 * 3) ≈ 441.67
  const maxDistance = Math.sqrt(255 * 255 * 3)

  // 거리를 유사도로 변환 (0 = 동일, maxDistance = 완전 다름)
  const similarity = Math.max(0, 1 - avgDistance / maxDistance)

  return similarity
}

/**
 * RGB 거리 계산 (Euclidean distance)
 */
function rgbDistance(
  rgb1: [number, number, number],
  rgb2: [number, number, number]
): number {
  const dr = rgb1[0] - rgb2[0]
  const dg = rgb1[1] - rgb2[1]
  const db = rgb1[2] - rgb2[2]
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

/**
 * HEX → RGB 변환
 */
function hexToRgb(hex: string): [number, number, number] {
  // # 제거
  const cleanHex = hex.replace('#', '')

  // 3자리 HEX 처리 (#FFF → #FFFFFF)
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((c) => c + c)
          .join('')
      : cleanHex

  const r = parseInt(fullHex.substring(0, 2), 16)
  const g = parseInt(fullHex.substring(2, 4), 16)
  const b = parseInt(fullHex.substring(4, 6), 16)

  return [r, g, b]
}

/**
 * Typography 유사도 계산
 */
function calculateTypographyScore(
  userTypography: string,
  templateTypography: string
): number {
  const user = userTypography.toLowerCase().trim()
  const template = templateTypography.toLowerCase().trim()

  // 완전 일치
  if (user === template) return 1.0

  // 유사 타입 매핑
  const similarGroups = [
    ['script', 'handwritten', '손글씨'],
    ['serif', '세리프', 'classic'],
    ['sans-serif', '산세리프', 'modern', 'minimal'],
    ['display', 'decorative'],
  ]

  for (const group of similarGroups) {
    if (group.includes(user) && group.includes(template)) {
      return 0.5 // 유사
    }
  }

  return 0 // 다름
}

/**
 * Layout 유사도 계산
 */
function calculateLayoutScore(
  userLayout: string,
  templateLayout: string
): number {
  const user = userLayout.toLowerCase().trim()
  const template = templateLayout.toLowerCase().trim()

  // 완전 일치
  if (user === template) return 1.0

  // 유사 레이아웃 매핑
  const similarGroups = [
    ['photo-dominant', '사진중심', 'centered', 'fullscreen'],
    ['text-overlay', 'overlay', '텍스트오버레이'],
    ['split', 'card', '분할'],
    ['text-center', '텍스트중심', 'minimal'],
  ]

  for (const group of similarGroups) {
    if (group.includes(user) && group.includes(template)) {
      return 0.6 // 유사
    }
  }

  return 0.3 // 약간 다름 (레이아웃은 어느 정도 호환 가능)
}

// ============================================
// Fallback Template Selection
// ============================================

/**
 * 매칭 점수가 낮을 때 fallback 템플릿 선택
 *
 * mood 기반으로 가장 적절한 템플릿을 휴리스틱하게 선택
 */
export function selectFallbackTemplate(
  userAnalysis?: AnalysisResult
): string {
  // undefined인 경우 기본 템플릿 반환
  if (!userAnalysis) {
    return 'unique1'
  }

  const moods = userAnalysis.mood.map((m) => m.toLowerCase())

  // Dark/Dramatic → unique4
  if (moods.some((m) => ['dark', 'dramatic', '어두운', '드라마틱'].includes(m))) {
    return 'unique4'
  }

  // Minimal/Modern → unique3
  if (moods.some((m) => ['minimal', 'modern', '미니멀', '모던'].includes(m))) {
    return 'unique3'
  }

  // Playful/Casual → unique2
  if (moods.some((m) => ['playful', 'casual', '캐주얼', '재미있는'].includes(m))) {
    return 'unique2'
  }

  // Bold/Fashion → unique6
  if (moods.some((m) => ['bold', 'fashion', '대담한', '패션'].includes(m))) {
    return 'unique6'
  }

  // Bright/Sky → unique5
  if (moods.some((m) => ['bright', 'sky', '밝은', '하늘'].includes(m))) {
    return 'unique5'
  }

  // Default: unique1 (클래식 엘레강스)
  return 'unique1'
}

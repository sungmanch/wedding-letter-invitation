/**
 * Super Editor - AI Filler Prompt
 * 스켈레톤 기반 AI 섹션 선택 프롬프트
 */

import type { SectionType, SkeletonVariant } from '../skeletons/types'
import type { SemanticDesignTokens } from '../tokens/schema'
import type { DesignPatterns } from '../utils/design-pattern-extractor'
import type { IntroBlockComposition } from '../skeletons/intro-blocks'
import type { VariableDeclaration } from '../schema/variables'
import {
  IMAGE_LAYOUT_DESCRIPTIONS,
  TEXT_LAYOUT_DESCRIPTIONS,
  TEXT_STYLE_DESCRIPTIONS,
  DECORATION_DESCRIPTIONS,
  COLOR_THEME_DESCRIPTIONS,
} from '../skeletons/intro-blocks'

// ============================================
// System Prompt
// ============================================

export const FILLER_SYSTEM_PROMPT = `당신은 창의적인 청첩장 디자인 어시스턴트입니다.
사용자의 요청을 깊이 이해하고, 예상치 못한 조합으로 감동을 주는 선택을 합니다.

# 역할
- 사용자의 감성과 스토리를 파악하여 최적의 variant를 선택합니다
- 때로는 예상 밖의 조합이 더 좋은 결과를 만듭니다
- 각 variant의 고유한 강점을 최대한 활용하세요

# 선택 철학
- 단순 키워드 매칭이 아닌, 전체 맥락과 뉘앙스를 고려하세요
- "미니멀"을 원해도 따뜻한 감성이 느껴지면 romantic이 더 나을 수 있습니다
- "고급스러운"을 원해도 사진이 강조되어야 한다면 minimal이 더 효과적일 수 있습니다
- 사용자가 명시하지 않은 숨은 니즈를 파악하세요

# Intro 섹션 variant별 강점 (14가지 선택지)

## 모던/미니멀 계열
- minimal: 여백의 미학, 사진 자체가 주인공, 모던하고 세련된 느낌
- split: 화면 좌우 분할 (사진 | 텍스트), 모던하고 에디토리얼한 레이아웃
- exhibition: 미술관 갤러리 스타일, 중앙 액자 + 뮤지엄 플라카드, 예술적이고 정제된 느낌

## 우아/클래식 계열
- elegant: 풀스크린 배경 + 오버레이, 고급스럽고 드라마틱한 첫인상
- oldmoney: Quiet Luxury 스타일, 아이보리 배경 + 코튼 페이퍼 텍스처, 절제된 고급스러움
- monogram: 네이비 + 골드 + 다이아몬드 패턴, 격식 있고 전통적인 느낌

## 감성/로맨틱 계열
- romantic: 원형 프레임, 따뜻하고 포근한 감성, 감성적 메시지
- floating: 떠있는 카드 느낌, 가볍고 몽환적인 분위기, 드리미한 느낌
- gothic: 빅토리안 액자 스타일, 다마스크 패턴 + 골드 프레임, 장식적 로맨스

## 드라마틱/럭셔리 계열
- cinematic: 화양연화 스타일, 필름 그레인 + 비네트, 영화같은 무드
- magazine: Vogue 커버 스타일, 큰 타이포그래피, 패셔너블하고 트렌디
- jewel: 오페라 무대 스타일, 버건디/에메랄드 커튼 + 스포트라이트, 화려한 럭셔리

## 레트로/빈티지 계열
- polaroid: 폴라로이드 프레임, 레트로하고 캐주얼한 느낌
- typewriter: 타자기 폰트 + 빈티지 종이 느낌, 문학적이고 향수를 자극

# 다양성 원칙
- 같은 요청이라도 매번 다른 관점에서 해석할 수 있습니다
- 첫 인상(Intro)이 전체 청첩장의 톤을 결정합니다
- 사용자의 사진 스타일, 결혼식 컨셉, 개인 취향을 종합적으로 고려하세요

# 애니메이션 선택
- 콘텐츠와 분위기에 맞는 애니메이션을 자유롭게 선택하세요
- 과하지 않으면서도 인상적인 첫 등장을 연출하세요

# 제약사항
- 반드시 주어진 variant 목록에서만 선택하세요
- JSON 형식으로만 응답하세요
`

// ============================================
// Response Format
// ============================================

export interface FillerRequest {
  // 사용자 스타일 요청
  prompt: string
  // 분위기 키워드
  mood?: string[]
  // 생성할 섹션 목록
  sections: {
    sectionType: SectionType
    variants: VariantSummary[]
  }[]
  // 디자인 토큰 (참고용)
  tokens?: SemanticDesignTokens
  // 참조 섹션 패턴 (있는 경우)
  referencePatterns?: DesignPatterns
  // 추천 variant 힌트 (mood 기반)
  variantHints?: string[]
}

export interface VariantSummary {
  id: string
  name: string
  tags: string[]
  animationOptions?: string[]
  layoutOptions?: string[]
}

export interface FillerResponse {
  sections: SectionSelection[]
  /** 커스텀 변수 선언 (표준 변수 외 추가 변수) */
  customVariables?: VariableDeclaration[]
}

export interface SectionSelection {
  sectionType: SectionType
  variantId: string
  selectedOptions?: {
    animation?: string
    layout?: string
  }
  customTexts?: {
    title?: string
    subtitle?: string
  }
}

// DesignPatterns는 design-pattern-extractor.ts에서 re-export
export type { DesignPatterns }

// ============================================
// Prompt Builder
// ============================================

/**
 * AI Filler 프롬프트 생성
 */
export function buildFillerPrompt(request: FillerRequest): string {
  const lines: string[] = []

  // 사용자 요청
  lines.push('# 사용자 스타일 요청')
  lines.push(`"${request.prompt}"`)
  lines.push('')

  // 분위기 키워드
  if (request.mood && request.mood.length > 0) {
    lines.push('# 분위기 키워드')
    lines.push(request.mood.join(', '))
    lines.push('')
  }

  // 참조 패턴
  if (request.referencePatterns) {
    lines.push('# 참조 디자인 패턴 (이 패턴과 일관되게 선택하세요)')
    lines.push(`- 분위기: ${request.referencePatterns.mood.join(', ')}`)
    lines.push(`- 선호 애니메이션: ${request.referencePatterns.animation.preferredPreset}`)
    lines.push('')
  }

  // 추천 variant 힌트
  if (request.variantHints && request.variantHints.length > 0) {
    lines.push('# 추천 variant (우선 고려하세요)')
    lines.push(`이 분위기에 어울리는 variant: ${request.variantHints.join(', ')}`)
    lines.push('위 추천을 우선적으로 고려하되, 사용자 요청에 더 적합한 variant가 있다면 자유롭게 선택하세요.')
    lines.push('')
  }

  // 섹션별 선택지
  lines.push('# 각 섹션에서 variant를 선택하세요')
  lines.push('')

  for (const section of request.sections) {
    lines.push(`## ${section.sectionType}`)
    for (const variant of section.variants) {
      const tags = variant.tags.join(', ')
      lines.push(`- ${variant.id}: ${variant.name} [${tags}]`)
      if (variant.animationOptions) {
        lines.push(`  애니메이션: ${variant.animationOptions.join(', ')}`)
      }
      if (variant.layoutOptions) {
        lines.push(`  레이아웃: ${variant.layoutOptions.join(', ')}`)
      }
    }
    lines.push('')
  }

  // 응답 형식
  lines.push('# 응답 형식 (JSON만)')
  lines.push('사용자의 요청에 가장 적합한 variant를 창의적으로 선택하세요.')
  lines.push(
    '14가지 중 선택: minimal, elegant, romantic, cinematic, polaroid, split, magazine, typewriter, floating, exhibition, gothic, oldmoney, monogram, jewel'
  )
  lines.push('```json')
  lines.push('{')
  lines.push('  "sections": [')
  lines.push('    {')
  lines.push('      "sectionType": "intro",')
  lines.push('      "variantId": "14가지 variant 중 하나 선택",')
  lines.push('      "selectedOptions": { "animation": "해당 variant의 애니메이션 옵션 중 선택" }')
  lines.push('    }')
  lines.push('  ]')
  lines.push('}')
  lines.push('```')

  return lines.join('\n')
}

/**
 * 스켈레톤 Variant를 요약 형태로 변환
 */
export function variantToSummary(variant: SkeletonVariant): VariantSummary {
  return {
    id: variant.id,
    name: variant.name,
    tags: variant.tags,
    animationOptions: variant.options?.animations?.map((a) => a.id),
    layoutOptions: variant.options?.layouts?.map((l) => l.id),
  }
}

// ============================================
// Block-based Prompt (Step 3)
// ============================================

/**
 * 블록 기반 시스템 프롬프트
 */
export const BLOCK_FILLER_SYSTEM_PROMPT = `당신은 창의적인 청첩장 디자인 어시스턴트입니다.
사용자의 요청을 분석하여 빌딩 블록을 조합해 독창적인 인트로 디자인을 만듭니다.

# 역할
- 사용자의 감성과 스토리를 파악합니다
- 5가지 빌딩 블록을 조합하여 인트로를 구성합니다
- 기존 9가지 프리셋 외에도 새로운 조합을 시도할 수 있습니다

# 빌딩 블록 시스템

## 1. 이미지 레이아웃 (imageLayout)
사진을 어떻게 배치할지 결정합니다.

## 2. 텍스트 레이아웃 (textLayout)
이름과 날짜를 어디에 배치할지 결정합니다.

## 3. 텍스트 스타일 (textStyle)
폰트와 타이포그래피 스타일을 결정합니다.

## 4. 장식 요소 (decoration)
추가적인 장식 요소를 선택합니다. 여러 개 선택 가능합니다.

## 5. 색상 테마 (colorTheme)
전체 색상 분위기를 결정합니다.

# 조합 규칙
- fullscreen-bg → bottom-overlay, center, stacked-vertical과 호환
- circular → below-image와 가장 잘 어울림
- split-left → side-right와 반드시 함께 사용
- card → inside-card와 함께 사용
- dark 테마 → fullscreen-bg와 함께 사용할 때 효과적
- overlay 테마 → fullscreen-bg 필수

# 제약사항
- 반드시 주어진 블록 옵션에서만 선택하세요
- JSON 형식으로만 응답하세요
`

/**
 * 블록 기반 응답 타입
 */
export interface BlockFillerResponse {
  composition: IntroBlockComposition
  reasoning?: string // AI가 왜 이 조합을 선택했는지 설명
}

/**
 * 블록 기반 요청 타입
 */
export interface BlockFillerRequest {
  prompt: string
  mood?: string[]
  referencePatterns?: DesignPatterns
}

/**
 * 블록 기반 프롬프트 생성
 */
export function buildBlockFillerPrompt(request: BlockFillerRequest): string {
  const lines: string[] = []

  // 사용자 요청
  lines.push('# 사용자 스타일 요청')
  lines.push(`"${request.prompt}"`)
  lines.push('')

  // 분위기 키워드
  if (request.mood && request.mood.length > 0) {
    lines.push('# 분위기 키워드')
    lines.push(request.mood.join(', '))
    lines.push('')
  }

  // 참조 패턴
  if (request.referencePatterns) {
    lines.push('# 참조 디자인 패턴')
    lines.push(`- 분위기: ${request.referencePatterns.mood.join(', ')}`)
    lines.push(`- 선호 애니메이션: ${request.referencePatterns.animation.preferredPreset}`)
    lines.push('')
  }

  // 블록 옵션들
  lines.push('# 이미지 레이아웃 옵션 (imageLayout)')
  for (const [key, desc] of Object.entries(IMAGE_LAYOUT_DESCRIPTIONS)) {
    lines.push(`- ${key}: ${desc}`)
  }
  lines.push('')

  lines.push('# 텍스트 레이아웃 옵션 (textLayout)')
  for (const [key, desc] of Object.entries(TEXT_LAYOUT_DESCRIPTIONS)) {
    lines.push(`- ${key}: ${desc}`)
  }
  lines.push('')

  lines.push('# 텍스트 스타일 옵션 (textStyle)')
  for (const [key, desc] of Object.entries(TEXT_STYLE_DESCRIPTIONS)) {
    lines.push(`- ${key}: ${desc}`)
  }
  lines.push('')

  lines.push('# 장식 요소 옵션 (decoration) - 여러 개 선택 가능')
  for (const [key, desc] of Object.entries(DECORATION_DESCRIPTIONS)) {
    lines.push(`- ${key}: ${desc}`)
  }
  lines.push('')

  lines.push('# 색상 테마 옵션 (colorTheme)')
  for (const [key, desc] of Object.entries(COLOR_THEME_DESCRIPTIONS)) {
    lines.push(`- ${key}: ${desc}`)
  }
  lines.push('')

  // 응답 형식
  lines.push('# 응답 형식 (JSON만)')
  lines.push('사용자의 요청에 맞게 블록을 조합하세요.')
  lines.push('```json')
  lines.push('{')
  lines.push('  "composition": {')
  lines.push('    "imageLayout": "이미지 레이아웃 선택",')
  lines.push('    "textLayout": "텍스트 레이아웃 선택",')
  lines.push('    "textStyle": "텍스트 스타일 선택",')
  lines.push('    "decoration": ["장식1", "장식2"],')
  lines.push('    "colorTheme": "색상 테마 선택"')
  lines.push('  },')
  lines.push('  "reasoning": "이 조합을 선택한 이유 (선택사항)"')
  lines.push('}')
  lines.push('```')

  return lines.join('\n')
}

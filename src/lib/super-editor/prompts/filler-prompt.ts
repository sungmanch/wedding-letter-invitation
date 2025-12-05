/**
 * Super Editor - AI Filler Prompt
 * 스켈레톤 기반 AI 섹션 선택 프롬프트
 */

import type { SectionType, SkeletonVariant } from '../skeletons/types'
import type { SemanticDesignTokens } from '../tokens/schema'
import type { DesignPatterns } from '../utils/design-pattern-extractor'

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

# Intro 섹션 variant별 강점 (특히 중요)
- minimal: 여백의 미학, 사진 자체가 주인공, 모던하고 세련된 느낌, 심플한 타이포그래피
- elegant: 드라마틱한 풀스크린 임팩트, 오버레이로 고급스러움 연출, 영화 포스터 같은 분위기
- romantic: 따뜻하고 포근한 감성, 원형 프레임의 친근함, 감성적 메시지 전달에 최적

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
  lines.push('```json')
  lines.push('{')
  lines.push('  "sections": [')
  lines.push('    {')
  lines.push('      "sectionType": "섹션타입",')
  lines.push('      "variantId": "선택한_variant_id",')
  lines.push('      "selectedOptions": { "animation": "선택한_애니메이션" }')
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

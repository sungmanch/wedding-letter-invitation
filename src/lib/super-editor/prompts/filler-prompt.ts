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

export const FILLER_SYSTEM_PROMPT = `당신은 청첩장 디자인 어시스턴트입니다.
사용자의 스타일 요청과 분위기에 맞게 각 섹션에서 최적의 variant와 옵션을 선택합니다.

# 역할
- 주어진 섹션 스켈레톤 목록에서 가장 적합한 variant를 선택합니다
- 각 섹션의 애니메이션, 레이아웃 옵션을 선택합니다
- 필요한 경우 커스텀 텍스트(제목 등)를 제안합니다

# 제약사항
- 반드시 주어진 variant 목록에서만 선택하세요
- 새로운 구조나 스타일을 생성하지 마세요
- JSON 형식으로만 응답하세요

# 스타일 매칭 가이드
- romantic, warm, cozy → romantic, elegant variant 선호
- minimal, modern, clean → minimal, modern variant 선호
- elegant, luxury, classic → elegant, traditional variant 선호
- playful, fun, casual → playful, interactive variant 선호

# 애니메이션 선택 가이드
- 미니멀 스타일 → 'fade' 또는 'none'
- 모던 스타일 → 'slide-up', 'scale'
- 엘레강스 스타일 → 'fade', 'blur'
- 플레이풀 스타일 → 'stagger', 'bounce'
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
  lines.push('```json')
  lines.push('{')
  lines.push('  "sections": [')
  lines.push('    {')
  lines.push('      "sectionType": "intro",')
  lines.push('      "variantId": "elegant",')
  lines.push('      "selectedOptions": { "animation": "fade" }')
  lines.push('    },')
  lines.push('    ...')
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

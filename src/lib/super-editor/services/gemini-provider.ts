/**
 * Super Editor - Gemini AI Provider
 * Gemini API를 사용한 AIProvider 구현
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { StyleSchema, StyleMood } from '../schema/style'
import type { AIProvider } from './generation-service'
import type { FillerResponse } from '../prompts/filler-prompt'
import { FILLER_SYSTEM_PROMPT } from '../prompts/filler-prompt'
import {
  getMoodVariantHints,
  COLOR_PRESETS,
  type EnhancedPromptInput,
} from '../prompts/prompt-hints'

// ============================================
// Configuration
// ============================================

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const MODEL = 'gemini-2.0-flash'

// ============================================
// Style Generation Prompt
// ============================================

const STYLE_SYSTEM_PROMPT = `당신은 청첩장 디자인 시스템의 StyleSchema 생성 전문가입니다.
사용자의 요청과 분위기 키워드를 기반으로 일관된 디자인 토큰 시스템을 생성합니다.

# 역할
- 사용자의 스타일 요청을 분석하여 적합한 색상 팔레트를 생성합니다
- 분위기에 맞는 타이포그래피 설정을 선택합니다
- 일관된 테마 시스템을 구성합니다

# 한국어 색상 → 영어 매핑 (중요!)
사용자가 한국어로 색상을 요청하면 아래 매핑을 참고하세요:
- 빨간색/빨강/레드 → red (#DC2626, #EF4444, #B91C1C)
- 파란색/파랑/블루 → blue (#2563EB, #3B82F6, #1D4ED8)
- 초록색/녹색/그린 → green (#16A34A, #22C55E, #15803D)
- 노란색/노랑/옐로우 → yellow (#EAB308, #FACC15, #CA8A04)
- 주황색/오렌지 → orange (#EA580C, #F97316, #C2410C)
- 분홍색/핑크 → pink (#DB2777, #EC4899, #BE185D)
- 보라색/퍼플 → purple (#7C3AED, #8B5CF6, #6D28D9)
- 검은색/블랙 → black (#000000, #171717, #262626)
- 흰색/화이트 → white (#FFFFFF, #FAFAFA, #F5F5F5)
- 회색/그레이 → gray (#6B7280, #9CA3AF, #4B5563)
- 금색/골드 → gold (#D4AF37, #B8860B, #DAA520)
- 은색/실버 → silver (#C0C0C0, #A8A8A8, #D3D3D3)
- 베이지 → beige (#F5F5DC, #DEB887, #D2B48C)
- 아이보리 → ivory (#FFFFF0, #FAF0E6, #FFF8DC)
- 네이비/남색 → navy (#1E3A5F, #1E3A8A, #1E40AF)
- 버건디/와인색 → burgundy (#800020, #722F37, #8B0000)

# 분위기별 기본 색상 가이드
- romantic: 핑크, 로즈, 코랄 계열 (#E91E63, #F8BBD9, #FF80AB)
- elegant: 퍼플, 골드, 아이보리 (#8B5CF6, #D4AF37, #FEFCE8)
- minimal: 그레이, 블랙, 화이트 (#6B7280, #1F2937, #FFFFFF)
- modern: 블루, 네이비, 시안 (#3B82F6, #1E3A5F, #06B6D4)
- warm: 오렌지, 앰버, 베이지 (#F59E0B, #D97706, #FEF3C7)
- playful: 비비드 컬러, 핫핑크, 민트 (#EC4899, #14B8A6, #FFD700)
- natural: 그린, 올리브, 브라운 (#10B981, #84CC16, #78716C)
- luxury: 골드, 버건디, 블랙 (#D4AF37, #800020, #1A1A1A)

# 폰트 가이드
- romantic, elegant: "Noto Serif KR", "Cormorant Garamond"
- minimal, modern: "Pretendard", "Inter"
- playful: "Cafe24 Dangdanghae", "Jua"
- luxury, formal: "Noto Serif KR", "Playfair Display"
- natural: "Nanum Myeongjo", "Noto Sans KR"
- 고딕체/산세리프 → "Pretendard", "Noto Sans KR"
- 명조체/세리프 → "Noto Serif KR", "Nanum Myeongjo"

# 사용자 요청 우선
사용자가 특정 색상이나 폰트를 명시적으로 요청하면, 분위기 가이드보다 사용자 요청을 우선하세요.
예: "빨간색 포인트" → primary를 빨간색 계열로 설정

# 응답 형식
반드시 아래 JSON 구조로만 응답하세요. 설명 없이 JSON만 출력하세요.
`

// ============================================
// Gemini AI Provider
// ============================================

export function createGeminiProvider(): AIProvider {
  return {
    generateStyle,
    selectVariants,
  }
}

// ============================================
// Enhanced Style Generation (구조화된 입력 지원)
// ============================================

export interface EnhancedGenerateStyleOptions {
  prompt: string
  mood?: string[]
  colorPreset?: string
  customColor?: string
  keyword?: string
}

/**
 * 구조화된 입력으로 스타일 생성 (위저드 UI용)
 */
export async function generateStyleEnhanced(
  options: EnhancedGenerateStyleOptions
): Promise<StyleSchema> {
  const { prompt, mood, colorPreset, customColor, keyword } = options

  // variantHints 추출 (AI 프롬프트에 포함)
  const variantHints = getMoodVariantHints(mood ?? [])

  // 색상 프리셋 적용
  let colorHint = ''
  if (customColor) {
    colorHint = `\n\n# 색상 지정\n사용자가 "${customColor}" 색상을 요청했습니다. 이 색상을 primary 색상으로 사용하세요.`
  } else if (colorPreset && COLOR_PRESETS[colorPreset]) {
    const preset = COLOR_PRESETS[colorPreset]
    colorHint = `\n\n# 색상 프리셋\nprimary: ${preset.primary}\nbackground: ${preset.background}\n이 색상을 기반으로 조화로운 팔레트를 구성하세요.`
  }

  // 키워드 힌트
  let keywordHint = ''
  if (keyword?.trim()) {
    keywordHint = `\n\n# 키워드\n"${keyword.trim()}" - 이 단어가 연상시키는 분위기와 느낌을 반영하세요.`
  }

  // variantHints 힌트
  let variantHintStr = ''
  if (variantHints.length > 0) {
    variantHintStr = `\n\n# 추천 Intro Variant\n${variantHints.join(', ')} - 이 variant들에 잘 어울리는 스타일을 생성하세요.`
  }

  // 강화된 시스템 프롬프트
  const enhancedSystemPrompt = STYLE_SYSTEM_PROMPT + colorHint + keywordHint + variantHintStr

  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: enhancedSystemPrompt,
  })

  const userPrompt = buildStylePrompt(prompt, mood)

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.7,
      },
    })

    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error('No response from AI')
    }

    const parsed = parseStyleResponse(text, mood)

    // 색상 프리셋이 지정된 경우 강제 적용
    if (colorPreset && COLOR_PRESETS[colorPreset]) {
      const preset = COLOR_PRESETS[colorPreset]
      parsed.theme.colors.primary = { ...parsed.theme.colors.primary, 500: preset.primary }
      parsed.theme.colors.background = { ...parsed.theme.colors.background, default: preset.background }
    }

    return parsed
  } catch (error) {
    console.error('Enhanced style generation failed:', error)
    return createFallbackStyle(mood)
  }
}

/**
 * 스타일 스키마 생성
 */
async function generateStyle(prompt: string, mood?: string[]): Promise<StyleSchema> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: STYLE_SYSTEM_PROMPT,
  })

  const userPrompt = buildStylePrompt(prompt, mood)

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.7,
      },
    })

    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error('No response from AI')
    }

    const parsed = parseStyleResponse(text, mood)
    return parsed
  } catch (error) {
    console.error('Style generation failed:', error)
    // 폴백: 기본 스타일 반환
    return createFallbackStyle(mood)
  }
}

/**
 * Variant 선택
 */
async function selectVariants(prompt: string, systemPrompt: string): Promise<FillerResponse> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: FILLER_SYSTEM_PROMPT,
  })

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.5,
      },
    })

    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error('No response from AI')
    }

    const parsed = parseFillerResponse(text)
    return parsed
  } catch (error) {
    console.error('Variant selection failed:', error)
    // 폴백: 빈 응답 반환
    return { sections: [] }
  }
}

// ============================================
// Helper Functions
// ============================================

function buildStylePrompt(prompt: string, mood?: string[]): string {
  const lines: string[] = []

  lines.push('# 사용자 요청')
  lines.push(`"${prompt}"`)
  lines.push('')

  if (mood && mood.length > 0) {
    lines.push('# 분위기 키워드')
    lines.push(mood.join(', '))
    lines.push('')
  }

  lines.push('# 생성할 StyleSchema 구조')
  lines.push('```json')
  lines.push(JSON.stringify(getStyleSchemaTemplate(), null, 2))
  lines.push('```')
  lines.push('')
  lines.push('위 구조에 맞게 StyleSchema를 생성하세요. JSON만 출력하세요.')

  return lines.join('\n')
}

function getStyleSchemaTemplate(): Partial<StyleSchema> {
  return {
    version: '1.0',
    meta: {
      id: 'style-xxx',
      name: '스타일 이름',
      mood: ['romantic'],
      createdAt: '',
      updatedAt: '',
    },
    theme: {
      colors: {
        primary: { 500: '#E91E63' },
        neutral: { 500: '#6B7280' },
        background: { default: '#FFFFFF' },
        text: { primary: '#1F2937' },
      },
      typography: {
        fonts: {
          heading: { family: '"Noto Serif KR", serif' },
          body: { family: '"Pretendard", sans-serif' },
        },
        sizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
        },
        weights: { regular: 400, bold: 700 },
        lineHeights: { tight: 1.25, normal: 1.5, relaxed: 1.625 },
        letterSpacing: { tight: '-0.025em', normal: '0', wide: '0.025em' },
      },
      spacing: {
        unit: 4,
        scale: {
          0: '0', 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem',
          5: '1.25rem', 6: '1.5rem', 8: '2rem', 10: '2.5rem', 12: '3rem', 16: '4rem',
        },
      },
      borders: {
        radius: { none: '0', sm: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem', full: '9999px' },
        width: { thin: '1px', default: '2px', thick: '4px' },
        style: 'solid',
        color: '#E5E7EB',
      },
      shadows: {
        none: 'none',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      },
      animation: {
        duration: { fast: 150, normal: 300, slow: 500, slower: 700 },
        easing: {
          default: 'cubic-bezier(0.4, 0, 0.2, 1)',
          in: 'cubic-bezier(0.4, 0, 1, 1)',
          out: 'cubic-bezier(0, 0, 0.2, 1)',
          inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        stagger: { delay: 100, from: 'start' },
      },
    },
    tokens: {},
    components: {},
  }
}

function parseStyleResponse(text: string, mood?: string[]): StyleSchema {
  // JSON 블록 추출
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/)

  if (!jsonMatch) {
    throw new Error('Could not extract JSON from response')
  }

  const jsonStr = jsonMatch[1] || jsonMatch[0]
  const parsed = JSON.parse(jsonStr)

  // 필수 필드 보완
  return validateAndCompleteStyle(parsed, mood)
}

function parseFillerResponse(text: string): FillerResponse {
  // JSON 블록 추출
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/)

  if (!jsonMatch) {
    return { sections: [] }
  }

  try {
    const jsonStr = jsonMatch[1] || jsonMatch[0]
    return JSON.parse(jsonStr)
  } catch {
    return { sections: [] }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateAndCompleteStyle(partial: any, mood?: string[]): StyleSchema {
  const now = new Date().toISOString()
  const validMood = (mood ?? ['romantic']) as StyleMood[]

  return {
    version: '1.0',
    meta: {
      id: partial.meta?.id ?? `style-${Date.now()}`,
      name: partial.meta?.name ?? 'Generated Style',
      mood: validMood,
      createdAt: now,
      updatedAt: now,
    },
    theme: {
      colors: {
        primary: partial.theme?.colors?.primary ?? { 500: '#E91E63' },
        neutral: partial.theme?.colors?.neutral ?? { 500: '#6B7280' },
        background: partial.theme?.colors?.background ?? { default: '#FFFFFF' },
        text: partial.theme?.colors?.text ?? { primary: '#1F2937' },
        ...partial.theme?.colors,
      },
      typography: {
        fonts: {
          heading: partial.theme?.typography?.fonts?.heading ?? { family: '"Noto Serif KR", serif' },
          body: partial.theme?.typography?.fonts?.body ?? { family: '"Pretendard", sans-serif' },
        },
        sizes: partial.theme?.typography?.sizes ?? {
          xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
          xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem',
        },
        weights: partial.theme?.typography?.weights ?? { regular: 400, bold: 700 },
        lineHeights: partial.theme?.typography?.lineHeights ?? { tight: 1.25, normal: 1.5, relaxed: 1.625 },
        letterSpacing: partial.theme?.typography?.letterSpacing ?? { tight: '-0.025em', normal: '0', wide: '0.025em' },
      },
      spacing: partial.theme?.spacing ?? {
        unit: 4,
        scale: {
          0: '0', 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem',
          5: '1.25rem', 6: '1.5rem', 8: '2rem', 10: '2.5rem', 12: '3rem', 16: '4rem',
        },
      },
      borders: partial.theme?.borders ?? {
        radius: { none: '0', sm: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem', full: '9999px' },
        width: { thin: '1px', default: '2px', thick: '4px' },
        style: 'solid',
        color: '#E5E7EB',
      },
      shadows: partial.theme?.shadows ?? {
        none: 'none',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      },
      animation: partial.theme?.animation ?? {
        duration: { fast: 150, normal: 300, slow: 500, slower: 700 },
        easing: {
          default: 'cubic-bezier(0.4, 0, 0.2, 1)',
          in: 'cubic-bezier(0.4, 0, 1, 1)',
          out: 'cubic-bezier(0, 0, 0.2, 1)',
          inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        stagger: { delay: 100, from: 'start' },
      },
    },
    tokens: partial.tokens ?? {},
    components: partial.components ?? {},
  }
}

function createFallbackStyle(mood?: string[]): StyleSchema {
  const moodStr = mood?.[0] ?? 'romantic'

  const colorMap: Record<string, { primary: string; background: string; text: string }> = {
    romantic: { primary: '#E91E63', background: '#FFFBFC', text: '#1F2937' },
    elegant: { primary: '#8B5CF6', background: '#FEFCE8', text: '#1F2937' },
    minimal: { primary: '#6B7280', background: '#FFFFFF', text: '#1F2937' },
    modern: { primary: '#3B82F6', background: '#F8FAFC', text: '#1E293B' },
    warm: { primary: '#F59E0B', background: '#FFFBEB', text: '#78350F' },
    playful: { primary: '#EC4899', background: '#FDF4FF', text: '#701A75' },
    natural: { primary: '#10B981', background: '#F0FDF4', text: '#14532D' },
    luxury: { primary: '#D4AF37', background: '#1A1A1A', text: '#FEFCE8' },
  }

  const fontMap: Record<string, { heading: string; body: string }> = {
    romantic: { heading: '"Noto Serif KR", serif', body: '"Pretendard", sans-serif' },
    elegant: { heading: '"Noto Serif KR", serif', body: '"Pretendard", sans-serif' },
    minimal: { heading: '"Pretendard", sans-serif', body: '"Pretendard", sans-serif' },
    modern: { heading: '"Pretendard", sans-serif', body: '"Pretendard", sans-serif' },
    warm: { heading: '"Noto Serif KR", serif', body: '"Noto Sans KR", sans-serif' },
    playful: { heading: '"Jua", sans-serif', body: '"Noto Sans KR", sans-serif' },
    natural: { heading: '"Nanum Myeongjo", serif', body: '"Noto Sans KR", sans-serif' },
    luxury: { heading: '"Noto Serif KR", serif', body: '"Pretendard", sans-serif' },
  }

  const colors = colorMap[moodStr] ?? colorMap.romantic
  const fonts = fontMap[moodStr] ?? fontMap.romantic

  return validateAndCompleteStyle({
    meta: { name: `${moodStr} 스타일` },
    theme: {
      colors: {
        primary: { 500: colors.primary },
        background: { default: colors.background },
        text: { primary: colors.text },
      },
      typography: {
        fonts: {
          heading: { family: fonts.heading },
          body: { family: fonts.body },
        },
      },
    },
  }, mood)
}

// ============================================
// Export
// ============================================

export { createGeminiProvider as default }

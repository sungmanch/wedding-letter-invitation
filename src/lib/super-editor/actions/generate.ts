'use server'

/**
 * Super Editor - Server Actions for Template Generation
 */

import {
  generateFullTemplate,
  generateQuickTemplate,
  generateIntroOnly,
  completeTemplateWithDefaults,
  type GenerationOptions,
  type GenerationResult,
  type IntroGenerationResult,
} from '../services/generation-service'
import { createGeminiProvider } from '../services/gemini-provider'
import type { StyleSchema } from '../schema/style'

// ============================================
// AI Template Generation
// ============================================

export interface GenerateTemplateInput {
  prompt: string
  mood?: string[]
  enabledSections?: string[]
}

export interface GenerateTemplateOutput {
  success: boolean
  data?: GenerationResult
  error?: string
}

/**
 * AI를 사용한 전체 템플릿 생성
 */
export async function generateTemplateAction(
  input: GenerateTemplateInput
): Promise<GenerateTemplateOutput> {
  try {
    const aiProvider = createGeminiProvider()

    const options: GenerationOptions = {
      prompt: input.prompt,
      mood: input.mood,
    }

    const result = await generateFullTemplate(options, aiProvider)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Template generation failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '템플릿 생성에 실패했습니다',
    }
  }
}

// ============================================
// Quick Template Generation (AI 없이)
// ============================================

export interface QuickGenerateInput {
  style: StyleSchema
  enabledSections?: string[]
}

/**
 * AI 없이 기본 스켈레톤으로 빠른 템플릿 생성
 */
export async function quickGenerateAction(
  input: QuickGenerateInput
): Promise<GenerateTemplateOutput> {
  try {
    const result = generateQuickTemplate(input.style)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Quick generation failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '빠른 생성에 실패했습니다',
    }
  }
}

// ============================================
// Style Only Generation
// ============================================

export interface GenerateStyleInput {
  prompt: string
  mood?: string[]
}

export interface GenerateStyleOutput {
  success: boolean
  data?: StyleSchema
  error?: string
}

/**
 * 스타일만 생성 (레이아웃 없이)
 */
export async function generateStyleAction(
  input: GenerateStyleInput
): Promise<GenerateStyleOutput> {
  try {
    const aiProvider = createGeminiProvider()
    const style = await aiProvider.generateStyle(input.prompt, input.mood)

    return {
      success: true,
      data: style,
    }
  } catch (error) {
    console.error('Style generation failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '스타일 생성에 실패했습니다',
    }
  }
}

// ============================================
// Stage 1: Intro Only Generation
// ============================================

export interface GenerateIntroInput {
  prompt: string
  mood?: string[]
}

export interface GenerateIntroOutput {
  success: boolean
  data?: IntroGenerationResult
  error?: string
}

/**
 * Stage 1: Style + Intro만 생성
 */
export async function generateIntroOnlyAction(
  input: GenerateIntroInput
): Promise<GenerateIntroOutput> {
  try {
    const aiProvider = createGeminiProvider()

    const options: GenerationOptions = {
      prompt: input.prompt,
      mood: input.mood,
    }

    const result = await generateIntroOnly(options, aiProvider)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Intro generation failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Intro 생성에 실패했습니다',
    }
  }
}

// ============================================
// Stage 2: Complete Template with Defaults
// ============================================

export interface CompleteTemplateInput {
  introResult: IntroGenerationResult
  enabledSections?: string[]
}

export interface CompleteTemplateOutput {
  success: boolean
  data?: GenerationResult
  error?: string
}

/**
 * Stage 2: Intro 결과 + 기본 섹션들로 전체 템플릿 완성
 */
export async function completeTemplateAction(
  input: CompleteTemplateInput
): Promise<CompleteTemplateOutput> {
  try {
    const result = completeTemplateWithDefaults(
      input.introResult,
      input.enabledSections as import('../skeletons/types').SectionType[] | undefined
    )

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Template completion failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '템플릿 완성에 실패했습니다',
    }
  }
}

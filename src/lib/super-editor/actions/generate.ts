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
import { db } from '@/lib/db'
import { superEditorTemplates, superEditorInvitations } from '@/lib/db/super-editor-schema'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { UserData, WeddingInvitationData } from '../schema/user-data'
import type { EditorSchema } from '../schema/editor'

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

// ============================================
// Stage 3: Save to Database
// ============================================

export interface SaveInvitationInput {
  // 생성 결과
  generationResult: GenerationResult
  // 프리뷰 폼 데이터
  previewData: {
    groomName: string
    brideName: string
    weddingDate: string // YYYY-MM-DD
    weddingTime: string // HH:mm
    mainImage?: string // base64 data URL 또는 URL
  }
  // 레거시 프리셋 사용 시
  legacyPresetId?: string
}

export interface SaveInvitationOutput {
  success: boolean
  data?: { invitationId: string }
  error?: string
}

/**
 * Stage 3: 생성된 템플릿을 DB에 저장하고 invitation 생성
 * superEditorTemplates + superEditorInvitations 사용
 */
export async function saveInvitationAction(
  input: SaveInvitationInput
): Promise<SaveInvitationOutput> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    const { generationResult, previewData, legacyPresetId } = input

    // 1. Template 생성 (레이아웃, 스타일, 에디터 스키마 저장)
    const editorSchema: EditorSchema = {
      version: '1.0',
      meta: {
        id: 'default',
        name: '기본 에디터',
        layoutId: 'default',
        styleId: 'default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      sections: [],
    }

    const [template] = await db.insert(superEditorTemplates).values({
      name: legacyPresetId ? `레거시: ${legacyPresetId}` : 'AI 생성 템플릿',
      description: legacyPresetId ? `레거시 프리셋 ${legacyPresetId} 기반` : 'AI가 생성한 템플릿',
      category: 'wedding',
      layoutSchema: generationResult.layout,
      styleSchema: generationResult.style,
      editorSchema,
      status: 'draft',
      generationContext: {
        prompt: legacyPresetId || 'super-editor',
        model: 'gemini',
        generatedAt: new Date().toISOString(),
      },
    }).returning()

    // 2. UserData 구성
    const weddingData: WeddingInvitationData = {
      couple: {
        groom: { name: previewData.groomName || '신랑' },
        bride: { name: previewData.brideName || '신부' },
      },
      wedding: {
        date: previewData.weddingDate || new Date().toISOString().split('T')[0],
        time: previewData.weddingTime || '12:00',
      },
      venue: {
        name: '',
        address: '',
        lat: 0,
        lng: 0,
      },
      photos: {
        main: previewData.mainImage || '',
        gallery: previewData.mainImage ? [previewData.mainImage] : [],
      },
      greeting: {
        content: '',
      },
    }

    const userData: UserData = {
      version: '1.0',
      meta: {
        id: template.id,
        templateId: template.id,
        layoutId: 'default',
        styleId: 'default',
        editorId: 'default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      data: weddingData as unknown as Record<string, unknown>,
    }

    // 3. Invitation 생성
    const [invitation] = await db.insert(superEditorInvitations).values({
      templateId: template.id,
      userId: user.id,
      userData,
      status: 'draft',
    }).returning()

    revalidatePath('/my/invitations')

    return { success: true, data: { invitationId: invitation.id } }
  } catch (error) {
    console.error('Failed to save invitation:', error)
    const errorMessage = error instanceof Error ? error.message : '청첩장 저장에 실패했습니다'
    return { success: false, error: errorMessage }
  }
}

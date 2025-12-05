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
import { invitations, invitationDesigns, invitationPhotos } from '@/lib/db/invitation-schema'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
    mainImage?: string // base64 data URL
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

    // 1. Invitation 생성
    const [invitation] = await db.insert(invitations).values({
      userId: user.id,
      groomName: previewData.groomName || '신랑',
      brideName: previewData.brideName || '신부',
      weddingDate: previewData.weddingDate || new Date().toISOString().split('T')[0],
      weddingTime: previewData.weddingTime || '12:00',
      venueName: '',
      venueAddress: '',
      status: 'draft',
      templateId: legacyPresetId || 'super-editor',
    }).returning()

    // 2. Design 데이터 구성 (SuperEditor 전용 포맷)
    const designData = {
      version: 'super-editor-v1' as const,
      style: generationResult.style,
      tokens: generationResult.tokens,
      cssVariables: generationResult.cssVariables,
      layout: generationResult.layout,
      screens: generationResult.screens,
      legacyPresetId,
    }

    // 3. InvitationDesign 생성
    const [design] = await db.insert(invitationDesigns).values({
      invitationId: invitation.id,
      designData: designData as unknown as Record<string, unknown>,
      generationBatch: 1,
      isSelected: true,
    }).returning()

    // 4. Invitation에 선택된 디자인 연결
    await db.update(invitations)
      .set({
        selectedDesignId: design.id,
        updatedAt: new Date(),
      })
      .where(eq(invitations.id, invitation.id))

    // 5. 이미지가 있으면 저장
    if (previewData.mainImage && previewData.mainImage.startsWith('data:')) {
      try {
        const fileName = `${invitation.id}/${Date.now()}.jpg`
        const base64Data = previewData.mainImage.replace(/^data:image\/\w+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('invitation-photos')
          .upload(fileName, buffer, {
            contentType: 'image/jpeg',
            upsert: true,
          })

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('invitation-photos')
            .getPublicUrl(fileName)

          await db.insert(invitationPhotos).values({
            invitationId: invitation.id,
            storagePath: fileName,
            url: urlData.publicUrl,
            displayOrder: 0,
          })
        }
      } catch (photoError) {
        console.error('Failed to upload photo:', photoError)
        // 사진 업로드 실패해도 계속 진행
      }
    }

    revalidatePath('/my/invitations')

    return { success: true, data: { invitationId: invitation.id } }
  } catch (error) {
    console.error('Failed to save invitation:', error)
    const errorMessage = error instanceof Error ? error.message : '청첩장 저장에 실패했습니다'
    return { success: false, error: errorMessage }
  }
}

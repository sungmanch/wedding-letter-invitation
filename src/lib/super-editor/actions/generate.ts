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
import type { LayoutSchema } from '../schema/layout'
import type { VariablesSchema } from '../schema/variables'
import { db } from '@/lib/db'
import { getTemplate, type TemplateId } from '../templates'
import { superEditorTemplates, superEditorInvitations } from '@/lib/db/super-editor-schema'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { UserData, WeddingInvitationData } from '../schema/user-data'
import { getTemplateDefaultImage } from '../presets/legacy/template-preview-data'

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
  // AI 생성 또는 레거시 템플릿의 intro 결과
  introResult?: IntroGenerationResult
  // 새 super-editor 템플릿 ID (introResult 대신 사용)
  newTemplateId?: string
  enabledSections?: string[]
}

export interface CompleteTemplateOutput {
  success: boolean
  data?: GenerationResult
  error?: string
}

/**
 * 새 템플릿에서 IntroGenerationResult 생성
 */
function createIntroResultFromTemplate(templateId: string): IntroGenerationResult | undefined {
  const { resolveTokens } = require('../tokens/resolver')
  const { generateCssVariables } = require('../tokens/css-generator')

  const template = getTemplate(templateId as TemplateId)
  if (!template) return undefined

  const style = template.style
  const tokens = resolveTokens(style)
  const cssVariables = generateCssVariables(tokens)

  // 템플릿의 첫 번째 screen을 intro로 사용
  const introScreenDef = template.layout.screens[0]
  if (!introScreenDef) return undefined

  // PrimitiveNode를 SkeletonNode로 변환 (구조가 동일하므로 타입 캐스팅)
  const introScreen = {
    id: introScreenDef.id,
    name: template.layout.meta.name,
    type: 'intro' as const,
    sectionType: 'intro' as const,
    root: introScreenDef.root as unknown as import('../skeletons/types').SkeletonNode,
  }

  return {
    style,
    tokens,
    cssVariables,
    introScreen,
  }
}

/**
 * Stage 2: Intro 결과 + 기본 섹션들로 전체 템플릿 완성
 */
export async function completeTemplateAction(
  input: CompleteTemplateInput
): Promise<CompleteTemplateOutput> {
  try {
    let introResult = input.introResult

    // 새 템플릿 ID가 있으면 해당 템플릿에서 IntroGenerationResult 생성
    if (!introResult && input.newTemplateId) {
      introResult = createIntroResultFromTemplate(input.newTemplateId)
      if (!introResult) {
        return {
          success: false,
          error: `템플릿 '${input.newTemplateId}'을(를) 찾을 수 없습니다`,
        }
      }
    }

    if (!introResult) {
      return {
        success: false,
        error: 'introResult 또는 newTemplateId가 필요합니다',
      }
    }

    const result = completeTemplateWithDefaults(
      introResult,
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
  // 생성 결과 (AI 생성 또는 레거시 템플릿용)
  generationResult?: GenerationResult
  // 새 super-editor 템플릿 ID (generationResult 대신 사용)
  newTemplateId?: string
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
  // 변수 선언 (에디터 필드 생성용)
  variablesSchema?: VariablesSchema
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

    const { generationResult, newTemplateId, previewData, legacyPresetId, variablesSchema } = input

    // 새 템플릿 또는 생성 결과에서 layout/style 추출
    let layoutSchema: LayoutSchema
    let styleSchema: StyleSchema
    let templateName: string
    let templateDescription: string
    let variables: VariablesSchema | undefined = variablesSchema

    if (newTemplateId) {
      // 새 super-editor 템플릿 사용
      const predefinedTemplate = getTemplate(newTemplateId as TemplateId)
      if (!predefinedTemplate) {
        return { success: false, error: `템플릿 '${newTemplateId}'을(를) 찾을 수 없습니다` }
      }
      layoutSchema = predefinedTemplate.layout
      styleSchema = predefinedTemplate.style
      templateName = `템플릿: ${predefinedTemplate.layout.meta.name}`
      templateDescription = `${newTemplateId} 템플릿 기반`
    } else if (generationResult) {
      // AI 생성 또는 레거시 템플릿
      layoutSchema = generationResult.layout
      styleSchema = generationResult.style
      templateName = legacyPresetId ? `레거시: ${legacyPresetId}` : 'AI 생성 템플릿'
      templateDescription = legacyPresetId ? `레거시 프리셋 ${legacyPresetId} 기반` : 'AI가 생성한 템플릿'
    } else {
      return { success: false, error: 'generationResult 또는 newTemplateId가 필요합니다' }
    }

    // 1. Template 생성 (레이아웃, 스타일, 변수 선언 저장)
    // 에디터 필드는 variablesSchema + Layout의 {{변수}}에서 동적 생성됨
    const [template] = await db.insert(superEditorTemplates).values({
      name: templateName,
      description: templateDescription,
      category: 'wedding',
      layoutSchema,
      styleSchema,
      variablesSchema: variables,
      status: 'draft',
      generationContext: {
        prompt: newTemplateId || legacyPresetId || 'super-editor',
        model: newTemplateId ? 'predefined' : 'gemini',
        generatedAt: new Date().toISOString(),
      },
    }).returning()

    // 2. UserData 구성
    // 템플릿별 예시 이미지를 fallback으로 사용
    const defaultImage = legacyPresetId
      ? getTemplateDefaultImage(legacyPresetId)
      : undefined
    const mainImage = previewData.mainImage || defaultImage || ''

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
        main: mainImage,
        gallery: mainImage ? [mainImage] : [],
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

// ============================================
// Default Editor Sections
// ============================================
// EditorSchema는 Layout의 {{변수}}에서 동적 생성됨
// (editor-generator.ts 참조)

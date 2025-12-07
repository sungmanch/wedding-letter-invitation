'use server'

/**
 * Super Editor - Create from Legacy Template Action
 * /create 페이지에서 레거시 템플릿 선택 시 SE 시스템으로 생성
 */

import { db } from '@/lib/db'
import { superEditorTemplates, superEditorInvitations } from '@/lib/db/super-editor-schema'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { legacyPresets } from '../presets/legacy'
import { convertLegacyToIntroResult } from './legacy-converter'
import { completeTemplateWithDefaults } from '../services/generation-service'
import type { UserData, WeddingInvitationData } from '../schema/user-data'

// ============================================
// Input/Output Types
// ============================================

export interface CreateFromLegacyInput {
  /** 레거시 템플릿 ID (예: 'cinematic', 'exhibition', 'magazine') */
  legacyTemplateId: string
  /** 초기 프리뷰 데이터 */
  previewData?: {
    groomName?: string
    brideName?: string
    weddingDate?: string
    weddingTime?: string
    mainImage?: string
  }
}

export interface CreateFromLegacyOutput {
  success: boolean
  data?: {
    invitationId: string
  }
  error?: string
}

// ============================================
// Default Preview Data
// ============================================

const DEFAULT_PREVIEW_DATA = {
  groomName: '신랑',
  brideName: '신부',
  weddingDate: getDefaultWeddingDate(),
  weddingTime: '12:00',
}

function getDefaultWeddingDate(): string {
  const date = new Date()
  date.setMonth(date.getMonth() + 3)
  return date.toISOString().split('T')[0]
}

// ============================================
// Main Action
// ============================================

/**
 * 레거시 템플릿에서 Super Editor 청첩장 생성
 *
 * 1. legacyPresets에서 템플릿 조회
 * 2. IntroGenerationResult로 변환
 * 3. 기본 섹션들로 전체 템플릿 완성
 * 4. DB에 저장 (superEditorTemplates + superEditorInvitations)
 */
export async function createFromLegacyTemplateAction(
  input: CreateFromLegacyInput
): Promise<CreateFromLegacyOutput> {
  try {
    // 1. 인증 확인
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    const { legacyTemplateId, previewData = {} } = input

    // 2. 레거시 프리셋 조회
    const legacyPreset = legacyPresets[legacyTemplateId]
    if (!legacyPreset) {
      return {
        success: false,
        error: `템플릿 '${legacyTemplateId}'을(를) 찾을 수 없습니다`
      }
    }

    // 3. IntroGenerationResult로 변환
    const introResult = convertLegacyToIntroResult(legacyPreset)

    // 4. 기본 섹션들로 전체 템플릿 완성
    const generationResult = completeTemplateWithDefaults(introResult)

    // 5. 프리뷰 데이터 병합
    const mergedPreviewData = {
      ...DEFAULT_PREVIEW_DATA,
      ...previewData,
    }

    // 6. Template 생성 (DB 저장)
    const [template] = await db.insert(superEditorTemplates).values({
      name: `${legacyPreset.nameKo}`,
      description: legacyPreset.descriptionKo,
      category: 'wedding',
      layoutSchema: generationResult.layout,
      styleSchema: generationResult.style,
      status: 'draft',
      generationContext: {
        prompt: legacyTemplateId,
        model: 'legacy-preset',
        generatedAt: new Date().toISOString(),
      },
    }).returning()

    // 7. UserData 구성
    const weddingData: WeddingInvitationData = {
      couple: {
        groom: { name: mergedPreviewData.groomName },
        bride: { name: mergedPreviewData.brideName },
      },
      wedding: {
        date: mergedPreviewData.weddingDate,
        time: mergedPreviewData.weddingTime,
      },
      venue: {
        name: '',
        address: '',
        lat: 0,
        lng: 0,
      },
      photos: {
        main: mergedPreviewData.mainImage || '',
        gallery: mergedPreviewData.mainImage ? [mergedPreviewData.mainImage] : [],
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

    // 8. Invitation 생성
    const [invitation] = await db.insert(superEditorInvitations).values({
      templateId: template.id,
      userId: user.id,
      userData,
      status: 'draft',
    }).returning()

    revalidatePath('/my/invitations')

    return {
      success: true,
      data: { invitationId: invitation.id }
    }

  } catch (error) {
    console.error('Failed to create from legacy template:', error)
    const errorMessage = error instanceof Error ? error.message : '청첩장 생성에 실패했습니다'
    return { success: false, error: errorMessage }
  }
}

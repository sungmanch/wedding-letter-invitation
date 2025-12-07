'use server'

/**
 * Legacy Invitation → Super Editor Migration
 * 기존 Legacy 청첩장을 SE 시스템으로 마이그레이션
 */

import { db } from '@/lib/db'
import {
  invitations,
  invitationDesigns,
  invitationPhotos,
} from '@/lib/db/invitation-schema'
import {
  superEditorTemplates,
  superEditorInvitations,
} from '@/lib/db/super-editor-schema'
import { eq } from 'drizzle-orm'
import { legacyPresets } from '../presets/legacy'
import { convertLegacyToIntroResult } from '../actions/legacy-converter'
import { completeTemplateWithDefaults } from '../services/generation-service'
import type { UserData, WeddingInvitationData } from '../schema/user-data'
import type { Invitation, InvitationDesign, InvitationPhoto } from '@/lib/db/invitation-schema'

// ============================================
// Types
// ============================================

export interface MigrationResult {
  success: boolean
  seInvitationId?: string
  error?: string
}

// ============================================
// Helper Functions
// ============================================

/**
 * Legacy designData에서 템플릿 ID 추출
 */
function extractTemplateIdFromDesign(designData: Record<string, unknown>): string {
  // v2 형식: designData.template.id 또는 designData.template.theme
  if (designData.template && typeof designData.template === 'object') {
    const template = designData.template as Record<string, unknown>
    if (template.id && typeof template.id === 'string') {
      return template.id
    }
    if (template.theme && typeof template.theme === 'string') {
      return template.theme
    }
  }

  // 레거시 형식: designData.theme
  if (designData.theme && typeof designData.theme === 'string') {
    return designData.theme
  }

  // 기본값
  return 'cinematic'
}

/**
 * Legacy Invitation → UserData 변환
 */
function convertInvitationToUserData(
  invitation: Invitation,
  photos: InvitationPhoto[]
): UserData {
  const weddingData: WeddingInvitationData = {
    couple: {
      groom: {
        name: invitation.groomName,
        phone: invitation.groomPhone ?? undefined,
      },
      bride: {
        name: invitation.brideName,
        phone: invitation.bridePhone ?? undefined,
      },
    },
    wedding: {
      date: invitation.weddingDate,
      time: invitation.weddingTime,
    },
    venue: {
      name: invitation.venueName,
      address: invitation.venueAddress,
      addressDetail: invitation.venueDetail ?? undefined,
      lat: 0,
      lng: 0,
    },
    photos: {
      main: photos[0]?.url ?? '',
      gallery: photos.map((p) => p.url),
    },
    greeting: {
      content: '',
    },
    accounts: {
      groom: invitation.groomBank
        ? [{
            bank: invitation.groomBank,
            accountNumber: invitation.groomAccount ?? '',
            holder: invitation.groomAccountHolder ?? '',
          }]
        : undefined,
      bride: invitation.brideBank
        ? [{
            bank: invitation.brideBank,
            accountNumber: invitation.brideAccount ?? '',
            holder: invitation.brideAccountHolder ?? '',
          }]
        : undefined,
    },
    parents: {
      groom: {
        father: invitation.groomFatherName
          ? { name: invitation.groomFatherName, phone: invitation.groomFatherPhone ?? undefined }
          : undefined,
        mother: invitation.groomMotherName
          ? { name: invitation.groomMotherName, phone: invitation.groomMotherPhone ?? undefined }
          : undefined,
      },
      bride: {
        father: invitation.brideFatherName
          ? { name: invitation.brideFatherName, phone: invitation.brideFatherPhone ?? undefined }
          : undefined,
        mother: invitation.brideMotherName
          ? { name: invitation.brideMotherName, phone: invitation.brideMotherPhone ?? undefined }
          : undefined,
      },
    },
  }

  return {
    version: '1.0',
    meta: {
      id: invitation.id,
      templateId: 'migrated',
      layoutId: 'default',
      styleId: 'default',
      editorId: 'default',
      createdAt: invitation.createdAt.toISOString(),
      updatedAt: invitation.updatedAt.toISOString(),
    },
    data: weddingData as unknown as Record<string, unknown>,
  }
}

// ============================================
// Main Migration Function
// ============================================

/**
 * Legacy Invitation을 Super Editor로 마이그레이션
 *
 * @param invitationId - Legacy invitation ID
 * @returns MigrationResult
 */
export async function migrateInvitationToSE(
  invitationId: string
): Promise<MigrationResult> {
  try {
    // 1. Legacy invitation 조회
    const invitation = await db.query.invitations.findFirst({
      where: eq(invitations.id, invitationId),
    })

    if (!invitation) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    // 2. 이미 마이그레이션된 경우 스킵
    if (invitation.seInvitationId) {
      return {
        success: true,
        seInvitationId: invitation.seInvitationId,
      }
    }

    // 3. 관련 데이터 조회
    const design = invitation.selectedDesignId
      ? await db.query.invitationDesigns.findFirst({
          where: eq(invitationDesigns.id, invitation.selectedDesignId),
        })
      : null

    const photos = await db.query.invitationPhotos.findMany({
      where: eq(invitationPhotos.invitationId, invitationId),
      orderBy: (photo, { asc }) => [asc(photo.displayOrder)],
    })

    // 4. 템플릿 ID 결정
    const templateId = design?.designData
      ? extractTemplateIdFromDesign(design.designData as Record<string, unknown>)
      : 'cinematic'

    // 5. Legacy 프리셋 가져오기
    const preset = legacyPresets[templateId]
    if (!preset) {
      // 프리셋이 없으면 기본 cinematic 사용
      console.warn(`Preset not found for ${templateId}, using cinematic`)
    }
    const activePreset = preset || legacyPresets['cinematic']

    // 6. IntroGenerationResult 생성
    const introResult = convertLegacyToIntroResult(activePreset, {
      groomName: invitation.groomName,
      brideName: invitation.brideName,
      weddingDate: invitation.weddingDate,
      mainImage: photos[0]?.url,
    })

    // 7. 전체 템플릿 완성
    const generationResult = completeTemplateWithDefaults(introResult)

    // 8. SE Template 생성
    const [seTemplate] = await db
      .insert(superEditorTemplates)
      .values({
        name: `마이그레이션: ${activePreset.nameKo}`,
        description: `${invitation.groomName} ♥ ${invitation.brideName}`,
        category: 'wedding',
        layoutSchema: generationResult.layout,
        styleSchema: generationResult.style,
        status: 'draft',
        generationContext: {
          prompt: `migration:${invitationId}`,
          model: 'legacy-migration',
          generatedAt: new Date().toISOString(),
        },
      })
      .returning()

    // 9. UserData 생성
    const userData = convertInvitationToUserData(invitation, photos)
    userData.meta.templateId = seTemplate.id

    // 10. SE Invitation 생성
    const [seInvitation] = await db
      .insert(superEditorInvitations)
      .values({
        templateId: seTemplate.id,
        userId: invitation.userId ?? '',
        userData,
        status: invitation.status === 'published' ? 'published' : 'draft',
        isPaid: invitation.isPaid,
      })
      .returning()

    // 11. Legacy invitation 업데이트
    await db
      .update(invitations)
      .set({
        seInvitationId: seInvitation.id,
        editorType: 'super-editor',
        updatedAt: new Date(),
      })
      .where(eq(invitations.id, invitationId))

    return {
      success: true,
      seInvitationId: seInvitation.id,
    }
  } catch (error) {
    console.error('Migration failed:', error)
    const errorMessage =
      error instanceof Error ? error.message : '마이그레이션에 실패했습니다'
    return { success: false, error: errorMessage }
  }
}

/**
 * 배치 마이그레이션 (여러 청첩장 일괄 변환)
 */
export async function batchMigrateToSE(
  limit = 100
): Promise<{ total: number; success: number; failed: number }> {
  // editorType이 legacy이고 seInvitationId가 없는 청첩장 조회
  const legacyInvitations = await db.query.invitations.findMany({
    where: eq(invitations.editorType, 'legacy'),
    limit,
  })

  let success = 0
  let failed = 0

  for (const inv of legacyInvitations) {
    if (inv.seInvitationId) {
      // 이미 마이그레이션됨
      success++
      continue
    }

    const result = await migrateInvitationToSE(inv.id)
    if (result.success) {
      success++
    } else {
      console.error(`Failed to migrate ${inv.id}:`, result.error)
      failed++
    }
  }

  return {
    total: legacyInvitations.length,
    success,
    failed,
  }
}

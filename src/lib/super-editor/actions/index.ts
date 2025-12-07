'use server'

import { db } from '@/lib/db'
import { superEditorTemplates, superEditorInvitations } from '@/lib/db/super-editor-schema'
import { eq, and } from 'drizzle-orm'
import { buildHtml } from '../builder'
import { createClient } from '@/lib/supabase/server'
import type { LayoutSchema } from '../schema/layout'
import type { StyleSchema } from '../schema/style'
import type { VariablesSchema } from '../schema/variables'
import type { UserData } from '../schema/user-data'
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_ENABLED } from '../schema/section-types'

// ============================================
// Template Actions
// ============================================

export async function getTemplate(templateId: string) {
  const template = await db.query.superEditorTemplates.findFirst({
    where: eq(superEditorTemplates.id, templateId),
  })

  return template
}

export async function getPublicTemplates() {
  const templates = await db.query.superEditorTemplates.findMany({
    where: eq(superEditorTemplates.isPublic, true),
  })

  return templates
}

export async function createTemplate(data: {
  name: string
  description?: string
  category: string
  layout: LayoutSchema
  style: StyleSchema
  variables?: VariablesSchema
}) {
  const [template] = await db.insert(superEditorTemplates).values({
    name: data.name,
    description: data.description,
    category: data.category,
    layoutSchema: data.layout,
    styleSchema: data.style,
    variablesSchema: data.variables,
    status: 'draft',
    isPublic: false,
  }).returning()

  return template
}

/**
 * 템플릿의 variablesSchema 업데이트
 */
export async function updateTemplateVariables(
  templateId: string,
  variablesSchema: VariablesSchema
) {
  const [updated] = await db
    .update(superEditorTemplates)
    .set({
      variablesSchema,
      updatedAt: new Date(),
    })
    .where(eq(superEditorTemplates.id, templateId))
    .returning()

  return updated
}

// ============================================
// Invitation Actions
// ============================================

export async function getInvitation(invitationId: string) {
  const invitation = await db.query.superEditorInvitations.findFirst({
    where: eq(superEditorInvitations.id, invitationId),
  })

  return invitation
}

/**
 * 청첩장 + 템플릿 함께 조회 (편집 페이지용)
 * 인증된 사용자 본인의 청첩장만 조회 가능
 */
export async function getInvitationWithTemplate(invitationId: string) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const invitation = await db.query.superEditorInvitations.findFirst({
    where: and(
      eq(superEditorInvitations.id, invitationId),
      eq(superEditorInvitations.userId, user.id)
    ),
  })

  if (!invitation) {
    return null
  }

  const template = await db.query.superEditorTemplates.findFirst({
    where: eq(superEditorTemplates.id, invitation.templateId),
  })

  if (!template) {
    return null
  }

  return { invitation, template }
}

/**
 * 미리보기용 청첩장 조회
 * 토큰이 있으면 토큰 검증 후 조회, 없으면 인증된 사용자 본인 것만 조회
 */
export async function getInvitationForPreview(invitationId: string, hasValidToken: boolean) {
  if (hasValidToken) {
    // 토큰이 유효하면 청첩장 조회 (소유자 확인 없이)
    const invitation = await db.query.superEditorInvitations.findFirst({
      where: eq(superEditorInvitations.id, invitationId),
    })
    return invitation
  }

  // 토큰이 없으면 인증된 사용자 본인 것만
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const invitation = await db.query.superEditorInvitations.findFirst({
    where: and(
      eq(superEditorInvitations.id, invitationId),
      eq(superEditorInvitations.userId, user.id)
    ),
  })

  return invitation
}

/**
 * 공개된 청첩장 조회 (결제 완료된 것만)
 * 템플릿 정보도 함께 반환
 */
export async function getPublishedInvitation(invitationId: string) {
  const invitation = await db.query.superEditorInvitations.findFirst({
    where: and(
      eq(superEditorInvitations.id, invitationId),
      eq(superEditorInvitations.status, 'published')
    ),
  })

  if (!invitation) {
    return null
  }

  const template = await db.query.superEditorTemplates.findFirst({
    where: eq(superEditorTemplates.id, invitation.templateId),
  })

  if (!template) {
    return null
  }

  return { invitation, template }
}

export async function createInvitation(data: {
  templateId: string
  userData: UserData
}) {
  // 인증된 사용자 가져오기
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const [invitation] = await db.insert(superEditorInvitations).values({
    templateId: data.templateId,
    userId: user.id,
    userData: data.userData,
    sectionOrder: DEFAULT_SECTION_ORDER,
    sectionEnabled: DEFAULT_SECTION_ENABLED,
    status: 'draft',
  }).returning()

  return invitation
}

export async function updateInvitationData(
  invitationId: string,
  userData: UserData
) {
  const [updated] = await db
    .update(superEditorInvitations)
    .set({
      userData,
      updatedAt: new Date(),
    })
    .where(eq(superEditorInvitations.id, invitationId))
    .returning()

  return updated
}

export async function updateInvitationSections(
  invitationId: string,
  sectionOrder: string[],
  sectionEnabled: Record<string, boolean>
) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const [updated] = await db
    .update(superEditorInvitations)
    .set({
      sectionOrder,
      sectionEnabled,
      updatedAt: new Date(),
    })
    .where(and(
      eq(superEditorInvitations.id, invitationId),
      eq(superEditorInvitations.userId, user.id)
    ))
    .returning()

  return updated
}

export async function updateTemplateStyle(
  invitationId: string,
  styleSchema: StyleSchema
) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  // 먼저 invitation에서 templateId 조회
  const invitation = await db.query.superEditorInvitations.findFirst({
    where: and(
      eq(superEditorInvitations.id, invitationId),
      eq(superEditorInvitations.userId, user.id)
    ),
  })

  if (!invitation) {
    throw new Error('Invitation not found')
  }

  // 템플릿의 styleSchema 업데이트
  const [updated] = await db
    .update(superEditorTemplates)
    .set({
      styleSchema,
      updatedAt: new Date(),
    })
    .where(eq(superEditorTemplates.id, invitation.templateId))
    .returning()

  return updated
}

export async function updateTemplateLayout(
  invitationId: string,
  layoutSchema: LayoutSchema
) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  // 먼저 invitation에서 templateId 조회
  const invitation = await db.query.superEditorInvitations.findFirst({
    where: and(
      eq(superEditorInvitations.id, invitationId),
      eq(superEditorInvitations.userId, user.id)
    ),
  })

  if (!invitation) {
    throw new Error('Invitation not found')
  }

  // 템플릿의 layoutSchema 업데이트
  const [updated] = await db
    .update(superEditorTemplates)
    .set({
      layoutSchema,
      updatedAt: new Date(),
    })
    .where(eq(superEditorTemplates.id, invitation.templateId))
    .returning()

  return updated
}

// ============================================
// Build Action
// ============================================

export async function buildInvitation(invitationId: string) {
  // 초대장 가져오기
  const invitation = await db.query.superEditorInvitations.findFirst({
    where: eq(superEditorInvitations.id, invitationId),
  })

  if (!invitation) {
    throw new Error('Invitation not found')
  }

  // 템플릿 가져오기
  const template = await db.query.superEditorTemplates.findFirst({
    where: eq(superEditorTemplates.id, invitation.templateId),
  })

  if (!template) {
    throw new Error('Template not found')
  }

  // 상태 업데이트: building
  await db
    .update(superEditorInvitations)
    .set({ status: 'building' })
    .where(eq(superEditorInvitations.id, invitationId))

  try {
    // HTML 빌드
    const result = buildHtml(
      template.layoutSchema as LayoutSchema,
      template.styleSchema as StyleSchema,
      invitation.userData as UserData
    )

    // 결과 저장
    const [updated] = await db
      .update(superEditorInvitations)
      .set({
        buildResult: result,
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(superEditorInvitations.id, invitationId))
      .returning()

    return { success: true, invitation: updated, result }
  } catch (error) {
    // 에러 처리
    await db
      .update(superEditorInvitations)
      .set({
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date(),
      })
      .where(eq(superEditorInvitations.id, invitationId))

    throw error
  }
}

// ============================================
// OG Metadata Actions
// ============================================

const OG_BUCKET_NAME = 'og-images'

/**
 * OG 이미지 업로드 (1200x630 JPG 이미지)
 */
export async function uploadOgImage(
  invitationId: string,
  imageData: string // base64 encoded JPG
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 소유권 확인
    const invitation = await db.query.superEditorInvitations.findFirst({
      where: and(
        eq(superEditorInvitations.id, invitationId),
        eq(superEditorInvitations.userId, user.id)
      ),
    })

    if (!invitation) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    // base64 → Buffer
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // 파일명: invitationId/og-{timestamp}.jpg
    const filename = `${invitationId}/og-${Date.now()}.jpg`

    // 기존 OG 이미지가 있으면 삭제
    if (invitation.ogImageUrl) {
      const oldPath = invitation.ogImageUrl.split(`${OG_BUCKET_NAME}/`)[1]
      if (oldPath) {
        await supabase.storage.from(OG_BUCKET_NAME).remove([oldPath])
      }
    }

    // Supabase Storage에 업로드
    const { error: uploadError } = await supabase.storage
      .from(OG_BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) {
      console.error('OG image upload error:', uploadError)
      return { success: false, error: '이미지 업로드에 실패했습니다' }
    }

    // Public URL 가져오기
    const { data: urlData } = supabase.storage
      .from(OG_BUCKET_NAME)
      .getPublicUrl(filename)

    // DB 업데이트
    await db
      .update(superEditorInvitations)
      .set({
        ogImageUrl: urlData.publicUrl,
        updatedAt: new Date(),
      })
      .where(eq(superEditorInvitations.id, invitationId))

    return { success: true, url: urlData.publicUrl }
  } catch (error) {
    console.error('Failed to upload OG image:', error)
    return { success: false, error: 'OG 이미지 업로드에 실패했습니다' }
  }
}

/**
 * OG 메타데이터 업데이트 (title, description)
 */
export async function updateOgMetadata(
  invitationId: string,
  data: { ogTitle?: string; ogDescription?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 소유권 확인
    const invitation = await db.query.superEditorInvitations.findFirst({
      where: and(
        eq(superEditorInvitations.id, invitationId),
        eq(superEditorInvitations.userId, user.id)
      ),
    })

    if (!invitation) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    await db
      .update(superEditorInvitations)
      .set({
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        updatedAt: new Date(),
      })
      .where(eq(superEditorInvitations.id, invitationId))

    return { success: true }
  } catch (error) {
    console.error('Failed to update OG metadata:', error)
    return { success: false, error: 'OG 메타데이터 업데이트에 실패했습니다' }
  }
}

/**
 * OG 메타데이터 조회
 */
export async function getOgMetadata(invitationId: string): Promise<{
  ogTitle: string | null
  ogDescription: string | null
  ogImageUrl: string | null
} | null> {
  const invitation = await db.query.superEditorInvitations.findFirst({
    where: eq(superEditorInvitations.id, invitationId),
  })

  if (!invitation) {
    return null
  }

  return {
    ogTitle: invitation.ogTitle,
    ogDescription: invitation.ogDescription,
    ogImageUrl: invitation.ogImageUrl,
  }
}

// ============================================
// LLM Generation Action (Placeholder)
// ============================================

export async function generateTemplateWithLLM(prompt: string) {
  // TODO: 실제 LLM API 호출 구현
  // 현재는 샘플 템플릿 반환

  const sampleLayout: LayoutSchema = {
    version: '1.0',
    meta: {
      id: 'sample-template',
      name: 'AI 생성 템플릿',
      category: 'chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    screens: [
      {
        id: 'intro',
        type: 'intro',
        sectionType: 'intro',
        root: {
          id: 'root',
          type: 'fullscreen',
          style: {
            backgroundColor: '#fff5f5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          },
          children: [
            {
              id: 'title',
              type: 'text',
              props: {
                content: '{{couple.groom.name}} ♥ {{couple.bride.name}}',
                as: 'h1',
              },
              style: {
                fontSize: 28,
                fontWeight: 700,
                color: '#333',
                marginBottom: 16,
              },
            },
            {
              id: 'date',
              type: 'text',
              props: {
                content: '{{wedding.dateDisplay}}',
                as: 'p',
              },
              style: {
                fontSize: 16,
                color: '#666',
              },
            },
            {
              id: 'main-photo',
              type: 'image',
              props: {
                src: '{{photos.main}}',
                aspectRatio: '3:4',
                objectFit: 'cover',
              },
              style: {
                marginTop: 24,
                borderRadius: 12,
                maxWidth: 300,
              },
            },
          ],
        },
      },
    ],
  }

  const sampleStyle: StyleSchema = {
    version: '1.0',
    meta: {
      id: 'sample-style',
      name: '로맨틱 스타일',
      mood: ['romantic'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    theme: {
      colors: {
        primary: { 500: '#e11d48' },
        neutral: { 500: '#6b7280' },
        background: { default: '#fff5f5' },
        text: { primary: '#1f2937' },
      },
      typography: {
        fonts: {
          heading: { family: 'Pretendard, sans-serif' },
          body: { family: 'Pretendard, sans-serif' },
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
        lineHeights: { tight: 1.25, normal: 1.5, relaxed: 1.75 },
        letterSpacing: { tight: '-0.02em', normal: '0', wide: '0.02em' },
      },
      spacing: {
        unit: 4,
        scale: {
          0: '0',
          1: '0.25rem',
          2: '0.5rem',
          3: '0.75rem',
          4: '1rem',
          5: '1.25rem',
          6: '1.5rem',
          8: '2rem',
          10: '2.5rem',
          12: '3rem',
          16: '4rem',
        },
      },
      borders: {
        radius: { none: '0', sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '9999px' },
        width: { thin: '1px', default: '2px', thick: '4px' },
        style: 'solid',
        color: '#e5e7eb',
      },
      shadows: {
        none: 'none',
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.1)',
        xl: '0 20px 25px rgba(0,0,0,0.1)',
      },
      animation: {
        duration: { fast: 150, normal: 300, slow: 500, slower: 700 },
        easing: { default: 'ease', in: 'ease-in', out: 'ease-out', inOut: 'ease-in-out' },
        stagger: { delay: 100, from: 'start' },
      },
    },
    tokens: {},
    components: {},
  }

  // EditorSchema는 Layout의 {{변수}}에서 동적 생성됨

  return {
    layout: sampleLayout,
    style: sampleStyle,
  }
}

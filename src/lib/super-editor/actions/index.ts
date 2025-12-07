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
const GALLERY_BUCKET_NAME = 'wedding-photos'
const MAX_GALLERY_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

// ============================================
// Gallery Image Upload Actions
// ============================================

/**
 * 갤러리 이미지 업로드 (단일/다중)
 * base64 데이터를 Supabase Storage에 업로드하고 URL 반환
 */
export async function uploadGalleryImages(
  invitationId: string,
  images: Array<{ data: string; filename: string; mimeType: string }>
): Promise<{ success: boolean; urls?: string[]; errors?: string[] }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, errors: ['로그인이 필요합니다'] }
    }

    // 소유권 확인
    const invitation = await db.query.superEditorInvitations.findFirst({
      where: and(
        eq(superEditorInvitations.id, invitationId),
        eq(superEditorInvitations.userId, user.id)
      ),
    })

    if (!invitation) {
      return { success: false, errors: ['청첩장을 찾을 수 없습니다'] }
    }

    const uploadedUrls: string[] = []
    const errors: string[] = []

    for (const image of images) {
      // MIME 타입 검증
      if (!ALLOWED_IMAGE_TYPES.includes(image.mimeType)) {
        errors.push(`${image.filename}: 지원하지 않는 이미지 형식입니다`)
        continue
      }

      // base64 → Buffer
      const base64Data = image.data.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')

      // 파일 크기 검증
      if (buffer.length > MAX_GALLERY_IMAGE_SIZE) {
        errors.push(`${image.filename}: 파일 크기가 10MB를 초과합니다`)
        continue
      }

      // 파일 확장자 결정
      const ext = image.mimeType.split('/')[1] === 'jpeg' ? 'jpg' : image.mimeType.split('/')[1]
      const filename = `se/${invitationId}/gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      // Supabase Storage에 업로드
      const { error: uploadError } = await supabase.storage
        .from(GALLERY_BUCKET_NAME)
        .upload(filename, buffer, {
          contentType: image.mimeType,
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Gallery image upload error:', uploadError)
        errors.push(`${image.filename}: 업로드에 실패했습니다`)
        continue
      }

      // Public URL 가져오기
      const { data: urlData } = supabase.storage
        .from(GALLERY_BUCKET_NAME)
        .getPublicUrl(filename)

      uploadedUrls.push(urlData.publicUrl)
    }

    if (uploadedUrls.length === 0 && errors.length > 0) {
      return { success: false, errors }
    }

    return { success: true, urls: uploadedUrls, errors: errors.length > 0 ? errors : undefined }
  } catch (error) {
    console.error('Failed to upload gallery images:', error)
    return { success: false, errors: ['이미지 업로드에 실패했습니다'] }
  }
}

/**
 * 갤러리 이미지 삭제
 */
export async function deleteGalleryImage(
  invitationId: string,
  imageUrl: string
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

    // URL에서 storage path 추출
    const pathMatch = imageUrl.match(new RegExp(`${GALLERY_BUCKET_NAME}/(.+)$`))
    if (!pathMatch) {
      return { success: false, error: '유효하지 않은 이미지 URL입니다' }
    }

    const storagePath = pathMatch[1]

    // 본인 청첩장의 이미지인지 확인 (se/{invitationId}/ 경로)
    if (!storagePath.startsWith(`se/${invitationId}/`)) {
      return { success: false, error: '삭제 권한이 없습니다' }
    }

    // Storage에서 삭제
    const { error: deleteError } = await supabase.storage
      .from(GALLERY_BUCKET_NAME)
      .remove([storagePath])

    if (deleteError) {
      console.error('Gallery image delete error:', deleteError)
      return { success: false, error: '이미지 삭제에 실패했습니다' }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to delete gallery image:', error)
    return { success: false, error: '이미지 삭제에 실패했습니다' }
  }
}

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
// Geocoding Action (주소 → 좌표 변환)
// ============================================

interface GeocodeResult {
  success: boolean
  lat?: number
  lng?: number
  error?: string
}

/**
 * 도로명주소를 좌표(위도/경도)로 변환
 * VWorld Geocoder API 사용 (국토교통부)
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  if (!address.trim()) {
    return { success: false, error: '주소를 입력해주세요' }
  }

  const apiKey = process.env.VWORLD_API_KEY
  if (!apiKey) {
    console.error('VWORLD_API_KEY is not set')
    return { success: false, error: 'Geocoding API가 설정되지 않았습니다' }
  }

  try {
    const url = new URL('https://api.vworld.kr/req/address')
    url.searchParams.set('service', 'address')
    url.searchParams.set('request', 'getCoord')
    url.searchParams.set('version', '2.0')
    url.searchParams.set('crs', 'epsg:4326')
    url.searchParams.set('type', 'ROAD')
    url.searchParams.set('refine', 'true')
    url.searchParams.set('simple', 'false')
    url.searchParams.set('format', 'json')
    url.searchParams.set('key', apiKey)
    url.searchParams.set('address', address)

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    // VWorld API 응답 구조 확인
    if (data.response?.status === 'OK' && data.response?.result?.point) {
      const point = data.response.result.point
      return {
        success: true,
        lat: parseFloat(point.y),
        lng: parseFloat(point.x),
      }
    }

    // 도로명 주소로 찾지 못한 경우 지번 주소로 재시도
    url.searchParams.set('type', 'PARCEL')
    const retryResponse = await fetch(url.toString())
    const retryData = await retryResponse.json()

    if (retryData.response?.status === 'OK' && retryData.response?.result?.point) {
      const point = retryData.response.result.point
      return {
        success: true,
        lat: parseFloat(point.y),
        lng: parseFloat(point.x),
      }
    }

    return { success: false, error: '주소를 찾을 수 없습니다' }
  } catch (error) {
    console.error('Geocoding failed:', error)
    return { success: false, error: '좌표 변환에 실패했습니다' }
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

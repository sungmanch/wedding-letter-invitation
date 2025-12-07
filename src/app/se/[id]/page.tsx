import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { superEditorInvitations, superEditorTemplates } from '@/lib/db/super-editor-schema'
import { eq, and } from 'drizzle-orm'
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_ENABLED } from '@/lib/super-editor/schema/section-types'
import { ViewerClient } from './ViewerClient'
import type { LayoutSchema } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { UserData, WeddingInvitationData } from '@/lib/super-editor/schema/user-data'
import type { SectionType } from '@/lib/super-editor/schema/section-types'

interface PageProps {
  params: Promise<{ id: string }>
}

// 청첩장 데이터 가져오기
async function getInvitationData(id: string) {
  const invitation = await db.query.superEditorInvitations.findFirst({
    where: and(
      eq(superEditorInvitations.id, id),
      eq(superEditorInvitations.status, 'published')
    ),
  })

  if (!invitation || !invitation.isPaid) {
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

// 메타데이터에서 사용할 정보 추출
function extractShareInfo(userData: UserData) {
  const data = userData.data as unknown as WeddingInvitationData | undefined

  const groomName = data?.couple?.groom?.name || '신랑'
  const brideName = data?.couple?.bride?.name || '신부'
  const title = `${groomName} ♥ ${brideName} 결혼합니다`

  const dateDisplay = data?.wedding?.dateDisplay || ''
  const venueName = data?.venue?.name || ''
  const description = dateDisplay && venueName
    ? `${dateDisplay} | ${venueName}`
    : '모바일 청첩장'

  const imageUrl = data?.photos?.main || data?.photos?.cover

  return { title, description, imageUrl }
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const data = await getInvitationData(id)

  if (!data) {
    return {
      title: '청첩장을 찾을 수 없습니다',
    }
  }

  const { invitation } = data
  const userData = invitation.userData as UserData
  const fallback = extractShareInfo(userData)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wedding-letter.vercel.app'
  const url = `${baseUrl}/se/${id}`

  // DB에 저장된 OG 데이터 우선 사용, 없으면 fallback
  const title = invitation.ogTitle || fallback.title
  const description = invitation.ogDescription || fallback.description
  const imageUrl = invitation.ogImageUrl || fallback.imageUrl

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Maison de Letter',
      type: 'website',
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
    other: {
      'og:locale': 'ko_KR',
    },
  }
}

// 페이지 컴포넌트
export default async function SuperEditorViewerPage({ params }: PageProps) {
  const { id } = await params
  const data = await getInvitationData(id)

  if (!data) {
    notFound()
  }

  const { invitation, template } = data
  const userData = invitation.userData as UserData
  const sectionOrder = (invitation.sectionOrder as SectionType[]) ?? DEFAULT_SECTION_ORDER
  const sectionEnabled = (invitation.sectionEnabled as Record<SectionType, boolean>) ?? DEFAULT_SECTION_ENABLED
  const shareInfo = extractShareInfo(userData)

  return (
    <ViewerClient
      invitationId={id}
      layout={template.layoutSchema as LayoutSchema}
      style={template.styleSchema as StyleSchema}
      userData={userData}
      sectionOrder={sectionOrder}
      sectionEnabled={sectionEnabled}
      shareInfo={shareInfo}
    />
  )
}

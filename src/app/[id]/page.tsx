import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import { getInvitation } from '@/lib/actions/wedding'
import { InvitationViewer } from '@/components/invitation'
import { GuestActions } from './GuestActions'
import { db } from '@/lib/db'
import { superEditorInvitations, superEditorTemplates } from '@/lib/db/super-editor-schema'
import { eq, and } from 'drizzle-orm'
import { ViewerClient } from '../se/[id]/ViewerClient'
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_ENABLED } from '@/lib/super-editor/schema/section-types'
import type { LayoutSchema } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { UserData, WeddingInvitationData } from '@/lib/super-editor/schema/user-data'
import type { SectionType } from '@/lib/super-editor/schema/section-types'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string }>
}

// SE invitation 조회 헬퍼
async function getSuperEditorInvitation(id: string) {
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

// SE invitation 공유 정보 추출
function extractSeShareInfo(userData: UserData) {
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

// Dynamic OG metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  // 1. SE invitation으로 먼저 시도
  const seData = await getSuperEditorInvitation(id)
  if (seData) {
    const userData = seData.invitation.userData as UserData
    const { title, description, imageUrl } = extractSeShareInfo(userData)
    return {
      title,
      description,
      robots: { index: false, follow: false },
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'ko_KR',
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: title }] : [],
      },
    }
  }

  // 2. Legacy invitation 확인
  const result = await getInvitation(id)

  if (!result.success || !result.data) {
    return { title: '청첩장을 찾을 수 없습니다' }
  }

  const invitation = result.data

  // 3. Legacy가 SE로 마이그레이션된 경우
  if (invitation.seInvitationId) {
    const seInvData = await getSuperEditorInvitation(invitation.seInvitationId)
    if (seInvData) {
      const userData = seInvData.invitation.userData as UserData
      const { title, description, imageUrl } = extractSeShareInfo(userData)
      return {
        title,
        description,
        robots: { index: false, follow: false },
        openGraph: {
          title,
          description,
          type: 'website',
          locale: 'ko_KR',
          images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: title }] : [],
        },
      }
    }
  }

  // 4. Legacy 메타데이터
  const weddingDate = new Date(invitation.weddingDate)
  const formattedDate = weddingDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return {
    title: `${invitation.groomName} ♥ ${invitation.brideName} 결혼합니다`,
    description: `${formattedDate} ${invitation.venueName}`,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `${invitation.groomName} ♥ ${invitation.brideName} 결혼합니다`,
      description: `${formattedDate} ${invitation.venueName}`,
      type: 'website',
      locale: 'ko_KR',
      images: [
        {
          url: '/og-wedding.png',
          width: 1200,
          height: 630,
          alt: '모바일 청첩장',
        },
      ],
    },
  }
}

export default async function GuestInvitationPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { success } = await searchParams

  // 1. SE invitation으로 직접 접근 시도
  const seData = await getSuperEditorInvitation(id)
  if (seData) {
    const { invitation, template } = seData
    const userData = invitation.userData as UserData
    const sectionOrder = (invitation.sectionOrder as SectionType[]) ?? DEFAULT_SECTION_ORDER
    const sectionEnabled = (invitation.sectionEnabled as Record<SectionType, boolean>) ?? DEFAULT_SECTION_ENABLED
    const shareInfo = extractSeShareInfo(userData)

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

  // 2. Legacy invitation 확인
  const result = await getInvitation(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const invitation = result.data

  // Only show published invitations to guests
  if (invitation.status !== 'published') {
    notFound()
  }

  // 3. SE로 마이그레이션된 경우
  if (invitation.seInvitationId) {
    const seInvData = await getSuperEditorInvitation(invitation.seInvitationId)
    if (seInvData) {
      const { invitation: seInv, template } = seInvData
      const userData = seInv.userData as UserData
      const sectionOrder = (seInv.sectionOrder as SectionType[]) ?? DEFAULT_SECTION_ORDER
      const sectionEnabled = (seInv.sectionEnabled as Record<SectionType, boolean>) ?? DEFAULT_SECTION_ENABLED
      const shareInfo = extractSeShareInfo(userData)

      return (
        <ViewerClient
          invitationId={invitation.seInvitationId}
          layout={template.layoutSchema as LayoutSchema}
          style={template.styleSchema as StyleSchema}
          userData={userData}
          sectionOrder={sectionOrder}
          sectionEnabled={sectionEnabled}
          shareInfo={shareInfo}
        />
      )
    }
  }

  // 4. Legacy 뷰어 (fallback)
  return (
    <div className="invitation-mobile-only">
      <div className="flex flex-col min-h-screen bg-white">
        {/* Payment Success Banner */}
        {success === 'true' && (
          <div className="bg-green-50 border-b border-green-200 p-4 text-center">
            <p className="text-green-700 font-medium">
              결제가 완료되었습니다! 이제 청첩장을 공유할 수 있어요.
            </p>
          </div>
        )}

        {/* Invitation Content */}
        <InvitationViewer
          invitation={invitation}
          design={invitation.selectedDesign}
          photos={invitation.photos}
        />

        {/* Guest Actions (Message Form, etc.) */}
        <GuestActions invitationId={invitation.id} />
      </div>
    </div>
  )
}

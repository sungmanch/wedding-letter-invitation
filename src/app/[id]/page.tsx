import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getInvitation } from '@/lib/actions/wedding'
import { InvitationViewer } from '@/components/invitation'
import { MessageForm } from '@/components/invitation'
import { GuestActions } from './GuestActions'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string }>
}

// Dynamic OG metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const result = await getInvitation(id)

  if (!result.success || !result.data) {
    return {
      title: '청첩장을 찾을 수 없습니다',
    }
  }

  const invitation = result.data
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

  const result = await getInvitation(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const invitation = result.data

  // Only show published invitations to guests
  if (invitation.status !== 'published') {
    notFound()
  }

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

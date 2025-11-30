import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getInvitation } from '@/lib/actions/wedding'
import { ShareClient } from './ShareClient'

export const metadata = {
  title: '청첩장 공유 - 모바일 청첩장',
  description: '청첩장을 카카오톡으로 공유하세요',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/${id}/share`)
  }

  const invitationResult = await getInvitation(id)

  if (!invitationResult.success || !invitationResult.data) {
    notFound()
  }

  const invitation = invitationResult.data

  // Verify ownership
  if (invitation.userId !== user.id) {
    redirect('/my/invitations')
  }

  // Must be paid to share
  if (!invitation.isPaid && invitation.status !== 'published') {
    redirect(`/${id}/payment`)
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${id}`

  return (
    <ShareClient
      invitation={invitation}
      shareUrl={shareUrl}
    />
  )
}

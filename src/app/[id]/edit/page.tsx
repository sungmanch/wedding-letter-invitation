import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getInvitation } from '@/lib/actions/wedding'
import { EditClient } from './EditClient'

export const metadata = {
  title: '청첩장 편집 - Maison de Letter',
  description: '청첩장 정보를 편집합니다',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPage({ params }: PageProps) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/${id}/edit`)
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

  // Generate share URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wedding.example.com'
  const shareUrl = `${baseUrl}/${id}`

  return (
    <EditClient
      invitation={invitation}
      design={invitation.selectedDesign}
      photos={invitation.photos || []}
      shareUrl={shareUrl}
    />
  )
}

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getInvitation } from '@/lib/actions/wedding'
import { getPhotos } from '@/lib/actions/photo'
import { selectDesign } from '@/lib/actions/wedding'
import { PhotoUploadClient } from './PhotoUploadClient'

export const metadata = {
  title: '사진 업로드 - 모바일 청첩장',
  description: '청첩장에 들어갈 사진을 업로드하세요',
}

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ design?: string }>
}

export default async function PhotoUploadPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { design: designId } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/${id}/photos`)
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

  // Select design if provided in query params
  if (designId && invitation.selectedDesignId !== designId) {
    await selectDesign(id, designId)
  }

  const photosResult = await getPhotos(id)
  const photos = photosResult.data || []

  return (
    <PhotoUploadClient
      invitationId={id}
      initialPhotos={photos}
      design={invitation.selectedDesign}
    />
  )
}

import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getInvitation } from '@/lib/actions/wedding'
import { InvitationViewer } from '@/components/invitation'
import { Button } from '@/components/ui'
import { ArrowLeft, Edit, CreditCard } from 'lucide-react'

export const metadata = {
  title: '청첩장 미리보기 - Maison de Letter',
  description: '완성된 청첩장을 미리보기합니다',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PreviewPage({ params }: PageProps) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/${id}/preview`)
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

  const isPaid = invitation.isPaid
  const isPublished = invitation.status === 'published'

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center">
            <Link
              href={`/${id}/photos`}
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-charcoal" />
            </Link>
            <span className="ml-2 font-medium text-charcoal">미리보기</span>
          </div>
          {!isPublished && (
            <Link
              href={`/${id}/edit`}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-charcoal"
            >
              <Edit className="h-4 w-4" />
              수정
            </Link>
          )}
        </div>
      </header>

      {/* Preview Content */}
      <main className="flex-1 pb-24 bg-gray-100 lg:py-8 isolate">
        {/* Desktop: centered mobile preview */}
        <div className="lg:max-w-md lg:mx-auto lg:shadow-2xl lg:rounded-3xl overflow-hidden lg:bg-white isolate">
          <InvitationViewer
            invitation={invitation}
            design={invitation.selectedDesign}
            photos={invitation.photos}
            isPreview={true}
          />
        </div>
      </main>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-4 z-20 lg:left-1/2 lg:-translate-x-1/2 lg:max-w-2xl lg:rounded-t-2xl lg:shadow-lg">
        {isPaid || isPublished ? (
          <div className="flex gap-3">
            <Link href={`/${id}/share`} className="flex-1">
              <Button className="w-full bg-[#D4768A] hover:bg-[#c4657a] text-white">
                공유하기
              </Button>
            </Link>
            <Link href={`/${id}/messages`} className="flex-1">
              <Button variant="outline" className="w-full">
                축하 메시지
              </Button>
            </Link>
          </div>
        ) : (
          <Link href={`/${id}/payment`}>
            <Button className="w-full bg-[#D4768A] hover:bg-[#c4657a] text-white">
              <CreditCard className="mr-2 h-4 w-4" />
              결제하고 공유하기
            </Button>
          </Link>
        )}
      </div>

      {/* Status Badge */}
      {!isPaid && !isPublished && (
        <div className="fixed top-16 left-4 right-4 z-10 lg:left-1/2 lg:-translate-x-1/2 lg:max-w-md lg:px-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
            <p className="text-sm text-yellow-800">
              미리보기 모드입니다. 결제 후 공유할 수 있어요.
            </p>
          </div>
        </div>
      )}

      {/* FAB Edit Button (visible when not published) */}
      {!isPublished && (
        <Link
          href={`/${id}/edit`}
          className="fixed bottom-24 right-4 z-30 flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors lg:hidden"
        >
          <Edit className="h-6 w-6 text-[#D4768A]" />
        </Link>
      )}
    </div>
  )
}

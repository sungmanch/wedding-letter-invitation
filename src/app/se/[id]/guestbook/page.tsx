import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { superEditorInvitations } from '@/lib/db/super-editor-schema'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { GuestbookClient } from './GuestbookClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function GuestbookPage({ params }: PageProps) {
  const { id } = await params

  // 인증 확인
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirectTo=/se/${id}/guestbook`)
  }

  // 청첩장 조회
  const invitation = await db.query.superEditorInvitations.findFirst({
    where: eq(superEditorInvitations.id, id),
  })

  if (!invitation) {
    notFound()
  }

  // 소유자 확인
  if (invitation.userId !== user.id) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href={`/se/${id}/edit`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>돌아가기</span>
          </Link>
          <h1 className="font-semibold text-gray-900">축하 메시지</h1>
          <div className="w-20" /> {/* 균형을 위한 빈 공간 */}
        </div>
      </header>

      {/* 메시지 목록 */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <GuestbookClient invitationId={id} />
      </main>
    </div>
  )
}

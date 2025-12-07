import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { superEditorInvitations, superEditorTemplates } from '@/lib/db/super-editor-schema'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { InvitationListClient } from './InvitationListClient'
import type { LayoutSchema } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { UserData } from '@/lib/super-editor/schema/user-data'

export default async function SuperEditorListPage() {
  // 인증 확인
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/se')
  }

  // 사용자의 청첩장 목록 조회
  const invitations = await db.query.superEditorInvitations.findMany({
    where: eq(superEditorInvitations.userId, user.id),
    orderBy: (invitations, { desc }) => [desc(invitations.createdAt)],
  })

  // 각 청첩장의 템플릿 정보 가져오기
  const invitationsWithTemplates = await Promise.all(
    invitations.map(async (invitation) => {
      const template = await db.query.superEditorTemplates.findFirst({
        where: eq(superEditorTemplates.id, invitation.templateId),
      })

      return {
        id: invitation.id,
        isPaid: invitation.isPaid,
        status: invitation.status,
        createdAt: invitation.createdAt,
        updatedAt: invitation.updatedAt,
        userData: invitation.userData as UserData,
        layout: template?.layoutSchema as LayoutSchema | undefined,
        style: template?.styleSchema as StyleSchema | undefined,
        templateName: template?.name,
      }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>홈</span>
          </Link>
          <h1 className="font-semibold text-gray-900">내 청첩장</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* 청첩장 개수 */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            {invitationsWithTemplates.length}개의 청첩장
          </p>
        </div>

        {invitationsWithTemplates.length === 0 ? (
          /* 빈 상태 */
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">아직 청첩장이 없어요</h2>
            <p className="text-gray-500 mb-6">새 청첩장을 만들어보세요</p>
            <Link
              href="/create"
              className="inline-block px-6 py-3 bg-rose-500 text-white font-medium rounded-xl hover:bg-rose-600 transition-colors"
            >
              청첩장 만들기
            </Link>
          </div>
        ) : (
          /* 청첩장 목록 */
          <InvitationListClient invitations={invitationsWithTemplates} />
        )}
      </main>

      {/* FAB - 새 청첩장 만들기 */}
      {invitationsWithTemplates.length > 0 && (
        <Link
          href="/create"
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg hover:bg-rose-600 transition-all hover:scale-105 active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      )}
    </div>
  )
}

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { superEditorInvitations, superEditorTemplates, guestbookMessages } from '@/lib/db/super-editor-schema'
import { eq, count } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { DashboardClient, ShareLinkCard } from './DashboardClient'
import type { LayoutSchema } from '@/lib/super-editor/schema/layout'
import type { StyleSchema } from '@/lib/super-editor/schema/style'
import type { UserData } from '@/lib/super-editor/schema/user-data'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardPage({ params }: PageProps) {
  const { id } = await params

  // 인증 확인
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirectTo=/se/${id}/dashboard`)
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

  // 템플릿 조회
  const template = await db.query.superEditorTemplates.findFirst({
    where: eq(superEditorTemplates.id, invitation.templateId),
  })

  if (!template) {
    notFound()
  }

  // 게스트북 메시지 수 조회
  const [messageCountResult] = await db
    .select({ count: count() })
    .from(guestbookMessages)
    .where(eq(guestbookMessages.invitationId, id))

  const messageCount = messageCountResult?.count ?? 0

  // 상태 정보
  const isPaid = invitation.isPaid
  const isPublished = invitation.status === 'published'
  const viewCount = invitation.viewCount ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/my"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>내 청첩장</span>
          </Link>
          <h1 className="font-semibold text-gray-900">대시보드</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* 상태 배지 */}
        <div className="flex items-center gap-2">
          {isPaid ? (
            <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
              결제 완료
            </span>
          ) : (
            <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-full">
              결제 대기
            </span>
          )}
          {isPublished ? (
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
              공개됨
            </span>
          ) : (
            <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full">
              비공개
            </span>
          )}
        </div>

        {/* 인트로 미리보기 + 액션 버튼 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">청첩장 미리보기</h2>

            {/* 인트로 프리뷰 */}
            <DashboardClient
              layout={template.layoutSchema as LayoutSchema}
              style={template.styleSchema as StyleSchema}
              userData={invitation.userData as UserData}
            />
          </div>

          {/* 액션 버튼 */}
          <div className="border-t border-gray-100 p-4 flex gap-3">
            <Link
              href={`/se/${id}/edit`}
              className="flex-1 py-3 bg-rose-500 text-white font-medium rounded-xl text-center hover:bg-rose-600 transition-colors"
            >
              편집하기
            </Link>
            <Link
              href={`/se/${id}/preview`}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl text-center hover:bg-gray-200 transition-colors"
            >
              전체 미리보기
            </Link>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 조회수 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">조회수</p>
                <p className="text-2xl font-bold text-gray-900">{viewCount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* 축하 메시지 */}
          <Link
            href={`/se/${id}/guestbook`}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:border-rose-200 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">축하 메시지</p>
                <p className="text-2xl font-bold text-gray-900">{messageCount.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-sm text-rose-500 mt-2">보러가기 →</p>
          </Link>
        </div>

        {/* 공유 링크 */}
        {isPaid && isPublished && (
          <ShareLinkCard invitationId={id} />
        )}

        {/* 결제 안내 (미결제 시) */}
        {!isPaid && (
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">청첩장을 공유하려면 결제가 필요해요</h3>
            <p className="text-rose-100 mb-4">결제 후 청첩장 링크를 하객들에게 공유할 수 있습니다.</p>
            <Link
              href={`/se/${id}/edit`}
              className="inline-block px-6 py-3 bg-white text-rose-500 font-semibold rounded-xl hover:bg-rose-50 transition-colors"
            >
              결제하러 가기
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

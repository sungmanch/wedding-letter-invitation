import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getMyInvitations } from '@/lib/actions/wedding'
import { listDocuments } from '@/lib/super-editor-v2/actions/document'
import { Plus, ArrowLeft, Calendar, Edit, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'
import type { Invitation } from '@/lib/db/invitation-schema'
import type { EditorDocumentV2 } from '@/lib/super-editor-v2/schema/db-schema'

export const metadata = {
  title: '내 청첩장 - Maison de Letter',
  description: '내가 만든 청첩장 목록',
}

export default async function MyInvitationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/my/invitations')
  }

  // SE1 청첩장과 SE2 문서 모두 가져오기
  const [se1Result, se2Documents] = await Promise.all([
    getMyInvitations(),
    listDocuments().catch(() => [] as EditorDocumentV2[]), // SE2 테이블이 없을 경우 빈 배열
  ])
  const se1Invitations = se1Result.data || []

  const hasAnyContent = se1Invitations.length > 0 || se2Documents.length > 0

  return (
    <div className="flex flex-col min-h-screen bg-[var(--ivory-100)]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--sand-100)] bg-[var(--ivory-100)]/95 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-[var(--sand-100)]"
            >
              <ArrowLeft className="h-5 w-5 text-[var(--text-primary)]" />
            </Link>
            <span className="ml-2 font-medium text-[var(--text-primary)]">내 청첩장</span>
          </div>
          <Link href="/se2/create">
            <Button size="sm" className="bg-[var(--sage-500)] hover:bg-[var(--sage-600)] text-white">
              <Plus className="h-4 w-4 mr-1" />
              새 청첩장
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        {!hasAnyContent ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {/* SE2 문서 목록 */}
            {se2Documents.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  새 에디터
                </h2>
                <div className="space-y-3">
                  {se2Documents.map((doc) => (
                    <SE2DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              </section>
            )}

            {/* SE1 청첩장 목록 */}
            {se1Invitations.length > 0 && (
              <section>
                {se2Documents.length > 0 && (
                  <h2 className="text-sm font-medium text-[var(--text-muted)] mb-3">
                    이전 청첩장
                  </h2>
                )}
                <div className="space-y-3">
                  {se1Invitations.map((invitation) => (
                    <InvitationCard key={invitation.id} invitation={invitation} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">💍</div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
        아직 만든 청첩장이 없어요
      </h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        AI와 대화하며 나만의 청첩장을 만들어보세요
      </p>
      <Link href="/se2/create">
        <Button className="bg-[var(--sage-500)] hover:bg-[var(--sage-600)] text-white">
          <Plus className="h-4 w-4 mr-2" />
          청첩장 만들기
        </Button>
      </Link>
    </div>
  )
}

// SE2 문서 카드
function SE2DocumentCard({ document }: { document: EditorDocumentV2 }) {
  const updatedAt = new Date(document.updatedAt)
  const formattedDate = updatedAt.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  // WeddingData에서 신랑/신부 이름 추출
  const weddingData = document.data as { couple?: { groom?: { name?: string }, bride?: { name?: string } } }
  const groomName = weddingData?.couple?.groom?.name || '신랑'
  const brideName = weddingData?.couple?.bride?.name || '신부'

  const statusConfig = {
    draft: {
      label: '작성중',
      color: 'bg-amber-100 text-amber-700',
    },
    building: {
      label: '생성중',
      color: 'bg-blue-100 text-blue-700',
    },
    published: {
      label: '공개중',
      color: 'bg-green-100 text-green-700',
    },
    error: {
      label: '오류',
      color: 'bg-red-100 text-red-500',
    },
  }

  const status = statusConfig[document.status as keyof typeof statusConfig] || statusConfig.draft

  return (
    <Link
      href={`/se2/${document.id}/edit`}
      className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-[var(--sand-100)]"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">
            {groomName} ♥ {brideName}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-[var(--text-muted)]">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-[var(--sage-100)] text-[var(--sage-600)]">
            v2
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--text-muted)]">{document.title}</span>
        <span className="flex items-center gap-1 text-[var(--sage-500)]">
          <Edit className="h-4 w-4" />
          편집하기
        </span>
      </div>
    </Link>
  )
}

function InvitationCard({ invitation }: { invitation: Invitation }) {
  const weddingDate = new Date(invitation.weddingDate)
  const formattedDate = weddingDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const statusConfig = {
    draft: {
      label: '작성중',
      color: 'bg-amber-100 text-amber-700',
    },
    published: {
      label: '공개중',
      color: 'bg-green-100 text-green-700',
    },
    deleted: {
      label: '삭제됨',
      color: 'bg-gray-100 text-gray-500',
    },
  }

  const status = statusConfig[invitation.status as keyof typeof statusConfig] || statusConfig.draft

  const href = invitation.status === 'draft'
    ? `/${invitation.id}/preview`
    : `/${invitation.id}/share`

  return (
    <Link
      href={href}
      className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-[var(--sand-100)]"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">
            {invitation.groomName} ♥ {invitation.brideName}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-[var(--text-muted)]">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--text-muted)]">{invitation.venueName}</span>
        <span className="flex items-center gap-1 text-[var(--sage-500)]">
          <Edit className="h-4 w-4" />
          {invitation.status === 'draft' ? '이어서 작성' : '관리하기'}
        </span>
      </div>
    </Link>
  )
}

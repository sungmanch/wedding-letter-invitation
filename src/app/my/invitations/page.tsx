import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getMyInvitations } from '@/lib/actions/wedding'
import { Plus, ArrowLeft, Calendar, Edit } from 'lucide-react'
import { Button } from '@/components/ui'
import type { Invitation } from '@/lib/db/invitation-schema'

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

  const result = await getMyInvitations()
  const invitations = result.data || []

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFBFC]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center">
            <Link
              href="/my"
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-charcoal" />
            </Link>
            <span className="ml-2 font-medium text-charcoal">내 청첩장</span>
          </div>
          <Link href="/create">
            <Button size="sm" className="bg-[#D4768A] hover:bg-[#c4657a] text-white">
              <Plus className="h-4 w-4 mr-1" />
              새 청첩장
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        {invitations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <InvitationCard key={invitation.id} invitation={invitation} />
            ))}
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
      <h2 className="text-lg font-semibold text-charcoal mb-2">
        아직 만든 청첩장이 없어요
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        AI와 대화하며 나만의 청첩장을 만들어보세요
      </p>
      <Link href="/create">
        <Button className="bg-[#D4768A] hover:bg-[#c4657a] text-white">
          <Plus className="h-4 w-4 mr-2" />
          청첩장 만들기
        </Button>
      </Link>
    </div>
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
      color: 'bg-yellow-100 text-yellow-700',
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
      className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-charcoal">
            {invitation.groomName} ♥ {invitation.brideName}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">{invitation.venueName}</span>
        <span className="flex items-center gap-1 text-[#D4768A]">
          <Edit className="h-4 w-4" />
          {invitation.status === 'draft' ? '이어서 작성' : '관리하기'}
        </span>
      </div>
    </Link>
  )
}

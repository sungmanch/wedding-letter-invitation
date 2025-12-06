import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getInvitation } from '@/lib/actions/wedding'
import { getMessages } from '@/lib/actions/message'
import { MessageList } from '@/components/invitation'
import { ArrowLeft, Share2 } from 'lucide-react'
import { MessagesClient } from './MessagesClient'

export const metadata = {
  title: '축하 메시지 - Maison de Letter',
  description: '받은 축하 메시지를 확인하세요',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MessagesPage({ params }: PageProps) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/${id}/messages`)
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

  const messagesResult = await getMessages(id)
  const messages = messagesResult.data || []

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFBFC] lg:max-w-2xl lg:mx-auto lg:shadow-xl">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center">
            <Link
              href={`/${id}/share`}
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-charcoal" />
            </Link>
            <span className="ml-2 font-medium text-charcoal">축하 메시지</span>
          </div>
          <Link
            href={`/${id}/share`}
            className="flex items-center gap-1 text-sm text-[#D4768A] font-medium"
          >
            <Share2 className="h-4 w-4" />
            공유하기
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        {/* Stats */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">받은 메시지</p>
              <p className="text-2xl font-bold text-charcoal">{messages.length}개</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">새 메시지</p>
              <p className="text-2xl font-bold text-[#D4768A]">
                {messages.filter((m) => !m.isRead).length}개
              </p>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <MessagesClient
          invitationId={id}
          initialMessages={messages}
        />
      </main>
    </div>
  )
}

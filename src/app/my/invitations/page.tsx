import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { listDocuments } from '@/lib/super-editor-v2/actions'
import { InvitationCard } from './InvitationCard'
import type {
  Block,
  StyleSystem,
  WeddingData,
  GlobalAnimation,
} from '@/lib/super-editor-v2/schema/types'

export const metadata: Metadata = {
  title: '내 청첩장 - Maison de Letter',
  description: '내가 만든 청첩장 목록을 확인하고 관리하세요.',
}

export default async function MyInvitationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/my/invitations')
  }

  const documents = await listDocuments()

  return (
    <main className="min-h-screen bg-[var(--ivory-100)]">
      {/* Header */}
      <header className="border-b border-[var(--sand-100)] bg-[var(--ivory-100)]/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors">
                ← 홈으로
              </Link>
              <h1 className="text-2xl font-semibold text-[var(--text-heading)] mt-2">
                내 청첩장
              </h1>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--sage-600)] text-white rounded-lg hover:bg-[var(--sage-700)] transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              새 청첩장 만들기
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {documents.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 text-[var(--sand-300)] mx-auto mb-4" />
            <h2 className="text-lg font-medium text-[var(--text-heading)] mb-2">
              아직 만든 청첩장이 없어요
            </h2>
            <p className="text-[var(--text-muted)] mb-6">
              첫 번째 청첩장을 만들어보세요!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--sage-600)] text-white rounded-lg hover:bg-[var(--sage-700)] transition-colors font-medium"
            >
              <Plus className="h-4 w-4" />
              청첩장 만들기
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <InvitationCard
                key={doc.id}
                id={doc.id}
                title={doc.title}
                status={doc.status}
                blocks={doc.blocks as Block[]}
                style={doc.style as StyleSystem}
                data={doc.data as WeddingData}
                animation={doc.animation as GlobalAnimation | null}
                updatedAt={new Date(doc.updatedAt)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

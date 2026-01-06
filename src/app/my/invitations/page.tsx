import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { listDocuments } from '@/lib/super-editor-v2/actions'
import { InvitationTabs } from './InvitationTabs'
import type {
  Block,
  Element,
  StyleSystem,
  WeddingData,
  GlobalAnimation,
} from '@/lib/super-editor-v2/schema/types'
import type { EditorDocumentV2 } from '@/lib/super-editor-v2/schema/db-schema'

/** 요소가 유효한 SE2 요소인지 확인 */
function isValidElement(el: Element): boolean {
  if (!el || typeof el !== 'object') return false
  if (typeof el.id !== 'string' || typeof el.type !== 'string') return false
  // props가 있어야 하고 props.type이 있어야 함
  if (!el.props || typeof el.props !== 'object' || typeof el.props.type !== 'string') return false
  // children이 있으면 재귀 검증
  if (el.children && Array.isArray(el.children)) {
    return el.children.every(isValidElement)
  }
  return true
}

/** SE2 문서인지 확인 (레거시 문서 필터링) */
function isValidSE2Document(doc: EditorDocumentV2): boolean {
  // blocks가 배열이고 최소 1개 이상의 블록이 있어야 함
  if (!Array.isArray(doc.blocks) || doc.blocks.length === 0) return false

  // 각 블록에 type, id가 있고 elements의 모든 요소가 유효해야 함
  const blocks = doc.blocks as Block[]
  const hasValidBlocks = blocks.every((block) => {
    if (!block || typeof block.type !== 'string' || typeof block.id !== 'string') return false
    // elements가 있으면 모든 요소 검증
    if (block.elements && Array.isArray(block.elements)) {
      return block.elements.every(isValidElement)
    }
    return true
  })
  if (!hasValidBlocks) return false

  // data에 wedding 관련 필드가 있어야 함
  const data = doc.data as WeddingData | null
  if (!data || typeof data !== 'object') return false

  return true
}

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

  const allDocuments = await listDocuments()

  // 레거시 문서 필터링
  const documents = allDocuments.filter(isValidSE2Document)

  // 상태별로 분류 (draft, building = 작성 중 / published = 발행됨)
  const publishedDocs = documents
    .filter((doc) => doc.status === 'published')
    .map((doc) => ({
      id: doc.id,
      title: doc.title,
      status: doc.status,
      blocks: doc.blocks as Block[],
      style: doc.style as StyleSystem,
      data: doc.data as WeddingData,
      animation: doc.animation as GlobalAnimation | null,
      updatedAt: new Date(doc.updatedAt),
    }))

  const draftDocs = documents
    .filter((doc) => doc.status === 'draft' || doc.status === 'building')
    .map((doc) => ({
      id: doc.id,
      title: doc.title,
      status: doc.status,
      blocks: doc.blocks as Block[],
      style: doc.style as StyleSystem,
      data: doc.data as WeddingData,
      animation: doc.animation as GlobalAnimation | null,
      updatedAt: new Date(doc.updatedAt),
    }))

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
          <InvitationTabs
            publishedDocs={publishedDocs}
            draftDocs={draftDocs}
          />
        )}
      </div>
    </main>
  )
}

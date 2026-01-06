'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'
import { InvitationCard } from './InvitationCard'
import type {
  Block,
  StyleSystem,
  WeddingData,
  GlobalAnimation,
} from '@/lib/super-editor-v2/schema/types'

// ============================================
// Types
// ============================================

interface InvitationDocument {
  id: string
  title: string
  status: string
  blocks: Block[]
  style: StyleSystem
  data: WeddingData
  animation: GlobalAnimation | null
  updatedAt: Date
}

interface InvitationTabsProps {
  publishedDocs: InvitationDocument[]
  draftDocs: InvitationDocument[]
}

type TabType = 'published' | 'draft'

// ============================================
// Component
// ============================================

export function InvitationTabs({ publishedDocs, draftDocs }: InvitationTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('published')

  const currentDocs = activeTab === 'published' ? publishedDocs : draftDocs
  const isEmpty = currentDocs.length === 0

  return (
    <div>
      {/* 탭 헤더 */}
      <div className="flex border-b border-[var(--sand-200)] mb-6">
        <button
          onClick={() => setActiveTab('published')}
          className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'published'
              ? 'text-[var(--sage-600)] border-b-2 border-[var(--sage-500)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
          }`}
        >
          발행됨 ({publishedDocs.length})
        </button>
        <button
          onClick={() => setActiveTab('draft')}
          className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'draft'
              ? 'text-[var(--sage-600)] border-b-2 border-[var(--sage-500)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
          }`}
        >
          작성 중 ({draftDocs.length})
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      {isEmpty ? (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-[var(--sand-300)] mx-auto mb-4" />
          <h2 className="text-lg font-medium text-[var(--text-heading)] mb-2">
            {activeTab === 'published'
              ? '아직 발행된 청첩장이 없어요'
              : '작성 중인 청첩장이 없어요'}
          </h2>
          <p className="text-[var(--text-muted)]">
            {activeTab === 'published'
              ? '청첩장을 완성하고 발행해보세요!'
              : '홈에서 새 청첩장을 만들어보세요!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentDocs.map((doc) => (
            <InvitationCard
              key={doc.id}
              id={doc.id}
              title={doc.title}
              status={doc.status}
              blocks={doc.blocks}
              style={doc.style}
              data={doc.data}
              animation={doc.animation}
              updatedAt={doc.updatedAt}
            />
          ))}
        </div>
      )}
    </div>
  )
}

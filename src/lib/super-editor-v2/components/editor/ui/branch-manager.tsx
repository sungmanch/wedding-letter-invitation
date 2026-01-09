'use client'

/**
 * Branch Manager - 추가 디자인 관리 UI
 *
 * 원본 문서에서 추가 디자인(버전) 목록 표시 및 관리
 * - 새 버전 생성
 * - 버전 목록 표시
 * - 버전 편집/삭제
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  listBranches,
  createBranch,
  deleteBranch,
  type BranchWithData,
} from '@/lib/super-editor-v2/actions/branch'
import type { EditorDocumentBranchV2 } from '@/lib/super-editor-v2/schema/db-schema'

// ============================================
// Types
// ============================================

interface BranchManagerProps {
  documentId: string
  className?: string
}

// ============================================
// Component
// ============================================

export function BranchManager({ documentId, className = '' }: BranchManagerProps) {
  const [branches, setBranches] = useState<EditorDocumentBranchV2[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newBranchTitle, setNewBranchTitle] = useState('')
  const [newBranchDescription, setNewBranchDescription] = useState('')

  // 브랜치 목록 로드
  const loadBranches = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await listBranches(documentId)
      setBranches(data)
    } catch (error) {
      console.error('Failed to load branches:', error)
    } finally {
      setIsLoading(false)
    }
  }, [documentId])

  useEffect(() => {
    loadBranches()
  }, [loadBranches])

  // 브랜치 생성
  const handleCreateBranch = useCallback(async () => {
    if (!newBranchTitle.trim()) return

    try {
      setIsCreating(true)
      await createBranch(documentId, {
        title: newBranchTitle.trim(),
        description: newBranchDescription.trim() || undefined,
        copyLayout: true,
      })
      setShowCreateModal(false)
      setNewBranchTitle('')
      setNewBranchDescription('')
      await loadBranches()
    } catch (error) {
      console.error('Failed to create branch:', error)
      alert('추가 디자인 생성에 실패했습니다.')
    } finally {
      setIsCreating(false)
    }
  }, [documentId, newBranchTitle, newBranchDescription, loadBranches])

  // 추가 디자인 삭제
  const handleDeleteBranch = useCallback(async (branchId: string) => {
    if (!confirm('이 버전을 삭제하시겠습니까?')) return

    try {
      setDeletingId(branchId)
      await deleteBranch(branchId)
      await loadBranches()
    } catch (error) {
      console.error('Failed to delete branch:', error)
      alert('삭제에 실패했습니다.')
    } finally {
      setDeletingId(null)
    }
  }, [loadBranches])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-[var(--text-primary)]">추가 디자인</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            같은 정보로 다른 디자인을 만들어보세요
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--sage-100)] text-[var(--sage-700)] hover:bg-[var(--sage-200)] transition-colors flex items-center gap-1.5"
        >
          <PlusIcon className="w-4 h-4" />
          새 버전
        </button>
      </div>

      {/* 브랜치 목록 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner className="w-5 h-5 text-[var(--sage-500)]" />
        </div>
      ) : branches.length === 0 ? (
        <div className="text-center py-8 bg-[var(--ivory-50)] border border-[var(--sand-100)] rounded-lg">
          <BranchIcon className="w-8 h-8 text-[var(--sand-300)] mx-auto mb-2" />
          <p className="text-sm text-[var(--text-muted)]">
            아직 추가 디자인이 없습니다
          </p>
          <p className="text-xs text-[var(--text-light)] mt-1">
            신랑측/신부측 등 다른 디자인을 만들어보세요
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              isDeleting={deletingId === branch.id}
              onDelete={() => handleDeleteBranch(branch.id)}
            />
          ))}
        </div>
      )}

      {/* 추가 디자인 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white border border-[var(--sand-100)] rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-medium mb-4 text-[var(--text-primary)]">
              새 버전 만들기
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  버전 이름 *
                </label>
                <input
                  type="text"
                  value={newBranchTitle}
                  onChange={(e) => setNewBranchTitle(e.target.value)}
                  placeholder="예: 신랑측용, 신부측용, 친구용"
                  className="w-full px-3 py-2 bg-white border border-[var(--sand-200)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sage-500)] focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  설명 (선택)
                </label>
                <input
                  type="text"
                  value={newBranchDescription}
                  onChange={(e) => setNewBranchDescription(e.target.value)}
                  placeholder="어떤 용도로 사용할 버전인지 메모"
                  className="w-full px-3 py-2 bg-white border border-[var(--sand-200)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sage-500)] focus:border-transparent"
                />
              </div>

              <div className="bg-[var(--sage-50)] border border-[var(--sage-200)] rounded-lg p-3">
                <p className="text-xs text-[var(--sage-700)]">
                  <strong>참고:</strong> 현재 디자인을 복사하여 새 버전을 만듭니다.
                  결혼 정보(신랑/신부 이름, 날짜 등)는 원본과 자동으로 동기화됩니다.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewBranchTitle('')
                  setNewBranchDescription('')
                }}
                className="px-4 py-2 rounded-lg text-sm bg-[var(--sand-100)] hover:bg-[var(--sand-200)] text-[var(--text-primary)] transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreateBranch}
                disabled={!newBranchTitle.trim() || isCreating}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--sage-500)] text-white hover:bg-[var(--sage-600)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCreating && <LoadingSpinner className="w-4 h-4" />}
                만들기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// Branch Card
// ============================================

interface BranchCardProps {
  branch: EditorDocumentBranchV2
  isDeleting: boolean
  onDelete: () => void
}

function BranchCard({ branch, isDeleting, onDelete }: BranchCardProps) {
  return (
    <div className="bg-white border border-[var(--sand-100)] rounded-lg p-3 flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">
            {branch.title}
          </h4>
          {branch.isPaid && (
            <span className="px-1.5 py-0.5 rounded text-xs bg-green-50 text-green-600">
              결제완료
            </span>
          )}
          {branch.status === 'published' && (
            <span className="px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-600">
              게시됨
            </span>
          )}
        </div>
        {branch.description && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
            {branch.description}
          </p>
        )}
        <p className="text-xs text-[var(--text-light)] mt-1">
          {formatDate(branch.updatedAt)}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Link
          href={`/se2/branch/${branch.id}/edit`}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--sage-600)] hover:bg-[var(--sage-50)] transition-colors"
          title="편집"
        >
          <EditIcon className="w-4 h-4" />
        </Link>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          title="삭제"
        >
          {isDeleting ? (
            <LoadingSpinner className="w-4 h-4" />
          ) : (
            <TrashIcon className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}

// ============================================
// Utility Functions
// ============================================

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// ============================================
// Icons
// ============================================

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}

function BranchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  )
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

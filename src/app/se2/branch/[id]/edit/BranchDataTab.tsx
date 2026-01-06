'use client'

/**
 * Branch Data Tab - 읽기 전용
 *
 * 브랜치는 parent의 data를 상속하므로 편집 불가
 * parent 문서 편집 페이지로 이동하는 링크 제공
 */

import Link from 'next/link'
import type { WeddingData } from '@/lib/super-editor-v2/schema/types'

interface BranchDataTabProps {
  data: WeddingData
  parentDocumentId: string
  parentTitle: string
}

export function BranchDataTab({ data, parentDocumentId, parentTitle }: BranchDataTabProps) {
  return (
    <div className="p-4 space-y-6">
      {/* 안내 메시지 */}
      <div className="bg-[var(--sage-50)] border border-[var(--sage-200)] rounded-lg p-4">
        <div className="flex items-start gap-3">
          <InfoIcon className="w-5 h-5 text-[var(--sage-600)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[var(--sage-800)] font-medium mb-1">
              브랜치는 원본 문서의 데이터를 공유합니다
            </p>
            <p className="text-sm text-[var(--sage-600)] mb-3">
              결혼 정보를 수정하려면 원본 문서에서 편집해주세요.
              변경사항은 모든 브랜치에 자동으로 반영됩니다.
            </p>
            <Link
              href={`/se2/${parentDocumentId}/edit`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--sage-500)] text-white hover:bg-[var(--sage-600)] transition-colors"
            >
              <EditIcon className="w-4 h-4" />
              원본에서 데이터 수정하기
            </Link>
          </div>
        </div>
      </div>

      {/* 읽기 전용 데이터 표시 */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
          <span>현재 데이터</span>
          <span className="px-1.5 py-0.5 rounded text-xs bg-[var(--sand-100)] text-[var(--text-muted)]">
            읽기 전용
          </span>
        </h3>

        {/* 신랑 정보 */}
        <DataSection title="신랑 정보">
          <DataField label="이름" value={data.couple?.groom?.name || data.groom?.name} />
          <DataField label="영문 이름" value={data.couple?.groom?.nameEn || data.groom?.nameEn} />
          <DataField label="연락처" value={data.couple?.groom?.phone || data.groom?.phone} />
          <DataField label="서열" value={data.parents?.groom?.birthOrder} />
        </DataSection>

        {/* 신랑 부모님 */}
        <DataSection title="신랑 부모님">
          <DataField label="아버지 성함" value={data.parents?.groom?.father?.name} />
          <DataField label="아버지 연락처" value={data.parents?.groom?.father?.phone} />
          <DataField label="어머니 성함" value={data.parents?.groom?.mother?.name} />
          <DataField label="어머니 연락처" value={data.parents?.groom?.mother?.phone} />
        </DataSection>

        {/* 신부 정보 */}
        <DataSection title="신부 정보">
          <DataField label="이름" value={data.couple?.bride?.name || data.bride?.name} />
          <DataField label="영문 이름" value={data.couple?.bride?.nameEn || data.bride?.nameEn} />
          <DataField label="연락처" value={data.couple?.bride?.phone || data.bride?.phone} />
          <DataField label="서열" value={data.parents?.bride?.birthOrder} />
        </DataSection>

        {/* 신부 부모님 */}
        <DataSection title="신부 부모님">
          <DataField label="아버지 성함" value={data.parents?.bride?.father?.name} />
          <DataField label="아버지 연락처" value={data.parents?.bride?.father?.phone} />
          <DataField label="어머니 성함" value={data.parents?.bride?.mother?.name} />
          <DataField label="어머니 연락처" value={data.parents?.bride?.mother?.phone} />
        </DataSection>

        {/* 결혼식 정보 */}
        <DataSection title="결혼식 정보">
          <DataField label="날짜" value={data.wedding?.date} />
          <DataField label="시간" value={data.wedding?.time} />
          <DataField label="예식장" value={data.venue?.name} />
          <DataField label="홀" value={data.venue?.hall} />
          <DataField label="주소" value={data.venue?.address} />
        </DataSection>

        {/* 인사말 */}
        {(data.greeting?.title || data.greeting?.content) && (
          <DataSection title="인사말">
            {data.greeting?.title && (
              <p className="text-sm font-medium text-[var(--text-primary)] mb-2">
                {data.greeting.title}
              </p>
            )}
            {data.greeting?.content && (
              <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">
                {data.greeting.content}
              </p>
            )}
          </DataSection>
        )}
      </div>
    </div>
  )
}

// ============================================
// Sub Components
// ============================================

function DataSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[var(--sand-100)] rounded-lg p-4">
      <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">
        {title}
      </h4>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}

function DataField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="text-[var(--text-primary)]">{value}</span>
    </div>
  )
}

// ============================================
// Icons
// ============================================

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

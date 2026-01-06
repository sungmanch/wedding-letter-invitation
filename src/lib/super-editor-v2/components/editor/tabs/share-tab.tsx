'use client'

/**
 * Super Editor v2 - Share Tab
 *
 * OG 메타데이터 편집 + 공유 링크 생성
 */

import { useState, useCallback, useRef, type ChangeEvent } from 'react'
import { BranchManager } from '../ui/branch-manager'

// ============================================
// Types
// ============================================

export interface OgMetadata {
  title: string
  description: string
  imageUrl: string | null
}

/** OG 이미지 스타일 타입 */
export type OgImageStyle = 'auto' | 'default' | 'celebration' | 'custom'

export interface ShareTabProps {
  /** 문서 ID */
  documentId: string
  /** OG 기본값 */
  defaultOg: {
    title: string
    description: string
    imageUrl?: string
  }
  /** 현재 OG 값 */
  og: OgMetadata
  /** OG 변경 콜백 */
  onOgChange: (og: OgMetadata) => void
  /** 이미지 업로드 콜백 */
  onImageUpload?: (file: File) => Promise<string>
  /** 브랜치 여부 (true면 BranchManager 숨김) */
  isBranch?: boolean
  /** OG 이미지 스타일 */
  ogImageStyle?: OgImageStyle
  /** OG 이미지 스타일 변경 콜백 */
  onOgImageStyleChange?: (style: OgImageStyle) => void
  /** OG 이미지 생성 중 여부 */
  isGeneratingOgImage?: boolean
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function ShareTab({
  documentId,
  defaultOg,
  og,
  onOgChange,
  onImageUpload,
  isBranch = false,
  ogImageStyle = 'auto',
  onOgImageStyleChange,
  isGeneratingOgImage = false,
  className = '',
}: ShareTabProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 텍스트 필드 변경
  const handleTextChange = useCallback(
    (field: 'title' | 'description', value: string) => {
      onOgChange({
        ...og,
        [field]: value,
      })
    },
    [og, onOgChange]
  )

  // 이미지 업로드
  const handleImageUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file || !onImageUpload) return

      setUploading(true)
      try {
        const url = await onImageUpload(file)
        onOgChange({
          ...og,
          imageUrl: url,
        })
      } catch (error) {
        console.error('Failed to upload image:', error)
      } finally {
        setUploading(false)
      }
    },
    [og, onOgChange, onImageUpload]
  )

  // 이미지 제거
  const handleImageRemove = useCallback(() => {
    onOgChange({
      ...og,
      imageUrl: null,
    })
  }, [og, onOgChange])

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* OG 메타데이터 편집 */}
        <section>
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">공유 시 표시 정보</h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            카카오톡, 문자 등으로 공유할 때 표시되는 정보입니다.
          </p>

          <div className="space-y-4">
            {/* 제목 */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">제목</label>
              <input
                type="text"
                value={og.title || defaultOg.title}
                onChange={(e) => handleTextChange('title', e.target.value)}
                placeholder={defaultOg.title}
                className="w-full px-3 py-2 bg-white border border-[var(--sand-200)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sage-500)] focus:border-transparent"
              />
            </div>

            {/* 설명 */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">설명</label>
              <textarea
                value={og.description || defaultOg.description}
                onChange={(e) => handleTextChange('description', e.target.value)}
                placeholder={defaultOg.description}
                rows={2}
                className="w-full px-3 py-2 bg-white border border-[var(--sand-200)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sage-500)] focus:border-transparent resize-none"
              />
            </div>

            {/* OG 이미지 */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                대표 이미지
              </label>

              {/* 스타일 선택 드롭다운 */}
              <select
                value={ogImageStyle}
                onChange={(e) => onOgImageStyleChange?.(e.target.value as OgImageStyle)}
                disabled={isGeneratingOgImage}
                className="w-full px-3 py-2 bg-white border border-[var(--sand-200)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sage-500)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="auto">자동 생성 (Hero 이미지)</option>
                <option value="default">기본 - 심플</option>
                <option value="celebration">기본 - 축하</option>
                <option value="custom">직접 업로드</option>
              </select>

              {/* 스타일별 설명 */}
              <p className="text-xs text-[var(--text-light)]">
                {isGeneratingOgImage && '이미지를 생성하고 있습니다...'}
                {!isGeneratingOgImage &&
                  ogImageStyle === 'auto' &&
                  '선택 즉시 Hero 이미지를 1200×630 비율로 자동 크롭합니다.'}
                {!isGeneratingOgImage &&
                  ogImageStyle === 'default' &&
                  '깔끔한 흰 배경에 이름이 표시됩니다.'}
                {!isGeneratingOgImage &&
                  ogImageStyle === 'celebration' &&
                  '축하 빵빠레와 함께 이름이 표시됩니다.'}
                {!isGeneratingOgImage &&
                  ogImageStyle === 'custom' &&
                  '직접 이미지를 업로드하세요. 권장: 1200×630px'}
              </p>

              {/* 커스텀 모드일 때만 업로드 영역 표시 */}
              {ogImageStyle === 'custom' && (
                <>
                  {og.imageUrl ? (
                    <div className="relative aspect-[1.91/1] bg-[var(--sand-100)] rounded-lg overflow-hidden border border-[var(--sand-200)]">
                      <img
                        src={og.imageUrl}
                        alt="OG Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={handleImageRemove}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full aspect-[1.91/1] flex flex-col items-center justify-center gap-2 bg-[var(--ivory-50)] border-2 border-dashed border-[var(--sand-200)] rounded-lg text-[var(--text-muted)] hover:bg-[var(--sand-100)] hover:border-[var(--sage-400)] transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <LoadingSpinner className="w-6 h-6" />
                          <span className="text-sm">업로드 중...</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8" />
                          <span className="text-sm">이미지 업로드</span>
                        </>
                      )}
                    </button>
                  )}
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        </section>

        {/* OG 미리보기 */}
        <section>
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">미리보기</h3>

          <OgPreviewCard
            title={og.title || defaultOg.title}
            description={og.description || defaultOg.description}
            imageUrl={og.imageUrl || defaultOg.imageUrl}
            isLoading={isGeneratingOgImage}
          />
        </section>

        {/* 브랜치 관리 (원본 문서에서만 표시) */}
        {!isBranch && (
          <section className="border-t border-[var(--sand-100)] pt-6">
            <BranchManager documentId={documentId} />
          </section>
        )}

      </div>
    </div>
  )
}

// ============================================
// OG Preview Card (카카오톡 스타일)
// ============================================

interface OgPreviewCardProps {
  title: string
  description: string
  imageUrl?: string | null
  isLoading?: boolean
}

function OgPreviewCard({ title, description, imageUrl, isLoading = false }: OgPreviewCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-[var(--sand-200)]">
      {/* 이미지 영역 */}
      {isLoading ? (
        <div className="aspect-[1.91/1] bg-[var(--sand-100)] flex flex-col items-center justify-center gap-2">
          <LoadingSpinner className="w-8 h-8 text-[var(--blush-400)]" />
          <span className="text-sm text-[var(--text-muted)]">이미지 생성 중...</span>
        </div>
      ) : imageUrl ? (
        <div className="aspect-[1.91/1] bg-[var(--sand-100)]">
          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="aspect-[1.91/1] bg-[var(--sand-100)] flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-[var(--sand-300)]" />
        </div>
      )}

      {/* 텍스트 영역 */}
      <div className="p-3">
        <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">{title}</p>
        <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{description}</p>
        <p className="text-xs text-[var(--text-light)] mt-2">maisondeletter.com</p>
      </div>
    </div>
  )
}


// ============================================
// Icons
// ============================================

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15l-5-5L5 21" />
    </svg>
  )
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}


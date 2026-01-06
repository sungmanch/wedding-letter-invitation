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
export type OgImageStyle = 'auto' | 'default' | 'custom'

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
  /** 공유 URL */
  shareUrl?: string | null
  /** 공유 URL 생성 콜백 */
  onGenerateShareUrl?: () => void
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
  shareUrl,
  onGenerateShareUrl,
  onImageUpload,
  isBranch = false,
  ogImageStyle = 'auto',
  onOgImageStyleChange,
  isGeneratingOgImage = false,
  className = '',
}: ShareTabProps) {
  const [copySuccess, setCopySuccess] = useState(false)
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

  // 공유 URL 복사
  const handleCopyUrl = useCallback(async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [shareUrl])

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
                <option value="default">기본 이미지 (이름 텍스트)</option>
                <option value="custom">직접 업로드</option>
              </select>

              {/* 스타일별 설명 */}
              <p className="text-xs text-[var(--text-light)]">
                {isGeneratingOgImage && '이미지를 생성하고 있습니다...'}
                {!isGeneratingOgImage && ogImageStyle === 'auto' && '선택 즉시 Hero 이미지를 1200×630 비율로 자동 크롭합니다.'}
                {!isGeneratingOgImage && ogImageStyle === 'default' && '선택 즉시 신랑❤️신부 텍스트가 있는 기본 이미지를 생성합니다.'}
                {!isGeneratingOgImage && ogImageStyle === 'custom' && '직접 이미지를 업로드하세요. 권장: 1200×630px'}
              </p>

              {/* 커스텀 모드일 때만 업로드 영역 표시 */}
              {ogImageStyle === 'custom' && (
                <>
                  {og.imageUrl ? (
                    <div className="relative aspect-[1.91/1] bg-[var(--sand-100)] rounded-lg overflow-hidden border border-[var(--sand-200)]">
                      <img src={og.imageUrl} alt="OG Preview" className="w-full h-full object-cover" />
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

        {/* 공유 링크 */}
        <section>
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">공유 링크</h3>

          {shareUrl ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-[var(--ivory-50)] border border-[var(--sand-200)] rounded-lg text-[var(--text-primary)] text-sm"
                />
                <button
                  onClick={handleCopyUrl}
                  className="px-4 py-2 bg-[var(--sage-500)] text-white rounded-lg text-sm font-medium hover:bg-[var(--sage-600)] transition-colors"
                >
                  {copySuccess ? '복사됨!' : '복사'}
                </button>
              </div>
              <p className="text-xs text-[var(--text-light)]">이 링크는 1시간 동안 유효합니다.</p>
            </div>
          ) : (
            <button
              onClick={onGenerateShareUrl}
              className="w-full px-4 py-3 bg-[var(--sage-500)] text-white rounded-lg text-sm font-medium hover:bg-[var(--sage-600)] transition-colors"
            >
              공유 링크 생성
            </button>
          )}
        </section>

        {/* 공유 버튼들 */}
        {shareUrl && (
          <section>
            <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">공유하기</h3>

            <div className="grid grid-cols-2 gap-2">
              {/* 카카오톡 공유 비활성화
              <ShareButton
                icon={<KakaoIcon />}
                label="카카오톡"
                onClick={() => shareToKakao(shareUrl)}
                variant="kakao"
              />
              */}
              <ShareButton icon={<SmsIcon />} label="문자" onClick={() => shareToSms(shareUrl)} />
              <ShareButton icon={<LinkIcon />} label="링크 복사" onClick={handleCopyUrl} />
              <ShareButton
                icon={<QrIcon />}
                label="QR 코드"
                onClick={() => {
                  /* TODO: QR 모달 */
                }}
              />
            </div>
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
// Share Button
// ============================================

interface ShareButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'kakao'
}

function ShareButton({ icon, label, onClick, variant = 'default' }: ShareButtonProps) {
  const baseClass =
    'flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors'
  const variantClass =
    variant === 'kakao'
      ? 'bg-[#FEE500] text-[#3C1E1E] hover:bg-[#F5DC00]'
      : 'bg-[var(--ivory-50)] border border-[var(--sand-200)] text-[var(--text-primary)] hover:bg-[var(--sand-100)]'

  return (
    <button onClick={onClick} className={`${baseClass} ${variantClass}`}>
      {icon}
      {label}
    </button>
  )
}

// ============================================
// Share Functions
// ============================================

/*
function shareToKakao(url: string) {
  // Kakao SDK가 로드되어 있다고 가정
  if (
    typeof window !== 'undefined' &&
    (window as unknown as { Kakao?: { Share?: { sendDefault: (config: unknown) => void } } }).Kakao
      ?.Share
  ) {
    ;(
      window as unknown as { Kakao: { Share: { sendDefault: (config: unknown) => void } } }
    ).Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '청첩장이 도착했습니다',
        description: '모바일 청첩장을 확인해주세요',
        imageUrl: '',
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
    })
  } else {
    // 카카오 SDK 없으면 링크로 대체
    window.open(
      `https://accounts.kakao.com/login?continue=https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(url)}`,
      '_blank'
    )
  }
}
*/

function shareToSms(url: string) {
  const message = `청첩장이 도착했습니다. ${url}`
  window.location.href = `sms:?&body=${encodeURIComponent(message)}`
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

/*
function KakaoIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.85 1.87 5.35 4.68 6.77l-.96 3.53c-.08.29.24.54.51.39l4.22-2.77c.5.05 1.01.08 1.55.08 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
    </svg>
  )
}
*/

function SmsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  )
}

function QrIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
      />
    </svg>
  )
}

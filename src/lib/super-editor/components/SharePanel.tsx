'use client'

import { useState, useCallback } from 'react'

interface SharePanelProps {
  invitationId: string
  title: string
  description: string
  imageUrl?: string
  className?: string
}

export function SharePanel({
  invitationId,
  title,
  description,
  imageUrl,
  className = '',
}: SharePanelProps) {
  const [copySuccess, setCopySuccess] = useState(false)
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/se/${invitationId}`
    : ''

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [shareUrl])

  const handleKakaoShare = useCallback(() => {
    if (typeof window === 'undefined') return

    const kakao = (window as unknown as { Kakao?: KakaoSDK }).Kakao
    if (!kakao?.isInitialized?.()) {
      console.warn('Kakao SDK not initialized')
      return
    }

    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description,
        imageUrl: imageUrl || '',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '청첩장 보기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    })
  }, [title, description, imageUrl, shareUrl])

  const handleNativeShare = useCallback(async () => {
    if (typeof navigator.share !== 'function') {
      handleCopyLink()
      return
    }

    try {
      await navigator.share({
        title,
        text: description,
        url: shareUrl,
      })
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed:', err)
      }
    }
  }, [title, description, shareUrl, handleCopyLink])

  const handleSMSShare = useCallback(() => {
    const body = encodeURIComponent(`${title}\n\n${description}\n\n${shareUrl}`)
    window.location.href = `sms:?body=${body}`
  }, [title, description, shareUrl])

  return (
    <div className={`share-panel ${className}`}>
      <div className="grid grid-cols-2 gap-3">
        {/* 카카오톡 공유 */}
        <button
          type="button"
          onClick={handleKakaoShare}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FEE500] text-[#191919] rounded-lg font-medium hover:bg-[#F5DC00] transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.477 3 2 6.463 2 10.714c0 2.746 1.824 5.16 4.563 6.563-.12.436-.77 2.795-.796 2.978 0 0-.016.13.068.18.084.05.183.024.183.024.242-.034 2.807-1.835 3.246-2.144.898.126 1.83.192 2.736.192 5.523 0 10-3.463 10-7.714S17.523 3 12 3z"/>
          </svg>
          카카오톡
        </button>

        {/* 문자 공유 */}
        <button
          type="button"
          onClick={handleSMSShare}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          문자
        </button>

        {/* 링크 복사 */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {copySuccess ? '복사됨!' : '링크 복사'}
        </button>

        {/* 더보기 (네이티브 공유) */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          더보기
        </button>
      </div>

      {/* URL 직접 표시 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 mb-1">공유 링크</p>
        <p className="text-sm text-gray-700 break-all font-mono">{shareUrl}</p>
      </div>
    </div>
  )
}

// 공유 FAB 버튼
interface ShareFabProps {
  onClick: () => void
}

export function ShareFab({ onClick }: ShareFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-rose-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-rose-600 transition-colors z-50"
      aria-label="공유하기"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    </button>
  )
}

// 공유 모달
interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  invitationId: string
  title: string
  description: string
  imageUrl?: string
}

export function ShareModal({
  isOpen,
  onClose,
  invitationId,
  title,
  description,
  imageUrl,
}: ShareModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">공유하기</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <SharePanel
          invitationId={invitationId}
          title={title}
          description={description}
          imageUrl={imageUrl}
        />
      </div>
    </div>
  )
}

// Kakao SDK 타입
interface KakaoSDK {
  isInitialized: () => boolean
  Share: {
    sendDefault: (options: {
      objectType: string
      content: {
        title: string
        description: string
        imageUrl: string
        link: {
          mobileWebUrl: string
          webUrl: string
        }
      }
      buttons: Array<{
        title: string
        link: {
          mobileWebUrl: string
          webUrl: string
        }
      }>
    }) => void
  }
}

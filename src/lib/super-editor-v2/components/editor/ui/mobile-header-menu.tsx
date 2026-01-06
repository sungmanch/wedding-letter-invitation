'use client'

import { useState, useRef, useEffect } from 'react'

interface MobileHeaderMenuProps {
  /** 미리보기 URL */
  previewUrl: string
  /** 발행 URL (결제 링크) */
  publishUrl: string
  /** 결제 완료 여부 */
  isPaid: boolean
  /** 저장되지 않은 변경사항 있음 */
  isDirty?: boolean
  /** 취소 콜백 */
  onDiscard?: () => void
  className?: string
}

export function MobileHeaderMenu({
  previewUrl,
  publishUrl,
  isPaid,
  isDirty = false,
  onDiscard,
  className = '',
}: MobileHeaderMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      {/* 더보기 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--warm-100)] transition-colors"
        aria-label="더보기 메뉴"
      >
        <MoreIcon className="w-5 h-5" />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-[var(--warm-100)] py-1 z-50">
          {/* 미리보기 */}
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--warm-50)] transition-colors"
          >
            <PreviewIcon className="w-4 h-4" />
            미리보기
          </a>

          {/* 발행하기 / 발행완료 */}
          {!isPaid ? (
            <a
              href={publishUrl}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--blush-600)] hover:bg-[var(--warm-50)] transition-colors"
            >
              <CreditCardIcon className="w-4 h-4" />
              발행하기
            </a>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-green-600">
              <CheckIcon className="w-4 h-4" />
              발행 완료
            </div>
          )}

          {/* 구분선 + 취소 (isDirty일 때만) */}
          {isDirty && onDiscard && (
            <>
              <div className="border-t border-[var(--warm-100)] my-1" />
              <button
                onClick={() => {
                  setIsOpen(false)
                  onDiscard()
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <XIcon className="w-4 h-4" />
                변경사항 취소
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// Icons
function MoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
      />
    </svg>
  )
}

function PreviewIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  )
}

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

'use client'

/**
 * GuestbookFab - 방명록 FAB 컴포넌트
 * 플로팅 버튼 형태로 방명록 모달 열기
 * 스크롤 후 노출
 */

import React, { useState, useEffect, useCallback } from 'react'

interface GuestbookFabProps {
  /** 스크롤 threshold (px) - 이 값 이상 스크롤하면 표시 */
  showAfterScroll?: number
  /** 클릭 핸들러 */
  onClick?: () => void
  /** 편집 모드 여부 */
  mode?: 'preview' | 'edit' | 'build'
}

export function GuestbookFab({
  showAfterScroll = 200,
  onClick,
  mode = 'preview',
}: GuestbookFabProps) {
  const [isVisible, setIsVisible] = useState(mode === 'edit')

  const handleScroll = useCallback(() => {
    if (mode === 'edit') return
    const scrollY = window.scrollY || window.pageYOffset
    setIsVisible(scrollY >= showAfterScroll)
  }, [showAfterScroll, mode])

  useEffect(() => {
    if (mode === 'edit') {
      setIsVisible(true)
      return
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll, mode])

  return (
    <button
      onClick={onClick}
      className="guestbook-fab"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: 'var(--color-brand, #C9A962)',
        color: 'var(--color-text-on-brand, #fff)',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: isVisible ? 'auto' : 'none',
        fontSize: '24px',
      }}
      aria-label="축하 메시지 남기기"
    >
      💬
    </button>
  )
}

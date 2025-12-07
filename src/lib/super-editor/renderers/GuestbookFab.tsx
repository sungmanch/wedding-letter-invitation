'use client'

/**
 * GuestbookFab - 방명록 플로팅 버튼 컴포넌트
 * 하단 중앙에 고정된 "축하해주기" 버튼
 */

import React from 'react'

interface GuestbookFabProps {
  /** 클릭 핸들러 */
  onClick?: () => void
  /** 편집 모드 여부 */
  mode?: 'preview' | 'edit' | 'build'
}

export function GuestbookFab({ onClick }: GuestbookFabProps) {
  return (
    <button
      onClick={onClick}
      className="guestbook-fab"
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        height: 48,
        paddingLeft: 32,
        paddingRight: 32,
        borderRadius: 24,
        backgroundColor: 'var(--color-brand, #C9A962)',
        color: 'var(--color-text-on-brand, #fff)',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: 'pointer',
        fontFamily: 'var(--typo-body-md-font-family, inherit)',
        fontSize: 15,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        pointerEvents: 'auto',
      }}
      aria-label="축하 메시지 남기기"
    >
      💬 축하해주기
    </button>
  )
}

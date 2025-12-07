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
  /** 투명도 (0~1) */
  opacity?: number
}

export function GuestbookFab({ onClick, mode = 'preview', opacity = 1 }: GuestbookFabProps) {
  // 프리뷰: PhoneFrame 내 고정 (absolute), 실제 화면: 화면 하단 고정 (fixed)
  const isViewer = mode === 'build'

  return (
    <button
      onClick={onClick}
      className="guestbook-fab"
      style={{
        position: isViewer ? 'fixed' : 'absolute',
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
        pointerEvents: opacity > 0 ? 'auto' : 'none',
        opacity,
        transition: 'opacity 0.3s ease',
      }}
      aria-label="축하 메시지 남기기"
    >
      💬 축하해주기
    </button>
  )
}

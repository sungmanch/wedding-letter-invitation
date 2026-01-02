'use client'

/**
 * PhoneFrame - iPhone 14 스타일 폰 프레임 컴포넌트
 *
 * 에디터와 랜딩 페이지에서 공통으로 사용되는 폰 목업
 * - 노치 + 홈 인디케이터 포함
 * - 반응형 크기 지원
 * - 커스터마이징 가능한 프레임 색상
 */

import React from 'react'

export interface PhoneFrameProps {
  children: React.ReactNode
  /** 프레임 너비 (기본: 375px) */
  width?: number
  /** 프레임 높이 (기본: 667px) */
  height?: number
  /** 추가 클래스명 */
  className?: string
  /** 노치 표시 여부 (기본: true) */
  showNotch?: boolean
  /** 홈 인디케이터 표시 여부 (기본: true) */
  showHomeIndicator?: boolean
  /** 프레임 배경색 (기본: var(--sand-200)) */
  frameColor?: string
  /** 스크롤 가능 여부 (기본: true) */
  scrollable?: boolean
}

export function PhoneFrame({
  children,
  width = 375,
  height = 667,
  className = '',
  showNotch = true,
  showHomeIndicator = true,
  frameColor = 'var(--sand-200)',
  scrollable = true,
}: PhoneFrameProps) {
  // 에디터 스타일: 검은 프레임 + 노치 오버레이
  const framePadding = 12
  const borderRadius = showNotch ? '3rem' : '2rem'
  const screenRadius = showNotch ? '2.5rem' : '1.5rem'

  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* 폰 프레임 외곽 (에디터 스타일) */}
      <div
        className="absolute inset-0 shadow-2xl"
        style={{
          backgroundColor: frameColor,
          borderRadius,
          padding: `${framePadding}px`,
        }}
      >
        {/* 스크린 영역 */}
        <div
          className="w-full h-full overflow-hidden bg-white"
          style={{ borderRadius: screenRadius }}
        >
          {scrollable ? (
            <div className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
              {children}
            </div>
          ) : (
            <div className="w-full h-full overflow-hidden">
              {children}
            </div>
          )}
        </div>
      </div>

      {/* 노치 (프레임 위에 오버레이) */}
      {showNotch && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 rounded-full z-10"
          style={{ backgroundColor: frameColor }}
        />
      )}

      {/* 홈 인디케이터 */}
      {showHomeIndicator && (
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full z-10"
          style={{ backgroundColor: 'var(--text-primary)', opacity: 0.15 }}
        />
      )}
    </div>
  )
}

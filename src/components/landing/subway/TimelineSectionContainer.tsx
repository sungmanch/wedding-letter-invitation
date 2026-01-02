'use client'

/**
 * Timeline Section Container
 *
 * 세로 타임라인 레이아웃의 컨테이너
 * - 세로 연결선 (데스크탑)
 * - 섹션들을 감싸는 wrapper
 * - 노드 인디케이터 시각 효과
 */

import { ReactNode } from 'react'

// ============================================
// Types
// ============================================

interface TimelineSectionContainerProps {
  children: ReactNode
  className?: string
}

// ============================================
// Component
// ============================================

export function TimelineSectionContainer({
  children,
  className = '',
}: TimelineSectionContainerProps) {
  return (
    <div className={`relative ${className}`}>
      {/* 세로 연결선 (데스크탑) */}
      <div
        className="
          hidden lg:block
          absolute left-1/2 top-0 bottom-0
          w-[2px] -translate-x-1/2
          bg-gradient-to-b from-transparent via-[var(--sage-200)] to-transparent
          pointer-events-none z-0
        "
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            var(--sage-200) 10%,
            var(--sage-200) 90%,
            transparent 100%
          )`,
        }}
      />

      {/* 섹션들 */}
      <div className="relative z-10 space-y-8 lg:space-y-12">
        {children}
      </div>
    </div>
  )
}

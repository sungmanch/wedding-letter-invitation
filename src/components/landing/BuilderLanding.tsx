'use client'

/**
 * Builder Landing
 *
 * 청첩장 빌더 랜딩 페이지 - 전면 리디자인
 * - 데스크탑: Hero + Builder (2열 레이아웃) + FAQ
 * - 모바일: 풀스크린 위저드 경험 (완전 분리)
 */

import { useState, useEffect } from 'react'
import { SubwayBuilderProvider } from './subway'
import { HeroSection } from './builder/HeroSection'
import { BuilderSection } from './builder/BuilderSection'
import { FAQSection } from './builder/FAQSection'
import { MobileLanding } from './builder/mobile'

// ============================================
// Hook: useIsMobile
// ============================================

function useIsMobile(breakpoint: number = 1024): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 초기 체크
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }
    checkMobile()

    // 리사이즈 리스너
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return isMobile
}

// ============================================
// Component
// ============================================

export function BuilderLanding() {
  const isMobile = useIsMobile()

  return (
    <SubwayBuilderProvider>
      {isMobile ? (
        // 모바일: 완전히 다른 UX
        <MobileLanding />
      ) : (
        // 데스크탑: 기존 레이아웃
        <main className="relative min-h-screen bg-[var(--ivory-50)]">
          {/* Section 1: Hero (감정적 Hook) */}
          <HeroSection />

          {/* Section 2: Builder (템플릿+섹션 선택 + Sticky 프리뷰) */}
          <BuilderSection />

          {/* Section 3: FAQ */}
          <FAQSection />
        </main>
      )}
    </SubwayBuilderProvider>
  )
}

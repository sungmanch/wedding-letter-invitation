'use client'

/**
 * Builder Landing
 *
 * 청첩장 빌더 랜딩 페이지 - 전면 리디자인
 * - Hero: 감정적 Hook + Stacked Cards 애니메이션
 * - Builder: 템플릿+섹션 선택 + Sticky 프리뷰
 * - Value Props: Trust Signals
 * - CTA: 하단 고정 (모바일 플로팅)
 */

import { useState, useEffect } from 'react'
import { SubwayBuilderProvider } from './subway'
import { HeroSection } from './builder/HeroSection'
import { BuilderSection } from './builder/BuilderSection'
import { FAQSection } from './builder/FAQSection'
import { FloatingCTA } from './builder/FloatingCTA'

// ============================================
// Component
// ============================================

export function BuilderLanding() {
  const [showFloatingCTA, setShowFloatingCTA] = useState(false)

  // 스크롤 시 플로팅 CTA 표시 (모바일)
  useEffect(() => {
    const handleScroll = () => {
      // Hero 섹션을 지나면 플로팅 CTA 표시
      setShowFloatingCTA(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <SubwayBuilderProvider>
      <main className="relative min-h-screen bg-[var(--ivory-50)]">
        {/* Section 1: Hero (감정적 Hook) */}
        <HeroSection />

        {/* Section 2: Builder (템플릿+섹션 선택 + Sticky 프리뷰) */}
        <BuilderSection />

        {/* Section 3: FAQ */}
        <FAQSection />

        {/* 플로팅 CTA (모바일) */}
        {showFloatingCTA && (
          <div className="lg:hidden">
            <FloatingCTA />
          </div>
        )}
      </main>
    </SubwayBuilderProvider>
  )
}

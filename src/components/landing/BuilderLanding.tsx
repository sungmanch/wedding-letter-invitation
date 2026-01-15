'use client'

/**
 * Builder Landing
 *
 * 청첩장 빌더 랜딩 페이지 - 전면 리디자인
 * - Hero: 감정적 Hook + Stacked Cards 애니메이션
 * - Builder: 템플릿+섹션 선택 + Sticky 프리뷰
 * - Value Props: Trust Signals
 * - CTA: 하단 고정 (모바일: 드래그 가능한 프리뷰 시트)
 */

import { SubwayBuilderProvider } from './subway'
import { HeroSection } from './builder/HeroSection'
import { BuilderSection } from './builder/BuilderSection'
import { FAQSection } from './builder/FAQSection'
import { MobilePreviewSheet } from './builder/mobile'

// ============================================
// Component
// ============================================

export function BuilderLanding() {
  return (
    <SubwayBuilderProvider>
      <main className="relative min-h-screen bg-[var(--ivory-50)]">
        {/* Section 1: Hero (감정적 Hook) */}
        <HeroSection />

        {/* Section 2: Builder (템플릿+섹션 선택 + Sticky 프리뷰) */}
        <BuilderSection />

        {/* Section 3: FAQ */}
        <FAQSection />

        {/* 모바일 프리뷰 시트 (드래그 가능한 하단 시트) */}
        <MobilePreviewSheet />
      </main>
    </SubwayBuilderProvider>
  )
}

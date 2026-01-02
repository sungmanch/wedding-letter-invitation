'use client'

/**
 * Subway Builder Landing
 *
 * 서브웨이 스타일 청첩장 빌더 랜딩 페이지
 * - Hero 템플릿 선택 (상단)
 * - 섹션별 프리셋 Row + 중앙 프리뷰
 * - CTA 버튼 (하단)
 */

import { useState, useEffect } from 'react'
import {
  SubwayBuilderProvider,
  HeroSelector,
  SectionRow,
  BottomCTA,
  SECTION_ORDER,
} from './subway'
import { TimelineSectionContainer } from './subway/TimelineSectionContainer'

// ============================================
// Component
// ============================================

export function SubwayBuilderLanding() {
  const [showFloatingCTA, setShowFloatingCTA] = useState(false)

  // 스크롤 시 플로팅 CTA 표시 (모바일)
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCTA(window.scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <SubwayBuilderProvider>
      <section className="relative min-h-screen bg-[var(--ivory-100)]">
        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,var(--sage-100)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,var(--sand-100)_0%,transparent_50%)]" />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          {/* 헤더 텍스트 */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl leading-tight mb-2"
              style={{ fontFamily: 'var(--font-heading, Noto Serif KR), serif' }}
            >
              <span className="text-[var(--sage-600)] font-medium">나만의</span>
              <span className="text-[var(--text-primary)] font-light">
                {' '}
                청첩장 만들기
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-muted)]">
              원하는 스타일을 선택하고, 섹션별로 커스터마이즈하세요
            </p>
          </div>

          {/* Step 1: Hero 선택 */}
          <HeroSelector className="mb-10 sm:mb-14" />

          {/* Step 2: 섹션 커스터마이즈 (타임라인 레이아웃) */}
          <div className="mb-10 sm:mb-14">
            {/* 섹션 헤더 */}
            <div className="mb-6 px-4 sm:px-0 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xs font-medium text-[var(--sage-500)] uppercase tracking-wider">
                  Step 2
                </span>
              </div>
              <h2
                className="text-lg sm:text-xl font-medium text-[var(--text-primary)]"
                style={{
                  fontFamily: 'var(--font-heading, Noto Serif KR), serif',
                }}
              >
                섹션 커스터마이즈
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                각 섹션의 스타일을 선택하세요
              </p>
            </div>

            {/* 타임라인 레이아웃 */}
            <TimelineSectionContainer>
              {SECTION_ORDER.map((sectionType) => (
                <SectionRow
                  key={sectionType}
                  sectionType={sectionType}
                  variant="timeline"
                  thumbnailWidth={85}
                  thumbnailHeight={125}
                  centerWidth={130}
                  centerHeight={190}
                />
              ))}
            </TimelineSectionContainer>
          </div>

          {/* Step 3: CTA (데스크탑 인라인) */}
          <BottomCTA className="hidden sm:block" />
        </div>

        {/* 플로팅 CTA (모바일) */}
        {showFloatingCTA && (
          <div className="sm:hidden">
            <BottomCTA floating />
          </div>
        )}
      </section>
    </SubwayBuilderProvider>
  )
}

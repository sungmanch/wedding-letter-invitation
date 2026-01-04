'use client'

/**
 * Builder Section
 *
 * 템플릿+섹션 선택 + Sticky 프리뷰
 * - 2열 레이아웃: 왼쪽(선택) + 오른쪽(Sticky 프리뷰)
 * - Step 1: 템플릿 선택
 * - Step 2: 섹션 선택 (아코디언)
 * - CTA: 편집 시작하기
 */

import { motion } from 'framer-motion'
import { StickyPreview } from './StickyPreview'
import { SectionAccordion } from './SectionAccordion'
import { TemplateGrid } from './TemplateGrid'
import { InlineCTA } from './InlineCTA'

// ============================================
// Component
// ============================================

export function BuilderSection() {
  return (
    <section
      id="builder-section"
      className="relative py-20 lg:py-32 bg-[var(--ivory-100)]"
    >
      {/* 배경 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,var(--sage-50)_0%,transparent_50%)] opacity-50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl font-medium text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading, Noto Serif KR), serif' }}
          >
            나만의 청첩장 만들기
          </h2>
          <p className="text-lg text-[var(--text-muted)]">
            템플릿을 선택하고, 섹션별로 스타일을 커스터마이즈하세요
          </p>
        </motion.div>

        {/* 2열 레이아웃: 선택 + Sticky 프리뷰 */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* 왼쪽: 선택 영역 */}
          <div className="flex-1 space-y-12">
            {/* Step 1: 템플릿 선택 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <StepHeader step={1} title="스타일 선택" />
              <TemplateGrid />
            </motion.div>

            {/* Step 2: 섹션 선택 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <StepHeader step={2} title="섹션 커스터마이즈" />
              <SectionAccordion />
            </motion.div>

            {/* CTA (데스크탑) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block"
            >
              <InlineCTA />
            </motion.div>
          </div>

          {/* 오른쪽: Sticky 프리뷰 (데스크탑) */}
          <div className="hidden lg:block lg:w-[380px] flex-shrink-0">
            <StickyPreview />
          </div>
        </div>

        {/* CTA (모바일) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:hidden mt-12"
        >
          <InlineCTA />
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// Sub Components
// ============================================

interface StepHeaderProps {
  step: number
  title: string
}

function StepHeader({ step, title }: StepHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--sage-500)] text-white text-sm font-semibold">
        {step}
      </span>
      <h3
        className="text-xl font-medium text-[var(--text-primary)]"
        style={{ fontFamily: 'var(--font-heading, Noto Serif KR), serif' }}
      >
        {title}
      </h3>
    </div>
  )
}

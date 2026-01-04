'use client'

/**
 * Inline CTA
 *
 * 빌더 섹션 내 인라인 CTA 버튼
 * - BuilderSection 하단에 배치
 */

import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'
import { useSubwayBuilder } from '../subway/SubwayBuilderContext'

// ============================================
// Component
// ============================================

interface InlineCTAProps {
  className?: string
}

export function InlineCTA({ className = '' }: InlineCTAProps) {
  const { saveAndCreateDocument, isCreating } = useSubwayBuilder()

  return (
    <div className={`text-center ${className}`}>
      {/* CTA 버튼 */}
      <Button
        variant="sage"
        size="lg"
        onClick={saveAndCreateDocument}
        disabled={isCreating}
        className="
          group
          px-8 py-4 h-auto
          shadow-lg hover:shadow-xl
          transition-all duration-300
        "
      >
        {isCreating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            생성 중...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            편집 시작하기
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>

      {/* Trust badges */}
      <div className="mt-6 flex flex-wrap items-center gap-4 justify-center text-sm text-[var(--text-light)]">
        <span className="flex items-center gap-1.5">
          <CheckIcon className="w-4 h-4 text-[var(--sage-500)]" />
          카드 등록 없이 무료 체험
        </span>
        <span className="flex items-center gap-1.5">
          <CheckIcon className="w-4 h-4 text-[var(--sage-500)]" />
          언제든 수정 가능
        </span>
      </div>
    </div>
  )
}

// ============================================
// Icons
// ============================================

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  )
}

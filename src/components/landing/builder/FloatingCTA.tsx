'use client'

/**
 * Floating CTA
 *
 * 모바일용 하단 고정 CTA 바
 * - 스크롤 시 나타남 (600px 이후)
 * - 미니 프리뷰 썸네일 + "편집 시작하기" 버튼
 * - Safe area 대응
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Loader2, Eye } from 'lucide-react'
import { useSubwayBuilder } from '../subway/SubwayBuilderContext'
import { MiniHeroRenderer } from '../subway/MiniBlockRenderer'

// ============================================
// Component
// ============================================

interface FloatingCTAProps {
  className?: string
}

export function FloatingCTA({ className = '' }: FloatingCTAProps) {
  const { state, saveAndCreateDocument, isCreating } = useSubwayBuilder()
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  return (
    <>
      {/* 플로팅 바 */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`
          fixed bottom-0 left-0 right-0 z-50 lg:hidden
          bg-white/95 backdrop-blur-sm
          border-t border-[var(--warm-100)]
          shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
          ${className}
        `}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {/* 미니 프리뷰 */}
          <button
            onClick={() => setShowPreviewModal(true)}
            className="relative flex-shrink-0 group"
          >
            <div className="w-12 h-16 rounded-lg overflow-hidden border border-[var(--warm-200)] shadow-sm">
              <MiniHeroRenderer
                templateId={state.selectedTemplateId}
                cssVariables={state.cssVariables}
                width={48}
                height={64}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="w-4 h-4 text-white" />
            </div>
          </button>

          {/* CTA 버튼 */}
          <button
            onClick={saveAndCreateDocument}
            disabled={isCreating}
            className="
              flex-1 h-12
              bg-[var(--blush-400)] hover:bg-[var(--blush-500)]
              text-white font-medium text-sm
              rounded-full shadow-md
              flex items-center justify-center gap-2
              transition-all duration-300
              disabled:opacity-70 disabled:cursor-not-allowed
            "
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                편집 시작하기
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* 미리보기 모달 (모바일 전용) */}
      <AnimatePresence>
        {showPreviewModal && (
          <PreviewModal
            templateId={state.selectedTemplateId}
            cssVariables={state.cssVariables}
            onClose={() => setShowPreviewModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================
// Preview Modal (Mobile Full-screen)
// ============================================

interface PreviewModalProps {
  templateId: string
  cssVariables: Record<string, string>
  onClose: () => void
}

function PreviewModal({ templateId, cssVariables, onClose }: PreviewModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-[320px] aspect-[9/16] bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <MiniHeroRenderer
          templateId={templateId}
          cssVariables={cssVariables}
          width={320}
          height={568}
        />

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <span className="sr-only">닫기</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )
}

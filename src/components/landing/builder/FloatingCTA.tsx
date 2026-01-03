'use client'

/**
 * Floating CTA
 *
 * 모바일용 하단 고정 CTA 바
 * - 스크롤 시 나타남 (600px 이후)
 * - 미니 프리뷰 썸네일 + "편집 시작하기" 버튼
 * - Safe area 대응
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Loader2, Eye } from 'lucide-react'
import { useSubwayBuilder, SECTION_ORDER } from '../subway/SubwayBuilderContext'
import { createDocument } from '@/lib/super-editor-v2/actions/document'
import { getTemplateV2ById } from '@/lib/super-editor-v2/config/template-catalog-v2'
import { buildStyleSystemFromTemplate } from '@/lib/super-editor-v2/services/template-applier'
import {
  SAMPLE_WEDDING_DATA,
  DEFAULT_STYLE_SYSTEM,
} from '@/lib/super-editor-v2/schema'
import { getBlockPreset } from '@/lib/super-editor-v2/presets/blocks'
import { nanoid } from 'nanoid'
import type { Block, Element, SizeMode } from '@/lib/super-editor-v2/schema/types'
import type { PresetElement } from '@/lib/super-editor-v2/presets/blocks/types'
import { MiniHeroRenderer } from '../subway/MiniBlockRenderer'

// ============================================
// Helpers
// ============================================

function convertPresetElement(el: PresetElement): Element {
  const element: Element = {
    ...el,
    id: el.id || nanoid(8),
  } as Element

  if (el.children && el.children.length > 0) {
    element.children = el.children.map((child) =>
      convertPresetElement(child as PresetElement)
    )
  }

  return element
}

function createBlockFromPresetData(presetId: string): Block | null {
  const preset = getBlockPreset(presetId)
  if (!preset) return null

  let height: number | SizeMode = 80
  if (preset.defaultHeight) {
    height =
      typeof preset.defaultHeight === 'number'
        ? preset.defaultHeight
        : preset.defaultHeight
  }

  return {
    id: nanoid(8),
    type: preset.blockType,
    enabled: true,
    presetId: preset.id,
    height,
    layout: preset.layout,
    elements: preset.defaultElements
      ? preset.defaultElements.map(convertPresetElement)
      : [],
  }
}

// ============================================
// Component
// ============================================

interface FloatingCTAProps {
  className?: string
}

export function FloatingCTA({ className = '' }: FloatingCTAProps) {
  const router = useRouter()
  const { state } = useSubwayBuilder()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const handleCreateDocument = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const template = getTemplateV2ById(state.selectedTemplateId)
      if (!template) {
        throw new Error('템플릿을 찾을 수 없습니다')
      }

      // 모든 섹션을 프리셋에서 생성 (hero 포함)
      const blocks: Block[] = []
      for (const sectionType of SECTION_ORDER) {
        const presetId = state.selectedPresets[sectionType]
        if (presetId) {
          const block = createBlockFromPresetData(presetId)
          if (block) {
            blocks.push(block)
          }
        }
      }

      const style = buildStyleSystemFromTemplate(template, DEFAULT_STYLE_SYSTEM)

      const doc = await createDocument({
        title: '새 청첩장',
        blocks,
        style,
        weddingData: SAMPLE_WEDDING_DATA,
      })

      router.push(`/se2/${doc.id}/edit`)
    } catch (err) {
      console.error('Document creation failed:', err)
      setError(err instanceof Error ? err.message : '문서 생성에 실패했습니다')
      setIsLoading(false)
    }
  }, [state, router])

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
          border-t border-[var(--sand-100)]
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
            <div className="w-12 h-16 rounded-lg overflow-hidden border border-[var(--sand-200)] shadow-sm">
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
            onClick={handleCreateDocument}
            disabled={isLoading}
            className="
              flex-1 h-12
              bg-[var(--sage-500)] hover:bg-[var(--sage-600)]
              text-white font-medium text-sm
              rounded-full shadow-md
              flex items-center justify-center gap-2
              transition-all duration-300
              disabled:opacity-70 disabled:cursor-not-allowed
            "
          >
            {isLoading ? (
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

        {/* 에러 메시지 */}
        {error && (
          <p className="text-center text-xs text-red-500 pb-2 px-4">{error}</p>
        )}
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

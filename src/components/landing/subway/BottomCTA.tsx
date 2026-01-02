'use client'

/**
 * Bottom CTA
 *
 * 하단 CTA 버튼 섹션
 * - "편집 시작하기" 버튼
 * - 문서 생성 후 에디터 페이지로 이동
 * - 모바일에서는 플로팅 바
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { useSubwayBuilder, SECTION_ORDER } from './SubwayBuilderContext'
import { createDocument } from '@/lib/super-editor-v2/actions/document'
import { getTemplateV2ById } from '@/lib/super-editor-v2/config/template-catalog-v2'
import { buildBlocksFromTemplate } from '@/lib/super-editor-v2/services/template-block-builder'
import { buildStyleSystemFromTemplate } from '@/lib/super-editor-v2/services/template-applier'
import {
  SAMPLE_WEDDING_DATA,
  DEFAULT_STYLE_SYSTEM,
} from '@/lib/super-editor-v2/schema'
import { getBlockPreset } from '@/lib/super-editor-v2/presets/blocks'
import { nanoid } from 'nanoid'
import type { Block, Element, SizeMode } from '@/lib/super-editor-v2/schema/types'
import type { PresetElement } from '@/lib/super-editor-v2/presets/blocks/types'

// ============================================
// Types
// ============================================

interface BottomCTAProps {
  /** 플로팅 모드 (모바일용) */
  floating?: boolean
  /** 추가 className */
  className?: string
}

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

export function BottomCTA({ floating = false, className = '' }: BottomCTAProps) {
  const router = useRouter()
  const { state } = useSubwayBuilder()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateDocument = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. 템플릿에서 Hero 블록 가져오기
      const template = getTemplateV2ById(state.selectedTemplateId)
      if (!template) {
        throw new Error('템플릿을 찾을 수 없습니다')
      }

      const templateBlocks = buildBlocksFromTemplate(
        template,
        SAMPLE_WEDDING_DATA
      )
      const heroBlock = templateBlocks.find((b) => b.type === 'hero')

      // 2. 선택된 프리셋으로 섹션 블록 생성
      const sectionBlocks: Block[] = []
      for (const sectionType of SECTION_ORDER) {
        const presetId = state.selectedPresets[sectionType]
        if (presetId) {
          const block = createBlockFromPresetData(presetId)
          if (block) {
            sectionBlocks.push(block)
          }
        }
      }

      // 3. 전체 블록 조합
      const blocks: Block[] = heroBlock
        ? [heroBlock, ...sectionBlocks]
        : sectionBlocks

      // 4. 스타일 시스템 생성
      const style = buildStyleSystemFromTemplate(template, DEFAULT_STYLE_SYSTEM)

      // 5. 문서 생성
      const doc = await createDocument({
        title: '새 청첩장',
        blocks,
        style,
        weddingData: SAMPLE_WEDDING_DATA,
      })

      // 6. 에디터 페이지로 이동
      router.push(`/se2/${doc.id}/edit`)
    } catch (err) {
      console.error('Document creation failed:', err)
      setError(err instanceof Error ? err.message : '문서 생성에 실패했습니다')
      setIsLoading(false)
    }
  }, [state, router])

  // 플로팅 모드 (모바일)
  if (floating) {
    return (
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-white/95 backdrop-blur-sm border-t border-[var(--sand-100)]
          px-4 py-3 pb-safe
          ${className}
        `}
      >
        <Button
          onClick={handleCreateDocument}
          disabled={isLoading}
          className="
            w-full h-12
            bg-[var(--sage-500)] hover:bg-[var(--sage-600)]
            text-white font-medium
            rounded-full shadow-lg
            transition-all duration-300
          "
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              편집 시작하기
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
        {error && (
          <p className="text-center text-xs text-red-500 mt-2">{error}</p>
        )}
      </div>
    )
  }

  // 인라인 모드 (데스크탑)
  return (
    <section className={`text-center ${className}`}>
      {/* Step 라벨 */}
      <div className="mb-4">
        <span className="text-xs font-medium text-[var(--sage-500)] uppercase tracking-wider">
          Step 3
        </span>
        <h2
          className="text-lg font-medium text-[var(--text-primary)] mt-1"
          style={{ fontFamily: 'var(--font-heading, Noto Serif KR), serif' }}
        >
          내 청첩장 만들기
        </h2>
      </div>

      {/* CTA 버튼 */}
      <Button
        onClick={handleCreateDocument}
        disabled={isLoading}
        className="
          px-8 py-4 h-auto
          bg-[var(--sage-500)] hover:bg-[var(--sage-600)]
          text-white text-base font-medium
          rounded-full shadow-lg hover:shadow-xl
          transition-all duration-300
        "
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            생성 중...
          </>
        ) : (
          <>
            편집 시작하기
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>

      {/* 에러 메시지 */}
      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

      {/* Trust badges */}
      <div className="mt-6 flex items-center gap-6 justify-center text-sm text-[var(--text-light)]">
        <span className="flex items-center gap-1.5">
          <CheckIcon className="w-4 h-4" />
          카드 등록 없이 무료 체험
        </span>
        <span className="flex items-center gap-1.5">
          <CheckIcon className="w-4 h-4" />
          언제든 수정 가능
        </span>
      </div>
    </section>
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

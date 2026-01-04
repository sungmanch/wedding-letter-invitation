'use client'

/**
 * Inline CTA
 *
 * 빌더 섹션 내 인라인 CTA 버튼
 * - BuilderSection 하단에 배치
 * - 문서 생성 로직은 BottomCTA와 동일 (re-export)
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'
import { useSubwayBuilder, SECTION_ORDER } from '../subway/SubwayBuilderContext'
import { createDocument } from '@/lib/super-editor-v2/actions/document'
import { createClient } from '@/lib/supabase/client'
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

// ============================================
// Helpers (BottomCTA와 동일)
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

interface InlineCTAProps {
  className?: string
}

export function InlineCTA({ className = '' }: InlineCTAProps) {
  const router = useRouter()
  const { state } = useSubwayBuilder()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateDocument = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 인증 확인
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // 비로그인 시 로그인 페이지로 리다이렉트
        router.push('/login?redirect=/')
        return
      }

      // 1. 템플릿에서 스타일 정보 가져오기
      const template = getTemplateV2ById(state.selectedTemplateId)
      if (!template) {
        throw new Error('템플릿을 찾을 수 없습니다')
      }

      // 2. 블록 생성
      const blocks: Block[] = []

      // 2-1. Hero 블록 먼저 추가 (TemplateGrid에서 선택한 스타일)
      const heroPresetId = state.selectedPresets.hero
      if (heroPresetId) {
        const heroBlock = createBlockFromPresetData(heroPresetId)
        if (heroBlock) {
          blocks.push(heroBlock)
        }
      }

      // 2-2. 나머지 섹션 추가 (SectionAccordion에서 선택한 프리셋)
      for (const sectionType of SECTION_ORDER) {
        const presetId = state.selectedPresets[sectionType]
        if (presetId) {
          const block = createBlockFromPresetData(presetId)
          if (block) {
            blocks.push(block)
          }
        }
      }

      // 3. 스타일 시스템 생성
      const style = buildStyleSystemFromTemplate(template, DEFAULT_STYLE_SYSTEM)

      // 4. 문서 생성
      const doc = await createDocument({
        title: '새 청첩장',
        blocks,
        style,
        weddingData: SAMPLE_WEDDING_DATA,
      })

      // 5. 에디터 페이지로 이동
      router.push(`/se2/${doc.id}/edit`)
    } catch (err) {
      console.error('Document creation failed:', err)
      setError(err instanceof Error ? err.message : '문서 생성에 실패했습니다')
      setIsLoading(false)
    }
  }, [state, router])

  return (
    <div className={`text-center ${className}`}>
      {/* CTA 버튼 */}
      <Button
        variant="sage"
        size="lg"
        onClick={handleCreateDocument}
        disabled={isLoading}
        className="
          group
          px-8 py-4 h-auto
          shadow-lg hover:shadow-xl
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
            <Sparkles className="w-5 h-5 mr-2" />
            편집 시작하기
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>

      {/* 에러 메시지 */}
      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

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

'use client'

/**
 * Mobile Preview Content
 *
 * 모바일 프리뷰 시트 내부의 프리뷰 콘텐츠
 * - StickyPreview의 로직을 재사용
 * - 섹션 선택 시 해당 섹션으로 스크롤 + 하이라이트
 */

import { useMemo, memo, useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DocumentRenderer } from '@/lib/super-editor-v2/renderer/document-renderer'
import { resolveStyle, styleToCSSVariables } from '@/lib/super-editor-v2/renderer/style-resolver'
import type { EditorDocument, Block, ThemePresetId, Element, SizeMode } from '@/lib/super-editor-v2/schema/types'
import { useSubwayBuilder, SECTION_ORDER, type SelectableSectionType } from '../../subway/SubwayBuilderContext'
import {
  DEFAULT_STYLE_SYSTEM,
  getSampleWeddingDataForTemplate,
} from '@/lib/super-editor-v2/schema'
import { getBlockPreset } from '@/lib/super-editor-v2/presets/blocks'
import {
  getThemeForHeroPreset,
  isHeroPresetId,
} from '@/lib/super-editor-v2/presets/blocks/hero'
import type { PresetElement } from '@/lib/super-editor-v2/presets/blocks/types'
import { PhoneFrame } from '@/components/phone-frame'

// 고정된 타임스탬프 (hydration 불일치 방지)
const STATIC_TIMESTAMP = '2025-01-01T00:00:00.000Z'

// ============================================
// Helpers (StickyPreview에서 재사용)
// ============================================

function convertPresetElement(el: PresetElement, presetId: string, index: number): Element {
  const element: Element = {
    ...el,
    id: el.id || `${presetId}-el-${index}`,
  } as Element

  if (el.children && el.children.length > 0) {
    element.children = el.children.map((child, childIndex) =>
      convertPresetElement(child as PresetElement, presetId, index * 100 + childIndex)
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
    id: `preview-block-${presetId}`,
    type: preset.blockType,
    enabled: true,
    presetId: preset.id,
    height,
    layout: preset.layout,
    elements: preset.defaultElements
      ? preset.defaultElements.map((el, index) => convertPresetElement(el, presetId, index))
      : [],
  }
}

function getSectionBlockIndex(sectionType: SelectableSectionType): number {
  if (sectionType === 'hero') return 0
  const sectionIndex = SECTION_ORDER.indexOf(sectionType as typeof SECTION_ORDER[number])
  return sectionIndex >= 0 ? sectionIndex + 1 : -1
}

// ============================================
// Component
// ============================================

interface MobilePreviewContentProps {
  isHalfHeight?: boolean
}

function MobilePreviewContentInner({ isHalfHeight = false }: MobilePreviewContentProps) {
  const { state, setActiveSectionForScroll } = useSubwayBuilder()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(null)

  // 프리뷰 문서 생성
  const document = useMemo<EditorDocument | null>(() => {
    const sampleData = getSampleWeddingDataForTemplate(state.selectedTemplateId)
    const blocks: Block[] = []

    // hero 블록 추가
    const heroPreset = state.selectedPresets.hero
    if (heroPreset) {
      const heroBlock = createBlockFromPresetData(heroPreset)
      if (heroBlock) {
        blocks.push(heroBlock)
      }
    }

    // 나머지 섹션 추가
    for (const sectionType of SECTION_ORDER) {
      const presetId = state.selectedPresets[sectionType]
      if (presetId) {
        const block = createBlockFromPresetData(presetId)
        if (block) {
          blocks.push(block)
        }
      }
    }

    // 히어로 프리셋에서 테마 프리셋 ID 가져오기
    const heroPresetId = state.selectedPresets.hero
    let themePresetId: ThemePresetId | undefined
    if (heroPresetId && isHeroPresetId(heroPresetId)) {
      themePresetId = getThemeForHeroPreset(heroPresetId) as ThemePresetId | undefined
    }

    const style = {
      ...DEFAULT_STYLE_SYSTEM,
      ...(themePresetId && { preset: themePresetId }),
    }

    return {
      id: 'mobile-preview',
      version: 2 as const,
      blocks,
      style,
      data: sampleData,
      animation: {
        mood: 'minimal' as const,
        speed: 1,
        floatingElements: [],
      },
      meta: {
        title: '미리보기',
        createdAt: STATIC_TIMESTAMP,
        updatedAt: STATIC_TIMESTAMP,
        templateId: state.selectedTemplateId,
        templateVersion: 2 as const,
      },
    }
  }, [state.selectedTemplateId, state.selectedPresets])

  // CSS 변수 생성
  const cssVariables = useMemo(() => {
    if (!document) return {}
    const resolved = resolveStyle(document.style)
    return styleToCSSVariables(resolved)
  }, [document])

  // 프레임 크기 (모바일 최적화: 더 작은 사이즈)
  const frameWidth = isHalfHeight ? 200 : 280
  const frameHeight = isHalfHeight ? 433 : 606 // 9:16 비율 유지

  // 원본 뷰포트 크기 (iPhone 14 기준)
  const ORIGINAL_WIDTH = 390
  const ORIGINAL_HEIGHT = 844

  const scale = frameWidth / ORIGINAL_WIDTH

  // 아코디언 클릭 시 프리뷰 스크롤 + 하이라이트
  useEffect(() => {
    const activeSection = state.activeSectionForScroll
    if (!activeSection || !scrollRef.current || !document) return

    const targetIndex = getSectionBlockIndex(activeSection)
    if (targetIndex < 0) return

    const targetBlock = document.blocks[targetIndex]
    if (!targetBlock) return

    // 하이라이트 설정
    setHighlightedBlockId(targetBlock.id)

    // DOM 요소 찾기
    const blockElement = scrollRef.current.querySelector(
      `[data-block-id="${targetBlock.id}"]`
    ) as HTMLElement | null

    if (blockElement) {
      const targetScrollTop = blockElement.offsetTop * scale
      scrollRef.current.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      })
    }

    // 하이라이트 애니메이션 후 초기화
    const highlightTimer = setTimeout(() => {
      setHighlightedBlockId(null)
    }, 800)

    // 스크롤 상태 초기화
    const scrollTimer = setTimeout(() => {
      setActiveSectionForScroll(null)
    }, 350)

    return () => {
      clearTimeout(highlightTimer)
      clearTimeout(scrollTimer)
    }
  }, [state.activeSectionForScroll, document, scale, setActiveSectionForScroll])

  // 문서의 총 높이 계산
  const totalContentHeight = useMemo(() => {
    if (!document) return ORIGINAL_HEIGHT

    const viewportHeight = ORIGINAL_HEIGHT
    let total = 0

    for (const block of document.blocks) {
      if (typeof block.height === 'number') {
        total += (block.height / 100) * viewportHeight
      } else if (block.height && typeof block.height === 'object') {
        const sizeMode = block.height as SizeMode
        if (sizeMode.type === 'fixed') {
          if (sizeMode.unit === 'vh') {
            total += (sizeMode.value / 100) * viewportHeight
          } else {
            total += sizeMode.value
          }
        } else {
          total += viewportHeight * 0.5
        }
      } else {
        total += viewportHeight * 0.5
      }
    }

    return Math.max(total, viewportHeight)
  }, [document])

  const scaledContentHeight = totalContentHeight * scale

  if (!document) {
    return (
      <div
        className="flex items-center justify-center bg-[var(--sand-50)] rounded-2xl"
        style={{ width: frameWidth + 16, height: frameHeight + 16 }}
      >
        <span className="text-sm text-[var(--text-muted)]">로딩 중...</span>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.selectedTemplateId}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <PhoneFrame
          width={frameWidth + 16}
          height={frameHeight + 16}
          frameColor="black"
          showNotch={true}
          showHomeIndicator={true}
          scrollable={true}
          scrollRef={scrollRef}
        >
          <div
            style={{
              width: frameWidth,
              height: scaledContentHeight,
              position: 'relative',
            }}
          >
            {/* 스케일된 문서 렌더러 */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: ORIGINAL_WIDTH,
                height: totalContentHeight,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                ...cssVariables,
              }}
            >
              <DocumentRenderer
                document={document}
                mode="preview"
                viewportOverride={{
                  width: ORIGINAL_WIDTH,
                  height: ORIGINAL_HEIGHT,
                }}
              />

              {/* 하이라이트 오버레이 */}
              {highlightedBlockId && (
                <HighlightOverlay
                  blockId={highlightedBlockId}
                  scrollRef={scrollRef}
                />
              )}
            </div>
          </div>
        </PhoneFrame>

        {/* 그림자 */}
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black/10 rounded-full blur-xl -z-10"
        />
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================
// Highlight Overlay
// ============================================

interface HighlightOverlayProps {
  blockId: string
  scrollRef: React.RefObject<HTMLDivElement | null>
}

function HighlightOverlay({ blockId, scrollRef }: HighlightOverlayProps) {
  const [rect, setRect] = useState<{ top: number; height: number } | null>(null)

  useEffect(() => {
    if (!scrollRef.current) return

    const blockElement = scrollRef.current.querySelector(
      `[data-block-id="${blockId}"]`
    ) as HTMLElement | null

    if (blockElement) {
      setRect({
        top: blockElement.offsetTop,
        height: blockElement.offsetHeight,
      })
    }
  }, [blockId, scrollRef])

  if (!rect) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.3, 0],
        boxShadow: [
          '0 0 0 0 rgba(223, 160, 172, 0)',
          '0 0 0 8px rgba(223, 160, 172, 0.4)',
          '0 0 0 0 rgba(223, 160, 172, 0)',
        ],
      }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="absolute left-0 right-0 pointer-events-none rounded-lg"
      style={{
        top: rect.top,
        height: rect.height,
        background: 'linear-gradient(to bottom, rgba(223, 160, 172, 0.1), rgba(223, 160, 172, 0.2), rgba(223, 160, 172, 0.1))',
        border: '2px solid rgba(223, 160, 172, 0.5)',
      }}
    />
  )
}

export const MobilePreviewContent = memo(MobilePreviewContentInner)

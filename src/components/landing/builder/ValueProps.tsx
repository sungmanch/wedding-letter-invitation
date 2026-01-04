'use client'

/**
 * Value Props Section
 *
 * 핵심 가치 제안 + Trust Signals + CTA
 * - 3가지 핵심 가치 (아이콘 + 설명)
 * - 가격 정보
 * - CTA 버튼 (문서 생성)
 * - 소셜 증거 / Trust badges
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Palette, Smartphone, Clock, Shield, Star, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
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

// ============================================
// Constants
// ============================================

const VALUE_PROPS = [
  {
    icon: Palette,
    title: '무한한 커스터마이징',
    description:
      '6가지 프리미엄 템플릿과 섹션별 다양한 스타일로 나만의 청첩장을 완성하세요',
  },
  {
    icon: Smartphone,
    title: '실시간 미리보기',
    description:
      '선택할 때마다 바로 확인하는 실시간 프리뷰로 완벽한 결과물을 만드세요',
  },
  {
    icon: Clock,
    title: '5분 만에 완성',
    description:
      '복잡한 회원가입 없이 바로 시작, 빠르게 아름다운 청첩장을 완성하세요',
  },
]

const TRUST_BADGES = [
  { icon: Shield, text: 'SSL 보안 적용' },
  { icon: Star, text: '평균 4.9점 만족도' },
  { icon: Sparkles, text: '10,000+ 청첩장 생성' },
]

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

export function ValueProps() {
  const router = useRouter()
  const { state } = useSubwayBuilder()
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateDocument = useCallback(async () => {
    setIsLoading(true)

    try {
      const template = getTemplateV2ById(state.selectedTemplateId)
      if (!template) {
        throw new Error('템플릿을 찾을 수 없습니다')
      }

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
      setIsLoading(false)
    }
  }, [state, router])

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[var(--ivory-50)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--sage-100)] text-[var(--sage-700)] text-sm font-medium mb-4">
            왜 Maison de Letter인가요?
          </span>
          <h2
            className="text-3xl sm:text-4xl font-medium text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading, Noto Serif KR), serif' }}
          >
            쉽고 빠르게, 아름답게
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            복잡한 과정 없이 당신만의 특별한 청첩장을 완성하세요
          </p>
        </motion.div>

        {/* 3가지 가치 제안 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {VALUE_PROPS.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--sand-100)] hover:shadow-md hover:border-[var(--sage-200)] transition-all duration-300">
                {/* 아이콘 */}
                <div className="w-14 h-14 rounded-xl bg-[var(--sage-100)] flex items-center justify-center mb-6 group-hover:bg-[var(--sage-200)] transition-colors">
                  <prop.icon className="w-7 h-7 text-[var(--sage-600)]" />
                </div>

                {/* 텍스트 */}
                <h3 className="text-xl font-medium text-[var(--text-primary)] mb-3">
                  {prop.title}
                </h3>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  {prop.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 가격 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-4 px-8 py-6 rounded-2xl bg-white border border-[var(--sage-200)] shadow-sm">
            <div className="text-left">
              <p className="text-sm text-[var(--text-muted)] mb-1">
                프리미엄 청첩장
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[var(--sage-600)]">
                  19,900원
                </span>
                <span className="text-sm text-[var(--text-light)] line-through">
                  39,900원
                </span>
              </div>
            </div>
            <div className="w-px h-12 bg-[var(--sand-200)]" />
            <div className="text-left">
              <p className="text-xs text-[var(--sage-600)] font-medium mb-1">
                무료 기능
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                체험 • 저장 • 공유
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-center mb-12"
        >
          <Button
            variant="sage"
            size="lg"
            onClick={handleCreateDocument}
            disabled={isLoading}
            className="group px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                지금 시작하기
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
          <p className="text-sm text-[var(--text-light)] mt-3">
            카드 등록 없이 무료 체험
          </p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-2 text-sm text-[var(--text-light)]"
            >
              <badge.icon className="w-4 h-4 text-[var(--sage-500)]" />
              <span>{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

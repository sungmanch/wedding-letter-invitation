'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { ThemePreview } from '@/lib/themes'
import { getTemplateById } from '@/lib/themes'
import { IntroPreview } from './intros/IntroPreview'

// 템플릿 ID별 기본 프리뷰 이미지 매핑
const TEMPLATE_DEFAULT_IMAGES: Record<string, string> = {
  'cinematic': '/examples/images/example_wedding_image2.png',
  'exhibition': '/examples/images/example_wedding_image3.png',
  'magazine': '/examples/images/example_wedding_image4.png',
  'chat': '/examples/images/example_wedding_image5.png',
  'gothic-romance': '/examples/images/example_wedding_image6.png',
  'old-money': '/examples/images/example_wedding_image7.png',
  'monogram': '/examples/images/example_wedding_image8.png',
  'jewel-velvet': '/examples/images/example_wedding_image9.png',
}

// 템플릿 ID별 미리보기 데이터 (다양한 이름/날짜 표현)
const TEMPLATE_PREVIEW_DATA: Record<string, {
  groomName: string
  brideName: string
  weddingDate: string
  venueName: string
}> = {
  'cinematic': {
    groomName: '준혁',
    brideName: '서연',
    weddingDate: '2025-06-14',
    venueName: '아트리움',
  },
  'exhibition': {
    groomName: 'Daniel',
    brideName: 'Emily',
    weddingDate: '2025-09-20',
    venueName: 'Gallery K',
  },
  'magazine': {
    groomName: '도윤',
    brideName: '서아',
    weddingDate: '2025-03-08',
    venueName: '라비에벨',
  },
  'chat': {
    groomName: '민재',
    brideName: '하늘',
    weddingDate: '2025-11-22',
    venueName: '루나웨딩홀',
  },
  'gothic-romance': {
    groomName: '시우',
    brideName: '예린',
    weddingDate: '2025-10-31',
    venueName: '더채플 강남',
  },
  'old-money': {
    groomName: 'William',
    brideName: 'Charlotte',
    weddingDate: '2025-04-19',
    venueName: 'The Ritz',
  },
  'monogram': {
    groomName: '현우',
    brideName: '지은',
    weddingDate: '2025-08-16',
    venueName: '그랜드하얏트',
  },
  'jewel-velvet': {
    groomName: '태민',
    brideName: '소희',
    weddingDate: '2025-12-24',
    venueName: '노블발렌티',
  },
}

const DEFAULT_PREVIEW_DATA = {
  groomName: '민수',
  brideName: '수진',
  weddingDate: '2025-05-24',
  venueName: '더채플 청담',
}

interface TemplateCardProps {
  template: ThemePreview
  isSelected: boolean
  onSelect: () => void
  userImageUrl?: string
  className?: string
}

export function TemplateCard({
  template,
  isSelected,
  onSelect,
  userImageUrl,
  className,
}: TemplateCardProps) {
  // Get full template data for intro config
  const fullTemplate = React.useMemo(() => getTemplateById(template.id), [template.id])

  // 사용자 이미지가 없으면 템플릿별 기본 이미지 사용
  const previewImageUrl = userImageUrl || TEMPLATE_DEFAULT_IMAGES[template.id]

  // 템플릿별 미리보기 데이터 (다양한 이름/날짜)
  const previewData = TEMPLATE_PREVIEW_DATA[template.id] || DEFAULT_PREVIEW_DATA

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative flex flex-col rounded-2xl overflow-hidden transition-all',
        'border-2 hover:shadow-lg hover:shadow-[#C9A962]/10 focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50',
        'bg-white/5 backdrop-blur-sm',
        isSelected
          ? 'border-[#C9A962] shadow-lg ring-2 ring-[#C9A962]/20'
          : 'border-white/10 hover:border-[#C9A962]/30',
        className
      )}
    >
      {/* Template Preview with Intro */}
      <div
        className="aspect-[3/4] relative overflow-hidden"
        style={{ backgroundColor: template.colors.background }}
      >
        {/* Render actual intro component as preview */}
        {fullTemplate && (
          <IntroPreview
            intro={fullTemplate.intro}
            colors={fullTemplate.defaultColors}
            fonts={fullTemplate.defaultFonts}
            groomName={previewData.groomName}
            brideName={previewData.brideName}
            weddingDate={previewData.weddingDate}
            venueName={previewData.venueName}
            userImageUrl={previewImageUrl}
          />
        )}

        {/* Fallback if no template data */}
        {!fullTemplate && (
          <div className="relative z-10 h-full p-4 flex flex-col items-center justify-center text-center gap-2">
            {/* Mood Tags */}
            <div className="flex flex-wrap justify-center gap-1">
              {template.mood.slice(0, 2).map((mood) => (
                <span
                  key={mood}
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${template.colors.accent}20`,
                    color: template.colors.text,
                  }}
                >
                  {mood}
                </span>
              ))}
            </div>

            {/* Template Name */}
            <div
              className="text-sm font-medium"
              style={{ color: template.colors.text }}
            >
              {template.nameKo}
            </div>

            {/* Sample Names */}
            <div
              className="text-lg font-semibold"
              style={{ color: template.colors.text }}
            >
              {previewData.groomName} ♥ {previewData.brideName}
            </div>

            {/* Date placeholder */}
            <div
              className="text-xs"
              style={{ color: template.colors.text, opacity: 0.6 }}
            >
              {previewData.weddingDate.replace(/-/g, '.')}
            </div>

            {/* Accent Line */}
            <div
              className="w-10 h-0.5 mt-1"
              style={{ backgroundColor: template.colors.accent }}
            />
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-3 bg-white/5 border-t border-white/5">
        <div className="text-sm font-medium text-[#F5E6D3]">{template.name}</div>
        <div className="text-xs text-[#F5E6D3]/50 mt-1 line-clamp-2">
          {template.description}
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-[#C9A962] flex items-center justify-center z-50">
          <Check className="h-4 w-4 text-[#0A0806]" />
        </div>
      )}
    </button>
  )
}

// Skeleton for loading state
export function TemplateCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl overflow-hidden border-2 border-white/10 bg-white/5',
        className
      )}
    >
      <div className="aspect-[3/4] bg-white/10 animate-pulse" />
      <div className="p-3 bg-white/5 border-t border-white/5">
        <div className="h-4 bg-white/10 rounded animate-pulse w-2/3" />
        <div className="h-3 bg-white/5 rounded animate-pulse w-full mt-2" />
      </div>
    </div>
  )
}

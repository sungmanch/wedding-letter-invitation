'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { ThemePreview } from '@/lib/themes'
import { getTemplateById } from '@/lib/themes'
import { IntroPreview } from './intros/IntroPreview'

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
            groomName="민수"
            brideName="수진"
            weddingDate="2025-05-24"
            venueName="더채플 청담"
            userImageUrl={userImageUrl}
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
              민수 ♥ 수진
            </div>

            {/* Date placeholder */}
            <div
              className="text-xs"
              style={{ color: template.colors.text, opacity: 0.6 }}
            >
              2025.05.24
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

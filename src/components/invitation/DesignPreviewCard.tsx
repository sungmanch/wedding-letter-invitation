'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { DesignPreview } from '@/lib/actions/ai-design'

interface DesignPreviewCardProps {
  preview: DesignPreview
  isSelected: boolean
  onSelect: () => void
  className?: string
}

export function DesignPreviewCard({
  preview,
  isSelected,
  onSelect,
  className,
}: DesignPreviewCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative flex flex-col rounded-2xl overflow-hidden transition-all',
        'border-2 hover:shadow-lg',
        isSelected
          ? 'border-[#D4768A] shadow-lg ring-2 ring-[#D4768A]/20'
          : 'border-gray-200 hover:border-gray-300',
        className
      )}
    >
      {/* Design Preview */}
      <div
        className="aspect-[3/4] p-4 flex flex-col"
        style={{ backgroundColor: preview.colors.background }}
      >
        {/* Mock Wedding Card Preview */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
          {/* Mood Tags */}
          <div className="flex flex-wrap justify-center gap-1">
            {preview.mood.slice(0, 2).map((mood) => (
              <span
                key={mood}
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${preview.colors.accent}20`,
                  color: preview.colors.text,
                }}
              >
                {mood}
              </span>
            ))}
          </div>

          {/* Title */}
          <div
            className="text-sm font-medium"
            style={{
              color: preview.colors.text,
              fontFamily:
                preview.fontStyle.title === 'serif'
                  ? 'Georgia, serif'
                  : preview.fontStyle.title === 'script'
                    ? 'cursive'
                    : 'system-ui, sans-serif',
            }}
          >
            {preview.nameKo}
          </div>

          {/* Sample Names */}
          <div
            className="text-lg font-semibold"
            style={{
              color: preview.colors.text,
              fontFamily:
                preview.fontStyle.title === 'serif'
                  ? 'Georgia, serif'
                  : preview.fontStyle.title === 'script'
                    ? 'cursive'
                    : 'system-ui, sans-serif',
            }}
          >
            민수 ♥ 수진
          </div>

          {/* Date placeholder */}
          <div
            className="text-xs"
            style={{ color: preview.colors.text, opacity: 0.6 }}
          >
            2025.05.24
          </div>

          {/* Accent Line */}
          <div
            className="w-10 h-0.5 mt-1"
            style={{ backgroundColor: preview.colors.accent }}
          />
        </div>

        {/* Visual Keywords */}
        <div className="flex flex-wrap justify-center gap-1 mt-2">
          {preview.visualKeywords.slice(0, 3).map((keyword) => (
            <span
              key={keyword}
              className="text-[9px] opacity-60"
              style={{ color: preview.colors.text }}
            >
              #{keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Theme Info */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="text-sm font-medium text-charcoal">{preview.name}</div>
        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
          {preview.description}
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-[#D4768A] flex items-center justify-center">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}
    </button>
  )
}

// Skeleton for loading state
export function DesignPreviewCardSkeleton({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl overflow-hidden border-2 border-gray-200',
        className
      )}
    >
      <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="h-3 bg-gray-100 rounded animate-pulse w-full mt-2" />
      </div>
    </div>
  )
}

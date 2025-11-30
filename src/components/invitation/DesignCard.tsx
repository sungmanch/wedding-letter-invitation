'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { InvitationDesign } from '@/lib/db/invitation-schema'

interface DesignCardProps {
  design: InvitationDesign
  isSelected: boolean
  onSelect: () => void
  className?: string
}

export function DesignCard({ design, isSelected, onSelect, className }: DesignCardProps) {
  const { designData } = design
  const colors = designData.colors

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
        className="aspect-[3/4] p-4"
        style={{ backgroundColor: colors.background }}
      >
        {/* Mock Wedding Card Preview */}
        <div className="h-full flex flex-col items-center justify-center text-center gap-2">
          {/* Decorations at top */}
          {designData.decorations.includes('floral_top') && (
            <div className="text-2xl">🌸</div>
          )}

          {/* Names */}
          <div
            className="text-lg font-semibold"
            style={{ color: colors.text, fontFamily: designData.fonts.title }}
          >
            민수 & 수진
          </div>

          {/* Date placeholder */}
          <div
            className="text-sm"
            style={{ color: colors.text, opacity: 0.7 }}
          >
            2025.05.24
          </div>

          {/* Accent decoration */}
          <div
            className="w-12 h-0.5 mt-2"
            style={{ backgroundColor: colors.secondary }}
          />
        </div>
      </div>

      {/* Theme Info */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="text-sm font-medium text-charcoal truncate">
          {designData.theme.replace(/_/g, ' ')}
        </div>
        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
          {designData.styleDescription}
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

// Design Card Skeleton for loading state
export function DesignCardSkeleton({ className }: { className?: string }) {
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

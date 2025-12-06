'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TemplateCard, TemplateCardSkeleton } from './TemplateCard'
import type { ThemePreview } from '@/lib/themes'

interface TemplateGridProps {
  templates: ThemePreview[]
  selectedTemplateId: string | null
  onSelect: (templateId: string) => void
  onCustomClick: () => void
  userImageUrl?: string
  isLoading?: boolean
  className?: string
}

export function TemplateGrid({
  templates,
  selectedTemplateId,
  onSelect,
  onCustomClick,
  userImageUrl,
  isLoading = false,
  className,
}: TemplateGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4',
          className
        )}
      >
        {Array.from({ length: 11 }).map((_, i) => (
          <TemplateCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4',
        className
      )}
    >
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isSelected={selectedTemplateId === template.id}
          onSelect={() => onSelect(template.id)}
          userImageUrl={userImageUrl}
        />
      ))}

      {/* Custom Theme Button - Last position */}
      <CustomThemeButton onClick={onCustomClick} />
    </div>
  )
}

interface CustomThemeButtonProps {
  onClick: () => void
  className?: string
}

function CustomThemeButton({ onClick, className }: CustomThemeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex flex-col rounded-2xl overflow-hidden transition-all',
        'border-2 border-dashed border-white/20 hover:border-[#C9A962]/50 hover:shadow-lg hover:shadow-[#C9A962]/10',
        'focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50',
        'bg-white/5 backdrop-blur-sm',
        'group',
        className
      )}
    >
      {/* Button Content */}
      <div className="aspect-[3/4] bg-white/5 group-hover:bg-[#C9A962]/10 flex flex-col items-center justify-center gap-3 transition-colors">
        <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-[#C9A962] flex items-center justify-center transition-colors">
          <Plus className="w-6 h-6 text-[#F5E6D3]/60 group-hover:text-[#0A0806] transition-colors" />
        </div>
        <div className="text-sm font-medium text-[#F5E6D3]/80 group-hover:text-[#C9A962] transition-colors">
          커스텀 테마
        </div>
        <div className="text-xs text-[#F5E6D3]/50 text-center px-2">
          AI로 나만의 테마 생성
        </div>
      </div>

      {/* Bottom Info */}
      <div className="p-3 bg-white/5 border-t border-white/5">
        <div className="text-sm font-medium text-[#F5E6D3]">Custom Theme</div>
        <div className="text-xs text-[#F5E6D3]/50 mt-1">
          스타일을 설명해주세요
        </div>
      </div>
    </button>
  )
}

// Export CustomThemeButton for standalone use
export { CustomThemeButton }

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
        'border-2 border-dashed border-gray-300 hover:border-[#D4768A] hover:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-[#D4768A]/50',
        'group',
        className
      )}
    >
      {/* Button Content */}
      <div className="aspect-[3/4] bg-gray-50 group-hover:bg-pink-50 flex flex-col items-center justify-center gap-3 transition-colors">
        <div className="w-12 h-12 rounded-full bg-gray-200 group-hover:bg-[#D4768A] flex items-center justify-center transition-colors">
          <Plus className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
        </div>
        <div className="text-sm font-medium text-gray-600 group-hover:text-[#D4768A] transition-colors">
          커스텀 테마
        </div>
        <div className="text-xs text-gray-400 text-center px-2">
          AI로 나만의 테마 생성
        </div>
      </div>

      {/* Bottom Info */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="text-sm font-medium text-gray-700">Custom Theme</div>
        <div className="text-xs text-gray-500 mt-1">
          스타일을 설명해주세요
        </div>
      </div>
    </button>
  )
}

// Export CustomThemeButton for standalone use
export { CustomThemeButton }

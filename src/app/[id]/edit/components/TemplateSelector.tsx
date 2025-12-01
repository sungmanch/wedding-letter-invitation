'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check, Palette, Layout, Sparkles } from 'lucide-react'
import {
  getAllTemplates,
  getAllCategories,
  categoryNames,
  type ThemeTemplate,
  type ThemeCategory,
} from '@/lib/themes'

// ============================================
// Types
// ============================================

interface TemplateSelectorProps {
  currentTemplateId?: string
  onSelect: (template: ThemeTemplate, options: ApplyOptions) => void
}

interface ApplyOptions {
  applyColors: boolean
  applyFonts: boolean
  applySections: boolean
}

// ============================================
// Template Card
// ============================================

interface TemplateCardProps {
  template: ThemeTemplate
  isSelected: boolean
  onSelect: () => void
}

function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative flex flex-col rounded-xl overflow-hidden transition-all',
        'border-2 hover:shadow-md',
        isSelected
          ? 'border-[#D4768A] shadow-md ring-2 ring-[#D4768A]/20'
          : 'border-gray-200 hover:border-gray-300'
      )}
    >
      {/* Template Preview */}
      <div
        className="aspect-[3/4] p-3"
        style={{ backgroundColor: template.preview.colors.background }}
      >
        <div className="h-full flex flex-col items-center justify-center text-center gap-1.5">
          {/* Names Preview */}
          <div
            className="text-sm font-semibold"
            style={{
              color: template.preview.colors.text,
              fontFamily: template.defaultFonts.title.family,
            }}
          >
            민수 & 수진
          </div>
          {/* Date Preview */}
          <div
            className="text-[10px]"
            style={{ color: template.preview.colors.text, opacity: 0.7 }}
          >
            2025.05.24
          </div>
          {/* Accent Line */}
          <div
            className="w-8 h-0.5 mt-1"
            style={{ backgroundColor: template.preview.colors.secondary }}
          />
        </div>
      </div>

      {/* Template Info */}
      <div className="p-2 bg-white border-t border-gray-100">
        <div className="text-xs font-medium text-gray-900 truncate">
          {template.nameKo}
        </div>
        <div className="text-[10px] text-gray-500 mt-0.5">
          {categoryNames[template.category]}
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-[#D4768A] flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
    </button>
  )
}

// ============================================
// Apply Options
// ============================================

interface ApplyOptionToggleProps {
  icon: React.ElementType
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ApplyOptionToggle({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: ApplyOptionToggleProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="pt-0.5">
        <div
          className={cn(
            'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors',
            checked
              ? 'bg-[#D4768A] border-[#D4768A]'
              : 'border-gray-300 group-hover:border-gray-400'
          )}
        >
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">{label}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </label>
  )
}

// ============================================
// Main Component
// ============================================

export function TemplateSelector({ currentTemplateId, onSelect }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<ThemeCategory | 'all'>('all')
  const [selectedTemplate, setSelectedTemplate] = React.useState<ThemeTemplate | null>(null)
  const [applyOptions, setApplyOptions] = React.useState<ApplyOptions>({
    applyColors: true,
    applyFonts: true,
    applySections: false,
  })

  const templates = getAllTemplates()
  const categories = getAllCategories()

  const filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === selectedCategory)

  const handleApply = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate, applyOptions)
      setSelectedTemplate(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={cn(
            'px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors',
            selectedCategory === 'all'
              ? 'bg-[#D4768A] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          전체
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              'px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors',
              selectedCategory === category.id
                ? 'bg-[#D4768A] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-3 gap-2">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id || currentTemplateId === template.id}
            onSelect={() => setSelectedTemplate(template)}
          />
        ))}
      </div>

      {/* Apply Options & Button */}
      {selectedTemplate && selectedTemplate.id !== currentTemplateId && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-50 md:relative md:border md:rounded-xl md:shadow-none md:p-4">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4768A]" />
              <span className="text-sm font-medium text-gray-900">
                {selectedTemplate.nameKo} 템플릿 적용
              </span>
            </div>

            <div className="space-y-3">
              <ApplyOptionToggle
                icon={Palette}
                label="색상 적용"
                description="템플릿의 색상 팔레트를 적용합니다"
                checked={applyOptions.applyColors}
                onChange={(checked) =>
                  setApplyOptions((prev) => ({ ...prev, applyColors: checked }))
                }
              />
              <ApplyOptionToggle
                icon={Layout}
                label="폰트 적용"
                description="템플릿의 폰트 설정을 적용합니다"
                checked={applyOptions.applyFonts}
                onChange={(checked) =>
                  setApplyOptions((prev) => ({ ...prev, applyFonts: checked }))
                }
              />
              <ApplyOptionToggle
                icon={Layout}
                label="섹션 구성 적용"
                description="템플릿의 섹션 순서와 설정을 적용합니다 (주의: 기존 설정이 초기화됩니다)"
                checked={applyOptions.applySections}
                onChange={(checked) =>
                  setApplyOptions((prev) => ({ ...prev, applySections: checked }))
                }
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#D4768A] rounded-lg hover:bg-[#c4667a] transition-colors"
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

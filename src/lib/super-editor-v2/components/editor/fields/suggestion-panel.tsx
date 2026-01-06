'use client'

/**
 * Suggestion Panel - 추천 문구 선택 패널
 *
 * textarea 필드 옆에 표시되어 사용자가
 * 추천 문구를 카테고리별로 탐색하고 선택할 수 있음
 */

import { useState, useMemo } from 'react'
import {
  getSuggestionsByCategory,
  CATEGORY_LABELS,
  type SuggestionCategory,
  type GreetingSuggestion,
} from '../../../config/greeting-suggestions'

// ============================================
// Types
// ============================================

interface SuggestionPanelProps {
  /** 바인딩 경로 (greeting.content 등) */
  binding: string
  /** 문구 선택 시 콜백 */
  onSelect: (text: string, source?: string) => void
  /** 패널 닫기 콜백 */
  onClose: () => void
}

// ============================================
// Component
// ============================================

export function SuggestionPanel({ binding, onSelect, onClose }: SuggestionPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<SuggestionCategory | 'all'>('all')

  // 필터링된 추천 문구
  const suggestions = useMemo(
    () => getSuggestionsByCategory(binding, selectedCategory),
    [binding, selectedCategory]
  )

  const categories: (SuggestionCategory | 'all')[] = ['all', 'classic', 'romantic', 'modern', 'humorous']

  return (
    <div
      className="absolute top-full left-0 right-0 mt-2 z-50
        bg-white border border-[var(--editor-border-emphasis)] rounded-xl
        shadow-lg overflow-hidden"
      style={{ maxHeight: '360px' }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--editor-border)] bg-[var(--editor-surface)]">
        <h4 className="text-sm font-medium text-[var(--text-primary)]">추천 문구</h4>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded hover:bg-[var(--warm-100)] transition-colors"
          aria-label="닫기"
        >
          <CloseIcon className="w-4 h-4 text-[var(--text-muted)]" />
        </button>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-1 px-4 py-2 border-b border-[var(--editor-border)] bg-[var(--editor-bg)] overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`
              px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors
              ${selectedCategory === cat
                ? 'bg-[var(--blush-400)] text-white'
                : 'bg-[var(--warm-100)] text-[var(--text-muted)] hover:bg-[var(--warm-200)]'
              }
            `}
          >
            {cat === 'all' ? '전체' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* 추천 목록 */}
      <div className="overflow-y-auto" style={{ maxHeight: '260px' }}>
        {suggestions.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-[var(--text-light)]">
            추천 문구가 없습니다
          </div>
        ) : (
          <div className="divide-y divide-[var(--editor-border)]">
            {suggestions.map((suggestion) => (
              <SuggestionItem
                key={suggestion.id}
                suggestion={suggestion}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Sub Components
// ============================================

interface SuggestionItemProps {
  suggestion: GreetingSuggestion
  onSelect: (text: string, source?: string) => void
}

function SuggestionItem({ suggestion, onSelect }: SuggestionItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(suggestion.text, suggestion.source)}
      className="w-full text-left px-4 py-3 hover:bg-[var(--blush-50)] transition-colors group"
    >
      {/* 본문 */}
      <p className="text-sm text-[var(--text-body)] whitespace-pre-line line-clamp-4">
        {suggestion.text}
      </p>

      {/* 출처 (있을 경우) */}
      {suggestion.source && (
        <p className="mt-1.5 text-xs text-[var(--text-muted)]">
          — {suggestion.source}
        </p>
      )}

      {/* 태그 + 선택 버튼 */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-1">
          {suggestion.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--warm-100)] text-[var(--text-light)]"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-[var(--blush-500)] opacity-0 group-hover:opacity-100 transition-opacity">
          선택 →
        </span>
      </div>
    </button>
  )
}

// ============================================
// Icons
// ============================================

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

// ============================================
// Exports
// ============================================

export { SuggestionPanel as default }

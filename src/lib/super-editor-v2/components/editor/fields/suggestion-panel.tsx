'use client'

/**
 * Suggestion Panel - 추천 문구 선택 패널
 *
 * React Portal을 사용하여 body에 렌더링
 * 부모 컨테이너의 overflow 제약을 피하고 화면 어디서든 표시 가능
 */

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
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
  /** 앵커 요소(버튼)의 위치 정보 */
  anchorRect?: DOMRect | null
  /** 문구 선택 시 콜백 */
  onSelect: (text: string, source?: string) => void
  /** 패널 닫기 콜백 */
  onClose: () => void
}

// ============================================
// Constants
// ============================================

const PANEL_WIDTH = 320
const PANEL_MAX_HEIGHT = 400
const VIEWPORT_PADDING = 16

// ============================================
// Component
// ============================================

export function SuggestionPanel({ binding, anchorRect, onSelect, onClose }: SuggestionPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<SuggestionCategory | 'all'>('all')
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // 필터링된 추천 문구
  const suggestions = useMemo(
    () => getSuggestionsByCategory(binding, selectedCategory),
    [binding, selectedCategory]
  )

  const categories: (SuggestionCategory | 'all')[] = ['all', 'classic', 'romantic', 'modern', 'humorous']

  // 클라이언트에서만 Portal 렌더링
  useEffect(() => {
    setMounted(true)
  }, [])

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // 외부 클릭으로 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // 약간의 지연을 두어 버튼 클릭 이벤트와 충돌 방지
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  // 패널 위치 계산
  const panelStyle = useMemo(() => {
    if (!anchorRect) {
      // anchorRect가 없으면 화면 중앙에 표시
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: PANEL_WIDTH,
        maxHeight: PANEL_MAX_HEIGHT,
      }
    }

    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    // 기본: 버튼 아래에 표시
    let top = anchorRect.bottom + 8
    let left = anchorRect.right - PANEL_WIDTH

    // 화면 하단 공간 부족 시 위로 flip
    const spaceBelow = viewportHeight - anchorRect.bottom - VIEWPORT_PADDING
    const spaceAbove = anchorRect.top - VIEWPORT_PADDING

    if (spaceBelow < PANEL_MAX_HEIGHT && spaceAbove > spaceBelow) {
      // 위에 표시
      top = anchorRect.top - PANEL_MAX_HEIGHT - 8
    }

    // 좌측 경계 체크
    if (left < VIEWPORT_PADDING) {
      left = VIEWPORT_PADDING
    }

    // 우측 경계 체크
    if (left + PANEL_WIDTH > viewportWidth - VIEWPORT_PADDING) {
      left = viewportWidth - PANEL_WIDTH - VIEWPORT_PADDING
    }

    return {
      position: 'fixed' as const,
      top,
      left,
      width: PANEL_WIDTH,
      maxHeight: Math.min(PANEL_MAX_HEIGHT, Math.max(spaceBelow, spaceAbove)),
    }
  }, [anchorRect])

  // SSR에서는 렌더링하지 않음
  if (!mounted) return null

  const panelContent = (
    <div
      ref={panelRef}
      className="z-[9999] bg-white border border-[var(--editor-border-emphasis)] rounded-xl shadow-2xl overflow-hidden flex flex-col"
      style={panelStyle}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--editor-border)] bg-[var(--editor-surface)] shrink-0">
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
      <div className="flex gap-1 px-4 py-2 border-b border-[var(--editor-border)] bg-[var(--editor-bg)] overflow-x-auto shrink-0">
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
      <div className="overflow-y-auto flex-1">
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

  // Portal로 body에 렌더링
  return createPortal(panelContent, document.body)
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

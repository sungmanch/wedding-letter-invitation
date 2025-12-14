'use client'

/**
 * Super Editor v2 - Editor Layout
 *
 * 2패널 레이아웃 (에디터 | 프리뷰)
 * v1 편집 페이지 패턴을 참고하여 구현
 */

import { useState, useCallback, type ReactNode } from 'react'
import type { EditorDocument, Block, WeddingData, BlockType } from '../../schema/types'
import type { ResolvedStyle } from '../../renderer/style-resolver'

// ============================================
// Types
// ============================================

export type EditorTab = 'content' | 'design' | 'share'

export interface EditorLayoutProps {
  /** 문서 데이터 */
  document: EditorDocument
  /** 해석된 스타일 */
  resolvedStyle: ResolvedStyle
  /** 저장 중 상태 */
  saving?: boolean
  /** 저장 콜백 */
  onSave?: () => void
  /** 미리보기 콜백 */
  onPreview?: () => void
  /** 문서 업데이트 콜백 */
  onDocumentChange?: (doc: EditorDocument) => void
  /** 블록 업데이트 콜백 */
  onBlocksChange?: (blocks: Block[]) => void
  /** 데이터 업데이트 콜백 */
  onDataChange?: (data: WeddingData) => void
  /** 스타일 업데이트 콜백 */
  onStyleChange?: (style: ResolvedStyle) => void
  /** 헤더 영역 (커스텀) */
  headerSlot?: ReactNode
  /** 에디터 패널 (커스텀) */
  editorSlot?: ReactNode
  /** 프리뷰 패널 (커스텀) */
  previewSlot?: ReactNode
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function EditorLayout({
  document,
  resolvedStyle,
  saving = false,
  onSave,
  onPreview,
  onDocumentChange,
  onBlocksChange,
  onDataChange,
  onStyleChange,
  headerSlot,
  editorSlot,
  previewSlot,
  className = '',
}: EditorLayoutProps) {
  // 현재 활성 탭
  const [activeTab, setActiveTab] = useState<EditorTab>('content')

  // 펼쳐진 블록 (Section-First 패턴)
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(
    document.blocks[0]?.id ?? null
  )

  // 선택된 블록 (프리뷰 하이라이트용)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

  // 블록 활성화 상태 토글
  const handleBlockToggle = useCallback((blockId: string) => {
    if (!onBlocksChange) return

    const newBlocks = document.blocks.map(block =>
      block.id === blockId
        ? { ...block, enabled: !block.enabled }
        : block
    )
    onBlocksChange(newBlocks)
  }, [document.blocks, onBlocksChange])

  // 블록 순서 변경
  const handleBlockMove = useCallback((blockId: string, direction: 'up' | 'down') => {
    if (!onBlocksChange) return

    const currentIndex = document.blocks.findIndex(b => b.id === blockId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= document.blocks.length) return

    const newBlocks = [...document.blocks]
    const [moved] = newBlocks.splice(currentIndex, 1)
    newBlocks.splice(newIndex, 0, moved)
    onBlocksChange(newBlocks)
  }, [document.blocks, onBlocksChange])

  // 프리뷰에서 블록 클릭 시 에디터로 연동
  const handleBlockClick = useCallback((blockId: string) => {
    setExpandedBlockId(blockId)
    setSelectedBlockId(blockId)
    setActiveTab('content')
  }, [])

  return (
    <div className={`min-w-5xl h-screen grid grid-rows-[auto_1fr] bg-[#0A0806] ${className}`}>
      {/* 헤더 */}
      {headerSlot ? (
        headerSlot
      ) : (
        <EditorHeader
          saving={saving}
          onSave={onSave}
          onPreview={onPreview}
        />
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex min-h-0 flex-1">
        {/* 왼쪽: 에디터 패널 */}
        <div className="w-[400px] flex flex-col bg-[#1A1A1A] border-r border-white/10 shrink-0 min-h-0 overflow-auto">
          {/* 탭 네비게이션 */}
          <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* 탭 콘텐츠 */}
          <div className="flex-1 overflow-y-auto scrollbar-gold">
            {editorSlot}
          </div>
        </div>

        {/* 오른쪽: 프리뷰 */}
        <div className="flex-1 flex flex-col bg-[#0A0806]">
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            {previewSlot}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Sub Components
// ============================================

interface EditorHeaderProps {
  saving?: boolean
  onSave?: () => void
  onPreview?: () => void
}

function EditorHeader({ saving, onSave, onPreview }: EditorHeaderProps) {
  return (
    <header className="bg-[#0A0806] border-b border-white/10 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-[#F5E6D3]">청첩장 편집</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 bg-white/10 text-[#F5E6D3] rounded-lg hover:bg-white/20 disabled:opacity-50 text-sm font-medium"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
          <button
            onClick={onPreview}
            className="px-4 py-2 bg-[#C9A962] text-[#0A0806] rounded-lg hover:bg-[#B8A052] text-sm font-medium"
          >
            미리보기
          </button>
        </div>
      </div>
    </header>
  )
}

interface EditorTabsProps {
  activeTab: EditorTab
  onTabChange: (tab: EditorTab) => void
}

function EditorTabs({ activeTab, onTabChange }: EditorTabsProps) {
  const tabs: { id: EditorTab; label: string }[] = [
    { id: 'content', label: '콘텐츠' },
    { id: 'design', label: '디자인' },
    { id: 'share', label: '공유' },
  ]

  return (
    <div className="flex border-b border-white/10 shrink-0">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'text-[#C9A962] border-b-2 border-[#C9A962] bg-[#C9A962]/10'
              : 'text-[#F5E6D3]/60 hover:text-[#F5E6D3] hover:bg-white/5'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ============================================
// Context for Editor State
// ============================================

import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'

interface EditorUIState {
  activeTab: EditorTab
  setActiveTab: Dispatch<SetStateAction<EditorTab>>
  expandedBlockId: string | null
  setExpandedBlockId: Dispatch<SetStateAction<string | null>>
  selectedBlockId: string | null
  setSelectedBlockId: Dispatch<SetStateAction<string | null>>
}

const EditorUIContext = createContext<EditorUIState | null>(null)

export function useEditorUI(): EditorUIState {
  const ctx = useContext(EditorUIContext)
  if (!ctx) {
    throw new Error('useEditorUI must be used within EditorLayout')
  }
  return ctx
}

// ============================================
// Exports
// ============================================

export { EditorHeader, EditorTabs }
export type { EditorHeaderProps, EditorTabsProps }

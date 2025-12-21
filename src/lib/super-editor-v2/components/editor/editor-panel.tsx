'use client'

/**
 * Super Editor v2 - Editor Panel
 *
 * 에디터 패널 컨테이너
 * 탭 (content, design, share) 전환 및 상태 관리
 */

import { useState, useCallback, useMemo, type ReactNode } from 'react'
import type { EditorDocument, Block, WeddingData, BlockType } from '../../schema/types'
import type { ResolvedStyle } from '../../renderer/style-resolver'
import type { EditorTab } from './editor-layout'

// ============================================
// Types
// ============================================

export interface EditorPanelProps {
  /** 문서 데이터 */
  document: EditorDocument
  /** 해석된 스타일 */
  resolvedStyle: ResolvedStyle
  /** 현재 활성 탭 */
  activeTab: EditorTab
  /** 탭 변경 콜백 */
  onTabChange: (tab: EditorTab) => void
  /** 펼쳐진 블록 ID */
  expandedBlockId: string | null
  /** 펼침 상태 변경 콜백 */
  onExpandedBlockChange: (blockId: string | null) => void
  /** 데이터 업데이트 콜백 */
  onDataChange?: (data: WeddingData) => void
  /** 블록 업데이트 콜백 */
  onBlocksChange?: (blocks: Block[]) => void
  /** 스타일 업데이트 콜백 */
  onStyleChange?: (style: ResolvedStyle) => void
  /** Content 탭 슬롯 */
  contentTab?: ReactNode
  /** Design 탭 슬롯 */
  designTab?: ReactNode
  /** Share 탭 슬롯 */
  shareTab?: ReactNode
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function EditorPanel({
  document,
  resolvedStyle,
  activeTab,
  onTabChange,
  expandedBlockId,
  onExpandedBlockChange,
  onDataChange,
  onBlocksChange,
  onStyleChange,
  contentTab,
  designTab,
  shareTab,
  className = '',
}: EditorPanelProps) {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 탭 네비게이션 */}
      <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-y-auto scrollbar-gold">
        {activeTab === 'content' && contentTab}
        {activeTab === 'design' && designTab}
        {activeTab === 'share' && shareTab}
      </div>
    </div>
  )
}

// ============================================
// Tab Navigation
// ============================================

interface TabNavigationProps {
  activeTab: EditorTab
  onTabChange: (tab: EditorTab) => void
}

function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs: { id: EditorTab; label: string; icon: ReactNode }[] = [
    {
      id: 'content',
      label: '콘텐츠',
      icon: <ContentIcon className="w-4 h-4" />,
    },
    {
      id: 'design',
      label: '디자인',
      icon: <DesignIcon className="w-4 h-4" />,
    },
    {
      id: 'share',
      label: '공유',
      icon: <ShareIcon className="w-4 h-4" />,
    },
  ]

  return (
    <div className="flex border-b border-white/10 shrink-0">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'text-[#C9A962] border-b-2 border-[#C9A962] bg-[#C9A962]/10'
              : 'text-[#F5E6D3]/60 hover:text-[#F5E6D3] hover:bg-white/5'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ============================================
// Editor Toolbar
// ============================================

export interface EditorToolbarProps {
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
  dirty?: boolean
  className?: string
}

export function EditorToolbar({
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  dirty = false,
  className = '',
}: EditorToolbarProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#1A1A1A] ${className}`}
    >
      {/* 왼쪽: Undo/Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded-lg text-[#F5E6D3] hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          title="실행 취소"
        >
          <UndoIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 rounded-lg text-[#F5E6D3] hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          title="다시 실행"
        >
          <RedoIcon className="w-5 h-5" />
        </button>

        {dirty && (
          <span className="ml-2 text-xs text-[#C9A962]">저장되지 않음</span>
        )}
      </div>
    </div>
  )
}

// ============================================
// Section Header (Block 아코디언 헤더)
// ============================================

export interface SectionHeaderProps {
  /** 블록 타입 */
  blockType: BlockType
  /** 블록 라벨 */
  label: string
  /** 활성화 여부 */
  enabled: boolean
  /** 펼침 여부 */
  expanded: boolean
  /** 토글 콜백 */
  onToggle: () => void
  /** 펼침 콜백 */
  onExpand: () => void
  /** 위로 이동 가능 */
  canMoveUp?: boolean
  /** 아래로 이동 가능 */
  canMoveDown?: boolean
  /** 위로 이동 콜백 */
  onMoveUp?: () => void
  /** 아래로 이동 콜백 */
  onMoveDown?: () => void
  /** 고정 섹션 여부 (이동 불가) */
  fixed?: boolean
  className?: string
}

export function SectionHeader({
  blockType,
  label,
  enabled,
  expanded,
  onToggle,
  onExpand,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  fixed = false,
  className = '',
}: SectionHeaderProps) {
  const icon = BLOCK_TYPE_ICONS[blockType] ?? '📄'

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 bg-[#2A2A2A] rounded-lg cursor-pointer hover:bg-[#333333] transition-colors ${className}`}
      onClick={onExpand}
    >
      {/* 아이콘 */}
      <span className="text-lg">{icon}</span>

      {/* 라벨 */}
      <span className={`flex-1 text-sm font-medium ${enabled ? 'text-[#F5E6D3]' : 'text-[#F5E6D3]/40'}`}>
        {label}
      </span>

      {/* 순서 변경 버튼 */}
      {!fixed && (
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1 text-[#F5E6D3]/40 hover:text-[#F5E6D3] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronUpIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1 text-[#F5E6D3]/40 hover:text-[#F5E6D3] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 활성화 토글 */}
      <div onClick={e => e.stopPropagation()}>
        <ToggleSwitch enabled={enabled} onChange={onToggle} />
      </div>

      {/* 펼침 인디케이터 */}
      <ChevronIcon
        className={`w-4 h-4 text-[#F5E6D3]/40 transition-transform ${expanded ? 'rotate-180' : ''}`}
      />
    </div>
  )
}

// ============================================
// Toggle Switch
// ============================================

interface ToggleSwitchProps {
  enabled: boolean
  onChange: () => void
}

function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors ${
        enabled ? 'bg-[#C9A962]' : 'bg-white/20'
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
          enabled ? 'left-5' : 'left-0.5'
        }`}
      />
    </button>
  )
}

// ============================================
// Block Type Icons
// ============================================

const BLOCK_TYPE_ICONS: Record<BlockType, string> = {
  hero: '🖼️',
  'greeting-parents': '💌',
  profile: '👤',
  calendar: '📅',
  gallery: '🎨',
  rsvp: '✅',
  location: '📍',
  notice: '📢',
  account: '💳',
  message: '💬',
  ending: '🎬',
  music: '🎵',
  loading: '⏳',
  custom: '🔧',
}

// Re-export from schema
export { BLOCK_TYPE_LABELS } from '../../schema'

// ============================================
// Icons
// ============================================

function ContentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function DesignIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  )
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  )
}

function UndoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  )
}

function RedoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
    </svg>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// ============================================
// Exports
// ============================================

export { TabNavigation }

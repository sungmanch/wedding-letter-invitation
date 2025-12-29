'use client'

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import type {
  Block,
  BlockType,
  Element,
  BlockStyleOverride,
  BlockAnimationConfig,
} from '../schema/types'
import type { ResolvedTokens } from '../renderer/style-resolver'
import { useDocument } from './document-context'
import { useBlockVisibility } from './animation-context'
import { resolveBlockHeightNumber } from '../utils/size-resolver'

// ============================================
// Types
// ============================================

export interface BlockContextValue {
  // 블록 데이터
  block: Block
  blockId: string
  blockType: BlockType
  blockIndex: number

  // 블록 상태
  isEnabled: boolean
  isVisible: boolean
  isActive: boolean

  // 블록 요소
  elements: Element[]
  getElement: (elementId: string) => Element | undefined

  // 블록 스타일 (문서 스타일 + 오버라이드 병합)
  tokens: ResolvedTokens

  // 블록 애니메이션 설정
  animation?: BlockAnimationConfig

  // 블록 높이 (vh)
  height: number

  // 편집 모드 콜백
  onSelectElement?: (elementId: string) => void
  onUpdateElement?: (elementId: string, updates: Partial<Element>) => void
}

// ============================================
// Context
// ============================================

const BlockContext = createContext<BlockContextValue | null>(null)

// ============================================
// Hooks
// ============================================

export function useBlock(): BlockContextValue {
  const ctx = useContext(BlockContext)
  if (!ctx) {
    throw new Error('useBlock must be used within BlockProvider')
  }
  return ctx
}

/**
 * 블록 ID만 가져오기
 */
export function useBlockId(): string {
  const { blockId } = useBlock()
  return blockId
}

/**
 * 블록 타입만 가져오기
 */
export function useBlockType(): BlockType {
  const { blockType } = useBlock()
  return blockType
}

/**
 * 블록의 요소 목록 가져오기
 */
export function useBlockElements(): Element[] {
  const { elements } = useBlock()
  return elements
}

/**
 * 특정 요소 가져오기
 */
export function useElement(elementId: string): Element | undefined {
  const { getElement } = useBlock()
  return getElement(elementId)
}

/**
 * 블록 활성화 여부
 */
export function useBlockEnabled(): boolean {
  const { isEnabled } = useBlock()
  return isEnabled
}

/**
 * 블록 토큰 (스타일)
 */
export function useBlockTokens(): ResolvedTokens {
  const { tokens } = useBlock()
  return tokens
}

// ============================================
// Provider
// ============================================

interface BlockProviderProps {
  children: ReactNode
  block: Block
  blockIndex: number
  // 편집 모드 콜백
  onSelectElement?: (elementId: string) => void
  onUpdateElement?: (elementId: string, updates: Partial<Element>) => void
}

export function BlockProvider({
  children,
  block,
  blockIndex,
  onSelectElement,
  onUpdateElement,
}: BlockProviderProps) {
  const { style, activeBlockId } = useDocument()

  // 블록 가시성 (애니메이션 컨텍스트에서)
  let isVisible = true
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    isVisible = useBlockVisibility(block.id)
  } catch {
    // AnimationProvider가 없으면 기본 true
  }

  // 블록별 토큰 계산 (문서 스타일 + 블록 오버라이드)
  const tokens = useMemo(() => {
    // 블록 오버라이드가 있는지 확인
    const blockOverride = style.blockOverrides.get(block.id)
    if (blockOverride) {
      return blockOverride
    }
    return style.tokens
  }, [style, block.id])

  // 요소 조회 함수
  const getElement = useMemo(() => {
    const elementMap = new Map((block.elements ?? []).map(el => [el.id, el]))
    return (elementId: string) => elementMap.get(elementId)
  }, [block.elements])

  const value: BlockContextValue = useMemo(() => ({
    block,
    blockId: block.id,
    blockType: block.type,
    blockIndex,
    isEnabled: block.enabled,
    isVisible,
    isActive: activeBlockId === block.id,
    elements: block.elements,
    getElement,
    tokens,
    animation: block.animation,
    height: resolveBlockHeightNumber(block.height),
    onSelectElement,
    onUpdateElement,
  }), [
    block,
    blockIndex,
    isVisible,
    activeBlockId,
    getElement,
    tokens,
    onSelectElement,
    onUpdateElement,
  ])

  return (
    <BlockContext.Provider value={value}>
      {children}
    </BlockContext.Provider>
  )
}

// ============================================
// Utility Hooks
// ============================================

/**
 * 블록 타입에 따른 기본 높이 반환
 */
export function getDefaultBlockHeight(type: BlockType): number {
  const heights: Partial<Record<BlockType, number>> = {
    hero: 100,
    'greeting-parents': 80,
    profile: 80,
    calendar: 80,
    gallery: 120,
    rsvp: 60,
    location: 100,
    notice: 40,
    account: 80,
    message: 100,
    ending: 60,
    contact: 85,
    music: 20,
    loading: 100,
    custom: 50,
  }
  return heights[type] ?? 50
}

/**
 * 블록 타입에 따른 한글 라벨 반환
 */
export function getBlockTypeLabel(type: BlockType): string {
  const labels: Record<BlockType, string> = {
    hero: '메인 커버',
    'greeting-parents': '인사말/혼주',
    profile: '신랑신부 소개',
    calendar: '예식일시',
    gallery: '갤러리',
    rsvp: '참석 여부',
    location: '오시는길',
    notice: '공지사항',
    account: '축의금',
    message: '방명록',
    wreath: '화환 안내',
    ending: '엔딩',
    contact: '연락처',
    music: '배경음악',
    loading: '로딩 화면',
    custom: '커스텀',
  }
  return labels[type] ?? type
}

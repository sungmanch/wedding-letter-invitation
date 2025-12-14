'use client'

/**
 * Block Renderer - 블록 렌더링
 *
 * 21개 BlockType을 렌더링
 * BlockProvider로 감싸서 하위 컴포넌트에 블록 컨텍스트 제공
 */

import { useMemo, useCallback, type CSSProperties } from 'react'
import type { Block, BlockType, BlockStyleOverride, GradientValue } from '../schema/types'
import { BlockProvider, useBlockTokens } from '../context/block-context'
import { useDocument } from '../context/document-context'
import { ElementRenderer } from './element-renderer'

// ============================================
// Types
// ============================================

export interface BlockRendererProps {
  block: Block
  blockIndex: number
  editable?: boolean
  onBlockClick?: (blockId: string) => void
  onElementClick?: (blockId: string, elementId: string) => void
}

// ============================================
// Main Component
// ============================================

export function BlockRenderer({
  block,
  blockIndex,
  editable = false,
  onBlockClick,
  onElementClick,
}: BlockRendererProps) {
  // 블록 클릭 핸들러
  const handleBlockClick = useCallback(() => {
    onBlockClick?.(block.id)
  }, [block.id, onBlockClick])

  // 요소 클릭 핸들러
  const handleElementClick = useCallback((elementId: string) => {
    onElementClick?.(block.id, elementId)
  }, [block.id, onElementClick])

  return (
    <BlockProvider block={block} blockIndex={blockIndex}>
      <BlockContainer
        block={block}
        blockIndex={blockIndex}
        editable={editable}
        onClick={handleBlockClick}
        onElementClick={handleElementClick}
      />
    </BlockProvider>
  )
}

// ============================================
// Block Container
// ============================================

interface BlockContainerProps {
  block: Block
  blockIndex: number
  editable: boolean
  onClick?: () => void
  onElementClick?: (elementId: string) => void
}

function BlockContainer({
  block,
  blockIndex,
  editable,
  onClick,
  onElementClick,
}: BlockContainerProps) {
  const tokens = useBlockTokens()
  const { activeBlockId } = useDocument()
  const isActive = activeBlockId === block.id

  // 블록 스타일 계산
  const blockStyle = useMemo<CSSProperties>(() => {
    const style: CSSProperties = {
      position: 'relative',
      minHeight: `${block.height}vh`,
      backgroundColor: tokens.bgSection,
      color: tokens.fgDefault,
    }

    // 블록 레벨 스타일 오버라이드 적용
    if (block.style) {
      Object.assign(style, resolveBlockStyleOverride(block.style, tokens))
    }

    // 편집 모드 스타일
    if (editable) {
      style.cursor = 'pointer'
      style.outline = isActive ? '2px solid var(--accent-default)' : undefined
      style.outlineOffset = isActive ? '-2px' : undefined
    }

    return style
  }, [block.height, block.style, tokens, editable, isActive])

  return (
    <section
      className={`se2-block se2-block--${block.type}`}
      data-block-id={block.id}
      data-block-type={block.type}
      data-block-index={blockIndex}
      style={blockStyle}
      onClick={editable ? onClick : undefined}
    >
      {/* 블록 타입별 기본 구조 렌더링 */}
      <BlockTypeRenderer block={block} />

      {/* 요소 렌더링 */}
      <div className="se2-block__elements">
        {(block.elements ?? []).map(element => (
          <ElementRenderer
            key={element.id}
            element={element}
            editable={editable}
            onClick={onElementClick}
          />
        ))}
      </div>

      {/* 편집 모드 라벨 */}
      {editable && (
        <div
          className="se2-block__label"
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            padding: '2px 8px',
            fontSize: '10px',
            fontWeight: 500,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            borderRadius: 4,
            pointerEvents: 'none',
            zIndex: 100,
          }}
        >
          {getBlockTypeLabel(block.type)}
        </div>
      )}
    </section>
  )
}

// ============================================
// Block Type Renderer
// ============================================

interface BlockTypeRendererProps {
  block: Block
}

/**
 * 블록 타입별 기본 구조 렌더링
 * 각 블록 타입에 맞는 시맨틱 구조 제공
 */
function BlockTypeRenderer({ block }: BlockTypeRendererProps) {
  // 블록 타입별 특수 처리
  // 대부분의 경우 요소들이 절대 위치로 배치되므로
  // 여기서는 블록 타입별 배경/구조만 제공

  switch (block.type) {
    case 'hero':
      return <HeroBlockStructure />

    case 'loading':
      return <LoadingBlockStructure />

    case 'gallery':
      return <GalleryBlockStructure />

    case 'calendar':
      return <CalendarBlockStructure />

    case 'location':
      return <LocationBlockStructure />

    case 'message':
      return <MessageBlockStructure />

    default:
      // 기본 구조: 빈 컨테이너
      return null
  }
}

// ============================================
// Block Type Structures
// ============================================

function HeroBlockStructure() {
  return (
    <div
      className="se2-block__hero-structure"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  )
}

function LoadingBlockStructure() {
  return (
    <div
      className="se2-block__loading-structure"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  )
}

function GalleryBlockStructure() {
  return (
    <div
      className="se2-block__gallery-structure"
      style={{
        position: 'absolute',
        inset: 0,
      }}
    />
  )
}

function CalendarBlockStructure() {
  return (
    <div
      className="se2-block__calendar-structure"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    />
  )
}

function LocationBlockStructure() {
  return (
    <div
      className="se2-block__location-structure"
      style={{
        position: 'absolute',
        inset: 0,
      }}
    />
  )
}

function MessageBlockStructure() {
  return (
    <div
      className="se2-block__message-structure"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    />
  )
}

// ============================================
// Utility Functions
// ============================================

/**
 * BlockStyleOverride를 CSSProperties로 변환
 */
function resolveBlockStyleOverride(
  override: BlockStyleOverride,
  tokens: ReturnType<typeof useBlockTokens>
): CSSProperties {
  const style: CSSProperties = {}

  // 배경
  if (override.background) {
    if (typeof override.background === 'string') {
      style.backgroundColor = override.background
    } else if ('type' in override.background && 'stops' in override.background) {
      // GradientValue 형식인 경우
      style.background = gradientToCSS(override.background)
    } else if ('color' in override.background) {
      // { color: string } 형식인 경우
      style.backgroundColor = override.background.color
    }
  }

  // 패딩
  if (override.padding !== undefined) {
    if (typeof override.padding === 'number') {
      style.padding = `${override.padding}px`
    } else {
      style.paddingTop = override.padding.top ? `${override.padding.top}px` : undefined
      style.paddingRight = override.padding.right ? `${override.padding.right}px` : undefined
      style.paddingBottom = override.padding.bottom ? `${override.padding.bottom}px` : undefined
      style.paddingLeft = override.padding.left ? `${override.padding.left}px` : undefined
    }
  }

  return style
}

/**
 * GradientValue를 CSS 문자열로 변환
 */
function gradientToCSS(gradient: GradientValue): string {
  const stops = gradient.stops
    .map(s => `${s.color} ${s.position}%`)
    .join(', ')

  if (gradient.type === 'linear') {
    return `linear-gradient(${gradient.angle ?? 180}deg, ${stops})`
  } else if (gradient.type === 'radial') {
    const shape = gradient.shape ?? 'circle'
    const position = gradient.position ?? 'center'
    return `radial-gradient(${shape} at ${position}, ${stops})`
  } else {
    return `conic-gradient(from ${gradient.angle ?? 0}deg, ${stops})`
  }
}

/**
 * 블록 타입 한글 라벨
 */
function getBlockTypeLabel(type: BlockType): string {
  const labels: Record<BlockType, string> = {
    hero: '메인 커버',
    loading: '로딩',
    greeting: '인사말',
    calendar: '캘린더',
    gallery: '갤러리',
    location: '오시는 길',
    parents: '혼주 소개',
    contact: '연락처',
    account: '축의금',
    message: '방명록',
    rsvp: '참석 여부',
    quote: '글귀',
    profile: '프로필',
    'parents-contact': '혼주 연락처',
    timeline: '타임라인',
    video: '영상',
    interview: '인터뷰',
    transport: '교통 안내',
    notice: '안내사항',
    announcement: '안내문',
    'flower-gift': '화환',
    'together-time': '함께한 시간',
    dday: 'D-DAY',
    'guest-snap': '게스트스냅',
    ending: '엔딩',
    music: '음악',
    custom: '커스텀',
  }
  return labels[type] ?? type
}

// ============================================
// Exports
// ============================================

export { BlockRenderer as default }

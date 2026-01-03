'use client'

/**
 * Auto Layout Block Renderer
 *
 * Flexbox 기반 Auto Layout 블록 렌더링
 * - 요소들이 direction에 따라 자동 배치
 * - absolute 요소와 auto 요소 분리 렌더링
 * - hug/fill 크기 모드 지원
 */

import { useMemo, type CSSProperties } from 'react'
import type { Block, BlockLayout, Element, ButtonProps } from '../schema/types'
import { useBlockTokens } from '../context/block-context'
import { useDocument } from '../context/document-context'
import { ElementRenderer } from './element-renderer'
import { AutoLayoutElement } from './auto-layout-element'
import { resolveBlockHeightStyle } from '../utils/size-resolver'
import { NoticeSwiper } from '../components/blocks/notice-swiper'
import { AccountTabView } from '../components/blocks/account-tab-view'
import { InterviewAccordion } from '../components/blocks/interview-accordion'
import { resolveBinding } from '../utils/binding-resolver'

// ============================================
// Types
// ============================================

export interface AutoLayoutBlockProps {
  block: Block
  editable?: boolean
  onElementClick?: (elementId: string) => void
}

// ============================================
// Main Component
// ============================================

export function AutoLayoutBlock({
  block,
  editable = false,
  onElementClick,
}: AutoLayoutBlockProps) {
  const tokens = useBlockTokens()
  const { viewport, data } = useDocument()
  const layout = block.layout!

  // 갤러리 이미지 수 확인 (gallery 블록에서 더보기 버튼 노출 조건용)
  const galleryImageCount = useMemo(() => {
    if (block.type !== 'gallery') return 0
    const images = resolveBinding(data, 'photos.gallery')
    return Array.isArray(images) ? images.length : 0
  }, [block.type, data])

  // 갤러리 설정 확인 (elements에서 gallery config 추출)
  const galleryConfig = useMemo(() => {
    if (block.type !== 'gallery') return { columns: 3, initialRows: 3 }
    const galleryElement = block.elements?.find(el => el.binding === 'photos.gallery')
    // @ts-expect-error - gallery는 확장 props
    const config = galleryElement?.props?.gallery as { columns?: number; initialRows?: number } | undefined
    return {
      columns: config?.columns ?? 3,
      initialRows: config?.initialRows ?? 3,
    }
  }, [block.type, block.elements])

  // absolute 요소와 auto 요소 분리
  const { absoluteElements, autoElements } = useMemo(() => {
    const absolute: Element[] = []
    const auto: Element[] = []

    for (const element of block.elements ?? []) {
      if (element.layoutMode === 'absolute') {
        absolute.push(element)
      } else {
        // layoutMode가 없거나 'auto'인 경우 auto로 취급
        auto.push(element)
      }
    }

    return { absoluteElements: absolute, autoElements: auto }
  }, [block.elements])

  // 더보기 버튼 노출 조건: 초기 표시 개수(columns * initialRows) 초과 시 표시
  const shouldShowMoreButton = useMemo(() => {
    if (block.type !== 'gallery') return true
    const initialCount = galleryConfig.columns * galleryConfig.initialRows
    return galleryImageCount > initialCount
  }, [block.type, galleryConfig, galleryImageCount])

  // 필터링된 auto 요소 (더보기 버튼 조건 적용)
  const filteredAutoElements = useMemo(() => {
    if (block.type !== 'gallery' || shouldShowMoreButton) {
      return autoElements
    }
    // 더보기 버튼(action: 'show-block')을 숨김
    return autoElements.filter(el => {
      if (el.type === 'button' || el.props?.type === 'button') {
        const buttonProps = el.props as ButtonProps | undefined
        if (buttonProps?.action === 'show-block') {
          return false
        }
      }
      return true
    })
  }, [block.type, autoElements, shouldShowMoreButton])

  // 컨테이너 스타일 계산
  const containerStyle = useMemo<CSSProperties>(() => {
    const style: CSSProperties = {
      // Flexbox 레이아웃
      display: 'flex',
      flexDirection: layout.direction === 'horizontal' ? 'row' : 'column',
      gap: layout.gap ? `${layout.gap}px` : undefined,
      alignItems: mapAlignItems(layout.alignItems),
      justifyContent: mapJustifyContent(layout.justifyContent),
      flexWrap: layout.wrap ? 'wrap' : 'nowrap',

      // 패딩
      paddingTop: layout.padding?.top,
      paddingRight: layout.padding?.right,
      paddingBottom: layout.padding?.bottom,
      paddingLeft: layout.padding?.left,

      // 블록 높이
      ...resolveBlockHeightStyle(block.height),

      // 기본 스타일
      position: 'relative',
      width: '100%',
      overflow: 'hidden',

      // 토큰 기반 스타일
      backgroundColor: tokens.bgSection,
      color: tokens.fgDefault,
    }

    // 개발 모드: 디자인 토큰 전체 출력
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AutoLayoutBlock] ${block.type}`, { tokens, blockStyle: block.style })
    }

    return style
  }, [layout, block.height, tokens, viewport])

  return (
    <div
      className="se2-block se2-block--auto-layout"
      data-block-id={block.id}
      data-block-type={block.type}
      data-layout-mode="auto"
      style={containerStyle}
    >
      {/* Absolute 요소 (배경, 장식 등) */}
      {absoluteElements.map(element => (
        <ElementRenderer
          key={element.id}
          element={element}
          editable={editable}
          onClick={onElementClick}
        />
      ))}

      {/* Auto Layout 요소 (콘텐츠) */}
      {filteredAutoElements.map(element => (
        <AutoLayoutElement
          key={element.id}
          element={element}
          editable={editable}
          onClick={onElementClick}
        />
      ))}

      {/* Notice Swiper (notice 블록의 card-icon 변형) */}
      {block.type === 'notice' && <NoticeSwiper />}

      {/* Account Tab View (account 블록의 tab-card 변형) */}
      {block.type === 'account' && <AccountTabView />}

      {/* Interview Accordion (interview 블록) */}
      {block.type === 'interview' && <InterviewAccordion />}
    </div>
  )
}

// ============================================
// Utility Functions
// ============================================

/**
 * alignItems 값을 CSS flexbox 값으로 변환
 */
function mapAlignItems(
  value: BlockLayout['alignItems']
): CSSProperties['alignItems'] {
  switch (value) {
    case 'start':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'end':
      return 'flex-end'
    case 'stretch':
      return 'stretch'
    default:
      return 'stretch'
  }
}

/**
 * justifyContent 값을 CSS flexbox 값으로 변환
 */
function mapJustifyContent(
  value: BlockLayout['justifyContent']
): CSSProperties['justifyContent'] {
  switch (value) {
    case 'start':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'end':
      return 'flex-end'
    case 'space-between':
      return 'space-between'
    case 'space-around':
      return 'space-around'
    default:
      return 'flex-start'
  }
}

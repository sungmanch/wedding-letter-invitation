'use client'

/**
 * Super Editor v2 - Editable Canvas
 *
 * 직접 편집 모드의 캔버스
 * - 블록 기반 레이아웃 (세로 스크롤)
 * - 각 블록 내에서 요소 드래그/리사이즈/회전
 * - 요소 선택 및 컨텍스트 메뉴
 * - ID 배지 표시
 */

import {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
} from 'react'
import type { EditorDocument, Block, Element, TextProps } from '../../../schema/types'
import { useDocumentStyle } from '../../../context/document-context'
import { DraggableElement, type Position } from './draggable-element'
import { ResizeHandles, type Size } from './resize-handles'
import { RotateHandle } from './rotate-handle'
import { ContextMenu, useContextMenu, createElementMenuItems } from './context-menu'
import { SelectionOverlay } from './selection-overlay'
import {
  getDisplayId,
  copyIdToClipboard,
  pxToPercent,
} from '../../../utils/element-id'

// ============================================
// Types
// ============================================

export interface ContextMenuState {
  element: Element
  block: Block
  position: { x: number; y: number }
}

export interface EditableCanvasProps {
  /** 문서 데이터 */
  document: EditorDocument
  /** 선택된 블록 ID */
  selectedBlockId: string | null
  /** 선택된 요소 ID */
  selectedElementId: string | null
  /** 요소 선택 콜백 */
  onElementSelect: (elementId: string | null, blockId?: string) => void
  /** 요소 업데이트 콜백 */
  onElementUpdate: (blockId: string, elementId: string, updates: Partial<Element>) => void
  /** 요소 삭제 콜백 */
  onElementDelete?: (blockId: string, elementId: string) => void
  /** 요소 복제 콜백 */
  onElementDuplicate?: (blockId: string, elementId: string) => void
  /** 블록 높이 변경 콜백 */
  onBlockHeightChange?: (blockId: string, height: number) => void
  /** 컨텍스트 메뉴 콜백 (외부 처리용) */
  onContextMenu?: (context: ContextMenuState) => void
  /** 캔버스 너비 */
  canvasWidth?: number
  /** 캔버스 높이 (뷰포트 높이, 블록 높이 계산용) */
  canvasHeight?: number
  /** 그리드 스냅 (px) */
  gridSnap?: number
  /** ID 배지 표시 */
  showIdBadge?: boolean
  /** 요소 렌더러 */
  renderElement?: (element: Element, block: Block) => ReactNode
  /** 스크롤 비활성화 (외부 스크롤 컨테이너 사용 시) */
  disableScroll?: boolean
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

export function EditableCanvas({
  document,
  selectedBlockId,
  selectedElementId,
  onElementSelect,
  onElementUpdate,
  onElementDelete,
  onElementDuplicate,
  onBlockHeightChange,
  onContextMenu: externalContextMenu,
  canvasWidth = 375,
  canvasHeight = 667,
  gridSnap,
  showIdBadge = true,
  renderElement,
  disableScroll = false,
  className = '',
}: EditableCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const style = useDocumentStyle()
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null)
  const [clipboard, setClipboard] = useState<Element | null>(null)

  // 컨텍스트 메뉴 상태
  const { isOpen, position, open, close } = useContextMenu()
  const [menuContext, setMenuContext] = useState<ContextMenuState | null>(null)

  // 선택된 요소 찾기
  const selectedElement = useMemo(() => {
    if (!selectedElementId) return null
    for (const block of document.blocks) {
      const element = block.elements?.find(el => el.id === selectedElementId)
      if (element) return { element, block }
    }
    return null
  }, [document.blocks, selectedElementId])

  // 캔버스 클릭 (선택 해제)
  const handleCanvasClick = useCallback(() => {
    onElementSelect(null)
  }, [onElementSelect])

  // 요소 위치 변경 (블록 높이 기준)
  const handlePositionChange = useCallback((
    blockId: string,
    elementId: string,
    newPosition: Position,
    blockHeightPx: number
  ) => {
    // px를 퍼센트로 변환 (블록 높이 기준)
    const x = pxToPercent(newPosition.x, canvasWidth)
    const y = pxToPercent(newPosition.y, blockHeightPx)

    onElementUpdate(blockId, elementId, { x, y })
  }, [canvasWidth, onElementUpdate])

  // 요소 크기 변경 (블록 높이 기준)
  const handleSizeChange = useCallback((
    blockId: string,
    elementId: string,
    newSize: Size,
    newPosition: Position,
    blockHeightPx: number
  ) => {
    const x = pxToPercent(newPosition.x, canvasWidth)
    const y = pxToPercent(newPosition.y, blockHeightPx)
    const width = pxToPercent(newSize.width, canvasWidth)
    const height = pxToPercent(newSize.height, blockHeightPx)

    onElementUpdate(blockId, elementId, { x, y, width, height })
  }, [canvasWidth, onElementUpdate])

  // 요소 회전 변경
  const handleRotationChange = useCallback((
    blockId: string,
    elementId: string,
    rotation: number
  ) => {
    onElementUpdate(blockId, elementId, { rotation })
  }, [onElementUpdate])

  // 컨텍스트 메뉴 열기
  const handleContextMenu = useCallback((
    e: React.MouseEvent,
    element: Element,
    block: Block
  ) => {
    const context: ContextMenuState = {
      element,
      block,
      position: { x: e.clientX, y: e.clientY },
    }

    setMenuContext(context)
    open(e)
    onElementSelect(element.id, block.id)

    // 외부 콜백 호출
    externalContextMenu?.(context)
  }, [open, onElementSelect, externalContextMenu])

  // ID 복사
  const handleCopyId = useCallback(async () => {
    if (!menuContext) return

    const displayId = getDisplayId(menuContext.element, menuContext.block)
    const success = await copyIdToClipboard(displayId)

    if (success) {
      console.log(`#${displayId} 복사됨`)
    }

    close()
  }, [menuContext, close])

  // 요소 복사
  const handleCopy = useCallback(() => {
    if (menuContext) {
      setClipboard({ ...menuContext.element })
    }
    close()
  }, [menuContext, close])

  // 요소 붙여넣기
  const handlePaste = useCallback(() => {
    if (!clipboard || !selectedBlockId) return
    console.log('Paste element:', clipboard)
    close()
  }, [clipboard, selectedBlockId, close])

  // 요소 삭제
  const handleDelete = useCallback(() => {
    if (!menuContext || !onElementDelete) return
    onElementDelete(menuContext.block.id, menuContext.element.id)
    close()
  }, [menuContext, onElementDelete, close])

  // 요소 복제
  const handleDuplicate = useCallback(() => {
    if (!menuContext || !onElementDuplicate) return
    onElementDuplicate(menuContext.block.id, menuContext.element.id)
    close()
  }, [menuContext, onElementDuplicate, close])

  // 순서 변경
  const handleBringToFront = useCallback(() => {
    if (!menuContext) return
    const maxZ = Math.max(
      ...menuContext.block.elements?.map(el => el.zIndex || 0) || [0]
    )
    onElementUpdate(menuContext.block.id, menuContext.element.id, { zIndex: maxZ + 1 })
    close()
  }, [menuContext, onElementUpdate, close])

  const handleSendToBack = useCallback(() => {
    if (!menuContext) return
    const minZ = Math.min(
      ...menuContext.block.elements?.map(el => el.zIndex || 0) || [0]
    )
    onElementUpdate(menuContext.block.id, menuContext.element.id, { zIndex: minZ - 1 })
    close()
  }, [menuContext, onElementUpdate, close])

  // 컨텍스트 메뉴 아이템
  const menuItems = useMemo(() => {
    if (!menuContext) return []

    const displayId = getDisplayId(menuContext.element, menuContext.block)

    return [
      {
        id: 'copy-id',
        label: `ID 복사 (#${displayId})`,
        icon: <HashIcon className="w-4 h-4" />,
        shortcut: '⌘⇧C',
        onClick: handleCopyId,
      },
      { id: 'divider-id', label: '', divider: true },
      ...createElementMenuItems({
        onCopy: handleCopy,
        onPaste: handlePaste,
        onDuplicate: handleDuplicate,
        onDelete: handleDelete,
        onBringToFront: handleBringToFront,
        onSendToBack: handleSendToBack,
        canPaste: !!clipboard,
      }),
    ]
  }, [
    menuContext,
    clipboard,
    handleCopyId,
    handleCopy,
    handlePaste,
    handleDuplicate,
    handleDelete,
    handleBringToFront,
    handleSendToBack,
  ])

  return (
    <div
      ref={canvasRef}
      className={`relative ${disableScroll ? '' : 'overflow-y-auto overflow-x-hidden'} ${className}`}
      style={{
        width: canvasWidth,
        height: disableScroll ? 'auto' : '100%',
        backgroundColor: style.tokens.bgPage,
        color: style.tokens.fgDefault,
      }}
      onClick={handleCanvasClick}
    >
      {/* 블록 기반 레이아웃: 세로로 쌓임 */}
      {document.blocks.map(block => {
        if (!block.enabled) return null

        // 블록 높이 계산 (vh 기준 -> px)
        const blockHeightPx = (block.height / 100) * canvasHeight

        // 블록별 스타일 오버라이드 가져오기
        const blockTokens = style.blockOverrides.get(block.id) ?? style.tokens

        return (
          <div
            key={block.id}
            className={`
              block-layer relative
              ${block.id === selectedBlockId ? 'ring-2 ring-[#C9A962]/50 ring-inset' : ''}
            `}
            style={{
              width: '100%',
              minHeight: blockHeightPx,
              position: 'relative',
              overflow: 'hidden', // 블록 밖으로 넘치는 요소 잘라냄
              backgroundColor: blockTokens.bgSection,
              color: blockTokens.fgDefault,
            }}
            data-block-id={block.id}
          >
            {block.elements?.map(element => {
              const isSelected = element.id === selectedElementId
              const isHovered = element.id === hoveredElementId
              const displayId = getDisplayId(element, block)

              // 퍼센트를 px로 변환 (블록 높이 기준)
              const posX = (element.x || 0) / 100 * canvasWidth
              const posY = (element.y || 0) / 100 * blockHeightPx
              const width = (element.width || 10) / 100 * canvasWidth
              const height = (element.height || 10) / 100 * blockHeightPx

              return (
                <DraggableElement
                  key={element.id}
                  elementId={element.id}
                  position={{ x: posX, y: posY }}
                  onPositionChange={(_id, pos) => handlePositionChange(block.id, element.id, pos, blockHeightPx)}
                  onSelect={() => onElementSelect(element.id, block.id)}
                  isSelected={isSelected}
                  gridSnap={gridSnap}
                  disabled={element.style?.opacity === 0}
                >
                  <div
                    className="relative"
                    style={{
                      width,
                      height,
                      transform: `rotate(${element.rotation || 0}deg)`,
                      zIndex: element.zIndex || 0,
                    }}
                    onMouseEnter={() => setHoveredElementId(element.id)}
                    onMouseLeave={() => setHoveredElementId(null)}
                    onContextMenu={(e) => handleContextMenu(e, element, block)}
                  >
                    {/* 요소 콘텐츠 */}
                    {renderElement ? (
                      renderElement(element, block)
                    ) : (
                      <DefaultElementRenderer element={element} />
                    )}

                    {/* ID 배지 (호버 시) */}
                    {showIdBadge && (isHovered || isSelected) && (
                      <div
                        className="
                          absolute -top-6 left-0 px-1.5 py-0.5
                          bg-[#2a2a2a]/90 border border-white/10 rounded
                          text-xs text-[#C9A962] font-mono
                          whitespace-nowrap pointer-events-none
                        "
                      >
                        #{displayId}
                      </div>
                    )}

                    {/* 선택 시 핸들 표시 */}
                    {isSelected && (
                      <>
                        <ResizeHandles
                          size={{ width, height }}
                          position={{ x: 0, y: 0 }}
                          onSizeChange={(size, pos) =>
                            handleSizeChange(block.id, element.id, size, {
                              x: posX + pos.x,
                              y: posY + pos.y,
                            }, blockHeightPx)
                          }
                          keepAspectRatio={element.type === 'image'}
                        />
                        <RotateHandle
                          rotation={element.rotation || 0}
                          onRotationChange={(r) =>
                            handleRotationChange(block.id, element.id, r)
                          }
                          center={{ x: width / 2, y: height / 2 }}
                        />
                      </>
                    )}
                  </div>
                </DraggableElement>
              )
            })}

            {/* 블록 높이 조절 핸들 */}
            {onBlockHeightChange && (
              <BlockResizeHandle
                blockId={block.id}
                blockHeight={block.height}
                canvasHeight={canvasHeight}
                onHeightChange={onBlockHeightChange}
              />
            )}

            {/* 블록 구분선 (편집 모드 시각적 피드백) */}
            {!onBlockHeightChange && (
              <div
                className="absolute bottom-0 left-0 right-0 h-px bg-[#C9A962]/20 pointer-events-none"
              />
            )}
          </div>
        )
      })}

      {/* 컨텍스트 메뉴 */}
      <ContextMenu
        items={menuItems}
        isOpen={isOpen}
        position={position}
        onClose={close}
      />
    </div>
  )
}

// ============================================
// Default Element Renderer
// ============================================

interface DefaultElementRendererProps {
  element: Element
}

function DefaultElementRenderer({ element }: DefaultElementRendererProps) {
  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const textStyle = element.style?.text

  switch (element.type) {
    case 'text': {
      const textProps = element.props as TextProps
      return (
        <div
          style={{
            ...baseStyle,
            fontSize: textStyle?.fontSize || 16,
            fontFamily: textStyle?.fontFamily,
            color: textStyle?.color || '#000',
            textAlign: textStyle?.textAlign || 'center',
          }}
        >
          {String(element.value || textProps?.format || element.binding || 'Text')}
        </div>
      )
    }

    case 'image':
      return element.value ? (
        <img
          src={String(element.value)}
          alt=""
          style={{ ...baseStyle, objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            ...baseStyle,
            backgroundColor: '#f0f0f0',
            border: '1px dashed #ccc',
          }}
        >
          <ImagePlaceholder className="w-8 h-8 text-gray-400" />
        </div>
      )

    case 'shape': {
      const bgValue = element.style?.background
      const bgColor = typeof bgValue === 'string' ? bgValue : '#e0e0e0'
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: bgColor,
            borderRadius: element.style?.border?.radius || 0,
          }}
        />
      )
    }

    case 'divider':
      return (
        <div
          style={{
            width: '100%',
            height: 1,
            backgroundColor: textStyle?.color || '#ccc',
          }}
        />
      )

    default:
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: '#f5f5f5',
            border: '1px dashed #ccc',
            fontSize: 12,
            color: '#666',
          }}
        >
          {element.type}
        </div>
      )
  }
}

// ============================================
// Block Resize Handle
// ============================================

interface BlockResizeHandleProps {
  blockId: string
  blockHeight: number // vh 단위
  canvasHeight: number // px
  onHeightChange: (blockId: string, height: number) => void
}

function BlockResizeHandle({
  blockId,
  blockHeight,
  canvasHeight,
  onHeightChange,
}: BlockResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)
  const startHeightRef = useRef(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    startYRef.current = e.clientY
    startHeightRef.current = blockHeight
  }, [blockHeight])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startYRef.current
      // px를 vh로 변환
      const deltaVh = (deltaY / canvasHeight) * 100
      const newHeight = Math.max(10, startHeightRef.current + deltaVh) // 최소 10vh
      onHeightChange(blockId, Math.round(newHeight))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, blockId, canvasHeight, onHeightChange])

  return (
    <div
      className={`
        absolute bottom-0 left-0 right-0 h-4
        flex items-center justify-center
        cursor-ns-resize group z-50
        ${isDragging ? 'bg-[#C9A962]/20' : 'hover:bg-[#C9A962]/10'}
      `}
      onMouseDown={handleMouseDown}
    >
      {/* 핸들 라인 */}
      <div
        className={`
          w-12 h-1 rounded-full transition-colors
          ${isDragging ? 'bg-[#C9A962]' : 'bg-[#C9A962]/40 group-hover:bg-[#C9A962]/60'}
        `}
      />
      {/* 높이 표시 (드래그 중) */}
      {isDragging && (
        <div
          className="absolute right-2 bottom-full mb-1 px-2 py-0.5 rounded bg-[#2a2a2a] text-[#C9A962] text-xs font-mono"
        >
          {blockHeight}vh
        </div>
      )}
    </div>
  )
}

// ============================================
// Icons
// ============================================

function HashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
      />
    </svg>
  )
}

function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  )
}

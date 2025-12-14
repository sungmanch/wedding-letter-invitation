'use client'

/**
 * Super Editor v2 - Editable Canvas
 *
 * 직접 편집 모드의 캔버스
 * - 블록별 요소 렌더링
 * - DraggableElement로 드래그/리사이즈/회전 지원
 * - 요소 선택 및 컨텍스트 메뉴
 * - ID 배지 표시
 */

import {
  useCallback,
  useState,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import type { EditorDocument, Block, Element, TextProps } from '../../../schema/types'
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
  /** 컨텍스트 메뉴 콜백 (외부 처리용) */
  onContextMenu?: (context: ContextMenuState) => void
  /** 캔버스 너비 */
  canvasWidth?: number
  /** 캔버스 높이 */
  canvasHeight?: number
  /** 그리드 스냅 (px) */
  gridSnap?: number
  /** ID 배지 표시 */
  showIdBadge?: boolean
  /** 요소 렌더러 */
  renderElement?: (element: Element, block: Block) => ReactNode
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
  onContextMenu: externalContextMenu,
  canvasWidth = 375,
  canvasHeight = 667,
  gridSnap,
  showIdBadge = true,
  renderElement,
  className = '',
}: EditableCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
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

  // 요소 위치 변경
  const handlePositionChange = useCallback((
    blockId: string,
    elementId: string,
    newPosition: Position
  ) => {
    // px를 퍼센트로 변환
    const x = pxToPercent(newPosition.x, canvasWidth)
    const y = pxToPercent(newPosition.y, canvasHeight)

    onElementUpdate(blockId, elementId, { x, y })
  }, [canvasWidth, canvasHeight, onElementUpdate])

  // 요소 크기 변경
  const handleSizeChange = useCallback((
    blockId: string,
    elementId: string,
    newSize: Size,
    newPosition: Position
  ) => {
    const x = pxToPercent(newPosition.x, canvasWidth)
    const y = pxToPercent(newPosition.y, canvasHeight)
    const width = pxToPercent(newSize.width, canvasWidth)
    const height = pxToPercent(newSize.height, canvasHeight)

    onElementUpdate(blockId, elementId, { x, y, width, height })
  }, [canvasWidth, canvasHeight, onElementUpdate])

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
      // toast 사용 시 여기서 호출
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

    // 복제 콜백 사용 또는 직접 처리
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
    // zIndex를 최대값으로 설정
    const maxZ = Math.max(
      ...menuContext.block.elements?.map(el => el.zIndex || 0) || [0]
    )
    onElementUpdate(menuContext.block.id, menuContext.element.id, { zIndex: maxZ + 1 })
    close()
  }, [menuContext, onElementUpdate, close])

  const handleSendToBack = useCallback(() => {
    if (!menuContext) return
    // zIndex를 최소값으로 설정
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
      // ID 복사 (상단에 추가)
      {
        id: 'copy-id',
        label: `ID 복사 (#${displayId})`,
        icon: <HashIcon className="w-4 h-4" />,
        shortcut: '⌘⇧C',
        onClick: handleCopyId,
      },
      { id: 'divider-id', label: '', divider: true },
      // 기본 메뉴
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
      className={`relative bg-white overflow-hidden ${className}`}
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
      onClick={handleCanvasClick}
    >
      {/* 블록별 요소 렌더링 */}
      {document.blocks.map(block => {
        if (!block.enabled) return null

        return (
          <div
            key={block.id}
            className={`
              block-layer relative
              ${block.id === selectedBlockId ? 'ring-1 ring-[#C9A962]/30' : ''}
            `}
            data-block-id={block.id}
          >
            {block.elements?.map(element => {
              const isSelected = element.id === selectedElementId
              const isHovered = element.id === hoveredElementId
              const displayId = getDisplayId(element, block)

              // 퍼센트를 px로 변환
              const posX = (element.x || 0) / 100 * canvasWidth
              const posY = (element.y || 0) / 100 * canvasHeight
              const width = (element.width || 10) / 100 * canvasWidth
              const height = (element.height || 10) / 100 * canvasHeight

              return (
                <DraggableElement
                  key={element.id}
                  elementId={element.id}
                  position={{ x: posX, y: posY }}
                  onPositionChange={(_id, pos) => handlePositionChange(block.id, element.id, pos)}
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
                            })
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

  // 텍스트 스타일 추출
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

'use client'

import { useEffect } from 'react'
import type { PrimitiveNode, OverlayProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, mergeNodeStyles } from '../types'
import { X } from 'lucide-react'

// 확장된 노드 타입 (tokenStyle 포함)
interface ExtendedNode extends PrimitiveNode {
  tokenStyle?: Record<string, unknown>
}

const positionStyles: Record<
  NonNullable<OverlayProps['position']>,
  React.CSSProperties
> = {
  center: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  top: {
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  bottom: {
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  left: {
    top: '50%',
    left: 0,
    transform: 'translateY(-50%)',
  },
  right: {
    top: '50%',
    right: 0,
    transform: 'translateY(-50%)',
  },
  custom: {},
}

export function Overlay({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const extNode = node as ExtendedNode
  const props = getNodeProps<OverlayProps>(node)
  const mergedStyle = mergeNodeStyles(extNode, context)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id
  const position = props.position || 'center'

  // 모달 모드 체크 (visible prop이 있으면 모달로 동작)
  const isModal = props.visible !== undefined

  // 모달 표시 여부 결정
  const isVisible = isModal
    ? (context.openedModals?.has(node.id) || props.visible === true)
    : true

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isModal || !isVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && context.closeModal) {
        context.closeModal(node.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModal, isVisible, node.id, context])

  // 편집 모드에서는 항상 표시 (but 축소된 형태)
  if (context.mode === 'edit' && isModal && !isVisible) {
    return (
      <div
        data-node-id={node.id}
        data-node-type="overlay"
        style={{
          padding: '8px 12px',
          backgroundColor: '#f3f4f6',
          border: '1px dashed #9ca3af',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#6b7280',
          cursor: 'pointer',
          outline: isSelected ? '2px solid #3b82f6' : undefined,
        }}
        onClick={(e) => {
          e.stopPropagation()
          context.onSelectNode?.(node.id)
        }}
      >
        🔲 모달: {props.title || node.id}
      </div>
    )
  }

  // 모달이 닫혀있으면 렌더링하지 않음
  if (isModal && !isVisible) {
    return null
  }

  const insetStyle =
    props.inset !== undefined
      ? typeof props.inset === 'number'
        ? { inset: `${props.inset}px` }
        : { inset: props.inset }
      : {}

  // 일반 오버레이 스타일
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 10,
    ...positionStyles[position],
    ...insetStyle,
    ...mergedStyle,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // 일반 오버레이 (모달이 아닌 경우)
  if (!isModal) {
    return (
      <div
        data-node-id={node.id}
        data-node-type="overlay"
        style={overlayStyle}
        onClick={
          context.mode === 'edit'
            ? (e) => {
                e.stopPropagation()
                context.onSelectNode?.(node.id)
              }
            : undefined
        }
      >
        {node.children?.map((child) => context.renderNode(child))}
      </div>
    )
  }

  // 모달 스타일
  const handleBackdropClick = () => {
    if (context.closeModal) {
      context.closeModal(node.id)
    }
  }

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (context.closeModal) {
      context.closeModal(node.id)
    }
  }

  return (
    <>
      {/* 배경 딤 */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 100,
        }}
        onClick={context.mode !== 'edit' ? handleBackdropClick : undefined}
      />

      {/* 모달 컨테이너 */}
      <div
        data-node-id={node.id}
        data-node-type="overlay"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 101,
          width: '90%',
          maxWidth: '400px',
          maxHeight: '80vh',
          backgroundColor: 'var(--color-background, #fff)',
          borderRadius: 'var(--radius-lg, 16px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          outline: isSelected ? '2px solid #3b82f6' : undefined,
          ...mergedStyle,
        }}
        onClick={
          context.mode === 'edit'
            ? (e) => {
                e.stopPropagation()
                context.onSelectNode?.(node.id)
              }
            : undefined
        }
      >
        {/* 모달 헤더 */}
        {(props.title || props.showClose) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid var(--color-border, #e5e7eb)',
            }}
          >
            {props.title && (
              <h3
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary, #1f2937)',
                }}
              >
                {props.title}
              </h3>
            )}
            {props.showClose && (
              <button
                onClick={handleCloseClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  padding: 0,
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted, #9ca3af)',
                  transition: 'background-color 150ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface, #f3f4f6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* 모달 콘텐츠 */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {node.children?.map((child) => context.renderNode(child))}
        </div>
      </div>
    </>
  )
}

export const overlayRenderer: PrimitiveRenderer<OverlayProps> = {
  type: 'overlay',
  render: (node, context) => (
    <Overlay key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'position',
      label: '위치',
      type: 'select',
      options: [
        { value: 'center', label: '중앙' },
        { value: 'top', label: '상단' },
        { value: 'bottom', label: '하단' },
        { value: 'left', label: '좌측' },
        { value: 'right', label: '우측' },
        { value: 'custom', label: '커스텀' },
      ],
      defaultValue: 'center',
    },
    {
      key: 'inset',
      label: '여백',
      type: 'spacing',
    },
    {
      key: 'title',
      label: '모달 제목',
      type: 'text',
    },
    {
      key: 'showClose',
      label: '닫기 버튼',
      type: 'boolean',
      defaultValue: true,
    },
  ],
}

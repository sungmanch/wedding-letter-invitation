'use client'

import { useState, useMemo } from 'react'
import type { PrimitiveNode, MasonryProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, getValueByPath } from '../types'

export function Masonry({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<MasonryProps>(node)
  const style = toInlineStyle(node.style)
  const [showLightbox, setShowLightbox] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 이미지 배열 해결 (useMemo로 참조 안정성 확보)
  const images = useMemo<string[]>(() => {
    if (typeof props.images === 'string') {
      if (props.images.startsWith('{{')) {
        const path = props.images.replace(/^\{\{|\}\}$/g, '').trim()
        const resolved = getValueByPath(context.data, path)
        if (Array.isArray(resolved)) {
          return resolved as string[]
        }
        return []
      }
      return [props.images]
    }
    if (Array.isArray(props.images)) {
      return props.images
    }
    return []
  }, [props.images, context.data])

  const columnCount = props.columns || 2
  const gap = props.gap || 8

  // 열별로 이미지 분배
  const columns = useMemo(() => {
    const cols: string[][] = Array.from({ length: columnCount }, () => [])
    images.forEach((src, index) => {
      cols[index % columnCount].push(src)
    })
    return cols
  }, [images, columnCount])

  const handleImageClick = (index: number) => {
    if (context.mode === 'edit') {
      context.onSelectNode?.(node.id)
      return
    }
    if (props.onClick === 'lightbox') {
      setLightboxIndex(index)
      setShowLightbox(true)
    }
  }

  // 원래 인덱스 계산
  const getOriginalIndex = (colIndex: number, rowIndex: number) => {
    return rowIndex * columnCount + colIndex
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${gap}px`,
    width: '100%',
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // 애니메이션 클래스
  const getAnimationStyle = (index: number): React.CSSProperties => {
    if (props.animation === 'none') return {}

    const delay = index * 100

    switch (props.animation) {
      case 'fade-in':
        return {
          animation: `fadeIn 0.5s ease-out ${delay}ms both`,
        }
      case 'slide-up':
        return {
          animation: `slideUp 0.5s ease-out ${delay}ms both`,
        }
      case 'scale-in':
        return {
          animation: `scaleIn 0.5s ease-out ${delay}ms both`,
        }
      default:
        return {}
    }
  }

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>

      <div
        data-node-id={node.id}
        data-node-type="masonry"
        style={containerStyle}
        onClick={
          context.mode === 'edit'
            ? (e) => {
                e.stopPropagation()
                context.onSelectNode?.(node.id)
              }
            : undefined
        }
      >
        {columns.map((column, colIndex) => (
          <div
            key={colIndex}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: `${gap}px`,
            }}
          >
            {column.map((src, rowIndex) => {
              const originalIndex = getOriginalIndex(colIndex, rowIndex)
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={rowIndex}
                  src={src}
                  alt={`이미지 ${originalIndex + 1}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: props.objectFit || 'cover',
                    borderRadius: '4px',
                    cursor: props.onClick !== 'none' ? 'pointer' : undefined,
                    ...getAnimationStyle(originalIndex),
                  }}
                  onClick={() => handleImageClick(originalIndex)}
                />
              )
            })}
          </div>
        ))}
      </div>

      {showLightbox && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowLightbox(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[lightboxIndex]}
            alt={`이미지 ${lightboxIndex + 1}`}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
            }}
          />
          <button
            onClick={() => setShowLightbox(false)}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}

export const masonryRenderer: PrimitiveRenderer<MasonryProps> = {
  type: 'masonry',
  render: (node, context) => (
    <Masonry key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'columns',
      label: '열 개수',
      type: 'select',
      options: [
        { value: '2', label: '2열' },
        { value: '3', label: '3열' },
        { value: '4', label: '4열' },
      ],
      defaultValue: '2',
    },
    {
      key: 'gap',
      label: '간격',
      type: 'number',
      defaultValue: 8,
    },
    {
      key: 'animation',
      label: '애니메이션',
      type: 'select',
      options: [
        { value: 'none', label: '없음' },
        { value: 'fade-in', label: '페이드 인' },
        { value: 'slide-up', label: '슬라이드 업' },
        { value: 'scale-in', label: '스케일 인' },
      ],
      defaultValue: 'fade-in',
    },
    {
      key: 'onClick',
      label: '클릭 동작',
      type: 'select',
      options: [
        { value: 'lightbox', label: '확대 보기' },
        { value: 'none', label: '없음' },
      ],
      defaultValue: 'lightbox',
    },
  ],
}

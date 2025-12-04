'use client'

import { useState } from 'react'
import type { PrimitiveNode, GridProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, getValueByPath } from '../types'

export function Grid({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<GridProps>(node)
  const style = toInlineStyle(node.style)
  const [showLightbox, setShowLightbox] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 이미지 배열 해결
  let images: string[] = []
  if (typeof props.images === 'string') {
    if (props.images.startsWith('{{')) {
      const path = props.images.replace(/^\{\{|\}\}$/g, '').trim()
      const resolved = getValueByPath(context.data, path)
      if (Array.isArray(resolved)) {
        images = resolved as string[]
      }
    } else {
      images = [props.images]
    }
  } else if (Array.isArray(props.images)) {
    images = props.images
  }

  const columns = props.columns === 'auto' ? 'auto-fill' : props.columns || 3
  const gap = props.gap || 4
  const pattern = props.pattern || 'uniform'

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

  const containerStyle: React.CSSProperties = {
    width: '100%',
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // Bento 레이아웃
  if (pattern === 'bento') {
    return (
      <>
        <div
          data-node-id={node.id}
          data-node-type="grid"
          style={{
            ...containerStyle,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoRows: '100px',
            gap: `${gap}px`,
          }}
        >
          {images.slice(0, 6).map((src, index) => {
            // Bento 패턴: 첫 번째는 2x2, 나머지는 1x1 또는 2x1
            const gridStyles: Record<number, React.CSSProperties> = {
              0: { gridColumn: 'span 2', gridRow: 'span 2' },
              1: { gridColumn: 'span 2', gridRow: 'span 1' },
              2: { gridColumn: 'span 1', gridRow: 'span 1' },
              3: { gridColumn: 'span 1', gridRow: 'span 1' },
              4: { gridColumn: 'span 2', gridRow: 'span 1' },
              5: { gridColumn: 'span 2', gridRow: 'span 1' },
            }

            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={src}
                alt={`이미지 ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: props.objectFit || 'cover',
                  borderRadius: '8px',
                  cursor: props.onClick !== 'none' ? 'pointer' : undefined,
                  ...gridStyles[index],
                }}
                onClick={() => handleImageClick(index)}
              />
            )
          })}
        </div>
        {showLightbox && <Lightbox />}
      </>
    )
  }

  // Featured First 패턴
  if (pattern === 'featured-first' && images.length > 1) {
    return (
      <>
        <div
          data-node-id={node.id}
          data-node-type="grid"
          style={{
            ...containerStyle,
            display: 'flex',
            flexDirection: 'column',
            gap: `${gap}px`,
          }}
        >
          {/* 첫 번째 이미지 - 크게 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt="메인 이미지"
            style={{
              width: '100%',
              aspectRatio: props.aspectRatio?.replace(':', '/') || '16/9',
              objectFit: props.objectFit || 'cover',
              borderRadius: '8px',
              cursor: props.onClick !== 'none' ? 'pointer' : undefined,
            }}
            onClick={() => handleImageClick(0)}
          />

          {/* 나머지 이미지 - 그리드 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns === 'auto-fill' ? 3 : columns}, 1fr)`,
              gap: `${gap}px`,
            }}
          >
            {images.slice(1).map((src, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index + 1}
                src={src}
                alt={`이미지 ${index + 2}`}
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  objectFit: props.objectFit || 'cover',
                  borderRadius: '4px',
                  cursor: props.onClick !== 'none' ? 'pointer' : undefined,
                }}
                onClick={() => handleImageClick(index + 1)}
              />
            ))}
          </div>
        </div>
        {showLightbox && <Lightbox />}
      </>
    )
  }

  // Uniform 그리드 (기본)
  return (
    <>
      <div
        data-node-id={node.id}
        data-node-type="grid"
        style={{
          ...containerStyle,
          display: 'grid',
          gridTemplateColumns:
            columns === 'auto-fill'
              ? 'repeat(auto-fill, minmax(100px, 1fr))'
              : `repeat(${columns}, 1fr)`,
          gridTemplateRows: props.rows ? `repeat(${props.rows}, 1fr)` : undefined,
          gap: `${gap}px`,
        }}
      >
        {images.map((src, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={index}
            src={src}
            alt={`이미지 ${index + 1}`}
            style={{
              width: '100%',
              aspectRatio: props.aspectRatio?.replace(':', '/') || '1/1',
              objectFit: props.objectFit || 'cover',
              borderRadius: '4px',
              cursor: props.onClick !== 'none' ? 'pointer' : undefined,
            }}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>
      {showLightbox && <Lightbox />}
    </>
  )

  function Lightbox() {
    return (
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
    )
  }
}

export const gridRenderer: PrimitiveRenderer<GridProps> = {
  type: 'grid',
  render: (node, context) => <Grid key={node.id} node={node} context={context} />,
  editableProps: [
    {
      key: 'columns',
      label: '열 개수',
      type: 'select',
      options: [
        { value: '2', label: '2열' },
        { value: '3', label: '3열' },
        { value: '4', label: '4열' },
        { value: 'auto', label: '자동' },
      ],
      defaultValue: '3',
    },
    {
      key: 'gap',
      label: '간격',
      type: 'number',
      defaultValue: 4,
    },
    {
      key: 'pattern',
      label: '패턴',
      type: 'select',
      options: [
        { value: 'uniform', label: '균일' },
        { value: 'featured-first', label: '첫번째 강조' },
        { value: 'bento', label: '벤토' },
      ],
      defaultValue: 'uniform',
    },
    {
      key: 'aspectRatio',
      label: '비율',
      type: 'select',
      options: [
        { value: '1:1', label: '1:1' },
        { value: '4:3', label: '4:3' },
        { value: '16:9', label: '16:9' },
      ],
      defaultValue: '1:1',
    },
  ],
}

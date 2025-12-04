'use client'

import { useState } from 'react'
import type { PrimitiveNode, GalleryProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, resolveDataBinding, getValueByPath } from '../types'

export function Gallery({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<GalleryProps>(node)
  const style = toInlineStyle(node.style)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 이미지 배열 해결
  let images: string[] = []
  if (typeof props.images === 'string') {
    // 데이터 바인딩
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

  const layout = props.layout || 'horizontal'
  const columns = props.columns || 3
  const gap = props.gap || 8

  const containerStyle: React.CSSProperties = {
    width: '100%',
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  const handleImageClick = (index: number) => {
    if (context.mode === 'edit') {
      context.onSelectNode?.(node.id)
      return
    }
    if (props.onClick === 'lightbox') {
      setCurrentIndex(index)
      setShowLightbox(true)
    }
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // 그리드 레이아웃
  if (layout === 'grid') {
    return (
      <>
        <div
          data-node-id={node.id}
          data-node-type="gallery"
          style={{
            ...containerStyle,
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gap}px`,
          }}
        >
          {images.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={src}
              alt={`갤러리 이미지 ${index + 1}`}
              style={{
                width: '100%',
                aspectRatio: props.aspectRatio?.replace(':', '/') || '1/1',
                objectFit: props.objectFit || 'cover',
                cursor: props.onClick !== 'none' ? 'pointer' : undefined,
                borderRadius: '4px',
              }}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
        {showLightbox && <Lightbox />}
      </>
    )
  }

  // 가로 스크롤 레이아웃
  if (layout === 'horizontal') {
    return (
      <>
        <div
          data-node-id={node.id}
          data-node-type="gallery"
          style={{
            ...containerStyle,
            display: 'flex',
            overflowX: 'auto',
            gap: `${gap}px`,
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {images.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={src}
              alt={`갤러리 이미지 ${index + 1}`}
              style={{
                flex: '0 0 auto',
                width: '80%',
                maxWidth: '300px',
                aspectRatio: props.aspectRatio?.replace(':', '/') || '4/3',
                objectFit: props.objectFit || 'cover',
                cursor: props.onClick !== 'none' ? 'pointer' : undefined,
                borderRadius: '8px',
                scrollSnapAlign: 'center',
              }}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
        {showLightbox && <Lightbox />}
      </>
    )
  }

  // 세로 스크롤 레이아웃
  return (
    <>
      <div
        data-node-id={node.id}
        data-node-type="gallery"
        style={{
          ...containerStyle,
          display: 'flex',
          flexDirection: 'column',
          gap: `${gap}px`,
        }}
      >
        {images.map((src, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={index}
            src={src}
            alt={`갤러리 이미지 ${index + 1}`}
            style={{
              width: '100%',
              aspectRatio: props.aspectRatio?.replace(':', '/') || '4/3',
              objectFit: props.objectFit || 'cover',
              cursor: props.onClick !== 'none' ? 'pointer' : undefined,
              borderRadius: '8px',
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
        {/* 이전 버튼 */}
        {props.showArrows !== false && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrev()
            }}
            style={{
              position: 'absolute',
              left: 16,
              padding: '12px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ‹
          </button>
        )}

        {/* 이미지 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[currentIndex]}
          alt={`갤러리 이미지 ${currentIndex + 1}`}
          style={{
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain',
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* 다음 버튼 */}
        {props.showArrows !== false && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            style={{
              position: 'absolute',
              right: 16,
              padding: '12px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ›
          </button>
        )}

        {/* 카운터 */}
        {props.showCounter !== false && (
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#fff',
              fontSize: '14px',
            }}
          >
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* 닫기 버튼 */}
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

export const galleryRenderer: PrimitiveRenderer<GalleryProps> = {
  type: 'gallery',
  render: (node, context) => (
    <Gallery key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'layout',
      label: '레이아웃',
      type: 'select',
      options: [
        { value: 'horizontal', label: '가로 스크롤' },
        { value: 'vertical', label: '세로 스택' },
        { value: 'grid', label: '그리드' },
      ],
      defaultValue: 'horizontal',
    },
    {
      key: 'columns',
      label: '열 개수',
      type: 'select',
      options: [
        { value: '2', label: '2열' },
        { value: '3', label: '3열' },
        { value: '4', label: '4열' },
      ],
      defaultValue: '3',
    },
    {
      key: 'gap',
      label: '간격',
      type: 'number',
      defaultValue: 8,
    },
    {
      key: 'aspectRatio',
      label: '비율',
      type: 'select',
      options: [
        { value: '1:1', label: '1:1' },
        { value: '4:3', label: '4:3' },
        { value: '16:9', label: '16:9' },
        { value: '3:4', label: '3:4' },
      ],
      defaultValue: '4:3',
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

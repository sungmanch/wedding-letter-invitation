'use client'

import { useState } from 'react'
import type { PrimitiveNode, ImageProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, resolveDataBinding } from '../types'

const aspectRatioMap: Record<string, string> = {
  '1:1': '100%',
  '4:3': '75%',
  '16:9': '56.25%',
  '3:4': '133.33%',
  '9:16': '177.78%',
  'auto': 'auto',
}

export function Image({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<ImageProps>(node)
  const style = toInlineStyle(node.style)
  const [showLightbox, setShowLightbox] = useState(false)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 데이터 바인딩 해결
  const src = resolveDataBinding(props.src || '', context.data) as string
  const alt = resolveDataBinding(props.alt || '', context.data) as string

  const aspectRatio = props.aspectRatio || 'auto'
  const paddingBottom = aspectRatioMap[aspectRatio] || 'auto'

  const handleClick = () => {
    if (context.mode === 'edit') {
      context.onSelectNode?.(node.id)
      return
    }

    if (props.onClick === 'lightbox') {
      setShowLightbox(true)
    } else if (props.onClick === 'link' && props.linkUrl) {
      window.open(props.linkUrl, '_blank')
    }
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    paddingBottom: aspectRatio !== 'auto' ? paddingBottom : undefined,
    overflow: 'hidden',
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  const imgStyle: React.CSSProperties = {
    ...(aspectRatio !== 'auto'
      ? {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }
      : { width: '100%' }),
    objectFit: props.objectFit || 'cover',
    cursor: props.onClick !== 'none' ? 'pointer' : undefined,
  }

  return (
    <>
      <div
        data-node-id={node.id}
        data-node-type="image"
        style={containerStyle}
        onClick={(e) => {
          e.stopPropagation()
          handleClick()
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={imgStyle}
          loading={props.loading || 'lazy'}
        />
      </div>

      {/* Lightbox Modal */}
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
            cursor: 'pointer',
          }}
          onClick={() => setShowLightbox(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </>
  )
}

export const imageRenderer: PrimitiveRenderer<ImageProps> = {
  type: 'image',
  render: (node, context) => (
    <Image key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'src',
      label: '이미지 URL',
      type: 'text',
    },
    {
      key: 'alt',
      label: '대체 텍스트',
      type: 'text',
    },
    {
      key: 'aspectRatio',
      label: '비율',
      type: 'select',
      options: [
        { value: 'auto', label: '자동' },
        { value: '1:1', label: '1:1 정사각형' },
        { value: '4:3', label: '4:3' },
        { value: '16:9', label: '16:9' },
        { value: '3:4', label: '3:4' },
        { value: '9:16', label: '9:16' },
      ],
      defaultValue: 'auto',
    },
    {
      key: 'objectFit',
      label: '맞춤',
      type: 'select',
      options: [
        { value: 'cover', label: '채우기' },
        { value: 'contain', label: '맞추기' },
        { value: 'fill', label: '늘리기' },
        { value: 'none', label: '없음' },
      ],
      defaultValue: 'cover',
    },
    {
      key: 'onClick',
      label: '클릭 동작',
      type: 'select',
      options: [
        { value: 'none', label: '없음' },
        { value: 'lightbox', label: '확대 보기' },
        { value: 'link', label: '링크 열기' },
      ],
      defaultValue: 'none',
    },
  ],
}

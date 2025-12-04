'use client'

import { useMemo } from 'react'
import type { PrimitiveNode, CollageProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, getValueByPath } from '../types'

// 시드 기반 랜덤 함수 (일관된 결과)
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function Collage({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<CollageProps>(node)
  const style = toInlineStyle(node.style)

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

  const template = props.template || 'polaroid'
  const rotationRange = props.rotationRange || 10

  // 이미지별 스타일 생성
  const imageStyles = useMemo(() => {
    return images.map((_, index) => {
      const seed = index + node.id.charCodeAt(0)
      const rotation = props.rotation
        ? (seededRandom(seed) - 0.5) * 2 * rotationRange
        : 0
      const offsetX = props.overlap ? (seededRandom(seed + 1) - 0.5) * 20 : 0
      const offsetY = props.overlap ? (seededRandom(seed + 2) - 0.5) * 20 : 0

      return {
        rotation,
        offsetX,
        offsetY,
        zIndex: index,
      }
    })
  }, [images, node.id, props.rotation, props.overlap, rotationRange])

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: '300px',
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // Polaroid 템플릿
  if (template === 'polaroid') {
    return (
      <div
        data-node-id={node.id}
        data-node-type="collage"
        style={{
          ...containerStyle,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: props.overlap ? '-30px' : '16px',
          padding: '20px',
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
        {images.map((src, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#fff',
              padding: '12px 12px 40px 12px',
              boxShadow: props.shadow !== false ? '0 4px 12px rgba(0,0,0,0.15)' : undefined,
              transform: `rotate(${imageStyles[index].rotation}deg) translate(${imageStyles[index].offsetX}px, ${imageStyles[index].offsetY}px)`,
              zIndex: imageStyles[index].zIndex,
              border: props.border ? `1px solid ${props.borderColor || '#e5e7eb'}` : undefined,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`콜라주 이미지 ${index + 1}`}
              style={{
                width: '150px',
                height: '150px',
                objectFit: props.objectFit || 'cover',
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  // Stack 템플릿
  if (template === 'stack') {
    return (
      <div
        data-node-id={node.id}
        data-node-type="collage"
        style={{
          ...containerStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
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
        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
          {images.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={src}
              alt={`콜라주 이미지 ${index + 1}`}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: props.objectFit || 'cover',
                borderRadius: '8px',
                boxShadow: props.shadow !== false ? '0 4px 12px rgba(0,0,0,0.2)' : undefined,
                transform: `rotate(${imageStyles[index].rotation}deg)`,
                zIndex: imageStyles[index].zIndex,
                border: props.border ? `2px solid ${props.borderColor || '#fff'}` : undefined,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Scrapbook 템플릿
  if (template === 'scrapbook') {
    return (
      <div
        data-node-id={node.id}
        data-node-type="collage"
        style={{
          ...containerStyle,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          padding: '20px',
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
        {images.map((src, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#fffef0',
              padding: '8px',
              boxShadow: props.shadow !== false ? '2px 2px 8px rgba(0,0,0,0.1)' : undefined,
              transform: `rotate(${imageStyles[index].rotation}deg)`,
              border: '1px solid #e5e7eb',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`콜라주 이미지 ${index + 1}`}
              style={{
                width: '100%',
                aspectRatio: props.aspectRatio?.replace(':', '/') || '1/1',
                objectFit: props.objectFit || 'cover',
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  // Random/Default 템플릿
  return (
    <div
      data-node-id={node.id}
      data-node-type="collage"
      style={{
        ...containerStyle,
        position: 'relative',
        padding: '40px',
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
      {images.map((src, index) => {
        const seed = index + node.id.charCodeAt(0)
        const left = `${seededRandom(seed) * 60 + 10}%`
        const top = `${seededRandom(seed + 10) * 60 + 10}%`

        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={index}
            src={src}
            alt={`콜라주 이미지 ${index + 1}`}
            style={{
              position: 'absolute',
              left,
              top,
              width: '120px',
              height: '120px',
              objectFit: props.objectFit || 'cover',
              borderRadius: '4px',
              boxShadow: props.shadow !== false ? '0 4px 12px rgba(0,0,0,0.2)' : undefined,
              transform: `rotate(${imageStyles[index].rotation}deg)`,
              zIndex: imageStyles[index].zIndex,
              border: props.border ? `2px solid ${props.borderColor || '#fff'}` : undefined,
            }}
          />
        )
      })}
    </div>
  )
}

export const collageRenderer: PrimitiveRenderer<CollageProps> = {
  type: 'collage',
  render: (node, context) => (
    <Collage key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'template',
      label: '템플릿',
      type: 'select',
      options: [
        { value: 'polaroid', label: '폴라로이드' },
        { value: 'stack', label: '스택' },
        { value: 'scrapbook', label: '스크랩북' },
        { value: 'random', label: '랜덤' },
      ],
      defaultValue: 'polaroid',
    },
    {
      key: 'rotation',
      label: '회전',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'rotationRange',
      label: '최대 회전 각도',
      type: 'number',
      defaultValue: 10,
    },
    {
      key: 'overlap',
      label: '겹침',
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'shadow',
      label: '그림자',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'border',
      label: '테두리',
      type: 'boolean',
      defaultValue: false,
    },
  ],
}

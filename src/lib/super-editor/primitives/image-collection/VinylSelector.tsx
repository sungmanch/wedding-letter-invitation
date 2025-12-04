'use client'

import { useState } from 'react'
import type { PrimitiveNode, VinylSelectorProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, getValueByPath } from '../types'

export function VinylSelector({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<VinylSelectorProps>(node)
  const style = toInlineStyle(node.style)
  const [selectedIndex, setSelectedIndex] = useState(0)

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

  const selectorStyle = props.style || 'vinyl'
  const activeScale = props.activeScale || 1.1

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    padding: '40px 0',
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  const handleSelect = (index: number) => {
    if (context.mode === 'edit') {
      context.onSelectNode?.(node.id)
      return
    }
    setSelectedIndex(index)
  }

  // Vinyl 스타일
  if (selectorStyle === 'vinyl') {
    return (
      <div
        data-node-id={node.id}
        data-node-type="vinyl-selector"
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '-30px', // 겹치기
          }}
        >
          {images.map((src, index) => {
            const isActive = index === selectedIndex
            const offset = (index - selectedIndex) * 60

            return (
              <div
                key={index}
                style={{
                  position: 'relative',
                  transform: `translateX(${offset}px) scale(${isActive ? activeScale : 0.9})`,
                  zIndex: isActive ? 10 : images.length - Math.abs(index - selectedIndex),
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => handleSelect(index)}
              >
                {/* LP 레코드 */}
                <div
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 50% 50%,
                      #1a1a1a 0%,
                      #1a1a1a 15%,
                      #333 16%,
                      #1a1a1a 17%,
                      #1a1a1a 30%,
                      #333 31%,
                      #1a1a1a 32%,
                      #1a1a1a 100%
                    )`,
                    boxShadow: isActive ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.2)',
                    position: 'relative',
                  }}
                >
                  {/* 가운데 라벨 (이미지) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`앨범 ${index + 1}`}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #444',
                    }}
                  />
                  {/* 가운데 구멍 */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Card Stack 스타일
  if (selectorStyle === 'card-stack') {
    return (
      <div
        data-node-id={node.id}
        data-node-type="vinyl-selector"
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
        <div
          style={{
            position: 'relative',
            width: '200px',
            height: '250px',
            margin: '0 auto',
          }}
        >
          {images.map((src, index) => {
            const isActive = index === selectedIndex
            const offset = (index - selectedIndex) * 15
            const rotate = (index - selectedIndex) * 5

            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={src}
                alt={`카드 ${index + 1}`}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: props.objectFit || 'cover',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  transform: `translateY(${offset}px) rotate(${rotate}deg) scale(${isActive ? activeScale : 1})`,
                  zIndex: images.length - Math.abs(index - selectedIndex),
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => handleSelect(index)}
              />
            )
          })}
        </div>
      </div>
    )
  }

  // Fan 스타일
  if (selectorStyle === 'fan') {
    const fanAngle = 15 // 각 카드 간격 각도

    return (
      <div
        data-node-id={node.id}
        data-node-type="vinyl-selector"
        style={{
          ...containerStyle,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '80px',
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
        <div style={{ position: 'relative' }}>
          {images.map((src, index) => {
            const isActive = index === selectedIndex
            const centerIndex = Math.floor(images.length / 2)
            const angle = (index - centerIndex) * fanAngle

            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={src}
                alt={`카드 ${index + 1}`}
                style={{
                  position: 'absolute',
                  width: '120px',
                  height: '160px',
                  objectFit: props.objectFit || 'cover',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  transformOrigin: 'bottom center',
                  transform: `rotate(${angle}deg) translateY(${isActive ? -20 : 0}px) scale(${isActive ? activeScale : 1})`,
                  zIndex: isActive ? 10 : images.length - Math.abs(index - centerIndex),
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  left: '50%',
                  marginLeft: '-60px',
                }}
                onClick={() => handleSelect(index)}
              />
            )
          })}
        </div>
      </div>
    )
  }

  // Polaroid Stack 스타일 (기본)
  return (
    <div
      data-node-id={node.id}
      data-node-type="vinyl-selector"
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {images.map((src, index) => {
          const isActive = index === selectedIndex

          return (
            <div
              key={index}
              style={{
                backgroundColor: '#fff',
                padding: '8px 8px 32px 8px',
                boxShadow: isActive
                  ? '0 8px 24px rgba(0,0,0,0.2)'
                  : '0 4px 12px rgba(0,0,0,0.1)',
                transform: `scale(${isActive ? activeScale : 1})`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => handleSelect(index)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`폴라로이드 ${index + 1}`}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: props.objectFit || 'cover',
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const vinylSelectorRenderer: PrimitiveRenderer<VinylSelectorProps> = {
  type: 'vinyl-selector',
  render: (node, context) => (
    <VinylSelector key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'style',
      label: '스타일',
      type: 'select',
      options: [
        { value: 'vinyl', label: 'LP 레코드' },
        { value: 'card-stack', label: '카드 스택' },
        { value: 'polaroid-stack', label: '폴라로이드' },
        { value: 'fan', label: '부채꼴' },
      ],
      defaultValue: 'vinyl',
    },
    {
      key: 'activeScale',
      label: '선택 시 확대',
      type: 'number',
      defaultValue: 1.1,
    },
    {
      key: 'showLabel',
      label: '라벨 표시',
      type: 'boolean',
      defaultValue: false,
    },
  ],
}

'use client'

import type { PrimitiveNode, AvatarProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, resolveDataBinding } from '../types'

const sizeMap: Record<string, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
}

export function Avatar({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<AvatarProps>(node)
  const style = toInlineStyle(node.style)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 데이터 바인딩 해결
  const src = resolveDataBinding(props.src || '', context.data) as string
  const alt = resolveDataBinding(props.alt || '', context.data) as string

  // 사이즈 계산
  const size =
    typeof props.size === 'number'
      ? props.size
      : sizeMap[props.size || 'md'] || 48

  // 모양 스타일
  const borderRadius =
    props.shape === 'circle'
      ? '50%'
      : props.shape === 'rounded'
        ? '8px'
        : '0'

  const avatarStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius,
    objectFit: 'cover',
    border: props.border ? `2px solid ${props.borderColor || '#fff'}` : undefined,
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-node-id={node.id}
      data-node-type="avatar"
      src={src}
      alt={alt}
      style={avatarStyle}
      onClick={
        context.mode === 'edit'
          ? (e) => {
              e.stopPropagation()
              context.onSelectNode?.(node.id)
            }
          : undefined
      }
    />
  )
}

export const avatarRenderer: PrimitiveRenderer<AvatarProps> = {
  type: 'avatar',
  render: (node, context) => (
    <Avatar key={node.id} node={node} context={context} />
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
      key: 'size',
      label: '크기',
      type: 'select',
      options: [
        { value: 'sm', label: '작음 (32px)' },
        { value: 'md', label: '중간 (48px)' },
        { value: 'lg', label: '큼 (64px)' },
        { value: 'xl', label: '매우 큼 (96px)' },
      ],
      defaultValue: 'md',
    },
    {
      key: 'shape',
      label: '모양',
      type: 'select',
      options: [
        { value: 'circle', label: '원형' },
        { value: 'rounded', label: '둥근 사각형' },
        { value: 'square', label: '사각형' },
      ],
      defaultValue: 'circle',
    },
    {
      key: 'border',
      label: '테두리',
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'borderColor',
      label: '테두리 색상',
      type: 'color',
      defaultValue: '#ffffff',
    },
  ],
}

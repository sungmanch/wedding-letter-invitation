'use client'

import type { PrimitiveNode, VideoProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, resolveDataBinding } from '../types'

export function Video({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<VideoProps>(node)
  const style = toInlineStyle(node.style)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 데이터 바인딩 해결
  const src = resolveDataBinding(props.src || '', context.data) as string
  const poster = props.poster
    ? (resolveDataBinding(props.poster, context.data) as string)
    : undefined

  const videoStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: props.objectFit || 'cover',
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  return (
    <video
      data-node-id={node.id}
      data-node-type="video"
      src={src}
      poster={poster}
      autoPlay={props.autoplay}
      muted={props.muted ?? props.autoplay} // autoplay 시 muted 필수
      loop={props.loop}
      controls={props.controls}
      playsInline={props.playsinline ?? true} // 모바일에서 인라인 재생
      style={videoStyle}
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

export const videoRenderer: PrimitiveRenderer<VideoProps> = {
  type: 'video',
  render: (node, context) => (
    <Video key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'src',
      label: '비디오 URL',
      type: 'text',
    },
    {
      key: 'poster',
      label: '썸네일 이미지',
      type: 'text',
    },
    {
      key: 'autoplay',
      label: '자동 재생',
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'muted',
      label: '음소거',
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'loop',
      label: '반복 재생',
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'controls',
      label: '컨트롤 표시',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'objectFit',
      label: '맞춤',
      type: 'select',
      options: [
        { value: 'cover', label: '채우기' },
        { value: 'contain', label: '맞추기' },
        { value: 'fill', label: '늘리기' },
      ],
      defaultValue: 'cover',
    },
  ],
}

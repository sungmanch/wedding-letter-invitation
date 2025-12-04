'use client'

import type { PrimitiveNode, TextProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, resolveDataBinding } from '../types'

export function Text({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<TextProps>(node)
  const style = toInlineStyle(node.style)
  const Tag = props.as || 'p'

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 데이터 바인딩 해결
  const content = resolveDataBinding(props.content || '', context.data) as string

  const combinedStyle: React.CSSProperties = {
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // HTML 허용 여부에 따라 렌더링 방식 결정
  if (props.html) {
    return (
      <Tag
        data-node-id={node.id}
        data-node-type="text"
        style={combinedStyle}
        dangerouslySetInnerHTML={{ __html: content }}
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

  return (
    <Tag
      data-node-id={node.id}
      data-node-type="text"
      style={combinedStyle}
      onClick={
        context.mode === 'edit'
          ? (e) => {
              e.stopPropagation()
              context.onSelectNode?.(node.id)
            }
          : undefined
      }
    >
      {content}
    </Tag>
  )
}

export const textRenderer: PrimitiveRenderer<TextProps> = {
  type: 'text',
  render: (node, context) => <Text key={node.id} node={node} context={context} />,
  editableProps: [
    {
      key: 'content',
      label: '텍스트',
      type: 'text',
    },
    {
      key: 'as',
      label: '태그',
      type: 'select',
      options: [
        { value: 'p', label: '문단 (p)' },
        { value: 'h1', label: '제목1 (h1)' },
        { value: 'h2', label: '제목2 (h2)' },
        { value: 'h3', label: '제목3 (h3)' },
        { value: 'h4', label: '제목4 (h4)' },
        { value: 'span', label: '인라인 (span)' },
        { value: 'div', label: '블록 (div)' },
      ],
      defaultValue: 'p',
    },
    {
      key: 'html',
      label: 'HTML 허용',
      type: 'boolean',
      defaultValue: false,
    },
  ],
}

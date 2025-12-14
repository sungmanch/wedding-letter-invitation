'use client'

import type { PrimitiveNode, TextProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { getNodeProps, resolveDataBinding, mergeNodeStyles, getNodeEventHandlers } from '../types'

// 확장된 노드 타입 (tokenStyle, events 포함)
interface ExtendedNode extends PrimitiveNode {
  tokenStyle?: Record<string, unknown>
  events?: import('../../context/EventContext').NodeEventHandler[]
}

export function Text({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const extNode = node as ExtendedNode
  const props = getNodeProps<TextProps>(node)
  const Tag = props.as || 'p'

  // 토큰 스타일 + 직접 스타일 병합
  const mergedStyle = mergeNodeStyles(extNode, context)

  // 이벤트 핸들러 생성
  const eventHandlers = getNodeEventHandlers(extNode, context)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 데이터 바인딩 해결
  const content = resolveDataBinding(props.content || '', context.data) as string

  const combinedStyle: React.CSSProperties = {
    ...mergedStyle,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // 클릭 핸들러 결정
  const handleClick = context.mode === 'edit'
    ? (e: React.MouseEvent) => {
        e.stopPropagation()
        context.onSelectNode?.(node.id)
      }
    : eventHandlers.onClick

  // className 지원
  const className = props.className as string | undefined

  // HTML 허용 여부에 따라 렌더링 방식 결정
  if (props.html) {
    return (
      <Tag
        data-node-id={node.id}
        data-node-type="text"
        data-text={content}
        className={className}
        style={combinedStyle}
        dangerouslySetInnerHTML={{ __html: content }}
        onClick={handleClick}
        onMouseEnter={eventHandlers.onMouseEnter}
        onMouseLeave={eventHandlers.onMouseLeave}
      />
    )
  }

  return (
    <Tag
      data-node-id={node.id}
      data-node-type="text"
      data-text={content}
      className={className}
      style={combinedStyle}
      onClick={handleClick}
      onMouseEnter={eventHandlers.onMouseEnter}
      onMouseLeave={eventHandlers.onMouseLeave}
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

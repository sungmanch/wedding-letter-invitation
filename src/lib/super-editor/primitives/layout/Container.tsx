'use client'

import { useEffect, useState, useCallback } from 'react'
import type { PrimitiveNode, ContainerProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { getNodeProps, mergeNodeStyles, getNodeEventHandlers } from '../types'

// 확장된 노드 타입 (tokenStyle, events 포함)
interface ExtendedNode extends PrimitiveNode {
  tokenStyle?: Record<string, unknown>
  events?: import('../../context/EventContext').NodeEventHandler[]
}

// showAfterScroll prop을 포함한 확장 props
interface ExtendedContainerProps extends ContainerProps {
  showAfterScroll?: number
}

export function Container({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const extNode = node as ExtendedNode
  const props = getNodeProps<ExtendedContainerProps>(node)
  const showAfterScroll = props.showAfterScroll

  // 스크롤 후 표시 상태
  const [isVisible, setIsVisible] = useState(showAfterScroll === undefined)

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (showAfterScroll === undefined) return

    const scrollY = window.scrollY || window.pageYOffset
    setIsVisible(scrollY >= showAfterScroll)
  }, [showAfterScroll])

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    if (showAfterScroll === undefined || context.mode === 'edit') return

    // 초기 체크 - requestAnimationFrame으로 다음 프레임에 실행
    const frameId = requestAnimationFrame(() => {
      handleScroll()
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [showAfterScroll, handleScroll, context.mode])

  // 토큰 스타일 + 직접 스타일 병합
  const mergedStyle = mergeNodeStyles(extNode, context)

  // 이벤트 핸들러 생성
  const eventHandlers = getNodeEventHandlers(extNode, context)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 편집 모드 클릭 핸들러
  const handleClick = context.mode === 'edit'
    ? (e: React.MouseEvent) => {
        e.stopPropagation()
        context.onSelectNode?.(node.id)
      }
    : eventHandlers.onClick

  // showAfterScroll이 있으면 표시/숨김 스타일 적용
  const visibilityStyle = showAfterScroll !== undefined
    ? {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: isVisible ? 'auto' as const : 'none' as const,
      }
    : {}

  return (
    <div
      data-node-id={node.id}
      data-node-type="container"
      className={props.className}
      style={{
        ...mergedStyle,
        ...visibilityStyle,
        outline: isSelected ? '2px solid #3b82f6' : undefined,
      }}
      onClick={handleClick}
      onScroll={eventHandlers.onScroll}
      onMouseEnter={eventHandlers.onMouseEnter}
      onMouseLeave={eventHandlers.onMouseLeave}
    >
      {node.children?.map((child) => context.renderNode(child))}
    </div>
  )
}

export const containerRenderer: PrimitiveRenderer<ContainerProps> = {
  type: 'container',
  render: (node, context) => (
    <Container key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'className',
      label: '클래스명',
      type: 'text',
    },
  ],
}

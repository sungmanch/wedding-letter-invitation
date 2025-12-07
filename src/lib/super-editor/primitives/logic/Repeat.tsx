'use client'

import type { PrimitiveNode, RepeatProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { getNodeProps, getValueByPath } from '../types'

export function Repeat({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<RepeatProps>(node)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 데이터 배열 가져오기
  let items: unknown[] = []

  const dataPath = props.dataPath
  if (dataPath) {
    // {{path}} 형식인 경우
    let path = dataPath
    if (dataPath.startsWith('{{') && dataPath.endsWith('}}')) {
      path = dataPath.slice(2, -2).trim()
    }

    const value = getValueByPath(context.data, path)
    if (Array.isArray(value)) {
      items = value
    }
  }

  // 데이터가 없을 때 defaultValue 사용
  if (items.length === 0 && props.defaultValue && Array.isArray(props.defaultValue)) {
    items = props.defaultValue
  }

  // limit, offset 적용
  const offset = props.offset || 0
  const limit = props.limit || items.length
  const slicedItems = items.slice(offset, offset + limit)

  // 반복 렌더링
  const renderItems = slicedItems.map((item, index) => {
    // 컨텍스트에 반복 변수 추가
    const itemContext: RenderContext = {
      ...context,
      data: {
        ...context.data,
        [props.as]: item,
        [`${props.as}Index`]: index,
        [`${props.as}First`]: index === 0,
        [`${props.as}Last`]: index === slicedItems.length - 1,
      },
    }

    // 고유 키 생성
    const key = props.key && typeof item === 'object' && item !== null
      ? String((item as Record<string, unknown>)[props.key])
      : `${node.id}-${index}`

    return (
      <div key={key} data-repeat-index={index}>
        {node.children?.map((child) => {
          // 자식 노드의 ID를 고유하게 만들기
          const clonedChild = {
            ...child,
            id: `${child.id}-${index}`,
          }
          return itemContext.renderNode(clonedChild)
        })}
      </div>
    )
  })

  // 편집 모드에서 반복 표시
  if (context.mode === 'edit') {
    return (
      <div
        data-node-id={node.id}
        data-node-type="repeat"
        style={{
          position: 'relative',
          outline: isSelected ? '2px dashed #8b5cf6' : undefined,
        }}
        onClick={(e) => {
          e.stopPropagation()
          context.onSelectNode?.(node.id)
        }}
      >
        {/* 반복 표시 배지 */}
        {isSelected && (
          <div
            style={{
              position: 'absolute',
              top: -24,
              left: 0,
              padding: '2px 8px',
              backgroundColor: '#8b5cf6',
              color: '#fff',
              fontSize: '10px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            반복: {props.dataPath} as {props.as}
            {props.limit ? ` (최대 ${props.limit}개)` : ''}
          </div>
        )}
        {renderItems}
      </div>
    )
  }

  return <>{renderItems}</>
}

export const repeatRenderer: PrimitiveRenderer<RepeatProps> = {
  type: 'repeat',
  render: (node, context) => (
    <Repeat key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'dataPath',
      label: '데이터 경로',
      type: 'text',
    },
    {
      key: 'as',
      label: '반복 변수명',
      type: 'text',
      defaultValue: 'item',
    },
    {
      key: 'key',
      label: '고유 키 필드',
      type: 'text',
    },
    {
      key: 'limit',
      label: '최대 개수',
      type: 'number',
    },
    {
      key: 'offset',
      label: '시작 위치',
      type: 'number',
      defaultValue: 0,
    },
  ],
}

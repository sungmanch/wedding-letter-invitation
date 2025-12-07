'use client'

import type { PrimitiveNode, RepeatProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { getNodeProps, getValueByPath } from '../types'
import { renderPrimitiveNode } from '../render-node'

// relation → relationLabel 매핑
const GROOM_RELATION_LABELS: Record<string, string> = {
  self: '신랑',
  father: '신랑 부',
  mother: '신랑 모',
}

const BRIDE_RELATION_LABELS: Record<string, string> = {
  self: '신부',
  father: '신부 부',
  mother: '신부 모',
}

/**
 * 계좌 데이터에 relationLabel 추가
 */
function addRelationLabel(
  item: unknown,
  dataPath: string
): unknown {
  if (typeof item !== 'object' || item === null) return item
  const record = item as Record<string, unknown>

  // relation 필드가 있으면 relationLabel 추가
  if ('relation' in record && typeof record.relation === 'string') {
    const isGroom = dataPath.includes('groom')
    const labelMap = isGroom ? GROOM_RELATION_LABELS : BRIDE_RELATION_LABELS
    const label = labelMap[record.relation] || record.relation
    return {
      ...record,
      relationLabel: label,
    }
  }

  // relation 필드가 없으면 기본값 추가
  const isGroom = dataPath.includes('groom')
  return {
    ...record,
    relationLabel: isGroom ? '신랑' : '신부',
  }
}

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

  // 데이터가 없거나 비어있을 때 defaultValue 사용
  // - items.length === 0: 데이터 배열이 비어있음
  // - items가 있지만 모든 item이 빈 객체 (필수 필드가 없음)
  const hasValidData = items.length > 0 && items.some(item => {
    if (typeof item !== 'object' || item === null) return false
    const values = Object.values(item as Record<string, unknown>)
    return values.some(v => v !== '' && v !== undefined && v !== null)
  })

  if (!hasValidData && props.defaultValue && Array.isArray(props.defaultValue)) {
    items = props.defaultValue
  }

  // limit, offset 적용
  const offset = props.offset || 0
  const limit = props.limit || items.length
  const slicedItems = items.slice(offset, offset + limit)

  // 반복 렌더링
  const renderItems = slicedItems.map((item, index) => {
    // relationLabel 자동 추가 (accounts.groom/bride용)
    const enhancedItem = addRelationLabel(item, dataPath || '')

    // 컨텍스트에 반복 변수 추가
    const itemData = {
      ...context.data,
      [props.as]: enhancedItem,
      [`${props.as}Index`]: index,
      [`${props.as}First`]: index === 0,
      [`${props.as}Last`]: index === slicedItems.length - 1,
    }

    // 새로운 renderNode 함수를 생성하여 itemData를 사용하도록 함
    const itemContext: RenderContext = {
      ...context,
      data: itemData,
      renderNode: (childNode: PrimitiveNode) =>
        renderPrimitiveNode(childNode, { ...context, data: itemData, renderNode: itemContext.renderNode }),
    }
    // renderNode가 자기 자신을 참조하도록 재할당
    itemContext.renderNode = (childNode: PrimitiveNode) =>
      renderPrimitiveNode(childNode, itemContext)

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

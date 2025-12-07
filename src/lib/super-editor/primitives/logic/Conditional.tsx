'use client'

import type { PrimitiveNode, ConditionalProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { getNodeProps, getValueByPath } from '../types'

export function Conditional({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<ConditionalProps>(node)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 조건 평가
  const evaluateCondition = (): boolean => {
    const condition = props.condition
    const operator = props.operator || 'exists'
    const compareValue = props.value

    // 데이터 경로에서 값 가져오기
    let value: unknown

    // {{path}} 형식인 경우
    if (condition.startsWith('{{') && condition.endsWith('}}')) {
      const path = condition.slice(2, -2).trim()
      value = getValueByPath(context.data, path)
    } else {
      // 직접 경로인 경우
      value = getValueByPath(context.data, condition)
    }

    // 연산자별 평가
    switch (operator) {
      case 'exists':
        return value !== undefined && value !== null && value !== ''

      case 'equals':
        return value === compareValue

      case 'notEquals':
        return value !== compareValue

      case 'gt':
        return typeof value === 'number' && typeof compareValue === 'number'
          ? value > compareValue
          : false

      case 'lt':
        return typeof value === 'number' && typeof compareValue === 'number'
          ? value < compareValue
          : false

      case 'in':
        if (Array.isArray(compareValue)) {
          return compareValue.includes(value)
        }
        return false

      default:
        return !!value
    }
  }

  const shouldRender = evaluateCondition()

  if (!shouldRender) {
    return null
  }

  // 편집 모드에서 조건부 표시
  if (context.mode === 'edit' && isSelected) {
    return (
      <div
        data-node-id={node.id}
        data-node-type="conditional"
        style={{
          position: 'relative',
          outline: '2px dashed #f59e0b',
        }}
        onClick={(e) => {
          e.stopPropagation()
          context.onSelectNode?.(node.id)
        }}
      >
        {/* 조건 표시 배지 */}
        <div
          style={{
            position: 'absolute',
            top: -24,
            left: 0,
            padding: '2px 8px',
            backgroundColor: '#f59e0b',
            color: '#fff',
            fontSize: '10px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
          }}
        >
          조건: {props.condition} {props.operator || 'exists'}
          {props.value !== undefined ? ` ${props.value}` : ''}
        </div>
        {node.children?.map((child) => context.renderNode(child))}
      </div>
    )
  }

  // 일반 렌더링
  return <>{node.children?.map((child) => context.renderNode(child))}</>
}

export const conditionalRenderer: PrimitiveRenderer<ConditionalProps> = {
  type: 'conditional',
  render: (node, context) => (
    <Conditional key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'condition',
      label: '조건 (데이터 경로)',
      type: 'text',
    },
    {
      key: 'operator',
      label: '연산자',
      type: 'select',
      options: [
        { value: 'exists', label: '존재함' },
        { value: 'equals', label: '같음' },
        { value: 'notEquals', label: '다름' },
        { value: 'gt', label: '보다 큼' },
        { value: 'lt', label: '보다 작음' },
        { value: 'in', label: '포함됨' },
      ],
      defaultValue: 'exists',
    },
    {
      key: 'value',
      label: '비교 값',
      type: 'text',
    },
  ],
}

'use client'

import type { PrimitiveNode, InputProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps, resolveDataBinding } from '../types'

export function Input({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<InputProps>(node)
  const style = toInlineStyle(node.style)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 데이터 바인딩 해결
  const placeholder = props.placeholder
    ? (resolveDataBinding(props.placeholder, context.data) as string)
    : undefined
  const label = props.label
    ? (resolveDataBinding(props.label, context.data) as string)
    : undefined

  const inputType = props.type || 'text'

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    ...style,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    fontSize: '16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const isTextarea = inputType === 'textarea'

  return (
    <div
      data-node-id={node.id}
      data-node-type="input"
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
      {label && (
        <label
          htmlFor={`input-${node.id}`}
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
          }}
        >
          {label}
          {props.required && (
            <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
          )}
        </label>
      )}

      {isTextarea ? (
        <textarea
          id={`input-${node.id}`}
          name={props.name}
          placeholder={placeholder}
          required={props.required}
          disabled={context.mode === 'edit'}
          maxLength={props.maxLength}
          rows={props.rows || 4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      ) : (
        <input
          id={`input-${node.id}`}
          type={inputType}
          name={props.name}
          placeholder={placeholder}
          required={props.required}
          disabled={context.mode === 'edit'}
          maxLength={props.maxLength}
          style={inputStyle}
        />
      )}
    </div>
  )
}

export const inputRenderer: PrimitiveRenderer<InputProps> = {
  type: 'input',
  render: (node, context) => (
    <Input key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'type',
      label: '타입',
      type: 'select',
      options: [
        { value: 'text', label: '텍스트' },
        { value: 'textarea', label: '여러 줄' },
        { value: 'email', label: '이메일' },
        { value: 'tel', label: '전화번호' },
      ],
      defaultValue: 'text',
    },
    {
      key: 'name',
      label: '이름 (필수)',
      type: 'text',
    },
    {
      key: 'label',
      label: '라벨',
      type: 'text',
    },
    {
      key: 'placeholder',
      label: '플레이스홀더',
      type: 'text',
    },
    {
      key: 'required',
      label: '필수',
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'maxLength',
      label: '최대 글자수',
      type: 'number',
    },
    {
      key: 'rows',
      label: '줄 수 (textarea)',
      type: 'number',
      defaultValue: 4,
    },
  ],
}

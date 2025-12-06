'use client'

import type { PrimitiveNode, ButtonProps, ButtonAction } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { getNodeProps, resolveDataBinding, mergeNodeStyles, getNodeEventHandlers } from '../types'

// 확장된 노드 타입 (tokenStyle, events 포함)
interface ExtendedNode extends PrimitiveNode {
  tokenStyle?: Record<string, unknown>
  events?: import('../../context/EventContext').NodeEventHandler[]
}

// 토큰 기반 variant 스타일
const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--color-brand, #3b82f6)',
    color: '#fff',
    border: 'none',
  },
  secondary: {
    backgroundColor: 'var(--color-surface, #6b7280)',
    color: 'var(--color-text-primary, #1f2937)',
    border: 'none',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--color-brand, #3b82f6)',
    border: '1px solid var(--color-border, currentColor)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-brand, #3b82f6)',
    border: 'none',
  },
  link: {
    backgroundColor: 'transparent',
    color: 'var(--color-brand, #3b82f6)',
    border: 'none',
    textDecoration: 'underline',
    padding: 0,
  },
}

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: {
    padding: '6px 12px',
    fontSize: '14px',
  },
  md: {
    padding: '10px 20px',
    fontSize: '16px',
  },
  lg: {
    padding: '14px 28px',
    fontSize: '18px',
  },
}

function handleAction(action: ButtonAction | undefined) {
  if (!action) return

  switch (action.type) {
    case 'link':
      window.open(action.url, action.target || '_self')
      break
    case 'copy':
      navigator.clipboard.writeText(action.value).then(() => {
        if (action.toast) {
          // 간단한 토스트 알림
          alert(action.toast)
        }
      })
      break
    case 'call':
      window.location.href = `tel:${action.phone}`
      break
    case 'sms':
      window.location.href = `sms:${action.phone}${action.body ? `?body=${encodeURIComponent(action.body)}` : ''}`
      break
    case 'map':
      const mapUrls: Record<string, string> = {
        kakao: `https://map.kakao.com/link/search/${encodeURIComponent(action.address)}`,
        naver: `https://map.naver.com/search/${encodeURIComponent(action.address)}`,
        tmap: `https://tmap.life/search?query=${encodeURIComponent(action.address)}`,
      }
      window.open(mapUrls[action.provider], '_blank')
      break
    case 'scroll':
      const target = document.getElementById(action.target)
      target?.scrollIntoView({ behavior: 'smooth' })
      break
    case 'custom':
      // 커스텀 핸들러는 런타임에서 처리
      console.log('Custom action:', action.handler)
      break
  }
}

export function Button({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const extNode = node as ExtendedNode
  const props = getNodeProps<ButtonProps>(node)

  // 토큰 스타일 + 직접 스타일 병합
  const mergedStyle = mergeNodeStyles(extNode, context)

  // 이벤트 핸들러 생성
  const eventHandlers = getNodeEventHandlers(extNode, context)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 데이터 바인딩 해결
  const label = resolveDataBinding(props.label || '', context.data) as string

  const variant = props.variant || 'primary'
  const size = props.size || 'md'

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-xs, 8px)',
    borderRadius: 'var(--radius-md, 6px)',
    cursor: 'pointer',
    fontWeight: 500,
    transition: `all var(--duration-fast, 150ms) var(--easing-default, ease-out)`,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...mergedStyle,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // 클릭 핸들러 결정
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (context.mode === 'edit') {
      context.onSelectNode?.(node.id)
    } else {
      // v2 이벤트 시스템 우선, 없으면 레거시 action 처리
      if (eventHandlers.onClick) {
        eventHandlers.onClick(e)
      } else if (props.action) {
        // 레거시 action을 v2 executeAction으로 변환
        if (context.executeAction) {
          const action = convertLegacyAction(props.action)
          if (action) context.executeAction(action)
        } else {
          handleAction(props.action)
        }
      }
    }
  }

  return (
    <button
      data-node-id={node.id}
      data-node-type="button"
      style={buttonStyle}
      onClick={handleClick}
      onFocus={eventHandlers.onFocus}
      onBlur={eventHandlers.onBlur}
      onMouseEnter={eventHandlers.onMouseEnter}
      onMouseLeave={eventHandlers.onMouseLeave}
    >
      {props.icon && props.iconPosition !== 'right' && (
        <span className="button-icon">{props.icon}</span>
      )}
      {label}
      {props.icon && props.iconPosition === 'right' && (
        <span className="button-icon">{props.icon}</span>
      )}
    </button>
  )
}

/**
 * 레거시 ButtonAction을 v2 EventAction으로 변환
 */
function convertLegacyAction(action: ButtonAction): import('../../context/EventContext').EventAction | null {
  switch (action.type) {
    case 'link':
      return { type: 'navigate', payload: { url: action.url, target: action.target } }
    case 'copy':
      return { type: 'copy', payload: { text: action.value, toast: action.toast } }
    case 'call':
      return { type: 'call', payload: { phone: action.phone } }
    case 'sms':
      return { type: 'sms', payload: { phone: action.phone, body: action.body } }
    case 'map':
      return { type: 'map', payload: { address: action.address, provider: action.provider } }
    case 'scroll':
      return { type: 'scroll-to', payload: { target: action.target } }
    default:
      return null
  }
}

export const buttonRenderer: PrimitiveRenderer<ButtonProps> = {
  type: 'button',
  render: (node, context) => (
    <Button key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'label',
      label: '버튼 텍스트',
      type: 'text',
    },
    {
      key: 'variant',
      label: '스타일',
      type: 'select',
      options: [
        { value: 'primary', label: '기본' },
        { value: 'secondary', label: '보조' },
        { value: 'outline', label: '외곽선' },
        { value: 'ghost', label: '투명' },
        { value: 'link', label: '링크' },
      ],
      defaultValue: 'primary',
    },
    {
      key: 'size',
      label: '크기',
      type: 'select',
      options: [
        { value: 'sm', label: '작음' },
        { value: 'md', label: '중간' },
        { value: 'lg', label: '큼' },
      ],
      defaultValue: 'md',
    },
  ],
}

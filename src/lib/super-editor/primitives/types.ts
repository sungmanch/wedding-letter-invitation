/**
 * Super Editor - Primitive Renderer Types
 */

import type { PrimitiveNode, CSSProperties } from '../schema/primitives'
import type { SemanticDesignTokens } from '../tokens/schema'
import type { EventAction, NodeEventHandler } from '../context/EventContext'

// ============================================
// Renderer Context
// ============================================

export interface RenderContext {
  // 데이터 바인딩용
  data: Record<string, unknown>
  // 이벤트 핸들러 (레거시)
  handlers?: Record<string, () => void>
  // 현재 모드
  mode: 'preview' | 'edit' | 'build'
  // 재귀 렌더링 함수
  renderNode: (node: PrimitiveNode) => React.ReactNode
  // 선택된 노드 (편집 모드용)
  selectedNodeId?: string
  // 노드 선택 핸들러
  onSelectNode?: (id: string) => void

  // ====== 토큰 시스템 (v2) ======
  // 디자인 토큰
  tokens?: SemanticDesignTokens
  // 토큰 참조를 CSS var()로 변환
  resolveTokenRef?: (ref: string) => string

  // ====== 이벤트 시스템 (v2) ======
  // 이벤트 액션 실행
  executeAction?: (action: EventAction) => void
  // 노드 이벤트 핸들러 생성
  createEventHandlers?: (
    nodeId: string,
    events: NodeEventHandler[] | undefined
  ) => Record<string, (e?: React.SyntheticEvent) => void>
}

// ============================================
// Primitive Renderer Interface
// ============================================

export interface PrimitiveRenderer<P = unknown> {
  type: string
  render: (node: PrimitiveNode, context: RenderContext) => React.ReactNode
  // 빌드용 HTML 렌더링
  renderToHtml?: (node: PrimitiveNode, context: BuildContext) => string
  // 편집 가능 속성 정의
  editableProps?: EditableProp[]
}

// ============================================
// Build Context
// ============================================

export interface BuildContext {
  data: Record<string, unknown>
  // CSS 수집
  collectCss: (className: string, styles: CSSProperties) => void
  // 에셋 수집
  collectAsset: (url: string, type: 'image' | 'font' | 'video') => string
  // 재귀 렌더링
  renderNode: (node: PrimitiveNode) => string
  // 유니크 ID 생성
  generateId: () => string
}

// ============================================
// Editable Props
// ============================================

export interface EditableProp {
  key: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'spacing'
  options?: { value: string; label: string }[]
  defaultValue?: unknown
}

// ============================================
// Data Binding Helpers
// ============================================

/**
 * 데이터 바인딩 표현식 파싱
 * {{path.to.value}} → value
 */
export function resolveDataBinding(
  expression: string,
  data: Record<string, unknown>
): unknown {
  // 템플릿 표현식이 아닌 경우 그대로 반환
  if (!expression.includes('{{')) {
    return expression
  }

  // {{expression}} 패턴 추출 및 치환
  return expression.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
    const trimmedPath = path.trim()
    const value = getValueByPath(data, trimmedPath)
    return value !== undefined ? String(value) : ''
  })
}

/**
 * 경로로 값 가져오기
 * "couple.groom.name" → data.couple.groom.name
 */
export function getValueByPath(
  obj: Record<string, unknown>,
  path: string
): unknown {
  const parts = path.split('.')
  let current: unknown = obj

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined
    }
    if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }

  return current
}

// ============================================
// Style Helpers
// ============================================

/**
 * CSSProperties를 인라인 스타일 객체로 변환
 */
export function toInlineStyle(
  styles: CSSProperties | undefined
): React.CSSProperties {
  if (!styles) return {}

  const result: React.CSSProperties = {}

  for (const [key, value] of Object.entries(styles)) {
    // camelCase로 변환
    const camelKey = key.replace(/-([a-z])/g, (_, letter) =>
      letter.toUpperCase()
    ) as keyof React.CSSProperties

    // 숫자 값에 px 단위 추가 (특정 속성 제외)
    const unitlessProps = [
      'opacity',
      'zIndex',
      'flex',
      'flexGrow',
      'flexShrink',
      'order',
      'lineHeight',
      'fontWeight',
      'columns',
      'columnCount',
      'fillOpacity',
      'strokeOpacity',
      'strokeWidth',
    ]
    if (typeof value === 'number' && !unitlessProps.includes(key)) {
      (result as Record<string, unknown>)[camelKey] = `${value}px`
    } else {
      (result as Record<string, unknown>)[camelKey] = value
    }
  }

  return result
}

/**
 * CSSProperties를 CSS 문자열로 변환 (빌드용)
 */
export function toCssString(styles: CSSProperties | undefined): string {
  if (!styles) return ''

  const unitlessProps = [
    'opacity',
    'z-index',
    'flex',
    'flex-grow',
    'flex-shrink',
    'order',
    'line-height',
    'font-weight',
    'columns',
    'column-count',
    'fill-opacity',
    'stroke-opacity',
    'stroke-width',
  ]

  return Object.entries(styles)
    .map(([key, value]) => {
      // camelCase를 kebab-case로 변환
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      // 숫자 값에 px 단위 추가 (특정 속성 제외)
      const cssValue =
        typeof value === 'number' && !unitlessProps.includes(kebabKey)
          ? `${value}px`
          : value
      return `${kebabKey}: ${cssValue};`
    })
    .join(' ')
}

// ============================================
// Node Helpers
// ============================================

/**
 * 노드 타입 체크
 */
export function isNodeType<T extends string>(
  node: PrimitiveNode,
  type: T
): boolean {
  return node.type === type
}

/**
 * 노드 props 타입 캐스팅
 */
export function getNodeProps<T>(node: PrimitiveNode): T {
  return (node.props || {}) as T
}

// ============================================
// Token Style Helpers
// ============================================

/**
 * tokenStyle 객체를 React CSSProperties로 변환
 * $token.xxx 참조를 var(--xxx)로 변환
 */
export function resolveTokenStyle(
  tokenStyle: Record<string, unknown> | undefined,
  context?: RenderContext
): React.CSSProperties {
  if (!tokenStyle) return {}

  const result: React.CSSProperties = {}

  for (const [key, value] of Object.entries(tokenStyle)) {
    if (typeof value === 'string' && value.startsWith('$token.')) {
      // 컨텍스트의 resolveTokenRef 사용 또는 기본 변환
      if (context?.resolveTokenRef) {
        (result as Record<string, unknown>)[key] = context.resolveTokenRef(value)
      } else {
        (result as Record<string, unknown>)[key] = defaultTokenRefToCssVar(value)
      }
    } else if (value !== undefined) {
      (result as Record<string, unknown>)[key] = value
    }
  }

  return result
}

/**
 * 기본 토큰 참조 → CSS Variable 변환
 */
function defaultTokenRefToCssVar(value: string): string {
  if (!value.startsWith('$token.')) return value

  const path = value.replace('$token.', '')
  const parts = path.split('.')

  // 경로별 변환 규칙
  if (parts[0] === 'colors') {
    if (parts[1] === 'text') {
      return `var(--color-text-${toKebabCase(parts[2])})`
    }
    return `var(--color-${toKebabCase(parts[1])})`
  }

  if (parts[0] === 'typography') {
    const typoName = toKebabCase(parts[1])
    const prop = parts[2]
    const propMap: Record<string, string> = {
      fontFamily: 'font-family',
      fontSize: 'font-size',
      fontWeight: 'font-weight',
      lineHeight: 'line-height',
      letterSpacing: 'letter-spacing',
    }
    return `var(--typo-${typoName}-${propMap[prop] ?? prop})`
  }

  if (parts[0] === 'spacing') {
    return `var(--spacing-${toKebabCase(parts[1])})`
  }

  if (parts[0] === 'borders') {
    const borderProp = parts[1]
    if (borderProp.startsWith('radius')) {
      const size = borderProp.replace('radius', '')
      return `var(--radius-${toKebabCase(size)})`
    }
  }

  if (parts[0] === 'shadows') {
    return `var(--shadow-${toKebabCase(parts[1])})`
  }

  if (parts[0] === 'animation') {
    const propMap: Record<string, string> = {
      durationFast: 'duration-fast',
      durationNormal: 'duration-normal',
      durationSlow: 'duration-slow',
      easing: 'easing-default',
      staggerDelay: 'stagger-delay',
    }
    return `var(--${propMap[parts[1]] ?? parts[1]})`
  }

  return value
}

/**
 * camelCase를 kebab-case로 변환
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * style과 tokenStyle을 병합
 */
export function mergeNodeStyles(
  node: PrimitiveNode & { tokenStyle?: Record<string, unknown> },
  context?: RenderContext
): React.CSSProperties {
  const tokenStyles = resolveTokenStyle(node.tokenStyle, context)
  const directStyles = toInlineStyle(node.style)

  return {
    ...tokenStyles,
    ...directStyles, // 직접 스타일이 우선
  }
}

/**
 * 노드의 이벤트 핸들러 가져오기
 */
export function getNodeEventHandlers(
  node: PrimitiveNode & { events?: NodeEventHandler[] },
  context: RenderContext
): Record<string, (e?: React.SyntheticEvent) => void> {
  if (!context.createEventHandlers || !node.events) {
    return {}
  }
  return context.createEventHandlers(node.id, node.events)
}

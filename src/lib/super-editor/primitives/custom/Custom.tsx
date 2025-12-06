'use client'

import { useId } from 'react'
import type { PrimitiveNode, CustomProps, CustomAnimationKeyframe } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps } from '../types'

/**
 * 키프레임 배열을 CSS @keyframes 문자열로 변환
 */
function keyframesToCss(name: string, keyframes: CustomAnimationKeyframe[]): string {
  return `
    @keyframes ${name} {
      ${keyframes
        .map(
          (kf) =>
            `${(kf.offset ?? 0) * 100}% {
              ${Object.entries(kf)
                .filter(([key]) => key !== 'offset')
                .map(([key, value]) => {
                  const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
                  return `${cssKey}: ${value};`
                })
                .join(' ')}
            }`
        )
        .join('\n')}
    }
  `
}

/**
 * CSSProperties를 CSS 문자열로 변환
 */
function cssPropertiesToString(props: Record<string, unknown>): string {
  return Object.entries(props)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${cssKey}: ${value};`
    })
    .join(' ')
}

/**
 * Custom Primitive
 * - 가상 요소 (::before, ::after) 지원
 * - 커스텀 CSS 클래스 지원
 * - 인라인 CSS 주입
 * - 커스텀 애니메이션
 */
export function Custom({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<CustomProps>(node)
  const style = toInlineStyle(node.style)
  const uniqueId = useId().replace(/:/g, '')
  const elementId = `custom-${node.id}-${uniqueId}`

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id
  const Tag = props.as || 'div'

  // CSS 생성
  const cssBlocks: string[] = []

  // 1. 가상 요소 CSS 생성
  if (props.pseudoElements) {
    const { before, after } = props.pseudoElements

    if (before) {
      const beforeStyles = cssPropertiesToString({
        content: before.content ? `"${before.content}"` : '""',
        ...before.style,
      })
      const animationStyle = before.animation ? `animation: ${before.animation};` : ''
      cssBlocks.push(`#${elementId}::before { ${beforeStyles} ${animationStyle} }`)
    }

    if (after) {
      const afterStyles = cssPropertiesToString({
        content: after.content ? `"${after.content}"` : '""',
        ...after.style,
      })
      const animationStyle = after.animation ? `animation: ${after.animation};` : ''
      cssBlocks.push(`#${elementId}::after { ${afterStyles} ${animationStyle} }`)
    }
  }

  // 2. 커스텀 애니메이션 keyframes 생성
  if (props.animation?.keyframes && props.animation.keyframes.length > 0) {
    const keyframesName = `custom-anim-${node.id}`
    cssBlocks.push(keyframesToCss(keyframesName, props.animation.keyframes))

    const duration = props.animation.duration ?? 500
    const easing = props.animation.easing ?? 'ease-out'
    const delay = props.animation.delay ?? 0
    const repeat = props.animation.repeat
    const direction = props.animation.direction ?? 'normal'

    const animationValue = `${keyframesName} ${duration}ms ${easing} ${delay}ms ${
      repeat === 'infinite' ? 'infinite' : repeat || 1
    } ${direction} both`

    cssBlocks.push(`#${elementId} { animation: ${animationValue}; }`)
  }

  // 3. 인라인 CSS 추가
  if (props.inlineCss) {
    cssBlocks.push(`#${elementId} { ${props.inlineCss} }`)
  }

  // 4. className 기반 스타일 (context.customClasses에서 가져옴)
  // TODO: context에 customClasses 추가 시 구현

  const combinedStyle: React.CSSProperties = {
    ...style,
    position: props.pseudoElements ? 'relative' : style.position,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  return (
    <>
      {cssBlocks.length > 0 && <style>{cssBlocks.join('\n')}</style>}
      <Tag
        id={elementId}
        data-node-id={node.id}
        data-node-type="custom"
        className={props.className}
        style={combinedStyle}
        onClick={
          context.mode === 'edit'
            ? (e: React.MouseEvent) => {
                e.stopPropagation()
                context.onSelectNode?.(node.id)
              }
            : undefined
        }
      >
        {node.children?.map((child) => context.renderNode(child))}
      </Tag>
    </>
  )
}

export const customRenderer: PrimitiveRenderer<CustomProps> = {
  type: 'custom',
  render: (node, context) => <Custom key={node.id} node={node} context={context} />,
  editableProps: [
    {
      key: 'className',
      label: '클래스 이름',
      type: 'text',
      defaultValue: '',
    },
    {
      key: 'as',
      label: '태그',
      type: 'select',
      options: [
        { value: 'div', label: 'div' },
        { value: 'span', label: 'span' },
        { value: 'section', label: 'section' },
        { value: 'article', label: 'article' },
      ],
      defaultValue: 'div',
    },
  ],
}

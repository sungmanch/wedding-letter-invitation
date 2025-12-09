'use client'

import { useEffect, useRef, useState } from 'react'
import type { PrimitiveNode, AnimatedProps, CustomAnimationKeyframe } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps } from '../types'
import { getAnimationPreset, type AnimationPresetConfig } from '../../animations/presets'

/**
 * 키프레임 배열을 CSS @keyframes 문자열로 변환
 */
function keyframesToCss(
  name: string,
  keyframes: CustomAnimationKeyframe[] | AnimationPresetConfig['keyframes']
): string {
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

export function Animated({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<AnimatedProps>(node)
  const style = toInlineStyle(node.style)
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id
  const trigger = props.trigger || 'mount'

  // IntersectionObserver for inView trigger
  useEffect(() => {
    if (trigger !== 'inView' || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setIsVisible(true)
          setHasTriggered(true)
        }
      },
      { threshold: props.threshold || 0.1 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [trigger, props.threshold, hasTriggered])

  // Mount trigger
  useEffect(() => {
    if (trigger === 'mount') {
      // requestAnimationFrame으로 다음 프레임에 실행 (React Compiler 호환)
      const frameId = requestAnimationFrame(() => {
        setIsVisible(true)
      })
      return () => cancelAnimationFrame(frameId)
    }
  }, [trigger])

  // ============================================
  // 애니메이션 소스 결정 (우선순위)
  // 1. 커스텀 keyframes (직접 정의)
  // 2. keyframesRef (StyleSchema.customStyles.keyframes 참조)
  // 3. preset (미리 정의된 프리셋)
  // ============================================

  const animation = props.animation
  let keyframes: CustomAnimationKeyframe[] | null = null
  let defaultDuration = 500
  let defaultEasing = 'ease-out'

  // 1. 커스텀 keyframes 직접 정의
  if (animation?.keyframes && animation.keyframes.length > 0) {
    keyframes = animation.keyframes
  }
  // 2. keyframesRef로 StyleSchema 참조 (context.customKeyframes에서 가져옴)
  // TODO: context에 customKeyframes 추가 필요
  // 3. preset 사용
  else if (animation?.preset) {
    const preset = getAnimationPreset(animation.preset)
    if (preset) {
      keyframes = preset.keyframes as CustomAnimationKeyframe[]
      defaultDuration = preset.defaultDuration
      defaultEasing = preset.defaultEasing
    }
  }

  // 애니메이션이 없는 경우
  if (!keyframes || keyframes.length === 0) {
    return (
      <div
        data-node-id={node.id}
        data-node-type="animated"
        style={{
          ...style,
          outline: isSelected ? '2px solid #3b82f6' : undefined,
        }}
      >
        {node.children?.map((child) => context.renderNode(child))}
      </div>
    )
  }

  // Generate keyframes CSS
  const keyframesName = `anim-${node.id}`
  const keyframesCSS = keyframesToCss(keyframesName, keyframes)

  const duration = animation?.duration ?? defaultDuration
  const easing = animation?.easing ?? defaultEasing
  const delay = animation?.delay ?? 0
  const repeat = animation?.repeat
  const direction = animation?.direction ?? 'normal'

  const animationValue = isVisible
    ? `${keyframesName} ${duration}ms ${easing} ${delay}ms ${
        repeat === 'infinite' ? 'infinite' : repeat || 1
      } ${direction} both`
    : 'none'

  const containerStyle: React.CSSProperties = {
    ...style,
    animation: animationValue,
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // Hover trigger
  const hoverProps =
    trigger === 'hover'
      ? {
          onMouseEnter: () => setIsVisible(true),
          onMouseLeave: () => setIsVisible(false),
        }
      : {}

  // Click trigger
  const clickProps =
    trigger === 'click'
      ? {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation()
            if (context.mode === 'edit') {
              context.onSelectNode?.(node.id)
            } else {
              setIsVisible(!isVisible)
            }
          },
        }
      : {}

  return (
    <>
      <style>{keyframesCSS}</style>
      <div
        ref={ref}
        data-node-id={node.id}
        data-node-type="animated"
        style={containerStyle}
        {...hoverProps}
        {...clickProps}
        onClick={
          context.mode === 'edit' && trigger !== 'click'
            ? (e) => {
                e.stopPropagation()
                context.onSelectNode?.(node.id)
              }
            : undefined
        }
      >
        {node.children?.map((child) => context.renderNode(child))}
      </div>
    </>
  )
}

export const animatedRenderer: PrimitiveRenderer<AnimatedProps> = {
  type: 'animated',
  render: (node, context) => (
    <Animated key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'animation.preset',
      label: '애니메이션',
      type: 'select',
      options: [
        { value: 'fade-in', label: '페이드 인' },
        { value: 'slide-up', label: '슬라이드 업' },
        { value: 'slide-down', label: '슬라이드 다운' },
        { value: 'scale-in', label: '스케일 인' },
        { value: 'bounce-in', label: '바운스 인' },
        { value: 'flip-in', label: '플립 인' },
      ],
      defaultValue: 'fade-in',
    },
    {
      key: 'trigger',
      label: '트리거',
      type: 'select',
      options: [
        { value: 'mount', label: '마운트 시' },
        { value: 'inView', label: '화면에 보일 때' },
        { value: 'hover', label: '호버 시' },
        { value: 'click', label: '클릭 시' },
      ],
      defaultValue: 'mount',
    },
    {
      key: 'animation.duration',
      label: '지속 시간 (ms)',
      type: 'number',
      defaultValue: 500,
    },
    {
      key: 'animation.delay',
      label: '지연 (ms)',
      type: 'number',
      defaultValue: 0,
    },
  ],
}

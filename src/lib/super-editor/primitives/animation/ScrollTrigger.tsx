/* eslint-disable react-hooks/preserve-manual-memoization */
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { PrimitiveNode, ScrollTriggerProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { toInlineStyle, getNodeProps } from '../types'
import { getAnimationPreset } from '../../animations/presets'
import { getScrollPreset, type ScrollKeyframe } from '../../animations/scroll-presets'

// ============================================
// 모듈 레벨 순수 함수들 (참조 안정성 보장)
// ============================================

// 숫자 보간
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

// Transform 문자열 파싱
function parseTransform(
  transform: string
): Map<string, { value: number; unit: string }> {
  const result = new Map<string, { value: number; unit: string }>()
  if (!transform) return result

  const patterns = [
    /translateX\(([-\d.]+)(px|%|rem|em)?\)/,
    /translateY\(([-\d.]+)(px|%|rem|em)?\)/,
    /translateZ\(([-\d.]+)(px|%|rem|em)?\)/,
    /scale\(([\d.]+)\)/,
    /scaleX\(([\d.]+)\)/,
    /scaleY\(([\d.]+)\)/,
    /rotate\(([-\d.]+)(deg|rad|turn)?\)/,
    /rotateX\(([-\d.]+)(deg|rad|turn)?\)/,
    /rotateY\(([-\d.]+)(deg|rad|turn)?\)/,
    /skewX\(([-\d.]+)(deg)?\)/,
    /skewY\(([-\d.]+)(deg)?\)/,
    /perspective\(([-\d.]+)(px)?\)/,
  ]

  const names = [
    'translateX',
    'translateY',
    'translateZ',
    'scale',
    'scaleX',
    'scaleY',
    'rotate',
    'rotateX',
    'rotateY',
    'skewX',
    'skewY',
    'perspective',
  ]

  patterns.forEach((pattern, i) => {
    const match = transform.match(pattern)
    if (match) {
      result.set(names[i], {
        value: parseFloat(match[1]),
        unit: match[2] || (names[i].includes('scale') ? '' : 'px'),
      })
    }
  })

  return result
}

// Transform Map을 문자열로 변환
function transformToString(
  transforms: Map<string, { value: number; unit: string }>
): string {
  const parts: string[] = []
  transforms.forEach(({ value, unit }, name) => {
    if (name === 'scale' || name === 'scaleX' || name === 'scaleY') {
      parts.push(`${name}(${value})`)
    } else {
      parts.push(`${name}(${value}${unit})`)
    }
  })
  return parts.join(' ')
}

// Transform 보간
function interpolateTransform(
  start: string | undefined,
  end: string | undefined,
  t: number
): string {
  if (!start && !end) return ''
  if (!start) return end || ''
  if (!end) return start

  const startMap = parseTransform(start)
  const endMap = parseTransform(end)
  const result = new Map<string, { value: number; unit: string }>()

  startMap.forEach(({ value: startVal, unit }, name) => {
    const endEntry = endMap.get(name)
    if (endEntry) {
      result.set(name, { value: lerp(startVal, endEntry.value, t), unit })
    } else {
      const defaultVal =
        name === 'scale' || name === 'scaleX' || name === 'scaleY' ? 1 : 0
      result.set(name, { value: lerp(startVal, defaultVal, t), unit })
    }
  })

  endMap.forEach(({ value: endVal, unit }, name) => {
    if (!startMap.has(name)) {
      const defaultVal =
        name === 'scale' || name === 'scaleX' || name === 'scaleY' ? 1 : 0
      result.set(name, { value: lerp(defaultVal, endVal, t), unit })
    }
  })

  return transformToString(result)
}

// Filter 파싱
function parseFilter(
  filter: string
): Map<string, { value: number; unit: string }> {
  const result = new Map<string, { value: number; unit: string }>()
  if (!filter) return result

  const patterns = [
    /blur\(([\d.]+)(px)?\)/,
    /brightness\(([\d.]+)\)/,
    /contrast\(([\d.]+)%?\)/,
    /grayscale\(([\d.]+)%?\)/,
    /saturate\(([\d.]+)%?\)/,
    /sepia\(([\d.]+)%?\)/,
    /hue-rotate\(([\d.]+)(deg)?\)/,
  ]

  const names = [
    'blur',
    'brightness',
    'contrast',
    'grayscale',
    'saturate',
    'sepia',
    'hue-rotate',
  ]

  patterns.forEach((pattern, i) => {
    const match = filter.match(pattern)
    if (match) {
      result.set(names[i], {
        value: parseFloat(match[1]),
        unit: match[2] || (names[i] === 'blur' ? 'px' : ''),
      })
    }
  })

  return result
}

function filterToString(
  filters: Map<string, { value: number; unit: string }>
): string {
  const parts: string[] = []
  filters.forEach(({ value, unit }, name) => {
    parts.push(`${name}(${value}${unit})`)
  })
  return parts.join(' ')
}

function interpolateFilter(
  start: string | undefined,
  end: string | undefined,
  t: number
): string {
  if (!start && !end) return ''
  if (!start) return end || ''
  if (!end) return start

  const startMap = parseFilter(start)
  const endMap = parseFilter(end)
  const result = new Map<string, { value: number; unit: string }>()

  startMap.forEach(({ value: startVal, unit }, name) => {
    const endEntry = endMap.get(name)
    if (endEntry) {
      result.set(name, { value: lerp(startVal, endEntry.value, t), unit })
    } else {
      const defaultVal = name === 'blur' ? 0 : 1
      result.set(name, { value: lerp(startVal, defaultVal, t), unit })
    }
  })

  endMap.forEach(({ value: endVal, unit }, name) => {
    if (!startMap.has(name)) {
      const defaultVal = name === 'blur' ? 0 : 1
      result.set(name, { value: lerp(defaultVal, endVal, t), unit })
    }
  })

  return filterToString(result)
}

// ClipPath 보간 (inset, circle 지원)
function interpolateClipPath(
  start: string | undefined,
  end: string | undefined,
  t: number
): string {
  if (!start && !end) return ''
  if (!start) return end || ''
  if (!end) return start

  // inset(100% 0 0 0) → inset(0 0 0 0)
  const insetMatch = (str: string) =>
    str.match(/inset\(([\d.]+)%?\s+([\d.]+)%?\s+([\d.]+)%?\s+([\d.]+)%?\)/)
  const startInset = insetMatch(start)
  const endInset = insetMatch(end)

  if (startInset && endInset) {
    const values = [1, 2, 3, 4].map((i) =>
      lerp(parseFloat(startInset[i]), parseFloat(endInset[i]), t)
    )
    return `inset(${values[0]}% ${values[1]}% ${values[2]}% ${values[3]}%)`
  }

  // circle(0% at 50% 50%) → circle(100% at 50% 50%)
  const circleMatch = (str: string) =>
    str.match(/circle\(([\d.]+)%\s+at\s+([\d.]+)%\s+([\d.]+)%\)/)
  const startCircle = circleMatch(start)
  const endCircle = circleMatch(end)

  if (startCircle && endCircle) {
    const radius = lerp(
      parseFloat(startCircle[1]),
      parseFloat(endCircle[1]),
      t
    )
    const x = lerp(parseFloat(startCircle[2]), parseFloat(endCircle[2]), t)
    const y = lerp(parseFloat(startCircle[3]), parseFloat(endCircle[3]), t)
    return `circle(${radius}% at ${x}% ${y}%)`
  }

  return t > 0.5 ? end : start
}

// ============================================
// 컴포넌트
// ============================================

export function ScrollTrigger({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const props = getNodeProps<ScrollTriggerProps>(node)
  const style = toInlineStyle(node.style)
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const isSelected = context.mode === 'edit' && context.selectedNodeId === node.id

  // 가장 가까운 스크롤 가능한 부모 요소 찾기
  const findScrollParent = useCallback((element: HTMLElement | null): HTMLElement | Window => {
    if (!element) return window

    let parent = element.parentElement
    while (parent) {
      const { overflow, overflowY } = getComputedStyle(parent)
      if (
        overflow === 'auto' ||
        overflow === 'scroll' ||
        overflowY === 'auto' ||
        overflowY === 'scroll'
      ) {
        // 실제로 스크롤 가능한지 확인 (scrollHeight > clientHeight)
        if (parent.scrollHeight > parent.clientHeight) {
          return parent
        }
      }
      parent = parent.parentElement
    }
    return window
  }, [])

  // Scroll progress 계산
  useEffect(() => {
    if (!ref.current || context.mode === 'edit') return

    const scrollParent = findScrollParent(ref.current)
    const isWindow = scrollParent === window

    const handleScroll = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()

      // 스크롤 컨테이너의 뷰포트 높이 계산
      let viewportHeight: number
      let viewportTop: number

      if (isWindow) {
        viewportHeight = window.innerHeight
        viewportTop = 0
      } else {
        const containerRect = (scrollParent as HTMLElement).getBoundingClientRect()
        viewportHeight = containerRect.height
        viewportTop = containerRect.top
      }

      // 요소의 상대적 위치 계산 (컨테이너 기준)
      const relativeTop = rect.top - viewportTop

      // 요소가 화면에 들어오는 비율 계산
      const start = viewportHeight // 화면 하단에서 시작
      const end = -rect.height // 화면 상단을 벗어날 때 종료

      const currentProgress = (start - relativeTop) / (start - end)
      const clampedProgress = Math.max(0, Math.min(1, currentProgress))

      setProgress(clampedProgress)
    }

    // 스크롤 이벤트 등록
    scrollParent.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 초기값 설정

    return () => scrollParent.removeEventListener('scroll', handleScroll)
  }, [context.mode, findScrollParent])

  // Get animation preset
  const preset = props.animation?.preset
    ? getAnimationPreset(props.animation.preset)
    : null

  // Scrub 모드에서 스타일 계산
  const getScrubStyle = useCallback((): React.CSSProperties => {
    if (!props.scrub) return {}

    // 스크롤 프리셋 또는 일반 애니메이션 프리셋에서 keyframes 가져오기
    let keyframes: ScrollKeyframe[] | Keyframe[] = []

    // 스크롤 프리셋 이름으로 검색
    const scrollPreset = props.animation?.preset
      ? getScrollPreset(props.animation.preset as Parameters<typeof getScrollPreset>[0])
      : null

    if (scrollPreset) {
      keyframes = scrollPreset.keyframes
    } else if (preset) {
      keyframes = preset.keyframes
    }

    if (keyframes.length === 0) return {}

    const firstFrame = keyframes[0] as ScrollKeyframe
    const lastFrame = keyframes[keyframes.length - 1] as ScrollKeyframe

    const result: React.CSSProperties = {}

    // Opacity 보간
    if (firstFrame.opacity !== undefined || lastFrame.opacity !== undefined) {
      const startOpacity = firstFrame.opacity ?? 1
      const endOpacity = lastFrame.opacity ?? 1
      result.opacity = lerp(startOpacity, endOpacity, progress)
    }

    // Transform 보간
    const transformResult = interpolateTransform(
      firstFrame.transform,
      lastFrame.transform,
      progress
    )
    if (transformResult) {
      result.transform = transformResult
    }

    // Filter 보간
    const filterResult = interpolateFilter(
      firstFrame.filter,
      lastFrame.filter,
      progress
    )
    if (filterResult) {
      result.filter = filterResult
    }

    // ClipPath 보간
    const clipPathResult = interpolateClipPath(
      firstFrame.clipPath,
      lastFrame.clipPath,
      progress
    )
    if (clipPathResult) {
      result.clipPath = clipPathResult
      result.WebkitClipPath = clipPathResult // Safari 지원
    }

    return result
  }, [preset, props.animation?.preset, props.scrub, progress])

  const containerStyle: React.CSSProperties = {
    ...style,
    ...(props.scrub ? getScrubStyle() : {}),
    ...(props.pin
      ? {
          position: 'sticky' as const,
          top: 0,
        }
      : {}),
    outline: isSelected ? '2px solid #3b82f6' : undefined,
  }

  // 개발 모드에서 마커 표시
  const showMarkers = props.markers && context.mode === 'edit'

  return (
    <div
      ref={ref}
      data-node-id={node.id}
      data-node-type="scroll-trigger"
      data-progress={progress.toFixed(2)}
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
      {showMarkers && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '4px 8px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            fontSize: '12px',
            borderRadius: '4px',
            zIndex: 100,
          }}
        >
          Progress: {(progress * 100).toFixed(0)}%
        </div>
      )}
      {node.children?.map((child) => context.renderNode(child))}
    </div>
  )
}

export const scrollTriggerRenderer: PrimitiveRenderer<ScrollTriggerProps> = {
  type: 'scroll-trigger',
  render: (node, context) => (
    <ScrollTrigger key={node.id} node={node} context={context} />
  ),
  editableProps: [
    {
      key: 'animation.preset',
      label: '애니메이션',
      type: 'select',
      options: [
        // 기본 등장
        { value: 'scroll-fade-in', label: '페이드 인' },
        { value: 'scroll-slide-up', label: '슬라이드 업' },
        { value: 'scroll-slide-down', label: '슬라이드 다운' },
        { value: 'scroll-slide-left', label: '슬라이드 왼쪽' },
        { value: 'scroll-slide-right', label: '슬라이드 오른쪽' },
        { value: 'scroll-scale-in', label: '스케일 인' },
        // PPT 스타일
        { value: 'scroll-blur-in', label: '블러 인' },
        { value: 'scroll-rotate-in', label: '회전 인' },
        { value: 'scroll-flip-in', label: '플립 인' },
        { value: 'clip-reveal-up', label: '클립 업' },
        { value: 'clip-reveal-down', label: '클립 다운' },
        { value: 'clip-reveal-circle', label: '원형 리빌' },
        // Parallax
        { value: 'parallax-slow', label: '패럴랙스 (느림)' },
        { value: 'parallax-fast', label: '패럴랙스 (빠름)' },
        { value: 'parallax-zoom', label: '패럴랙스 줌' },
        // 기존 프리셋 호환
        { value: 'fade-in', label: '기본 페이드 인' },
        { value: 'slide-up', label: '기본 슬라이드 업' },
        { value: 'scale-in', label: '기본 스케일 인' },
      ],
      defaultValue: 'scroll-fade-in',
    },
    {
      key: 'scrub',
      label: '스크롤 연동',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'pin',
      label: '고정 (Sticky)',
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'markers',
      label: '마커 표시 (개발용)',
      type: 'boolean',
      defaultValue: false,
    },
  ],
}

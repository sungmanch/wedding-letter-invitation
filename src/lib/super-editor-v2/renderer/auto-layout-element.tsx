'use client'

/**
 * Auto Layout Element Renderer
 *
 * Flexbox 기반 Auto Layout 요소 렌더링
 * - hug/fill/fixed 크기 모드 지원
 * - min/max 제약 조건 지원
 * - alignSelf 지원
 */

import { useMemo, useCallback, type CSSProperties } from 'react'
import type {
  Element,
  ElementStyle,
  TextProps,
  ImageProps,
  ShapeProps,
  ButtonProps,
  IconProps,
  DividerProps,
  MapProps,
  CalendarProps,
  GradientValue,
} from '../schema/types'
import { useDocument } from '../context/document-context'
import { resolveBinding } from '../utils/binding-resolver'
import { interpolate } from '../utils/interpolate'
import { getAutoLayoutElementStyle } from '../utils/size-resolver'

// Element Components
import { TextElement } from '../components/elements/text-element'
import { ImageElement } from '../components/elements/image-element'
import { ShapeElement } from '../components/elements/shape-element'
import { ButtonElement } from '../components/elements/button-element'
import { IconElement } from '../components/elements/icon-element'
import { DividerElement } from '../components/elements/divider-element'
import { MapElement } from '../components/elements/map-element'
import { CalendarElement } from '../components/elements/calendar-element'

// ============================================
// Types
// ============================================

export interface AutoLayoutElementProps {
  element: Element
  editable?: boolean
  onClick?: (elementId: string) => void
}

// ============================================
// Main Component
// ============================================

export function AutoLayoutElement({
  element,
  editable = false,
  onClick,
}: AutoLayoutElementProps) {
  const { data } = useDocument()

  // 요소 값 해석 (바인딩 또는 직접 값)
  const resolvedValue = useMemo(() => {
    if (element.binding) {
      return resolveBinding(data, element.binding)
    }
    return element.value ?? (element as { content?: string }).content
  }, [element.binding, element.value, data, element])

  // 포맷 문자열 처리 (TextProps의 format)
  const formattedValue = useMemo(() => {
    if (element.props?.type === 'text' && (element.props as TextProps).format) {
      return interpolate((element.props as TextProps).format!, data)
    }
    return resolvedValue
  }, [element.props, resolvedValue, data])

  // Auto Layout 요소 스타일 계산
  const elementStyle = useMemo<CSSProperties>(() => {
    // 기본 Auto Layout 스타일
    const style = getAutoLayoutElementStyle(element)

    // 요소별 스타일 적용
    if (element.style) {
      Object.assign(style, resolveElementStyle(element.style))
    }

    // 편집 모드 스타일
    if (editable) {
      style.cursor = 'pointer'
      style.boxSizing = 'border-box'
    }

    return style
  }, [element, editable])

  // 클릭 핸들러
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(element.id)
  }, [element.id, onClick])

  return (
    <div
      className={`se2-element se2-element--${element.type} se2-element--auto`}
      data-element-id={element.id}
      data-element-type={element.type}
      data-layout-mode="auto"
      style={elementStyle}
      onClick={editable ? handleClick : undefined}
    >
      <ElementTypeRenderer
        element={element}
        value={formattedValue}
        editable={editable}
      />
    </div>
  )
}

// ============================================
// Element Type Renderer
// ============================================

interface ElementTypeRendererProps {
  element: Element
  value: unknown
  editable: boolean
}

/**
 * 요소가 hug 모드인지 확인
 */
function isHugMode(element: Element): boolean {
  const sizing = element.sizing
  if (!sizing) return true // Auto Layout에서 기본값은 hug

  const widthIsHug = !sizing.width || sizing.width.type === 'hug'
  const heightIsHug = !sizing.height || sizing.height.type === 'hug'

  return widthIsHug || heightIsHug
}

function ElementTypeRenderer({ element, value, editable }: ElementTypeRendererProps) {
  const props = element.props
  const elementType = element.type || props?.type
  const hugMode = isHugMode(element)

  if (!elementType) {
    return (
      <div className="se2-element--unknown">
        Unknown element (no type)
      </div>
    )
  }

  switch (elementType) {
    case 'text':
      return (
        <TextElement
          value={value as string}
          style={element.style?.text}
          editable={editable}
          hugMode={hugMode}
        />
      )

    case 'image':
      return (
        <ImageElement
          src={value as string}
          objectFit={(props as ImageProps).objectFit}
          overlay={(props as ImageProps).overlay}
          style={element.style}
          editable={editable}
        />
      )

    case 'shape':
      return (
        <ShapeElement
          shape={(props as ShapeProps).shape}
          fill={(props as ShapeProps).fill}
          stroke={(props as ShapeProps).stroke}
          strokeWidth={(props as ShapeProps).strokeWidth}
          svgPath={(props as ShapeProps).svgPath}
          svgViewBox={(props as ShapeProps).svgViewBox}
          style={element.style}
        />
      )

    case 'button':
      return (
        <ButtonElement
          hugMode={hugMode}
          label={(props as ButtonProps).label}
          action={(props as ButtonProps).action}
          value={value}
          style={element.style}
          editable={editable}
        />
      )

    case 'icon':
      return (
        <IconElement
          icon={(props as IconProps).icon}
          size={(props as IconProps).size}
          color={(props as IconProps).color}
        />
      )

    case 'divider':
      return (
        <DividerElement
          dividerStyle={(props as DividerProps).dividerStyle}
          ornamentId={(props as DividerProps).ornamentId}
          style={element.style}
        />
      )

    case 'map':
      return (
        <MapElement
          value={value}
          zoom={(props as MapProps).zoom}
          showMarker={(props as MapProps).showMarker}
          style={element.style}
        />
      )

    case 'calendar':
      return (
        <CalendarElement
          value={value}
          showDday={(props as CalendarProps).showDday}
          highlightColor={(props as CalendarProps).highlightColor}
          markerType={(props as CalendarProps).markerType}
          style={element.style}
        />
      )

    default:
      return (
        <div className="se2-element--unknown">
          Unknown element type: {elementType}
        </div>
      )
  }
}

// ============================================
// Style Resolution
// ============================================

function resolveElementStyle(style: ElementStyle): CSSProperties {
  const css: CSSProperties = {}

  // 배경
  if (style.background) {
    if (typeof style.background === 'string') {
      css.backgroundColor = style.background
    } else {
      css.background = gradientToCSS(style.background)
    }
  }

  // 보더
  if (style.border) {
    css.borderWidth = style.border.width
    css.borderColor = style.border.color
    css.borderStyle = style.border.style
    css.borderRadius = style.border.radius
  }

  // 그림자
  if (style.shadow) {
    css.boxShadow = style.shadow
  }

  // 투명도
  if (style.opacity !== undefined) {
    css.opacity = style.opacity
  }

  return css
}

function gradientToCSS(gradient: GradientValue): string {
  const stops = gradient.stops
    .map(s => `${s.color} ${s.position}%`)
    .join(', ')

  if (gradient.type === 'linear') {
    return `linear-gradient(${gradient.angle ?? 180}deg, ${stops})`
  } else if (gradient.type === 'radial') {
    const shape = gradient.shape ?? 'circle'
    const position = gradient.position ?? 'center'
    return `radial-gradient(${shape} at ${position}, ${stops})`
  } else {
    return `conic-gradient(from ${gradient.angle ?? 0}deg, ${stops})`
  }
}

// ============================================
// Exports
// ============================================

export { AutoLayoutElement as default }

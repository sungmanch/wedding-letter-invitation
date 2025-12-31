'use client'

/**
 * Element Renderer - 요소 렌더링
 *
 * 8개 ElementType을 렌더링
 * 변수 바인딩, 스타일, 애니메이션 적용
 */

import { useMemo, useCallback, type CSSProperties } from 'react'
import type {
  Element,
  ElementType,
  ElementStyle,
  ElementProps,
  TextProps,
  ImageProps,
  ShapeProps,
  ButtonProps,
  IconProps,
  DividerProps,
  MapProps,
  CalendarProps,
  GroupProps,
  GradientValue,
} from '../schema/types'
import { useDocument } from '../context/document-context'
import { useBlock } from '../context/block-context'
import { resolveBinding } from '../utils/binding-resolver'
import { interpolate } from '../utils/interpolate'
import { getElementPosition } from '../utils/size-resolver'

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

export interface ElementRendererProps {
  element: Element
  editable?: boolean
  onClick?: (elementId: string) => void
}

// ============================================
// Main Component
// ============================================

export function ElementRenderer({
  element,
  editable = false,
  onClick,
}: ElementRendererProps) {
  const { data, activeBlockId, viewport } = useDocument()
  const { blockId, isActive: isBlockActive, height: blockHeight } = useBlock()

  // 요소 값 해석 (바인딩 또는 직접 값)
  // content 필드도 확인 (일부 요소는 value 대신 content 사용)
  const resolvedValue = useMemo(() => {
    if (element.binding) {
      return resolveBinding(data, element.binding)
    }
    // value가 없으면 content 필드 확인
    return element.value ?? (element as { content?: string }).content
  }, [element.binding, element.value, data, element])

  // 포맷 문자열 처리 (TextProps의 format)
  const formattedValue = useMemo(() => {
    if (element.props?.type === 'text' && (element.props as TextProps).format) {
      return interpolate((element.props as TextProps).format!, data)
    }
    return resolvedValue
  }, [element.props, resolvedValue, data])

  // 요소 스타일 계산 (블록 기준)
  const elementStyle = useMemo<CSSProperties>(() => {
    // 블록 높이를 px로 계산
    const blockHeightPx = (blockHeight / 100) * viewport.height

    // 요소 위치/크기 가져오기 (optional 필드 처리)
    const pos = getElementPosition(element)

    // width/height: 루트 필드 우선, 없으면 style.size에서 가져옴
    const elemWidth = pos.width ?? element.style?.size?.width ?? 0
    const elemHeight = pos.height ?? element.style?.size?.height ?? 0

    // x, width는 viewport.width 기준 (가로는 블록과 동일)
    const leftPx = (pos.x / 100) * viewport.width
    const widthPx = (elemWidth / 100) * viewport.width

    // y, height는 블록 높이 기준 (블록 내 상대 위치)
    const topPx = (pos.y / 100) * blockHeightPx
    const heightPx = (elemHeight / 100) * blockHeightPx

    const style: CSSProperties = {
      position: 'absolute',
      left: `${leftPx}px`,
      top: `${topPx}px`,
      width: `${widthPx}px`,
      height: `${heightPx}px`,
      zIndex: element.zIndex,
    }

    // 회전
    if (element.rotation) {
      style.transform = `rotate(${element.rotation}deg)`
    }

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
  }, [element, editable, viewport, blockHeight])

  // 클릭 핸들러
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(element.id)
  }, [element.id, onClick])

  return (
    <div
      className={`se2-element se2-element--${element.type}`}
      data-element-id={element.id}
      data-element-type={element.type}
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

function ElementTypeRenderer({ element, value, editable }: ElementTypeRendererProps) {
  const props = element.props
  // element.type을 우선 사용, props.type은 fallback
  const elementType = element.type || props?.type

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
      console.log('[ElementRenderer] 🗺️ map element:', {
        elementId: element.id,
        binding: element.binding,
        value,
        valueType: typeof value,
      })
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

    case 'group':
      return (
        <GroupElement
          element={element}
          layout={(props as GroupProps).layout}
          editable={editable}
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
// Group Element Component
// ============================================

interface GroupElementProps {
  element: Element
  layout?: GroupProps['layout']
  editable: boolean
}

function GroupElement({ element, layout, editable }: GroupElementProps) {
  const groupStyle = useMemo<CSSProperties>(() => {
    const direction = layout?.direction ?? 'vertical'
    const reverse = layout?.reverse ?? false

    let flexDirection: CSSProperties['flexDirection']
    if (direction === 'horizontal') {
      flexDirection = reverse ? 'row-reverse' : 'row'
    } else {
      flexDirection = reverse ? 'column-reverse' : 'column'
    }

    return {
      display: 'flex',
      flexDirection,
      gap: layout?.gap ? `${layout.gap}px` : undefined,
      alignItems: layout?.alignItems ?? 'stretch',
      justifyContent: layout?.justifyContent ?? 'start',
      width: '100%',
      height: '100%',
    }
  }, [layout])

  const children = element.children ?? []

  return (
    <div className="se2-group" style={groupStyle}>
      {children.map((child) => (
        <GroupChildElement
          key={child.id}
          element={child}
          editable={editable}
        />
      ))}
    </div>
  )
}

// ============================================
// Group Child Element (재귀적 렌더링)
// ============================================

interface GroupChildElementProps {
  element: Element
  editable: boolean
}

function GroupChildElement({ element, editable }: GroupChildElementProps) {
  const { data } = useDocument()
  const props = element.props
  const elementType = element.type || props?.type

  // 값 해석
  const resolvedValue = useMemo(() => {
    if (element.binding) {
      return resolveBinding(data, element.binding)
    }
    return element.value ?? (element as { content?: string }).content
  }, [element.binding, element.value, data, element])

  const formattedValue = useMemo(() => {
    if (props?.type === 'text' && (props as TextProps).format) {
      return interpolate((props as TextProps).format!, data)
    }
    return resolvedValue
  }, [props, resolvedValue, data])

  const value = formattedValue

  switch (elementType) {
    case 'text':
      return (
        <TextElement
          value={value as string}
          style={element.style?.text}
          editable={editable}
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

    case 'group':
      return (
        <GroupElement
          element={element}
          layout={(props as GroupProps).layout}
          editable={editable}
        />
      )

    default:
      return null
  }
}

// ============================================
// Exports
// ============================================

export { ElementRenderer as default }

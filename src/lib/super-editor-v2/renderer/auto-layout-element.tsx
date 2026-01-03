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
  GroupProps,
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
      console.log('[AutoLayoutElement] 🗺️ map element:', {
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
// Group Element Component
// ============================================

interface GroupElementProps {
  element: Element
  layout?: GroupProps['layout']
  editable: boolean
}

// 갤러리 설정 타입
interface GalleryConfig {
  columns: 2 | 3
  aspectRatio: '1:1' | '3:4' | 'mixed'
  gap: number
  initialRows: number
  showMoreButton: boolean
}

function GroupElement({ element, layout, editable }: GroupElementProps) {
  const { data } = useDocument()

  // 갤러리 바인딩 처리
  const galleryImages = useMemo(() => {
    if (element.binding === 'photos.gallery') {
      const images = resolveBinding(data, 'photos.gallery')
      if (Array.isArray(images)) {
        return images as string[]
      }
    }
    return null
  }, [element.binding, data])

  // 갤러리 설정
  const galleryConfig = useMemo(() => {
    // @ts-expect-error - gallery는 확장 props
    return element.props?.gallery as GalleryConfig | undefined
  }, [element.props])

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
      flexWrap: layout?.wrap ? 'wrap' : undefined,
      gap: layout?.gap ? `${layout.gap}px` : undefined,
      alignItems: layout?.alignItems ?? 'stretch',
      justifyContent: layout?.justifyContent ?? 'start',
      width: '100%',
      height: '100%',
    }
  }, [layout])

  // 갤러리 모드: 이미지 배열을 그리드로 렌더링
  if (galleryImages && galleryConfig) {
    const { columns, aspectRatio, gap, initialRows } = galleryConfig
    const initialCount = columns * initialRows
    const visibleImages = galleryImages.slice(0, initialCount)

    // aspect ratio를 padding-bottom %로 변환
    const aspectRatioPercent = aspectRatio === '1:1' ? 100
      : aspectRatio === '3:4' ? 133.33
      : 100

    return (
      <div
        className="se2-gallery-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
          width: '100%',
        }}
      >
        {visibleImages.map((imageUrl, index) => (
          <div
            key={`gallery-${index}`}
            className="se2-gallery-item"
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: `${aspectRatioPercent}%`,
              overflow: 'hidden',
              borderRadius: '4px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <ImageElement
                src={imageUrl}
                objectFit="cover"
                style={{}}
                editable={editable}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 일반 그룹: children 렌더링
  const children = element.children ?? []

  // absolute 자식이 있는지 확인
  const hasAbsoluteChildren = children.some(child => child.layoutMode === 'absolute')

  // absolute 자식이 있으면 position: relative 추가
  const finalGroupStyle: CSSProperties = {
    ...groupStyle,
    ...(hasAbsoluteChildren && { position: 'relative' as const }),
  }

  return (
    <div className="se2-group" style={finalGroupStyle}>
      {children.map((child) => {
        // absolute 자식은 별도 처리
        if (child.layoutMode === 'absolute') {
          return (
            <AbsoluteChildElement
              key={child.id}
              element={child}
              editable={editable}
            />
          )
        }
        return (
          <AutoLayoutElement
            key={child.id}
            element={child}
            editable={editable}
          />
        )
      })}
    </div>
  )
}

// ============================================
// Absolute Child Element (Group 내부 absolute 자식)
// ============================================

interface AbsoluteChildElementProps {
  element: Element
  editable: boolean
}

function AbsoluteChildElement({ element, editable }: AbsoluteChildElementProps) {
  const { data } = useDocument()

  // 요소 값 해석
  const resolvedValue = useMemo(() => {
    if (element.binding) {
      return resolveBinding(data, element.binding)
    }
    return element.value ?? (element as { content?: string }).content
  }, [element.binding, element.value, data, element])

  // 포맷 문자열 처리
  const formattedValue = useMemo(() => {
    if (element.props?.type === 'text' && (element.props as TextProps).format) {
      return interpolate((element.props as TextProps).format!, data)
    }
    return resolvedValue
  }, [element.props, resolvedValue, data])

  // absolute 스타일 계산 (% 단위로 중앙 정렬)
  const absoluteStyle = useMemo<CSSProperties>(() => {
    const style: CSSProperties = {
      position: 'absolute',
      zIndex: element.zIndex ?? 0,
    }

    // x, y가 50이면 중앙 정렬로 해석
    if (element.x === 50 && element.y === 50) {
      style.top = '50%'
      style.left = '50%'
      style.transform = 'translate(-50%, -50%)'
    } else {
      // 그 외에는 % 단위로 위치 지정
      if (element.x !== undefined) {
        style.left = `${element.x}%`
      }
      if (element.y !== undefined) {
        style.top = `${element.y}%`
      }
    }

    return style
  }, [element])

  return (
    <div
      className={`se2-element se2-element--${element.type} se2-element--absolute-child`}
      data-element-id={element.id}
      data-element-type={element.type}
      data-layout-mode="absolute"
      style={absoluteStyle}
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

  // 패딩
  if (style.padding) {
    if (typeof style.padding === 'number') {
      css.padding = `${style.padding}px`
    } else {
      css.paddingTop = style.padding.top ? `${style.padding.top}px` : undefined
      css.paddingRight = style.padding.right ? `${style.padding.right}px` : undefined
      css.paddingBottom = style.padding.bottom ? `${style.padding.bottom}px` : undefined
      css.paddingLeft = style.padding.left ? `${style.padding.left}px` : undefined
    }
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

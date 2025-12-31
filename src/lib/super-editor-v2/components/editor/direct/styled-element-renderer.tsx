'use client'

/**
 * Styled Element Renderer
 *
 * EditableCanvas에서 실제 스타일을 적용하여 요소를 렌더링
 * DefaultElementRenderer 대신 사용하여 폼 모드와 동일한 렌더링 결과 제공
 */

import { useMemo } from 'react'
import type { Element, Block, TextProps, ImageProps, ShapeProps, DividerProps, CalendarProps, MapProps } from '../../../schema/types'
import { useDocument } from '../../../context/document-context'
import { resolveBinding } from '../../../utils/binding-resolver'
import { interpolate } from '../../../utils/interpolate'
import { pxToRem } from '../../../utils'

// Element Components
import { TextElement } from '../../elements/text-element'
import { ImageElement } from '../../elements/image-element'
import { ShapeElement } from '../../elements/shape-element'
import { DividerElement } from '../../elements/divider-element'
import { CalendarElement } from '../../elements/calendar-element'
import { MapElement } from '../../elements/map-element'

// ============================================
// Types
// ============================================

export interface StyledElementRendererProps {
  element: Element
  block: Block
}

// ============================================
// Component
// ============================================

export function StyledElementRenderer({ element, block }: StyledElementRendererProps) {
  const { data } = useDocument()

  // 요소 값 해석 (바인딩 또는 직접 값)
  const resolvedValue = useMemo(() => {
    if (element.binding) {
      return resolveBinding(data, element.binding)
    }
    return element.value
  }, [element.binding, element.value, data])

  // 포맷 문자열 처리 (TextProps의 format)
  const formattedValue = useMemo(() => {
    if (element.props?.type === 'text' && (element.props as TextProps).format) {
      return interpolate((element.props as TextProps).format!, data)
    }
    return resolvedValue
  }, [element.props, resolvedValue, data])

  const props = element.props
  const elementType = element.type || props?.type

  if (!elementType) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
        Unknown
      </div>
    )
  }

  switch (elementType) {
    case 'text':
      return (
        <TextElement
          value={formattedValue as string}
          style={element.style?.text}
          editable
        />
      )

    case 'image':
      return (
        <ImageElement
          src={formattedValue as string}
          objectFit={(props as ImageProps)?.objectFit}
          overlay={(props as ImageProps)?.overlay}
          style={element.style}
          editable
        />
      )

    case 'shape':
      return (
        <ShapeElement
          shape={(props as ShapeProps)?.shape}
          fill={(props as ShapeProps)?.fill}
          stroke={(props as ShapeProps)?.stroke}
          strokeWidth={(props as ShapeProps)?.strokeWidth}
          svgPath={(props as ShapeProps)?.svgPath}
          style={element.style}
        />
      )

    case 'divider': {
      const dividerProps = props as DividerProps
      return (
        <DividerElement
          dividerStyle={dividerProps?.dividerStyle || 'solid'}
          ornamentId={dividerProps?.ornamentId}
          style={element.style}
        />
      )
    }

    case 'button':
      return (
        <div
          className="w-full h-full flex items-center justify-center rounded"
          style={{
            backgroundColor: element.style?.background as string || '#C9A962',
            color: element.style?.text?.color || '#fff',
            // 접근성: px → rem 변환
            fontSize: element.style?.text?.fontSize ? pxToRem(element.style.text.fontSize) : '0.875rem',
            fontFamily: element.style?.text?.fontFamily,
          }}
        >
          {formattedValue as string || '버튼'}
        </div>
      )

    case 'icon':
      return (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ color: element.style?.text?.color || '#000' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
      )

    case 'map': {
      const mapProps = props as MapProps
      console.log('[StyledElementRenderer] 🗺️ map element:', {
        binding: element.binding,
        resolvedValue,
        formattedValue,
        formattedValueType: typeof formattedValue,
      })
      return (
        <div style={{ pointerEvents: 'none' }}>
          <MapElement
            value={formattedValue}
            zoom={mapProps?.zoom}
            showMarker={mapProps?.showMarker}
            style={element.style}
          />
        </div>
      )
    }

    case 'calendar': {
      const calendarProps = props as CalendarProps
      return (
        <div style={{ pointerEvents: 'none' }}>
          <CalendarElement
            value={formattedValue}
            showDday={calendarProps?.showDday}
            highlightColor={calendarProps?.highlightColor}
            style={element.style}
          />
        </div>
      )
    }

    default:
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 text-gray-500 text-xs">
          {elementType}
        </div>
      )
  }
}

// ============================================
// Exports
// ============================================

export { StyledElementRenderer as default }

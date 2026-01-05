'use client'

/**
 * Text Element - 텍스트 요소
 *
 * 변수 바인딩된 텍스트 또는 직접 입력 텍스트 렌더링
 * - Absolute 모드: 부모 컨테이너 100% 채움
 * - Auto Layout (hug) 모드: 콘텐츠에 맞게 크기 조정
 *
 * 접근성: fontSize는 rem 단위로 렌더링하여 사용자 시스템 폰트 설정 존중
 */

import { useMemo, type CSSProperties } from 'react'
import type { TextStyle } from '../../schema/types'
import { pxToRem } from '../../utils'

// ============================================
// Types
// ============================================

export interface TextElementProps {
  value?: string | number | string[] | null
  style?: TextStyle
  editable?: boolean
  className?: string
  /** Auto Layout hug 모드 여부 */
  hugMode?: boolean
  /** 배열 데이터를 리스트로 렌더링 */
  listStyle?: 'bullet' | 'number' | 'none'
}

// ============================================
// Component
// ============================================

export function TextElement({
  value,
  style,
  editable = false,
  className = '',
  hugMode = false,
  listStyle,
}: TextElementProps) {
  // 배열 데이터 여부 확인
  const isArrayValue = Array.isArray(value)

  // 텍스트 스타일 계산
  const textStyle = useMemo<CSSProperties>(() => {
    const css: CSSProperties = {
      // Hug 모드: 콘텐츠에 맞춤, Absolute 모드: 부모 채움
      width: hugMode ? 'auto' : '100%',
      height: hugMode ? 'auto' : '100%',
      whiteSpace: 'pre-wrap',
      wordBreak: 'keep-all',
    }

    // 리스트가 아닌 경우에만 flex 정렬 적용
    if (!isArrayValue || !listStyle || listStyle === 'none') {
      css.display = 'flex'
      css.alignItems = 'center'
      css.justifyContent = style?.textAlign === 'left'
        ? 'flex-start'
        : style?.textAlign === 'right'
          ? 'flex-end'
          : 'center'
    }

    if (style) {
      if (style.fontFamily) css.fontFamily = style.fontFamily

      // fontSize: 숫자면 rem 변환, 문자열(CSS 변수)이면 그대로 사용
      // fontFamily가 CSS 변수인 경우, 해당 font-scale 적용
      if (style.fontSize) {
        const baseFontSize = typeof style.fontSize === 'string'
          ? style.fontSize
          : pxToRem(style.fontSize)

        // fontFamily가 var(--font-display/heading/body/accent)인 경우 scale 적용
        const fontRole = style.fontFamily?.match(/var\(--font-(display|heading|body|accent)\)/)?.[1]
        if (fontRole) {
          css.fontSize = `calc(${baseFontSize} * var(--font-scale-${fontRole}))`
        } else {
          css.fontSize = baseFontSize
        }
      }

      if (style.fontWeight) css.fontWeight = style.fontWeight
      if (style.color) css.color = style.color
      if (style.textAlign) css.textAlign = style.textAlign
      if (style.lineHeight) css.lineHeight = style.lineHeight
      if (style.letterSpacing) css.letterSpacing = style.letterSpacing
      if (style.textShadow) css.textShadow = style.textShadow
      if (style.writingMode) css.writingMode = style.writingMode
      if (style.textOrientation) css.textOrientation = style.textOrientation
    }

    return css
  }, [style, hugMode, isArrayValue, listStyle])

  // 줄바꿈 처리 및 숫자 → 문자열 변환
  const formattedValue = useMemo(() => {
    if (value === null || value === undefined) return ''
    if (Array.isArray(value)) return value // 배열은 그대로 반환
    // 숫자는 문자열로 변환
    return String(value)
  }, [value])

  // null, undefined, 빈 문자열/빈 배열만 empty 처리 (숫자 0은 허용)
  const isEmpty = value === null || value === undefined || value === '' ||
    (Array.isArray(value) && value.length === 0)

  if (isEmpty) {
    return (
      <div
        className={`se2-text-element se2-text-element--empty ${className}`}
        style={textStyle}
      >
        {editable && (
          <span style={{ color: 'var(--fg-muted)', fontStyle: 'italic' }}>
            텍스트를 입력하세요
          </span>
        )}
      </div>
    )
  }

  // 배열 데이터를 리스트로 렌더링
  if (isArrayValue && listStyle && listStyle !== 'none') {
    const items = formattedValue as string[]
    return (
      <ul
        className={`se2-text-element se2-text-element--list ${className}`}
        style={{
          ...textStyle,
          listStyleType: listStyle === 'bullet' ? 'disc' : 'decimal',
          paddingLeft: '1.25em',
          margin: 0,
        }}
      >
        {items.map((item, index) => (
          <li key={index} style={{ marginBottom: index < items.length - 1 ? '0.25em' : 0 }}>
            {item}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div
      className={`se2-text-element ${className}`}
      style={textStyle}
    >
      {formattedValue}
    </div>
  )
}

// ============================================
// Exports
// ============================================

export { TextElement as default }

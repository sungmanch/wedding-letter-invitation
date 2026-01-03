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
  value?: string | number | null
  style?: TextStyle
  editable?: boolean
  className?: string
  /** Auto Layout hug 모드 여부 */
  hugMode?: boolean
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
}: TextElementProps) {
  // 텍스트 스타일 계산
  const textStyle = useMemo<CSSProperties>(() => {
    const css: CSSProperties = {
      // Hug 모드: 콘텐츠에 맞춤, Absolute 모드: 부모 채움
      width: hugMode ? 'auto' : '100%',
      height: hugMode ? 'auto' : '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: style?.textAlign === 'left'
        ? 'flex-start'
        : style?.textAlign === 'right'
          ? 'flex-end'
          : 'center',
      whiteSpace: 'pre-wrap',
      wordBreak: 'keep-all',
    }

    if (style) {
      if (style.fontFamily) css.fontFamily = style.fontFamily
      // fontSize: 숫자면 rem 변환, 문자열(CSS 변수)이면 그대로 사용
      if (style.fontSize) {
        css.fontSize = typeof style.fontSize === 'string'
          ? style.fontSize
          : pxToRem(style.fontSize)
      }
      if (style.fontWeight) css.fontWeight = style.fontWeight
      if (style.color) css.color = style.color
      if (style.textAlign) css.textAlign = style.textAlign
      if (style.lineHeight) css.lineHeight = style.lineHeight
      if (style.letterSpacing) css.letterSpacing = style.letterSpacing
      if (style.textShadow) css.textShadow = style.textShadow
    }

    return css
  }, [style, hugMode])

  // 줄바꿈 처리 및 숫자 → 문자열 변환
  const formattedValue = useMemo(() => {
    if (value === null || value === undefined) return ''
    // 숫자는 문자열로 변환
    return String(value)
  }, [value])

  // null, undefined, 빈 문자열만 empty 처리 (숫자 0은 허용)
  const isEmpty = value === null || value === undefined || value === ''

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

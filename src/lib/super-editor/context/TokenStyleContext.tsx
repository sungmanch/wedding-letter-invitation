'use client'

/**
 * Super Editor - Token Style Context
 * 디자인 토큰을 React 컴포넌트에 제공하는 컨텍스트
 */

import { createContext, useContext, useMemo, useEffect, type ReactNode } from 'react'
import type { SemanticDesignTokens } from '../tokens/schema'
import type { StyleSchema, CustomStyles, CustomKeyframe, CustomClassDefinition } from '../schema/style'
import { resolveTokens } from '../tokens/resolver'
import { generateCssVariables, tokenRefToCssVar } from '../tokens/css-generator'
import { DEFAULT_TOKENS } from '../tokens/schema'
import { extractFontsFromStyle, loadFontsDynamically } from '../fonts/loader'

// ============================================
// Context Type
// ============================================

interface TokenStyleContextValue {
  // 해석된 토큰
  tokens: SemanticDesignTokens
  // CSS Variables 문자열
  cssVariables: string
  // 토큰 참조를 CSS var()로 변환
  resolveTokenRef: (ref: string) => string
  // 토큰 값 직접 가져오기
  getTokenValue: (path: string) => string | number | undefined
  // 커스텀 스타일 (keyframes, classes)
  customStyles?: CustomStyles
  // 커스텀 keyframes 이름 목록
  customKeyframeNames: string[]
  // 커스텀 클래스 이름 목록
  customClassNames: string[]
}

// ============================================
// Context
// ============================================

const TokenStyleContext = createContext<TokenStyleContextValue | null>(null)

// ============================================
// Provider
// ============================================

interface TokenStyleProviderProps {
  style: StyleSchema
  children: ReactNode
}

export function TokenStyleProvider({ style, children }: TokenStyleProviderProps) {
  const value = useMemo(() => {
    const tokens = resolveTokens(style)
    const cssVariables = generateCssVariables(tokens)
    const customStyles = style.customStyles

    // 커스텀 스타일 CSS 생성
    const customCss = generateCustomStylesCss(customStyles)

    return {
      tokens,
      cssVariables: cssVariables + customCss,
      resolveTokenRef: (ref: string) => tokenRefToCssVar(ref),
      getTokenValue: (path: string) => getTokenValueByPath(tokens, path),
      customStyles,
      customKeyframeNames: customStyles?.keyframes ? Object.keys(customStyles.keyframes) : [],
      customClassNames: customStyles?.classes ? Object.keys(customStyles.classes) : [],
    }
  }, [style])

  // 스타일 변경 시 사용된 폰트 동적 로드
  useEffect(() => {
    const fonts = extractFontsFromStyle(style)
    if (fonts.length > 0) {
      loadFontsDynamically(fonts).catch(console.error)
    }
  }, [style])

  return (
    <TokenStyleContext.Provider value={value}>
      {/* CSS Variables + Custom Styles 주입 */}
      <style dangerouslySetInnerHTML={{ __html: value.cssVariables }} />
      {children}
    </TokenStyleContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

export function useTokenStyle(): TokenStyleContextValue {
  const context = useContext(TokenStyleContext)

  if (!context) {
    // 컨텍스트 없이 사용 시 기본값 반환
    return {
      tokens: DEFAULT_TOKENS,
      cssVariables: '',
      resolveTokenRef: tokenRefToCssVar,
      getTokenValue: (path: string) => getTokenValueByPath(DEFAULT_TOKENS, path),
      customStyles: undefined,
      customKeyframeNames: [],
      customClassNames: [],
    }
  }

  return context
}

// ============================================
// Helper Functions
// ============================================

/**
 * 토큰 경로로 값 가져오기
 * e.g., "colors.brand" → tokens.colors.brand
 */
function getTokenValueByPath(
  tokens: SemanticDesignTokens,
  path: string
): string | number | undefined {
  const parts = path.split('.')
  let current: unknown = tokens

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

  if (typeof current === 'string' || typeof current === 'number') {
    return current
  }

  return undefined
}

// tokenStyle 관련 헬퍼는 primitives/types.ts에 있음
// resolveTokenStyle, mergeNodeStyles 사용

// ============================================
// Custom Styles CSS Generator
// ============================================

/**
 * CSSProperties 객체를 CSS 문자열로 변환
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
 * 커스텀 키프레임을 CSS @keyframes로 변환
 */
function keyframesToCss(name: string, keyframes: CustomKeyframe[]): string {
  const frames = keyframes
    .map((kf) => {
      const offset = (kf.offset ?? 0) * 100
      const props = Object.entries(kf)
        .filter(([key]) => key !== 'offset')
        .map(([key, value]) => {
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
          return `${cssKey}: ${value};`
        })
        .join(' ')
      return `${offset}% { ${props} }`
    })
    .join('\n')

  return `@keyframes ${name} {\n${frames}\n}`
}

/**
 * 커스텀 클래스 정의를 CSS로 변환
 */
function classDefinitionToCss(name: string, def: CustomClassDefinition): string {
  const rules: string[] = []

  // 기본 스타일
  if (def.base) {
    rules.push(`.${name} { ${cssPropertiesToString(def.base)} }`)
  }

  // ::before 가상 요소
  if (def.before) {
    const content = def.before.content ? `content: "${def.before.content}";` : 'content: "";'
    const animation = def.before.animation ? `animation: ${def.before.animation};` : ''
    const { content: _contentBefore, animation: _animBefore, ...restBefore } = def.before
    const beforeStyles = cssPropertiesToString(restBefore)
    rules.push(`.${name}::before { ${content} ${beforeStyles} ${animation} }`)
  }

  // ::after 가상 요소
  if (def.after) {
    const content = def.after.content ? `content: "${def.after.content}";` : 'content: "";'
    const animation = def.after.animation ? `animation: ${def.after.animation};` : ''
    const { content: _contentAfter, animation: _animAfter, ...restAfter } = def.after
    const afterStyles = cssPropertiesToString(restAfter)
    rules.push(`.${name}::after { ${content} ${afterStyles} ${animation} }`)
  }

  // :hover 상태
  if (def.hover) {
    rules.push(`.${name}:hover { ${cssPropertiesToString(def.hover)} }`)
  }

  // :active 상태
  if (def.active) {
    rules.push(`.${name}:active { ${cssPropertiesToString(def.active)} }`)
  }

  return rules.join('\n')
}

/**
 * CustomStyles를 전체 CSS 문자열로 변환
 */
function generateCustomStylesCss(customStyles?: CustomStyles): string {
  if (!customStyles) return ''

  const cssBlocks: string[] = []

  // 1. 커스텀 keyframes
  if (customStyles.keyframes) {
    for (const [name, keyframes] of Object.entries(customStyles.keyframes)) {
      cssBlocks.push(keyframesToCss(name, keyframes))
    }
  }

  // 2. 커스텀 클래스 (가상 요소 포함)
  if (customStyles.classes) {
    for (const [name, def] of Object.entries(customStyles.classes)) {
      cssBlocks.push(classDefinitionToCss(name, def))
    }
  }

  // 3. 원시 CSS
  if (customStyles.globalCss) {
    cssBlocks.push(customStyles.globalCss)
  }

  return cssBlocks.length > 0 ? `\n/* Custom Styles */\n${cssBlocks.join('\n\n')}` : ''
}

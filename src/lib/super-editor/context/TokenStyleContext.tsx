'use client'

/**
 * Super Editor - Token Style Context
 * 디자인 토큰을 React 컴포넌트에 제공하는 컨텍스트
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { SemanticDesignTokens } from '../tokens/schema'
import type { StyleSchema } from '../schema/style'
import { resolveTokens } from '../tokens/resolver'
import { generateCssVariables, tokenRefToCssVar } from '../tokens/css-generator'
import { DEFAULT_TOKENS } from '../tokens/schema'

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

    return {
      tokens,
      cssVariables,
      resolveTokenRef: (ref: string) => tokenRefToCssVar(ref),
      getTokenValue: (path: string) => getTokenValueByPath(tokens, path),
    }
  }, [style])

  return (
    <TokenStyleContext.Provider value={value}>
      {/* CSS Variables 주입 */}
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

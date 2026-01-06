'use client'

import { useState, useEffect } from 'react'

/**
 * SSR-safe 미디어 쿼리 훅
 *
 * @param query - 미디어 쿼리 문자열 (예: '(max-width: 767px)')
 * @returns 미디어 쿼리 매칭 여부
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)')
 * const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
 */
export function useMediaQuery(query: string): boolean {
  // SSR에서는 false 반환 (hydration mismatch 방지)
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    // 초기값 설정
    setMatches(mediaQuery.matches)

    // 변경 감지 리스너
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // addEventListener 사용 (addListener는 deprecated)
    mediaQuery.addEventListener('change', handler)

    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }, [query])

  return matches
}

/**
 * 자주 사용하는 브레이크포인트 상수
 */
export const BREAKPOINTS = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
} as const

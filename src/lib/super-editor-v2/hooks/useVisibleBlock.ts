/**
 * useVisibleBlock Hook
 *
 * 스크롤 컨테이너 내에서 현재 가장 많이 보이는 블록을 감지
 * Intersection Observer를 사용하여 효율적으로 추적
 */

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseVisibleBlockOptions {
  /** 스크롤 컨테이너 ref */
  containerRef: React.RefObject<HTMLElement | null>
  /** 블록 ID 목록 */
  blockIds: string[]
  /** 블록을 선택하는 임계값 (0-1, 기본값 0.5) */
  threshold?: number
  /** 디바운스 시간 (ms, 기본값 100) */
  debounceMs?: number
}

interface UseVisibleBlockResult {
  /** 현재 가장 많이 보이는 블록 ID */
  visibleBlockId: string | null
  /** 각 블록의 가시성 비율 */
  visibilityMap: Map<string, number>
}

export function useVisibleBlock({
  containerRef,
  blockIds,
  threshold = 0.3,
  debounceMs = 100,
}: UseVisibleBlockOptions): UseVisibleBlockResult {
  const [visibleBlockId, setVisibleBlockId] = useState<string | null>(null)
  const [visibilityMap, setVisibilityMap] = useState<Map<string, number>>(new Map())

  const observerRef = useRef<IntersectionObserver | null>(null)
  const visibilityRef = useRef<Map<string, number>>(new Map())
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 가장 많이 보이는 블록 계산
  const updateVisibleBlock = useCallback(() => {
    let maxVisibility = 0
    let maxBlockId: string | null = null

    visibilityRef.current.forEach((visibility, blockId) => {
      if (visibility > maxVisibility) {
        maxVisibility = visibility
        maxBlockId = blockId
      }
    })

    // 임계값 이상일 때만 선택
    if (maxVisibility >= threshold) {
      setVisibleBlockId(maxBlockId)
    }

    setVisibilityMap(new Map(visibilityRef.current))
  }, [threshold])

  // 디바운스된 업데이트
  const debouncedUpdate = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(updateVisibleBlock, debounceMs)
  }, [updateVisibleBlock, debounceMs])

  useEffect(() => {
    const container = containerRef.current
    if (!container || blockIds.length === 0) return

    // 이전 observer 정리
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Intersection Observer 생성
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const blockId = entry.target.getAttribute('data-block-id')
          if (blockId) {
            visibilityRef.current.set(blockId, entry.intersectionRatio)
          }
        })
        debouncedUpdate()
      },
      {
        root: container,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '-10% 0px -10% 0px', // 상하 10% 마진으로 중앙 영역 우선
      }
    )

    // 블록 요소들 관찰 시작
    const blockElements = container.querySelectorAll('[data-block-id]')
    blockElements.forEach((element) => {
      const blockId = element.getAttribute('data-block-id')
      if (blockId && blockIds.includes(blockId)) {
        observerRef.current?.observe(element)
      }
    })

    // 초기 블록 선택 (첫 번째 블록)
    if (blockIds.length > 0 && !visibleBlockId) {
      setVisibleBlockId(blockIds[0])
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [containerRef, blockIds, debouncedUpdate, visibleBlockId])

  return {
    visibleBlockId,
    visibilityMap,
  }
}

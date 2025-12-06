'use client'

import { useState, useEffect, RefObject } from 'react'

/**
 * 특정 요소의 스크롤 진행도를 추적하는 훅
 * @param ref - 추적할 요소의 ref
 * @returns 0~1 사이의 progress 값
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      const rect = element.getBoundingClientRect()
      const scrolled = -rect.top
      const total = rect.height - window.innerHeight

      if (total <= 0) {
        setProgress(0)
        return
      }

      const p = Math.min(1, Math.max(0, scrolled / total))
      setProgress(p)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 초기값 설정

    return () => window.removeEventListener('scroll', handleScroll)
  }, [ref])

  return progress
}

/**
 * 뷰포트 내 요소 가시성을 추적하는 훅
 * @param ref - 추적할 요소의 ref
 * @param threshold - 가시성 임계값 (0~1)
 * @returns 요소가 화면에 보이는지 여부
 */
export function useInView(ref: RefObject<HTMLElement | null>, threshold = 0.1) {
  const [isInView, setIsInView] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setIsInView(true)
          setHasTriggered(true)
        }
      },
      { threshold }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref, threshold, hasTriggered])

  return isInView
}

/**
 * 전역 스크롤 위치를 추적하는 훅
 * @returns 현재 스크롤 Y 위치
 */
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollY
}

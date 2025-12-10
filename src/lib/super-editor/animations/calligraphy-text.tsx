'use client'

/**
 * CalligraphyText - opentype.js 기반 텍스트 → SVG Path 캘리그라피 애니메이션
 *
 * 1. opentype.js로 폰트 파일에서 글리프 path 추출
 * 2. SVG path로 변환
 * 3. GSAP으로 stroke-dashoffset 애니메이션 (드로잉 효과)
 */

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import gsap from 'gsap'
import opentype from 'opentype.js'

// ============================================
// Types
// ============================================

interface CalligraphyTextProps {
  /** 렌더링할 텍스트 */
  text: string
  /** 폰트 URL (woff, ttf, otf) */
  fontUrl: string
  /** 폰트 크기 (px) */
  fontSize?: number
  /** 선 색상 */
  strokeColor?: string
  /** 선 두께 */
  strokeWidth?: number
  /** 채우기 색상 (애니메이션 완료 후) */
  fillColor?: string
  /** 채우기 애니메이션 활성화 */
  showFill?: boolean
  /** 드로잉 애니메이션 시간 (초) */
  duration?: number
  /** 애니메이션 시작 지연 (초) */
  delay?: number
  /** 글자 간 stagger (초) */
  stagger?: number
  /** SVG 너비 */
  width?: number | string
  /** SVG 높이 */
  height?: number | string
  /** 추가 클래스 */
  className?: string
  /** 애니메이션 완료 콜백 */
  onComplete?: () => void
}

interface GlyphPath {
  char: string
  pathData: string
  x: number
  width: number
}

// ============================================
// Font Cache
// ============================================

const fontCache = new Map<string, opentype.Font>()

async function loadFont(url: string): Promise<opentype.Font> {
  if (fontCache.has(url)) {
    return fontCache.get(url)!
  }

  const font = await opentype.load(url)
  fontCache.set(url, font)
  return font
}

// ============================================
// Component
// ============================================

export function CalligraphyText({
  text,
  fontUrl,
  fontSize = 48,
  strokeColor = 'currentColor',
  strokeWidth = 1,
  fillColor = 'currentColor',
  showFill = true,
  duration = 2,
  delay = 0,
  stagger = 0.1,
  width = '100%',
  height = 'auto',
  className = '',
  onComplete,
}: CalligraphyTextProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRefs = useRef<SVGPathElement[]>([])
  const [glyphPaths, setGlyphPaths] = useState<GlyphPath[]>([])
  const [viewBox, setViewBox] = useState('0 0 100 100')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 폰트 로드 및 path 추출
  useEffect(() => {
    let cancelled = false

    async function extractPaths() {
      try {
        setIsLoading(true)
        setError(null)

        const font = await loadFont(fontUrl)
        if (cancelled) return

        const paths: GlyphPath[] = []
        let currentX = 0
        const padding = 10

        // 각 글자별로 path 추출
        for (const char of text) {
          const glyph = font.charToGlyph(char)
          const path = glyph.getPath(currentX + padding, fontSize, fontSize)
          const pathData = path.toPathData(2) // 소수점 2자리

          if (pathData && pathData !== 'M0 0') {
            paths.push({
              char,
              pathData,
              x: currentX,
              width: (glyph.advanceWidth || 0) * (fontSize / font.unitsPerEm),
            })
          }

          // 다음 글자 위치
          currentX += (glyph.advanceWidth || fontSize * 0.5) * (fontSize / font.unitsPerEm)
        }

        if (cancelled) return

        // viewBox 계산
        const totalWidth = currentX + padding * 2
        const totalHeight = fontSize * 1.5
        setViewBox(`0 0 ${totalWidth} ${totalHeight}`)
        setGlyphPaths(paths)
        setIsLoading(false)
      } catch (err) {
        if (cancelled) return
        console.error('Failed to load font:', err)
        setError('폰트 로드 실패')
        setIsLoading(false)
      }
    }

    extractPaths()
    return () => {
      cancelled = true
    }
  }, [text, fontUrl, fontSize])

  // GSAP 애니메이션
  useLayoutEffect(() => {
    if (isLoading || glyphPaths.length === 0 || !svgRef.current) return

    const paths = pathRefs.current.filter(Boolean)
    if (paths.length === 0) return

    const ctx = gsap.context(() => {
      // 각 패스의 길이를 계산하고 초기 상태 설정
      paths.forEach((path) => {
        const length = path.getTotalLength()
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fill: 'transparent',
          opacity: 1,
        })
      })

      // 드로잉 애니메이션
      const tl = gsap.timeline({
        delay,
        onComplete,
      })

      // stroke 드로잉
      tl.to(paths, {
        strokeDashoffset: 0,
        duration,
        stagger,
        ease: 'power2.inOut',
      })

      // fill 애니메이션 (선택적)
      if (showFill) {
        tl.to(
          paths,
          {
            fill: fillColor,
            stroke: 'transparent',
            duration: duration * 0.3,
            stagger: stagger * 0.5,
            ease: 'power1.in',
          },
          `-=${duration * 0.2}`
        )
      }
    }, svgRef)

    return () => ctx.revert()
  }, [isLoading, glyphPaths, duration, delay, stagger, showFill, fillColor, onComplete])

  if (error) {
    return <span className={className}>{text}</span>
  }

  if (isLoading) {
    return (
      <span className={`opacity-0 ${className}`} style={{ fontSize }}>
        {text}
      </span>
    )
  }

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      width={width}
      height={height}
      className={className}
      style={{ overflow: 'visible' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {glyphPaths.map((glyph, i) => (
        <path
          key={`${glyph.char}-${i}`}
          ref={(el) => {
            if (el) pathRefs.current[i] = el
          }}
          d={glyph.pathData}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0 }}
        />
      ))}
    </svg>
  )
}

// ============================================
// Preset Fonts (캘리그라피용)
// ============================================

export const CALLIGRAPHY_FONTS = {
  // 영문 캘리그라피
  greatVibes: '/fonts/GreatVibes-Regular.ttf',
  dancingScript: '/fonts/DancingScript-Regular.ttf',
  parisienne: '/fonts/Parisienne-Regular.ttf',
  allura: '/fonts/Allura-Regular.ttf',

  // 한글 손글씨
  nanumPen: '/fonts/NanumPenScript-Regular.ttf',
  gaegu: '/fonts/Gaegu-Regular.ttf',
} as const

export type CalligraphyFontPreset = keyof typeof CALLIGRAPHY_FONTS

// ============================================
// Wrapper with Preset
// ============================================

interface CalligraphyPresetProps extends Omit<CalligraphyTextProps, 'fontUrl'> {
  /** 프리셋 폰트 이름 */
  font?: CalligraphyFontPreset
  /** 또는 커스텀 폰트 URL */
  customFontUrl?: string
}

export function Calligraphy({
  font = 'greatVibes',
  customFontUrl,
  ...props
}: CalligraphyPresetProps) {
  const fontUrl = customFontUrl || CALLIGRAPHY_FONTS[font]
  return <CalligraphyText fontUrl={fontUrl} {...props} />
}

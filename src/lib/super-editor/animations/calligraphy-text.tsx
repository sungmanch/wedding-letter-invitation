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

/** 폰트 프리셋 메타 정보 */
export interface CalligraphyFontMeta {
  id: CalligraphyFontPreset
  name: string
  category: 'english' | 'korean'
  sample: string
}

export const CALLIGRAPHY_FONT_PRESETS: CalligraphyFontMeta[] = [
  { id: 'greatVibes', name: 'Great Vibes', category: 'english', sample: 'And' },
  { id: 'dancingScript', name: 'Dancing Script', category: 'english', sample: 'Love' },
  { id: 'parisienne', name: 'Parisienne', category: 'english', sample: 'Wedding' },
  { id: 'allura', name: 'Allura', category: 'english', sample: 'Forever' },
  { id: 'nanumPen', name: '나눔손글씨 펜', category: 'korean', sample: '사랑' },
  { id: 'gaegu', name: '개구체', category: 'korean', sample: '결혼' },
]

export function getCalligraphyFontMeta(id: CalligraphyFontPreset): CalligraphyFontMeta | undefined {
  return CALLIGRAPHY_FONT_PRESETS.find((f) => f.id === id)
}

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

// ============================================
// Multi-Item Calligraphy System (하이브리드)
// ============================================

/** 텍스트 슬롯 타입 */
export type CalligraphySlot = 'groom' | 'and' | 'bride' | 'title'

/** 개별 캘리그라피 아이템 */
export interface CalligraphyItem {
  slot: CalligraphySlot
  fontId: CalligraphyFontPreset
  fontSize: number
  /** 위치 (% 기준, x: 가로 중심, y: 세로 위치) */
  position: { x: number; y: number }
  /** 애니메이션 지연 (초) */
  delay: number
  /** 애니메이션 시간 (초) */
  duration?: number
}

/** 캘리그라피 템플릿 */
export interface CalligraphyTemplate {
  id: string
  name: string
  description: string
  items: CalligraphyItem[]
}

/** 사용자 입력 텍스트 */
export interface CalligraphyTexts {
  groom: string
  and: string
  bride: string
  title: string
}

/** 전체 캘리그라피 설정 (템플릿 + 텍스트) */
export interface CalligraphyConfig {
  templateId: string
  texts: CalligraphyTexts
}

/** 기본 텍스트 */
export const DEFAULT_CALLIGRAPHY_TEXTS: CalligraphyTexts = {
  groom: '신랑',
  and: 'And',
  bride: '신부',
  title: 'Wedding Invitation',
}

// ============================================
// 캘리그라피 템플릿 프리셋
// ============================================

export const CALLIGRAPHY_TEMPLATES: CalligraphyTemplate[] = [
  {
    id: 'classic-vertical',
    name: '클래식 세로',
    description: '전통적인 세로 배치',
    items: [
      { slot: 'groom', fontId: 'nanumPen', fontSize: 48, position: { x: 50, y: 25 }, delay: 0, duration: 2 },
      { slot: 'and', fontId: 'greatVibes', fontSize: 36, position: { x: 50, y: 45 }, delay: 0.8, duration: 1.5 },
      { slot: 'bride', fontId: 'nanumPen', fontSize: 48, position: { x: 50, y: 65 }, delay: 1.6, duration: 2 },
      { slot: 'title', fontId: 'parisienne', fontSize: 24, position: { x: 50, y: 88 }, delay: 2.4, duration: 2 },
    ],
  },
  {
    id: 'elegant-centered',
    name: '우아한 중앙',
    description: '중앙 집중형 레이아웃',
    items: [
      { slot: 'groom', fontId: 'allura', fontSize: 42, position: { x: 50, y: 30 }, delay: 0, duration: 2 },
      { slot: 'and', fontId: 'dancingScript', fontSize: 28, position: { x: 50, y: 48 }, delay: 0.6, duration: 1.2 },
      { slot: 'bride', fontId: 'allura', fontSize: 42, position: { x: 50, y: 66 }, delay: 1.2, duration: 2 },
      { slot: 'title', fontId: 'greatVibes', fontSize: 20, position: { x: 50, y: 90 }, delay: 2, duration: 1.5 },
    ],
  },
  {
    id: 'side-by-side',
    name: '나란히',
    description: '신랑 신부 양옆 배치',
    items: [
      { slot: 'groom', fontId: 'nanumPen', fontSize: 36, position: { x: 25, y: 45 }, delay: 0, duration: 2 },
      { slot: 'and', fontId: 'greatVibes', fontSize: 32, position: { x: 50, y: 45 }, delay: 0.5, duration: 1.5 },
      { slot: 'bride', fontId: 'nanumPen', fontSize: 36, position: { x: 75, y: 45 }, delay: 1, duration: 2 },
      { slot: 'title', fontId: 'parisienne', fontSize: 22, position: { x: 50, y: 75 }, delay: 1.8, duration: 2 },
    ],
  },
  {
    id: 'minimal',
    name: '미니멀',
    description: 'And만 강조',
    items: [
      { slot: 'and', fontId: 'greatVibes', fontSize: 64, position: { x: 50, y: 50 }, delay: 0, duration: 2.5 },
    ],
  },
  {
    id: 'romantic-korean',
    name: '로맨틱 한글',
    description: '한글 손글씨 강조',
    items: [
      { slot: 'groom', fontId: 'gaegu', fontSize: 52, position: { x: 50, y: 28 }, delay: 0, duration: 2.2 },
      { slot: 'and', fontId: 'dancingScript', fontSize: 28, position: { x: 50, y: 50 }, delay: 0.8, duration: 1.2 },
      { slot: 'bride', fontId: 'gaegu', fontSize: 52, position: { x: 50, y: 72 }, delay: 1.6, duration: 2.2 },
    ],
  },
]

export function getCalligraphyTemplate(id: string): CalligraphyTemplate | undefined {
  return CALLIGRAPHY_TEMPLATES.find((t) => t.id === id)
}

export const DEFAULT_CALLIGRAPHY_CONFIG: CalligraphyConfig = {
  templateId: 'classic-vertical',
  texts: DEFAULT_CALLIGRAPHY_TEXTS,
}

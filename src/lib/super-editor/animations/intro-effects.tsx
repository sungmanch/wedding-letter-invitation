'use client'

/**
 * Intro Animation Effects
 * 인트로 섹션 전용 애니메이션 효과 컴포넌트
 *
 * 1. SpinningStars - 빙글빙글 도는 별/오브젝트
 * 2. FallingPetals - 흩날리는 꽃잎 (SVG)
 * 3. CalligraphySVG - GSAP DrawSVG 스타일 필기체 애니메이션
 * 4. CalligraphyTextOverlay - opentype.js 기반 실제 텍스트 캘리그라피
 */

import React, { useEffect, useRef, useState, useMemo, useLayoutEffect } from 'react'
import gsap from 'gsap'
import {
  CalligraphyText as OpentypeCalligraphyText,
  CALLIGRAPHY_FONTS,
  CALLIGRAPHY_TEMPLATES,
  getCalligraphyTemplate,
  DEFAULT_CALLIGRAPHY_CONFIG,
  type CalligraphyConfig,
  type CalligraphyTexts,
  type CalligraphyTemplate,
  type CalligraphyItem,
} from './calligraphy-text'

// Re-export for convenience
export type { CalligraphyConfig, CalligraphyTexts } from './calligraphy-text'
export { DEFAULT_CALLIGRAPHY_CONFIG, CALLIGRAPHY_TEMPLATES } from './calligraphy-text'

// ============================================
// Types
// ============================================

export type IntroEffectType = 'spinning-stars' | 'falling-petals' | 'calligraphy' | 'none'

export interface IntroEffectConfig {
  type: IntroEffectType
  // spinning-stars options
  starCount?: number
  starColor?: string
  // falling-petals options
  petalCount?: number
  petalColor?: string
  // calligraphy options (for text nodes)
  duration?: number
}

// ============================================
// 1. Spinning Stars
// ============================================

interface SpinningStarsProps {
  count?: number
  color?: string
  className?: string
}

const STAR_POSITIONS = [
  { top: '8%', left: '12%', size: 16, delay: 0 },
  { top: '15%', right: '8%', size: 12, delay: 0.5 },
  { top: '35%', left: '5%', size: 10, delay: 1 },
  { top: '45%', right: '12%', size: 14, delay: 0.3 },
  { top: '60%', left: '8%', size: 11, delay: 0.8 },
  { top: '70%', right: '5%', size: 13, delay: 0.2 },
  { top: '85%', left: '15%', size: 9, delay: 0.6 },
  { top: '90%', right: '18%', size: 15, delay: 1.2 },
]

function StarIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  )
}

function DiamondIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0L24 12L12 24L0 12L12 0Z" />
    </svg>
  )
}

export function SpinningStars({
  count = 8,
  color = 'currentColor',
  className = '',
}: SpinningStarsProps) {
  const positions = useMemo(() => STAR_POSITIONS.slice(0, count), [count])

  return (
    <>
      <style>
        {`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.1) rotate(180deg); }
          }
          .spinning-star {
            animation: spin-slow 8s linear infinite;
          }
          .twinkle-star {
            animation: twinkle 3s ease-in-out infinite;
          }
        `}
      </style>
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {positions.map((pos, i) => {
          const Icon = i % 2 === 0 ? StarIcon : DiamondIcon
          return (
            <div
              key={i}
              className={i % 2 === 0 ? 'spinning-star' : 'twinkle-star'}
              style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                right: pos.right,
                animationDelay: `${pos.delay}s`,
                opacity: 0.7,
              }}
            >
              <Icon size={pos.size} color={color} />
            </div>
          )
        })}
      </div>
    </>
  )
}

// ============================================
// 2. Falling Petals (SVG)
// ============================================

interface FallingPetalsProps {
  count?: number
  color?: string
  className?: string
}

function PetalSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 20 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 0C10 0 20 10 20 20C20 25.5228 15.5228 30 10 30C4.47715 30 0 25.5228 0 20C0 10 10 0 10 0Z"
        fill={color}
        fillOpacity="0.7"
      />
      <path
        d="M10 5C10 5 15 12 15 18C15 22 12.5 25 10 25"
        stroke={color}
        strokeOpacity="0.4"
        strokeWidth="0.5"
        fill="none"
      />
    </svg>
  )
}

const PETAL_CONFIGS = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${5 + Math.random() * 90}%`,
  size: 12 + Math.random() * 10,
  delay: Math.random() * 8,
  duration: 6 + Math.random() * 4,
  swayAmount: 30 + Math.random() * 40,
  rotateStart: Math.random() * 360,
}))

export function FallingPetals({
  count = 12,
  color = '#FFB7C5',
  className = '',
}: FallingPetalsProps) {
  const petals = useMemo(() => PETAL_CONFIGS.slice(0, count), [count])

  return (
    <>
      <style>
        {`
          @keyframes petal-fall {
            0% {
              transform: translateY(-20px) translateX(0) rotate(var(--rotate-start));
              opacity: 0;
            }
            10% {
              opacity: 0.8;
            }
            25% {
              transform: translateY(25vh) translateX(calc(var(--sway) * 1)) rotate(calc(var(--rotate-start) + 90deg));
            }
            50% {
              transform: translateY(50vh) translateX(calc(var(--sway) * -0.5)) rotate(calc(var(--rotate-start) + 180deg));
            }
            75% {
              transform: translateY(75vh) translateX(calc(var(--sway) * 0.8)) rotate(calc(var(--rotate-start) + 270deg));
            }
            90% {
              opacity: 0.6;
            }
            100% {
              transform: translateY(100vh) translateX(calc(var(--sway) * -0.3)) rotate(calc(var(--rotate-start) + 360deg));
              opacity: 0;
            }
          }
          .falling-petal {
            animation: petal-fall var(--duration) ease-in-out infinite;
            animation-delay: var(--delay);
          }
        `}
      </style>
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {petals.map((petal) => (
          <div
            key={petal.id}
            className="falling-petal absolute"
            style={
              {
                left: petal.left,
                top: '-30px',
                '--delay': `${petal.delay}s`,
                '--duration': `${petal.duration}s`,
                '--sway': `${petal.swayAmount}px`,
                '--rotate-start': `${petal.rotateStart}deg`,
              } as React.CSSProperties
            }
          >
            <PetalSVG color={color} size={petal.size} />
          </div>
        ))}
      </div>
    </>
  )
}

// ============================================
// 3. Calligraphy SVG Animation (GSAP DrawSVG Style)
// ============================================

/**
 * 캘리그라피 스타일 SVG 패스 프리셋
 * "And", "♥", 장식 flourish 등
 */
export const CALLIGRAPHY_PATHS = {
  // "And" 캘리그라피
  and: {
    viewBox: '0 0 100 50',
    paths: [
      // A
      'M10 45 Q15 10 25 10 Q35 10 30 25 L25 45',
      // n
      'M35 30 L35 45 M35 35 Q45 25 50 35 L50 45',
      // d
      'M55 30 Q55 45 65 45 Q75 45 75 30 L75 10',
    ],
  },
  // 하트
  heart: {
    viewBox: '0 0 50 50',
    paths: [
      'M25 45 C10 30 0 20 10 10 C20 0 25 10 25 15 C25 10 30 0 40 10 C50 20 40 30 25 45',
    ],
  },
  // 장식 flourish (좌우 대칭)
  flourish: {
    viewBox: '0 0 200 30',
    paths: [
      // 왼쪽 flourish
      'M5 15 Q20 5 40 15 Q60 25 80 15 Q90 10 100 15',
      // 오른쪽 flourish (미러)
      'M195 15 Q180 5 160 15 Q140 25 120 15 Q110 10 100 15',
    ],
  },
  // 별 장식
  starBurst: {
    viewBox: '0 0 100 100',
    paths: [
      'M50 10 L50 90', // 수직선
      'M10 50 L90 50', // 수평선
      'M20 20 L80 80', // 대각선 1
      'M80 20 L20 80', // 대각선 2
    ],
  },
  // 웨딩 벨
  bells: {
    viewBox: '0 0 100 80',
    paths: [
      // 왼쪽 벨
      'M25 15 Q10 15 10 35 Q10 55 25 55 Q40 55 40 35 Q40 15 25 15',
      'M25 55 L25 65',
      'M20 65 Q25 70 30 65',
      // 오른쪽 벨
      'M75 15 Q60 15 60 35 Q60 55 75 55 Q90 55 90 35 Q90 15 75 15',
      'M75 55 L75 65',
      'M70 65 Q75 70 80 65',
      // 리본
      'M40 20 Q50 10 60 20',
    ],
  },
}

export type CalligraphyPathType = keyof typeof CALLIGRAPHY_PATHS

interface CalligraphySVGProps {
  type?: CalligraphyPathType
  customPaths?: string[]
  customViewBox?: string
  duration?: number
  delay?: number
  stagger?: number
  strokeColor?: string
  strokeWidth?: number
  fillColor?: string
  showFill?: boolean
  width?: number | string
  height?: number | string
  className?: string
  onComplete?: () => void
}

/**
 * GSAP을 사용한 SVG 패스 드로잉 애니메이션
 * DrawSVGPlugin과 동일한 효과를 stroke-dasharray/dashoffset으로 구현
 */
export function CalligraphySVG({
  type = 'and',
  customPaths,
  customViewBox,
  duration = 2,
  delay = 0,
  stagger = 0.3,
  strokeColor = 'currentColor',
  strokeWidth = 2,
  fillColor = 'none',
  showFill = false,
  width = '100%',
  height = 'auto',
  className = '',
  onComplete,
}: CalligraphySVGProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRefs = useRef<SVGPathElement[]>([])

  // 패스 데이터 결정
  const pathData = customPaths
    ? { viewBox: customViewBox || '0 0 100 100', paths: customPaths }
    : CALLIGRAPHY_PATHS[type]

  useLayoutEffect(() => {
    if (!svgRef.current || pathRefs.current.length === 0) return

    const paths = pathRefs.current.filter(Boolean)
    const ctx = gsap.context(() => {
      // 각 패스의 길이를 계산하고 초기 상태 설정
      paths.forEach((path) => {
        const length = path.getTotalLength()
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1,
        })
      })

      // 드로잉 애니메이션
      const tl = gsap.timeline({
        delay,
        onComplete,
      })

      tl.to(paths, {
        strokeDashoffset: 0,
        duration,
        stagger,
        ease: 'power2.inOut',
      })

      // 선택적으로 fill 애니메이션
      if (showFill && fillColor !== 'none') {
        tl.to(
          paths,
          {
            fill: fillColor,
            duration: duration * 0.5,
            ease: 'power1.in',
          },
          `-=${duration * 0.3}`
        )
      }
    }, svgRef)

    return () => ctx.revert()
  }, [type, duration, delay, stagger, showFill, fillColor, onComplete])

  return (
    <svg
      ref={svgRef}
      viewBox={pathData.viewBox}
      width={width}
      height={height}
      className={className}
      style={{ overflow: 'visible' }}
    >
      {pathData.paths.map((d, i) => (
        <path
          key={i}
          ref={(el) => {
            if (el) pathRefs.current[i] = el
          }}
          d={d}
          fill="none"
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

/**
 * 여러 캘리그라피 요소를 순차적으로 애니메이션
 */
interface CalligraphySequenceProps {
  items: Array<{
    type: CalligraphyPathType
    delay?: number
  }>
  duration?: number
  stagger?: number
  strokeColor?: string
  className?: string
}

export function CalligraphySequence({
  items,
  duration = 1.5,
  stagger = 0.5,
  strokeColor = 'currentColor',
  className = '',
}: CalligraphySequenceProps) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      {items.map((item, index) => (
        <CalligraphySVG
          key={index}
          type={item.type}
          duration={duration}
          delay={item.delay ?? index * stagger}
          strokeColor={strokeColor}
          width={60}
          height={40}
        />
      ))}
    </div>
  )
}

/**
 * 인트로용 캘리그라피 오버레이
 * 다중 텍스트 + 템플릿 기반 캘리그라피 애니메이션
 */
interface CalligraphyOverlayProps {
  className?: string
  color?: string
  /** 캘리그라피 설정 (템플릿 + 텍스트) */
  config?: CalligraphyConfig
  /** 장식 flourish 표시 여부 */
  showDecorations?: boolean
}

export function CalligraphyOverlay({
  className = '',
  color = 'currentColor',
  config = DEFAULT_CALLIGRAPHY_CONFIG,
  showDecorations = true,
}: CalligraphyOverlayProps) {
  // 템플릿 가져오기
  const template = getCalligraphyTemplate(config.templateId) || CALLIGRAPHY_TEMPLATES[0]

  // 애니메이션 키 (config 변경 시 리렌더)
  const animationKey = useMemo(
    () => `${config.templateId}-${JSON.stringify(config.texts)}`,
    [config.templateId, config.texts]
  )

  // 마지막 아이템의 delay + duration 계산 (장식 애니메이션 타이밍용)
  const lastItemEnd = useMemo(() => {
    if (template.items.length === 0) return 0
    const lastItem = template.items[template.items.length - 1]
    return lastItem.delay + (lastItem.duration || 2)
  }, [template.items])

  return (
    <div key={animationKey} className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* 상단 flourish (선택적) */}
      {showDecorations && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 opacity-50">
          <CalligraphySVG
            type="flourish"
            duration={1.5}
            delay={0}
            strokeColor={color}
            strokeWidth={1}
          />
        </div>
      )}

      {/* 다중 캘리그라피 텍스트 렌더링 */}
      {template.items.map((item, index) => {
        const text = config.texts[item.slot]
        if (!text) return null

        return (
          <div
            key={`${item.slot}-${index}`}
            className="absolute"
            style={{
              left: `${item.position.x}%`,
              top: `${item.position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <OpentypeCalligraphyText
              text={text}
              fontUrl={CALLIGRAPHY_FONTS[item.fontId]}
              fontSize={item.fontSize}
              strokeColor={color}
              strokeWidth={item.fontSize > 40 ? 1.5 : 1}
              fillColor={color}
              showFill={true}
              duration={item.duration || 2}
              delay={item.delay}
              stagger={0.1}
              className="opacity-90"
            />
          </div>
        )
      })}

      {/* 하단 flourish (선택적) */}
      {showDecorations && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 opacity-50">
          <CalligraphySVG
            type="flourish"
            duration={1.5}
            delay={lastItemEnd + 0.3}
            strokeColor={color}
            strokeWidth={1}
          />
        </div>
      )}
    </div>
  )
}

// 기존 CSS clip-path 기반 텍스트 리빌 효과 (하위 호환성)
interface ClipRevealTextProps {
  text: string
  duration?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3'
}

export function ClipRevealText({
  text,
  duration = 2000,
  delay = 0,
  className = '',
  style,
  as: Component = 'span',
}: ClipRevealTextProps) {
  return (
    <>
      <style>
        {`
          @keyframes calligraphy-reveal {
            from {
              clip-path: inset(0 100% 0 0);
            }
            to {
              clip-path: inset(0 0 0 0);
            }
          }
          .calligraphy-text {
            animation: calligraphy-reveal var(--duration) cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
            animation-delay: var(--delay);
            clip-path: inset(0 100% 0 0);
          }
        `}
      </style>
      <Component
        className={`calligraphy-text ${className}`}
        style={
          {
            ...style,
            '--duration': `${duration}ms`,
            '--delay': `${delay}ms`,
          } as React.CSSProperties
        }
      >
        {text}
      </Component>
    </>
  )
}

// ============================================
// 4. Text Entrance Animations (Left/Up/Right)
// ============================================

interface TextEntranceProps {
  children: React.ReactNode
  direction: 'left' | 'up' | 'right'
  delay?: number
  duration?: number
  className?: string
}

export function TextEntrance({
  children,
  direction,
  delay = 0,
  duration = 800,
  className = '',
}: TextEntranceProps) {
  const getTransform = () => {
    switch (direction) {
      case 'left':
        return 'translateX(-50px)'
      case 'right':
        return 'translateX(50px)'
      case 'up':
        return 'translateY(30px)'
      default:
        return 'none'
    }
  }

  return (
    <>
      <style>
        {`
          @keyframes text-entrance-${direction} {
            from {
              opacity: 0;
              transform: ${getTransform()};
            }
            to {
              opacity: 1;
              transform: translate(0);
            }
          }
          .text-entrance-${direction} {
            animation: text-entrance-${direction} var(--duration) cubic-bezier(0.16, 1, 0.3, 1) forwards;
            animation-delay: var(--delay);
            opacity: 0;
          }
        `}
      </style>
      <div
        className={`text-entrance-${direction} ${className}`}
        style={
          {
            '--duration': `${duration}ms`,
            '--delay': `${delay}ms`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </>
  )
}

// ============================================
// Unified Intro Effect Container
// ============================================

interface IntroEffectContainerProps {
  effect: IntroEffectType
  config?: Partial<IntroEffectConfig>
  children?: React.ReactNode
  className?: string
}

export function IntroEffectContainer({
  effect,
  config = {},
  children,
  className = '',
}: IntroEffectContainerProps) {
  if (effect === 'none') {
    return <>{children}</>
  }

  return (
    <div className={`relative ${className}`}>
      {effect === 'spinning-stars' && (
        <SpinningStars count={config.starCount} color={config.starColor} />
      )}
      {effect === 'falling-petals' && (
        <FallingPetals count={config.petalCount} color={config.petalColor} />
      )}
      {children}
    </div>
  )
}

// ============================================
// Export Intro Effect Presets
// ============================================

export interface IntroEffectPreset {
  id: IntroEffectType
  name: string
  description: string
  defaultConfig: Partial<IntroEffectConfig>
}

export const INTRO_EFFECT_PRESETS: IntroEffectPreset[] = [
  {
    id: 'none',
    name: '없음',
    description: '효과 없음',
    defaultConfig: {},
  },
  {
    id: 'spinning-stars',
    name: '반짝이는 별',
    description: '빙글빙글 도는 별과 다이아몬드',
    defaultConfig: {
      starCount: 8,
      starColor: 'currentColor',
    },
  },
  {
    id: 'falling-petals',
    name: '흩날리는 꽃잎',
    description: '부드럽게 떨어지는 꽃잎',
    defaultConfig: {
      petalCount: 12,
      petalColor: '#FFB7C5',
    },
  },
  {
    id: 'calligraphy',
    name: '캘리그라피',
    description: '필기체로 천천히 써지는 효과',
    defaultConfig: {
      duration: 2000,
    },
  },
]

export function getIntroEffectPreset(id: IntroEffectType): IntroEffectPreset | undefined {
  return INTRO_EFFECT_PRESETS.find((p) => p.id === id)
}

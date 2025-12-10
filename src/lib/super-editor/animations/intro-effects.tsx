'use client'

/**
 * Intro Animation Effects
 * 인트로 섹션 전용 애니메이션 효과 컴포넌트
 *
 * 1. SpinningStars - 빙글빙글 도는 별/오브젝트
 * 2. FallingPetals - 흩날리는 꽃잎 (SVG)
 * 3. CalligraphyText - 필기체 글 쓰기 애니메이션
 */

import React, { useEffect, useRef, useState, useMemo } from 'react'

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
// 3. Calligraphy Text Animation
// ============================================

interface CalligraphyTextProps {
  text: string
  duration?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3'
}

export function CalligraphyText({
  text,
  duration = 2000,
  delay = 0,
  className = '',
  style,
  as: Component = 'span',
}: CalligraphyTextProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [pathLength, setPathLength] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [text])

  // 텍스트를 SVG 패스로 변환하는 것은 복잡하므로,
  // clip-path를 사용한 reveal 애니메이션으로 대체
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

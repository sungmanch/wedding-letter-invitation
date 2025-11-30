'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { IntroProps } from './types'

/**
 * GlassmorphismIntro - Framer-style 3D glass effect
 * Features: Aurora gradient, floating objects, glass cards
 */
export function GlassmorphismIntro({
  config,
  colors,
  fonts,
  groomName,
  brideName,
  weddingDate,
}: IntroProps) {
  const [phase, setPhase] = React.useState(0)
  const gradientColors = config.settings?.gradientColors || ['#A855F7', '#3B82F6', '#EC4899']
  const floatingObjects = config.settings?.floatingObjects || ['heart', 'ring', 'star']

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),   // Aurora starts
      setTimeout(() => setPhase(2), 1000),  // Objects appear
      setTimeout(() => setPhase(3), 2000),  // Card appears
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const getObjectEmoji = (type: string) => {
    switch (type) {
      case 'heart': return '💕'
      case 'ring': return '💍'
      case 'star': return '✨'
      default: return '♡'
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Aurora Background */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-2000',
          phase >= 1 ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, ${gradientColors[0]}40 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, ${gradientColors[1]}40 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, ${gradientColors[2]}30 0%, transparent 60%)
          `,
        }}
      />

      {/* Animated Aurora Waves */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, ${gradientColors.join(', ')})`,
          backgroundSize: '400% 400%',
          animation: 'aurora-flow 15s ease infinite',
        }}
      />

      {/* Floating Objects */}
      {floatingObjects.map((obj, i) => (
        <div
          key={i}
          className={cn(
            'absolute text-4xl transition-all duration-1000',
            phase >= 2 ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            top: `${20 + i * 25}%`,
            left: `${15 + i * 30}%`,
            animation: `float-${i} ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          {getObjectEmoji(obj)}
        </div>
      ))}

      {/* Glass Card */}
      <div
        className={cn(
          'relative z-10 px-12 py-16 rounded-3xl transition-all duration-1000',
          phase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
        style={{
          background: colors.surface || 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        }}
      >
        {/* Highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
          }}
        />

        <div className="text-center">
          <p
            className="text-sm tracking-[0.3em] uppercase mb-6"
            style={{ color: colors.textMuted }}
          >
            Wedding Invitation
          </p>

          <h1
            className="text-3xl md:text-4xl font-semibold mb-4"
            style={{
              color: colors.text,
              fontFamily: fonts.title.family,
            }}
          >
            {groomName}
          </h1>

          <div
            className="text-2xl mb-4"
            style={{ color: colors.accent }}
          >
            ♥
          </div>

          <h1
            className="text-3xl md:text-4xl font-semibold mb-8"
            style={{
              color: colors.text,
              fontFamily: fonts.title.family,
            }}
          >
            {brideName}
          </h1>

          <p
            className="text-sm"
            style={{
              color: colors.textMuted,
              fontFamily: fonts.body.family,
            }}
          >
            {new Date(weddingDate).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Sparkle Particles */}
      {phase >= 2 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-pulse"
              style={{
                backgroundColor: colors.accent,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes aurora-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float-0 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-10deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
      `}</style>
    </div>
  )
}

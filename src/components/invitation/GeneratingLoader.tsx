'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface GeneratingLoaderProps {
  prompt?: string
  className?: string
}

export function GeneratingLoader({ prompt, className }: GeneratingLoaderProps) {
  const [progress, setProgress] = React.useState(0)
  const [message, setMessage] = React.useState('디자인을 구상하고 있어요...')

  React.useEffect(() => {
    const messages = [
      '디자인을 구상하고 있어요...',
      '색상과 레이아웃을 조합하고 있어요...',
      '디테일을 다듬고 있어요...',
      '마무리 작업 중이에요...',
      '거의 다 됐어요!',
    ]

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return prev + Math.random() * 15
      })
    }, 500)

    const messageInterval = setInterval(() => {
      setMessage((prev) => {
        const currentIndex = messages.indexOf(prev)
        const nextIndex = Math.min(currentIndex + 1, messages.length - 1)
        return messages[nextIndex]
      })
    }, 2000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [])

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 p-8',
        className
      )}
    >
      {/* Animated Icon */}
      <div className="relative">
        <div className="h-20 w-20 rounded-full bg-[#FFB6C1]/20 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-[#FFB6C1]/40 flex items-center justify-center animate-pulse">
            <span className="text-4xl">🎨</span>
          </div>
        </div>
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 h-2 w-2 rounded-full bg-[#D4AF37]" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '-1s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 h-2 w-2 rounded-full bg-[#D4768A]" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '-2s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 h-2 w-2 rounded-full bg-[#FFB6C1]" />
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-lg font-medium text-charcoal animate-pulse">
          {message}
        </p>
        {prompt && (
          <p className="mt-2 text-sm text-gray-500 max-w-xs">
            &ldquo;{prompt}&rdquo;
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FFB6C1] to-[#D4768A] transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm text-gray-400">
          5개의 시안을 만들고 있어요
        </p>
      </div>
    </div>
  )
}

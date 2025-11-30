'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ChatBubbleProps {
  variant: 'ai' | 'user'
  children: React.ReactNode
  isTyping?: boolean
  className?: string
}

export function ChatBubble({ variant, children, isTyping, className }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        'flex w-full',
        variant === 'ai' ? 'justify-start' : 'justify-end',
        className
      )}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 text-base leading-relaxed',
          variant === 'ai'
            ? 'bg-gray-100 text-charcoal rounded-tl-sm'
            : 'bg-[#D4768A] text-white rounded-tr-sm'
        )}
      >
        {isTyping ? (
          <TypingIndicator />
        ) : (
          <div className="whitespace-pre-wrap">{children}</div>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span
        className="h-2 w-2 rounded-full bg-charcoal/40 animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="h-2 w-2 rounded-full bg-charcoal/40 animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="h-2 w-2 rounded-full bg-charcoal/40 animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  )
}

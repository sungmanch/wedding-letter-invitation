'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Send } from 'lucide-react'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = '메시지를 입력하세요...',
  disabled,
  className,
}: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const isComposingRef = React.useRef(false)
  const [isMobile, setIsMobile] = React.useState(false)

  // Detect mobile device
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [value])

  // Reset textarea when value becomes empty
  React.useEffect(() => {
    if (!value && textareaRef.current) {
      textareaRef.current.value = ''
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ignore Enter during IME composition (Korean input)
    if (isComposingRef.current) return

    // Mobile: Enter = newline, Desktop: Enter = submit (Shift+Enter = newline)
    if (e.key === 'Enter' && !isMobile && !e.shiftKey && value.trim()) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleCompositionStart = () => {
    isComposingRef.current = true
  }

  const handleCompositionEnd = () => {
    isComposingRef.current = false
  }

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit()
      // Refocus after a short delay to allow state update
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }

  return (
    <div
      className={cn(
        'flex items-end gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2',
        'focus-within:border-[#D4768A] focus-within:ring-2 focus-within:ring-[#D4768A]/20',
        className
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 bg-transparent text-base outline-none placeholder:text-gray-400 resize-none max-h-[120px] py-2"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full transition-colors flex-shrink-0',
          'bg-[#D4768A] text-white',
          'hover:bg-[#c4657a] active:bg-[#b45569]',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  )
}

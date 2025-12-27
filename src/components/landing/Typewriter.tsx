'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterProps {
  texts: string[]
  typingSpeed?: number // ms per character
  deletingSpeed?: number // ms per character
  pauseDuration?: number // ms after typing complete
  delayBetween?: number // ms between sentences
  className?: string
  onComplete?: () => void
}

type Phase = 'typing' | 'pausing' | 'deleting' | 'waiting'

export function Typewriter({
  texts,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
  delayBetween = 500,
  className = '',
  onComplete,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('typing')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const currentText = texts[currentIndex]

  useEffect(() => {
    // 이전 타이머 정리
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    switch (phase) {
      case 'typing':
        if (displayText.length < currentText.length) {
          timeoutRef.current = setTimeout(() => {
            setDisplayText(currentText.slice(0, displayText.length + 1))
          }, typingSpeed)
        } else {
          // 타이핑 완료 → pausing
          setPhase('pausing')
        }
        break

      case 'pausing':
        timeoutRef.current = setTimeout(() => {
          setPhase('deleting')
        }, pauseDuration)
        break

      case 'deleting':
        if (displayText.length > 0) {
          timeoutRef.current = setTimeout(() => {
            setDisplayText(displayText.slice(0, -1))
          }, deletingSpeed)
        } else {
          // 삭제 완료 → waiting
          setPhase('waiting')
        }
        break

      case 'waiting':
        timeoutRef.current = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % texts.length)
          setPhase('typing')
          onComplete?.()
        }, delayBetween)
        break
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [displayText, currentText, phase, typingSpeed, deletingSpeed, pauseDuration, delayBetween, texts.length, onComplete])

  // texts나 currentIndex 변경 시 displayText 리셋
  useEffect(() => {
    setDisplayText('')
  }, [currentIndex])

  // texts prop 변경 시 완전 리셋
  useEffect(() => {
    setDisplayText('')
    setCurrentIndex(0)
    setPhase('typing')
  }, [texts])

  return (
    <span className={className}>
      {displayText}
      <span className="typewriter-cursor">|</span>
    </span>
  )
}

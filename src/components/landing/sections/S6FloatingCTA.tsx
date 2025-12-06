'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'

export function S6FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past Stage 4 (approximately 3.5 viewport heights)
      const threshold = window.innerHeight * 3.5
      setIsVisible(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0806] via-[#0A0806]/95 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative px-4 py-4 pb-6">
        <div className="max-w-md mx-auto flex items-center gap-4">
          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-[#F5E6D3] font-medium truncate">무료로 시안 받기</p>
            <p className="text-[#F5E6D3]/50 text-sm">3분이면 완성</p>
          </div>

          {/* CTA Button */}
          <Link href="/create">
            <Button className="bg-[#C9A962] hover:bg-[#B8A052] text-[#0A0806] rounded-full px-6 h-12 font-semibold whitespace-nowrap transition-all hover:scale-105 active:scale-95">
              시작하기
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Safe Area for iOS */}
      <div className="h-safe-area-inset-bottom bg-[#0A0806]" />
    </div>
  )
}

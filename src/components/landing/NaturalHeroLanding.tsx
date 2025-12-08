'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { ArrowRight } from 'lucide-react'

/**
 * AI Chat Video
 * Shows a phone mockup with real chat demo video
 */
function AIChatVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // 뷰포트에 들어오면 자동 재생
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // 자동 재생 실패 시 무시 (사용자 상호작용 필요)
            })
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative">
      {/* Phone mockup frame */}
      <div className="relative w-[200px] sm:w-[240px] mx-auto">
        <div className="bg-[var(--sand-200)] rounded-[2rem] p-2 shadow-xl">
          {/* Screen area with video */}
          <div className="w-full aspect-[9/16] rounded-[1.5rem] overflow-hidden bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/examples/chat-poster.jpg"
            >
              <source src="/examples/chat.webm" type="video/webm" />
              <source src="/examples/chat.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* Label */}
      <p className="text-center mt-4 text-sm text-[var(--text-muted)]">AI 채팅으로 디자인</p>
    </div>
  )
}

/**
 * Template Showcase
 * Shows Magazine and Old Money template previews
 */
function TemplateShowcase() {
  return (
    <div className="flex gap-3 sm:gap-4 justify-center">
      {/* Magazine Preview */}
      <div className="flex flex-col items-center">
        <div className="w-[130px] sm:w-[150px] bg-[var(--sand-200)] rounded-[1.5rem] p-1.5 shadow-lg overflow-hidden">
          <div className="w-full aspect-[9/16] rounded-[1.2rem] overflow-hidden bg-[#1a1a1a] relative">
            {/* Magazine style placeholder */}
            <div className="absolute inset-0 flex flex-col">
              {/* Background image placeholder */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

              {/* Top branding */}
              <div className="relative z-10 p-3 flex justify-between items-start">
                <span className="text-[8px] tracking-[0.3em] text-white/90 font-light">MAISON</span>
                <span className="text-[6px] tracking-wider text-[#c9a962]">SPECIAL ISSUE</span>
              </div>

              {/* Bottom content */}
              <div className="relative z-10 mt-auto p-3">
                <div className="border-l-2 border-[#c9a962] pl-2">
                  <span className="text-[6px] tracking-widest text-[#c9a962]">WEDDING</span>
                </div>
                <h3 className="text-white text-sm font-light mt-1">민수</h3>
                <span className="text-[#c9a962] text-[8px]">&</span>
                <h3 className="text-white text-sm font-light">수진</h3>
                <p className="text-[6px] text-white/60 mt-1">2025.05.24</p>
              </div>
            </div>
          </div>
        </div>
        <span className="mt-2 text-xs text-[var(--text-muted)]">매거진</span>
      </div>

      {/* Old Money Preview */}
      <div className="flex flex-col items-center">
        <div className="w-[130px] sm:w-[150px] bg-[var(--sand-200)] rounded-[1.5rem] p-1.5 shadow-lg overflow-hidden">
          <div className="w-full aspect-[9/16] rounded-[1.2rem] overflow-hidden bg-[#f5f0e8] relative">
            {/* Old Money style placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              {/* Decorative frame */}
              <div className="border border-[#8b7355]/30 p-4 w-full h-full flex flex-col items-center justify-center">
                {/* Ornament top */}
                <div className="text-[#8b7355]/50 text-lg">❧</div>

                {/* Names */}
                <div className="text-center my-auto">
                  <p className="text-[#3d3d3d] text-[10px] tracking-widest mb-2">THE WEDDING OF</p>
                  <h3 className="text-[#2d2d2d] text-sm font-serif">민수</h3>
                  <span className="text-[#8b7355] text-xs italic">&</span>
                  <h3 className="text-[#2d2d2d] text-sm font-serif">수진</h3>
                </div>

                {/* Date */}
                <div className="text-center">
                  <p className="text-[8px] text-[#5d5d5d] tracking-wider">MAY 24, 2025</p>
                </div>

                {/* Ornament bottom */}
                <div className="text-[#8b7355]/50 text-lg rotate-180">❧</div>
              </div>
            </div>
          </div>
        </div>
        <span className="mt-2 text-xs text-[var(--text-muted)]">올드 머니</span>
      </div>
    </div>
  )
}

/**
 * NaturalHeroLanding - Single page hero landing
 * Fresh & Elegant design with Ivory/Sage palette
 */
export function NaturalHeroLanding() {
  return (
    <section className="relative min-h-screen bg-[var(--ivory-100)] pt-20 pb-12 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--sage-100)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,var(--sand-100)_0%,transparent_50%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-8 sm:pt-16">
        {/* Hero Text */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[var(--text-primary)] mb-4 sm:mb-6 leading-tight">
            원하는 분위기를 말하면,
            <br />
            <span className="text-[var(--sage-600)] font-medium">AI가 바로 시안을 만들어 드립니다</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-md mx-auto text-sm sm:text-base">
            3분만에 나만의 특별한 청첩장을 완성하세요
          </p>
        </div>

        {/* Two-column Preview Area */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-5xl mx-auto items-center justify-center">
          {/* Left: AI Chat Video */}
          <div className="flex-shrink-0">
            <AIChatVideo />
          </div>

          {/* Right: Template Previews (Magazine + Old Money) */}
          <div className="flex-shrink-0">
            <TemplateShowcase />
            <p className="text-center mt-4 text-sm text-[var(--text-muted)]">생성된 청첩장</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10 sm:mt-16">
          <Link href="/se/create">
            <Button className="bg-[var(--sage-500)] hover:bg-[var(--sage-600)] text-white px-8 py-4 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 h-auto">
              지금 바로 시작하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-xs text-[var(--text-light)]">
            회원가입 후 무료로 미리보기 가능
          </p>
        </div>
      </div>

    </section>
  )
}

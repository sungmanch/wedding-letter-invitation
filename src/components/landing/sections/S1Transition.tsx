'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

export function S1Transition() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionHeight = rect.height - window.innerHeight
      const scrolled = -rect.top
      const progress = Math.min(1, Math.max(0, scrolled / sectionHeight))
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dim overlay opacity increases with scroll
  const dimOpacity = scrollProgress * 0.85

  // Question appears after 30% scroll
  const questionVisible = scrollProgress > 0.3

  return (
    <section ref={sectionRef} className="relative h-[150vh]">
      {/* Sticky Video Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Poster Image (shown while video loads) */}
        {!videoLoaded && (
          <Image
            src="/examples/Landing_Video_poster.jpg"
            alt="Wedding video poster"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}

        {/* Background Video with multiple sources */}
        <video
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/examples/Landing_Video_poster.jpg"
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src="/examples/Landing_Video.webm" type="video/webm" />
          <source src="/examples/Landing_Video.mp4" type="video/mp4" />
        </video>

        {/* Film Grain Overlay */}
        <div className="absolute inset-0 film-grain pointer-events-none" />

        {/* Dim Overlay */}
        <div
          className="absolute inset-0 bg-[#0A0806] transition-opacity duration-300"
          style={{ opacity: dimOpacity }}
        />

        {/* Provocative Question */}
        <div
          className={`absolute inset-0 flex items-center justify-center px-6 transition-all duration-700 ${
            questionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center leading-relaxed tracking-wide">
            <span className="block text-[#F5E6D3]">흔한 모바일 청첩장,</span>
            <span className="block mt-3 text-[#C9A962]">기억에 남으시던가요?</span>
          </h2>
        </div>

        {/* Scroll Indicator - appears at start, fades on scroll */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500 ${
            scrollProgress > 0.1 ? 'opacity-0' : 'opacity-70'
          }`}
        >
          <span className="text-xs text-[#F5E6D3]/60 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#C9A962] to-transparent" />
        </div>
      </div>
    </section>
  )
}

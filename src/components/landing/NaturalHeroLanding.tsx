'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

// Template data for carousel
const templates = [
  {
    id: 'magazine',
    name: '매거진',
    description: '트렌디한 잡지 커버',
  },
  {
    id: 'oldmoney',
    name: '올드 머니',
    description: '클래식한 럭셔리',
  },
  {
    id: 'minimal',
    name: '미니멀',
    description: '깔끔한 타이포',
  },
]

/**
 * AI Chat Video
 * Shows a phone mockup with real chat demo video
 */
function AIChatVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {})
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
      <div className="relative w-[340px] sm:w-[400px] lg:w-[430px] mx-auto">
        <div className="bg-[var(--sand-200)] rounded-[2.5rem] p-1 shadow-xl">
          <div className="w-full aspect-[3/4] rounded-[2.25rem] overflow-hidden bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/examples/chat-poster.jpg"
            >
              <source src="/examples/1208_AICHAT.webm" type="video/webm" />
            </video>
          </div>
        </div>
      </div>
      <p className="text-center mt-3 text-sm text-[var(--text-muted)]">AI 채팅으로 디자인</p>
    </div>
  )
}

/**
 * Magazine Template Preview
 */
function MagazineTemplate() {
  return (
    <div className="w-full h-full bg-[#0A0A0A] relative">
      <Image
        src="/examples/images/example_wedding_image5.png"
        alt="Magazine style"
        fill
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, transparent 30%, transparent 50%, rgba(10,10,10,0.9) 100%)',
        }}
      />
      <div className="absolute top-5 left-0 right-0 text-center z-10">
        <h2
          className="text-xl tracking-[0.2em] text-white"
          style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}
        >
          WITH LOVE
        </h2>
        <p className="text-[10px] tracking-[0.15em] text-white/60 mt-1">MAY 2025</p>
      </div>
      <div className="absolute bottom-14 left-0 right-0 text-center px-4 z-10">
        <h1
          className="text-2xl leading-tight text-white"
          style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}
        >
          Terry
          <span className="block text-base my-1 text-[#C9A962]">&</span>
          Blair
        </h1>
      </div>
      <div className="absolute bottom-5 left-0 right-0 text-center z-10">
        <p
          className="text-[9px] tracking-wider text-white/50"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          THE LOVE STORY CONTINUES
        </p>
      </div>
    </div>
  )
}

/**
 * Old Money Template Preview
 */
function OldMoneyTemplate() {
  return (
    <div className="w-full h-full bg-[#FAF8F5] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-[60%] z-10">
        <Image
          src="/examples/images/example_wedding_image9.png"
          alt="Old Money style"
          fill
          className="object-cover"
          style={{ filter: 'brightness(1.05) contrast(0.92) saturate(0.7) sepia(0.15)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(250, 248, 240, 0.15)', mixBlendMode: 'overlay' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 70%, #FAF8F5 100%)' }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[40%] flex flex-col items-center justify-center text-center z-20 px-5">
        <h1
          className="text-lg tracking-[0.25em] uppercase text-[#2C2C2C]"
          style={{ fontFamily: 'Noto Serif KR, serif', fontWeight: 400 }}
        >
          민수
        </h1>
        <span
          className="text-xs tracking-[0.3em] uppercase my-1.5 text-[#8A8580]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          and
        </span>
        <h1
          className="text-lg tracking-[0.25em] uppercase text-[#2C2C2C]"
          style={{ fontFamily: 'Noto Serif KR, serif', fontWeight: 400 }}
        >
          수진
        </h1>
        <div className="w-10 h-[1px] bg-[#D4D0C8] my-2.5" />
        <p
          className="text-[10px] tracking-[0.2em] uppercase text-[#8A8580]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          MAY 24, 2025
        </p>
      </div>
    </div>
  )
}

/**
 * Minimal Template Preview
 */
function MinimalTemplate() {
  return (
    <div className="w-full h-full bg-white relative">
      <div className="absolute top-0 left-0 right-0 h-[55%]">
        <Image
          src="/examples/images/example_wedding_image4.png"
          alt="Minimal style"
          fill
          className="object-cover"
          style={{ filter: 'brightness(1.02) contrast(0.98)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 80%, white 100%)' }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[45%] flex flex-col items-center justify-center text-center z-20 px-5">
        <p
          className="text-[10px] tracking-[0.4em] uppercase text-[#999] mb-3"
          style={{ fontFamily: 'Pretendard, sans-serif', fontWeight: 300 }}
        >
          WEDDING INVITATION
        </p>
        <h1
          className="text-xl tracking-[0.1em] text-[#333] mb-0.5"
          style={{ fontFamily: 'Noto Serif KR, serif', fontWeight: 300 }}
        >
          준호
        </h1>
        <span
          className="text-base text-[#C9A962] my-0.5"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          &
        </span>
        <h1
          className="text-xl tracking-[0.1em] text-[#333] mb-3"
          style={{ fontFamily: 'Noto Serif KR, serif', fontWeight: 300 }}
        >
          지현
        </h1>
        <div className="w-6 h-[1px] bg-[#ddd] my-2" />
        <p
          className="text-xs text-[#666]"
          style={{ fontFamily: 'Pretendard, sans-serif', fontWeight: 300 }}
        >
          2025. 05. 24 SAT
        </p>
      </div>
    </div>
  )
}

/**
 * Template Carousel Component (smaller for side-by-side layout)
 */
function TemplateCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % templates.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const renderTemplate = (index: number) => {
    switch (templates[index].id) {
      case 'magazine':
        return <MagazineTemplate />
      case 'oldmoney':
        return <OldMoneyTemplate />
      case 'minimal':
        return <MinimalTemplate />
      default:
        return null
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Phone mockup frame */}
      <div className="relative w-[255px] sm:w-[300px] lg:w-[322px] mx-auto">
        <div className="bg-[var(--sand-200)] rounded-[2.5rem] p-1 shadow-xl">
          <div className="w-full aspect-[9/16] rounded-[2.25rem] overflow-hidden relative">
            {renderTemplate(currentIndex)}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-[-16px] sm:left-[-20px] top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors z-20"
          aria-label="Previous template"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-primary)]" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-[-16px] sm:right-[-20px] top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors z-20"
          aria-label="Next template"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-primary)]" />
        </button>
      </div>

      {/* Template info & dots */}
      <div className="mt-3 text-center">
        <p
          className="text-base text-[var(--text-primary)] font-medium"
          style={{ fontFamily: 'Noto Serif KR, serif' }}
        >
          {templates[currentIndex].name}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{templates[currentIndex].description}</p>

        {/* Dots indicator */}
        <div className="flex gap-1.5 justify-center mt-3">
          {templates.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-[var(--sage-500)] w-4'
                  : 'bg-[var(--sand-200)] hover:bg-[var(--sand-100)]'
              }`}
              aria-label={`Go to template ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * NaturalHeroLanding - Top Hero + Video/Template Side-by-Side + Bottom CTA
 * Font: Playfair Display (영문, NO italic) + Noto Serif KR (한글) + Pretendard (본문)
 */
export function NaturalHeroLanding() {
  const [showMobileCTA, setShowMobileCTA] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowMobileCTA(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500&family=Playfair+Display:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <section className="relative min-h-screen bg-[var(--ivory-100)] overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,var(--sage-100)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,var(--sand-100)_0%,transparent_50%)]" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-8">
          {/* Top: Hero Text (Centered) */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
              <span
                className="block text-[var(--text-primary)]"
                style={{ fontFamily: 'Noto Serif KR, serif', fontWeight: 300 }}
              >
                원하는 분위기의 청첩장을,
              </span>
              <span
                className="block text-[var(--sage-600)] mt-1"
                style={{ fontFamily: 'Noto Serif KR, serif', fontWeight: 500 }}
              >
                AI와 함께 손쉽게 만들어보세요
              </span>
            </h1>
          </div>

          {/* Middle: Video + Arrow + Template (Side by Side) */}
          <div className="flex flex-col sm:flex-row items-start justify-center gap-6 sm:gap-8 lg:gap-12 mb-10 sm:mb-12">
            {/* Left: AI Chat Video */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <AIChatVideo />
            </div>

            {/* Arrow - vertically centered with mockups */}
            <div className="hidden sm:flex flex-col items-center justify-center self-center">
              <ArrowRight className="w-6 h-6 lg:w-8 lg:h-8 text-[var(--sage-400)]" />
              <span className="text-xs text-[var(--text-light)]">생성</span>
            </div>
            <div className="sm:hidden text-center">
              <span className="text-2xl text-[var(--sage-400)]">↓</span>
            </div>

            {/* Right: Template Carousel */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <TemplateCarousel />
            </div>
          </div>

          {/* Bottom: CTA */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/se/create">
                <Button
                  className="bg-[var(--sage-500)] hover:bg-[var(--sage-600)] text-white px-8 py-3.5 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 h-auto w-full sm:w-auto"
                  style={{ fontFamily: 'Pretendard, sans-serif' }}
                >
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex items-center gap-6 justify-center text-sm text-[var(--text-light)]">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                회원가입 후 무료 미리보기
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                5분 완성
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Floating CTA */}
        <div
          className={`fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-[var(--sand-100)] z-50 lg:hidden transition-transform duration-300 ${
            showMobileCTA ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <Link href="/se/create" className="block">
            <Button
              className="w-full bg-[var(--sage-500)] hover:bg-[var(--sage-600)] text-white py-3.5 text-base rounded-full shadow-lg h-auto"
              style={{ fontFamily: 'Pretendard, sans-serif' }}
            >
              무료로 시작하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}

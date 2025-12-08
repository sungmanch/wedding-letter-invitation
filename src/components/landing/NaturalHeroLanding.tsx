'use client'

import { useState, useEffect, useCallback } from 'react'
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
    bgColor: '#0A0A0A',
    image: '/examples/images/example_wedding_image5.png',
  },
  {
    id: 'oldmoney',
    name: '올드 머니',
    description: '클래식한 럭셔리',
    bgColor: '#FAF8F5',
    image: '/examples/images/example_wedding_image9.png',
  },
  {
    id: 'minimal',
    name: '미니멀',
    description: '깔끔한 타이포',
    bgColor: '#FFFFFF',
    image: '/examples/images/example_wedding_image4.png',
  },
]

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
      {/* Top title */}
      <div className="absolute top-6 left-0 right-0 text-center z-10">
        <h2
          className="text-2xl tracking-[0.2em] text-white"
          style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontStyle: 'italic' }}
        >
          WITH LOVE
        </h2>
        <p className="text-xs tracking-[0.15em] text-white/60 mt-1">MAY 2025</p>
      </div>
      {/* Bottom names */}
      <div className="absolute bottom-16 left-0 right-0 text-center px-4 z-10">
        <h1
          className="text-3xl leading-tight text-white"
          style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontStyle: 'italic' }}
        >
          Terry
          <span className="block text-lg my-1 text-[#C9A962]">&</span>
          Blair
        </h1>
      </div>
      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p
          className="text-[10px] tracking-wider text-white/50"
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
      {/* Cotton paper texture */}
      <div
        className="absolute inset-0 z-0"
        style={{
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Image section - top 60% */}
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
      {/* Content section */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] flex flex-col items-center justify-center text-center z-20 px-6">
        <h1
          className="text-xl tracking-[0.25em] uppercase text-[#2C2C2C]"
          style={{ fontFamily: 'Noto Serif KR, serif', fontWeight: 400 }}
        >
          민수
        </h1>
        <span
          className="text-sm tracking-[0.3em] uppercase my-2 text-[#8A8580]"
          style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}
        >
          and
        </span>
        <h1
          className="text-xl tracking-[0.25em] uppercase text-[#2C2C2C]"
          style={{ fontFamily: 'Noto Serif KR, serif', fontWeight: 400 }}
        >
          수진
        </h1>
        <div className="w-12 h-[1px] bg-[#D4D0C8] my-3" />
        <p
          className="text-xs tracking-[0.2em] uppercase text-[#8A8580]"
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
      {/* Top image - 55% */}
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
      {/* Content section */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] flex flex-col items-center justify-center text-center z-20 px-6">
        <p
          className="text-xs tracking-[0.4em] uppercase text-[#999] mb-4"
          style={{ fontFamily: 'Pretendard, sans-serif', fontWeight: 300 }}
        >
          WEDDING INVITATION
        </p>
        <h1
          className="text-2xl tracking-[0.1em] text-[#333] mb-1"
          style={{ fontFamily: 'Noto Serif KR, serif', fontWeight: 300 }}
        >
          준호
        </h1>
        <span
          className="text-lg text-[#C9A962] my-1"
          style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}
        >
          &
        </span>
        <h1
          className="text-2xl tracking-[0.1em] text-[#333] mb-4"
          style={{ fontFamily: 'Noto Serif KR, serif', fontWeight: 300 }}
        >
          지현
        </h1>
        <div className="w-8 h-[1px] bg-[#ddd] my-3" />
        <p
          className="text-sm text-[#666]"
          style={{ fontFamily: 'Pretendard, sans-serif', fontWeight: 300 }}
        >
          2025. 05. 24 SAT
        </p>
      </div>
    </div>
  )
}

/**
 * Template Carousel Component
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

  // Auto-play
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
      <div className="relative w-[280px] sm:w-[320px] lg:w-[360px] mx-auto">
        <div className="bg-[var(--sand-200)] rounded-[2.5rem] p-2 shadow-2xl">
          {/* Screen area */}
          <div className="w-full aspect-[9/16] rounded-[2rem] overflow-hidden relative">
            {/* Template content */}
            {renderTemplate(currentIndex)}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-[-20px] sm:left-[-28px] top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors z-20"
          aria-label="Previous template"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-primary)]" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-[-20px] sm:right-[-28px] top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors z-20"
          aria-label="Next template"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-primary)]" />
        </button>
      </div>

      {/* Template info & dots */}
      <div className="mt-6 text-center">
        <p
          className="text-lg text-[var(--text-primary)] font-medium"
          style={{ fontFamily: 'Noto Serif KR, serif' }}
        >
          {templates[currentIndex].name}
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-1">{templates[currentIndex].description}</p>

        {/* Dots indicator */}
        <div className="flex gap-2 justify-center mt-4">
          {templates.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-[var(--sage-500)] w-6'
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
 * NaturalHeroLanding - Split Hero Layout
 * Left: Headline + CTA | Right: Template Carousel
 * Font: Playfair Display (영문) + Noto Serif KR (한글) + Pretendard (본문)
 */
export function NaturalHeroLanding() {
  const [showMobileCTA, setShowMobileCTA] = useState(false)

  // Show floating CTA after scroll
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
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
        rel="stylesheet"
      />

      <section className="relative min-h-screen bg-[var(--ivory-100)] overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,var(--sage-100)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,var(--sand-100)_0%,transparent_50%)]" />
        </div>

        {/* Main Content - Split Layout */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 max-w-7xl mx-auto">
            {/* Left Panel - Text & CTA */}
            <div className="flex-1 text-center lg:text-left max-w-xl lg:max-w-lg">
              {/* Tagline */}
              <p
                className="text-sm sm:text-base tracking-[0.2em] uppercase text-[var(--sage-500)] mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                AI Wedding Invitation
              </p>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-6">
                <span
                  className="block text-[var(--text-primary)]"
                  style={{ fontFamily: 'Noto Serif KR, serif', fontWeight: 300 }}
                >
                  원하는 분위기를 말하면,
                </span>
                <span
                  className="block text-[var(--sage-600)] mt-2"
                  style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontStyle: 'italic' }}
                >
                  AI가 바로 시안을
                </span>
                <span
                  className="block text-[var(--sage-600)]"
                  style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontStyle: 'italic' }}
                >
                  만들어 드립니다
                </span>
              </h1>

              {/* Subheadline */}
              <p
                className="text-base sm:text-lg text-[var(--text-muted)] mb-8 leading-relaxed"
                style={{ fontFamily: 'Pretendard, sans-serif' }}
              >
                30가지 이상의 프리미엄 템플릿과 AI 디자인 엔진으로
                <br className="hidden sm:block" />
                단 5분 만에 완성하는 나만의 청첩장
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/se/create">
                  <Button
                    className="bg-[var(--sage-500)] hover:bg-[var(--sage-600)] text-white px-8 py-4 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 h-auto w-full sm:w-auto"
                    style={{ fontFamily: 'Pretendard, sans-serif' }}
                  >
                    무료로 시작하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#templates">
                  <Button
                    variant="outline"
                    className="border-[var(--sage-300)] text-[var(--sage-600)] hover:bg-[var(--sage-50)] px-8 py-4 text-base sm:text-lg rounded-full h-auto w-full sm:w-auto"
                    style={{ fontFamily: 'Pretendard, sans-serif' }}
                  >
                    템플릿 둘러보기
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-[var(--text-light)]">
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

            {/* Right Panel - Template Carousel */}
            <div className="flex-1 w-full max-w-md lg:max-w-none">
              <TemplateCarousel />
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
              className="w-full bg-[var(--sage-500)] hover:bg-[var(--sage-600)] text-white py-4 text-base rounded-full shadow-lg h-auto"
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

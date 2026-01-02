'use client'

/**
 * Editorial Landing Page
 *
 * Magazine/Editorial aesthetic for Maison de Letter
 * - Bold typography with dramatic scale contrasts
 * - Asymmetric grid-breaking composition
 * - Curated white space and sophisticated color palette
 * - Staggered reveal animations
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { Button } from '@/components/ui'

// ============================================
// Types
// ============================================

interface TemplateCard {
  id: string
  name: string
  nameKr: string
  tagline: string
  image: string
  accent: string
}

// ============================================
// Data
// ============================================

const TEMPLATES: TemplateCard[] = [
  {
    id: 'unique1',
    name: 'Classic',
    nameKr: '클래식',
    tagline: '우아한 전통미',
    image: '/examples/unique1.png',
    accent: '#C9A962',
  },
  {
    id: 'unique2',
    name: 'Casual',
    nameKr: '캐주얼',
    tagline: '편안한 감성',
    image: '/examples/unique2.png',
    accent: '#8B7355',
  },
  {
    id: 'unique3',
    name: 'Minimal',
    nameKr: '미니멀',
    tagline: '간결한 아름다움',
    image: '/examples/unique3.png',
    accent: '#4A5568',
  },
  {
    id: 'unique4',
    name: 'Modern',
    nameKr: '모던',
    tagline: '세련된 현대미',
    image: '/examples/unique4.png',
    accent: '#2D3748',
  },
  {
    id: 'unique5',
    name: 'Bright',
    nameKr: '브라이트',
    tagline: '화사한 밝음',
    image: '/examples/unique5.png',
    accent: '#E8B4B8',
  },
  {
    id: 'unique6',
    name: 'Mono',
    nameKr: '모노',
    tagline: '담백한 흑백',
    image: '/examples/unique6.png',
    accent: '#1A1A1A',
  },
]

const FEATURES = [
  {
    number: '01',
    title: 'AI 대화',
    description: '원하는 분위기를 말하면\nAI가 바로 시안을 만듭니다',
  },
  {
    number: '02',
    title: '실시간 편집',
    description: '모든 요소를 클릭해서\n바로 수정할 수 있어요',
  },
  {
    number: '03',
    title: '프리미엄 템플릿',
    description: '전문 디자이너가 만든\n6가지 템플릿',
  },
]

// ============================================
// Hook: Intersection Observer for animations
// ============================================

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.disconnect()
      }
    }, { threshold: 0.2, ...options })

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return { ref, isInView }
}

// ============================================
// Components
// ============================================

/**
 * Hero Section - Editorial masthead style
 */
function HeroSection() {
  const { ref, isInView } = useInView()

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 editorial-texture opacity-40" />

      {/* Diagonal accent line */}
      <div
        className="absolute top-0 right-0 w-[1px] h-[60vh] bg-gradient-to-b from-transparent via-[var(--sage-400)] to-transparent origin-top-right rotate-[15deg] translate-x-[30vw] opacity-30"
      />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-24 pb-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-4 items-center">

          {/* Left: Typography block */}
          <div className="lg:col-span-7 lg:pr-8">
            {/* Issue tag */}
            <div
              className={`inline-flex items-center gap-3 mb-6 transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--sage-600)] font-medium">
                Vol. 2025
              </span>
              <span className="w-8 h-[1px] bg-[var(--sage-400)]" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)]">
                Wedding Edition
              </span>
            </div>

            {/* Main headline - Dramatic typography */}
            <h1
              className={`transition-all duration-1000 delay-100 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span
                className="block text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] tracking-[-0.03em] text-[var(--text-primary)]"
                style={{ fontFamily: '"Playfair Display", "Noto Serif KR", serif' }}
              >
                Create
              </span>
              <span
                className="block text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] tracking-[-0.03em] text-[var(--sage-600)] mt-1"
                style={{ fontFamily: '"Playfair Display", "Noto Serif KR", serif' }}
              >
                Your Story
              </span>
              <span
                className="block text-[clamp(1.2rem,3vw,1.8rem)] leading-[1.4] tracking-[0.02em] text-[var(--text-muted)] mt-4 font-light"
                style={{ fontFamily: '"Noto Serif KR", serif' }}
              >
                당신만의 이야기를 담은 청첩장
              </span>
            </h1>

            {/* Subtext */}
            <p
              className={`max-w-md mt-8 text-base leading-relaxed text-[var(--text-body)] transition-all duration-700 delay-300 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ fontFamily: 'Pretendard, sans-serif' }}
            >
              AI에게 원하는 분위기를 말하면,<br />
              <span className="text-[var(--sage-600)] font-medium">프리미엄 템플릿</span>으로 바로 완성됩니다.
            </p>

            {/* CTA */}
            <div
              className={`mt-10 flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-500 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Link href="/login?redirect=/se2/create">
                <Button className="editorial-cta group">
                  <span>시작하기</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#templates">
                <Button variant="ghost" className="editorial-cta-ghost">
                  템플릿 둘러보기
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Featured template showcase */}
          <div
            className={`lg:col-span-5 transition-all duration-1000 delay-200 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <FeaturedTemplateShowcase />
          </div>
        </div>
      </div>

      {/* Bottom editorial flourish */}
      <div className="absolute bottom-8 left-6 lg:left-12">
        <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-[var(--text-light)]">
          <span>Scroll</span>
          <div className="w-8 h-[1px] bg-[var(--sand-200)]" />
          <span className="editorial-scroll-indicator" />
        </div>
      </div>
    </section>
  )
}

/**
 * Featured Template Showcase - Stacked card effect
 */
function FeaturedTemplateShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextTemplate = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % TEMPLATES.length)
  }, [])

  const prevTemplate = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + TEMPLATES.length) % TEMPLATES.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextTemplate, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextTemplate])

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Stacked cards effect */}
      <div className="relative w-[280px] sm:w-[320px] lg:w-[340px] mx-auto aspect-[9/16]">
        {/* Background cards (stacked effect) */}
        <div
          className="absolute inset-0 rounded-2xl bg-[var(--sand-100)] transform translate-x-4 translate-y-4 opacity-40"
        />
        <div
          className="absolute inset-0 rounded-2xl bg-[var(--sand-200)] transform translate-x-2 translate-y-2 opacity-60"
        />

        {/* Main card */}
        <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl editorial-card">
          <Image
            src={TEMPLATES[activeIndex].image}
            alt={TEMPLATES[activeIndex].name}
            fill
            className="object-cover transition-transform duration-700"
            priority
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Template info */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div>
                <p
                  className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-1"
                  style={{ fontFamily: 'Pretendard, sans-serif' }}
                >
                  Template {String(activeIndex + 1).padStart(2, '0')}
                </p>
                <h3
                  className="text-2xl text-white tracking-wide"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {TEMPLATES[activeIndex].name}
                </h3>
                <p className="text-sm text-white/70 mt-0.5">
                  {TEMPLATES[activeIndex].tagline}
                </p>
              </div>

              {/* Accent color indicator */}
              <div
                className="w-3 h-3 rounded-full ring-2 ring-white/30"
                style={{ backgroundColor: TEMPLATES[activeIndex].accent }}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-4">
          <button
            onClick={prevTemplate}
            className="w-10 h-10 rounded-full border border-[var(--sand-200)] flex items-center justify-center hover:bg-[var(--sand-100)] transition-colors"
            aria-label="Previous template"
          >
            <ChevronLeft className="w-4 h-4 text-[var(--text-body)]" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {TEMPLATES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-6 bg-[var(--sage-500)]'
                    : 'w-1 bg-[var(--sand-200)] hover:bg-[var(--sand-100)]'
                }`}
                aria-label={`Go to template ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextTemplate}
            className="w-10 h-10 rounded-full border border-[var(--sand-200)] flex items-center justify-center hover:bg-[var(--sand-100)] transition-colors"
            aria-label="Next template"
          >
            <ChevronRight className="w-4 h-4 text-[var(--text-body)]" />
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Features Section - Editorial numbered list
 */
function FeaturesSection() {
  const { ref, isInView } = useInView()

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[var(--ivory-50)]">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="max-w-2xl mb-16 lg:mb-24">
          <span
            className={`text-[10px] tracking-[0.3em] uppercase text-[var(--sage-600)] font-medium transition-all duration-700 ${
              isInView ? 'opacity-100' : 'opacity-0'
            }`}
          >
            How It Works
          </span>
          <h2
            className={`mt-4 text-3xl lg:text-4xl tracking-tight text-[var(--text-primary)] transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ fontFamily: '"Playfair Display", "Noto Serif KR", serif' }}
          >
            세 단계로 완성되는<br />
            <span className="text-[var(--sage-600)]">나만의 청첩장</span>
          </h2>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.number}
              className={`editorial-feature-card transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(i + 2) * 100}ms` }}
            >
              {/* Large number */}
              <span
                className="block text-[5rem] lg:text-[6rem] leading-none font-light text-[var(--sand-200)] tracking-tighter"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                {feature.number}
              </span>

              {/* Content */}
              <div className="-mt-6 relative z-10">
                <h3
                  className="text-xl font-medium text-[var(--text-primary)] mb-3"
                  style={{ fontFamily: '"Noto Serif KR", serif' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed text-[var(--text-muted)] whitespace-pre-line"
                  style={{ fontFamily: 'Pretendard, sans-serif' }}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Templates Gallery Section - Editorial spread layout
 */
function TemplatesSection() {
  const { ref, isInView } = useInView()

  return (
    <section ref={ref} id="templates" className="py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section header - asymmetric */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-20">
          <div>
            <span
              className={`text-[10px] tracking-[0.3em] uppercase text-[var(--sage-600)] font-medium transition-all duration-700 ${
                isInView ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Template Collection
            </span>
            <h2
              className={`mt-4 text-3xl lg:text-5xl tracking-tight text-[var(--text-primary)] transition-all duration-700 delay-100 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ fontFamily: '"Playfair Display", "Noto Serif KR", serif' }}
            >
              6가지 프리미엄 템플릿
            </h2>
          </div>

          <p
            className={`max-w-sm text-sm text-[var(--text-muted)] lg:text-right transition-all duration-700 delay-200 ${
              isInView ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ fontFamily: 'Pretendard, sans-serif' }}
          >
            전문 디자이너가 제작한 템플릿으로<br />
            클릭 한 번에 완성도 높은 청첩장을 만들어보세요.
          </p>
        </div>

        {/* Templates grid - editorial masonry-like */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {TEMPLATES.map((template, i) => (
            <div
              key={template.id}
              className={`group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer editorial-template-card transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              } ${i === 0 || i === 3 ? 'lg:row-span-1' : ''}`}
              style={{ transitionDelay: `${(i + 1) * 100}ms` }}
            >
              <Image
                src={template.image}
                alt={template.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

              {/* Template info */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 lg:p-6">
                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/70 mb-1">
                    {template.name}
                  </p>
                  <h3
                    className="text-lg lg:text-xl text-white"
                    style={{ fontFamily: '"Noto Serif KR", serif' }}
                  >
                    {template.nameKr}
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    {template.tagline}
                  </p>
                </div>
              </div>

              {/* Corner accent */}
              <div
                className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: template.accent }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * AI Demo Section - Video showcase
 */
function AIDemoSection() {
  const { ref, isInView } = useInView()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isInView && !isPlaying) {
      video.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [isInView, isPlaying])

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[#1A1A1A] text-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text content */}
          <div>
            <span
              className={`text-[10px] tracking-[0.3em] uppercase text-[var(--sage-400)] font-medium transition-all duration-700 ${
                isInView ? 'opacity-100' : 'opacity-0'
              }`}
            >
              AI-Powered Design
            </span>
            <h2
              className={`mt-4 text-3xl lg:text-4xl tracking-tight transition-all duration-700 delay-100 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ fontFamily: '"Playfair Display", "Noto Serif KR", serif' }}
            >
              대화로 만드는<br />
              <span className="text-[var(--sage-400)]">새로운 경험</span>
            </h2>

            <p
              className={`mt-6 text-base leading-relaxed text-white/60 max-w-md transition-all duration-700 delay-200 ${
                isInView ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ fontFamily: 'Pretendard, sans-serif' }}
            >
              복잡한 디자인 툴 없이, 원하는 분위기를 말씀해주세요.
              AI가 최적의 템플릿과 스타일을 추천해드립니다.
            </p>

            {/* Feature bullets */}
            <ul
              className={`mt-8 space-y-3 transition-all duration-700 delay-300 ${
                isInView ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {[
                '"우아하고 클래식한 느낌으로"',
                '"밝고 화사한 봄 느낌"',
                '"모던하고 심플하게"',
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-white/70"
                  style={{ fontFamily: 'Pretendard, sans-serif' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage-400)]" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Video showcase */}
          <div
            className={`relative transition-all duration-1000 delay-200 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="relative w-full max-w-[360px] mx-auto">
              {/* Phone frame */}
              <div className="relative rounded-[2.5rem] bg-[#2A2A2A] p-2 shadow-2xl">
                <div className="rounded-[2rem] overflow-hidden aspect-[9/16] bg-black">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    poster="/examples/chat-poster.jpg"
                  >
                    <source src="/examples/1208_AICHAT.webm" type="video/webm" />
                  </video>
                </div>

                {/* Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1A1A1A] rounded-full" />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 border border-white/10 rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[var(--sage-600)]/20 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Final CTA Section - Editorial closing spread
 */
function CTASection() {
  const { ref, isInView } = useInView()

  return (
    <section ref={ref} className="py-24 lg:py-40 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 editorial-texture opacity-30" />

      {/* Decorative circles */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 -translate-y-1/2 rounded-full bg-[var(--sage-100)] opacity-30 blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 -translate-y-1/2 rounded-full bg-[var(--sand-100)] opacity-40 blur-2xl" />

      <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
        <span
          className={`text-[10px] tracking-[0.3em] uppercase text-[var(--sage-600)] font-medium transition-all duration-700 ${
            isInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Start Creating
        </span>

        <h2
          className={`mt-6 text-4xl lg:text-6xl tracking-tight text-[var(--text-primary)] transition-all duration-700 delay-100 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ fontFamily: '"Playfair Display", "Noto Serif KR", serif' }}
        >
          당신의 이야기를<br />
          <span className="text-[var(--sage-600)]">지금 시작하세요</span>
        </h2>

        <p
          className={`mt-6 text-base text-[var(--text-muted)] max-w-md mx-auto transition-all duration-700 delay-200 ${
            isInView ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ fontFamily: 'Pretendard, sans-serif' }}
        >
          카드 등록 없이 무료로 시작하세요.<br />
          마음에 들면 그때 결제하시면 됩니다.
        </p>

        <div
          className={`mt-10 transition-all duration-700 delay-300 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link href="/login?redirect=/se2/create">
            <Button className="editorial-cta-large group">
              <span>무료로 시작하기</span>
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div
          className={`mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-light)] transition-all duration-700 delay-400 ${
            isInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--sage-500)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            카드 등록 불필요
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--sage-500)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            5분 만에 완성
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--sage-500)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            무제한 수정
          </span>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Main Export
// ============================================

export function EditorialLanding() {
  return (
    <>
      {/* Google Fonts for Editorial Typography */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Noto+Serif+KR:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div className="bg-[var(--ivory-100)]">
        <HeroSection />
        <FeaturesSection />
        <TemplatesSection />
        <AIDemoSection />
        <CTASection />
      </div>
    </>
  )
}

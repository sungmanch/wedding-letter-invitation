'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { IntroPreview } from '@/components/invitation/intros/IntroPreview'
import { getTemplateById } from '@/lib/themes'

const THEMES = [
  {
    id: 'cinematic',
    name: 'Cinematic',
    nameKo: '시네마틱',
    description: '화양연화 같은 영화적 감성',
    bgColor: '#1A1A1A',
    imageUrl: '/examples/images/example_wedding_image2.png',
  },
  {
    id: 'exhibition',
    name: 'Gallery',
    nameKo: '갤러리',
    description: '미술관 같은 우아한 전시',
    bgColor: '#2D2D2D',
    imageUrl: '/examples/images/example_wedding_image3.png',
  },
  {
    id: 'magazine',
    name: 'Magazine',
    nameKo: '매거진',
    description: '보그처럼 세련된 에디토리얼',
    bgColor: '#1A1A1A',
    imageUrl: '/examples/images/example_wedding_image4.png',
  },
  {
    id: 'chat',
    name: 'Interview',
    nameKo: '인터뷰',
    description: '커플의 이야기를 담은 대화',
    bgColor: '#2D2D2D',
    imageUrl: '/examples/images/example_wedding_image5.png',
  },
  {
    id: 'gothic-romance',
    name: 'Gothic Romance',
    nameKo: '고딕 로맨스',
    description: '무디하고 드라마틱한 감성',
    bgColor: '#0D0D0D',
    imageUrl: '/examples/images/example_wedding_image6.png',
  },
]

export function S2ThemeShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeTheme, setActiveTheme] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const scrolled = -rect.top
      const sectionHeight = rect.height - window.innerHeight

      if (sectionHeight <= 0) return

      const progress = Math.min(1, Math.max(0, scrolled / sectionHeight))
      setScrollProgress(progress)

      // Map progress to theme index (5 themes: each ~20%)
      const themeIndex = Math.min(THEMES.length - 1, Math.floor(progress * THEMES.length))
      setActiveTheme(themeIndex)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const currentTheme = THEMES[activeTheme]
  const fullTemplate = useMemo(() => getTemplateById(currentTheme.id), [currentTheme.id])

  if (!fullTemplate) return null

  return (
    <section
      ref={containerRef}
      className="relative h-[400vh] transition-colors duration-700"
      style={{ backgroundColor: currentTheme.bgColor }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4">
        {/* Section Title */}
        <div className="text-center mb-8">
          <p className="text-[#C9A962] text-sm tracking-widest uppercase mb-2">
            Premium Styles
          </p>
          <h2 className="text-2xl sm:text-3xl font-light text-[#F5E6D3]">
            당신의 이야기에 맞는 스타일
          </h2>
        </div>

        {/* iPhone Mockup */}
        <div className="relative">
          {/* Phone Frame */}
          <div className="relative w-[260px] sm:w-[280px] h-[520px] sm:h-[560px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl border border-white/10">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-20" />

            {/* Screen */}
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-black relative">
              {/* Theme Preview with transition */}
              <div
                key={currentTheme.id}
                className="absolute inset-0 transition-opacity duration-500"
              >
                <IntroPreview
                  intro={fullTemplate.intro}
                  colors={fullTemplate.defaultColors}
                  fonts={fullTemplate.defaultFonts}
                  groomName="민수"
                  brideName="수진"
                  weddingDate="2025-05-24"
                  userImageUrl={currentTheme.imageUrl}
                  isCompact={false}
                />
              </div>
            </div>

            {/* Phone Reflection */}
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
          </div>

          {/* Theme Label - Below Phone */}
          <div className="mt-6 text-center">
            <p className="text-lg text-[#F5E6D3] font-medium">{currentTheme.nameKo}</p>
            <p className="text-sm text-[#F5E6D3]/60 mt-1">{currentTheme.description}</p>
          </div>
        </div>

        {/* Theme Indicator Dots */}
        <div className="mt-8 flex gap-3">
          {THEMES.map((theme, i) => (
            <button
              key={theme.id}
              onClick={() => {
                // Scroll to the appropriate position for each theme
                if (containerRef.current) {
                  const targetProgress = (i + 0.5) / THEMES.length
                  const containerTop = containerRef.current.offsetTop
                  const containerHeight = containerRef.current.offsetHeight - window.innerHeight
                  const targetScroll = containerTop + containerHeight * targetProgress
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' })
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeTheme
                  ? 'bg-[#C9A962] w-6'
                  : 'bg-white/30 w-2 hover:bg-white/50'
              }`}
              aria-label={`${theme.nameKo} 테마로 이동`}
            />
          ))}
        </div>

        {/* Scroll Progress Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C9A962] rounded-full transition-all duration-100"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>
    </section>
  )
}

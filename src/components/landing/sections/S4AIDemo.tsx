'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { IntroPreview } from '@/components/invitation/intros/IntroPreview'
import { getTemplateById } from '@/lib/themes'

export function S4AIDemo() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [hasTriggered, setHasTriggered] = useState(false)

  const cinematicTemplate = useMemo(() => getTemplateById('cinematic'), [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true)
          // Animation sequence
          setTimeout(() => setStep(1), 500)   // Show message
          setTimeout(() => setStep(2), 2000)  // Show loading dots
          setTimeout(() => setStep(3), 3500)  // Show result
        }
      },
      { threshold: 0.5 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [hasTriggered])

  if (!cinematicTemplate) return null

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-b from-[#0A0806] to-[#1A1A1A] flex items-center py-20 px-4"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-[#C9A962] text-sm tracking-widest uppercase mb-2">
            AI Generation
          </p>
          <h2 className="text-2xl sm:text-3xl font-light text-[#F5E6D3] mb-4">
            AI가 만들어주니까 5분이면 완성
          </h2>
          <p className="text-[#F5E6D3]/60 text-sm max-w-md mx-auto">
            원하는 분위기를 말하면, AI가 바로 시안을 만들어드립니다
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Chat Interface */}
          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-[#C9A962]" />
              <span className="text-sm text-[#F5E6D3]/70">AI 청첩장 디자이너</span>
            </div>

            <div className="space-y-4 min-h-[200px]">
              {/* User Message */}
              <div
                className={`max-w-[80%] ml-auto transition-all duration-500 ${
                  step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="px-4 py-3 rounded-2xl bg-[#FEE500] text-[#3C1E1E] text-sm">
                  제주도 스냅이야, 영화 화양연화의 한 장면처럼 만들어줘.
                  신랑 신부 이름은 중앙에 위치하도록 해줘.
                </div>
                <p className="text-[10px] text-[#F5E6D3]/40 text-right mt-1">방금 전</p>
              </div>

              {/* Loading Dots */}
              {step >= 2 && step < 3 && (
                <div className="flex gap-2 p-3">
                  <div className="w-2 h-2 bg-[#C9A962] rounded-full animate-bounce-dot" />
                  <div className="w-2 h-2 bg-[#C9A962] rounded-full animate-bounce-dot" />
                  <div className="w-2 h-2 bg-[#C9A962] rounded-full animate-bounce-dot" />
                </div>
              )}

              {/* AI Response */}
              {step >= 3 && (
                <div className="max-w-[80%] animate-fade-up">
                  <div className="px-4 py-3 rounded-2xl bg-white/10 text-[#F5E6D3] text-sm">
                    제주도의 따뜻한 노을빛을 담은 시네마틱 스타일로 준비했어요. 화양연화 감성의 필름 그레인과 골드 톤으로 완성했습니다 ✨
                  </div>
                  <p className="text-[10px] text-[#F5E6D3]/40 mt-1">방금 전</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Generated Preview */}
          <div
            className={`transition-all duration-700 ${
              step >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            {/* Phone Mockup */}
            <div className="relative w-[220px] sm:w-[240px] h-[440px] sm:h-[480px] mx-auto bg-gray-900 rounded-[2.5rem] p-1.5 shadow-2xl border border-white/10">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl z-20" />

              {/* Screen */}
              <div className="w-full h-full rounded-[2rem] overflow-hidden bg-black relative">
                <IntroPreview
                  intro={cinematicTemplate.intro}
                  colors={cinematicTemplate.defaultColors}
                  fonts={cinematicTemplate.defaultFonts}
                  groomName="민수"
                  brideName="수진"
                  weddingDate="2025-05-24"
                  userImageUrl="/examples/images/example_wedding_image2.png"
                  isCompact={true}
                />
              </div>

              {/* Phone Reflection */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            </div>

            {/* Label */}
            {step >= 3 && (
              <div className="text-center mt-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#C9A962]/20 rounded-full text-[#C9A962] text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A962] animate-pulse" />
                  AI가 생성한 시안
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

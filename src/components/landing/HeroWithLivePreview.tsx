'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui'

const TEMPLATES = [
  {
    id: 'wedding_letter_template5_lp',
    name: '바이닐 LP',
    nameKo: '바이닐',
    description: 'LP가 돌아가는 인터랙티브 인트로',
    mood: '힙한',
  },
  {
    id: 'wedding_letter_template2',
    name: '시네마틱',
    nameKo: '시네마틱',
    description: '화양연화 같은 영화적 감성',
    mood: '감성적인',
  },
  {
    id: 'wedding_letter_template3',
    name: '갤러리',
    nameKo: '갤러리',
    description: '미술관 같은 우아한 전시',
    mood: '우아한',
  },
  {
    id: 'wedding_letter_template4',
    name: '채팅',
    nameKo: '채팅',
    description: '카카오톡 스타일 대화형',
    mood: '친근한',
  },
]

export function HeroWithLivePreview() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const selectedTemplate = TEMPLATES[selectedIndex]

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? TEMPLATES.length - 1 : prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === TEMPLATES.length - 1 ? 0 : prev + 1))
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-[#FFFBFC] to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFB6C1]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#D4768A]/10 rounded-full blur-3xl" />
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto w-full transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFB6C1]/20 px-4 py-2 border border-[#FFB6C1]/30">
            <Sparkles className="h-4 w-4 text-[#D4768A]" />
            <span className="text-sm font-medium text-[#D4768A]">
              AI가 디자인하는 청첩장
            </span>
          </div>
        </div>

        {/* Main Copy */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            당신만의{' '}
            <span className="text-[#D4768A]">특별한 청첩장</span>을
            <br />
            5초 만에 완성하세요
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
            영상처럼 움직이는 인트로, 인터랙티브한 경험.
            <br className="hidden sm:block" />
            기존 청첩장과는 완전히 다른 새로운 경험을 선사합니다.
          </p>
        </div>

        {/* Live Preview Frame */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-8">
          {/* Mobile Frame with Navigation */}
          <div className="relative flex items-center gap-4">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              aria-label="이전 스타일"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>

            {/* Phone Frame */}
            <div className="relative">
              <div className="relative w-[280px] sm:w-[320px] h-[560px] sm:h-[640px] rounded-[2.5rem] bg-gray-900 p-2 shadow-2xl">
                {/* Screen */}
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-black">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-xl z-10" />

                  {/* iframe */}
                  <iframe
                    key={selectedTemplate.id}
                    src={`/examples/${selectedTemplate.id}.html`}
                    className="w-full h-full border-0"
                    title={`${selectedTemplate.name} 미리보기`}
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Floating label */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-100">
                <span className="text-sm font-medium text-gray-700">
                  {selectedTemplate.name}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  {selectedTemplate.mood}
                </span>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              aria-label="다음 스타일"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Style Info (Desktop) */}
          <div className="hidden lg:block max-w-xs">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedTemplate.name} 스타일
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedTemplate.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#FFB6C1]/20 text-[#D4768A] text-sm rounded-full">
                {selectedTemplate.mood}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                인터랙티브
              </span>
            </div>
          </div>
        </div>

        {/* Style Selector - Desktop and Tablet */}
        <div className="hidden sm:flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 bg-gray-100 rounded-full" role="tablist" aria-label="청첩장 스타일 선택">
            {TEMPLATES.map((template, index) => (
              <button
                key={template.id}
                onClick={() => setSelectedIndex(index)}
                role="tab"
                aria-selected={selectedIndex === index}
                aria-controls="preview-frame"
                className={`
                  px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200
                  ${selectedIndex === index
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {template.nameKo}
              </button>
            ))}
          </div>
        </div>

        {/* Dot indicators - Mobile only */}
        <div className="flex sm:hidden justify-center gap-2 mb-8">
          {TEMPLATES.map((template, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              aria-label={`${template.name} 스타일`}
              className={`
                h-2 rounded-full transition-all duration-300
                ${selectedIndex === index
                  ? 'bg-[#D4768A] w-8'
                  : 'bg-gray-300 w-2 hover:bg-gray-400'
                }
              `}
            />
          ))}
        </div>

        {/* Mobile swipe hint */}
        <p className="sm:hidden text-center text-xs text-gray-400 mb-6">
          좌우로 스와이프하거나 점을 눌러 스타일을 변경하세요
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <Link href="/create">
            <Button
              size="lg"
              className="min-w-[240px] bg-[#D4768A] hover:bg-[#c4657a] text-white rounded-full h-14 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              무료로 시안 받기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500">
            3분이면 완성 · 무료 체험 가능
          </p>
        </div>
      </div>
    </section>
  )
}

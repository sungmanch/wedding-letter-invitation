'use client'

import { useState, useEffect, useMemo, useRef, forwardRef } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import { IntroPreview } from '@/components/invitation/intros/IntroPreview'
import { getTemplateById } from '@/lib/themes'

// 템플릿 ID는 templates.json의 실제 ID 사용
// 순서: 바이닐 → 갤러리 → 시네마틱 → 채팅 → 커스텀
const TEMPLATES = [
  {
    id: 'vinyl',
    name: '바이닐 LP',
    nameKo: '바이닐',
    emoji: '💿',
    description: 'LP가 돌아가는 인터랙티브 인트로',
    mood: '힙한',
    imageUrl: '/examples/images/example_wedding_image.png',
    isCustom: false,
  },
  {
    id: 'exhibition',
    name: '갤러리',
    nameKo: '갤러리',
    emoji: '🖼',
    description: '미술관 같은 우아한 전시',
    mood: '우아한',
    imageUrl: '/examples/images/example_wedding_image3.png',
    isCustom: false,
  },
  {
    id: 'cinematic',
    name: '시네마틱',
    nameKo: '시네마틱',
    emoji: '🎬',
    description: '화양연화 같은 영화적 감성',
    mood: '감성적인',
    imageUrl: '/examples/images/example_wedding_image2.png',
    isCustom: false,
  },
  {
    id: 'chat',
    name: '채팅',
    nameKo: '채팅',
    emoji: '💬',
    description: '카카오톡 스타일 대화형',
    mood: '친근한',
    imageUrl: '/examples/images/example_wedding_image4.png',
    isCustom: false,
  },
  {
    id: 'custom',
    name: '커스텀',
    nameKo: '커스텀',
    emoji: '✨',
    description: 'AI로 나만의 테마 생성',
    mood: '자유로운',
    imageUrl: '',
    isCustom: true,
  },
]

// 프리뷰 카드 컴포넌트 (선택 여부에 따라 크기 변경)
const PreviewCard = forwardRef<HTMLButtonElement, {
  template: (typeof TEMPLATES)[0]
  isSelected: boolean
  onClick: () => void
}>(function PreviewCard({ template, isSelected, onClick }, ref) {
  const fullTemplate = useMemo(() => getTemplateById(template.id), [template.id])

  // 선택 여부에 따른 스타일
  const scale = isSelected ? 1 : 0.75
  const opacity = isSelected ? 1 : 0.7
  const zIndex = isSelected ? 10 : 1

  // 커스텀 템플릿인 경우
  if (template.isCustom) {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`group relative rounded-2xl border-2 border-dashed bg-gray-50 shadow-lg transition-all duration-500 flex-shrink-0 ${
          isSelected ? 'border-[#D4768A] shadow-2xl' : 'border-gray-300 hover:border-[#D4768A]'
        }`}
        style={{
          width: isSelected ? '280px' : '180px',
          height: isSelected ? '560px' : '360px',
          transform: `scale(${scale})`,
          opacity,
          zIndex,
        }}
      >
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
          <div className={`rounded-full bg-gray-200 flex items-center justify-center transition-all ${
            isSelected ? 'w-16 h-16' : 'w-12 h-12'
          } ${isSelected ? 'bg-[#FFE4E9]' : 'group-hover:bg-[#FFE4E9]'}`}>
            <Plus className={`text-gray-400 transition-colors ${isSelected ? 'w-8 h-8 text-[#D4768A]' : 'w-6 h-6 group-hover:text-[#D4768A]'}`} />
          </div>
          <div className="text-center">
            <p className={`font-medium text-gray-600 ${isSelected ? 'text-lg' : 'text-sm'}`}>커스텀 테마</p>
            <p className={`text-gray-400 mt-1 ${isSelected ? 'text-sm' : 'text-xs'}`}>AI로 나만의 테마 생성</p>
          </div>
        </div>
        {/* 라벨 - 선택시 표시 (카드 위쪽) */}
        {isSelected && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-white rounded-full shadow-lg text-sm font-medium whitespace-nowrap flex items-center gap-1.5">
            <span className="text-gray-900">{template.name}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-gray-400">{template.mood}</span>
          </div>
        )}
      </button>
    )
  }

  if (!fullTemplate) return null

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`group relative rounded-2xl bg-gray-900 p-1 shadow-lg transition-all duration-500 flex-shrink-0 ${
        isSelected ? 'shadow-2xl' : 'hover:shadow-xl'
      }`}
      style={{
        width: isSelected ? '280px' : '180px',
        height: isSelected ? '560px' : '360px',
        transform: `scale(${scale})`,
        opacity,
        zIndex,
      }}
    >
      {/* 라벨 - 선택시 표시 (카드 위쪽) */}
      {isSelected && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-white rounded-full shadow-lg text-sm font-medium whitespace-nowrap flex items-center gap-1.5">
          <span className="text-gray-900">{template.name}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-gray-400">{template.mood}</span>
        </div>
      )}
      <div className="w-full h-full rounded-xl overflow-hidden bg-black relative">
        <IntroPreview
          intro={fullTemplate.intro}
          colors={fullTemplate.defaultColors}
          fonts={fullTemplate.defaultFonts}
          groomName="민수"
          brideName="수진"
          weddingDate="2025-05-24"
          userImageUrl={template.imageUrl}
          isCompact={!isSelected}
        />
      </div>
    </button>
  )
})

export function HeroWithLivePreview() {
  const [selectedIndex, setSelectedIndex] = useState(2) // 시네마틱(중앙)을 기본값으로
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // 선택된 카드가 중앙으로 스크롤되도록
  // 카드 크기 변경 애니메이션(duration-500 = 500ms) 후 스크롤
  useEffect(() => {
    const timer = setTimeout(() => {
      const card = cardRefs.current[selectedIndex]
      if (card && containerRef.current) {
        card.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }, 100) // 크기 변경 시작 후 잠시 대기하여 레이아웃 계산

    return () => clearTimeout(timer)
  }, [selectedIndex])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-[#FFFBFC] to-white overflow-hidden">
      {/* 배경 그라데이션 장식 - 강화 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 lg:w-96 h-80 lg:h-96 bg-[#FFB6C1]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 lg:w-96 h-80 lg:h-96 bg-[#D4768A]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/3 w-48 lg:w-64 h-48 lg:h-64 bg-[#FFE4E9]/30 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 left-1/4 w-40 lg:w-56 h-40 lg:h-56 bg-[#FFF0F3]/40 rounded-full blur-2xl" />
      </div>


      {/* 메인 콘텐츠 */}
      <div
        className={`relative z-10 max-w-4xl mx-auto w-full text-center transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFB6C1]/20 px-4 py-2 border border-[#FFB6C1]/30">
            <Sparkles className="h-4 w-4 text-[#D4768A]" />
            <span className="text-sm font-medium text-[#D4768A]">하객들이 캡처해서 물어보는 청첩장</span>
          </div>
        </div>

        {/* Main Copy */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          <span className="text-[#D4768A]">&quot;이거 어디서 만들었어?&quot;</span>
        </h1>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          LP가 돌고, 채팅이 흐르고, 당신의 사진이 빛나는
          <br className="hidden sm:block" />
          처음 보는 청첩장
        </p>

        {/* 스타일 선택 버튼 - 캐러셀 위에 배치 */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6 flex-wrap px-4">
          {TEMPLATES.map((template, index) => (
            <button
              key={template.id}
              onClick={() => setSelectedIndex(index)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
                ${
                  selectedIndex === index
                    ? 'bg-[#D4768A] text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                }`}
            >
              <span className="mr-1">{template.emoji}</span>
              {template.nameKo}
            </button>
          ))}
        </div>
      </div>

      {/* 고정 위치 캐러셀 - 전체 너비 사용, 양쪽에 패딩으로 첫/끝 카드도 중앙 가능 */}
      <div
        ref={containerRef}
        className="relative z-10 w-full flex items-center gap-3 lg:gap-6 mb-10 overflow-x-auto pt-10 pb-6 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* 왼쪽 스페이서 - 첫 번째 카드가 중앙에 올 수 있도록 (50vw - 카드너비절반) */}
        <div className="flex-shrink-0" style={{ width: 'calc(50vw - 140px)' }} />

        {TEMPLATES.map((template, index) => (
          <PreviewCard
            key={template.id}
            ref={(el) => { cardRefs.current[index] = el }}
            template={template}
            isSelected={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
          />
        ))}

        {/* 오른쪽 스페이서 - 마지막 카드가 중앙에 올 수 있도록 (50vw - 카드너비절반) */}
        <div className="flex-shrink-0" style={{ width: 'calc(50vw - 140px)' }} />
      </div>

      {/* 하단 콘텐츠 - CTA */}
      <div className={`relative z-10 max-w-4xl mx-auto w-full text-center transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <Link href="/create">
            <Button
              size="lg"
              className="group min-w-[240px] bg-[#D4768A] hover:bg-[#c4657a] text-white rounded-full h-14 text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              무료로 만들어보기
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500">3분이면 완성</p>
        </div>
      </div>
    </section>
  )
}

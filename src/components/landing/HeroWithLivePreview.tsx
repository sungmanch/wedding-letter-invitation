'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { IntroPreview } from '@/components/invitation/intros/IntroPreview'
import { getTemplateById } from '@/lib/themes'

// 템플릿 ID는 templates.json의 실제 ID 사용
const TEMPLATES = [
  {
    id: 'vinyl',
    name: '바이닐 LP',
    nameKo: '바이닐',
    description: 'LP가 돌아가는 인터랙티브 인트로',
    mood: '힙한',
  },
  {
    id: 'cinematic',
    name: '시네마틱',
    nameKo: '시네마틱',
    description: '화양연화 같은 영화적 감성',
    mood: '감성적인',
  },
  {
    id: 'exhibition',
    name: '갤러리',
    nameKo: '갤러리',
    description: '미술관 같은 우아한 전시',
    mood: '우아한',
  },
  {
    id: 'chat',
    name: '채팅',
    nameKo: '채팅',
    description: '카카오톡 스타일 대화형',
    mood: '친근한',
  },
]

// 플로팅 미리보기 카드 컴포넌트
function FloatingPreviewCard({
  template,
  onClick,
  rotation,
}: {
  template: (typeof TEMPLATES)[0]
  onClick: () => void
  rotation: number
}) {
  const fullTemplate = useMemo(() => getTemplateById(template.id), [template.id])

  if (!fullTemplate) return null

  return (
    <button
      onClick={onClick}
      className="group relative w-[120px] h-[240px] xl:w-[140px] xl:h-[280px] rounded-2xl bg-gray-900 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="w-full h-full rounded-xl overflow-hidden bg-black relative">
        <IntroPreview
          intro={fullTemplate.intro}
          colors={fullTemplate.defaultColors}
          fonts={fullTemplate.defaultFonts}
          groomName="민수"
          brideName="수진"
          weddingDate="2025-05-24"
        />
      </div>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white rounded-full shadow-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        {template.nameKo}
      </div>
    </button>
  )
}

export function HeroWithLivePreview() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const selectedTemplate = TEMPLATES[selectedIndex]

  // 전체 템플릿 데이터 가져오기
  const fullTemplate = useMemo(
    () => getTemplateById(selectedTemplate.id),
    [selectedTemplate.id]
  )

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // 플로팅 카드에 표시할 다른 템플릿들
  const otherTemplates = TEMPLATES.filter((_, i) => i !== selectedIndex)

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-[#FFFBFC] to-white overflow-hidden">
      {/* 배경 그라데이션 장식 - 강화 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 lg:w-96 h-80 lg:h-96 bg-[#FFB6C1]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 lg:w-96 h-80 lg:h-96 bg-[#D4768A]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/3 w-48 lg:w-64 h-48 lg:h-64 bg-[#FFE4E9]/30 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 left-1/4 w-40 lg:w-56 h-40 lg:h-56 bg-[#FFF0F3]/40 rounded-full blur-2xl" />
      </div>

      {/* 플로팅 미리보기 카드 - 좌측 상단 */}
      {otherTemplates[0] && (
        <div className="hidden xl:block absolute left-[4%] 2xl:left-[8%] top-[18%]">
          <FloatingPreviewCard
            template={otherTemplates[0]}
            onClick={() =>
              setSelectedIndex(TEMPLATES.findIndex((t) => t.id === otherTemplates[0].id))
            }
            rotation={-12}
          />
        </div>
      )}

      {/* 플로팅 미리보기 카드 - 좌측 하단 */}
      {otherTemplates[1] && (
        <div className="hidden xl:block absolute left-[6%] 2xl:left-[10%] bottom-[22%]">
          <FloatingPreviewCard
            template={otherTemplates[1]}
            onClick={() =>
              setSelectedIndex(TEMPLATES.findIndex((t) => t.id === otherTemplates[1].id))
            }
            rotation={8}
          />
        </div>
      )}

      {/* 플로팅 미리보기 카드 - 우측 */}
      {otherTemplates[2] && (
        <div className="hidden xl:block absolute right-[4%] 2xl:right-[8%] top-[22%]">
          <FloatingPreviewCard
            template={otherTemplates[2]}
            onClick={() =>
              setSelectedIndex(TEMPLATES.findIndex((t) => t.id === otherTemplates[2].id))
            }
            rotation={15}
          />
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div
        className={`relative z-10 max-w-4xl mx-auto w-full text-center transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFB6C1]/20 px-4 py-2 border border-[#FFB6C1]/30">
            <Sparkles className="h-4 w-4 text-[#D4768A]" />
            <span className="text-sm font-medium text-[#D4768A]">AI가 디자인하는 청첩장</span>
          </div>
        </div>

        {/* Main Copy */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          당신만의 <span className="text-[#D4768A]">특별한 청첩장</span>을
          <br />
          5초 만에 완성하세요
        </h1>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          영상처럼 움직이는 인트로, 인터랙티브한 경험
        </p>

        {/* 메인 프리뷰 - 데스크탑에서 확대 */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* 폰 프레임 - lg에서 420px로 확대 */}
            <div className="relative w-[280px] sm:w-[320px] lg:w-[400px] h-[560px] sm:h-[640px] lg:h-[800px] rounded-[2.5rem] lg:rounded-[3rem] bg-gray-900 p-2 shadow-2xl transition-all duration-300">
              {/* Screen */}
              <div className="relative w-full h-full rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-black">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 lg:w-28 h-6 lg:h-7 bg-gray-900 rounded-b-xl z-10" />

                {/* IntroPreview 컴포넌트 */}
                {fullTemplate && (
                  <IntroPreview
                    intro={fullTemplate.intro}
                    colors={fullTemplate.defaultColors}
                    fonts={fullTemplate.defaultFonts}
                    groomName="민수"
                    brideName="수진"
                    weddingDate="2025-05-24"
                    venueName="더채플 청담"
                  />
                )}
              </div>
            </div>

            {/* 스타일 라벨 */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-white rounded-full shadow-lg border border-gray-100">
              <span className="font-medium text-gray-900">{selectedTemplate.name}</span>
              <span className="text-gray-400 ml-2">· {selectedTemplate.mood}</span>
            </div>
          </div>
        </div>

        {/* 스타일 선택 버튼 */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-8 flex-wrap px-4">
          {TEMPLATES.map((template, index) => (
            <button
              key={template.id}
              onClick={() => setSelectedIndex(index)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-200
                ${
                  selectedIndex === index
                    ? 'bg-[#D4768A] text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                }`}
            >
              {template.nameKo}
            </button>
          ))}
        </div>

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
          <p className="text-sm text-gray-500">3분이면 완성 · 무료 체험 가능</p>
        </div>
      </div>
    </section>
  )
}

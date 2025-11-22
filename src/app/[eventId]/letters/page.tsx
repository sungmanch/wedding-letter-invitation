'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Lock, Clock, CreditCard, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

// Mock letter data
const mockLetters = [
  {
    id: '1',
    guestName: '김민지',
    content: '결혼 진짜 축하해! 우리 대학때부터 친구하면서 네가 이렇게 행복해하는 모습 보니까 나도 너무 기뻐 💕 앞으로도 지금처럼 행복하게 살아!',
    stickers: ['💕', '🎉', '💐'],
    createdAt: new Date(),
  },
  {
    id: '2',
    guestName: '이수진',
    content: '예쁜 신부가 될 너에게! 항상 응원할게. 결혼식 날 펑펑 울 것 같아 ㅠㅠ',
    stickers: ['💒', '👰', '🤍'],
    createdAt: new Date(),
  },
  {
    id: '3',
    guestName: '박지현',
    content: '드디어 결혼이라니! 청첩장 모임 기대된다 ㅎㅎ 맛있는 거 먹으면서 축하해줄게!',
    stickers: ['🥂', '✨'],
    createdAt: new Date(),
  },
]

export default function LettersPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [currentIndex, setCurrentIndex] = useState(0)

  // Mock unlock status
  const isUnlocked = true // TODO: 실제 상태 확인
  const daysUntilUnlock = 14

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : mockLetters.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < mockLetters.length - 1 ? prev + 1 : 0))
  }

  if (!isUnlocked) {
    return (
      <main className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-cream bg-white/80 backdrop-blur-sm">
          <div className="flex h-14 items-center px-4">
            <Link
              href={`/${eventId}`}
              className="flex items-center text-charcoal/60 hover:text-charcoal"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="flex-1 text-center font-semibold text-charcoal">
              편지함
            </h1>
            <div className="w-5" />
          </div>
        </header>

        {/* Locked State */}
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cream">
            <Lock className="h-10 w-10 text-charcoal/30" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-charcoal">
            {mockLetters.length}통의 편지가 도착했어요
          </h2>
          <p className="mb-6 text-charcoal/60">
            아직 열람할 수 없어요
          </p>

          {/* Options */}
          <div className="w-full max-w-sm space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-pink-50">
                  <Clock className="h-5 w-5 text-blush-pink" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-charcoal">무료 열람</p>
                  <p className="text-sm text-charcoal/60">
                    D-{daysUntilUnlock}일 후 열람 가능
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-blush-pink p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-pink">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-charcoal">즉시 열람</p>
                  <p className="text-sm text-charcoal/60">
                    결제 후 바로 열람 가능
                  </p>
                </div>
                <Badge>9,900원</Badge>
              </div>
              <Button size="lg" fullWidth className="mt-4">
                결제하고 바로 보기
              </Button>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  const currentLetter = mockLetters[currentIndex]

  return (
    <main className="min-h-screen bg-gradient-to-b from-blush-pink-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-cream bg-white/80 backdrop-blur-sm">
        <div className="flex h-14 items-center px-4">
          <Link
            href={`/${eventId}`}
            className="flex items-center text-charcoal/60 hover:text-charcoal"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center font-semibold text-charcoal">
            편지함
          </h1>
          <div className="w-5" />
        </div>
      </header>

      {/* Letter Counter */}
      <div className="flex items-center justify-center gap-2 py-4">
        <Heart className="h-4 w-4 text-blush-pink" />
        <span className="text-sm text-charcoal/60">
          {currentIndex + 1} / {mockLetters.length}
        </span>
      </div>

      {/* Letter Card */}
      <div className="relative px-4">
        <Card className="mx-auto max-w-sm overflow-hidden">
          {/* Letter Header */}
          <div className="bg-gradient-to-r from-blush-pink to-soft-gold p-4 text-white">
            <p className="text-lg font-semibold">
              From. {currentLetter.guestName}
            </p>
          </div>

          {/* Letter Content */}
          <div className="p-6">
            <p className="whitespace-pre-wrap text-charcoal leading-relaxed">
              {currentLetter.content}
            </p>

            {/* Stickers */}
            {currentLetter.stickers && currentLetter.stickers.length > 0 && (
              <div className="mt-4 flex gap-2">
                {currentLetter.stickers.map((sticker, i) => (
                  <span key={i} className="text-2xl">
                    {sticker}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-cream"
        >
          <ChevronLeft className="h-6 w-6 text-charcoal" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-cream"
        >
          <ChevronRight className="h-6 w-6 text-charcoal" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 py-6">
        {mockLetters.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              'h-2 w-2 rounded-full transition-all',
              i === currentIndex ? 'w-6 bg-blush-pink' : 'bg-cream'
            )}
          />
        ))}
      </div>
    </main>
  )
}

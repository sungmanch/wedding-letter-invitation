'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Lock, Clock, CreditCard, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import { getLetters } from '@/lib/actions/survey'
import { createClient } from '@/lib/supabase/client'

interface Letter {
  id: string
  guest_name: string
  content: string | null
  stickers: string[] | null
  created_at: string
}

export default function LettersPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  const { user, isLoading: isAuthLoading } = useAuth(true)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [letters, setLetters] = useState<Letter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [daysUntilUnlock, setDaysUntilUnlock] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!eventId || !user) return

      try {
        const supabase = createClient()

        // Check event ownership and unlock status
        const { data: event, error: eventError } = await supabase
          .from('events')
          .select('user_id, letter_unlocked, letter_unlock_at')
          .eq('id', eventId)
          .single()

        if (eventError) {
          console.error('Event fetch error:', eventError)
          setError('청모장을 찾을 수 없습니다.')
          setIsLoading(false)
          return
        }

        // Check ownership
        if (event.user_id !== user.id) {
          setError('이 청모장에 접근할 권한이 없습니다.')
          setIsLoading(false)
          return
        }

        // Set unlock status
        setIsUnlocked(event.letter_unlocked)

        // Calculate days until unlock
        if (event.letter_unlock_at && !event.letter_unlocked) {
          const unlockDate = new Date(event.letter_unlock_at)
          const now = new Date()
          const diffTime = unlockDate.getTime() - now.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          setDaysUntilUnlock(Math.max(0, diffDays))
        }

        // Fetch letters
        const lettersData = await getLetters(eventId)
        setLetters(lettersData as Letter[])
        setIsLoading(false)
      } catch (err) {
        console.error('Fetch error:', err)
        setError('데이터를 불러오는데 실패했습니다.')
        setIsLoading(false)
      }
    }

    fetchData()
  }, [eventId, user])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : letters.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < letters.length - 1 ? prev + 1 : 0))
  }

  // Loading state
  if (isLoading || isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blush-pink border-t-transparent" />
          <p className="text-charcoal/60">편지를 불러오는 중...</p>
        </div>
      </main>
    )
  }

  // Error state
  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl">😢</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-charcoal">
          오류가 발생했습니다
        </h1>
        <p className="mb-6 text-charcoal/60">{error}</p>
        <Button variant="outline" onClick={() => router.push('/')}>
          홈으로 돌아가기
        </Button>
      </main>
    )
  }

  // No letters state
  if (letters.length === 0) {
    return (
      <main className="min-h-screen">
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

        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cream">
            <Heart className="h-10 w-10 text-charcoal/30" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-charcoal">
            아직 도착한 편지가 없어요
          </h2>
          <p className="mb-6 text-charcoal/60">
            친구들이 설문과 함께 편지를 보내면 여기에 표시됩니다
          </p>
          <Button onClick={() => router.push(`/${eventId}`)}>
            대시보드로 돌아가기
          </Button>
        </div>
      </main>
    )
  }

  // Locked state
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
            {letters.length}통의 편지가 도착했어요
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
                    {daysUntilUnlock > 0 ? `D-${daysUntilUnlock}일 후 열람 가능` : '곧 열람 가능'}
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

  const currentLetter = letters[currentIndex]

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
          {currentIndex + 1} / {letters.length}
        </span>
      </div>

      {/* Letter Card */}
      <div className="relative px-4">
        <Card className="mx-auto max-w-sm overflow-hidden">
          {/* Letter Header */}
          <div className="bg-gradient-to-r from-blush-pink to-soft-gold p-4 text-white">
            <p className="text-lg font-semibold">
              From. {currentLetter.guest_name}
            </p>
          </div>

          {/* Letter Content */}
          <div className="p-6">
            <p className="whitespace-pre-wrap text-charcoal leading-relaxed">
              {currentLetter.content || '(내용 없음)'}
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

        {/* Navigation Arrows - Only show if more than one letter */}
        {letters.length > 1 && (
          <>
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
          </>
        )}
      </div>

      {/* Dots - Only show if more than one letter */}
      {letters.length > 1 && (
        <div className="flex justify-center gap-2 py-6">
          {letters.map((_, i) => (
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
      )}
    </main>
  )
}

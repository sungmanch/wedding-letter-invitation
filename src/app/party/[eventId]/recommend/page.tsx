'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Check, Sparkles, Mail } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import {
  requestRecommendation,
  getRecommendations,
  selectRestaurant,
} from '@/lib/actions/recommendation'
import type { RestaurantData } from '@/types/database'

export default function RestaurantRecommendPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  const { user, isLoading: isAuthLoading } = useAuth(true)

  const [isLoading, setIsLoading] = useState(true)
  const [isRequesting, setIsRequesting] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [eventStatus, setEventStatus] = useState<string>('')
  const [recommendations, setRecommendations] = useState<RestaurantData[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Fetch event status and recommendations
  useEffect(() => {
    async function fetchData() {
      if (!user || !eventId) return

      setIsLoading(true)

      try {
        const supabase = createClient()

        // Get event status
        const { data: event, error: eventError } = await supabase
          .from('events')
          .select('status, user_id')
          .eq('id', eventId)
          .single()

        if (eventError || !event) {
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

        setEventStatus(event.status)

        // Fetch recommendations
        const result = await getRecommendations(eventId)
        if (result.data) {
          setRecommendations(result.data)
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Fetch error:', err)
        setError('데이터를 불러오는데 실패했습니다.')
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, eventId])

  const handleRequestRecommendation = async () => {
    setIsRequesting(true)
    setError(null)

    const result = await requestRecommendation(eventId)

    if (result.error) {
      setError(result.error.message)
      setIsRequesting(false)
      return
    }

    // Update status
    setEventStatus('pending')
    setIsRequesting(false)
  }

  const handleSelect = async (restaurantId: string) => {
    setSelectedId(restaurantId)
    setIsSelecting(true)
    setError(null)

    const result = await selectRestaurant(eventId, restaurantId)

    if (result.error) {
      setError(result.error.message)
      setIsSelecting(false)
      setSelectedId(null)
      return
    }

    // Navigate to invitation edit page
    router.push(`/${eventId}/invitation`)
  }

  // Loading state
  if (isLoading || isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blush-pink border-t-transparent" />
          <p className="text-charcoal/60">로딩 중...</p>
        </div>
      </main>
    )
  }

  // Error state
  if (error && !eventStatus) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl">😢</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-charcoal">
          오류가 발생했습니다
        </h1>
        <p className="mb-6 text-charcoal/60">{error}</p>
        <Button variant="outline" onClick={() => router.push(`/${eventId}`)}>
          대시보드로 돌아가기
        </Button>
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-24">
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
            식당 추천
          </h1>
          <div className="w-5" />
        </div>
      </header>

      <div className="px-4 py-6">
        {/* State 1: No recommendations yet */}
        {recommendations.length === 0 && eventStatus !== 'pending' && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blush-pink-50">
              <Sparkles className="h-10 w-10 text-blush-pink" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-charcoal">
              AI 맞춤 추천을 받아보세요
            </h2>
            <p className="mb-6 text-charcoal/60">
              친구들의 취향을 분석해서 완벽한 식당을 찾아드려요
            </p>
            <Button
              size="lg"
              onClick={handleRequestRecommendation}
              isLoading={isRequesting}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              AI 추천 받기
            </Button>
            {error && (
              <p className="mt-4 text-sm text-red-600">{error}</p>
            )}
          </div>
        )}

        {/* State 2: Pending recommendation (Email notification) */}
        {eventStatus === 'pending' && recommendations.length === 0 && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-charcoal">
              쩝쩝박사 조성만의 식당 분석이 시작되었어요!
            </h2>
            <p className="mb-2 text-charcoal/60">
              참여자들의 취향에 딱 맞는 식당을 찾으면 이메일로 알려드릴게요
            </p>
            <div className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-blush-pink-50 px-4 py-3">
              <Mail className="h-5 w-5 text-blush-pink" />
              <p className="text-sm text-blush-pink">
                {user?.email}
              </p>
            </div>
            <p className="mb-6 text-sm text-charcoal/40">
              지금은 다른 일을 하셔도 됩니다 😊
            </p>
            <Link href={`/${eventId}`}>
              <Button variant="outline">
                대시보드로 돌아가기
              </Button>
            </Link>
          </div>
        )}

        {/* State 3: Recommendations available */}
        {recommendations.length > 0 && (
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blush-pink-50">
                <Sparkles className="h-8 w-8 text-blush-pink" />
              </div>
              <h2 className="text-xl font-bold text-charcoal">
                친구들의 취향을 분석한 맞춤 추천이에요!
              </h2>
              <p className="mt-1 text-sm text-charcoal/60">
                마음에 드는 식당을 선택해주세요
              </p>
            </div>

            <div className="space-y-4">
              {recommendations.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  className={cn(
                    'relative overflow-hidden transition-all',
                    selectedId === restaurant.id && 'ring-2 ring-blush-pink'
                  )}
                >
                  {/* Image */}
                  {restaurant.imageUrl && (
                    <div className="h-40 w-full overflow-hidden">
                      <img
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    {/* Match Score */}
                    <div className="mb-3 flex items-center justify-between">
                      <Badge className="bg-blush-pink text-white">
                        매칭 {restaurant.matchScore}%
                      </Badge>
                      {selectedId === restaurant.id && (
                        <div className="flex items-center gap-1 text-sm text-blush-pink">
                          <Check className="h-4 w-4" />
                          <span>선택됨</span>
                        </div>
                      )}
                    </div>

                    {/* Restaurant Info */}
                    <h3 className="mb-1 text-lg font-bold text-charcoal">
                      {restaurant.name}
                    </h3>
                    <p className="mb-3 text-sm text-charcoal/60">
                      {restaurant.category} · {restaurant.location}
                    </p>
                    <p className="mb-3 text-sm text-charcoal/60">
                      {restaurant.priceRange}
                    </p>

                    {/* Match Reasons */}
                    {restaurant.matchReasons && restaurant.matchReasons.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {restaurant.matchReasons.map((reason, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="border-blush-pink/30 text-blush-pink"
                          >
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Select Button */}
                    <Button
                      fullWidth
                      onClick={() => handleSelect(restaurant.id)}
                      disabled={isSelecting}
                      isLoading={isSelecting && selectedId === restaurant.id}
                    >
                      {selectedId === restaurant.id ? '선택 중...' : '이 식당으로 선택'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

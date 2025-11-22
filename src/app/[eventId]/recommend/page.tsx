'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Star, MapPin, DollarSign, Check, Sparkles } from 'lucide-react'
import { Button, Card, CardContent, Badge, ProgressBar } from '@/components/ui'
import { cn } from '@/lib/utils'

// Mock restaurant data
const mockRestaurants = [
  {
    id: '1',
    name: '온기정 강남점',
    category: '한식',
    location: '서울 강남구',
    priceRange: '2-3만원',
    matchScore: 92,
    matchReasons: ['80%가 한식 선호', '모두 캐주얼한 분위기 원함', '가격대 일치'],
    imageUrl: '/api/placeholder/400/200',
  },
  {
    id: '2',
    name: '스시 오마카세',
    category: '일식',
    location: '서울 강남구',
    priceRange: '3-5만원',
    matchScore: 85,
    matchReasons: ['60%가 일식 선호', '프라이빗한 분위기', '특별한 날 분위기'],
    imageUrl: '/api/placeholder/400/200',
  },
  {
    id: '3',
    name: '라 피아짜',
    category: '양식',
    location: '서울 강남구',
    priceRange: '2-3만원',
    matchScore: 78,
    matchReasons: ['로맨틱한 분위기', '뷰 좋음', '양식 선호자 포함'],
    imageUrl: '/api/placeholder/400/200',
  },
]

export default function RecommendPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelect = async () => {
    if (!selectedId) return

    setIsLoading(true)
    // TODO: 실제로 DB에 저장
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push(`/${eventId}/invitation`)
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

      {/* Intro */}
      <div className="bg-gradient-to-r from-blush-pink to-soft-gold p-4 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <h2 className="font-semibold">AI가 분석한 추천 식당</h2>
        </div>
        <p className="mt-1 text-sm opacity-90">
          친구들의 취향을 분석해 최적의 식당을 찾았어요
        </p>
      </div>

      {/* Restaurant List */}
      <div className="space-y-4 p-4">
        {mockRestaurants.map((restaurant, index) => (
          <Card
            key={restaurant.id}
            className={cn(
              'cursor-pointer transition-all',
              selectedId === restaurant.id
                ? 'ring-2 ring-blush-pink'
                : 'hover:shadow-md'
            )}
            onClick={() => setSelectedId(restaurant.id)}
          >
            <CardContent className="p-0">
              {/* Image placeholder */}
              <div className="relative h-32 bg-gradient-to-r from-cream to-blush-pink-50">
                <div className="absolute left-3 top-3">
                  <Badge className="bg-white text-blush-pink">
                    #{index + 1} 추천
                  </Badge>
                </div>
                <div className="absolute right-3 top-3">
                  <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1">
                    <Star className="h-4 w-4 fill-soft-gold text-soft-gold" />
                    <span className="text-sm font-semibold text-charcoal">
                      {restaurant.matchScore}%
                    </span>
                  </div>
                </div>
                {selectedId === restaurant.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blush-pink/20">
                    <div className="rounded-full bg-blush-pink p-2">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-charcoal">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-charcoal/60">
                      {restaurant.category}
                    </p>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-4 text-sm text-charcoal/60">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {restaurant.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {restaurant.priceRange}
                  </div>
                </div>

                {/* Match Score */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal/60">매칭 점수</span>
                    <span className="font-medium text-blush-pink">
                      {restaurant.matchScore}%
                    </span>
                  </div>
                  <ProgressBar value={restaurant.matchScore} max={100} size="sm" />
                </div>

                {/* Match Reasons */}
                <div className="flex flex-wrap gap-1">
                  {restaurant.matchReasons.map((reason, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-cream bg-white p-4">
        <div className="mx-auto max-w-[480px]">
          <Button
            size="lg"
            fullWidth
            disabled={!selectedId}
            isLoading={isLoading}
            onClick={handleSelect}
          >
            {selectedId ? '이 식당으로 결정' : '식당을 선택해주세요'}
          </Button>
        </div>
      </div>
    </main>
  )
}

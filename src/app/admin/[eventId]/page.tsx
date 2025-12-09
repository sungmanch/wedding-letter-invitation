'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { Button, Card, CardContent, Input, Badge } from '@/components/ui'
import {
  getEventDetails,
  addRestaurantRecommendations,
  type RestaurantInput,
} from '@/lib/actions/recommendation'
import { verifyAdminPassword } from '@/lib/actions/admin'

export default function AdminEventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const [eventInfo, setEventInfo] = useState<{
    groupName: string
    responseCount: number
    createdAt: string
  } | null>(null)

  const [responses, setResponses] = useState<Array<{
    guestName: string
    foodTypes: string[]
    atmospheres: string[]
    dietaryRestriction: string | null
    allergyInfo: string | null
    dislikedFoods: string | null
  }>>([])

  const [restaurants, setRestaurants] = useState<RestaurantInput[]>([
    {
      name: '',
      category: '',
      location: '',
      priceRange: '',
      imageUrl: '',
      mapUrl: '',
      matchScore: 90,
      matchReasons: [],
    },
  ])

  const [currentReasonInputs, setCurrentReasonInputs] = useState<string[]>([''])

  const handleLogin = async () => {
    setAuthError('')
    setIsAuthenticating(true)

    const result = await verifyAdminPassword(password)

    if (result.success) {
      setIsAuthenticated(true)
    } else {
      setAuthError(result.error || '비밀번호가 올바르지 않습니다.')
    }

    setIsAuthenticating(false)
  }

  useEffect(() => {
    async function fetchData() {
      if (!isAuthenticated) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      const result = await getEventDetails(eventId)

      if (result.error || !result.data) {
        setError(result.error?.message || '데이터를 불러오지 못했습니다.')
        setIsLoading(false)
        return
      }

      setEventInfo(result.data.event)
      setResponses(result.data.responses)
      setIsLoading(false)
    }

    fetchData()
  }, [eventId, isAuthenticated])

  const addRestaurant = () => {
    setRestaurants([
      ...restaurants,
      {
        name: '',
        category: '',
        location: '',
        priceRange: '',
        imageUrl: '',
        mapUrl: '',
        matchScore: 90,
        matchReasons: [],
      },
    ])
    setCurrentReasonInputs([...currentReasonInputs, ''])
  }

  const removeRestaurant = (index: number) => {
    setRestaurants(restaurants.filter((_, i) => i !== index))
    setCurrentReasonInputs(currentReasonInputs.filter((_, i) => i !== index))
  }

  const updateRestaurant = (index: number, field: keyof RestaurantInput, value: string | number | string[]) => {
    const updated = [...restaurants]
    updated[index] = { ...updated[index], [field]: value }
    setRestaurants(updated)
  }

  const addMatchReason = (restaurantIndex: number) => {
    const reason = currentReasonInputs[restaurantIndex]?.trim()
    if (!reason) return

    const updated = [...restaurants]
    updated[restaurantIndex].matchReasons = [
      ...updated[restaurantIndex].matchReasons,
      reason,
    ]
    setRestaurants(updated)

    // Clear input
    const updatedInputs = [...currentReasonInputs]
    updatedInputs[restaurantIndex] = ''
    setCurrentReasonInputs(updatedInputs)
  }

  const removeMatchReason = (restaurantIndex: number, reasonIndex: number) => {
    const updated = [...restaurants]
    updated[restaurantIndex].matchReasons = updated[restaurantIndex].matchReasons.filter(
      (_, i) => i !== reasonIndex
    )
    setRestaurants(updated)
  }

  const handleSubmit = async () => {
    // Validation
    const validRestaurants = restaurants.filter(
      (r) => r.name && r.category && r.location && r.priceRange
    )

    if (validRestaurants.length === 0) {
      setError('최소 1개의 식당 정보를 완전히 입력해주세요.')
      return
    }

    setIsSaving(true)
    setError('')

    const result = await addRestaurantRecommendations(eventId, validRestaurants)

    if (result.error) {
      setError(result.error.message)
      setIsSaving(false)
      return
    }

    // Success - redirect to admin list
    alert('추천이 성공적으로 저장되었습니다!')
    router.push('/admin')
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <h1 className="mb-6 text-center text-2xl font-bold text-charcoal">
              어드민 로그인
            </h1>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLogin()
                }}
              />
              {authError && (
                <p className="text-sm text-red-600">{authError}</p>
              )}
              <Button fullWidth onClick={handleLogin} isLoading={isAuthenticating}>
                로그인
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blush-pink border-t-transparent" />
          <p className="text-charcoal/60">로딩 중...</p>
        </div>
      </main>
    )
  }

  if (error && !eventInfo) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-2 text-2xl font-bold text-charcoal">오류</h1>
        <p className="mb-6 text-charcoal/60">{error}</p>
        <Link href="/admin">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-charcoal">
                {eventInfo?.groupName}
              </h1>
              <p className="text-sm text-charcoal/60">
                {eventInfo?.responseCount}명 응답
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Survey Responses */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-charcoal">
            설문 응답 데이터
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-left text-sm font-medium">이름</th>
                  <th className="p-3 text-left text-sm font-medium">선호 음식</th>
                  <th className="p-3 text-left text-sm font-medium">분위기</th>
                  <th className="p-3 text-left text-sm font-medium">식이제한</th>
                  <th className="p-3 text-left text-sm font-medium">알레르기</th>
                  <th className="p-3 text-left text-sm font-medium">싫어하는 음식</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-3 text-sm">{response.guestName}</td>
                    <td className="p-3 text-sm">
                      {response.foodTypes.join(', ') || '-'}
                    </td>
                    <td className="p-3 text-sm">
                      {response.atmospheres.join(', ') || '-'}
                    </td>
                    <td className="p-3 text-sm">{response.dietaryRestriction || '-'}</td>
                    <td className="p-3 text-sm">{response.allergyInfo || '-'}</td>
                    <td className="p-3 text-sm">{response.dislikedFoods || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Restaurant Recommendations Form */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-charcoal">
              식당 추천 입력
            </h2>
            <Button onClick={addRestaurant} variant="outline" size="sm">
              <Plus className="mr-1 h-4 w-4" />
              식당 추가
            </Button>
          </div>

          <div className="space-y-6">
            {restaurants.map((restaurant, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-charcoal">
                      식당 #{index + 1}
                    </h3>
                    {restaurants.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRestaurant(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="식당 이름 *"
                      placeholder="예: 온기정 강남점"
                      value={restaurant.name}
                      onChange={(e) => updateRestaurant(index, 'name', e.target.value)}
                    />
                    <Input
                      label="카테고리 *"
                      placeholder="예: 한식"
                      value={restaurant.category}
                      onChange={(e) => updateRestaurant(index, 'category', e.target.value)}
                    />
                    <Input
                      label="위치 *"
                      placeholder="예: 서울 강남구"
                      value={restaurant.location}
                      onChange={(e) => updateRestaurant(index, 'location', e.target.value)}
                    />
                    <Input
                      label="가격대 *"
                      placeholder="예: 2-3만원"
                      value={restaurant.priceRange}
                      onChange={(e) => updateRestaurant(index, 'priceRange', e.target.value)}
                    />
                    <Input
                      label="이미지 URL (선택)"
                      placeholder="https://..."
                      value={restaurant.imageUrl}
                      onChange={(e) => updateRestaurant(index, 'imageUrl', e.target.value)}
                    />
                    <Input
                      label="네이버 지도 URL (선택)"
                      placeholder="https://naver.me/..."
                      value={restaurant.mapUrl}
                      onChange={(e) => updateRestaurant(index, 'mapUrl', e.target.value)}
                    />
                    <Input
                      label="매칭 점수 (%)"
                      type="number"
                      min="0"
                      max="100"
                      value={restaurant.matchScore}
                      onChange={(e) =>
                        updateRestaurant(index, 'matchScore', parseInt(e.target.value))
                      }
                    />
                  </div>

                  {/* Match Reasons */}
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium text-charcoal">
                      매칭 이유
                    </p>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {restaurant.matchReasons.map((reason, reasonIndex) => (
                        <Badge
                          key={reasonIndex}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {reason}
                          <button
                            onClick={() => removeMatchReason(index, reasonIndex)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="매칭 이유 입력 (예: 80%가 한식 선호)"
                        value={currentReasonInputs[index] || ''}
                        onChange={(e) => {
                          const updated = [...currentReasonInputs]
                          updated[index] = e.target.value
                          setCurrentReasonInputs(updated)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addMatchReason(index)
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addMatchReason(index)}
                      >
                        추가
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Link href="/admin">
              <Button variant="outline">취소</Button>
            </Link>
            <Button
              onClick={handleSubmit}
              isLoading={isSaving}
              size="lg"
            >
              추천 완료
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

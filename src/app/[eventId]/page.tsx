'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Users,
  Share2,
  Utensils,
  Mail,
  ChevronRight,
  LogOut,
  CalendarIcon,
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
  Button,
  Card,
  CardContent,
  Badge,
  ProgressBar,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Calendar,
} from '@/components/ui'
import { useAuth } from '@/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'

interface SelectedRestaurant {
  id: string
  name: string
  location: string
  category: string
}

interface EventData {
  id: string
  groupName: string
  status: string
  expectedMembers: string | null
  meetingDate: string | null
  createdAt: string
  selectedRestaurant: SelectedRestaurant | null
}

interface SurveyResponse {
  id: string
  guestName: string
  createdAt: string
}

interface LetterData {
  id: string
  guestName: string
}

export default function EventDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  const [activeTab, setActiveTab] = useState('overview')
  const { user, isLoading, logout } = useAuth(true)

  const [eventData, setEventData] = useState<EventData | null>(null)
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [letters, setLetters] = useState<LetterData[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isUpdatingDate, setIsUpdatingDate] = useState(false)

  // 이벤트 데이터 로드
  useEffect(() => {
    async function fetchEventData() {
      if (!user || !eventId) return

      const supabase = createClient()

      // 이벤트 정보 조회
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('id, group_name, status, expected_members, meeting_date, created_at, user_id, selected_restaurant_id')
        .eq('id', eventId)
        .single()

      if (eventError || !event) {
        setError('청모장을 찾을 수 없습니다.')
        setIsLoadingData(false)
        return
      }

      // 소유권 확인
      if (event.user_id !== user.id) {
        setError('이 청모장에 접근할 권한이 없습니다.')
        setIsLoadingData(false)
        return
      }

      // 선택된 식당 정보 조회
      let selectedRestaurant: SelectedRestaurant | null = null
      if (event.selected_restaurant_id) {
        const { data: restaurant } = await supabase
          .from('restaurant_recommendations')
          .select('id, name, location, category')
          .eq('id', event.selected_restaurant_id)
          .single()

        if (restaurant) {
          selectedRestaurant = {
            id: restaurant.id,
            name: restaurant.name,
            location: restaurant.location || '',
            category: restaurant.category || '',
          }
        }
      }

      setEventData({
        id: event.id,
        groupName: event.group_name,
        status: event.status,
        expectedMembers: event.expected_members,
        meetingDate: event.meeting_date,
        createdAt: event.created_at,
        selectedRestaurant,
      })

      // 설문 응답 조회
      const { data: responsesData } = await supabase
        .from('survey_responses')
        .select('id, guest_name, created_at')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (responsesData) {
        setResponses(responsesData.map(r => ({
          id: r.id,
          guestName: r.guest_name,
          createdAt: r.created_at,
        })))
      }

      // 편지 수 조회
      const { data: lettersData } = await supabase
        .from('letters')
        .select('id, guest_name')
        .eq('event_id', eventId)

      if (lettersData) {
        setLetters(lettersData.map(l => ({
          id: l.id,
          guestName: l.guest_name,
        })))
      }

      setIsLoadingData(false)
    }

    if (user) {
      fetchEventData()
    }
  }, [user, eventId])

  // 시간 포맷팅
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '방금 전'
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    return `${diffDays}일 전`
  }

  // 예상 인원 파싱
  const getExpectedCount = (expectedMembers: string | null): number => {
    if (!expectedMembers) return 10
    const match = expectedMembers.match(/(\d+)/)
    return match ? parseInt(match[1], 10) : 10
  }

  // 모임 날짜 업데이트
  const handleUpdateMeetingDate = async (date: Date | undefined) => {
    if (!eventData) return

    setIsUpdatingDate(true)
    const supabase = createClient()

    const meetingDate = date ? format(date, 'yyyy-MM-dd') : null

    const { error: updateError } = await supabase
      .from('events')
      .update({ meeting_date: meetingDate })
      .eq('id', eventData.id)

    if (updateError) {
      console.error('Error updating meeting date:', updateError)
      alert('날짜 업데이트에 실패했습니다.')
    } else {
      setEventData({ ...eventData, meetingDate })
    }

    setIsUpdatingDate(false)
    setShowDatePicker(false)
  }

  // 로딩 중이면 로딩 표시
  if (isLoading || isLoadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blush-pink border-t-transparent" />
          <p className="text-charcoal/60">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 인증 안 됐으면 로그인 페이지로 리다이렉트 (useAuth에서 처리)
  if (!user) {
    return null
  }

  // 에러 표시
  if (error || !eventData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-charcoal/60">{error || '데이터를 불러올 수 없습니다.'}</p>
          <Link href="/my">
            <Button variant="outline">내 청모장으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  const expectedCount = getExpectedCount(eventData.expectedMembers)
  const responseCount = responses.length
  const letterCount = letters.length

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-cream bg-white/80 backdrop-blur-sm">
        <div className="flex h-14 items-center px-4">
          <Link
            href="/my"
            className="flex items-center text-charcoal/60 hover:text-charcoal"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center font-semibold text-charcoal">
            {eventData.groupName}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="flex items-center text-charcoal/60 hover:text-charcoal"
              title="로그아웃"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
        {/* User info bar */}
        <div className="flex items-center justify-between border-t border-purple-100/50 bg-purple-50 px-4 py-1.5 text-xs">
          <span className="text-charcoal/60">{user.email}</span>
          <span className="text-charcoal/40">로그인됨</span>
        </div>
      </header>

      {/* Status Banner */}
      <div className="bg-gradient-to-r from-primary-purple to-accent-pink p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <Badge className="mb-2 bg-white/20 text-white border-white/30">
              {eventData.status === 'collecting'
                ? (responseCount >= 3 ? '설문 완료 ✅' : '설문 수집 중 📝')
                : eventData.status === 'pending' ? 'AI 분석 중 🤖'
                : eventData.status === 'completed' ? '추천 완료 🍽️'
                : eventData.status === 'restaurant_selected' ? '청모 준비 완료 🎉'
                : eventData.status === 'shared' ? '공유 완료 💌'
                : eventData.status}
            </Badge>
            <p className="text-2xl font-bold">
              {responseCount}명 응답
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">목표</p>
            <p className="text-lg font-semibold">{expectedCount}명</p>
          </div>
        </div>
        <ProgressBar
          value={responseCount}
          max={expectedCount}
          className="mt-3"
          size="lg"
        />
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">개요</TabsTrigger>
            <TabsTrigger value="responses" className="flex-1">응답</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-4">
              {/* Quick Actions - 상태별 동적 렌더링 */}
              {eventData.status === 'restaurant_selected' ? (
                // 식당 선택 완료: 선택된 식당 카드 + 청모장 확인
                <div className="space-y-3">
                  {eventData.selectedRestaurant && (
                    <Card className="border-primary-purple/30 bg-primary-purple/5">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-purple/10">
                            <Utensils className="h-6 w-6 text-primary-purple" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-charcoal/60">선택된 식당</p>
                            <p className="font-semibold text-charcoal">{eventData.selectedRestaurant.name}</p>
                            <p className="text-xs text-charcoal/50">{eventData.selectedRestaurant.category} · {eventData.selectedRestaurant.location}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <Link href={`/${eventId}/invitation`}>
                    <Card className="p-4 hover:shadow-md transition-shadow border-primary-purple/20">
                      <Mail className="mb-2 h-6 w-6 text-primary-purple" />
                      <p className="font-medium text-charcoal">청모장 확인</p>
                      <p className="text-xs text-charcoal/60">초대장 확인 및 공유</p>
                    </Card>
                  </Link>
                </div>
              ) : eventData.status === 'completed' ? (
                // 추천 완료: 식당 추천 확인
                <Link href={`/${eventId}/recommend`}>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <Utensils className="mb-2 h-6 w-6 text-soft-gold" />
                    <p className="font-medium text-charcoal">식당 추천 확인</p>
                    <p className="text-xs text-charcoal/60">AI 추천 결과 보기</p>
                  </Card>
                </Link>
              ) : eventData.status === 'pending' ? (
                // AI 분석 중: 로딩 상태
                <Card className="p-4 opacity-70">
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils className="h-6 w-6 text-soft-gold" />
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-soft-gold border-t-transparent" />
                  </div>
                  <p className="font-medium text-charcoal">식당 추천 진행중</p>
                  <p className="text-xs text-charcoal/60">AI가 분석하고 있어요</p>
                </Card>
              ) : (
                // 설문 수집 중
                <div className="grid grid-cols-2 gap-3">
                  <Link href={`/${eventId}/share`}>
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <Share2 className="mb-2 h-6 w-6 text-blush-pink" />
                      <p className="font-medium text-charcoal">설문 공유</p>
                      <p className="text-xs text-charcoal/60">친구들에게 전달</p>
                    </Card>
                  </Link>
                  {responseCount >= 3 ? (
                    <Link href={`/${eventId}/recommend`}>
                      <Card className="p-4 hover:shadow-md transition-shadow">
                        <Utensils className="mb-2 h-6 w-6 text-soft-gold" />
                        <p className="font-medium text-charcoal">식당 추천</p>
                        <p className="text-xs text-charcoal/60">추천 받기</p>
                      </Card>
                    </Link>
                  ) : (
                    <Card className="p-4 opacity-50 cursor-not-allowed">
                      <Utensils className="mb-2 h-6 w-6 text-charcoal/30" />
                      <p className="font-medium text-charcoal/50">식당 추천</p>
                      <p className="text-xs text-charcoal/40">3명 이상부터 가능</p>
                    </Card>
                  )}
                </div>
              )}

              {/* 모임 날짜 카드 */}
              <Card className={!eventData.meetingDate ? 'border-amber-200 bg-amber-50/50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        eventData.meetingDate ? 'bg-blush-pink-50' : 'bg-amber-100'
                      }`}>
                        <CalendarIcon className={`h-5 w-5 ${
                          eventData.meetingDate ? 'text-blush-pink' : 'text-amber-600'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm text-charcoal/60">모임 날짜</p>
                        <p className={`font-semibold ${
                          eventData.meetingDate ? 'text-charcoal' : 'text-amber-600'
                        }`}>
                          {eventData.meetingDate
                            ? format(new Date(eventData.meetingDate), 'M월 d일 (EEE)', { locale: ko })
                            : '날짜 미정'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="rounded-lg border border-blush-pink/30 px-3 py-1.5 text-sm font-medium text-blush-pink hover:bg-blush-pink/5"
                    >
                      {eventData.meetingDate ? '변경' : '설정'}
                    </button>
                  </div>
                  {showDatePicker && (
                    <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden">
                      <Calendar
                        mode="single"
                        selected={eventData.meetingDate ? new Date(eventData.meetingDate) : undefined}
                        onSelect={handleUpdateMeetingDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                      {eventData.meetingDate && (
                        <div className="border-t border-gray-200 p-3">
                          <button
                            onClick={() => handleUpdateMeetingDate(undefined)}
                            className="w-full rounded-lg border border-red-200 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                            disabled={isUpdatingDate}
                          >
                            날짜 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-pink-50">
                        <Users className="h-5 w-5 text-blush-pink" />
                      </div>
                      <div>
                        <p className="text-sm text-charcoal/60">응답자</p>
                        <p className="font-semibold text-charcoal">
                          {responseCount}명
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-charcoal/30" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-soft-gold/10">
                        <Mail className="h-5 w-5 text-soft-gold" />
                      </div>
                      <div>
                        <p className="text-sm text-charcoal/60">받은 편지</p>
                        <p className="font-semibold text-charcoal">
                          {letterCount}통
                        </p>
                      </div>
                    </div>
                    <Link href={`/${eventId}/letters`}>
                      <Badge variant="outline">보러가기</Badge>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Responses Tab */}
          <TabsContent value="responses">
            <div className="space-y-3">
              {responses.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-charcoal/20" />
                  <p className="text-charcoal/60">아직 응답이 없어요</p>
                  <p className="text-sm text-charcoal/40">
                    친구들에게 링크를 공유해보세요
                  </p>
                </div>
              ) : (
                responses.map((response) => (
                  <Card key={response.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-pink-50">
                          <span className="font-medium text-blush-pink">
                            {response.guestName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">
                            {response.guestName}
                          </p>
                          <p className="text-xs text-charcoal/50">
                            {formatTimeAgo(response.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="success">응답 완료</Badge>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom CTA - 상태별 분기 */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-cream bg-white p-4">
        <div className="mx-auto max-w-[480px]">
          {eventData.status === 'restaurant_selected' ? (
            // 식당 선택 완료: 청모장 확인
            <Link href={`/${eventId}/invitation`}>
              <Button size="lg" fullWidth>
                <Mail className="mr-2 h-5 w-5" />
                청모장 확인하기
              </Button>
            </Link>
          ) : eventData.status === 'completed' ? (
            // 추천 완료: 식당 추천 확인
            <Link href={`/${eventId}/recommend`}>
              <Button size="lg" fullWidth>
                <Utensils className="mr-2 h-5 w-5" />
                식당 추천 확인하기
              </Button>
            </Link>
          ) : eventData.status === 'pending' ? (
            // AI 분석 중: 비활성
            <Button size="lg" fullWidth disabled className="opacity-70">
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              식당 추천 진행중...
            </Button>
          ) : responseCount >= 3 ? (
            // 설문 수집 중 (3명 이상): 식당 추천
            <Link href={`/${eventId}/recommend`}>
              <Button size="lg" fullWidth>
                <Utensils className="mr-2 h-5 w-5" />
                식당 추천 받기
              </Button>
            </Link>
          ) : (
            // 설문 수집 중 (3명 미만): 설문 공유
            <Link href={`/${eventId}/share`}>
              <Button size="lg" fullWidth>
                <Share2 className="mr-2 h-5 w-5" />
                설문 공유하기
              </Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}

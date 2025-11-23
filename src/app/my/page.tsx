'use client'

import Link from 'next/link'
import { Plus, Users, ArrowRight, LogOut, Trash2, Share2, Mail } from 'lucide-react'
import { Card, CardContent, Calendar } from '@/components/ui'
import { useAuth } from '@/providers/AuthProvider'
import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isSameDay, parseISO } from 'date-fns'

interface EventWithCount {
  id: string
  groupName: string
  status: string
  createdAt: string
  meetingDate: string | null
  responseCount: number
  unreadLetterCount: number
}

export default function MyEventsPage() {
  const { user, isLoading, logout } = useAuth(true)
  const [events, setEvents] = useState<EventWithCount[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // 사용자의 이벤트 목록 가져오기
  useEffect(() => {
    async function fetchEvents() {
      if (!user) return

      const supabase = createClient()

      // 사용자의 이벤트 목록 조회 (편지 카운트 포함)
      const { data: eventsData, error } = await supabase
        .from('events')
        .select(`
          id,
          group_name,
          status,
          created_at,
          meeting_date,
          survey_responses (count),
          letters (id, is_read)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching events:', error)
        setIsLoadingEvents(false)
        return
      }

      // 데이터 변환
      const formattedEvents: EventWithCount[] = (eventsData || []).map((event: any) => ({
        id: event.id,
        groupName: event.group_name,
        status: event.status,
        createdAt: new Date(event.created_at).toLocaleDateString('ko-KR'),
        meetingDate: event.meeting_date,
        responseCount: event.survey_responses?.[0]?.count || 0,
        unreadLetterCount: event.letters?.filter((l: any) => !l.is_read).length || 0,
      }))

      setEvents(formattedEvents)
      setIsLoadingEvents(false)
    }

    if (user) {
      fetchEvents()
    }
  }, [user])

  // 이벤트가 있는 날짜들
  const eventDates = useMemo(() => {
    return events
      .filter((e) => e.meetingDate)
      .map((e) => parseISO(e.meetingDate!))
  }, [events])

  // 선택된 날짜의 이벤트들
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return []
    return events.filter(
      (e) => e.meetingDate && isSameDay(parseISO(e.meetingDate), selectedDate)
    )
  }, [events, selectedDate])

  // 이벤트 삭제
  const handleDelete = async (eventId: string) => {
    if (!confirm('정말 이 청모장을 삭제하시겠어요? 모든 응답과 편지도 함께 삭제됩니다.')) {
      return
    }

    setIsDeleting(eventId)
    const supabase = createClient()

    const { error } = await supabase.from('events').delete().eq('id', eventId)

    if (error) {
      console.error('Error deleting event:', error)
      alert('삭제에 실패했습니다. 다시 시도해주세요.')
    } else {
      setEvents(events.filter((e) => e.id !== eventId))
    }

    setIsDeleting(null)
  }

  // 로딩 중이거나 인증되지 않은 경우 로딩 표시
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blush-pink border-t-transparent" />
            <p className="text-charcoal/60">로딩 중...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return null // useAuth가 리다이렉트 처리함
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-cream bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="font-bold text-blush-pink">
            청모장
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-sm text-charcoal/60 hover:text-charcoal"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Welcome */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-charcoal">
            {user.user_metadata?.name || '회원'}님의 청모장
          </h1>
          <p className="mt-1 text-sm text-charcoal/60">
            {events.length}개의 청모장을 관리하고 있어요
          </p>
        </div>

        {/* 캘린더 */}
        {isLoadingEvents ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-6 w-6 animate-spin rounded-full border-4 border-blush-pink border-t-transparent" />
              <p className="text-sm text-charcoal/60">청모장을 불러오는 중...</p>
            </div>
          </div>
        ) : (
          <>
            <Card className="mb-4 overflow-hidden">
              <CardContent className="p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{ hasEvent: eventDates }}
                  modifiersClassNames={{
                    hasEvent:
                      'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1.5 after:w-1.5 after:rounded-full after:bg-blush-pink',
                  }}
                />
              </CardContent>
            </Card>

            {/* 선택된 날짜의 이벤트 */}
            <div className="mb-4">
              <h2 className="mb-2 text-sm font-medium text-charcoal/60">
                {selectedDate?.toLocaleDateString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                일정
              </h2>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-2">
                  {selectedDateEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isDeleting={isDeleting === event.id}
                      onDelete={() => handleDelete(event.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-lg bg-cream/30 py-4 text-center text-sm text-charcoal/40">
                  이 날짜에 예정된 청모장이 없어요
                </p>
              )}
            </div>

            {/* 전체 이벤트 리스트 */}
            <div>
              <h2 className="mb-2 text-sm font-medium text-charcoal/60">전체 청모장</h2>
              {events.length === 0 ? (
                <div className="rounded-xl bg-cream/30 p-8 text-center">
                  <p className="font-medium text-charcoal">아직 청모장이 없어요</p>
                  <p className="mt-1 text-sm text-charcoal/60">
                    새 청모장을 만들어 친구들을 초대해보세요
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isDeleting={isDeleting === event.id}
                      onDelete={() => handleDelete(event.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* FAB - 새 청모장 만들기 */}
      <Link
        href="/create"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-blush-pink text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </main>
  )
}

// 이벤트 카드 컴포넌트
function EventCard({
  event,
  isDeleting,
  onDelete,
}: {
  event: EventWithCount
  isDeleting: boolean
  onDelete: () => void
}) {
  // 공유 필요 여부 (응답이 0명인 경우)
  const needsShare = event.responseCount === 0
  // 읽지 않은 편지 여부
  const hasUnreadLetters = event.unreadLetterCount > 0

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/${event.id}`} className="block p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    event.status === 'collecting'
                      ? 'bg-green-100 text-green-700'
                      : event.status === 'completed'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {event.status === 'collecting'
                    ? '수집중'
                    : event.status === 'completed'
                      ? '완료'
                      : event.status}
                </span>
                {/* 공유하기 뱃지 */}
                {needsShare && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    <Share2 className="h-3 w-3" />
                    공유하기
                  </span>
                )}
                {/* 편지 도착 뱃지 */}
                {hasUnreadLetters && (
                  <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                    <Mail className="h-3 w-3" />
                    편지 {event.unreadLetterCount}통
                  </span>
                )}
                <span className="text-xs text-charcoal/40">{event.createdAt}</span>
              </div>
              <h3 className="font-semibold text-charcoal">{event.groupName}</h3>
              <div className="mt-2 flex items-center gap-3 text-sm text-charcoal/60">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {event.responseCount}명 응답
                </span>
                {event.meetingDate && (
                  <span className="text-xs">
                    {new Date(event.meetingDate).toLocaleDateString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-charcoal/30" />
          </div>
        </Link>
        <div className="border-t border-cream px-4 py-2">
          <button
            onClick={(e) => {
              e.preventDefault()
              onDelete()
            }}
            disabled={isDeleting}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-3 w-3" />
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

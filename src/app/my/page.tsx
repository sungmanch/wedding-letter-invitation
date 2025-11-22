'use client'

import Link from 'next/link'
import { Plus, Calendar, Users, ArrowRight, LogOut, Trash2 } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface EventWithCount {
  id: string
  groupName: string
  status: string
  createdAt: string
  responseCount: number
}

export default function MyEventsPage() {
  const { user, isLoading, logout } = useAuth(true)
  const [events, setEvents] = useState<EventWithCount[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // 사용자의 이벤트 목록 가져오기
  useEffect(() => {
    async function fetchEvents() {
      if (!user) return

      const supabase = createClient()

      // 사용자의 이벤트 목록 조회
      const { data: eventsData, error } = await supabase
        .from('events')
        .select(`
          id,
          group_name,
          status,
          created_at,
          survey_responses (count)
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
        responseCount: event.survey_responses?.[0]?.count || 0,
      }))

      setEvents(formattedEvents)
      setIsLoadingEvents(false)
    }

    if (user) {
      fetchEvents()
    }
  }, [user])

  // 이벤트 삭제
  const handleDelete = async (eventId: string) => {
    if (!confirm('정말 이 청모장을 삭제하시겠어요? 모든 응답과 편지도 함께 삭제됩니다.')) {
      return
    }

    setIsDeleting(eventId)
    const supabase = createClient()

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (error) {
      console.error('Error deleting event:', error)
      alert('삭제에 실패했습니다. 다시 시도해주세요.')
    } else {
      setEvents(events.filter(e => e.id !== eventId))
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
    <main className="min-h-screen bg-gray-50">
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
      <div className="px-4 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-charcoal">
            {user.user_metadata?.name || '회원'}님의 청모장
          </h1>
          <p className="mt-1 text-sm text-charcoal/60">
            {events.length}개의 청모장을 관리하고 있어요
          </p>
        </div>

        {/* Create New Button */}
        <Link href="/create" className="mb-6 block">
          <Card className="border-2 border-dashed border-blush-pink/30 bg-blush-pink/5 transition-colors hover:border-blush-pink/50 hover:bg-blush-pink/10">
            <CardContent className="flex items-center justify-center gap-2 p-4">
              <Plus className="h-5 w-5 text-blush-pink" />
              <span className="font-medium text-blush-pink">새 청모장 만들기</span>
            </CardContent>
          </Card>
        </Link>

        {/* Events List */}
        <div className="space-y-3">
          {isLoadingEvents ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto mb-4 h-6 w-6 animate-spin rounded-full border-4 border-blush-pink border-t-transparent" />
                <p className="text-sm text-charcoal/60">청모장을 불러오는 중...</p>
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-xl bg-cream/30 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream">
                <Calendar className="h-8 w-8 text-charcoal/40" />
              </div>
              <p className="font-medium text-charcoal">아직 청모장이 없어요</p>
              <p className="mt-1 text-sm text-charcoal/60">
                새 청모장을 만들어 친구들을 초대해보세요
              </p>
            </div>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <Link href={`/${event.id}`} className="block p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            event.status === 'collecting'
                              ? 'bg-green-100 text-green-700'
                              : event.status === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {event.status === 'collecting' ? '수집중' :
                             event.status === 'completed' ? '완료' : event.status}
                          </span>
                          <span className="text-xs text-charcoal/40">
                            {event.createdAt}
                          </span>
                        </div>
                        <h3 className="font-semibold text-charcoal">
                          {event.groupName}
                        </h3>
                        <div className="mt-2 flex items-center gap-3 text-sm text-charcoal/60">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.responseCount}명 응답
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-charcoal/30" />
                    </div>
                  </Link>
                  <div className="border-t border-cream px-4 py-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleDelete(event.id)
                      }}
                      disabled={isDeleting === event.id}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      {isDeleting === event.id ? '삭제 중...' : '삭제'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  )
}

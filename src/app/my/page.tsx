'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Calendar, Users, ArrowRight, LogOut, MoreVertical, Trash2 } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'

// 임시 더미 데이터 - 추후 Supabase에서 가져옴
const mockEvents = [
  {
    id: 'event-1',
    title: '민지의 결혼을 축하해',
    eventType: 'wedding',
    responseCount: 8,
    createdAt: '2025-11-20',
    status: 'active',
  },
  {
    id: 'event-2',
    title: '수현이 생일파티',
    eventType: 'birthday',
    responseCount: 5,
    createdAt: '2025-11-15',
    status: 'active',
  },
]

const eventTypeLabels: Record<string, string> = {
  wedding: '결혼',
  birthday: '생일',
  baby_shower: '베이비샤워',
  housewarming: '집들이',
  party: '파티',
}

export default function MyEventsPage() {
  const { user, isLoading, logout } = useAuth(true)
  const router = useRouter()
  const [events, setEvents] = useState(mockEvents)

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

  const handleDelete = (eventId: string) => {
    // 임시로 클라이언트에서만 삭제
    setEvents(events.filter(e => e.id !== eventId))
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
          {events.length === 0 ? (
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
                          <span className="rounded-full bg-blush-pink/10 px-2 py-0.5 text-xs font-medium text-blush-pink">
                            {eventTypeLabels[event.eventType] || event.eventType}
                          </span>
                          <span className="text-xs text-charcoal/40">
                            {event.createdAt}
                          </span>
                        </div>
                        <h3 className="font-semibold text-charcoal">
                          {event.title}
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
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                      삭제
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

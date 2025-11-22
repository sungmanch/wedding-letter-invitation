'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Users,
  Share2,
  Utensils,
  Mail,
  Settings,
  ChevronRight,
} from 'lucide-react'
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
} from '@/components/ui'

// Mock data (실제로는 DB에서 가져옴)
const mockResponses = [
  { id: '1', guestName: '김민지', createdAt: new Date() },
  { id: '2', guestName: '이수진', createdAt: new Date() },
  { id: '3', guestName: '박지현', createdAt: new Date() },
]

export default function EventDashboardPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const eventData = {
    groupName: '민지의 대학친구들',
    status: 'collecting',
    responseCount: mockResponses.length,
    expectedCount: 10,
    letterCount: 2,
    createdAt: new Date(),
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-cream bg-white/80 backdrop-blur-sm">
        <div className="flex h-14 items-center px-4">
          <Link
            href="/"
            className="flex items-center text-charcoal/60 hover:text-charcoal"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center font-semibold text-charcoal">
            {eventData.groupName}
          </h1>
          <Link
            href={`/${eventId}/settings`}
            className="flex items-center text-charcoal/60 hover:text-charcoal"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Status Banner */}
      <div className="bg-gradient-to-r from-blush-pink to-soft-gold p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <Badge className="mb-2 bg-white/20 text-white border-white/30">
              설문 수집 중
            </Badge>
            <p className="text-2xl font-bold">
              {eventData.responseCount}명 응답
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">목표</p>
            <p className="text-lg font-semibold">{eventData.expectedCount}명</p>
          </div>
        </div>
        <ProgressBar
          value={eventData.responseCount}
          max={eventData.expectedCount}
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
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Link href={`/${eventId}/share`}>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <Share2 className="mb-2 h-6 w-6 text-blush-pink" />
                    <p className="font-medium text-charcoal">링크 공유</p>
                    <p className="text-xs text-charcoal/60">친구들에게 전달</p>
                  </Card>
                </Link>
                <Link href={`/${eventId}/recommend`}>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <Utensils className="mb-2 h-6 w-6 text-soft-gold" />
                    <p className="font-medium text-charcoal">식당 추천</p>
                    <p className="text-xs text-charcoal/60">
                      {eventData.responseCount >= 3 ? '추천 받기' : '3명 이상 필요'}
                    </p>
                  </Card>
                </Link>
              </div>

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
                          {eventData.responseCount}명
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
                          {eventData.letterCount}통
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
              {mockResponses.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-charcoal/20" />
                  <p className="text-charcoal/60">아직 응답이 없어요</p>
                  <p className="text-sm text-charcoal/40">
                    친구들에게 링크를 공유해보세요
                  </p>
                </div>
              ) : (
                mockResponses.map((response) => (
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
                            방금 전
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

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-cream bg-white p-4">
        <div className="mx-auto max-w-[480px]">
          {eventData.responseCount >= 3 ? (
            <Link href={`/${eventId}/recommend`}>
              <Button size="lg" fullWidth>
                <Utensils className="mr-2 h-5 w-5" />
                식당 추천 받기
              </Button>
            </Link>
          ) : (
            <Link href={`/${eventId}/share`}>
              <Button size="lg" fullWidth>
                <Share2 className="mr-2 h-5 w-5" />
                링크 공유하기
              </Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}

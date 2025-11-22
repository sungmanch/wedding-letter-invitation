'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  MessageCircle,
  Eye,
} from 'lucide-react'
import {
  Button,
  Input,
  Textarea,
  Card,
  CardContent,
} from '@/components/ui'

export default function InvitationEditPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Form state
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingTime, setMeetingTime] = useState('')
  const [additionalMessage, setAdditionalMessage] = useState('')

  // Mock restaurant data
  const selectedRestaurant = {
    name: '온기정 강남점',
    location: '서울 강남구 테헤란로 123',
    category: '한식',
  }

  const invitationUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/${eventId}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleKakaoShare = () => {
    const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(invitationUrl)}`
    window.open(kakaoUrl, '_blank')
  }

  if (showPreview) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blush-pink-50 to-white">
        {/* Preview Header */}
        <header className="sticky top-0 z-10 border-b border-cream bg-white/80 backdrop-blur-sm">
          <div className="flex h-14 items-center px-4">
            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center text-charcoal/60 hover:text-charcoal"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="flex-1 text-center font-semibold text-charcoal">
              미리보기
            </h1>
            <div className="w-5" />
          </div>
        </header>

        {/* Preview Content */}
        <div className="p-4">
          <Card className="mx-auto max-w-sm overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blush-pink to-soft-gold p-6 text-center text-white">
              <p className="mb-1 text-sm opacity-80">청첩장 모임</p>
              <h2 className="text-2xl font-bold">민지의 대학친구들</h2>
            </div>

            {/* Content */}
            <CardContent className="space-y-4 p-6">
              {/* Restaurant Info */}
              <div className="rounded-xl bg-cream/50 p-4">
                <p className="mb-1 text-sm text-charcoal/60">만나는 곳</p>
                <p className="font-semibold text-charcoal">
                  {selectedRestaurant.name}
                </p>
                <div className="mt-2 flex items-center gap-1 text-sm text-charcoal/60">
                  <MapPin className="h-4 w-4" />
                  {selectedRestaurant.location}
                </div>
              </div>

              {/* Date & Time */}
              {(meetingDate || meetingTime) && (
                <div className="flex gap-4">
                  {meetingDate && (
                    <div className="flex-1 rounded-xl bg-cream/50 p-4">
                      <p className="mb-1 text-sm text-charcoal/60">날짜</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blush-pink" />
                        <p className="font-semibold text-charcoal">
                          {meetingDate}
                        </p>
                      </div>
                    </div>
                  )}
                  {meetingTime && (
                    <div className="flex-1 rounded-xl bg-cream/50 p-4">
                      <p className="mb-1 text-sm text-charcoal/60">시간</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-soft-gold" />
                        <p className="font-semibold text-charcoal">
                          {meetingTime}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Message */}
              {additionalMessage && (
                <div className="rounded-xl border border-cream p-4">
                  <p className="whitespace-pre-wrap text-charcoal">
                    {additionalMessage}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Share Buttons */}
        <div className="p-4">
          <div className="mx-auto max-w-sm space-y-3">
            <Button size="lg" fullWidth onClick={handleCopyLink}>
              <Copy className="mr-2 h-5 w-5" />
              {copied ? '복사됨!' : '링크 복사'}
            </Button>
            <Button
              size="lg"
              fullWidth
              variant="secondary"
              onClick={handleKakaoShare}
              className="bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FEE500]/90"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              카카오톡 공유
            </Button>
          </div>
        </div>
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
            청모장 만들기
          </h1>
          <div className="w-5" />
        </div>
      </header>

      {/* Content */}
      <div className="space-y-6 p-4">
        {/* Selected Restaurant */}
        <Card>
          <CardContent className="p-4">
            <p className="mb-2 text-sm font-medium text-charcoal/60">
              선택한 식당
            </p>
            <h3 className="font-semibold text-charcoal">
              {selectedRestaurant.name}
            </h3>
            <p className="text-sm text-charcoal/60">
              {selectedRestaurant.category} · {selectedRestaurant.location}
            </p>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <div className="space-y-4">
          <h2 className="font-semibold text-charcoal">모임 일정</h2>
          <Input
            type="date"
            label="날짜"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
          />
          <Input
            type="time"
            label="시간"
            value={meetingTime}
            onChange={(e) => setMeetingTime(e.target.value)}
          />
        </div>

        {/* Additional Message */}
        <div>
          <Textarea
            label="추가 메시지 (선택)"
            placeholder="친구들에게 전할 메시지를 입력하세요"
            value={additionalMessage}
            onChange={(e) => setAdditionalMessage(e.target.value)}
            maxLength={200}
            showCount
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-cream bg-white p-4">
        <div className="mx-auto max-w-[480px]">
          <Button size="lg" fullWidth onClick={() => setShowPreview(true)}>
            <Eye className="mr-2 h-5 w-5" />
            미리보기 및 공유
          </Button>
        </div>
      </div>
    </main>
  )
}

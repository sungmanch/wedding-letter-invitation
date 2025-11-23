'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  MessageCircle,
  Eye,
  ExternalLink,
} from 'lucide-react'
import {
  Button,
  Input,
  Textarea,
  Card,
  CardContent,
} from '@/components/ui'
import { useAuth } from '@/providers/AuthProvider'
import { getInvitationData, updateInvitation } from '@/lib/actions/invitation'
import type { InvitationData } from '@/lib/actions/invitation'
import { shareToKakao } from '@/lib/kakao'

export default function InvitationEditPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  const { user, isLoading: isAuthLoading } = useAuth(true)

  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(true) // 바로 공유 화면 표시
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Invitation data
  const [invitation, setInvitation] = useState<InvitationData | null>(null)

  // Form state
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingTime, setMeetingTime] = useState('')
  const [additionalMessage, setAdditionalMessage] = useState('')

  const invitationUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/${eventId}`

  // Fetch invitation data
  useEffect(() => {
    async function fetchData() {
      if (!eventId || !user) return

      setIsLoading(true)
      const result = await getInvitationData(eventId)

      if (result.error || !result.data) {
        setError(result.error?.message || '청모장을 찾을 수 없습니다.')
        setIsLoading(false)
        return
      }

      setInvitation(result.data)

      // Pre-populate form with existing data
      if (result.data.meetingDate) {
        // Convert timestamp to YYYY-MM-DD format
        const dateStr = result.data.meetingDate.split('T')[0]
        setMeetingDate(dateStr)
      }
      if (result.data.meetingTime) {
        setMeetingTime(result.data.meetingTime)
      }
      if (result.data.additionalMessage) {
        setAdditionalMessage(result.data.additionalMessage)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [eventId, user])

  const handleSave = async () => {
    if (!eventId) return

    setIsSaving(true)
    setError(null)

    const result = await updateInvitation(eventId, {
      meetingDate,
      meetingTime,
      additionalMessage,
    })

    if (result.error) {
      setError(result.error.message)
      setIsSaving(false)
      return
    }

    // Refresh invitation data
    const refreshResult = await getInvitationData(eventId)
    if (refreshResult.data) {
      setInvitation(refreshResult.data)
    }

    setIsSaving(false)
  }

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
    const restaurantName = invitation?.selectedRestaurant?.name || '식당'
    const dateText = meetingDate ? meetingDate.replace(/-/g, '.') : ''
    const timeText = meetingTime || ''
    const scheduleText = dateText && timeText ? `${dateText} ${timeText}` : dateText || timeText

    shareToKakao({
      title: `${invitation?.groupName || '청모장'} 모임 초대`,
      description: scheduleText
        ? `📍 ${restaurantName}\n📅 ${scheduleText}`
        : `📍 ${restaurantName}에서 만나요!`,
      url: invitationUrl,
      buttonText: '초대장 보기',
      imageUrl: invitation?.selectedRestaurant?.imageUrl || undefined,
    })
  }

  const handleOpenMap = () => {
    const mapUrl = invitation?.selectedRestaurant?.mapUrl
    if (mapUrl) {
      window.open(mapUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handlePreview = async () => {
    // Save before previewing
    await handleSave()
    if (!error) {
      setShowPreview(true)
    }
  }

  // Loading state
  if (isLoading || isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blush-pink border-t-transparent" />
          <p className="text-charcoal/60">청모장 정보를 불러오는 중...</p>
        </div>
      </main>
    )
  }

  // Error state
  if (error && !invitation) {
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

  if (showPreview) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Preview Header */}
        <header className="sticky top-0 z-10 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
          <div className="flex h-14 items-center px-4">
            <Link
              href={`/${eventId}`}
              className="flex items-center text-charcoal/60 hover:text-charcoal"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="flex-1 text-center font-semibold text-charcoal">
              청모장 공유
            </h1>
            <button
              onClick={() => setShowPreview(false)}
              className="text-sm font-medium text-primary-purple hover:underline"
            >
              수정
            </button>
          </div>
        </header>

        {/* Preview Content */}
        <div className="p-4">
          <Card className="mx-auto max-w-sm overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-primary-purple to-accent-pink p-6 text-center text-white">
              <p className="mb-1 text-sm opacity-80">청첩장 모임</p>
              <h2 className="text-2xl font-bold">{invitation?.groupName}</h2>
            </div>

            {/* Content */}
            <CardContent className="space-y-4 p-6">
              {/* Restaurant Info */}
              {invitation?.selectedRestaurant ? (
                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="mb-1 text-sm text-charcoal/60">만나는 곳</p>
                  <p className="font-semibold text-charcoal">
                    {invitation.selectedRestaurant.name}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-charcoal/60">
                      <MapPin className="h-4 w-4" />
                      {invitation.selectedRestaurant.location}
                    </div>
                    {invitation.selectedRestaurant.mapUrl && (
                      <button
                        onClick={handleOpenMap}
                        className="flex items-center gap-1 text-sm font-medium text-primary-purple hover:underline"
                      >
                        지도 보기
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-purple-50 p-4 text-center">
                  <p className="text-sm text-charcoal/60">
                    아직 식당이 선택되지 않았습니다
                  </p>
                </div>
              )}

              {/* Date & Time */}
              {(meetingDate || meetingTime) && (
                <div className="flex gap-4">
                  {meetingDate && (
                    <div className="flex-1 rounded-xl bg-purple-50 p-4">
                      <p className="mb-1 text-sm text-charcoal/60">날짜</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary-purple" />
                        <p className="font-semibold text-charcoal">
                          {meetingDate.replace(/-/g, '.')}
                        </p>
                      </div>
                    </div>
                  )}
                  {meetingTime && (
                    <div className="flex-1 rounded-xl bg-purple-50 p-4">
                      <p className="mb-1 text-sm text-charcoal/60">시간</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-accent-pink" />
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
                <div className="rounded-xl border border-purple-100 p-4">
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
            <Button
              size="lg"
              fullWidth
              onClick={handleCopyLink}
              disabled={!invitation?.selectedRestaurant}
            >
              <Copy className="mr-2 h-5 w-5" />
              {copied ? '복사됨!' : '링크 복사'}
            </Button>
            <Button
              size="lg"
              fullWidth
              variant="secondary"
              onClick={handleKakaoShare}
              className="bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FEE500]/90"
              disabled={!invitation?.selectedRestaurant}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              카카오톡 공유
            </Button>
            {!invitation?.selectedRestaurant && (
              <p className="text-center text-sm text-charcoal/60">
                식당을 먼저 선택해주세요
              </p>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
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
            {invitation?.selectedRestaurant ? (
              <>
                <h3 className="font-semibold text-charcoal">
                  {invitation.selectedRestaurant.name}
                </h3>
                <p className="text-sm text-charcoal/60">
                  {invitation.selectedRestaurant.category} · {invitation.selectedRestaurant.location}
                </p>
              </>
            ) : (
              <p className="text-sm text-charcoal/60">
                아직 식당이 선택되지 않았습니다. 식당 추천 페이지에서 선택해주세요.
              </p>
            )}
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

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-purple-100 bg-white p-4">
        <div className="mx-auto flex max-w-[480px] gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={handleSave}
            isLoading={isSaving}
            className="flex-1"
          >
            저장
          </Button>
          <Button
            size="lg"
            fullWidth
            onClick={handlePreview}
            isLoading={isSaving}
            className="flex-1"
          >
            <Eye className="mr-2 h-5 w-5" />
            미리보기 및 공유
          </Button>
        </div>
      </div>
    </main>
  )
}

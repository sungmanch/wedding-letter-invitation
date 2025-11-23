'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Copy, Check, Share2, MessageCircle, LayoutDashboard } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'
import { useAuth } from '@/providers/AuthProvider'
import { getEvent } from '@/lib/actions/event'
import { shareToKakao } from '@/lib/kakao'

export default function SharePage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [copied, setCopied] = useState(false)
  const [surveyUrlPath, setSurveyUrlPath] = useState<string>('')
  const [isLoadingEvent, setIsLoadingEvent] = useState(true)
  const { user, isLoading } = useAuth()

  // Event 정보 가져오기 (survey_url 필요)
  useEffect(() => {
    const loadEvent = async () => {
      const event = await getEvent(eventId)
      if (event && event.survey_url) {
        setSurveyUrlPath(event.survey_url)
      }
      setIsLoadingEvent(false)
    }
    loadEvent()
  }, [eventId])

  const surveyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/survey/${surveyUrlPath}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleKakaoShare = () => {
    shareToKakao({
      title: '청모장 - 취향 설문에 참여해주세요!',
      description: '친구의 청첩장 모임을 위해 식당 취향을 알려주세요.',
      url: surveyUrl,
      buttonText: '설문 참여하기',
    })
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-cream bg-white/80 backdrop-blur-sm">
        <div className="flex h-14 items-center px-4">
          <Link
            href="/create"
            className="flex items-center text-charcoal/60 hover:text-charcoal"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center font-semibold text-charcoal">
            설문 링크 공유
          </h1>
          <div className="w-5" />
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-cream bg-cream/30 px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-blush-pink">Step 2</span>
          <span className="text-charcoal/50">링크 공유</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-cream">
          <div className="h-full w-full rounded-full bg-blush-pink" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Success Message */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-charcoal">
            청모장이 생성되었어요!
          </h2>
          <p className="mt-1 text-sm text-charcoal/60">
            이제 친구들에게 설문 링크를 공유하세요
          </p>
        </div>

        {/* Survey Link Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="mb-2 text-sm font-medium text-charcoal">설문 링크</p>
            {isLoadingEvent ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blush-pink border-t-transparent" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex-1 overflow-hidden rounded-lg bg-cream/50 px-3 py-2">
                    <p className="truncate text-sm text-charcoal/80">{surveyUrl}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                    className="shrink-0"
                    disabled={!surveyUrlPath}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {copied && (
                  <p className="mt-2 text-xs text-green-600">
                    링크가 복사되었어요!
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Share Buttons */}
        <div className="space-y-3">
          <Button
            size="lg"
            fullWidth
            onClick={handleCopyLink}
            className="bg-charcoal hover:bg-charcoal/90"
            disabled={isLoadingEvent || !surveyUrlPath}
          >
            <Copy className="mr-2 h-5 w-5" />
            링크 복사하기
          </Button>

          <Button
            size="lg"
            fullWidth
            variant="secondary"
            onClick={handleKakaoShare}
            className="bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FEE500]/90"
            disabled={isLoadingEvent || !surveyUrlPath}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            카카오톡으로 공유
          </Button>
        </div>

        {/* Info */}
        <div className="mt-6 rounded-xl bg-cream/50 p-4">
          <h3 className="mb-2 font-medium text-charcoal">
            <Share2 className="mr-2 inline-block h-4 w-4" />
            공유 팁
          </h3>
          <ul className="space-y-1 text-sm text-charcoal/60">
            <li>- 친구들에게 링크를 보내면 바로 설문에 참여할 수 있어요</li>
            <li>- 친구들은 회원가입 없이 이름만 입력하면 참여 가능해요</li>
            <li>- 응답 현황은 대시보드에서 확인할 수 있어요</li>
          </ul>
        </div>

        {/* Dashboard Access - 로그인 상태에 따라 다르게 표시 */}
        {!isLoading && (
          <div className="mt-6 rounded-xl border-2 border-blush-pink bg-blush-pink/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-blush-pink" />
              <h3 className="font-semibold text-charcoal">
                응답 현황 확인하기
              </h3>
            </div>
            {user ? (
              // 로그인된 상태
              <>
                <p className="mb-4 text-sm text-charcoal/60">
                  대시보드에서 친구들의 응답 현황을 확인하고, 식당 추천을 받고, 최종 청모장을 공유할 수 있어요.
                </p>
                <Link href={`/${eventId}`}>
                  <Button fullWidth>
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    대시보드로 이동하기
                  </Button>
                </Link>
              </>
            ) : (
              // 비로그인 상태
              <>
                <p className="mb-4 text-sm text-charcoal/60">
                  로그인하면 친구들의 응답 현황을 확인하고, 식당 추천을 받고, 최종 청모장을 공유할 수 있어요.
                </p>
                <Link href={`/login?redirect=/${eventId}`}>
                  <Button fullWidth>
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    로그인하고 대시보드 확인하기
                  </Button>
                </Link>
                <p className="mt-3 text-center text-xs text-charcoal/40">
                  아직 계정이 없으신가요?{' '}
                  <Link href={`/signup?redirect=/${eventId}`} className="text-blush-pink underline">
                    회원가입
                  </Link>
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

import { notFound } from 'next/navigation'
import { Calendar, Clock, MapPin, Heart, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import { getInvitationData } from '@/lib/actions/invitation'

export const metadata = {
  title: '청모장 초대',
  description: '청모장 모임에 초대합니다',
}

interface PageProps {
  params: Promise<{ eventId: string }>
}

export default async function PublicInvitationPage({ params }: PageProps) {
  const { eventId } = await params
  const result = await getInvitationData(eventId)

  // Handle event not found
  if (result.error || !result.data) {
    notFound()
  }

  const invitation = result.data

  // Format date for display (YYYY-MM-DD -> YYYY.MM.DD)
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return dateString.split('T')[0].replace(/-/g, '.')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8">
      <div className="mx-auto max-w-sm px-4">
        {/* Header */}
        <div className="mb-6 text-center">
          <Heart className="mx-auto mb-2 h-8 w-8 text-primary-purple" />
          <p className="text-sm text-charcoal/60">청모장 초대</p>
        </div>

        {/* Invitation Card */}
        <Card className="overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-primary-purple to-accent-pink p-6 text-center text-white">
            <p className="mb-1 text-sm opacity-80">청첩장 모임</p>
            <h1 className="text-2xl font-bold">{invitation.groupName}</h1>
          </div>

          {/* Content */}
          <CardContent className="space-y-4 p-6">
            {/* Restaurant */}
            {invitation.selectedRestaurant ? (
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
                    <a
                      href={invitation.selectedRestaurant.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm font-medium text-primary-purple hover:underline"
                    >
                      지도 보기
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
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
            {(invitation.meetingDate || invitation.meetingTime) && (
              <div className="flex gap-4">
                {invitation.meetingDate && (
                  <div className="flex-1 rounded-xl bg-purple-50 p-4">
                    <p className="mb-1 text-sm text-charcoal/60">날짜</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary-purple" />
                      <p className="font-semibold text-charcoal">
                        {formatDate(invitation.meetingDate)}
                      </p>
                    </div>
                  </div>
                )}
                {invitation.meetingTime && (
                  <div className="flex-1 rounded-xl bg-purple-50 p-4">
                    <p className="mb-1 text-sm text-charcoal/60">시간</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-accent-pink" />
                      <p className="font-semibold text-charcoal">
                        {invitation.meetingTime}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Message */}
            {invitation.additionalMessage && (
              <div className="rounded-xl border border-purple-100 p-4 text-center">
                <p className="whitespace-pre-wrap text-charcoal">
                  {invitation.additionalMessage}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-charcoal/40">
            청모장으로 만들어졌어요
          </p>
        </div>
      </div>
    </main>
  )
}

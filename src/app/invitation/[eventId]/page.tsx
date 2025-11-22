import { Calendar, Clock, MapPin, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'

// Mock data (실제로는 DB에서 가져옴)
const mockInvitation = {
  groupName: '민지의 대학친구들',
  restaurant: {
    name: '온기정 강남점',
    location: '서울 강남구 테헤란로 123',
    category: '한식',
  },
  meetingDate: '2025-12-15',
  meetingTime: '18:00',
  additionalMessage: '드디어 모임 날짜가 정해졌어요! 다들 꼭 와주세요~ 💕',
}

export const metadata = {
  title: '청모장 초대',
  description: '청모장 모임에 초대합니다',
}

export default function PublicInvitationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blush-pink-50 to-white py-8">
      <div className="mx-auto max-w-sm px-4">
        {/* Header */}
        <div className="mb-6 text-center">
          <Heart className="mx-auto mb-2 h-8 w-8 text-blush-pink" />
          <p className="text-sm text-charcoal/60">청모장 초대</p>
        </div>

        {/* Invitation Card */}
        <Card className="overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-blush-pink to-soft-gold p-6 text-center text-white">
            <p className="mb-1 text-sm opacity-80">청첩장 모임</p>
            <h1 className="text-2xl font-bold">{mockInvitation.groupName}</h1>
          </div>

          {/* Content */}
          <CardContent className="space-y-4 p-6">
            {/* Restaurant */}
            <div className="rounded-xl bg-cream/50 p-4">
              <p className="mb-1 text-sm text-charcoal/60">만나는 곳</p>
              <p className="font-semibold text-charcoal">
                {mockInvitation.restaurant.name}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm text-charcoal/60">
                <MapPin className="h-4 w-4" />
                {mockInvitation.restaurant.location}
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex gap-4">
              <div className="flex-1 rounded-xl bg-cream/50 p-4">
                <p className="mb-1 text-sm text-charcoal/60">날짜</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blush-pink" />
                  <p className="font-semibold text-charcoal">
                    {mockInvitation.meetingDate.replace(/-/g, '.')}
                  </p>
                </div>
              </div>
              <div className="flex-1 rounded-xl bg-cream/50 p-4">
                <p className="mb-1 text-sm text-charcoal/60">시간</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-soft-gold" />
                  <p className="font-semibold text-charcoal">
                    {mockInvitation.meetingTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Message */}
            {mockInvitation.additionalMessage && (
              <div className="rounded-xl border border-cream p-4 text-center">
                <p className="whitespace-pre-wrap text-charcoal">
                  {mockInvitation.additionalMessage}
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

'use client'

/**
 * Response Viewer Modal
 *
 * RSVP 응답과 방명록을 조회하는 통합 모달
 * - 탭 구조: RSVP / 방명록
 * - 통계 요약 섹션
 * - 응답 목록 (스크롤)
 */

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
  X,
  Users,
  Check,
  XIcon,
  MessageSquare,
  Bus,
  Phone,
  Loader2,
  Share2,
  MailOpen,
} from 'lucide-react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui'

// ============================================
// Types
// ============================================

interface RsvpResponse {
  id: string
  documentId: string
  name: string
  phone: string | null
  attending: boolean
  side: 'groom' | 'bride' | null
  guestCount: number
  mealOption: string | null
  busRequired: boolean | null
  note: string | null
  createdAt: string
}

interface GuestbookMessage {
  id: string
  documentId: string
  name: string
  message: string
  createdAt: string
}

interface RsvpStats {
  total: number
  attending: number
  notAttending: number
  groom: number
  bride: number
  totalGuests: number
}

interface ResponseViewerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentId: string
  onShareClick?: () => void
}

// ============================================
// Component
// ============================================

export function ResponseViewerModal({
  open,
  onOpenChange,
  documentId,
  onShareClick,
}: ResponseViewerModalProps) {
  const [activeTab, setActiveTab] = useState<'rsvp' | 'guestbook'>('rsvp')

  // RSVP 상태
  const [rsvpResponses, setRsvpResponses] = useState<RsvpResponse[]>([])
  const [rsvpStats, setRsvpStats] = useState<RsvpStats | null>(null)
  const [rsvpLoading, setRsvpLoading] = useState(false)

  // 방명록 상태
  const [guestbookMessages, setGuestbookMessages] = useState<GuestbookMessage[]>([])
  const [guestbookTotal, setGuestbookTotal] = useState(0)
  const [guestbookLoading, setGuestbookLoading] = useState(false)

  // RSVP 데이터 조회
  const fetchRsvp = useCallback(async () => {
    if (!documentId) return

    setRsvpLoading(true)
    try {
      const res = await fetch(`/api/super-editor-v2/rsvp?documentId=${documentId}`)
      const data = await res.json()

      if (data.success) {
        setRsvpResponses(data.responses || [])
        setRsvpStats(data.stats || null)
      }
    } catch (error) {
      console.error('RSVP fetch error:', error)
    } finally {
      setRsvpLoading(false)
    }
  }, [documentId])

  // 방명록 데이터 조회
  const fetchGuestbook = useCallback(async () => {
    if (!documentId) return

    setGuestbookLoading(true)
    try {
      const res = await fetch(`/api/super-editor-v2/guestbook?documentId=${documentId}`)
      const data = await res.json()

      if (data.success) {
        setGuestbookMessages(data.messages || [])
        setGuestbookTotal(data.stats?.total || 0)
      }
    } catch (error) {
      console.error('Guestbook fetch error:', error)
    } finally {
      setGuestbookLoading(false)
    }
  }, [documentId])

  // 모달 열릴 때 데이터 조회
  useEffect(() => {
    if (open) {
      fetchRsvp()
      fetchGuestbook()
    }
  }, [open, fetchRsvp, fetchGuestbook])

  const isEmpty = rsvpStats?.total === 0 && guestbookTotal === 0

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-lg max-h-[85vh] flex flex-col">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--sage-600)]" />
            RSVP·방명록
          </ModalTitle>
        </ModalHeader>

        {/* 빈 상태 */}
        {isEmpty && !rsvpLoading && !guestbookLoading ? (
          <div className="py-12 text-center">
            <MailOpen className="w-16 h-16 text-[var(--sand-300)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              아직 응답이 없어요
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              청첩장을 공유하면<br />
              참석 응답을 받을 수 있어요
            </p>
            {onShareClick && (
              <button
                onClick={() => {
                  onOpenChange(false)
                  onShareClick()
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--sage-500)] text-white rounded-lg hover:bg-[var(--sage-600)] transition-colors text-sm font-medium"
              >
                <Share2 className="w-4 h-4" />
                청첩장 공유하기
              </button>
            )}
          </div>
        ) : (
          <>
            {/* 통계 요약 */}
            {rsvpStats && (
              <div className="mb-4">
                {/* 참석 현황 */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <StatCard label="전체" value={rsvpStats.total} />
                  <StatCard label="참석" value={rsvpStats.attending} color="green" />
                  <StatCard label="불참" value={rsvpStats.notAttending} color="red" />
                </div>

                {/* 신랑/신부측 */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="px-3 py-2 bg-blue-50 rounded-lg text-center">
                    <span className="text-xs text-blue-600">신랑측</span>
                    <p className="text-lg font-semibold text-blue-700">{rsvpStats.groom}명</p>
                  </div>
                  <div className="px-3 py-2 bg-pink-50 rounded-lg text-center">
                    <span className="text-xs text-pink-600">신부측</span>
                    <p className="text-lg font-semibold text-pink-700">{rsvpStats.bride}명</p>
                  </div>
                </div>
              </div>
            )}

            {/* 탭 */}
            <div className="flex border-b border-[var(--sand-200)] mb-4">
              <button
                onClick={() => setActiveTab('rsvp')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'rsvp'
                    ? 'text-[var(--sage-600)] border-b-2 border-[var(--sage-500)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
                }`}
              >
                RSVP 응답 ({rsvpStats?.total || 0})
              </button>
              <button
                onClick={() => setActiveTab('guestbook')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'guestbook'
                    ? 'text-[var(--sage-600)] border-b-2 border-[var(--sage-500)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
                }`}
              >
                방명록 ({guestbookTotal})
              </button>
            </div>

            {/* 목록 */}
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              {activeTab === 'rsvp' ? (
                rsvpLoading ? (
                  <LoadingState />
                ) : rsvpResponses.length === 0 ? (
                  <EmptyTabState message="아직 RSVP 응답이 없습니다" />
                ) : (
                  <div className="space-y-3">
                    {rsvpResponses.map((response) => (
                      <RsvpCard key={response.id} response={response} />
                    ))}
                  </div>
                )
              ) : (
                guestbookLoading ? (
                  <LoadingState />
                ) : guestbookMessages.length === 0 ? (
                  <EmptyTabState message="아직 방명록이 없습니다" />
                ) : (
                  <div className="space-y-3">
                    {guestbookMessages.map((message) => (
                      <GuestbookCard key={message.id} message={message} />
                    ))}
                  </div>
                )
              )}
            </div>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

// ============================================
// Sub Components
// ============================================

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color?: 'green' | 'red'
}) {
  const bgColor = color === 'green'
    ? 'bg-green-50'
    : color === 'red'
    ? 'bg-red-50'
    : 'bg-[var(--sand-50)]'

  const textColor = color === 'green'
    ? 'text-green-600'
    : color === 'red'
    ? 'text-red-600'
    : 'text-[var(--text-primary)]'

  return (
    <div className={`px-3 py-2 ${bgColor} rounded-lg text-center`}>
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <p className={`text-xl font-semibold ${textColor}`}>{value}</p>
    </div>
  )
}

function RsvpCard({ response }: { response: RsvpResponse }) {
  const sideLabel = response.side === 'groom' ? '신랑측' : response.side === 'bride' ? '신부측' : ''
  const sideColor = response.side === 'groom' ? 'text-blue-600 bg-blue-50' : 'text-pink-600 bg-pink-50'

  return (
    <div className="p-3 bg-[var(--ivory-50)] rounded-lg border border-[var(--sand-100)]">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--text-primary)]">{response.name}</span>
          {sideLabel && (
            <span className={`px-1.5 py-0.5 text-[10px] rounded ${sideColor}`}>
              {sideLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {response.attending ? (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <Check className="w-3.5 h-3.5" />
              참석
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-red-500">
              <XIcon className="w-3.5 h-3.5" />
              불참
            </span>
          )}
          {response.attending && response.guestCount > 1 && (
            <span className="text-xs text-[var(--text-muted)]">| {response.guestCount}명</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
        {response.phone && (
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {response.phone}
          </span>
        )}
        {response.busRequired && (
          <span className="flex items-center gap-1 text-[var(--sage-600)]">
            <Bus className="w-3 h-3" />
            버스 탑승
          </span>
        )}
        <span>
          {format(new Date(response.createdAt), 'M월 d일', { locale: ko })}
        </span>
      </div>

      {response.note && (
        <p className="mt-2 text-xs text-[var(--text-muted)] bg-white p-2 rounded">
          {response.note}
        </p>
      )}
    </div>
  )
}

function GuestbookCard({ message }: { message: GuestbookMessage }) {
  return (
    <div className="p-3 bg-[var(--ivory-50)] rounded-lg border border-[var(--sand-100)]">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-[var(--text-primary)]">{message.name}</span>
        <span className="text-xs text-[var(--text-muted)]">
          {format(new Date(message.createdAt), 'M월 d일', { locale: ko })}
        </span>
      </div>
      <p className="text-sm text-[var(--text-body)] whitespace-pre-wrap">
        {message.message}
      </p>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin text-[var(--sage-500)]" />
    </div>
  )
}

function EmptyTabState({ message }: { message: string }) {
  return (
    <div className="py-8 text-center text-[var(--text-muted)] text-sm">
      {message}
    </div>
  )
}

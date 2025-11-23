'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Check, RefreshCw, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getPendingPayments, approvePayment, rejectPayment } from '@/lib/actions/payment'
import type { PaymentRequestData } from '@/lib/actions/payment'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRequestData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const fetchPayments = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getPendingPayments()

      if (result.error) {
        setError(result.error.message)
        setIsLoading(false)
        return
      }

      if (result.data) {
        setPayments(result.data)
      }
    } catch (err) {
      console.error('Fetch payments error:', err)
      setError('결제 요청 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const handleApprove = async (paymentId: string) => {
    if (!confirm('이 결제를 승인하시겠습니까? 편지함이 즉시 열립니다.')) {
      return
    }

    setProcessingId(paymentId)

    try {
      const result = await approvePayment(paymentId)

      if (result.error) {
        alert(`승인 실패: ${result.error.message}`)
        setProcessingId(null)
        return
      }

      // 성공
      alert('결제가 승인되었습니다. 사용자에게 알림이 발송되었습니다.')
      // 목록 새로고침
      await fetchPayments()
    } catch (err) {
      console.error('Approve error:', err)
      alert('승인 처리 중 오류가 발생했습니다.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (paymentId: string) => {
    const reason = prompt('거절 사유를 입력해주세요 (선택사항):')
    if (reason === null) return // 취소

    setProcessingId(paymentId)

    try {
      const result = await rejectPayment(paymentId, reason || undefined)

      if (result.error) {
        alert(`거절 실패: ${result.error.message}`)
        setProcessingId(null)
        return
      }

      alert('결제가 거절되었습니다.')
      await fetchPayments()
    } catch (err) {
      console.error('Reject error:', err)
      alert('거절 처리 중 오류가 발생했습니다.')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="flex h-14 items-center px-4">
          <Link
            href="/admin"
            className="flex items-center text-charcoal/60 hover:text-charcoal"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center font-semibold text-charcoal">
            결제 승인 관리
          </h1>
          <button
            onClick={fetchPayments}
            disabled={isLoading}
            className="rounded p-1 hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-charcoal/60">대기중</p>
                <p className="text-2xl font-bold text-charcoal">{payments.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-charcoal/60">오늘 승인</p>
                <p className="text-2xl font-bold text-charcoal">-</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && payments.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-pink-200 border-t-accent-pink" />
              <p className="text-charcoal/60">불러오는 중...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && payments.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <CreditCard className="h-8 w-8 text-charcoal/30" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-charcoal">
              대기중인 결제 요청이 없습니다
            </h2>
            <p className="text-sm text-charcoal/60">
              새로운 결제 요청이 들어오면 여기에 표시됩니다
            </p>
          </div>
        )}

        {/* Payment List */}
        {!isLoading && payments.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-charcoal">
              대기중인 결제 ({payments.length})
            </h2>

            {payments.map((payment) => (
              <Card key={payment.id} className="overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-accent-pink" />
                      <h3 className="font-semibold text-charcoal">
                        {payment.userEmail || '사용자 이메일 없음'}
                      </h3>
                    </div>
                    <Badge variant="secondary">
                      {payment.amount.toLocaleString()}원
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-4 space-y-2 text-sm">
                    <InfoRow
                      label="입금자명"
                      value={payment.depositName || '-'}
                      highlight
                    />
                    <InfoRow
                      label="요청 시간"
                      value={
                        payment.depositAt
                          ? format(new Date(payment.depositAt), 'yyyy.MM.dd HH:mm', {
                              locale: ko,
                            })
                          : format(new Date(payment.requestedAt), 'yyyy.MM.dd HH:mm', {
                              locale: ko,
                            })
                      }
                    />
                    <InfoRow label="사용자 ID" value={payment.userId.slice(0, 8)} />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      fullWidth
                      onClick={() => handleApprove(payment.id)}
                      disabled={processingId === payment.id}
                      isLoading={processingId === payment.id}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      승인
                    </Button>
                    <Button
                      fullWidth
                      variant="outline"
                      onClick={() => handleReject(payment.id)}
                      disabled={processingId === payment.id}
                    >
                      거절
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

interface InfoRowProps {
  label: string
  value: string
  highlight?: boolean
}

function InfoRow({ label, value, highlight }: InfoRowProps) {
  return (
    <div className="flex justify-between">
      <span className="text-charcoal/60">{label}</span>
      <span className={`font-medium ${highlight ? 'text-accent-pink' : 'text-charcoal'}`}>
        {value}
      </span>
    </div>
  )
}

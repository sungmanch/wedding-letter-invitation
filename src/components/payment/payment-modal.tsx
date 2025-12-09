'use client'

import { useState, useEffect } from 'react'
import { Copy, CreditCard, Check, X } from 'lucide-react'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { createPaymentRequest } from '@/lib/actions/payment'

interface PaymentModalProps {
  userName: string
  onPaymentRequested?: () => void
}

export function PaymentModal({ userName, onPaymentRequested }: PaymentModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [paymentPending, setPaymentPending] = useState(false)
  const [depositName, setDepositName] = useState<string>('')

  const bankInfo = {
    bank: '하나은행',
    account: '620-241758-811',
    holder: '조성만',
    amount: '9,900원',
  }

  // 모달이 열릴 때 입금자명 자동 생성 (userName + 3자리 랜덤 숫자)
  useEffect(() => {
    if (isOpen && !depositName && !paymentPending) {
      const randomNum = Math.floor(Math.random() * 900) + 100 // 100-999
      setDepositName(`${userName}${randomNum}`)
    }
  }, [isOpen, depositName, paymentPending, userName])

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDepositComplete = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 생성된 입금자명과 함께 결제 요청
      const result = await createPaymentRequest(userName, depositName)

      if (result.error) {
        setError(result.error.message)
        setIsLoading(false)
        return
      }

      if (result.data) {
        setPaymentPending(true)
        onPaymentRequested?.()
        // 모달은 열어두고 대기 상태 표시
      }
    } catch (err) {
      console.error('Payment request error:', err)
      setError('결제 요청 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>
        <Button size="lg" fullWidth>
          <CreditCard className="mr-2 h-5 w-5" />
          편지 빠른 열람 (계좌이체)
        </Button>
      </ModalTrigger>

      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50">
              💌
            </div>
            편지함 빠른 열람
          </ModalTitle>
          <ModalDescription>
            편지를 지금 바로 확인하고 싶으신가요?
          </ModalDescription>
        </ModalHeader>

        <div className="space-y-4 py-4">
          {/* 입금자명 강조 섹션 - depositName이 있을 때만 표시 */}
          {depositName && (
            <div className="animate-pulse-slow rounded-xl border-2 border-red-500 bg-yellow-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
                  <span className="text-lg font-bold text-white">!</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-red-700">필수: 입금자명 확인</h3>
                    <span className="rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                      매우 중요
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-red-600">
                    반드시 아래 이름으로 송금해주세요
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-2 text-sm font-semibold text-charcoal">
                  입금자명 (복사해서 사용하세요)
                </div>
                <div className="flex items-center gap-3">
                  <code className="flex-1 rounded bg-gray-100 px-3 py-2 text-lg font-bold text-red-600">
                    {depositName}
                  </code>
                  <button
                    onClick={() => copyToClipboard(depositName, 'depositName')}
                    className="flex items-center gap-2 rounded-lg bg-accent-pink px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    {copiedField === 'depositName' ? (
                      <>
                        <Check className="h-4 w-4" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        복사
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <div className="flex items-start gap-2 text-red-700">
                  <span className="mt-0.5">⚠️</span>
                  <span className="font-semibold">
                    입금자명이 다르면 확인이 지연되거나 불가능합니다
                  </span>
                </div>
                <div className="flex items-start gap-2 text-red-600">
                  <span className="mt-0.5">⚠️</span>
                  <span>
                    은행 앱에서 위 입금자명을 <strong>정확히 복사하여</strong> 입력해주세요
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 입금 정보 카드 */}
          <div className="rounded-xl border-2 border-pink-100 bg-pink-50/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-accent-pink" />
              <h3 className="font-semibold text-charcoal">입금 정보</h3>
            </div>

            <div className="space-y-2">
              <InfoRow
                label="은행"
                value={bankInfo.bank}
                onCopy={() => copyToClipboard(bankInfo.bank, 'bank')}
                copied={copiedField === 'bank'}
              />
              <InfoRow
                label="계좌번호"
                value={bankInfo.account}
                onCopy={() => copyToClipboard(bankInfo.account, 'account')}
                copied={copiedField === 'account'}
                highlight
              />
              <InfoRow
                label="예금주"
                value={bankInfo.holder}
                onCopy={() => copyToClipboard(bankInfo.holder, 'holder')}
                copied={copiedField === 'holder'}
              />
              <InfoRow
                label="금액"
                value={bankInfo.amount}
                onCopy={() => copyToClipboard('9900', 'amount')}
                copied={copiedField === 'amount'}
                highlight
              />
            </div>
          </div>

          {/* 처리 시간 안내 */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-lg">⏱️</div>
              <div className="flex-1 text-sm">
                <div className="font-medium text-charcoal">처리 시간</div>
                <div className="mt-1 text-charcoal/60">
                  평균 <span className="font-semibold text-accent-pink">2시간 이내</span> 확인
                </div>
                <div className="text-xs text-charcoal/50">
                  영업시간 09:00-21:00 순차 처리
                </div>
              </div>
            </div>
          </div>

          {/* 자동 알림 안내 */}
          <div className="space-y-2 text-sm text-charcoal/60">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>입금 확인 시 이메일로 알림 발송</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>자동으로 편지함 열림 (새로고침 불필요)</span>
            </div>
          </div>

          {/* 환불 정책 */}
          <div className="rounded-lg bg-cream p-3 text-xs text-charcoal/60">
            💡 입금 후 24시간 이내 환불 요청 가능 (전액 환불)
            <br />
            문의: sungman.cho@tbdlabs.team
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <X className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        <ModalFooter className="flex-col gap-2">
          {paymentPending ? (
            <div className="w-full rounded-lg bg-pink-50 p-3 text-center text-sm text-charcoal/60">
              입금 확인 중입니다. 확인되는 즉시 알려드릴게요!
            </div>
          ) : (
            <>
              <Button
                size="lg"
                fullWidth
                onClick={handleDepositComplete}
                disabled={isLoading}
                isLoading={isLoading}
              >
                입금 완료했어요
              </Button>
              <Button
                size="lg"
                fullWidth
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                나중에 할게요
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

interface InfoRowProps {
  label: string
  value: string
  onCopy: () => void
  copied: boolean
  highlight?: boolean
}

function InfoRow({ label, value, onCopy, copied, highlight }: InfoRowProps) {
  return (
    <div className={`flex items-center justify-between rounded-lg p-2 ${highlight ? 'bg-white' : ''}`}>
      <div className="flex-1">
        <div className="text-xs text-charcoal/60">{label}</div>
        <div className={`font-medium ${highlight ? 'text-accent-pink' : 'text-charcoal'}`}>
          {value}
        </div>
      </div>
      <button
        onClick={onCopy}
        className="rounded p-2 hover:bg-pink-50 transition-colors"
        aria-label={`${label} 복사`}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4 text-charcoal/40" />
        )}
      </button>
    </div>
  )
}

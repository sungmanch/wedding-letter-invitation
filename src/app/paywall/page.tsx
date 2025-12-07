'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { createUnifiedCheckoutSession, type InvitationType } from '@/lib/actions/wedding-payment'

const PRICE = 9900

function PaywallContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const type = Number(searchParams.get('type')) as InvitationType
  const id = searchParams.get('id')

  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Validate params
  const isValid = (type === 1 || type === 2) && id

  const handlePayment = async () => {
    if (!isValid) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await createUnifiedCheckoutSession(type, id)

      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else {
        setError(result.error || '결제 처리 중 오류가 발생했습니다')
      }
    } catch {
      setError('결제 처리 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValid) {
    return (
      <div className="flex flex-col min-h-screen bg-white lg:max-w-2xl lg:mx-auto lg:shadow-xl items-center justify-center p-6">
        <p className="text-gray-500 mb-4">잘못된 접근입니다</p>
        <Button onClick={() => router.push('/')} variant="outline">
          홈으로 돌아가기
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white lg:max-w-2xl lg:mx-auto lg:shadow-xl">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
        <div className="flex h-14 items-center px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-charcoal" />
          </button>
          <span className="ml-2 font-medium text-charcoal">결제하기</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        {/* Product Info */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-charcoal mb-2">
            Maison de Letter
          </h1>
          <p className="text-gray-500">
            결제 후 청첩장을 친구들에게 공유할 수 있습니다
          </p>
        </div>

        {/* Features */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-8">
          <h2 className="font-medium text-charcoal mb-3">포함 기능</h2>
          <ul className="space-y-2">
            <FeatureItem>AI 맞춤 디자인</FeatureItem>
            <FeatureItem>무제한 공유</FeatureItem>
            <FeatureItem>결제 후 수정 가능</FeatureItem>
            <FeatureItem>축하 메시지 수신</FeatureItem>
            <FeatureItem>영구 보관</FeatureItem>
          </ul>
        </div>

        {/* Price */}
        <div className="border border-gray-200 rounded-2xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">결제 금액</span>
            <span className="text-2xl font-bold text-charcoal">
              {PRICE.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-[#D4768A] hover:bg-[#c4657a] text-white py-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              처리 중...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              {PRICE.toLocaleString()}원 결제하기
            </>
          )}
        </Button>

        {/* Terms */}
        <p className="mt-4 text-center text-xs text-gray-400">
          결제 버튼을 클릭하면{' '}
          <Link href="/terms" className="underline">
            이용약관
          </Link>
          에 동의하게 됩니다
        </p>
      </main>
    </div>
  )
}

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-sm text-charcoal">
      <Check className="h-4 w-4 text-[#D4768A]" />
      {children}
    </li>
  )
}

export default function PaywallPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-white lg:max-w-2xl lg:mx-auto lg:shadow-xl items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
      <PaywallContent />
    </Suspense>
  )
}

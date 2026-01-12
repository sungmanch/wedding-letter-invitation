import React from 'react'
import { redirect } from 'next/navigation'
import { Polar } from '@polar-sh/sdk'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { db } from '@/lib/db'
import { editorDocumentsV2 } from '@/lib/super-editor-v2/schema/db-schema'
import { invitationPayments } from '@/lib/db/invitation-schema'
import { gameDiscountCodes } from '@/lib/db/game-schema'

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
})

// ============================================
// Error Page Component
// ============================================

interface ErrorPageProps {
  title: string
  description?: string
}

function ErrorPage({ title, description }: ErrorPageProps): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--ivory-100)]">
      <div className="text-center p-8">
        <h1 className="text-xl font-medium text-[var(--text-primary)] mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-[var(--text-muted)] mb-6">{description}</p>
        )}
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-[var(--sage-500)] text-white hover:bg-[var(--sage-600)] transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

// ============================================
// Page Component
// ============================================

interface PageProps {
  searchParams: Promise<{ checkout_id?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { checkout_id } = await searchParams

  if (!checkout_id) {
    return (
      <ErrorPage
        title="결제 정보를 찾을 수 없습니다"
        description="checkout_id가 제공되지 않았습니다."
      />
    )
  }

  try {
    // Polar API에서 checkout 정보 조회
    const checkout = await polar.checkouts.get({ id: checkout_id })

    if (checkout.status !== 'succeeded') {
      return (
        <ErrorPage
          title="결제가 완료되지 않았습니다"
          description={`결제 상태: ${checkout.status}`}
        />
      )
    }

    // metadata에서 documentId 추출
    const metadata = checkout.metadata as { documentId?: string } | null
    const documentId = metadata?.documentId

    if (!documentId) {
      return (
        <ErrorPage
          title="결제가 완료되었습니다!"
          description="문서 정보를 찾을 수 없습니다. 관리자에게 문의해주세요."
        />
      )
    }

    // 문서 조회
    const [document] = await db
      .select()
      .from(editorDocumentsV2)
      .where(eq(editorDocumentsV2.id, documentId))
      .limit(1)

    if (!document) {
      return <ErrorPage title="문서를 찾을 수 없습니다" />
    }

    // 이미 결제 완료된 경우 바로 리다이렉트
    if (document.isPaid) {
      redirect('/my/invitations')
    }

    // 결제 정보 저장
    const [payment] = await db
      .insert(invitationPayments)
      .values({
        userId: document.userId,
        polarCheckoutId: checkout_id,
        polarOrderId: checkout.productId || null,
        amount: checkout.totalAmount || 0,
        status: 'completed',
        completedAt: new Date(),
      })
      .returning()

    // 문서 결제 상태 업데이트 및 공개 처리
    await db
      .update(editorDocumentsV2)
      .set({
        isPaid: true,
        paymentId: payment.id,
        status: 'published',
        updatedAt: new Date(),
      })
      .where(eq(editorDocumentsV2.id, documentId))

    // 할인코드 사용 처리 (Polar 체크아웃에서 사용된 할인코드 확인)
    // Polar API에서 discount 정보 확인 후 로컬 DB 업데이트
    try {
      const discountId = (checkout as { discountId?: string })?.discountId
      if (discountId) {
        // Polar discount ID로 로컬 할인코드 찾기
        const [discountRecord] = await db
          .select()
          .from(gameDiscountCodes)
          .where(eq(gameDiscountCodes.polarDiscountId, discountId))
          .limit(1)

        if (discountRecord && !discountRecord.used) {
          // 할인코드 사용 처리
          await db
            .update(gameDiscountCodes)
            .set({
              used: true,
              usedAt: new Date(),
              userId: document.userId,
            })
            .where(eq(gameDiscountCodes.id, discountRecord.id))

          console.log('Discount code marked as used:', discountRecord.code)
        }
      }
    } catch (discountError) {
      // 할인코드 처리 실패해도 결제는 완료됨
      console.warn('Failed to mark discount as used:', discountError)
    }

    // 내 청첩장 페이지로 리다이렉트
    redirect('/my/invitations')
  } catch (error) {
    console.error('Checkout verification error:', error)
    return (
      <ErrorPage
        title="결제 확인 중 오류가 발생했습니다"
        description="잠시 후 다시 시도해주세요. 문제가 지속되면 관리자에게 문의해주세요."
      />
    )
  }
}

import { redirect } from 'next/navigation'
import { Polar } from '@polar-sh/sdk'
import { db } from '@/lib/db'
import { editorDocumentsV2 } from '@/lib/super-editor-v2/schema/db-schema'
import { invitationPayments } from '@/lib/db/invitation-schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
})

interface PageProps {
  searchParams: Promise<{ checkout_id?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { checkout_id } = await searchParams

  if (!checkout_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--ivory-100)]">
        <div className="text-center p-8">
          <h1 className="text-xl font-medium text-[var(--text-primary)] mb-2">
            결제 정보를 찾을 수 없습니다
          </h1>
          <p className="text-[var(--text-muted)] mb-6">
            checkout_id가 제공되지 않았습니다.
          </p>
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

  try {
    // Polar API에서 checkout 정보 조회
    const checkout = await polar.checkouts.get({ id: checkout_id })

    if (checkout.status !== 'succeeded') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--ivory-100)]">
          <div className="text-center p-8">
            <h1 className="text-xl font-medium text-[var(--text-primary)] mb-2">
              결제가 완료되지 않았습니다
            </h1>
            <p className="text-[var(--text-muted)] mb-6">
              결제 상태: {checkout.status}
            </p>
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

    // metadata에서 documentId 추출
    const metadata = checkout.metadata as { documentId?: string } | null
    const documentId = metadata?.documentId

    if (!documentId) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--ivory-100)]">
          <div className="text-center p-8">
            <h1 className="text-xl font-medium text-[var(--text-primary)] mb-2">
              결제가 완료되었습니다!
            </h1>
            <p className="text-[var(--text-muted)] mb-6">
              문서 정보를 찾을 수 없습니다. 관리자에게 문의해주세요.
            </p>
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

    // 문서 조회
    const [document] = await db
      .select()
      .from(editorDocumentsV2)
      .where(eq(editorDocumentsV2.id, documentId))
      .limit(1)

    if (!document) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--ivory-100)]">
          <div className="text-center p-8">
            <h1 className="text-xl font-medium text-[var(--text-primary)] mb-2">
              문서를 찾을 수 없습니다
            </h1>
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

    // 이미 결제 완료된 경우 바로 리다이렉트
    if (document.isPaid) {
      redirect(`/share/${documentId}`)
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

    // 공유 페이지로 리다이렉트
    redirect(`/share/${documentId}`)
  } catch (error) {
    console.error('Checkout verification error:', error)

    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--ivory-100)]">
        <div className="text-center p-8">
          <h1 className="text-xl font-medium text-[var(--text-primary)] mb-2">
            결제 확인 중 오류가 발생했습니다
          </h1>
          <p className="text-[var(--text-muted)] mb-6">
            잠시 후 다시 시도해주세요. 문제가 지속되면 관리자에게 문의해주세요.
          </p>
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
}

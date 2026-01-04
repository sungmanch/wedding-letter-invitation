import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { editorDocumentsV2 } from '@/lib/super-editor-v2/schema/db-schema'
import { invitationPayments } from '@/lib/db/invitation-schema'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'

// Polar 웹훅 시크릿으로 서명 검증
function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

interface PolarWebhookPayload {
  type: string
  data: {
    id: string
    status?: string
    metadata?: { documentId?: string }
    total_amount?: number
    product_id?: string
    customer_id?: string
    checkout_id?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('polar-signature')
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET

    // 웹훅 시크릿이 설정된 경우 서명 검증
    if (webhookSecret) {
      if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
        console.error('Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event: PolarWebhookPayload = JSON.parse(payload)

    console.log('Polar webhook received:', event.type, event.data?.id)

    // checkout.updated 이벤트 처리 (결제 완료)
    if (event.type === 'checkout.updated' && event.data.status === 'succeeded') {
      await handleCheckoutSucceeded(event.data)
    }

    // order.created 이벤트 처리 (주문 생성)
    if (event.type === 'order.created') {
      await handleOrderCreated(event.data)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSucceeded(data: PolarWebhookPayload['data']) {
  const documentId = data.metadata?.documentId
  if (!documentId) {
    console.log('No documentId in checkout metadata')
    return
  }

  // 문서 조회
  const [document] = await db
    .select()
    .from(editorDocumentsV2)
    .where(eq(editorDocumentsV2.id, documentId))
    .limit(1)

  if (!document) {
    console.error('Document not found:', documentId)
    return
  }

  // 이미 결제 완료된 경우 스킵
  if (document.isPaid) {
    console.log('Document already paid:', documentId)
    return
  }

  // 결제 정보 저장
  const [payment] = await db
    .insert(invitationPayments)
    .values({
      userId: document.userId,
      polarCheckoutId: data.id,
      polarOrderId: data.product_id || null,
      amount: data.total_amount || 0,
      status: 'completed',
      completedAt: new Date(),
    })
    .returning()

  // 문서 결제 상태 업데이트
  await db
    .update(editorDocumentsV2)
    .set({
      isPaid: true,
      paymentId: payment.id,
      updatedAt: new Date(),
    })
    .where(eq(editorDocumentsV2.id, documentId))

  console.log('Payment completed for document:', documentId)
}

async function handleOrderCreated(data: PolarWebhookPayload['data']) {
  // order에서 checkout_id로 연결된 문서 찾기
  if (data.checkout_id) {
    // checkout_id로 이미 처리된 결제 찾기
    const [existingPayment] = await db
      .select()
      .from(invitationPayments)
      .where(eq(invitationPayments.polarCheckoutId, data.checkout_id))
      .limit(1)

    if (existingPayment) {
      // order_id 업데이트
      await db
        .update(invitationPayments)
        .set({
          polarOrderId: data.id,
        })
        .where(eq(invitationPayments.id, existingPayment.id))

      console.log('Order ID updated for payment:', existingPayment.id)
    }
  }
}

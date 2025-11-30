import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { updateWeddingPaymentStatus } from '@/lib/actions/wedding-payment'

const POLAR_WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET

// Verify Polar webhook signature
function verifySignature(payload: string, signature: string): boolean {
  if (!POLAR_WEBHOOK_SECRET) {
    console.error('POLAR_WEBHOOK_SECRET not configured')
    return false
  }

  const expectedSignature = crypto
    .createHmac('sha256', POLAR_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-polar-signature') || ''

    // Verify signature
    if (!verifySignature(payload, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(payload)

    console.log('Polar webhook event:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'checkout.completed': {
        const metadata = event.data.metadata
        const paymentId = metadata?.payment_id

        if (!paymentId) {
          console.error('No payment_id in metadata')
          return NextResponse.json(
            { error: 'Missing payment_id' },
            { status: 400 }
          )
        }

        const result = await updateWeddingPaymentStatus(
          paymentId,
          'completed',
          event.data.order_id
        )

        if (!result.success) {
          console.error('Failed to update payment:', result.error)
          return NextResponse.json(
            { error: result.error },
            { status: 500 }
          )
        }

        console.log('Payment completed:', paymentId)
        break
      }

      case 'order.refunded': {
        const metadata = event.data.metadata
        const paymentId = metadata?.payment_id

        if (paymentId) {
          await updateWeddingPaymentStatus(paymentId, 'refunded')
          console.log('Payment refunded:', paymentId)
        }
        break
      }

      default:
        console.log('Unhandled event type:', event.type)
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

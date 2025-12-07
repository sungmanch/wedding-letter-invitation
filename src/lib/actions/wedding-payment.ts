'use server'

import { db } from '@/lib/db'
import { invitations, invitationPayments, type InvitationPayment } from '@/lib/db/invitation-schema'
import { eq, and } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const POLAR_API_URL = 'https://api.polar.sh/v1'
const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN
const POLAR_PRODUCT_ID = '16b0afe4-9a42-4d54-a859-67a63f1fa983'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Price in KRW
const INVITATION_PRICE = 9900

// Create a Polar checkout session
export async function createCheckoutSession(
  invitationId: string
): Promise<{ success: boolean; checkoutUrl?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // Verify ownership and get invitation
    const invitation = await db.query.invitations.findFirst({
      where: and(eq(invitations.id, invitationId), eq(invitations.userId, user.id)),
    })

    if (!invitation) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    if (invitation.isPaid) {
      return { success: false, error: '이미 결제가 완료된 청첩장입니다' }
    }

    // Create payment record
    const [payment] = await db
      .insert(invitationPayments)
      .values({
        userId: user.id,
        amount: INVITATION_PRICE,
        status: 'pending',
      })
      .returning()

    // Link payment to invitation
    await db
      .update(invitations)
      .set({ paymentId: payment.id })
      .where(eq(invitations.id, invitationId))

    // Create Polar checkout session
    const checkoutResponse = await fetch(`${POLAR_API_URL}/checkouts/custom`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: POLAR_PRODUCT_ID,
        success_url: `${APP_URL}/${invitationId}?success=true`,
        cancel_url: `${APP_URL}/${invitationId}/preview`,
        metadata: {
          invitation_id: invitationId,
          payment_id: payment.id,
          user_id: user.id,
        },
        customer_email: user.email,
      }),
    })

    if (!checkoutResponse.ok) {
      const errorData = await checkoutResponse.text()
      console.error('Polar checkout error:', errorData)
      throw new Error('Failed to create checkout session')
    }

    const checkoutData = await checkoutResponse.json()

    // Update payment with checkout ID
    await db
      .update(invitationPayments)
      .set({ polarCheckoutId: checkoutData.id })
      .where(eq(invitationPayments.id, payment.id))

    return {
      success: true,
      checkoutUrl: checkoutData.url,
    }
  } catch (error) {
    console.error('Failed to create checkout session:', error)
    return { success: false, error: '결제 세션 생성에 실패했습니다' }
  }
}

// Update payment status (called by webhook)
export async function updateWeddingPaymentStatus(
  paymentId: string,
  status: 'completed' | 'failed' | 'refunded',
  polarOrderId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const payment = await db.query.invitationPayments.findFirst({
      where: eq(invitationPayments.id, paymentId),
    })

    if (!payment) {
      return { success: false, error: '결제 정보를 찾을 수 없습니다' }
    }

    // Update payment
    await db
      .update(invitationPayments)
      .set({
        status,
        polarOrderId: polarOrderId || payment.polarOrderId,
        completedAt: status === 'completed' ? new Date() : null,
      })
      .where(eq(invitationPayments.id, paymentId))

    // If completed, update invitation (find by paymentId)
    if (status === 'completed') {
      const invitation = await db.query.invitations.findFirst({
        where: eq(invitations.paymentId, paymentId),
      })

      if (invitation) {
        await db
          .update(invitations)
          .set({
            isPaid: true,
            status: 'published',
            updatedAt: new Date(),
          })
          .where(eq(invitations.id, invitation.id))

        revalidatePath(`/${invitation.id}`)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to update payment status:', error)
    return { success: false, error: '결제 상태 업데이트에 실패했습니다' }
  }
}

// Get payment for invitation
export async function getWeddingPayment(
  invitationId: string
): Promise<{ success: boolean; data?: InvitationPayment | null; error?: string }> {
  try {
    // Find invitation first, then get linked payment
    const invitation = await db.query.invitations.findFirst({
      where: eq(invitations.id, invitationId),
      with: { payment: true },
    })

    return { success: true, data: invitation?.payment ?? null }
  } catch (error) {
    console.error('Failed to get payment:', error)
    return { success: false, error: '결제 정보 조회에 실패했습니다' }
  }
}

// Manual publish (for testing/admin)
export async function publishInvitation(
  invitationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // Verify ownership
    const invitation = await db.query.invitations.findFirst({
      where: and(eq(invitations.id, invitationId), eq(invitations.userId, user.id)),
    })

    if (!invitation) {
      return { success: false, error: '청첩장을 찾을 수 없습니다' }
    }

    await db
      .update(invitations)
      .set({
        isPaid: true,
        status: 'published',
        updatedAt: new Date(),
      })
      .where(eq(invitations.id, invitationId))

    revalidatePath(`/${invitationId}`)

    return { success: true }
  } catch (error) {
    console.error('Failed to publish invitation:', error)
    return { success: false, error: '청첩장 발행에 실패했습니다' }
  }
}

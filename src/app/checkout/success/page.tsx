import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { invitations, invitationPayments } from '@/lib/db/invitation-schema'
import { superEditorInvitations } from '@/lib/db/super-editor-schema'
import { eq } from 'drizzle-orm'

const POLAR_API_URL = 'https://api.polar.sh/v1'
const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ checkout_id?: string }>
}

// Verify checkout status with Polar API
async function verifyCheckout(checkoutId: string): Promise<boolean> {
  try {
    const response = await fetch(`${POLAR_API_URL}/checkouts/${checkoutId}`, {
      headers: {
        Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
      },
    })

    if (!response.ok) {
      console.error('Failed to verify checkout:', response.status)
      return false
    }

    const checkout = await response.json()
    return checkout.status === 'succeeded'
  } catch (error) {
    console.error('Error verifying checkout:', error)
    return false
  }
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const { checkout_id } = await searchParams

  if (!checkout_id) {
    redirect('/')
  }

  // Verify payment with Polar
  const isPaymentSuccessful = await verifyCheckout(checkout_id)

  // Find payment by polar checkout ID
  const payment = await db.query.invitationPayments.findFirst({
    where: eq(invitationPayments.polarCheckoutId, checkout_id),
  })

  if (!payment) {
    redirect('/')
  }

  // Update payment status if successful
  if (isPaymentSuccessful && payment.status !== 'completed') {
    await db
      .update(invitationPayments)
      .set({
        status: 'completed',
        completedAt: new Date(),
      })
      .where(eq(invitationPayments.id, payment.id))
  }

  // Find and update invitation
  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.paymentId, payment.id),
  })

  if (invitation) {
    if (isPaymentSuccessful && !invitation.isPaid) {
      await db
        .update(invitations)
        .set({
          isPaid: true,
          status: 'published',
          updatedAt: new Date(),
        })
        .where(eq(invitations.id, invitation.id))
    }
    redirect(`/${invitation.id}?success=true`)
  }

  // Try super editor invitations
  const seInvitation = await db.query.superEditorInvitations.findFirst({
    where: eq(superEditorInvitations.paymentId, payment.id),
  })

  if (seInvitation) {
    if (isPaymentSuccessful && !seInvitation.isPaid) {
      await db
        .update(superEditorInvitations)
        .set({
          isPaid: true,
          status: 'published',
          updatedAt: new Date(),
        })
        .where(eq(superEditorInvitations.id, seInvitation.id))
    }
    redirect(`/se/${seInvitation.id}?success=true`)
  }

  redirect('/')
}

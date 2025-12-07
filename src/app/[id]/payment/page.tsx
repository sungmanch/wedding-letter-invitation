import { redirect } from 'next/navigation'

interface PaymentPageProps {
  params: Promise<{ id: string }>
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { id } = await params
  // Redirect to unified paywall page with type=1 (invitation)
  redirect(`/paywall?type=1&id=${id}`)
}

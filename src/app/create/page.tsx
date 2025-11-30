import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CreateInvitationFlow } from './CreateInvitationFlow'

export const metadata = {
  title: '청첩장 만들기 - 모바일 청첩장',
  description: 'AI와 대화하며 나만의 특별한 청첩장을 만들어보세요',
}

export default async function CreateInvitationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login?redirect=/wedding/create')
  }

  return <CreateInvitationFlow />
}

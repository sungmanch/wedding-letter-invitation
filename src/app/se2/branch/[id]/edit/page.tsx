import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBranch } from '@/lib/super-editor-v2/actions/branch'
import { BranchEditClient } from './BranchEditClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function BranchEditPage({ params }: PageProps) {
  const { id } = await params

  // 인증 확인
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/se2/branch/${id}/edit`)
  }

  // 브랜치 조회 (data 포함)
  const branch = await getBranch(id)

  if (!branch) {
    notFound()
  }

  return <BranchEditClient branch={branch} />
}

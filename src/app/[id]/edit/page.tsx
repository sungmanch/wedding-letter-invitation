import { redirect } from 'next/navigation'

export const metadata = {
  title: '청첩장 편집 - Maison de Letter',
  description: '청첩장 정보를 편집합니다',
}

interface PageProps {
  params: Promise<{ id: string }>
}

/**
 * Legacy edit route - redirects to SE editor
 * 기존 /{id}/edit URL 호환성을 위해 유지
 */
export default async function EditPage({ params }: PageProps) {
  const { id } = await params

  // SE 에디터로 리다이렉트
  redirect(`/se/${id}/edit`)
}

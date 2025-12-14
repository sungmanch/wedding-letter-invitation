import { notFound } from 'next/navigation'
import { getDocument } from '@/lib/super-editor-v2/actions/document'
import { PreviewClient } from './PreviewClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SE2PreviewPage({ params }: PageProps) {
  const { id } = await params

  // 로그인된 소유자만 접근 가능
  const document = await getDocument(id)

  if (!document) {
    notFound()
  }

  return <PreviewClient document={document} />
}

import { notFound } from 'next/navigation'
import { getDocument } from '@/lib/super-editor-v2/actions/document'
import { EditClient } from './EditClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SE2EditPage({ params }: PageProps) {
  const { id } = await params

  const document = await getDocument(id)

  if (!document) {
    notFound()
  }

  return <EditClient document={document} />
}

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPublishedDocument } from '@/lib/super-editor-v2/actions/document'
import { GuestViewClient } from './GuestViewClient'
import { getFontLinkHrefs } from '@/lib/super-editor-v2/fonts'
import type { StyleSystem } from '@/lib/super-editor-v2/schema/types'

interface PageProps {
  params: Promise<{ id: string }>
}

// 동적 OG 메타데이터
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const document = await getPublishedDocument(id)

  if (!document) {
    return {
      title: '청첩장을 찾을 수 없습니다',
    }
  }

  const data = document.data as { groom?: { name?: string }; bride?: { name?: string } }
  const groomName = data?.groom?.name || '신랑'
  const brideName = data?.bride?.name || '신부'
  const defaultTitle = `${groomName} ♥ ${brideName} 결혼합니다`

  return {
    title: document.ogTitle || defaultTitle,
    description: document.ogDescription || '저희 두 사람의 결혼식에 소중한 분들을 초대합니다.',
    openGraph: {
      title: document.ogTitle || defaultTitle,
      description: document.ogDescription || '저희 두 사람의 결혼식에 소중한 분들을 초대합니다.',
      images: document.ogImageUrl ? [{ url: document.ogImageUrl }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: document.ogTitle || defaultTitle,
      description: document.ogDescription || '저희 두 사람의 결혼식에 소중한 분들을 초대합니다.',
      images: document.ogImageUrl ? [document.ogImageUrl] : [],
    },
  }
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params
  const document = await getPublishedDocument(id)

  if (!document) {
    notFound()
  }

  // SSR: 폰트 link 태그 미리 로드
  const style = document.style as StyleSystem | undefined
  const fontHrefs = style ? getFontLinkHrefs(style) : []

  return (
    <>
      {/* SSR 폰트 preload */}
      {fontHrefs.length > 0 && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          {fontHrefs.map((href, i) => (
            <link key={i} href={href} rel="stylesheet" />
          ))}
        </>
      )}
      <GuestViewClient document={document} />
    </>
  )
}

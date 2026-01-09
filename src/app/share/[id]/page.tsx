import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPublishedDocument } from '@/lib/super-editor-v2/actions/document'
import { getPublishedBranch } from '@/lib/super-editor-v2/actions/branch'
import { GuestViewClient } from './GuestViewClient'
import { getFontLinkHrefs } from '@/lib/super-editor-v2/fonts'
import type { StyleSystem, WeddingData } from '@/lib/super-editor-v2/schema/types'
import type { EditorDocumentV2 } from '@/lib/super-editor-v2/schema/db-schema'

interface PageProps {
  params: Promise<{ id: string }>
}

/**
 * 문서 또는 브랜치 조회
 * 같은 URL(/share/[id])로 document와 branch 모두 접근 가능
 */
async function getDocumentOrBranch(id: string): Promise<EditorDocumentV2 | null> {
  // 1. 먼저 document로 조회
  const document = await getPublishedDocument(id)
  if (document) {
    return document
  }

  // 2. document가 없으면 branch로 조회
  const branch = await getPublishedBranch(id)
  if (branch) {
    // branch를 EditorDocumentV2 형태로 변환 (data는 parent에서 상속)
    // 타입 단언을 통해 EditorDocumentV2로 변환
    return {
      id: branch.id,
      userId: branch.userId,
      title: branch.title,
      blocks: branch.blocks,
      style: branch.style,
      animation: branch.animation,
      data: branch.data, // parent의 data (WeddingData)
      buildResult: branch.buildResult,
      publishedUrl: branch.publishedUrl,
      ogTitle: branch.ogTitle,
      ogDescription: branch.ogDescription,
      ogImageUrl: branch.ogImageUrl,
      status: branch.status,
      errorMessage: branch.errorMessage,
      isPaid: branch.isPaid,
      paymentId: branch.paymentId,
      slug: branch.slug,
      isPublic: branch.isPublic,
      password: branch.password,
      viewCount: branch.viewCount,
      documentVersion: branch.documentVersion,
      createdAt: branch.createdAt,
      updatedAt: branch.updatedAt,
      publishedAt: branch.publishedAt,
    } as unknown as EditorDocumentV2
  }

  return null
}

// 동적 OG 메타데이터
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const document = await getDocumentOrBranch(id)

  if (!document) {
    return {
      title: '청첩장을 찾을 수 없습니다',
    }
  }

  const data = document.data as WeddingData
  const groomName = data?.couple?.groom?.name || data?.groom?.name || '신랑'
  const brideName = data?.couple?.bride?.name || data?.bride?.name || '신부'
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
  const document = await getDocumentOrBranch(id)

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

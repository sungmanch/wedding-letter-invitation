'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Eye } from 'lucide-react'
import { Button } from '@/components/ui'
import { PhotoUploader } from '@/components/invitation'
import { uploadPhotos, deletePhoto, reorderPhotos } from '@/lib/actions/photo'
import type { InvitationPhoto, InvitationDesign } from '@/lib/db/invitation-schema'
import type { ScreenStructure } from '@/lib/actions/ai-design'

interface PhotoUploadClientProps {
  invitationId: string
  initialPhotos: InvitationPhoto[]
  design?: InvitationDesign | null
}

// ScreenStructure 여부 확인
function isScreenStructure(data: unknown): data is ScreenStructure {
  return (
    typeof data === 'object' &&
    data !== null &&
    'sections' in data &&
    'theme' in data &&
    typeof (data as ScreenStructure).theme === 'object'
  )
}

export function PhotoUploadClient({
  invitationId,
  initialPhotos,
  design,
}: PhotoUploadClientProps) {
  // 디자인 데이터 추출 (새/구 형식 모두 지원)
  const designData = design?.designData
  const isNewFormat = isScreenStructure(designData)

  const primaryColor = isNewFormat
    ? (designData as ScreenStructure).theme.colors.primary
    : (designData as { colors?: { primary?: string } })?.colors?.primary ?? '#D4768A'

  const themeName = isNewFormat
    ? (designData as ScreenStructure).theme.name
    : (designData as { theme?: string })?.theme ?? '기본 디자인'

  const styleDescription = isNewFormat
    ? `${(designData as ScreenStructure).theme.name} 스타일`
    : (designData as { styleDescription?: string })?.styleDescription ?? ''
  const router = useRouter()
  const [photos, setPhotos] = React.useState<InvitationPhoto[]>(initialPhotos)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleUpload = async (files: File[]) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      files.forEach((file) => formData.append('files', file))

      const result = await uploadPhotos(invitationId, formData)

      if (result.success && result.data) {
        setPhotos((prev) => [...prev, ...result.data!])
      } else {
        console.error('Upload failed:', result.error)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (photoId: string) => {
    try {
      const result = await deletePhoto(invitationId, photoId)

      if (result.success) {
        setPhotos((prev) => prev.filter((p) => p.id !== photoId))
      } else {
        console.error('Delete failed:', result.error)
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleReorder = async (photoIds: string[]) => {
    try {
      const result = await reorderPhotos(invitationId, photoIds)

      if (result.success) {
        // Update local state with new order
        const reordered = photoIds
          .map((id, index) => {
            const photo = photos.find((p) => p.id === id)
            return photo ? { ...photo, displayOrder: index } : null
          })
          .filter((p): p is InvitationPhoto => p !== null)

        setPhotos(reordered)
      } else {
        console.error('Reorder failed:', result.error)
      }
    } catch (error) {
      console.error('Reorder error:', error)
    }
  }

  const handleContinue = () => {
    router.push(`/${invitationId}/preview`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white lg:max-w-2xl lg:mx-auto lg:shadow-xl">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-charcoal" />
            </button>
            <span className="ml-2 font-medium text-charcoal">사진 업로드</span>
          </div>
          <Link
            href={`/${invitationId}/preview`}
            className="flex items-center gap-1 text-sm text-[#D4768A] font-medium"
          >
            <Eye className="h-4 w-4" />
            미리보기
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        {/* Design Info */}
        {design && (
          <div
            className="mb-6 p-4 rounded-2xl"
            style={{ backgroundColor: `${primaryColor}10` }}
          >
            <p className="text-sm font-medium text-charcoal">
              선택된 디자인: {themeName}
            </p>
            {styleDescription && (
              <p className="text-xs text-gray-500 mt-1">
                {styleDescription}
              </p>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-charcoal mb-2">
            커플 사진을 추가해주세요 📸
          </h2>
          <p className="text-sm text-gray-500">
            최대 10장까지 업로드할 수 있어요.
            <br />
            드래그해서 순서를 변경할 수 있습니다.
          </p>
        </div>

        {/* Photo Uploader */}
        <PhotoUploader
          photos={photos}
          onUpload={handleUpload}
          onDelete={handleDelete}
          onReorder={handleReorder}
          maxPhotos={10}
        />
      </main>

      {/* Footer Actions */}
      <div className="sticky bottom-0 border-t border-gray-100 bg-white p-4">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push(`/${invitationId}/preview`)}
          >
            건너뛰기
          </Button>
          <Button
            className="flex-1 bg-[#D4768A] hover:bg-[#c4657a] text-white"
            onClick={handleContinue}
            disabled={isLoading}
          >
            미리보기
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

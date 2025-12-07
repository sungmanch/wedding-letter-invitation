'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { uploadOgImage, updateOgMetadata, getOgMetadata } from '../actions'
import { cn } from '@/lib/utils'

interface OgMetadataEditorProps {
  invitationId: string
  defaultTitle: string
  defaultDescription: string
  previewRef?: React.RefObject<HTMLDivElement | null>
  className?: string
  onChange?: (values: { title: string; description: string; imageUrl: string }) => void
}

export function OgMetadataEditor({
  invitationId,
  defaultTitle,
  defaultDescription,
  previewRef,
  className,
  onChange,
}: OgMetadataEditorProps) {
  const [ogTitle, setOgTitle] = useState(defaultTitle)
  const [ogDescription, setOgDescription] = useState(defaultDescription)
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(null) // 서버에 저장된 URL
  const [localImageData, setLocalImageData] = useState<string | null>(null) // 로컬 미리보기용 base64
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // OG 데이터 로드
  useEffect(() => {
    async function loadOgData() {
      const data = await getOgMetadata(invitationId)
      if (data) {
        if (data.ogTitle) setOgTitle(data.ogTitle)
        if (data.ogDescription) setOgDescription(data.ogDescription)
        if (data.ogImageUrl) setOgImageUrl(data.ogImageUrl)
      }
    }
    loadOgData()
  }, [invitationId])

  // 값 변경 시 부모에게 알림 (로컬 이미지 우선)
  useEffect(() => {
    onChange?.({
      title: ogTitle,
      description: ogDescription,
      imageUrl: localImageData || ogImageUrl || '',
    })
  }, [ogTitle, ogDescription, ogImageUrl, localImageData, onChange])

  // OG 이미지 생성 (로컬 미리보기용, 서버 업로드는 저장 시)
  const handleGenerateImage = useCallback(async () => {
    if (!previewRef?.current) {
      setMessage({ type: 'error', text: '미리보기를 찾을 수 없습니다. 잠시 후 다시 시도해주세요.' })
      return
    }

    setIsGenerating(true)
    setMessage(null)

    try {
      const targetElement = previewRef.current

      // 1. 원본 크기로 캡처 (scale: 2로 고해상도)
      const originalCanvas = await html2canvas(targetElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      // 2. 1200x630으로 리사이즈 (OG 이미지 표준 크기)
      const OG_WIDTH = 1200
      const OG_HEIGHT = 630

      const resizedCanvas = document.createElement('canvas')
      resizedCanvas.width = OG_WIDTH
      resizedCanvas.height = OG_HEIGHT
      const ctx = resizedCanvas.getContext('2d')

      if (!ctx) {
        throw new Error('Canvas context not available')
      }

      // 원본 이미지를 OG 비율에 맞게 크롭하면서 리사이즈
      const srcRatio = originalCanvas.width / originalCanvas.height
      const dstRatio = OG_WIDTH / OG_HEIGHT

      let srcX = 0, srcY = 0, srcW = originalCanvas.width, srcH = originalCanvas.height

      if (srcRatio > dstRatio) {
        // 원본이 더 넓음 - 좌우 크롭
        srcW = originalCanvas.height * dstRatio
        srcX = (originalCanvas.width - srcW) / 2
      } else {
        // 원본이 더 높음 - 상단 기준으로 하단 크롭
        srcH = originalCanvas.width / dstRatio
        srcY = 0 // 상단 기준
      }

      ctx.drawImage(
        originalCanvas,
        srcX, srcY, srcW, srcH,
        0, 0, OG_WIDTH, OG_HEIGHT
      )

      // 3. Canvas를 JPG base64로 변환 (로컬 저장)
      const imageData = resizedCanvas.toDataURL('image/jpeg', 0.92)
      setLocalImageData(imageData)
      setHasUnsavedChanges(true)
      setMessage({ type: 'success', text: '이미지가 생성되었습니다. 저장 버튼을 눌러 반영하세요.' })
    } catch (error) {
      console.error('Failed to generate OG image:', error)
      setMessage({ type: 'error', text: '이미지 생성 중 오류가 발생했습니다' })
    } finally {
      setIsGenerating(false)
    }
  }, [previewRef])

  // OG 메타데이터 및 이미지 저장
  const handleSave = useCallback(async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      // 1. 로컬 이미지가 있으면 먼저 업로드
      if (localImageData) {
        const imageResult = await uploadOgImage(invitationId, localImageData)
        if (imageResult.success && imageResult.url) {
          setOgImageUrl(imageResult.url)
          setLocalImageData(null) // 업로드 완료 후 로컬 데이터 클리어
        } else {
          setMessage({ type: 'error', text: imageResult.error || '이미지 저장에 실패했습니다' })
          return
        }
      }

      // 2. 메타데이터 저장
      const result = await updateOgMetadata(invitationId, {
        ogTitle,
        ogDescription,
      })

      if (result.success) {
        setHasUnsavedChanges(false)
        setMessage({ type: 'success', text: '저장되었습니다' })
      } else {
        setMessage({ type: 'error', text: result.error || '저장에 실패했습니다' })
      }
    } catch (error) {
      console.error('Failed to save OG data:', error)
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다' })
    } finally {
      setIsSaving(false)
    }
  }, [invitationId, ogTitle, ogDescription, localImageData])

  return (
    <div className={cn('p-4 space-y-6', className)}>
      {/* 설명 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-1">공유 미리보기 설정</h3>
        <p className="text-xs text-blue-700">
          카카오톡이나 문자로 청첩장을 공유할 때 표시되는 제목, 설명, 이미지를 설정합니다.
        </p>
      </div>

      {/* OG 이미지 프리뷰 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">공유 이미지</label>
          {localImageData && (
            <span className="text-xs text-amber-600 font-medium">저장되지 않음</span>
          )}
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 relative">
          {(localImageData || ogImageUrl) ? (
            <img
              src={localImageData || ogImageUrl || ''}
              alt="OG Preview"
              className="w-full aspect-[1200/630] object-cover"
            />
          ) : (
            <div className="w-full aspect-[1200/630] flex items-center justify-center text-gray-400 text-sm">
              이미지가 없습니다
            </div>
          )}
        </div>
        <button
          onClick={handleGenerateImage}
          disabled={isGenerating}
          className="w-full px-4 py-2.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          {isGenerating ? '생성 중...' : '인트로에서 이미지 생성'}
        </button>
        <p className="text-xs text-gray-500">
          현재 청첩장의 인트로 화면을 1200x630 크기의 공유용 이미지로 생성합니다.
        </p>
      </div>

      {/* OG Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">공유 제목</label>
        <input
          type="text"
          value={ogTitle}
          onChange={(e) => {
            setOgTitle(e.target.value)
            setHasUnsavedChanges(true)
          }}
          placeholder="예: 홍길동 ♥ 김영희 결혼합니다"
          maxLength={100}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500">{ogTitle.length}/100자</p>
      </div>

      {/* OG Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">공유 설명</label>
        <textarea
          value={ogDescription}
          onChange={(e) => {
            setOgDescription(e.target.value)
            setHasUnsavedChanges(true)
          }}
          placeholder="예: 2025년 3월 15일 토요일 오후 2시, 그랜드볼룸에서 축하해주세요"
          maxLength={200}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500">{ogDescription.length}/200자</p>
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={cn(
          "w-full px-4 py-2.5 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors",
          hasUnsavedChanges
            ? "bg-rose-600 hover:bg-rose-700"
            : "bg-gray-900 hover:bg-gray-800"
        )}
      >
        {isSaving ? '저장 중...' : hasUnsavedChanges ? '변경사항 저장' : '저장'}
      </button>

      {/* 메시지 */}
      {message && (
        <div
          className={cn(
            'p-3 rounded-lg text-sm',
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          )}
        >
          {message.text}
        </div>
      )}
    </div>
  )
}

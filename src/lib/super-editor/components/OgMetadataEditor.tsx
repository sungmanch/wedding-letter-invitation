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
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
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

  // 값 변경 시 부모에게 알림
  useEffect(() => {
    onChange?.({
      title: ogTitle,
      description: ogDescription,
      imageUrl: ogImageUrl || '',
    })
  }, [ogTitle, ogDescription, ogImageUrl, onChange])

  // OG 이미지 생성
  const handleGenerateImage = useCallback(async () => {
    if (!previewRef?.current) {
      setMessage({ type: 'error', text: '미리보기를 찾을 수 없습니다' })
      return
    }

    setIsGenerating(true)
    setMessage(null)

    try {
      // 인트로 섹션을 캡처 (첫 번째 화면)
      const previewElement = previewRef.current
      const introSection = previewElement.querySelector('[data-section="intro"]') as HTMLElement
      const targetElement = introSection || previewElement

      // html2canvas로 캡처 (1200x630 OG 이미지 사이즈)
      const canvas = await html2canvas(targetElement, {
        width: 1200,
        height: 630,
        scale: 2, // 고해상도
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        // 요소를 1200x630 비율로 맞추기 위한 설정
        onclone: (clonedDoc, element) => {
          element.style.width = '1200px'
          element.style.height = '630px'
          element.style.overflow = 'hidden'
        },
      })

      // Canvas를 JPG base64로 변환
      const imageData = canvas.toDataURL('image/jpeg', 0.9)

      // 서버에 업로드
      const result = await uploadOgImage(invitationId, imageData)

      if (result.success && result.url) {
        setOgImageUrl(result.url)
        setMessage({ type: 'success', text: 'OG 이미지가 생성되었습니다' })
      } else {
        setMessage({ type: 'error', text: result.error || '이미지 생성에 실패했습니다' })
      }
    } catch (error) {
      console.error('Failed to generate OG image:', error)
      setMessage({ type: 'error', text: '이미지 생성 중 오류가 발생했습니다' })
    } finally {
      setIsGenerating(false)
    }
  }, [invitationId, previewRef])

  // OG 메타데이터 저장
  const handleSaveMetadata = useCallback(async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const result = await updateOgMetadata(invitationId, {
        ogTitle,
        ogDescription,
      })

      if (result.success) {
        setMessage({ type: 'success', text: '저장되었습니다' })
      } else {
        setMessage({ type: 'error', text: result.error || '저장에 실패했습니다' })
      }
    } catch (error) {
      console.error('Failed to save OG metadata:', error)
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다' })
    } finally {
      setIsSaving(false)
    }
  }, [invitationId, ogTitle, ogDescription])

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
        <label className="block text-sm font-medium text-gray-700">공유 이미지</label>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          {ogImageUrl ? (
            <img
              src={ogImageUrl}
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
          onChange={(e) => setOgTitle(e.target.value)}
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
          onChange={(e) => setOgDescription(e.target.value)}
          placeholder="예: 2025년 3월 15일 토요일 오후 2시, 그랜드볼룸에서 축하해주세요"
          maxLength={200}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500">{ogDescription.length}/200자</p>
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSaveMetadata}
        disabled={isSaving}
        className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
      >
        {isSaving ? '저장 중...' : '제목/설명 저장'}
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

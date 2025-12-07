'use client'

import { useState, useCallback, useRef, useEffect, ChangeEvent } from 'react'
import { uploadOgImage, updateOgMetadata, getOgMetadata } from '../actions'
import { cn } from '@/lib/utils'

interface OgMetadataEditorProps {
  invitationId: string
  defaultTitle: string
  defaultDescription: string
  mainImageUrl?: string
  groomName?: string
  brideName?: string
  className?: string
  onChange?: (values: { title: string; description: string; imageUrl: string }) => void
}

const OG_WIDTH = 1200
const OG_HEIGHT = 630

export function OgMetadataEditor({
  invitationId,
  defaultTitle,
  defaultDescription,
  mainImageUrl,
  groomName = '신랑',
  brideName = '신부',
  className,
  onChange,
}: OgMetadataEditorProps) {
  const [ogTitle, setOgTitle] = useState(defaultTitle)
  const [ogDescription, setOgDescription] = useState(defaultDescription)
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(null)
  const [localImageData, setLocalImageData] = useState<string | null>(null)
  const [defaultImageData, setDefaultImageData] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 메인 이미지에서 기본 OG 이미지 생성 (30% 오버레이 + 텍스트)
  const generateDefaultImage = useCallback(async () => {
    if (!mainImageUrl) return null

    return new Promise<string>((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = OG_WIDTH
        canvas.height = OG_HEIGHT
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        // 1. 이미지를 OG 비율에 맞게 크롭하면서 그리기
        const srcRatio = img.width / img.height
        const dstRatio = OG_WIDTH / OG_HEIGHT

        let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height

        if (srcRatio > dstRatio) {
          srcW = img.height * dstRatio
          srcX = (img.width - srcW) / 2
        } else {
          srcH = img.width / dstRatio
          srcY = 0
        }

        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OG_WIDTH, OG_HEIGHT)

        // 2. 30% 어두운 오버레이
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
        ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT)

        // 3. 텍스트 추가: "신랑 🩷 신부"
        const text = `${groomName} 🩷 ${brideName}`
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 72px "Pretendard", sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // 텍스트 그림자
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        ctx.fillText(text, OG_WIDTH / 2, OG_HEIGHT / 2)

        resolve(canvas.toDataURL('image/jpeg', 0.92))
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = mainImageUrl
    })
  }, [mainImageUrl, groomName, brideName])

  // OG 데이터 로드 및 기본 이미지 생성
  useEffect(() => {
    async function loadOgData() {
      const data = await getOgMetadata(invitationId)
      if (data) {
        if (data.ogTitle) setOgTitle(data.ogTitle)
        if (data.ogDescription) setOgDescription(data.ogDescription)
        if (data.ogImageUrl) setOgImageUrl(data.ogImageUrl)
      }

      // 저장된 OG 이미지가 없으면 기본 이미지 생성
      if (!data?.ogImageUrl && mainImageUrl) {
        try {
          const defaultImg = await generateDefaultImage()
          if (defaultImg) {
            setDefaultImageData(defaultImg)
          }
        } catch (error) {
          console.error('Failed to generate default OG image:', error)
        }
      }
    }
    loadOgData()
  }, [invitationId, mainImageUrl, generateDefaultImage])

  // 값 변경 시 부모에게 알림
  useEffect(() => {
    onChange?.({
      title: ogTitle,
      description: ogDescription,
      imageUrl: localImageData || ogImageUrl || defaultImageData || mainImageUrl || '',
    })
  }, [ogTitle, ogDescription, ogImageUrl, localImageData, defaultImageData, mainImageUrl, onChange])

  // 기본 이미지 생성 버튼 핸들러
  const handleGenerateDefault = useCallback(async () => {
    if (!mainImageUrl) {
      setMessage({ type: 'error', text: '메인 이미지가 없습니다.' })
      return
    }

    setIsGenerating(true)
    setMessage(null)

    try {
      const imageData = await generateDefaultImage()
      if (imageData) {
        setLocalImageData(imageData)
        setHasUnsavedChanges(true)
        setMessage({ type: 'success', text: '이미지가 생성되었습니다. 저장 버튼을 눌러 반영하세요.' })
      }
    } catch (error) {
      console.error('Failed to generate OG image:', error)
      setMessage({ type: 'error', text: '이미지 생성 중 오류가 발생했습니다' })
    } finally {
      setIsGenerating(false)
    }
  }, [mainImageUrl, generateDefaultImage])

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: '이미지 크기는 5MB 이하여야 합니다.' })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        // 1200x630으로 리사이즈
        const canvas = document.createElement('canvas')
        canvas.width = OG_WIDTH
        canvas.height = OG_HEIGHT
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          setMessage({ type: 'error', text: '이미지 처리 중 오류가 발생했습니다.' })
          return
        }

        const srcRatio = img.width / img.height
        const dstRatio = OG_WIDTH / OG_HEIGHT

        let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height

        if (srcRatio > dstRatio) {
          srcW = img.height * dstRatio
          srcX = (img.width - srcW) / 2
        } else {
          srcH = img.width / dstRatio
          srcY = 0
        }

        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OG_WIDTH, OG_HEIGHT)

        const imageData = canvas.toDataURL('image/jpeg', 0.92)
        setLocalImageData(imageData)
        setHasUnsavedChanges(true)
        setMessage({ type: 'success', text: '이미지가 선택되었습니다. 저장 버튼을 눌러 반영하세요.' })
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)

    // input 초기화 (같은 파일 재선택 가능하게)
    e.target.value = ''
  }, [])

  // OG 메타데이터 및 이미지 저장
  const handleSave = useCallback(async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      // 로컬 이미지가 있으면 업로드
      const imageToUpload = localImageData || (!ogImageUrl && defaultImageData)
      if (imageToUpload) {
        const imageResult = await uploadOgImage(invitationId, imageToUpload)
        if (imageResult.success && imageResult.url) {
          setOgImageUrl(imageResult.url)
          setLocalImageData(null)
          setDefaultImageData(null)
        } else {
          setMessage({ type: 'error', text: imageResult.error || '이미지 저장에 실패했습니다' })
          return
        }
      }

      // 메타데이터 저장
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
  }, [invitationId, ogTitle, ogDescription, localImageData, ogImageUrl, defaultImageData])

  // 현재 표시할 이미지
  const displayImageUrl = localImageData || ogImageUrl || defaultImageData

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
          {(localImageData || (!ogImageUrl && defaultImageData)) && (
            <span className="text-xs text-amber-600 font-medium">저장되지 않음</span>
          )}
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 relative">
          {displayImageUrl ? (
            <img
              src={displayImageUrl}
              alt="OG Preview"
              className="w-full aspect-[1200/630] object-cover"
            />
          ) : (
            <div className="w-full aspect-[1200/630] flex items-center justify-center text-gray-400 text-sm">
              메인 이미지가 없습니다
            </div>
          )}
        </div>

        {/* 이미지 버튼들 */}
        <div className="flex gap-2">
          <button
            onClick={handleGenerateDefault}
            disabled={isGenerating || !mainImageUrl}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            {isGenerating ? '생성 중...' : '기본 이미지 생성'}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 text-sm font-medium transition-colors"
          >
            이미지 업로드
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-500">
          기본 이미지: 메인 사진에 어두운 오버레이와 "{groomName} 🩷 {brideName}" 텍스트가 추가됩니다.
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
          hasUnsavedChanges || (!ogImageUrl && defaultImageData)
            ? "bg-rose-600 hover:bg-rose-700"
            : "bg-gray-900 hover:bg-gray-800"
        )}
      >
        {isSaving ? '저장 중...' : (hasUnsavedChanges || (!ogImageUrl && defaultImageData)) ? '변경사항 저장' : '저장'}
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

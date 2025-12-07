'use client'

import { useState, useCallback, useRef, useEffect, ChangeEvent } from 'react'
import { getOgMetadata } from '../actions'
import { cn } from '@/lib/utils'

export interface OgMetadataValues {
  title: string
  description: string
  imageUrl: string
  /** 업로드가 필요한 이미지 데이터 (base64) */
  pendingImageData: string | null
  /** 이미 저장된 OG 이미지 URL */
  savedImageUrl: string | null
}

interface OgMetadataEditorProps {
  invitationId: string
  defaultTitle: string
  defaultDescription: string
  mainImageUrl?: string
  groomName?: string
  brideName?: string
  className?: string
  onChange?: (values: OgMetadataValues) => void
  /** 외부에서 저장 결과 메시지 전달 */
  saveMessage?: { type: 'success' | 'error'; text: string } | null
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
  saveMessage,
}: OgMetadataEditorProps) {
  const [ogTitle, setOgTitle] = useState(defaultTitle)
  const [ogDescription, setOgDescription] = useState(defaultDescription)
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(null)
  const [localImageData, setLocalImageData] = useState<string | null>(null)
  const [defaultImageData, setDefaultImageData] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
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

  // 값 변경 시 부모에게 알림 (저장에 필요한 데이터 포함)
  useEffect(() => {
    const pendingImageData = localImageData || (!ogImageUrl && defaultImageData) || null
    onChange?.({
      title: ogTitle,
      description: ogDescription,
      imageUrl: localImageData || ogImageUrl || defaultImageData || mainImageUrl || '',
      pendingImageData,
      savedImageUrl: ogImageUrl,
    })
  }, [ogTitle, ogDescription, ogImageUrl, localImageData, defaultImageData, mainImageUrl, onChange])

  // 기본 이미지 생성 버튼 핸들러
  const handleGenerateDefault = useCallback(async () => {
    if (!mainImageUrl) return

    setIsGenerating(true)

    try {
      const imageData = await generateDefaultImage()
      if (imageData) {
        setLocalImageData(imageData)
      }
    } catch (error) {
      console.error('Failed to generate OG image:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [mainImageUrl, generateDefaultImage])

  // 이미지 업로드 핸들러
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleImageUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('이미지 크기는 5MB 이하여야 합니다.')
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
          setUploadError('이미지 처리 중 오류가 발생했습니다.')
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
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)

    // input 초기화 (같은 파일 재선택 가능하게)
    e.target.value = ''
  }, [])

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

      {/* 메시지 (업로드 에러 또는 외부 저장 결과) */}
      {uploadError && (
        <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
          {uploadError}
        </div>
      )}
      {saveMessage && (
        <div
          className={cn(
            'p-3 rounded-lg text-sm',
            saveMessage.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          )}
        >
          {saveMessage.text}
        </div>
      )}
    </div>
  )
}

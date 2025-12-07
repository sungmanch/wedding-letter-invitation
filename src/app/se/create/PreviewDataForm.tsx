'use client'

/**
 * 인트로 프리뷰용 데이터 입력 폼
 * 신랑/신부 이름, 예식 날짜, 오버레이 문구를 입력받아 프리뷰에 반영
 */

import { useState, useRef } from 'react'
import { ChevronDown, ChevronUp, Info, ImagePlus, X } from 'lucide-react'

export interface PreviewFormData {
  groomName: string
  brideName: string
  weddingDate: string // YYYY-MM-DD 형식
  weddingTime: string // HH:mm 형식
  overlayText?: string // 일부 템플릿에서만 사용 가능
  mainImage?: string // 배경 이미지 URL 또는 data URL
}

interface PreviewDataFormProps {
  data: PreviewFormData
  onChange: (data: PreviewFormData) => void
  supportsOverlay?: boolean // 오버레이 문구 지원 여부
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'

export function PreviewDataForm({ data, onChange, supportsOverlay = false }: PreviewDataFormProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (field: keyof PreviewFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange({ ...data, [field]: e.target.value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      onChange({ ...data, mainImage: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    onChange({ ...data, mainImage: undefined })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const currentImage = data.mainImage || DEFAULT_IMAGE

  return (
    <div className="bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden">
      {/* Header - Collapsible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors"
      >
        <span className="text-sm font-medium text-[#F5E6D3]">프리뷰 정보 입력</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[#F5E6D3]/50" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#F5E6D3]/50" />
        )}
      </button>

      {/* Form Fields */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* 배경 이미지 */}
          <div>
            <label className="block text-xs font-medium text-[#F5E6D3]/70 mb-2">배경 사진</label>
            <div className="flex items-center gap-3">
              {/* 이미지 미리보기 */}
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/10 shrink-0">
                <img
                  src={currentImage}
                  alt="배경 미리보기"
                  className="w-full h-full object-cover"
                />
                {data.mainImage && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
              {/* 업로드 버튼 */}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="preview-image-upload"
                />
                <label
                  htmlFor="preview-image-upload"
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <ImagePlus className="w-4 h-4 text-[#F5E6D3]/60" />
                  <span className="text-[#F5E6D3]/80">사진 변경</span>
                </label>
                <p className="text-xs text-[#F5E6D3]/40 mt-1">프리뷰 확인용 (저장되지 않음)</p>
              </div>
            </div>
          </div>

          {/* 신랑/신부 이름 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#F5E6D3]/70 mb-1">신랑 이름</label>
              <input
                type="text"
                value={data.groomName}
                onChange={handleChange('groomName')}
                placeholder="김신랑"
                className="w-full px-3 py-2 text-sm bg-white/10 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#F5E6D3]/70 mb-1">신부 이름</label>
              <input
                type="text"
                value={data.brideName}
                onChange={handleChange('brideName')}
                placeholder="이신부"
                className="w-full px-3 py-2 text-sm bg-white/10 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:border-transparent"
              />
            </div>
          </div>

          {/* 예식 날짜/시간 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#F5E6D3]/70 mb-1">예식 날짜</label>
              <input
                type="date"
                value={data.weddingDate}
                onChange={handleChange('weddingDate')}
                className="w-full px-3 py-2 text-sm bg-white/10 text-[#F5E6D3] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:border-transparent [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#F5E6D3]/70 mb-1">예식 시간</label>
              <input
                type="time"
                value={data.weddingTime}
                onChange={handleChange('weddingTime')}
                className="w-full px-3 py-2 text-sm bg-white/10 text-[#F5E6D3] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:border-transparent [color-scheme:dark]"
              />
            </div>
          </div>

          {/* 오버레이 문구 */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="text-xs font-medium text-[#F5E6D3]/70">오버레이 문구</label>
              {!supportsOverlay && (
                <div className="group relative">
                  <Info className="w-3.5 h-3.5 text-[#F5E6D3]/40" />
                  <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block w-48 p-2 bg-[#0A0806] text-[#F5E6D3] text-xs rounded-lg shadow-lg z-10 border border-white/10">
                    현재 선택된 템플릿/스타일은 오버레이 문구를 지원하지 않습니다.
                  </div>
                </div>
              )}
            </div>
            <textarea
              value={data.overlayText || ''}
              onChange={handleChange('overlayText')}
              placeholder={supportsOverlay ? "저희 결혼합니다" : "이 템플릿은 오버레이 문구를 지원하지 않습니다"}
              disabled={!supportsOverlay}
              rows={2}
              className={`w-full px-3 py-2 text-sm bg-white/10 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:border-transparent resize-none ${
                !supportsOverlay ? 'bg-white/5 text-[#F5E6D3]/40 cursor-not-allowed' : ''
              }`}
            />
          </div>

          {/* 안내 메시지 */}
          <p className="text-xs text-[#F5E6D3]/40">
            입력한 정보는 프리뷰에만 반영됩니다. 실제 청첩장은 나중에 편집할 수 있어요.
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * 날짜를 한국어 형식으로 포맷팅 (YYYY-MM-DD → 2025년 3월 15일)
 */
function formatDateKorean(dateStr: string): string {
  if (!dateStr) return '2025년 3월 15일'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

/**
 * 시간을 한국어 형식으로 포맷팅 (HH:mm → 오후 2시 30분)
 */
function formatTimeKorean(timeStr: string): string {
  if (!timeStr) return '오후 2시'
  const [hourStr, minuteStr] = timeStr.split(':')
  const hour = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10)
  if (isNaN(hour)) return timeStr

  const period = hour < 12 ? '오전' : '오후'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const minutePart = minute > 0 ? ` ${minute}분` : ''

  return `${period} ${displayHour}시${minutePart}`
}

const DEFAULT_SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'

/**
 * PreviewFormData를 DEFAULT_USER_DATA 형식으로 변환
 */
export function formDataToUserData(formData: PreviewFormData) {
  const mainImage = formData.mainImage || DEFAULT_SAMPLE_IMAGE

  return {
    version: '1.0' as const,
    meta: {
      id: 'preview',
      templateId: 'default',
      layoutId: 'default',
      styleId: 'default',
      editorId: 'default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    data: {
      couple: {
        groom: { name: formData.groomName || '신랑', englishName: 'Groom' },
        bride: { name: formData.brideName || '신부', englishName: 'Bride' },
      },
      wedding: {
        date: formatDateKorean(formData.weddingDate),
        time: formatTimeKorean(formData.weddingTime),
        venue: {
          name: '더채플앳청담',
          address: '서울특별시 강남구 청담동 123-45',
          hall: '루체홀',
        },
      },
      message: {
        title: formData.overlayText || '저희 결혼합니다',
        content: '서로의 마음을 확인하고\n평생을 함께 하고자 합니다.',
      },
      photos: {
        main: mainImage,
        gallery: [mainImage],
      },
    },
  }
}

/**
 * 기본 폼 데이터
 */
export const DEFAULT_PREVIEW_FORM_DATA: PreviewFormData = {
  groomName: '김신랑',
  brideName: '이신부',
  weddingDate: '2025-03-15', // YYYY-MM-DD
  weddingTime: '14:00', // HH:mm
  overlayText: '',
}

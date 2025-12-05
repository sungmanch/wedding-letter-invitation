'use client'

/**
 * 인트로 프리뷰용 데이터 입력 폼
 * 신랑/신부 이름, 예식 날짜, 오버레이 문구를 입력받아 프리뷰에 반영
 */

import { useState } from 'react'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'

export interface PreviewFormData {
  groomName: string
  brideName: string
  weddingDate: string
  weddingTime: string
  overlayText?: string // 일부 템플릿에서만 사용 가능
}

interface PreviewDataFormProps {
  data: PreviewFormData
  onChange: (data: PreviewFormData) => void
  supportsOverlay?: boolean // 오버레이 문구 지원 여부
}

export function PreviewDataForm({ data, onChange, supportsOverlay = false }: PreviewDataFormProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleChange = (field: keyof PreviewFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange({ ...data, [field]: e.target.value })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header - Collapsible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">프리뷰 정보 입력</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Form Fields */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* 신랑/신부 이름 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">신랑 이름</label>
              <input
                type="text"
                value={data.groomName}
                onChange={handleChange('groomName')}
                placeholder="김신랑"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">신부 이름</label>
              <input
                type="text"
                value={data.brideName}
                onChange={handleChange('brideName')}
                placeholder="이신부"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 예식 날짜/시간 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">예식 날짜</label>
              <input
                type="text"
                value={data.weddingDate}
                onChange={handleChange('weddingDate')}
                placeholder="2025년 3월 15일"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">예식 시간</label>
              <input
                type="text"
                value={data.weddingTime}
                onChange={handleChange('weddingTime')}
                placeholder="오후 2시"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 오버레이 문구 */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="text-xs font-medium text-gray-600">오버레이 문구</label>
              {!supportsOverlay && (
                <div className="group relative">
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                  <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
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
              className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none ${
                !supportsOverlay ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
              }`}
            />
          </div>

          {/* 안내 메시지 */}
          <p className="text-xs text-gray-400">
            입력한 정보는 프리뷰에만 반영됩니다. 실제 청첩장은 나중에 편집할 수 있어요.
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * PreviewFormData를 DEFAULT_USER_DATA 형식으로 변환
 */
export function formDataToUserData(formData: PreviewFormData) {
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
        date: formData.weddingDate || '2025년 3월 15일',
        time: formData.weddingTime || '오후 2시',
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
        main: '/samples/couple-1.jpg',
        gallery: ['/samples/couple-1.jpg', '/samples/couple-2.jpg'],
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
  weddingDate: '2025년 3월 15일',
  weddingTime: '오후 2시',
  overlayText: '',
}

'use client'

import { useRef, useState } from 'react'
import type { ImageField as ImageFieldType } from '../../schema/editor'
import { useSuperEditor } from '../../context'
import { uploadGalleryImages, deleteGalleryImage } from '../../actions'

interface ImageFieldProps {
  field: ImageFieldType
}

export function ImageField({ field }: ImageFieldProps) {
  const { getFieldValue, updateField, invitationId } = useSuperEditor()
  const value = (getFieldValue(field.dataPath) as string) || ''
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // invitationId가 없으면 업로드 불가
    if (!invitationId) {
      alert('청첩장 ID가 없습니다. 페이지를 새로고침해주세요.')
      return
    }

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.')
      return
    }

    setUploading(true)

    try {
      // 파일을 base64로 변환
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => resolve(event.target?.result as string)
        reader.readAsDataURL(file)
      })

      // S3에 업로드
      const result = await uploadGalleryImages(invitationId, [{
        data: dataUrl,
        filename: file.name,
        mimeType: file.type,
      }])

      if (!result.success || !result.urls || result.urls.length === 0) {
        alert(result.errors?.join('\n') || '업로드에 실패했습니다.')
        return
      }

      // 기존 이미지가 있으면 삭제 시도
      if (value && value.includes('supabase')) {
        try {
          await deleteGalleryImage(invitationId, value)
        } catch (error) {
          console.error('Failed to delete old image:', error)
        }
      }

      // 새 URL 저장
      updateField(field.dataPath, result.urls[0])
    } catch (error) {
      console.error('Image upload failed:', error)
      alert('이미지 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    // S3에서 삭제 시도
    if (invitationId && value && value.includes('supabase')) {
      try {
        await deleteGalleryImage(invitationId, value)
      } catch (error) {
        console.error('Failed to delete from storage:', error)
      }
    }

    updateField(field.dataPath, '')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="field-wrapper">
      {field.label && (
        <label className="block text-sm font-medium text-[#F5E6D3]/80 mb-1">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={field.accept?.join(',') || 'image/*'}
        onChange={handleFileChange}
        disabled={field.disabled || uploading}
        className="hidden"
        id={`file-${field.id}`}
      />

      {uploading ? (
        <div
          className={`
            flex flex-col items-center justify-center w-full border-2
            border-dashed border-[#C9A962]/30 rounded-lg bg-white/5
            ${field.aspectRatio === '1:1' ? 'aspect-square' : 'py-12'}
          `}
        >
          <div className="w-8 h-8 border-2 border-[#C9A962]/30 border-t-[#C9A962] rounded-full animate-spin mb-2" />
          <span className="text-sm text-[#F5E6D3]/50">업로드 중...</span>
        </div>
      ) : value ? (
        <div className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="업로드된 이미지"
            className={`
              w-full rounded-lg object-cover
              ${field.aspectRatio === '1:1' ? 'aspect-square' : ''}
              ${field.aspectRatio === '4:3' ? 'aspect-[4/3]' : ''}
              ${field.aspectRatio === '16:9' ? 'aspect-video' : ''}
            `}
          />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <label
              htmlFor={`file-${field.id}`}
              className="px-3 py-1.5 bg-white/10 text-[#F5E6D3] rounded-lg text-sm cursor-pointer hover:bg-white/20"
            >
              변경
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 bg-red-500/80 text-white rounded-lg text-sm hover:bg-red-500"
            >
              삭제
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={`file-${field.id}`}
          className={`
            flex flex-col items-center justify-center w-full border-2
            border-dashed border-white/20 rounded-lg cursor-pointer bg-white/5
            hover:border-[#C9A962]/50 hover:bg-white/10 transition-colors
            ${field.aspectRatio === '1:1' ? 'aspect-square' : 'py-12'}
          `}
        >
          <svg
            className="w-10 h-10 text-[#F5E6D3]/40 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm text-[#F5E6D3]/50">클릭하여 이미지 업로드</span>
          {field.helpText && (
            <span className="text-xs text-[#F5E6D3]/40 mt-1">{field.helpText}</span>
          )}
        </label>
      )}
    </div>
  )
}

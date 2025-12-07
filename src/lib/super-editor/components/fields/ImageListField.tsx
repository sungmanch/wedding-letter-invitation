'use client'

import { useRef, useState } from 'react'
import type { ImageListField as ImageListFieldType } from '../../schema/editor'
import { useSuperEditor } from '../../context'
import { uploadGalleryImages, deleteGalleryImage } from '../../actions'

interface ImageListFieldProps {
  field: ImageListFieldType
}

export function ImageListField({ field }: ImageListFieldProps) {
  const { getFieldValue, updateField, invitationId } = useSuperEditor()
  const images = (getFieldValue(field.dataPath) as string[]) || []
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    // invitationId가 없으면 업로드 불가
    if (!invitationId) {
      alert('청첩장 ID가 없습니다. 페이지를 새로고침해주세요.')
      return
    }

    // 최대 개수 체크
    if (field.maxItems && images.length + files.length > field.maxItems) {
      alert(`최대 ${field.maxItems}개까지 업로드할 수 있습니다.`)
      return
    }

    setUploading(true)

    try {
      // 파일들을 base64로 변환하여 서버에 전송
      const imagesToUpload: Array<{ data: string; filename: string; mimeType: string }> = []

      for (const file of files) {
        // 파일 크기 체크 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name}의 크기가 10MB를 초과합니다.`)
          continue
        }

        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (event) => resolve(event.target?.result as string)
          reader.readAsDataURL(file)
        })

        imagesToUpload.push({
          data: dataUrl,
          filename: file.name,
          mimeType: file.type,
        })
      }

      if (imagesToUpload.length === 0) {
        return
      }

      // S3에 업로드
      const result = await uploadGalleryImages(invitationId, imagesToUpload)

      if (!result.success) {
        alert(result.errors?.join('\n') || '업로드에 실패했습니다.')
        return
      }

      // 성공한 URL들을 userData에 추가
      if (result.urls && result.urls.length > 0) {
        updateField(field.dataPath, [...images, ...result.urls])
      }

      // 부분 실패 시 알림
      if (result.errors && result.errors.length > 0) {
        alert(`일부 이미지 업로드 실패:\n${result.errors.join('\n')}`)
      }
    } catch (error) {
      console.error('Image upload failed:', error)
      alert('이미지 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  const handleRemove = async (index: number) => {
    const imageUrl = images[index]

    // S3에서 삭제 시도 (URL이 S3 URL인 경우)
    if (invitationId && imageUrl.includes('supabase')) {
      try {
        await deleteGalleryImage(invitationId, imageUrl)
      } catch (error) {
        console.error('Failed to delete from storage:', error)
        // 스토리지 삭제 실패해도 UI에서는 제거
      }
    }

    const newImages = images.filter((_, i) => i !== index)
    updateField(field.dataPath, newImages)
  }

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [removed] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, removed)
    updateField(field.dataPath, newImages)
  }

  const canAddMore = !field.maxItems || images.length < field.maxItems

  return (
    <div className="field-wrapper">
      {field.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
          {field.maxItems && (
            <span className="text-gray-400 ml-2">
              ({images.length}/{field.maxItems})
            </span>
          )}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={field.accept?.join(',') || 'image/*'}
        multiple
        onChange={handleFileChange}
        disabled={field.disabled || !canAddMore || uploading}
        className="hidden"
        id={`file-${field.id}`}
      />

      <div className="grid grid-cols-3 gap-2">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative group aspect-square"
            draggable={field.sortable}
            onDragStart={(e) => e.dataTransfer.setData('text/plain', String(index))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
              handleReorder(fromIndex, index)
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`이미지 ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm"
            >
              ×
            </button>
            {field.sortable && (
              <div className="absolute bottom-1 left-1 w-6 h-6 bg-black/50 text-white rounded flex items-center justify-center text-xs cursor-move">
                ⋮⋮
              </div>
            )}
          </div>
        ))}

        {canAddMore && (
          <label
            htmlFor={`file-${field.id}`}
            className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
              uploading
                ? 'border-gray-200 bg-gray-50 cursor-wait'
                : 'border-gray-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50'
            }`}
          >
            {uploading ? (
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            )}
          </label>
        )}
      </div>

      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  )
}

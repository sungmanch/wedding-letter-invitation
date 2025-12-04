'use client'

import { useRef } from 'react'
import type { ImageListField as ImageListFieldType } from '../../schema/editor'
import { useSuperEditor } from '../../context'

interface ImageListFieldProps {
  field: ImageListFieldType
}

export function ImageListField({ field }: ImageListFieldProps) {
  const { getFieldValue, updateField } = useSuperEditor()
  const images = (getFieldValue(field.dataPath) as string[]) || []
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    // 최대 개수 체크
    if (field.maxItems && images.length + files.length > field.maxItems) {
      alert(`최대 ${field.maxItems}개까지 업로드할 수 있습니다.`)
      return
    }

    // TODO: 실제 업로드 로직 구현
    const newImages: string[] = []

    for (const file of files) {
      // 파일 크기 체크
      if (field.maxSize && file.size > field.maxSize) {
        alert(`${file.name}의 크기가 너무 큽니다.`)
        continue
      }

      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => resolve(event.target?.result as string)
        reader.readAsDataURL(file)
      })

      newImages.push(dataUrl)
    }

    updateField(field.dataPath, [...images, ...newImages])

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleRemove = (index: number) => {
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
        disabled={field.disabled || !canAddMore}
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
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-colors flex flex-col items-center justify-center"
          >
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
          </label>
        )}
      </div>

      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  )
}

'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Upload, X, ImageIcon } from 'lucide-react'

interface SimpleImageUploaderProps {
  value: string | null
  onChange: (imageData: { url: string; base64: string } | null) => void
  className?: string
}

export function SimpleImageUploader({
  value,
  onChange,
  className,
}: SimpleImageUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File | null) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return
    }

    setIsLoading(true)

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)

      // Convert to base64
      const base64 = await fileToBase64(file)

      onChange({ url: previewUrl, base64 })
    } catch (error) {
      console.error('Failed to process image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    handleFileSelect(file || null)
  }

  const handleRemove = () => {
    if (value?.startsWith('blob:')) {
      URL.revokeObjectURL(value)
    }
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {value ? (
        // Image Preview
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-3 right-3 px-4 py-2 rounded-full bg-white/90 text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          >
            사진 변경
          </button>
        </div>
      ) : (
        // Upload Zone
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'aspect-[4/3] rounded-2xl border-2 border-dashed cursor-pointer transition-all',
            'flex flex-col items-center justify-center gap-4',
            isDragging
              ? 'border-[#D4768A] bg-pink-50'
              : 'border-gray-300 hover:border-[#D4768A] hover:bg-pink-50/50',
            isLoading && 'pointer-events-none opacity-50'
          )}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#D4768A] border-t-transparent animate-spin" />
              <p className="text-sm text-gray-500">이미지 처리 중...</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                {isDragging ? (
                  <ImageIcon className="w-8 h-8 text-[#D4768A]" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="text-center">
                <p className="text-base font-medium text-gray-700">
                  {isDragging ? '여기에 놓으세요' : '웨딩 사진 업로드'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  클릭하거나 드래그해서 업로드
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// Helper function to convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

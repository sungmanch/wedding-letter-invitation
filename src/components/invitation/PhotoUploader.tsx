'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Upload, X, GripVertical, Loader2 } from 'lucide-react'
import type { InvitationPhoto } from '@/lib/db/invitation-schema'

interface PhotoUploaderProps {
  photos: InvitationPhoto[]
  onUpload: (files: File[]) => Promise<void>
  onDelete: (photoId: string) => Promise<void>
  onReorder: (photoIds: string[]) => Promise<void>
  maxPhotos?: number
  className?: string
}

interface LocalPhoto {
  id: string
  url: string
  displayOrder: number
  isUploading?: boolean
  file?: File
}

export function PhotoUploader({
  photos,
  onUpload,
  onDelete,
  onReorder,
  maxPhotos = 10,
  className,
}: PhotoUploaderProps) {
  const [localPhotos, setLocalPhotos] = React.useState<LocalPhoto[]>([])
  const [isDraggingFile, setIsDraggingFile] = React.useState(false)
  const [draggedPhotoId, setDraggedPhotoId] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Sync local photos with props
  React.useEffect(() => {
    setLocalPhotos(
      photos.map((p) => ({
        id: p.id,
        url: p.url,
        displayOrder: p.displayOrder,
      }))
    )
  }, [photos])

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const remainingSlots = maxPhotos - localPhotos.length
    const filesToUpload = Array.from(files).slice(0, remainingSlots)

    if (filesToUpload.length === 0) return

    // Add temporary local photos with loading state
    const tempPhotos: LocalPhoto[] = filesToUpload.map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      displayOrder: localPhotos.length + index,
      isUploading: true,
      file,
    }))

    setLocalPhotos((prev) => [...prev, ...tempPhotos])

    try {
      await onUpload(filesToUpload)
    } catch {
      // Remove temp photos on error
      setLocalPhotos((prev) =>
        prev.filter((p) => !tempPhotos.some((t) => t.id === p.id))
      )
    }
  }

  const handleDelete = async (photoId: string) => {
    const photo = localPhotos.find((p) => p.id === photoId)
    if (!photo) return

    // Remove from local state immediately
    setLocalPhotos((prev) => prev.filter((p) => p.id !== photoId))

    // Clean up object URL if temp
    if (photo.url.startsWith('blob:')) {
      URL.revokeObjectURL(photo.url)
    }

    // Only call onDelete for persisted photos
    if (!photoId.startsWith('temp-')) {
      try {
        await onDelete(photoId)
      } catch {
        // Restore on error
        setLocalPhotos((prev) => [...prev, photo])
      }
    }
  }

  // File drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingFile(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingFile(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingFile(false)
    handleFileSelect(e.dataTransfer.files)
  }

  // Photo reorder handlers
  const handlePhotoDragStart = (photoId: string) => {
    setDraggedPhotoId(photoId)
  }

  const handlePhotoDragOver = (e: React.DragEvent, targetPhotoId: string) => {
    e.preventDefault()
    if (!draggedPhotoId || draggedPhotoId === targetPhotoId) return

    const draggedIndex = localPhotos.findIndex((p) => p.id === draggedPhotoId)
    const targetIndex = localPhotos.findIndex((p) => p.id === targetPhotoId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newPhotos = [...localPhotos]
    const [removed] = newPhotos.splice(draggedIndex, 1)
    newPhotos.splice(targetIndex, 0, removed)

    setLocalPhotos(newPhotos.map((p, i) => ({ ...p, displayOrder: i })))
  }

  const handlePhotoDragEnd = async () => {
    if (!draggedPhotoId) return

    const newOrder = localPhotos.map((p) => p.id).filter((id) => !id.startsWith('temp-'))
    setDraggedPhotoId(null)

    if (newOrder.length > 0) {
      await onReorder(newOrder)
    }
  }

  const sortedPhotos = [...localPhotos].sort((a, b) => a.displayOrder - b.displayOrder)
  const canAddMore = localPhotos.length < maxPhotos

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Upload Zone */}
      {canAddMore && (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors',
            isDraggingFile
              ? 'border-[#D4768A] bg-[#D4768A]/5'
              : 'border-gray-200 hover:border-gray-300'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/heic,image/heif"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Upload className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal">
                사진을 드래그하거나
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-[#D4768A] hover:underline"
              >
                파일을 선택하세요
              </button>
            </div>
            <p className="text-xs text-gray-400">
              JPG, PNG, HEIC / 최대 10MB / 최대 {maxPhotos}장
            </p>
          </div>
        </div>
      )}

      {/* Photo Count */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {localPhotos.length} / {maxPhotos}장
        </span>
        {localPhotos.length > 0 && (
          <span className="text-xs text-gray-400">
            드래그하여 순서 변경
          </span>
        )}
      </div>

      {/* Photo Grid */}
      {sortedPhotos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {sortedPhotos.map((photo) => (
            <div
              key={photo.id}
              draggable={!photo.isUploading}
              onDragStart={() => handlePhotoDragStart(photo.id)}
              onDragOver={(e) => handlePhotoDragOver(e, photo.id)}
              onDragEnd={handlePhotoDragEnd}
              className={cn(
                'relative aspect-square rounded-xl overflow-hidden group cursor-move',
                draggedPhotoId === photo.id && 'opacity-50'
              )}
            >
              <Image
                src={photo.url}
                alt={`Photo ${photo.displayOrder + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 200px"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />

              {/* Loading Indicator */}
              {photo.isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}

              {/* Drag Handle */}
              {!photo.isUploading && (
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-8 w-8 rounded-full bg-white/80 flex items-center justify-center">
                    <GripVertical className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
              )}

              {/* Delete Button */}
              {!photo.isUploading && (
                <button
                  type="button"
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              )}

              {/* Order Badge */}
              <div className="absolute bottom-2 left-2 h-6 w-6 rounded-full bg-white/80 flex items-center justify-center text-xs font-medium text-gray-600">
                {photo.displayOrder + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedPhotos.length === 0 && (
        <div className="py-8 text-center text-gray-400">
          <p className="text-sm">아직 업로드한 사진이 없어요</p>
        </div>
      )}
    </div>
  )
}

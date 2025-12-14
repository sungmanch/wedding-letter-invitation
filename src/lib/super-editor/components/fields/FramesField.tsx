'use client'

import { useState, useCallback } from 'react'
import type { EditorField } from '../../schema/editor'
import { useSuperEditor } from '../../context'
import { FrameEditor, type CustomFrame } from '../../../camera'

interface FramesFieldProps {
  field: EditorField & { type: 'frames' }
}

export function FramesField({ field }: FramesFieldProps) {
  const { getFieldValue, updateField } = useSuperEditor()
  const frames = (getFieldValue(field.dataPath) as CustomFrame[]) || []
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleAddFrame = useCallback(() => {
    setEditingIndex(null)
    setIsDialogOpen(true)
  }, [])

  const handleEditFrame = useCallback((index: number) => {
    setEditingIndex(index)
    setIsDialogOpen(true)
  }, [])

  const handleSaveFrame = useCallback(
    (frame: CustomFrame) => {
      if (editingIndex !== null) {
        // 수정
        const newFrames = [...frames]
        newFrames[editingIndex] = frame
        updateField(field.dataPath, newFrames)
      } else {
        // 추가
        updateField(field.dataPath, [...frames, frame])
      }
      setIsDialogOpen(false)
      setEditingIndex(null)
    },
    [frames, editingIndex, field.dataPath, updateField]
  )

  const handleDeleteFrame = useCallback(
    (index: number) => {
      if (!confirm('프레임을 삭제하시겠습니까?')) return
      const newFrames = frames.filter((_, i) => i !== index)
      updateField(field.dataPath, newFrames)
    },
    [frames, field.dataPath, updateField]
  )

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false)
    setEditingIndex(null)
  }, [])

  return (
    <div className="field-wrapper">
      {field.label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 프레임 목록 */}
      <div className="space-y-3">
        {frames.length === 0 ? (
          <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-gray-500 text-sm mb-3">
              등록된 프레임이 없습니다
            </p>
            <button
              type="button"
              onClick={handleAddFrame}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <PlusIcon />
              프레임 추가하기
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {frames.map((frame, index) => (
                <FrameCard
                  key={frame.id}
                  frame={frame}
                  onEdit={() => handleEditFrame(index)}
                  onDelete={() => handleDeleteFrame(index)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddFrame}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon />
              프레임 추가
            </button>
          </>
        )}
      </div>

      {field.helpText && (
        <p className="mt-2 text-sm text-gray-500">{field.helpText}</p>
      )}

      {/* 프레임 에디터 다이얼로그 */}
      {isDialogOpen && (
        <FrameEditorDialog
          initialFrame={editingIndex !== null ? frames[editingIndex] : undefined}
          onSave={handleSaveFrame}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  )
}

// 프레임 카드 컴포넌트
function FrameCard({
  frame,
  onEdit,
  onDelete,
}: {
  frame: CustomFrame
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="relative group border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* 프레임 프리뷰 */}
      <div
        className="aspect-[4/3] relative"
        style={{ backgroundColor: frame.backgroundColor }}
      >
        {frame.groomImage?.croppedUrl && (
          <img
            src={frame.groomImage.croppedUrl}
            alt="신랑"
            className="absolute object-contain"
            style={{
              left: `${(frame.groomImage.position.x / 400) * 100}%`,
              top: `${(frame.groomImage.position.y / 300) * 100}%`,
              width: `${(frame.groomImage.position.width / 400) * 100}%`,
              height: `${(frame.groomImage.position.height / 300) * 100}%`,
            }}
          />
        )}
        {frame.brideImage?.croppedUrl && (
          <img
            src={frame.brideImage.croppedUrl}
            alt="신부"
            className="absolute object-contain"
            style={{
              left: `${(frame.brideImage.position.x / 400) * 100}%`,
              top: `${(frame.brideImage.position.y / 300) * 100}%`,
              width: `${(frame.brideImage.position.width / 400) * 100}%`,
              height: `${(frame.brideImage.position.height / 300) * 100}%`,
            }}
          />
        )}

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="px-3 py-1.5 bg-white text-black rounded-md text-sm font-medium hover:bg-gray-100"
          >
            수정
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      </div>

      {/* 프레임 이름 */}
      <div className="px-3 py-2 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-700 truncate">
          {frame.name}
        </p>
      </div>
    </div>
  )
}

// 프레임 에디터 다이얼로그
function FrameEditorDialog({
  initialFrame,
  onSave,
  onClose,
}: {
  initialFrame?: CustomFrame
  onSave: (frame: CustomFrame) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* 다이얼로그 */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {initialFrame ? '프레임 수정' : '프레임 만들기'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* 프레임 에디터 */}
        <FrameEditor
          initialFrame={initialFrame}
          onSave={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  )
}

// 아이콘 컴포넌트들
function PlusIcon() {
  return (
    <svg
      className="w-5 h-5"
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
  )
}

function CloseIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

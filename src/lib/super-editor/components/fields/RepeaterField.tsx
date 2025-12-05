'use client'

import { useCallback } from 'react'
import type { RepeaterField as RepeaterFieldType, EditorField } from '../../schema/editor'
import { useSuperEditor } from '../../context'
import { FieldRenderer } from './FieldRenderer'

interface RepeaterFieldProps {
  field: RepeaterFieldType
}

export function RepeaterField({ field }: RepeaterFieldProps) {
  const { getFieldValue, updateField } = useSuperEditor()
  const items = (getFieldValue(field.dataPath) as unknown[]) || []

  const addItem = useCallback(() => {
    if (field.maxItems && items.length >= field.maxItems) return

    // 새 아이템 기본값 생성
    const newItem: Record<string, unknown> = {}
    field.fields.forEach((f) => {
      const key = f.dataPath.split('.').pop() || f.id
      newItem[key] = f.defaultValue ?? (f.type === 'switch' ? false : '')
    })

    updateField(field.dataPath, [...items, newItem])
  }, [field, items, updateField])

  const removeItem = useCallback(
    (index: number) => {
      if (field.minItems && items.length <= field.minItems) return
      const newItems = items.filter((_, i) => i !== index)
      updateField(field.dataPath, newItems)
    },
    [field, items, updateField]
  )

  const moveItem = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex < 0 || toIndex >= items.length) return
      const newItems = [...items]
      const [movedItem] = newItems.splice(fromIndex, 1)
      newItems.splice(toIndex, 0, movedItem)
      updateField(field.dataPath, newItems)
    },
    [items, updateField, field.dataPath]
  )

  // 아이템별 필드 dataPath 변환
  const getItemFields = (index: number): EditorField[] => {
    return field.fields.map((f) => ({
      ...f,
      id: `${f.id}-${index}`,
      dataPath: `${field.dataPath}[${index}].${f.dataPath}`,
    }))
  }

  // 아이템 라벨 생성
  const getItemLabel = (item: unknown, index: number): string => {
    if (!field.itemLabel) return `아이템 ${index + 1}`

    let label = field.itemLabel
    label = label.replace('{{index}}', String(index + 1))

    if (typeof item === 'object' && item !== null) {
      Object.entries(item as Record<string, unknown>).forEach(([key, value]) => {
        label = label.replace(`{{${key}}}`, String(value || ''))
      })
    }

    return label.trim() || `아이템 ${index + 1}`
  }

  const canAdd = !field.maxItems || items.length < field.maxItems
  const canRemove = !field.minItems || items.length > field.minItems

  return (
    <div className="repeater-field">
      {/* 헤더 */}
      {field.label && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.description && (
            <p className="text-sm text-gray-500 mt-0.5">{field.description}</p>
          )}
        </div>
      )}

      {/* 아이템 목록 */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="repeater-item border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* 아이템 헤더 */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {getItemLabel(item, index)}
              </span>

              <div className="flex items-center gap-1">
                {/* 순서 변경 버튼 */}
                {field.sortable && (
                  <>
                    <button
                      type="button"
                      onClick={() => moveItem(index, index - 1)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="위로"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, index + 1)}
                      disabled={index === items.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="아래로"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={!canRemove}
                  className="p-1 text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title={field.removeLabel ?? '삭제'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 아이템 필드들 */}
            <div className="p-4 space-y-3">
              {getItemFields(index).map((itemField) => (
                <FieldRenderer key={itemField.id} field={itemField} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 추가 버튼 */}
      {canAdd && (
        <button
          type="button"
          onClick={addItem}
          className="mt-3 w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {field.addLabel ?? '추가'}
        </button>
      )}

      {/* 도움말 */}
      {field.helpText && (
        <p className="mt-2 text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  )
}

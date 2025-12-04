'use client'

import { useRef, useEffect } from 'react'
import type { TextareaField as TextareaFieldType } from '../../schema/editor'
import { useSuperEditor } from '../../context'

interface TextareaFieldProps {
  field: TextareaFieldType
}

export function TextareaField({ field }: TextareaFieldProps) {
  const { getFieldValue, updateField } = useSuperEditor()
  const value = (getFieldValue(field.dataPath) as string) || ''
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto resize
  useEffect(() => {
    if (field.autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value, field.autoResize])

  return (
    <div className="field-wrapper">
      {field.label && (
        <label
          htmlFor={field.id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={textareaRef}
        id={field.id}
        value={value}
        onChange={(e) => updateField(field.dataPath, e.target.value)}
        placeholder={field.placeholder}
        disabled={field.disabled}
        rows={field.rows || 4}
        maxLength={field.maxLength}
        minLength={field.minLength}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          resize-vertical
        `}
      />

      <div className="flex justify-between mt-1">
        {field.helpText && (
          <p className="text-sm text-gray-500">{field.helpText}</p>
        )}
        {field.maxLength && (
          <p className="text-sm text-gray-400">
            {value.length}/{field.maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

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
          className="block text-sm font-medium text-[#F5E6D3]/80 mb-1"
        >
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={textareaRef}
        id={field.id}
        value={value}
        onChange={(e) => updateField(field.dataPath, e.target.value)}
        placeholder={field.placeholder || (field.defaultValue as string) || ''}
        disabled={field.disabled}
        rows={field.rows || 4}
        maxLength={field.maxLength}
        minLength={field.minLength}
        className={`
          w-full px-3 py-2 border border-white/10 rounded-lg
          bg-white/5 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40
          focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962]/30
          disabled:bg-white/[0.02] disabled:cursor-not-allowed
          resize-vertical
        `}
      />

      <div className="flex justify-between mt-1">
        {field.helpText && (
          <p className="text-sm text-[#F5E6D3]/50">{field.helpText}</p>
        )}
        {field.maxLength && (
          <p className="text-sm text-[#F5E6D3]/40">
            {value.length}/{field.maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

'use client'

import type { TimeField as TimeFieldType } from '../../schema/editor'
import { useSuperEditor } from '../../context'

interface TimeFieldProps {
  field: TimeFieldType
}

export function TimeField({ field }: TimeFieldProps) {
  const { getFieldValue, updateField } = useSuperEditor()
  const storedValue = getFieldValue(field.dataPath) as string
  const value = storedValue || (field.defaultValue as string) || ''

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

      <input
        id={field.id}
        type="time"
        value={value}
        onChange={(e) => updateField(field.dataPath, e.target.value)}
        disabled={field.disabled}
        step={field.step ? field.step * 60 : undefined}
        className={`
          w-full px-3 py-2 border border-white/10 rounded-lg
          bg-white/5 text-[#F5E6D3]
          focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962]/30
          disabled:bg-white/[0.02] disabled:cursor-not-allowed
          [&::-webkit-calendar-picker-indicator]:invert
        `}
      />

      {field.helpText && (
        <p className="mt-1 text-sm text-[#F5E6D3]/50">{field.helpText}</p>
      )}
    </div>
  )
}

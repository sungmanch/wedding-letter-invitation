'use client'

import type { DateField as DateFieldType } from '../../schema/editor'
import { useSuperEditor } from '../../context'

interface DateFieldProps {
  field: DateFieldType
}

export function DateField({ field }: DateFieldProps) {
  const { getFieldValue, updateField } = useSuperEditor()
  const value = (getFieldValue(field.dataPath) as string) || ''

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

      <input
        id={field.id}
        type="date"
        value={value}
        onChange={(e) => updateField(field.dataPath, e.target.value)}
        disabled={field.disabled}
        min={field.min}
        max={field.max}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
      />

      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  )
}

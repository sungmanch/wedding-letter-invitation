'use client'

import type { NumberField as NumberFieldType } from '../../schema/editor'
import { useSuperEditor } from '../../context'

interface NumberFieldProps {
  field: NumberFieldType
}

export function NumberField({ field }: NumberFieldProps) {
  const { getFieldValue, updateField } = useSuperEditor()
  const value = getFieldValue(field.dataPath) as number | undefined

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === '') {
      updateField(field.dataPath, undefined)
    } else {
      const num = parseFloat(val)
      if (!isNaN(num)) {
        updateField(field.dataPath, num)
      }
    }
  }

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

      <div className="relative">
        <input
          id={field.id}
          type="number"
          value={value ?? ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          disabled={field.disabled}
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            field.unit ? 'pr-12' : ''
          }`}
        />

        {field.unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {field.unit}
          </span>
        )}
      </div>

      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  )
}

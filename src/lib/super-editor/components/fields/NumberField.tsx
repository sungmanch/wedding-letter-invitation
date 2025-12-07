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
          className="block text-sm font-medium text-[#F5E6D3]/80 mb-1"
        >
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
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
          className={`w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962]/30 disabled:bg-white/[0.02] disabled:cursor-not-allowed ${
            field.unit ? 'pr-12' : ''
          }`}
        />

        {field.unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5E6D3]/40 text-sm">
            {field.unit}
          </span>
        )}
      </div>

      {field.helpText && (
        <p className="mt-1 text-sm text-[#F5E6D3]/50">{field.helpText}</p>
      )}
    </div>
  )
}

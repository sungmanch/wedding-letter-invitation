'use client'

import type { TextField as TextFieldType } from '../../schema/editor'
import { useSuperEditor } from '../../context'

interface TextFieldProps {
  field: TextFieldType
}

export function TextField({ field }: TextFieldProps) {
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

      <div className="relative">
        {field.prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {field.prefix}
          </span>
        )}

        <input
          id={field.id}
          type="text"
          value={value}
          onChange={(e) => updateField(field.dataPath, e.target.value)}
          placeholder={field.placeholder}
          disabled={field.disabled}
          maxLength={field.maxLength}
          minLength={field.minLength}
          pattern={field.pattern}
          autoComplete={field.autocomplete}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${field.prefix ? 'pl-8' : ''}
            ${field.suffix ? 'pr-8' : ''}
          `}
        />

        {field.suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {field.suffix}
          </span>
        )}
      </div>

      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  )
}

'use client'

import type { SwitchField as SwitchFieldType } from '../../schema/editor'
import { useSuperEditor } from '../../context'

interface SwitchFieldProps {
  field: SwitchFieldType
}

export function SwitchField({ field }: SwitchFieldProps) {
  const { getFieldValue, updateField } = useSuperEditor()
  const value = (getFieldValue(field.dataPath) as boolean) || false

  return (
    <div className="field-wrapper">
      <div className="flex items-center justify-between">
        <div>
          {field.label && (
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
          )}
          {field.helpText && (
            <p className="text-sm text-gray-500">{field.helpText}</p>
          )}
        </div>

        <button
          id={field.id}
          type="button"
          role="switch"
          aria-checked={value}
          disabled={field.disabled}
          onClick={() => updateField(field.dataPath, !value)}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer
            rounded-full border-2 border-transparent transition-colors
            duration-200 ease-in-out focus:outline-none focus:ring-2
            focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${value ? 'bg-blue-600' : 'bg-gray-200'}
          `}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform
              rounded-full bg-white shadow ring-0 transition
              duration-200 ease-in-out
              ${value ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {(field.onLabel || field.offLabel) && (
        <p className="mt-1 text-xs text-gray-400">
          {value ? field.onLabel : field.offLabel}
        </p>
      )}
    </div>
  )
}

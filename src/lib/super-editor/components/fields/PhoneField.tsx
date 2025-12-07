'use client'

import type { PhoneField as PhoneFieldType } from '../../schema/editor'
import { useSuperEditor } from '../../context'

interface PhoneFieldProps {
  field: PhoneFieldType
}

export function PhoneField({ field }: PhoneFieldProps) {
  const { getFieldValue, updateField } = useSuperEditor()
  const value = (getFieldValue(field.dataPath) as string) || ''

  // 전화번호 포맷팅
  const formatPhoneNumber = (input: string): string => {
    const numbers = input.replace(/\D/g, '')

    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else if (numbers.length <= 11) {
      if (numbers.startsWith('02')) {
        // 서울 지역번호
        if (numbers.length <= 9) {
          return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`
        }
        return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`
      }
      // 휴대폰 또는 다른 지역번호
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
    }
    return numbers
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = field.format !== false ? formatPhoneNumber(e.target.value) : e.target.value
    updateField(field.dataPath, formatted)
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

      <input
        id={field.id}
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={field.placeholder ?? '010-1234-5678'}
        disabled={field.disabled}
        className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962]/30 disabled:bg-white/[0.02] disabled:cursor-not-allowed"
      />

      {field.helpText && (
        <p className="mt-1 text-sm text-[#F5E6D3]/50">{field.helpText}</p>
      )}
    </div>
  )
}

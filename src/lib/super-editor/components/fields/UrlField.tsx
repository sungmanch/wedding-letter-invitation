'use client'

import type { UrlField as UrlFieldType } from '../../schema/editor'
import { useSuperEditor } from '../../context'

interface UrlFieldProps {
  field: UrlFieldType
}

export function UrlField({ field }: UrlFieldProps) {
  const { getFieldValue, updateField } = useSuperEditor()
  const value = (getFieldValue(field.dataPath) as string) || ''

  const isValidUrl = (url: string): boolean => {
    if (!url) return true
    try {
      const parsed = new URL(url)
      const allowedProtocols = field.protocols ?? ['http', 'https']
      return allowedProtocols.some((p) => parsed.protocol === `${p}:`)
    } catch {
      return false
    }
  }

  const isValid = isValidUrl(value)

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
          type="url"
          value={value}
          onChange={(e) => updateField(field.dataPath, e.target.value)}
          placeholder={field.placeholder ?? 'https://example.com'}
          disabled={field.disabled}
          className={`w-full px-3 py-2 border rounded-lg bg-white/5 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 focus:ring-2 disabled:bg-white/[0.02] disabled:cursor-not-allowed ${
            value && !isValid
              ? 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400/30'
              : 'border-white/10 focus:ring-[#C9A962]/50 focus:border-[#C9A962]/30'
          }`}
        />

        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5E6D3]/40 hover:text-[#C9A962]"
            title="링크 열기"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>

      {value && !isValid && (
        <p className="mt-1 text-sm text-red-400">유효한 URL을 입력하세요</p>
      )}

      {field.helpText && (
        <p className="mt-1 text-sm text-[#F5E6D3]/50">{field.helpText}</p>
      )}
    </div>
  )
}

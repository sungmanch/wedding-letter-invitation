'use client'

import { useState } from 'react'
import type { GroupField as GroupFieldType } from '../../schema/editor'
import { FieldRenderer } from './FieldRenderer'

interface GroupFieldProps {
  field: GroupFieldType
}

export function GroupField({ field }: GroupFieldProps) {
  const [isCollapsed, setIsCollapsed] = useState(field.collapsed ?? false)

  const canCollapse = field.collapsible ?? false

  return (
    <div className="group-field border border-white/10 rounded-lg overflow-hidden bg-white/5">
      {/* 그룹 헤더 */}
      <div
        className={`px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between ${
          canCollapse ? 'cursor-pointer hover:bg-white/10' : ''
        }`}
        onClick={() => canCollapse && setIsCollapsed(!isCollapsed)}
      >
        <div>
          <h4 className="font-medium text-[#F5E6D3]">{field.label}</h4>
          {field.description && (
            <p className="text-sm text-[#F5E6D3]/50 mt-0.5">{field.description}</p>
          )}
        </div>

        {canCollapse && (
          <svg
            className={`w-5 h-5 text-[#F5E6D3]/50 transition-transform ${
              isCollapsed ? '' : 'rotate-180'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>

      {/* 그룹 콘텐츠 */}
      {!isCollapsed && (
        <div
          className={`p-4 ${
            field.layout === 'horizontal'
              ? 'flex flex-wrap gap-4'
              : field.layout === 'grid'
              ? `grid gap-4 grid-cols-${field.columns ?? 2}`
              : 'space-y-4'
          }`}
        >
          {field.fields
            .sort((a, b) => a.order - b.order)
            .map((childField) => (
              <div
                key={childField.id}
                className={
                  field.layout === 'horizontal' || field.layout === 'grid'
                    ? 'flex-1 min-w-[200px]'
                    : ''
                }
              >
                <FieldRenderer field={childField} />
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

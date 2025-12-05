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
    <div className="group-field border border-gray-200 rounded-lg overflow-hidden">
      {/* 그룹 헤더 */}
      <div
        className={`px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between ${
          canCollapse ? 'cursor-pointer hover:bg-gray-100' : ''
        }`}
        onClick={() => canCollapse && setIsCollapsed(!isCollapsed)}
      >
        <div>
          <h4 className="font-medium text-gray-900">{field.label}</h4>
          {field.description && (
            <p className="text-sm text-gray-500 mt-0.5">{field.description}</p>
          )}
        </div>

        {canCollapse && (
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
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

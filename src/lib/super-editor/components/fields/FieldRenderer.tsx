'use client'

import type { EditorField } from '../../schema/editor'
import { TextField } from './TextField'
import { TextareaField } from './TextareaField'
import { DateField } from './DateField'
import { TimeField } from './TimeField'
import { SelectField } from './SelectField'
import { SwitchField } from './SwitchField'
import { ImageField } from './ImageField'
import { ImageListField } from './ImageListField'
import { NumberField } from './NumberField'
import { PhoneField } from './PhoneField'
import { UrlField } from './UrlField'
import { LocationField } from './LocationField'
import { GroupField } from './GroupField'
import { RepeaterField } from './RepeaterField'
import { FramesField } from './FramesField'
import { useSuperEditor } from '../../context'

interface FieldRendererProps {
  field: EditorField
}

export function FieldRenderer({ field }: FieldRendererProps) {
  const { getFieldValue } = useSuperEditor()

  // 조건부 렌더링 체크
  if (field.conditions && field.conditions.length > 0) {
    const shouldRender = field.conditions.every((condition) => {
      const value = getFieldValue(condition.field)

      switch (condition.operator) {
        case 'equals':
          return value === condition.value
        case 'notEquals':
          return value !== condition.value
        case 'contains':
          return String(value).includes(String(condition.value))
        case 'notContains':
          return !String(value).includes(String(condition.value))
        case 'gt':
          return Number(value) > Number(condition.value)
        case 'gte':
          return Number(value) >= Number(condition.value)
        case 'lt':
          return Number(value) < Number(condition.value)
        case 'lte':
          return Number(value) <= Number(condition.value)
        case 'empty':
          return !value || (Array.isArray(value) && value.length === 0)
        case 'notEmpty':
          return !!value && (!Array.isArray(value) || value.length > 0)
        default:
          return true
      }
    })

    if (!shouldRender) return null
  }

  // hidden 필드
  if (field.hidden) return null

  switch (field.type) {
    case 'text':
      return <TextField field={field} />

    case 'textarea':
      return <TextareaField field={field} />

    case 'date':
      return <DateField field={field} />

    case 'time':
      return <TimeField field={field} />

    case 'select':
      return <SelectField field={field} />

    case 'switch':
      return <SwitchField field={field} />

    case 'image':
      return <ImageField field={field} />

    case 'imageList':
      return <ImageListField field={field} />

    case 'number':
      return <NumberField field={field} />

    case 'phone':
      return <PhoneField field={field} />

    case 'url':
      return <UrlField field={field} />

    case 'location':
      return <LocationField field={field} />

    case 'group':
      return <GroupField field={field} />

    case 'repeater':
      return <RepeaterField field={field} />

    case 'frames':
      return <FramesField field={field as EditorField & { type: 'frames' }} />

    // TODO: 더 많은 필드 타입 추가
    case 'datetime':
    case 'multiselect':
    case 'radio':
    case 'checkbox':
    case 'color':
    case 'icon':
    case 'person':
    case 'personList':
    case 'account':
    case 'accountList':
    case 'richtext':
      return (
        <div className="p-3 bg-white/5 rounded-lg text-sm text-[#F5E6D3]/50">
          [{field.type}] {field.label || field.id} - 미구현
        </div>
      )

    default:
      return null
  }
}

// 섹션 렌더러
interface SectionRendererProps {
  section: {
    id: string
    title: string
    description?: string
    fields: EditorField[]
    collapsed?: boolean
  }
}

export function SectionRenderer({ section }: SectionRendererProps) {
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
      <div className="px-4 py-3 bg-white/5 border-b border-white/10">
        <h3 className="font-medium text-[#F5E6D3]">{section.title}</h3>
        {section.description && (
          <p className="text-sm text-[#F5E6D3]/50 mt-0.5">{section.description}</p>
        )}
      </div>

      <div className="p-4 space-y-4">
        {section.fields
          .sort((a, b) => a.order - b.order)
          .map((field) => (
            <FieldRenderer key={field.id} field={field} />
          ))}
      </div>
    </div>
  )
}

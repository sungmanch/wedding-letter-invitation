/**
 * Super Editor - Editor Field Types
 * 동적 에디터 UI를 위한 필드 타입 정의
 * (Layout의 {{변수}}에서 자동 생성됨)
 */

// ============================================
// Editor Section (동적 생성)
// ============================================

export interface EditorSection {
  id: string
  title: string
  description?: string
  icon?: string
  collapsed?: boolean
  order: number
  fields: EditorField[]
  conditions?: FieldCondition[]
}

// ============================================
// Editor Fields
// ============================================

export type EditorField =
  | TextField
  | TextareaField
  | DateField
  | TimeField
  | DateTimeField
  | NumberField
  | SelectField
  | MultiSelectField
  | RadioField
  | CheckboxField
  | SwitchField
  | ImageField
  | ImageListField
  | ColorField
  | IconField
  | LocationField
  | PersonField
  | PersonListField
  | AccountField
  | AccountListField
  | PhoneField
  | UrlField
  | RichTextField
  | GroupField
  | RepeaterField
  | FramesField

// ============================================
// Field Base Interface
// ============================================

interface FieldBase {
  id: string
  type: FieldType
  label: string
  description?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  order: number
  dataPath: string       // 데이터 바인딩 경로 (e.g., "couple.groom.name")
  defaultValue?: unknown
  conditions?: FieldCondition[]
  validation?: FieldValidation
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'date'
  | 'time'
  | 'datetime'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'image'
  | 'imageList'
  | 'color'
  | 'icon'
  | 'location'
  | 'person'
  | 'personList'
  | 'account'
  | 'accountList'
  | 'phone'
  | 'url'
  | 'richtext'
  | 'group'
  | 'repeater'
  | 'frames'

// ============================================
// Text Fields
// ============================================

export interface TextField extends FieldBase {
  type: 'text'
  maxLength?: number
  minLength?: number
  pattern?: string
  prefix?: string
  suffix?: string
  autocomplete?: string
}

export interface TextareaField extends FieldBase {
  type: 'textarea'
  rows?: number
  maxLength?: number
  minLength?: number
  autoResize?: boolean
}

export interface RichTextField extends FieldBase {
  type: 'richtext'
  features?: ('bold' | 'italic' | 'link' | 'list' | 'heading')[]
  maxLength?: number
}

// ============================================
// Date/Time Fields
// ============================================

export interface DateField extends FieldBase {
  type: 'date'
  min?: string
  max?: string
  format?: string    // 표시 형식
}

export interface TimeField extends FieldBase {
  type: 'time'
  step?: number      // 분 단위
  format?: '12h' | '24h'
}

export interface DateTimeField extends FieldBase {
  type: 'datetime'
  min?: string
  max?: string
}

// ============================================
// Number Field
// ============================================

export interface NumberField extends FieldBase {
  type: 'number'
  min?: number
  max?: number
  step?: number
  unit?: string
}

// ============================================
// Selection Fields
// ============================================

export interface SelectField extends FieldBase {
  type: 'select'
  options: SelectOption[]
  searchable?: boolean
  creatable?: boolean  // 새 옵션 추가 가능
}

export interface MultiSelectField extends FieldBase {
  type: 'multiselect'
  options: SelectOption[]
  maxItems?: number
  minItems?: number
}

export interface RadioField extends FieldBase {
  type: 'radio'
  options: SelectOption[]
  layout?: 'horizontal' | 'vertical'
}

export interface CheckboxField extends FieldBase {
  type: 'checkbox'
  options?: SelectOption[]  // 단일 체크박스면 없음
  layout?: 'horizontal' | 'vertical'
}

export interface SwitchField extends FieldBase {
  type: 'switch'
  onLabel?: string
  offLabel?: string
}

export interface SelectOption {
  value: string
  label: string
  description?: string
  icon?: string
  disabled?: boolean
}

// ============================================
// Media Fields
// ============================================

export interface ImageField extends FieldBase {
  type: 'image'
  accept?: string[]
  maxSize?: number      // bytes
  aspectRatio?: string  // e.g., "1:1", "4:3"
  crop?: boolean
  preview?: boolean
}

export interface ImageListField extends FieldBase {
  type: 'imageList'
  accept?: string[]
  maxSize?: number
  maxItems?: number
  minItems?: number
  sortable?: boolean
  aspectRatio?: string
}

// ============================================
// Special Fields
// ============================================

export interface ColorField extends FieldBase {
  type: 'color'
  swatches?: string[]
  alpha?: boolean
}

export interface IconField extends FieldBase {
  type: 'icon'
  iconSet?: 'lucide' | 'heroicons' | 'custom'
  categories?: string[]
}

export interface LocationField extends FieldBase {
  type: 'location'
  mapProvider?: 'kakao' | 'naver' | 'google'
  searchEnabled?: boolean
}

export interface PhoneField extends FieldBase {
  type: 'phone'
  countryCode?: string
  format?: boolean
}

export interface UrlField extends FieldBase {
  type: 'url'
  protocols?: ('http' | 'https' | 'mailto' | 'tel')[]
}

// ============================================
// Wedding-Specific Fields
// ============================================

export interface PersonField extends FieldBase {
  type: 'person'
  subfields: {
    name: boolean
    role?: boolean
    phone?: boolean
    relation?: boolean
  }
}

export interface PersonListField extends FieldBase {
  type: 'personList'
  subfields: {
    name: boolean
    role?: boolean
    phone?: boolean
    relation?: boolean
  }
  maxItems?: number
  minItems?: number
  sortable?: boolean
}

export interface AccountField extends FieldBase {
  type: 'account'
  subfields: {
    bank: boolean
    accountNumber: boolean
    holder: boolean
    kakaoPayUrl?: boolean
  }
}

export interface AccountListField extends FieldBase {
  type: 'accountList'
  subfields: {
    bank: boolean
    accountNumber: boolean
    holder: boolean
    kakaoPayUrl?: boolean
  }
  maxItems?: number
}

// ============================================
// Compound Fields
// ============================================

export interface GroupField extends FieldBase {
  type: 'group'
  fields: EditorField[]
  layout?: 'vertical' | 'horizontal' | 'grid'
  columns?: number
  collapsible?: boolean
  collapsed?: boolean
}

export interface RepeaterField extends FieldBase {
  type: 'repeater'
  itemLabel?: string       // 아이템 라벨 패턴 (e.g., "손님 {{index}}")
  fields: EditorField[]
  maxItems?: number
  minItems?: number
  sortable?: boolean
  addLabel?: string
  removeLabel?: string
}

export interface FramesField extends FieldBase {
  type: 'frames'
  maxItems?: number
  minItems?: number
}

// ============================================
// Field Conditions
// ============================================

export interface FieldCondition {
  field: string           // 다른 필드의 dataPath
  operator: ConditionOperator
  value?: unknown
}

export type ConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'empty'
  | 'notEmpty'
  | 'in'
  | 'notIn'

// ============================================
// Field Validation
// ============================================

export interface FieldValidation {
  rules: ValidationRule[]
  mode?: 'onBlur' | 'onChange' | 'onSubmit'
}

export interface ValidationRule {
  type: ValidationType
  value?: unknown
  message: string
}

export type ValidationType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'min'
  | 'max'
  | 'pattern'
  | 'email'
  | 'url'
  | 'phone'
  | 'date'
  | 'custom'

// ============================================
// Editor Events
// ============================================

export interface EditorEvent {
  type: 'change' | 'blur' | 'focus' | 'submit' | 'validate'
  fieldId: string
  value: unknown
  previousValue?: unknown
  timestamp: number
}

// ============================================
// Editor State
// ============================================

export interface EditorState {
  values: Record<string, unknown>
  errors: Record<string, string[]>
  touched: Record<string, boolean>
  dirty: boolean
  valid: boolean
  submitting: boolean
}

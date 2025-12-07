/**
 * Super Editor - Slot to Field Converter
 * VariableDeclaration을 EditorField로 변환하는 유틸리티
 */

import type { EditorField, FieldType } from '../schema/editor'
import type { VariableDeclaration, VariableType } from '../schema/variables'
import { VARIABLE_TYPE_TO_FIELD_TYPE, STANDARD_VARIABLE_PATHS } from '../schema/variables'

// ============================================
// Type Mapping
// ============================================

/**
 * VariableType을 FieldType으로 변환
 */
export function variableTypeToFieldType(type: VariableType): FieldType {
  return VARIABLE_TYPE_TO_FIELD_TYPE[type] || 'text'
}

// ============================================
// Declaration to Field Conversion
// ============================================

/**
 * VariableDeclaration을 EditorField로 변환
 */
export function declarationToField(
  decl: VariableDeclaration,
  order: number
): EditorField {
  const fieldType = variableTypeToFieldType(decl.type)

  // 공통 속성 (declaration의 order가 있으면 우선, 없으면 fallback)
  const base = {
    id: decl.id || decl.path.replace(/\./g, '-'),
    label: decl.label,
    dataPath: decl.path,
    required: decl.required,
    order: decl.order ?? order,
    placeholder: decl.placeholder,
    helpText: decl.helpText,
    description: decl.description,
    defaultValue: decl.defaultValue,
  }

  // 타입별 필드 생성
  switch (fieldType) {
    case 'text':
      return {
        ...base,
        type: 'text',
        maxLength: decl.maxLength,
      }

    case 'textarea':
      return {
        ...base,
        type: 'textarea',
        rows: decl.rows ?? 3,
        maxLength: decl.maxLength,
      }

    case 'image':
      return {
        ...base,
        type: 'image',
        aspectRatio: decl.aspectRatio,
      }

    case 'imageList':
      return {
        ...base,
        type: 'imageList',
        maxItems: decl.maxItems ?? 20,
      }

    case 'date':
      return {
        ...base,
        type: 'date',
      }

    case 'time':
      return {
        ...base,
        type: 'time',
      }

    case 'datetime':
      return {
        ...base,
        type: 'datetime',
      }

    case 'number':
      return {
        ...base,
        type: 'number',
        min: decl.min,
        max: decl.max,
      }

    case 'select':
      return {
        ...base,
        type: 'select',
        options: decl.options ?? [],
      }

    case 'phone':
      return {
        ...base,
        type: 'phone',
      }

    case 'url':
      return {
        ...base,
        type: 'url',
      }

    case 'location':
      return {
        ...base,
        type: 'location',
        mapProvider: 'kakao',
        searchEnabled: true,
      } as EditorField

    case 'account':
      return {
        ...base,
        type: 'account',
        subfields: {
          bank: true,
          accountNumber: true,
          holder: true,
        },
      }

    case 'repeater':
      return {
        ...base,
        type: 'repeater',
        minItems: decl.minItems ?? 0,
        maxItems: decl.maxItems ?? 10,
        itemLabel: decl.itemLabel,
        fields: decl.fields?.map((f, i) => declarationToField(f, i + 1)) ?? [],
      }

    default:
      return {
        ...base,
        type: 'text',
      }
  }
}

// ============================================
// Heuristic Type Inference
// ============================================

/** 경로 키워드 기반 타입 추론 맵 */
const PATH_KEYWORD_TYPE_MAP: Array<{ keywords: string[]; type: VariableType }> = [
  { keywords: ['date', 'birthday', 'anniversary'], type: 'date' },
  { keywords: ['time', 'hour', 'minute'], type: 'time' },
  { keywords: ['phone', 'tel', 'mobile', 'contact'], type: 'phone' },
  { keywords: ['url', 'link', 'href', 'website'], type: 'url' },
  { keywords: ['image', 'photo', 'picture', 'avatar', 'thumbnail', 'src'], type: 'image' },
  { keywords: ['gallery', 'photos', 'images', 'pictures'], type: 'images' },
  { keywords: ['content', 'message', 'description', 'body', 'text'], type: 'textarea' },
  { keywords: ['address', 'location'], type: 'text' },
  { keywords: ['lat', 'lng', 'latitude', 'longitude', 'price', 'amount', 'count', 'number'], type: 'number' },
]

/**
 * 경로에서 필드 타입 휴리스틱 추론
 */
export function inferFieldType(path: string): VariableType {
  const lowerPath = path.toLowerCase()
  const lastSegment = path.split('.').pop()?.toLowerCase() || ''

  // 마지막 세그먼트 우선 검사
  for (const { keywords, type } of PATH_KEYWORD_TYPE_MAP) {
    if (keywords.some((k) => lastSegment.includes(k))) {
      return type
    }
  }

  // 전체 경로 검사
  for (const { keywords, type } of PATH_KEYWORD_TYPE_MAP) {
    if (keywords.some((k) => lowerPath.includes(k))) {
      return type
    }
  }

  return 'text'
}

/**
 * 경로에서 라벨 자동 생성
 */
export function generateLabelFromPath(path: string): string {
  const lastSegment = path.split('.').pop() || path

  // camelCase/snake_case를 공백으로 분리
  const words = lastSegment
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase
    .replace(/_/g, ' ') // snake_case
    .toLowerCase()
    .split(' ')

  // 첫 글자 대문자로
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// ============================================
// Standard Variable Resolution
// ============================================

/**
 * 표준 변수 경로에서 VariableDeclaration 생성
 */
export function resolveStandardVariable(path: string): VariableDeclaration | null {
  const standard = STANDARD_VARIABLE_PATHS[path]
  if (!standard) return null

  return {
    id: path.replace(/\./g, '-'),
    path,
    type: standard.type || 'text',
    label: standard.label || generateLabelFromPath(path),
    required: standard.required ?? false,
    defaultValue: standard.defaultValue,
    placeholder: standard.placeholder,
    helpText: standard.helpText,
    description: standard.description,
    options: standard.options,
    aspectRatio: standard.aspectRatio,
    maxLength: standard.maxLength,
    rows: standard.rows,
    min: standard.min,
    max: standard.max,
    maxItems: standard.maxItems,
    minItems: standard.minItems,
    fields: standard.fields,
    itemLabel: standard.itemLabel,
    order: standard.order,
  }
}

/**
 * 알 수 없는 변수에 대해 휴리스틱으로 VariableDeclaration 생성
 */
export function inferVariableDeclaration(path: string): VariableDeclaration {
  const type = inferFieldType(path)

  return {
    id: path.replace(/\./g, '-'),
    path,
    type,
    label: generateLabelFromPath(path),
    required: false,
    // 타입별 기본 속성
    ...(type === 'textarea' ? { rows: 3 } : {}),
    ...(type === 'images' ? { maxItems: 20 } : {}),
  }
}

/**
 * 경로에서 VariableDeclaration 해결 (표준 우선, 없으면 휴리스틱)
 */
export function resolveVariableDeclaration(path: string): VariableDeclaration {
  return resolveStandardVariable(path) || inferVariableDeclaration(path)
}

// ============================================
// Batch Conversion
// ============================================

/**
 * 경로 매핑 규칙
 * 특정 hidden 경로들이 있으면 대체 경로를 자동 추가
 */
const PATH_REPLACEMENT_RULES: Array<{
  /** 이 경로들 중 하나라도 있으면 */
  triggers: string[]
  /** 이 경로를 추가 */
  replacement: string
}> = [
  {
    // venue.address, venue.lat, venue.lng → venue (location 타입)
    triggers: ['venue.address', 'venue.lat', 'venue.lng'],
    replacement: 'venue',
  },
  {
    // wedding.dateDisplay, wedding.dateEn 등 → wedding.date (date 타입 입력 필드)
    triggers: ['wedding.dateDisplay', 'wedding.dateEn', 'wedding.month', 'wedding.day', 'wedding.weekday'],
    replacement: 'wedding.date',
  },
  {
    // wedding.timeDisplay, wedding.timeEn → wedding.time (time 타입 입력 필드)
    triggers: ['wedding.timeDisplay', 'wedding.timeEn'],
    replacement: 'wedding.time',
  },
]

/**
 * 경로 배열을 VariableDeclaration 배열로 변환
 * __HIDDEN__ description을 가진 필드는 자동으로 필터링됨
 */
export function pathsToDeclarations(
  paths: string[],
  providedDeclarations?: VariableDeclaration[]
): VariableDeclaration[] {
  const declMap = new Map<string, VariableDeclaration>()

  // 제공된 선언 먼저 등록
  if (providedDeclarations) {
    for (const decl of providedDeclarations) {
      declMap.set(decl.path, decl)
    }
  }

  // 경로 대체 규칙 적용 - hidden 경로들이 있으면 대체 경로 추가
  const pathSet = new Set(paths)
  for (const rule of PATH_REPLACEMENT_RULES) {
    const hasAnyTrigger = rule.triggers.some((t) => pathSet.has(t))
    if (hasAnyTrigger && !pathSet.has(rule.replacement)) {
      pathSet.add(rule.replacement)
    }
  }

  // 경로별로 선언 생성 (없으면 해결)
  for (const path of pathSet) {
    if (!declMap.has(path)) {
      declMap.set(path, resolveVariableDeclaration(path))
    }
  }

  // __HIDDEN__ description을 가진 필드는 에디터에서 숨김 처리
  return Array.from(declMap.values()).filter(
    (decl) => decl.description !== '__HIDDEN__'
  )
}

/**
 * VariableDeclaration 배열을 EditorField 배열로 변환
 */
export function declarationsToFields(
  declarations: VariableDeclaration[]
): EditorField[] {
  return declarations.map((decl, index) => declarationToField(decl, index + 1))
}

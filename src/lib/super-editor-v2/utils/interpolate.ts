/**
 * Interpolate - 포맷 문자열 보간
 *
 * 템플릿 문자열에서 {변수} 형식을 실제 값으로 치환
 * 예: '{groom.name} ♥ {bride.name}' → '철수 ♥ 영희'
 */

import type { WeddingData, VariablePath } from '../schema/types'
import {
  resolveBinding,
  extractBindingsFromFormat,
  type ResolveOptions,
} from './binding-resolver'

// ============================================
// Types
// ============================================

export interface InterpolateOptions extends ResolveOptions {
  // 찾을 수 없는 변수 처리 방식
  missingBehavior?: 'keep' | 'remove' | 'placeholder'
  // 플레이스홀더 텍스트 (missingBehavior가 'placeholder'일 때)
  placeholder?: string
  // 이스케이프된 중괄호 처리 ({{, }})
  handleEscape?: boolean
}

export interface InterpolateResult {
  // 보간된 최종 문자열
  result: string
  // 사용된 변수 경로들
  usedPaths: VariablePath[]
  // 찾을 수 없었던 변수 경로들
  missingPaths: string[]
  // 모든 변수가 성공적으로 치환되었는지
  isComplete: boolean
}

// ============================================
// Main Functions
// ============================================

/**
 * 포맷 문자열 보간
 *
 * @param format 포맷 문자열 (예: '{groom.name} ♥ {bride.name}')
 * @param data 데이터 객체
 * @param options 옵션
 * @returns 보간된 문자열
 *
 * @example
 * interpolate('{groom.name} ♥ {bride.name}', data)
 * // '철수 ♥ 영희'
 *
 * @example
 * interpolate('{wedding.dateDisplay}에 결혼합니다', data)
 * // '2025년 3월 15일 토요일에 결혼합니다'
 */
export function interpolate(
  format: string,
  data: WeddingData,
  options: InterpolateOptions = {}
): string {
  const {
    missingBehavior = 'keep',
    placeholder = '???',
    handleEscape = true,
  } = options

  // 이스케이프 처리: {{ → __ESCAPE_OPEN__, }} → __ESCAPE_CLOSE__
  let processed = format
  if (handleEscape) {
    processed = processed.replace(/\{\{/g, '__ESCAPE_OPEN__')
    processed = processed.replace(/}}/g, '__ESCAPE_CLOSE__')
  }

  // 변수 치환
  processed = processed.replace(/\{([^}]+)\}/g, (match, path) => {
    const value = resolveBinding(data, path as VariablePath, options)

    if (value === null || value === undefined) {
      switch (missingBehavior) {
        case 'remove':
          return ''
        case 'placeholder':
          return placeholder
        case 'keep':
        default:
          return match
      }
    }

    return String(value)
  })

  // 이스케이프 복원
  if (handleEscape) {
    processed = processed.replace(/__ESCAPE_OPEN__/g, '{')
    processed = processed.replace(/__ESCAPE_CLOSE__/g, '}')
  }

  return processed
}

/**
 * 상세한 보간 결과 반환
 */
export function interpolateWithDetails(
  format: string,
  data: WeddingData,
  options: InterpolateOptions = {}
): InterpolateResult {
  const usedPaths = extractBindingsFromFormat(format)
  const missingPaths: string[] = []

  // 각 경로 검사
  for (const path of usedPaths) {
    const value = resolveBinding(data, path, options)
    if (value === null || value === undefined) {
      missingPaths.push(path)
    }
  }

  const result = interpolate(format, data, options)

  return {
    result,
    usedPaths,
    missingPaths,
    isComplete: missingPaths.length === 0,
  }
}

// ============================================
// Template Functions
// ============================================

/**
 * 조건부 텍스트 생성
 *
 * @example
 * conditionalText(data, 'venue.hall', '{{venue.hall}} 홀')
 * // '그랜드볼룸 홀' 또는 '' (hall이 없으면)
 */
export function conditionalText(
  data: WeddingData,
  conditionPath: VariablePath,
  template: string
): string {
  const value = resolveBinding(data, conditionPath)
  if (!value) return ''
  return interpolate(template, data)
}

/**
 * 선택적 접두사/접미사 추가
 *
 * @example
 * withPrefix(data, 'venue.floor', '층')
 * // '3층' 또는 '' (floor가 없으면)
 */
export function withPrefix(
  data: WeddingData,
  path: VariablePath,
  prefix: string
): string {
  const value = resolveBinding(data, path)
  if (!value) return ''
  return `${prefix}${value}`
}

export function withSuffix(
  data: WeddingData,
  path: VariablePath,
  suffix: string
): string {
  const value = resolveBinding(data, path)
  if (!value) return ''
  return `${value}${suffix}`
}

/**
 * 여러 값을 구분자로 연결
 *
 * @example
 * joinValues(data, ['venue.name', 'venue.hall'], ' ')
 * // '그랜드호텔 그랜드볼룸'
 */
export function joinValues(
  data: WeddingData,
  paths: VariablePath[],
  separator: string = ' '
): string {
  return paths
    .map(path => resolveBinding(data, path))
    .filter(v => v !== null && v !== undefined && v !== '')
    .join(separator)
}

// ============================================
// Predefined Templates
// ============================================

/**
 * 자주 사용하는 템플릿들
 */
export const TEMPLATES = {
  // 커플 이름
  coupleNames: '{groom.name} ♥ {bride.name}',
  coupleNamesEn: '{groom.nameEn} & {bride.nameEn}',
  coupleNamesWithRole: '신랑 {groom.name} · 신부 {bride.name}',

  // 예식 날짜/시간
  dateTime: '{wedding.dateDisplay} {wedding.timeDisplay}',
  dateOnly: '{wedding.dateDisplay}',
  timeOnly: '{wedding.timeDisplay}',
  dday: '{wedding.dday}',

  // 예식장
  venueFullAddress: '{venue.name} {venue.hall}\n{venue.address}',
  venueName: '{venue.name} {venue.hall}',
  venueAddress: '{venue.address} {venue.addressDetail}',

  // 혼주 (예시)
  groomParents: '아버지 {groom.fatherName} · 어머니 {groom.motherName}',
  brideParents: '아버지 {bride.fatherName} · 어머니 {bride.motherName}',

  // 계좌 정보
  groomAccount: '{groom.account}',
  brideAccount: '{bride.account}',
} as const

/**
 * 미리 정의된 템플릿 사용
 */
export function useTemplate(
  templateKey: keyof typeof TEMPLATES,
  data: WeddingData,
  options?: InterpolateOptions
): string {
  return interpolate(TEMPLATES[templateKey], data, options)
}

// ============================================
// Validation
// ============================================

/**
 * 포맷 문자열이 유효한지 검사
 */
export function validateFormat(format: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // 중괄호 균형 확인
  let depth = 0
  for (let i = 0; i < format.length; i++) {
    const char = format[i]
    const nextChar = format[i + 1]

    // 이스케이프된 중괄호 무시
    if (char === '{' && nextChar === '{') {
      i++
      continue
    }
    if (char === '}' && nextChar === '}') {
      i++
      continue
    }

    if (char === '{') depth++
    if (char === '}') depth--

    if (depth < 0) {
      errors.push(`Unexpected closing brace at position ${i}`)
      depth = 0
    }
  }

  if (depth !== 0) {
    errors.push('Unbalanced braces in format string')
  }

  // 빈 변수 확인
  const emptyVarRegex = /\{\s*\}/g
  if (emptyVarRegex.test(format)) {
    errors.push('Empty variable placeholder found')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Binding Resolver - 변수 바인딩 해석
 *
 * VariablePath를 실제 값으로 변환
 * 예: 'groom.name' → '김철수'
 */

import type { WeddingData, VariablePath } from '../schema/types'

// ============================================
// Types
// ============================================

export type BindingValue = string | number | boolean | null | undefined

export interface ResolveOptions {
  // 값이 없을 때 기본값
  defaultValue?: BindingValue
  // 날짜 포맷 (wedding.date, wedding.dateDisplay용)
  dateFormat?: 'iso' | 'korean' | 'short' | 'full'
  // 배열 인덱스 (photos.gallery[0] 등)
  arrayIndex?: number
}

// ============================================
// Main Functions
// ============================================

/**
 * 변수 경로로 값 가져오기
 */
export function resolveBinding(
  data: WeddingData,
  path: VariablePath,
  options: ResolveOptions = {}
): BindingValue {
  const { defaultValue = null } = options

  try {
    const value = getValueByPath(data, path, options)
    return value ?? defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * 경로로 객체에서 값 가져오기
 * 점(.) 표기법 지원: 'groom.name', 'venue.coordinates.lat'
 */
export function getValueByPath(
  data: WeddingData,
  path: string,
  options: ResolveOptions = {}
): BindingValue {
  // Computed 필드 처리
  if (isComputedField(path)) {
    return resolveComputedField(data, path, options)
  }

  const parts = path.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = data

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined
    }

    // 배열 인덱스 처리: photos.gallery[0]
    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/)
    if (arrayMatch) {
      const [, key, indexStr] = arrayMatch
      const index = parseInt(indexStr, 10)
      current = current[key]?.[index]
    } else {
      current = current[part]
    }
  }

  // 객체인 경우 적절한 문자열 변환
  if (typeof current === 'object' && current !== null) {
    // 계좌 정보
    if ('bank' in current && 'number' in current) {
      return `${current.bank} ${current.number} (${current.holder})`
    }
    // 좌표 정보
    if ('lat' in current && 'lng' in current) {
      return `${current.lat},${current.lng}`
    }
    // 사진 정보
    if ('url' in current) {
      return current.url
    }
    return JSON.stringify(current)
  }

  return current
}

// ============================================
// Computed Fields
// ============================================

const COMPUTED_FIELDS = [
  'wedding.dateDisplay',
  'wedding.dday',
  'wedding.dayOfWeek',
  'wedding.timeDisplay',
] as const

type ComputedField = typeof COMPUTED_FIELDS[number]

function isComputedField(path: string): path is ComputedField {
  return COMPUTED_FIELDS.includes(path as ComputedField)
}

function resolveComputedField(
  data: WeddingData,
  field: ComputedField,
  options: ResolveOptions
): BindingValue {
  switch (field) {
    case 'wedding.dateDisplay':
      return formatWeddingDate(data.wedding.date, options.dateFormat)

    case 'wedding.dday':
      return calculateDday(data.wedding.date)

    case 'wedding.dayOfWeek':
      return getDayOfWeek(data.wedding.date)

    case 'wedding.timeDisplay':
      return formatTime(data.wedding.time)

    default:
      return null
  }
}

// ============================================
// Date/Time Formatting
// ============================================

/**
 * 결혼식 날짜 포맷팅
 * @param dateStr ISO 8601 형식 (2025-03-15)
 * @param format 출력 형식
 */
export function formatWeddingDate(
  dateStr: string,
  format: ResolveOptions['dateFormat'] = 'korean'
): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = getDayOfWeek(dateStr)

  switch (format) {
    case 'iso':
      return dateStr

    case 'short':
      return `${month}월 ${day}일`

    case 'full':
      return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`

    case 'korean':
    default:
      return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`
  }
}

/**
 * D-day 계산
 */
export function calculateDday(dateStr: string): string {
  const weddingDate = new Date(dateStr)
  const today = new Date()

  // 시간 제거하고 날짜만 비교
  weddingDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const diffTime = weddingDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'D-Day'
  if (diffDays > 0) return `D-${diffDays}`
  return `D+${Math.abs(diffDays)}`
}

/**
 * 요일 반환
 */
export function getDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return days[date.getDay()]
}

/**
 * 시간 포맷팅
 * @param timeStr HH:mm 형식 (14:00)
 */
export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number)
  const period = hours < 12 ? '오전' : '오후'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours

  if (minutes === 0) {
    return `${period} ${displayHours}시`
  }
  return `${period} ${displayHours}시 ${minutes}분`
}

// ============================================
// Validation
// ============================================

/**
 * 유효한 VariablePath인지 확인
 */
export function isValidVariablePath(path: string): path is VariablePath {
  // 커스텀 경로는 항상 유효
  if (path.startsWith('custom.')) {
    return true
  }

  const validPaths: string[] = [
    // 신랑
    'groom.name', 'groom.nameEn', 'groom.fatherName', 'groom.motherName',
    'groom.fatherPhone', 'groom.motherPhone', 'groom.phone', 'groom.account',
    // 신부
    'bride.name', 'bride.nameEn', 'bride.fatherName', 'bride.motherName',
    'bride.fatherPhone', 'bride.motherPhone', 'bride.phone', 'bride.account',
    // 예식
    'wedding.date', 'wedding.time', 'wedding.dateDisplay', 'wedding.dday',
    // 예식장
    'venue.name', 'venue.hall', 'venue.floor', 'venue.address',
    'venue.addressDetail', 'venue.coordinates', 'venue.phone',
    'venue.parkingInfo', 'venue.transportInfo',
    // 사진
    'photos.main', 'photos.gallery',
    // 인사말
    'greeting.title', 'greeting.content',
    // 음악
    'music.url', 'music.title', 'music.artist',
  ]

  return validPaths.includes(path)
}

/**
 * 커스텀 변수 경로인지 확인
 */
export function isCustomVariablePath(path: string): boolean {
  return path.startsWith('custom.')
}

/**
 * 커스텀 변수 키 추출 (custom.title → title)
 */
export function getCustomVariableKey(path: string): string | null {
  if (!isCustomVariablePath(path)) return null
  return path.slice('custom.'.length)
}

/**
 * 경로에서 최상위 카테고리 추출
 */
export function getPathCategory(path: VariablePath): string {
  return path.split('.')[0]
}

/**
 * 경로에서 필드명 추출
 */
export function getPathField(path: VariablePath): string {
  const parts = path.split('.')
  return parts[parts.length - 1]
}

// ============================================
// Batch Resolution
// ============================================

/**
 * 여러 바인딩을 한번에 해석
 */
export function resolveManyBindings(
  data: WeddingData,
  paths: VariablePath[]
): Map<VariablePath, BindingValue> {
  const result = new Map<VariablePath, BindingValue>()
  for (const path of paths) {
    result.set(path, resolveBinding(data, path))
  }
  return result
}

/**
 * 사용된 모든 바인딩 경로 추출 (포맷 문자열에서)
 */
export function extractBindingsFromFormat(format: string): VariablePath[] {
  const regex = /\{([^}]+)\}/g
  const paths: VariablePath[] = []
  let match

  while ((match = regex.exec(format)) !== null) {
    const path = match[1]
    if (isValidVariablePath(path)) {
      paths.push(path)
    }
  }

  return paths
}

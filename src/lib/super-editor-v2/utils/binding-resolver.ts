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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BindingValue = string | number | boolean | null | undefined | any[]

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

  // 배열인 경우 URL 배열로 정규화 (갤러리 등에서 사용)
  if (Array.isArray(current)) {
    // 혼합 형식 지원: 문자열과 {id, url, order} 객체가 섞여있을 수 있음
    return current.map((item) => {
      if (typeof item === 'string') {
        return item
      }
      if (typeof item === 'object' && item !== null && 'url' in item) {
        return (item as { url: string }).url
      }
      return null
    }).filter((url): url is string => url !== null)
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
  // 날짜/시간 표시
  'wedding.dateDisplay',
  'wedding.dateDot',  // YYYY.MM.DD 형식
  'wedding.dateMonthDay',  // MM.DD 형식
  'wedding.timeDisplay',
  'wedding.dday',
  // 날짜 분해 필드
  'wedding.year',
  'wedding.month',
  'wedding.day',
  'wedding.weekday',  // dayOfWeek → weekday로 rename
  // 날짜 오프셋 (±2일 범위)
  'wedding.weekdayMinus2',
  'wedding.weekdayMinus1',
  'wedding.weekdayPlus1',
  'wedding.weekdayPlus2',
  'wedding.dayMinus2',
  'wedding.dayMinus1',
  'wedding.dayPlus1',
  'wedding.dayPlus2',
  // 실시간 카운트다운
  'countdown.days',
  'countdown.hours',
  'countdown.minutes',
  'countdown.seconds',
  // Legacy 호환
  'wedding.dayOfWeek',
] as const

// 공지 카드 아이콘 타입 → SVG 경로 매핑 (카드 렌더링에서 사용)
export const NOTICE_ICON_PATHS: Record<string, string | null> = {
  'birds-blue': '/assets/notice1.svg',
  'birds-orange': '/assets/notice2.svg',
  'birds-green': '/assets/notice3.svg',
  'none': null,
}

type ComputedField = typeof COMPUTED_FIELDS[number]

function isComputedField(path: string): path is ComputedField {
  return COMPUTED_FIELDS.includes(path as ComputedField)
}

function resolveComputedField(
  data: WeddingData,
  field: ComputedField,
  options: ResolveOptions
): BindingValue {
  const dateStr = data.wedding?.date

  // 날짜가 없으면 null 반환 (0이 아닌)
  if (!dateStr && field.startsWith('countdown.')) {
    return null
  }

  switch (field) {
    case 'wedding.dateDisplay':
      return formatWeddingDateWithTime(dateStr, data.wedding?.time, options.dateFormat)

    case 'wedding.dateDot':
      return formatDateDot(dateStr)  // YYYY.MM.DD 형식

    case 'wedding.dateMonthDay':
      return formatDateMonthDay(dateStr)  // MM.DD 형식

    case 'wedding.timeDisplay':
      return formatTime(data.wedding?.time)

    case 'wedding.dday':
      return calculateDday(dateStr)

    case 'wedding.year':
      return getYear(dateStr)

    case 'wedding.month':
      return getMonth(dateStr)

    case 'wedding.day':
      return getDay(dateStr)

    case 'wedding.weekday':
    case 'wedding.dayOfWeek':  // Legacy 호환
      return getDayOfWeek(dateStr)

    // 요일 오프셋 (-2, -1, +1, +2)
    case 'wedding.weekdayMinus2':
      return getDayOfWeekOffset(dateStr, -2)

    case 'wedding.weekdayMinus1':
      return getDayOfWeekOffset(dateStr, -1)

    case 'wedding.weekdayPlus1':
      return getDayOfWeekOffset(dateStr, 1)

    case 'wedding.weekdayPlus2':
      return getDayOfWeekOffset(dateStr, 2)

    // 날짜 오프셋 (-2, -1, +1, +2)
    case 'wedding.dayMinus2':
      return getDayOffset(dateStr, -2)

    case 'wedding.dayMinus1':
      return getDayOffset(dateStr, -1)

    case 'wedding.dayPlus1':
      return getDayOffset(dateStr, 1)

    case 'wedding.dayPlus2':
      return getDayOffset(dateStr, 2)

    case 'countdown.days':
      return getStaticCountdown(dateStr).days

    case 'countdown.hours':
      return getStaticCountdown(dateStr).hours

    case 'countdown.minutes':
      return getStaticCountdown(dateStr).minutes

    case 'countdown.seconds':
      return getStaticCountdown(dateStr).seconds

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
 * 결혼식 날짜 + 시간 포맷팅
 * @param dateStr ISO 8601 형식 (2025-03-15)
 * @param timeStr HH:mm 형식 (14:00)
 * @param format 출력 형식
 */
export function formatWeddingDateWithTime(
  dateStr: string,
  timeStr?: string,
  format: ResolveOptions['dateFormat'] = 'korean'
): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = getDayOfWeek(dateStr)

  // 시간이 없으면 날짜만 반환
  if (!timeStr) {
    return `${month}월 ${day}일 ${dayOfWeek}요일`
  }

  const timeDisplay = formatTime(timeStr)

  switch (format) {
    case 'iso':
      return `${dateStr} ${timeStr}`

    case 'short':
      return `${month}월 ${day}일 ${timeDisplay}`

    case 'full':
    case 'korean':
    default:
      return `${month}월 ${day}일 ${dayOfWeek}요일 ${timeDisplay}`
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
 * 오프셋 날짜의 요일 반환
 * @param dateStr 기준 날짜
 * @param offset 오프셋 (음수: 이전, 양수: 이후)
 */
export function getDayOfWeekOffset(dateStr: string, offset: number): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  date.setDate(date.getDate() + offset)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return days[date.getDay()]
}

/**
 * 오프셋 날짜의 일(day) 반환
 * @param dateStr 기준 날짜
 * @param offset 오프셋 (음수: 이전, 양수: 이후)
 */
export function getDayOffset(dateStr: string, offset: number): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  date.setDate(date.getDate() + offset)
  return String(date.getDate())
}

/**
 * 년도 반환
 */
export function getYear(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  return String(date.getFullYear())
}

/**
 * 월 반환
 */
export function getMonth(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  return String(date.getMonth() + 1).padStart(2, '0')
}

/**
 * YYYY.MM.DD 형식으로 날짜 포맷
 */
export function formatDateDot(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

/**
 * MM.DD 형식으로 날짜 포맷
 */
export function formatDateMonthDay(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}.${day}`
}

/**
 * 일 반환
 */
export function getDay(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  return String(date.getDate()).padStart(2, '0')
}

/**
 * 정적 카운트다운 (Hydration 안전)
 *
 * SSR/클라이언트에서 동일한 값을 반환하도록 설계:
 * - days: 날짜 기준 계산 (시간 무시)
 * - hours/minutes/seconds: 0으로 고정
 *
 * 실시간 업데이트가 필요하면 클라이언트에서 useCountdown 훅 사용
 */
function getStaticCountdown(dateStr: string): {
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const weddingDate = new Date(dateStr)

  if (isNaN(weddingDate.getTime())) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  // 날짜만 비교 (시간 제거) - 서버/클라이언트 동일 결과 보장
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  weddingDate.setHours(0, 0, 0, 0)

  const diff = weddingDate.getTime() - today.getTime()
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))

  // 시/분/초는 0으로 고정 (Hydration 안정성)
  return { days, hours: 0, minutes: 0, seconds: 0 }
}

/**
 * 카운트다운 계산 (실시간 갱신용 - 클라이언트 전용)
 */
export function getCountdown(dateStr: string): {
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const weddingDate = new Date(dateStr)
  const now = new Date()

  if (isNaN(weddingDate.getTime())) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const diff = weddingDate.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
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
    // ─── 공유 필드 (◆ 원본) ───
    'couple.groom.name', 'couple.groom.nameEn', 'couple.groom.phone', 'couple.groom.intro', 'couple.groom.baptismalName',
    'couple.groom.photo', 'couple.groom.birthDate', 'couple.groom.mbti', 'couple.groom.tags',
    'couple.bride.name', 'couple.bride.nameEn', 'couple.bride.phone', 'couple.bride.intro', 'couple.bride.baptismalName',
    'couple.bride.photo', 'couple.bride.birthDate', 'couple.bride.mbti', 'couple.bride.tags',
    'couple.photo', 'couple.photos',
    'wedding.date', 'wedding.time',

    // ─── 자동 계산 (__HIDDEN__) ───
    'wedding.dateDisplay', 'wedding.dateDot', 'wedding.timeDisplay', 'wedding.dday',
    'wedding.year', 'wedding.month', 'wedding.day', 'wedding.weekday',
    'wedding.weekdayMinus2', 'wedding.weekdayMinus1', 'wedding.weekdayPlus1', 'wedding.weekdayPlus2',
    'wedding.dayMinus2', 'wedding.dayMinus1', 'wedding.dayPlus1', 'wedding.dayPlus2',
    'countdown.days', 'countdown.hours', 'countdown.minutes', 'countdown.seconds',

    // ─── 혼주 ───
    'parents.deceasedIcon',
    'parents.groom.birthOrder', 'parents.bride.birthOrder',
    'parents.groom.father.name', 'parents.groom.father.status', 'parents.groom.father.phone', 'parents.groom.father.baptismalName',
    'parents.groom.mother.name', 'parents.groom.mother.status', 'parents.groom.mother.phone', 'parents.groom.mother.baptismalName',
    'parents.bride.father.name', 'parents.bride.father.status', 'parents.bride.father.phone', 'parents.bride.father.baptismalName',
    'parents.bride.mother.name', 'parents.bride.mother.status', 'parents.bride.mother.phone', 'parents.bride.mother.baptismalName',

    // ─── 장소 ───
    'venue.name', 'venue.hall', 'venue.address', 'venue.tel',
    'venue.lat', 'venue.lng',
    'venue.naverUrl', 'venue.kakaoUrl', 'venue.tmapUrl',
    'venue.transportation.bus', 'venue.transportation.subway',
    'venue.transportation.shuttle', 'venue.transportation.parking', 'venue.transportation.etc',

    // ─── 사진 ───
    'photos.main', 'photos.gallery',

    // ─── 섹션 설정 ───
    'intro.message',
    'greeting.title', 'greeting.content',
    'contact.showParents',
    'gallery.effect',
    'accounts.groom', 'accounts.bride', 'accounts.kakaopay.groom', 'accounts.kakaopay.bride',
    'rsvp.title', 'rsvp.description', 'rsvp.deadline',
    'notice.sectionTitle', 'notice.title', 'notice.description', 'notice.items',
    'guestbook.title', 'guestbook.placeholder',
    'ending.message', 'ending.photo',
    'bgm.trackId', 'bgm.title', 'bgm.artist',
    'video.type', 'video.url', 'video.title',

    // ─── 확장 섹션 ───
    'interview.title', 'interview.subtitle', 'interview.items',
    'timeline.title', 'timeline.subtitle', 'timeline.items',

    // ─── Legacy 호환 ───
    'groom.name', 'groom.nameEn', 'groom.fatherName', 'groom.motherName',
    'groom.fatherPhone', 'groom.motherPhone', 'groom.phone', 'groom.account',
    'bride.name', 'bride.nameEn', 'bride.fatherName', 'bride.motherName',
    'bride.fatherPhone', 'bride.motherPhone', 'bride.phone', 'bride.account',
    'venue.floor', 'venue.addressDetail', 'venue.coordinates',
    'venue.phone', 'venue.parkingInfo', 'venue.transportInfo',
    'music.url', 'music.title', 'music.artist',
    'wedding.dayOfWeek',
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

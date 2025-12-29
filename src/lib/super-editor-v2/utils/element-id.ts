/**
 * Super Editor v2 - Element ID System
 *
 * AI 프롬프트에서 특정 요소를 참조하기 위한 ID 시스템
 * - binding이 있으면 의미 있는 ID (예: 'groom-name')
 * - 없으면 타입 + 해시 (예: 'text-a3f2')
 */

import type { Element, Block, VariablePath } from '../schema/types'

// ============================================
// Binding to ID Mapping
// ============================================

/**
 * 바인딩 경로를 사람이 읽기 쉬운 ID로 변환하는 매핑
 */
export const BINDING_TO_ID: Record<string, string> = {
  // 신랑 정보
  'groom.name': 'groom-name',
  'groom.nameEn': 'groom-name-en',
  'groom.phone': 'groom-phone',
  'groom.fatherName': 'groom-father',
  'groom.motherName': 'groom-mother',
  'groom.fatherPhone': 'groom-father-phone',
  'groom.motherPhone': 'groom-mother-phone',
  'groom.familyOrder': 'groom-order',

  // 신부 정보
  'bride.name': 'bride-name',
  'bride.nameEn': 'bride-name-en',
  'bride.phone': 'bride-phone',
  'bride.fatherName': 'bride-father',
  'bride.motherName': 'bride-mother',
  'bride.fatherPhone': 'bride-father-phone',
  'bride.motherPhone': 'bride-mother-phone',
  'bride.familyOrder': 'bride-order',

  // 예식 정보
  'wedding.date': 'wedding-date',
  'wedding.dateDisplay': 'wedding-date-display',
  'wedding.time': 'wedding-time',
  'wedding.timeDisplay': 'wedding-time-display',
  'wedding.dayOfWeek': 'wedding-day',

  // 예식장 정보
  'venue.name': 'venue-name',
  'venue.hall': 'venue-hall',
  'venue.floor': 'venue-floor',
  'venue.address': 'venue-address',
  'venue.addressDetail': 'venue-address-detail',
  'venue.phone': 'venue-phone',
  'venue.lat': 'venue-lat',
  'venue.lng': 'venue-lng',
  'venue.parkingInfo': 'venue-parking',
  'venue.transportInfo': 'venue-transport',

  // 사진
  'photos.main': 'main-photo',
  'photos.gallery': 'gallery',

  // 인사말
  'greeting.title': 'greeting-title',
  'greeting.content': 'greeting-content',

  // 음악
  'music.url': 'music-url',
  'music.title': 'music-title',
  'music.artist': 'music-artist',
  'music.autoPlay': 'music-autoplay',
}

/**
 * ID를 바인딩 경로로 역변환하는 매핑
 */
export const ID_TO_BINDING: Record<string, string> = Object.entries(BINDING_TO_ID).reduce(
  (acc, [binding, id]) => {
    acc[id] = binding
    return acc
  },
  {} as Record<string, string>
)

// ============================================
// Display ID Functions
// ============================================

/**
 * 요소의 표시용 ID 생성
 * - binding이 있으면 의미 있는 ID (예: 'groom-name')
 * - 없으면 타입 + 해시 (예: 'text-a3f2')
 */
export function getDisplayId(element: Element, block?: Block): string {
  // 1. binding이 있으면 의미 있는 ID 생성
  if (element.binding) {
    return bindingToId(element.binding)
  }

  // 2. 블록 타입 + 요소 타입 + 짧은 해시
  const prefix = block ? `${block.type}-` : ''
  return `${prefix}${element.type}-${element.id.slice(-4)}`
}

/**
 * 바인딩 경로를 ID로 변환
 */
export function bindingToId(binding: VariablePath): string {
  return BINDING_TO_ID[binding] || binding.replace(/\./g, '-')
}

/**
 * ID를 바인딩 경로로 변환
 */
export function idToBinding(id: string): VariablePath | null {
  return (ID_TO_BINDING[id] as VariablePath) || null
}

/**
 * 문자열을 URL-safe slug로 변환
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s가-힣-]/g, '') // 특수문자 제거 (한글 허용)
    .replace(/[\s_]+/g, '-') // 공백/언더스코어를 하이픈으로
    .replace(/^-+|-+$/g, '') // 앞뒤 하이픈 제거
    .slice(0, 30) // 최대 길이 제한
}

// ============================================
// ID Parsing Functions
// ============================================

/**
 * 프롬프트에서 #id 형태의 요소 참조 추출
 * 예: "#groom-name과 #bride-name을 세로로 배치해줘"
 *     -> ['groom-name', 'bride-name']
 */
export function extractElementIds(prompt: string): string[] {
  const matches = prompt.match(/#[\w-]+/g)
  if (!matches) return []

  return matches.map(match => match.slice(1)) // # 제거
}

/**
 * 문서에서 ID로 요소 찾기
 */
export function findElementById(
  blocks: Block[],
  targetId: string
): { element: Element; block: Block } | null {
  for (const block of blocks) {
    for (const element of block.elements || []) {
      const displayId = getDisplayId(element, block)
      if (displayId === targetId) {
        return { element, block }
      }
    }
  }
  return null
}

/**
 * 문서에서 바인딩으로 요소 찾기
 */
export function findElementByBinding(
  blocks: Block[],
  binding: VariablePath
): { element: Element; block: Block } | null {
  for (const block of blocks) {
    for (const element of block.elements || []) {
      if (element.binding === binding) {
        return { element, block }
      }
    }
  }
  return null
}

// ============================================
// ID Copy Helper
// ============================================

/**
 * ID를 클립보드에 복사
 */
export async function copyIdToClipboard(id: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(`#${id}`)
    return true
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = `#${id}`
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  }
}

// ============================================
// Unit Conversion Utilities
// ============================================

/**
 * px를 vw로 변환
 * @param px 픽셀 값
 * @param viewportWidth 뷰포트 너비 (기본 375px - 모바일)
 */
export function pxToVw(px: number, viewportWidth: number = 375): number {
  return (px / viewportWidth) * 100
}

/**
 * vw를 px로 변환
 */
export function vwToPx(vw: number, viewportWidth: number = 375): number {
  return (vw / 100) * viewportWidth
}

/**
 * px를 vh로 변환
 * @param px 픽셀 값
 * @param viewportHeight 뷰포트 높이 (기본 667px - 모바일)
 */
export function pxToVh(px: number, viewportHeight: number = 667): number {
  return (px / viewportHeight) * 100
}

/**
 * vh를 px로 변환
 */
export function vhToPx(vh: number, viewportHeight: number = 667): number {
  return (vh / 100) * viewportHeight
}

/**
 * px를 퍼센트로 변환 (컨테이너 기준)
 */
export function pxToPercent(px: number, containerSize: number): number {
  if (containerSize === 0) return 0
  return (px / containerSize) * 100
}

/**
 * 퍼센트를 px로 변환
 */
export function percentToPx(percent: number, containerSize: number): number {
  return (percent / 100) * containerSize
}

/**
 * px를 rem으로 변환 (접근성)
 *
 * 사용자의 브라우저/시스템 폰트 크기 설정을 존중하기 위해
 * fontSize에 rem 단위를 사용합니다.
 *
 * @param px 픽셀 값
 * @param baseFontSize 기준 폰트 크기 (기본 16px)
 * @returns rem 문자열 (예: "1.5rem")
 */
export function pxToRem(px: number, baseFontSize: number = 16): string {
  return `${px / baseFontSize}rem`
}

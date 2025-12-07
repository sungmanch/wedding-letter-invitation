/**
 * Intro Builder Types
 * PrimitiveNode 기반 인트로 빌더 타입 정의
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { PredefinedTemplatePreset, LegacyColorPalette, LegacyFontConfig } from '../types'

// ============================================
// Builder Context
// ============================================

export interface IntroBuilderContext {
  preset: PredefinedTemplatePreset
  data: IntroBuilderData
}

export interface IntroBuilderData {
  groomName: string
  brideName: string
  weddingDate: string
  venueName?: string
  mainImage?: string
}

// ============================================
// Builder Result
// ============================================

export interface IntroBuilderResult {
  root: PrimitiveNode
  /**
   * 인트로에 필요한 추가 CSS (필름 그레인, 글래스모피즘 등)
   */
  additionalStyles?: string
}

// ============================================
// Builder Function Type
// ============================================

export type IntroBuilder = (ctx: IntroBuilderContext) => IntroBuilderResult

// ============================================
// Helpers
// ============================================

/**
 * 고유 ID 생성
 */
let idCounter = 0
export function uid(prefix = 'node'): string {
  return `${prefix}_${++idCounter}`
}

export function resetIdCounter(): void {
  idCounter = 0
}

/**
 * 날짜 포맷
 */
export function formatDate(dateStr: string): { formatted: string; weekday: string } {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekday = date.toLocaleDateString('ko-KR', { weekday: 'long' })
  return {
    formatted: `${year}. ${month}. ${day}`,
    weekday,
  }
}

/**
 * 컬러 유틸리티
 */
export function withOpacity(color: string, opacity: number): string {
  // hex to rgba
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  return color
}

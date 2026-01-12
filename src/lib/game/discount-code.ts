/**
 * Discount Code Generator for Memory Game
 */

import type { ScoreGrade } from './score-calculator'

/**
 * 할인 코드 생성 (클라이언트용 - 실제 코드는 서버에서 생성)
 */
export function generateDiscountCodePreview(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'WEDDING-'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * 할인 정보 인터페이스
 */
export interface DiscountInfo {
  code: string
  discountPercent: number
  grade: ScoreGrade
  expiresAt: Date
}

/**
 * 할인 코드 유효기간 (7일)
 */
export const DISCOUNT_CODE_VALIDITY_DAYS = 7

/**
 * 만료일 계산
 */
export function calculateExpiryDate(): Date {
  const date = new Date()
  date.setDate(date.getDate() + DISCOUNT_CODE_VALIDITY_DAYS)
  return date
}

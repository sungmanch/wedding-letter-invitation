/**
 * Score Calculator for Memory Game
 *
 * 시간과 실수 횟수에 따른 점수 계산
 */

export type ScoreGrade = 'S' | 'A' | 'B' | 'C'

export interface ScoreResult {
  score: number
  grade: ScoreGrade
  timeSeconds: number
  mistakes: number
  discountPercent: number
}

// 기본 점수
const BASE_SCORE = 1000

// 시간 패널티 (초당)
const TIME_PENALTY_PER_SECOND = 5

// 실수 패널티 (회당)
const MISTAKE_PENALTY = 30

// 등급별 점수 기준
const GRADE_THRESHOLDS = {
  S: 800,  // 800+ = S등급
  A: 600,  // 600-799 = A등급
  B: 400,  // 400-599 = B등급
  // 400 미만 = C등급
}

// 등급별 할인율
const DISCOUNT_BY_GRADE: Record<ScoreGrade, number> = {
  S: 50,  // 50%
  A: 30,  // 30%
  B: 20,  // 20%
  C: 0,   // 0%
}

/**
 * 점수 등급 계산
 */
export function calculateGrade(score: number): ScoreGrade {
  if (score >= GRADE_THRESHOLDS.S) return 'S'
  if (score >= GRADE_THRESHOLDS.A) return 'A'
  if (score >= GRADE_THRESHOLDS.B) return 'B'
  return 'C'
}

/**
 * 최종 점수 계산
 */
export function calculateScore(timeMs: number, mistakes: number): ScoreResult {
  const timeSeconds = Math.floor(timeMs / 1000)

  // 점수 계산: 기본 점수 - 시간 패널티 - 실수 패널티
  let score = BASE_SCORE
  score -= timeSeconds * TIME_PENALTY_PER_SECOND
  score -= mistakes * MISTAKE_PENALTY

  // 최소 0점
  score = Math.max(0, score)

  const grade = calculateGrade(score)
  const discountPercent = DISCOUNT_BY_GRADE[grade]

  return {
    score,
    grade,
    timeSeconds,
    mistakes,
    discountPercent,
  }
}

/**
 * 시간 포맷팅 (MM:SS)
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * 등급에 따른 색상 (브랜드 팔레트 기반)
 * - S: Gold (특별한 느낌)
 * - A: Blush-600 (브랜드 primary)
 * - B: Blush-400 (브랜드 accent)
 * - C: Gray (neutral)
 */
export function getGradeColor(grade: ScoreGrade): string {
  switch (grade) {
    case 'S': return '#C9A962'  // WKW Gold (브랜드 골드)
    case 'A': return '#BE6B7C'  // Blush-600
    case 'B': return '#DFA0AC'  // Blush-400
    case 'C': return '#999999'  // Text-light
  }
}

/**
 * 등급에 따른 메시지
 */
export function getGradeMessage(grade: ScoreGrade): string {
  switch (grade) {
    case 'S': return '완벽해요! 기억력 천재!'
    case 'A': return '훌륭해요! 대단한 집중력!'
    case 'B': return '잘했어요! 조금만 더 연습하면!'
    case 'C': return '다시 도전해보세요!'
  }
}

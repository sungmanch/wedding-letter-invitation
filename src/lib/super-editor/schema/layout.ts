/**
 * Super Editor - Layout Schema
 * LLM이 생성하는 디자인 레이아웃 구조
 */

import type { PrimitiveNode, CSSProperties } from './primitives'

// ============================================
// Layout Schema (LLM Generated)
// ============================================

export interface LayoutSchema {
  version: '1.0'
  meta: LayoutMeta
  screens: Screen[]
  globals?: GlobalSettings
}

export interface LayoutMeta {
  id: string
  name: string
  description?: string
  category: LayoutCategory
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export type LayoutCategory =
  | 'chat'           // 카카오톡 스타일
  | 'story'          // 인스타그램 스토리
  | 'letter'         // 편지/봉투
  | 'album'          // 앨범/포토북
  | 'scroll'         // 세로 스크롤
  | 'slide'          // 가로 슬라이드
  | 'magazine'       // 매거진 레이아웃
  | 'minimal'        // 미니멀
  | 'classic'        // 클래식
  | 'custom'         // 커스텀

// ============================================
// Screen Definition
// ============================================

export interface Screen {
  id: string
  name?: string
  type: ScreenType
  root: PrimitiveNode
  transition?: ScreenTransition
  triggers?: ScreenTrigger[]
}

export type ScreenType =
  | 'intro'          // 인트로 화면
  | 'content'        // 콘텐츠 화면
  | 'gallery'        // 갤러리 화면
  | 'form'           // 입력 폼
  | 'map'            // 지도 화면
  | 'outro'          // 아웃트로
  | 'custom'         // 커스텀

export interface ScreenTransition {
  preset: string     // TransitionPreset
  duration?: number
  easing?: string
}

export interface ScreenTrigger {
  event: 'scroll' | 'time' | 'click' | 'swipe'
  action: 'next' | 'prev' | 'goto'
  target?: string    // screen id
  delay?: number
  threshold?: number
}

// ============================================
// Global Settings
// ============================================

export interface GlobalSettings {
  // 기본 폰트 설정
  fonts?: {
    heading?: FontConfig
    body?: FontConfig
    accent?: FontConfig
  }
  // 색상 팔레트
  colors?: {
    primary?: string
    secondary?: string
    accent?: string
    background?: string
    text?: string
    muted?: string
  }
  // 스크롤 설정
  scroll?: {
    snap?: boolean
    snapType?: 'mandatory' | 'proximity'
    smoothScroll?: boolean
  }
  // 배경 설정
  background?: {
    type: 'color' | 'gradient' | 'image' | 'pattern'
    value: string
    overlay?: string
    blur?: number
  }
  // 접근성
  accessibility?: {
    reducedMotion?: boolean
    highContrast?: boolean
  }
}

export interface FontConfig {
  family: string
  weight?: number | string
  letterSpacing?: string
  lineHeight?: string | number
}

// ============================================
// Data Binding Types
// ============================================

/**
 * 데이터 바인딩 표현식
 * - {{path.to.data}} - 단순 바인딩
 * - {{path.to.data | format}} - 포맷터 적용
 * - {{#if condition}}...{{/if}} - 조건부 렌더링
 * - {{#each items as item}}...{{/each}} - 반복 렌더링
 */
export type DataBinding = string

/**
 * 지원하는 포맷터
 */
export type Formatter =
  | 'date'           // 날짜 포맷 (2024년 12월 25일)
  | 'time'           // 시간 포맷 (오후 2:00)
  | 'datetime'       // 날짜+시간
  | 'phone'          // 전화번호 (010-1234-5678)
  | 'currency'       // 통화 (₩50,000)
  | 'uppercase'      // 대문자
  | 'lowercase'      // 소문자
  | 'capitalize'     // 첫글자 대문자
  | 'truncate'       // 말줄임 (... 추가)
  | 'nl2br'          // 줄바꿈 → <br>
  | 'markdown'       // 마크다운 → HTML

// ============================================
// Computed Properties
// ============================================

export interface ComputedProperty {
  name: string
  expression: string
  dependencies?: string[]
}

// ============================================
// Responsive Breakpoints
// ============================================

export interface ResponsiveConfig {
  breakpoints?: {
    sm?: number      // default: 480
    md?: number      // default: 768
    lg?: number      // default: 1024
  }
  defaultViewport?: 'mobile' | 'tablet' | 'desktop'
}

export interface ResponsiveStyle {
  base: CSSProperties
  sm?: CSSProperties
  md?: CSSProperties
  lg?: CSSProperties
}

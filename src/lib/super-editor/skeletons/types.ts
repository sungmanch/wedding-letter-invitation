/**
 * Super Editor - Skeleton Types
 * 섹션 스켈레톤 타입 정의
 */

import type { PrimitiveType, AnimationPreset } from '../schema/primitives'
import type { TokenRef, TokenStyleRef } from '../tokens/schema'

// ============================================
// Section Types
// ============================================

export type SectionType =
  | 'intro' // 인트로 (순서 고정: 1번)
  | 'greeting' // 인사말
  | 'contact' // 연락처 (신랑/신부 전화/SMS)
  | 'venue' // 예식장 위치
  | 'date' // 예식 날짜
  | 'gallery' // 갤러리
  | 'parents' // 부모님 정보
  | 'accounts' // 계좌 정보
  | 'guestbook' // 축하 메시지
  | 'music' // 배경음악 (FAB 형태)

// ============================================
// Skeleton Node
// ============================================

export interface SkeletonNode {
  id: string
  type: PrimitiveType
  // 토큰 참조 스타일 ($token.xxx 형식)
  tokenStyle?: TokenStyleRef
  // 직접 스타일 (토큰 외 고정값)
  style?: Record<string, string | number>
  // props
  props?: Record<string, unknown>
  // 자식 노드
  children?: SkeletonNode[]
}

// ============================================
// Data Slot (데이터 바인딩)
// ============================================

export interface DataSlot {
  id: string
  path: string // 데이터 바인딩 경로 (예: "couple.groom.name")
  type: 'text' | 'image' | 'images' | 'date' | 'time' | 'location' | 'phone' | 'account'
  required: boolean
  description: string
  defaultValue?: unknown
}

// ============================================
// Animation Option
// ============================================

export interface AnimationOption {
  id: string
  name: string
  preset: AnimationPreset | 'none'
  trigger: 'mount' | 'inView' | 'hover'
  duration?: number
}

// ============================================
// Layout Option
// ============================================

export interface LayoutOption {
  id: string
  name: string
  // 해당 옵션 선택 시 변경되는 props
  props: Record<string, unknown>
}

// ============================================
// Skeleton Variant
// ============================================

export interface SkeletonVariant {
  id: string
  name: string
  description?: string
  // 태그 (AI 선택 시 참고)
  tags: string[] // ['minimal', 'elegant', 'playful', 'romantic', 'modern']
  // 구조 템플릿
  structure: SkeletonNode
  // 필수 데이터 바인딩 슬롯
  slots: DataSlot[]
  // 선택 가능한 옵션
  options?: {
    animations?: AnimationOption[]
    layouts?: LayoutOption[]
  }
}

// ============================================
// Section Skeleton
// ============================================

export interface SectionSkeleton {
  sectionType: SectionType
  name: string
  description?: string
  // 변형 목록
  variants: SkeletonVariant[]
  // 기본 변형 ID
  defaultVariant: string
}

// ============================================
// AI Fill Result
// ============================================

export interface SectionFillResult {
  sectionType: SectionType
  variantId: string
  selectedOptions?: {
    animation?: string
    layout?: string
  }
  // 추가 커스텀 텍스트 (선택적)
  customTexts?: {
    title?: string
    subtitle?: string
  }
}

// ============================================
// Screen with Section Type
// ============================================

export interface SectionScreen {
  id: string
  name?: string
  type: 'intro' | 'content' // 기존 ScreenType
  sectionType: SectionType // 새로 추가
  root: SkeletonNode
}

// ============================================
// Type Guards
// ============================================

export function isSectionType(value: string): value is SectionType {
  return [
    'intro',
    'greeting',
    'contact',
    'venue',
    'date',
    'gallery',
    'parents',
    'accounts',
    'guestbook',
    'music',
  ].includes(value)
}

export function isTokenRef(value: unknown): value is TokenRef {
  return typeof value === 'string' && value.startsWith('$token.')
}

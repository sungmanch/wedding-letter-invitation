/**
 * Super Editor v2 - Schema Exports
 */

// Core Types
export * from './types'

// Database Schema
export * from './db-schema'

// ============================================
// Default Values
// ============================================

import type {
  StyleSystem,
  GlobalAnimation,
  WeddingData,
  Block,
  SemanticTokens,
} from './types'

/**
 * 기본 시맨틱 토큰 (minimal-light 프리셋 기반)
 */
export const DEFAULT_SEMANTIC_TOKENS: SemanticTokens = {
  // 배경
  'bg-page': '#FFFFFF',
  'bg-section': '#FAFAFA',
  'bg-section-alt': '#F5F5F5',
  'bg-card': '#FFFFFF',
  'bg-overlay': 'rgba(0, 0, 0, 0.3)',

  // 전경
  'fg-default': '#1A1A1A',
  'fg-muted': '#6B7280',
  'fg-emphasis': '#000000',
  'fg-inverse': '#FFFFFF',
  'fg-on-accent': '#FFFFFF',

  // 강조/액션
  'accent-default': '#C9A962',
  'accent-hover': '#B8983F',
  'accent-active': '#A68A2D',
  'accent-secondary': '#8B7355',

  // 보더
  'border-default': '#E5E7EB',
  'border-emphasis': '#D1D5DB',
  'border-muted': '#F3F4F6',
}

/**
 * 기본 스타일 시스템
 */
export const DEFAULT_STYLE_SYSTEM: StyleSystem = {
  version: 2,
  preset: 'minimal-light',
  typography: {
    preset: 'classic-elegant',
  },
  effects: {
    preset: 'minimal',
  },
}

/**
 * 기본 애니메이션 설정
 */
export const DEFAULT_ANIMATION: GlobalAnimation = {
  mood: 'subtle',
  speed: 1,
}

/**
 * 기본 WeddingData
 */
export const DEFAULT_WEDDING_DATA: WeddingData = {
  groom: {
    name: '',
  },
  bride: {
    name: '',
  },
  wedding: {
    date: '',
    time: '',
  },
  venue: {
    name: '',
    address: '',
  },
  photos: {
    gallery: [],
  },
}

/**
 * 기본 블록 순서 (활성화된 블록)
 */
export const DEFAULT_BLOCK_ORDER: Block['type'][] = [
  'hero',
  'greeting',
  'calendar',
  'gallery',
  'location',
  'parents',
  'account',
  'message',
]

/**
 * 블록 타입별 기본 높이 (vh)
 */
export const DEFAULT_BLOCK_HEIGHTS: Record<Block['type'], number> = {
  // 핵심 섹션
  hero: 100,
  greeting: 60,
  calendar: 80,
  gallery: 100,
  location: 80,
  parents: 60,
  contact: 40,
  account: 80,
  message: 100,
  rsvp: 60,
  // 확장 섹션
  loading: 100,
  quote: 40,
  profile: 80,
  'parents-contact': 40,
  timeline: 100,
  video: 60,
  interview: 80,
  transport: 60,
  notice: 40,
  announcement: 40,
  'flower-gift': 60,
  'together-time': 60,
  dday: 40,
  'guest-snap': 80,
  ending: 60,
  music: 20,
  custom: 60,
}

/**
 * 블록 타입별 한글 라벨
 */
export const BLOCK_TYPE_LABELS: Record<Block['type'], string> = {
  // 핵심 섹션
  hero: '메인',
  greeting: '인사말',
  calendar: '날짜/달력',
  gallery: '갤러리',
  location: '예식장',
  parents: '혼주 소개',
  contact: '연락처',
  account: '축의금',
  message: '방명록',
  rsvp: '참석 여부',
  // 확장 섹션
  loading: '로딩',
  quote: '글귀',
  profile: '프로필',
  'parents-contact': '혼주 연락처',
  timeline: '타임라인',
  video: '영상',
  interview: '인터뷰',
  transport: '교통 안내',
  notice: '안내사항',
  announcement: '안내문',
  'flower-gift': '화환',
  'together-time': '함께한 시간',
  dday: 'D-Day',
  'guest-snap': '게스트스냅',
  ending: '엔딩',
  music: 'BGM',
  custom: '커스텀',
}

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
 * 기본 WeddingData (section-data.md v2.2 기준)
 */
export const DEFAULT_WEDDING_DATA: WeddingData = {
  // ═══ 공유 필드 ═══
  couple: {
    groom: { name: '' },
    bride: { name: '' },
  },
  wedding: {
    date: '',
    time: '',
  },
  venue: {
    name: '',
  },
  photos: {
    gallery: [],
  },

  // ═══ 혼주 정보 ═══
  parents: {
    groom: { father: { name: '' }, mother: { name: '' } },
    bride: { father: { name: '' }, mother: { name: '' } },
  },

  // ═══ 섹션별 설정 ═══
  greeting: {
    title: '',
    content: '',
  },
  accounts: {
    groom: [],
    bride: [],
  },

  // ═══ Legacy 호환 ═══
  groom: { name: '' },
  bride: { name: '' },
}

/**
 * 기본 블록 순서 (활성화된 블록)
 */
export const DEFAULT_BLOCK_ORDER: Block['type'][] = [
  'hero',
  'greeting-parents',
  'profile',
  'calendar',
  'gallery',
  'rsvp',
  'location',
  'notice',
  'account',
  'message',
  'ending',
]

/**
 * 블록 타입별 기본 높이 (vh)
 */
export const DEFAULT_BLOCK_HEIGHTS: Record<Block['type'], number> = {
  // 핵심 섹션
  hero: 100,
  'greeting-parents': 80,
  profile: 80,
  calendar: 80,
  gallery: 100,
  rsvp: 60,
  location: 80,
  notice: 40,
  account: 80,
  message: 100,
  ending: 60,
  // 오버레이/모달
  contact: 85,
  // 기타 기능
  music: 20,
  loading: 100,
  custom: 60,
}

/**
 * 블록 타입별 한글 라벨
 */
export const BLOCK_TYPE_LABELS: Record<Block['type'], string> = {
  // 핵심 섹션
  hero: '메인',
  'greeting-parents': '인사말/혼주',
  profile: '신랑신부 소개',
  calendar: '예식일시',
  gallery: '갤러리',
  rsvp: '참석 여부',
  location: '오시는길',
  notice: '공지사항',
  account: '축의금',
  message: '방명록',
  ending: '엔딩',
  // 오버레이/모달
  contact: '연락처',
  // 기타 기능
  music: 'BGM',
  loading: '로딩',
  custom: '커스텀',
}

/**
 * 기본 블록 템플릿 생성
 * 각 블록 타입별 기본 elements와 binding 포함
 */
export function createDefaultBlocks(): Block[] {
  return [
    // 메인 (Hero)
    {
      id: 'hero-1',
      type: 'hero',
      enabled: true,
      height: DEFAULT_BLOCK_HEIGHTS.hero,
      elements: [
        {
          id: 'hero-main-image',
          type: 'image',
          x: 0, y: 0, width: 100, height: 100, zIndex: 0,
          binding: 'photos.main',
          props: { type: 'image', objectFit: 'cover' },
        },
        {
          id: 'hero-groom-name',
          type: 'text',
          x: 20, y: 40, width: 25, height: 10, zIndex: 1,
          binding: 'couple.groom.name',
          props: { type: 'text' },
        },
        {
          id: 'hero-bride-name',
          type: 'text',
          x: 55, y: 40, width: 25, height: 10, zIndex: 1,
          binding: 'couple.bride.name',
          props: { type: 'text' },
        },
        {
          id: 'hero-wedding-date',
          type: 'text',
          x: 25, y: 55, width: 50, height: 8, zIndex: 1,
          binding: 'wedding.date',
          props: { type: 'text' },
        },
      ],
    },
    // 인사말/혼주
    {
      id: 'greeting-parents-1',
      type: 'greeting-parents',
      enabled: true,
      height: DEFAULT_BLOCK_HEIGHTS['greeting-parents'],
      elements: [
        {
          id: 'greeting-title',
          type: 'text',
          x: 10, y: 5, width: 80, height: 10, zIndex: 1,
          binding: 'greeting.title',
          props: { type: 'text' },
        },
        {
          id: 'greeting-content',
          type: 'text',
          x: 10, y: 18, width: 80, height: 30, zIndex: 1,
          binding: 'greeting.content',
          props: { type: 'text' },
        },
        {
          id: 'parents-groom-father',
          type: 'text',
          x: 10, y: 55, width: 35, height: 8, zIndex: 1,
          binding: 'parents.groom.father.name',
          props: { type: 'text' },
        },
        {
          id: 'parents-groom-mother',
          type: 'text',
          x: 10, y: 65, width: 35, height: 8, zIndex: 1,
          binding: 'parents.groom.mother.name',
          props: { type: 'text' },
        },
        {
          id: 'parents-bride-father',
          type: 'text',
          x: 55, y: 55, width: 35, height: 8, zIndex: 1,
          binding: 'parents.bride.father.name',
          props: { type: 'text' },
        },
        {
          id: 'parents-bride-mother',
          type: 'text',
          x: 55, y: 65, width: 35, height: 8, zIndex: 1,
          binding: 'parents.bride.mother.name',
          props: { type: 'text' },
        },
      ],
    },
    // 신랑신부 소개 (Profile)
    {
      id: 'profile-1',
      type: 'profile',
      enabled: false,
      height: DEFAULT_BLOCK_HEIGHTS.profile,
      presetId: 'profile-dual-card',
      elements: [
        {
          id: 'profile-title-en',
          type: 'text',
          x: 20, y: 3, width: 60, height: 4, zIndex: 1,
          value: 'About Us',
          props: { type: 'text' },
        },
        {
          id: 'profile-title-ko',
          type: 'text',
          x: 10, y: 8, width: 80, height: 5, zIndex: 1,
          value: '저희를 소개합니다',
          props: { type: 'text' },
        },
        {
          id: 'profile-groom-photo',
          type: 'image',
          x: 5, y: 16, width: 42, height: 30, zIndex: 1,
          binding: 'couple.groom.photo',
          props: { type: 'image', objectFit: 'cover' },
        },
        {
          id: 'profile-groom-label',
          type: 'text',
          x: 52, y: 17, width: 15, height: 3, zIndex: 1,
          value: '신랑',
          props: { type: 'text' },
        },
        {
          id: 'profile-groom-name',
          type: 'text',
          x: 52, y: 22, width: 43, height: 4, zIndex: 1,
          binding: 'couple.groom.name',
          props: { type: 'text' },
        },
        {
          id: 'profile-groom-birth',
          type: 'text',
          x: 52, y: 28, width: 43, height: 3, zIndex: 1,
          binding: 'couple.groom.birthDate',
          props: { type: 'text' },
        },
        {
          id: 'profile-groom-mbti',
          type: 'text',
          x: 52, y: 33, width: 20, height: 3, zIndex: 1,
          binding: 'couple.groom.mbti',
          props: { type: 'text' },
        },
        {
          id: 'profile-bride-photo',
          type: 'image',
          x: 53, y: 54, width: 42, height: 30, zIndex: 1,
          binding: 'couple.bride.photo',
          props: { type: 'image', objectFit: 'cover' },
        },
        {
          id: 'profile-bride-label',
          type: 'text',
          x: 5, y: 55, width: 15, height: 3, zIndex: 1,
          value: '신부',
          props: { type: 'text' },
        },
        {
          id: 'profile-bride-name',
          type: 'text',
          x: 5, y: 60, width: 43, height: 4, zIndex: 1,
          binding: 'couple.bride.name',
          props: { type: 'text' },
        },
        {
          id: 'profile-bride-birth',
          type: 'text',
          x: 5, y: 66, width: 43, height: 3, zIndex: 1,
          binding: 'couple.bride.birthDate',
          props: { type: 'text' },
        },
        {
          id: 'profile-bride-mbti',
          type: 'text',
          x: 5, y: 71, width: 20, height: 3, zIndex: 1,
          binding: 'couple.bride.mbti',
          props: { type: 'text' },
        },
      ],
    },
    // 달력
    {
      id: 'calendar-1',
      type: 'calendar',
      enabled: true,
      height: DEFAULT_BLOCK_HEIGHTS.calendar,
      elements: [
        {
          id: 'calendar-date',
          type: 'calendar',
          x: 10, y: 10, width: 80, height: 60, zIndex: 1,
          binding: 'wedding.date',
          props: { type: 'calendar' },
        },
        {
          id: 'calendar-time',
          type: 'text',
          x: 25, y: 75, width: 50, height: 10, zIndex: 1,
          binding: 'wedding.time',
          props: { type: 'text' },
        },
      ],
    },
    // 갤러리
    {
      id: 'gallery-1',
      type: 'gallery',
      enabled: true,
      height: DEFAULT_BLOCK_HEIGHTS.gallery,
      elements: [
        {
          id: 'gallery-photos',
          type: 'image',
          x: 0, y: 0, width: 100, height: 100, zIndex: 0,
          binding: 'photos.gallery',
          props: { type: 'image', objectFit: 'cover' },
        },
      ],
    },
    // 예식장
    {
      id: 'location-1',
      type: 'location',
      enabled: true,
      height: DEFAULT_BLOCK_HEIGHTS.location,
      elements: [
        {
          id: 'location-name',
          type: 'text',
          x: 10, y: 10, width: 80, height: 10, zIndex: 1,
          binding: 'venue.name',
          props: { type: 'text' },
        },
        {
          id: 'location-address',
          type: 'text',
          x: 10, y: 22, width: 80, height: 8, zIndex: 1,
          binding: 'venue.address',
          props: { type: 'text' },
        },
        {
          id: 'location-map',
          type: 'map',
          x: 5, y: 35, width: 90, height: 55, zIndex: 1,
          binding: 'venue.address',
          props: { type: 'map' },
        },
      ],
    },
    // 축의금
    {
      id: 'account-1',
      type: 'account',
      enabled: true,
      height: DEFAULT_BLOCK_HEIGHTS.account,
      elements: [
        {
          id: 'account-groom',
          type: 'text',
          x: 10, y: 20, width: 80, height: 30, zIndex: 1,
          binding: 'accounts.groom',
          props: { type: 'text' },
        },
        {
          id: 'account-bride',
          type: 'text',
          x: 10, y: 55, width: 80, height: 30, zIndex: 1,
          binding: 'accounts.bride',
          props: { type: 'text' },
        },
      ],
    },
    // 방명록
    {
      id: 'message-1',
      type: 'message',
      enabled: false,
      height: DEFAULT_BLOCK_HEIGHTS.message,
      elements: [],
    },
  ]
}

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

  // ═══ Legacy 호환 ═══
  groom: { name: '' },
  bride: { name: '' },
}

/**
 * 샘플 결혼식 날짜 계산 (오늘 + 5개월 후 토요일)
 */
function getSampleWeddingDate(): string {
  const date = new Date()
  date.setMonth(date.getMonth() + 5)
  const dayOfWeek = date.getDay()
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7
  date.setDate(date.getDate() + daysUntilSaturday)
  return date.toISOString().split('T')[0]
}

/**
 * 샘플 WeddingData (새 문서 생성 시 미리보기용)
 * - 신랑/신부 이름, 날짜, 장소, 사진, 인사말만 포함
 * - 혼주, 계좌 정보는 사용자가 직접 입력
 */
export const SAMPLE_WEDDING_DATA: WeddingData = {
  // ═══ 커플 정보 ═══
  couple: {
    groom: { name: '김민준' },
    bride: { name: '이서연' },
  },

  // ═══ 결혼식 일시 ═══
  wedding: {
    date: getSampleWeddingDate(),
    time: '14:00',
  },

  // ═══ 예식장 정보 ═══
  venue: {
    name: '더채플앳청담',
    hall: '아이리스홀',
    address: '서울특별시 강남구 선릉로 158길 11',
  },

  // ═══ 사진 (템플릿 참조 이미지 - unique1~6) ═══
  photos: {
    main: '/examples/unique1.png',
    gallery: [
      '/examples/unique1.png',
      '/examples/unique2.png',
      '/examples/unique3.png',
      '/examples/unique4.png',
      '/examples/unique5.png',
      '/examples/unique6.png',
    ],
  },

  // ═══ 인사말 ═══
  greeting: {
    title: '저희 결혼합니다',
    content: `서로 다른 두 사람이 만나
하나의 길을 함께 걸어가고자 합니다.

저희의 새로운 시작을 축복해 주시면
더없는 기쁨으로 간직하겠습니다.`,
  },

  // ═══ Legacy 호환 ═══
  groom: { name: '김민준' },
  bride: { name: '이서연' },
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
          binding: 'groom.name',
          props: { type: 'text' },
        },
        {
          id: 'hero-bride-name',
          type: 'text',
          x: 55, y: 40, width: 25, height: 10, zIndex: 1,
          binding: 'bride.name',
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
    // 인사말
    {
      id: 'greeting-1',
      type: 'greeting',
      enabled: true,
      height: DEFAULT_BLOCK_HEIGHTS.greeting,
      elements: [
        {
          id: 'greeting-title',
          type: 'text',
          x: 10, y: 10, width: 80, height: 15, zIndex: 1,
          binding: 'greeting.title',
          props: { type: 'text' },
        },
        {
          id: 'greeting-content',
          type: 'text',
          x: 10, y: 30, width: 80, height: 50, zIndex: 1,
          binding: 'greeting.content',
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
    // 혼주
    {
      id: 'parents-1',
      type: 'parents',
      enabled: true,
      height: DEFAULT_BLOCK_HEIGHTS.parents,
      elements: [
        {
          id: 'parents-groom-father',
          type: 'text',
          x: 10, y: 20, width: 35, height: 8, zIndex: 1,
          binding: 'groom.fatherName',
          props: { type: 'text' },
        },
        {
          id: 'parents-groom-mother',
          type: 'text',
          x: 10, y: 32, width: 35, height: 8, zIndex: 1,
          binding: 'groom.motherName',
          props: { type: 'text' },
        },
        {
          id: 'parents-bride-father',
          type: 'text',
          x: 55, y: 20, width: 35, height: 8, zIndex: 1,
          binding: 'bride.fatherName',
          props: { type: 'text' },
        },
        {
          id: 'parents-bride-mother',
          type: 'text',
          x: 55, y: 32, width: 35, height: 8, zIndex: 1,
          binding: 'bride.motherName',
          props: { type: 'text' },
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
          binding: 'groom.account',
          props: { type: 'text' },
        },
        {
          id: 'account-bride',
          type: 'text',
          x: 10, y: 55, width: 80, height: 30, zIndex: 1,
          binding: 'bride.account',
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

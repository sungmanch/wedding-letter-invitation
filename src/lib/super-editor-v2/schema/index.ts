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
  Element,
  SemanticTokens,
  SizeMode,
} from './types'
import { nanoid } from 'nanoid'
import { getBlockPreset, type PresetElement } from '../presets/blocks'

/**
 * 기본 시맨틱 토큰 (hero-minimal-overlay 프리셋 기반)
 */
export const DEFAULT_SEMANTIC_TOKENS: SemanticTokens = {
  // 배경
  'bg-page': '#FFFFFF',
  'bg-section': '#FFFFFF',
  'bg-section-alt': '#FFFFFF',
  'bg-card': '#F9FAFB',
  'bg-overlay': 'rgba(0, 0, 0, 0.4)',

  // 전경
  'fg-default': '#1A1A1A',
  'fg-muted': '#6B7280',
  'fg-emphasis': '#6B7280',
  'fg-inverse': '#FFFFFF',
  'fg-on-accent': '#FFFFFF',

  // 강조/액션
  'accent-default': '#6B7280',
  'accent-hover': '#E5E7EB',
  'accent-active': '#6B7280',
  'accent-secondary': '#E5E7EB',

  // 보더
  'border-default': '#E5E7EB',
  'border-emphasis': '#6B7280',
  'border-muted': '#F3F4F6',
}

/**
 * 기본 스타일 시스템
 */
export const DEFAULT_STYLE_SYSTEM: StyleSystem = {
  version: 2,
  preset: 'hero-minimal-overlay',
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
 * 샘플 결혼식 날짜 (고정값 - hydration 안정성)
 *
 * 동적 계산 대신 고정 날짜 사용:
 * - SSR과 클라이언트에서 동일한 값 보장
 * - 2025년 6월 7일 토요일 (샘플용)
 */
const SAMPLE_WEDDING_DATE = '2025-06-07'

/**
 * 샘플 WeddingData (새 문서 생성 시 미리보기용)
 * - 모든 블록이 ON 되었을 때 미리보기에서 샘플 데이터 표시
 * - 사용자가 실제 데이터로 교체하면 됨
 */
export const SAMPLE_WEDDING_DATA: WeddingData = {
  // ═══ 커플 정보 (확장) ═══
  couple: {
    groom: {
      name: '김민준',
      nameEn: 'Minjun',
      phone: '010-1234-5678',
      intro: '웃음이 많고 따뜻한 사람',
      photo: '/examples/images/groom.png',
      mbti: 'ENFP',
      tags: ['캠핑', '러닝', '커피'],
      job: '소프트웨어 엔지니어',
    },
    bride: {
      name: '이서연',
      nameEn: 'Seoyeon',
      phone: '010-9876-5432',
      intro: '세심하고 배려심 깊은 사람',
      photo: '/examples/images/bride.png',
      mbti: 'INFJ',
      tags: ['독서', '요리', '여행'],
      job: 'UX 디자이너',
    },
  },

  // ═══ 결혼식 일시 ═══
  wedding: {
    date: SAMPLE_WEDDING_DATE,
    time: '14:00',
  },

  // ═══ 예식장 정보 ═══
  venue: {
    name: '더채플앳청담',
    hall: '아이리스홀',
    address: '서울특별시 강남구 선릉로 158길 11',
    tel: '02-518-2222',
    lat: 37.5141,
    lng: 127.0458,
  },

  // ═══ 오시는길 섹션 ═══
  location: {
    title: '오시는길',
    titleEn: 'LOCATION',
  },

  // ═══ 사진 (갤러리 포함) ═══
  photos: {
    main: '/examples/wedding_image.png',
    gallery: [
      '/examples/wedding_images/1.png',
      '/examples/wedding_images/2.png',
      '/examples/wedding_images/3.png',
      '/examples/wedding_images/4.png',
      '/examples/wedding_images/5.png',
      '/examples/wedding_images/6.png',
    ],
  },

  // ═══ 혼주 정보 ═══
  parents: {
    groom: {
      father: { name: '김철수' },
      mother: { name: '박영희' },
      birthOrder: '장남',
    },
    bride: {
      father: { name: '이영수' },
      mother: { name: '최미영' },
      birthOrder: '차녀',
    },
  },

  // ═══ 인사말 ═══
  greeting: {
    title: '저희 결혼합니다',
    content: `서로 다른 두 사람이 만나
하나의 길을 함께 걸어가고자 합니다.

저희의 새로운 시작을 축복해 주시면
더없는 기쁨으로 간직하겠습니다.`,
  },

  // ═══ 계좌 정보 ═══
  accounts: {
    title: '마음 전하실 곳',
    titleEn: 'GIFT',
    description: '축하의 마음을 전해 주시면 감사히 받겠습니다.',
    groom: [
      { relation: '신랑', bank: '신한은행', number: '110-123-456789', holder: '김민준' },
      { relation: '아버지', bank: '국민은행', number: '123-45-6789012', holder: '김철수' },
    ],
    bride: [
      { relation: '신부', bank: '우리은행', number: '1002-345-678901', holder: '이서연' },
      { relation: '어머니', bank: '하나은행', number: '456-78-9012345', holder: '최미영' },
    ],
  },

  // ═══ 공지사항 ═══
  notice: {
    sectionTitle: 'NOTICE',
    items: [
      {
        title: '식사 안내',
        content: '예식 후 1층 그랜드볼룸에서 식사가 준비되어 있습니다.',
        iconType: 'hearts',
      },
      {
        title: '주차 안내',
        content: '건물 내 지하주차장 이용 가능합니다. (2시간 무료)',
        iconType: 'rings',
      },
    ],
  },

  // ═══ RSVP ═══
  rsvp: {
    title: '참석 여부를 알려주세요',
    titleEn: 'RSVP',
    description: '참석 여부를 미리 알려주시면 준비에 큰 도움이 됩니다.',
  },

  // ═══ 인터뷰 ═══
  interview: {
    title: '우리에게 물었습니다',
    subtitle: '결혼을 앞둔 저희에게 물어봤어요',
    items: [
      {
        question: '첫인상은 어땠나요?',
        groomAnswer: '밝고 예쁜 미소가 인상적이었어요',
        brideAnswer: '듬직하고 편안한 느낌이었어요',
      },
      {
        question: '프로포즈는 어떻게 했나요?',
        groomAnswer: '우리가 처음 만난 카페에서 했어요',
        brideAnswer: '너무 감동받아서 울었어요',
      },
    ],
  },

  // ═══ 엔딩 ═══
  ending: {
    message: '함께해 주셔서 감사합니다',
    photo: '/examples/images/quote.jpg',
  },

  // ═══ BGM ═══
  bgm: {
    trackId: 'romantic-piano-01',
    title: 'Romantic Piano',
    artist: 'Wedding Music',
  },

  // ═══ 커스텀 필드 (프리셋 특화) ═══
  custom: {
    quoteText: '"우리는 매일 시간을 여행한다..."',
    quoteSource: '- 영화 「어바웃 타임」 중',
    // wind-memory 프리셋용 캐치프레이즈 (줄바꿈으로 구분)
    heroQuote: 'Two hearts,\nOne love,\nForever.',
  },

  // ═══ Legacy 호환 ═══
  groom: { name: '김민준', nameEn: 'Minjun' },
  bride: { name: '이서연', nameEn: 'Seoyeon' },
}

/**
 * 템플릿 ID에서 숫자 추출 (unique1 → 1, unique2 → 2, ...)
 */
export function getTemplateNumber(templateId: string): number {
  const match = templateId.match(/unique(\d+)/)
  return match ? parseInt(match[1], 10) : 1
}

/**
 * 템플릿별 샘플 이미지 경로 반환
 * unique1 → /examples/wedding_images/1.png
 * unique2 → /examples/wedding_images/2.png
 * ...
 */
export function getTemplateSampleImage(templateId: string): string {
  const num = getTemplateNumber(templateId)
  return `/examples/wedding_images/${num}.png`
}

/**
 * 템플릿별 샘플 WeddingData 생성
 * 각 템플릿마다 다른 웨딩 이미지 사용
 */
export function getSampleWeddingDataForTemplate(templateId: string): WeddingData {
  const imagePath = getTemplateSampleImage(templateId)
  return {
    ...SAMPLE_WEDDING_DATA,
    photos: {
      main: imagePath,
      gallery: [
        '/examples/wedding_images/1.png',
        '/examples/wedding_images/2.png',
        '/examples/wedding_images/3.png',
        '/examples/wedding_images/4.png',
        '/examples/wedding_images/5.png',
        '/examples/wedding_images/6.png',
      ],
    },
  }
}

/**
 * 기본 블록 순서 (활성화된 블록)
 */
export const DEFAULT_BLOCK_ORDER: Block['type'][] = [
  'hero',
  'greeting-parents',
  'profile',
  'interview',
  'calendar',
  'gallery',
  'rsvp',
  'location',
  'notice',
  'account',
  'message',
  'ending',
  'music',
]

/**
 * 블록 타입별 기본 높이 (vh)
 */
export const DEFAULT_BLOCK_HEIGHTS: Record<Block['type'], number> = {
  // 핵심 섹션
  hero: 100,
  'greeting-parents': 80,
  profile: 80,
  interview: 60,
  calendar: 80,
  gallery: 100,
  rsvp: 60,
  location: 80,
  notice: 40,
  account: 80,
  message: 100,
  wreath: 40,
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
  interview: '인터뷰',
  calendar: '예식일시',
  gallery: '갤러리',
  rsvp: '참석 여부',
  location: '오시는길',
  notice: '공지사항',
  account: '축의금',
  wreath: '화환 안내',
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
 * 재귀적으로 모든 요소에 새 ID 부여 (Group children 포함)
 */
function regenerateElementIds(el: PresetElement): Element {
  const newEl: Element = {
    ...el,
    id: nanoid(8),
  } as Element

  // Group children 재귀 처리
  if (el.children && el.children.length > 0) {
    newEl.children = el.children.map((child) => regenerateElementIds(child as PresetElement))
  }

  return newEl
}

/**
 * 프리셋에서 블록 생성 헬퍼
 */
function createBlockFromPreset(
  blockId: string,
  presetId: string,
  enabled: boolean = true,
  fallbackHeight: number = 80
): Block | null {
  const preset = getBlockPreset(presetId)
  if (!preset) return null

  // height 처리: SizeMode 객체면 숫자로 변환 (hug는 fallback 사용)
  let height: number | SizeMode = fallbackHeight
  if (preset.defaultHeight) {
    if (typeof preset.defaultHeight === 'number') {
      height = preset.defaultHeight
    } else {
      height = preset.defaultHeight // SizeMode 그대로 전달
    }
  }

  return {
    id: blockId,
    type: preset.blockType,
    enabled,
    presetId,
    height,
    layout: preset.layout,
    elements: preset.defaultElements
      ? preset.defaultElements.map((el) => regenerateElementIds(el))
      : [],
  }
}

/**
 * 기본 블록 템플릿 생성
 * 프리셋 시스템을 활용하여 Auto Layout 기반 블록 생성
 */
export function createDefaultBlocks(): Block[] {
  // 프리셋 기반 블록들
  const greetingBlock = createBlockFromPreset(
    'greeting-parents-1',
    'greeting-parents-minimal',
    true,
    DEFAULT_BLOCK_HEIGHTS['greeting-parents']
  )

  const profileBlock = createBlockFromPreset(
    'profile-1',
    'profile-dual-card',
    false, // 기본 비활성화
    DEFAULT_BLOCK_HEIGHTS.profile
  )

  const calendarBlock = createBlockFromPreset(
    'calendar-1',
    'calendar-korean-countdown-box',
    true,
    DEFAULT_BLOCK_HEIGHTS.calendar
  )

  const galleryBlock = createBlockFromPreset(
    'gallery-1',
    'gallery-square-3col',
    true,
    DEFAULT_BLOCK_HEIGHTS.gallery
  )

  const locationBlock = createBlockFromPreset(
    'location-1',
    'location-minimal',
    false,
    DEFAULT_BLOCK_HEIGHTS.location
  )

  const accountBlock = createBlockFromPreset(
    'account-1',
    'account-tab-card',
    true,
    DEFAULT_BLOCK_HEIGHTS.account
  )

  const messageBlock = createBlockFromPreset(
    'message-1',
    'message-minimal',
    false, // 선택 섹션 → 기본 비활성화
    DEFAULT_BLOCK_HEIGHTS.message
  )

  const endingBlock = createBlockFromPreset(
    'ending-1',
    'ending-quote-share',
    false, // 선택 섹션 → 기본 비활성화
    DEFAULT_BLOCK_HEIGHTS.ending
  )

  const rsvpBlock = createBlockFromPreset(
    'rsvp-1',
    'rsvp-basic',
    false, // 선택 섹션 → 기본 비활성화
    DEFAULT_BLOCK_HEIGHTS.rsvp
  )

  const noticeBlock = createBlockFromPreset(
    'notice-1',
    'notice-classic-label',
    false, // 선택 섹션 → 기본 비활성화
    DEFAULT_BLOCK_HEIGHTS.notice
  )

  const heroBlock = createBlockFromPreset(
    'hero-1',
    'hero-fullscreen-overlay',
    true,
    DEFAULT_BLOCK_HEIGHTS.hero
  )

  return [
    // 메인 (Hero) - 프리셋 적용
    heroBlock ?? {
      id: 'hero-1',
      type: 'hero',
      enabled: true,
      height: DEFAULT_BLOCK_HEIGHTS.hero,
      elements: [],
    },
    // 인사말/혼주 - 프리셋 적용
    greetingBlock ?? {
      id: 'greeting-parents-1',
      type: 'greeting-parents',
      enabled: true,
      height: DEFAULT_BLOCK_HEIGHTS['greeting-parents'],
      elements: [
        {
          id: 'greeting-title',
          type: 'text',
          x: 10,
          y: 5,
          width: 80,
          height: 10,
          zIndex: 1,
          binding: 'greeting.title',
          props: { type: 'text' },
        },
        {
          id: 'greeting-content',
          type: 'text',
          x: 10,
          y: 18,
          width: 80,
          height: 30,
          zIndex: 1,
          binding: 'greeting.content',
          props: { type: 'text' },
        },
      ],
    },
    // 신랑신부 소개 - 프리셋 적용
    profileBlock ?? {
      id: 'profile-1',
      type: 'profile',
      enabled: false,
      height: DEFAULT_BLOCK_HEIGHTS.profile,
      presetId: 'profile-dual-card',
      elements: [],
    },
    // 인터뷰 - 프리셋 적용 (선택 섹션 → 기본 비활성화)
    {
      id: 'interview-1',
      type: 'interview',
      enabled: false,
      height: DEFAULT_BLOCK_HEIGHTS.interview,
      presetId: 'interview-accordion',
      elements: [],
    },
    // 달력 - 프리셋 적용
    calendarBlock ?? {
      id: 'calendar-1',
      type: 'calendar',
      enabled: true,
      height: DEFAULT_BLOCK_HEIGHTS.calendar,
      elements: [
        {
          id: 'calendar-date',
          type: 'calendar',
          x: 10,
          y: 10,
          width: 80,
          height: 60,
          zIndex: 1,
          binding: 'wedding.date',
          props: { type: 'calendar' },
        },
        {
          id: 'calendar-time',
          type: 'text',
          x: 25,
          y: 75,
          width: 50,
          height: 10,
          zIndex: 1,
          binding: 'wedding.time',
          props: { type: 'text' },
        },
      ],
    },
    // 5. 갤러리 - 프리셋 적용
    galleryBlock ?? {
      id: 'gallery-1',
      type: 'gallery',
      enabled: true,
      height: DEFAULT_BLOCK_HEIGHTS.gallery,
      elements: [
        {
          id: 'gallery-photos',
          type: 'image',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          zIndex: 0,
          binding: 'photos.gallery',
          props: { type: 'image', objectFit: 'cover' },
        },
      ],
    },
    // 6. RSVP - 프리셋 적용 (선택 섹션 → 기본 비활성화)
    rsvpBlock ?? {
      id: 'rsvp-1',
      type: 'rsvp',
      enabled: false,
      height: DEFAULT_BLOCK_HEIGHTS.rsvp,
      elements: [],
    },
    // 7. 예식장 - 프리셋 적용
    locationBlock ?? {
      id: 'location-1',
      type: 'location',
      enabled: true,
      height: DEFAULT_BLOCK_HEIGHTS.location,
      elements: [
        {
          id: 'location-name',
          type: 'text',
          x: 10,
          y: 10,
          width: 80,
          height: 10,
          zIndex: 1,
          binding: 'venue.name',
          props: { type: 'text' },
        },
        {
          id: 'location-address',
          type: 'text',
          x: 10,
          y: 22,
          width: 80,
          height: 8,
          zIndex: 1,
          binding: 'venue.address',
          props: { type: 'text' },
        },
        {
          id: 'location-map',
          type: 'map',
          x: 5,
          y: 35,
          width: 90,
          height: 55,
          zIndex: 1,
          binding: 'venue.address',
          props: { type: 'map' },
        },
      ],
    },
    // 8. 공지사항 - 프리셋 적용 (선택 섹션 → 기본 비활성화)
    noticeBlock ?? {
      id: 'notice-1',
      type: 'notice',
      enabled: false,
      height: DEFAULT_BLOCK_HEIGHTS.notice,
      elements: [],
    },
    // 9. 축의금 - 프리셋 적용
    accountBlock ?? {
      id: 'account-1',
      type: 'account',
      enabled: true,
      height: DEFAULT_BLOCK_HEIGHTS.account,
      elements: [
        {
          id: 'account-groom',
          type: 'text',
          x: 10,
          y: 20,
          width: 80,
          height: 30,
          zIndex: 1,
          binding: 'accounts.groom',
          props: { type: 'text' },
        },
        {
          id: 'account-bride',
          type: 'text',
          x: 10,
          y: 55,
          width: 80,
          height: 30,
          zIndex: 1,
          binding: 'accounts.bride',
          props: { type: 'text' },
        },
      ],
    },
    // 10. 방명록 - 프리셋 적용 (선택 섹션 → 기본 비활성화)
    messageBlock ?? {
      id: 'message-1',
      type: 'message',
      enabled: false,
      height: DEFAULT_BLOCK_HEIGHTS.message,
      elements: [],
    },
    // 11. 엔딩 - 프리셋 적용 (선택 섹션 → 기본 비활성화)
    endingBlock ?? {
      id: 'ending-1',
      type: 'ending',
      enabled: false,
      height: DEFAULT_BLOCK_HEIGHTS.ending,
      elements: [],
    },
    // 12. 배경음악 - 프리셋 없음 (선택 섹션 → 기본 비활성화)
    {
      id: 'music-1',
      type: 'music',
      enabled: false,
      height: DEFAULT_BLOCK_HEIGHTS.music,
      elements: [],
    },
  ]
}

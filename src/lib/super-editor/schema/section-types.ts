/**
 * Super Editor - Section Types
 * 청첩장 섹션 타입 정의
 */

// ============================================
// Section Type Definition
// ============================================

/**
 * 청첩장 섹션 타입
 * - intro: 인트로 (순서 고정: 1번)
 * - greeting: 인사말
 * - venue: 예식장 위치
 * - date: 예식 날짜/시간
 * - gallery: 갤러리
 * - parents: 혼주 소개
 * - accounts: 계좌 정보
 * - guestbook: 축하 메시지
 * - music: 배경음악 (FAB 형태)
 */
export type SectionType =
  | 'intro'
  | 'greeting'
  | 'contact'
  | 'venue'
  | 'date'
  | 'gallery'
  | 'parents'
  | 'accounts'
  | 'guestbook'
  | 'music'
  | 'photobooth'
  | 'invitation'

/**
 * 섹션 메타 정보
 */
export interface SectionMeta {
  type: SectionType
  label: string
  description: string
  icon: string
  isFixed: boolean // 순서 고정 여부 (intro는 true)
  isFloating: boolean // 플로팅 UI 여부 (music은 true)
  defaultEnabled: boolean
}

/**
 * 섹션 메타 정보 맵
 */
export const SECTION_META: Record<SectionType, SectionMeta> = {
  intro: {
    type: 'intro',
    label: '인트로',
    description: '청첩장 첫 화면',
    icon: 'sparkles',
    isFixed: true,
    isFloating: false,
    defaultEnabled: true,
  },
  greeting: {
    type: 'greeting',
    label: '인사말',
    description: '신랑/신부 인사말',
    icon: 'message-square',
    isFixed: false,
    isFloating: false,
    defaultEnabled: true,
  },
  contact: {
    type: 'contact',
    label: '연락처',
    description: '신랑/신부 연락처',
    icon: 'phone',
    isFixed: false,
    isFloating: false,
    defaultEnabled: true,
  },
  venue: {
    type: 'venue',
    label: '오시는 길',
    description: '예식장 위치 및 지도',
    icon: 'map-pin',
    isFixed: false,
    isFloating: false,
    defaultEnabled: true,
  },
  date: {
    type: 'date',
    label: '예식 일시',
    description: '예식 날짜 및 시간',
    icon: 'calendar',
    isFixed: false,
    isFloating: false,
    defaultEnabled: true,
  },
  gallery: {
    type: 'gallery',
    label: '갤러리',
    description: '웨딩 사진 갤러리',
    icon: 'images',
    isFixed: false,
    isFloating: false,
    defaultEnabled: true,
  },
  parents: {
    type: 'parents',
    label: '혼주 소개',
    description: '양가 부모님/보호자 정보',
    icon: 'users',
    isFixed: false,
    isFloating: false,
    defaultEnabled: true,
  },
  accounts: {
    type: 'accounts',
    label: '마음 전하실 곳',
    description: '축의금 계좌 정보',
    icon: 'credit-card',
    isFixed: false,
    isFloating: false,
    defaultEnabled: true,
  },
  guestbook: {
    type: 'guestbook',
    label: '축하 메시지',
    description: '방명록',
    icon: 'message-square',
    isFixed: false,
    isFloating: false,
    defaultEnabled: true,
  },
  music: {
    type: 'music',
    label: '배경음악',
    description: 'BGM 플레이어',
    icon: 'music',
    isFixed: false,
    isFloating: true,
    defaultEnabled: false,
  },
  photobooth: {
    type: 'photobooth',
    label: '포토부스',
    description: '게스트와 호스트가 함께 사진 촬영',
    icon: 'camera',
    isFixed: false,
    isFloating: false,
    defaultEnabled: false,
  },
  invitation: {
    type: 'invitation',
    label: '참석 여부',
    description: 'RSVP 참석 인원 확인 폼',
    icon: 'mail',
    isFixed: false,
    isFloating: false,
    defaultEnabled: false,
  },
}

/**
 * 기본 섹션 순서 (intro, music 제외)
 */
export const DEFAULT_SECTION_ORDER: SectionType[] = [
  'greeting',
  'contact',
  'date',
  'parents',
  'gallery',
  'venue',
  'accounts',
  'guestbook',
  'invitation',
]

/**
 * 순서 변경 가능한 섹션들
 */
export const REORDERABLE_SECTIONS: SectionType[] = [
  'greeting',
  'contact',
  'venue',
  'date',
  'gallery',
  'parents',
  'accounts',
  'guestbook',
  'invitation',
]

/**
 * 기본 섹션 활성화 상태
 */
export const DEFAULT_SECTION_ENABLED: Record<SectionType, boolean> = {
  intro: true,
  greeting: true,
  contact: true,
  venue: true,
  date: true,
  gallery: true,
  parents: true,
  accounts: true,
  guestbook: true,
  music: false,
  photobooth: false,
  invitation: false,
}

/**
 * 섹션별 주요 데이터 바인딩 경로
 *
 * 참고: intro는 AI가 생성하는 레이아웃에 따라 동적으로 바인딩됨
 */
export const SECTION_DATA_BINDINGS: Record<SectionType, string[]> = {
  // intro: AI 생성 레이아웃에 따라 동적 (이미지, 비디오, 텍스트 오버레이 등)
  intro: [
    'couple.groom.name',
    'couple.bride.name',
    'wedding.date',
    'wedding.dateDisplay',
    'photos.main',
    'photos.intro',
    'video.intro',
    'intro.message',
    // ... AI가 동적으로 추가 가능
  ],
  greeting: [
    'greeting.title',
    'greeting.content',
    'couple.groom.name',
    'couple.bride.name',
  ],
  contact: [
    'couple.groom.name',
    'couple.groom.phone',
    'couple.bride.name',
    'couple.bride.phone',
  ],
  venue: [
    'venue.name',
    'venue.address',
    'venue.hall',
    'venue.coordinates.lat',
    'venue.coordinates.lng',
    'venue.phone',
    'venue.parking',
    'venue.transport.bus',
    'venue.transport.subway',
    'venue.transport.car',
  ],
  date: [
    'wedding.date',
    'wedding.time',
    'wedding.dateDisplay',
    'wedding.timeDisplay',
    'wedding.dday',
  ],
  gallery: ['photos.gallery', 'photos.main'],
  // parents: 편부모/보호자 등 다양한 케이스 지원, 동적 토글
  parents: [
    'parents.groom.members', // [{ name, relation, enabled }]
    'parents.bride.members', // [{ name, relation, enabled }]
  ],
  // accounts: 최대 6개 (신랑, 신부, 신랑 부/모, 신부 부/모)
  accounts: [
    'accounts.groom', // { name, accounts: [{ bank, number, holder }] }
    'accounts.bride', // { name, accounts: [{ bank, number, holder }] }
    'accounts.groomFather', // { name, accounts: [{ bank, number, holder }], enabled }
    'accounts.groomMother', // { name, accounts: [{ bank, number, holder }], enabled }
    'accounts.brideFather', // { name, accounts: [{ bank, number, holder }], enabled }
    'accounts.brideMother', // { name, accounts: [{ bank, number, holder }], enabled }
  ],
  guestbook: [
    'guestbook.messages',
    'guestbook.enabled',
    'guestbook.ctaText', // CTA 버튼 텍스트
  ],
  music: ['bgm.presetId', 'bgm.enabled', 'bgm.autoplay'],
  photobooth: [
    'photobooth.title',
    'photobooth.description',
    'photobooth.frames',
  ],
  invitation: [
    'invitation.title',
    'invitation.description',
  ],
}

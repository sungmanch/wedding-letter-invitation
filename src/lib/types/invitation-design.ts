/**
 * InvitationDesignData v2
 * Salon de Letter 수준의 30+ 섹션을 지원하는 확장된 데이터 구조
 */

import type {
  ColorPalette,
  FontSet,
  IntroConfig,
  EffectsConfig,
  AnimationType,
  LayoutType,
} from '@/lib/themes/schema'

// ============================================
// 확장된 섹션 타입
// ============================================

/** 확장된 섹션 타입 (기존 + 신규) */
export type ExtendedSectionType =
  // 기존 섹션
  | 'hero'              // 메인 히어로
  | 'greeting'          // 인사말
  | 'calendar'          // 달력/날짜
  | 'gallery'           // 갤러리
  | 'location'          // 장소/지도
  | 'parents'           // 혼주 정보
  | 'contact'           // 연락처
  | 'account'           // 계좌 정보
  | 'message'           // 축하 메시지
  | 'rsvp'              // 참석 여부
  | 'closing'           // 푸터/엔딩
  // 신규 섹션
  | 'loading'           // 로딩 화면
  | 'quote'             // 글귀
  | 'profile'           // 프로필형 소개
  | 'parents-contact'   // 혼주 연락처
  | 'timeline'          // 타임라인/스토리
  | 'video'             // 영상
  | 'interview'         // 웨딩 인터뷰
  | 'transport'         // 교통수단
  | 'notice'            // 안내사항
  | 'announcement'      // 안내문
  | 'flower-gift'       // 화환 보내기
  | 'together-time'     // 함께한 시간
  | 'dday'              // D-DAY 카운트다운
  | 'guest-snap'        // 게스트스냅
  | 'ending'            // 엔딩 크레딧

// ============================================
// 섹션별 설정 타입
// ============================================

/** 히어로 섹션 설정 */
export interface HeroSettings {
  displayMode: 'fullscreen' | 'split' | 'overlay'
  showDate: boolean
  showVenue: boolean
  showDday: boolean
  nameOrder: 'groom-first' | 'bride-first'
  nameStyle: 'full' | 'first-only' | 'with-parents'
}

/** 인사말 섹션 설정 */
export interface GreetingSettings {
  template: 'default' | 'formal' | 'casual' | 'poetic' | 'custom'
  customText?: string
  showSignature: boolean
  signatureStyle: 'names' | 'parents' | 'both'
}

/** 달력 섹션 설정 */
export interface CalendarSettings {
  displayMode: 'full' | 'mini' | 'countdown' | 'timeline'
  showLunarDate: boolean
  showDday: boolean
  highlightColor?: string
  showTime: boolean
  timeFormat: '12h' | '24h'
}

/** 갤러리 섹션 설정 */
export interface GallerySettings {
  displayMode: 'carousel' | 'grid' | 'masonry' | 'fullscreen' | 'polaroid' | 'film-strip'
  columns: 1 | 2 | 3 | 4
  aspectRatio: '1:1' | '3:4' | '4:3' | '16:9' | 'original'
  showCaption: boolean
  autoPlay: boolean
  autoPlayInterval: number  // ms
  filter: 'none' | 'grayscale' | 'sepia' | 'warm' | 'cool' | 'vintage'
  spacing: 'none' | 'small' | 'medium' | 'large'
}

/** 위치 섹션 설정 */
export interface LocationSettings {
  showMap: boolean
  mapProvider: 'kakao' | 'naver' | 'tmap' | 'google'
  mapStyle: 'default' | 'minimal' | 'satellite'
  showDirections: boolean
  directionLinks: ('kakao' | 'naver' | 'tmap' | 'google')[]
  showParkingInfo: boolean
  parkingInfo?: string
  showShuttleInfo: boolean
  shuttleInfo?: string
}

/** 혼주 정보 섹션 설정 */
export interface ParentsSettings {
  displayMode: 'side-by-side' | 'stacked' | 'cards'
  showRelation: boolean
  relationStyle: 'korean' | 'english'  // 아버지/어머니 vs Father/Mother
  showDeceasedMark: boolean
  deceasedMarkStyle: '故' | '(故)' | '✝'
}

/** 연락처 섹션 설정 */
export interface ContactSettings {
  displayMode: 'grid' | 'list' | 'cards'
  showProfileImage: boolean
  contactMethods: ('call' | 'sms' | 'kakao')[]
  groupByFamily: boolean  // 신랑측/신부측 그룹핑
}

/** 계좌 섹션 설정 */
export interface AccountSettings {
  displayMode: 'tabs' | 'accordion' | 'side-by-side' | 'stacked'
  showQRCode: boolean
  showCopyButton: boolean
  showKakaoPayButton: boolean
  accounts: AccountConfig[]
}

export interface AccountConfig {
  type: 'groom' | 'bride' | 'groom-father' | 'groom-mother' | 'bride-father' | 'bride-mother'
  enabled: boolean
  order: number
  label?: string  // 커스텀 레이블 (예: "신랑에게")
}

/** 메시지 섹션 설정 */
export interface MessageSettings {
  displayMode: 'list' | 'cards' | 'masonry' | 'carousel'
  showTimestamp: boolean
  allowAnonymous: boolean
  maxLength: number
  moderationEnabled: boolean
}

/** RSVP 섹션 설정 */
export interface RsvpSettings {
  enabled: boolean
  deadline?: string  // ISO date
  fields: RsvpField[]
  showMealOption: boolean
  mealOptions?: string[]
  showAttendanceCount: boolean
  maxGuests: number
  confirmationMessage?: string
}

export interface RsvpField {
  id: string
  type: 'text' | 'select' | 'radio' | 'checkbox' | 'number'
  label: string
  required: boolean
  options?: string[]
  placeholder?: string
}

/** 영상 섹션 설정 */
export interface VideoSettings {
  source: 'youtube' | 'vimeo' | 'file' | 'embed'
  url?: string
  autoPlay: boolean
  muted: boolean
  loop: boolean
  showControls: boolean
  aspectRatio: '16:9' | '4:3' | '1:1' | '9:16'
  thumbnail?: string
  title?: string
  caption?: string
}

/** 웨딩 인터뷰 섹션 설정 */
export interface InterviewSettings {
  displayMode: 'card' | 'chat' | 'timeline' | 'accordion'
  questions: InterviewQuestion[]
  showBothAnswers: boolean  // 신랑/신부 답변 둘 다 표시
}

export interface InterviewQuestion {
  id: string
  question: string
  groomAnswer?: string
  brideAnswer?: string
  enabled: boolean
  order: number
}

/** 타임라인 섹션 설정 */
export interface TimelineSettings {
  displayMode: 'vertical' | 'horizontal' | 'alternate' | 'cards'
  showConnectors: boolean
  connectorStyle: 'line' | 'dotted' | 'dashed'
  events: TimelineEvent[]
}

export interface TimelineEvent {
  id: string
  date: string
  title: string
  description?: string
  imageUrl?: string
  enabled: boolean
  order: number
}

/** D-DAY 섹션 설정 */
export interface DdaySettings {
  displayMode: 'countdown' | 'simple' | 'detailed'
  showDays: boolean
  showHours: boolean
  showMinutes: boolean
  showSeconds: boolean
  endMessage?: string  // D-Day 이후 표시 메시지
  style: 'flip' | 'digital' | 'analog' | 'text'
}

/** 교통수단 섹션 설정 */
export interface TransportSettings {
  showSubway: boolean
  subwayInfo?: string
  showBus: boolean
  busInfo?: string
  showCar: boolean
  carInfo?: string
  showShuttle: boolean
  shuttleInfo?: string
  showParking: boolean
  parkingInfo?: string
}

/** 게스트스냅 섹션 설정 */
export interface GuestSnapSettings {
  enabled: boolean
  uploadEnabled: boolean
  requireApproval: boolean
  maxPhotos: number
  displayMode: 'grid' | 'slideshow' | 'masonry'
  allowDownload: boolean
}

/** 안내사항 섹션 설정 */
export interface NoticeSettings {
  items: NoticeItem[]
  displayMode: 'list' | 'cards' | 'icons'
}

export interface NoticeItem {
  id: string
  icon?: string
  title: string
  content: string
  enabled: boolean
  order: number
}

/** 엔딩 섹션 설정 */
export interface EndingSettings {
  displayMode: 'simple' | 'credits' | 'photo' | 'message'
  showWatermark: boolean
  customMessage?: string
  showSocialShare: boolean
  showSaveDate: boolean
}

// ============================================
// 섹션 설정 Union 타입
// ============================================

export type SectionTypeSettings =
  | { type: 'hero'; settings: HeroSettings }
  | { type: 'greeting'; settings: GreetingSettings }
  | { type: 'calendar'; settings: CalendarSettings }
  | { type: 'gallery'; settings: GallerySettings }
  | { type: 'location'; settings: LocationSettings }
  | { type: 'parents'; settings: ParentsSettings }
  | { type: 'contact'; settings: ContactSettings }
  | { type: 'account'; settings: AccountSettings }
  | { type: 'message'; settings: MessageSettings }
  | { type: 'rsvp'; settings: RsvpSettings }
  | { type: 'video'; settings: VideoSettings }
  | { type: 'interview'; settings: InterviewSettings }
  | { type: 'timeline'; settings: TimelineSettings }
  | { type: 'dday'; settings: DdaySettings }
  | { type: 'transport'; settings: TransportSettings }
  | { type: 'guest-snap'; settings: GuestSnapSettings }
  | { type: 'notice'; settings: NoticeSettings }
  | { type: 'ending'; settings: EndingSettings }
  | { type: 'closing'; settings: EndingSettings }
  | { type: 'quote'; settings: { text: string; author?: string; style: 'simple' | 'decorated' } }
  | { type: 'profile'; settings: { showPhoto: boolean; showBio: boolean } }
  | { type: 'parents-contact'; settings: ContactSettings }
  | { type: 'loading'; settings: { duration: number; animation: 'fade' | 'spin' | 'pulse' } }
  | { type: 'announcement'; settings: NoticeSettings }
  | { type: 'flower-gift'; settings: { provider: string; enabled: boolean } }
  | { type: 'together-time'; settings: TimelineSettings }

// ============================================
// 섹션 설정 구조
// ============================================

/** 개별 섹션 설정 */
export interface SectionSetting {
  id: string
  type: ExtendedSectionType
  enabled: boolean
  order: number

  /** 레이블 커스터마이징 */
  label?: {
    title?: string       // 섹션 제목 커스텀
    subtitle?: string    // 섹션 부제목
  }

  /** 레이아웃 설정 */
  layout: {
    type: LayoutType
    padding: 'none' | 'small' | 'medium' | 'large'
    alignment: 'left' | 'center' | 'right'
  }

  /** 스타일 오버라이드 */
  style?: {
    backgroundColor?: string
    backgroundImage?: string
    textColor?: string
    accentColor?: string
  }

  /** 애니메이션 설정 */
  animation: {
    type: AnimationType
    trigger: 'on-enter' | 'on-scroll' | 'on-click' | 'auto'
    duration?: number
    delay?: number
  }

  /** 섹션별 고유 설정 */
  settings: Record<string, unknown>
}

// ============================================
// 배경 설정
// ============================================

export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'image' | 'pattern' | 'video'
  value: string  // 색상, URL, 그라데이션 값
  overlay?: string  // rgba 오버레이
  blur?: number
  parallax?: boolean
}

// ============================================
// 공유 설정
// ============================================

export interface SharingConfig {
  kakao: {
    enabled: boolean
    title?: string
    description?: string
    imageUrl?: string
    buttonText?: string
  }
  url: {
    title?: string
    description?: string
    imageUrl?: string
  }
  sms: {
    enabled: boolean
    template?: string
  }
}

// ============================================
// InvitationDesignData v2 (최종 구조)
// ============================================

export interface InvitationDesignData {
  /** 버전 (기존 데이터와 구분) */
  version: '2.0'

  /** 템플릿 정보 */
  template: {
    id: string
    source: 'static' | 'ai-generated'
    name?: string
  }

  /** 전역 스타일 */
  globalStyles: {
    colors: ColorPalette
    fonts: FontSet
    background: BackgroundConfig
  }

  /** 인트로 설정 */
  intro: IntroConfig

  /** 섹션 설정 (순서 포함) */
  sections: SectionSetting[]

  /** 전역 효과 */
  effects: EffectsConfig

  /** 공유 설정 */
  sharing: SharingConfig

  /** 커스텀 텍스트 오버라이드 */
  customTexts?: Record<string, string>

  /** 메타데이터 */
  meta: {
    createdAt: string
    updatedAt: string
    lastEditedBy: 'user' | 'ai'
  }
}

// ============================================
// 기본값 생성 헬퍼
// ============================================

export const DEFAULT_SECTION_SETTINGS: Record<ExtendedSectionType, Record<string, unknown>> = {
  hero: { displayMode: 'fullscreen', showDate: true, showVenue: true, showDday: true, nameOrder: 'groom-first', nameStyle: 'full' },
  greeting: { template: 'default', showSignature: true, signatureStyle: 'names' },
  calendar: { displayMode: 'full', showLunarDate: false, showDday: true, showTime: true, timeFormat: '12h' },
  gallery: { displayMode: 'carousel', columns: 2, aspectRatio: '3:4', showCaption: false, autoPlay: false, autoPlayInterval: 3000, filter: 'none', spacing: 'small' },
  location: { showMap: true, mapProvider: 'kakao', mapStyle: 'default', showDirections: true, directionLinks: ['kakao', 'naver'], showParkingInfo: false, showShuttleInfo: false },
  parents: { displayMode: 'side-by-side', showRelation: true, relationStyle: 'korean', showDeceasedMark: true, deceasedMarkStyle: '故' },
  contact: { displayMode: 'grid', showProfileImage: false, contactMethods: ['call', 'sms'], groupByFamily: true },
  account: { displayMode: 'tabs', showQRCode: false, showCopyButton: true, showKakaoPayButton: false, accounts: [] },
  message: { displayMode: 'cards', showTimestamp: true, allowAnonymous: false, maxLength: 300, moderationEnabled: false },
  rsvp: { enabled: false, fields: [], showMealOption: false, showAttendanceCount: false, maxGuests: 2 },
  closing: { displayMode: 'simple', showWatermark: true, showSocialShare: true, showSaveDate: true },
  // 신규 섹션
  loading: { duration: 2000, animation: 'fade' },
  quote: { text: '', style: 'simple' },
  profile: { showPhoto: true, showBio: false },
  'parents-contact': { displayMode: 'list', showProfileImage: false, contactMethods: ['call', 'sms'], groupByFamily: true },
  timeline: { displayMode: 'vertical', showConnectors: true, connectorStyle: 'line', events: [] },
  video: { source: 'youtube', autoPlay: false, muted: true, loop: false, showControls: true, aspectRatio: '16:9' },
  interview: { displayMode: 'card', questions: [], showBothAnswers: true },
  transport: { showSubway: true, showBus: true, showCar: true, showShuttle: false, showParking: true },
  notice: { items: [], displayMode: 'list' },
  announcement: { items: [], displayMode: 'cards' },
  'flower-gift': { provider: '', enabled: false },
  'together-time': { displayMode: 'vertical', showConnectors: true, connectorStyle: 'line', events: [] },
  dday: { displayMode: 'countdown', showDays: true, showHours: true, showMinutes: true, showSeconds: false, style: 'digital' },
  'guest-snap': { enabled: false, uploadEnabled: true, requireApproval: true, maxPhotos: 50, displayMode: 'grid', allowDownload: true },
  ending: { displayMode: 'simple', showWatermark: true, showSocialShare: true, showSaveDate: false },
}

/** 기본 섹션 순서 */
export const DEFAULT_SECTION_ORDER: ExtendedSectionType[] = [
  'hero',
  'greeting',
  'calendar',
  'gallery',
  'location',
  'transport',
  'parents',
  'contact',
  'account',
  'message',
  'closing',
]

// ============================================
// 타입 가드
// ============================================

export function isV2DesignData(data: unknown): data is InvitationDesignData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'version' in data &&
    (data as { version: string }).version === '2.0'
  )
}

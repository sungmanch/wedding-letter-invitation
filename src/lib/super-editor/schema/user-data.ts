/**
 * Super Editor - User Data Schema
 * 사용자가 입력한 데이터 구조 정의
 */

// ============================================
// User Data (User Input via Editor)
// ============================================

export interface UserData {
  version: '1.0'
  meta: UserDataMeta
  data: Record<string, unknown>
  settings?: UserSettings
  customOrder?: SectionOrder[]
}

export interface UserDataMeta {
  id: string
  templateId: string     // 사용 중인 템플릿 ID
  layoutId: string
  styleId: string
  editorId: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

// ============================================
// Section Order (사용자 정의 순서)
// ============================================

export interface SectionOrder {
  sectionId: string
  visible: boolean
  order: number
}

// ============================================
// User Settings
// ============================================

export interface UserSettings {
  // 언어 설정
  locale?: 'ko' | 'en' | 'ja' | 'zh'
  // 날짜/시간 형식
  dateFormat?: string
  timeFormat?: '12h' | '24h'
  // 테마 오버라이드
  themeOverrides?: ThemeOverrides
  // 기능 토글
  features?: FeatureToggles
}

export interface ThemeOverrides {
  colors?: {
    primary?: string
    secondary?: string
    accent?: string
    background?: string
    text?: string
  }
  fonts?: {
    heading?: string
    body?: string
  }
}

export interface FeatureToggles {
  bgm?: boolean
  guestbook?: boolean
  attendance?: boolean
  share?: boolean
  kakaoShare?: boolean
  copyLink?: boolean
  navigation?: boolean
}

// ============================================
// Wedding Invitation Data Types
// ============================================

/**
 * 웨딩 초대장 데이터 예시 구조
 * 실제 구조는 EditorSchema의 dataPath로 결정됨
 */
export interface WeddingInvitationData {
  // 커플 정보
  couple: {
    groom: PersonInfo
    bride: PersonInfo
    together?: string     // "신랑 & 신부"
    coupleName?: string   // "○○ 그리고 ○○"
  }
  // 예식 정보
  wedding: {
    date: string          // ISO date
    time: string          // ISO time
    dateDisplay?: string  // "2024년 12월 25일"
    timeDisplay?: string  // "오후 2시"
    dday?: number
  }
  // 장소 정보
  venue: {
    name: string
    hall?: string
    floor?: string
    address: string
    addressDetail?: string
    lat: number
    lng: number
    phone?: string
    parking?: string
    transport?: TransportInfo[]
  }
  // 포토 갤러리
  photos: {
    main?: string
    cover?: string
    gallery?: string[]
    intro?: string[]
  }
  // 인사말
  greeting: {
    title?: string
    content: string
  }
  // 마음 전하기 (축의금)
  accounts?: {
    groom?: AccountInfo[]
    bride?: AccountInfo[]
  }
  // 혼주 정보
  parents?: {
    groom?: ParentInfo
    bride?: ParentInfo
  }
  // 방명록/축하 메시지
  guestbook?: {
    enabled: boolean
    title?: string
  }
  // 참석 의사
  attendance?: {
    enabled: boolean
    title?: string
    options?: ('attending' | 'notAttending' | 'undecided')[]
    mealCount?: boolean
  }
  // 배경 음악
  bgm?: {
    enabled: boolean
    url?: string
    title?: string
    artist?: string
    autoplay?: boolean
  }
  // 추가 섹션들
  timeline?: TimelineItem[]
  interview?: InterviewItem[]
  story?: StoryItem[]
}

// ============================================
// Sub Types
// ============================================

export interface PersonInfo {
  name: string
  nameEn?: string
  role?: string           // "신랑" | "신부"
  phone?: string
  order?: number          // 1: 첫째 | 2: 둘째 ...
  parentLabel?: string    // "장남" | "차녀" 등
}

export interface ParentInfo {
  father?: {
    name: string
    phone?: string
    deceased?: boolean    // 故
  }
  mother?: {
    name: string
    phone?: string
    deceased?: boolean
  }
}

export interface AccountInfo {
  bank: string
  accountNumber: string
  holder: string
  kakaoPayUrl?: string
}

export interface TransportInfo {
  type: 'subway' | 'bus' | 'car' | 'shuttle' | 'other'
  description: string
}

export interface TimelineItem {
  year: string
  title: string
  description?: string
  image?: string
}

export interface InterviewItem {
  question: string
  groomAnswer?: string
  brideAnswer?: string
}

export interface StoryItem {
  date?: string
  title: string
  content: string
  image?: string
}

// ============================================
// Party Invitation Data Types
// ============================================

/**
 * 파티(청모장) 초대장 데이터 예시 구조
 */
export interface PartyInvitationData {
  // 호스트 정보
  host: {
    name: string
    phone?: string
    avatar?: string
  }
  // 파티 정보
  party: {
    title: string
    type?: string         // "생일파티" | "집들이" | "송년회" 등
    date: string
    time: string
    dateDisplay?: string
    timeDisplay?: string
  }
  // 장소
  venue: {
    name: string
    address: string
    addressDetail?: string
    lat?: number
    lng?: number
    phone?: string
  }
  // 안내 문구
  message: {
    title?: string
    content: string
  }
  // 사진
  photos?: string[]
  // 참석 확인
  rsvp?: {
    enabled: boolean
    deadline?: string
    maxGuests?: number
  }
}

// ============================================
// Data Utilities
// ============================================

/**
 * 데이터 경로로 값을 가져오는 헬퍼 타입
 * e.g., getByPath(data, "couple.groom.name") => string
 */
export type GetByPath<T, P extends string> =
  P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? GetByPath<T[K], Rest>
      : never
    : P extends keyof T
      ? T[P]
      : never

/**
 * 데이터 경로 문자열 타입
 * 자동완성을 위한 타입 (개발 편의성)
 */
export type DataPath<T> = T extends object
  ? {
      [K in keyof T & string]:
        | K
        | `${K}.${DataPath<T[K]>}`
    }[keyof T & string]
  : never

// ============================================
// Theme Template Schema
// 정적 템플릿과 AI 동적 생성 모두 지원
// ============================================

// ============================================
// 기본 타입 정의
// ============================================

/** 테마 카테고리 */
export type ThemeCategory =
  | 'cinematic'    // 영화적
  | 'playful'      // 유쾌한
  | 'artistic'     // 예술적
  | 'classic'      // 클래식
  | 'modern'       // 모던
  | 'retro'        // 레트로

/** 인트로 타입 - 정적 템플릿용 컴포넌트 ID */
export type IntroType =
  | 'cinematic'         // 화양연화/필름
  | 'exhibition'        // 갤러리/전시회
  | 'magazine'          // 보그/에디토리얼
  | 'chat'              // 메신저 대화
  | 'gothic-romance'    // 고딕 로맨스
  | 'old-money'         // Quiet Luxury
  | 'monogram'          // 모노그램 크레스트
  | 'jewel-velvet'      // 주얼 벨벳
  | 'boarding-pass'     // 보딩패스/레터프레스
  | 'custom'            // AI 동적 생성

/** 본문 인터랙션 방식 */
export type InteractionType =
  | 'scroll'            // 일반 스크롤
  | 'swipe'             // 페이지 넘김 (매거진)
  | 'horizontal'        // 가로 스크롤 (전시회)
  | 'chat-flow'         // 채팅 형식

/** 섹션 타입 */
export type SectionType =
  // 기존 섹션
  | 'hero'
  | 'greeting'
  | 'calendar'
  | 'gallery'
  | 'location'
  | 'parents'
  | 'contact'
  | 'account'
  | 'message'
  | 'rsvp'
  | 'closing'
  | 'story'             // 스토리/타임라인
  | 'interview'         // 인터뷰 형식
  // 신규 섹션 (Salon de Letter 수준)
  | 'loading'           // 로딩 화면
  | 'quote'             // 글귀
  | 'profile'           // 프로필형 소개
  | 'parents-contact'   // 혼주 연락처
  | 'timeline'          // 타임라인
  | 'video'             // 영상
  | 'transport'         // 교통수단
  | 'notice'            // 안내사항
  | 'announcement'      // 안내문
  | 'flower-gift'       // 화환 보내기
  | 'together-time'     // 함께한 시간
  | 'dday'              // D-DAY 카운트다운
  | 'guest-snap'        // 게스트스냅
  | 'ending'            // 엔딩 크레딧

/** 애니메이션 타입 */
export type AnimationType =
  | 'none'
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'zoom-in'
  | 'zoom-out'
  | 'rotate'
  | 'flip'
  | 'bounce'
  | 'parallax'
  | 'typewriter'
  | 'film-grain'
  | 'page-turn'         // 책장 넘김

/** 레이아웃 타입 */
export type LayoutType =
  | 'fullscreen'
  | 'centered'
  | 'left-aligned'
  | 'right-aligned'
  | 'split'
  | 'grid'
  | 'masonry'
  | 'carousel'
  | 'stack'
  | 'frame'             // 액자 스타일
  | 'overlay-text'      // 텍스트 오버레이
  | 'chat-bubble'       // 채팅 말풍선

// ============================================
// Color & Font
// ============================================

export interface ColorPalette {
  primary: string
  secondary: string
  background: string
  surface?: string        // 카드/컨테이너 배경
  text: string
  textMuted?: string
  accent: string
  overlay?: string        // 오버레이 색상 (rgba)
}

export interface FontConfig {
  family: string
  weight: number
  style?: 'normal' | 'italic'
  letterSpacing?: string
}

export interface FontSet {
  title: FontConfig
  body: FontConfig
  accent?: FontConfig     // 강조 폰트 (캡션, 레이블 등)
}

// ============================================
// Intro Configuration
// ============================================

export interface BgmConfig {
  trackId: string         // 미리 준비된 BGM ID
  volume: number          // 0-1
  fadeIn?: number         // ms
  fadeOut?: number        // ms
  loop?: boolean
  syncWithScroll?: boolean  // 스크롤 위치에 따라 볼륨 조절
}

export interface IntroConfig {
  type: IntroType
  duration: number        // 기본 지속 시간 (ms)
  skipEnabled: boolean
  skipDelay?: number      // skip 버튼 표시 딜레이 (ms)
  bgm?: BgmConfig

  /** 정적 인트로용 커스텀 설정 */
  settings?: {
    // Cinematic
    filmGrain?: boolean
    aspectRatio?: '16:9' | '4:3' | '21:9'
    subtitleStyle?: 'korean' | 'english' | 'mixed'

    // Exhibition
    frameStyle?: 'minimal' | 'classic' | 'ornate'
    navigationStyle?: 'horizontal' | 'grid' | '3d'

    // Magazine
    coverStyle?: 'vogue' | 'kinfolk' | 'mono'
    pageTransition?: 'slide' | 'flip' | 'fade'

    // Chat
    platform?: 'kakao' | 'imessage' | 'custom'
    botPersonality?: 'formal' | 'friendly' | 'witty'
  }

  /** AI 동적 생성 인트로용 (type이 'custom'일 때) */
  customIntro?: CustomIntroConfig
}

/** AI가 동적으로 생성하는 커스텀 인트로 */
export interface CustomIntroConfig {
  name: string
  description: string
  layers: IntroLayer[]
  timeline: IntroTimeline[]
}

export interface IntroLayer {
  id: string
  type: 'image' | 'text' | 'shape' | 'effect' | 'video'
  zIndex: number
  content: {
    // image
    imageSlot?: 'user-1' | 'user-2' | 'user-3' | 'asset'
    assetId?: string
    // text
    text?: string
    textVariable?: 'groom-name' | 'bride-name' | 'wedding-date' | 'venue' | 'dday'
    // shape
    shape?: 'circle' | 'rectangle' | 'line' | 'custom-path'
    path?: string
    // effect
    effect?: 'particles' | 'confetti' | 'snow' | 'petals' | 'sparkle' | 'grain'
  }
  initialStyle: LayerStyle
}

export interface LayerStyle {
  position: { x: string; y: string }
  size: { width: string; height: string }
  opacity?: number
  transform?: string
  filter?: string
  mixBlendMode?: string
}

export interface IntroTimeline {
  layerId: string
  keyframes: {
    offset: number          // 0-1
    style: Partial<LayerStyle>
  }[]
  timing: {
    delay: number
    duration: number
    easing: string
    iterations?: number
    fill?: 'forwards' | 'backwards' | 'both' | 'none'
  }
}

// ============================================
// Section Configuration
// ============================================

export interface SectionConfig {
  id: string
  type: SectionType
  enabled: boolean
  order: number

  layout: LayoutType
  animation: {
    type: AnimationType
    trigger: 'on-enter' | 'on-scroll' | 'on-click' | 'auto'
    duration?: number
    delay?: number
    stagger?: number        // 자식 요소 순차 애니메이션
  }

  style: {
    backgroundColor?: string
    backgroundImage?: string
    backgroundEffect?: 'grain' | 'gradient' | 'pattern' | 'aurora'
    textColor?: string
    padding?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
    margin?: 'none' | 'small' | 'medium' | 'large'
    borderRadius?: string
    glassmorphism?: boolean
  }

  content?: {
    titleSize?: 'small' | 'medium' | 'large' | 'xlarge' | 'hero'
    titleAnimation?: AnimationType
    showDecorations?: boolean
    decorationType?: 'floral' | 'minimal' | 'frame' | 'none'
    customTexts?: Record<string, string>
    // 테마별 특수 설정
    themeSpecific?: Record<string, unknown>
  }
}

// ============================================
// Global Effects
// ============================================

export interface EffectsConfig {
  background?: {
    type: 'solid' | 'gradient' | 'pattern' | 'animated' | 'aurora'
    value: string
    animation?: string
  }

  particles?: {
    enabled: boolean
    type: 'snow' | 'petals' | 'confetti' | 'sparkle' | 'hearts'
    density?: 'low' | 'medium' | 'high'
    color?: string
  }

  cursor?: {
    type: 'default' | 'custom' | 'trail' | 'hidden'
    asset?: string
  }

  soundEffects?: {
    enabled: boolean
    onClick?: string
    onScroll?: string
    onHover?: string
  }

  scrollBehavior?: {
    smooth: boolean
    indicator?: boolean
    indicatorStyle?: 'dot' | 'line' | 'text' | 'progress'
    snapToSection?: boolean
  }

  transition?: {
    type: 'fade' | 'slide' | 'zoom' | 'blur'
    duration: number
  }
}

// ============================================
// Theme Template (정적 + 동적 공통)
// ============================================

export interface ThemeTemplate {
  // 메타 정보
  id: string
  version: string
  source: 'static' | 'ai-generated'
  createdAt?: string

  // 기본 정보
  name: string
  nameKo: string
  category: ThemeCategory
  description: string
  descriptionKo: string

  // AI 매칭용
  matchKeywords: string[]
  matchScore?: number

  // 추천 대상
  recommendedFor: string
  recommendedForKo: string

  // 미리보기
  preview: {
    thumbnail?: string
    video?: string            // 미리보기 영상
    colors: ColorPalette
    mood: string[]
  }

  // 인트로
  intro: IntroConfig

  // 본문 인터랙션
  interaction: InteractionType

  // 기본 스타일
  defaultColors: ColorPalette
  defaultFonts: FontSet

  // 섹션 구성
  sections: SectionConfig[]

  // 글로벌 효과
  effects: EffectsConfig

  // 커스터마이징 허용 범위
  customizable: {
    colors: boolean
    fonts: boolean
    sectionOrder: boolean
    sectionToggle: boolean
    introSettings: boolean
    effects: boolean
  }
}

// ============================================
// 사용자 청첩장에 저장되는 최종 데이터
// ============================================

export interface InvitationThemeData {
  // 베이스 템플릿
  templateId: string
  templateSource: 'static' | 'ai-generated'

  // 커스터마이징된 스타일
  colors: ColorPalette
  fonts: FontSet

  // 이미지 슬롯
  images: {
    intro: string[]           // 인트로에 사용될 이미지 URLs
    hero?: string             // 히어로 배경
    gallery: string[]         // 갤러리
    profile?: {               // 프로필 사진
      groom?: string
      bride?: string
    }
  }

  // 오디오 (사용자 업로드 또는 선택)
  audio?: {
    bgmTrackId?: string       // 선택한 BGM
    customBgmUrl?: string     // 사용자 업로드 BGM
    voiceMessageUrl?: string  // 음성 메시지 (전시회 테마)
  }

  // 섹션 설정 (템플릿 기본값 오버라이드)
  sections: SectionConfig[]

  // 인트로 설정 (커스터마이징된)
  intro: IntroConfig

  // 효과 설정
  effects: EffectsConfig

  // 테마별 특수 데이터
  themeData?: {
    // Chat 테마: 대화 스크립트
    chatScript?: { sender: 'groom' | 'bride' | 'bot'; message: string; delay?: number }[]
    // Interview 테마: Q&A
    interview?: { question: string; groomAnswer?: string; brideAnswer?: string }[]
  }
}

// ============================================
// 유틸리티 타입
// ============================================

/** 템플릿 미리보기용 간소화 데이터 */
export interface ThemePreview {
  id: string
  name: string
  nameKo: string
  category: ThemeCategory
  description: string
  thumbnail?: string
  colors: ColorPalette
  mood: string[]
  matchScore?: number
}

/** AI 생성 요청 */
export interface AIThemeRequest {
  userPrompt: string
  uploadedImages: string[]
  preferences?: {
    category?: ThemeCategory
    mood?: string[]
    colors?: Partial<ColorPalette>
  }
}

/** AI 생성 응답 */
export interface AIThemeResponse {
  recommendations: ThemePreview[]
  customTheme?: ThemeTemplate    // 완전 새로운 테마 생성시
}

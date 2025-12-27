/**
 * Super Editor v2 - Core Types
 *
 * 핵심 변경사항:
 * - LayoutSchema의 screens[] → blocks[] 기반 구조
 * - Block = 의미적 컨테이너 (type으로 AI 맥락 이해)
 * - Element = 변수 바인딩 포함 요소
 * - StyleSystem = 3-Level 하이브리드 (preset → quick → advanced)
 * - GlobalAnimation = 전역 애니메이션 설정
 */

// ============================================
// 1. 최상위 문서 구조
// ============================================

export interface EditorDocument {
  id: string
  version: 2  // 스키마 버전

  // 메타데이터
  meta: DocumentMeta

  // 전역 스타일 시스템 (3-Level 하이브리드)
  style: StyleSystem

  // 전역 애니메이션 설정
  animation: GlobalAnimation

  // 블록 목록 (순서대로)
  blocks: Block[]

  // 정형 데이터 (변수 값)
  data: WeddingData
}

export interface DocumentMeta {
  title: string
  createdAt: string
  updatedAt: string
}

// ============================================
// 2. 블록 시스템
// ============================================

// ─── Auto Layout 크기 모드 ───
export type SizeMode =
  | { type: 'fixed'; value: number; unit?: 'px' | 'vh' | 'vw' | '%' }
  | { type: 'hug' }                         // fit-content
  | { type: 'fill' }                        // 100% + flex: 1
  | { type: 'fill-portion'; value: number } // flex 비율

// ─── 블록 레이아웃 설정 ───
export interface BlockLayout {
  mode: 'absolute' | 'auto'  // 기본: 'absolute'

  // Auto 모드 전용
  direction?: 'vertical' | 'horizontal'  // 기본: 'vertical'
  gap?: number              // px, 자식 간 간격
  padding?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }

  // 정렬
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'

  // 래핑 (horizontal일 때)
  wrap?: boolean
}

export interface Block {
  id: string

  // 의미적 타입 (AI 맥락 이해용)
  type: BlockType

  // 프리셋 ID (e.g., 'calendar-countdown', 'profile-dual-card')
  presetId?: string

  // 블록 활성화 여부
  enabled: boolean

  // ─── 레이아웃 설정 (신규) ───
  layout?: BlockLayout

  // 블록 높이 (vh 단위 또는 SizeMode)
  height: number | SizeMode

  // 요소들 (변수 바인딩 포함)
  elements: Element[]

  // 블록 레벨 스타일 오버라이드
  style?: BlockStyleOverride

  // 블록 레벨 애니메이션
  animation?: BlockAnimationConfig
}

export type BlockType =
  // ─── 핵심 섹션 ───
  | 'hero'              // 메인 히어로 (메인 사진, 이름, 날짜)
  | 'greeting-parents'  // 인사말 + 혼주 소개 (통합)
  | 'profile'           // 신랑신부 소개/인터뷰
  | 'calendar'          // 예식일시 (달력/D-day)
  | 'gallery'           // 갤러리 (사진/영상)
  | 'rsvp'              // 참석 여부
  | 'location'          // 오시는길 (예식장 정보 + 지도 + 교통)
  | 'notice'            // 공지사항/안내
  | 'account'           // 축의금 계좌
  | 'message'           // 방명록/축하 메시지
  | 'ending'            // 축하화환/공유/엔딩
  // ─── 오버레이/모달 ───
  | 'contact'           // 연락처 (오버레이로 표시)
  // ─── 기타 기능 ───
  | 'music'             // BGM 컨트롤
  | 'loading'           // 로딩 화면
  | 'custom'            // 사용자 정의 블록

// ============================================
// 3. 요소 시스템 (Element)
// ============================================

// ─── 요소 크기 제약 ───
export interface ElementConstraints {
  minWidth?: number   // px
  maxWidth?: number   // px
  minHeight?: number  // px
  maxHeight?: number  // px
}

// ─── 요소 크기 설정 ───
export interface ElementSizing {
  width?: SizeMode   // 기본: { type: 'fill' }
  height?: SizeMode  // 기본: { type: 'hug' }
}

export interface Element {
  id: string
  type: ElementType

  // ─── 레이아웃 모드 선택 ───
  layoutMode?: 'absolute' | 'auto'  // 기본: 'absolute' (하위 호환)

  // ─── Absolute 모드 (기존) ───
  x?: number       // vw (absolute 모드에서 사용)
  y?: number       // vh (블록 내 상대 위치)
  width?: number   // vw (absolute 모드 또는 고정 너비)
  height?: number  // vh (absolute 모드 또는 고정 높이)
  rotation?: number // degrees (기본값: 0)

  // ─── Auto Layout 모드 (신규) ───
  sizing?: ElementSizing
  constraints?: ElementConstraints

  // 부모 Auto Layout 내에서 자기 정렬
  alignSelf?: 'start' | 'center' | 'end' | 'stretch'

  // z-index
  zIndex: number

  // 변수 바인딩 (AI가 의미 파악)
  binding?: VariablePath

  // 바인딩 없을 때 직접 값
  value?: string | number

  // 타입별 추가 속성
  props: ElementProps

  // 요소별 스타일
  style?: ElementStyle

  // 요소별 애니메이션
  animation?: ElementAnimationConfig
}

export type ElementType = 'text' | 'image' | 'shape' | 'button' | 'icon' | 'divider' | 'map' | 'calendar'

export type ElementProps =
  | TextProps
  | ImageProps
  | ShapeProps
  | ButtonProps
  | IconProps
  | DividerProps
  | MapProps
  | CalendarProps

export interface TextProps {
  type: 'text'
  format?: string  // 포맷팅 (e.g., '{groom.name} ♥ {bride.name}')
}

export interface ImageProps {
  type: 'image'
  objectFit: 'cover' | 'contain' | 'fill'
  overlay?: string  // 이미지 위 오버레이 색상
}

export interface ShapeProps {
  type: 'shape'
  shape: 'rectangle' | 'circle' | 'line' | 'heart' | 'custom'
  fill?: string
  stroke?: string
  strokeWidth?: number
  svgPath?: string  // custom shape용
  svgViewBox?: string  // custom shape viewBox (예: "0 0 50 50")
}

export interface ButtonProps {
  type: 'button'
  label: string
  action: 'link' | 'phone' | 'map' | 'copy' | 'share' | 'contact-modal' | 'rsvp-modal' | 'show-block'
  targetBlockType?: BlockType  // action: 'show-block'일 때 표시할 블록 타입
}

export interface IconProps {
  type: 'icon'
  icon: string  // 아이콘 ID
  size: number
  color?: string
}

export interface DividerProps {
  type: 'divider'
  dividerStyle: 'solid' | 'dashed' | 'dotted' | 'ornament'
  ornamentId?: string
}

export interface MapProps {
  type: 'map'
  zoom?: number
  showMarker?: boolean
}

export interface CalendarProps {
  type: 'calendar'
  showDday?: boolean
  highlightColor?: string
  markerType?: 'circle' | 'heart'  // 날짜 선택 마커 타입
}

// ============================================
// 4. 변수 바인딩 시스템
// ============================================

export type VariablePath =
  // ─── 공유 필드 (◆ 원본) ───
  | 'couple.groom.name' | 'couple.groom.phone' | 'couple.groom.intro' | 'couple.groom.baptismalName'
  | 'couple.groom.photo' | 'couple.groom.birthDate' | 'couple.groom.mbti' | 'couple.groom.tags'
  | 'couple.bride.name' | 'couple.bride.phone' | 'couple.bride.intro' | 'couple.bride.baptismalName'
  | 'couple.bride.photo' | 'couple.bride.birthDate' | 'couple.bride.mbti' | 'couple.bride.tags'
  | 'couple.photo' | 'couple.photos'
  | 'wedding.date' | 'wedding.time'

  // ─── 자동 계산 (__HIDDEN__) ───
  | 'wedding.dateDisplay' | 'wedding.timeDisplay' | 'wedding.dday'
  | 'wedding.month' | 'wedding.day' | 'wedding.weekday'
  | 'countdown.days' | 'countdown.hours' | 'countdown.minutes' | 'countdown.seconds'

  // ─── 혼주 ───
  | 'parents.deceasedIcon'
  | 'parents.groom.birthOrder' | 'parents.bride.birthOrder'
  | 'parents.groom.father.name' | 'parents.groom.father.status' | 'parents.groom.father.phone' | 'parents.groom.father.baptismalName'
  | 'parents.groom.mother.name' | 'parents.groom.mother.status' | 'parents.groom.mother.phone' | 'parents.groom.mother.baptismalName'
  | 'parents.bride.father.name' | 'parents.bride.father.status' | 'parents.bride.father.phone' | 'parents.bride.father.baptismalName'
  | 'parents.bride.mother.name' | 'parents.bride.mother.status' | 'parents.bride.mother.phone' | 'parents.bride.mother.baptismalName'

  // ─── 장소 ───
  | 'venue.name' | 'venue.hall' | 'venue.address' | 'venue.tel'
  | 'venue.lat' | 'venue.lng'
  | 'venue.naverUrl' | 'venue.kakaoUrl' | 'venue.tmapUrl'
  | 'venue.transportation.bus' | 'venue.transportation.subway'
  | 'venue.transportation.shuttle' | 'venue.transportation.parking' | 'venue.transportation.etc'

  // ─── 사진 ───
  | 'photos.main' | 'photos.gallery'

  // ─── 섹션 설정 ───
  | 'intro.message'
  | 'greeting.title' | 'greeting.content'
  | 'contact.showParents'
  | 'gallery.effect'
  | 'accounts.groom' | 'accounts.bride' | 'accounts.kakaopay.groom' | 'accounts.kakaopay.bride'
  | 'rsvp.title' | 'rsvp.description' | 'rsvp.deadline'
  | 'notice.items'
  | 'guestbook.title' | 'guestbook.placeholder'
  | 'ending.message' | 'ending.photo'
  | 'bgm.trackId' | 'bgm.title' | 'bgm.artist'
  | 'video.type' | 'video.url' | 'video.title'

  // ─── 확장 섹션 ───
  | 'interview.title' | 'interview.subtitle' | 'interview.items'
  | 'timeline.title' | 'timeline.subtitle' | 'timeline.items'

  // ─── Legacy 호환 ───
  | 'groom.name' | 'groom.nameEn' | 'groom.fatherName' | 'groom.motherName'
  | 'groom.fatherPhone' | 'groom.motherPhone' | 'groom.phone' | 'groom.account'
  | 'bride.name' | 'bride.nameEn' | 'bride.fatherName' | 'bride.motherName'
  | 'bride.fatherPhone' | 'bride.motherPhone' | 'bride.phone' | 'bride.account'
  | 'venue.floor' | 'venue.addressDetail' | 'venue.coordinates'
  | 'venue.phone' | 'venue.parkingInfo' | 'venue.transportInfo'
  | 'music.url' | 'music.title' | 'music.artist'

  // ─── 커스텀 ───
  | `custom.${string}`

// ============================================
// 5. 스타일 시스템 (3-Level)
// ============================================

export interface StyleSystem {
  version: 2

  // Level 1: 프리셋 (초보자용)
  preset?: ThemePresetId

  // Level 2: 빠른 설정 (중급자용)
  quick?: QuickStyleConfig

  // Level 3: 고급 설정 (AI/전문가용)
  advanced?: AdvancedStyleConfig

  // 공통: 타이포그래피 & 이펙트
  typography: TypographyConfig
  effects: EffectsConfig
}

export type ThemePresetId =
  // 기본
  | 'minimal-light'
  | 'minimal-dark'
  // 클래식
  | 'classic-ivory'
  | 'classic-gold'
  // 모던
  | 'modern-mono'
  | 'modern-contrast'
  // 로맨틱
  | 'romantic-blush'
  | 'romantic-garden'
  // 시네마틱
  | 'cinematic-dark'
  | 'cinematic-warm'
  // 특수
  | 'photo-adaptive'
  | 'duotone'
  | 'gradient-hero'

export interface QuickStyleConfig {
  // 색상 조정
  dominantColor?: string
  accentColor?: string
  secondaryColor?: string

  // 전체 무드 조정
  mood?: 'warm' | 'cool' | 'neutral'
  contrast?: 'low' | 'medium' | 'high'
  saturation?: 'muted' | 'normal' | 'vivid'

  // 사진 기반 추출
  photoExtraction?: PhotoExtractionConfig

  // 블록별 간단 설정
  blockModes?: Record<string, 'light' | 'dark' | 'accent'>
}

export interface PhotoExtractionConfig {
  enabled: boolean
  source: 'photos.main' | string
  mapping: {
    dominant: 'most-common' | 'most-saturated' | 'darkest' | 'lightest'
    accent: 'complementary' | 'second-common' | 'most-saturated'
  }
  adjustments?: {
    saturation?: number
    brightness?: number
    warmth?: number
  }
}

export interface AdvancedStyleConfig {
  // 원시 팔레트
  palette: PaletteColor[]

  // 시맨틱 토큰
  tokens: SemanticTokens

  // 블록별 토큰 오버라이드
  blockOverrides?: Record<string, BlockThemeConfig>
}

export interface PaletteColor {
  id: string
  value: ColorValue
  variants?: {
    light: string
    dark: string
    muted: string
  }
}

export type ColorValue = string | GradientValue

export interface GradientValue {
  type: 'linear' | 'radial' | 'conic'
  angle?: number
  shape?: 'circle' | 'ellipse'
  position?: string
  stops: { color: string; position: number; opacity?: number }[]
}

export interface SemanticTokens {
  // 배경
  'bg-page': string
  'bg-section': string
  'bg-section-alt': string
  'bg-card': string
  'bg-overlay': string

  // 전경
  'fg-default': string
  'fg-muted': string
  'fg-emphasis': string
  'fg-inverse': string
  'fg-on-accent': string

  // 강조/액션
  'accent-default': string
  'accent-hover': string
  'accent-active': string
  'accent-secondary': string

  // 보더
  'border-default': string
  'border-emphasis': string
  'border-muted': string

  // 그라데이션 (선택)
  'gradient-hero'?: GradientValue
  'gradient-accent'?: GradientValue
  'gradient-overlay'?: GradientValue
}

export interface BlockThemeConfig {
  mode: 'inherit' | 'invert' | 'custom'
  inversion?: {
    type: 'full' | 'bg-only' | 'text-only'
  }
  tokens?: Partial<SemanticTokens>
}

export interface TypographyConfig {
  preset?: TypographyPresetId
  custom?: {
    fontStacks?: {
      display?: string  // 히어로/인트로용 (예술적)
      heading?: string  // 섹션 제목용
      body?: string     // 섹션 본문용
    }
    weights?: {
      display?: number
      heading?: number
      body?: number
    }
    scale?: Partial<TypeScale>
  }
}

export type TypographyPresetId =
  // 클래식/우아
  | 'classic-elegant'
  | 'classic-traditional'
  | 'classic-romantic'
  // 모던/미니멀
  | 'modern-minimal'
  | 'modern-clean'
  | 'modern-geometric'
  // 로맨틱/감성
  | 'romantic-script'
  | 'romantic-italian'
  | 'romantic-soft'
  // 내추럴/손글씨
  | 'natural-handwritten'
  | 'natural-brush'
  | 'natural-warm'
  | 'natural-witty'

export interface TypeScale {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
}

export interface EffectsConfig {
  preset?: EffectsPresetId
  custom?: {
    radius: Record<string, number>
    shadows: Record<string, string>
    blurs: Record<string, number>
    textures?: Record<string, TextureConfig>
  }
}

export type EffectsPresetId = 'minimal' | 'soft' | 'elegant' | 'dramatic'

export interface TextureConfig {
  type: 'noise' | 'grain' | 'paper'
  opacity: number
  blend: BlendMode
}

export type BlendMode =
  | 'normal' | 'multiply' | 'screen' | 'overlay'
  | 'darken' | 'lighten' | 'color-dodge' | 'color-burn'
  | 'soft-light' | 'hard-light' | 'difference' | 'exclusion'

// ============================================
// 6. 요소/블록 스타일
// ============================================

export interface ElementStyle {
  text?: TextStyle
  background?: string | GradientValue
  border?: BorderStyle
  shadow?: string
  opacity?: number
  // 일부 요소에서 width/height를 style.size로 지정
  size?: {
    width?: number
    height?: number
  }
  // 위치 정보 (일부 레거시 데이터)
  position?: {
    x?: number
    y?: number
  }
}

export interface TextStyle {
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  lineHeight?: number
  letterSpacing?: number
}

export interface BorderStyle {
  width: number
  color: string
  style: 'solid' | 'dashed'
  radius: number
}

export interface BlockStyleOverride {
  theme?: BlockThemeConfig
  background?: string | GradientValue | { color: string }
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number }
}

// ============================================
// 7. 애니메이션 시스템
// ============================================

export interface GlobalAnimation {
  // 전역 무드
  mood?: AnimationMood
  // 전체 속도 배율
  speed?: number
  // 커스텀 easing 프리셋
  easingPresets?: Record<string, string>
  // Floating 요소 (블록 독립적)
  floatingElements?: FloatingElement[]
}

export type AnimationMood =
  | 'minimal'    // 최소한의 애니메이션
  | 'subtle'     // 은은한 효과
  | 'elegant'    // 우아한 전환
  | 'playful'    // 경쾌한 움직임
  | 'dramatic'   // 극적인 효과
  | 'cinematic'  // 영화적 느낌

export interface FloatingElement {
  id: string
  element: Element
  position: 'fixed' | 'sticky'
  anchor: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  offset?: { x: number; y: number }
  showCondition?: {
    type: 'scroll' | 'time' | 'state'
    value: number | string
  }
}

export interface BlockAnimationConfig {
  entrance?: EntranceAnimation
  scroll?: ScrollAnimation
  interactions?: Interaction[]
}

export interface ElementAnimationConfig {
  entrance?: EntranceAnimation
  hover?: HoverAnimation
  loop?: LoopAnimation
  interactions?: Interaction[]
}

export interface EntranceAnimation {
  preset?: string
  custom?: AnimationAction
  delay?: number
  duration?: number
}

export interface ScrollAnimation {
  trigger: ScrollTrigger
  action: AnimationAction
}

export interface HoverAnimation {
  action: AnimationAction
  duration?: number
}

export interface LoopAnimation {
  action: AnimationAction
  iterations?: number  // -1 = 무한
  direction?: 'normal' | 'alternate'
}

// ============================================
// 8. 트리거 시스템
// ============================================

export type Trigger =
  | ScrollTrigger
  | GestureTrigger
  | EventTrigger
  | StateTrigger
  | TimeTrigger

export interface ScrollTrigger {
  type: 'scroll'
  target?: string
  start: string
  end?: string
  scrub?: boolean | number
  direction?: 'down' | 'up' | 'both'
  enter?: boolean
  leave?: boolean
  once?: boolean
}

export interface GestureTrigger {
  type: 'gesture'
  gesture: 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch' | 'drag' | 'hover'
  target: string
  direction?: 'left' | 'right' | 'up' | 'down' | 'horizontal' | 'vertical'
  scale?: 'in' | 'out'
  axis?: 'x' | 'y' | 'both'
  bounds?: { min: number; max: number }
}

export interface EventTrigger {
  type: 'event'
  event: string
  target?: string
}

export interface StateTrigger {
  type: 'state'
  from?: string
  to: string
}

export interface TimeTrigger {
  type: 'time'
  delay: number
  repeat?: number
  interval?: number
}

// ============================================
// 9. 애니메이션 액션
// ============================================

export type AnimationAction =
  | TweenAction
  | SequenceAction
  | TimelineAction
  | SpringAction
  | PathAction
  | MorphAction
  | StaggerAction
  | SetAction

export interface TweenAction {
  type: 'tween'
  target: string | string[]
  from?: AnimationProperties
  to: AnimationProperties
  duration: number
  easing?: EasingFunction
  delay?: number
  direction?: 'normal' | 'reverse' | 'alternate'
  iterations?: number
  fill?: 'none' | 'forwards' | 'backwards' | 'both'
}

export interface SequenceAction {
  type: 'sequence'
  steps: AnimationAction[]
}

export interface TimelineAction {
  type: 'timeline'
  tracks: {
    action: AnimationAction
    at: number | string
  }[]
  totalDuration?: number
}

export interface SpringAction {
  type: 'spring'
  target: string
  to: AnimationProperties
  stiffness?: number
  damping?: number
  mass?: number
  velocity?: number
}

export interface PathAction {
  type: 'path'
  target: string
  path: string
  align?: boolean
  alignOffset?: number
  start?: number
  end?: number
  duration: number
  easing?: EasingFunction
}

export interface MorphAction {
  type: 'morph'
  target: string
  fromPath?: string
  toPath: string
  duration: number
  easing?: EasingFunction
}

export interface StaggerAction {
  type: 'stagger'
  targets: string | string[]
  action: TweenAction | SpringAction
  stagger: number | StaggerConfig
}

export interface StaggerConfig {
  each?: number
  from?: 'first' | 'last' | 'center' | 'edges' | number
  grid?: [number, number]
  axis?: 'x' | 'y'
}

export interface SetAction {
  type: 'set'
  target: string | string[]
  properties: AnimationProperties
}

export interface AnimationProperties {
  // Transform
  x?: number | string
  y?: number | string
  z?: number | string
  scale?: number
  scaleX?: number
  scaleY?: number
  rotate?: number
  rotateX?: number
  rotateY?: number
  skewX?: number
  skewY?: number

  // 3D
  perspective?: number
  transformOrigin?: string

  // Opacity & Visibility
  opacity?: number
  visibility?: 'visible' | 'hidden'

  // Filter
  blur?: number
  brightness?: number
  contrast?: number
  grayscale?: number
  saturate?: number
  sepia?: number
  hueRotate?: number

  // Clip & Mask
  clipPath?: string
  maskImage?: string

  // Size
  width?: number | string
  height?: number | string

  // Color
  backgroundColor?: string
  color?: string
  borderColor?: string

  // SVG 전용
  strokeDashoffset?: number
  strokeDasharray?: string
  pathLength?: number

  // Custom CSS 변수
  [key: `--${string}`]: string | number | undefined
}

export type EasingFunction =
  | 'linear'
  | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  | 'spring' | 'bounce'
  | string

export interface Interaction {
  id: string
  name?: string
  trigger: Trigger
  action: AnimationAction
  condition?: {
    state?: string
    media?: string
    expression?: string
  }
  cancels?: string[]
  enabled?: boolean
}

// ============================================
// 10. 정형 데이터 (WeddingData)
// section-data.md v2.2 기준
// ============================================

export interface WeddingData {
  // ═══════════════════════════════════════════════
  // 공유 필드 (원본 정의)
  // ═══════════════════════════════════════════════

  couple: {
    groom: PersonInfo      // ◆ 원본: intro
    bride: PersonInfo      // ◆ 원본: intro
    photo?: string         // 커플 대표 사진
    photos?: string[]      // 인터뷰 진입점용 카드 이미지들
  }

  wedding: {
    date: string           // ◆ 원본: intro (ISO 형식)
    time: string           // date 섹션
  }

  // ═══════════════════════════════════════════════
  // 혼주 정보 (greeting 섹션)
  // ═══════════════════════════════════════════════

  parents?: {
    deceasedIcon?: '故' | '고' | '✿'
    groom: { father?: ParentInfo; mother?: ParentInfo; birthOrder?: string }
    bride: { father?: ParentInfo; mother?: ParentInfo; birthOrder?: string }
  }

  // ═══════════════════════════════════════════════
  // 기타 공유 데이터
  // ═══════════════════════════════════════════════

  venue: VenueInfo
  photos: { main?: string; gallery?: string[] }

  // ═══════════════════════════════════════════════
  // 섹션별 설정
  // ═══════════════════════════════════════════════

  intro?: { message?: string }
  greeting?: { title?: string; content?: string }
  contact?: { showParents?: boolean }
  gallery?: { effect?: GalleryEffect }
  accounts?: AccountsConfig
  rsvp?: RsvpConfig
  notice?: { items?: NoticeItem[] }
  guestbook?: GuestbookConfig
  ending?: EndingConfig
  bgm?: { trackId?: string; title?: string; artist?: string }
  video?: VideoConfig

  // ═══════════════════════════════════════════════
  // 확장 섹션 (About Us, Interview, Timeline)
  // ═══════════════════════════════════════════════

  interview?: InterviewConfig    // Q&A 팝업
  timeline?: TimelineConfig      // 연애 스토리

  // 커스텀 변수 (AI 생성용)
  custom?: Record<string, string>

  // ═══════════════════════════════════════════════
  // Legacy 호환 필드 (점진적 마이그레이션)
  // ═══════════════════════════════════════════════
  /** @deprecated couple.groom 사용 권장 */
  groom?: PersonInfo
  /** @deprecated couple.bride 사용 권장 */
  bride?: PersonInfo
  /** @deprecated accounts 사용 권장 */
  additionalAccounts?: AccountInfo[]
  /** @deprecated bgm 사용 권장 */
  music?: {
    url: string
    title?: string
    artist?: string
    autoPlay: boolean
  }
}

export interface PersonInfo {
  name: string
  phone?: string
  intro?: string        // 소개글
  baptismalName?: string // 세례명
  // 프로필 확장 (About Us)
  photo?: string        // 개인 사진
  birthDate?: string    // "1990-12-10"
  mbti?: string         // "ISTP"
  tags?: string[]       // ["캠핑", "러닝"]
  // Legacy 호환
  nameEn?: string
  fatherName?: string
  motherName?: string
  fatherPhone?: string
  motherPhone?: string
  account?: {
    bank: string
    number: string
    holder: string
  }
}

export interface VenueInfo {
  name: string
  hall?: string
  address?: string      // ⚙️ 자동
  lat?: number          // ⚙️ 자동
  lng?: number          // ⚙️ 자동
  tel?: string
  naverUrl?: string
  kakaoUrl?: string
  tmapUrl?: string
  transportation?: {
    bus?: string
    subway?: string
    shuttle?: string
    parking?: string
    etc?: string
  }
  // Legacy 호환
  floor?: string
  addressDetail?: string
  coordinates?: {
    lat: number
    lng: number
  }
  phone?: string
  parkingInfo?: string
  transportInfo?: string
}

export interface PhotoData {
  id: string
  url: string
  thumbnailUrl?: string
  alt?: string
  width?: number
  height?: number
}

export interface AccountInfo {
  side: 'groom' | 'bride'
  relation: string
  bank: string
  number: string
  holder: string
}

// ═══════════════════════════════════════════════
// 신규 서브 타입 (section-data.md v2.2)
// ═══════════════════════════════════════════════

export interface ParentInfo {
  name?: string
  status?: '' | '故'
  baptismalName?: string
  phone?: string
}

export interface AccountsConfig {
  groom?: AccountItem[]  // max 3
  bride?: AccountItem[]  // max 3
  kakaopay?: { groom?: string; bride?: string }
}

export interface AccountItem {
  relation: string  // 본인 | 아버지 | 어머니
  bank: string
  number: string
  holder: string
}

export interface RsvpConfig {
  title?: string
  description?: string
  showGuestCount?: boolean  // 기본: true
  showMeal?: boolean        // 기본: false
  showMessage?: boolean     // 기본: true
  showSide?: boolean
  showBusOption?: boolean
  deadline?: string
  privacyPolicyUrl?: string
  privacyPolicyText?: string
}

export interface NoticeItem {
  title: string
  content: string
  icon?: 'bus' | 'car' | 'utensils' | 'info' | 'gift' | 'clock'
  image?: string
  imagePosition?: 'top' | 'bottom'
}

export interface GuestbookConfig {
  title?: string
  placeholder?: string
  requireName?: boolean  // 기본: true
  maxLength?: number     // 기본: 500
  // Legacy 호환
  enabled?: boolean
  requirePassword?: boolean
}

export interface EndingConfig {
  message?: string
  photo?: string
  showCredit?: boolean  // 기본: true
  wreath?: { enabled?: boolean; vendorUrl?: string; vendorName?: string }
  share?: { kakao?: boolean; link?: boolean; sms?: boolean }
}

export interface VideoConfig {
  type?: 'youtube' | 'vimeo'
  url?: string
  title?: string
  autoplay?: boolean  // 기본: false
  muted?: boolean     // 기본: true
}

export type GalleryEffect = 'slide' | 'fade' | 'coverflow' | 'cards' | 'cube'

// Q&A 인터뷰 (팝업)
export interface InterviewConfig {
  title?: string        // "우리에게 물었습니다"
  subtitle?: string     // "결혼을 앞두고 저희 두 사람의 인터뷰를 준비했습니다"
  items: InterviewItem[]  // max 5
}

export interface InterviewItem {
  question: string      // "첫인상은 어땠나요?"
  groomAnswer: string   // 신랑 답변
  brideAnswer: string   // 신부 답변
}

// 타임라인 (연애 스토리)
export interface TimelineConfig {
  title?: string        // "우리의 이야기"
  subtitle?: string     // "처음 만난 순간부터 지금까지"
  items: TimelineItem[]
}

export interface TimelineItem {
  date: string          // "14년 1월 16일" 또는 "연애 기간 11년"
  title: string         // "CGV 아르바이트"
  content?: string      // "같은 곳에서 함께 일하다..."
  image?: string
  type?: 'event' | 'milestone'  // milestone = 강조 표시
}

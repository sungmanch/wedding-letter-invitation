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

export interface Block {
  id: string

  // 의미적 타입 (AI 맥락 이해용)
  type: BlockType

  // 블록 활성화 여부
  enabled: boolean

  // 블록 높이 (vh 단위)
  height: number

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
  | 'greeting'          // 인사말
  | 'calendar'          // 달력/D-day
  | 'gallery'           // 포토 갤러리
  | 'location'          // 예식장 정보 + 지도
  | 'parents'           // 혼주 소개
  | 'contact'           // 연락처
  | 'account'           // 축의금 계좌
  | 'message'           // 축하 메시지/방명록
  | 'rsvp'              // 참석 여부
  // ─── 확장 섹션 ───
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
  | 'music'             // BGM 컨트롤
  | 'custom'            // 사용자 정의 블록

// ============================================
// 3. 요소 시스템 (Element)
// ============================================

export interface Element {
  id: string
  type: ElementType

  // 위치/크기 (vw/vh 기준, 뷰포트 상대 좌표)
  x: number       // vw
  y: number       // vh (블록 내 상대 위치)
  width: number   // vw
  height: number  // vh
  rotation?: number // degrees (기본값: 0)

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
}

export interface ButtonProps {
  type: 'button'
  label: string
  action: 'link' | 'phone' | 'map' | 'copy' | 'share'
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
}

// ============================================
// 4. 변수 바인딩 시스템
// ============================================

export type VariablePath =
  // 신랑 정보
  | 'groom.name'
  | 'groom.nameEn'
  | 'groom.fatherName'
  | 'groom.motherName'
  | 'groom.fatherPhone'
  | 'groom.motherPhone'
  | 'groom.phone'
  | 'groom.account'
  // 신부 정보
  | 'bride.name'
  | 'bride.nameEn'
  | 'bride.fatherName'
  | 'bride.motherName'
  | 'bride.fatherPhone'
  | 'bride.motherPhone'
  | 'bride.phone'
  | 'bride.account'
  // 예식 정보
  | 'wedding.date'
  | 'wedding.time'
  | 'wedding.dateDisplay'
  | 'wedding.dday'
  // 예식장 정보
  | 'venue.name'
  | 'venue.hall'
  | 'venue.floor'
  | 'venue.address'
  | 'venue.addressDetail'
  | 'venue.coordinates'
  | 'venue.phone'
  | 'venue.parkingInfo'
  | 'venue.transportInfo'
  // 사진
  | 'photos.main'
  | 'photos.gallery'
  // 인사말
  | 'greeting.title'
  | 'greeting.content'
  // 음악
  | 'music.url'
  | 'music.title'
  | 'music.artist'

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
      heading?: string
      body?: string
      accent?: string
    }
    weights?: {
      heading?: number
      body?: number
      accent?: number
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
  background?: string | GradientValue
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
// ============================================

export interface WeddingData {
  groom: PersonInfo
  bride: PersonInfo

  wedding: {
    date: string          // ISO 8601: '2025-03-15'
    time: string          // 'HH:mm': '14:00'
    dateDisplay?: string  // 표시용 (computed)
  }

  venue: VenueInfo

  photos: {
    main?: PhotoData
    gallery: PhotoData[]
  }

  greeting?: {
    title?: string
    content: string
  }

  additionalAccounts?: AccountInfo[]

  music?: {
    url: string
    title?: string
    artist?: string
    autoPlay: boolean
  }

  guestbook?: {
    enabled: boolean
    requirePassword: boolean
  }
}

export interface PersonInfo {
  name: string
  nameEn?: string
  fatherName?: string
  motherName?: string
  fatherPhone?: string
  motherPhone?: string
  phone?: string
  account?: {
    bank: string
    number: string
    holder: string
  }
}

export interface VenueInfo {
  name: string
  hall?: string
  floor?: string
  address: string
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

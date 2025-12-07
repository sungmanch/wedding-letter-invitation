/**
 * Super Editor - Primitives Schema
 * 기본 빌딩 블록 타입 정의 (29개)
 */

// ============================================
// Primitive Types
// ============================================

export type PrimitiveType =
  // 레이아웃 (6개)
  | 'container'
  | 'row'
  | 'column'
  | 'scroll-container'
  | 'overlay'
  | 'fullscreen'
  // 콘텐츠 (10개)
  | 'text'
  | 'image'
  | 'video'
  | 'avatar'
  | 'button'
  | 'spacer'
  | 'divider'
  | 'input'
  | 'map-embed'
  | 'calendar'
  // 이미지 컬렉션 (6개)
  | 'gallery'
  | 'carousel'
  | 'grid'
  | 'collage'
  | 'masonry'
  | 'vinyl-selector'
  // 애니메이션 (5개)
  | 'animated'
  | 'sequence'
  | 'parallel'
  | 'scroll-trigger'
  | 'transition'
  // 로직 (2개)
  | 'conditional'
  | 'repeat'
  // 오디오 (1개)
  | 'bgm-player'
  // 확장 (1개)
  | 'custom'

// ============================================
// Base Node Interface
// ============================================

export interface PrimitiveNode {
  id: string
  type: PrimitiveType
  style?: CSSProperties
  props?: Record<string, unknown>
  children?: PrimitiveNode[]
}

export type CSSProperties = Record<string, string | number>

// ============================================
// Layout Primitives Props
// ============================================

export interface ContainerProps {
  className?: string
}

export interface RowProps {
  gap?: number | string
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  wrap?: boolean
}

export interface ColumnProps {
  gap?: number | string
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
}

export interface ScrollContainerProps {
  direction?: 'vertical' | 'horizontal' | 'both'
  snap?: boolean
  snapType?: 'mandatory' | 'proximity'
  hideScrollbar?: boolean
}

export interface OverlayProps {
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'custom'
  inset?: string | number
}

export interface FullscreenProps {
  minHeight?: string
  maxHeight?: string
}

// ============================================
// Content Primitives Props
// ============================================

export interface TextProps {
  content: string
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div'
  html?: boolean // innerHTML 허용 여부
}

export interface ImageProps {
  src: string
  alt?: string
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:4' | '9:16' | 'auto'
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  loading?: 'lazy' | 'eager'
  onClick?: 'lightbox' | 'link' | 'none'
  linkUrl?: string
}

export interface VideoProps {
  src: string
  poster?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  objectFit?: 'cover' | 'contain' | 'fill'
  playsinline?: boolean
}

export interface AvatarProps {
  src: string
  alt?: string
  size?: number | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square' | 'rounded'
  border?: boolean
  borderColor?: string
}

export interface ButtonProps {
  label: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconPosition?: 'left' | 'right'
  action?: ButtonAction
}

export type ButtonAction =
  | { type: 'link'; url: string; target?: '_blank' | '_self' }
  | { type: 'copy'; value: string; toast?: string }
  | { type: 'call'; phone: string }
  | { type: 'sms'; phone: string; body?: string }
  | { type: 'map'; provider: 'kakao' | 'naver' | 'tmap'; address: string; lat?: number; lng?: number }
  | { type: 'scroll'; target: string }
  | { type: 'custom'; handler: string }

export interface SpacerProps {
  height?: number | string
  width?: number | string
}

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  thickness?: number
  color?: string
}

export interface InputProps {
  type?: 'text' | 'textarea' | 'email' | 'tel'
  placeholder?: string
  label?: string
  name: string
  required?: boolean
  maxLength?: number
  rows?: number // textarea용
}

export interface MapEmbedProps {
  lat: number
  lng: number
  address: string
  name: string
  zoom?: number
  provider?: 'kakao' | 'naver' | 'google'
  showMarker?: boolean
  height?: number | string
  navigationButtons?: ('kakao' | 'naver' | 'tmap')[]
}

export interface CalendarProps {
  /** 결혼 날짜 (ISO 형식: 2025-03-15 또는 데이터 바인딩: {{wedding.dateISO}}) */
  date: string
  /** 달력 시작 요일 (0: 일요일, 1: 월요일) */
  weekStartsOn?: 0 | 1
  /** 요일 표시 형식 */
  weekdayFormat?: 'narrow' | 'short' | 'long' // 일/월/화 | 일요일/월요일 | Sunday
  /** 로케일 */
  locale?: 'ko' | 'en'
  /** 결혼 날짜 하이라이트 스타일 */
  highlightStyle?: 'circle' | 'filled' | 'ring'
  /** 일요일/공휴일 색상 표시 */
  showHolidayColor?: boolean
  /** 토요일 색상 표시 */
  showSaturdayColor?: boolean
}

// ============================================
// Image Collection Primitives Props
// ============================================

export interface ImageCollectionBaseProps {
  images: string[] | string // 배열 또는 데이터 바인딩 ({{photos}})
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:4' | 'auto'
  objectFit?: 'cover' | 'contain' | 'fill'
  onClick?: 'lightbox' | 'link' | 'none'
}

export interface GalleryProps extends ImageCollectionBaseProps {
  layout?: 'horizontal' | 'vertical' | 'grid'
  columns?: 2 | 3 | 4
  gap?: number
  showThumbnails?: boolean
  showArrows?: boolean
  showDots?: boolean
  showCounter?: boolean
}

export interface CarouselProps extends ImageCollectionBaseProps {
  autoplay?: boolean
  autoplayInterval?: number
  infinite?: boolean
  showArrows?: boolean
  showDots?: boolean
  slidesToShow?: number
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip'
  spacing?: number
}

export interface GridProps extends ImageCollectionBaseProps {
  columns?: 2 | 3 | 4 | 'auto'
  rows?: number
  gap?: number
  pattern?: 'uniform' | 'featured-first' | 'featured-center' | 'bento'
}

export interface CollageProps extends ImageCollectionBaseProps {
  template?: 'random' | 'polaroid' | 'scrapbook' | 'magazine' | 'stack' | 'custom'
  rotation?: boolean
  rotationRange?: number // 최대 회전 각도
  overlap?: boolean
  shadow?: boolean
  border?: boolean
  borderColor?: string
}

export interface MasonryProps extends ImageCollectionBaseProps {
  columns?: 2 | 3 | 4
  gap?: number
  animation?: 'fade-in' | 'slide-up' | 'scale-in' | 'none'
}

export interface VinylSelectorProps extends ImageCollectionBaseProps {
  style?: 'vinyl' | 'cd' | 'polaroid-stack' | 'card-stack' | 'fan'
  showLabel?: boolean
  labelField?: string // 이미지별 라벨 데이터 경로
  labelPosition?: 'bottom' | 'overlay' | 'side'
  selectAnimation?: 'slide' | 'flip' | 'rotate' | 'pop'
  activeScale?: number
}

// ============================================
// Animation Primitives Props
// ============================================

export interface AnimatedProps {
  animation: AnimationConfig
  trigger?: 'mount' | 'inView' | 'hover' | 'click'
  threshold?: number // inView threshold (0-1)
}

export interface SequenceProps {
  staggerDelay?: number // 자식 간 딜레이 (ms)
  direction?: 'forward' | 'reverse'
}

export interface ParallelProps {
  // 모든 자식이 동시에 실행
}

export interface ScrollTriggerProps {
  animation: AnimationConfig
  start?: string // e.g., "top center"
  end?: string
  scrub?: boolean | number
  pin?: boolean
  markers?: boolean // 개발용
}

export interface TransitionProps {
  preset: TransitionPreset
  duration?: number
  easing?: EasingType
  trigger?: 'scroll' | 'click' | 'auto' | 'swipe'
  snapToChildren?: boolean
}

// ============================================
// Logic Primitives Props
// ============================================

export interface ConditionalProps {
  condition: string // 표현식 또는 데이터 경로
  operator?: 'exists' | 'equals' | 'notEquals' | 'gt' | 'lt' | 'in'
  value?: unknown
}

export interface RepeatProps {
  dataPath: string // 반복할 배열 데이터 경로
  as: string // 반복 변수명
  key?: string // 고유 키 필드
  limit?: number
  offset?: number
}

// ============================================
// Audio Primitives Props
// ============================================

export interface BgmPlayerProps {
  src?: string // 커스텀 오디오 URL 또는 데이터 바인딩 ({{bgm.url}})
  trackId?: string // 프리셋 BGM ID
  autoplay?: boolean // 기본: true
  loop?: boolean // 기본: true
  volume?: number // 0-1, 기본: 0.5
  fadeIn?: number // 페이드 인 (ms)
  fadeOut?: number // 페이드 아웃 (ms)
  syncWithScroll?: {
    enabled: boolean
    startVolume?: number // 기본: 1
    endVolume?: number // 기본: 0.3
  }
  showControls?: boolean // 기본: true
  controlsPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  controlsStyle?: 'minimal' | 'vinyl'
}

// ============================================
// Animation Config Types
// ============================================

export interface AnimationConfig {
  /**
   * 프리셋 애니메이션 (미리 정의된 효과)
   * preset 또는 keyframes 중 하나 필수
   */
  preset?: AnimationPreset
  /**
   * 커스텀 키프레임 (프리셋 대신 직접 정의)
   * 예: [{ offset: 0, opacity: 0 }, { offset: 1, opacity: 1 }]
   */
  keyframes?: CustomAnimationKeyframe[]
  /**
   * StyleSchema.customStyles.keyframes에 정의된 이름 참조
   * 예: 'grain', 'flicker'
   */
  keyframesRef?: string
  duration?: number
  delay?: number
  easing?: EasingType
  repeat?: number | 'infinite'
  direction?: 'normal' | 'reverse' | 'alternate'
  // 텍스트 애니메이션용
  charDelay?: number
  wordDelay?: number
  lineDelay?: number
  // 스태거 애니메이션용
  staggerDelay?: number
  staggerFrom?: 'start' | 'center' | 'end' | 'random'
}

/**
 * 커스텀 애니메이션 키프레임
 */
export interface CustomAnimationKeyframe {
  offset: number // 0-1
  opacity?: number
  transform?: string
  filter?: string
  clipPath?: string
  [property: string]: string | number | undefined
}

export type AnimationPreset =
  // 기본 등장 (8개)
  | 'fade-in'
  | 'fade-out'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'scale-out'
  // 고급 등장 (8개)
  | 'bounce-in'
  | 'elastic-in'
  | 'flip-in'
  | 'rotate-in'
  | 'blur-in'
  | 'zoom-in'
  | 'drop-in'
  | 'swing-in'
  // 텍스트 특화 (6개)
  | 'typewriter'
  | 'typewriter-cursor'
  | 'letter-by-letter'
  | 'word-by-word'
  | 'line-by-line'
  | 'glitch-text'
  // 연속 효과 (4개)
  | 'stagger'
  | 'cascade'
  | 'wave'
  | 'ripple'
  // 루프 효과 (4개)
  | 'pulse'
  | 'float'
  | 'shake'
  | 'glow'
  // 종료 (4개)
  | 'fade-out-up'
  | 'fade-out-down'
  | 'scale-out-center'
  | 'blur-out'

export type TransitionPreset =
  // 기본 전환 (5개)
  | 'crossfade'
  | 'slide-horizontal'
  | 'slide-vertical'
  | 'zoom'
  | 'flip'
  // 고급 전환 (10개)
  | 'morph'
  | 'reveal-up'
  | 'reveal-down'
  | 'curtain'
  | 'iris'
  | 'wipe-left'
  | 'wipe-right'
  | 'dissolve'
  | 'blur-transition'
  | 'parallax-scroll'

export type EasingType =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'spring'
  | 'bounce'
  | 'elastic'
  // CSS cubic-bezier 값도 허용
  | `cubic-bezier(${string})`

// ============================================
// Props Union Type (타입 가드용)
// ============================================

export type PrimitiveProps =
  | ContainerProps
  | RowProps
  | ColumnProps
  | ScrollContainerProps
  | OverlayProps
  | FullscreenProps
  | TextProps
  | ImageProps
  | VideoProps
  | AvatarProps
  | ButtonProps
  | SpacerProps
  | DividerProps
  | InputProps
  | MapEmbedProps
  | CalendarProps
  | GalleryProps
  | CarouselProps
  | GridProps
  | CollageProps
  | MasonryProps
  | VinylSelectorProps
  | AnimatedProps
  | SequenceProps
  | ParallelProps
  | ScrollTriggerProps
  | TransitionProps
  | ConditionalProps
  | RepeatProps
  | BgmPlayerProps
  | CustomProps

// ============================================
// Custom Primitive Props (확장용)
// ============================================

/**
 * Custom primitive - 가상 요소, 원시 CSS, 확장 기능 지원
 */
export interface CustomProps {
  /**
   * StyleSchema.customStyles.classes에 정의된 클래스 이름
   * 가상 요소(::before, ::after) 포함 가능
   */
  className?: string

  /**
   * 인라인 커스텀 CSS (해당 요소에만 적용)
   */
  inlineCss?: string

  /**
   * 가상 요소 직접 정의 (className 없이 사용 시)
   */
  pseudoElements?: {
    before?: PseudoElementConfig
    after?: PseudoElementConfig
  }

  /**
   * 애니메이션 설정 (커스텀 keyframes 포함)
   */
  animation?: AnimationConfig

  /**
   * 컴포넌트 태그 (기본: div)
   */
  as?: 'div' | 'span' | 'section' | 'article'
}

export interface PseudoElementConfig {
  content?: string
  style?: CSSProperties
  animation?: string
}

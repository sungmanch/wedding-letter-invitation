/**
 * Super Editor - Style Schema
 * LLM이 생성하는 디자인 스타일 정의
 */

import type { CSSProperties } from './primitives'

// ============================================
// Style Schema (LLM Generated)
// ============================================

export interface StyleSchema {
  version: '1.0'
  meta: StyleMeta
  theme: ThemeConfig
  tokens: DesignTokens
  components: ComponentStyles
  utilities?: UtilityClasses
  /**
   * 커스텀 스타일 확장
   * - keyframes: 커스텀 애니메이션 정의
   * - classes: 가상 요소(::before, ::after) 포함 클래스
   * - globalCss: 원시 CSS 직접 주입
   */
  customStyles?: CustomStyles
}

// ============================================
// Custom Styles Extension
// ============================================

export interface CustomStyles {
  /**
   * 커스텀 @keyframes 정의
   * 예: { 'grain': [{ offset: 0, transform: 'translate(0,0)' }, ...] }
   */
  keyframes?: Record<string, CustomKeyframe[]>

  /**
   * 가상 요소를 포함한 커스텀 클래스
   * 예: { 'film-grain': { base: {...}, before: {...}, after: {...} } }
   */
  classes?: Record<string, CustomClassDefinition>

  /**
   * 원시 CSS 직접 주입 (폰트, 복잡한 선택자 등)
   */
  globalCss?: string
}

export interface CustomKeyframe {
  offset: number // 0-1
  [property: string]: string | number | undefined
}

export interface CustomClassDefinition {
  /** 기본 스타일 */
  base?: CSSProperties
  /** ::before 가상 요소 */
  before?: PseudoElementStyle
  /** ::after 가상 요소 */
  after?: PseudoElementStyle
  /** :hover 상태 */
  hover?: CSSProperties
  /** :active 상태 */
  active?: CSSProperties
}

export type PseudoElementStyle = CSSProperties & {
  content?: string
  animation?: string
}

export interface StyleMeta {
  id: string
  name: string
  description?: string
  mood?: StyleMood[]
  season?: StyleSeason[]
  createdAt: string
  updatedAt: string
}

export type StyleMood =
  | 'romantic'
  | 'elegant'
  | 'playful'
  | 'minimal'
  | 'luxury'
  | 'vintage'
  | 'modern'
  | 'natural'
  | 'cozy'
  | 'formal'

export type StyleSeason =
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'winter'
  | 'all'

// ============================================
// Theme Configuration
// ============================================

export interface ThemeConfig {
  // 색상 팔레트
  colors: ColorPalette
  // 타이포그래피
  typography: TypographyConfig
  // 간격 시스템
  spacing: SpacingConfig
  // 테두리
  borders: BorderConfig
  // 그림자
  shadows: ShadowConfig
  // 애니메이션 기본값
  animation: AnimationDefaults
}

// ============================================
// Color System
// ============================================

export interface ColorPalette {
  // 메인 색상
  primary: ColorScale
  secondary?: ColorScale
  accent?: ColorScale
  // 중립 색상
  neutral: ColorScale
  // 시맨틱 색상
  success?: string
  warning?: string
  error?: string
  info?: string
  // 배경/전경
  background: {
    default: string
    paper?: string
    subtle?: string
    inverse?: string
  }
  text: {
    primary: string
    secondary?: string
    muted?: string
    inverse?: string
  }
}

export interface ColorScale {
  50?: string
  100?: string
  200?: string
  300?: string
  400?: string
  500: string      // 기본값
  600?: string
  700?: string
  800?: string
  900?: string
}

// ============================================
// Typography System
// ============================================

export interface TypographyConfig {
  fonts: {
    heading: FontFamily
    body: FontFamily
    accent?: FontFamily
    mono?: FontFamily
  }
  sizes: FontSizeScale
  weights: {
    light?: number
    regular: number
    medium?: number
    semibold?: number
    bold: number
  }
  lineHeights: {
    tight: number | string
    normal: number | string
    relaxed: number | string
    loose?: number | string
  }
  letterSpacing: {
    tight: string
    normal: string
    wide: string
  }
  /**
   * Drop Cap 설정 (첫 글자 크게 표시)
   * 이미지 참고: 청첩장 이름 첫 글자를 이탤릭+크게 표시
   */
  dropCap?: DropCapConfig
}

export interface DropCapConfig {
  /** Drop Cap 활성화 여부 */
  enabled: boolean
  /** 첫 글자 크기 배율 (기본: 2.5) */
  scale?: number
  /** 이탤릭 적용 여부 (기본: true) */
  italic?: boolean
  /** 첫 글자 전용 폰트 (미지정 시 heading 폰트 사용) */
  fontFamily?: string
  /** 첫 글자 굵기 */
  fontWeight?: number
}

export interface FontFamily {
  family: string
  fallback?: string
  googleFont?: boolean
  customUrl?: string
}

export interface FontSizeScale {
  xs: string       // 0.75rem (12px)
  sm: string       // 0.875rem (14px)
  base: string     // 1rem (16px)
  lg: string       // 1.125rem (18px)
  xl: string       // 1.25rem (20px)
  '2xl': string    // 1.5rem (24px)
  '3xl': string    // 1.875rem (30px)
  '4xl': string    // 2.25rem (36px)
  '5xl'?: string   // 3rem (48px)
  '6xl'?: string   // 3.75rem (60px)
}

// ============================================
// Spacing System
// ============================================

export interface SpacingConfig {
  unit: number     // 기본 단위 (px)
  scale: {
    0: string
    1: string      // 0.25rem (4px)
    2: string      // 0.5rem (8px)
    3: string      // 0.75rem (12px)
    4: string      // 1rem (16px)
    5: string      // 1.25rem (20px)
    6: string      // 1.5rem (24px)
    8: string      // 2rem (32px)
    10: string     // 2.5rem (40px)
    12: string     // 3rem (48px)
    16: string     // 4rem (64px)
    20?: string    // 5rem (80px)
    24?: string    // 6rem (96px)
  }
}

// ============================================
// Border System
// ============================================

export interface BorderConfig {
  radius: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  width: {
    thin: string
    default: string
    thick: string
  }
  style: 'solid' | 'dashed' | 'dotted'
  color: string
}

// ============================================
// Shadow System
// ============================================

export interface ShadowConfig {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl'?: string
  inner?: string
  // 커스텀 그림자
  custom?: {
    [key: string]: string
  }
}

// ============================================
// Animation Defaults
// ============================================

export interface AnimationDefaults {
  duration: {
    fast: number      // 150ms
    normal: number    // 300ms
    slow: number      // 500ms
    slower: number    // 700ms
  }
  easing: {
    default: string
    in: string
    out: string
    inOut: string
    bounce?: string
    elastic?: string
  }
  // 스태거 기본값
  stagger: {
    delay: number
    from: 'start' | 'center' | 'end' | 'random'
  }
}

// ============================================
// Design Tokens
// ============================================

export interface DesignTokens {
  // CSS 변수로 변환될 토큰
  [category: string]: {
    [token: string]: string | number
  }
}

// ============================================
// Component Styles
// ============================================

export interface ComponentStyles {
  // Primitive별 기본 스타일
  container?: CSSProperties
  row?: CSSProperties
  column?: CSSProperties
  text?: TextStyles
  image?: ImageStyles
  button?: ButtonStyles
  divider?: CSSProperties
  avatar?: AvatarStyles
  // 컬렉션 스타일
  gallery?: CSSProperties
  carousel?: CSSProperties
  // 커스텀 클래스
  custom?: {
    [className: string]: CSSProperties
  }
}

export interface TextStyles {
  heading?: {
    h1?: CSSProperties
    h2?: CSSProperties
    h3?: CSSProperties
    h4?: CSSProperties
  }
  paragraph?: CSSProperties
  caption?: CSSProperties
  label?: CSSProperties
  quote?: CSSProperties
}

export interface ImageStyles {
  default?: CSSProperties
  rounded?: CSSProperties
  circular?: CSSProperties
  framed?: CSSProperties
  polaroid?: CSSProperties
}

export interface ButtonStyles {
  base?: CSSProperties
  variants?: {
    primary?: CSSProperties
    secondary?: CSSProperties
    outline?: CSSProperties
    ghost?: CSSProperties
    link?: CSSProperties
  }
  sizes?: {
    sm?: CSSProperties
    md?: CSSProperties
    lg?: CSSProperties
  }
}

export interface AvatarStyles {
  default?: CSSProperties
  sizes?: {
    sm?: CSSProperties
    md?: CSSProperties
    lg?: CSSProperties
    xl?: CSSProperties
  }
}

// ============================================
// Utility Classes
// ============================================

export interface UtilityClasses {
  [className: string]: CSSProperties
}

// ============================================
// Style Presets (자주 사용되는 조합)
// ============================================

export interface StylePreset {
  id: string
  name: string
  description?: string
  category: 'text' | 'layout' | 'image' | 'button' | 'animation' | 'effect'
  styles: CSSProperties
  variants?: {
    [variant: string]: CSSProperties
  }
}

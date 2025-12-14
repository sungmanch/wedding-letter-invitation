# Super Editor v2 - 스타일 시스템

> **목표**: 예술적 다양성을 지원하는 유연한 색상/타이포그래피 시스템
> **핵심 원칙**: 3-Level 하이브리드 (프리셋 → 빠른 설정 → 고급 제어)

---

## 1. 3-Level 하이브리드 구조

| 레벨 | 대상 | 설정 방식 | 복잡도 |
|------|------|----------|--------|
| **Level 1** | 초보자 | preset 선택 | ~10 토큰 |
| **Level 2** | 중급자 | quick 조정 | ~50 토큰 |
| **Level 3** | AI/전문가 | advanced 제어 | ~200 토큰 |

```typescript
interface StyleSystem {
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

// 해석 우선순위: advanced > quick > preset > DEFAULT
```

---

## 2. Level 1: 테마 프리셋

```typescript
type ThemePresetId =
  // 기본
  | 'minimal-light'       // 밝은 미니멀
  | 'minimal-dark'        // 어두운 미니멀
  // 클래식
  | 'classic-ivory'       // 아이보리 클래식
  | 'classic-gold'        // 골드 클래식
  // 모던
  | 'modern-mono'         // 모노크롬 모던
  | 'modern-contrast'     // 고대비 모던
  // 로맨틱
  | 'romantic-blush'      // 블러쉬 핑크
  | 'romantic-garden'     // 가든 그린
  // 시네마틱
  | 'cinematic-dark'      // 다크 시네마틱
  | 'cinematic-warm'      // 따뜻한 시네마틱
  // 특수
  | 'photo-adaptive'      // 사진 기반 자동
  | 'duotone'             // 듀오톤
  | 'gradient-hero'       // 그라데이션 중심
```

---

## 3. Level 2: 빠른 설정

```typescript
interface QuickStyleConfig {
  // 색상 조정
  dominantColor?: string      // 메인 색상 → 나머지 자동 파생
  accentColor?: string        // 포인트 색상
  secondaryColor?: string     // 두 번째 주 색상 (듀오톤용)

  // 전체 무드 조정
  mood?: 'warm' | 'cool' | 'neutral'
  contrast?: 'low' | 'medium' | 'high'
  saturation?: 'muted' | 'normal' | 'vivid'

  // 사진 기반 추출
  photoExtraction?: {
    enabled: boolean
    source: 'photos.main' | string
    mapping: {
      dominant: 'most-common' | 'most-saturated' | 'darkest' | 'lightest'
      accent: 'complementary' | 'second-common' | 'most-saturated'
    }
    adjustments?: {
      saturation?: number     // -100 ~ +100
      brightness?: number     // -100 ~ +100
      warmth?: number         // -100 ~ +100
    }
  }

  // 블록별 간단 설정
  blockModes?: {
    [blockId: string]: 'light' | 'dark' | 'accent'
  }
}
```

---

## 4. Level 3: 고급 설정

```typescript
interface AdvancedStyleConfig {
  // 원시 팔레트
  palette: PaletteColor[]

  // 시맨틱 토큰
  tokens: SemanticTokens

  // 블록별 토큰 오버라이드
  blockOverrides?: {
    [blockId: string]: {
      mode: 'inherit' | 'invert' | 'custom'
      tokens?: Partial<SemanticTokens>
    }
  }
}

interface PaletteColor {
  id: string                  // 'gold', 'ivory', 'forest'
  value: ColorValue           // 단색 또는 그라데이션
  variants?: {                // 자동 생성 가능
    light: string
    dark: string
    muted: string
  }
}

type ColorValue = string | GradientValue

interface GradientValue {
  type: 'linear' | 'radial' | 'conic'
  angle?: number              // linear 전용 (0-360)
  shape?: 'circle' | 'ellipse'  // radial 전용
  position?: string           // radial 전용
  stops: { color: string; position: number; opacity?: number }[]
}
```

---

## 5. 시맨틱 토큰

```typescript
interface SemanticTokens {
  // ─── 배경 ───
  'bg-page': string           // 페이지 전체 배경
  'bg-section': string        // 기본 섹션 배경
  'bg-section-alt': string    // 대체 섹션 배경 (교차용)
  'bg-card': string           // 카드/컨테이너 배경
  'bg-overlay': string        // 이미지 오버레이

  // ─── 전경 ───
  'fg-default': string        // 기본 텍스트
  'fg-muted': string          // 보조 텍스트
  'fg-emphasis': string       // 강조 텍스트
  'fg-inverse': string        // 반전 배경 위 텍스트
  'fg-on-accent': string      // 액센트 배경 위 텍스트

  // ─── 강조/액션 ───
  'accent-default': string    // 기본 액센트
  'accent-hover': string      // 호버 상태
  'accent-active': string     // 활성 상태
  'accent-secondary': string  // 보조 액센트 (듀오톤)

  // ─── 보더 ───
  'border-default': string
  'border-emphasis': string
  'border-muted': string

  // ─── 그라데이션 (선택) ───
  'gradient-hero'?: GradientValue
  'gradient-accent'?: GradientValue
  'gradient-overlay'?: GradientValue
}
```

---

## 6. 그라데이션 프리셋

```typescript
const GRADIENT_PRESETS: Record<string, GradientValue> = {
  // 로맨틱
  'sunset-blush': {
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#FFB6C1', position: 0 },
      { color: '#FFC0CB', position: 50 },
      { color: '#FFE4E1', position: 100 },
    ]
  },

  // 골드
  'golden-hour': {
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#C9A962', position: 0 },
      { color: '#E5D4A8', position: 50 },
      { color: '#F5EED5', position: 100 },
    ]
  },

  // 시네마틱
  'cinematic-vignette': {
    type: 'radial',
    shape: 'ellipse',
    position: 'center',
    stops: [
      { color: '#000000', position: 0, opacity: 0 },
      { color: '#000000', position: 70, opacity: 0.3 },
      { color: '#000000', position: 100, opacity: 0.7 },
    ]
  },

  // 메탈릭 골드
  'metallic-gold': {
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#BF953F', position: 0 },
      { color: '#FCF6BA', position: 25 },
      { color: '#B38728', position: 50 },
      { color: '#FBF5B7', position: 75 },
      { color: '#AA771C', position: 100 },
    ]
  },
}
```

---

## 7. 타이포그래피 설정

> **상세 문서**: [07_typography_system.md](./07_typography_system.md)

```typescript
interface TypographyConfig {
  // 프리셋 선택 (Level 1)
  preset?: TypographyPresetId

  // 커스텀 설정 (Level 2-3)
  custom?: {
    fontStacks?: {
      heading?: string  // fontId
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

type TypographyPresetId =
  // 클래식/우아
  | 'classic-elegant'      // Playfair + Noto Serif
  | 'classic-traditional'  // Cinzel + Nanum Myeongjo
  | 'classic-romantic'     // Cormorant + Gowun Batang
  // 모던/미니멀
  | 'modern-minimal'       // Montserrat + Pretendard
  | 'modern-clean'         // Inter + Noto Sans
  | 'modern-geometric'     // Poppins + Pretendard
  // 로맨틱/감성
  | 'romantic-script'      // Great Vibes + Gowun Batang
  | 'romantic-italian'     // Italianno + Noto Serif
  | 'romantic-soft'        // Pinyon Script + Hahmlet
  // 내추럴/손글씨
  | 'natural-handwritten'  // High Summit + 마포금빛나루
  | 'natural-brush'        // Alex Brush + 나눔붓글씨
  | 'natural-warm'         // Dancing Script + 고운돋움
```

---

## 8. 이펙트 설정

```typescript
interface EffectsConfig {
  preset?: EffectsPresetId
  custom?: {
    radius: Record<string, number>
    shadows: Record<string, string>
    blurs: Record<string, number>
    textures?: Record<string, TextureConfig>
  }
}

interface TextureConfig {
  type: 'noise' | 'grain' | 'paper'
  opacity: number
  blend: BlendMode
}
```

---

## 9. 블록별 테마 오버라이드

```typescript
interface BlockThemeConfig {
  mode: 'inherit' | 'invert' | 'custom'

  // invert 모드: 자동 반전
  inversion?: {
    type: 'full' | 'bg-only' | 'text-only'
  }

  // custom 모드: 직접 지정
  tokens?: Partial<SemanticTokens>
}
```

---

## 10. 요소 스타일

```typescript
interface ElementStyle {
  // 텍스트 스타일 (TextElement용)
  text?: {
    fontFamily?: string
    fontSize?: number
    fontWeight?: number
    color?: string
    textAlign?: 'left' | 'center' | 'right'
    lineHeight?: number
    letterSpacing?: number
  }

  // 배경
  background?: string | GradientValue

  // 테두리
  border?: {
    width: number
    color: string
    style: 'solid' | 'dashed'
    radius: number
  }

  // 그림자
  shadow?: string

  // 투명도
  opacity?: number
}
```

---

## 11. 해석된 스타일 (ResolvedStyle)

`StyleSystem`을 `resolveStyleSystem()`으로 해석한 결과.

```typescript
/**
 * StyleSystem → ResolvedStyle 변환 파이프라인:
 * 1. 프리셋 로드 (Level 1)
 * 2. 빠른 설정 적용 (Level 2)
 * 3. 고급 설정 오버라이드 (Level 3)
 * 4. 타이포그래피/이펙트 해석
 * 5. 대비 검증 및 자동 보정
 */
interface ResolvedStyle {
  // 시맨틱 토큰 (색상) - CSS 변수로 변환됨
  tokens: SemanticTokens

  // 팔레트 색상
  palette: PaletteColor[]

  // 해석된 타이포그래피
  typography: {
    fontStacks: Record<string, {
      family: string[]
      fallback: string
    }>
    scale: Record<string, {
      size: number
      sizeUnit: 'px' | 'rem' | 'vw'
      weight: number
      lineHeight: number
      letterSpacing: number
    }>
  }

  // 해석된 이펙트
  effects: {
    radius: Record<string, number>
    shadows: Record<string, string>
    blurs: Record<string, number>
    textures?: Record<string, TextureConfig>
  }

  // 블록별 오버라이드 (해석 완료)
  blockOverrides?: {
    [blockId: string]: {
      mode: 'inherit' | 'invert' | 'custom'
      tokens?: Partial<SemanticTokens>
    }
  }
}

// GlobalStyle은 ResolvedStyle의 별칭 (하위 호환)
type GlobalStyle = ResolvedStyle
```

---

## 12. 관련 문서

| 문서 | 내용 |
|------|------|
| [01a_core_schema.md](./01a_core_schema.md) | 핵심 데이터 구조 |
| [05d_style_resolver.md](./05d_style_resolver.md) | 스타일 해석 런타임 |
| [07_typography_system.md](./07_typography_system.md) | 타이포그래피 프리셋 |

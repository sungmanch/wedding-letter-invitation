# Super Editor v2 - 스타일 시스템

> **목표**: 예술적 다양성을 지원하는 유연한 색상/타이포그래피 시스템
> **핵심 질문**: 단순한 브랜드 컬러 3개가 아닌, 예술적 표현을 어떻게 지원할 것인가?

---

## 1. 현재 구조의 한계

### 1.1 기존 GlobalStyle

```typescript
// 01_data_schema.md의 현재 구조
interface GlobalStyle {
  colors: {
    primary: string      // 주 강조색
    secondary: string    // 보조색
    background: string   // 배경색 (60%)
    surface: string      // 카드/섹션 배경 (30%)
    accent: string       // 포인트색 (10%)
    text: { primary, secondary, muted }
  }
  fonts: { heading, body, accent? }
  spacing: { section, element }
  effects: { borderRadius, shadow }
}
```

### 1.2 한계점

| 문제 | 설명 | 예시 |
|------|------|------|
| **고정 슬롯** | 색상 역할이 5개로 고정 | 듀오톤 디자인 표현 불가 |
| **60-30-10 강제** | 비율이 암묵적으로 고정 | 50-50 대비 디자인 불가 |
| **단색 한정** | gradient가 1급 시민이 아님 | gradient 중심 디자인 어려움 |
| **전역 단일** | 블록별 테마 변경 어려움 | 섹션마다 밝음/어두움 교차 불가 |
| **정적 팔레트** | 사진 기반 동적 색상 미지원 | 메인 사진 색상 활용 불가 |

---

## 2. 예술적 스타일 패턴 분석

### 2.1 실제 청첩장에서 발견되는 패턴

| 패턴 | 설명 | 색상 구성 |
|------|------|----------|
| **모노크롬** | 단일 색조의 명도 변화 | 1색 + 명도 5단계 |
| **듀오톤** | 2개 주 색상이 대등 | 2색 대비 (50-50) |
| **트라이어드** | 3색 조화 | 색상환 120도 간격 |
| **Gradient Hero** | 그라데이션이 메인 | gradient + 1-2 단색 |
| **Photo Extracted** | 사진에서 팔레트 추출 | 4-6색 자동 생성 |
| **Dark/Light 교차** | 섹션별 명암 반전 | 밝은 테마 + 어두운 테마 |
| **Accent Pop** | 무채색 + 단일 강조 | 흑백 + 1색 |
| **Metallic** | 금속성 그라데이션 | gold/silver gradient |
| **Watercolor** | 수채화 느낌 | 반투명 + 블렌딩 |

### 2.2 색상 역할 재정의

현재의 "primary/secondary/accent"는 **브랜드 디자인 용어**입니다.
예술적 표현을 위해서는 **시각적 역할** 기반으로 재정의가 필요합니다.

| 시각적 역할 | 설명 | 적용 대상 |
|------------|------|----------|
| **Dominant** | 시각적으로 가장 큰 면적 | 배경, 큰 섹션 |
| **Supporting** | Dominant를 보완 | 카드, 서브 섹션 |
| **Emphasis** | 주목을 끄는 포인트 | CTA, 하이라이트 |
| **Contrast** | 대비를 만드는 색 | 텍스트, 구분선 |
| **Neutral** | 중립적 배경 | 여백, 기본 배경 |

---

## 3. 스타일 시스템 옵션

### Option A: 확장된 고정 슬롯

기존 구조를 확장하되, 슬롯을 더 추가.

```typescript
interface StyleOptionA {
  colors: {
    // 기존
    primary: ColorValue
    secondary: ColorValue
    accent: ColorValue
    background: ColorValue
    surface: ColorValue
    text: { primary, secondary, muted }

    // 확장
    primary2?: ColorValue      // 듀오톤용 두 번째 주 색상
    gradient?: GradientValue   // 전역 그라데이션
    overlay?: ColorValue       // 이미지 오버레이용
    divider?: ColorValue       // 구분선
  }

  // 블록별 테마 오버라이드
  blockThemes?: {
    [blockType: string]: Partial<typeof colors>
  }
}

type ColorValue = string | GradientValue

interface GradientValue {
  type: 'linear' | 'radial' | 'conic'
  angle?: number              // linear용
  stops: { color: string; position: number }[]
}
```

**장점**: 기존 구조와 호환, 점진적 확장 가능
**단점**: 여전히 슬롯 기반, 유연성 제한

---

### Option B: 팔레트 배열 방식

색상을 배열로 관리하고, 역할은 인덱스나 태그로 지정.

```typescript
interface StyleOptionB {
  palette: PaletteColor[]

  // 역할 매핑 (인덱스 또는 ID 참조)
  roles: {
    dominant: string | number      // palette[0] 또는 'gold'
    supporting: string | number
    emphasis: string | number
    text: string | number
    textMuted: string | number
  }

  // 선택적: 자동 생성 규칙
  autoGenerate?: {
    from: 'photo' | 'dominant'
    method: 'complementary' | 'analogous' | 'triadic' | 'split-complementary'
  }
}

interface PaletteColor {
  id: string                       // 'gold', 'ivory', 'forest'
  value: string | GradientValue
  variants?: {                     // 자동 생성된 변형
    light: string
    dark: string
    muted: string
  }
}
```

**예시**:
```json
{
  "palette": [
    { "id": "gold", "value": "#C9A962" },
    { "id": "ivory", "value": "#FDFBF7" },
    { "id": "forest", "value": "#2D4A3E" }
  ],
  "roles": {
    "dominant": "ivory",
    "supporting": "gold",
    "emphasis": "forest",
    "text": "forest",
    "textMuted": 0
  }
}
```

**장점**: 색상 개수 자유, 명시적 역할 매핑
**단점**: 설정 복잡도 증가, AI가 이해하기 어려울 수 있음

---

### Option C: 테마 프리셋 + 커스터마이징

미리 정의된 예술적 테마를 선택하고, 세부 조정.

```typescript
interface StyleOptionC {
  // 1. 테마 프리셋 선택
  preset: ThemePresetId

  // 2. 프리셋 기반 커스터마이징
  customization?: {
    // 주 색상만 변경 (나머지는 자동 계산)
    dominantColor?: string
    accentColor?: string

    // 또는 전체 오버라이드
    overrides?: Partial<ResolvedTheme>
  }
}

type ThemePresetId =
  | 'minimal-mono'      // 모노크롬 미니멀
  | 'elegant-duotone'   // 우아한 듀오톤
  | 'romantic-gradient' // 로맨틱 그라데이션
  | 'classic-gold'      // 클래식 골드
  | 'modern-contrast'   // 모던 고대비
  | 'watercolor-soft'   // 수채화 소프트
  | 'photo-extracted'   // 사진 기반 자동
  | 'dark-cinematic'    // 다크 시네마틱
  | 'light-airy'        // 밝고 경쾌한
  | 'custom'            // 완전 커스텀

interface ThemePreset {
  id: ThemePresetId
  name: string
  description: string

  // 기본 팔레트
  basePalette: {
    dominant: ColorSpec
    supporting: ColorSpec
    emphasis: ColorSpec
    neutral: ColorSpec
    text: ColorSpec
  }

  // 색상 생성 규칙
  generation: {
    method: 'fixed' | 'derived' | 'photo-based'
    derivationRules?: DerivationRule[]
  }

  // 적용 규칙
  application: {
    background: 'dominant' | 'neutral' | 'gradient'
    surface: 'supporting' | 'dominant-light'
    accent: 'emphasis'
    textOnLight: 'text'
    textOnDark: 'neutral'
  }

  // 타이포그래피 추천
  typography: {
    headingStyle: 'serif' | 'sans' | 'display' | 'script'
    bodyStyle: 'serif' | 'sans'
  }
}

interface ColorSpec {
  base: string | GradientValue
  light?: string    // 자동 생성 가능
  dark?: string     // 자동 생성 가능
  muted?: string    // 자동 생성 가능
}
```

**장점**: 비전문가도 쉽게 선택, AI 추천 용이
**단점**: 프리셋 외 표현 제한, 프리셋 관리 필요

---

### Option D: 시맨틱 토큰 + 레이어 시스템

CSS 변수처럼 시맨틱 토큰을 정의하고, 레이어별로 적용.

```typescript
interface StyleOptionD {
  // 1. 원시 색상 정의
  primitives: {
    [key: string]: string | GradientValue
    // 'gold-500': '#C9A962'
    // 'ivory-100': '#FDFBF7'
    // 'gradient-sunset': { type: 'linear', ... }
  }

  // 2. 시맨틱 토큰 (역할 → 원시값 매핑)
  tokens: {
    // 배경 레이어
    'bg-page': string           // primitives 키 참조
    'bg-section': string
    'bg-card': string
    'bg-overlay': string

    // 전경 레이어
    'fg-default': string
    'fg-muted': string
    'fg-emphasis': string
    'fg-inverse': string

    // 인터랙티브
    'interactive-default': string
    'interactive-hover': string
    'interactive-active': string

    // 보더/구분선
    'border-default': string
    'border-emphasis': string

    // 특수 용도
    'highlight': string
    'shadow': string
  }

  // 3. 블록별 토큰 오버라이드 (테마 반전 등)
  blockOverrides?: {
    [blockId: string]: Partial<typeof tokens>
  }

  // 4. 다크모드 토큰 (선택)
  darkTokens?: Partial<typeof tokens>
}
```

**예시**:
```json
{
  "primitives": {
    "gold-500": "#C9A962",
    "gold-300": "#E5D4A8",
    "ivory-100": "#FDFBF7",
    "charcoal-900": "#1A1A1A",
    "gradient-hero": {
      "type": "linear",
      "angle": 135,
      "stops": [
        { "color": "#C9A962", "position": 0 },
        { "color": "#8B7355", "position": 100 }
      ]
    }
  },
  "tokens": {
    "bg-page": "ivory-100",
    "bg-section": "ivory-100",
    "bg-card": "gold-300",
    "fg-default": "charcoal-900",
    "fg-emphasis": "gold-500",
    "highlight": "gradient-hero"
  },
  "blockOverrides": {
    "block-intro": {
      "bg-section": "gradient-hero",
      "fg-default": "ivory-100"
    }
  }
}
```

**장점**: 최대 유연성, 디자인 시스템 표준 방식
**단점**: 학습 곡선, 설정 복잡도 높음

---

### Option E: 하이브리드 (추천)

Option C (프리셋) + Option D (토큰)의 장점을 결합.

```typescript
interface StyleOptionE {
  // === 레벨 1: 빠른 시작 ===
  // 프리셋 선택만으로 완성된 스타일
  preset?: ThemePresetId

  // === 레벨 2: 간단 커스터마이징 ===
  // 프리셋 기반으로 주요 색상만 변경
  quick?: {
    dominantColor?: string      // 메인 색상 (나머지 자동 파생)
    accentColor?: string        // 포인트 색상
    mood?: 'warm' | 'cool' | 'neutral'
    contrast?: 'low' | 'medium' | 'high'
  }

  // === 레벨 3: 상세 커스터마이징 ===
  // 팔레트와 토큰 직접 정의
  advanced?: {
    palette: PaletteColor[]
    tokens: SemanticTokens
    blockOverrides?: BlockTokenOverrides
  }

  // === 공통: 타이포그래피 ===
  typography: TypographyConfig

  // === 공통: 이펙트 ===
  effects: EffectsConfig
}

// 해석 우선순위: advanced > quick > preset > 기본값
```

**사용 시나리오**:

1. **초보 사용자**: preset만 선택 → 끝
2. **중급 사용자**: preset + quick으로 메인 색상만 변경
3. **고급 사용자/AI**: advanced로 전체 제어

---

## 4. 그라데이션 1급 지원

### 4.1 GradientValue 상세

```typescript
interface GradientValue {
  type: 'linear' | 'radial' | 'conic'

  // linear
  angle?: number                 // 0-360

  // radial
  shape?: 'circle' | 'ellipse'
  position?: string              // 'center', '50% 50%'

  // conic
  from?: number                  // 시작 각도

  // 공통
  stops: GradientStop[]

  // 애니메이션 (선택)
  animation?: {
    property: 'angle' | 'position' | 'stops'
    duration: number
    easing: string
  }
}

interface GradientStop {
  color: string
  position: number               // 0-100
  opacity?: number               // 0-1
}
```

### 4.2 그라데이션 프리셋

```typescript
const GRADIENT_PRESETS = {
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
  'cinematic-dark': {
    type: 'radial',
    position: 'center',
    stops: [
      { color: '#2C2C2C', position: 0 },
      { color: '#1A1A1A', position: 70 },
      { color: '#000000', position: 100 },
    ]
  },

  // 메탈릭
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

  // 수채화
  'watercolor-soft': {
    type: 'radial',
    shape: 'ellipse',
    stops: [
      { color: '#FFFFFF', position: 0, opacity: 0 },
      { color: '#E8D5C4', position: 40, opacity: 0.3 },
      { color: '#D4B896', position: 70, opacity: 0.5 },
      { color: '#C9A962', position: 100, opacity: 0.7 },
    ]
  },
}
```

---

## 5. 사진 기반 팔레트 추출

### 5.1 PhotoPalette 시스템

```typescript
interface PhotoPaletteConfig {
  // 소스 이미지
  source: 'photos.main' | string  // 변수 바인딩 또는 URL

  // 추출 옵션
  extraction: {
    algorithm: 'vibrant' | 'quantize' | 'kmeans'
    count: number                  // 추출할 색상 개수 (3-8)
    quality: 'fast' | 'balanced' | 'accurate'
  }

  // 역할 자동 매핑
  autoMapping: {
    dominant: 'most-saturated' | 'most-common' | 'darkest' | 'lightest'
    supporting: 'second-common' | 'complementary'
    text: 'auto-contrast'         // dominant 기반 자동 계산
  }

  // 수동 조정 (추출 후)
  adjustments?: {
    saturation?: number           // -100 ~ +100
    brightness?: number           // -100 ~ +100
    warmth?: number               // -100 ~ +100
  }
}

// 추출 결과
interface ExtractedPalette {
  colors: {
    hex: string
    rgb: [number, number, number]
    hsl: [number, number, number]
    population: number            // 이미지 내 비중
    name?: string                 // 'Vibrant', 'Muted', 'DarkVibrant' 등
  }[]

  // 자동 매핑된 역할
  mappedRoles: {
    dominant: string
    supporting: string
    emphasis: string
    text: string
    textMuted: string
  }

  // 대비 검증 결과
  contrastValidation: {
    textOnDominant: { ratio: number; wcagLevel: 'AAA' | 'AA' | 'FAIL' }
    textOnSupporting: { ratio: number; wcagLevel: 'AAA' | 'AA' | 'FAIL' }
  }
}
```

### 5.2 추출 알고리즘 비교

| 알고리즘 | 속도 | 품질 | 특징 |
|---------|------|------|------|
| **Vibrant** | 빠름 | 좋음 | 6개 고정 카테고리 (Vibrant, Muted, DarkVibrant...) |
| **Quantize** | 중간 | 중간 | 색상 양자화, 개수 조절 가능 |
| **K-Means** | 느림 | 최고 | 클러스터링 기반, 가장 정확 |

### 5.3 구현 예시

```typescript
import Vibrant from 'node-vibrant'

async function extractPaletteFromImage(
  imageUrl: string,
  config: PhotoPaletteConfig
): Promise<ExtractedPalette> {
  const vibrant = new Vibrant(imageUrl, {
    colorCount: config.extraction.count,
    quality: config.extraction.quality === 'fast' ? 1 : 5,
  })

  const palette = await vibrant.getPalette()

  // Vibrant 결과 → 표준 형식 변환
  const colors = Object.entries(palette)
    .filter(([_, swatch]) => swatch !== null)
    .map(([name, swatch]) => ({
      hex: swatch!.hex,
      rgb: swatch!.rgb as [number, number, number],
      hsl: swatch!.hsl as [number, number, number],
      population: swatch!.population,
      name,
    }))
    .sort((a, b) => b.population - a.population)

  // 역할 자동 매핑
  const mappedRoles = autoMapRoles(colors, config.autoMapping)

  // 대비 검증
  const contrastValidation = validateContrast(mappedRoles)

  return { colors, mappedRoles, contrastValidation }
}

function autoMapRoles(
  colors: ExtractedPalette['colors'],
  mapping: PhotoPaletteConfig['autoMapping']
): ExtractedPalette['mappedRoles'] {
  let dominant: string
  let supporting: string

  // Dominant 선택
  switch (mapping.dominant) {
    case 'most-common':
      dominant = colors[0].hex
      break
    case 'most-saturated':
      dominant = colors.sort((a, b) => b.hsl[1] - a.hsl[1])[0].hex
      break
    case 'darkest':
      dominant = colors.sort((a, b) => a.hsl[2] - b.hsl[2])[0].hex
      break
    case 'lightest':
      dominant = colors.sort((a, b) => b.hsl[2] - a.hsl[2])[0].hex
      break
  }

  // Supporting 선택
  supporting = colors.find(c => c.hex !== dominant)?.hex || dominant

  // Text 자동 계산 (대비 기반)
  const text = getContrastingColor(dominant)
  const textMuted = adjustLightness(text, 0.3)

  return {
    dominant,
    supporting,
    emphasis: colors[2]?.hex || supporting,
    text,
    textMuted,
  }
}
```

---

## 6. 블록별 테마 시스템

### 6.1 테마 반전 패턴

```typescript
interface BlockThemeConfig {
  // 상속 또는 반전
  mode: 'inherit' | 'invert' | 'custom'

  // invert 모드 옵션
  inversion?: {
    type: 'full' | 'bg-only' | 'text-only'
    transitionEffect?: 'fade' | 'slide' | 'none'
  }

  // custom 모드 옵션
  custom?: Partial<SemanticTokens>
}

// 문서 레벨 설정
interface DocumentStyle {
  // 전역 테마
  global: ResolvedTheme

  // 블록별 테마
  blocks: {
    [blockId: string]: BlockThemeConfig
  }

  // 자동 교차 패턴
  autoAlternate?: {
    enabled: boolean
    pattern: 'every-other' | 'intro-dark' | 'custom'
    customPattern?: ('light' | 'dark')[]
  }
}
```

### 6.2 테마 교차 예시

```json
{
  "global": {
    "preset": "elegant-duotone",
    "quick": { "dominantColor": "#FDFBF7", "accentColor": "#C9A962" }
  },
  "blocks": {
    "block-intro": { "mode": "invert" },
    "block-greeting": { "mode": "inherit" },
    "block-gallery": { "mode": "invert" },
    "block-venue": { "mode": "inherit" },
    "block-guestbook": {
      "mode": "custom",
      "custom": {
        "bg-section": "gradient-sunset",
        "fg-default": "#FFFFFF"
      }
    }
  },
  "autoAlternate": {
    "enabled": false
  }
}
```

---

## 7. 타이포그래피 확장

### 7.1 현재 구조

```typescript
// 기존
interface FontConfig {
  family: string
  weight: number
  size: number        // vw 기준
  lineHeight: number
  letterSpacing: number
}
```

### 7.2 확장 구조

```typescript
interface TypographyConfig {
  // 폰트 스택 정의
  fontStacks: {
    [id: string]: {
      family: string[]           // 폴백 포함
      category: 'serif' | 'sans' | 'display' | 'script' | 'mono'
      source: 'google' | 'local' | 'custom'
      weights: number[]          // 사용 가능한 weight
    }
  }

  // 타입 스케일 (역할별 스타일)
  scale: {
    // 제목 계층
    'display-1': TypeStyle      // 가장 큰 제목 (인트로 이름)
    'display-2': TypeStyle      // 큰 제목
    'heading-1': TypeStyle      // H1
    'heading-2': TypeStyle      // H2
    'heading-3': TypeStyle      // H3

    // 본문
    'body-large': TypeStyle
    'body-default': TypeStyle
    'body-small': TypeStyle

    // 캡션/라벨
    'caption': TypeStyle
    'label': TypeStyle
    'overline': TypeStyle

    // 특수
    'quote': TypeStyle          // 인용문
    'accent': TypeStyle         // 강조 텍스트
  }

  // 반응형 스케일 조정
  responsive?: {
    mobile: { baseSize: number }
    tablet: { baseSize: number }
    desktop: { baseSize: number }
  }
}

interface TypeStyle {
  fontStack: string             // fontStacks의 키
  weight: number
  size: number                  // vw 또는 rem
  sizeUnit: 'vw' | 'rem' | 'px'
  lineHeight: number
  letterSpacing: number         // em
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  fontStyle?: 'normal' | 'italic'
}
```

### 7.3 타이포그래피 프리셋

```typescript
const TYPOGRAPHY_PRESETS = {
  'elegant-serif': {
    fontStacks: {
      heading: {
        family: ['Playfair Display', 'Noto Serif KR', 'Georgia', 'serif'],
        category: 'serif',
        source: 'google',
        weights: [400, 600, 700],
      },
      body: {
        family: ['Pretendard', 'Apple SD Gothic Neo', 'sans-serif'],
        category: 'sans',
        source: 'local',
        weights: [300, 400, 500],
      },
    },
    scale: {
      'display-1': { fontStack: 'heading', weight: 600, size: 8, sizeUnit: 'vw', lineHeight: 1.2, letterSpacing: -0.02 },
      'heading-1': { fontStack: 'heading', weight: 600, size: 5, sizeUnit: 'vw', lineHeight: 1.3, letterSpacing: 0 },
      'body-default': { fontStack: 'body', weight: 400, size: 4, sizeUnit: 'vw', lineHeight: 1.7, letterSpacing: 0 },
      // ...
    },
  },

  'modern-sans': {
    fontStacks: {
      heading: {
        family: ['Montserrat', 'Pretendard', 'sans-serif'],
        category: 'sans',
        source: 'google',
        weights: [400, 500, 700],
      },
      body: {
        family: ['Pretendard', 'sans-serif'],
        category: 'sans',
        source: 'local',
        weights: [300, 400, 500],
      },
    },
    scale: {
      'display-1': { fontStack: 'heading', weight: 700, size: 10, sizeUnit: 'vw', lineHeight: 1.1, letterSpacing: -0.03 },
      // ...
    },
  },

  'handwritten-romantic': {
    fontStacks: {
      heading: {
        family: ['Dancing Script', 'Nanum Pen Script', 'cursive'],
        category: 'script',
        source: 'google',
        weights: [400, 700],
      },
      body: {
        family: ['Noto Serif KR', 'serif'],
        category: 'serif',
        source: 'google',
        weights: [300, 400],
      },
    },
    // ...
  },
}
```

---

## 8. 이펙트 시스템

### 8.1 현재 구조

```typescript
// 기존
interface Effects {
  borderRadius: number
  shadow: 'none' | 'subtle' | 'medium' | 'strong'
}
```

### 8.2 확장 구조

```typescript
interface EffectsConfig {
  // 테두리 반경 스케일
  radius: {
    none: 0
    sm: number
    md: number
    lg: number
    xl: number
    full: 9999
  }

  // 그림자 스케일
  shadows: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    inner: string
    // 커스텀 그림자
    [key: string]: string
  }

  // 블러 스케일
  blurs: {
    none: 0
    sm: number
    md: number
    lg: number
    xl: number
  }

  // 글로우 효과
  glows?: {
    [key: string]: {
      color: string
      blur: number
      spread: number
    }
  }

  // 텍스처/패턴
  textures?: {
    [key: string]: {
      type: 'noise' | 'grain' | 'paper' | 'fabric' | 'custom'
      opacity: number
      blend: BlendMode
      url?: string              // custom용
    }
  }

  // 글래스모피즘
  glass?: {
    blur: number
    opacity: number
    saturation: number
    border: string
  }
}

type BlendMode =
  | 'normal' | 'multiply' | 'screen' | 'overlay'
  | 'darken' | 'lighten' | 'color-dodge' | 'color-burn'
  | 'soft-light' | 'hard-light' | 'difference' | 'exclusion'
```

---

## 9. 통합 스타일 스키마 (최종)

### 9.1 StyleSystem (Option E 기반)

```typescript
interface StyleSystem {
  version: number

  // === 레벨 1: 프리셋 ===
  preset?: ThemePresetId

  // === 레벨 2: 빠른 설정 ===
  quick?: {
    // 색상
    dominantColor?: string
    accentColor?: string
    mood?: 'warm' | 'cool' | 'neutral'
    contrast?: 'low' | 'medium' | 'high'

    // 사진 기반
    photoExtraction?: PhotoPaletteConfig
  }

  // === 레벨 3: 고급 설정 ===
  advanced?: {
    // 색상 팔레트
    palette: PaletteColor[]

    // 시맨틱 토큰
    tokens: {
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

      // 보더
      'border-default': string
      'border-emphasis': string
      'border-muted': string

      // 그라데이션 (선택)
      'gradient-hero'?: GradientValue
      'gradient-accent'?: GradientValue
    }

    // 블록 오버라이드
    blockOverrides?: {
      [blockId: string]: {
        mode: 'inherit' | 'invert' | 'custom'
        tokens?: Partial<typeof tokens>
      }
    }
  }

  // === 타이포그래피 ===
  typography: {
    preset?: TypographyPresetId
    custom?: Partial<TypographyConfig>
  }

  // === 이펙트 ===
  effects: {
    preset?: EffectsPresetId
    custom?: Partial<EffectsConfig>
  }
}
```

### 9.2 스타일 해석 순서

```typescript
function resolveStyleSystem(style: StyleSystem): ResolvedStyle {
  // 1. 기본값
  let resolved = DEFAULT_STYLE

  // 2. 프리셋 적용
  if (style.preset) {
    resolved = mergeDeep(resolved, THEME_PRESETS[style.preset])
  }

  // 3. 빠른 설정 적용
  if (style.quick) {
    // 사진 추출
    if (style.quick.photoExtraction) {
      const extracted = extractPaletteFromImage(style.quick.photoExtraction)
      resolved = applyExtractedPalette(resolved, extracted)
    }

    // 색상 오버라이드
    if (style.quick.dominantColor) {
      resolved = derivePaletteFromDominant(resolved, style.quick.dominantColor, style.quick.mood)
    }
    if (style.quick.accentColor) {
      resolved.tokens['accent-default'] = style.quick.accentColor
    }

    // 대비 조정
    if (style.quick.contrast) {
      resolved = adjustContrast(resolved, style.quick.contrast)
    }
  }

  // 4. 고급 설정 (최종 오버라이드)
  if (style.advanced) {
    if (style.advanced.palette) {
      resolved.palette = style.advanced.palette
    }
    if (style.advanced.tokens) {
      resolved.tokens = { ...resolved.tokens, ...style.advanced.tokens }
    }
    if (style.advanced.blockOverrides) {
      resolved.blockOverrides = style.advanced.blockOverrides
    }
  }

  // 5. 타이포그래피
  resolved.typography = resolveTypography(style.typography)

  // 6. 이펙트
  resolved.effects = resolveEffects(style.effects)

  return resolved
}
```

---

## 10. AI 통합

### 10.1 AI 스타일 생성 프롬프트

```typescript
interface AIStyleContext {
  // 현재 스타일
  current: StyleSystem

  // 메인 사진 정보
  mainPhoto?: {
    url: string
    extractedPalette?: ExtractedPalette
    mood?: string             // AI 분석: 'romantic', 'minimal' 등
  }

  // 사용자 선호
  preferences?: {
    keywords: string[]        // '우아한', '모던', '따뜻한'
    avoidKeywords?: string[]  // '화려한', '어두운'
    referenceUrls?: string[]  // 참고 이미지
  }
}

// AI 출력
interface AIStyleOutput {
  analysis: {
    photoMood: string
    suggestedStyle: string
    colorHarmony: string
  }

  stylePatches: JsonPatch[]   // StyleSystem 수정

  explanation: string
}
```

### 10.2 AI 프롬프트 예시

```
사용자: "사진 색감에 맞는 따뜻한 느낌으로 바꿔줘"

AI 컨텍스트:
- 메인 사진 팔레트: [#D4A574, #8B6914, #F5E6D3, #2C1810]
- 현재 프리셋: 'minimal-mono'

AI 응답:
{
  "analysis": {
    "photoMood": "warm-autumn",
    "suggestedStyle": "사진의 갈색/베이지 톤을 살린 따뜻한 팔레트",
    "colorHarmony": "analogous-warm"
  },
  "stylePatches": [
    { "op": "replace", "path": "/preset", "value": "photo-extracted" },
    { "op": "add", "path": "/quick/photoExtraction", "value": {
      "source": "photos.main",
      "extraction": { "algorithm": "vibrant", "count": 5 },
      "autoMapping": { "dominant": "most-common" },
      "adjustments": { "warmth": 20 }
    }},
    { "op": "replace", "path": "/advanced/tokens/accent-default", "value": "#D4A574" }
  ],
  "explanation": "메인 사진에서 따뜻한 갈색 계열을 추출하여 적용했습니다."
}
```

---

## 11. 다음 단계

- [ ] 각 Option 프로토타입 구현 및 비교
- [ ] 테마 프리셋 10종 정의
- [ ] 사진 팔레트 추출 라이브러리 선정 (Vibrant.js vs ColorThief)
- [ ] CSS 변수 생성 유틸리티 구현
- [ ] 에디터 UI에 스타일 패널 통합

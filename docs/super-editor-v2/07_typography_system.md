# Super Editor v2 - 타이포그래피 시스템

> **목표**: 제목(영문) + 본문(한글) 조합으로 청첩장에 최적화된 타이포그래피 프리셋 제공
> **핵심 원칙**: 기존 56개 폰트 활용 + 무드 기반 프리셋 조합 + 동적 폰트 로딩

---

## 1. 설계 원칙

### 1.1 핵심 결정사항

| 항목 | 결정 |
|------|------|
| **제목 폰트** | 영문 폰트 (디스플레이/세리프) |
| **본문 폰트** | 한글 폰트 (명조/고딕/손글씨) |
| **프리셋 수** | 12개 (무드별 3개 × 4카테고리) |
| **커스텀 지원** | 프리셋 + 개별 폰트 오버라이드 |
| **폰트 로딩** | 사용된 폰트만 동적 로드 |

### 1.2 폰트 조합 패턴

```
┌─────────────────────────────────────────────────────────┐
│  Typography Preset                                       │
├─────────────────────────────────────────────────────────┤
│  heading: 영문 폰트 (Playfair Display, Cinzel 등)        │
│     └─ 제목, 이름, 날짜 표시                             │
│                                                          │
│  body: 한글 폰트 (Noto Serif KR, Pretendard 등)         │
│     └─ 인사말, 안내문, 본문 텍스트                       │
│                                                          │
│  accent: 장식용 폰트 (Great Vibes, 나눔펜 등) [선택]     │
│     └─ 강조 문구, 캘리그라피 효과                        │
└─────────────────────────────────────────────────────────┘
```

---

## 2. 폰트 소스

> **참고**: 기존 `src/lib/super-editor/fonts/presets.ts`의 56개 폰트 활용

### 2.1 카테고리별 폰트 목록

#### 영문 제목용 (heading)

| ID | 이름 | 카테고리 | 무드 |
|----|------|----------|------|
| `playfair-display` | Playfair Display | serif-en | 클래식, 우아 |
| `cormorant-garamond` | Cormorant Garamond | serif-en | 럭셔리, 클래식 |
| `cinzel` | Cinzel | display-en | 격조, 전통 |
| `cinzel-decorative` | Cinzel Decorative | display-en | 웨딩, 장식 |
| `great-vibes` | Great Vibes | display-en | 로맨틱, 스크립트 |
| `pinyon-script` | Pinyon Script | display-en | 캘리그라피, 격조 |
| `italianno` | Italianno | display-en | 로맨틱, 이탈리안 |
| `italiana` | Italiana | display-en | 우아, 모던 |
| `montserrat` | Montserrat | sans-en | 모던, 미니멀 |
| `poppins` | Poppins | sans-en | 모던, 기하학 |
| `inter` | Inter | sans-en | 미니멀, 클린 |
| `lt-museum` | LT Museum | serif-en | 클래식, 박물관 |
| `high-summit` | High Summit | display-en | 자연, 손글씨 |

#### 한글 본문용 (body)

| ID | 이름 | 카테고리 | 무드 |
|----|------|----------|------|
| `noto-serif-kr` | 노토 세리프 | serif-ko | 격조, 클래식 |
| `nanum-myeongjo` | 나눔명조 | serif-ko | 전통, 클래식 |
| `gowun-batang` | 고운바탕 | serif-ko | 우아, 부드러움 |
| `hahmlet` | 함렛 | serif-ko | 현대적 명조 |
| `pretendard` | Pretendard | sans-ko | 모던, 가독성 |
| `noto-sans-kr` | 노토 산스 | sans-ko | 범용, 깔끔 |
| `gowun-dodum` | 고운돋움 | sans-ko | 부드러움, 단정 |

#### 장식/강조용 (accent)

| ID | 이름 | 카테고리 | 무드 |
|----|------|----------|------|
| `nanum-pen` | 나눔펜스크립트 | handwriting-ko | 자연, 손글씨 |
| `nanum-brush` | 나눔붓글씨 | handwriting-ko | 감성, 붓글씨 |
| `mapo-geumbitnaru` | 마포금빛나루 | handwriting-ko | 따뜻함, 감성 |
| `dancing-script` | Dancing Script | display-en | 경쾌, 스크립트 |
| `alex-brush` | Alex Brush | display-en | 브러시, 자연 |
| `parisienne` | Parisienne | display-en | 파리지앵, 우아 |

---

## 3. 타이포그래피 프리셋

### 3.1 프리셋 타입 정의

```typescript
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

interface TypographyPreset {
  id: TypographyPresetId
  name: string
  description: string

  // 무드 태그 (AI 매칭용)
  mood: string[]

  // 폰트 스택
  fonts: {
    heading: {
      fontId: string      // FONT_PRESETS의 id
      weight: number      // 기본 굵기
      letterSpacing?: number  // em 단위
    }
    body: {
      fontId: string
      weight: number
      lineHeight?: number
    }
    accent?: {
      fontId: string
      weight: number
    }
  }

  // 타입 스케일 오버라이드 (선택)
  scale?: Partial<TypeScale>
}
```

### 3.2 프리셋 정의

```typescript
const TYPOGRAPHY_PRESETS: Record<TypographyPresetId, TypographyPreset> = {
  // ═══════════════════════════════════════════════════════════
  // 클래식/우아
  // ═══════════════════════════════════════════════════════════
  'classic-elegant': {
    id: 'classic-elegant',
    name: '클래식 엘레강스',
    description: '격조 있는 세리프 조합. 전통적인 청첩장에 적합',
    mood: ['elegant', 'classic', 'formal', 'traditional'],
    fonts: {
      heading: {
        fontId: 'playfair-display',
        weight: 600,
        letterSpacing: 0.02,
      },
      body: {
        fontId: 'noto-serif-kr',
        weight: 400,
        lineHeight: 1.8,
      },
      accent: {
        fontId: 'great-vibes',
        weight: 400,
      },
    },
  },

  'classic-traditional': {
    id: 'classic-traditional',
    name: '클래식 트래디셔널',
    description: '로마 대문자 스타일. 격식 있는 예식에 적합',
    mood: ['traditional', 'formal', 'grand', 'timeless'],
    fonts: {
      heading: {
        fontId: 'cinzel',
        weight: 500,
        letterSpacing: 0.1,
      },
      body: {
        fontId: 'nanum-myeongjo',
        weight: 400,
        lineHeight: 1.9,
      },
    },
  },

  'classic-romantic': {
    id: 'classic-romantic',
    name: '클래식 로맨틱',
    description: '우아하고 부드러운 세리프. 로맨틱한 분위기',
    mood: ['romantic', 'soft', 'elegant', 'gentle'],
    fonts: {
      heading: {
        fontId: 'cormorant-garamond',
        weight: 500,
        letterSpacing: 0.03,
      },
      body: {
        fontId: 'gowun-batang',
        weight: 400,
        lineHeight: 1.8,
      },
      accent: {
        fontId: 'italianno',
        weight: 400,
      },
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 모던/미니멀
  // ═══════════════════════════════════════════════════════════
  'modern-minimal': {
    id: 'modern-minimal',
    name: '모던 미니멀',
    description: '깔끔하고 세련된 산세리프. 현대적인 청첩장',
    mood: ['modern', 'minimal', 'clean', 'contemporary'],
    fonts: {
      heading: {
        fontId: 'montserrat',
        weight: 600,
        letterSpacing: 0.05,
      },
      body: {
        fontId: 'pretendard',
        weight: 400,
        lineHeight: 1.7,
      },
    },
  },

  'modern-clean': {
    id: 'modern-clean',
    name: '모던 클린',
    description: '가독성 중심의 깔끔한 디자인',
    mood: ['clean', 'simple', 'modern', 'readable'],
    fonts: {
      heading: {
        fontId: 'inter',
        weight: 600,
        letterSpacing: 0.02,
      },
      body: {
        fontId: 'noto-sans-kr',
        weight: 400,
        lineHeight: 1.7,
      },
    },
  },

  'modern-geometric': {
    id: 'modern-geometric',
    name: '모던 지오메트릭',
    description: '기하학적 산세리프. 트렌디한 느낌',
    mood: ['trendy', 'geometric', 'modern', 'bold'],
    fonts: {
      heading: {
        fontId: 'poppins',
        weight: 600,
        letterSpacing: 0.03,
      },
      body: {
        fontId: 'pretendard',
        weight: 400,
        lineHeight: 1.6,
      },
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 로맨틱/감성
  // ═══════════════════════════════════════════════════════════
  'romantic-script': {
    id: 'romantic-script',
    name: '로맨틱 스크립트',
    description: '우아한 필기체 제목. 로맨틱한 청첩장',
    mood: ['romantic', 'dreamy', 'whimsical', 'feminine'],
    fonts: {
      heading: {
        fontId: 'great-vibes',
        weight: 400,
        letterSpacing: 0.01,
      },
      body: {
        fontId: 'gowun-batang',
        weight: 400,
        lineHeight: 1.9,
      },
    },
  },

  'romantic-italian': {
    id: 'romantic-italian',
    name: '로맨틱 이탈리안',
    description: '이탈리안 캘리그라피. 감성적인 웨딩',
    mood: ['romantic', 'italian', 'passionate', 'artistic'],
    fonts: {
      heading: {
        fontId: 'italianno',
        weight: 400,
        letterSpacing: 0.02,
      },
      body: {
        fontId: 'noto-serif-kr',
        weight: 400,
        lineHeight: 1.8,
      },
      accent: {
        fontId: 'parisienne',
        weight: 400,
      },
    },
  },

  'romantic-soft': {
    id: 'romantic-soft',
    name: '로맨틱 소프트',
    description: '정교한 캘리그라피. 부드럽고 우아한 느낌',
    mood: ['soft', 'delicate', 'romantic', 'refined'],
    fonts: {
      heading: {
        fontId: 'pinyon-script',
        weight: 400,
        letterSpacing: 0.01,
      },
      body: {
        fontId: 'hahmlet',
        weight: 400,
        lineHeight: 1.8,
      },
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 내추럴/손글씨
  // ═══════════════════════════════════════════════════════════
  'natural-handwritten': {
    id: 'natural-handwritten',
    name: '내추럴 핸드라이트',
    description: '자연스러운 손글씨 조합. 따뜻한 느낌',
    mood: ['natural', 'warm', 'handwritten', 'personal'],
    fonts: {
      heading: {
        fontId: 'high-summit',
        weight: 400,
      },
      body: {
        fontId: 'mapo-geumbitnaru',
        weight: 400,
        lineHeight: 1.9,
      },
    },
  },

  'natural-brush': {
    id: 'natural-brush',
    name: '내추럴 브러시',
    description: '붓글씨 스타일. 감성적이고 예술적인 느낌',
    mood: ['artistic', 'brush', 'natural', 'emotional'],
    fonts: {
      heading: {
        fontId: 'alex-brush',
        weight: 400,
      },
      body: {
        fontId: 'nanum-brush',
        weight: 400,
        lineHeight: 2.0,
      },
    },
  },

  'natural-warm': {
    id: 'natural-warm',
    name: '내추럴 웜',
    description: '따뜻하고 친근한 느낌. 캐주얼한 웨딩',
    mood: ['warm', 'friendly', 'casual', 'cheerful'],
    fonts: {
      heading: {
        fontId: 'dancing-script',
        weight: 500,
      },
      body: {
        fontId: 'gowun-dodum',
        weight: 400,
        lineHeight: 1.7,
      },
      accent: {
        fontId: 'nanum-pen',
        weight: 400,
      },
    },
  },
}
```

---

## 4. 타입 스케일

### 4.1 스케일 정의

```typescript
interface TypeScale {
  // 메인 타이틀 (히어로 이름)
  displayLg: TypeScaleEntry
  displayMd: TypeScaleEntry

  // 섹션 타이틀 (영문)
  sectionTitle: TypeScaleEntry

  // 헤딩
  headingLg: TypeScaleEntry
  headingMd: TypeScaleEntry
  headingSm: TypeScaleEntry

  // 본문
  bodyLg: TypeScaleEntry
  bodyMd: TypeScaleEntry
  bodySm: TypeScaleEntry

  // 캡션
  caption: TypeScaleEntry
}

interface TypeScaleEntry {
  fontSize: number        // px 또는 vw
  fontSizeUnit: 'px' | 'vw' | 'rem'
  fontWeight: number
  lineHeight: number      // 비율 (1.5, 1.8 등)
  letterSpacing: number   // em 단위
  fontStack: 'heading' | 'body' | 'accent'  // 어떤 폰트 스택 사용
}
```

### 4.2 기본 스케일

```typescript
const DEFAULT_TYPE_SCALE: TypeScale = {
  // ─── 디스플레이 (히어로) ───
  displayLg: {
    fontSize: 10,
    fontSizeUnit: 'vw',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: 0.02,
    fontStack: 'heading',
  },
  displayMd: {
    fontSize: 7,
    fontSizeUnit: 'vw',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: 0.02,
    fontStack: 'heading',
  },

  // ─── 섹션 타이틀 (GALLERY, LOCATION 등) ───
  sectionTitle: {
    fontSize: 12,
    fontSizeUnit: 'px',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: 0.25,  // 넓은 자간
    fontStack: 'heading',
  },

  // ─── 헤딩 ───
  headingLg: {
    fontSize: 24,
    fontSizeUnit: 'px',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: 0,
    fontStack: 'body',  // 한글 폰트
  },
  headingMd: {
    fontSize: 20,
    fontSizeUnit: 'px',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: 0,
    fontStack: 'body',
  },
  headingSm: {
    fontSize: 16,
    fontSizeUnit: 'px',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: 0,
    fontStack: 'body',
  },

  // ─── 본문 ───
  bodyLg: {
    fontSize: 16,
    fontSizeUnit: 'px',
    fontWeight: 400,
    lineHeight: 1.8,
    letterSpacing: 0,
    fontStack: 'body',
  },
  bodyMd: {
    fontSize: 14,
    fontSizeUnit: 'px',
    fontWeight: 400,
    lineHeight: 1.8,
    letterSpacing: 0,
    fontStack: 'body',
  },
  bodySm: {
    fontSize: 12,
    fontSizeUnit: 'px',
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: 0,
    fontStack: 'body',
  },

  // ─── 캡션 ───
  caption: {
    fontSize: 11,
    fontSizeUnit: 'px',
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: 0.01,
    fontStack: 'body',
  },
}
```

---

## 5. TypographyConfig (StyleSystem 통합)

### 5.1 타입 정의

```typescript
/**
 * StyleSystem.typography 타입
 * @see 01_data_schema.md §7 StyleSystem
 */
interface TypographyConfig {
  // 프리셋 선택 (Level 1)
  preset?: TypographyPresetId

  // 커스텀 설정 (Level 2-3)
  custom?: {
    // 폰트 스택 오버라이드
    fontStacks?: {
      heading?: string  // fontId (FONT_PRESETS)
      body?: string
      accent?: string
    }

    // 굵기 오버라이드
    weights?: {
      heading?: number
      body?: number
      accent?: number
    }

    // 타입 스케일 오버라이드
    scale?: Partial<TypeScale>
  }
}
```

### 5.2 해석 함수

```typescript
/**
 * TypographyConfig → ResolvedTypography 변환
 */
function resolveTypography(config: TypographyConfig): ResolvedTypography {
  // 1. 프리셋 로드
  const preset = config.preset
    ? TYPOGRAPHY_PRESETS[config.preset]
    : TYPOGRAPHY_PRESETS['classic-elegant']  // 기본값

  // 2. 폰트 스택 구성
  const fontStacks = {
    heading: getFontById(config.custom?.fontStacks?.heading || preset.fonts.heading.fontId),
    body: getFontById(config.custom?.fontStacks?.body || preset.fonts.body.fontId),
    accent: preset.fonts.accent
      ? getFontById(config.custom?.fontStacks?.accent || preset.fonts.accent.fontId)
      : undefined,
  }

  // 3. 굵기 병합
  const weights = {
    heading: config.custom?.weights?.heading || preset.fonts.heading.weight,
    body: config.custom?.weights?.body || preset.fonts.body.weight,
    accent: preset.fonts.accent?.weight || 400,
  }

  // 4. 타입 스케일 병합
  const scale = {
    ...DEFAULT_TYPE_SCALE,
    ...config.custom?.scale,
  }

  return { fontStacks, weights, scale }
}

interface ResolvedTypography {
  fontStacks: {
    heading: FontPreset
    body: FontPreset
    accent?: FontPreset
  }
  weights: {
    heading: number
    body: number
    accent: number
  }
  scale: TypeScale
}
```

---

## 6. 폰트 로딩

### 6.1 동적 로드 전략

```typescript
/**
 * 사용된 폰트만 동적 로드
 * @see src/lib/super-editor/fonts/loader.ts
 */
async function loadFontsForDocument(typography: ResolvedTypography): Promise<void> {
  const fontsToLoad: FontPreset[] = [
    typography.fontStacks.heading,
    typography.fontStacks.body,
    typography.fontStacks.accent,
  ].filter(Boolean) as FontPreset[]

  await Promise.all(fontsToLoad.map(loadFont))
}

async function loadFont(preset: FontPreset): Promise<void> {
  // 이미 로드된 폰트 스킵
  if (document.fonts.check(`16px "${preset.family}"`)) {
    return
  }

  switch (preset.source) {
    case 'google':
      await loadGoogleFont(preset)
      break
    case 'cdn':
      await loadCdnFont(preset)
      break
    case 'fontface':
      await loadFontFace(preset)
      break
  }
}

function loadGoogleFont(preset: FontPreset): Promise<void> {
  const weights = preset.weights.map(w => w.value).join(';')
  const url = `https://fonts.googleapis.com/css2?family=${preset.googleFontsId}:wght@${weights}&display=swap`

  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    link.onload = () => resolve()
    link.onerror = reject
    document.head.appendChild(link)
  })
}

function loadCdnFont(preset: FontPreset): Promise<void> {
  if (!preset.cdnUrl) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = preset.cdnUrl!
    link.onload = () => resolve()
    link.onerror = reject
    document.head.appendChild(link)
  })
}

function loadFontFace(preset: FontPreset): Promise<void> {
  if (!preset.fontFace) return Promise.resolve()

  const fontFace = new FontFace(
    preset.family,
    `url(${preset.fontFace.src}) format('${preset.fontFace.format}')`
  )

  return fontFace.load().then(font => {
    document.fonts.add(font)
  })
}
```

### 6.2 HTML 빌드 시 폰트 링크 생성

```typescript
/**
 * 정적 HTML 빌드 시 필요한 폰트 링크 생성
 */
function generateFontLinks(typography: ResolvedTypography): string {
  const links: string[] = []
  const fonts = [
    typography.fontStacks.heading,
    typography.fontStacks.body,
    typography.fontStacks.accent,
  ].filter(Boolean) as FontPreset[]

  for (const font of fonts) {
    if (font.source === 'google') {
      const weights = font.weights.map(w => w.value).join(';')
      links.push(
        `<link rel="preconnect" href="https://fonts.googleapis.com">`,
        `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
        `<link href="https://fonts.googleapis.com/css2?family=${font.googleFontsId}:wght@${weights}&display=swap" rel="stylesheet">`
      )
    } else if (font.source === 'cdn') {
      links.push(`<link href="${font.cdnUrl}" rel="stylesheet">`)
    } else if (font.source === 'fontface') {
      links.push(`<style>
@font-face {
  font-family: '${font.family}';
  src: url('${font.fontFace!.src}') format('${font.fontFace!.format}');
  font-weight: ${font.defaultWeight};
  font-style: normal;
  font-display: swap;
}
</style>`)
    }
  }

  return [...new Set(links)].join('\n')
}
```

---

## 7. CSS 변수 생성

### 7.1 타이포그래피 CSS 변수

```typescript
/**
 * ResolvedTypography → CSS Variables
 */
function generateTypographyCss(typography: ResolvedTypography): string {
  const { fontStacks, weights, scale } = typography

  const fontVars = `
    --font-heading: "${fontStacks.heading.family}", ${fontStacks.heading.fallback};
    --font-body: "${fontStacks.body.family}", ${fontStacks.body.fallback};
    ${fontStacks.accent ? `--font-accent: "${fontStacks.accent.family}", ${fontStacks.accent.fallback};` : ''}

    --font-weight-heading: ${weights.heading};
    --font-weight-body: ${weights.body};
    --font-weight-accent: ${weights.accent};
  `

  const scaleVars = Object.entries(scale).map(([key, entry]) => {
    const kebabKey = camelToKebab(key)
    const fontFamily = entry.fontStack === 'heading'
      ? 'var(--font-heading)'
      : entry.fontStack === 'accent'
        ? 'var(--font-accent, var(--font-body))'
        : 'var(--font-body)'

    return `
    --typo-${kebabKey}-font-family: ${fontFamily};
    --typo-${kebabKey}-font-size: ${entry.fontSize}${entry.fontSizeUnit};
    --typo-${kebabKey}-font-weight: ${entry.fontWeight};
    --typo-${kebabKey}-line-height: ${entry.lineHeight};
    --typo-${kebabKey}-letter-spacing: ${entry.letterSpacing}em;
    `
  }).join('')

  return `:root {${fontVars}${scaleVars}}`
}
```

### 7.2 사용 예시

```css
/* 생성된 CSS 변수 */
:root {
  --font-heading: "Playfair Display", serif;
  --font-body: "Noto Serif KR", serif;
  --font-accent: "Great Vibes", cursive;

  --font-weight-heading: 600;
  --font-weight-body: 400;
  --font-weight-accent: 400;

  --typo-display-lg-font-family: var(--font-heading);
  --typo-display-lg-font-size: 10vw;
  --typo-display-lg-font-weight: 600;
  --typo-display-lg-line-height: 1.2;
  --typo-display-lg-letter-spacing: 0.02em;

  /* ... */
}

/* 사용 */
.hero-name {
  font-family: var(--typo-display-lg-font-family);
  font-size: var(--typo-display-lg-font-size);
  font-weight: var(--typo-display-lg-font-weight);
  line-height: var(--typo-display-lg-line-height);
  letter-spacing: var(--typo-display-lg-letter-spacing);
}
```

---

## 8. AI 통합

### 8.1 무드 매칭

```typescript
/**
 * AI가 무드 키워드로 프리셋 추천
 */
function matchTypographyPreset(mood: string[]): TypographyPresetId[] {
  const scores = Object.entries(TYPOGRAPHY_PRESETS).map(([id, preset]) => {
    const matchCount = mood.filter(m =>
      preset.mood.includes(m.toLowerCase())
    ).length
    return { id: id as TypographyPresetId, score: matchCount }
  })

  return scores
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.id)
}

// 예시
matchTypographyPreset(['elegant', 'classic'])
// → ['classic-elegant', 'classic-traditional', 'classic-romantic']

matchTypographyPreset(['modern', 'minimal'])
// → ['modern-minimal', 'modern-clean', 'modern-geometric']
```

### 8.2 AI 컨텍스트

```typescript
interface AITypographyContext {
  // 현재 설정
  current: {
    presetId: TypographyPresetId | null
    headingFont: string
    bodyFont: string
    accentFont?: string
  }

  // 사용 가능한 프리셋
  availablePresets: {
    id: TypographyPresetId
    name: string
    mood: string[]
  }[]

  // 사용 가능한 폰트 (카테고리별)
  availableFonts: {
    headingFonts: { id: string; name: string; mood: string[] }[]
    bodyFonts: { id: string; name: string; mood: string[] }[]
    accentFonts: { id: string; name: string; mood: string[] }[]
  }
}
```

---

## 9. 관련 파일

| 파일 | 역할 |
|------|------|
| `src/lib/super-editor/fonts/presets.ts` | 56개 폰트 프리셋 정의 |
| `src/lib/super-editor/fonts/loader.ts` | 동적 폰트 로딩 |
| `src/lib/super-editor-v2/typography/presets.ts` | 타이포그래피 프리셋 (신규) |
| `src/lib/super-editor-v2/typography/resolver.ts` | Config → Resolved 변환 (신규) |
| `src/lib/super-editor-v2/typography/css-generator.ts` | CSS 변수 생성 (신규) |

---

## 10. 참고 문서

- [01_data_schema.md §7](./01_data_schema.md) - StyleSystem 타입
- [04_editor_ui.md §8.9](./04_editor_ui.md) - TypographySettings UI
- [기존 폰트 시스템](../src/lib/super-editor/fonts/CLAUDE.md) - v1 참고

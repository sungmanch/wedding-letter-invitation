# Super Editor

LLM 기반 동적 청첩장 에디터 시스템

## 개요

AI(LLM)가 JSON 스키마를 생성하고, 이를 정적 HTML로 빌드하는 렌더링 시스템입니다.

## 핵심 스키마 (3가지 구조)

| 스키마 | 역할 |
|--------|------|
| **LayoutSchema** | UI 트리 구조 (Screen + PrimitiveNode 배열) |
| **StyleSchema** | 테마/색상/타이포그래피 정의 |
| **VariablesSchema** | 변수 선언 (에디터 필드 생성 + 기본값) |

## 에디터 필드 생성 흐름

```
LLM → VariablesSchema (declarations) → DB 저장
                ↓
Layout의 {{변수}} + declarations → generateEditorSectionsFromLayout() → EditorSection[]
```

## 29개 Primitive 타입

- **레이아웃 (6)**: `container`, `row`, `column`, `scroll-container`, `overlay`, `fullscreen`
- **콘텐츠 (9)**: `text`, `image`, `video`, `avatar`, `button`, `spacer`, `divider`, `input`, `map-embed`
- **이미지 컬렉션 (6)**: `gallery`, `carousel`, `grid`, `collage`, `masonry`, `vinyl-selector`
- **애니메이션 (5)**: `animated`, `sequence`, `parallel`, `scroll-trigger`, `transition`
- **로직 (2)**: `conditional`, `repeat`
- **오디오 (1)**: `bgm-player`

## 스크롤 모션 프리셋 (15개)

- **기본 등장 (6)**: `scroll-fade-in`, `scroll-slide-up`, `scroll-slide-down`, `scroll-slide-left`, `scroll-slide-right`, `scroll-scale-in`
- **PPT 스타일 (6)**: `scroll-blur-in`, `scroll-rotate-in`, `scroll-flip-in`, `clip-reveal-up`, `clip-reveal-down`, `clip-reveal-circle`
- **Parallax (3)**: `parallax-slow`, `parallax-fast`, `parallax-zoom`

## BGM 프리셋 카테고리

- **romantic**: 로맨틱한 피아노/어쿠스틱
- **elegant**: 우아한 오케스트라/하프
- **playful**: 경쾌한 재즈/우쿨렐레
- **emotional**: 감동적인 발라드/시네마틱
- **classical**: 클래식 편곡 (캐논, 월광)
- **modern**: 모던 일렉트로닉/로파이

## 데이터 바인딩

`{{path.to.data}}` 형식으로 동적 데이터를 바인딩:
```
{{couple.groom.name}}, {{wedding.date}}, {{photos.gallery}}
```

## Design Token System (v2)

### 변환 파이프라인

```
StyleSchema          →  SemanticDesignTokens  →  CSS Variables  →  Skeleton 렌더링
(theme.typography)      (resolveTokens)           (generateCss)     ($token.xxx → var(--xxx))
     │                        │                        │                    │
     │  tokens/resolver.ts    │  tokens/css-generator  │  primitives/       │
     └────────────────────────┴────────────────────────┴────────────────────┘
```

### 1. CSS 변수 명명 규칙

| 토큰 경로 | CSS 변수 |
|-----------|----------|
| `$token.colors.brand` | `var(--color-brand)` |
| `$token.colors.text.primary` | `var(--color-text-primary)` |
| `$token.typography.displayLg.fontFamily` | `var(--typo-display-lg-font-family)` |
| `$token.typography.sectionTitle.fontWeight` | `var(--typo-section-title-font-weight)` |
| `$token.spacing.md` | `var(--spacing-md)` |
| `$token.borders.radiusMd` | `var(--radius-md)` |
| `$token.shadows.lg` | `var(--shadow-lg)` |

**변환 규칙**: `camelCase` → `kebab-case` (예: `displayLg` → `display-lg`)

### 2. Typography Weight 체계

```
StyleSchema.theme.typography.weights
├── bold     → displayLg (메인 타이틀)
├── semibold → displayMd, headingLg, headingMd, headingSm (섹션 제목)
├── medium   → sectionTitle (GALLERY, LOCATION 등 영문 타이틀)
└── regular  → bodyLg, bodyMd, bodySm, caption (본문)
```

| Weight 키 | 기본값 | 용도 |
|-----------|--------|------|
| `bold` | 700 | 메인 타이틀 (인트로 신랑♥신부) |
| `semibold` | 600 | 섹션 내 제목 |
| `medium` | 500 | 섹션 영문 타이틀 |
| `regular` | 400 | 본문 텍스트 |

### 3. StyleEditor ↔ 토큰 영향 범위

| StyleEditor UI | StyleSchema 경로 | 영향받는 토큰 |
|----------------|------------------|---------------|
| **제목 글꼴** | `fonts.heading.family` | displayLg/Md, sectionTitle, headingLg/Md/Sm |
| **제목 굵기** | `weights.bold/semibold/medium` | displayLg, displayMd~headingSm, sectionTitle |
| **본문 글꼴** | `fonts.body.family` | bodyLg/Md/Sm, caption |
| **본문 굵기** | `weights.regular` | bodyLg/Md/Sm, caption |
| **기본 크기** | `sizes.base` | headingSm, bodyLg 만 |
| **줄 간격** | `lineHeights.relaxed` | bodyLg, bodyMd |
| **자간** | `letterSpacing.tight` | displayLg, displayMd |

### 4. 전체 CSS 변수 목록

#### Colors (10개)
```css
--color-brand
--color-accent
--color-background
--color-surface
--color-text-primary
--color-text-secondary
--color-text-muted
--color-text-on-brand
--color-border
--color-divider
```

#### Typography (10개 토큰 × 5개 속성 = 50개)
```css
/* 각 토큰별: font-family, font-size, font-weight, line-height, letter-spacing */
--typo-display-lg-*      /* 메인 타이틀 (4xl, bold, tight) */
--typo-display-md-*      /* 대제목 (3xl, semibold, tight) */
--typo-section-title-*   /* 섹션 영문 (sm, medium, 0.25em spacing) */
--typo-heading-lg-*      /* H1 (2xl, semibold, normal) */
--typo-heading-md-*      /* H2 (lg, semibold, normal) */
--typo-heading-sm-*      /* H3 (base, semibold, normal) */
--typo-body-lg-*         /* 본문 대 (base, regular, relaxed) */
--typo-body-md-*         /* 본문 중 (sm, regular, relaxed) */
--typo-body-sm-*         /* 본문 소 (xs, regular, normal) */
--typo-caption-*         /* 캡션 (xs, regular, normal) */
```

#### Spacing (8개)
```css
--spacing-xs       /* 4px */
--spacing-sm       /* 8px */
--spacing-md       /* 16px */
--spacing-lg       /* 24px */
--spacing-xl       /* 32px */
--spacing-xxl      /* 48px */
--spacing-section  /* 섹션 패딩 */
--spacing-component /* 컴포넌트 간격 */
```

#### Borders (4개)
```css
--radius-sm        /* 4px */
--radius-md        /* 8px */
--radius-lg        /* 16px */
--radius-full      /* 9999px */
```

#### Shadows (3개)
```css
--shadow-sm
--shadow-md
--shadow-lg
```

#### Animation (5개)
```css
--duration-fast    /* 150ms */
--duration-normal  /* 300ms */
--duration-slow    /* 500ms */
--easing-default
--stagger-delay    /* 100ms */
```

### 5. Skeleton에서 토큰 참조

```typescript
// skeletons/sections/*.ts
tokenStyle: {
  backgroundColor: '$token.colors.background',
  color: '$token.colors.text.primary',
  fontFamily: '$token.typography.displayLg.fontFamily',
  fontWeight: '$token.typography.displayLg.fontWeight',
  padding: '$token.spacing.section'
}

// 렌더링 시 변환 결과
style: {
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--typo-display-lg-font-family)',
  fontWeight: 'var(--typo-display-lg-font-weight)',
  padding: 'var(--spacing-section)'
}
```

### 6. 관련 파일

| 파일 | 역할 |
|------|------|
| `tokens/schema.ts` | SemanticDesignTokens 타입 정의 |
| `tokens/resolver.ts` | StyleSchema → SemanticDesignTokens 변환 |
| `tokens/css-generator.ts` | SemanticDesignTokens → CSS Variables 문자열 |
| `context/TokenStyleContext.tsx` | CSS Variables를 `<style>` 태그로 주입 |
| `components/StyleEditor.tsx` | 스타일 편집 UI |

## Section Skeletons (8개 섹션)

AI 일관성을 위한 사전 정의된 섹션 구조 + Variant 시스템

| 섹션 | Variants | 설명 |
|------|----------|------|
| **intro** | minimal, elegant, romantic | 인트로 화면 |
| **venue** | minimal, detailed, elegant | 예식장 정보 |
| **date** | minimal, countdown, elegant | 날짜/시간 |
| **gallery** | grid, carousel, masonry | 갤러리 |
| **parents** | minimal, detailed, elegant | 혼주 정보 |
| **accounts** | simple, tabbed, accordion | 계좌 정보 |
| **guestbook** | simple, card, timeline | 방명록 |
| **music** | fab, minimal | BGM 플레이어 |

### SkeletonNode 토큰 참조
```typescript
tokenStyle: {
  backgroundColor: '$token.colors.background',
  color: '$token.colors.text.primary',
  padding: '$token.spacing.section'
}
```

## 2단계 AI 생성 파이프라인

### Stage 1: StyleSchema + Intro
1. `generateStyle(prompt, mood)` → StyleSchema
2. `resolveTokens(style)` → SemanticDesignTokens
3. `generateIntroSection()` → Intro 먼저 생성
4. `extractPatternsFromSkeleton()` → 디자인 패턴 추출

### Stage 2: 나머지 섹션 병렬 생성
5. `generateSectionsInParallel()` → 7개 섹션 (Intro 패턴 참조)
6. `resolveSkeletonToScreen()` → Screen 변환
7. `buildHtml()` → HTML/CSS/JS 빌드 (CSS Variables 포함)

### AIProvider 인터페이스
```typescript
interface AIProvider {
  generateStyle(prompt: string, mood?: string[]): Promise<StyleSchema>
  selectVariants(prompt: string, systemPrompt: string): Promise<FillerResponse>
}
```

## 폴더 구조

```
super-editor/
├── schema/          # 타입 정의 (primitives, layout, style, user-data)
├── tokens/          # Design Token 시스템 (schema, resolver, css-generator)
├── skeletons/       # Section Skeletons (types, registry, sections/*)
├── services/        # Generation Pipeline (generation-service)
├── builder/         # HtmlBuilder + skeleton-resolver
├── prompts/         # AI 프롬프트 (mode-prompts, filler-prompt)
├── utils/           # design-pattern-extractor
├── primitives/      # Primitive 렌더러 (layout, content, animation, logic, audio)
├── animations/      # 30+ 애니메이션 프리셋, 15+ 전환 프리셋, 15개 스크롤 모션 프리셋
├── audio/           # BGM 프리셋 라이브러리 (16개)
├── components/      # 에디터 UI 컴포넌트
├── context/         # 상태 관리
├── hooks/           # useAIChat 등
├── actions/         # 서버 액션
└── templates/       # 예시 정의 템플릿 (카카오톡 등)
```

## 동작 흐름

1. **AI 생성**: 사용자 요청 시 LLM이 Layout/Style JSON 생성
2. **에디터 동적 생성**: Layout의 `{{변수}}` 바인딩에서 EditorSection/Field 자동 생성
3. **데이터 바인딩**: 동적 에디터를 통해 UserData를 Layout에 바인딩
4. **HTML 빌드**: `buildHtml()` 함수로 정적 HTML/CSS/JS 생성 (스크롤 모션 + BGM 런타임 포함)
5. **렌더링**: 프리뷰 또는 배포용 출력 생성

# Super Editor

LLM 기반 동적 청첩장 에디터 시스템

## 개요

AI(LLM)가 JSON 스키마를 생성하고, 이를 정적 HTML로 빌드하는 렌더링 시스템입니다.

## 핵심 스키마 (3가지 구조)

| 스키마 | 역할 |
|--------|------|
| **LayoutSchema** | UI 트리 구조 (Screen + PrimitiveNode 배열) |
| **StyleSchema** | 테마/색상/타이포그래피 정의 |
| **EditorSchema** | 편집기 폼 필드 정의 |

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

StyleSchema → SemanticDesignTokens → CSS Variables 자동 변환 시스템

### 토큰 구조
- **colors**: brand, accent, background, surface, text (primary/secondary/muted), border, divider
- **typography**: displayLg/Md, headingLg/Md/Sm, body, caption (fontFamily, fontSize, fontWeight, lineHeight, letterSpacing)
- **spacing**: xs(4px) ~ xxl(48px), section(64px), component(24px)
- **borders**: radiusSm(4px) ~ radiusFull(9999px)
- **shadows**: sm, md, lg
- **animation**: durationFast(150ms)/Normal(300ms)/Slow(500ms), easing, staggerDelay(100ms)

### CSS Variables 사용
```css
color: var(--color-text-primary);
font-family: var(--typo-body-font-family);
padding: var(--spacing-md);
border-radius: var(--radius-md);
```

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
├── schema/          # 타입 정의 (primitives, layout, style, editor, user-data)
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

1. **AI 생성**: 사용자 요청 시 LLM이 Layout/Style/Editor JSON 생성
2. **데이터 바인딩**: Editor를 통해서 UserData를 Layout에 바인딩
3. **HTML 빌드**: `buildHtml()` 함수로 정적 HTML/CSS/JS 생성 (스크롤 모션 + BGM 런타임 포함)
4. **렌더링**: 프리뷰 또는 배포용 출력 생성

# Super Editor v2 - 개발 작업 목록

> 마지막 업데이트: 2025-12-14

## ✅ 완료된 작업

### Phase 1: 인프라
- [x] 스키마 타입 정의 (`schema/types.ts`)
- [x] DB 스키마 정의 (`schema/db-schema.ts`)
- [x] 서버 액션 - Document CRUD (`actions/document.ts`)
- [x] 서버 액션 - AI Edit (`actions/ai-edit.ts`)
- [x] AI API 라우트 (`api/super-editor-v2/ai/route.ts`)
- [x] DB 마이그레이션 생성

### Phase 2: 프리셋 정의
- [x] 테마 프리셋 13개 (`presets/theme-presets.ts`)
- [x] 타이포그래피 프리셋 12개 (`presets/typography-presets.ts`)
- [x] 애니메이션 프리셋 29개 (`presets/animation-presets.ts`)

---

## 🔲 진행 중 / 예정된 작업

### Phase 3: 렌더러 시스템

#### 3.1 Context Providers
- [x] `context/document-context.tsx` - DocumentProvider, useDocument ✅
- [x] `context/animation-context.tsx` - AnimationProvider, useAnimation ✅
- [x] `context/block-context.tsx` - BlockProvider, useBlock ✅
- [x] `context/index.ts` - Context exports ✅

#### 3.2 변수 바인딩
- [x] `utils/binding-resolver.ts` - resolveBinding, getValueByPath ✅
- [x] `utils/interpolate.ts` - 포맷 문자열 보간 (`{groom.name} ♥ {bride.name}`) ✅
- [ ] `utils/computed-fields.ts` - Computed 필드 정의 (binding-resolver에 통합됨)

#### 3.3 Style Resolver
- [x] `renderer/style-resolver.ts` - StyleSystem → ResolvedStyle 변환 (styleToCSSVariables 포함) ✅
- [ ] `renderer/css-generator.ts` - ResolvedStyle → CSS Variables (style-resolver에 통합됨)
- [ ] `renderer/token-resolver.ts` - SemanticTokens 해석 (style-resolver에 통합됨)

#### 3.4 Block/Element Renderer
- [x] `renderer/document-renderer.tsx` - 최상위 렌더러 ✅
- [x] `renderer/block-renderer.tsx` - 21개 BlockType 렌더링 ✅
- [x] `renderer/element-renderer.tsx` - 8개 ElementType 렌더링 ✅
- [x] `renderer/floating-renderer.tsx` - Floating 요소 렌더링 ✅
- [x] `renderer/index.ts` - Renderer exports ✅

#### 3.5 Element Type Components
- [x] `components/elements/text-element.tsx` ✅
- [x] `components/elements/image-element.tsx` ✅
- [x] `components/elements/shape-element.tsx` ✅
- [x] `components/elements/button-element.tsx` ✅
- [x] `components/elements/icon-element.tsx` ✅
- [x] `components/elements/divider-element.tsx` ✅
- [x] `components/elements/map-element.tsx` ✅
- [x] `components/elements/calendar-element.tsx` ✅
- [x] `components/elements/index.ts` - Element exports ✅

---

### Phase 4: 애니메이션 런타임

- [ ] `animation/animation-runtime.ts` - GSAP 기반 애니메이션 실행
- [ ] `animation/trigger-handler.ts` - 트리거 감지 및 처리
- [ ] `animation/action-executor.ts` - 애니메이션 액션 실행
- [ ] `animation/state-machine.ts` - 상태 머신 구현
- [ ] `animation/scroll-manager.ts` - ScrollTrigger 관리

---

### Phase 5: 에디터 UI

#### 5.1 레이아웃
- [ ] `components/editor/editor-layout.tsx` - 2패널 레이아웃
- [ ] `components/editor/preview-panel.tsx` - 프리뷰 패널
- [ ] `components/editor/editor-panel.tsx` - 편집 패널

#### 5.2 탭 구조
- [ ] `components/editor/tabs/content-tab.tsx` - 콘텐츠 탭 (Section-First)
- [ ] `components/editor/tabs/design-tab.tsx` - 디자인 탭 (3-Level 스타일)
- [ ] `components/editor/tabs/share-tab.tsx` - 공유 탭

#### 5.3 변수 에디터
- [ ] `components/editor/fields/text-field.tsx`
- [ ] `components/editor/fields/date-field.tsx`
- [ ] `components/editor/fields/time-field.tsx`
- [ ] `components/editor/fields/phone-field.tsx`
- [ ] `components/editor/fields/account-field.tsx`
- [ ] `components/editor/fields/image-field.tsx`
- [ ] `components/editor/fields/gallery-field.tsx`
- [ ] `components/editor/fields/address-field.tsx`

#### 5.4 직접 편집
- [ ] `components/editor/direct/draggable-element.tsx` - 드래그 가능 요소
- [ ] `components/editor/direct/resize-handles.tsx` - 리사이즈 핸들
- [ ] `components/editor/direct/context-menu.tsx` - 컨텍스트 메뉴

#### 5.5 AI 프롬프트
- [ ] `components/editor/ai/prompt-input.tsx` - AI 프롬프트 입력
- [ ] `components/editor/ai/block-selector.tsx` - 블록 선택기
- [ ] `hooks/useAIEdit.ts` - AI 편집 훅

---

### Phase 6: 빌드 & 배포

- [ ] `builder/html-builder.ts` - EditorDocument → 정적 HTML
- [ ] `builder/css-builder.ts` - 스타일 빌드
- [ ] `builder/js-builder.ts` - 런타임 JS 빌드
- [ ] `builder/asset-optimizer.ts` - 이미지 최적화
- [ ] `actions/publish.ts` - S3/CDN 배포 액션

---

### Phase 7: v1 → v2 마이그레이션

- [ ] `migration/v1-to-v2-converter.ts` - LayoutSchema → EditorDocument 변환
- [ ] `migration/data-migrator.ts` - 기존 청첩장 마이그레이션
- [ ] `migration/validation.ts` - 변환 결과 검증

---

## 파일 구조 (예정)

```
src/lib/super-editor-v2/
├── schema/
│   ├── types.ts              ✅
│   ├── db-schema.ts          ✅
│   └── index.ts              ✅
├── presets/
│   ├── theme-presets.ts      ✅
│   ├── typography-presets.ts ✅
│   ├── animation-presets.ts  ✅
│   └── index.ts              ✅
├── actions/
│   ├── document.ts           ✅
│   ├── ai-edit.ts            ✅
│   └── index.ts              ✅
├── context/
│   ├── document-context.tsx  ✅
│   ├── animation-context.tsx ✅
│   ├── block-context.tsx     ✅
│   └── index.ts              ✅
├── utils/
│   ├── binding-resolver.ts   ✅
│   ├── interpolate.ts        ✅
│   └── computed-fields.ts
├── renderer/
│   ├── style-resolver.ts     ✅
│   ├── document-renderer.tsx ✅
│   ├── block-renderer.tsx    ✅
│   ├── element-renderer.tsx  ✅
│   ├── floating-renderer.tsx ✅
│   └── index.ts              ✅
├── animation/
│   ├── animation-runtime.ts
│   ├── trigger-handler.ts
│   ├── action-executor.ts
│   ├── state-machine.ts
│   └── scroll-manager.ts
├── components/
│   ├── elements/
│   │   ├── text-element.tsx     ✅
│   │   ├── image-element.tsx    ✅
│   │   ├── shape-element.tsx    ✅
│   │   ├── button-element.tsx   ✅
│   │   ├── icon-element.tsx     ✅
│   │   ├── divider-element.tsx  ✅
│   │   ├── map-element.tsx      ✅
│   │   ├── calendar-element.tsx ✅
│   │   └── index.ts             ✅
│   └── editor/
│       ├── editor-layout.tsx
│       ├── tabs/
│       ├── fields/
│       ├── direct/
│       └── ai/
├── builder/
│   ├── html-builder.ts
│   ├── css-builder.ts
│   └── asset-optimizer.ts
├── migration/
│   ├── v1-to-v2-converter.ts
│   └── data-migrator.ts
├── hooks/
│   └── useAIEdit.ts
└── index.ts                  ✅
```

---

## 권장 진행 순서

1. **Context 완성** → document, animation, block context
2. **변수 바인딩** → resolveBinding, interpolate
3. **Style Resolver** → StyleSystem → CSS 변환
4. **Renderer 구현** → Document → Block → Element
5. **Element 컴포넌트** → 8개 요소 타입
6. **애니메이션 런타임** → GSAP 통합
7. **에디터 UI** → 2패널, 탭, 필드
8. **빌드 시스템** → HTML/CSS/JS 빌드
9. **마이그레이션** → v1 → v2 변환

---

## 다음 세션 시작점

Phase 3 완료됨 (렌더러 시스템). 다음 작업:

1. `animation/animation-runtime.ts` - GSAP 기반 애니메이션 실행
2. `animation/trigger-handler.ts` - 트리거 감지 및 처리
3. `animation/scroll-manager.ts` - ScrollTrigger 관리
4. 또는 Phase 5 에디터 UI 먼저 진행 가능

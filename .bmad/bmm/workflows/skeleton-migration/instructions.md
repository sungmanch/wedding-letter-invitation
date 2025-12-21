# Skeleton to Block Preset Migration Instructions

이 워크플로우는 super-editor/skeletons 시스템을 super-editor-v2/presets 시스템으로 마이그레이션합니다.
**섹션별 + Variant별 선택적 마이그레이션을 지원합니다.**

## 지원하는 선택 형식

| 형식 | 예시 | 설명 |
|-----|------|------|
| 전체 | `all` | 모든 섹션의 모든 variants |
| 섹션만 | `gallery,greeting` | 해당 섹션의 모든 variants |
| 특정 variant | `gallery:grid,gallery:masonry` | 지정한 variants만 |
| 와일드카드 | `gallery:*` | gallery의 모든 variants |
| 혼합 | `gallery:grid,greeting:*,venue` | 조합 사용 가능 |

---

<step n="0" goal="Select Sections and Variants to Migrate" critical="true">

## 0.1 섹션 및 Variant 선택

마이그레이션할 섹션과 variant를 선택하세요.

### 사용 가능한 섹션 및 Variants 목록

| ID | 대상 블록 | Variants | 설명 |
|----|-----------|----------|------|
| `intro` | hero | minimal, elegant, romantic, modern, cinematic | 인트로/히어로 블록 |
| `greeting` | greeting | minimal, elegant, card | 인사말 블록 |
| `gallery` | gallery | grid, grid-seamless, elegant-dark, accordion-stack, masonry, carousel, coverflow-dark, film-strip, vertical-swipe, polaroid, magazine, split-scroll, flip-cards, parallax-stack | 갤러리 블록 (16) |
| `venue` | location | minimal, detailed, elegant | 장소/위치 블록 |
| `date` | calendar | minimal, countdown, elegant | 날짜/캘린더 블록 |
| `parents` | parents | minimal, detailed, elegant | 양가 부모님 블록 |
| `contact` | contact | minimal, card | 연락처 블록 |
| `accounts` | account | simple, tabbed, accordion | 계좌정보 블록 |
| `guestbook` | message | simple, card, timeline | 방명록/메시지 블록 |
| `rsvp` | rsvp | minimal, form | 참석여부 블록 |
| `music` | music | fab, minimal | 배경음악 블록 |
| `notice` | notice | minimal, card | 공지사항 블록 |

<ask>
마이그레이션할 섹션/variant를 선택하세요:

**입력 형식:**
- `all` - 모든 섹션의 모든 variants
- 섹션만: `gallery,greeting` (해당 섹션의 모든 variants)
- 특정 variant: `gallery:grid,gallery:masonry` (특정 variants만)
- 와일드카드: `gallery:*` (gallery 모든 variants)
- 혼합: `gallery:grid,gallery:carousel,greeting:*,venue`

**예시:**
- `gallery:grid,gallery:carousel` → gallery의 grid, carousel만
- `gallery:*,greeting:elegant` → gallery 전체 + greeting의 elegant만
- `low` → LOW 복잡도 섹션 전체 (greeting, contact, rsvp, music, notice)

**추천 시작점:**
`greeting:minimal,contact:minimal,music:fab`

입력:
</ask>

<action>사용자 입력을 `target_sections` 변수에 저장</action>
<action>입력을 파싱하여 `selected_sections` 배열과 `target_variants` 맵 생성</action>

### 파싱 로직

```typescript
// 입력: "gallery:grid,gallery:carousel,greeting:*,venue"
// 결과:
selected_sections = ['gallery', 'greeting', 'venue']
target_variants = {
  gallery: ['grid', 'carousel'],  // 특정 variants만
  greeting: ['*'],                 // 모든 variants
  venue: ['*']                     // 섹션만 지정 = 모든 variants
}
```

### 선택 결과 확인

```
선택된 섹션: {{selected_sections}}
Variant 필터:
{{#each target_variants}}
  - {{@key}}: {{this}}
{{/each}}
총 마이그레이션 예정 variant 수: {{total_variants_count}}
```

<ask>선택한 섹션/variant로 진행하시겠습니까? [c] Continue, [r] Reselect</ask>

</step>

---

<step n="0.5" goal="Load Context for Selected Sections">

<action>선택된 섹션의 skeleton 파일만 로드</action>

```typescript
// 로드할 파일들
const filesToLoad = selected_sections.map(s => `{source_dir}/sections/${s}.ts`)
```

<invoke-protocol name="discover_inputs" />

</step>

---

<step n="1" goal="Analyze Source Structure (Selected Sections)">

## 1.1 Skeleton 구조 분석

<action>Read and analyze all skeleton section files from {source_dir}/sections/</action>

각 섹션 스켈레톤에서 다음을 추출:

| 분석 항목 | 설명 |
|----------|------|
| **sectionType** | 섹션 타입 (greeting, gallery 등) |
| **variants[]** | 변형 목록 (minimal, elegant 등) |
| **variant.tags** | 디자인 태그 (minimal, elegant, romantic) |
| **variant.structure** | SkeletonNode 트리 구조 |
| **variant.slots** | DataSlot 바인딩 정보 |
| **variant.options** | 애니메이션, 레이아웃 옵션 |

<action>Create a summary table of all sections and their variants</action>

### 예상 결과 테이블

```markdown
| Section | Variants | Tags | Slots Count |
|---------|----------|------|-------------|
| intro | minimal, elegant, romantic | minimal, elegant, romantic, modern | 5 |
| greeting | simple, elegant | minimal, elegant | 2 |
| gallery | grid, carousel, masonry, collage | grid, carousel, masonry | 3-5 |
...
```

<ask>분석 결과를 확인하시겠습니까? [c] Continue, [e] Edit</ask>
</step>

---

<step n="2" goal="Analyze Target Structure (v2 Presets)">

## 2.1 기존 v2 Preset 구조 확인

<action>Read existing preset files: theme-presets.ts, typography-presets.ts, animation-presets.ts</action>

확인할 패턴:
- `ThemePreset` 인터페이스 구조
- `TypographyPreset` 인터페이스 구조
- `AnimationPreset` 인터페이스 구조
- 네이밍 컨벤션 (kebab-case IDs, Korean names)
- Export 패턴 (const + getter functions)

## 2.2 v2 BlockType 목록 확인

<action>Read schema/types.ts to get complete BlockType list</action>

v2 BlockType (25개):
```typescript
type BlockType =
  | 'hero' | 'greeting' | 'calendar' | 'gallery' | 'location'
  | 'parents' | 'contact' | 'account' | 'message' | 'rsvp'
  | 'loading' | 'quote' | 'profile' | 'parents-contact' | 'timeline'
  | 'video' | 'interview' | 'transport' | 'notice' | 'announcement'
  | 'flower-gift' | 'together-time' | 'dday' | 'guest-snap' | 'ending'
  | 'music' | 'custom'
```

<ask>v1 섹션 타입과 v2 블록 타입 매핑을 확인하시겠습니까? [c] Continue</ask>
</step>

---

<step n="3" goal="Design BlockPreset Type">

## 3.1 BlockPreset 인터페이스 설계

<action>Design the BlockPreset interface based on analysis</action>

```typescript
// block-presets.ts

import type { BlockType, Element, VariablePath } from '../schema/types'
import type { AnimationPresetId } from './animation-presets'
import type { ThemePresetId } from './theme-presets'

/**
 * Block variant preset - defines a specific design variant for a block type
 * Migrated from super-editor/skeletons system
 */
export interface BlockPreset {
  /** Unique identifier: `${blockType}-${variant}` */
  id: string

  /** Block type this preset applies to */
  blockType: BlockType

  /** Variant name (e.g., 'minimal', 'elegant', 'grid') */
  variant: string

  /** Display name in English */
  name: string

  /** Display name in Korean */
  nameKo: string

  /** Description of this variant */
  description: string

  /** Design intent tags for AI matching */
  tags: readonly string[]

  /** Default element layout for this variant */
  elements: BlockPresetElement[]

  /** Required data bindings */
  bindings: readonly VariablePath[]

  /** Recommended animation presets */
  recommendedAnimations?: readonly AnimationPresetId[]

  /** Recommended theme presets */
  recommendedThemes?: readonly ThemePresetId[]

  /** Layout-specific options */
  layoutOptions?: BlockLayoutOptions

  /** AI prompt hints for generation */
  aiHints?: {
    mood: string[]
    style: string[]
    useCase: string[]
  }
}

export interface BlockPresetElement {
  /** Element type */
  type: 'text' | 'image' | 'shape' | 'button' | 'divider' | 'spacer' | 'container'

  /** Semantic role */
  role?: string

  /** Position as percentage of block (0-100) */
  position: { x: number; y: number }

  /** Size as percentage of block (0-100) */
  size: { width: number; height: number }

  /** Variable binding path */
  binding?: VariablePath

  /** Default content if no binding */
  defaultContent?: string

  /** Token style references */
  tokenStyle?: Record<string, string>
}

export interface BlockLayoutOptions {
  /** Grid columns for gallery-type blocks */
  columns?: number

  /** Gap between items */
  gap?: number

  /** Aspect ratio for media */
  aspectRatio?: string

  /** Max items to show */
  maxItems?: number

  /** Layout direction */
  direction?: 'horizontal' | 'vertical'
}
```

<template-output section="3.1">
위 인터페이스를 block-presets.ts 파일에 작성
</template-output>

</step>

---

<step n="4" goal="Design BlockBinding Type">

## 4.1 BlockBinding 인터페이스 설계

<action>Design the BlockBinding interface for data requirements</action>

```typescript
// block-bindings.ts

import type { BlockType, VariablePath } from '../schema/types'

/**
 * Data binding requirement for a block type
 * Defines what data each block needs to render
 */
export interface BlockDataBinding {
  /** Variable path (e.g., 'couple.groom.name') */
  path: VariablePath

  /** Data type */
  type: 'text' | 'image' | 'images' | 'date' | 'time' | 'location' | 'phone' | 'account' | 'select'

  /** Whether this binding is required */
  required: boolean

  /** Description for editor UI */
  description: string

  /** Description in Korean */
  descriptionKo: string

  /** Default value if not provided */
  defaultValue?: unknown

  /** Validation rules */
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
  }
}

/**
 * Complete data requirements for each block type
 */
export type BlockBindings = Record<BlockType, readonly BlockDataBinding[]>

/**
 * Get required bindings for a block type
 */
export function getBlockBindings(blockType: BlockType): readonly BlockDataBinding[]

/**
 * Get required variable paths for a block type
 */
export function getRequiredPaths(blockType: BlockType): readonly VariablePath[]

/**
 * Validate if all required bindings are satisfied
 */
export function validateBindings(
  blockType: BlockType,
  data: Record<string, unknown>
): { valid: boolean; missing: VariablePath[] }
```

<template-output section="4.1">
위 인터페이스를 block-bindings.ts 파일에 작성
</template-output>

</step>

---

<step n="5" goal="Extract and Transform Selected Sections" for-each="section in selected_sections">

## 5.1 섹션별 스켈레톤 변환

<action>For each SELECTED skeleton section, extract variants and transform to BlockPreset</action>

### 현재 처리 중인 섹션: `{{section}}`

<action>Read skeleton file: `{source_dir}/sections/{{section}}.ts`</action>

### Variant 필터링

```typescript
// target_variants[section] 확인
const variantFilter = target_variants['{{section}}']

// 필터링 로직
if (variantFilter.includes('*')) {
  // 모든 variants 처리
  variantsToProcess = skeleton.variants
} else {
  // 특정 variants만 처리
  variantsToProcess = skeleton.variants.filter(v => variantFilter.includes(v.id))
}
```

**현재 섹션의 필터:**
- `{{section}}`: `{{target_variants[section]}}`
- 처리할 variants: `{{variantsToProcess.map(v => v.id).join(', ')}}`

### 변환 규칙

| v1 Skeleton | v2 BlockPreset |
|-------------|----------------|
| `variant.id` | `${blockType}-${variant.id}` |
| `variant.name` | `name` (English) |
| `variant.name` | `nameKo` (Korean - translate if needed) |
| `variant.tags` | `tags` (preserve) |
| `variant.structure` | `elements` (flatten tree to array) |
| `variant.slots` | Extract to `BlockBindings` |
| `variant.options.animations` | `recommendedAnimations` |

### SkeletonNode → BlockPresetElement 변환

```typescript
function transformNode(node: SkeletonNode, parentBounds: Rect): BlockPresetElement {
  // 1. Calculate relative position from tree structure
  const position = calculateRelativePosition(node, parentBounds)

  // 2. Map node type to element type
  const type = mapNodeType(node.type)

  // 3. Extract binding from props
  const binding = extractBinding(node.props)

  // 4. Convert token styles
  const tokenStyle = transformTokenStyles(node.tokenStyle)

  return { type, position, size, binding, tokenStyle }
}
```

### 섹션 → 블록 타입 매핑

| Section ID | Target Block | Notes |
|------------|--------------|-------|
| intro | hero | 인트로/히어로 |
| greeting | greeting | 인사말 |
| date | calendar | 캘린더 |
| gallery | gallery | 갤러리 |
| venue | location | 위치 |
| parents | parents | 양가 |
| contact | contact | 연락처 |
| accounts | account | 계좌 |
| guestbook | message | 메시지 |
| rsvp | rsvp | 참석여부 |
| music | music | 음악 |
| notice | notice | 공지 |

<action>Transform `{{section}}` section's FILTERED variants to block presets</action>

### 변환 결과 ({{section}})

```typescript
// {{section}} → {{target_block}} presets (filtered: {{variantsToProcess.length}} variants)
const {{SECTION_UPPER}}_PRESETS: Record<{{BlockType}}PresetId, BlockPreset> = {
  // ... generated presets for filtered variants only
}
```

<template-output section="5.{{section}}">
{{section}} 섹션의 BlockPreset 객체들 생성 (필터된 variants만)
</template-output>

<ask>
`{{section}}` 섹션 변환 완료 ({{variantsToProcess.length}}/{{skeleton.variants.length}} variants).
[c] Continue to next section
[e] Edit this section's output
[s] Skip remaining sections
</ask>

</step>

---

<step n="6" goal="Generate Block Presets File">

## 6.1 block-presets.ts 생성

<action>Generate the complete block-presets.ts file</action>

파일 구조:
```typescript
// src/lib/super-editor-v2/presets/block-presets.ts

import type { BlockType, Element, VariablePath } from '../schema/types'
import type { AnimationPresetId } from './animation-presets'
import type { ThemePresetId } from './theme-presets'

// ============================================================
// Types
// ============================================================

export interface BlockPreset { ... }
export interface BlockPresetElement { ... }
export interface BlockLayoutOptions { ... }

// ============================================================
// Block Preset IDs
// ============================================================

export type HeroPresetId = 'hero-minimal' | 'hero-elegant' | 'hero-romantic' | ...
export type GalleryPresetId = 'gallery-grid' | 'gallery-carousel' | 'gallery-masonry' | ...
export type GreetingPresetId = 'greeting-simple' | 'greeting-elegant' | ...
// ... for each block type

export type BlockPresetId =
  | HeroPresetId
  | GalleryPresetId
  | GreetingPresetId
  | ...

// ============================================================
// Hero Block Presets
// ============================================================

const HERO_PRESETS: Record<HeroPresetId, BlockPreset> = {
  'hero-minimal': {
    id: 'hero-minimal',
    blockType: 'hero',
    variant: 'minimal',
    name: 'Minimal Hero',
    nameKo: '미니멀 히어로',
    description: 'Clean, centered layout with focus on names and date',
    tags: ['minimal', 'clean', 'modern'],
    elements: [...],
    bindings: ['photos.main', 'couple.groom.name', 'couple.bride.name', 'wedding.date'],
    recommendedAnimations: ['fade-in', 'scale-fade-in'],
    recommendedThemes: ['minimal-light', 'minimal-dark'],
  },
  // ... more hero presets
}

// ============================================================
// Gallery Block Presets
// ============================================================

const GALLERY_PRESETS: Record<GalleryPresetId, BlockPreset> = {
  'gallery-grid': { ... },
  'gallery-carousel': { ... },
  'gallery-masonry': { ... },
  // ...
}

// ... more block type presets

// ============================================================
// Combined Registry
// ============================================================

export const BLOCK_PRESETS: Record<BlockPresetId, BlockPreset> = {
  ...HERO_PRESETS,
  ...GALLERY_PRESETS,
  ...GREETING_PRESETS,
  // ...
}

// ============================================================
// Getter Functions
// ============================================================

export function getBlockPreset(id: BlockPresetId): BlockPreset {
  return BLOCK_PRESETS[id]
}

export function getBlockPresetsByType(blockType: BlockType): BlockPreset[] {
  return Object.values(BLOCK_PRESETS).filter(p => p.blockType === blockType)
}

export function getBlockPresetsByTag(tag: string): BlockPreset[] {
  return Object.values(BLOCK_PRESETS).filter(p => p.tags.includes(tag))
}

export function getBlockPresetsByMood(mood: string): BlockPreset[] {
  return Object.values(BLOCK_PRESETS).filter(p =>
    p.aiHints?.mood.includes(mood) || p.tags.includes(mood)
  )
}

export function getAllBlockPresetIds(): BlockPresetId[] {
  return Object.keys(BLOCK_PRESETS) as BlockPresetId[]
}
```

<template-output section="6.1" critical="true">
block-presets.ts 전체 파일 생성
</template-output>

</step>

---

<step n="7" goal="Generate Block Bindings File">

## 7.1 block-bindings.ts 생성

<action>Generate the complete block-bindings.ts file from skeleton slots</action>

```typescript
// src/lib/super-editor-v2/presets/block-bindings.ts

import type { BlockType, VariablePath } from '../schema/types'

// ============================================================
// Types
// ============================================================

export interface BlockDataBinding { ... }

// ============================================================
// Binding Definitions
// ============================================================

export const BLOCK_BINDINGS: Record<BlockType, readonly BlockDataBinding[]> = {
  hero: [
    {
      path: 'photos.main',
      type: 'image',
      required: true,
      description: 'Main wedding photo',
      descriptionKo: '메인 웨딩 사진',
    },
    {
      path: 'couple.groom.name',
      type: 'text',
      required: true,
      description: 'Groom name',
      descriptionKo: '신랑 이름',
    },
    {
      path: 'couple.bride.name',
      type: 'text',
      required: true,
      description: 'Bride name',
      descriptionKo: '신부 이름',
    },
    {
      path: 'wedding.date',
      type: 'date',
      required: true,
      description: 'Wedding date',
      descriptionKo: '결혼식 날짜',
    },
  ],

  gallery: [
    {
      path: 'photos.gallery',
      type: 'images',
      required: true,
      description: 'Gallery photos',
      descriptionKo: '갤러리 사진들',
    },
  ],

  greeting: [
    {
      path: 'greeting.title',
      type: 'text',
      required: false,
      description: 'Greeting title',
      descriptionKo: '인사말 제목',
      defaultValue: '저희 결혼합니다',
    },
    {
      path: 'greeting.content',
      type: 'text',
      required: false,
      description: 'Greeting message',
      descriptionKo: '인사말 내용',
    },
  ],

  // ... all other block types
}

// ============================================================
// Getter Functions
// ============================================================

export function getBlockBindings(blockType: BlockType): readonly BlockDataBinding[] {
  return BLOCK_BINDINGS[blockType] ?? []
}

export function getRequiredPaths(blockType: BlockType): readonly VariablePath[] {
  return getBlockBindings(blockType)
    .filter(b => b.required)
    .map(b => b.path)
}

export function validateBindings(
  blockType: BlockType,
  data: Record<string, unknown>
): { valid: boolean; missing: VariablePath[] } {
  const required = getRequiredPaths(blockType)
  const missing = required.filter(path => {
    const value = getNestedValue(data, path)
    return value === undefined || value === null || value === ''
  })
  return { valid: missing.length === 0, missing }
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc, key) =>
    (acc as Record<string, unknown>)?.[key], obj
  )
}
```

<template-output section="7.1" critical="true">
block-bindings.ts 전체 파일 생성
</template-output>

</step>

---

<step n="8" goal="Update Presets Index">

## 8.1 index.ts 업데이트

<action>Update presets/index.ts to export new modules</action>

```typescript
// src/lib/super-editor-v2/presets/index.ts

// Theme Presets
export {
  type ThemePreset,
  type ThemePresetId,
  type SemanticTokens,
  THEME_PRESETS,
  getThemePreset,
  getThemePresetsByCategory,
  getAllThemePresetIds,
} from './theme-presets'

// Typography Presets
export {
  type TypographyPreset,
  type TypographyPresetId,
  type FontStack,
  type TypeScale,
  TYPOGRAPHY_PRESETS,
  getTypographyPreset,
  getTypographyPresetsByCategory,
  getAllTypographyPresetIds,
} from './typography-presets'

// Animation Presets
export {
  type AnimationPreset,
  type AnimationPresetId,
  type AnimationMood,
  ENTRANCE_PRESETS,
  SCROLL_PRESETS,
  HOVER_PRESETS,
  getEntrancePreset,
  getScrollPreset,
  getHoverPreset,
  getEntrancePresetsByMood,
} from './animation-presets'

// Block Presets (NEW)
export {
  type BlockPreset,
  type BlockPresetId,
  type BlockPresetElement,
  type BlockLayoutOptions,
  BLOCK_PRESETS,
  getBlockPreset,
  getBlockPresetsByType,
  getBlockPresetsByTag,
  getBlockPresetsByMood,
  getAllBlockPresetIds,
} from './block-presets'

// Block Bindings (NEW)
export {
  type BlockDataBinding,
  BLOCK_BINDINGS,
  getBlockBindings,
  getRequiredPaths,
  validateBindings,
} from './block-bindings'
```

<template-output section="8.1">
index.ts 업데이트
</template-output>

</step>

---

<step n="9" goal="Validation and Type Check">

## 9.1 타입 체크 실행

<action>Run TypeScript compiler to verify no type errors</action>

```bash
npx tsc --noEmit
```

## 9.2 Import 검증

<action>Verify all exports are accessible from presets/index.ts</action>

```typescript
// Test file (temporary)
import {
  getBlockPreset,
  getBlockPresetsByType,
  getBlockBindings,
  validateBindings,
} from '@/lib/super-editor-v2/presets'

// Should compile without errors
const heroPresets = getBlockPresetsByType('hero')
const galleryBindings = getBlockBindings('gallery')
```

## 9.3 Checklist 검증

<action>Run validation checklist</action>
<invoke-task path="{installed_path}/checklist.md" />

</step>

---

<step n="10" goal="Generate AI Prompt Reference" optional="true">

## 10.1 AI 프롬프트용 참조 문서 생성

<action>Generate markdown reference for AI prompts</action>

```markdown
# Block Preset Reference for AI

## Available Block Types and Variants

### Hero Block
- `hero-minimal`: 미니멀 히어로 - Clean centered layout
- `hero-elegant`: 엘레건트 히어로 - Classic elegant style
- `hero-romantic`: 로맨틱 히어로 - Soft romantic feel

### Gallery Block
- `gallery-grid`: 그리드 갤러리 - 3-column grid layout
- `gallery-carousel`: 캐러셀 갤러리 - Swipeable carousel
- `gallery-masonry`: 메이슨리 갤러리 - Pinterest-style layout

...

## Usage in AI Generation

When generating blocks, reference presets by ID:
\`\`\`json
{
  "blockType": "gallery",
  "preset": "gallery-masonry",
  "animations": ["stagger-fade-up"]
}
\`\`\`
```

<template-output section="10.1">
AI 참조 문서 생성 (선택)
</template-output>

</step>

---

## Completion

<action>Report migration completion with summary</action>

### 마이그레이션 완료 요약

- [ ] block-presets.ts 생성됨
- [ ] block-bindings.ts 생성됨
- [ ] index.ts 업데이트됨
- [ ] 타입 체크 통과
- [ ] AI 참조 문서 생성 (선택)

### 생성된 파일

1. `src/lib/super-editor-v2/presets/block-presets.ts`
2. `src/lib/super-editor-v2/presets/block-bindings.ts`
3. `src/lib/super-editor-v2/presets/index.ts` (수정)

### 다음 단계

1. 기존 skeleton 소비자 업데이트 (점진적)
2. AI 생성 로직에 block preset 참조 추가
3. Editor UI에서 block variant 선택 기능 추가

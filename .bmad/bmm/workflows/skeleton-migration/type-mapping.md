# Skeleton → Block Preset Type Mapping Reference

이 문서는 v1 Skeleton 시스템에서 v2 Block Preset 시스템으로의 타입 매핑을 정의합니다.

---

## 1. Section Type → Block Type Mapping

| v1 SectionType | v2 BlockType | Notes |
|----------------|--------------|-------|
| `intro` | `hero` | 인트로 → 히어로 블록 |
| `greeting` | `greeting` | 동일 |
| `date` | `calendar` | 날짜 → 캘린더 블록 |
| `gallery` | `gallery` | 동일 |
| `venue` | `location` | 장소 → 위치 블록 |
| `parents` | `parents` | 동일 |
| `contact` | `contact` | 동일 |
| `accounts` | `account` | 계좌 정보 (단수형) |
| `guestbook` | `message` | 방명록 → 메시지 블록 |
| `music` | `music` | 동일 |
| `photobooth` | `guest-snap` | 포토부스 → 게스트 스냅 |
| `invitation` | `hero` | 초대장 → 히어로 변형 |
| `rsvp` | `rsvp` | 동일 |
| `notice` | `notice` | 동일 |

---

## 2. Interface Mapping

### 2.1 SkeletonVariant → BlockPreset

```typescript
// v1: SkeletonVariant
interface SkeletonVariant {
  id: string                    // → BlockPreset.variant
  name: string                  // → BlockPreset.name (English)
  description?: string          // → BlockPreset.description
  tags: string[]                // → BlockPreset.tags
  structure: SkeletonNode       // → BlockPreset.elements (transformed)
  slots: DataSlot[]             // → Extract to BlockBindings
  options?: {
    animations?: AnimationOption[]  // → BlockPreset.recommendedAnimations
    layouts?: LayoutOption[]        // → BlockPreset.layoutOptions
  }
}

// v2: BlockPreset
interface BlockPreset {
  id: string                    // `${blockType}-${variant}`
  blockType: BlockType
  variant: string
  name: string
  nameKo: string                // NEW: Korean name
  description: string
  tags: readonly string[]
  elements: BlockPresetElement[]
  bindings: readonly VariablePath[]
  recommendedAnimations?: readonly AnimationPresetId[]
  recommendedThemes?: readonly ThemePresetId[]  // NEW
  layoutOptions?: BlockLayoutOptions
  aiHints?: { mood, style, useCase }  // NEW: AI generation hints
}
```

### 2.2 DataSlot → BlockDataBinding

```typescript
// v1: DataSlot
interface DataSlot {
  id: string
  path: string                  // → BlockDataBinding.path
  type: 'text' | 'image' | ... // → BlockDataBinding.type
  required: boolean             // → BlockDataBinding.required
  description: string           // → BlockDataBinding.description
  defaultValue?: unknown        // → BlockDataBinding.defaultValue
}

// v2: BlockDataBinding
interface BlockDataBinding {
  path: VariablePath
  type: 'text' | 'image' | 'images' | 'date' | 'time' | 'location' | 'phone' | 'account' | 'select'
  required: boolean
  description: string
  descriptionKo: string         // NEW: Korean description
  defaultValue?: unknown
  validation?: {                // NEW: Validation rules
    minLength?: number
    maxLength?: number
    pattern?: string
  }
}
```

### 2.3 SkeletonNode → BlockPresetElement

```typescript
// v1: SkeletonNode (tree structure)
interface SkeletonNode {
  id: string
  type: PrimitiveType           // → BlockPresetElement.type (mapped)
  tokenStyle?: TokenStyleRef    // → BlockPresetElement.tokenStyle
  style?: Record<string, any>   // → Merged into tokenStyle
  props?: Record<string, any>   // → Extract binding, defaultContent
  children?: SkeletonNode[]     // → Flattened to array
}

// v2: BlockPresetElement (flat structure)
interface BlockPresetElement {
  type: 'text' | 'image' | 'shape' | 'button' | 'divider' | 'spacer' | 'container'
  role?: string                 // NEW: Semantic role
  position: { x: number; y: number }  // Calculated from tree
  size: { width: number; height: number }
  binding?: VariablePath
  defaultContent?: string
  tokenStyle?: Record<string, string>
}
```

---

## 3. Primitive Type Mapping

| v1 PrimitiveType | v2 Element Type | Notes |
|------------------|-----------------|-------|
| `text` | `text` | 텍스트 요소 |
| `heading` | `text` | role: 'heading' |
| `paragraph` | `text` | role: 'paragraph' |
| `image` | `image` | 이미지 요소 |
| `background-image` | `image` | role: 'background' |
| `box` | `container` | 컨테이너 |
| `flex` | `container` | role: 'flex' |
| `grid` | `container` | role: 'grid' |
| `divider` | `divider` | 구분선 |
| `spacer` | `spacer` | 여백 |
| `button` | `button` | 버튼 |
| `icon` | `shape` | 아이콘 → 도형 |

---

## 4. Token Style Mapping

### 4.1 v1 Token References → v2 Semantic Tokens

| v1 Token Path | v2 Semantic Token |
|---------------|-------------------|
| `$token.colors.background` | `--bg-page` |
| `$token.colors.surface` | `--bg-section` |
| `$token.colors.text.primary` | `--fg-default` |
| `$token.colors.text.secondary` | `--fg-muted` |
| `$token.colors.text.accent` | `--fg-emphasis` |
| `$token.colors.accent` | `--accent-default` |
| `$token.colors.border` | `--border-default` |
| `$token.typography.displayLg.fontFamily` | `var(--font-heading)` |
| `$token.typography.displayLg.fontSize` | `var(--text-4xl)` |
| `$token.typography.body.fontFamily` | `var(--font-body)` |
| `$token.typography.body.fontSize` | `var(--text-base)` |

### 4.2 Hardcoded Values → Token Fallbacks

```typescript
// v1: Hardcoded in skeleton
style: {
  fontSize: '42px',
  color: '#ffffff',
  fontWeight: 600
}

// v2: Use semantic tokens with fallbacks
tokenStyle: {
  fontSize: 'var(--text-4xl, 42px)',
  color: 'var(--fg-inverse, #ffffff)',
  fontWeight: 'var(--font-weight-semibold, 600)'
}
```

---

## 5. Animation Mapping

| v1 Animation Preset | v2 AnimationPresetId |
|--------------------|----------------------|
| `none` | (no animation) |
| `fade` | `fade-in` |
| `fade-in` | `fade-in` |
| `slide-up` | `slide-up` |
| `slide-in` | `slide-up` |
| `scale` | `scale-fade-in` |
| `stagger` | `stagger-fade-up` |
| `parallax` | `scroll-parallax` |

---

## 6. Tag Mapping

Design intent tags are preserved but normalized:

| v1 Tag | v2 Tag | Category |
|--------|--------|----------|
| `minimal` | `minimal` | Style |
| `simple` | `minimal` | Style (alias) |
| `elegant` | `elegant` | Style |
| `luxury` | `elegant` | Style (alias) |
| `romantic` | `romantic` | Mood |
| `soft` | `romantic` | Mood (alias) |
| `modern` | `modern` | Style |
| `contemporary` | `modern` | Style (alias) |
| `playful` | `playful` | Mood |
| `fun` | `playful` | Mood (alias) |
| `dramatic` | `dramatic` | Mood |
| `cinematic` | `cinematic` | Mood |

---

## 7. Transformation Functions

### 7.1 Section to Block Type

```typescript
function mapSectionToBlockType(sectionType: SectionType): BlockType {
  const mapping: Record<SectionType, BlockType> = {
    intro: 'hero',
    greeting: 'greeting',
    date: 'calendar',
    gallery: 'gallery',
    venue: 'location',
    parents: 'parents',
    contact: 'contact',
    accounts: 'account',
    guestbook: 'message',
    music: 'music',
    photobooth: 'guest-snap',
    invitation: 'hero',
    rsvp: 'rsvp',
    notice: 'notice',
  }
  return mapping[sectionType]
}
```

### 7.2 Variant ID Generation

```typescript
function generatePresetId(blockType: BlockType, variant: string): BlockPresetId {
  return `${blockType}-${variant}` as BlockPresetId
}

// Examples:
// 'hero' + 'minimal' → 'hero-minimal'
// 'gallery' + 'grid' → 'gallery-grid'
```

### 7.3 Tree to Flat Elements

```typescript
function flattenStructure(
  node: SkeletonNode,
  parentBounds: Rect = { x: 0, y: 0, width: 100, height: 100 }
): BlockPresetElement[] {
  const elements: BlockPresetElement[] = []

  // Convert current node
  const element = transformNode(node, parentBounds)
  if (element) {
    elements.push(element)
  }

  // Recursively process children
  if (node.children) {
    const childBounds = calculateChildBounds(node, parentBounds)
    for (const child of node.children) {
      elements.push(...flattenStructure(child, childBounds))
    }
  }

  return elements
}
```

---

## 8. Example Transformation

### Input (v1 Skeleton)

```typescript
// skeletons/sections/greeting.ts
export const greetingSkeleton: SectionSkeleton = {
  sectionType: 'greeting',
  name: '인사말',
  variants: [
    {
      id: 'simple',
      name: '심플',
      tags: ['minimal', 'clean'],
      structure: {
        id: 'root',
        type: 'box',
        children: [
          {
            id: 'title',
            type: 'heading',
            props: { text: '{{greeting.title}}' },
            tokenStyle: { fontSize: '$token.typography.displayMd.fontSize' }
          },
          {
            id: 'content',
            type: 'paragraph',
            props: { text: '{{greeting.content}}' },
          }
        ]
      },
      slots: [
        { id: 'title', path: 'greeting.title', type: 'text', required: false },
        { id: 'content', path: 'greeting.content', type: 'text', required: false }
      ]
    }
  ]
}
```

### Output (v2 BlockPreset)

```typescript
// presets/block-presets.ts
const GREETING_PRESETS: Record<GreetingPresetId, BlockPreset> = {
  'greeting-simple': {
    id: 'greeting-simple',
    blockType: 'greeting',
    variant: 'simple',
    name: 'Simple Greeting',
    nameKo: '심플',
    description: 'Clean, minimal greeting section',
    tags: ['minimal', 'clean'],
    elements: [
      {
        type: 'text',
        role: 'heading',
        position: { x: 50, y: 30 },
        size: { width: 80, height: 15 },
        binding: 'greeting.title',
        defaultContent: '저희 결혼합니다',
        tokenStyle: { fontSize: 'var(--text-2xl)' }
      },
      {
        type: 'text',
        role: 'paragraph',
        position: { x: 50, y: 55 },
        size: { width: 80, height: 30 },
        binding: 'greeting.content',
      }
    ],
    bindings: ['greeting.title', 'greeting.content'],
    recommendedAnimations: ['fade-in'],
    recommendedThemes: ['minimal-light', 'classic-ivory'],
  }
}
```

---

## 9. Migration Checklist per Section

각 섹션 마이그레이션 시 체크:

- [ ] SectionType → BlockType 매핑 확인
- [ ] 모든 variants 추출
- [ ] 각 variant의 tags 보존
- [ ] structure → elements 변환
- [ ] slots → bindings 추출
- [ ] animations → recommendedAnimations 매핑
- [ ] Korean names (nameKo) 추가
- [ ] AI hints 추가 (선택)

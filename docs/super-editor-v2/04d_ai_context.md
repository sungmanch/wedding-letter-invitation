# Super Editor v2 - AI 프롬프트 컨텍스트

> **목표**: AI 프롬프트 처리 및 컨텍스트 압축
> **핵심 원칙**: 토큰 효율성 + ID 참조 시스템

---

## 1. 추천 프롬프트

```typescript
const PROMPT_SUGGESTIONS: Record<BlockType | 'global', string[]> = {
  hero: [
    '이름을 더 크게 해줘',
    '배경을 더 어둡게',
    '날짜를 아래쪽으로 옮겨줘',
    '영화 같은 느낌으로 바꿔줘',
  ],
  gallery: [
    '사진을 그리드로 배치해줘',
    '슬라이드 형식으로 바꿔줘',
    '사진에 테두리 추가해줘',
  ],
  venue: [
    '지도를 더 크게',
    '주차 안내 추가해줘',
    '교통편 정보 보여줘',
  ],
  greeting: [
    '인사말을 더 길게',
    '폰트를 우아하게',
    '문단 간격 넓혀줘',
  ],
  // ...
  global: [
    '전체적으로 따뜻한 느낌으로',
    '모던한 스타일로 바꿔줘',
    '애니메이션 추가해줘',
  ],
}

function PromptSuggestions({
  blockType,
  onSelect,
}: {
  blockType: BlockType | null
  onSelect: (prompt: string) => void
}) {
  const suggestions = blockType
    ? PROMPT_SUGGESTIONS[blockType] || PROMPT_SUGGESTIONS.global
    : PROMPT_SUGGESTIONS.global

  return (
    <div className="prompt-suggestions">
      {suggestions.slice(0, 3).map((suggestion, i) => (
        <button
          key={i}
          onClick={() => onSelect(suggestion)}
          className="suggestion-chip"
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}
```

---

## 2. ID 참조 파싱

AI 프롬프트에서 `#id` 형식으로 특정 요소를 참조할 수 있습니다.

```typescript
/**
 * 프롬프트에서 #id 참조 추출
 * 예: "#groom-name 텍스트를 더 크게 해줘" → ['groom-name']
 */
function parsePromptReferences(prompt: string): {
  references: string[]
  cleanPrompt: string
} {
  const idPattern = /#([\w-]+)/g
  const references: string[] = []

  let match
  while ((match = idPattern.exec(prompt)) !== null) {
    references.push(match[1])
  }

  return {
    references,
    cleanPrompt: prompt, // ID는 유지 (AI가 이해)
  }
}

/**
 * AI 컨텍스트에 참조된 요소 정보 추가
 */
function buildAIContextWithReferences(
  document: EditorDocument,
  prompt: string,
  selectedBlockId: string | null,
  selectedElementId: string | null,
): AIContext {
  const { references } = parsePromptReferences(prompt)

  // 참조된 요소들 찾기
  const referencedElements = references
    .map(ref => findElementByDisplayId(document, ref))
    .filter((result): result is { element: Element; block: Block } => result !== null)

  // 요소가 선택되면 더 좁은 컨텍스트
  if (selectedElementId) {
    const result = findElementById(document, selectedElementId)
    if (result) {
      return {
        scope: 'element',
        selectedElement: result.element,
        parentBlock: { id: result.block.id, type: result.block.type },
        referencedElements: referencedElements.map(({ element, block }) => ({
          id: element.id,
          displayId: getDisplayId(element, block),
          type: element.type,
          binding: element.binding,
          currentStyle: element.style,
          position: { x: element.x, y: element.y },
        })),
      }
    }
  }

  // 블록 선택 시
  if (selectedBlockId) {
    const selectedBlock = document.blocks.find(b => b.id === selectedBlockId)
    return {
      scope: 'block',
      selectedBlock,
      referencedElements: referencedElements.map(({ element, block }) => ({
        id: element.id,
        displayId: getDisplayId(element, block),
        type: element.type,
        binding: element.binding,
        currentStyle: element.style,
        position: { x: element.x, y: element.y },
      })),
      // ...기존 컨텍스트
    }
  }

  // 전체 문서
  return {
    scope: 'document',
    referencedElements: referencedElements.map(({ element, block }) => ({
      id: element.id,
      displayId: getDisplayId(element, block),
      type: element.type,
      binding: element.binding,
      currentStyle: element.style,
      position: { x: element.x, y: element.y },
    })),
    // ...
  }
}
```

### 2.1 ID 참조 사용 예시

```
사용자 프롬프트:
"#groom-name과 #bride-name을 세로로 배치하고, #wedding-date는 아래쪽에 작게"

→ parsePromptReferences 결과:
{
  references: ['groom-name', 'bride-name', 'wedding-date'],
  cleanPrompt: "#groom-name과 #bride-name을 세로로 배치하고, #wedding-date는 아래쪽에 작게"
}

→ AI 컨텍스트에 추가:
{
  referencedElements: [
    { displayId: 'groom-name', type: 'text', binding: 'groom.name', position: { x: 30, y: 45 } },
    { displayId: 'bride-name', type: 'text', binding: 'bride.name', position: { x: 70, y: 45 } },
    { displayId: 'wedding-date', type: 'text', binding: 'wedding.dateDisplay', position: { x: 50, y: 60 } }
  ]
}

→ AI가 정확히 해당 요소들만 수정
```

---

## 3. 프롬프트 컨텍스트 압축

### 3.1 문제 정의

- 블록이 많아지면 전체 문서 JSON이 커져서 토큰 한도 초과
- 불필요한 정보가 AI 응답 품질 저하

### 3.2 압축 전략

| 대상 | 압축 방식 | 포함 정보 |
|------|----------|----------|
| **선택된 블록** | Full JSON | 모든 elements, animation, style |
| **다른 블록** | 요약 | id, type, elementCount, enabled |
| **전역 스타일** | 참조 | `$ref: 'document.style'` |
| **WeddingData** | 선택적 | 선택 블록이 참조하는 변수만 |

### 3.3 컨텍스트 빌더

```typescript
interface AIContext {
  // 선택된 블록 (full)
  selectedBlock: Block

  // 다른 블록 요약
  otherBlocks: BlockSummary[]

  // 참조된 데이터만
  relevantData: Partial<WeddingData>

  // 전역 스타일 (참조)
  styleRef: string

  // 메타 정보
  meta: {
    totalBlocks: number
    documentId: string
  }
}

interface BlockSummary {
  id: string
  type: BlockType
  enabled: boolean
  elementCount: number
  bindings: string[]  // 사용 중인 변수 목록
}

function buildAIContext(
  document: EditorDocument,
  selectedBlockId: string
): AIContext {
  const selectedBlock = document.blocks.find(b => b.id === selectedBlockId)!

  // 선택된 블록이 참조하는 변수 추출
  const referencedVariables = extractBoundVariables(selectedBlock.elements)

  // 해당 변수만 data에서 추출
  const relevantData = pickByPaths(document.data, referencedVariables)

  // 다른 블록 요약
  const otherBlocks: BlockSummary[] = document.blocks
    .filter(b => b.id !== selectedBlockId)
    .map(b => ({
      id: b.id,
      type: b.type,
      enabled: b.enabled,
      elementCount: b.elements.length,
      bindings: extractBoundVariables(b.elements),
    }))

  return {
    selectedBlock,
    otherBlocks,
    relevantData,
    styleRef: '$document.style',
    meta: {
      totalBlocks: document.blocks.length,
      documentId: document.id,
    },
  }
}
```

### 3.4 컨텍스트 크기 목표

| 항목 | 목표 토큰 |
|------|----------|
| 선택된 블록 full JSON | ~1,500 |
| 다른 블록 요약 | ~300 |
| 관련 WeddingData | ~200 |
| 시스템 프롬프트 | ~500 |
| **총합** | ~2,500 (여유 포함) |

### 3.5 압축된 프롬프트 예시

```json
{
  "context": {
    "selectedBlock": {
      "id": "block-hero",
      "type": "hero",
      "enabled": true,
      "height": 100,
      "elements": [
        { "id": "elem-bg", "type": "image", "binding": "photos.main", "..." : "..." },
        { "id": "elem-groom", "type": "text", "binding": "groom.name", "..." : "..." },
        { "id": "elem-bride", "type": "text", "binding": "bride.name", "..." : "..." },
        { "id": "elem-date", "type": "text", "binding": "wedding.dateDisplay", "..." : "..." }
      ],
      "animation": { "..." : "..." }
    },
    "otherBlocks": [
      { "id": "block-greeting", "type": "greeting", "enabled": true, "elementCount": 2 },
      { "id": "block-gallery", "type": "gallery", "enabled": true, "elementCount": 5 },
      { "id": "block-venue", "type": "venue", "enabled": true, "elementCount": 4 }
    ],
    "relevantData": {
      "groom": { "name": "김철수" },
      "bride": { "name": "이영희" },
      "wedding": { "dateDisplay": "2025년 3월 15일 토요일 오후 2시" },
      "photos": { "main": { "url": "https://..." } }
    },
    "styleRef": "$document.style"
  },
  "userPrompt": "이름을 세로로 배치해줘"
}
```

---

## 4. AI 스타일 컨텍스트 압축

스타일 시스템은 전체를 AI에 전달하면 토큰 낭비가 심함. 압축 전략을 사용.

```typescript
interface CompressedStyleContext {
  // 현재 활성 레벨만 포함
  activeLevel: 'preset' | 'quick' | 'advanced'

  // 레벨별 요약
  summary: {
    preset?: string           // 'classic-gold'
    quickOverrides?: string[] // ['dominantColor', 'mood:warm']
    advancedOverrides?: string[] // ['palette[2]', 'tokens.accent-default']
  }

  // 현재 해석된 값 (읽기 전용)
  resolved: {
    dominantColor: string
    accentColor: string
    textColor: string
    mood: string
    contrastLevel: string
  }

  // 사진 팔레트 (있는 경우)
  extractedPalette?: {
    colors: string[]          // hex 배열만
    mapping: string           // 'dominant:0, accent:2, text:auto'
  }
}

function compressStyleContext(style: StyleSystem): CompressedStyleContext {
  const resolved = resolveStyleSystem(style)

  // 활성 레벨 판단
  let activeLevel: 'preset' | 'quick' | 'advanced' = 'preset'
  if (style.advanced) activeLevel = 'advanced'
  else if (style.quick) activeLevel = 'quick'

  // 요약 생성
  const summary: CompressedStyleContext['summary'] = {}

  if (style.preset) {
    summary.preset = style.preset
  }

  if (style.quick) {
    const overrides: string[] = []
    if (style.quick.dominantColor) overrides.push('dominantColor')
    if (style.quick.accentColor) overrides.push('accentColor')
    if (style.quick.mood) overrides.push(`mood:${style.quick.mood}`)
    if (style.quick.photoExtraction?.enabled) overrides.push('photoExtraction')
    summary.quickOverrides = overrides
  }

  return {
    activeLevel,
    summary,
    resolved: {
      dominantColor: resolved.tokens['bg-page'],
      accentColor: resolved.tokens['accent-default'],
      textColor: resolved.tokens['fg-default'],
      mood: detectMood(resolved),
      contrastLevel: detectContrastLevel(resolved),
    },
    extractedPalette: style.quick?.photoExtraction?.enabled
      ? {
          colors: resolved.extractedPalette?.colors.map(c => c.hex) || [],
          mapping: `dominant:${resolved.extractedPalette?.mappedRoles.dominant}, accent:${resolved.extractedPalette?.mappedRoles.emphasis}`,
        }
      : undefined,
  }
}
```

### 4.1 컨텍스트 크기 비교

| 전략 | 토큰 수 | 정보량 | 적합한 상황 |
|------|---------|--------|-------------|
| 전체 JSON | ~2,000 | 100% | 초기 생성 |
| 압축 요약 | ~300 | 70% | 일반 수정 |
| 델타 기반 | ~100 | 30% | 연속 수정 |
| 의도 기반 | ~200 | 80% | AI 생성 |

---

## 5. 관련 문서

| 문서 | 내용 |
|------|------|
| [04a_layout_tabs.md](./04a_layout_tabs.md) | 에디터 레이아웃 |
| [04c_direct_editing.md](./04c_direct_editing.md) | 요소 ID 시스템 |
| [02b_state_machine.md](./02b_state_machine.md) | AI 통합 컨텍스트 |

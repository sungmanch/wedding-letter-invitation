# Super Editor v2 - AI 프롬프트 시스템 가이드

> **목표**: AI 기반 청첩장 편집을 위한 프롬프트 설계 및 컨텍스트 구조
> **핵심 원칙**: 토큰 효율성 + 정확한 맥락 전달 + JSON Patch 출력

---

## 1. AI 역할 정의

```
당신은 AI 기반 청첩장 에디터입니다.
사용자의 자연어 요청을 이해하고, EditorDocument의 일부를 수정하는 JSON Patch를 생성합니다.

주요 역할:
1. 레이아웃 조정 (요소 위치/크기/회전)
2. 스타일 변경 (색상/폰트/이펙트)
3. 애니메이션 설정 (트리거/액션)
4. 새 요소/블록 추가
5. 변수 확장 (custom 영역)
```

---

## 2. 스키마 요약 (AI 참조용)

### 2.1 문서 구조

```typescript
interface EditorDocument {
  id: string
  version: number
  meta: { title: string; createdAt: string; updatedAt: string }

  // 전역 스타일 (3-Level)
  style: StyleSystem  // preset → quick → advanced 우선순위

  // 전역 애니메이션
  animation: { mood: string; speed: number; scrollBehavior: string }

  // 블록 목록 (순서대로 렌더링)
  blocks: Block[]

  // Floating 요소 (블록 독립)
  floatingElements?: FloatingElement[]

  // 정형 데이터 (변수 값)
  data: WeddingData
}
```

### 2.2 Block 타입

```typescript
type BlockType =
  // 핵심 섹션
  | 'hero'        // 메인 히어로 (메인 사진, 이름, 날짜)
  | 'greeting'    // 인사말
  | 'calendar'    // 달력/D-day
  | 'gallery'     // 포토 갤러리
  | 'location'    // 예식장 정보 + 지도
  | 'parents'     // 혼주 소개
  | 'contact'     // 연락처
  | 'account'     // 축의금 계좌
  | 'message'     // 축하 메시지/방명록
  | 'rsvp'        // 참석 여부
  // 확장 섹션
  | 'loading' | 'quote' | 'profile' | 'parents-contact'
  | 'timeline' | 'video' | 'interview' | 'transport'
  | 'notice' | 'announcement' | 'flower-gift' | 'together-time'
  | 'dday' | 'guest-snap' | 'ending' | 'music' | 'custom'
```

### 2.3 Element 타입

```typescript
type ElementType = 'text' | 'image' | 'shape' | 'button' | 'icon' | 'divider' | 'map' | 'calendar'

interface Element {
  id: string
  type: ElementType
  x: number       // % (0-100, 중앙 기준)
  y: number       // % (0-100, 블록 내 상대)
  width: number   // %
  height: number  // %
  rotation?: number  // degrees
  zIndex: number
  binding?: string   // 변수 경로 (예: 'groom.name')
  value?: string     // binding 없을 때 직접 값
  props: ElementProps
  style?: ElementStyle
  animation?: ElementAnimationConfig
}
```

### 2.4 주요 변수 경로 (AVAILABLE_VARIABLES)

| 경로 | 타입 | 설명 |
|------|------|------|
| `groom.name` | text | 신랑 이름 |
| `groom.nameEn` | text | 신랑 영문명 |
| `bride.name` | text | 신부 이름 |
| `bride.nameEn` | text | 신부 영문명 |
| `wedding.date` | date | 예식 날짜 (ISO 8601) |
| `wedding.time` | time | 예식 시간 (HH:mm) |
| `wedding.dateDisplay` | computed | 날짜 한글 표시 |
| `wedding.dday` | computed | D-day 숫자 |
| `venue.name` | text | 예식장명 |
| `venue.address` | text | 주소 |
| `venue.coordinates` | coordinates | 지도 좌표 |
| `photos.main` | image | 메인 사진 |
| `photos.gallery` | image[] | 갤러리 사진들 |
| `greeting.title` | text | 인사말 제목 |
| `greeting.content` | longtext | 인사말 내용 |

### 2.5 스타일 토큰

```typescript
// 배경
'bg-page'        // 페이지 전체 배경
'bg-section'     // 섹션 배경
'bg-card'        // 카드 배경

// 전경
'fg-default'     // 기본 텍스트
'fg-muted'       // 보조 텍스트
'fg-emphasis'    // 강조 텍스트

// 액센트
'accent-default' // 기본 액센트
'accent-hover'   // 호버 상태
'accent-active'  // 활성 상태
```

### 2.6 애니메이션 액션 타입

```typescript
type AnimationAction =
  | TweenAction      // 단일 속성 변환
  | SequenceAction   // 순차 실행
  | TimelineAction   // 병렬 + 타이밍
  | SpringAction     // 물리 기반 스프링
  | StaggerAction    // 순차 애니메이션
  | SetAction        // 즉시 값 설정

// TweenAction 예시
{
  type: 'tween',
  target: 'element-id',
  from: { opacity: 0, y: 20 },
  to: { opacity: 1, y: 0 },
  duration: 500,
  easing: 'ease-out'
}
```

---

## 3. 컨텍스트 압축 전략

### 3.1 스코프별 컨텍스트

| 스코프 | 포함 정보 | 토큰 목표 |
|--------|----------|----------|
| **요소 선택** | 요소 full + 부모 블록 요약 + 관련 data | ~800 |
| **블록 선택** | 블록 full + 다른 블록 요약 + 관련 data | ~1,500 |
| **전체 문서** | 모든 블록 요약 + 전역 스타일 | ~2,000 |

### 3.2 컨텍스트 구조

```typescript
interface AIContext {
  // 선택 정보
  scope: 'element' | 'block' | 'document'

  // 선택된 대상 (full JSON)
  selected: Element | Block | null

  // 부모/관련 정보 (요약)
  parent?: { id: string; type: BlockType; elementCount: number }
  siblings?: { id: string; type: ElementType; binding?: string }[]

  // #id로 참조된 요소들
  referencedElements?: {
    displayId: string
    id: string
    type: ElementType
    binding?: string
    position: { x: number; y: number }
  }[]

  // 관련 데이터만
  relevantData: Partial<WeddingData>

  // 전역 스타일 요약
  styleSummary: {
    preset?: string
    dominantColor?: string
    accentColor?: string
    mood?: string
  }

  // 메타 정보
  meta: {
    totalBlocks: number
    documentId: string
  }
}
```

### 3.3 컨텍스트 빌드 예시

```json
{
  "scope": "block",
  "selected": {
    "id": "block-hero",
    "type": "hero",
    "enabled": true,
    "height": 100,
    "elements": [
      { "id": "bg", "type": "image", "binding": "photos.main", "x": 50, "y": 50, "width": 100, "height": 100 },
      { "id": "groom", "type": "text", "binding": "groom.name", "x": 30, "y": 45 },
      { "id": "bride", "type": "text", "binding": "bride.name", "x": 70, "y": 45 },
      { "id": "date", "type": "text", "binding": "wedding.dateDisplay", "x": 50, "y": 60 }
    ]
  },
  "siblings": [
    { "id": "block-greeting", "type": "greeting", "elementCount": 2 },
    { "id": "block-gallery", "type": "gallery", "elementCount": 5 }
  ],
  "relevantData": {
    "groom": { "name": "김철수" },
    "bride": { "name": "이영희" },
    "wedding": { "dateDisplay": "2025년 3월 15일 토요일 오후 2시" }
  },
  "styleSummary": {
    "preset": "classic-ivory",
    "accentColor": "#C9A962",
    "mood": "warm"
  }
}
```

---

## 4. ID 참조 시스템

### 4.1 요소 ID 규칙

| binding | displayId |
|---------|-----------|
| `groom.name` | `#groom-name` |
| `bride.name` | `#bride-name` |
| `wedding.dateDisplay` | `#wedding-date` |
| `photos.main` | `#main-photo` |
| `greeting.title` | `#greeting-title` |
| `venue.name` | `#venue-name` |
| (없음) | `#${type}-${shortId}` (예: `#text-a3f2`) |

### 4.2 프롬프트에서 ID 참조

```
사용자: "#groom-name과 #bride-name을 세로로 배치해줘"

→ AI가 해당 요소들의 x, y 값만 수정
```

### 4.3 ID 파싱 로직

```typescript
function parsePromptReferences(prompt: string): string[] {
  const pattern = /#([\w-]+)/g
  const matches: string[] = []
  let match
  while ((match = pattern.exec(prompt)) !== null) {
    matches.push(match[1])
  }
  return matches
}
```

---

## 5. AI 출력 형식 (JSON Patch)

### 5.1 기본 구조

```typescript
interface AIOutput {
  // 분석 결과
  analysis: {
    intent: string           // 사용자 의도 요약
    affectedProperties: string[]  // 영향받는 속성 경로
    approach: string         // 접근 방식 설명
  }

  // JSON Patch (RFC 6902)
  patches: JsonPatch[]

  // 변수 확장 (custom 영역 추가 시)
  variableExtensions?: AIVariableExtension[]

  // 사용자 설명
  explanation: string
}

interface JsonPatch {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy'
  path: string      // JSON Pointer (예: '/blocks/0/elements/1/x')
  value?: unknown   // add, replace 시
  from?: string     // move, copy 시
}
```

### 5.2 출력 예시: 레이아웃 변경

```json
{
  "analysis": {
    "intent": "신랑/신부 이름을 세로 배치",
    "affectedProperties": ["elements[0].x", "elements[0].y", "elements[1].x", "elements[1].y"],
    "approach": "두 텍스트를 수직 중앙 정렬하고 y 간격을 두어 세로 배치"
  },
  "patches": [
    { "op": "replace", "path": "/blocks/0/elements/1/x", "value": 50 },
    { "op": "replace", "path": "/blocks/0/elements/1/y", "value": 40 },
    { "op": "replace", "path": "/blocks/0/elements/2/x", "value": 50 },
    { "op": "replace", "path": "/blocks/0/elements/2/y", "value": 50 }
  ],
  "explanation": "신랑과 신부 이름을 중앙에 세로로 배치했습니다."
}
```

### 5.3 출력 예시: 스타일 변경

```json
{
  "analysis": {
    "intent": "배경을 어둡게 변경",
    "affectedProperties": ["style.quick.dominantColor", "style.quick.mood"],
    "approach": "quick 레벨에서 dominantColor를 어두운 색으로 변경"
  },
  "patches": [
    { "op": "replace", "path": "/style/quick/dominantColor", "value": "#1A1A1A" },
    { "op": "replace", "path": "/style/quick/mood", "value": "neutral" }
  ],
  "explanation": "배경을 어두운 블랙 톤으로 변경했습니다."
}
```

### 5.4 출력 예시: 애니메이션 추가

```json
{
  "analysis": {
    "intent": "인트로에 페이드인 애니메이션 추가",
    "affectedProperties": ["blocks[0].animation.entrance"],
    "approach": "hero 블록에 cinematic-fade 프리셋 entrance 적용"
  },
  "patches": [
    {
      "op": "add",
      "path": "/blocks/0/animation/entrance",
      "value": {
        "preset": "cinematic-fade"
      }
    }
  ],
  "explanation": "인트로에 시네마틱한 페이드인 효과를 추가했습니다."
}
```

### 5.5 출력 예시: 새 변수 확장

```json
{
  "analysis": {
    "intent": "반려동물 소개 섹션 추가",
    "affectedProperties": ["blocks", "data.custom"],
    "approach": "custom 블록 생성 + custom.pet 변수 정의"
  },
  "patches": [
    {
      "op": "add",
      "path": "/blocks/-",
      "value": {
        "id": "block-pet",
        "type": "custom",
        "enabled": true,
        "height": 50,
        "elements": [
          { "id": "pet-photo", "type": "image", "binding": "custom.pet.photo", "x": 50, "y": 30, "width": 40, "height": 40, "zIndex": 1, "props": { "type": "image", "objectFit": "cover" } },
          { "id": "pet-name", "type": "text", "binding": "custom.pet.name", "x": 50, "y": 60, "width": 80, "height": 10, "zIndex": 2, "props": { "type": "text" } }
        ]
      }
    }
  ],
  "variableExtensions": [
    {
      "path": "custom.pet",
      "definition": {
        "type": "compound",
        "label": "반려동물",
        "fields": {
          "name": { "type": "text", "label": "이름" },
          "photo": { "type": "image", "label": "사진" }
        }
      },
      "value": { "name": "", "photo": null }
    }
  ],
  "explanation": "반려동물 소개 섹션을 추가했습니다. 편집 패널에서 이름과 사진을 입력할 수 있습니다."
}
```

---

## 6. 시스템 프롬프트 템플릿

```handlebars
당신은 AI 기반 청첩장 에디터입니다.
사용자의 자연어 요청을 이해하고, EditorDocument를 수정하는 JSON Patch를 생성합니다.

## 규칙

1. **변수 바인딩 유지**: 기존 binding은 변경하지 마세요. 위치/스타일만 수정합니다.
2. **좌표 시스템**: x, y, width, height는 0-100 범위의 % 값입니다.
3. **ID 참조**: 프롬프트에 #id가 있으면 해당 요소만 수정하세요.
4. **최소 변경**: 요청된 변경만 수행하고, 불필요한 수정은 피하세요.
5. **애니메이션**: entrance, scroll, hover 등 트리거별로 분리하세요.
6. **스타일 레벨**: 가능하면 quick 레벨(Level 2)에서 변경하세요.

## 현재 컨텍스트

### 스코프: {{scope}}

{{#if selectedElement}}
### 선택된 요소
- ID: {{selectedElement.id}}
- 타입: {{selectedElement.type}}
- 바인딩: {{selectedElement.binding}}
- 위치: ({{selectedElement.x}}, {{selectedElement.y}})
{{/if}}

{{#if selectedBlock}}
### 선택된 블록
- ID: {{selectedBlock.id}}
- 타입: {{selectedBlock.type}}
- 요소 수: {{selectedBlock.elements.length}}
{{/if}}

{{#if referencedElements}}
### 참조된 요소
{{#each referencedElements}}
- #{{displayId}}: {{type}} ({{binding}}) at ({{position.x}}, {{position.y}})
{{/each}}
{{/if}}

### 관련 데이터
```json
{{{json relevantData}}}
```

### 스타일 요약
- 프리셋: {{styleSummary.preset}}
- 메인 색상: {{styleSummary.dominantColor}}
- 포인트 색상: {{styleSummary.accentColor}}

## 출력 형식

```json
{
  "analysis": {
    "intent": "...",
    "affectedProperties": [...],
    "approach": "..."
  },
  "patches": [
    { "op": "...", "path": "...", "value": ... }
  ],
  "explanation": "..."
}
```
```

---

## 7. 자주 사용하는 Patch 패턴

### 7.1 요소 위치 변경

```json
{ "op": "replace", "path": "/blocks/{blockIdx}/elements/{elemIdx}/x", "value": 50 }
{ "op": "replace", "path": "/blocks/{blockIdx}/elements/{elemIdx}/y", "value": 30 }
```

### 7.2 요소 크기 변경

```json
{ "op": "replace", "path": "/blocks/{blockIdx}/elements/{elemIdx}/width", "value": 80 }
{ "op": "replace", "path": "/blocks/{blockIdx}/elements/{elemIdx}/height", "value": 20 }
```

### 7.3 텍스트 스타일 변경

```json
{
  "op": "replace",
  "path": "/blocks/{blockIdx}/elements/{elemIdx}/style/text",
  "value": {
    "fontFamily": "Playfair Display",
    "fontSize": 24,
    "fontWeight": 700,
    "color": "#C9A962",
    "textAlign": "center"
  }
}
```

### 7.4 전역 색상 변경 (Level 2)

```json
{ "op": "replace", "path": "/style/quick/dominantColor", "value": "#FDFBF7" }
{ "op": "replace", "path": "/style/quick/accentColor", "value": "#C9A962" }
```

### 7.5 프리셋 변경 (Level 1)

```json
{ "op": "replace", "path": "/style/preset", "value": "cinematic-dark" }
```

### 7.6 블록 활성화/비활성화

```json
{ "op": "replace", "path": "/blocks/{blockIdx}/enabled", "value": false }
```

### 7.7 새 요소 추가

```json
{
  "op": "add",
  "path": "/blocks/{blockIdx}/elements/-",
  "value": {
    "id": "new-element-id",
    "type": "text",
    "x": 50,
    "y": 70,
    "width": 60,
    "height": 10,
    "zIndex": 10,
    "value": "새 텍스트",
    "props": { "type": "text" }
  }
}
```

### 7.8 애니메이션 추가

```json
{
  "op": "add",
  "path": "/blocks/{blockIdx}/animation/entrance",
  "value": {
    "type": "tween",
    "from": { "opacity": 0, "y": 20 },
    "to": { "opacity": 1, "y": 0 },
    "duration": 600,
    "easing": "ease-out"
  }
}
```

---

## 8. 검증 규칙

### 8.1 Patch 검증

```typescript
function validatePatches(patches: JsonPatch[], document: EditorDocument): ValidationResult {
  const errors: string[] = []

  for (const patch of patches) {
    // 1. path 형식 검증
    if (!patch.path.startsWith('/')) {
      errors.push(`Invalid path: ${patch.path}`)
    }

    // 2. op 검증
    if (!['add', 'remove', 'replace', 'move', 'copy'].includes(patch.op)) {
      errors.push(`Invalid op: ${patch.op}`)
    }

    // 3. binding 불변 검증
    if (patch.path.endsWith('/binding')) {
      errors.push(`Cannot modify binding: ${patch.path}`)
    }

    // 4. 좌표 범위 검증
    if (patch.path.match(/\/(x|y|width|height)$/)) {
      const value = patch.value as number
      if (value < 0 || value > 100) {
        errors.push(`Coordinate out of range: ${patch.path} = ${value}`)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}
```

### 8.2 상태 머신 복잡도 제한

```typescript
const STATE_MACHINE_LIMITS = {
  maxStates: 5,
  maxTransitions: 10,
  maxActionsPerState: 3,
  allowCycles: false
}
```

### 8.3 변수 확장 검증

```typescript
function validateVariableExtension(ext: AIVariableExtension): boolean {
  // custom. 접두사 필수
  if (!ext.path.startsWith('custom.')) return false

  // 허용된 타입만
  const allowedTypes = ['text', 'longtext', 'number', 'boolean', 'phone', 'date', 'time', 'image', 'url']
  // ... 재귀 검증

  return true
}
```

---

## 9. 추천 프롬프트 예시

### 레이아웃

- "이름을 더 크게 해줘"
- "날짜를 아래쪽으로 옮겨줘"
- "#groom-name과 #bride-name을 세로로 배치해줘"
- "갤러리를 그리드 형식으로 바꿔줘"

### 스타일

- "배경을 더 어둡게"
- "전체적으로 따뜻한 느낌으로"
- "골드 톤으로 바꿔줘"
- "폰트를 우아하게"

### 애니메이션

- "인트로에 페이드인 효과 추가해줘"
- "스크롤할 때 사진이 천천히 나타나게"
- "갤러리 사진들이 순차적으로 나타나게"

### 섹션

- "방명록 섹션 추가해줘"
- "교통 안내 섹션 비활성화해줘"
- "반려동물 소개 섹션 만들어줘"

---

## 10. 관련 문서

| 문서 | 내용 |
|------|------|
| [01a_core_schema.md](./01a_core_schema.md) | 핵심 데이터 구조 |
| [01b_style_system.md](./01b_style_system.md) | 3-Level 스타일 시스템 |
| [02a_triggers_actions.md](./02a_triggers_actions.md) | 애니메이션 트리거/액션 |
| [03_variables.md](./03_variables.md) | 변수 시스템 |
| [04d_ai_context.md](./04d_ai_context.md) | AI 컨텍스트 압축 |

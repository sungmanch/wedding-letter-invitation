# Super Editor v2 - AI 워크플로우 문서

## 개요

SE2에서 사용자가 프롬프트를 입력하면 AI가 청첩장 데이터를 생성/수정하는 전체 흐름을 설명합니다.

---

## 워크플로우 다이어그램

### 메인 플로우: Landing에서 바로 생성

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SE2 AI 워크플로우 (Landing → Editor)                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐    ┌───────────────┐    ┌──────────────────┐
│ Landing          │───▶│ 로그인 체크    │───▶│ sessionStorage   │
│ (PromptHero      │    │ (비로그인 시   │    │ 에 입력값 저장   │
│  Landing.tsx)    │    │  로그인 유도)  │    │                  │
└──────────────────┘    └───────────────┘    └──────────────────┘
       │                                              │
       │ 프롬프트 입력                                 │ 로그인 완료 후
       │ + 레퍼런스 분석 (선택)                        │
       ▼                                              ▼
┌──────────────────┐    ┌───────────────┐    ┌──────────────────┐
│ POST /api/       │───▶│ createDocument│───▶│ DB Insert        │
│ landing/generate │    │ (Server Act.) │    │ (빈 문서 생성)    │
└──────────────────┘    └───────────────┘    └──────────────────┘
       │                                              │
       │                                              ▼
       │                                     ┌──────────────────┐
       │                                     │ POST /api/       │
       │                                     │ super-editor-v2  │
       │                                     │ /ai (generate)   │
       │                                     └──────────────────┘
       │                                              │
       ▼                                              ▼
┌──────────────────┐    ┌───────────────┐    ┌──────────────────┐
│ Redirect         │◀───│ applyPatches()│◀───│ Gemini API       │
│ /se2/[id]/edit   │    │ (JSON Patch)  │    │ (AI 생성)        │
└──────────────────┘    └───────────────┘    └──────────────────┘
```

### 레퍼런스 분석 플로우 (선택)

```
┌──────────────────┐    ┌───────────────┐    ┌──────────────────┐
│ 이미지/URL 입력   │───▶│ POST /api/    │───▶│ Gemini Vision    │
│ (ReferenceInput) │    │ super-editor  │    │ 이미지 분석      │
│                  │    │ -v2/analyze   │    │                  │
│ - URL 입력       │    │ -reference    │    │ mood, colors,    │
│ - 이미지 업로드   │    │               │    │ typography,      │
│                  │    │               │    │ layout, keywords │
└──────────────────┘    └───────────────┘    └──────────────────┘
       │                                              │
       │ 800ms debounce                               │
       ▼                                              ▼
┌──────────────────┐                         ┌──────────────────┐
│ 분석 결과 표시    │◀────────────────────────│ AnalysisResult   │
│ (태그, 요약)      │                         │ JSON 반환        │
└──────────────────┘                         └──────────────────┘
```

### 편집 페이지에서 AI 수정 플로우

```
┌──────────────────┐    ┌───────────────┐    ┌──────────────────┐    ┌────────────┐
│ EditClient       │───▶│ POST /api/    │───▶│ buildSystem      │───▶│ Gemini API │
│ (AI 프롬프트)    │    │ super-editor  │    │ Prompt()         │    │            │
│                  │    │ -v2/ai        │    │                  │    │            │
└──────────────────┘    └───────────────┘    └──────────────────┘    └────────────┘
                                                                           │
                                                                           ▼
┌──────────────────┐    ┌───────────────┐    ┌──────────────────┐    ┌────────────┐
│ EditClient       │◀───│ DB Updated    │◀───│ applyPatches()   │◀───│ Parse JSON │
│ (실시간 반영)    │    │ (문서 저장)    │    │ (JSON Patch)     │    │ Patch      │
└──────────────────┘    └───────────────┘    └──────────────────┘    └────────────┘
```

---

## 1단계: Landing에서 문서 생성

### 파일 위치
- Landing 컴포넌트: `src/components/landing/PromptHeroLanding.tsx`
- Landing 생성 API: `src/app/api/landing/generate/route.ts`
- 레퍼런스 분석 API: `src/app/api/super-editor-v2/analyze-reference/route.ts`
- Server Action: `src/lib/super-editor-v2/actions/document.ts`

### Landing → Editor 플로우

#### 1.1 사용자 입력
```typescript
// PromptHeroLanding.tsx
// 1. 프롬프트 입력 (필수) - Typewriter 예시로 가이드
const [prompt, setPrompt] = useState('')

// 2. 레퍼런스 입력 (선택) - URL 또는 이미지
const [referenceAnalysis, setReferenceAnalysis] = useState<AnalysisResult | null>(null)

// 3. 레퍼런스 분석 (debounce 800ms)
const analyzeUrl = async (url: string) => {
  const response = await fetch('/api/super-editor-v2/analyze-reference', {
    method: 'POST',
    body: JSON.stringify({ url }),
  })
  const data = await response.json()
  setReferenceAnalysis(data.analysis)
}
```

#### 1.2 로그인 처리
```typescript
// 비로그인 시 sessionStorage에 입력값 저장 후 로그인 유도
if (!user) {
  sessionStorage.setItem('landing_prompt', prompt)
  sessionStorage.setItem('landing_reference', JSON.stringify(referenceAnalysis))
  router.push('/auth/signin?redirect=/')
  return
}
```

#### 1.3 문서 생성 및 AI 생성
```typescript
// /api/landing/generate/route.ts
// 1. 문서 생성
const document = await createDocument({ title: prompt.slice(0, 50) || '새 청첩장' })

// 2. 프롬프트 구성 (레퍼런스 분석 결과 포함)
let fullPrompt = '새 청첩장을 만들어주세요.'
if (referenceAnalysis) {
  fullPrompt += `\n\n[참고 레퍼런스 스타일]\n`
  fullPrompt += `- 분위기: ${referenceAnalysis.mood.join(', ')}\n`
  fullPrompt += `- 색상: ${referenceAnalysis.colors.join(', ')}\n`
  fullPrompt += `- 타이포: ${referenceAnalysis.typography}\n`
  fullPrompt += `- 레이아웃: ${referenceAnalysis.layout}\n`
}
fullPrompt += `\n\n[사용자 요청]\n${prompt}`

// 3. AI API 호출
await fetch('/api/super-editor-v2/ai', {
  method: 'POST',
  body: JSON.stringify({
    documentId: document.id,
    prompt: fullPrompt,
    action: 'generate',
    referenceAnalysis,
  }),
})

// 4. 편집 페이지로 리다이렉트
return NextResponse.json({ documentId: document.id })
```

### 레퍼런스 분석 API

```typescript
// /api/super-editor-v2/analyze-reference/route.ts

interface AnalysisResult {
  mood: string[]         // ["미니멀", "모던", "우아한"]
  colors: string[]       // ["#FFFFFF", "#C9A962", "#1A1A1A"]
  typography: string     // "세리프" | "산세리프" | "손글씨"
  layout: string         // "사진중심" | "텍스트중심" | "균형"
  keywords: string[]     // 스타일 키워드
  summary: string        // 한줄 요약
}

// Gemini Vision으로 이미지/URL 분석
const result = await model.generateContent({
  contents: [{ role: 'user', parts: [{ text: prompt }, { inlineData: imageData }] }],
})
```

### (폴백) /se2/create 페이지

직접 접근 시 기존 방식으로도 생성 가능:

```typescript
// src/app/se2/create/page.tsx
// 빈 문서로 시작
const document = await createDocument({ title: '새 청첩장' })
router.push(`/se2/${document.id}/edit`)

// 또는 AI로 생성
const document = await createDocument({ title: prompt.slice(0, 50) })
await fetch('/api/super-editor-v2/ai', { ... })
router.push(`/se2/${document.id}/edit`)
```

### createDocument 함수가 생성하는 기본 데이터

| 필드 | 기본값 |
|------|--------|
| `blocks` | `createDefaultBlocks()` - 8개 기본 블록 |
| `style` | `DEFAULT_STYLE_SYSTEM` - minimal-light |
| `animation` | `DEFAULT_ANIMATION` - subtle 무드 |
| `data` | `DEFAULT_WEDDING_DATA` - 빈 웨딩 데이터 |
| `status` | `'draft'` |

### 기본 블록 구조 (createDefaultBlocks)

```typescript
[
  { id: 'hero-1', type: 'hero', height: 100, elements: [...] },
  { id: 'greeting-1', type: 'greeting', height: 60, elements: [...] },
  { id: 'calendar-1', type: 'calendar', height: 80, elements: [...] },
  { id: 'gallery-1', type: 'gallery', height: 100, elements: [...] },
  { id: 'location-1', type: 'location', height: 80, elements: [...] },
  { id: 'parents-1', type: 'parents', height: 60, elements: [...] },
  { id: 'account-1', type: 'account', height: 80, elements: [...] },
  { id: 'message-1', type: 'message', height: 100, enabled: false },
]
```

각 블록의 `elements`는 `binding` 속성으로 `WeddingData`와 연결됨:
- `'groom.name'` → `data.groom.name`
- `'venue.address'` → `data.venue.address`
- `'wedding.date'` → `data.wedding.date`

---

## 2단계: AI API 호출

### 파일 위치
- API Route: `src/app/api/super-editor-v2/ai/route.ts`

### 요청 형식 (AIEditRequest)

```typescript
interface AIEditRequest {
  documentId: string
  prompt: string
  targetBlockId?: string  // 특정 블록만 수정할 경우
  context?: {
    selectedElementId?: string
    viewportInfo?: { width: number; height: number }
  }
}
```

### 처리 흐름

```typescript
// 1. 문서 컨텍스트 조회
const context = await getDocumentContextForAI(body.documentId)

// 2. 시스템 프롬프트 생성
const systemPrompt = buildSystemPrompt(context, body.targetBlockId)

// 3. 사용자 프롬프트 생성
const userPrompt = buildUserPrompt(body.prompt, body.context)

// 4. Gemini API 호출
const aiResponse = await callGeminiAPI(systemPrompt, userPrompt)

// 5. JSON Patch 적용
const result = await applyAIEdit(documentId, patches, prompt, explanation)

// 6. 로그 저장
await db.insert(aiEditLogsV2).values({ ... })
```

---

## 3단계: AI 프롬프트 구조

### 3.1 시스템 프롬프트 (buildSystemPrompt)

```
당신은 청첩장 디자인 AI 어시스턴트입니다.
사용자의 요청을 분석하여 청첩장 문서를 수정하는 JSON Patch를 생성합니다.

## 블록 타입
hero: 메인, greeting: 인사말, calendar: 날짜/달력, ...

## 블록 스키마
interface Block {
  id: string              // 읽기 전용
  type: BlockType         // 읽기 전용
  enabled: boolean        // 블록 활성화 여부
  height: number          // 블록 높이 (vh 단위)
  elements: Element[]     // 요소 배열
  style?: { ... }         // 블록 레벨 스타일
}

interface Element {
  id: string
  type: 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'map' | 'calendar'
  binding?: string
  x, y, width, height: number  // 위치/크기 (%, 0-100)
  zIndex?: number
  style?: { ... }
  animation?: { ... }
}

## 현재 문서 상태
- 블록 목록: [0] hero, [1] greeting, ...
- 스타일: minimal-light
- 웨딩 데이터: 신랑: (미입력), 신부: (미입력), ...

## 출력 형식
{
  "analysis": { "intent": "...", "affectedPaths": [...], "approach": "..." },
  "patches": [
    { "op": "replace", "path": "/blocks/0/elements/0/style/text/fontSize", "value": 32 }
  ],
  "explanation": "한국어 변경 설명"
}

## 경로 규칙
- /blocks/{index}/... : 블록 수정
- /blocks/{index}/elements/{index}/... : 요소 수정
- /style/... : 전역 스타일 수정
- /data/... : 웨딩 데이터 수정

## 커스텀 변수 (새 텍스트 추가 시)
- binding: "custom.키이름" 형식 사용
- /data/custom/키이름 에 초기값 설정
```

### 3.2 사용자 프롬프트 (buildUserPrompt)

```
## 사용자 요청
${prompt}
선택된 요소: ${selectedElementId}  // 있을 경우
뷰포트: ${width}x${height}         // 있을 경우

위 요청을 분석하고 적절한 JSON Patch를 생성해주세요.
```

---

## 4단계: AI 응답 형식

### Gemini가 반환하는 JSON 구조

```json
{
  "analysis": {
    "intent": "사용자 의도 요약",
    "affectedPaths": ["/blocks/0/elements/0/style/text/fontSize"],
    "approach": "수정 방식 설명"
  },
  "patches": [
    { "op": "replace", "path": "/blocks/0/height", "value": 120 },
    { "op": "add", "path": "/blocks/0/elements/-", "value": { ... } },
    { "op": "replace", "path": "/data/custom/title", "value": "Wedding" }
  ],
  "explanation": "메인 블록 높이를 120vh로 변경하고 제목 텍스트를 추가했습니다."
}
```

### JSON Patch 연산자

| op | 설명 | 예시 |
|----|------|------|
| `add` | 값 추가 | `{ "op": "add", "path": "/blocks/0/elements/-", "value": {...} }` |
| `remove` | 값 삭제 | `{ "op": "remove", "path": "/blocks/1" }` |
| `replace` | 값 교체 | `{ "op": "replace", "path": "/data/groom/name", "value": "홍길동" }` |
| `move` | 값 이동 | `{ "op": "move", "from": "/blocks/0", "path": "/blocks/1" }` |
| `copy` | 값 복사 | `{ "op": "copy", "from": "/blocks/0", "path": "/blocks/1" }` |

---

## 5단계: Patch 적용 (applyAIEdit)

### 파일 위치
- Server Action: `src/lib/super-editor-v2/actions/ai-edit.ts`

### 처리 흐름

```typescript
export async function applyAIEdit(
  documentId: string,
  patches: JSONPatch[],
  prompt: string,
  explanation: string
) {
  // 1. 문서 조회
  const document = await db.query.editorDocumentsV2.findFirst(...)

  // 2. AI 편집 전 스냅샷 생성 (Undo 지원)
  await db.insert(editorSnapshotsV2).values({
    documentId,
    type: 'ai-edit',
    snapshot: { blocks, style, animation, data },
    aiPrompt: prompt,
    aiResponse: { patches, explanation },
  })

  // 3. JSON Patch 적용
  const updatedDocument = applyPatches(document, patches)

  // 4. DB 업데이트
  await db.update(editorDocumentsV2).set({
    blocks: updatedDocument.blocks,
    style: updatedDocument.style,
    animation: updatedDocument.animation,
    data: updatedDocument.data,
    documentVersion: sql`document_version + 1`,
  })
}
```

### applyPatches 함수

```typescript
function applyPatches(document, patches) {
  // 깊은 복사
  const result = {
    blocks: JSON.parse(JSON.stringify(document.blocks)),
    style: JSON.parse(JSON.stringify(document.style)),
    animation: JSON.parse(JSON.stringify(document.animation)),
    data: JSON.parse(JSON.stringify(document.data)),
  }

  for (const patch of patches) {
    applyPatch(result, patch)  // 개별 패치 적용
  }

  return result
}
```

---

## 6단계: 클라이언트 업데이트 (EditClient)

### 파일 위치
- 페이지: `src/app/se2/[id]/edit/page.tsx`
- 클라이언트: `src/app/se2/[id]/edit/EditClient.tsx`
- AI 훅: `src/lib/super-editor-v2/hooks/useAIEdit.ts`

### useAIEdit 훅 사용

```typescript
const aiEdit = useAIEdit({
  documentId: dbDocument.id,
  onDocumentUpdate: () => {
    // 문서 다시 불러오기
  },
})

// AI 편집 요청
const handleAISubmit = async (prompt: string) => {
  await aiEdit.edit(prompt, expandedBlockId ?? undefined)
  setShowAIPrompt(false)
}
```

### useAIEdit 내부 동작

```typescript
const edit = async (prompt: string, targetBlockId?: string) => {
  // 1. API 호출
  const response = await fetch('/api/super-editor-v2/ai', {
    method: 'POST',
    body: JSON.stringify({ documentId, prompt, targetBlockId }),
  })

  // 2. 결과 처리
  const result = await response.json()

  // 3. 히스토리에 추가 (클라이언트 측)
  setHistory(prev => [{ id, prompt, explanation, timestamp, patches }, ...prev])

  // 4. 문서 갱신 콜백 호출
  onDocumentUpdate?.()
}
```

---

## 7단계: 데이터 저장 및 동기화

### 로컬 저장 (IndexedDB)
- `useLocalStorage` 훅으로 로컬 저장
- 변경사항은 debounced로 IndexedDB에 저장
- 명시적 저장 버튼으로 서버 동기화

### 서버 저장
```typescript
const handleSave = async () => {
  await saveToServer(dbDocument.id, {
    blocks: doc.blocks,
    style: doc.style,
    data: doc.data,
  })
}
```

---

## DB 테이블 구조

### editor_documents_v2
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 문서 ID |
| user_id | UUID | 소유자 |
| title | VARCHAR | 문서 제목 |
| blocks | JSONB | 블록 배열 |
| style | JSONB | 스타일 시스템 |
| animation | JSONB | 애니메이션 설정 |
| data | JSONB | 웨딩 데이터 |
| status | VARCHAR | 'draft' \| 'published' |
| document_version | INT | 낙관적 잠금용 버전 |

### editor_snapshots_v2
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 스냅샷 ID |
| document_id | UUID | 문서 FK |
| snapshot_number | INT | 순서 번호 |
| type | VARCHAR | 'auto' \| 'manual' \| 'ai-edit' |
| snapshot | JSONB | 전체 문서 상태 |
| ai_prompt | TEXT | AI 편집 시 프롬프트 |
| ai_response | JSONB | AI 응답 (patches, explanation) |

### ai_edit_logs_v2
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 로그 ID |
| document_id | UUID | 문서 FK |
| user_id | UUID | 사용자 ID |
| prompt | TEXT | 사용자 프롬프트 |
| patches | JSONB | 적용된 패치 |
| explanation | TEXT | AI 설명 |
| success | BOOL | 성공 여부 |
| snapshot_id | UUID | 스냅샷 FK |

---

## 핵심 파일 경로 요약

| 역할 | 파일 경로 |
|------|-----------|
| **Landing (메인 진입점)** | |
| Landing Hero | `src/components/landing/PromptHeroLanding.tsx` |
| Typewriter 컴포넌트 | `src/components/landing/Typewriter.tsx` |
| Before/After 데모 | `src/components/landing/BeforeAfterDemo.tsx` |
| Landing 생성 API | `src/app/api/landing/generate/route.ts` |
| 레퍼런스 분석 API | `src/app/api/super-editor-v2/analyze-reference/route.ts` |
| **Editor** | |
| Edit 페이지 | `src/app/se2/[id]/edit/page.tsx` |
| Edit 클라이언트 | `src/app/se2/[id]/edit/EditClient.tsx` |
| AI API Route | `src/app/api/super-editor-v2/ai/route.ts` |
| **Server Actions** | |
| Document Actions | `src/lib/super-editor-v2/actions/document.ts` |
| AI Edit Actions | `src/lib/super-editor-v2/actions/ai-edit.ts` |
| **Hooks & Utils** | |
| useAIEdit Hook | `src/lib/super-editor-v2/hooks/useAIEdit.ts` |
| **Schema & Types** | |
| DB Schema | `src/lib/super-editor-v2/schema/db-schema.ts` |
| Types | `src/lib/super-editor-v2/schema/types.ts` |
| Default Values | `src/lib/super-editor-v2/schema/index.ts` |
| **(폴백) Create 페이지** | `src/app/se2/create/page.tsx` |

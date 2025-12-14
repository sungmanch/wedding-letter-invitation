# Super Editor v2 - 에디터 레이아웃 & 탭

> **목표**: 2패널 레이아웃 + Section-First 탭 구조
> **핵심 원칙**: 폼 입력 + AI 프롬프트 + 드래그앤드롭 3가지 편집 방식 병행

---

## 1. 설계 원칙

### 1.1 핵심 결정사항

| 항목 | 결정 |
|------|------|
| **편집 방식** | 3가지 병행: 폼 입력 + AI 프롬프트 + 드래그앤드롭 |
| **에디터 UI 생성** | 변수 타입 정의에서 자동 렌더링 |
| **레이아웃** | 2패널 (에디터 / 프리뷰) |
| **UX 패턴** | Section-First (섹션 아코디언 통합) |
| **프리뷰 모드** | 폼 모드 (읽기 전용) / 편집 모드 (드래그 가능) |

### 1.2 2패널 레이아웃

```
┌─────────────────────┬─────────────────────┐
│                     │                     │
│   Editor Panel      │   Preview Panel     │
│   (40%)             │   (60%)             │
│                     │                     │
│ ┌─────────────────┐ │ ┌─────────────────┐ │
│ │ 탭: 콘텐츠      │ │ │ [📝][✋] 모드   │ │
│ │     디자인      │ │ └─────────────────┘ │
│ │     공유        │ │                     │
│ └─────────────────┘ │ ┌─────────────────┐ │
│                     │ │   Phone Frame   │ │
│ ┌─────────────────┐ │ │   (390x844)     │ │
│ │ Section         │ │ │                 │ │
│ │ Accordion       │ │ │ - 우클릭: 메뉴  │ │
│ │ ...             │ │ │ - 드래그: 이동  │ │
│ └─────────────────┘ │ │ - 핸들: 리사이즈│ │
│                     │ │                 │ │
│ ┌─────────────────┐ │ └─────────────────┘ │
│ │ AI Prompt Input │ │                     │
│ └─────────────────┘ │                     │
└─────────────────────┴─────────────────────┘
```

### 1.3 편집 모드

| 모드 | 아이콘 | 프리뷰 동작 | 용도 |
|------|--------|------------|------|
| **폼 모드** | 📝 | 읽기 전용, 클릭→섹션 선택 | 데이터 입력, AI 프롬프트 |
| **편집 모드** | ✋ | 드래그/리사이즈/회전 가능 | 레이아웃 직접 조정 |

---

## 2. 탭 구조

### 2.1 3탭 구성

| 탭 | 내용 | 컴포넌트 |
|----|------|----------|
| **콘텐츠** | 섹션 on/off + 변수 입력 | `<ContentTab />` |
| **디자인** | 전역 스타일 + 테마 | `<DesignTab />` |
| **공유** | OG 메타데이터 + 공유 링크 | `<ShareTab />` |

### 2.2 탭 컴포넌트 구조

```typescript
interface EditorTabsProps {
  document: EditorDocument
  activeTab: 'content' | 'design' | 'share'
  onTabChange: (tab: string) => void
  selectedBlockId: string | null
  onBlockSelect: (blockId: string) => void
}

function EditorTabs({ document, activeTab, selectedBlockId, onBlockSelect }: EditorTabsProps) {
  return (
    <div className="editor-tabs">
      <TabList>
        <Tab value="content">콘텐츠</Tab>
        <Tab value="design">디자인</Tab>
        <Tab value="share">공유</Tab>
      </TabList>

      <TabContent value="content">
        <ContentTab
          blocks={document.blocks}
          data={document.data}
          selectedBlockId={selectedBlockId}
          onBlockSelect={onBlockSelect}
        />
      </TabContent>

      <TabContent value="design">
        <DesignTab style={document.style} animation={document.animation} />
      </TabContent>

      <TabContent value="share">
        <ShareTab documentId={document.id} />
      </TabContent>
    </div>
  )
}
```

---

## 3. 콘텐츠 탭 (Section-First)

### 3.1 섹션 아코디언 구조

```typescript
interface ContentTabProps {
  blocks: Block[]
  data: WeddingData
  selectedBlockId: string | null
  onBlockSelect: (blockId: string) => void
  onBlockToggle: (blockId: string, enabled: boolean) => void
  onDataChange: (path: string, value: unknown) => void
}

function ContentTab({
  blocks,
  data,
  selectedBlockId,
  onBlockSelect,
  onBlockToggle,
  onDataChange,
}: ContentTabProps) {
  return (
    <div className="content-tab">
      {blocks.map(block => (
        <SectionAccordion
          key={block.id}
          block={block}
          data={data}
          isSelected={block.id === selectedBlockId}
          onSelect={() => onBlockSelect(block.id)}
          onToggle={(enabled) => onBlockToggle(block.id, enabled)}
          onDataChange={onDataChange}
        />
      ))}
    </div>
  )
}
```

### 3.2 SectionAccordion 컴포넌트

```typescript
interface SectionAccordionProps {
  block: Block
  data: WeddingData
  isSelected: boolean
  onSelect: () => void
  onToggle: (enabled: boolean) => void
  onDataChange: (path: string, value: unknown) => void
}

function SectionAccordion({
  block,
  data,
  isSelected,
  onSelect,
  onToggle,
  onDataChange,
}: SectionAccordionProps) {
  const sectionMeta = SECTION_METADATA[block.type]
  const boundVariables = extractBoundVariables(block.elements)

  return (
    <Accordion
      expanded={isSelected}
      onChange={() => onSelect()}
      className={cn(
        'section-accordion',
        isSelected && 'selected',
        !block.enabled && 'disabled'
      )}
    >
      <AccordionHeader>
        <div className="flex items-center gap-2">
          <Toggle
            checked={block.enabled}
            onChange={(e) => {
              e.stopPropagation()
              onToggle(!block.enabled)
            }}
          />
          <Icon name={sectionMeta.icon} />
          <span>{sectionMeta.label}</span>
        </div>
      </AccordionHeader>

      <AccordionContent>
        {block.enabled ? (
          <VariableFieldGroup
            variables={boundVariables}
            data={data}
            onChange={onDataChange}
          />
        ) : (
          <p className="text-muted">섹션을 활성화하면 편집할 수 있습니다.</p>
        )}
      </AccordionContent>
    </Accordion>
  )
}
```

### 3.3 섹션 메타데이터

```typescript
const SECTION_METADATA: Record<BlockType, SectionMeta> = {
  hero: { label: '인트로', icon: 'image', order: 1 },
  greeting: { label: '인사말', icon: 'message', order: 2 },
  parents: { label: '혼주 소개', icon: 'users', order: 3 },
  gallery: { label: '갤러리', icon: 'images', order: 4 },
  venue: { label: '예식장', icon: 'map-pin', order: 5 },
  calendar: { label: '달력', icon: 'calendar', order: 6 },
  accounts: { label: '축의금', icon: 'credit-card', order: 7 },
  contact: { label: '연락처', icon: 'phone', order: 8 },
  guestbook: { label: '방명록', icon: 'book', order: 9 },
  music: { label: 'BGM', icon: 'music', order: 10 },
  custom: { label: '커스텀', icon: 'puzzle', order: 99 },
}
```

---

## 4. 상태 관리

### 4.1 EditorContext

```typescript
interface EditorState {
  document: EditorDocument
  selectedBlockId: string | null
  selectedElementId: string | null
  activeTab: 'content' | 'design' | 'share'
  editMode: 'form' | 'direct'
  contextMenu: ContextMenuState | null
  isDirty: boolean
  isLoading: boolean
  history: EditorDocument[]
  historyIndex: number
}

type EditorAction =
  | { type: 'SET_DOCUMENT'; document: EditorDocument }
  | { type: 'SELECT_BLOCK'; blockId: string | null }
  | { type: 'SELECT_ELEMENT'; elementId: string | null }
  | { type: 'SET_TAB'; tab: 'content' | 'design' | 'share' }
  | { type: 'SET_EDIT_MODE'; mode: 'form' | 'direct' }
  | { type: 'UPDATE_DATA'; path: string; value: unknown }
  | { type: 'UPDATE_BLOCK'; blockId: string; updates: Partial<Block> }
  | { type: 'UPDATE_ELEMENT'; blockId: string; elementId: string; updates: Partial<Element> }
  | { type: 'UPDATE_STYLE'; style: GlobalStyle }
  | { type: 'APPLY_PATCHES'; patches: JsonPatch[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
```

### 4.2 커스텀 훅

```typescript
function useEditor() {
  const context = useContext(EditorContext)
  if (!context) throw new Error('useEditor must be used within EditorProvider')
  return context
}

function useSelectedBlock() {
  const { state } = useEditor()
  return state.document.blocks.find(b => b.id === state.selectedBlockId) || null
}

function useUpdateData() {
  const { dispatch } = useEditor()
  return useCallback((path: string, value: unknown) => {
    dispatch({ type: 'UPDATE_DATA', path, value })
  }, [dispatch])
}
```

---

## 5. 관련 문서

| 문서 | 내용 |
|------|------|
| [04b_variable_editors.md](./04b_variable_editors.md) | 변수 기반 에디터 |
| [04c_direct_editing.md](./04c_direct_editing.md) | 드래그앤드롭 편집 |
| [04d_ai_context.md](./04d_ai_context.md) | AI 프롬프트 컨텍스트 |
| [04e_design_tab.md](./04e_design_tab.md) | 디자인 탭 (스타일 설정) |

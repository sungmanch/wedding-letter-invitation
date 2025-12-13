# Super Editor v2 - 에디터 UI 설계

> **목표**: 하이브리드 편집 (폼 입력 + AI 프롬프트 + 드래그앤드롭) + 타입 기반 자동 생성 에디터 UI
> **핵심 원칙**: 프롬프트 컨텍스트 압축 + Section-First 패턴 + 점진적 공개 + 직접 편집

---

## 1. 설계 원칙

### 1.1 핵심 결정사항

| 항목 | 결정 |
|------|------|
| **편집 방식** | **3가지 병행**: 폼 입력 + AI 프롬프트 + 드래그앤드롭 |
| **에디터 UI 생성** | 변수 타입 정의에서 자동 렌더링 |
| **레이아웃** | 2패널 (에디터 / 프리뷰) |
| **컨텍스트 압축** | 선택 블록 full + 나머지 요약 |
| **UX 패턴** | Section-First (섹션 아코디언 통합) |
| **프리뷰 모드** | 폼 모드 (읽기 전용) / 편집 모드 (드래그 가능) |
| **요소 참조** | 우클릭 → ID 복사 → AI 프롬프트에서 `#id` 참조 |

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

  // 프리뷰 연동
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

섹션 on/off와 변수 입력을 한 곳에서 처리.

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

  // 이 블록이 사용하는 변수 경로 추출
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
  intro: { label: '인트로', icon: 'image', order: 1 },
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

## 4. 변수 기반 에디터 렌더링

### 4.1 VariableFieldGroup

바운딩된 변수들을 그룹화하여 렌더링.

```typescript
interface VariableFieldGroupProps {
  variables: string[]  // ['groom.name', 'groom.phone', 'bride.name', ...]
  data: WeddingData
  onChange: (path: string, value: unknown) => void
}

function VariableFieldGroup({ variables, data, onChange }: VariableFieldGroupProps) {
  // 변수를 최상위 그룹으로 분류
  const grouped = groupVariablesByRoot(variables)
  // { groom: ['name', 'phone', 'account'], bride: [...], wedding: [...] }

  return (
    <div className="variable-field-group">
      {Object.entries(grouped).map(([root, paths]) => (
        <FieldGroup key={root} label={AVAILABLE_VARIABLES[root]?.label || root}>
          {paths.map(path => {
            const fullPath = `${root}.${path}`
            const definition = getDefinitionByPath(AVAILABLE_VARIABLES, fullPath)

            // Computed 필드는 렌더링 안 함
            if (COMPUTED_FIELDS[fullPath]) return null

            return (
              <VariableField
                key={fullPath}
                path={fullPath}
                definition={definition}
                value={getValueByPath(data, fullPath)}
                onChange={(value) => onChange(fullPath, value)}
              />
            )
          })}
        </FieldGroup>
      ))}
    </div>
  )
}
```

### 4.2 VariableField 컴포넌트

타입 정의에 따라 적절한 에디터 컴포넌트 렌더링.

```typescript
interface VariableFieldProps {
  path: string
  definition: VariableDefinition
  value: unknown
  onChange: (value: unknown) => void
}

function VariableField({ path, definition, value, onChange }: VariableFieldProps) {
  // Computed 필드 체크
  if (COMPUTED_FIELDS[path]) {
    return null  // 렌더링 안 함
  }

  // 타입별 에디터 컴포넌트 선택
  switch (definition.type) {
    case 'text':
      return (
        <TextInput
          label={definition.label}
          value={value as string}
          onChange={onChange}
        />
      )

    case 'longtext':
      return (
        <Textarea
          label={definition.label}
          value={value as string}
          onChange={onChange}
          rows={4}
        />
      )

    case 'number':
      return (
        <NumberInput
          label={definition.label}
          value={value as number}
          onChange={onChange}
        />
      )

    case 'boolean':
      return (
        <Toggle
          label={definition.label}
          checked={value as boolean}
          onChange={onChange}
        />
      )

    case 'phone':
      return (
        <PhoneInput
          label={definition.label}
          value={value as string}
          onChange={onChange}
        />
      )

    case 'date':
      return (
        <DatePicker
          label={definition.label}
          value={value as string}
          onChange={onChange}
        />
      )

    case 'time':
      return (
        <TimePicker
          label={definition.label}
          value={value as string}
          onChange={onChange}
        />
      )

    case 'image':
      return (
        <ImageUploader
          label={definition.label}
          value={value as PhotoData}
          onChange={onChange}
        />
      )

    case 'url':
      return (
        <UrlInput
          label={definition.label}
          value={value as string}
          onChange={onChange}
        />
      )

    case 'compound':
      return (
        <CompoundEditor
          path={path}
          definition={definition as CompoundTypeDefinition}
          value={value as Record<string, unknown>}
          onChange={onChange}
        />
      )

    case 'array':
      return (
        <ArrayEditor
          path={path}
          definition={definition as ArrayTypeDefinition}
          value={value as unknown[]}
          onChange={onChange}
        />
      )

    default:
      return null
  }
}
```

### 4.3 CompoundEditor (특수 입력 방식 지원)

```typescript
interface CompoundEditorProps {
  path: string
  definition: CompoundTypeDefinition
  value: Record<string, unknown>
  onChange: (value: Record<string, unknown>) => void
}

function CompoundEditor({ path, definition, value, onChange }: CompoundEditorProps) {
  const handleFieldChange = (fieldName: string, fieldValue: unknown) => {
    onChange({ ...value, [fieldName]: fieldValue })
  }

  // 특수 입력 방식
  if (definition.inputMethod === 'address-search') {
    return (
      <AddressSearchEditor
        label={definition.label}
        value={value}
        onChange={onChange}
        fields={definition.fields}
      />
    )
  }

  if (definition.inputMethod === 'bank-select') {
    return (
      <BankSelectEditor
        label={definition.label}
        value={value}
        onChange={onChange}
        fields={definition.fields}
      />
    )
  }

  if (definition.inputMethod === 'image-upload') {
    return (
      <ImageUploadEditor
        label={definition.label}
        value={value}
        onChange={onChange}
      />
    )
  }

  // 기본: 필드별 재귀 렌더링
  return (
    <fieldset className="compound-editor">
      <legend>{definition.label}</legend>
      {Object.entries(definition.fields)
        .filter(([_, field]) => field.input !== 'auto')  // auto 필드 숨김
        .map(([fieldName, field]) => (
          <VariableField
            key={fieldName}
            path={`${path}.${fieldName}`}
            definition={field}
            value={value?.[fieldName]}
            onChange={(v) => handleFieldChange(fieldName, v)}
          />
        ))}
    </fieldset>
  )
}
```

### 4.4 특수 입력 에디터

#### AddressSearchEditor

```typescript
function AddressSearchEditor({
  label,
  value,
  onChange,
  fields,
}: {
  label: string
  value: Record<string, unknown>
  onChange: (value: Record<string, unknown>) => void
  fields: Record<string, FieldDefinition>
}) {
  const handleAddressSearch = async () => {
    // 카카오/네이버 주소 검색 API 호출
    const result = await openAddressSearch()
    if (result) {
      onChange({
        ...value,
        address: result.address,
        coordinates: {
          lat: result.lat,
          lng: result.lng,
        },
      })
    }
  }

  return (
    <div className="address-search-editor">
      <label>{label}</label>

      {/* manual 필드들 */}
      {Object.entries(fields)
        .filter(([_, f]) => f.input === 'manual')
        .map(([name, field]) => (
          <VariableField
            key={name}
            path={name}
            definition={field}
            value={value?.[name]}
            onChange={(v) => onChange({ ...value, [name]: v })}
          />
        ))}

      {/* 주소 검색 버튼 + 결과 */}
      <div className="address-search-row">
        <input
          type="text"
          value={(value?.address as string) || ''}
          readOnly
          placeholder="주소를 검색하세요"
        />
        <Button onClick={handleAddressSearch}>주소 검색</Button>
      </div>

      {/* 좌표 표시 (읽기 전용) */}
      {value?.coordinates && (
        <div className="coordinates-display">
          위도: {(value.coordinates as any).lat}, 경도: {(value.coordinates as any).lng}
        </div>
      )}
    </div>
  )
}
```

#### BankSelectEditor

```typescript
const BANK_LIST = [
  { code: 'kb', name: '국민은행', logo: '/banks/kb.svg' },
  { code: 'shinhan', name: '신한은행', logo: '/banks/shinhan.svg' },
  { code: 'woori', name: '우리은행', logo: '/banks/woori.svg' },
  { code: 'hana', name: '하나은행', logo: '/banks/hana.svg' },
  { code: 'nh', name: '농협은행', logo: '/banks/nh.svg' },
  { code: 'kakao', name: '카카오뱅크', logo: '/banks/kakao.svg' },
  { code: 'toss', name: '토스뱅크', logo: '/banks/toss.svg' },
  // ...
]

function BankSelectEditor({
  label,
  value,
  onChange,
  fields,
}: {
  label: string
  value: Record<string, unknown>
  onChange: (value: Record<string, unknown>) => void
  fields: Record<string, FieldDefinition>
}) {
  return (
    <div className="bank-select-editor">
      <label>{label}</label>

      {/* 은행 선택 드롭다운 */}
      <Select
        value={value?.bank as string}
        onChange={(bank) => onChange({ ...value, bank })}
        placeholder="은행 선택"
      >
        {BANK_LIST.map(bank => (
          <SelectOption key={bank.code} value={bank.name}>
            <img src={bank.logo} alt={bank.name} className="w-5 h-5" />
            {bank.name}
          </SelectOption>
        ))}
      </Select>

      {/* 계좌번호 */}
      <TextInput
        label="계좌번호"
        value={(value?.number as string) || ''}
        onChange={(v) => onChange({ ...value, number: v })}
        placeholder="계좌번호 입력"
      />

      {/* 예금주 */}
      <TextInput
        label="예금주"
        value={(value?.holder as string) || ''}
        onChange={(v) => onChange({ ...value, holder: v })}
        placeholder="예금주명"
      />
    </div>
  )
}
```

---

## 5. 프리뷰 연동

### 5.1 PreviewPanel (모드 지원)

```typescript
interface PreviewPanelProps {
  document: EditorDocument
  selectedBlockId: string | null
  selectedElementId: string | null
  editMode: 'form' | 'direct'
  onBlockClick: (blockId: string) => void
  onElementSelect: (elementId: string) => void
  onElementUpdate: (elementId: string, updates: Partial<Element>) => void
  onContextMenu: (context: ContextMenuState) => void
}

function PreviewPanel({
  document,
  selectedBlockId,
  selectedElementId,
  editMode,
  onBlockClick,
  onElementSelect,
  onElementUpdate,
  onContextMenu,
}: PreviewPanelProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  // 선택 블록으로 스크롤
  useEffect(() => {
    if (selectedBlockId && previewRef.current) {
      const blockElement = previewRef.current.querySelector(`[data-block-id="${selectedBlockId}"]`)
      blockElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [selectedBlockId])

  return (
    <div className="preview-panel">
      {/* 모드 토글 */}
      <EditModeToggle mode={editMode} />

      <div className="phone-frame">
        <div ref={previewRef} className="preview-content">
          {editMode === 'form' ? (
            <ReadOnlyPreview
              document={document}
              selectedBlockId={selectedBlockId}
              onBlockClick={onBlockClick}
            />
          ) : (
            <EditableCanvas
              document={document}
              selectedBlockId={selectedBlockId}
              selectedElementId={selectedElementId}
              onElementSelect={onElementSelect}
              onElementUpdate={onElementUpdate}
              onContextMenu={onContextMenu}
            />
          )}
        </div>
      </div>
    </div>
  )
}
```

### 5.2 EditModeToggle

```typescript
type EditMode = 'form' | 'direct'

interface EditModeToggleProps {
  mode: EditMode
  onChange: (mode: EditMode) => void
}

function EditModeToggle({ mode, onChange }: EditModeToggleProps) {
  return (
    <div className="edit-mode-toggle">
      <button
        className={cn('mode-btn', mode === 'form' && 'active')}
        onClick={() => onChange('form')}
        title="폼 모드: 데이터 입력 + AI 프롬프트"
      >
        📝 폼
      </button>
      <button
        className={cn('mode-btn', mode === 'direct' && 'active')}
        onClick={() => onChange('direct')}
        title="편집 모드: 드래그/리사이즈/회전"
      >
        ✋ 편집
      </button>
    </div>
  )
}
```

### 5.3 ReadOnlyPreview (폼 모드)

```typescript
function ReadOnlyPreview({
  document,
  selectedBlockId,
  onBlockClick,
}: {
  document: EditorDocument
  selectedBlockId: string | null
  onBlockClick: (blockId: string) => void
}) {
  return (
    <>
      {document.blocks.map(block => (
        <BlockRenderer
          key={block.id}
          block={block}
          data={document.data}
          style={document.style}
          isSelected={block.id === selectedBlockId}
          onClick={() => onBlockClick(block.id)}
        />
      ))}
    </>
  )
}

function BlockRenderer({
  block,
  data,
  style,
  isSelected,
  onClick,
}: {
  block: Block
  data: WeddingData
  style: GlobalStyle
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <div
      data-block-id={block.id}
      className={cn(
        'block-renderer',
        isSelected && 'ring-2 ring-primary',
        !block.enabled && 'opacity-30'
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {block.elements.map(element => (
        <ElementRenderer
          key={element.id}
          element={element}
          data={data}
          style={style}
        />
      ))}

      {isSelected && (
        <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
      )}
    </div>
  )
}
```

### 5.4 EditableCanvas (편집 모드)

```typescript
interface EditableCanvasProps {
  document: EditorDocument
  selectedBlockId: string | null
  selectedElementId: string | null
  onElementSelect: (elementId: string) => void
  onElementUpdate: (elementId: string, updates: Partial<Element>) => void
  onContextMenu: (context: ContextMenuState) => void
}

function EditableCanvas({
  document,
  selectedBlockId,
  selectedElementId,
  onElementSelect,
  onElementUpdate,
  onContextMenu,
}: EditableCanvasProps) {
  return (
    <div className="editable-canvas">
      {document.blocks.map(block => (
        <div
          key={block.id}
          className={cn('block-layer', block.id === selectedBlockId && 'selected')}
        >
          {block.elements.map(element => (
            <DraggableElement
              key={element.id}
              element={element}
              block={block}
              isSelected={element.id === selectedElementId}
              onSelect={() => onElementSelect(element.id)}
              onUpdate={(updates) => onElementUpdate(element.id, updates)}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
```

### 5.5 DraggableElement

```typescript
interface DraggableElementProps {
  element: Element
  block: Block
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<Element>) => void
  onContextMenu: (context: ContextMenuState) => void
}

function DraggableElement({
  element,
  block,
  isSelected,
  onSelect,
  onUpdate,
  onContextMenu,
}: DraggableElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  // 드래그 핸들러
  const { isDragging } = useDrag(elementRef, {
    onDragEnd: (delta) => {
      onUpdate({
        x: element.x + pxToVw(delta.x),
        y: element.y + pxToVh(delta.y),
      })
    }
  })

  // 리사이즈 핸들러
  const { isResizing } = useResize(elementRef, {
    onResizeEnd: (size) => {
      onUpdate({
        width: pxToVw(size.width),
        height: pxToVh(size.height),
      })
    }
  })

  // 우클릭 핸들러
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect()
    onContextMenu({
      element,
      block,
      position: { x: e.clientX, y: e.clientY }
    })
  }

  return (
    <div
      ref={elementRef}
      className={cn(
        'draggable-element',
        isSelected && 'selected',
        isDragging && 'dragging',
        isResizing && 'resizing'
      )}
      style={{
        left: `${element.x}vw`,
        top: `${element.y}vh`,
        width: `${element.width}vw`,
        height: `${element.height}vh`,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: element.zIndex,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onContextMenu={handleContextMenu}
    >
      {/* 요소 콘텐츠 렌더링 */}
      <ElementContent element={element} />

      {/* 선택 시 핸들 표시 */}
      {isSelected && (
        <>
          <ResizeHandles onResize={(size) => onUpdate(size)} />
          <RotateHandle onRotate={(angle) => onUpdate({ rotation: angle })} />
        </>
      )}

      {/* 호버 시 ID 배지 */}
      <div className="element-id-badge">
        #{getDisplayId(element, block)}
      </div>
    </div>
  )
}
```

### 5.6 ElementContextMenu (우클릭 메뉴)

```typescript
interface ContextMenuState {
  element: Element
  block: Block
  position: { x: number; y: number }
}

type ContextMenuAction =
  | { type: 'copy-id' }
  | { type: 'copy-id-with-context' }
  | { type: 'edit' }
  | { type: 'style' }
  | { type: 'duplicate' }
  | { type: 'delete' }

function ElementContextMenu({
  element,
  block,
  position,
  onClose,
  onAction,
}: {
  element: Element
  block: Block
  position: { x: number; y: number }
  onClose: () => void
  onAction: (action: ContextMenuAction) => void
}) {
  const displayId = getDisplayId(element, block)

  const handleCopyId = () => {
    navigator.clipboard.writeText(`#${displayId}`)
    toast.success(`#${displayId} 복사됨`)
    onClose()
  }

  const handleCopyWithContext = () => {
    const context = `#${displayId} (${getElementDescription(element)})`
    navigator.clipboard.writeText(context)
    toast.success('ID + 설명 복사됨')
    onClose()
  }

  return (
    <div
      className="context-menu"
      style={{ left: position.x, top: position.y }}
    >
      {/* 헤더: ID 표시 */}
      <div className="context-menu-header">
        <code className="element-id">#{displayId}</code>
        <span className="element-type">{element.type}</span>
      </div>

      <div className="context-menu-divider" />

      {/* ID 복사 */}
      <button onClick={handleCopyId}>
        <ClipboardIcon /> ID 복사
        <kbd>⌘C</kbd>
      </button>

      <button onClick={handleCopyWithContext}>
        <ClipboardDocIcon /> ID + 설명 복사
      </button>

      <div className="context-menu-divider" />

      {/* 편집 액션 */}
      <button onClick={() => onAction({ type: 'edit' })}>
        <PencilIcon /> 직접 편집
      </button>

      <button onClick={() => onAction({ type: 'style' })}>
        <PaletteIcon /> 스타일 변경
      </button>

      <button onClick={() => onAction({ type: 'duplicate' })}>
        <CopyIcon /> 복제
      </button>

      <div className="context-menu-divider" />

      <button onClick={() => onAction({ type: 'delete' })} className="danger">
        <TrashIcon /> 삭제
      </button>
    </div>
  )
}
```

### 5.7 요소 ID 시스템

AI 프롬프트에서 특정 요소를 참조하기 위한 ID 시스템.

```typescript
/**
 * 요소의 표시용 ID 생성
 * - binding이 있으면 의미 있는 ID (예: 'groom-name')
 * - 없으면 타입 + 해시 (예: 'text-a3f2')
 */
function getDisplayId(element: Element, block: Block): string {
  // 1. binding이 있으면 의미 있는 ID 생성
  if (element.binding) {
    return bindingToId(element.binding)
  }

  // 2. 커스텀 라벨이 있으면 사용
  if (element.label) {
    return slugify(element.label)
  }

  // 3. 타입 + 짧은 해시
  return `${element.type}-${element.id.slice(-4)}`
}

/**
 * binding 경로를 ID로 변환
 */
const BINDING_TO_ID: Record<string, string> = {
  'groom.name': 'groom-name',
  'bride.name': 'bride-name',
  'wedding.dateDisplay': 'wedding-date',
  'photos.main': 'main-photo',
  'greeting.title': 'greeting-title',
  'greeting.content': 'greeting-content',
  'venue.name': 'venue-name',
  'venue.address': 'venue-address',
  // ...
}

function bindingToId(binding: string): string {
  return BINDING_TO_ID[binding] || binding.replace('.', '-')
}

/**
 * 요소 설명 생성 (ID 복사 시 컨텍스트용)
 */
function getElementDescription(element: Element): string {
  if (element.binding) {
    const varDef = AVAILABLE_VARIABLES[element.binding]
    return varDef?.label || element.binding
  }
  if (element.value) {
    const preview = String(element.value).slice(0, 20)
    return preview + (String(element.value).length > 20 ? '...' : '')
  }
  return element.type
}

/**
 * displayId로 요소 찾기
 */
function findElementByDisplayId(
  document: EditorDocument,
  displayId: string
): { element: Element; block: Block } | null {
  for (const block of document.blocks) {
    for (const element of block.elements) {
      if (getDisplayId(element, block) === displayId) {
        return { element, block }
      }
    }
  }
  return null
}
```

### 5.8 사용 시나리오

#### 시나리오 1: 폼 모드에서 데이터 입력 + AI

```
1. 폼 모드 (📝) 활성화
2. 에디터 패널에서 "인트로" 섹션 펼침
3. 신랑/신부 이름 입력 → 프리뷰 실시간 반영
4. AI 프롬프트: "이름을 세로로 배치해줘"
5. AI가 elements[].x, y 수정 → 레이아웃 변경
```

#### 시나리오 2: 편집 모드에서 직접 조정

```
1. 편집 모드 (✋) 전환
2. 프리뷰에서 신랑 이름 텍스트 클릭 → 선택
3. 드래그로 위치 이동
4. 모서리 핸들로 크기 조정
5. 상단 핸들로 회전
6. 변경 완료 → 자동 저장
```

#### 시나리오 3: ID 복사 + AI 프롬프트

```
1. 프리뷰에서 신랑 이름 텍스트 우클릭
2. "ID 복사" 클릭 → "#groom-name" 복사됨
3. AI 프롬프트 입력:
   "#groom-name과 #bride-name을 세로로 배치하고,
    #wedding-date는 아래쪽에 작게 배치해줘"
4. AI가 정확히 해당 요소들만 수정
```

---

## 6. AI 프롬프트 입력

### 6.1 프롬프트 인풋 컴포넌트

```typescript
interface AIPromptInputProps {
  selectedBlockId: string | null
  onSubmit: (prompt: string) => Promise<void>
  isLoading: boolean
}

function AIPromptInput({ selectedBlockId, onSubmit, isLoading }: AIPromptInputProps) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = async () => {
    if (!prompt.trim() || isLoading) return
    await onSubmit(prompt)
    setPrompt('')
  }

  return (
    <div className="ai-prompt-input">
      {selectedBlockId ? (
        <div className="selected-context">
          <span className="text-sm text-muted">
            선택된 섹션: {SECTION_METADATA[getBlockType(selectedBlockId)]?.label}
          </span>
        </div>
      ) : (
        <div className="no-selection">
          <span className="text-sm text-muted">
            섹션을 선택하면 AI가 해당 영역만 수정합니다
          </span>
        </div>
      )}

      <div className="input-row">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            selectedBlockId
              ? "변경하고 싶은 내용을 입력하세요..."
              : "전체 청첩장에 대해 질문하세요..."
          }
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
        />
        <Button
          onClick={handleSubmit}
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? <Spinner /> : <SendIcon />}
        </Button>
      </div>

      {/* 추천 프롬프트 */}
      <PromptSuggestions
        blockType={selectedBlockId ? getBlockType(selectedBlockId) : null}
        onSelect={setPrompt}
      />
    </div>
  )
}
```

### 6.2 추천 프롬프트

```typescript
const PROMPT_SUGGESTIONS: Record<BlockType | 'global', string[]> = {
  intro: [
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

### 6.3 ID 참조 파싱

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

### 6.4 ID 참조 사용 예시

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

## 7. 프롬프트 컨텍스트 압축

### 7.1 문제 정의

- 블록이 많아지면 전체 문서 JSON이 커져서 토큰 한도 초과
- 불필요한 정보가 AI 응답 품질 저하

### 7.2 압축 전략

| 대상 | 압축 방식 | 포함 정보 |
|------|----------|----------|
| **선택된 블록** | Full JSON | 모든 elements, animation, style |
| **다른 블록** | 요약 | id, type, elementCount, enabled |
| **전역 스타일** | 참조 | `$ref: 'document.style'` |
| **WeddingData** | 선택적 | 선택 블록이 참조하는 변수만 |

### 7.3 컨텍스트 빌더

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

### 7.4 컨텍스트 크기 목표

| 항목 | 목표 토큰 |
|------|----------|
| 선택된 블록 full JSON | ~1,500 |
| 다른 블록 요약 | ~300 |
| 관련 WeddingData | ~200 |
| 시스템 프롬프트 | ~500 |
| **총합** | ~2,500 (여유 포함) |

### 7.5 압축된 프롬프트 예시

```json
{
  "context": {
    "selectedBlock": {
      "id": "block-intro",
      "type": "intro",
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

## 8. 디자인 탭 (3-Level 스타일 시스템)

> **스타일 시스템 상세**: [07_style_system.md](./07_style_system.md)

### 8.1 구조 개요

3-Level 하이브리드 스타일 시스템을 위한 점진적 공개 UI.

| 레벨 | UI 컴포넌트 | 대상 | 복잡도 |
|------|------------|------|--------|
| **Level 1** | PresetSelector | 초보자 | 프리셋 선택만 |
| **Level 2** | QuickSettings | 중급자 | 주요 값 조정 |
| **Level 3** | AdvancedPanel | AI/전문가 | 팔레트/토큰 직접 제어 |

```
┌─────────────────────────────────────┐
│ 디자인 탭                            │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🎨 테마 프리셋 (Level 1)         │ │
│ │ [미니멀] [클래식] [로맨틱] ...   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ⚡ 빠른 설정 (Level 2)           │ │
│ │ 메인 색상: [■ #FDFBF7]          │ │
│ │ 포인트 색상: [■ #C9A962]        │ │
│ │ 무드: [따뜻함] [차가움] [중립]   │ │
│ │ 대비: ──●────────               │ │
│ │                                 │ │
│ │ 📷 사진에서 색상 추출            │ │
│ │ [메인 사진에서 추출하기]         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔧 고급 설정 (Level 3) [펼치기]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔤 타이포그래피                  │ │
│ │ 제목 폰트: [Playfair Display ▼] │ │
│ │ 본문 폰트: [Pretendard ▼]       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ✨ 애니메이션                    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 8.2 DesignTab 컴포넌트

```typescript
interface DesignTabProps {
  style: StyleSystem
  animation: GlobalAnimation
  mainPhotoUrl?: string  // 사진 팔레트 추출용
  onStyleChange: (style: StyleSystem) => void
  onAnimationChange: (animation: GlobalAnimation) => void
}

function DesignTab({
  style,
  animation,
  mainPhotoUrl,
  onStyleChange,
  onAnimationChange,
}: DesignTabProps) {
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(
    style.advanced ? 3 : style.quick ? 2 : 1
  )
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="design-tab">
      {/* Level 1: 테마 프리셋 */}
      <section className="design-section">
        <h3>🎨 테마 프리셋</h3>
        <PresetSelector
          selectedPreset={style.preset}
          onSelect={(presetId) => onStyleChange({
            ...style,
            preset: presetId,
            // 프리셋 변경 시 quick/advanced 초기화 옵션
          })}
        />
      </section>

      {/* Level 2: 빠른 설정 */}
      <section className="design-section">
        <h3>⚡ 빠른 설정</h3>
        <QuickSettings
          quick={style.quick}
          mainPhotoUrl={mainPhotoUrl}
          onChange={(quick) => onStyleChange({ ...style, quick })}
        />
      </section>

      {/* Level 3: 고급 설정 (접기/펼치기) */}
      <Disclosure open={showAdvanced} onOpenChange={setShowAdvanced}>
        <DisclosureTrigger className="design-section-header">
          <h3>🔧 고급 설정</h3>
          <ChevronIcon direction={showAdvanced ? 'up' : 'down'} />
        </DisclosureTrigger>
        <DisclosureContent>
          <AdvancedPanel
            advanced={style.advanced}
            basePreset={style.preset}
            onChange={(advanced) => onStyleChange({ ...style, advanced })}
          />
        </DisclosureContent>
      </Disclosure>

      {/* 타이포그래피 */}
      <section className="design-section">
        <h3>🔤 타이포그래피</h3>
        <TypographySettings
          typography={style.typography}
          onChange={(typography) => onStyleChange({ ...style, typography })}
        />
      </section>

      {/* 이펙트 */}
      <section className="design-section">
        <h3>✨ 이펙트</h3>
        <EffectsSettings
          effects={style.effects}
          onChange={(effects) => onStyleChange({ ...style, effects })}
        />
      </section>

      {/* 애니메이션 */}
      <section className="design-section">
        <h3>🎬 애니메이션</h3>
        <AnimationSettings
          animation={animation}
          onChange={onAnimationChange}
        />
      </section>
    </div>
  )
}
```

### 8.3 Level 1: PresetSelector

```typescript
interface PresetSelectorProps {
  selectedPreset?: ThemePresetId
  onSelect: (presetId: ThemePresetId) => void
}

function PresetSelector({ selectedPreset, onSelect }: PresetSelectorProps) {
  // 카테고리별 그룹화
  const categories = [
    { id: 'basic', label: '기본', presets: ['minimal-light', 'minimal-dark'] },
    { id: 'classic', label: '클래식', presets: ['classic-ivory', 'classic-gold'] },
    { id: 'modern', label: '모던', presets: ['modern-mono', 'modern-contrast'] },
    { id: 'romantic', label: '로맨틱', presets: ['romantic-blush', 'romantic-garden'] },
    { id: 'cinematic', label: '시네마틱', presets: ['cinematic-dark', 'cinematic-warm'] },
    { id: 'special', label: '특수', presets: ['photo-adaptive', 'duotone', 'gradient-hero'] },
  ]

  return (
    <div className="preset-selector">
      {categories.map(category => (
        <div key={category.id} className="preset-category">
          <span className="category-label">{category.label}</span>
          <div className="preset-grid">
            {category.presets.map(presetId => {
              const preset = THEME_PRESETS[presetId as ThemePresetId]
              return (
                <button
                  key={presetId}
                  onClick={() => onSelect(presetId as ThemePresetId)}
                  className={cn(
                    'preset-card',
                    selectedPreset === presetId && 'selected'
                  )}
                >
                  <div
                    className="preset-preview"
                    style={{
                      background: preset.tokens['bg-page'],
                      borderColor: preset.tokens['accent-default'],
                    }}
                  >
                    <div
                      className="preview-accent"
                      style={{ background: preset.tokens['accent-default'] }}
                    />
                  </div>
                  <span className="preset-name">{preset.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
```

### 8.4 Level 2: QuickSettings

```typescript
interface QuickSettingsProps {
  quick?: QuickStyleConfig
  mainPhotoUrl?: string
  onChange: (quick: QuickStyleConfig) => void
}

function QuickSettings({ quick = {}, mainPhotoUrl, onChange }: QuickSettingsProps) {
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedPalette, setExtractedPalette] = useState<ExtractedPalette | null>(null)

  // 사진에서 팔레트 추출
  const handleExtractFromPhoto = async () => {
    if (!mainPhotoUrl) return

    setIsExtracting(true)
    try {
      const palette = await extractPaletteOptimized(mainPhotoUrl, {
        extraction: {
          algorithm: 'kmeans',
          colorCount: 6,
          optimization: {
            resizeWidth: 100,
            resizeHeight: 100,
            maxIterations: 10,
            convergenceThreshold: 0.01,
          },
        },
        mapping: {
          dominant: quick.photoExtraction?.mapping?.dominant || 'most-common',
          accent: quick.photoExtraction?.mapping?.accent || 'complementary',
          text: 'auto-contrast',
        },
      })

      setExtractedPalette(palette)

      // 추출된 색상으로 quick 설정 업데이트
      onChange({
        ...quick,
        dominantColor: palette.mappedTokens['bg-page'],
        accentColor: palette.mappedTokens['accent-default'],
        photoExtraction: {
          enabled: true,
          source: 'photos.main',
          mapping: {
            dominant: 'most-common',
            accent: 'complementary',
          },
        },
      })
    } finally {
      setIsExtracting(false)
    }
  }

  return (
    <div className="quick-settings">
      {/* 색상 설정 */}
      <div className="setting-group">
        <label>메인 색상</label>
        <ColorPicker
          value={quick.dominantColor}
          onChange={(color) => onChange({ ...quick, dominantColor: color })}
          presets={COLOR_PRESETS.dominant}
        />
      </div>

      <div className="setting-group">
        <label>포인트 색상</label>
        <ColorPicker
          value={quick.accentColor}
          onChange={(color) => onChange({ ...quick, accentColor: color })}
          presets={COLOR_PRESETS.accent}
        />
      </div>

      {/* 무드 설정 */}
      <div className="setting-group">
        <label>무드</label>
        <SegmentedControl
          value={quick.mood || 'neutral'}
          options={[
            { value: 'warm', label: '따뜻함' },
            { value: 'neutral', label: '중립' },
            { value: 'cool', label: '차가움' },
          ]}
          onChange={(mood) => onChange({ ...quick, mood: mood as QuickStyleConfig['mood'] })}
        />
      </div>

      {/* 대비 설정 */}
      <div className="setting-group">
        <label>대비</label>
        <SegmentedControl
          value={quick.contrast || 'medium'}
          options={[
            { value: 'low', label: '낮음' },
            { value: 'medium', label: '보통' },
            { value: 'high', label: '높음' },
          ]}
          onChange={(contrast) => onChange({ ...quick, contrast: contrast as QuickStyleConfig['contrast'] })}
        />
      </div>

      {/* 채도 설정 */}
      <div className="setting-group">
        <label>채도</label>
        <SegmentedControl
          value={quick.saturation || 'normal'}
          options={[
            { value: 'muted', label: '차분함' },
            { value: 'normal', label: '보통' },
            { value: 'vivid', label: '선명함' },
          ]}
          onChange={(saturation) => onChange({ ...quick, saturation: saturation as QuickStyleConfig['saturation'] })}
        />
      </div>

      {/* 사진 팔레트 추출 */}
      {mainPhotoUrl && (
        <div className="photo-extraction">
          <div className="extraction-header">
            <label>📷 사진에서 색상 추출</label>
            <Button
              onClick={handleExtractFromPhoto}
              disabled={isExtracting}
              variant="outline"
              size="sm"
            >
              {isExtracting ? '추출 중...' : '추출하기'}
            </Button>
          </div>

          {/* 추출된 팔레트 미리보기 */}
          {extractedPalette && (
            <ExtractedPalettePreview
              palette={extractedPalette}
              onApply={(mappedTokens) => {
                onChange({
                  ...quick,
                  dominantColor: mappedTokens['bg-page'],
                  accentColor: mappedTokens['accent-default'],
                })
              }}
            />
          )}

          {/* 추출 옵션 */}
          {quick.photoExtraction?.enabled && (
            <div className="extraction-options">
              <div className="setting-group">
                <label>메인 색상 선택 기준</label>
                <Select
                  value={quick.photoExtraction.mapping.dominant}
                  onChange={(value) => onChange({
                    ...quick,
                    photoExtraction: {
                      ...quick.photoExtraction!,
                      mapping: {
                        ...quick.photoExtraction!.mapping,
                        dominant: value as any,
                      },
                    },
                  })}
                >
                  <SelectOption value="most-common">가장 많은 색상</SelectOption>
                  <SelectOption value="most-saturated">가장 선명한 색상</SelectOption>
                  <SelectOption value="lightest">가장 밝은 색상</SelectOption>
                  <SelectOption value="darkest">가장 어두운 색상</SelectOption>
                </Select>
              </div>

              {/* 조정 슬라이더 */}
              <div className="adjustment-sliders">
                <SliderField
                  label="채도 조정"
                  value={quick.photoExtraction.adjustments?.saturation || 0}
                  min={-100}
                  max={100}
                  onChange={(value) => onChange({
                    ...quick,
                    photoExtraction: {
                      ...quick.photoExtraction!,
                      adjustments: {
                        ...quick.photoExtraction!.adjustments,
                        saturation: value,
                      },
                    },
                  })}
                />
                <SliderField
                  label="밝기 조정"
                  value={quick.photoExtraction.adjustments?.brightness || 0}
                  min={-100}
                  max={100}
                  onChange={(value) => onChange({
                    ...quick,
                    photoExtraction: {
                      ...quick.photoExtraction!,
                      adjustments: {
                        ...quick.photoExtraction!.adjustments,
                        brightness: value,
                      },
                    },
                  })}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

### 8.5 추출된 팔레트 미리보기

```typescript
interface ExtractedPalettePreviewProps {
  palette: ExtractedPalette
  onApply: (tokens: Partial<SemanticTokens>) => void
}

function ExtractedPalettePreview({ palette, onApply }: ExtractedPalettePreviewProps) {
  return (
    <div className="extracted-palette-preview">
      {/* 추출된 색상 스와치 */}
      <div className="color-swatches">
        {palette.colors.slice(0, 6).map((color, i) => (
          <div
            key={i}
            className="color-swatch"
            style={{ background: color.hex }}
            title={`${color.hex} (${(color.population * 100).toFixed(1)}%)`}
          >
            <span className="population">{(color.population * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>

      {/* 대비 검증 결과 */}
      <div className="contrast-validation">
        {palette.contrastValidation.passesAA ? (
          <span className="validation-pass">✓ WCAG AA 충족</span>
        ) : (
          <span className="validation-fail">
            ⚠ 대비 부족
            <Tooltip content={palette.contrastValidation.suggestions?.join('\n')}>
              <InfoIcon />
            </Tooltip>
          </span>
        )}
      </div>

      {/* 미리보기 카드 */}
      <div
        className="preview-card"
        style={{
          background: palette.mappedTokens['bg-page'],
          color: palette.mappedTokens['fg-default'],
        }}
      >
        <h4 style={{ color: palette.mappedTokens['fg-emphasis'] }}>미리보기</h4>
        <p style={{ color: palette.mappedTokens['fg-muted'] }}>
          추출된 색상이 적용된 모습입니다.
        </p>
        <button
          style={{
            background: palette.mappedTokens['accent-default'],
            color: palette.mappedTokens['fg-on-accent'] || '#fff',
          }}
        >
          액션 버튼
        </button>
      </div>

      {/* 적용 버튼 */}
      <Button onClick={() => onApply(palette.mappedTokens)}>
        이 색상 적용하기
      </Button>

      {/* 처리 시간 */}
      <span className="processing-time">
        {palette.meta.processingTime.toFixed(0)}ms
      </span>
    </div>
  )
}
```

### 8.6 Level 3: AdvancedPanel

```typescript
interface AdvancedPanelProps {
  advanced?: AdvancedStyleConfig
  basePreset?: ThemePresetId
  onChange: (advanced: AdvancedStyleConfig) => void
}

function AdvancedPanel({ advanced, basePreset, onChange }: AdvancedPanelProps) {
  // 프리셋 기반 기본값
  const baseTokens = basePreset
    ? THEME_PRESETS[basePreset].tokens
    : DEFAULT_TOKENS

  const currentTokens = advanced?.tokens || baseTokens
  const currentPalette = advanced?.palette || []

  return (
    <div className="advanced-panel">
      {/* 경고 메시지 */}
      <div className="advanced-warning">
        <InfoIcon />
        <span>고급 설정을 변경하면 프리셋과 빠른 설정이 무시됩니다.</span>
      </div>

      {/* 팔레트 편집 */}
      <div className="palette-editor">
        <h4>팔레트</h4>
        <p className="description">원시 색상 정의. 시맨틱 토큰에서 참조됩니다.</p>

        {currentPalette.map((color, i) => (
          <PaletteColorEditor
            key={color.id}
            color={color}
            onChange={(updated) => {
              const newPalette = [...currentPalette]
              newPalette[i] = updated
              onChange({ ...advanced!, palette: newPalette })
            }}
            onRemove={() => {
              const newPalette = currentPalette.filter((_, idx) => idx !== i)
              onChange({ ...advanced!, palette: newPalette })
            }}
          />
        ))}

        <Button
          variant="outline"
          onClick={() => {
            const newColor: PaletteColor = {
              id: `color-${Date.now()}`,
              value: '#888888',
            }
            onChange({
              ...advanced!,
              palette: [...currentPalette, newColor],
            })
          }}
        >
          + 색상 추가
        </Button>
      </div>

      {/* 시맨틱 토큰 편집 */}
      <div className="tokens-editor">
        <h4>시맨틱 토큰</h4>
        <p className="description">역할별 색상 매핑. 컴포넌트가 이 토큰을 참조합니다.</p>

        <Tabs defaultValue="background">
          <TabList>
            <Tab value="background">배경</Tab>
            <Tab value="foreground">전경</Tab>
            <Tab value="accent">강조</Tab>
            <Tab value="border">보더</Tab>
          </TabList>

          <TabContent value="background">
            <TokenGroup
              tokens={['bg-page', 'bg-section', 'bg-section-alt', 'bg-card', 'bg-overlay']}
              values={currentTokens}
              onChange={(key, value) => {
                onChange({
                  ...advanced!,
                  tokens: { ...currentTokens, [key]: value },
                })
              }}
            />
          </TabContent>

          <TabContent value="foreground">
            <TokenGroup
              tokens={['fg-default', 'fg-muted', 'fg-emphasis', 'fg-inverse', 'fg-on-accent']}
              values={currentTokens}
              onChange={(key, value) => {
                onChange({
                  ...advanced!,
                  tokens: { ...currentTokens, [key]: value },
                })
              }}
            />
          </TabContent>

          <TabContent value="accent">
            <TokenGroup
              tokens={['accent-default', 'accent-hover', 'accent-active', 'accent-secondary']}
              values={currentTokens}
              onChange={(key, value) => {
                onChange({
                  ...advanced!,
                  tokens: { ...currentTokens, [key]: value },
                })
              }}
            />
          </TabContent>

          <TabContent value="border">
            <TokenGroup
              tokens={['border-default', 'border-emphasis', 'border-muted']}
              values={currentTokens}
              onChange={(key, value) => {
                onChange({
                  ...advanced!,
                  tokens: { ...currentTokens, [key]: value },
                })
              }}
            />
          </TabContent>
        </Tabs>
      </div>

      {/* 그라데이션 토큰 */}
      <div className="gradient-tokens">
        <h4>그라데이션</h4>
        <GradientEditor
          label="Hero 그라데이션"
          value={currentTokens['gradient-hero']}
          onChange={(gradient) => {
            onChange({
              ...advanced!,
              tokens: { ...currentTokens, 'gradient-hero': gradient },
            })
          }}
        />
        <GradientEditor
          label="Accent 그라데이션"
          value={currentTokens['gradient-accent']}
          onChange={(gradient) => {
            onChange({
              ...advanced!,
              tokens: { ...currentTokens, 'gradient-accent': gradient },
            })
          }}
        />
      </div>

      {/* 블록별 오버라이드 */}
      <div className="block-overrides">
        <h4>블록별 테마</h4>
        <p className="description">특정 블록의 테마를 다르게 설정합니다.</p>

        <BlockOverrideList
          overrides={advanced?.blockOverrides || {}}
          onChange={(blockOverrides) => {
            onChange({ ...advanced!, blockOverrides })
          }}
        />
      </div>

      {/* 초기화 버튼 */}
      <div className="advanced-actions">
        <Button
          variant="outline"
          onClick={() => {
            if (confirm('고급 설정을 초기화하시겠습니까?')) {
              onChange(undefined as any)
            }
          }}
        >
          프리셋으로 초기화
        </Button>
      </div>
    </div>
  )
}
```

### 8.7 TokenGroup 컴포넌트

```typescript
interface TokenGroupProps {
  tokens: string[]
  values: SemanticTokens
  onChange: (key: string, value: string | GradientValue) => void
}

const TOKEN_LABELS: Record<string, string> = {
  'bg-page': '페이지 배경',
  'bg-section': '섹션 배경',
  'bg-section-alt': '대체 섹션 배경',
  'bg-card': '카드 배경',
  'bg-overlay': '오버레이',
  'fg-default': '기본 텍스트',
  'fg-muted': '보조 텍스트',
  'fg-emphasis': '강조 텍스트',
  'fg-inverse': '반전 텍스트',
  'fg-on-accent': '액센트 위 텍스트',
  'accent-default': '기본 액센트',
  'accent-hover': '호버 액센트',
  'accent-active': '활성 액센트',
  'accent-secondary': '보조 액센트',
  'border-default': '기본 보더',
  'border-emphasis': '강조 보더',
  'border-muted': '보조 보더',
}

function TokenGroup({ tokens, values, onChange }: TokenGroupProps) {
  return (
    <div className="token-group">
      {tokens.map(token => (
        <div key={token} className="token-row">
          <label>{TOKEN_LABELS[token] || token}</label>
          <ColorPicker
            value={values[token as keyof SemanticTokens] as string}
            onChange={(color) => onChange(token, color)}
            showGradient={token.includes('gradient')}
          />
        </div>
      ))}
    </div>
  )
}
```

### 8.8 GradientEditor 컴포넌트

```typescript
interface GradientEditorProps {
  label: string
  value?: GradientValue
  onChange: (gradient: GradientValue | undefined) => void
}

function GradientEditor({ label, value, onChange }: GradientEditorProps) {
  const [enabled, setEnabled] = useState(!!value)

  const handleToggle = (checked: boolean) => {
    setEnabled(checked)
    if (!checked) {
      onChange(undefined)
    } else {
      onChange({
        type: 'linear',
        angle: 180,
        stops: [
          { color: '#000000', position: 0 },
          { color: '#ffffff', position: 100 },
        ],
      })
    }
  }

  return (
    <div className="gradient-editor">
      <div className="gradient-header">
        <label>{label}</label>
        <Toggle checked={enabled} onChange={handleToggle} />
      </div>

      {enabled && value && (
        <div className="gradient-controls">
          {/* 타입 선택 */}
          <Select
            value={value.type}
            onChange={(type) => onChange({ ...value, type: type as GradientValue['type'] })}
          >
            <SelectOption value="linear">선형</SelectOption>
            <SelectOption value="radial">방사형</SelectOption>
            <SelectOption value="conic">원뿔형</SelectOption>
          </Select>

          {/* 각도 (linear만) */}
          {value.type === 'linear' && (
            <SliderField
              label="각도"
              value={value.angle || 180}
              min={0}
              max={360}
              onChange={(angle) => onChange({ ...value, angle })}
            />
          )}

          {/* 그라데이션 스톱 */}
          <div className="gradient-stops">
            {value.stops.map((stop, i) => (
              <div key={i} className="stop-row">
                <ColorPicker
                  value={stop.color}
                  onChange={(color) => {
                    const newStops = [...value.stops]
                    newStops[i] = { ...stop, color }
                    onChange({ ...value, stops: newStops })
                  }}
                />
                <SliderField
                  label="위치"
                  value={stop.position}
                  min={0}
                  max={100}
                  onChange={(position) => {
                    const newStops = [...value.stops]
                    newStops[i] = { ...stop, position }
                    onChange({ ...value, stops: newStops })
                  }}
                />
                {value.stops.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newStops = value.stops.filter((_, idx) => idx !== i)
                      onChange({ ...value, stops: newStops })
                    }}
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newStops = [
                  ...value.stops,
                  { color: '#888888', position: 50 },
                ]
                onChange({ ...value, stops: newStops })
              }}
            >
              + 스톱 추가
            </Button>
          </div>

          {/* 미리보기 */}
          <div
            className="gradient-preview"
            style={{ background: gradientToCSS(value) }}
          />
        </div>
      )}
    </div>
  )
}
```

### 8.9 TypographySettings

```typescript
interface TypographySettingsProps {
  typography: TypographyConfig
  onChange: (typography: TypographyConfig) => void
}

function TypographySettings({ typography, onChange }: TypographySettingsProps) {
  return (
    <div className="typography-settings">
      {/* 프리셋 선택 */}
      <div className="setting-group">
        <label>폰트 프리셋</label>
        <Select
          value={typography.preset || 'custom'}
          onChange={(preset) => {
            if (preset === 'custom') {
              onChange({ ...typography, preset: undefined })
            } else {
              onChange({ preset: preset as TypographyPresetId })
            }
          }}
        >
          <SelectOption value="elegant-serif">우아한 세리프</SelectOption>
          <SelectOption value="modern-sans">모던 산세리프</SelectOption>
          <SelectOption value="handwritten-romantic">로맨틱 손글씨</SelectOption>
          <SelectOption value="minimal-clean">미니멀 클린</SelectOption>
          <SelectOption value="custom">직접 설정</SelectOption>
        </Select>
      </div>

      {/* 커스텀 설정 */}
      {!typography.preset && (
        <>
          <div className="setting-group">
            <label>제목 폰트</label>
            <FontSelector
              value={typography.custom?.fontStacks?.heading}
              onChange={(fontStack) => onChange({
                ...typography,
                custom: {
                  ...typography.custom!,
                  fontStacks: {
                    ...typography.custom?.fontStacks,
                    heading: fontStack,
                  },
                },
              })}
            />
          </div>

          <div className="setting-group">
            <label>본문 폰트</label>
            <FontSelector
              value={typography.custom?.fontStacks?.body}
              onChange={(fontStack) => onChange({
                ...typography,
                custom: {
                  ...typography.custom!,
                  fontStacks: {
                    ...typography.custom?.fontStacks,
                    body: fontStack,
                  },
                },
              })}
            />
          </div>
        </>
      )}
    </div>
  )
}
```

### 8.10 색상 프리셋

```typescript
const COLOR_PRESETS = {
  dominant: [
    { value: '#FDFBF7', label: '아이보리' },
    { value: '#FFFFFF', label: '화이트' },
    { value: '#1A1A1A', label: '블랙' },
    { value: '#F5F0E8', label: '크림' },
    { value: '#E8E4DD', label: '베이지' },
    { value: '#2C3E50', label: '네이비' },
  ],
  accent: [
    { value: '#C9A962', label: '골드' },
    { value: '#8B7355', label: '브라운' },
    { value: '#B76E79', label: '로즈' },
    { value: '#6B8E6B', label: '세이지' },
    { value: '#7B9BAB', label: '스틸블루' },
    { value: '#9B8AA3', label: '라벤더' },
  ],
}
```

---

## 9. 공유 탭

### 9.1 OG 메타데이터 에디터

```typescript
function ShareTab({ documentId }: { documentId: string }) {
  const [ogData, setOgData] = useState<OgMetadata | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const captureIntroAsOgImage = async () => {
    setIsCapturing(true)
    try {
      // html2canvas로 인트로 캡처
      const introElement = document.querySelector('[data-block-type="intro"]')
      if (!introElement) return

      const canvas = await html2canvas(introElement, {
        width: 1200,
        height: 630,
        scale: 2,
      })

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.9)
      })

      // Supabase Storage 업로드
      const url = await uploadOgImage(documentId, blob)
      setOgData(prev => ({ ...prev!, ogImageUrl: url }))
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <div className="share-tab">
      <h3>공유 미리보기</h3>

      {/* OG 이미지 미리보기 */}
      <div className="og-preview">
        {ogData?.ogImageUrl ? (
          <img src={ogData.ogImageUrl} alt="OG 이미지" />
        ) : (
          <div className="placeholder">
            OG 이미지가 없습니다
          </div>
        )}
        <Button onClick={captureIntroAsOgImage} disabled={isCapturing}>
          {isCapturing ? '캡처 중...' : '인트로 이미지로 설정'}
        </Button>
      </div>

      {/* OG 제목 */}
      <TextInput
        label="공유 제목"
        value={ogData?.ogTitle || ''}
        onChange={(v) => setOgData(prev => ({ ...prev!, ogTitle: v }))}
        placeholder="철수 ♥ 영희 결혼합니다"
      />

      {/* OG 설명 */}
      <Textarea
        label="공유 설명"
        value={ogData?.ogDescription || ''}
        onChange={(v) => setOgData(prev => ({ ...prev!, ogDescription: v }))}
        placeholder="2025년 3월 15일 토요일 오후 2시"
        rows={2}
      />

      {/* 공유 URL */}
      <div className="share-url">
        <label>공유 링크</label>
        <div className="url-row">
          <input
            type="text"
            value={`https://maisondeletter.com/se/${documentId}`}
            readOnly
          />
          <Button onClick={() => navigator.clipboard.writeText(`https://maisondeletter.com/se/${documentId}`)}>
            복사
          </Button>
        </div>
      </div>

      {/* 공유 버튼들 */}
      <div className="share-buttons">
        <Button onClick={() => shareToKakao(documentId)}>
          카카오톡 공유
        </Button>
        <Button onClick={() => shareToSms(documentId)}>
          문자 공유
        </Button>
      </div>
    </div>
  )
}
```

---

## 10. 상태 관리

### 10.1 EditorContext

```typescript
interface EditorState {
  document: EditorDocument
  selectedBlockId: string | null
  selectedElementId: string | null        // 추가: 요소 선택
  activeTab: 'content' | 'design' | 'share'
  editMode: 'form' | 'direct'             // 추가: 편집 모드
  contextMenu: ContextMenuState | null    // 추가: 컨텍스트 메뉴
  isDirty: boolean
  isLoading: boolean
  history: EditorDocument[]
  historyIndex: number
}

type EditorAction =
  | { type: 'SET_DOCUMENT'; document: EditorDocument }
  | { type: 'SELECT_BLOCK'; blockId: string | null }
  | { type: 'SELECT_ELEMENT'; elementId: string | null }  // 추가
  | { type: 'SET_TAB'; tab: 'content' | 'design' | 'share' }
  | { type: 'SET_EDIT_MODE'; mode: 'form' | 'direct' }    // 추가
  | { type: 'UPDATE_DATA'; path: string; value: unknown }
  | { type: 'UPDATE_BLOCK'; blockId: string; updates: Partial<Block> }
  | { type: 'UPDATE_ELEMENT'; blockId: string; elementId: string; updates: Partial<Element> }  // 추가
  | { type: 'UPDATE_STYLE'; style: GlobalStyle }
  | { type: 'APPLY_PATCHES'; patches: JsonPatch[] }
  | { type: 'SHOW_CONTEXT_MENU'; context: ContextMenuState }  // 추가
  | { type: 'HIDE_CONTEXT_MENU' }                             // 추가
  | { type: 'DUPLICATE_ELEMENT'; blockId: string; elementId: string }  // 추가
  | { type: 'DELETE_ELEMENT'; blockId: string; elementId: string }     // 추가
  | { type: 'UNDO' }
  | { type: 'REDO' }

const EditorContext = createContext<{
  state: EditorState
  dispatch: Dispatch<EditorAction>
} | null>(null)

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_DOCUMENT':
      return {
        ...state,
        document: action.document,
        isDirty: false,
        history: [action.document],
        historyIndex: 0,
      }

    case 'SELECT_BLOCK':
      return { ...state, selectedBlockId: action.blockId, selectedElementId: null }

    case 'SELECT_ELEMENT':
      return { ...state, selectedElementId: action.elementId }

    case 'SET_TAB':
      return { ...state, activeTab: action.tab }

    case 'SET_EDIT_MODE':
      return { ...state, editMode: action.mode }

    case 'UPDATE_DATA': {
      const newDocument = {
        ...state.document,
        data: setValueByPath(state.document.data, action.path, action.value),
      }
      return pushHistory(state, newDocument)
    }

    case 'UPDATE_BLOCK': {
      const newDocument = {
        ...state.document,
        blocks: state.document.blocks.map(b =>
          b.id === action.blockId ? { ...b, ...action.updates } : b
        ),
      }
      return pushHistory(state, newDocument)
    }

    case 'UPDATE_ELEMENT': {
      const newDocument = {
        ...state.document,
        blocks: state.document.blocks.map(block =>
          block.id === action.blockId
            ? {
                ...block,
                elements: block.elements.map(el =>
                  el.id === action.elementId
                    ? { ...el, ...action.updates }
                    : el
                )
              }
            : block
        ),
      }
      return pushHistory(state, newDocument)
    }

    case 'SHOW_CONTEXT_MENU':
      return { ...state, contextMenu: action.context }

    case 'HIDE_CONTEXT_MENU':
      return { ...state, contextMenu: null }

    case 'DUPLICATE_ELEMENT': {
      const block = state.document.blocks.find(b => b.id === action.blockId)
      const element = block?.elements.find(e => e.id === action.elementId)
      if (!block || !element) return state

      const newElement = {
        ...element,
        id: `${element.id}-copy-${Date.now()}`,
        x: element.x + 2,  // 약간 오프셋
        y: element.y + 2,
      }

      const newDocument = {
        ...state.document,
        blocks: state.document.blocks.map(b =>
          b.id === action.blockId
            ? { ...b, elements: [...b.elements, newElement] }
            : b
        ),
      }
      return pushHistory(state, newDocument)
    }

    case 'DELETE_ELEMENT': {
      const newDocument = {
        ...state.document,
        blocks: state.document.blocks.map(block =>
          block.id === action.blockId
            ? {
                ...block,
                elements: block.elements.filter(el => el.id !== action.elementId)
              }
            : block
        ),
      }
      return {
        ...pushHistory(state, newDocument),
        selectedElementId: null,
      }
    }

    case 'UPDATE_STYLE': {
      const newDocument = { ...state.document, style: action.style }
      return pushHistory(state, newDocument)
    }

    case 'APPLY_PATCHES': {
      const newDocument = applyJsonPatches(state.document, action.patches)
      return pushHistory(state, newDocument)
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state
      return {
        ...state,
        document: state.history[state.historyIndex - 1],
        historyIndex: state.historyIndex - 1,
        isDirty: true,
      }
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state
      return {
        ...state,
        document: state.history[state.historyIndex + 1],
        historyIndex: state.historyIndex + 1,
        isDirty: true,
      }
    }

    default:
      return state
  }
}

function pushHistory(state: EditorState, newDocument: EditorDocument): EditorState {
  const newHistory = state.history.slice(0, state.historyIndex + 1)
  newHistory.push(newDocument)

  // 히스토리 크기 제한 (50개)
  if (newHistory.length > 50) {
    newHistory.shift()
  }

  return {
    ...state,
    document: newDocument,
    isDirty: true,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  }
}
```

### 10.2 커스텀 훅

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

function useAIEdit() {
  const { state, dispatch } = useEditor()
  const [isLoading, setIsLoading] = useState(false)

  const submitPrompt = useCallback(async (prompt: string) => {
    setIsLoading(true)
    try {
      // ID 참조를 포함한 컨텍스트 빌드
      const context = buildAIContextWithReferences(
        state.document,
        prompt,
        state.selectedBlockId,
        state.selectedElementId
      )
      const response = await callAI(context, prompt)

      if (response.patches) {
        dispatch({ type: 'APPLY_PATCHES', patches: response.patches })
      }
    } finally {
      setIsLoading(false)
    }
  }, [state.document, state.selectedBlockId, state.selectedElementId, dispatch])

  return { submitPrompt, isLoading }
}

function useSelectedElement() {
  const { state } = useEditor()
  if (!state.selectedElementId) return null

  for (const block of state.document.blocks) {
    const element = block.elements.find(e => e.id === state.selectedElementId)
    if (element) return { element, block }
  }
  return null
}

function useElementUpdate() {
  const { state, dispatch } = useEditor()

  return useCallback((elementId: string, updates: Partial<Element>) => {
    // 해당 요소가 속한 블록 찾기
    const block = state.document.blocks.find(b =>
      b.elements.some(e => e.id === elementId)
    )
    if (!block) return

    dispatch({
      type: 'UPDATE_ELEMENT',
      blockId: block.id,
      elementId,
      updates,
    })
  }, [state.document.blocks, dispatch])
}

function useContextMenu() {
  const { state, dispatch } = useEditor()

  return {
    state: state.contextMenu,
    show: (context: ContextMenuState) => dispatch({ type: 'SHOW_CONTEXT_MENU', context }),
    hide: () => dispatch({ type: 'HIDE_CONTEXT_MENU' }),
  }
}
```

### 10.3 영속성 관리 (Persistence)

현재 히스토리는 메모리에만 저장되어 브라우저를 닫으면 사라집니다.
IndexedDB와 LocalStorage를 활용하여 임시 저장 및 복구 기능을 제공합니다.

#### 저장 전략

| 저장소 | 용도 | 특징 |
|--------|------|------|
| **IndexedDB** | 전체 문서 + 히스토리 스냅샷 | 대용량 (50MB+), 비동기, 구조화 |
| **LocalStorage** | 마지막 편집 위치, UI 설정 | 5MB 제한, 동기, 단순 |
| **서버 (Postgres)** | 최종 저장본 | 영구 저장, 공유 가능 |

#### 저장 흐름

```
편집 발생
    ↓
Debounce (1초)
    ↓
IndexedDB 저장 (임시) ──────────────────┐
                                        │
                        [저장] 버튼 클릭 또는 Cmd+S
                                        ↓
                                서버 저장 (영구)
                                        ↓
                              IndexedDB isDirty = false
```

**핵심 원칙**:
- **임시 저장**: 자동 (1초 디바운스)
- **서버 저장**: 명시적 ([저장] 버튼 또는 `Cmd+S`)

#### IndexedDB 스키마

```typescript
// DB 이름: 'super-editor-v2'
// 버전: 1

interface EditorDB {
  // Object Store: 'drafts'
  drafts: {
    key: string              // documentId
    value: DraftDocument
  }

  // Object Store: 'history'
  history: {
    key: [string, number]    // [documentId, historyIndex]
    value: HistorySnapshot
  }

  // Object Store: 'settings'
  settings: {
    key: string              // 설정 키
    value: unknown
  }
}

interface DraftDocument {
  documentId: string
  document: EditorDocument
  historyIndex: number
  lastModified: number       // timestamp
  isDirty: boolean
  serverVersion: number      // 서버와 동기화된 버전
}

interface HistorySnapshot {
  documentId: string
  index: number
  document: EditorDocument
  timestamp: number
  action: string             // 어떤 액션으로 생성되었는지
}
```

#### IndexedDB 유틸리티

```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface SuperEditorDB extends DBSchema {
  drafts: {
    key: string
    value: DraftDocument
  }
  history: {
    key: [string, number]
    value: HistorySnapshot
    indexes: { 'by-document': string }
  }
  settings: {
    key: string
    value: unknown
  }
}

let dbPromise: Promise<IDBPDatabase<SuperEditorDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<SuperEditorDB>('super-editor-v2', 1, {
      upgrade(db) {
        // drafts store
        db.createObjectStore('drafts', { keyPath: 'documentId' })

        // history store
        const historyStore = db.createObjectStore('history', {
          keyPath: ['documentId', 'index']
        })
        historyStore.createIndex('by-document', 'documentId')

        // settings store
        db.createObjectStore('settings')
      },
    })
  }
  return dbPromise
}

// 임시 저장
async function saveDraft(draft: DraftDocument): Promise<void> {
  const db = await getDB()
  await db.put('drafts', draft)
}

// 임시 저장본 불러오기
async function loadDraft(documentId: string): Promise<DraftDocument | undefined> {
  const db = await getDB()
  return db.get('drafts', documentId)
}

// 임시 저장본 삭제
async function deleteDraft(documentId: string): Promise<void> {
  const db = await getDB()
  await db.delete('drafts', documentId)

  // 관련 히스토리도 삭제
  const tx = db.transaction('history', 'readwrite')
  const index = tx.store.index('by-document')
  let cursor = await index.openCursor(documentId)
  while (cursor) {
    await cursor.delete()
    cursor = await cursor.continue()
  }
}

// 히스토리 스냅샷 저장 (최대 50개 유지)
async function saveHistorySnapshot(snapshot: HistorySnapshot): Promise<void> {
  const db = await getDB()
  await db.put('history', snapshot)

  // 오래된 스냅샷 정리
  const tx = db.transaction('history', 'readwrite')
  const index = tx.store.index('by-document')
  const snapshots = await index.getAll(snapshot.documentId)

  if (snapshots.length > 50) {
    // 오래된 것부터 삭제
    const toDelete = snapshots
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, snapshots.length - 50)

    for (const s of toDelete) {
      await tx.store.delete([s.documentId, s.index])
    }
  }
}

// 히스토리 스냅샷 불러오기
async function loadHistorySnapshots(documentId: string): Promise<HistorySnapshot[]> {
  const db = await getDB()
  const index = db.transaction('history').store.index('by-document')
  const snapshots = await index.getAll(documentId)
  return snapshots.sort((a, b) => a.index - b.index)
}
```

#### LocalStorage 유틸리티

```typescript
const STORAGE_KEYS = {
  LAST_DOCUMENT: 'se-last-document',
  UI_SETTINGS: 'se-ui-settings',
  EDIT_MODE: 'se-edit-mode',
} as const

interface UISettings {
  activeTab: 'content' | 'design' | 'share'
  editMode: 'form' | 'direct'
  expandedSections: string[]
}

function saveUISettings(documentId: string, settings: UISettings): void {
  try {
    localStorage.setItem(
      `${STORAGE_KEYS.UI_SETTINGS}:${documentId}`,
      JSON.stringify(settings)
    )
  } catch (e) {
    console.warn('Failed to save UI settings:', e)
  }
}

function loadUISettings(documentId: string): UISettings | null {
  try {
    const data = localStorage.getItem(`${STORAGE_KEYS.UI_SETTINGS}:${documentId}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function saveLastDocument(documentId: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_DOCUMENT, documentId)
  } catch (e) {
    console.warn('Failed to save last document:', e)
  }
}

function getLastDocument(): string | null {
  return localStorage.getItem(STORAGE_KEYS.LAST_DOCUMENT)
}
```

#### useAutoSave 훅 (IndexedDB 자동 저장)

```typescript
interface AutoSaveOptions {
  debounceMs?: number  // 임시 저장 디바운스 (기본: 1000ms)
}

function useAutoSave(options: AutoSaveOptions = {}) {
  const { debounceMs = 1000 } = options
  const { state } = useEditor()
  const lastSavedRef = useRef<string>('')

  // 문서 변경 감지 → IndexedDB 저장 (자동)
  useEffect(() => {
    if (!state.isDirty) return

    const documentHash = JSON.stringify(state.document)
    if (documentHash === lastSavedRef.current) return

    const timeoutId = setTimeout(async () => {
      await saveDraft({
        documentId: state.document.id,
        document: state.document,
        historyIndex: state.historyIndex,
        lastModified: Date.now(),
        isDirty: true,
        serverVersion: state.document.version,
      })

      // 현재 히스토리 스냅샷도 저장
      await saveHistorySnapshot({
        documentId: state.document.id,
        index: state.historyIndex,
        document: state.document,
        timestamp: Date.now(),
        action: 'auto-save',
      })

      lastSavedRef.current = documentHash
      console.log('[AutoSave] Draft saved to IndexedDB')
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [state.document, state.isDirty, state.historyIndex, debounceMs])
}
```

#### useSaveToServer 훅 (명시적 서버 저장)

```typescript
interface SaveToServerResult {
  isSaving: boolean
  lastSavedAt: Date | null
  save: () => Promise<void>
  error: Error | null
}

function useSaveToServer(
  saveFunction: (document: EditorDocument) => Promise<void>
): SaveToServerResult {
  const { state, dispatch } = useEditor()
  const [isSaving, setIsSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const save = useCallback(async () => {
    if (isSaving) return

    setIsSaving(true)
    setError(null)

    try {
      await saveFunction(state.document)

      // 서버 저장 성공 시 IndexedDB의 isDirty를 false로
      await saveDraft({
        documentId: state.document.id,
        document: state.document,
        historyIndex: state.historyIndex,
        lastModified: Date.now(),
        isDirty: false,
        serverVersion: state.document.version + 1,
      })

      // 상태 업데이트
      dispatch({ type: 'MARK_SAVED' })
      setLastSavedAt(new Date())

      console.log('[Save] Saved to server')
    } catch (e) {
      setError(e as Error)
      console.error('[Save] Server save failed:', e)
      throw e
    } finally {
      setIsSaving(false)
    }
  }, [state.document, state.historyIndex, isSaving, saveFunction, dispatch])

  return { isSaving, lastSavedAt, save, error }
}
```

#### 저장 버튼 컴포넌트

```typescript
function SaveButton() {
  const { state } = useEditor()
  const { isSaving, lastSavedAt, save, error } = useSaveToServer(
    (doc) => saveDocumentToServer(doc)
  )

  return (
    <div className="save-button-container">
      <Button
        onClick={save}
        disabled={!state.isDirty || isSaving}
        variant={state.isDirty ? 'default' : 'outline'}
      >
        {isSaving ? (
          <>
            <Spinner className="mr-2" />
            저장 중...
          </>
        ) : state.isDirty ? (
          <>
            <SaveIcon className="mr-2" />
            저장
          </>
        ) : (
          <>
            <CheckIcon className="mr-2" />
            저장됨
          </>
        )}
      </Button>

      {/* 마지막 저장 시간 */}
      {lastSavedAt && !state.isDirty && (
        <span className="text-xs text-muted-foreground ml-2">
          {formatDistanceToNow(lastSavedAt, { addSuffix: true, locale: ko })}
        </span>
      )}

      {/* 에러 표시 */}
      {error && (
        <span className="text-xs text-destructive ml-2">
          저장 실패. 다시 시도해주세요.
        </span>
      )}
    </div>
  )
}
```

#### EditorAction 추가 (MARK_SAVED)

```typescript
type EditorAction =
  // 기존 액션들...
  | { type: 'MARK_SAVED' }

// reducer에 추가
case 'MARK_SAVED':
  return {
    ...state,
    isDirty: false,
  }
```

#### usePersistence 훅 (초기화 + 복구)

```typescript
interface PersistenceResult {
  isLoading: boolean
  hasDraft: boolean
  draftInfo: {
    lastModified: Date
    isDirty: boolean
  } | null
  restoreDraft: () => Promise<void>
  discardDraft: () => Promise<void>
}

function usePersistence(documentId: string): PersistenceResult {
  const { dispatch } = useEditor()
  const [isLoading, setIsLoading] = useState(true)
  const [draftInfo, setDraftInfo] = useState<PersistenceResult['draftInfo']>(null)

  // 초기 로드 시 임시 저장본 확인
  useEffect(() => {
    async function checkDraft() {
      setIsLoading(true)
      try {
        const draft = await loadDraft(documentId)

        if (draft && draft.isDirty) {
          setDraftInfo({
            lastModified: new Date(draft.lastModified),
            isDirty: draft.isDirty,
          })
        } else {
          setDraftInfo(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkDraft()
  }, [documentId])

  // UI 설정 복원
  useEffect(() => {
    const settings = loadUISettings(documentId)
    if (settings) {
      dispatch({ type: 'SET_TAB', tab: settings.activeTab })
      dispatch({ type: 'SET_EDIT_MODE', mode: settings.editMode })
    }
  }, [documentId, dispatch])

  // 임시 저장본 복원
  const restoreDraft = useCallback(async () => {
    const draft = await loadDraft(documentId)
    if (!draft) return

    // 히스토리도 복원
    const snapshots = await loadHistorySnapshots(documentId)
    const historyDocs = snapshots.map(s => s.document)

    dispatch({
      type: 'RESTORE_FROM_DRAFT',
      document: draft.document,
      history: historyDocs.length > 0 ? historyDocs : [draft.document],
      historyIndex: draft.historyIndex,
    })

    setDraftInfo(null)
  }, [documentId, dispatch])

  // 임시 저장본 삭제
  const discardDraft = useCallback(async () => {
    await deleteDraft(documentId)
    setDraftInfo(null)
  }, [documentId])

  return {
    isLoading,
    hasDraft: draftInfo !== null,
    draftInfo,
    restoreDraft,
    discardDraft,
  }
}
```

#### 복구 다이얼로그 컴포넌트

```typescript
function DraftRecoveryDialog({
  draftInfo,
  onRestore,
  onDiscard,
}: {
  draftInfo: { lastModified: Date; isDirty: boolean }
  onRestore: () => void
  onDiscard: () => void
}) {
  const timeAgo = formatDistanceToNow(draftInfo.lastModified, {
    addSuffix: true,
    locale: ko,
  })

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>저장되지 않은 변경사항</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground">
          {timeAgo}에 저장되지 않은 변경사항이 있습니다.
          복원하시겠습니까?
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={onDiscard}>
            삭제하고 서버 버전 사용
          </Button>
          <Button onClick={onRestore}>
            변경사항 복원
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

#### EditorAction 추가

```typescript
type EditorAction =
  // 기존 액션들...
  | {
      type: 'RESTORE_FROM_DRAFT'
      document: EditorDocument
      history: EditorDocument[]
      historyIndex: number
    }

// reducer에 추가
case 'RESTORE_FROM_DRAFT':
  return {
    ...state,
    document: action.document,
    history: action.history,
    historyIndex: action.historyIndex,
    isDirty: true,
  }
```

#### 페이지 이탈 경고

```typescript
function useBeforeUnload() {
  const { state } = useEditor()

  useEffect(() => {
    if (!state.isDirty) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''  // Chrome requires returnValue to be set
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [state.isDirty])
}
```

#### 사용 예시

```typescript
function EditorPage({ documentId }: { documentId: string }) {
  const { state, dispatch } = useEditor()
  const { isLoading, hasDraft, draftInfo, restoreDraft, discardDraft } =
    usePersistence(documentId)

  // IndexedDB 자동 저장 (1초 디바운스)
  useAutoSave({ debounceMs: 1000 })

  // 서버 저장 (명시적)
  const { isSaving, lastSavedAt, save, error } = useSaveToServer(
    async () => {
      await saveDocumentToServer(documentId, state.document)
      dispatch({ type: 'MARK_SAVED' })
    }
  )

  // 페이지 이탈 경고
  useBeforeUnload()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <>
      {hasDraft && draftInfo && (
        <DraftRecoveryDialog
          draftInfo={draftInfo}
          onRestore={restoreDraft}
          onDiscard={discardDraft}
        />
      )}

      <EditorLayout documentId={documentId}>
        {/* 헤더에 저장 버튼 배치 */}
        <SaveButton
          isDirty={state.isDirty}
          isSaving={isSaving}
          lastSavedAt={lastSavedAt}
          onSave={save}
          error={error}
        />
      </EditorLayout>
    </>
  )
}
```

---

## 11. 키보드 단축키

```typescript
const KEYBOARD_SHORTCUTS = {
  'mod+z': 'undo',
  'mod+shift+z': 'redo',
  'mod+s': 'save',
  'escape': 'deselect',
  'delete': 'deleteSelected',
  'mod+d': 'duplicateSelected',
  'mod+1': 'tab:content',
  'mod+2': 'tab:design',
  'mod+3': 'tab:share',
}

interface KeyboardShortcutsOptions {
  onSave?: () => void
}

function useKeyboardShortcuts({ onSave }: KeyboardShortcutsOptions = {}) {
  const { dispatch } = useEditor()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = getShortcutKey(e)
      const action = KEYBOARD_SHORTCUTS[key]

      if (!action) return

      e.preventDefault()

      switch (action) {
        case 'undo':
          dispatch({ type: 'UNDO' })
          break
        case 'redo':
          dispatch({ type: 'REDO' })
          break
        case 'save':
          // 서버 저장은 외부에서 주입된 콜백 사용
          onSave?.()
          break
        case 'deselect':
          dispatch({ type: 'SELECT_BLOCK', blockId: null })
          break
        case 'tab:content':
          dispatch({ type: 'SET_TAB', tab: 'content' })
          break
        case 'tab:design':
          dispatch({ type: 'SET_TAB', tab: 'design' })
          break
        case 'tab:share':
          dispatch({ type: 'SET_TAB', tab: 'share' })
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch, onSave])
}

// 사용 예시
function EditorWithShortcuts() {
  const { save } = useSaveToServer(/* ... */)

  useKeyboardShortcuts({ onSave: save })
  // ...
}
```

---

## 12. 컴포넌트 디렉토리 구조

```
src/lib/super-editor-v2/
├── components/
│   ├── editor/
│   │   ├── EditorLayout.tsx        # 메인 레이아웃
│   │   ├── EditorTabs.tsx          # 탭 컨테이너
│   │   ├── ContentTab.tsx          # 콘텐츠 탭
│   │   ├── DesignTab.tsx           # 디자인 탭 (3-Level 스타일)
│   │   ├── ShareTab.tsx            # 공유 탭
│   │   ├── SectionAccordion.tsx    # 섹션 아코디언
│   │   └── AIPromptInput.tsx       # AI 프롬프트 입력
│   │
│   ├── style/                      # 스타일 시스템 UI (NEW)
│   │   ├── PresetSelector.tsx      # Level 1: 테마 프리셋 선택기
│   │   ├── QuickSettings.tsx       # Level 2: 빠른 설정
│   │   ├── AdvancedPanel.tsx       # Level 3: 고급 설정
│   │   ├── TokenGroup.tsx          # 시맨틱 토큰 그룹 편집
│   │   ├── PaletteColorEditor.tsx  # 팔레트 색상 편집
│   │   ├── GradientEditor.tsx      # 그라데이션 편집기
│   │   ├── ColorPicker.tsx         # 색상 선택기 + 프리셋
│   │   ├── ExtractedPalettePreview.tsx  # 추출된 팔레트 미리보기
│   │   ├── TypographySettings.tsx  # 타이포그래피 설정
│   │   ├── FontSelector.tsx        # 폰트 선택기
│   │   ├── EffectsSettings.tsx     # 이펙트 설정
│   │   └── BlockOverrideList.tsx   # 블록별 테마 오버라이드
│   │
│   ├── fields/
│   │   ├── VariableField.tsx       # 타입별 필드 라우터
│   │   ├── VariableFieldGroup.tsx  # 필드 그룹
│   │   ├── TextInput.tsx
│   │   ├── Textarea.tsx
│   │   ├── NumberInput.tsx
│   │   ├── Toggle.tsx
│   │   ├── PhoneInput.tsx
│   │   ├── DatePicker.tsx
│   │   ├── TimePicker.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── UrlInput.tsx
│   │   ├── CompoundEditor.tsx
│   │   ├── ArrayEditor.tsx
│   │   ├── AddressSearchEditor.tsx
│   │   └── BankSelectEditor.tsx
│   │
│   └── preview/
│       ├── PreviewPanel.tsx        # 프리뷰 컨테이너 (모드 분기)
│       ├── EditModeToggle.tsx      # 📝/✋ 모드 토글
│       ├── ReadOnlyPreview.tsx     # 폼 모드 프리뷰
│       ├── EditableCanvas.tsx      # 편집 모드 캔버스
│       ├── DraggableElement.tsx    # 드래그 가능 요소
│       ├── ElementContextMenu.tsx  # 우클릭 메뉴
│       ├── ResizeHandles.tsx       # 리사이즈 핸들
│       ├── RotateHandle.tsx        # 회전 핸들
│       ├── BlockRenderer.tsx       # 블록 렌더러
│       └── ElementRenderer.tsx     # 요소 렌더러
│
├── style/                          # 스타일 시스템 코어 (07_style_system.md)
│   ├── types.ts                    # StyleSystem, SemanticTokens 등
│   ├── resolver.ts                 # resolveStyleSystem()
│   ├── presets/
│   │   ├── themes.ts               # THEME_PRESETS
│   │   ├── typography.ts           # TYPOGRAPHY_PRESETS
│   │   ├── effects.ts              # EFFECTS_PRESETS
│   │   └── gradients.ts            # GRADIENT_PRESETS
│   │
│   ├── extraction/
│   │   ├── kmeans.ts               # K-means 알고리즘
│   │   ├── palette.ts              # extractPaletteOptimized()
│   │   └── mapping.ts              # mapColorsToTokens()
│   │
│   ├── context/
│   │   ├── compress.ts             # compressStyleContext()
│   │   ├── semantic.ts             # buildSemanticStyleContext()
│   │   └── delta.ts                # computeStyleDelta()
│   │
│   └── utils/
│       ├── color.ts                # 색상 변환/조정 유틸
│       ├── contrast.ts             # WCAG 대비 계산
│       ├── css.ts                  # generateCSSVariables()
│       └── derive.ts               # derivePaletteFromDominant()
│
├── context/
│   └── EditorContext.tsx           # 상태 관리
│
├── hooks/
│   ├── useEditor.ts
│   ├── useSelectedBlock.ts
│   ├── useSelectedElement.ts       # 선택된 요소
│   ├── useUpdateData.ts
│   ├── useElementUpdate.ts         # 요소 업데이트
│   ├── useAIEdit.ts
│   ├── useContextMenu.ts           # 컨텍스트 메뉴 상태
│   ├── useDrag.ts                  # 드래그 핸들러
│   ├── useResize.ts                # 리사이즈 핸들러
│   ├── useRotate.ts                # 회전 핸들러
│   ├── useKeyboardShortcuts.ts
│   ├── useAutoSave.ts              # 자동 저장 (IndexedDB + 서버)
│   ├── usePersistence.ts           # 임시 저장본 복구
│   ├── useBeforeUnload.ts          # 페이지 이탈 경고
│   └── useStyleSystem.ts           # 스타일 시스템 훅 (NEW)
│
├── persistence/
│   ├── indexed-db.ts               # IndexedDB 스키마 + CRUD
│   ├── local-storage.ts            # LocalStorage 유틸리티
│   └── types.ts                    # DraftDocument, HistorySnapshot 등
│
├── utils/
│   ├── context-builder.ts          # AI 컨텍스트 압축
│   ├── variable-utils.ts           # 변수 추출/해석
│   ├── json-patch.ts               # JSON Patch 적용
│   ├── element-id.ts               # ID 생성/파싱 (getDisplayId, bindingToId)
│   └── prompt-parser.ts            # AI 프롬프트 #id 참조 파싱
│
└── types/
    └── editor.ts                   # 에디터 관련 타입
```

---

## 13. 다음 단계

- [x] `01_data_schema.md` - 블록/요소 구조
- [x] `02_animation_system.md` - 애니메이션 시스템
- [x] `03_variables.md` - 변수 시스템
- [x] `04_editor_ui.md` - 에디터 UI 컴포넌트 설계 (현재 문서)
- [ ] `05_renderer.md` - 렌더링 시스템 + 변수 해석 런타임
- [ ] `06_ai_prompts.md` - AI 프롬프트 템플릿 + 변수 생성 가이드

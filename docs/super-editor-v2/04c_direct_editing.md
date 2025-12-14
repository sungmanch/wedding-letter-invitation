# Super Editor v2 - 직접 편집 (드래그앤드롭)

> **목표**: 프리뷰에서 요소 드래그/리사이즈/회전으로 직접 편집
> **핵심 원칙**: 편집 모드 + 우클릭 메뉴 + ID 참조 시스템

---

## 1. PreviewPanel (모드 지원)

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

---

## 2. EditModeToggle

```typescript
type EditMode = 'form' | 'direct'

function EditModeToggle({ mode, onChange }: { mode: EditMode; onChange: (mode: EditMode) => void }) {
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

---

## 3. EditableCanvas (편집 모드)

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

---

## 4. DraggableElement

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

---

## 5. ElementContextMenu (우클릭 메뉴)

```typescript
interface ContextMenuState {
  element: Element
  block: Block
  position: { x: number; y: number }
}

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

---

## 6. 요소 ID 시스템

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

const BINDING_TO_ID: Record<string, string> = {
  'groom.name': 'groom-name',
  'bride.name': 'bride-name',
  'wedding.dateDisplay': 'wedding-date',
  'photos.main': 'main-photo',
  'greeting.title': 'greeting-title',
  'greeting.content': 'greeting-content',
  'venue.name': 'venue-name',
  'venue.address': 'venue-address',
}

function bindingToId(binding: string): string {
  return BINDING_TO_ID[binding] || binding.replace('.', '-')
}
```

---

## 7. 사용 시나리오

### 시나리오 1: 폼 모드에서 데이터 입력 + AI

```
1. 폼 모드 (📝) 활성화
2. 에디터 패널에서 "인트로" 섹션 펼침
3. 신랑/신부 이름 입력 → 프리뷰 실시간 반영
4. AI 프롬프트: "이름을 세로로 배치해줘"
5. AI가 elements[].x, y 수정 → 레이아웃 변경
```

### 시나리오 2: 편집 모드에서 직접 조정

```
1. 편집 모드 (✋) 전환
2. 프리뷰에서 신랑 이름 텍스트 클릭 → 선택
3. 드래그로 위치 이동
4. 모서리 핸들로 크기 조정
5. 상단 핸들로 회전
6. 변경 완료 → 자동 저장
```

### 시나리오 3: ID 복사 + AI 프롬프트

```
1. 프리뷰에서 신랑 이름 텍스트 우클릭
2. "ID 복사" 클릭 → "#groom-name" 복사됨
3. AI 프롬프트 입력:
   "#groom-name과 #bride-name을 세로로 배치하고,
    #wedding-date는 아래쪽에 작게 배치해줘"
4. AI가 정확히 해당 요소들만 수정
```

---

## 8. 관련 문서

| 문서 | 내용 |
|------|------|
| [04a_layout_tabs.md](./04a_layout_tabs.md) | 에디터 레이아웃 |
| [04d_ai_context.md](./04d_ai_context.md) | AI 프롬프트 컨텍스트 |

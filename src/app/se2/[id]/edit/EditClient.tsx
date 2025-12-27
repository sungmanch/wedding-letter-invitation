'use client'

/**
 * Super Editor v2 - Edit Client
 *
 * 2패널 편집 화면 (에디터 + 프리뷰)
 * - 변경 사항은 IndexedDB에 로컬 저장 (debounced)
 * - 명시적 저장 버튼으로 서버 동기화
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { EditorDocumentV2 } from '@/lib/super-editor-v2/schema/db-schema'
import type { EditorDocument, Block, Element, StyleSystem, WeddingData } from '@/lib/super-editor-v2/schema/types'
import { updateDocument as saveToServer, updateOgMetadata, uploadImage } from '@/lib/super-editor-v2/actions/document'
import { toEditorDocument } from '@/lib/super-editor-v2/utils/document-adapter'
import { resolveStyle, styleToCSSVariables } from '@/lib/super-editor-v2/renderer/style-resolver'
import { DocumentProvider } from '@/lib/super-editor-v2/context/document-context'
import { DocumentRenderer } from '@/lib/super-editor-v2/renderer/document-renderer'
import { ContentTab } from '@/lib/super-editor-v2/components/editor/tabs/content-tab'
import { DesignTab } from '@/lib/super-editor-v2/components/editor/tabs/design-tab'
import { ShareTab, type OgMetadata } from '@/lib/super-editor-v2/components/editor/tabs/share-tab'
import { FloatingPromptInput } from '@/lib/super-editor-v2/components/editor/ai/prompt-input'
import { useAIEdit } from '@/lib/super-editor-v2/hooks/useAIEdit'
import { useLocalStorage } from '@/lib/super-editor-v2/hooks/useLocalStorage'
import { EditModeToggle, type EditMode } from '@/lib/super-editor-v2/components/editor/direct/edit-mode-toggle'
import { EditableCanvas } from '@/lib/super-editor-v2/components/editor/direct/editable-canvas'
import { StyledElementRenderer } from '@/lib/super-editor-v2/components/editor/direct/styled-element-renderer'
import { FloatingPresetSidebar } from '@/lib/super-editor-v2/components/editor/ui/floating-preset-sidebar'
import { getBlockPreset } from '@/lib/super-editor-v2/presets/blocks'
import { useEditorFonts } from '@/lib/super-editor-v2/hooks/useFontLoader'

// ============================================
// Types
// ============================================

interface EditClientProps {
  document: EditorDocumentV2
}

type TabType = 'content' | 'design' | 'share'

// 디바이스 프리셋
const DEVICE_PRESETS = [
  { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667, notch: false },
  { id: 'iphone-14', name: 'iPhone 14', width: 390, height: 844, notch: true },
  { id: 'iphone-14-pro', name: 'iPhone 14 Pro', width: 393, height: 852, notch: true },
  { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', width: 430, height: 932, notch: true },
  { id: 'galaxy-s24', name: 'Galaxy S24', width: 360, height: 780, notch: false },
  { id: 'galaxy-s24-ultra', name: 'Galaxy S24 Ultra', width: 384, height: 824, notch: false },
  { id: 'pixel-8', name: 'Pixel 8', width: 412, height: 915, notch: false },
] as const

type DevicePreset = typeof DEVICE_PRESETS[number]

// ============================================
// Component
// ============================================

export function EditClient({ document: dbDocument }: EditClientProps) {
  // 초기 문서 변환 (메모이제이션)
  const initialDocument = useMemo(() => toEditorDocument(dbDocument), [dbDocument])

  // 로컬 저장소 훅 - IndexedDB 기반
  const {
    document: editorDoc,
    updateDocument,
    save,
    isDirty,
    isSaving,
    lastSaved,
    discardChanges,
  } = useLocalStorage({
    documentId: dbDocument.id,
    initialDocument,
    onSave: async (doc) => {
      await saveToServer(dbDocument.id, {
        blocks: doc.blocks,
        style: doc.style,
        data: doc.data,
      })
    },
  })

  // OG 상태 (별도 관리 - 즉시 저장)
  const [og, setOg] = useState<OgMetadata>(() => ({
    title: dbDocument.ogTitle || '',
    description: dbDocument.ogDescription || '',
    imageUrl: dbDocument.ogImageUrl || null,
  }))

  // UI 상태
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null)
  const [showAIPrompt, setShowAIPrompt] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICE_PRESETS[1])
  const [showDeviceMenu, setShowDeviceMenu] = useState(false)
  const [previewScale, setPreviewScale] = useState(1)
  const [editMode, setEditMode] = useState<EditMode>('form')
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const [showPresetSidebar, setShowPresetSidebar] = useState(false)
  const deviceMenuRef = useRef<HTMLDivElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef<number>(0)

  // 디바이스 메뉴 외부 클릭 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (deviceMenuRef.current && !deviceMenuRef.current.contains(event.target as Node)) {
        setShowDeviceMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 프리뷰 스케일 자동 조정
  useEffect(() => {
    function calculateScale() {
      if (!previewContainerRef.current) return
      const container = previewContainerRef.current
      const padding = 48
      const availableWidth = container.clientWidth - padding
      const availableHeight = container.clientHeight - padding
      const scaleX = availableWidth / selectedDevice.width
      const scaleY = availableHeight / selectedDevice.height
      setPreviewScale(Math.min(scaleX, scaleY, 1))
    }
    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [selectedDevice])

  // 모드 전환 시 스크롤 위치 저장 및 복원
  const handleEditModeChange = useCallback((newMode: EditMode) => {
    // 현재 스크롤 위치 저장
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop
    }
    setEditMode(newMode)
  }, [])

  // 모드 전환 후 스크롤 위치 복원
  useEffect(() => {
    // 약간의 지연 후 스크롤 위치 복원 (DOM 업데이트 후)
    const timer = setTimeout(() => {
      if (scrollContainerRef.current && scrollPositionRef.current > 0) {
        scrollContainerRef.current.scrollTop = scrollPositionRef.current
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [editMode])

  // 스타일 해석 및 CSS 변수 생성
  const resolvedStyle = useMemo(() => resolveStyle(editorDoc.style), [editorDoc.style])
  const cssVariables = useMemo(() => styleToCSSVariables(resolvedStyle), [resolvedStyle])

  // 편집 모드: 모든 프리셋 폰트 미리 로드
  useEditorFonts()

  // AI 편집 훅
  const aiEdit = useAIEdit({
    documentId: dbDocument.id,
    onDocumentUpdate: () => {
      // TODO: 문서 다시 불러오기
    },
  })

  // 선택된 블록
  const selectedBlock = useMemo(() => {
    return editorDoc.blocks.find(b => b.id === expandedBlockId)
  }, [editorDoc.blocks, expandedBlockId])

  // 블록 업데이트 (로컬 저장만)
  const handleBlocksChange = useCallback((newBlocks: Block[]) => {
    updateDocument(prev => ({ ...prev, blocks: newBlocks }))
  }, [updateDocument])

  // 스타일 업데이트 (로컬 저장만)
  const handleStyleChange = useCallback((newStyle: StyleSystem) => {
    updateDocument(prev => ({ ...prev, style: newStyle }))
  }, [updateDocument])

  // 데이터 업데이트 (로컬 저장만)
  const handleDataChange = useCallback((newData: WeddingData) => {
    updateDocument(prev => ({ ...prev, data: newData }))
  }, [updateDocument])

  // 블록 선택 (프리뷰에서)
  const handleBlockSelect = useCallback((blockId: string) => {
    setExpandedBlockId(blockId)
    setActiveTab('content')
  }, [])

  // 요소 선택 (직접 편집 모드)
  const handleElementSelect = useCallback((elementId: string | null, blockId?: string) => {
    setSelectedElementId(elementId)
    if (blockId) setExpandedBlockId(blockId)
  }, [])

  // 요소 업데이트 (직접 편집 모드, 로컬 저장만)
  const handleElementUpdate = useCallback((
    blockId: string,
    elementId: string,
    updates: Partial<Element>
  ) => {
    updateDocument(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => {
        if (block.id !== blockId) return block
        return {
          ...block,
          elements: block.elements?.map(el =>
            el.id === elementId ? { ...el, ...updates } : el
          ),
        }
      }),
    }))
  }, [updateDocument])

  // 블록 높이 변경 (직접 편집 모드)
  const handleBlockHeightChange = useCallback((
    blockId: string,
    height: number
  ) => {
    updateDocument(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId ? { ...block, height } : block
      ),
    }))
  }, [updateDocument])

  // 블록 프리셋 변경
  const handlePresetChange = useCallback((
    blockId: string,
    presetId: string
  ) => {
    const preset = getBlockPreset(presetId)
    if (!preset) {
      console.warn(`Preset not found: ${presetId}`)
      return
    }

    updateDocument(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => {
        if (block.id !== blockId) return block

        // 프리셋의 기본 요소가 있으면 적용
        const newElements = preset.defaultElements
          ? preset.defaultElements.map((el, idx) => ({
              ...el,
              id: el.id || `${blockId}-el-${idx}`,
            }))
          : block.elements

        return {
          ...block,
          presetId,
          height: preset.defaultHeight ?? block.height,
          elements: newElements,
        }
      }),
    }))
  }, [updateDocument])

  // 이미지 업로드 (즉시 서버 업로드)
  const handleUploadImage = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string
        const result = await uploadImage(dbDocument.id, {
          data: base64Data,
          filename: file.name,
          mimeType: file.type,
        })
        if (result.success && result.url) {
          resolve(result.url)
        } else {
          reject(new Error(result.error || '업로드 실패'))
        }
      }
      reader.onerror = () => reject(new Error('파일 읽기 실패'))
      reader.readAsDataURL(file)
    })
  }, [dbDocument.id])

  // OG 업데이트 (즉시 서버 저장)
  const handleOgChange = useCallback(async (newOg: OgMetadata) => {
    setOg(newOg)
    try {
      await updateOgMetadata(dbDocument.id, {
        ogTitle: newOg.title,
        ogDescription: newOg.description,
        ogImageUrl: newOg.imageUrl || undefined,
      })
    } catch (error) {
      console.error('Failed to save OG:', error)
    }
  }, [dbDocument.id])

  // OG 기본값
  const defaultOg = useMemo(() => {
    const groomName = editorDoc.data.groom?.name || '신랑'
    const brideName = editorDoc.data.bride?.name || '신부'
    return {
      title: `${groomName} ♥ ${brideName} 결혼합니다`,
      description: '저희 두 사람의 결혼식에 소중한 분들을 초대합니다.',
    }
  }, [editorDoc.data])

  // AI 프롬프트 제출
  const handleAISubmit = useCallback(async (prompt: string) => {
    await aiEdit.edit(prompt, expandedBlockId ?? undefined)
    setShowAIPrompt(false)
  }, [aiEdit, expandedBlockId])

  // 저장 핸들러
  const handleSave = useCallback(async () => {
    try {
      await save()
    } catch (error) {
      console.error('Failed to save:', error)
      alert('저장에 실패했습니다. 다시 시도해주세요.')
    }
  }, [save])

  // 변경사항 취소
  const handleDiscard = useCallback(() => {
    discardChanges()
    setShowDiscardDialog(false)
  }, [discardChanges])

  // 키보드 단축키 (Cmd/Ctrl + S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (isDirty && !isSaving) {
          handleSave()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDirty, isSaving, handleSave])

  return (
    <div className="h-screen flex flex-col bg-[var(--ivory-100)] text-[var(--text-primary)]">
      {/* 헤더 */}
      <header className="flex-shrink-0 h-14 border-b border-[var(--sand-100)] bg-[var(--ivory-100)]/95 backdrop-blur-sm flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← 돌아가기
          </Link>
          <h1 className="font-medium text-[var(--text-primary)]">{editorDoc.meta.title}</h1>

          {/* 저장 상태 표시 */}
          <div className="flex items-center gap-2 text-xs">
            {isSaving && (
              <span className="text-[var(--sage-600)] flex items-center gap-1">
                <LoadingSpinner className="w-3 h-3" />
                저장 중...
              </span>
            )}
            {!isSaving && isDirty && (
              <span className="text-[var(--text-light)]">저장되지 않은 변경사항</span>
            )}
            {!isSaving && !isDirty && lastSaved && (
              <span className="text-[var(--sage-500)]">
                저장됨 {formatTime(lastSaved)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 변경사항 취소 버튼 */}
          {isDirty && (
            <button
              onClick={() => setShowDiscardDialog(true)}
              className="px-3 py-1.5 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--sand-100)] transition-colors"
            >
              취소
            </button>
          )}

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className={`
              px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
              flex items-center gap-2
              ${isDirty && !isSaving
                ? 'bg-[var(--sage-500)] text-white hover:bg-[var(--sage-600)]'
                : 'bg-[var(--sand-100)] text-[var(--text-light)] cursor-not-allowed'
              }
            `}
          >
            <SaveIcon className="w-4 h-4" />
            저장
          </button>

          {/* AI 버튼 */}
          <button
            onClick={() => setShowAIPrompt(true)}
            className="px-3 py-1.5 rounded-lg text-sm bg-[var(--sage-100)] text-[var(--sage-700)] hover:bg-[var(--sage-200)] transition-colors flex items-center gap-2"
          >
            <SparklesIcon className="w-4 h-4" />
            AI 편집
          </button>

          {/* 미리보기 링크 */}
          <Link
            href={`/se2/${dbDocument.id}/preview`}
            target="_blank"
            className="px-3 py-1.5 rounded-lg text-sm bg-white border border-[var(--sand-100)] text-[var(--text-primary)] hover:bg-[var(--ivory-50)] transition-colors"
          >
            미리보기
          </Link>
        </div>
      </header>

      {/* 메인 영역 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 에디터 패널 */}
        <div className="w-[400px] flex-shrink-0 border-r border-[var(--sand-100)] bg-white flex flex-col">
          {/* 탭 네비게이션 */}
          <div className="flex border-b border-[var(--sand-100)]">
            {(['content', 'design', 'share'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 py-3 text-sm font-medium transition-colors
                  ${activeTab === tab
                    ? 'text-[var(--sage-600)] border-b-2 border-[var(--sage-500)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }
                `}
              >
                {tab === 'content' && '콘텐츠'}
                {tab === 'design' && '디자인'}
                {tab === 'share' && '공유'}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'content' && (
              <ContentTab
                document={editorDoc}
                expandedBlockId={expandedBlockId}
                onExpandedBlockChange={setExpandedBlockId}
                onBlocksChange={handleBlocksChange}
                onDataChange={handleDataChange}
                onUploadImage={handleUploadImage}
              />
            )}
            {activeTab === 'design' && (
              <DesignTab
                style={editorDoc.style}
                onStyleChange={handleStyleChange}
              />
            )}
            {activeTab === 'share' && (
              <ShareTab
                documentId={dbDocument.id}
                defaultOg={defaultOg}
                og={og}
                onOgChange={handleOgChange}
                shareUrl={dbDocument.status === 'published' ? `/share/${dbDocument.id}` : null}
              />
            )}
          </div>
        </div>

        {/* 프리뷰 패널 */}
        <div className="flex-1 flex flex-col bg-[var(--sand-100)]/50 relative">
          {/* 디바이스 선택 바 + 모드 토글 */}
          <div className="flex-shrink-0 h-12 border-b border-[var(--sand-100)] bg-white flex items-center justify-between px-4">
            <EditModeToggle mode={editMode} onChange={handleEditModeChange} size="sm" />

            <div className="relative" ref={deviceMenuRef}>
              <button
                onClick={() => setShowDeviceMenu(!showDeviceMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--ivory-50)] hover:bg-[var(--sand-100)] transition-colors text-sm text-[var(--text-primary)]"
              >
                <DevicePhoneIcon className="w-4 h-4" />
                <span>{selectedDevice.name}</span>
                <span className="text-[var(--text-light)] text-xs">
                  {selectedDevice.width}×{selectedDevice.height}
                </span>
                {previewScale < 1 && (
                  <span className="text-[var(--sage-600)] text-xs">
                    {Math.round(previewScale * 100)}%
                  </span>
                )}
                <ChevronDownIcon className="w-4 h-4 text-[var(--text-light)]" />
              </button>

              {showDeviceMenu && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-[var(--sand-100)] rounded-lg shadow-xl py-1 min-w-[200px] z-50">
                  {DEVICE_PRESETS.map((device) => (
                    <button
                      key={device.id}
                      onClick={() => {
                        setSelectedDevice(device)
                        setShowDeviceMenu(false)
                      }}
                      className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-[var(--ivory-50)] transition-colors ${selectedDevice.id === device.id ? 'text-[var(--sage-600)]' : 'text-[var(--text-primary)]'}`}
                    >
                      <span>{device.name}</span>
                      <span className="text-[var(--text-light)] text-xs">
                        {device.width}×{device.height}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 프리뷰 영역 */}
          <div
            ref={previewContainerRef}
            className="flex-1 flex items-center justify-center p-6 overflow-hidden"
          >
            <div
              className="relative transition-all duration-300 ease-out"
              style={{
                width: `${selectedDevice.width}px`,
                height: `${selectedDevice.height}px`,
                transform: `scale(${previewScale})`,
                transformOrigin: 'center center',
              }}
            >
              <div
                className="absolute inset-0 bg-black shadow-2xl"
                style={{
                  borderRadius: selectedDevice.notch ? '3rem' : '2rem',
                  padding: '12px',
                }}
              >
                <div
                  ref={scrollContainerRef}
                  className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide"
                  style={{
                    borderRadius: selectedDevice.notch ? '2.5rem' : '1.5rem',
                    ...cssVariables,
                    backgroundColor: 'var(--bg-page)',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--fg-default)',
                  }}
                >
                  <DocumentProvider
                    document={editorDoc}
                    style={resolvedStyle}
                    viewportOverride={{
                      width: selectedDevice.width - 24,
                      height: selectedDevice.height - 24,
                    }}
                  >
                    {editMode === 'form' && (
                      <DocumentRenderer
                        document={editorDoc}
                        mode="edit"
                        onBlockClick={handleBlockSelect}
                        skipProvider
                      />
                    )}

                    {editMode === 'direct' && (
                      <EditableCanvas
                        document={editorDoc}
                        selectedBlockId={expandedBlockId}
                        selectedElementId={selectedElementId}
                        onElementSelect={handleElementSelect}
                        onElementUpdate={handleElementUpdate}
                        onBlockHeightChange={handleBlockHeightChange}
                        canvasWidth={selectedDevice.width - 24}
                        canvasHeight={selectedDevice.height - 24}
                        showIdBadge
                        disableScroll
                        renderElement={(element, block) => (
                          <StyledElementRenderer element={element} block={block} />
                        )}
                      />
                    )}
                  </DocumentProvider>
                </div>
              </div>

              {selectedDevice.notch && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-10" />
              )}
              {!selectedDevice.notch && selectedDevice.id.includes('galaxy') && (
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-10" />
              )}
            </div>
          </div>

          {/* 프리셋 사이드바 */}
          <FloatingPresetSidebar
            selectedBlock={selectedBlock ?? null}
            onPresetChange={handlePresetChange}
            isOpen={showPresetSidebar}
            onOpenChange={setShowPresetSidebar}
          />
        </div>
      </div>

      {/* AI 프롬프트 모달 */}
      <FloatingPromptInput
        isOpen={showAIPrompt}
        onClose={() => setShowAIPrompt(false)}
        onSubmit={handleAISubmit}
        isLoading={aiEdit.isLoading}
        selectedBlockName={selectedBlock ? `${selectedBlock.type} 블록` : undefined}
      />

      {/* 변경사항 취소 확인 다이얼로그 */}
      {showDiscardDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white border border-[var(--sand-100)] rounded-xl p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-medium mb-2 text-[var(--text-primary)]">변경사항을 취소하시겠습니까?</h3>
            <p className="text-[var(--text-muted)] text-sm mb-6">
              저장하지 않은 모든 변경사항이 삭제됩니다.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDiscardDialog(false)}
                className="px-4 py-2 rounded-lg text-sm bg-[var(--sand-100)] hover:bg-[var(--sand-200)] text-[var(--text-primary)] transition-colors"
              >
                계속 편집
              </button>
              <button
                onClick={handleDiscard}
                className="px-4 py-2 rounded-lg text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                변경사항 취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// Utility Functions
// ============================================

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return '방금'
  if (minutes < 60) return `${minutes}분 전`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`

  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

// ============================================
// Icons
// ============================================

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

function DevicePhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

'use client'

/**
 * Super Editor v2 - Edit Client
 *
 * 2패널 편집 화면 (에디터 + 프리뷰)
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { EditorDocumentV2 } from '@/lib/super-editor-v2/schema/db-schema'
import type { EditorDocument, Block, StyleSystem, WeddingData } from '@/lib/super-editor-v2/schema/types'
import { updateBlocks, updateStyle, updateWeddingData, updateOgMetadata, uploadImage } from '@/lib/super-editor-v2/actions/document'
import { toEditorDocument } from '@/lib/super-editor-v2/utils/document-adapter'
import { resolveStyle } from '@/lib/super-editor-v2/renderer/style-resolver'
import { DocumentProvider } from '@/lib/super-editor-v2/context/document-context'
import { DocumentRenderer } from '@/lib/super-editor-v2/renderer/document-renderer'
import { ContentTab } from '@/lib/super-editor-v2/components/editor/tabs/content-tab'
import { DesignTab } from '@/lib/super-editor-v2/components/editor/tabs/design-tab'
import { ShareTab, type OgMetadata } from '@/lib/super-editor-v2/components/editor/tabs/share-tab'
import { FloatingPromptInput } from '@/lib/super-editor-v2/components/editor/ai/prompt-input'
import { useAIEdit } from '@/lib/super-editor-v2/hooks/useAIEdit'

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
  // DB 데이터를 EditorDocument로 변환
  const [editorDoc, setEditorDoc] = useState<EditorDocument>(() =>
    toEditorDocument(dbDocument)
  )

  // OG 상태
  const [og, setOg] = useState<OgMetadata>(() => ({
    title: dbDocument.ogTitle || '',
    description: dbDocument.ogDescription || '',
    imageUrl: dbDocument.ogImageUrl || null,
  }))

  // UI 상태
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showAIPrompt, setShowAIPrompt] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICE_PRESETS[1]) // iPhone 14 기본
  const [showDeviceMenu, setShowDeviceMenu] = useState(false)
  const [previewScale, setPreviewScale] = useState(1)
  const deviceMenuRef = useRef<HTMLDivElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)

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
      const padding = 48 // p-6 = 24px * 2
      const availableWidth = container.clientWidth - padding
      const availableHeight = container.clientHeight - padding

      const scaleX = availableWidth / selectedDevice.width
      const scaleY = availableHeight / selectedDevice.height
      const scale = Math.min(scaleX, scaleY, 1) // 최대 1배 (확대 안함)

      setPreviewScale(scale)
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [selectedDevice])

  // 스타일 해석
  const resolvedStyle = useMemo(
    () => resolveStyle(editorDoc.style),
    [editorDoc.style]
  )

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

  // 블록 업데이트
  const handleBlocksChange = useCallback(async (newBlocks: Block[]) => {
    setEditorDoc(prev => ({ ...prev, blocks: newBlocks }))

    setIsSaving(true)
    try {
      await updateBlocks(dbDocument.id, newBlocks)
    } catch (error) {
      console.error('Failed to save blocks:', error)
    } finally {
      setIsSaving(false)
    }
  }, [dbDocument.id])

  // 스타일 업데이트
  const handleStyleChange = useCallback(async (newStyle: StyleSystem) => {
    setEditorDoc(prev => ({ ...prev, style: newStyle }))

    setIsSaving(true)
    try {
      await updateStyle(dbDocument.id, newStyle)
    } catch (error) {
      console.error('Failed to save style:', error)
    } finally {
      setIsSaving(false)
    }
  }, [dbDocument.id])

  // 데이터 업데이트
  const handleDataChange = useCallback(async (newData: WeddingData) => {
    setEditorDoc(prev => ({ ...prev, data: newData }))

    setIsSaving(true)
    try {
      await updateWeddingData(dbDocument.id, newData)
    } catch (error) {
      console.error('Failed to save data:', error)
    } finally {
      setIsSaving(false)
    }
  }, [dbDocument.id])

  // 블록 선택 (프리뷰에서)
  const handleBlockSelect = useCallback((blockId: string) => {
    setExpandedBlockId(blockId)
    setActiveTab('content')
  }, [])

  // 이미지 업로드
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

  // OG 업데이트
  const handleOgChange = useCallback(async (newOg: OgMetadata) => {
    setOg(newOg)

    setIsSaving(true)
    try {
      await updateOgMetadata(dbDocument.id, {
        ogTitle: newOg.title,
        ogDescription: newOg.description,
        ogImageUrl: newOg.imageUrl || undefined,
      })
    } catch (error) {
      console.error('Failed to save OG:', error)
    } finally {
      setIsSaving(false)
    }
  }, [dbDocument.id])

  // OG 기본값 (문서 데이터에서)
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

  return (
    <div className="h-screen flex flex-col bg-[#1a1a1a] text-[#F5E6D3]">
      {/* 헤더 */}
      <header className="flex-shrink-0 h-14 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/se2/create"
            className="text-[#F5E6D3]/60 hover:text-[#F5E6D3] transition-colors"
          >
            ← 목록
          </Link>
          <h1 className="font-medium">{editorDoc.meta.title}</h1>
          {isSaving && (
            <span className="text-xs text-[#F5E6D3]/40">저장 중...</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* AI 버튼 */}
          <button
            onClick={() => setShowAIPrompt(true)}
            className="
              px-3 py-1.5 rounded-lg text-sm
              bg-[#C9A962]/20 text-[#C9A962]
              hover:bg-[#C9A962]/30 transition-colors
              flex items-center gap-2
            "
          >
            <SparklesIcon className="w-4 h-4" />
            AI 편집
          </button>

          {/* 미리보기 링크 */}
          <Link
            href={`/se2/${dbDocument.id}/preview`}
            target="_blank"
            className="
              px-3 py-1.5 rounded-lg text-sm
              bg-white/10 text-[#F5E6D3]
              hover:bg-white/20 transition-colors
            "
          >
            미리보기
          </Link>
        </div>
      </header>

      {/* 메인 영역 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 에디터 패널 */}
        <div className="w-[400px] flex-shrink-0 border-r border-white/10 flex flex-col">
          {/* 탭 네비게이션 */}
          <div className="flex border-b border-white/10">
            {(['content', 'design', 'share'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 py-3 text-sm font-medium transition-colors
                  ${activeTab === tab
                    ? 'text-[#C9A962] border-b-2 border-[#C9A962]'
                    : 'text-[#F5E6D3]/60 hover:text-[#F5E6D3]'
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
        <div className="flex-1 flex flex-col bg-[#0f0f0f]">
          {/* 디바이스 선택 바 */}
          <div className="flex-shrink-0 h-12 border-b border-white/10 flex items-center justify-center px-4">
            <div className="relative" ref={deviceMenuRef}>
              <button
                onClick={() => setShowDeviceMenu(!showDeviceMenu)}
                className="
                  flex items-center gap-2 px-3 py-1.5 rounded-lg
                  bg-white/5 hover:bg-white/10 transition-colors
                  text-sm text-[#F5E6D3]
                "
              >
                <DevicePhoneIcon className="w-4 h-4" />
                <span>{selectedDevice.name}</span>
                <span className="text-[#F5E6D3]/40 text-xs">
                  {selectedDevice.width}×{selectedDevice.height}
                </span>
                {previewScale < 1 && (
                  <span className="text-[#C9A962] text-xs">
                    {Math.round(previewScale * 100)}%
                  </span>
                )}
                <ChevronDownIcon className="w-4 h-4 text-[#F5E6D3]/40" />
              </button>

              {/* 드롭다운 메뉴 */}
              {showDeviceMenu && (
                <div className="
                  absolute top-full left-1/2 -translate-x-1/2 mt-2
                  bg-[#2a2a2a] border border-white/10 rounded-lg shadow-xl
                  py-1 min-w-[200px] z-50
                ">
                  {DEVICE_PRESETS.map((device) => (
                    <button
                      key={device.id}
                      onClick={() => {
                        setSelectedDevice(device)
                        setShowDeviceMenu(false)
                      }}
                      className={`
                        w-full px-3 py-2 text-left text-sm
                        flex items-center justify-between
                        hover:bg-white/5 transition-colors
                        ${selectedDevice.id === device.id ? 'text-[#C9A962]' : 'text-[#F5E6D3]'}
                      `}
                    >
                      <span>{device.name}</span>
                      <span className="text-[#F5E6D3]/40 text-xs">
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
              {/* 폰 프레임 */}
              <div
                className="absolute inset-0 bg-black shadow-2xl"
                style={{
                  borderRadius: selectedDevice.notch ? '3rem' : '2rem',
                  padding: '12px',
                }}
              >
                <div
                  className="w-full h-full bg-white overflow-hidden"
                  style={{
                    borderRadius: selectedDevice.notch ? '2.5rem' : '1.5rem',
                  }}
                >
                  {/* 렌더러 */}
                  <DocumentProvider
                    document={editorDoc}
                    style={resolvedStyle}
                  >
                    <div className="w-full h-full overflow-y-auto">
                      <DocumentRenderer
                        document={editorDoc}
                        mode="edit"
                        onBlockClick={handleBlockSelect}
                      />
                    </div>
                  </DocumentProvider>
                </div>
              </div>

              {/* 노치 (iPhone 스타일) */}
              {selectedDevice.notch && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-10" />
              )}

              {/* 펀치홀 (Galaxy/Pixel 스타일) */}
              {!selectedDevice.notch && selectedDevice.id.includes('galaxy') && (
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-10" />
              )}
            </div>
          </div>
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
    </div>
  )
}

// Icons
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

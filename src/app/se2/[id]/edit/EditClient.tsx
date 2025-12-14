'use client'

/**
 * Super Editor v2 - Edit Client
 *
 * 2패널 편집 화면 (에디터 + 프리뷰)
 */

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import type { EditorDocumentV2 } from '@/lib/super-editor-v2/schema/db-schema'
import type { EditorDocument, Block, StyleSystem, WeddingData } from '@/lib/super-editor-v2/schema/types'
import { updateBlocks, updateStyle, updateWeddingData, updateOgMetadata } from '@/lib/super-editor-v2/actions/document'
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
        <div className="flex-1 flex items-center justify-center bg-[#0f0f0f] p-8">
          <div className="relative">
            {/* 폰 프레임 */}
            <div className="w-[375px] h-[812px] bg-black rounded-[3rem] p-3 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
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

            {/* 노치 */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full" />
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

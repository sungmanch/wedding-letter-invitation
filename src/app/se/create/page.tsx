'use client'

/**
 * Super Editor - Create Page
 * 탭으로 템플릿 선택 또는 AI 채팅으로 인트로 생성
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, Loader2, Sparkles, RefreshCw, Grid, MessageSquare } from 'lucide-react'
import { TokenStyleProvider } from '@/lib/super-editor/context'
import { SectionRenderer } from '@/lib/super-editor/renderers'
import {
  generateIntroOnlyAction,
  completeTemplateAction,
} from '@/lib/super-editor/actions/generate'
import type { IntroGenerationResult } from '@/lib/super-editor/services'
import { DEFAULT_USER_DATA } from './default-style'

// 레거시 템플릿
import { legacyPresets, categoryLabels } from '@/lib/super-editor/presets/legacy'
import {
  buildLegacyIntro,
  getLegacyPresetPreviews,
  collectAllIntroStyles,
  type LegacyIntroResult,
} from '@/lib/super-editor/presets/legacy/intro-builders'
import type { IntroBuilderData } from '@/lib/super-editor/presets/legacy/intro-builders'
import { renderPrimitiveNode } from '@/lib/super-editor/primitives'
import type { RenderContext } from '@/lib/super-editor/primitives/types'

type CreateMode = 'template' | 'chat'

const SAMPLE_DATA: IntroBuilderData = {
  groomName: '김민준',
  brideName: '이서연',
  weddingDate: '2025-03-15',
  venueName: '그랜드 웨딩홀',
  mainImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
}

// ============================================
// Types
// ============================================

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// ============================================
// Constants
// ============================================

const QUICK_PROMPTS = [
  { label: '모던 미니멀', prompt: '모던하고 미니멀한 스타일로 만들어주세요' },
  { label: '로맨틱 플라워', prompt: '꽃과 함께 로맨틱한 분위기로 만들어주세요' },
  { label: '우아한 클래식', prompt: '우아하고 클래식한 스타일이 좋아요' },
  { label: '따뜻한 감성', prompt: '따뜻하고 포근한 느낌으로 부탁해요' },
]

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    '안녕하세요! 청첩장 디자인을 도와드릴게요.\n\n어떤 분위기의 청첩장을 원하시나요? 색상, 스타일, 느낌 등 자유롭게 말씀해주세요.',
  timestamp: new Date(),
}

// ============================================
// Components
// ============================================

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-rose-500 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
    </div>
  )
}

function LoadingDots() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1.5">
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  )
}

const PHONE_SCREEN_WIDTH = 320
const PHONE_SCREEN_HEIGHT = 580

function PhoneFrame({ children }: { children: React.ReactNode }) {
  const allStyles = useMemo(() => collectAllIntroStyles(), [])

  return (
    <div className="relative">
      {/* 인트로 애니메이션 스타일 */}
      <style dangerouslySetInnerHTML={{ __html: allStyles }} />
      {/* Phone bezel */}
      <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-b-2xl z-10" />
        {/* Screen */}
        <div
          className="bg-white rounded-4xl overflow-hidden overflow-y-auto"
          style={
            {
              width: PHONE_SCREEN_WIDTH,
              height: PHONE_SCREEN_HEIGHT,
              '--preview-screen-height': `${PHONE_SCREEN_HEIGHT}px`,
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Template Gallery
// ============================================

interface TemplateGalleryProps {
  onSelect: (presetId: string) => void
  selectedId: string | null
}

function TemplateGallery({ onSelect, selectedId }: TemplateGalleryProps) {
  const previews = useMemo(() => getLegacyPresetPreviews(legacyPresets), [])

  const grouped = useMemo(() => {
    const groups: Record<string, typeof previews> = {}
    previews.forEach((p) => {
      if (!groups[p.category]) groups[p.category] = []
      groups[p.category].push(p)
    })
    return groups
  }, [previews])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {Object.entries(grouped).map(([category, templates]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            {categoryLabels[category as keyof typeof categoryLabels]?.ko || category}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelect(t.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  selectedId === t.id
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex gap-1 mb-2">
                  {[t.colors.primary, t.colors.accent, t.colors.background].map((c, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <p className="font-medium text-gray-900 text-sm">{t.nameKo}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{t.descriptionKo}</p>
                <div className="flex gap-1 mt-2">
                  {t.mood.slice(0, 2).map((m) => (
                    <span key={m} className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded">
                      {m}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyPreview() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 px-8">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Sparkles className="w-10 h-10 text-gray-300" />
      </div>
      <p className="text-center text-sm font-medium">템플릿을 선택하거나</p>
      <p className="text-center text-sm font-medium">AI에게 스타일을 요청해보세요</p>
    </div>
  )
}

// ============================================
// Legacy Preview
// ============================================

function LegacyPreview({ result }: { result: LegacyIntroResult }) {
  const renderContext: RenderContext = useMemo(
    () => ({
      mode: 'preview' as const,
      data: SAMPLE_DATA as unknown as Record<string, unknown>,
      renderNode: (node) => renderPrimitiveNode(node, renderContext),
    }),
    []
  )

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: result.colors.background,
        color: result.colors.text,
        overflow: 'hidden',
      }}
    >
      {result.additionalStyles && (
        <style dangerouslySetInnerHTML={{ __html: result.additionalStyles }} />
      )}
      {renderPrimitiveNode(result.root, renderContext)}
    </div>
  )
}

// ============================================
// Main Component
// ============================================

export default function SuperEditorCreatePage() {
  const router = useRouter()

  // Mode: template or chat
  const [mode, setMode] = useState<CreateMode>('template')

  // Template selection
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [legacyResult, setLegacyResult] = useState<LegacyIntroResult | null>(null)

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Stage 1 결과: Style + Intro (AI 생성용)
  const [introResult, setIntroResult] = useState<IntroGenerationResult | null>(null)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 템플릿 선택 핸들러
  const handleTemplateSelect = useCallback((presetId: string) => {
    setSelectedTemplateId(presetId)
    setIntroResult(null) // AI 결과 초기화
    const preset = legacyPresets[presetId]
    if (preset) {
      const result = buildLegacyIntro(preset, SAMPLE_DATA)
      setLegacyResult(result)
    }
  }, [])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 100)}px`
    }
  }, [input])

  // Send message - Stage 1: Intro 생성
  const handleSend = useCallback(
    async (messageText?: string) => {
      const text = messageText ?? input.trim()
      if (!text || isLoading) return

      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsLoading(true)
      setSelectedTemplateId(null) // 채팅 시 템플릿 선택 해제
      setLegacyResult(null) // 레거시 결과 초기화

      try {
        // Stage 1: Style + Intro만 생성
        const response = await generateIntroOnlyAction({
          prompt: text,
          mood: [],
        })

        if (!response.success || !response.data) {
          throw new Error(response.error ?? 'AI 생성에 실패했습니다')
        }

        // Update intro result
        setIntroResult(response.data)

        // Add assistant message
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content:
            '인트로 디자인을 만들었어요! 오른쪽 미리보기를 확인해주세요.\n\n마음에 드시면 "이 디자인으로 시작" 버튼을 눌러주세요.\n다른 스타일을 원하시면 다시 말씀해주세요.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } catch (err) {
        console.error('Generation failed:', err)

        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: '죄송해요, 디자인 생성 중 문제가 발생했어요. 다시 시도해주시겠어요?',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [input, isLoading]
  )

  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Regenerate / Reset
  const handleRegenerate = () => {
    setIntroResult(null)
    setLegacyResult(null)
    setSelectedTemplateId(null)
    if (mode === 'chat') {
      setMessages([
        INITIAL_MESSAGE,
        {
          id: `regen-${Date.now()}`,
          role: 'assistant',
          content: '새로운 디자인을 만들어볼까요? 원하는 스타일을 알려주세요!',
          timestamp: new Date(),
        },
      ])
    }
  }

  // Stage 2 & 3: 기본 섹션 추가 후 편집 화면으로 이동
  const handleStartEditing = async () => {
    // 레거시 템플릿 또는 AI 결과 중 하나가 있어야 함
    if (!introResult && !legacyResult) return

    setIsLoading(true)

    try {
      if (legacyResult) {
        // 레거시 템플릿 선택 시 - TODO: 레거시 템플릿 기반 생성
        console.log('Legacy template selected:', legacyResult)
        alert('레거시 템플릿 기반 생성 기능은 준비 중입니다.\n\n콘솔에서 결과를 확인하세요.')
      } else if (introResult) {
        // AI 생성 결과로 시작
        const response = await completeTemplateAction({
          introResult,
        })

        if (!response.success || !response.data) {
          throw new Error(response.error ?? '템플릿 완성에 실패했습니다')
        }

        // TODO: Stage 3 - DB 저장 후 편집 페이지로 이동
        console.log('Complete template:', response.data)
        alert('저장 기능은 준비 중입니다.\n\n콘솔에서 생성 결과를 확인하세요.')

        // router.push(`/se/${invitationId}/edit`)
      }
    } catch (err) {
      console.error('Template completion failed:', err)
      alert('템플릿 완성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">새 청첩장 만들기</h1>
            </div>
            {(introResult || legacyResult) && (
              <button
                onClick={handleStartEditing}
                disabled={isLoading}
                className="px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    준비 중...
                  </span>
                ) : (
                  '이 디자인으로 시작'
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - 2 Panel Layout */}
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">
          {/* Left Panel - Tabs */}
          <div className="flex-1 lg:max-w-xl flex flex-col bg-white border-r border-gray-200">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setMode('template')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  mode === 'template'
                    ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
                템플릿 선택
              </button>
              <button
                onClick={() => setMode('chat')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  mode === 'chat'
                    ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                AI 생성
              </button>
            </div>

            {/* Template Mode */}
            {mode === 'template' && (
              <TemplateGallery onSelect={handleTemplateSelect} selectedId={selectedTemplateId} />
            )}

            {/* Chat Mode */}
            {mode === 'chat' && (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">디자인 어시스턴트</h3>
                    <p className="text-xs text-gray-500">AI가 인트로를 디자인해드려요</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  {isLoading && <LoadingDots />}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                {messages.length === 1 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-gray-500 mb-2">빠른 시작:</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_PROMPTS.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleSend(item.prompt)}
                          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="원하는 스타일을 설명해주세요..."
                        rows={1}
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors text-sm disabled:opacity-50"
                        style={{ maxHeight: '100px' }}
                      />
                    </div>
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      className="p-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">Shift + Enter로 줄바꿈</p>
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Preview (Intro Only) */}
          <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gray-50">
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-500 mb-4">인트로 미리보기</div>
              <PhoneFrame>
                {legacyResult ? (
                  // 레거시 템플릿 선택 시 - PrimitiveNode 직접 렌더링
                  <LegacyPreview result={legacyResult} />
                ) : introResult ? (
                  <TokenStyleProvider style={introResult.style}>
                    <SectionRenderer
                      screen={introResult.introScreen}
                      userData={DEFAULT_USER_DATA}
                      mode="preview"
                    />
                  </TokenStyleProvider>
                ) : (
                  <EmptyPreview />
                )}
              </PhoneFrame>

              {/* Regenerate button */}
              {(introResult || legacyResult) && (
                <button
                  onClick={handleRegenerate}
                  className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  다시 생성하기
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Preview FAB */}
      {(introResult || legacyResult) && (
        <div className="fixed bottom-20 right-4 lg:hidden">
          <button
            onClick={() => {
              /* TODO: 모바일 프리뷰 모달 */
            }}
            className="w-14 h-14 bg-rose-500 text-white rounded-full shadow-lg flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}

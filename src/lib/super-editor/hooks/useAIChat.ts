/**
 * useAIChat - AI 대화형 템플릿 편집 훅
 */

import { useState, useCallback, useRef } from 'react'
import { useSuperEditor } from '../context'
import type { LayoutSchema } from '../schema/layout'
import type { StyleSchema } from '../schema/style'
import type { EditorSchema } from '../schema/editor'

// ============================================
// Types
// ============================================

export type MessageRole = 'user' | 'assistant' | 'system'
export type EditMode = 'style' | 'layout' | 'editor' | 'all'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  // AI가 제안한 변경사항
  changes?: TemplateChanges
  // 제안 수락 여부
  applied?: boolean
}

export interface TemplateChanges {
  type: 'full' | 'partial'
  layout?: LayoutSchema
  style?: StyleSchema
  editor?: EditorSchema
  // 변경 설명
  description?: string
  // 추가/수정/삭제된 노드 ID들
  affectedNodes?: string[]
}

export interface AISuggestion {
  id: string
  type: 'add' | 'modify' | 'remove' | 'style'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

export interface UseAIChatOptions {
  onError?: (error: Error) => void
  onTemplateChange?: (changes: TemplateChanges) => void
}

export interface UseAIChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  suggestions: AISuggestion[]
  editMode: EditMode
  setEditMode: (mode: EditMode) => void
  sendMessage: (content: string) => Promise<void>
  applyChanges: (messageId: string) => void
  revertChanges: (messageId: string) => void
  clearChat: () => void
  generateSuggestions: () => Promise<void>
  applySuggestion: (suggestionId: string) => Promise<void>
}

// ============================================
// Helper Functions
// ============================================

/**
 * 깊은 객체 병합 - AI 부분 업데이트를 기존 스키마와 병합
 */
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target }

  for (const key of Object.keys(source) as (keyof T)[]) {
    const sourceValue = source[key]
    const targetValue = target[key]

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      // 둘 다 객체인 경우 재귀적 병합
      result[key] = deepMerge(targetValue as object, sourceValue as object) as T[keyof T]
    } else if (sourceValue !== undefined) {
      // 그 외의 경우 source 값으로 덮어쓰기
      result[key] = sourceValue as T[keyof T]
    }
  }

  return result
}

// ============================================
// Schema Validation Helpers
// ============================================

function isValidLayout(layout: unknown): layout is LayoutSchema {
  if (!layout || typeof layout !== 'object') return false
  const l = layout as Record<string, unknown>
  return (
    l.meta !== undefined &&
    typeof l.meta === 'object' &&
    (l.meta as Record<string, unknown>).name !== undefined &&
    Array.isArray(l.screens)
  )
}

function isValidStyle(style: unknown): style is StyleSchema {
  if (!style || typeof style !== 'object') return false
  const s = style as Record<string, unknown>
  // 빈 객체 체크 - AI가 빈 style을 반환한 경우
  if (Object.keys(s).length === 0) return false
  // 부분 업데이트 허용: meta 또는 theme 중 하나만 있어도 유효
  // 전체 스키마는 meta + theme 모두 필요
  const hasMeta = s.meta !== undefined && typeof s.meta === 'object'
  const hasTheme = s.theme !== undefined && typeof s.theme === 'object'
  return hasMeta || hasTheme
}

function isValidEditor(editor: unknown): editor is EditorSchema {
  if (!editor || typeof editor !== 'object') return false
  const e = editor as Record<string, unknown>
  return (
    e.meta !== undefined &&
    typeof e.meta === 'object' &&
    Array.isArray(e.sections)
  )
}

// ============================================
// Hook Implementation
// ============================================

export function useAIChat(options: UseAIChatOptions = {}): UseAIChatReturn {
  const { state, setTemplate } = useSuperEditor()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [editMode, setEditMode] = useState<EditMode>('style')

  // 변경 전 상태 저장 (되돌리기용)
  const previousStates = useRef<Map<string, {
    layout?: LayoutSchema
    style?: StyleSchema
    editor?: EditorSchema
  }>>(new Map())

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  // 메시지 전송
  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // editMode에 따라 필요한 컨텍스트만 전송
      const requestBody: Record<string, unknown> = {
        message: content,
        editMode,
        history: messages.slice(-6), // 최근 6개 메시지만 (컨텍스트 절약)
      }

      // 모드별로 필요한 스키마만 포함
      if (editMode === 'style' || editMode === 'all') {
        requestBody.currentStyle = state.style
      }
      if (editMode === 'layout' || editMode === 'all') {
        requestBody.currentLayout = state.layout
      }
      if (editMode === 'editor' || editMode === 'all') {
        requestBody.currentEditor = state.editor
      }

      // AI API 호출
      const response = await fetch('/api/super-editor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error('AI 응답 실패')
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        changes: data.changes,
        applied: false,
      }

      setMessages(prev => [...prev, assistantMessage])

      // 새로운 제안이 있으면 업데이트
      if (data.suggestions) {
        setSuggestions(data.suggestions)
      }

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '죄송합니다. 요청을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
      options.onError?.(error instanceof Error ? error : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [state, messages, options, editMode])

  // 변경사항 적용
  const applyChanges = useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message?.changes || message.applied) return

    const changes = message.changes

    // 빈 객체 체크 헬퍼
    const isEmptyObject = (obj: unknown) =>
      obj && typeof obj === 'object' && Object.keys(obj).length === 0

    // AI 변경사항이 빈 객체인 경우 무시
    const hasValidLayout = changes.layout && !isEmptyObject(changes.layout)
    const hasValidStyle = changes.style && !isEmptyObject(changes.style)
    const hasValidEditor = changes.editor && !isEmptyObject(changes.editor)

    // 변경사항 적용할 새 스키마 결정 (부분 업데이트 병합)
    const newLayout = hasValidLayout ? changes.layout : state.layout
    const newStyle = hasValidStyle
      ? deepMerge(state.style || {}, changes.style!) as StyleSchema
      : state.style
    const newEditor = hasValidEditor ? changes.editor : state.editor

    // 변경사항이 없으면 종료
    if (!hasValidLayout && !hasValidStyle && !hasValidEditor) {
      console.warn('No valid changes from AI to apply')
      return
    }

    // 스키마 유효성 검증 (병합 후)
    if (newLayout && !isValidLayout(newLayout)) {
      console.error('Invalid layout schema from AI:', newLayout)
      options.onError?.(new Error('AI가 생성한 레이아웃 스키마가 유효하지 않습니다.'))
      return
    }
    if (newStyle && !isValidStyle(newStyle)) {
      console.error('Invalid style schema from AI:', newStyle)
      options.onError?.(new Error('AI가 생성한 스타일 스키마가 유효하지 않습니다.'))
      return
    }
    if (newEditor && !isValidEditor(newEditor)) {
      console.error('Invalid editor schema from AI:', newEditor)
      options.onError?.(new Error('AI가 생성한 에디터 스키마가 유효하지 않습니다.'))
      return
    }

    // 현재 상태 저장 (되돌리기용)
    previousStates.current.set(messageId, {
      layout: state.layout ?? undefined,
      style: state.style ?? undefined,
      editor: state.editor ?? undefined,
    })

    // 변경사항 적용
    if (newLayout && newStyle && newEditor) {
      setTemplate(newLayout, newStyle, newEditor)
    }

    // 메시지 상태 업데이트
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, applied: true } : msg
    ))

    options.onTemplateChange?.(changes)
  }, [state, messages, setTemplate, options])

  // 변경사항 되돌리기
  const revertChanges = useCallback((messageId: string) => {
    const previousState = previousStates.current.get(messageId)
    if (previousState?.layout && previousState?.style && previousState?.editor) {
      setTemplate(previousState.layout, previousState.style, previousState.editor)

      // 메시지 상태 업데이트
      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, applied: false } : msg
      ))

      previousStates.current.delete(messageId)
    }
  }, [setTemplate])

  // 대화 초기화
  const clearChat = useCallback(() => {
    setMessages([])
    setSuggestions([])
    previousStates.current.clear()
  }, [])

  // AI 제안 생성
  const generateSuggestions = useCallback(async () => {
    if (!state.layout) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/super-editor/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layout: state.layout,
          style: state.style,
          editor: state.editor,
          userData: state.userData,
        }),
      })

      if (!response.ok) {
        throw new Error('제안 생성 실패')
      }

      const data = await response.json()
      setSuggestions(data.suggestions || [])

    } catch (error) {
      options.onError?.(error instanceof Error ? error : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [state, options])

  // 제안 적용
  const applySuggestion = useCallback(async (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId)
    if (!suggestion) return

    // 제안을 메시지로 변환하여 처리
    await sendMessage(`${suggestion.title}을(를) 적용해주세요: ${suggestion.description}`)
  }, [suggestions, sendMessage])

  return {
    messages,
    isLoading,
    suggestions,
    editMode,
    setEditMode,
    sendMessage,
    applyChanges,
    revertChanges,
    clearChat,
    generateSuggestions,
    applySuggestion,
  }
}

export default useAIChat

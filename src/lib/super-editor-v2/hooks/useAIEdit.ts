'use client'

/**
 * Super Editor v2 - useAIEdit Hook
 *
 * AI 편집 기능을 위한 React Hook
 * - API 호출 및 상태 관리
 * - 로딩/에러 상태
 * - Undo 지원
 */

import { useState, useCallback, useRef } from 'react'
import type { JSONPatch } from '../actions/ai-edit'

// ============================================
// Types
// ============================================

export interface AIEditState {
  /** 로딩 상태 */
  isLoading: boolean
  /** 에러 메시지 */
  error: string | null
  /** 마지막 AI 응답 설명 */
  lastExplanation: string | null
  /** 편집 히스토리 */
  history: AIEditHistoryItem[]
}

export interface AIEditHistoryItem {
  id: string
  prompt: string
  explanation: string
  timestamp: Date
  patches: JSONPatch[]
}

export interface UseAIEditOptions {
  /** 문서 ID */
  documentId: string
  /** 성공 콜백 */
  onSuccess?: (explanation: string) => void
  /** 에러 콜백 */
  onError?: (error: string) => void
  /** 문서 갱신 콜백 */
  onDocumentUpdate?: () => void
}

export interface UseAIEditReturn extends AIEditState {
  /** AI 편집 요청 */
  edit: (prompt: string, targetBlockId?: string) => Promise<boolean>
  /** 마지막 편집 취소 */
  undo: () => Promise<boolean>
  /** 에러 초기화 */
  clearError: () => void
  /** 히스토리 초기화 */
  clearHistory: () => void
}

// ============================================
// Hook
// ============================================

export function useAIEdit(options: UseAIEditOptions): UseAIEditReturn {
  const { documentId, onSuccess, onError, onDocumentUpdate } = options

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastExplanation, setLastExplanation] = useState<string | null>(null)
  const [history, setHistory] = useState<AIEditHistoryItem[]>([])

  const abortControllerRef = useRef<AbortController | null>(null)

  // AI 편집 요청
  const edit = useCallback(async (prompt: string, targetBlockId?: string): Promise<boolean> => {
    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    setError(null)

    try {
      // AI API 호출
      const response = await fetch('/api/super-editor-v2/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          prompt,
          targetBlockId,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'AI 편집에 실패했습니다')
      }

      // 성공 처리
      const explanation = result.explanation || 'AI 편집이 적용되었습니다'
      setLastExplanation(explanation)

      // 히스토리에 추가
      const historyItem: AIEditHistoryItem = {
        id: crypto.randomUUID(),
        prompt,
        explanation,
        timestamp: new Date(),
        patches: result.patches || [],
      }
      setHistory(prev => [historyItem, ...prev])

      onSuccess?.(explanation)
      onDocumentUpdate?.()

      return true
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return false
      }

      const errorMessage = err instanceof Error ? err.message : 'AI 편집에 실패했습니다'
      setError(errorMessage)
      onError?.(errorMessage)

      return false
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [documentId, onSuccess, onError, onDocumentUpdate])

  // Undo
  const undo = useCallback(async (): Promise<boolean> => {
    if (history.length === 0) {
      setError('되돌릴 편집이 없습니다')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/super-editor-v2/ai/undo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || '되돌리기에 실패했습니다')
      }

      // 히스토리에서 제거
      setHistory(prev => prev.slice(1))
      setLastExplanation(null)

      onDocumentUpdate?.()

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '되돌리기에 실패했습니다'
      setError(errorMessage)
      onError?.(errorMessage)

      return false
    } finally {
      setIsLoading(false)
    }
  }, [documentId, history, onError, onDocumentUpdate])

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // 히스토리 초기화
  const clearHistory = useCallback(() => {
    setHistory([])
    setLastExplanation(null)
  }, [])

  return {
    isLoading,
    error,
    lastExplanation,
    history,
    edit,
    undo,
    clearError,
    clearHistory,
  }
}

// ============================================
// AI Edit Panel Component (Compound)
// ============================================

export interface AIEditPanelProps {
  /** 문서 ID */
  documentId: string
  /** 선택된 블록 ID */
  selectedBlockId?: string
  /** 블록 이름 (표시용) */
  selectedBlockName?: string
  /** 문서 갱신 콜백 */
  onDocumentUpdate?: () => void
  /** 추가 className */
  className?: string
}

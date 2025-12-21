'use client'

/**
 * useLocalStorage - IndexedDB 기반 로컬 저장소 훅
 *
 * 변경 사항을 IndexedDB에 저장하고, 명시적 저장 시에만 서버에 동기화
 * - 변경 발생 → IndexedDB 저장 (debounced)
 * - localStorage에 최신 상태 플래그 저장
 * - 저장 버튼 클릭 → 서버 API 호출
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { openDB, type IDBPDatabase } from 'idb'
import type { EditorDocument } from '../schema/types'

// ============================================
// Types
// ============================================

interface DocumentStore {
  id: string
  document: EditorDocument
  updatedAt: number
  isDirty: boolean
}

interface UseLocalStorageOptions {
  documentId: string
  initialDocument: EditorDocument
  onSave: (document: EditorDocument) => Promise<void>
  debounceMs?: number
}

interface UseLocalStorageReturn {
  document: EditorDocument
  updateDocument: (updater: (prev: EditorDocument) => EditorDocument) => void
  save: () => Promise<void>
  isDirty: boolean
  isSaving: boolean
  lastSaved: Date | null
  discardChanges: () => void
}

// ============================================
// Constants
// ============================================

const DB_NAME = 'super-editor-v2'
const DB_VERSION = 1
const STORE_NAME = 'documents'
const DIRTY_KEY_PREFIX = 'se2-dirty-'

// ============================================
// Database Initialization
// ============================================

let dbPromise: Promise<IDBPDatabase> | null = null

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

// ============================================
// Hook
// ============================================

export function useLocalStorage({
  documentId,
  initialDocument,
  onSave,
  debounceMs = 500,
}: UseLocalStorageOptions): UseLocalStorageReturn {
  const [document, setDocument] = useState<EditorDocument>(initialDocument)
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const documentRef = useRef<EditorDocument>(initialDocument)

  // 문서 참조 업데이트
  useEffect(() => {
    documentRef.current = document
  }, [document])

  // IndexedDB에서 로컬 데이터 로드 (초기화)
  useEffect(() => {
    async function loadLocal() {
      try {
        const db = await getDB()
        const stored = await db.get(STORE_NAME, documentId) as DocumentStore | undefined

        if (stored && stored.isDirty) {
          // 저장되지 않은 로컬 변경사항이 있음
          setDocument(stored.document)
          setIsDirty(true)
          console.log('[LocalStorage] Restored unsaved changes from IndexedDB')
        } else {
          // 서버 데이터 사용
          setDocument(initialDocument)
          setIsDirty(false)
        }
      } catch (error) {
        console.error('[LocalStorage] Failed to load from IndexedDB:', error)
        setDocument(initialDocument)
      } finally {
        setIsInitialized(true)
      }
    }

    loadLocal()
  }, [documentId, initialDocument])

  // IndexedDB에 저장 (debounced)
  const saveToLocal = useCallback(async (doc: EditorDocument) => {
    try {
      const db = await getDB()
      const store: DocumentStore = {
        id: documentId,
        document: doc,
        updatedAt: Date.now(),
        isDirty: true,
      }
      await db.put(STORE_NAME, store)

      // localStorage에 dirty 플래그 저장 (다른 탭에서 확인용)
      localStorage.setItem(`${DIRTY_KEY_PREFIX}${documentId}`, 'true')
    } catch (error) {
      console.error('[LocalStorage] Failed to save to IndexedDB:', error)
    }
  }, [documentId])

  // 문서 업데이트 (로컬에만 저장)
  const updateDocument = useCallback((updater: (prev: EditorDocument) => EditorDocument) => {
    setDocument(prev => {
      const next = updater(prev)
      documentRef.current = next

      // Debounced IndexedDB 저장
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        saveToLocal(next)
      }, debounceMs)

      return next
    })
    setIsDirty(true)
  }, [saveToLocal, debounceMs])

  // 서버에 저장
  const save = useCallback(async () => {
    if (!isDirty || isSaving) return

    setIsSaving(true)
    try {
      await onSave(documentRef.current)

      // IndexedDB에서 dirty 플래그 해제
      const db = await getDB()
      const store: DocumentStore = {
        id: documentId,
        document: documentRef.current,
        updatedAt: Date.now(),
        isDirty: false,
      }
      await db.put(STORE_NAME, store)

      // localStorage dirty 플래그 제거
      localStorage.removeItem(`${DIRTY_KEY_PREFIX}${documentId}`)

      setIsDirty(false)
      setLastSaved(new Date())
    } catch (error) {
      console.error('[LocalStorage] Failed to save to server:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [isDirty, isSaving, onSave, documentId])

  // 변경사항 취소 (서버 데이터로 복원)
  const discardChanges = useCallback(async () => {
    setDocument(initialDocument)
    documentRef.current = initialDocument
    setIsDirty(false)

    // IndexedDB에서 제거
    try {
      const db = await getDB()
      await db.delete(STORE_NAME, documentId)
      localStorage.removeItem(`${DIRTY_KEY_PREFIX}${documentId}`)
    } catch (error) {
      console.error('[LocalStorage] Failed to discard changes:', error)
    }
  }, [initialDocument, documentId])

  // 페이지 이탈 시 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = '저장하지 않은 변경사항이 있습니다. 페이지를 나가시겠습니까?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return {
    document: isInitialized ? document : initialDocument,
    updateDocument,
    save,
    isDirty,
    isSaving,
    lastSaved,
    discardChanges,
  }
}

// ============================================
// Utility: Check if document has unsaved changes
// ============================================

export async function hasUnsavedChanges(documentId: string): Promise<boolean> {
  try {
    const db = await getDB()
    const stored = await db.get(STORE_NAME, documentId) as DocumentStore | undefined
    return stored?.isDirty ?? false
  } catch {
    return false
  }
}

// ============================================
// Exports
// ============================================

export type { UseLocalStorageOptions, UseLocalStorageReturn }

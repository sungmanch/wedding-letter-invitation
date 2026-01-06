'use client'

/**
 * useBranchLocalStorage - 브랜치용 IndexedDB 기반 로컬 저장소 훅
 *
 * 브랜치는 parent의 data를 상속하므로:
 * - blocks, style, animation만 로컬 저장
 * - data는 항상 parentData로 유지 (읽기 전용)
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { openDB, type IDBPDatabase } from 'idb'
import type { EditorDocument, WeddingData } from '../schema/types'

// ============================================
// Types
// ============================================

interface BranchStore {
  id: string
  document: EditorDocument
  updatedAt: number
  isDirty: boolean
}

interface UseBranchLocalStorageOptions {
  branchId: string
  initialDocument: EditorDocument
  parentData: WeddingData  // parent에서 상속받은 data (항상 최신)
  onSave: (document: EditorDocument) => Promise<void>
  debounceMs?: number
}

interface UseBranchLocalStorageReturn {
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
const STORE_NAME = 'branches'  // 브랜치 전용 스토어
const DIRTY_KEY_PREFIX = 'se2-branch-dirty-'

// ============================================
// Database Initialization
// ============================================

let dbPromise: Promise<IDBPDatabase> | null = null

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // documents 스토어 (기존)
        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents', { keyPath: 'id' })
        }
        // branches 스토어 (브랜치용)
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

export function useBranchLocalStorage({
  branchId,
  initialDocument,
  parentData,
  onSave,
  debounceMs = 500,
}: UseBranchLocalStorageOptions): UseBranchLocalStorageReturn {
  // document의 data는 항상 parentData로 유지
  const [document, setDocument] = useState<EditorDocument>(() => ({
    ...initialDocument,
    data: parentData,
  }))
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

  // parentData가 변경되면 document.data 업데이트
  useEffect(() => {
    setDocument(prev => ({
      ...prev,
      data: parentData,
    }))
    documentRef.current = {
      ...documentRef.current,
      data: parentData,
    }
  }, [parentData])

  // IndexedDB에서 로컬 데이터 로드 (초기화)
  useEffect(() => {
    async function loadLocal() {
      try {
        const db = await getDB()
        const stored = await db.get(STORE_NAME, branchId) as BranchStore | undefined

        if (stored && stored.isDirty) {
          // 저장되지 않은 로컬 변경사항이 있음
          // data는 항상 parentData 사용
          setDocument({
            ...stored.document,
            data: parentData,
          })
          setIsDirty(true)
          console.log('[BranchLocalStorage] Restored unsaved changes from IndexedDB')
        } else {
          // 서버 데이터 사용
          setDocument({
            ...initialDocument,
            data: parentData,
          })
          setIsDirty(false)
        }
      } catch (error) {
        console.error('[BranchLocalStorage] Failed to load from IndexedDB:', error)
        setDocument({
          ...initialDocument,
          data: parentData,
        })
      } finally {
        setIsInitialized(true)
      }
    }

    loadLocal()
  }, [branchId, initialDocument, parentData])

  // IndexedDB에 저장 (debounced)
  const saveToLocal = useCallback(async (doc: EditorDocument) => {
    try {
      const db = await getDB()
      const store: BranchStore = {
        id: branchId,
        document: doc,
        updatedAt: Date.now(),
        isDirty: true,
      }
      await db.put(STORE_NAME, store)

      // localStorage에 dirty 플래그 저장
      localStorage.setItem(`${DIRTY_KEY_PREFIX}${branchId}`, 'true')
    } catch (error) {
      console.error('[BranchLocalStorage] Failed to save to IndexedDB:', error)
    }
  }, [branchId])

  // 문서 업데이트 (로컬에만 저장, data 변경은 무시)
  const updateDocument = useCallback((updater: (prev: EditorDocument) => EditorDocument) => {
    setDocument(prev => {
      const next = updater(prev)
      // data는 항상 parentData로 강제 (브랜치에서 data 수정 불가)
      const finalNext = {
        ...next,
        data: parentData,
      }
      documentRef.current = finalNext

      // Debounced IndexedDB 저장
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        saveToLocal(finalNext)
      }, debounceMs)

      return finalNext
    })
    setIsDirty(true)
  }, [saveToLocal, debounceMs, parentData])

  // 서버에 저장
  const save = useCallback(async () => {
    if (!isDirty || isSaving) return

    setIsSaving(true)
    try {
      await onSave(documentRef.current)

      // IndexedDB에서 dirty 플래그 해제
      const db = await getDB()
      const store: BranchStore = {
        id: branchId,
        document: documentRef.current,
        updatedAt: Date.now(),
        isDirty: false,
      }
      await db.put(STORE_NAME, store)

      // localStorage dirty 플래그 제거
      localStorage.removeItem(`${DIRTY_KEY_PREFIX}${branchId}`)

      setIsDirty(false)
      setLastSaved(new Date())
    } catch (error) {
      console.error('[BranchLocalStorage] Failed to save to server:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [isDirty, isSaving, onSave, branchId])

  // 변경사항 취소 (서버 데이터로 복원)
  const discardChanges = useCallback(async () => {
    const restored = {
      ...initialDocument,
      data: parentData,
    }
    setDocument(restored)
    documentRef.current = restored
    setIsDirty(false)

    // IndexedDB에서 제거
    try {
      const db = await getDB()
      await db.delete(STORE_NAME, branchId)
      localStorage.removeItem(`${DIRTY_KEY_PREFIX}${branchId}`)
    } catch (error) {
      console.error('[BranchLocalStorage] Failed to discard changes:', error)
    }
  }, [initialDocument, branchId, parentData])

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
    document: isInitialized ? document : { ...initialDocument, data: parentData },
    updateDocument,
    save,
    isDirty,
    isSaving,
    lastSaved,
    discardChanges,
  }
}

// ============================================
// Utility: Check if branch has unsaved changes
// ============================================

export async function hasBranchUnsavedChanges(branchId: string): Promise<boolean> {
  try {
    const db = await getDB()
    const stored = await db.get(STORE_NAME, branchId) as BranchStore | undefined
    return stored?.isDirty ?? false
  } catch {
    return false
  }
}

// ============================================
// Exports
// ============================================

export type { UseBranchLocalStorageOptions, UseBranchLocalStorageReturn }

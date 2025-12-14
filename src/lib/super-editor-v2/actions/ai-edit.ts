'use server'

import { db } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import { eq, and, desc, sql } from 'drizzle-orm'
import { editorDocumentsV2, editorSnapshotsV2 } from '../schema/db-schema'
import type {
  Block,
  StyleSystem,
  GlobalAnimation,
  WeddingData,
} from '../schema/types'

// ============================================
// AI Edit Types
// ============================================

export interface AIEditRequest {
  documentId: string
  prompt: string
  targetBlockId?: string  // 특정 블록만 수정할 경우
  context?: {
    selectedElementId?: string
    viewportInfo?: {
      width: number
      height: number
    }
  }
}

export interface AIEditResponse {
  success: boolean
  patches?: JSONPatch[]
  explanation?: string
  error?: string
}

export interface JSONPatch {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy'
  path: string
  value?: unknown
  from?: string
}

// ============================================
// AI Edit Actions
// ============================================

/**
 * AI 편집 요청 처리
 * 실제 AI 호출은 API 라우트에서 수행하고,
 * 이 함수는 결과를 DB에 적용
 */
export async function applyAIEdit(
  documentId: string,
  patches: JSONPatch[],
  prompt: string,
  explanation: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Authentication required' }
  }

  // 문서 조회
  const document = await db.query.editorDocumentsV2.findFirst({
    where: and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.userId, user.id)
    ),
  })

  if (!document) {
    return { success: false, error: 'Document not found' }
  }

  // AI 편집 전 스냅샷 생성
  const lastSnapshot = await db.query.editorSnapshotsV2.findFirst({
    where: eq(editorSnapshotsV2.documentId, documentId),
    orderBy: [desc(editorSnapshotsV2.snapshotNumber)],
  })

  const snapshotNumber = (lastSnapshot?.snapshotNumber ?? 0) + 1

  await db.insert(editorSnapshotsV2).values({
    documentId,
    snapshotNumber,
    type: 'ai-edit',
    description: `AI Edit: ${prompt.slice(0, 100)}`,
    snapshot: {
      blocks: document.blocks as Block[],
      style: document.style as StyleSystem,
      animation: document.animation as GlobalAnimation,
      data: document.data as WeddingData,
    },
    aiPrompt: prompt,
    aiResponse: {
      patches,
      explanation,
    },
  })

  // JSON Patch 적용
  try {
    console.log('[AI Edit] Applying patches:', JSON.stringify(patches, null, 2))
    console.log('[AI Edit] Document blocks count:', (document.blocks as Block[]).length)

    const updatedDocument = applyPatches(document, patches)

    console.log('[AI Edit] Updated blocks count:', updatedDocument.blocks.length)

    await db
      .update(editorDocumentsV2)
      .set({
        blocks: updatedDocument.blocks,
        style: updatedDocument.style,
        animation: updatedDocument.animation,
        data: updatedDocument.data,
        updatedAt: new Date(),
        documentVersion: sql`document_version + 1`,
      })
      .where(eq(editorDocumentsV2.id, documentId))

    console.log('[AI Edit] DB update completed for document:', documentId)
    return { success: true }
  } catch (error) {
    console.error('Failed to apply AI edit patches:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to apply patches',
    }
  }
}

/**
 * JSON Patch 적용 헬퍼
 */
function applyPatches(
  document: {
    blocks: unknown
    style: unknown
    animation: unknown
    data: unknown
  },
  patches: JSONPatch[]
): {
  blocks: Block[]
  style: StyleSystem
  animation: GlobalAnimation
  data: WeddingData
} {
  // 깊은 복사
  const result = {
    blocks: JSON.parse(JSON.stringify(document.blocks)) as Block[],
    style: JSON.parse(JSON.stringify(document.style)) as StyleSystem,
    animation: JSON.parse(JSON.stringify(document.animation)) as GlobalAnimation,
    data: JSON.parse(JSON.stringify(document.data)) as WeddingData,
  }

  for (const patch of patches) {
    console.log('[AI Edit] Applying single patch:', patch.op, patch.path)
    applyPatch(result, patch)
  }

  return result
}

/**
 * 단일 JSON Patch 적용
 */
function applyPatch(
  obj: Record<string, unknown>,
  patch: JSONPatch
): void {
  const pathParts = patch.path.split('/').filter(Boolean)

  if (pathParts.length === 0) {
    throw new Error('Invalid patch path')
  }

  // 경로의 마지막 부분과 부모 분리
  const lastKey = pathParts.pop()!
  let target: Record<string, unknown> = obj

  // 부모까지 순회 (add/replace일 때는 중간 경로 자동 생성)
  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i]
    const key = part.replace(/~1/g, '/').replace(/~0/g, '~')
    const index = parseInt(key, 10)

    if (Array.isArray(target) && !isNaN(index)) {
      target = target[index] as Record<string, unknown>
    } else {
      // 중간 경로가 없으면 add/replace일 때 자동 생성
      if (target[key] === undefined) {
        if (patch.op === 'add' || patch.op === 'replace') {
          // 다음 경로가 숫자면 배열, 아니면 객체 생성
          const nextPart = pathParts[i + 1] ?? lastKey
          const nextIsIndex = !isNaN(parseInt(nextPart, 10))
          target[key] = nextIsIndex ? [] : {}
        } else {
          throw new Error(`Path not found: ${patch.path}`)
        }
      }
      target = target[key] as Record<string, unknown>
    }

    if (target === undefined) {
      throw new Error(`Path not found: ${patch.path}`)
    }
  }

  const key = lastKey.replace(/~1/g, '/').replace(/~0/g, '~')
  const index = parseInt(key, 10)

  switch (patch.op) {
    case 'add':
      if (Array.isArray(target)) {
        if (key === '-') {
          target.push(patch.value)
        } else if (!isNaN(index)) {
          target.splice(index, 0, patch.value)
        }
      } else {
        target[key] = patch.value
      }
      break

    case 'remove':
      if (Array.isArray(target) && !isNaN(index)) {
        target.splice(index, 1)
      } else {
        delete target[key]
      }
      break

    case 'replace':
      if (Array.isArray(target) && !isNaN(index)) {
        target[index] = patch.value
      } else {
        target[key] = patch.value
      }
      break

    case 'move':
    case 'copy':
      // move와 copy는 from 경로에서 값을 가져와 적용
      if (!patch.from) {
        throw new Error('move/copy requires from path')
      }
      const fromParts = patch.from.split('/').filter(Boolean)
      let fromTarget: Record<string, unknown> = obj
      for (const part of fromParts.slice(0, -1)) {
        fromTarget = fromTarget[part] as Record<string, unknown>
      }
      const fromKey = fromParts[fromParts.length - 1]
      const value = fromTarget[fromKey]

      if (patch.op === 'move') {
        delete fromTarget[fromKey]
      }

      if (Array.isArray(target) && !isNaN(index)) {
        target[index] = value
      } else {
        target[key] = value
      }
      break
  }
}

/**
 * AI 편집 취소 (마지막 AI 편집 되돌리기)
 */
export async function undoLastAIEdit(
  documentId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Authentication required' }
  }

  // 소유권 확인
  const document = await db.query.editorDocumentsV2.findFirst({
    where: and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.userId, user.id)
    ),
  })

  if (!document) {
    return { success: false, error: 'Document not found' }
  }

  // 마지막 AI 편집 스냅샷 찾기
  const lastAISnapshot = await db.query.editorSnapshotsV2.findFirst({
    where: and(
      eq(editorSnapshotsV2.documentId, documentId),
      eq(editorSnapshotsV2.type, 'ai-edit')
    ),
    orderBy: [desc(editorSnapshotsV2.snapshotNumber)],
  })

  if (!lastAISnapshot) {
    return { success: false, error: 'No AI edit to undo' }
  }

  // 스냅샷 상태로 복원
  const snapshotData = lastAISnapshot.snapshot as {
    blocks: Block[]
    style: StyleSystem
    animation: GlobalAnimation
    data: WeddingData
  }

  await db
    .update(editorDocumentsV2)
    .set({
      blocks: snapshotData.blocks,
      style: snapshotData.style,
      animation: snapshotData.animation,
      data: snapshotData.data,
      updatedAt: new Date(),
      documentVersion: sql`document_version + 1`,
    })
    .where(eq(editorDocumentsV2.id, documentId))

  return { success: true }
}

// ============================================
// AI Context Helpers
// ============================================

/**
 * AI 프롬프트에 전달할 문서 컨텍스트 생성
 */
export async function getDocumentContextForAI(
  documentId: string
): Promise<{
  blocks: Block[]
  style: StyleSystem
  data: WeddingData
  blockSummary: string
} | null> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  const document = await db.query.editorDocumentsV2.findFirst({
    where: and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.userId, user.id)
    ),
  })

  if (!document) {
    return null
  }

  const blocks = document.blocks as Block[]

  // 블록 요약 생성 (AI 토큰 절약)
  const blockSummary = blocks
    .map((block, index) => {
      const elementCount = block.elements?.length ?? 0
      return `[${index}] ${block.type} (id: ${block.id}, elements: ${elementCount}, enabled: ${block.enabled})`
    })
    .join('\n')

  return {
    blocks,
    style: document.style as StyleSystem,
    data: document.data as WeddingData,
    blockSummary,
  }
}

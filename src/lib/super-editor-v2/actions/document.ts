'use server'

import { db } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import { eq, and, desc, sql } from 'drizzle-orm'
import {
  editorDocumentsV2,
  editorSnapshotsV2,
  type EditorDocumentV2,
  type NewEditorDocumentV2,
} from '../schema/db-schema'
import {
  DEFAULT_STYLE_SYSTEM,
  DEFAULT_ANIMATION,
  DEFAULT_WEDDING_DATA,
} from '../schema'
import type {
  Block,
  StyleSystem,
  GlobalAnimation,
  WeddingData,
} from '../schema/types'

// ============================================
// Document CRUD
// ============================================

/**
 * 새 문서 생성
 */
export async function createDocument(data?: {
  title?: string
  blocks?: Block[]
  style?: StyleSystem
  animation?: GlobalAnimation
  weddingData?: WeddingData
}): Promise<EditorDocumentV2> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const [document] = await db.insert(editorDocumentsV2).values({
    userId: user.id,
    title: data?.title ?? '새 청첩장',
    blocks: data?.blocks ?? [],
    style: data?.style ?? DEFAULT_STYLE_SYSTEM,
    animation: data?.animation ?? DEFAULT_ANIMATION,
    data: data?.weddingData ?? DEFAULT_WEDDING_DATA,
    status: 'draft',
  }).returning()

  return document
}

/**
 * 문서 조회 (소유자 전용)
 */
export async function getDocument(documentId: string): Promise<EditorDocumentV2 | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const document = await db.query.editorDocumentsV2.findFirst({
    where: and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.userId, user.id)
    ),
  })

  return document ?? null
}

/**
 * 공개 문서 조회 (결제 완료된 것만)
 */
export async function getPublishedDocument(documentId: string): Promise<EditorDocumentV2 | null> {
  const document = await db.query.editorDocumentsV2.findFirst({
    where: and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.status, 'published')
    ),
  })

  return document ?? null
}

/**
 * 사용자의 모든 문서 목록 조회
 */
export async function listDocuments(): Promise<EditorDocumentV2[]> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const documents = await db.query.editorDocumentsV2.findMany({
    where: eq(editorDocumentsV2.userId, user.id),
    orderBy: [desc(editorDocumentsV2.updatedAt)],
  })

  return documents
}

/**
 * 문서 삭제
 */
export async function deleteDocument(documentId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const result = await db
    .delete(editorDocumentsV2)
    .where(and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.userId, user.id)
    ))
    .returning()

  return result.length > 0
}

// ============================================
// Partial Updates
// ============================================

/**
 * 블록 업데이트
 */
export async function updateBlocks(
  documentId: string,
  blocks: Block[],
  createSnapshot = false
): Promise<EditorDocumentV2 | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  // 스냅샷 생성 (선택적)
  if (createSnapshot) {
    await createSnapshotInternal(documentId, user.id, 'auto', 'Block update')
  }

  const [updated] = await db
    .update(editorDocumentsV2)
    .set({
      blocks,
      updatedAt: new Date(),
      documentVersion: sql`document_version + 1`,
    })
    .where(and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.userId, user.id)
    ))
    .returning()

  return updated ?? null
}

/**
 * 스타일 업데이트
 */
export async function updateStyle(
  documentId: string,
  style: StyleSystem
): Promise<EditorDocumentV2 | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const [updated] = await db
    .update(editorDocumentsV2)
    .set({
      style,
      updatedAt: new Date(),
      documentVersion: sql`document_version + 1`,
    })
    .where(and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.userId, user.id)
    ))
    .returning()

  return updated ?? null
}

/**
 * 애니메이션 설정 업데이트
 */
export async function updateAnimation(
  documentId: string,
  animation: GlobalAnimation
): Promise<EditorDocumentV2 | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const [updated] = await db
    .update(editorDocumentsV2)
    .set({
      animation,
      updatedAt: new Date(),
      documentVersion: sql`document_version + 1`,
    })
    .where(and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.userId, user.id)
    ))
    .returning()

  return updated ?? null
}

/**
 * 웨딩 데이터 업데이트
 */
export async function updateWeddingData(
  documentId: string,
  data: WeddingData
): Promise<EditorDocumentV2 | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const [updated] = await db
    .update(editorDocumentsV2)
    .set({
      data,
      updatedAt: new Date(),
      documentVersion: sql`document_version + 1`,
    })
    .where(and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.userId, user.id)
    ))
    .returning()

  return updated ?? null
}

/**
 * OG 메타데이터 업데이트
 */
export async function updateOgMetadata(
  documentId: string,
  ogData: {
    ogTitle?: string
    ogDescription?: string
    ogImageUrl?: string
  }
): Promise<EditorDocumentV2 | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const [updated] = await db
    .update(editorDocumentsV2)
    .set({
      ...ogData,
      updatedAt: new Date(),
    })
    .where(and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.userId, user.id)
    ))
    .returning()

  return updated ?? null
}

// ============================================
// Snapshot (Version History)
// ============================================

/**
 * 스냅샷 생성 (내부 헬퍼)
 */
async function createSnapshotInternal(
  documentId: string,
  userId: string,
  type: 'auto' | 'manual' | 'publish' | 'ai-edit',
  description?: string
): Promise<void> {
  // 현재 문서 상태 조회
  const document = await db.query.editorDocumentsV2.findFirst({
    where: and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.userId, userId)
    ),
  })

  if (!document) return

  // 마지막 스냅샷 번호 조회
  const lastSnapshot = await db.query.editorSnapshotsV2.findFirst({
    where: eq(editorSnapshotsV2.documentId, documentId),
    orderBy: [desc(editorSnapshotsV2.snapshotNumber)],
  })

  const snapshotNumber = (lastSnapshot?.snapshotNumber ?? 0) + 1

  // 스냅샷 저장
  await db.insert(editorSnapshotsV2).values({
    documentId,
    snapshotNumber,
    type,
    description,
    snapshot: {
      blocks: document.blocks as Block[],
      style: document.style as StyleSystem,
      animation: document.animation as GlobalAnimation,
      data: document.data as WeddingData,
    },
  })
}

/**
 * 수동 스냅샷 생성
 */
export async function createSnapshot(
  documentId: string,
  description?: string
): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  await createSnapshotInternal(documentId, user.id, 'manual', description)
  return true
}

/**
 * 스냅샷 목록 조회
 */
export async function listSnapshots(documentId: string) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  // 소유권 확인
  const document = await db.query.editorDocumentsV2.findFirst({
    where: and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.userId, user.id)
    ),
  })

  if (!document) {
    throw new Error('Document not found')
  }

  const snapshots = await db.query.editorSnapshotsV2.findMany({
    where: eq(editorSnapshotsV2.documentId, documentId),
    orderBy: [desc(editorSnapshotsV2.snapshotNumber)],
  })

  return snapshots
}

/**
 * 스냅샷으로 복원
 */
export async function restoreSnapshot(
  documentId: string,
  snapshotId: string
): Promise<EditorDocumentV2 | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  // 스냅샷 조회
  const snapshot = await db.query.editorSnapshotsV2.findFirst({
    where: eq(editorSnapshotsV2.id, snapshotId),
  })

  if (!snapshot || snapshot.documentId !== documentId) {
    throw new Error('Snapshot not found')
  }

  // 소유권 확인
  const document = await db.query.editorDocumentsV2.findFirst({
    where: and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.userId, user.id)
    ),
  })

  if (!document) {
    throw new Error('Document not found')
  }

  // 현재 상태를 스냅샷으로 저장 후 복원
  await createSnapshotInternal(documentId, user.id, 'manual', 'Before restore')

  const snapshotData = snapshot.snapshot as {
    blocks: Block[]
    style: StyleSystem
    animation: GlobalAnimation
    data: WeddingData
  }

  const [updated] = await db
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
    .returning()

  return updated ?? null
}

'use server'

import { db } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import { eq, and, desc, sql } from 'drizzle-orm'
import { createHash } from 'crypto'
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
  SAMPLE_WEDDING_DATA,
  createDefaultBlocks,
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
 * @param data.useSampleData - true이면 샘플 데이터로 시작 (미리보기용)
 */
export async function createDocument(data?: {
  title?: string
  blocks?: Block[]
  style?: StyleSystem
  animation?: GlobalAnimation
  weddingData?: WeddingData
  useSampleData?: boolean
}): Promise<EditorDocumentV2> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  // weddingData 우선순위: 직접 전달 > useSampleData > 기본값
  const weddingData = data?.weddingData
    ?? (data?.useSampleData ? SAMPLE_WEDDING_DATA : DEFAULT_WEDDING_DATA)

  const [document] = await db.insert(editorDocumentsV2).values({
    userId: user.id,
    title: data?.title ?? '새 청첩장',
    blocks: data?.blocks ?? createDefaultBlocks(),
    style: data?.style ?? DEFAULT_STYLE_SYSTEM,
    animation: data?.animation ?? DEFAULT_ANIMATION,
    data: weddingData,
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
 * 사용자의 가장 최근 draft 문서 조회 (1개만)
 * 사용자당 draft는 1개만 유지하는 정책
 */
export async function getUserDraft(): Promise<EditorDocumentV2 | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null // 비로그인 상태는 null 반환
  }

  const draft = await db.query.editorDocumentsV2.findFirst({
    where: and(
      eq(editorDocumentsV2.userId, user.id),
      eq(editorDocumentsV2.status, 'draft')
    ),
    orderBy: [desc(editorDocumentsV2.updatedAt)],
  })

  return draft ?? null
}

/**
 * 기존 draft를 새 템플릿으로 덮어쓰기
 * 사용자당 1개의 draft만 유지하는 정책을 위해 사용
 */
export async function replaceDraftWithTemplate(
  draftId: string,
  data: {
    title?: string
    blocks: Block[]
    style: StyleSystem
    animation: GlobalAnimation
    weddingData: WeddingData
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
      title: data.title ?? '새 청첩장',
      blocks: data.blocks,
      style: data.style,
      animation: data.animation,
      data: data.weddingData,
      updatedAt: new Date(),
      documentVersion: sql`document_version + 1`,
    })
    .where(and(
      eq(editorDocumentsV2.id, draftId),
      eq(editorDocumentsV2.userId, user.id),
      eq(editorDocumentsV2.status, 'draft')
    ))
    .returning()

  return updated ?? null
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
// Full Document Update
// ============================================

/**
 * 문서 전체 업데이트 (blocks, style, data 한번에)
 * 저장 버튼 클릭 시 사용
 */
export async function updateDocument(
  documentId: string,
  updates: {
    blocks?: Block[]
    style?: StyleSystem
    data?: WeddingData
    animation?: GlobalAnimation
  },
  createSnapshotOnSave = false
): Promise<EditorDocumentV2 | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  // 스냅샷 생성 (선택적)
  if (createSnapshotOnSave) {
    await createSnapshotInternal(documentId, user.id, 'manual', 'Manual save')
  }

  const setData: Record<string, unknown> = {
    updatedAt: new Date(),
    documentVersion: sql`document_version + 1`,
  }

  if (updates.blocks) setData.blocks = updates.blocks
  if (updates.style) setData.style = updates.style
  if (updates.data) setData.data = updates.data
  if (updates.animation) setData.animation = updates.animation

  const [updated] = await db
    .update(editorDocumentsV2)
    .set(setData)
    .where(and(
      eq(editorDocumentsV2.id, documentId),
      eq(editorDocumentsV2.userId, user.id)
    ))
    .returning()

  return updated ?? null
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

// ============================================
// Image Upload
// ============================================

const BUCKET_NAME = 'wedding-photos'
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * 이미지 업로드 (base64)
 */
export async function uploadImage(
  documentId: string,
  imageData: { data: string; filename: string; mimeType: string }
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 문서 소유권 확인
    const document = await db.query.editorDocumentsV2.findFirst({
      where: and(
        eq(editorDocumentsV2.id, documentId),
        eq(editorDocumentsV2.userId, user.id)
      ),
    })

    if (!document) {
      return { success: false, error: '문서를 찾을 수 없습니다' }
    }

    // MIME 타입 검증
    if (!ALLOWED_IMAGE_TYPES.includes(imageData.mimeType)) {
      return { success: false, error: '지원하지 않는 이미지 형식입니다' }
    }

    // base64 → Buffer
    const base64Data = imageData.data.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // 파일 크기 검증
    if (buffer.length > MAX_IMAGE_SIZE) {
      return { success: false, error: '파일 크기가 10MB를 초과합니다' }
    }

    // 파일 확장자 결정
    const ext = imageData.mimeType.split('/')[1] === 'jpeg' ? 'jpg' : imageData.mimeType.split('/')[1]

    // MD5 해시로 파일명 생성 (중복 이미지 방지)
    const md5Hash = createHash('md5').update(buffer).digest('hex')
    const filename = `se2/${documentId}/${md5Hash}.${ext}`

    // 이미 존재하는지 확인
    const { data: existingFile } = await supabase.storage
      .from(BUCKET_NAME)
      .list(`se2/${documentId}`, { search: `${md5Hash}.${ext}` })

    if (existingFile && existingFile.length > 0) {
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filename)
      return { success: true, url: urlData.publicUrl }
    }

    // Supabase Storage에 업로드
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: imageData.mimeType,
        cacheControl: '31536000', // 1년 캐시
        upsert: false,
      })

    if (uploadError) {
      console.error('Image upload error:', uploadError)
      return { success: false, error: '업로드에 실패했습니다' }
    }

    // Public URL 가져오기
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename)

    return { success: true, url: urlData.publicUrl }
  } catch (error) {
    console.error('Failed to upload image:', error)
    return { success: false, error: '이미지 업로드에 실패했습니다' }
  }
}

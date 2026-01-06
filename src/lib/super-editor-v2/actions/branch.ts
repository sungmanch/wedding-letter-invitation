'use server'

import { db } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import { eq, and, desc, sql } from 'drizzle-orm'
import {
  editorDocumentsV2,
  editorDocumentBranchesV2,
  type EditorDocumentBranchV2,
  type EditorDocumentV2,
} from '../schema/db-schema'
import type {
  Block,
  StyleSystem,
  GlobalAnimation,
  WeddingData,
} from '../schema/types'

// ============================================
// Branch + Parent Data (편집기용 통합 타입)
// ============================================

export type BranchWithData = EditorDocumentBranchV2 & {
  data: WeddingData  // parent에서 가져온 데이터
  parentTitle: string
}

// ============================================
// Branch CRUD
// ============================================

/**
 * 브랜치 생성
 * 원본 문서의 현재 레이아웃을 복사하여 시작
 */
export async function createBranch(
  parentDocumentId: string,
  options?: {
    title?: string
    description?: string
    copyLayout?: boolean  // true면 parent의 blocks/style/animation 복사
  }
): Promise<EditorDocumentBranchV2> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  // 원본 문서 조회 및 소유권 확인
  const parentDocument = await db.query.editorDocumentsV2.findFirst({
    where: and(
      eq(editorDocumentsV2.id, parentDocumentId),
      eq(editorDocumentsV2.userId, user.id)
    ),
  })

  if (!parentDocument) {
    throw new Error('Parent document not found')
  }

  // 레이아웃 복사 여부에 따른 초기값
  const copyLayout = options?.copyLayout ?? true
  const blocks = copyLayout ? parentDocument.blocks as Block[] : []
  const style = copyLayout ? parentDocument.style as StyleSystem : parentDocument.style as StyleSystem
  const animation = copyLayout ? parentDocument.animation as GlobalAnimation : {}

  const [branch] = await db.insert(editorDocumentBranchesV2).values({
    parentDocumentId,
    userId: user.id,
    title: options?.title ?? '새 브랜치',
    description: options?.description,
    blocks,
    style,
    animation,
    status: 'draft',
  }).returning()

  return branch
}

/**
 * 브랜치 조회 (소유자 전용, data 포함)
 */
export async function getBranch(branchId: string): Promise<BranchWithData | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const branch = await db.query.editorDocumentBranchesV2.findFirst({
    where: and(
      eq(editorDocumentBranchesV2.id, branchId),
      eq(editorDocumentBranchesV2.userId, user.id)
    ),
  })

  if (!branch) return null

  // Parent document에서 data 가져오기
  const parentDocument = await db.query.editorDocumentsV2.findFirst({
    where: eq(editorDocumentsV2.id, branch.parentDocumentId),
  })

  if (!parentDocument) {
    throw new Error('Parent document not found')
  }

  return {
    ...branch,
    data: parentDocument.data as WeddingData,
    parentTitle: parentDocument.title,
  }
}

/**
 * 공개된 브랜치 조회 (결제 완료된 것만)
 */
export async function getPublishedBranch(branchId: string): Promise<BranchWithData | null> {
  const branch = await db.query.editorDocumentBranchesV2.findFirst({
    where: and(
      eq(editorDocumentBranchesV2.id, branchId),
      eq(editorDocumentBranchesV2.status, 'published')
    ),
  })

  if (!branch) return null

  // Parent document에서 data 가져오기
  const parentDocument = await db.query.editorDocumentsV2.findFirst({
    where: eq(editorDocumentsV2.id, branch.parentDocumentId),
  })

  if (!parentDocument) return null

  return {
    ...branch,
    data: parentDocument.data as WeddingData,
    parentTitle: parentDocument.title,
  }
}

/**
 * 문서의 모든 브랜치 목록 조회
 */
export async function listBranches(parentDocumentId: string): Promise<EditorDocumentBranchV2[]> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  // 원본 문서 소유권 확인
  const parentDocument = await db.query.editorDocumentsV2.findFirst({
    where: and(
      eq(editorDocumentsV2.id, parentDocumentId),
      eq(editorDocumentsV2.userId, user.id)
    ),
  })

  if (!parentDocument) {
    throw new Error('Parent document not found')
  }

  const branches = await db.query.editorDocumentBranchesV2.findMany({
    where: eq(editorDocumentBranchesV2.parentDocumentId, parentDocumentId),
    orderBy: [desc(editorDocumentBranchesV2.updatedAt)],
  })

  return branches
}

/**
 * 사용자의 모든 브랜치 목록 조회
 */
export async function listAllBranches(): Promise<EditorDocumentBranchV2[]> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const branches = await db.query.editorDocumentBranchesV2.findMany({
    where: eq(editorDocumentBranchesV2.userId, user.id),
    orderBy: [desc(editorDocumentBranchesV2.updatedAt)],
  })

  return branches
}

/**
 * 브랜치 삭제
 */
export async function deleteBranch(branchId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const result = await db
    .delete(editorDocumentBranchesV2)
    .where(and(
      eq(editorDocumentBranchesV2.id, branchId),
      eq(editorDocumentBranchesV2.userId, user.id)
    ))
    .returning()

  return result.length > 0
}

// ============================================
// Branch Updates (레이아웃만, data는 parent에서 관리)
// ============================================

/**
 * 브랜치 전체 업데이트 (blocks, style, animation)
 * data는 parent에서 상속하므로 여기서 업데이트하지 않음
 */
export async function updateBranch(
  branchId: string,
  updates: {
    blocks?: Block[]
    style?: StyleSystem
    animation?: GlobalAnimation
    title?: string
    description?: string
  }
): Promise<EditorDocumentBranchV2 | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const setData: Record<string, unknown> = {
    updatedAt: new Date(),
    documentVersion: sql`document_version + 1`,
  }

  if (updates.blocks) setData.blocks = updates.blocks
  if (updates.style) setData.style = updates.style
  if (updates.animation) setData.animation = updates.animation
  if (updates.title) setData.title = updates.title
  if (updates.description) setData.description = updates.description

  const [updated] = await db
    .update(editorDocumentBranchesV2)
    .set(setData)
    .where(and(
      eq(editorDocumentBranchesV2.id, branchId),
      eq(editorDocumentBranchesV2.userId, user.id)
    ))
    .returning()

  return updated ?? null
}

/**
 * 브랜치 블록 업데이트
 */
export async function updateBranchBlocks(
  branchId: string,
  blocks: Block[]
): Promise<EditorDocumentBranchV2 | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const [updated] = await db
    .update(editorDocumentBranchesV2)
    .set({
      blocks,
      updatedAt: new Date(),
      documentVersion: sql`document_version + 1`,
    })
    .where(and(
      eq(editorDocumentBranchesV2.id, branchId),
      eq(editorDocumentBranchesV2.userId, user.id)
    ))
    .returning()

  return updated ?? null
}

/**
 * 브랜치 스타일 업데이트
 */
export async function updateBranchStyle(
  branchId: string,
  style: StyleSystem
): Promise<EditorDocumentBranchV2 | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const [updated] = await db
    .update(editorDocumentBranchesV2)
    .set({
      style,
      updatedAt: new Date(),
      documentVersion: sql`document_version + 1`,
    })
    .where(and(
      eq(editorDocumentBranchesV2.id, branchId),
      eq(editorDocumentBranchesV2.userId, user.id)
    ))
    .returning()

  return updated ?? null
}

/**
 * 브랜치 OG 메타데이터 업데이트
 */
export async function updateBranchOgMetadata(
  branchId: string,
  ogData: {
    ogTitle?: string
    ogDescription?: string
    ogImageUrl?: string
  }
): Promise<EditorDocumentBranchV2 | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const [updated] = await db
    .update(editorDocumentBranchesV2)
    .set({
      ...ogData,
      updatedAt: new Date(),
    })
    .where(and(
      eq(editorDocumentBranchesV2.id, branchId),
      eq(editorDocumentBranchesV2.userId, user.id)
    ))
    .returning()

  return updated ?? null
}

// ============================================
// Parent Document의 data 동기화 헬퍼
// ============================================

/**
 * 브랜치의 parent data 조회 (읽기 전용)
 */
export async function getBranchParentData(branchId: string): Promise<WeddingData | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const branch = await db.query.editorDocumentBranchesV2.findFirst({
    where: and(
      eq(editorDocumentBranchesV2.id, branchId),
      eq(editorDocumentBranchesV2.userId, user.id)
    ),
  })

  if (!branch) return null

  const parentDocument = await db.query.editorDocumentsV2.findFirst({
    where: eq(editorDocumentsV2.id, branch.parentDocumentId),
  })

  return parentDocument?.data as WeddingData ?? null
}

/**
 * Parent document 조회 (브랜치에서 data 편집 페이지로 이동 시 사용)
 */
export async function getBranchParentDocument(branchId: string): Promise<EditorDocumentV2 | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  const branch = await db.query.editorDocumentBranchesV2.findFirst({
    where: and(
      eq(editorDocumentBranchesV2.id, branchId),
      eq(editorDocumentBranchesV2.userId, user.id)
    ),
  })

  if (!branch) return null

  const parentDocument = await db.query.editorDocumentsV2.findFirst({
    where: and(
      eq(editorDocumentsV2.id, branch.parentDocumentId),
      eq(editorDocumentsV2.userId, user.id)
    ),
  })

  return parentDocument ?? null
}

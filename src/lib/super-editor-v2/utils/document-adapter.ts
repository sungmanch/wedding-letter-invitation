/**
 * Document Adapter
 *
 * DB 모델 (EditorDocumentV2) ↔ 런타임 타입 (EditorDocument) 변환
 */

import type { EditorDocumentV2 } from '../schema/db-schema'
import type {
  EditorDocument,
  Block,
  BlockType,
  StyleSystem,
  GlobalAnimation,
  WeddingData,
} from '../schema/types'
import { createDefaultBlocks, DEFAULT_BLOCK_ORDER } from '../schema'

/**
 * 기존 문서의 블록 배열에 누락된 블록을 추가
 * - 새로 추가된 블록 타입은 enabled: false로 추가
 * - 기존 블록의 데이터는 유지
 * - DEFAULT_BLOCK_ORDER 순서 유지
 */
function ensureAllBlocks(existingBlocks: Block[]): Block[] {
  const defaultBlocks = createDefaultBlocks()
  const existingTypes = new Set(existingBlocks.map(b => b.type))

  // 누락된 블록 찾기
  const missingBlocks = defaultBlocks.filter(
    defaultBlock => !existingTypes.has(defaultBlock.type)
  ).map(block => ({
    ...block,
    enabled: false, // 새로 추가된 블록은 비활성화
  }))

  // 기존 블록 + 누락 블록 합치기
  const allBlocks = [...existingBlocks, ...missingBlocks]

  // DEFAULT_BLOCK_ORDER 순서로 정렬
  return allBlocks.sort((a, b) => {
    const orderA = DEFAULT_BLOCK_ORDER.indexOf(a.type as BlockType)
    const orderB = DEFAULT_BLOCK_ORDER.indexOf(b.type as BlockType)
    // 목록에 없는 타입은 맨 뒤로
    if (orderA === -1) return 1
    if (orderB === -1) return -1
    return orderA - orderB
  })
}

/**
 * DB 모델 → EditorDocument 변환
 */
export function toEditorDocument(dbDoc: EditorDocumentV2): EditorDocument {
  return {
    id: dbDoc.id,
    version: 2,
    meta: {
      title: dbDoc.title,
      createdAt: dbDoc.createdAt.toISOString(),
      updatedAt: dbDoc.updatedAt.toISOString(),
    },
    style: dbDoc.style as StyleSystem,
    animation: dbDoc.animation as GlobalAnimation,
    blocks: ensureAllBlocks(dbDoc.blocks as Block[]),
    data: dbDoc.data as WeddingData,
  }
}

/**
 * EditorDocument → DB 업데이트용 partial 변환
 */
export function toDbUpdatePayload(doc: Partial<EditorDocument>): {
  title?: string
  blocks?: Block[]
  style?: StyleSystem
  animation?: GlobalAnimation
  data?: WeddingData
} {
  const payload: ReturnType<typeof toDbUpdatePayload> = {}

  if (doc.meta?.title) {
    payload.title = doc.meta.title
  }
  if (doc.blocks) {
    payload.blocks = doc.blocks
  }
  if (doc.style) {
    payload.style = doc.style
  }
  if (doc.animation) {
    payload.animation = doc.animation
  }
  if (doc.data) {
    payload.data = doc.data
  }

  return payload
}

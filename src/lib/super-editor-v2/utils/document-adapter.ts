/**
 * Document Adapter
 *
 * DB 모델 (EditorDocumentV2) ↔ 런타임 타입 (EditorDocument) 변환
 */

import type { EditorDocumentV2 } from '../schema/db-schema'
import type {
  EditorDocument,
  Block,
  StyleSystem,
  GlobalAnimation,
  WeddingData,
} from '../schema/types'

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
    blocks: dbDoc.blocks as Block[],
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

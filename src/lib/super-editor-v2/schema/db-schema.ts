/**
 * Super Editor v2 - Database Schema (Drizzle)
 *
 * 테이블 구조:
 * - editor_documents_v2: EditorDocument 저장 (JSONB)
 * - editor_snapshots_v2: 버전 히스토리 (Undo/Redo)
 * - editor_assets_v2: 업로드된 이미지/미디어
 */

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
  index,
} from 'drizzle-orm/pg-core'

import type {
  EditorDocument,
  StyleSystem,
  GlobalAnimation,
  Block,
  WeddingData,
} from './types'

// ============================================
// Editor Documents v2
// EditorDocument 전체를 저장하는 메인 테이블
// ============================================

export const editorDocumentsV2 = pgTable('editor_documents_v2', {
  id: uuid('id').primaryKey().defaultRandom(),

  // 소유자
  userId: uuid('user_id').notNull(),

  // 문서 메타
  title: varchar('title', { length: 200 }).notNull().default('새 청첩장'),

  // EditorDocument 핵심 데이터 (JSONB)
  // blocks, style, animation, data를 개별 컬럼으로 분리하여 부분 업데이트 최적화
  blocks: jsonb('blocks').$type<Block[]>().notNull().default([]),
  style: jsonb('style').$type<StyleSystem>().notNull(),
  animation: jsonb('animation').$type<GlobalAnimation>().default({}),
  data: jsonb('data').$type<WeddingData>().notNull(),

  // 빌드 결과
  buildResult: jsonb('build_result').$type<{
    html: string
    css?: string
    js?: string
    assets?: {
      type: string
      originalUrl: string
      optimizedUrl: string
      size: number
    }[]
    buildTime: number
    version: string
    hash: string
  }>(),

  // 배포 URL
  publishedUrl: varchar('published_url', { length: 500 }),

  // Open Graph 메타데이터
  ogTitle: varchar('og_title', { length: 100 }),
  ogDescription: varchar('og_description', { length: 200 }),
  ogImageUrl: varchar('og_image_url', { length: 500 }),

  // 상태
  status: varchar('status', { length: 20 }).default('draft').notNull(),
  // 'draft' | 'building' | 'published' | 'error'
  errorMessage: text('error_message'),

  // 결제
  isPaid: boolean('is_paid').default(false).notNull(),
  paymentId: uuid('payment_id'),

  // 접근 설정
  slug: varchar('slug', { length: 100 }),
  isPublic: boolean('is_public').default(true).notNull(),
  password: varchar('password', { length: 100 }),

  // 통계
  viewCount: integer('view_count').default(0).notNull(),

  // 버전 (낙관적 잠금용)
  documentVersion: integer('document_version').default(1).notNull(),

  // 메타
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
}, (table) => [
  index('idx_editor_docs_v2_user').on(table.userId),
  index('idx_editor_docs_v2_status').on(table.status),
  index('idx_editor_docs_v2_slug').on(table.slug),
  index('idx_editor_docs_v2_is_public').on(table.isPublic),
]).enableRLS()

// ============================================
// Editor Snapshots v2
// 문서 버전 히스토리 (Undo/Redo, 자동 저장)
// ============================================

export const editorSnapshotsV2 = pgTable('editor_snapshots_v2', {
  id: uuid('id').primaryKey().defaultRandom(),

  // FK: editorDocumentsV2
  documentId: uuid('document_id')
    .references(() => editorDocumentsV2.id, { onDelete: 'cascade' })
    .notNull(),

  // 스냅샷 번호 (문서 내 순서)
  snapshotNumber: integer('snapshot_number').notNull(),

  // 스냅샷 타입
  type: varchar('type', { length: 20 }).notNull(),
  // 'auto' | 'manual' | 'publish' | 'ai-edit'

  // 변경 설명
  description: varchar('description', { length: 200 }),

  // 전체 문서 상태 (JSONB)
  // 용량 최적화: blocks만 저장하거나, diff만 저장할 수 있음
  snapshot: jsonb('snapshot').$type<{
    blocks: Block[]
    style: StyleSystem
    animation: GlobalAnimation
    data: WeddingData
  }>().notNull(),

  // AI 편집인 경우 프롬프트 기록
  aiPrompt: text('ai_prompt'),
  aiResponse: jsonb('ai_response').$type<{
    patches: unknown[]
    explanation: string
  }>(),

  // 메타
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_editor_snapshots_v2_doc').on(table.documentId),
  index('idx_editor_snapshots_v2_number').on(table.documentId, table.snapshotNumber),
]).enableRLS()

// ============================================
// Editor Assets v2
// 업로드된 이미지/미디어 관리
// ============================================

export const editorAssetsV2 = pgTable('editor_assets_v2', {
  id: uuid('id').primaryKey().defaultRandom(),

  // FK: editorDocumentsV2
  documentId: uuid('document_id')
    .references(() => editorDocumentsV2.id, { onDelete: 'cascade' })
    .notNull(),

  // 에셋 타입
  type: varchar('type', { length: 20 }).notNull(),
  // 'image' | 'video' | 'audio'

  // 원본 파일 정보
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(), // bytes

  // Storage URL
  url: varchar('url', { length: 500 }).notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),

  // 이미지 메타데이터
  width: integer('width'),
  height: integer('height'),

  // 사용 위치 (어떤 블록/요소에서 사용 중인지)
  usedIn: jsonb('used_in').$type<{
    blockId?: string
    elementId?: string
    binding?: string
  }[]>().default([]),

  // 메타
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_editor_assets_v2_doc').on(table.documentId),
  index('idx_editor_assets_v2_type').on(table.type),
]).enableRLS()

// ============================================
// Guestbook Messages v2
// 게스트가 청첩장에 남긴 축하 메시지
// ============================================

export const guestbookMessagesV2 = pgTable('guestbook_messages_v2', {
  id: uuid('id').primaryKey().defaultRandom(),

  // FK: editorDocumentsV2
  documentId: uuid('document_id')
    .references(() => editorDocumentsV2.id, { onDelete: 'cascade' })
    .notNull(),

  // 익명 사용자 구분 (브라우저 쿠키 기반)
  cookieId: varchar('cookie_id', { length: 100 }).notNull(),

  // 메시지 내용
  name: varchar('name', { length: 50 }).notNull(),
  message: text('message').notNull(),

  // 생성 시간
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_guestbook_v2_doc').on(table.documentId),
  index('idx_guestbook_v2_cookie').on(table.cookieId),
]).enableRLS()

// ============================================
// RSVP Responses v2
// 참석 여부 응답
// ============================================

export const rsvpResponsesV2 = pgTable('rsvp_responses_v2', {
  id: uuid('id').primaryKey().defaultRandom(),

  // FK: editorDocumentsV2
  documentId: uuid('document_id')
    .references(() => editorDocumentsV2.id, { onDelete: 'cascade' })
    .notNull(),

  // 응답자 정보
  name: varchar('name', { length: 50 }).notNull(),
  phone: varchar('phone', { length: 20 }),

  // 참석 여부
  attending: boolean('attending').notNull(),
  guestCount: integer('guest_count').default(1),
  mealOption: varchar('meal_option', { length: 50 }),

  // 메모
  note: text('note'),

  // 메타
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_rsvp_v2_doc').on(table.documentId),
]).enableRLS()

// ============================================
// Type exports
// ============================================

export type EditorDocumentV2 = typeof editorDocumentsV2.$inferSelect
export type NewEditorDocumentV2 = typeof editorDocumentsV2.$inferInsert

export type EditorSnapshotV2 = typeof editorSnapshotsV2.$inferSelect
export type NewEditorSnapshotV2 = typeof editorSnapshotsV2.$inferInsert

export type EditorAssetV2 = typeof editorAssetsV2.$inferSelect
export type NewEditorAssetV2 = typeof editorAssetsV2.$inferInsert

export type GuestbookMessageV2 = typeof guestbookMessagesV2.$inferSelect
export type NewGuestbookMessageV2 = typeof guestbookMessagesV2.$inferInsert

export type RsvpResponseV2 = typeof rsvpResponsesV2.$inferSelect
export type NewRsvpResponseV2 = typeof rsvpResponsesV2.$inferInsert

// ============================================
// AI Edit Logs
// AI 프롬프트-결과 추적 (제품 개선 분석용)
// ============================================

export const aiEditLogsV2 = pgTable('ai_edit_logs_v2', {
  id: uuid('id').primaryKey().defaultRandom(),

  // FK: editorDocumentsV2
  documentId: uuid('document_id')
    .references(() => editorDocumentsV2.id, { onDelete: 'cascade' })
    .notNull(),

  // 사용자
  userId: uuid('user_id').notNull(),

  // 요청 데이터
  prompt: text('prompt').notNull(),
  targetBlockId: uuid('target_block_id'),
  context: jsonb('context').$type<{
    selectedElementId?: string
    viewportInfo?: {
      width: number
      height: number
    }
  }>(),

  // 응답 데이터
  patches: jsonb('patches').$type<{
    op: 'add' | 'remove' | 'replace' | 'move' | 'copy'
    path: string
    value?: unknown
    from?: string
  }[]>(),
  explanation: text('explanation'),

  // 결과
  success: boolean('success').notNull(),
  errorMessage: text('error_message'),

  // 연결된 스냅샷 (전/후 상태 참조용)
  snapshotId: uuid('snapshot_id')
    .references(() => editorSnapshotsV2.id, { onDelete: 'set null' }),

  // 메타
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_ai_edit_logs_v2_doc').on(table.documentId),
  index('idx_ai_edit_logs_v2_user').on(table.userId),
  index('idx_ai_edit_logs_v2_created').on(table.createdAt),
  index('idx_ai_edit_logs_v2_success').on(table.success),
]).enableRLS()

export type AiEditLogV2 = typeof aiEditLogsV2.$inferSelect
export type NewAiEditLogV2 = typeof aiEditLogsV2.$inferInsert

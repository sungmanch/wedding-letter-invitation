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

import type { LayoutSchema } from '../super-editor/schema/layout'
import type { StyleSchema } from '../super-editor/schema/style'
import type { EditorSchema } from '../super-editor/schema/editor'
import type { UserData } from '../super-editor/schema/user-data'

// ============================================
// Super Editor Templates
// LLM이 생성한 레이아웃, 스타일, 에디터 스키마 저장
// ============================================

export const superEditorTemplates = pgTable('super_editor_templates', {
  id: uuid('id').primaryKey().defaultRandom(),

  // 템플릿 메타
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(), // 'chat' | 'story' | 'letter' | 'album' 등
  tags: jsonb('tags').$type<string[]>().default([]),

  // 썸네일
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),

  // LLM 생성 스키마 (핵심!)
  layoutSchema: jsonb('layout_schema').$type<LayoutSchema>().notNull(),
  styleSchema: jsonb('style_schema').$type<StyleSchema>().notNull(),
  editorSchema: jsonb('editor_schema').$type<EditorSchema>().notNull(),

  // 버전 관리
  version: varchar('version', { length: 20 }).default('1.0').notNull(),

  // 생성 컨텍스트 (디버깅/학습용)
  generationContext: jsonb('generation_context').$type<{
    prompt: string
    model: string
    modelVersion?: string
    parameters?: Record<string, unknown>
    generatedAt: string
  }>(),

  // 상태
  status: varchar('status', { length: 20 }).default('draft').notNull(), // 'draft' | 'published' | 'archived'
  isPublic: boolean('is_public').default(false).notNull(),

  // 통계
  usageCount: integer('usage_count').default(0).notNull(),
  rating: integer('rating'), // 1-5 점수

  // 메타
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
}, (table) => [
  index('idx_se_templates_category').on(table.category),
  index('idx_se_templates_status').on(table.status),
  index('idx_se_templates_is_public').on(table.isPublic),
]).enableRLS()

// ============================================
// Super Editor Invitations
// 사용자가 템플릿을 사용해 만든 청첩장
// ============================================

export const superEditorInvitations = pgTable('super_editor_invitations', {
  id: uuid('id').primaryKey().defaultRandom(),

  // 관계
  templateId: uuid('template_id').references(() => superEditorTemplates.id).notNull(),
  userId: uuid('user_id').notNull(), // Auth user ID

  // 사용자 데이터 (핵심!)
  userData: jsonb('user_data').$type<UserData>().notNull(),

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

  // S3 배포 URL
  publishedUrl: varchar('published_url', { length: 500 }),

  // 상태
  status: varchar('status', { length: 20 }).default('draft').notNull(), // 'draft' | 'building' | 'published' | 'error'
  errorMessage: text('error_message'),

  // 섹션 관리
  sectionOrder: jsonb('section_order').$type<string[]>(), // 섹션 순서 (intro 제외)
  sectionEnabled: jsonb('section_enabled').$type<Record<string, boolean>>(), // 섹션 활성화 상태

  // 결제
  isPaid: boolean('is_paid').default(false).notNull(),

  // 접근 설정
  slug: varchar('slug', { length: 100 }), // 커스텀 URL slug
  isPublic: boolean('is_public').default(true).notNull(),
  password: varchar('password', { length: 100 }), // 선택적 비밀번호

  // 통계
  viewCount: integer('view_count').default(0).notNull(),

  // 메타
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
}, (table) => [
  index('idx_se_invitations_template').on(table.templateId),
  index('idx_se_invitations_user').on(table.userId),
  index('idx_se_invitations_status').on(table.status),
  index('idx_se_invitations_slug').on(table.slug),
]).enableRLS()

// ============================================
// Super Editor Presets
// 자주 사용되는 스타일/애니메이션 조합 저장
// ============================================

export const superEditorPresets = pgTable('super_editor_presets', {
  id: uuid('id').primaryKey().defaultRandom(),

  // 프리셋 메타
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(), // 'animation' | 'style' | 'layout' | 'composition'
  tags: jsonb('tags').$type<string[]>().default([]),

  // 프리셋 데이터
  presetData: jsonb('preset_data').$type<Record<string, unknown>>().notNull(),

  // 썸네일/미리보기
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  previewData: jsonb('preview_data').$type<Record<string, unknown>>(), // 미리보기용 샘플 데이터

  // 상태
  isPublic: boolean('is_public').default(true).notNull(),
  isSystem: boolean('is_system').default(false).notNull(), // 시스템 기본 프리셋

  // 통계
  usageCount: integer('usage_count').default(0).notNull(),

  // 메타
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_se_presets_category').on(table.category),
  index('idx_se_presets_is_public').on(table.isPublic),
]).enableRLS()

// ============================================
// Type exports
// ============================================

export type SuperEditorTemplate = typeof superEditorTemplates.$inferSelect
export type NewSuperEditorTemplate = typeof superEditorTemplates.$inferInsert

export type SuperEditorInvitation = typeof superEditorInvitations.$inferSelect
export type NewSuperEditorInvitation = typeof superEditorInvitations.$inferInsert

export type SuperEditorPreset = typeof superEditorPresets.$inferSelect
export type NewSuperEditorPreset = typeof superEditorPresets.$inferInsert

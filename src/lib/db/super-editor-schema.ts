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
import type { VariablesSchema } from '../super-editor/schema/variables'
import type { UserData } from '../super-editor/schema/user-data'

// ============================================
// Super Editor Templates
// LLM이 생성한 레이아웃, 스타일 스키마 저장
// (EditorSchema는 Layout의 {{변수}}에서 동적 생성됨)
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
  // 변수 선언 (에디터 필드 생성 + 기본값 제공)
  variablesSchema: jsonb('variables_schema').$type<VariablesSchema>(),
  // editorSchema는 deprecated (variablesSchema로 대체)
  editorSchema: jsonb('editor_schema').$type<Record<string, unknown>>(),

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

  // Open Graph 메타데이터 (카카오톡/문자 공유 시 표시)
  ogTitle: varchar('og_title', { length: 100 }), // 기본값: "{신랑} ♥ {신부} 결혼합니다"
  ogDescription: varchar('og_description', { length: 200 }), // 기본값: "{일시} {장소}에서 축하해주세요"
  ogImageUrl: varchar('og_image_url', { length: 500 }), // OG 공유용 이미지 URL (1200x630 JPG)

  // 상태
  status: varchar('status', { length: 20 }).default('draft').notNull(), // 'draft' | 'building' | 'published' | 'error'
  errorMessage: text('error_message'),

  // 섹션 관리
  sectionOrder: jsonb('section_order').$type<string[]>(), // 섹션 순서 (intro 제외)
  sectionEnabled: jsonb('section_enabled').$type<Record<string, boolean>>(), // 섹션 활성화 상태

  // 결제
  isPaid: boolean('is_paid').default(false).notNull(),
  paymentId: uuid('payment_id'), // invitation_payments 참조

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
  index('idx_se_invitations_payment').on(table.paymentId),
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
// Guestbook Messages
// 게스트가 청첩장에 남긴 축하 메시지
// ============================================

export const guestbookMessages = pgTable('guestbook_messages', {
  id: uuid('id').primaryKey().defaultRandom(),

  // FK: superEditorInvitations
  invitationId: uuid('invitation_id')
    .references(() => superEditorInvitations.id, { onDelete: 'cascade' })
    .notNull(),

  // 익명 사용자 구분 (브라우저 쿠키 기반)
  cookieId: varchar('cookie_id', { length: 100 }).notNull(),

  // 메시지 내용
  name: varchar('name', { length: 50 }).notNull(),
  message: text('message').notNull(),

  // 생성 시간 (수정 불가이므로 updatedAt 없음)
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_guestbook_invitation').on(table.invitationId),
  index('idx_guestbook_cookie').on(table.cookieId),
]).enableRLS()

// ============================================
// RSVP Responses
// 게스트의 참석 여부 응답
// ============================================

export const rsvpResponses = pgTable('rsvp_responses', {
  id: uuid('id').primaryKey().defaultRandom(),

  // FK: superEditorInvitations
  invitationId: uuid('invitation_id')
    .references(() => superEditorInvitations.id, { onDelete: 'cascade' })
    .notNull(),

  // 익명 사용자 구분 (브라우저 쿠키 기반)
  cookieId: varchar('cookie_id', { length: 100 }),

  // 하객 정보
  guestName: varchar('guest_name', { length: 50 }).notNull(),
  guestPhone: varchar('guest_phone', { length: 20 }),

  // 참석 여부
  attending: varchar('attending', { length: 10 }).notNull(), // 'yes' | 'no' | 'maybe'

  // 추가 정보
  guestCount: integer('guest_count').default(1), // 동행인 수 (본인 포함)
  mealOption: varchar('meal_option', { length: 20 }), // 식사 옵션 (선택)
  side: varchar('side', { length: 10 }), // 'groom' | 'bride'
  message: text('message'), // 축하 메시지 (선택)

  // 생성 시간
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
}, (table) => [
  index('idx_rsvp_invitation').on(table.invitationId),
  index('idx_rsvp_attending').on(table.attending),
  index('idx_rsvp_side').on(table.side),
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

export type GuestbookMessage = typeof guestbookMessages.$inferSelect
export type NewGuestbookMessage = typeof guestbookMessages.$inferInsert

export type RsvpResponse = typeof rsvpResponses.$inferSelect
export type NewRsvpResponse = typeof rsvpResponses.$inferInsert

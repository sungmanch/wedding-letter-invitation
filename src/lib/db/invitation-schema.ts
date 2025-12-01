import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  date,
  time,
  boolean,
  integer,
  jsonb,
  index,
  pgPolicy,
  foreignKey,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { relations } from 'drizzle-orm'
import { designTemplates } from './template-schema'

// ============================================
// 청첩장 (Invitations)
// ============================================
export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'), // auth.users 참조

  // 신랑/신부 정보
  groomName: varchar('groom_name', { length: 50 }).notNull(),
  brideName: varchar('bride_name', { length: 50 }).notNull(),
  groomFatherName: varchar('groom_father_name', { length: 50 }),
  groomMotherName: varchar('groom_mother_name', { length: 50 }),
  brideFatherName: varchar('bride_father_name', { length: 50 }),
  brideMotherName: varchar('bride_mother_name', { length: 50 }),

  // 결혼 정보
  weddingDate: date('wedding_date').notNull(),
  weddingTime: time('wedding_time').notNull(),
  venueName: varchar('venue_name', { length: 100 }).notNull(),
  venueAddress: varchar('venue_address', { length: 255 }).notNull(),
  venueDetail: varchar('venue_detail', { length: 100 }),
  venueMapUrl: varchar('venue_map_url', { length: 500 }),

  // 연락처
  groomPhone: varchar('groom_phone', { length: 20 }),
  bridePhone: varchar('bride_phone', { length: 20 }),
  groomFatherPhone: varchar('groom_father_phone', { length: 20 }),
  groomMotherPhone: varchar('groom_mother_phone', { length: 20 }),
  brideFatherPhone: varchar('bride_father_phone', { length: 20 }),
  brideMotherPhone: varchar('bride_mother_phone', { length: 20 }),

  // 계좌 정보
  groomBank: varchar('groom_bank', { length: 50 }),
  groomAccount: varchar('groom_account', { length: 50 }),
  groomAccountHolder: varchar('groom_account_holder', { length: 50 }),
  brideBank: varchar('bride_bank', { length: 50 }),
  brideAccount: varchar('bride_account', { length: 50 }),
  brideAccountHolder: varchar('bride_account_holder', { length: 50 }),

  // AI 프롬프트 및 디자인
  stylePrompt: text('style_prompt'),
  selectedDesignId: uuid('selected_design_id'),

  // 템플릿 참조 (재사용 가능한 디자인 템플릿)
  templateId: uuid('template_id'), // design_templates 참조
  isTemplateReuse: boolean('is_template_reuse').default(false), // 이미지만 교체한 재사용 여부

  // 배포 URL (S3 정적 배포 시)
  publishedUrl: varchar('published_url', { length: 500 }),

  // 상태
  status: varchar('status', { length: 20 }).default('draft').notNull(), // draft, published, deleted
  isPaid: boolean('is_paid').default(false).notNull(),

  // 메타
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_invitations_user_id').on(table.userId),
  index('idx_invitations_status').on(table.status),
  pgPolicy('Anyone can view published invitations', { as: 'permissive', for: 'select', to: ['public'], using: sql`((status)::text = 'published'::text)` }),
  pgPolicy('Users can manage their own invitations', { as: 'permissive', for: 'all', to: ['public'] }),
]).enableRLS()

// ============================================
// AI 생성 디자인 (Invitation Designs)
// ============================================
export const invitationDesigns = pgTable('invitation_designs', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id').notNull(),

  // 디자인 데이터 (JSON)
  // {
  //   theme: 'spring_romantic',
  //   colors: { primary: '#FFB6C1', secondary: '#D4AF37', background: '#FFFBFC', text: '#1F2937' },
  //   layout: 'classic' | 'modern' | 'minimal' | 'romantic' | 'traditional',
  //   fonts: { title: 'Noto Serif', body: 'Pretendard' },
  //   decorations: ['floral_top', 'gold_border'],
  //   styleDescription: '디자인 설명 (한글)'
  // }
  // designData는 레거시 형식 또는 v2 형식 모두 지원
  // - 레거시: { theme, colors, layout, fonts, decorations, styleDescription }
  // - v2 (InvitationDesignData): { version: '2.0', template, globalStyles, sections, ... }
  designData: jsonb('design_data').$type<Record<string, unknown>>().notNull(),

  generationBatch: integer('generation_batch').notNull(), // 1, 2, 3... (재생성 배치)
  isSelected: boolean('is_selected').default(false).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_invitation_designs_invitation_id').on(table.invitationId),
  foreignKey({
    columns: [table.invitationId],
    foreignColumns: [invitations.id],
    name: 'invitation_designs_invitation_id_fkey'
  }).onDelete('cascade'),
  pgPolicy('Anyone can view designs of published invitations', {
    as: 'permissive',
    for: 'select',
    to: ['public'],
    using: sql`(invitation_id IN ( SELECT invitations.id FROM invitations WHERE ((invitations.status)::text = 'published'::text)))`
  }),
  pgPolicy('Users can manage designs of their invitations', { as: 'permissive', for: 'all', to: ['public'] }),
]).enableRLS()

// ============================================
// 사진 (Invitation Photos)
// ============================================
export const invitationPhotos = pgTable('invitation_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id').notNull(),

  storagePath: varchar('storage_path', { length: 500 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  displayOrder: integer('display_order').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_invitation_photos_invitation_id').on(table.invitationId),
  foreignKey({
    columns: [table.invitationId],
    foreignColumns: [invitations.id],
    name: 'invitation_photos_invitation_id_fkey'
  }).onDelete('cascade'),
  pgPolicy('Anyone can view photos of published invitations', {
    as: 'permissive',
    for: 'select',
    to: ['public'],
    using: sql`(invitation_id IN ( SELECT invitations.id FROM invitations WHERE ((invitations.status)::text = 'published'::text)))`
  }),
  pgPolicy('Users can manage photos of their invitations', { as: 'permissive', for: 'all', to: ['public'] }),
]).enableRLS()

// ============================================
// 축하 메시지 (Invitation Messages)
// ============================================
export const invitationMessages = pgTable('invitation_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id').notNull(),

  guestName: varchar('guest_name', { length: 50 }).notNull(),
  content: text('content').notNull(), // 300자 제한 (앱에서 검증)

  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_invitation_messages_invitation_id').on(table.invitationId),
  foreignKey({
    columns: [table.invitationId],
    foreignColumns: [invitations.id],
    name: 'invitation_messages_invitation_id_fkey'
  }).onDelete('cascade'),
  pgPolicy('Anyone can create messages', { as: 'permissive', for: 'insert', to: ['public'], withCheck: sql`true` }),
  pgPolicy('Owners can view messages', { as: 'permissive', for: 'select', to: ['public'] }),
  pgPolicy('Owners can update messages', { as: 'permissive', for: 'update', to: ['public'] }),
]).enableRLS()

// ============================================
// 결제 (Invitation Payments)
// ============================================
export const invitationPayments = pgTable('invitation_payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id').notNull(),
  userId: uuid('user_id').notNull(), // auth.users 참조

  polarCheckoutId: varchar('polar_checkout_id', { length: 100 }),
  polarOrderId: varchar('polar_order_id', { length: 100 }),
  amount: integer('amount').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, completed, failed, refunded

  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
}, (table) => [
  index('idx_invitation_payments_invitation_id').on(table.invitationId),
  index('idx_invitation_payments_user_id').on(table.userId),
  foreignKey({
    columns: [table.invitationId],
    foreignColumns: [invitations.id],
    name: 'invitation_payments_invitation_id_fkey'
  }).onDelete('cascade'),
  pgPolicy('Users can manage their own payments', {
    as: 'permissive',
    for: 'all',
    to: ['public'],
    using: sql`(auth.uid() = user_id)`,
    withCheck: sql`(auth.uid() = user_id)`
  }),
]).enableRLS()

// ============================================
// Relations
// ============================================
export const invitationsRelations = relations(invitations, ({ many, one }) => ({
  designs: many(invitationDesigns),
  photos: many(invitationPhotos),
  messages: many(invitationMessages),
  payments: many(invitationPayments),
  selectedDesign: one(invitationDesigns, {
    fields: [invitations.selectedDesignId],
    references: [invitationDesigns.id],
  }),
  template: one(designTemplates, {
    fields: [invitations.templateId],
    references: [designTemplates.id],
  }),
}))

export const invitationDesignsRelations = relations(invitationDesigns, ({ one }) => ({
  invitation: one(invitations, {
    fields: [invitationDesigns.invitationId],
    references: [invitations.id],
  }),
}))

export const invitationPhotosRelations = relations(invitationPhotos, ({ one }) => ({
  invitation: one(invitations, {
    fields: [invitationPhotos.invitationId],
    references: [invitations.id],
  }),
}))

export const invitationMessagesRelations = relations(invitationMessages, ({ one }) => ({
  invitation: one(invitations, {
    fields: [invitationMessages.invitationId],
    references: [invitations.id],
  }),
}))

export const invitationPaymentsRelations = relations(invitationPayments, ({ one }) => ({
  invitation: one(invitations, {
    fields: [invitationPayments.invitationId],
    references: [invitations.id],
  }),
}))

export const designTemplatesRelations = relations(designTemplates, ({ many }) => ({
  invitations: many(invitations),
}))

// ============================================
// Type exports
// ============================================
export type Invitation = typeof invitations.$inferSelect
export type NewInvitation = typeof invitations.$inferInsert

export type InvitationDesign = typeof invitationDesigns.$inferSelect
export type NewInvitationDesign = typeof invitationDesigns.$inferInsert

export type InvitationPhoto = typeof invitationPhotos.$inferSelect
export type NewInvitationPhoto = typeof invitationPhotos.$inferInsert

export type InvitationMessage = typeof invitationMessages.$inferSelect
export type NewInvitationMessage = typeof invitationMessages.$inferInsert

export type InvitationPayment = typeof invitationPayments.$inferSelect
export type NewInvitationPayment = typeof invitationPayments.$inferInsert

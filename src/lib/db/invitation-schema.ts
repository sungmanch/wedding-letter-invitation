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
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

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

  // 상태
  status: varchar('status', { length: 20 }).default('draft').notNull(), // draft, published, deleted
  isPaid: boolean('is_paid').default(false).notNull(),

  // 메타
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}).enableRLS()

// ============================================
// AI 생성 디자인 (Invitation Designs)
// ============================================
export const invitationDesigns = pgTable('invitation_designs', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id')
    .references(() => invitations.id, { onDelete: 'cascade' })
    .notNull(),

  // 디자인 데이터 (JSON)
  // {
  //   theme: 'spring_romantic',
  //   colors: { primary: '#FFB6C1', secondary: '#D4AF37', background: '#FFFBFC', text: '#1F2937' },
  //   layout: 'classic' | 'modern' | 'minimal' | 'romantic' | 'traditional',
  //   fonts: { title: 'Noto Serif', body: 'Pretendard' },
  //   decorations: ['floral_top', 'gold_border'],
  //   styleDescription: '디자인 설명 (한글)'
  // }
  designData: jsonb('design_data').$type<{
    theme: string
    colors: {
      primary: string
      secondary: string
      background: string
      text: string
    }
    layout: 'classic' | 'modern' | 'minimal' | 'romantic' | 'traditional'
    fonts: {
      title: string
      body: string
    }
    decorations: string[]
    styleDescription: string
  }>().notNull(),

  generationBatch: integer('generation_batch').notNull(), // 1, 2, 3... (재생성 배치)
  isSelected: boolean('is_selected').default(false).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}).enableRLS()

// ============================================
// 사진 (Invitation Photos)
// ============================================
export const invitationPhotos = pgTable('invitation_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id')
    .references(() => invitations.id, { onDelete: 'cascade' })
    .notNull(),

  storagePath: varchar('storage_path', { length: 500 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  displayOrder: integer('display_order').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}).enableRLS()

// ============================================
// 축하 메시지 (Invitation Messages)
// ============================================
export const invitationMessages = pgTable('invitation_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id')
    .references(() => invitations.id, { onDelete: 'cascade' })
    .notNull(),

  guestName: varchar('guest_name', { length: 50 }).notNull(),
  content: text('content').notNull(), // 300자 제한 (앱에서 검증)

  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}).enableRLS()

// ============================================
// 결제 (Invitation Payments)
// ============================================
export const invitationPayments = pgTable('invitation_payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id')
    .references(() => invitations.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id').notNull(), // auth.users 참조

  polarCheckoutId: varchar('polar_checkout_id', { length: 100 }),
  polarOrderId: varchar('polar_order_id', { length: 100 }),
  amount: integer('amount').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, completed, failed, refunded

  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
}).enableRLS()

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

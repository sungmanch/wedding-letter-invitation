import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'

// ============================================
// 게임 할인 코드 (Game Discount Codes)
// ============================================
export const gameDiscountCodes = pgTable('game_discount_codes', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  discountPercent: integer('discount_percent').notNull(),
  score: integer('score').notNull(),
  grade: text('grade').notNull(),  // S, A, B, C
  userId: text('user_id'),  // nullable (비로그인 허용)
  used: boolean('used').default(false).notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  // Polar.sh 연동
  polarDiscountId: text('polar_discount_id'),  // Polar에서 생성된 할인 ID
  polarSyncStatus: text('polar_sync_status').default('pending'),  // pending, synced, failed
  polarSyncError: text('polar_sync_error'),  // 동기화 실패 시 에러 메시지
}, (table) => [
  index('game_discount_codes_code_idx').on(table.code),
  index('game_discount_codes_user_idx').on(table.userId),
])

// ============================================
// Type exports
// ============================================
export type GameDiscountCode = typeof gameDiscountCodes.$inferSelect
export type NewGameDiscountCode = typeof gameDiscountCodes.$inferInsert

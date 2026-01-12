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
}, (table) => [
  index('game_discount_codes_code_idx').on(table.code),
  index('game_discount_codes_user_idx').on(table.userId),
])

// ============================================
// Type exports
// ============================================
export type GameDiscountCode = typeof gameDiscountCodes.$inferSelect
export type NewGameDiscountCode = typeof gameDiscountCodes.$inferInsert

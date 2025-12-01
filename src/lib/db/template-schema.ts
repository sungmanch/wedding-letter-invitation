import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
} from 'drizzle-orm/pg-core'

// ============================================
// 템플릿 레이블링 타입 (관리자 큐레이션)
// ============================================
export interface TemplateLabel {
  quality: 'excellent' | 'good' | 'acceptable' | 'poor' | 'rejected'
  tags: string[]
  category: string
  features: {
    colorHarmony: 1 | 2 | 3 | 4 | 5
    layoutBalance: 1 | 2 | 3 | 4 | 5
    readability: 1 | 2 | 3 | 4 | 5
    creativity: 1 | 2 | 3 | 4 | 5
  }
  notes?: string
  curatedAt: string
  curatedBy: string
}

// ============================================
// AI 생성 컨텍스트 타입
// ============================================
export interface GenerationContext {
  prompt: string
  model: string
  modelVersion?: string
  parameters?: Record<string, unknown>
  userImages?: string[]
  userPreferences?: Record<string, unknown>
  generatedAt: string
}

// ============================================
// 디자인 템플릿 (Design Templates)
// ============================================
export const designTemplates = pgTable('design_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'), // NULL이면 시스템 템플릿

  // 템플릿 메타
  name: varchar('name', { length: 100 }),
  description: text('description'),
  source: varchar('source', { length: 20 }).notNull(), // 'ai-generated' | 'user-created' | 'system'

  // 핵심: 템플릿 데이터 (JSONB) - InvitationDesignData 전체 구조
  templateData: jsonb('template_data').$type<Record<string, unknown>>().notNull(),

  // AI 생성 컨텍스트 (강화학습용)
  generationContext: jsonb('generation_context').$type<GenerationContext>(),

  // 관리자 큐레이션 (레이블링)
  curation: jsonb('curation').$type<TemplateLabel>(),

  // 썸네일 URL (미리보기용)
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),

  // 상태
  isPublic: boolean('is_public').default(false).notNull(),
  status: varchar('status', { length: 20 }).default('draft').notNull(), // 'draft' | 'curated' | 'approved' | 'rejected'

  // 메타
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_templates_user').on(table.userId),
  index('idx_templates_status').on(table.status),
  index('idx_templates_source').on(table.source),
]).enableRLS()

// ============================================
// Type exports
// ============================================
export type DesignTemplate = typeof designTemplates.$inferSelect
export type NewDesignTemplate = typeof designTemplates.$inferInsert

// ============================================
// 강화학습 데이터 포인트 타입
// ============================================
export interface TrainingDataPoint {
  input: {
    prompt: string
    userPreferences?: Record<string, unknown>
    contextImages?: string[]
  }
  output: {
    templateData: Record<string, unknown>
  }
  reward: {
    quality: number // 0-1 정규화
    selected: boolean
    features: Record<string, number>
  }
}

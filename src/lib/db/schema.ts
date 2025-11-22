import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users (Supabase Auth 연동)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Events (청모장)
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  groupName: varchar('group_name', { length: 100 }).notNull(),
  expectedMembers: varchar('expected_members', { length: 20 }),
  preferredLocation: varchar('preferred_location', { length: 100 }),
  budgetRange: varchar('budget_range', { length: 50 }),
  surveyUrl: varchar('survey_url', { length: 255 }).unique(),
  status: varchar('status', { length: 20 }).default('collecting').notNull(),
  letterUnlockAt: timestamp('letter_unlock_at'),
  letterUnlocked: boolean('letter_unlocked').default(false).notNull(),
  selectedRestaurantId: uuid('selected_restaurant_id'),
  meetingDate: timestamp('meeting_date'),
  meetingTime: varchar('meeting_time', { length: 10 }),
  additionalMessage: text('additional_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Survey Responses (설문 응답)
export const surveyResponses = pgTable('survey_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .references(() => events.id, { onDelete: 'cascade' })
    .notNull(),
  guestName: varchar('guest_name', { length: 100 }).notNull(),
  foodTypes: jsonb('food_types').$type<string[]>(),
  atmospheres: jsonb('atmospheres').$type<string[]>(),
  priceRange: varchar('price_range', { length: 50 }),
  dietaryRestriction: varchar('dietary_restriction', { length: 50 }),
  allergyInfo: varchar('allergy_info', { length: 255 }),
  dislikedFoods: text('disliked_foods'),
  preferredLocation: varchar('preferred_location', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Letters (편지)
export const letters = pgTable('letters', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .references(() => events.id, { onDelete: 'cascade' })
    .notNull(),
  surveyResponseId: uuid('survey_response_id').references(
    () => surveyResponses.id
  ),
  guestName: varchar('guest_name', { length: 100 }).notNull(),
  content: text('content'),
  stickers: jsonb('stickers').$type<string[]>(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Restaurant Recommendations (식당 추천)
export const restaurantRecommendations = pgTable('restaurant_recommendations', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .references(() => events.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }),
  location: varchar('location', { length: 255 }),
  priceRange: varchar('price_range', { length: 50 }),
  imageUrl: varchar('image_url', { length: 500 }),
  matchScore: integer('match_score'),
  matchReasons: jsonb('match_reasons').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Payment Requests (결제 요청)
export const paymentRequests = pgTable('payment_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .references(() => events.id, { onDelete: 'cascade' })
    .notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  requestedAt: timestamp('requested_at').defaultNow().notNull(),
  approvedAt: timestamp('approved_at'),
  approvedBy: uuid('approved_by').references(() => users.id),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
}))

export const eventsRelations = relations(events, ({ one, many }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
  surveyResponses: many(surveyResponses),
  letters: many(letters),
  restaurantRecommendations: many(restaurantRecommendations),
  paymentRequests: many(paymentRequests),
  selectedRestaurant: one(restaurantRecommendations, {
    fields: [events.selectedRestaurantId],
    references: [restaurantRecommendations.id],
  }),
}))

export const surveyResponsesRelations = relations(
  surveyResponses,
  ({ one }) => ({
    event: one(events, {
      fields: [surveyResponses.eventId],
      references: [events.id],
    }),
    letter: one(letters, {
      fields: [surveyResponses.id],
      references: [letters.surveyResponseId],
    }),
  })
)

export const lettersRelations = relations(letters, ({ one }) => ({
  event: one(events, {
    fields: [letters.eventId],
    references: [events.id],
  }),
  surveyResponse: one(surveyResponses, {
    fields: [letters.surveyResponseId],
    references: [surveyResponses.id],
  }),
}))

export const restaurantRecommendationsRelations = relations(
  restaurantRecommendations,
  ({ one }) => ({
    event: one(events, {
      fields: [restaurantRecommendations.eventId],
      references: [events.id],
    }),
  })
)

export const paymentRequestsRelations = relations(
  paymentRequests,
  ({ one }) => ({
    event: one(events, {
      fields: [paymentRequests.eventId],
      references: [events.id],
    }),
    approver: one(users, {
      fields: [paymentRequests.approvedBy],
      references: [users.id],
    }),
  })
)

// Type exports for use throughout the app
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Event = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert

export type SurveyResponse = typeof surveyResponses.$inferSelect
export type NewSurveyResponse = typeof surveyResponses.$inferInsert

export type Letter = typeof letters.$inferSelect
export type NewLetter = typeof letters.$inferInsert

export type RestaurantRecommendation =
  typeof restaurantRecommendations.$inferSelect
export type NewRestaurantRecommendation =
  typeof restaurantRecommendations.$inferInsert

export type PaymentRequest = typeof paymentRequests.$inferSelect
export type NewPaymentRequest = typeof paymentRequests.$inferInsert

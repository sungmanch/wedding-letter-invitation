import { pgTable, foreignKey, uuid, varchar, integer, jsonb, timestamp, text, boolean, index, pgPolicy, date, time, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const restaurantRecommendations = pgTable("restaurant_recommendations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	name: varchar({ length: 100 }).notNull(),
	category: varchar({ length: 50 }),
	location: varchar({ length: 255 }),
	priceRange: varchar("price_range", { length: 50 }),
	imageUrl: varchar("image_url", { length: 500 }),
	matchScore: integer("match_score"),
	matchReasons: jsonb("match_reasons"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	mapUrl: varchar("map_url", { length: 500 }),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "restaurant_recommendations_event_id_events_id_fk"
		}).onDelete("cascade"),
]);

export const letters = pgTable("letters", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	surveyResponseId: uuid("survey_response_id"),
	guestName: varchar("guest_name", { length: 100 }).notNull(),
	content: text(),
	stickers: jsonb(),
	isRead: boolean("is_read").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "letters_event_id_events_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.surveyResponseId],
			foreignColumns: [surveyResponses.id],
			name: "letters_survey_response_id_survey_responses_id_fk"
		}),
]);

export const surveyResponses = pgTable("survey_responses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	guestName: varchar("guest_name", { length: 100 }).notNull(),
	foodTypes: jsonb("food_types"),
	atmospheres: jsonb(),
	dietaryRestriction: varchar("dietary_restriction", { length: 50 }),
	allergyInfo: varchar("allergy_info", { length: 255 }),
	dislikedFoods: text("disliked_foods"),
	preferredLocation: varchar("preferred_location", { length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "survey_responses_event_id_events_id_fk"
		}).onDelete("cascade"),
]);

export const paymentRequests = pgTable("payment_requests", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	status: varchar({ length: 20 }).default('pending').notNull(),
	requestedAt: timestamp("requested_at", { mode: 'string' }).defaultNow().notNull(),
	approvedAt: timestamp("approved_at", { mode: 'string' }),
	approvedBy: uuid("approved_by"),
	userId: uuid("user_id").notNull(),
	amount: integer().default(9900).notNull(),
	depositName: varchar("deposit_name", { length: 100 }),
	depositAt: timestamp("deposit_at", { mode: 'string' }),
	notificationSent: boolean("notification_sent").default(false).notNull(),
});

export const invitationDesigns = pgTable("invitation_designs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	invitationId: uuid("invitation_id").notNull(),
	designData: jsonb("design_data").notNull(),
	generationBatch: integer("generation_batch").notNull(),
	isSelected: boolean("is_selected").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_invitation_designs_invitation_id").using("btree", table.invitationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.invitationId],
			foreignColumns: [invitations.id],
			name: "invitation_designs_invitation_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Users can manage designs of their invitations", { as: "permissive", for: "all", to: ["public"], using: sql`(invitation_id IN ( SELECT invitations.id
   FROM invitations
  WHERE (invitations.user_id = auth.uid())))`, withCheck: sql`(invitation_id IN ( SELECT invitations.id
   FROM invitations
  WHERE (invitations.user_id = auth.uid())))`  }),
	pgPolicy("Anyone can view designs of published invitations", { as: "permissive", for: "select", to: ["public"] }),
]);

export const invitationMessages = pgTable("invitation_messages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	invitationId: uuid("invitation_id").notNull(),
	guestName: varchar("guest_name", { length: 50 }).notNull(),
	content: text().notNull(),
	isRead: boolean("is_read").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_invitation_messages_invitation_id").using("btree", table.invitationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.invitationId],
			foreignColumns: [invitations.id],
			name: "invitation_messages_invitation_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Anyone can create messages", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`true`  }),
	pgPolicy("Owners can view messages", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Owners can update messages", { as: "permissive", for: "update", to: ["public"] }),
]);

export const invitationPayments = pgTable("invitation_payments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	polarCheckoutId: varchar("polar_checkout_id", { length: 100 }),
	polarOrderId: varchar("polar_order_id", { length: 100 }),
	amount: integer().notNull(),
	status: varchar({ length: 20 }).default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
}, (table) => [
	index("idx_invitation_payments_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	pgPolicy("Users can manage their own payments", { as: "permissive", for: "all", to: ["public"], using: sql`(auth.uid() = user_id)`, withCheck: sql`(auth.uid() = user_id)`  }),
]);

export const invitationPhotos = pgTable("invitation_photos", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	invitationId: uuid("invitation_id").notNull(),
	storagePath: varchar("storage_path", { length: 500 }).notNull(),
	url: varchar({ length: 500 }).notNull(),
	displayOrder: integer("display_order").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_invitation_photos_invitation_id").using("btree", table.invitationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.invitationId],
			foreignColumns: [invitations.id],
			name: "invitation_photos_invitation_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Users can manage photos of their invitations", { as: "permissive", for: "all", to: ["public"], using: sql`(invitation_id IN ( SELECT invitations.id
   FROM invitations
  WHERE (invitations.user_id = auth.uid())))`, withCheck: sql`(invitation_id IN ( SELECT invitations.id
   FROM invitations
  WHERE (invitations.user_id = auth.uid())))`  }),
	pgPolicy("Anyone can view photos of published invitations", { as: "permissive", for: "select", to: ["public"] }),
]);

export const invitations = pgTable("invitations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	groomName: varchar("groom_name", { length: 50 }).notNull(),
	brideName: varchar("bride_name", { length: 50 }).notNull(),
	groomFatherName: varchar("groom_father_name", { length: 50 }),
	groomMotherName: varchar("groom_mother_name", { length: 50 }),
	brideFatherName: varchar("bride_father_name", { length: 50 }),
	brideMotherName: varchar("bride_mother_name", { length: 50 }),
	weddingDate: date("wedding_date").notNull(),
	weddingTime: time("wedding_time").notNull(),
	venueName: varchar("venue_name", { length: 100 }).notNull(),
	venueAddress: varchar("venue_address", { length: 255 }).notNull(),
	venueDetail: varchar("venue_detail", { length: 100 }),
	venueMapUrl: varchar("venue_map_url", { length: 500 }),
	groomPhone: varchar("groom_phone", { length: 20 }),
	bridePhone: varchar("bride_phone", { length: 20 }),
	groomFatherPhone: varchar("groom_father_phone", { length: 20 }),
	groomMotherPhone: varchar("groom_mother_phone", { length: 20 }),
	brideFatherPhone: varchar("bride_father_phone", { length: 20 }),
	brideMotherPhone: varchar("bride_mother_phone", { length: 20 }),
	groomBank: varchar("groom_bank", { length: 50 }),
	groomAccount: varchar("groom_account", { length: 50 }),
	groomAccountHolder: varchar("groom_account_holder", { length: 50 }),
	brideBank: varchar("bride_bank", { length: 50 }),
	brideAccount: varchar("bride_account", { length: 50 }),
	brideAccountHolder: varchar("bride_account_holder", { length: 50 }),
	stylePrompt: text("style_prompt"),
	selectedDesignId: uuid("selected_design_id"),
	status: varchar({ length: 20 }).default('draft').notNull(),
	isPaid: boolean("is_paid").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	templateId: uuid("template_id"),
	isTemplateReuse: boolean("is_template_reuse").default(false),
	publishedUrl: varchar("published_url", { length: 500 }),
	paymentId: uuid("payment_id"),
	editorType: varchar("editor_type", { length: 20 }).default('legacy'),
}, (table) => [
	index("idx_invitations_payment_id").using("btree", table.paymentId.asc().nullsLast().op("uuid_ops")),
	index("idx_invitations_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("idx_invitations_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	pgPolicy("Users can manage their own invitations", { as: "permissive", for: "all", to: ["public"], using: sql`(auth.uid() = user_id)`, withCheck: sql`(auth.uid() = user_id)`  }),
	pgPolicy("Anyone can view published invitations", { as: "permissive", for: "select", to: ["public"] }),
]);

export const designTemplates = pgTable("design_templates", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	name: varchar({ length: 100 }),
	description: text(),
	source: varchar({ length: 20 }).notNull(),
	templateData: jsonb("template_data").notNull(),
	generationContext: jsonb("generation_context"),
	curation: jsonb(),
	thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
	isPublic: boolean("is_public").default(false).notNull(),
	status: varchar({ length: 20 }).default('draft').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_templates_source").using("btree", table.source.asc().nullsLast().op("text_ops")),
	index("idx_templates_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("idx_templates_user").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
]);

export const editorSnapshotsV2 = pgTable("editor_snapshots_v2", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	documentId: uuid("document_id").notNull(),
	snapshotNumber: integer("snapshot_number").notNull(),
	type: varchar({ length: 20 }).notNull(),
	description: varchar({ length: 200 }),
	snapshot: jsonb().notNull(),
	aiPrompt: text("ai_prompt"),
	aiResponse: jsonb("ai_response"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_editor_snapshots_v2_doc").using("btree", table.documentId.asc().nullsLast().op("uuid_ops")),
	index("idx_editor_snapshots_v2_number").using("btree", table.documentId.asc().nullsLast().op("int4_ops"), table.snapshotNumber.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [editorDocumentsV2.id],
			name: "editor_snapshots_v2_document_id_editor_documents_v2_id_fk"
		}).onDelete("cascade"),
]);

export const rsvpResponsesV2 = pgTable("rsvp_responses_v2", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	documentId: uuid("document_id").notNull(),
	name: varchar({ length: 50 }).notNull(),
	phone: varchar({ length: 20 }),
	attending: boolean().notNull(),
	guestCount: integer("guest_count").default(1),
	mealOption: varchar("meal_option", { length: 50 }),
	note: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	side: varchar({ length: 10 }),
	busRequired: boolean("bus_required"),
	privacyAgreed: boolean("privacy_agreed").default(false).notNull(),
}, (table) => [
	index("idx_rsvp_v2_doc").using("btree", table.documentId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [editorDocumentsV2.id],
			name: "rsvp_responses_v2_document_id_editor_documents_v2_id_fk"
		}).onDelete("cascade"),
]);

export const events = pgTable("events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	groupName: varchar("group_name", { length: 100 }).notNull(),
	expectedMembers: varchar("expected_members", { length: 20 }),
	preferredLocation: varchar("preferred_location", { length: 100 }),
	budgetRange: varchar("budget_range", { length: 50 }),
	surveyUrl: varchar("survey_url", { length: 255 }),
	status: varchar({ length: 20 }).default('collecting').notNull(),
	letterUnlockAt: timestamp("letter_unlock_at", { mode: 'string' }),
	letterUnlocked: boolean("letter_unlocked").default(false).notNull(),
	selectedRestaurantId: uuid("selected_restaurant_id"),
	meetingDate: timestamp("meeting_date", { mode: 'string' }),
	meetingTime: varchar("meeting_time", { length: 10 }),
	additionalMessage: text("additional_message"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("events_survey_url_unique").on(table.surveyUrl),
]);

export const editorDocumentsV2 = pgTable("editor_documents_v2", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	title: varchar({ length: 200 }).default('새 청첩장').notNull(),
	blocks: jsonb().default([]).notNull(),
	style: jsonb().notNull(),
	animation: jsonb().default({}),
	data: jsonb().notNull(),
	buildResult: jsonb("build_result"),
	publishedUrl: varchar("published_url", { length: 500 }),
	ogTitle: varchar("og_title", { length: 100 }),
	ogDescription: varchar("og_description", { length: 200 }),
	ogImageUrl: varchar("og_image_url", { length: 500 }),
	status: varchar({ length: 20 }).default('draft').notNull(),
	errorMessage: text("error_message"),
	isPaid: boolean("is_paid").default(false).notNull(),
	paymentId: uuid("payment_id"),
	slug: varchar({ length: 100 }),
	isPublic: boolean("is_public").default(true).notNull(),
	password: varchar({ length: 100 }),
	viewCount: integer("view_count").default(0).notNull(),
	documentVersion: integer("document_version").default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	publishedAt: timestamp("published_at", { mode: 'string' }),
}, (table) => [
	index("idx_editor_docs_v2_is_public").using("btree", table.isPublic.asc().nullsLast().op("bool_ops")),
	index("idx_editor_docs_v2_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("idx_editor_docs_v2_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("idx_editor_docs_v2_user").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
]);

export const editorAssetsV2 = pgTable("editor_assets_v2", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	documentId: uuid("document_id").notNull(),
	type: varchar({ length: 20 }).notNull(),
	originalName: varchar("original_name", { length: 255 }).notNull(),
	mimeType: varchar("mime_type", { length: 100 }).notNull(),
	size: integer().notNull(),
	url: varchar({ length: 500 }).notNull(),
	thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
	width: integer(),
	height: integer(),
	usedIn: jsonb("used_in").default([]),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_editor_assets_v2_doc").using("btree", table.documentId.asc().nullsLast().op("uuid_ops")),
	index("idx_editor_assets_v2_type").using("btree", table.type.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [editorDocumentsV2.id],
			name: "editor_assets_v2_document_id_editor_documents_v2_id_fk"
		}).onDelete("cascade"),
]);

export const guestbookMessagesV2 = pgTable("guestbook_messages_v2", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	documentId: uuid("document_id").notNull(),
	cookieId: varchar("cookie_id", { length: 100 }).notNull(),
	name: varchar({ length: 50 }).notNull(),
	message: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_guestbook_v2_cookie").using("btree", table.cookieId.asc().nullsLast().op("text_ops")),
	index("idx_guestbook_v2_doc").using("btree", table.documentId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [editorDocumentsV2.id],
			name: "guestbook_messages_v2_document_id_editor_documents_v2_id_fk"
		}).onDelete("cascade"),
]);

export const aiEditLogsV2 = pgTable("ai_edit_logs_v2", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	documentId: uuid("document_id").notNull(),
	userId: uuid("user_id").notNull(),
	prompt: text().notNull(),
	targetBlockId: text("target_block_id"),
	context: jsonb(),
	patches: jsonb(),
	explanation: text(),
	success: boolean().notNull(),
	errorMessage: text("error_message"),
	snapshotId: uuid("snapshot_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_ai_edit_logs_v2_created").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_ai_edit_logs_v2_doc").using("btree", table.documentId.asc().nullsLast().op("uuid_ops")),
	index("idx_ai_edit_logs_v2_success").using("btree", table.success.asc().nullsLast().op("bool_ops")),
	index("idx_ai_edit_logs_v2_user").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [editorDocumentsV2.id],
			name: "ai_edit_logs_v2_document_id_editor_documents_v2_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.snapshotId],
			foreignColumns: [editorSnapshotsV2.id],
			name: "ai_edit_logs_v2_snapshot_id_editor_snapshots_v2_id_fk"
		}).onDelete("set null"),
]);

export const paperInvitationRequests = pgTable("paper_invitation_requests", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	email: varchar({ length: 255 }),
	phone: varchar({ length: 20 }).notNull(),
	status: varchar({ length: 20 }).default('pending').notNull(),
	mainPhotoPath: varchar("main_photo_path", { length: 500 }),
	notes: text(),
	estimatedCompletionDate: timestamp("estimated_completion_date", { mode: 'string' }),
	completedDocumentId: uuid("completed_document_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_paper_invitation_requests_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("idx_paper_invitation_requests_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("idx_paper_invitation_requests_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	pgPolicy("Users can manage their own paper invitation requests", { as: "permissive", for: "all", to: ["public"] }),
]);

export const paperInvitationPhotos = pgTable("paper_invitation_photos", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	requestId: uuid("request_id").notNull(),
	storagePath: varchar("storage_path", { length: 500 }).notNull(),
	url: varchar({ length: 500 }).notNull(),
	displayOrder: integer("display_order").notNull(),
	isMain: boolean("is_main").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_paper_invitation_photos_request_id").using("btree", table.requestId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.requestId],
			foreignColumns: [paperInvitationRequests.id],
			name: "paper_invitation_photos_request_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Users can manage photos of their paper invitation requests", { as: "permissive", for: "all", to: ["public"] }),
]);

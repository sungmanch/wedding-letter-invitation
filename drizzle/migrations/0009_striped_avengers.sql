CREATE TABLE "editor_assets_v2" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"type" varchar(20) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"url" varchar(500) NOT NULL,
	"thumbnail_url" varchar(500),
	"width" integer,
	"height" integer,
	"used_in" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "editor_assets_v2" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "editor_documents_v2" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(200) DEFAULT '새 청첩장' NOT NULL,
	"blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"style" jsonb NOT NULL,
	"animation" jsonb DEFAULT '{}'::jsonb,
	"data" jsonb NOT NULL,
	"build_result" jsonb,
	"published_url" varchar(500),
	"og_title" varchar(100),
	"og_description" varchar(200),
	"og_image_url" varchar(500),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"error_message" text,
	"is_paid" boolean DEFAULT false NOT NULL,
	"payment_id" uuid,
	"slug" varchar(100),
	"is_public" boolean DEFAULT true NOT NULL,
	"password" varchar(100),
	"view_count" integer DEFAULT 0 NOT NULL,
	"document_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "editor_documents_v2" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "editor_snapshots_v2" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"snapshot_number" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"description" varchar(200),
	"snapshot" jsonb NOT NULL,
	"ai_prompt" text,
	"ai_response" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "editor_snapshots_v2" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "guestbook_messages_v2" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"cookie_id" varchar(100) NOT NULL,
	"name" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "guestbook_messages_v2" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rsvp_responses_v2" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"phone" varchar(20),
	"attending" boolean NOT NULL,
	"guest_count" integer DEFAULT 1,
	"meal_option" varchar(50),
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rsvp_responses_v2" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "editor_assets_v2" ADD CONSTRAINT "editor_assets_v2_document_id_editor_documents_v2_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."editor_documents_v2"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor_snapshots_v2" ADD CONSTRAINT "editor_snapshots_v2_document_id_editor_documents_v2_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."editor_documents_v2"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guestbook_messages_v2" ADD CONSTRAINT "guestbook_messages_v2_document_id_editor_documents_v2_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."editor_documents_v2"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rsvp_responses_v2" ADD CONSTRAINT "rsvp_responses_v2_document_id_editor_documents_v2_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."editor_documents_v2"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_editor_assets_v2_doc" ON "editor_assets_v2" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "idx_editor_assets_v2_type" ON "editor_assets_v2" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_editor_docs_v2_user" ON "editor_documents_v2" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_editor_docs_v2_status" ON "editor_documents_v2" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_editor_docs_v2_slug" ON "editor_documents_v2" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_editor_docs_v2_is_public" ON "editor_documents_v2" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "idx_editor_snapshots_v2_doc" ON "editor_snapshots_v2" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "idx_editor_snapshots_v2_number" ON "editor_snapshots_v2" USING btree ("document_id","snapshot_number");--> statement-breakpoint
CREATE INDEX "idx_guestbook_v2_doc" ON "guestbook_messages_v2" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "idx_guestbook_v2_cookie" ON "guestbook_messages_v2" USING btree ("cookie_id");--> statement-breakpoint
CREATE INDEX "idx_rsvp_v2_doc" ON "rsvp_responses_v2" USING btree ("document_id");